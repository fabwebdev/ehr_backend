-- Migration script to change audit_logs.user_id from bigint to text
-- This is needed because users.id is a text (nanoid) field, not a bigint

-- Step 1: Drop the foreign key constraint temporarily
ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_users_id_fk;

-- Step 2: Change the column type from bigint to text
ALTER TABLE audit_logs ALTER COLUMN user_id TYPE text USING user_id::text;

-- Step 3: Re-add the foreign key constraint
ALTER TABLE audit_logs 
  ADD CONSTRAINT audit_logs_user_id_users_id_fk 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE SET NULL 
  ON UPDATE CASCADE;

-- Verify the change
SELECT 
  column_name, 
  data_type, 
  character_maximum_length
FROM information_schema.columns
WHERE table_name = 'audit_logs' 
  AND column_name = 'user_id';

