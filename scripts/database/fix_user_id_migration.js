import { db } from '../config/db.drizzle.js';
import { sql } from 'drizzle-orm';

async function fixUserIdMigration() {
  try {
    console.log('Running user ID fix migration...');
    
    // Execute the migration SQL directly
    await db.execute(sql`
      DO $$ 
      DECLARE 
          constraint_name text;
      BEGIN
          -- Drop foreign key constraints that reference users.id
          ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_user_id_users_id_fk;
          ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_users_id_fk;
          ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_users_id_fk;
          
          -- Add new text column for user ID
          ALTER TABLE users ADD COLUMN IF NOT EXISTS new_id TEXT;
          
          -- Populate new_id with string versions of existing IDs
          UPDATE users SET new_id = id::TEXT WHERE new_id IS NULL;
          
          -- Add new_id column to referencing tables
          ALTER TABLE accounts ADD COLUMN IF NOT EXISTS new_user_id TEXT;
          ALTER TABLE sessions ADD COLUMN IF NOT EXISTS new_user_id TEXT;
          ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS new_user_id TEXT;
          
          -- Populate new columns in referencing tables
          UPDATE accounts SET new_user_id = user_id::TEXT WHERE new_user_id IS NULL;
          UPDATE sessions SET new_user_id = user_id::TEXT WHERE new_user_id IS NULL;
          UPDATE audit_logs SET new_user_id = user_id::TEXT WHERE new_user_id IS NULL AND user_id IS NOT NULL;
          
          -- Drop old columns
          ALTER TABLE users DROP COLUMN IF EXISTS id;
          ALTER TABLE accounts DROP COLUMN IF EXISTS user_id;
          ALTER TABLE sessions DROP COLUMN IF EXISTS user_id;
          ALTER TABLE audit_logs DROP COLUMN IF EXISTS user_id;
          
          -- Rename new columns
          ALTER TABLE users RENAME COLUMN new_id TO id;
          ALTER TABLE accounts RENAME COLUMN new_user_id TO user_id;
          ALTER TABLE sessions RENAME COLUMN new_user_id TO user_id;
          ALTER TABLE audit_logs RENAME COLUMN new_user_id TO user_id;
          
          -- Add primary key constraint to users
          ALTER TABLE users ADD PRIMARY KEY (id);
          
          -- Add foreign key constraints back
          ALTER TABLE accounts ADD CONSTRAINT accounts_user_id_users_id_fk 
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade ON UPDATE no action;
            
          ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_users_id_fk 
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade ON UPDATE no action;
            
          ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_user_id_users_id_fk 
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE set null ON UPDATE cascade;
            
          -- Add unique constraint to users email if not exists
          IF NOT EXISTS (
              SELECT 1 FROM pg_constraint WHERE conname = 'users_email_unique'
          ) THEN
              ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE(email);
          END IF;
      END $$;
    `);
    
    console.log('User ID fix migration completed successfully!');
  } catch (error) {
    console.error('Error running user ID fix migration:', error);
    process.exit(1);
  }
}

fixUserIdMigration();