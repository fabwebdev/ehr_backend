-- Migration to fix model_has_roles primary key constraint conflict
-- This migration handles the case where the primary key constraint already exists with a different name

-- First, drop any existing primary key constraint with a different name
-- This is a simplified approach that should work in most cases
ALTER TABLE "model_has_roles" DROP CONSTRAINT IF EXISTS "model_has_roles_pkey";

-- Add the correctly named primary key constraint
ALTER TABLE "model_has_roles" ADD CONSTRAINT "model_has_roles_role_id_model_type_model_id_pk" PRIMARY KEY("role_id","model_type","model_id");