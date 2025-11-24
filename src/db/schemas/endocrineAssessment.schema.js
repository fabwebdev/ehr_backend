import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';
import { patients } from './patient.schema.js';

export const endocrine_assessment = pgTable('endocrine_assessment', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull().references(() => patients.id),
  endocrine_ids: varchar('endocrine_ids', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});