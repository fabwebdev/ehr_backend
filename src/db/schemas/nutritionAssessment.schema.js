import { pgTable, bigint, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { patients } from './patient.schema.js';

export const nutrition_assessment = pgTable('nutrition_assessment', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull().references(() => patients.id),
  nutrition_problems_type_ids: varchar('nutrition_problems_type_ids', { length: 255 }).notNull(),
  nutrition_template_ids: varchar('nutrition_template_ids', { length: 255 }).notNull(),
  comments: text('comments'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});