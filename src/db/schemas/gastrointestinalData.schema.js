import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const gastrointestinal_data = pgTable('gastrointestinal_data', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  note_id: bigint('note_id', { mode: 'number' }).notNull(),
  gastrointestinal_normal: varchar('gastrointestinal_normal', { length: 255 }),
  gastrointestinal_abnormal: varchar('gastrointestinal_abnormal', { length: 255 }),
  gastrointestinal_appetite: varchar('gastrointestinal_appetite', { length: 255 }),
  gastrointestinal_dysphagia: varchar('gastrointestinal_dysphagia', { length: 255 }),
  gastrointestinal_nausea: varchar('gastrointestinal_nausea', { length: 255 }),
  gastrointestinal_vomiting: varchar('gastrointestinal_vomiting', { length: 255 }),
  gastrointestinal_diarrhea: varchar('gastrointestinal_diarrhea', { length: 255 }),
  gastrointestinal_constipation: varchar('gastrointestinal_constipation', { length: 255 }),
  gastrointestinal_bowel_sounds: varchar('gastrointestinal_bowel_sounds', { length: 255 }),
  gastrointestinal_bowel_movement: varchar('gastrointestinal_bowel_movement', { length: 255 }),
  gastrointestinal_abdominal_distention: varchar('gastrointestinal_abdominal_distention', { length: 255 }),
  gastrointestinal_abdominal_pain: varchar('gastrointestinal_abdominal_pain', { length: 255 }),
  gastrointestinal_tube_feeding: varchar('gastrointestinal_tube_feeding', { length: 255 }),
  gastrointestinal_parenteral_feeding: varchar('gastrointestinal_parenteral_feeding', { length: 255 }),
  gastrointestinal_other: varchar('gastrointestinal_other', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});