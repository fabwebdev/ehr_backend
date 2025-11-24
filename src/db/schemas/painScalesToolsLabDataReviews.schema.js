import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const pain_scales_tools_lab_data_reviews = pgTable('pain_scales_tools_lab_data_reviews', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  mid_arm_circumference: varchar('mid_arm_circumference', { length: 255 }),
  mid_thigh_circumference: varchar('mid_thigh_circumference', { length: 255 }),
  sleep_hours: varchar('sleep_hours', { length: 255 }),
  fast: varchar('fast', { length: 255 }),
  nyha: varchar('nyha', { length: 255 }),
  pps: varchar('pps', { length: 255 }),
  blood_sugar: varchar('blood_sugar', { length: 255 }),
  pt_inr: varchar('pt_inr', { length: 255 }),
  other_reading_2: varchar('other_reading_2', { length: 255 }),
  other_reading_3: varchar('other_reading_3', { length: 255 }),
  other_reading_4: varchar('other_reading_4', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});