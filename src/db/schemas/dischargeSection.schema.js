import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const discharge_sections = pgTable('discharge_sections', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  code: varchar('code', { length: 1 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});