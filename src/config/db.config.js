import { db } from './db.drizzle.js';
import { audit_logs } from '../db/schemas/auditLog.schema.js';
import { eq, and, gte, lte } from 'drizzle-orm';

// Audit log functions for Drizzle
const AuditLog = {
  // Find all audit logs with optional filtering
  async findAndCountAll(options = {}) {
    const { where = {}, order = [], limit, offset } = options;
    
    // Build conditions
    const conditions = [];
    
    if (where.user_id) {
      conditions.push(eq(audit_logs.user_id, where.user_id));
    }
    
    if (where.action) {
      conditions.push(eq(audit_logs.action, where.action));
    }
    
    if (where.table_name) {
      conditions.push(eq(audit_logs.table_name, where.table_name));
    }
    
    if (where.created_at) {
      if (where.created_at[gte]) {
        conditions.push(gte(audit_logs.createdAt, where.created_at[gte]));
      }
      if (where.created_at[lte]) {
        conditions.push(lte(audit_logs.createdAt, where.created_at[lte]));
      }
    }
    
    // Build query
    let query = db.select().from(audit_logs);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Add ordering
    if (order.length > 0) {
      const [field, direction] = order[0];
      if (field === 'created_at') {
        query = direction === 'DESC' ? query.orderBy(audit_logs.createdAt) : query.orderBy(audit_logs.createdAt);
      }
    }
    
    // Add pagination
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.offset(offset);
    }
    
    // Execute query
    const rows = await query;
    const count = await db.select({ count: db.fn.count() }).from(audit_logs).where(and(...conditions));
    
    return {
      count: count[0].count,
      rows
    };
  },
  
  // Find by primary key
  async findByPk(id) {
    const result = await db.select().from(audit_logs).where(eq(audit_logs.id, id)).limit(1);
    return result[0] || null;
  },
  
  // Create new audit log
  async create(data) {
    const result = await db.insert(audit_logs).values(data).returning();
    return result[0];
  },
  
  // Sync table (create if not exists)
  async sync() {
    // In Drizzle, tables are created via migrations, not sync
    // This is a placeholder to maintain compatibility
    console.log('Audit log table sync called (Drizzle uses migrations instead)');
  }
};

// Initialize audit logging
const initializeAudit = async () => {
  try {
    await AuditLog.sync();
    console.log('Audit log table initialized');
  } catch (error) {
    console.error('Error initializing audit log table:', error);
  }
};

// Call initialization
initializeAudit();

// Export Drizzle instance and AuditLog model
export { db, AuditLog };
export default db;