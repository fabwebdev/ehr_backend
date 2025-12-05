import dotenv from "dotenv";
import { db } from "../src/config/db.drizzle.js";
import { nutrition_problems_type } from "../src/db/schemas/nutritionProblemsType.schema.js";
import { nutrition_template } from "../src/db/schemas/nutritionTemplate.schema.js";
import { eq } from "drizzle-orm";
import connectDB from "../src/database/connection.js";
import { closeDB } from "../src/database/connection.js";

// Load environment variables
dotenv.config();

const seedNutrition = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully.");

    // Nutrition Problems Type options
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

    // Nutrition Template options
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

    console.log("\n🌱 Seeding Nutrition Problems Type options...");
    let problemsInserted = 0;
    let problemsSkipped = 0;
    
    for (const problemItem of nutritionProblemsTypes) {
      try {
        // Check if it already exists
        const existing = await db.select()
          .from(nutrition_problems_type)
          .where(eq(nutrition_problems_type.name, problemItem.name))
          .limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${problemItem.name}" - already exists`);
          problemsSkipped++;
          continue;
        }
        
        // Insert new record
        const now = new Date();
        await db.insert(nutrition_problems_type).values({
          name: problemItem.name,
          createdAt: now,
          updatedAt: now,
        });
        
        console.log(`✅ Inserted: "${problemItem.name}"`);
        problemsInserted++;
      } catch (error) {
        console.error(`❌ Error inserting "${problemItem.name}":`, error.message);
        if (error.code === '23505') { // PostgreSQL unique violation
          console.log(`   (Duplicate - already exists)`);
          problemsSkipped++;
        }
      }
    }

    console.log(`\n📊 Nutrition Problems Summary:`);
    console.log(`   ✅ Inserted: ${problemsInserted}`);
    console.log(`   ⏭️  Skipped: ${problemsSkipped}`);
    console.log(`   📦 Total processed: ${problemsInserted + problemsSkipped}`);

    console.log("\n🌱 Seeding Nutrition Template options...");
    let templatesInserted = 0;
    let templatesSkipped = 0;
    
    for (const templateItem of nutritionTemplates) {
      try {
        // Check if it already exists
        const existing = await db.select()
          .from(nutrition_template)
          .where(eq(nutrition_template.name, templateItem.name))
          .limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${templateItem.name}" - already exists`);
          templatesSkipped++;
          continue;
        }
        
        // Insert new record
        const now = new Date();
        await db.insert(nutrition_template).values({
          name: templateItem.name,
          createdAt: now,
          updatedAt: now,
        });
        
        console.log(`✅ Inserted: "${templateItem.name}"`);
        templatesInserted++;
      } catch (error) {
        console.error(`❌ Error inserting "${templateItem.name}":`, error.message);
        if (error.code === '23505') { // PostgreSQL unique violation
          console.log(`   (Duplicate - already exists)`);
          templatesSkipped++;
        }
      }
    }

    console.log(`\n📊 Nutrition Template Summary:`);
    console.log(`   ✅ Inserted: ${templatesInserted}`);
    console.log(`   ⏭️  Skipped: ${templatesSkipped}`);
    console.log(`   📦 Total processed: ${templatesInserted + templatesSkipped}`);
    
    // Verify the data was inserted
    const problemsResult = await db.select().from(nutrition_problems_type);
    const templatesResult = await db.select().from(nutrition_template);
    
    console.log(`\n📊 Final Counts:`);
    console.log(`   Nutrition Problems Type: ${problemsResult.length} options`);
    console.log(`   Nutrition Template: ${templatesResult.length} options`);
    
  } catch (error) {
    console.error("❌ Error seeding nutrition data:", error);
    throw error;
  } finally {
    await closeDB();
    console.log("\n🔌 Database connection closed.");
  }
};

// Run the seeder
seedNutrition()
  .then(() => {
    console.log("\n✅ Nutrition seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

