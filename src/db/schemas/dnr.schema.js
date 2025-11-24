import { pgTable, bigint, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const dnr = pgTable('dnr', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  dnr_status: varchar('dnr_status', { length: 255 }),
  dnr_date: varchar('dnr_date', { length: 255 }),
  dnr_notes: text('dnr_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});