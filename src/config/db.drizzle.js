import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

// Ensure DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

// Create PostgreSQL connection pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // Explicitly set password as string (fixes SASL error)
  ...(process.env.DB_PASSWORD && {
    password: String(process.env.DB_PASSWORD)
  })
});

// Test connection
pool.on("connect", () => {
  console.log("✅ PostgreSQL pool connected");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err.message);
  console.error("Check DATABASE_URL environment variable");
});

// Handle pool connection promise rejection
pool.on("remove", () => {
  console.log("🔌 PostgreSQL connection removed from pool");
});

// Create Drizzle ORM instance
const db = drizzle(pool);

export { db, pool };
export default db;