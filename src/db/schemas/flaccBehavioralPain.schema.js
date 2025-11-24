import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const flacc_behavioral_pain = pgTable('flacc_behavioral_pain', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  face: varchar('face', { length: 255 }),
  legs: varchar('legs', { length: 255 }),
  activity: varchar('activity', { length: 255 }),
  cry: varchar('cry', { length: 255 }),
  consolability: varchar('consolability', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});