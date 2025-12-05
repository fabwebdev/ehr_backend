import dotenv from "dotenv";
import { db } from "../src/config/db.drizzle.js";
import { integumentary } from "../src/db/schemas/integumentary.schema.js";
import { eq } from "drizzle-orm";
import connectDB from "../src/database/connection.js";
import { closeDB } from "../src/database/connection.js";

// Load environment variables
dotenv.config();

const seedIntegumentary = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully.");

    // Create Integumentary Assessment options
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

    console.log("Seeding integumentary options...");
    let insertedCount = 0;
    let skippedCount = 0;
    
    for (const integumentaryItem of integumentaries) {
      try {
        // Check if it already exists
        const existing = await db.select()
          .from(integumentary)
          .where(eq(integumentary.name, integumentaryItem.name))
          .limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${integumentaryItem.name}" - already exists`);
          skippedCount++;
          continue;
        }
        
        // Insert new record
        const now = new Date();
        await db.insert(integumentary).values({
          name: integumentaryItem.name,
          createdAt: now,
          updatedAt: now,
        });
        
        console.log(`✅ Inserted: "${integumentaryItem.name}"`);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Error inserting "${integumentaryItem.name}":`, error.message);
        if (error.code === '23505') { // PostgreSQL unique violation
          console.log(`   (Duplicate - already exists)`);
          skippedCount++;
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Inserted: ${insertedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📦 Total processed: ${insertedCount + skippedCount}`);
    
    // Verify the data was inserted
    const result = await db.select().from(integumentary);
    console.log(`\n📊 Total integumentary options in database: ${result.length}`);
    if (result.length > 0) {
      console.log("Options:", result.map(r => r.name).join(", "));
    }
    
  } catch (error) {
    console.error("❌ Error seeding integumentary data:", error);
    throw error;
  } finally {
    await closeDB();
    console.log("\n🔌 Database connection closed.");
  }
};

// Run the seeder
seedIntegumentary()
  .then(() => {
    console.log("✅ Integumentary seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

