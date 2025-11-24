import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

async function fixDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  
  try {
    console.log('🔄 Converting emailVerified from timestamp to boolean...');
    await client.query('ALTER TABLE users ALTER COLUMN "emailVerified" TYPE boolean USING (CASE WHEN "emailVerified" IS NOT NULL THEN true ELSE false END)');
    console.log('✅ Done');

    console.log('🔄 Setting default value for emailVerified...');
    await client.query('ALTER TABLE users ALTER COLUMN "emailVerified" SET DEFAULT false');
    console.log('✅ Done');

    console.log('🔄 Converting id from text to bigint...');
    await client.query('ALTER TABLE users ALTER COLUMN id TYPE bigint USING id::bigint');
    console.log('✅ Done');

    console.log('✅ Database fixed successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Full error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

fixDatabase();