import { db } from '../config/db.drizzle.js';
import { audit_logs } from '../db/schemas/auditLog.schema.js';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

class AuditService {
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
      const countResult = await db.select({ count: db.fn.count() }).from(audit_logs).where(and(...conditions));
      const count = countResult[0].count;
      
      return {
        data: rows,
        total: count,
        page,
        pages: Math.ceil(count / limit)
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
   * @param {string} action - Action type (CREATE, UPDATE, DELETE)
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
      const result = await db.select().from(audit_logs).where(eq(audit_logs.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch audit log: ${error.message}`);
    }
  }
  
  /**
   * Create a custom audit log entry
   * @param {Object} data - Audit log data
   * @returns {Object} Created audit log
   */
  async createAuditLog(data) {
    try {
      const result = await db.insert(audit_logs).values(data).returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create audit log: ${error.message}`);
    }
  }
}

export default new AuditService();