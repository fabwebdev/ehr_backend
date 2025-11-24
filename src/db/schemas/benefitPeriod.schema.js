import { pgTable, bigint, integer, timestamp } from 'drizzle-orm/pg-core';

export const benefit_periods = pgTable('benefit_periods', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  period_number: integer('period_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});