import { db } from "../../config/db.drizzle.js";
import { permissions } from "../../db/schemas/permission.schema.js";
import { sql } from "drizzle-orm";

class UserSeeder {
  /**
   * Run the database seeds.
   *
   * @return {Promise<void>}
   */
  async run() {
    try {
      // Create user permissions
      const categories = [
        // Menus principaux
        'permissions_principal_menu',
        'roles_principal_menu',
        'users_principal_menu',
        'patients_principal_menu',

        'patients_principal_menu_create',
        'patients_principal_menu_edit',
        'patients_principal_menu_delete',

        'users_principal_menu_create',
        'users_principal_menu_edit',
        'users_principal_menu_delete',

        // Menus secondaires
        'team_comm_secondary_menu',
        'trends_secondary_menu',
        'his_secondary_menu',
        'encounters_secondary_menu',
        'care_plan_secondary_menu',
        'patient_info_secondary_menu',
        'idg_team_secondary_menu',
        'documents_secondary_menu',
        'library_secondary_menu',
        'certifications_secondary_menu',
        'med_list_secondary_menu',
        'dose_spot_secondary_menu',
        'patient_charts_secondary_menu',

        // Menus tertiaires (HIS)
        'administrative_information_his_tertiary_menu',
        'discharge_his_tertiary_menu',
        'patient_history_diagnoses_his_tertiary_menu',
        'advance_exitential_his_tertiary_menu',
        'spiritual_existential_his_tertiary_menu',
        'neuro_behavioral_his_tertiary_menu',
        'sensory_his_tertiary_menu',
        'pain_his_tertiary_menu',
        'respiratory_his_tertiary_menu',
        'cardiac_his_tertiary_menu',
        'elimination_his_tertiary_menu',
        'functional_his_tertiary_menu',
        'endocrine_his_tertiary_menu',
        'hematological_his_tertiary_menu',
        'integumentary_his_tertiary_menu',
        'nutrition_his_tertiary_menu',
        'medications_his_tertiary_menu',
        'summary_his_tertiary_menu',

        // Menus tertiaires (Patient Info)
        'general_patient_info_tertiary_menu',
        'coverage_patient_info_tertiary_menu',
        'location_information_patient_info_tertiary_menu',
        'idg_team_patient_info_tertiary_menu',
        'care_periods_patient_info_tertiary_menu',
        'dose_spot_account_patient_info_tertiary_menu',
        'patient_history_patient_info_tertiary_menu',
        'support_information_patient_info_tertiary_menu',
        'demographics_choices_patient_info_tertiary_menu',
        'alert_tags_patient_info_tertiary_menu',
        'patient_forms_patient_info_tertiary_menu',
        'patient_portal_patient_info_tertiary_menu',

        // Sections administratives HIS
        'visit_information_section_administrative_information_his_views',
        'visit_information_section_administrative_information_his_edit',
        'demographics_section_administrative_information_his_views',
        'demographics_section_administrative_information_his_edit',
        'admission_information_section_administrative_information_his_views',
        'admission_information_section_administrative_information_his_edit',
        'payer_information_section_administrative_information_his_views',
        'payer_information_section_administrative_information_his_edit',

        'administrative_information_section_discharge_his_views',
        'administrative_information_section_discharge_his_edit',
        'record_administrative_section_discharge_his_views',
        'record_administrative_section_discharge_his_edit',

        'vital_signs_section_patient_history_diagnoses_his_views',
        'vital_signs_section_patient_history_diagnoses_his_edit',
        'dignosis_section_patient_history_diagnoses_his_views',
        'dignosis_section_patient_history_diagnoses_his_edit',
        'prognosis_section_patient_history_diagnoses_his_views',
        'prognosis_section_patient_history_diagnoses_his_edit',
        'plan_of_care_orders_section_patient_history_diagnoses_his_views',
        'plan_of_care_orders_section_patient_history_diagnoses_his_edit',

        'hospitalization_preference_section_advance_care_his_views',
        'hospitalization_preference_section_advance_care_his_edit',
        'plan_of_care_orders_section_advance_care_his_views',
        'plan_of_care_orders_section_advance_care_his_edit',

        'spiritual_existential_assessment_section_spiritual_existential_his_views',
        'spiritual_existential_assessment_section_spiritual_existential_his_edit',
        'spiritual_preferences_section_spiritual_existential_his_views',
        'spiritual_preferences_assessment_section_spiritual_existential_his_edit',
        'plan_of_care_orders_section_spiritual_existential_his_views',
        'plan_of_care_orders_section_spiritual_existential_his_edit',

        'living_arrangements_section_supportive_assistance_his_views',
        'living_arrangements_section_supportive_assistance_his_edit',
        'diagnosis_section_supportive_assistance_his_views',
        'diagnosis_section_supportive_assistance_his_edit',
        'Prognosis_section_supportive_assistance_his_views',
        'Prognosis_section_supportive_assistance_his_edit',
        'plan_of_care_orders_section_supportive_assistance_his_views',
        'plan_of_care_orders_section_supportive_assistance_his_edit',

        'neurological_assessment_assessment_section_neuro_behavioral_his_views',
        'neurological_assessment_assessment_section_neuro_behavioral_his_edit',
        'plan_of_care_orders_section_neuro_behavioral_his_views',
        'plan_of_care_orders_section_neuro_behavioral_his_edit',

        'sensory_ssessment_assessment_section_sensory_his_views',
        'sensory_ssessment_assessment_section_sensory_his_edit',
        'plan_of_care_orders_section_sensory_his_views',
        'plan_of_care_orders_section_sensory_his_edit',

        'pain_screening_assessment_section_pain_his_views',
        'pain_screening_assessment_section_pain_his_edit',
        'plan_of_care_orders_section_pain_his_views',
        'plan_of_care_orders_section_pain_his_edit',

        'respiratory_assessment_section_respiratory_his_views',
        'respiratory_assessment_section_respiratory_his_edit',
        'screening_for_shortness_of_breath_section_respiratory_his_views',
        'screening_for_shortness_of_breath_section_respiratory_his_edit',
        'plan_of_care_orders_section_respiratory_his_views',
        'plan_of_care_orders_section_respiratory_his_edit',

        'cardiac_assessment_section_cardiac_his_views',
        'cardiac_assessment_section_cardiac_his_edit',
        'plan_of_care_orders_section_cardiac_his_views',
        'plan_of_care_orders_section_cardiac_his_edit',

        'genitourinary_assessment_section_elimination_his_views',
        'genitourinary_assessment_section_elimination_his_edit',
        'gastrointestinal_assessment_section_elimination_his_views',
        'gastrointestinal_assessment_section_elimination_his_edit',
        'narrative_template_section_elimination_his_views',
        'narrative_template_section_elimination_his_edit',
        'plan_of_care_orders_section_elimination_his_views',
        'plan_of_care_orders_section_elimination_his_edit',

        'functional_assessment_section_functional_his_views',
        'functional_assessment_section_functional_his_edit',
        'fall_risk_assessment_tool_section_functional_his_views',
        'fall_risk_assessment_tool_section_functional_his_edit',
        'plan_of_care_orders_section_functional_his_views',
        'plan_of_care_orders_section_functional_his_edit',

        'endocrine_assessment_section_endocrine_his_views',
        'endocrine_assessment_section_endocrine_his_edit',

        'hematological_assessment_section_hematological_his_views',
        'hematological_assessment_section_hematological_his_edit',

        'integumentary_assessment_section_integumentary_his_views',
        'integumentaryl_assessment_section_integumentary_his_edit',

        'nutritionk_assessment_section_nutrition_his_views',
        'nutrition_assessment_section_nutrition_his_edit',
        'nutritional_health_screen_section_nutrition_his_views',
        'nutritional_health_screen_section_nutrition_his_edit',
        'plan_of_care_orders_section_nutrition_his_views',
        'plan_of_care_orders_section_nutrition_his_edit',

        'medictions_assessment_section_medictions_his_views',
        'medictions_assessment_section_medictions_his_edit',
        'scheduled_opioid_section_medictions_his_views',
        'scheduled_opioid_section_medictions_his_edit',
        'PRN_opioid_section_medictions_his_views',
        'PRN_opioid_section_medictions_his_edit',
        'allergies_section_medictions_his_views',
        'allergies_section_medictions_his_edit',
        'bowel_regimen_section_medictions_his_views',
        'bowel_regimen_section_medictions_his_edit',
        'plan_of_care_orders_section_medictions_his_views',
        'plan_of_care_orders_section_medictions_his_edit',

        'physician_orders_section_Genitourinary_his_views',
        'physician_orders_section_genitourinary_his_edit'
      ];

      // Create permissions
      for (const category of categories) {
        await db.execute(sql`
          INSERT INTO ${permissions} (name, guard_name)
          VALUES (${category}, 'web')
          ON CONFLICT (name) DO NOTHING
        `);
      }

      console.log('User permissions seeded successfully.');
    } catch (error) {
      console.error('Error seeding user permissions:', error);
    }
  }
}

export default new UserSeeder();