import { pgTable, bigint, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const painad_data = pgTable('painad_data', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  note_id: bigint('note_id', { mode: 'number' }).notNull(),
  pain_assessment_behavior: varchar('pain_assessment_behavior', { length: 255 }),
  pain_assessment_negative_vocalizations: varchar('pain_assessment_negative_vocalizations', { length: 255 }),
  pain_assessment_facial_expression: varchar('pain_assessment_facial_expression', { length: 255 }),
  pain_assessment_body_language: varchar('pain_assessment_body_language', { length: 255 }),
  pain_consolability: varchar('pain_consolability', { length: 255 }),
  painad_total_score: integer('painad_total_score'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});