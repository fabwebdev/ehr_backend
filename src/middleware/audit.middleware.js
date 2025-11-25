import AuditService from '../services/AuditService.js';

/**
 * Audit middleware factory
 * Creates middleware that logs health data operations without logging actual health data
 * 
 * @param {string} action - Action type: 'CREATE', 'READ', 'UPDATE', 'DELETE'
 * @param {string} tableName - Table/resource name (e.g., 'patients', 'discharge')
 * @returns {Function} Fastify middleware function
 */
export const audit = (action, tableName) => {
  return async (request, reply) => {
    // Store audit information for later use
    request.audit = {
      action,
      tableName,
      timestamp: new Date()
    };
  };
};

/**
 * Post-handler middleware to log audit after operation completes
 * This should be used as onResponse hook
 */
export const auditLogHandler = async (request, reply) => {
  // Only log if audit info was set and operation was successful
  if (!request.audit || reply.statusCode >= 400) {
    return;
  }

  try {
    const userId = request.user?.id || null;
    const recordId = request.params?.id || request.body?.id || null;
    
    // Extract IP address
    const ipAddress = request.ip || 
                     request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     request.headers['x-real-ip'] ||
                     request.socket?.remoteAddress ||
                     'unknown';
    
    // Extract user agent
    const userAgent = request.headers['user-agent'] || 'unknown';
    
    // Prepare audit log data - DO NOT include actual health data
    const userName =
      [request.user?.firstName, request.user?.lastName].filter(Boolean).join(" ").trim() ||
      request.user?.name ||
      request.user?.fullName ||
      request.user?.email ||
      null;

    const auditData = {
      user_id: userId,
      action: request.audit.action,
      table_name: request.audit.tableName,
      record_id: recordId ? parseInt(recordId) : null,
      old_value: null, // Never log actual health data
      new_value: null, // Never log actual health data
      ip_address: ipAddress,
      user_agent: userAgent,
      createdAt: request.audit.timestamp || new Date(),
      updatedAt: new Date()
    };

    // Log to database
    await AuditService.createAuditLog(auditData, {
      user_name: userName,
      user_email: request.user?.email || null,
    });
    
    // Also log via Pino (for external systems)
    if (request.log) {
      request.log.info({
        type: 'audit',
        ...auditData
      }, `Health data ${request.audit.action} on ${request.audit.tableName}`);
    }
  } catch (error) {
    // Don't fail the request if audit logging fails, but log the error
    console.error('Audit logging error:', error);
    if (request.log) {
      request.log.error({ err: error }, 'Failed to create audit log');
    }
  }
};

/**
 * Helper function to log audit from controllers
 * Use this when you need more control over what gets logged
 * 
 * @param {Object} request - Fastify request object
 * @param {string} action - Action type: 'CREATE', 'READ', 'UPDATE', 'DELETE'
 * @param {string} tableName - Table/resource name
 * @param {number|null} recordId - Record ID (optional)
 */
export const logAudit = async (request, action, tableName, recordId = null) => {
  try {
    const userId = request.user?.id || null;
    const userName =
      [request.user?.firstName, request.user?.lastName].filter(Boolean).join(" ").trim() ||
      request.user?.name ||
      request.user?.fullName ||
      request.user?.email ||
      null;
    
    const ipAddress = request.ip || 
                     request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     request.headers['x-real-ip'] ||
                     request.socket?.remoteAddress ||
                     'unknown';
    
    const userAgent = request.headers['user-agent'] || 'unknown';
    
    const auditData = {
      user_id: userId,
      action,
      table_name: tableName,
      record_id: recordId ? parseInt(recordId) : null,
      old_value: null, // Never log actual health data
      new_value: null, // Never log actual health data
      ip_address: ipAddress,
      user_agent: userAgent,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await AuditService.createAuditLog(auditData, {
      user_name: userName,
      user_email: request.user?.email || null,
    });
    
    if (request.log) {
      request.log.info({
        type: 'audit',
        ...auditData
      }, `Health data ${action} on ${tableName}`);
    }
  } catch (error) {
    console.error('Audit logging error:', error);
    if (request.log) {
      request.log.error({ err: error }, 'Failed to create audit log');
    }
  }
};

// Model hook for automatic audit logging (placeholder for Drizzle)
export const addAuditHooks = (model, modelName) => {
  // In Drizzle, we would implement audit logging differently
  // This is a placeholder to maintain compatibility
  console.log(`Audit hooks would be added for ${modelName} (Drizzle implementation)`);
};

// Export audit logs schema reference
export { audit_logs } from '../db/schemas/auditLog.schema.js';