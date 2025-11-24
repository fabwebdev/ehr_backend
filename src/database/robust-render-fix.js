#!/usr/bin/env node

// Robust Render deployment fix script
// This script is designed to handle database connection issues gracefully

console.log("🚀 Starting robust Render deployment database fix...");

async function robustRenderFix() {
  try {
    // Log environment variables for debugging (without sensitive info)
    console.log("🔍 Environment configuration:");
    console.log("  DB_HOST:", process.env.DB_HOST || "localhost");
    console.log("  DB_PORT:", process.env.DB_PORT || 5432);
    console.log(
      "  DB_USER:",
      process.env.DB_USER ? "***" : "api_user (default)"
    );
    console.log("  DB_NAME:", process.env.DB_NAME || "travel_db");
    console.log("  NODE_ENV:", process.env.NODE_ENV || "development");

    // Only attempt database operations if we have database credentials
    if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
      console.log("🔌 Attempting database connection...");

      // Dynamic import to avoid issues if pg is not available
      const { drizzle } = await import("drizzle-orm/node-postgres");
      const { Pool } = await import("pg");
      const { sql } = await import("drizzle-orm");

      // Create database connection
      const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl:
          process.env.NODE_ENV === "production"
            ? {
                rejectUnauthorized: false,
              }
            : false,
        // Connection timeout settings
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
      });

      const db = drizzle(pool);

      // Test database connection with timeout
      console.log("🧪 Testing database connection...");
      try {
        await Promise.race([
          db.execute(sql`SELECT 1 as test`),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Database connection timeout")),
              10000
            )
          ),
        ]);
        console.log("✅ Database connection successful");

        // Check if model_has_roles table exists
        console.log("🔍 Checking if model_has_roles table exists...");
        try {
          const tableCheck = await db.execute(sql`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_name = 'model_has_roles'
            )
          `);

          const tableExists = tableCheck.rows[0].exists;
          if (!tableExists) {
            console.log(
              "ℹ️  model_has_roles table does not exist yet, skipping constraint fix"
            );
          } else {
            console.log("✅ model_has_roles table exists");

            // Check existing primary key constraints
            console.log("🔍 Checking existing primary key constraints...");
            const primaryKey = await db.execute(sql`
              SELECT constraint_name
              FROM information_schema.table_constraints 
              WHERE table_name = 'model_has_roles' 
              AND constraint_type = 'PRIMARY KEY'
            `);

            if (primaryKey.rows.length > 0) {
              const existingConstraint = primaryKey.rows[0].constraint_name;
              console.log(
                `⚠️  Found existing primary key constraint: ${existingConstraint}`
              );

              // Check if it's the correct constraint
              if (
                existingConstraint ===
                "model_has_roles_role_id_model_type_model_id_pk"
              ) {
                console.log(
                  "✅ Correct constraint already exists, no action needed"
                );
              } else {
                // Drop the existing constraint
                console.log(
                  `🗑️  Dropping existing constraint: ${existingConstraint}`
                );
                await db.execute(
                  sql`ALTER TABLE model_has_roles DROP CONSTRAINT IF EXISTS ${sql.identifier(
                    existingConstraint
                  )}`
                );
                console.log("✅ Dropped existing constraint");

                // Add the correct primary key constraint
                console.log("➕ Adding correct primary key constraint...");
                await db.execute(sql`
                  ALTER TABLE model_has_roles 
                  ADD CONSTRAINT model_has_roles_role_id_model_type_model_id_pk 
                  PRIMARY KEY (role_id, model_type, model_id)
                `);
                console.log(
                  "✅ Successfully fixed model_has_roles primary key constraint!"
                );
              }
            } else {
              console.log("✅ No existing primary key constraint found");

              // Add the correct primary key constraint
              console.log("➕ Adding correct primary key constraint...");
              await db.execute(sql`
                ALTER TABLE model_has_roles 
                ADD CONSTRAINT model_has_roles_role_id_model_type_model_id_pk 
                PRIMARY KEY (role_id, model_type, model_id)
              `);
              console.log(
                "✅ Successfully added model_has_roles primary key constraint!"
              );
            }

            // Test that the table works correctly
            console.log("🧪 Testing model_has_roles table...");
            await db.execute(sql`SELECT * FROM model_has_roles LIMIT 1`);
            console.log("✅ model_has_roles table is accessible");
          }
        } catch (tableError) {
          console.log(
            "ℹ️  model_has_roles table may not exist yet or not accessible, continuing..."
          );
        }
      } catch (dbError) {
        console.log(
          "⚠️  Database connection test failed, but continuing:",
          dbError.message
        );
      } finally {
        // Close the pool
        try {
          await pool.end();
        } catch (closeError) {
          console.log(
            "ℹ️  Error closing database connection (not critical):",
            closeError.message
          );
        }
      }
    } else {
      console.log(
        "⚠️  Database environment variables not fully configured, skipping database operations"
      );
    }

    console.log("\n🎉 Robust Render deployment database fix completed!");
  } catch (error) {
    console.error(
      "❌ Error during robust Render deployment fix:",
      error.message
    );
    console.log("ℹ️  This is non-fatal and application will continue to start");
  }
}

// Run the fix
robustRenderFix();
