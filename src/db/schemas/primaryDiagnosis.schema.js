import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const primary_diagnosis = pgTable('primary_diagnosis', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  diagnosis_code: varchar('diagnosis_code', { length: 255 }),
  diagnosis_description: varchar('diagnosis_description', { length: 255 }),
  diagnosis_date: varchar('diagnosis_date', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});