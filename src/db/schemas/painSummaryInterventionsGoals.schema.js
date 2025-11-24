import { pgTable, bigint, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const pain_summary_interventions_goals = pgTable('pain_summary_interventions_goals', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  summary_of_problem: text('summary_of_problem'),
  pain_interventions_administer_medication: varchar('pain_interventions_administer_medication', { length: 255 }),
  pain_interventions_administer_medication_start_date: varchar('pain_interventions_administer_medication_start_date', { length: 255 }),
  pain_interventions_assess_effectiveness: varchar('pain_interventions_assess_effectiveness', { length: 255 }),
  pain_interventions_assess_effectiveness_start_date: varchar('pain_interventions_assess_effectiveness_start_date', { length: 255 }),
  pain_interventions_assess_pain_status: varchar('pain_interventions_assess_pain_status', { length: 255 }),
  pain_interventions_assess_pain_status_start_date: varchar('pain_interventions_assess_pain_status_start_date', { length: 255 }),
  pain_interventions_non_pharmacological: varchar('pain_interventions_non_pharmacological', { length: 255 }),
  pain_interventions_non_pharmacological_start_date: varchar('pain_interventions_non_pharmacological_start_date', { length: 255 }),
  pain_goals_caregiver: varchar('pain_goals_caregiver', { length: 255 }),
  pain_goals_rating: varchar('pain_goals_rating', { length: 255 }),
  pain_goals_start_date: varchar('pain_goals_start_date', { length: 255 }),
  pain_goals_end_date: varchar('pain_goals_end_date', { length: 255 }),
  pain_caregiver_discussion_methods: varchar('pain_caregiver_discussion_methods', { length: 255 }),
  pain_achive_by_date: varchar('pain_achive_by_date', { length: 255 }),
  pain_achive_by_date_start_date: varchar('pain_achive_by_date_start_date', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});