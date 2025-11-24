import { db, pool } from "../config/db.drizzle.js";

const connectDB = async () => {
  try {
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    console.log("🔌 Connecting to database...");

    // Test connection using the pool from db.drizzle.js
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();

    console.log("✅ Database connected successfully");
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);

    return db;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    if (process.env.NODE_ENV === "production") {
      console.log(
        "⚠️  Application will continue running without database connection."
      );
      console.log(
        "🔍 Please check your DATABASE_URL environment variable on Render."
      );
      return null;
    } else {
      console.error(
        "🛑 Exiting in development mode. Please fix database connection."
      );
      process.exit(1);
    }
  }
};

// Graceful shutdown
const closeDB = async () => {
  if (pool) {
    await pool.end();
    console.log("🔌 Database connection closed");
  }
};

// Export functions and db instance
export default connectDB;
export { db, closeDB };
