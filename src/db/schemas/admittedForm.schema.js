import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const admitted_form = pgTable('admitted_form', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});