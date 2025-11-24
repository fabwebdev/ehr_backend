import { db } from "../../config/db.drizzle.js";
import { discharge_sections } from "../../db/schemas/dischargeSection.schema.js";
import { sql } from "drizzle-orm";

class DischargeSectionsSeeder {
  /**
   * Run the database seeds.
   *
   * @return {Promise<void>}
   */
  async run() {
    const sections = [
      {
        code: 'A',
        name: 'Initial Evaluation'
      },
      {
        code: 'B',
        name: 'Physical Examination'
      },
      {
        code: 'C',
        name: 'History of Present Illness (HPI)'
      },
      {
        code: 'D',
        name: 'Past Medical History (PMH)'
      },
      {
        code: 'E',
        name: 'Medications'
      },
      {
        code: 'F',
        name: 'Allergies'
      },
      {
        code: 'G',
        name: 'Interventions/Procedures'
      },
      {
        code: 'H',
        name: 'Laboratory Results'
      },
      {
        code: 'I',
        name: 'Imaging Results'
      },
      {
        code: 'J',
        name: 'Nursing Assessment'
      },
      {
        code: 'K',
        name: 'Discharge Planning'
      },
      {
        code: 'L',
        name: 'Education Provided'
      },
    ];

    try {
      // Insert sections into the database
      for (const section of sections) {
        await db.execute(sql`
          INSERT INTO ${discharge_sections} (code, name)
          VALUES (${section.code}, ${section.name})
          ON CONFLICT (code) DO NOTHING
        `);
      }
      
      console.log('Discharge sections seeded successfully.');
    } catch (error) {
      console.error('Error seeding discharge sections:', error);
    }
  }
}

export default new DischargeSectionsSeeder();