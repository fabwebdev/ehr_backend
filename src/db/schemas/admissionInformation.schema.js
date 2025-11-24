import { pgTable, bigint, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const admission_information = pgTable('admission_information', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  admission_date: varchar('admission_date', { length: 255 }),
  discharge_date: varchar('discharge_date', { length: 255 }),
  admitting_physician: varchar('admitting_physician', { length: 255 }),
  reason_for_admission: text('reason_for_admission'),
  current_status: varchar('current_status', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});