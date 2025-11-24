import { pgTable, bigint, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const flacc_data = pgTable('flacc_data', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  note_id: bigint('note_id', { mode: 'number' }).notNull(),
  flacc_face: varchar('flacc_face', { length: 255 }),
  flacc_legs: varchar('flacc_legs', { length: 255 }),
  flacc_activity: varchar('flacc_activity', { length: 255 }),
  flacc_cry: varchar('flacc_cry', { length: 255 }),
  flacc_consolability: varchar('flacc_consolability', { length: 255 }),
  total_score: integer('total_score'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});