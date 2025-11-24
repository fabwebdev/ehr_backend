import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const scale_tool_lab_data = pgTable('scale_tool_lab_data', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  note_id: bigint('note_id', { mode: 'number' }).notNull(),
  mac: varchar('mac', { length: 255 }),
  mtc: varchar('mtc', { length: 255 }),
  sleep_time: varchar('sleep_time', { length: 255 }),
  fast: varchar('fast', { length: 255 }),
  nyha: varchar('nyha', { length: 255 }),
  other_reading_1: varchar('other_reading_1', { length: 255 }),
  blood_sugar: varchar('blood_sugar', { length: 255 }),
  pt_inr: varchar('pt_inr', { length: 255 }),
  other_reading_2: varchar('other_reading_2', { length: 255 }),
  other_reading_3: varchar('other_reading_3', { length: 255 }),
  other_reading_4: varchar('other_reading_4', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});