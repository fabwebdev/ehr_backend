import dotenv from "dotenv";
import { db } from "../src/config/db.drizzle.js";
import { endocrine } from "../src/db/schemas/endocrine.schema.js";
import { eq } from "drizzle-orm";
import connectDB from "../src/database/connection.js";
import { closeDB } from "../src/database/connection.js";

// Load environment variables
dotenv.config();

const seedEndocrine = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully.");

    // Endocrine Assessment options
    const endocrines = [
      { name: 'No Problems identified' },
      { name: 'Hypothyroidism:' },
      { name: 'Hyperthyroidism:' },
      { name: 'Diabetes:' },
      { name: 'Other:' }
    ];

    console.log("Seeding endocrine options...");
    let insertedCount = 0;
    let skippedCount = 0;
    
    for (const endocrineItem of endocrines) {
      try {
        // Check if it already exists
        const existing = await db.select()
          .from(endocrine)
          .where(eq(endocrine.name, endocrineItem.name))
          .limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${endocrineItem.name}" - already exists`);
          skippedCount++;
          continue;
        }
        
        // Insert new record
        const now = new Date();
        await db.insert(endocrine).values({
          name: endocrineItem.name,
          createdAt: now,
          updatedAt: now,
        });
        
        console.log(`✅ Inserted: "${endocrineItem.name}"`);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Error inserting "${endocrineItem.name}":`, error.message);
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
    const result = await db.select().from(endocrine);
    console.log(`\n📊 Total endocrine options in database: ${result.length}`);
    if (result.length > 0) {
      console.log("Options:", result.map(r => r.name).join(", "));
    }
    
  } catch (error) {
    console.error("❌ Error seeding endocrine data:", error);
    throw error;
  } finally {
    await closeDB();
    console.log("\n🔌 Database connection closed.");
  }
};

// Run the seeder
seedEndocrine()
  .then(() => {
    console.log("✅ Endocrine seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

