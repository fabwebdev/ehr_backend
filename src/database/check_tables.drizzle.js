import { db } from '../config/db.drizzle.js';
import { sql } from 'drizzle-orm';

async function checkTables() {
  try {
    console.log('Checking existing tables in the database...');
    
    // Query to get all table names
    const result = await db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`
    );
    
    console.log('Existing tables:');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    console.log(`\nTotal tables found: ${result.rows.length}`);
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables();