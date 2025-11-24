-- Migration to fix user_id type in user_has_roles table from bigint to text for Better Auth compatibility
-- This script can be run directly on the Render database to fix the issue

DO $
$ 
DECLARE 
    constraint_name text;
BEGIN
    -- Check current column type
    IF EXISTS (
        SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'user_has_roles'
        AND column_name = 'user_id'
        AND data_type = 'bigint'
    ) THEN
        RAISE NOTICE 'user_id column is currently bigint, converting to text...';

    -- Drop the primary key constraint
    ALTER TABLE user_has_roles DROP CONSTRAINT IF EXISTS user_has_roles_pkey;

    -- Add new text column for user_id
    ALTER TABLE user_has_roles ADD COLUMN
    IF NOT EXISTS new_user_id TEXT;

-- Populate new_user_id with string versions of existing user_ids
UPDATE user_has_roles SET new_user_id = CAST(user_id AS TEXT) WHERE new_user_id IS NULL;

-- Drop old user_id column
ALTER TABLE user_has_roles DROP COLUMN IF EXISTS user_id;

-- Rename new_user_id to user_id
ALTER TABLE user_has_roles RENAME COLUMN new_user_id TO user_id;

-- Add primary key constraint back
ALTER TABLE user_has_roles ADD PRIMARY KEY (user_id, role_id);

RAISE NOTICE 'Successfully converted user_id column from bigint to text';
    ELSE
        RAISE NOTICE 'user_id column is already text or does not exist';
END
IF;
END $$;