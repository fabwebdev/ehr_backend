import { getAuditLogs, getUserAuditLogs, getAuditLogById } from '../controllers/Audit.controller.js';
import { authenticate } from '../middleware/betterAuth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { ROLES } from '../config/rbac.js';

// Fastify plugin for audit routes
async function auditRoutes(fastify, options) {
  // Admin routes for audit logs
  fastify.get('/', {
    preHandler: [authenticate, requireRole(ROLES.ADMIN)],
  }, getAuditLogs);
  
  fastify.get('/:id', {
    preHandler: [authenticate, requireRole(ROLES.ADMIN)],
  }, getAuditLogById);

  // User route to get their own audit logs
  fastify.get('/user/logs', {
    preHandler: [authenticate],
  }, getUserAuditLogs);
}

export default auditRoutes;
