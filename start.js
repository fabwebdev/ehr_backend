#!/usr/bin/env node

// This script runs migrations and the user_has_roles fix, then starts the server
// Used as the main entry point for Render deployment

import fixUserHasRolesTable from "./scripts/fix_user_has_roles.js";
import fixPatientsColumns from "./scripts/fix_patients_columns.js";
import runMigrations from "./scripts/database/migrate.js";
import { spawn } from "child_process";

async function startApplication() {
  try {
    console.log("🚀 Starting application deployment process...");

    // Run database migrations first
    try {
      console.log("📦 Running database migrations...");
      await runMigrations();
      console.log("✅ Database migrations completed!");
    } catch (migrationError) {
      console.error(
        "⚠️  Migration error (continuing anyway):",
        migrationError.message
      );
      // Don't exit - continue with startup even if migrations fail
      // (some tables might already exist)
    }

    // Run the fix scripts
    try {
      const [rolesFixed, patientsFixed] = await Promise.all([
        fixUserHasRolesTable(),
        fixPatientsColumns(),
      ]);
      if (rolesFixed || patientsFixed) {
        console.log("🔧 Database schema was updated");
      } else {
        console.log("✅ Database schema is up to date");
      }
    } catch (fixError) {
      console.error(
        "⚠️  Fix script error (continuing anyway):",
        fixError.message
      );
    }

    // Now start the server
    console.log("🔄 Starting server...");

    // Add a small delay to ensure Render recognizes the app as starting
    setTimeout(() => {
      // Spawn the server process
      const server = spawn("node", ["server.js"], { stdio: "inherit" });

      // Handle server exit
      server.on("close", (code) => {
        console.log(`Server process exited with code ${code}`);
        process.exit(code);
      });

      // Handle server errors
      server.on("error", (error) => {
        console.error("Failed to start server:", error);
        process.exit(1);
      });
    }, 1000);
  } catch (error) {
    console.error("❌ Error in deployment process:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// Run the deployment process
startApplication();
