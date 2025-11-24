import { db } from '../config/db.drizzle.js';
import { audit_logs } from '../db/schemas/auditLog.schema.js';

// Audit middleware
export const audit = (action, tableName) => {
  return async (request, reply) => {
    // Store audit information for later use
    request.audit = {
      action,
      tableName
    };
  };
};

// Model hook for automatic audit logging (placeholder for Drizzle)
export const addAuditHooks = (model, modelName) => {
  // In Drizzle, we would implement audit logging differently
  // This is a placeholder to maintain compatibility
  console.log(`Audit hooks would be added for ${modelName} (Drizzle implementation)`);
};

// Export audit logs schema reference
export { audit_logs };