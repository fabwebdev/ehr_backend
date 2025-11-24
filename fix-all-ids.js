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
    console.log('🔄 Step 1: Drop foreign key constraints...');
    await client.query('ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_user_id_fkey');
    await client.query('ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey');
    console.log('✅ Done');

    console.log('🔄 Step 2: Convert user_id in accounts to bigint...');
    await client.query('ALTER TABLE accounts ALTER COLUMN user_id TYPE bigint USING user_id::bigint');
    console.log('✅ Done');

    console.log('🔄 Step 3: Convert user_id in sessions to bigint...');
    await client.query('ALTER TABLE sessions ALTER COLUMN user_id TYPE bigint USING user_id::bigint');
    console.log('✅ Done');

    console.log('🔄 Step 4: Convert id in users to bigint...');
    await client.query('ALTER TABLE users ALTER COLUMN id TYPE bigint USING id::bigint');
    console.log('✅ Done');

    console.log('🔄 Step 5: Re-add foreign key constraints...');
    await client.query('ALTER TABLE accounts ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    await client.query('ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    console.log('✅ Done');

    console.log('✅ All ID columns fixed successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Full error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

fixDatabase();