import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const respiratory_data = pgTable('respiratory_data', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  note_id: bigint('note_id', { mode: 'number' }).notNull(),
  respiratory_normal: varchar('respiratory_normal', { length: 255 }),
  respiratory_abnormal: varchar('respiratory_abnormal', { length: 255 }),
  respiratory_effort: varchar('respiratory_effort', { length: 255 }),
  respiratory_breath_sounds: varchar('respiratory_breath_sounds', { length: 255 }),
  respiratory_cough: varchar('respiratory_cough', { length: 255 }),
  respiratory_sputum: varchar('respiratory_sputum', { length: 255 }),
  respiratory_other: varchar('respiratory_other', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});