import { pgTable, primaryKey, bigint, varchar } from 'drizzle-orm/pg-core';
import { roles } from './role.schema.js';

export const model_has_roles = pgTable('model_has_roles', {
  role_id: bigint('role_id', { mode: 'number' }).notNull(),
  model_type: varchar('model_type', { length: 255 }).notNull(),
  model_id: bigint('model_id', { mode: 'number' }).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.role_id, table.model_type, table.model_id] }),
  };
});