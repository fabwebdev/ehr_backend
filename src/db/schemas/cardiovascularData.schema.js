import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const cardiovascular_data = pgTable('cardiovascular_data', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  note_id: bigint('note_id', { mode: 'number' }).notNull(),
  cardiovascular_normal: varchar('cardiovascular_normal', { length: 255 }),
  cardiovascular_abnormal: varchar('cardiovascular_abnormal', { length: 255 }),
  cardiovascular_pedal_edema: varchar('cardiovascular_pedal_edema', { length: 255 }),
  cardiovascular_jugular_distention: varchar('cardiovascular_jugular_distention', { length: 255 }),
  cardiovascular_heart_sounds: varchar('cardiovascular_heart_sounds', { length: 255 }),
  cardiovascular_peripheral_pulses: varchar('cardiovascular_peripheral_pulses', { length: 255 }),
  cardiovascular_capillary_refill: varchar('cardiovascular_capillary_refill', { length: 255 }),
  cardiovascular_other: varchar('cardiovascular_other', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});