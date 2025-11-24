import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const pain_screening = pgTable('pain_screening', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  patient_screened: varchar('patient_screened', { length: 255 }),
  date_of_first_pain: varchar('date_of_first_pain', { length: 255 }),
  pain_severity: varchar('pain_severity', { length: 255 }),
  standardized_tool_pain_used: varchar('standardized_tool_pain_used', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});