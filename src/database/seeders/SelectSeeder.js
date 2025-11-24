import { db } from "../../config/db.drizzle.js";
import { site_of_service } from "../../db/schemas/siteOfService.schema.js";
import { admitted_form } from "../../db/schemas/admittedForm.schema.js";
import { prognosis_patient } from "../../db/schemas/prognosisPatient.schema.js";
import { prognosis_caregiver } from "../../db/schemas/prognosisCaregiver.schema.js";
import { prognosis_imminence } from "../../db/schemas/prognosisImminence.schema.js";
import { cardiac } from "../../db/schemas/cardiac.schema.js";
import { endocrine } from "../../db/schemas/endocrine.schema.js";
import { hematological } from "../../db/schemas/hematological.schema.js";
import { integumentary } from "../../db/schemas/integumentary.schema.js";
import { nutrition_problems_type } from "../../db/schemas/nutritionProblemsType.schema.js";
import { nutrition_template } from "../../db/schemas/nutritionTemplate.schema.js";
import { dme_provider } from "../../db/schemas/dmeProvider.schema.js";
import { dnr } from "../../db/schemas/dnr.schema.js";
import { liaison_primary } from "../../db/schemas/liaisonPrimary.schema.js";
import { liaison_secondary } from "../../db/schemas/liaisonSecondary.schema.js";
import { race_ethnicity } from "../../db/schemas/raceEthnicity.schema.js";
import { patient_pharmacy } from "../../db/schemas/patientPharmacy.schema.js";
import { primary_diagnosis } from "../../db/schemas/primaryDiagnosis.schema.js";
import { emergency_preparedness_level } from "../../db/schemas/emergencyPreparednessLevel.schema.js";
import { patients } from "../../db/schemas/patient.schema.js";
import { sql } from "drizzle-orm";

