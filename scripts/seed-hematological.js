import dotenv from "dotenv";
import { db } from "../src/config/db.drizzle.js";
import { hematological } from "../src/db/schemas/hematological.schema.js";
import { eq } from "drizzle-orm";
import connectDB from "../src/database/connection.js";
import { closeDB } from "../src/database/connection.js";

// Load environment variables
dotenv.config();

const seedHematological = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully.");

    // Hematological Assessment options
    const hematologicals = [
      { name: 'No Problems identified' },
      { name: 'AIDS:' },
      { name: 'Anemia:' },
      { name: 'HIV:' },
      { name: 'Other:' }
    ];

    console.log("Seeding hematological options...");
    let insertedCount = 0;
    let skippedCount = 0;
    
    for (const hematologicalItem of hematologicals) {
      try {
        // Check if it already exists
        const existing = await db.select()
          .from(hematological)
          .where(eq(hematological.name, hematologicalItem.name))
          .limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${hematologicalItem.name}" - already exists`);
          skippedCount++;
          continue;
        }
        
        // Insert new record
        const now = new Date();
        await db.insert(hematological).values({
          name: hematologicalItem.name,
          createdAt: now,
          updatedAt: now,
        });
        
        console.log(`✅ Inserted: "${hematologicalItem.name}"`);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Error inserting "${hematologicalItem.name}":`, error.message);
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
    const result = await db.select().from(hematological);
    console.log(`\n📊 Total hematological options in database: ${result.length}`);
    if (result.length > 0) {
      console.log("Options:", result.map(r => r.name).join(", "));
    }
    
  } catch (error) {
    console.error("❌ Error seeding hematological data:", error);
    throw error;
  } finally {
    await closeDB();
    console.log("\n🔌 Database connection closed.");
  }
};

// Run the seeder
seedHematological()
  .then(() => {
    console.log("✅ Hematological seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

