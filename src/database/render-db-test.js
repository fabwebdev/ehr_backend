#!/usr/bin/env node

// Render-specific database connection test

console.log("🚀 Render Database Connection Test");
console.log("=================================");

async function testDatabaseConnection() {
  try {
    console.log("🔍 Checking environment variables...");

    // Check if we're on Render
    const isRender = process.env.RENDER === "true" || process.env.RENDER;
    console.log("Running on Render:", isRender ? "Yes" : "No/Unknown");

    // Check database environment variables
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT || 5432;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME || "travel_db";

    if (!dbHost || !dbUser) {
      console.log("⚠️  Database environment variables are not set!");
      console.log("   DB_HOST:", dbHost || "Not set");
      console.log("   DB_USER:", dbUser || "Not set");
      console.log("   DB_NAME:", dbName);
      console.log(
        "\n   Please set the following environment variables on Render:"
      );
      console.log("   - DB_HOST");
      console.log("   - DB_PORT (optional, defaults to 5432)");
      console.log("   - DB_USER");
      console.log("   - DB_PASSWORD");
      console.log("   - DB_NAME (optional, defaults to travel_db)");
      return;
    }

    console.log("✅ Database environment variables are set");
    console.log("   DB_HOST:", dbHost);
    console.log("   DB_PORT:", dbPort);
    console.log("   DB_USER:", dbUser);
    console.log("   DB_NAME:", dbName);

    console.log("\n🔌 Attempting database connection...");

    // Dynamically import pg
    const { Pool } = await import("pg");

    // Create connection pool
    const pool = new Pool({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      ssl: isRender
        ? {
            rejectUnauthorized: false,
          }
        : false,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });

    // Test connection
    console.log("🧪 Testing connection...");
    const client = await pool.connect();
    console.log("✅ Connected to database successfully!");

    // Run a simple query
    console.log("🔍 Running test query...");
    const result = await client.query("SELECT 1 as test");
    console.log("✅ Test query successful:", result.rows[0]);

    // Check if model_has_roles table exists
    console.log("🔍 Checking for model_has_roles table...");
    try {
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'model_has_roles'
        )
      `);

      const tableExists = tableCheck.rows[0].exists;
      console.log(
        "   model_has_roles table exists:",
        tableExists ? "Yes" : "No"
      );

      if (tableExists) {
        // Check constraints
        console.log("🔍 Checking primary key constraints...");
        const constraintCheck = await client.query(`
          SELECT constraint_name
          FROM information_schema.table_constraints 
          WHERE table_name = 'model_has_roles' 
          AND constraint_type = 'PRIMARY KEY'
        `);

        if (constraintCheck.rows.length > 0) {
          console.log(
            "   Primary key constraint:",
            constraintCheck.rows[0].constraint_name
          );
        } else {
          console.log("   No primary key constraint found");
        }
      }
    } catch (checkError) {
      console.log("   Error checking table:", checkError.message);
    }

    // Release client
    client.release();

    // Close pool
    await pool.end();

    console.log("\n🎉 Database connection test completed successfully!");
  } catch (error) {
    console.error("❌ Database connection test failed:", error.message);
    console.error("Error code:", error.code);

    // Provide specific guidance based on error
    if (error.code === "ENOTFOUND") {
      console.log("\n💡 Troubleshooting tip: DNS resolution failed");
      console.log("   Check that DB_HOST is correct and reachable from Render");
    } else if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Troubleshooting tip: Connection refused");
      console.log(
        "   Check that the database is running and accepting connections on DB_HOST:DB_PORT"
      );
    } else if (error.code === "28P01") {
      console.log("\n💡 Troubleshooting tip: Authentication failed");
      console.log("   Check that DB_USER and DB_PASSWORD are correct");
    } else if (error.code === "3D000") {
      console.log("\n💡 Troubleshooting tip: Database does not exist");
      console.log("   Check that DB_NAME is correct and the database exists");
    }

    console.log(
      "\n📝 Please verify your database connection settings on Render."
    );
  }
}

// Run the test
testDatabaseConnection();