class SelectSeeder {
  /**
   * Run the database seeds.
   *
   * @return {Promise<void>}
   */
  async run() {
    try {
      // Create SiteOfService
      const siteOfServices = [
        { name: '01. Hospice in patient\'s home/residence' },
        { name: '02. Hospice in Assisted Living facility' },
        { name: '03. Hospice provided in Nursing Long Term Care (LTC) or Non-Skilled Nursing Facility (NF)' },
        { name: '04. Hospice provided in a Skilled Nursing Facility (SNF)' },
        { name: '05. Hospice provided in Inpatient Hospital' },
        { name: '06. Hospice provided in Inpatient Hospice Facility' },
        { name: '07. Hospice provided in Long Term Care Hospital (LTCH)' },
        { name: '08. Hospice in Inpatient Psychiatric Facility' },
        { name: '09. Hospice provided in a place not otherwise specified (NOS) ' },
        { name: '10. Hospice home care provided in a hospice facility' }
      ];

      for (const siteOfService of siteOfServices) {
        await db.execute(sql`
          INSERT INTO ${site_of_service} (name)
          VALUES (${siteOfService.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create AdmittedForm
      const admittedForms = [
        { name: '01. Community residential setting (e.g, private home/apt., board/care,assisted living, group home adult foster care)' },
        { name: '02. Long-term care facility' },
        { name: '03. Skilled Nursing Facility (SNF)' },
        { name: '04. Hospital emergency department' },
        { name: '05. Short-stay acute hospital ' },
        { name: '06. Long-team care hospital (LTCH)' },
        { name: '07. Inpatient rehabilitation facility or unit (IRF)' },
        { name: '08. Psychiatric hospital or unit' },
        { name: '09. ID/DD Facility' },
        { name: '10. Hospice' },
        { name: '99. None of the above' }
      ];

      for (const admittedForm of admittedForms) {
        await db.execute(sql`
          INSERT INTO ${admitted_form} (name)
          VALUES (${admittedForm.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create Prognosis Patient
      const prognosisPatients = [
        { name: 'Aware of Diagnosis' },
        { name: 'Unaware of Diagnosis' },
        { name: 'Unaware of Prognosis' }
      ];

      for (const prognosisPatient of prognosisPatients) {
        await db.execute(sql`
          INSERT INTO ${prognosis_patient} (name)
          VALUES (${prognosisPatient.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create Prognosis Caregiver
      const prognosisCaregivers = [
        { name: 'Aware of Diagnosis' },
        { name: 'Unaware of Diagnosis' },
        { name: 'Unaware of Prognosis' }
      ];

      for (const prognosisCaregiver of prognosisCaregivers) {
        await db.execute(sql`
          INSERT INTO ${prognosis_caregiver} (name)
          VALUES (${prognosisCaregiver.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create Prognosis Imminence
      const prognosisImminences = [
        { name: 'Absent Bowel Function' },
        { name: 'Coolness to Skin' },
        { name: 'Cyanosis' },
        { name: 'Decreased Fluid/food Intake' },
        { name: 'Decreased Urine Output' },
        { name: 'Increased Fatigue' },
        { name: 'Increased  Respiratory Distress' },
        { name: 'Increased  Sleepiness' },
        { name: 'Other' }
      ];

      for (const prognosisImminence of prognosisImminences) {
        await db.execute(sql`
          INSERT INTO ${prognosis_imminence} (name)
          VALUES (${prognosisImminence.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create Cardiac Assessment
      const cardiacs = [
        { name: 'No Problems identified' },
        { name: 'Abnormal Heart Rhythm:' },
        { name: 'Abnormal Heart Sounds:' },
        { name: 'Abnormal Lower Extremity:' },
        { name: 'Abnormal Pulses:' },
        { name: 'Abnormal Capillary Refills > 3 Sec :' },
        { name: 'Cardiac Devices:' },
        { name: 'Nebulizer' },
        { name: 'Cherst Pain:' },
        { name: 'Dizziness/Lightheadedness:' },
        { name: 'Adema, Non-Pitting:' },
        { name: 'Edema, Pitting:' },
        { name: 'Edema, Weeping:' },
        { name: 'Ascites:' },
        { name: 'Ascites:' },
        { name: 'Implanted Paracentiesis Drain:' },
        { name: 'Other:' }
      ];

      for (const cardiac of cardiacs) {
        await db.execute(sql`
          INSERT INTO ${cardiac} (name)
          VALUES (${cardiac.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create Endocrine Assessment
      const endocrines = [
        { name: 'No Problems identified' },
        { name: 'Hypothyroidism:' },
        { name: 'Hyperthyroidism:' },
        { name: 'Diabetes:' },
        { name: 'Other:' }
      ];

      for (const endocrine of endocrines) {
        await db.execute(sql`
          INSERT INTO ${endocrine} (name)
          VALUES (${endocrine.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create Hematological Assessment
      const hematologicals = [
        { name: 'No Problems identified' },
        { name: 'AIDS:' },
        { name: 'Anemia:' },
        { name: 'HIV:' },
        { name: 'Other:' }
      ];

      for (const hematological of hematologicals) {
        await db.execute(sql`
          INSERT INTO ${hematological} (name)
          VALUES (${hematological.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create Integumentary Assessment
      const integumentaries = [
        { name: 'No Problems identified' },
        { name: 'Abnormal Color:' },
        { name: 'Bruising:' },
        { name: 'Cool:' },
        { name: 'Dry:' },
        { name: 'Clammy:' },
        { name: 'Poor Turgor:' },
        { name: 'Pruritus:' },
        { name: 'Rash:' },
        { name: 'Wound(s):' }
      ];

      for (const integumentaryItem of integumentaries) {
        await db.execute(sql`
          INSERT INTO ${integumentary} (name)
          VALUES (${integumentaryItem.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create Nutrition Problems Type Assessment
      const nutritionProblemsTypes = [
        { name: 'No Problems identified' },
        { name: 'Abnormal Appetite:' },
        { name: 'Abnormal Hydration:' },
        { name: 'Abnormal Oral Cavity:' },
        { name: 'Difficulty Chewing' },
        { name: 'Dyssphagia:' },
        { name: 'Ill-Fitting Dentures:' },
        { name: 'Sore Throat:' },
        { name: 'Tube Freeding Present:' },
        { name: 'Other:' }
      ];

      for (const nutritionProblemsType of nutritionProblemsTypes) {
        await db.execute(sql`
          INSERT INTO ${nutrition_problems_type} (name)
          VALUES (${nutritionProblemsType.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create Nutrition Template
      const nutritionTemplates = [
        { name: '15 - Without reason, has lost more than 10 Ibs, in the last 3 months' },
        { name: '10 - Has an illness or condition that made pt change the type and / or amount of food eaten' },
        { name: '10 - Eats fewer than 2 meals a day' },
        { name: '10 - Has open decubitus, ulcer, burn or wound' },
        { name: '10 - Has a tooth/mouth problem that makes it hard to eat' },
        { name: '10 - Has 3 or more drinks of beer, liquor or wine almost every day' },
        { name: '10 - Does not always have enough money to buy foods needed' },
        { name: '5 - Eats few fruits or vegetable, or milk products' },
        { name: '5 - Eats alone most of the time' },
        { name: '5 - Take 3 or more prescribed or OTC medications a day' },
        { name: '10 - Is not always physically able to cook and /or feed self and has no caregiver to assist' },
        { name: '10- Frequently has diarrhea or constipation' }
      ];

      for (const nutritionTemplate of nutritionTemplates) {
        await db.execute(sql`
          INSERT INTO ${nutrition_template} (name)
          VALUES (${nutritionTemplate.name})
          ON CONFLICT (name) DO NOTHING
        `);
      }

      // Create other test data
      await db.execute(sql`
        INSERT INTO ${dme_provider} (name)
        VALUES ('test Provider')
        ON CONFLICT (name) DO NOTHING
      `);

      await db.execute(sql`
        INSERT INTO ${dnr} (name)
        VALUES ('test Dnr')
        ON CONFLICT (name) DO NOTHING
      `);

      await db.execute(sql`
        INSERT INTO ${liaison_primary} (name)
        VALUES ('test primary')
        ON CONFLICT (name) DO NOTHING
      `);

      await db.execute(sql`
        INSERT INTO ${liaison_secondary} (name)
        VALUES ('test secondary')
        ON CONFLICT (name) DO NOTHING
      `);

      await db.execute(sql`
        INSERT INTO ${race_ethnicity} (name)
        VALUES ('test race')
        ON CONFLICT (name) DO NOTHING
      `);

      await db.execute(sql`
        INSERT INTO ${patient_pharmacy} (name)
        VALUES ('test pharmacy')
        ON CONFLICT (name) DO NOTHING
      `);

      await db.execute(sql`
        INSERT INTO ${primary_diagnosis} (name)
        VALUES ('test diagnosis')
        ON CONFLICT (name) DO NOTHING
      `);

      await db.execute(sql`
        INSERT INTO ${emergency_preparedness_level} (name)
        VALUES ('test Emergency')
        ON CONFLICT (name) DO NOTHING
      `);

      // Create test patient
      await db.execute(sql`
        INSERT INTO ${patients} (first_name, mi, last_name, preferred_name, date_of_birth, suffix, oxygen_dependent, ssn, patient_consents, genders, dme_provider_id, primary_diagnosis_id, patient_pharmacy_id, dnr_id, race_ethnicity_id, emergency_preparedness_level_id, liaison_primary_id, liaison_secondary_id, hipaa_received)
        VALUES ('Ahlin', 'eeee', 'Byll', 'pppp', '2024-04-03', 'dddd', 1, 666, 0, 'male', 1, 1, 1, 1, 1, 1, 1, 1, 0)
        ON CONFLICT (first_name, last_name, date_of_birth) DO NOTHING
      `);

      console.log('SelectSeeder completed successfully.');
    } catch (error) {
      console.error('Error in SelectSeeder:', error);
    }
  }
}

export default new SelectSeeder();