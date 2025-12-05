import dotenv from "dotenv";
import { db } from "../src/config/db.drizzle.js";
import { cardiac } from "../src/db/schemas/cardiac.schema.js";
import { eq } from "drizzle-orm";
import connectDB from "../src/database/connection.js";
import { closeDB } from "../src/database/connection.js";

// Load environment variables
dotenv.config();

const seedCardiac = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully.");

    // Cardiac Assessment options
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
      { name: 'Implanted Paracentiesis Drain:' },
      { name: 'Other:' }
    ];

    console.log("Seeding cardiac options...");
    let insertedCount = 0;
    let skippedCount = 0;
    
    for (const cardiacItem of cardiacs) {
      try {
        // Check if it already exists
        const existing = await db.select()
          .from(cardiac)
          .where(eq(cardiac.name, cardiacItem.name))
          .limit(1);
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${cardiacItem.name}" - already exists`);
          skippedCount++;
          continue;
        }
        
        // Insert new record
        const now = new Date();
        await db.insert(cardiac).values({
          name: cardiacItem.name,
          createdAt: now,
          updatedAt: now,
        });
        
        console.log(`✅ Inserted: "${cardiacItem.name}"`);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Error inserting "${cardiacItem.name}":`, error.message);
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
    const result = await db.select().from(cardiac);
    console.log(`\n📊 Total cardiac options in database: ${result.length}`);
    if (result.length > 0) {
      console.log("Options:", result.map(r => r.name).join(", "));
    }
    
  } catch (error) {
    console.error("❌ Error seeding cardiac data:", error);
    throw error;
  } finally {
    await closeDB();
    console.log("\n🔌 Database connection closed.");
  }
};

// Run the seeder
seedCardiac()
  .then(() => {
    console.log("✅ Cardiac seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

