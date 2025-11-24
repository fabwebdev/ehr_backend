import AuditService from '../services/AuditService.js';
import { authenticate } from '../middleware/betterAuth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { ROLES } from '../config/rbac.js';

/**
 * Get audit logs
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
export const getAuditLogs = async (request, reply) => {
  try {
    const { page = 1, limit = 20, userId, action, tableName, startDate, endDate } = request.query;
    
    const filters = {};
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (tableName) filters.tableName = tableName;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    
    const result = await AuditService.getAuditLogs(filters, parseInt(page), parseInt(limit));
    
    return {
      status: 200,
      data: result
    };
  } catch (error) {
    console.error('Get audit logs error:', error);
    reply.code(500);
            return {
      status: 500,
      message: 'Server error while fetching audit logs'
    };
  }
};

/**
 * Get audit logs for current user
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
export const getUserAuditLogs = async (request, reply) => {
  try {
    const { page = 1, limit = 20 } = request.query;
    
    const result = await AuditService.getUserAuditLogs(request.user.id, parseInt(page), parseInt(limit));
    
    return {
      status: 200,
      data: result
    };
  } catch (error) {
    console.error('Get user audit logs error:', error);
    reply.code(500);
            return {
      status: 500,
      message: 'Server error while fetching user audit logs'
    };
  }
};

/**
 * Get audit log by ID
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
export const getAuditLogById = async (request, reply) => {
  try {
    const { id } = request.params;
    
    const auditLog = await AuditService.getAuditLogById(id);
    
    if (!auditLog) {
      reply.code(404);
            return {
        status: 404,
        message: 'Audit log not found'
      };
    }
    
    return {
      status: 200,
      data: {
        auditLog
      }
    };
  } catch (error) {
    console.error('Get audit log by ID error:', error);
    reply.code(500);
            return {
      status: 500,
      message: 'Server error while fetching audit log'
    };
  }
};
