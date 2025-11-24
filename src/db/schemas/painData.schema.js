import { pgTable, bigint, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const pain_data = pgTable('pain_data', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  note_id: bigint('note_id', { mode: 'number' }).notNull(),
  pain_level_now: varchar('pain_level_now', { length: 255 }),
  pain_right: varchar('pain_right', { length: 255 }),
  pain_left: varchar('pain_left', { length: 255 }),
  pain_acceptable_level: varchar('pain_acceptable_level', { length: 255 }),
  pain_rated_by: text('pain_rated_by'),
  respiratory_rhythm: varchar('respiratory_rhythm', { length: 255 }),
  pain_observations: text('pain_observations'),
  pain_duration: text('pain_duration'),
  pain_frequency: text('pain_frequency'),
  pain_character: text('pain_character'),
  worsened_by: text('worsened_by'),
  relieved_by: text('relieved_by'),
  effects_on_function: text('effects_on_function'),
  current_pain_management: varchar('current_pain_management', { length: 255 }),
  breakthrough_pain: text('breakthrough_pain'),
  additional_pain_information: text('additional_pain_information'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});