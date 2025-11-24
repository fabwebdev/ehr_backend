import { pgTable, bigint, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user.schema.js';

export const audit_logs = pgTable('audit_logs', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  user_id: bigint('user_id', { mode: 'number' }).references(() => users.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  action: varchar('action', { length: 255 }).notNull(),
  table_name: varchar('table_name', { length: 255 }).notNull(),
  record_id: bigint('record_id', { mode: 'number' }),
  old_value: text('old_value'),
  new_value: text('new_value'),
  ip_address: varchar('ip_address', { length: 255 }),
  user_agent: varchar('user_agent', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});