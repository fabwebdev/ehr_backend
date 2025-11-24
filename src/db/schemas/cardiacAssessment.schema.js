import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';
import { patients } from './patient.schema.js';

export const cardiac_assessment = pgTable('cardiac_assessment', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull().references(() => patients.id),
  cardiac_ids: varchar('cardiac_ids', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});