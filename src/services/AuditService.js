import { db } from "../config/db.drizzle.js";
import { audit_logs } from "../db/schemas/auditLog.schema.js";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import axios from "axios";

class AuditService {
  constructor() {
    this.externalLoggers = [];
    this.initializeExternalLoggers();
  }

  /**
   * Initialize external log storage systems
   */
  initializeExternalLoggers() {
    console.log('🔍 Initializing external loggers...');
    
    // Splunk configuration
    if (process.env.SPLUNK_URL && process.env.SPLUNK_TOKEN) {
      this.externalLoggers.push({
        type: "splunk",
        url: process.env.SPLUNK_URL,
        token: process.env.SPLUNK_TOKEN,
        source: process.env.SPLUNK_SOURCE || "healthcare-api",
        sourcetype: process.env.SPLUNK_SOURCETYPE || "audit",
      });
    }

    // Elasticsearch configuration
    if (process.env.ELASTICSEARCH_URL && process.env.ELASTICSEARCH_INDEX) {
      const esConfig = {
        type: "elasticsearch",
        url: process.env.ELASTICSEARCH_URL,
        index: process.env.ELASTICSEARCH_INDEX,
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
        apiKey: process.env.ELASTICSEARCH_API_KEY, // Support for API key authentication
      };
      this.externalLoggers.push(esConfig);
      console.log('✅ Elasticsearch logger configured:', {
        url: esConfig.url,
        index: esConfig.index,
        hasApiKey: !!esConfig.apiKey,
        hasUsername: !!esConfig.username
      });
    } else {
      console.log('⚠️ Elasticsearch not configured - missing ELASTICSEARCH_URL or ELASTICSEARCH_INDEX');
    }

    // AWS CloudWatch configuration
    if (process.env.AWS_CLOUDWATCH_LOG_GROUP && process.env.AWS_REGION) {
      this.externalLoggers.push({
        type: "cloudwatch",
        logGroup: process.env.AWS_CLOUDWATCH_LOG_GROUP,
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
    }

    // Generic HTTP endpoint (for custom log managers)
    if (process.env.EXTERNAL_LOG_URL) {
      this.externalLoggers.push({
        type: "http",
        url: process.env.EXTERNAL_LOG_URL,
        token: process.env.EXTERNAL_LOG_TOKEN,
        headers: process.env.EXTERNAL_LOG_HEADERS
          ? JSON.parse(process.env.EXTERNAL_LOG_HEADERS)
          : {},
      });
    }
  }

  /**
   * Send audit log to external systems
   * @param {Object} auditData - Audit log data
   */
  async sendToExternalLoggers(auditData) {
    const promises = this.externalLoggers.map(async (logger) => {
      try {
        switch (logger.type) {
          case "splunk":
            await this.sendToSplunk(logger, auditData);
            break;
          case "elasticsearch":
            await this.sendToElasticsearch(logger, auditData);
            break;
          case "cloudwatch":
            await this.sendToCloudWatch(logger, auditData);
            break;
          case "http":
            await this.sendToHttp(logger, auditData);
            break;
        }
      } catch (error) {
        // Don't fail if external logging fails, but log detailed error
        console.error(
          `❌ Failed to send audit log to ${logger.type}:`,
          error.message
        );
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
        if (error.request) {
          console.error('Request URL:', error.config?.url);
          console.error('Request config:', {
            method: error.config?.method,
            headers: error.config?.headers ? Object.keys(error.config.headers) : 'none'
          });
        }
      }
    });

    // Execute all external loggers in parallel (don't wait for them)
    Promise.allSettled(promises).catch(() => {
      // Silently handle errors - external logging should not break the application
    });
  }

  /**
   * Send audit log to Splunk
   */
  async sendToSplunk(logger, auditData) {
    const splunkEvent = {
      time: Math.floor(new Date(auditData.createdAt).getTime() / 1000),
      source: logger.source,
      sourcetype: logger.sourcetype,
      event: {
        type: "audit",
        action: auditData.action,
        table_name: auditData.table_name,
        record_id: auditData.record_id,
        user_id: auditData.user_id,
        ip_address: auditData.ip_address,
        user_agent: auditData.user_agent,
        timestamp: auditData.createdAt,
        // Note: old_value and new_value are intentionally excluded (no health data)
      },
    };

    await axios.post(
      `${logger.url}/services/collector/event`,
      JSON.stringify(splunkEvent),
      {
        headers: {
          Authorization: `Splunk ${logger.token}`,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );
  }

  /**
   * Send audit log to Elasticsearch
   */
  async sendToElasticsearch(logger, auditData) {
    const esDocument = {
      "@timestamp": auditData.createdAt,
      type: "audit",
      action: auditData.action,
      table_name: auditData.table_name,
      record_id: auditData.record_id,
      user_id: auditData.user_id,
      user_name: auditData.user_name,
      user_email: auditData.user_email,
      ip_address: auditData.ip_address,
      user_agent: auditData.user_agent,
      // Note: old_value and new_value are intentionally excluded (no health data)
    };

    // Remove port from URL if present (Elastic Cloud uses different endpoints)
    let baseUrl = logger.url;
    if (baseUrl.includes(':9243')) {
      baseUrl = baseUrl.replace(':9243', '');
    }
    
    const url = `${baseUrl}/${logger.index}/_doc`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000, // Increased timeout to 15 seconds
    };

    // Use API key if provided (preferred for Elastic Cloud)
    if (logger.apiKey) {
      config.headers["Authorization"] = `ApiKey ${logger.apiKey}`;
    } else if (logger.username && logger.password) {
      // Fallback to username/password
      config.auth = {
        username: logger.username,
        password: logger.password,
      };
    }

    try {
      const response = await axios.post(url, esDocument, config);
      console.log('✅ Audit log sent to Elasticsearch successfully:', {
        index: logger.index,
        documentId: response.data?._id,
        status: response.status
      });
      return response;
    } catch (error) {
      // Log more details for debugging
      console.error('❌ Elasticsearch error details:', {
        url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data,
        requestConfig: {
          method: 'POST',
          hasAuth: !!config.headers?.Authorization,
          timeout: config.timeout
        }
      });
      throw error;
    }
  }

  /**
   * Send audit log to AWS CloudWatch
   */
  async sendToCloudWatch(logger, auditData) {
    // CloudWatch requires AWS SDK - this is a placeholder
    // In production, you would use @aws-sdk/client-cloudwatch-logs
    const logMessage = JSON.stringify({
      type: "audit",
      action: auditData.action,
      table_name: auditData.table_name,
      record_id: auditData.record_id,
      user_id: auditData.user_id,
      ip_address: auditData.ip_address,
      user_agent: auditData.user_agent,
      timestamp: auditData.createdAt,
    });

    // For now, log to console - in production, implement AWS SDK
    console.log(`[CloudWatch] ${logger.logGroup}: ${logMessage}`);
  }

  /**
   * Send audit log to generic HTTP endpoint
   */
  async sendToHttp(logger, auditData) {
    const payload = {
      type: "audit",
      action: auditData.action,
      table_name: auditData.table_name,
      record_id: auditData.record_id,
      user_id: auditData.user_id,
      ip_address: auditData.ip_address,
      user_agent: auditData.user_agent,
      timestamp: auditData.createdAt,
    };

    const headers = {
      "Content-Type": "application/json",
      ...logger.headers,
    };

    if (logger.token) {
      headers["Authorization"] = `Bearer ${logger.token}`;
    }

    await axios.post(logger.url, payload, {
      headers,
      timeout: 5000,
    });
  }

  /**
   * Get audit logs with optional filters
   * @param {Object} filters - Filter options
   * @param {number} page - Page number
   * @param {number} limit - Number of records per page
   * @returns {Object} Paginated audit logs
   */
  async getAuditLogs(filters = {}, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      // Build conditions
      const conditions = [];

      // Apply filters
      if (filters.userId) {
        conditions.push(eq(audit_logs.user_id, filters.userId));
      }

      if (filters.action) {
        conditions.push(eq(audit_logs.action, filters.action));
      }

      if (filters.tableName) {
        conditions.push(eq(audit_logs.table_name, filters.tableName));
      }

      if (filters.startDate) {
        conditions.push(gte(audit_logs.createdAt, new Date(filters.startDate)));
      }

      if (filters.endDate) {
        conditions.push(lte(audit_logs.createdAt, new Date(filters.endDate)));
      }

      // Build query
      let query = db.select().from(audit_logs);

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Add ordering and pagination
      const paginatedQuery = query
        .orderBy(desc(audit_logs.createdAt))
        .limit(limit)
        .offset(offset);

      // Execute query
      const rows = await paginatedQuery;

      // Get total count
      const countResult = await db
        .select({ count: db.fn.count() })
        .from(audit_logs)
        .where(and(...conditions));
      const count = countResult[0].count;

      return {
        data: rows,
        total: count,
        page,
        pages: Math.ceil(count / limit),
      };
    } catch (error) {
      throw new Error(`Failed to fetch audit logs: ${error.message}`);
    }
  }

  /**
   * Get audit logs for a specific user
   * @param {number} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Number of records per page
   * @returns {Object} Paginated audit logs for user
   */
  async getUserAuditLogs(userId, page = 1, limit = 20) {
    return await this.getAuditLogs({ userId }, page, limit);
  }

  /**
   * Get audit logs for a specific table
   * @param {string} tableName - Table name
   * @param {number} page - Page number
   * @param {number} limit - Number of records per page
   * @returns {Object} Paginated audit logs for table
   */
  async getTableAuditLogs(tableName, page = 1, limit = 20) {
    return await this.getAuditLogs({ tableName }, page, limit);
  }

  /**
   * Get audit logs for a specific action
   * @param {string} action - Action type (CREATE, UPDATE, DELETE, READ)
   * @param {number} page - Page number
   * @param {number} limit - Number of records per page
   * @returns {Object} Paginated audit logs for action
   */
  async getActionAuditLogs(action, page = 1, limit = 20) {
    return await this.getAuditLogs({ action }, page, limit);
  }

  /**
   * Get audit log by ID
   * @param {number} id - Audit log ID
   * @returns {Object} Audit log record
   */
  async getAuditLogById(id) {
    try {
      const result = await db
        .select()
        .from(audit_logs)
        .where(eq(audit_logs.id, id))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch audit log: ${error.message}`);
    }
  }

  /**
   * Create a custom audit log entry
   * Logs to database and external systems (if configured)
   * Does NOT log actual health data - only metadata
   *
   * @param {Object} data - Audit log data (should not contain health data)
   * @returns {Object} Created audit log
   */
  async createAuditLog(data, meta = {}) {
    try {
      // Ensure we never log actual health data
      const sanitizedData = {
        ...data,
        old_value: null, // Never log actual health data
        new_value: null, // Never log actual health data
      };

      // Insert into database
      const result = await db
        .insert(audit_logs)
        .values(sanitizedData)
        .returning();
      const auditLog = result[0];
      const externalPayload = {
        ...auditLog,
        ...meta,
      };

      // Send to external loggers (async, don't wait)
      this.sendToExternalLoggers(externalPayload).catch((err) => {
        console.error("External logging error:", err.message);
      });

      return auditLog;
    } catch (error) {
      throw new Error(`Failed to create audit log: ${error.message}`);
    }
  }
}

export default new AuditService();
