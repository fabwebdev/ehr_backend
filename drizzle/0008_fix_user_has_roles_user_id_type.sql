-- Migration to fix user_id type in user_has_roles table from bigint to text for Better Auth compatibility
-- This migration was applied manually through direct database commands

-- Drop the primary key constraint
-- ALTER TABLE user_has_roles DROP CONSTRAINT IF EXISTS user_has_roles_pkey;

-- Add new text column for user_id
-- ALTER TABLE user_has_roles ADD COLUMN new_user_id TEXT;

-- Populate new_user_id with string versions of existing user_ids
-- UPDATE user_has_roles SET new_user_id = CAST(user_id AS TEXT);

-- Drop old user_id column
-- ALTER TABLE user_has_roles DROP COLUMN user_id;

-- Rename new_user_id to user_id
-- ALTER TABLE user_has_roles RENAME COLUMN new_user_id TO user_id;

-- Add primary key constraint back
-- ALTER TABLE user_has_roles ADD PRIMARY KEY (user_id, role_id);

-- Applied changes:
-- 1. Dropped primary key constraint
-- 2. Added new text column
-- 3. Populated new column with string versions of existing data
-- 4. Dropped old column
-- 5. Renamed new column
-- 6. Added primary key constraint back