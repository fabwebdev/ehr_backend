import dotenv from "dotenv";
import { db } from "../src/config/db.drizzle.js";
import { prognosis_patient } from "../src/db/schemas/prognosisPatient.schema.js";
import { prognosis_caregiver } from "../src/db/schemas/prognosisCaregiver.schema.js";
import { prognosis_imminence_of_death } from "../src/db/schemas/prognosisImminence.schema.js";
import { eq } from "drizzle-orm";
import connectDB from "../src/database/connection.js";
import { closeDB } from "../src/database/connection.js";

// Load environment variables
dotenv.config();

const seedPrognosis = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully.");

    // Prognosis Patient options
    const prognosisPatients = [
      { name: 'Aware of Diagnosis' },
      { name: 'Unaware of Diagnosis' },
      { name: 'Unaware of Prognosis' }
    ];

    // Prognosis Caregiver options
    const prognosisCaregivers = [
      { name: 'Aware of Diagnosis' },
      { name: 'Unaware of Diagnosis' },
      { name: 'Unaware of Prognosis' }
    ];

    // Prognosis Imminence options
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

    console.log("\n🌱 Seeding Prognosis Patient options...");
    let patientsInserted = 0;
    let patientsSkipped = 0;
    
    for (const patientItem of prognosisPatients) {
      try {
        const existing = await db.select()
          .from(prognosis_patient)
          .where(eq(prognosis_patient.name, patientItem.name))
          .limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${patientItem.name}" - already exists`);
          patientsSkipped++;
          continue;
        }
        
        const now = new Date();
        await db.insert(prognosis_patient).values({
          name: patientItem.name,
          createdAt: now,
          updatedAt: now,
        });
        
        console.log(`✅ Inserted: "${patientItem.name}"`);
        patientsInserted++;
      } catch (error) {
        console.error(`❌ Error inserting "${patientItem.name}":`, error.message);
        if (error.code === '23505') {
          console.log(`   (Duplicate - already exists)`);
          patientsSkipped++;
        }
      }
    }

    console.log(`\n📊 Prognosis Patient Summary:`);
    console.log(`   ✅ Inserted: ${patientsInserted}`);
    console.log(`   ⏭️  Skipped: ${patientsSkipped}`);

    console.log("\n🌱 Seeding Prognosis Caregiver options...");
    let caregiversInserted = 0;
    let caregiversSkipped = 0;
    
    for (const caregiverItem of prognosisCaregivers) {
      try {
        const existing = await db.select()
          .from(prognosis_caregiver)
          .where(eq(prognosis_caregiver.name, caregiverItem.name))
          .limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${caregiverItem.name}" - already exists`);
          caregiversSkipped++;
          continue;
        }
        
        const now = new Date();
        await db.insert(prognosis_caregiver).values({
          name: caregiverItem.name,
          createdAt: now,
          updatedAt: now,
        });
        
        console.log(`✅ Inserted: "${caregiverItem.name}"`);
        caregiversInserted++;
      } catch (error) {
        console.error(`❌ Error inserting "${caregiverItem.name}":`, error.message);
        if (error.code === '23505') {
          console.log(`   (Duplicate - already exists)`);
          caregiversSkipped++;
        }
      }
    }

    console.log(`\n📊 Prognosis Caregiver Summary:`);
    console.log(`   ✅ Inserted: ${caregiversInserted}`);
    console.log(`   ⏭️  Skipped: ${caregiversSkipped}`);

    console.log("\n🌱 Seeding Prognosis Imminence options...");
    let imminencesInserted = 0;
    let imminencesSkipped = 0;
    
    for (const imminenceItem of prognosisImminences) {
      try {
        const existing = await db.select()
          .from(prognosis_imminence_of_death)
          .where(eq(prognosis_imminence_of_death.name, imminenceItem.name))
          .limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${imminenceItem.name}" - already exists`);
          imminencesSkipped++;
          continue;
        }
        
        const now = new Date();
        await db.insert(prognosis_imminence_of_death).values({
          name: imminenceItem.name,
          createdAt: now,
          updatedAt: now,
        });
        
        console.log(`✅ Inserted: "${imminenceItem.name}"`);
        imminencesInserted++;
      } catch (error) {
        console.error(`❌ Error inserting "${imminenceItem.name}":`, error.message);
        if (error.code === '23505') {
          console.log(`   (Duplicate - already exists)`);
          imminencesSkipped++;
        }
      }
    }

    console.log(`\n📊 Prognosis Imminence Summary:`);
    console.log(`   ✅ Inserted: ${imminencesInserted}`);
    console.log(`   ⏭️  Skipped: ${imminencesSkipped}`);
    
    // Verify the data was inserted
    const patientsResult = await db.select().from(prognosis_patient);
    const caregiversResult = await db.select().from(prognosis_caregiver);
    const imminencesResult = await db.select().from(prognosis_imminence_of_death);
    
    console.log(`\n📊 Final Counts:`);
    console.log(`   Prognosis Patient: ${patientsResult.length} options`);
    console.log(`   Prognosis Caregiver: ${caregiversResult.length} options`);
    console.log(`   Prognosis Imminence: ${imminencesResult.length} options`);
    
  } catch (error) {
    console.error("❌ Error seeding prognosis data:", error);
    throw error;
  } finally {
    await closeDB();
    console.log("\n🔌 Database connection closed.");
  }
};

// Run the seeder
seedPrognosis()
  .then(() => {
    console.log("\n✅ Prognosis seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

