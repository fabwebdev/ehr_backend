import { db } from "../config/db.drizzle.js";

// In Drizzle ORM, we don't need to import models or sync them as they're defined in schema files
// and migrations are handled separately

// Test database connection
const syncDatabase = async () => {
    try {
        // Test the connection
        await db.execute('SELECT 1');
        console.log("Database connection has been established successfully.");
        
        // In Drizzle ORM, we don't need to sync models as they're defined in schema files
        // and migrations are handled separately
        console.log("Database models are defined in schema files.");
        console.log("Use 'npm run migrate' to generate migrations and 'npm run migrate:run' to apply them.");
    } catch (error) {
        console.error("Unable to connect to database:", error);
    }
};

// Run the sync if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    syncDatabase();
}

export default syncDatabase;