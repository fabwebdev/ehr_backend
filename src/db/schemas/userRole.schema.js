import { pgTable, primaryKey, bigint, text } from 'drizzle-orm/pg-core';
import { users } from './user.schema.js';
import { roles } from './role.schema.js';

export const user_has_roles = pgTable('user_has_roles', {
  user_id: text('user_id').notNull(),
  role_id: bigint('role_id', { mode: 'number' }).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.user_id, table.role_id] }),
  };
});