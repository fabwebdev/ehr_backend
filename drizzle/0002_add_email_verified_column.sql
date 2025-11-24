-- Add emailVerified column to users table if it is missing
ALTER TABLE IF EXISTS users
ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false;
