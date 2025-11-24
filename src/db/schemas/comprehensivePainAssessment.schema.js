import { pgTable, bigint, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const comprehensive_pain_assessment = pgTable('comprehensive_pain_assessment', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  comprehensive_pain: integer('comprehensive_pain'),
  date_of_assessment: varchar('date_of_assessment', { length: 255 }),
  comprehensive_pain_included: text('comprehensive_pain_included'),
  comments: text('comments'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});