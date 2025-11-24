import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const genitourinary_data = pgTable('genitourinary_data', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  note_id: bigint('note_id', { mode: 'number' }).notNull(),
  genitourinary_normal: varchar('genitourinary_normal', { length: 255 }),
  genitourinary_abnormal: varchar('genitourinary_abnormal', { length: 255 }),
  genitourinary_urinary_pattern: varchar('genitourinary_urinary_pattern', { length: 255 }),
  genitourinary_urinary_incontinence: varchar('genitourinary_urinary_incontinence', { length: 255 }),
  genitourinary_urinary_retention: varchar('genitourinary_urinary_retention', { length: 255 }),
  genitourinary_urinary_urgency: varchar('genitourinary_urinary_urgency', { length: 255 }),
  genitourinary_urinary_frequency: varchar('genitourinary_urinary_frequency', { length: 255 }),
  genitourinary_urinary_nocturia: varchar('genitourinary_urinary_nocturia', { length: 255 }),
  genitourinary_urinary_dysuria: varchar('genitourinary_urinary_dysuria', { length: 255 }),
  genitourinary_urinary_hematuria: varchar('genitourinary_urinary_hematuria', { length: 255 }),
  genitourinary_urinary_catheter: varchar('genitourinary_urinary_catheter', { length: 255 }),
  genitourinary_other: varchar('genitourinary_other', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});