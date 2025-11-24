import { pgTable, bigint, timestamp, varchar } from 'drizzle-orm/pg-core';

export const visit_information = pgTable('visit_information', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  visit_date: timestamp('visit_date'),
  visit_time_in: varchar('visit_time_in', { length: 255 }),
  visit_time_out: varchar('visit_time_out', { length: 255 }),
  travel_time_in: varchar('travel_time_in', { length: 255 }),
  travel_time_out: varchar('travel_time_out', { length: 255 }),
  documenttation_time: varchar('documenttation_time', { length: 255 }),
  associated_mileage: varchar('associated_mileage', { length: 255 }),
  surcharge: varchar('surcharge', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});