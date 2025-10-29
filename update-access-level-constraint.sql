-- Update profiles.access_level CHECK constraint to allow 1..5 (adds 5 = blocked)
DO $$
DECLARE
  constraint_record record;
BEGIN
  -- Drop existing CHECK constraints on access_level
  FOR constraint_record IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE rel.relname = 'profiles'
      AND nsp.nspname = 'public'
      AND con.contype = 'c'
      AND pg_catalog.pg_get_constraintdef(con.oid, true) LIKE '%access_level%'
  LOOP
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS %I', constraint_record.conname);
  END LOOP;

  -- Add new CHECK constraint allowing 1-5
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_access_level_check
    CHECK (access_level IN (1, 2, 3, 4, 5));
END;
$$;

-- Optional: verify
-- SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'profiles_access_level_check';
-- Script to update access_level constraint to support level 4 (Without Buttons)
-- This script updates the CHECK constraint on existing tables

-- Drop the existing constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_access_level_check;

-- Add the new constraint that includes level 4
ALTER TABLE public.profiles ADD CONSTRAINT profiles_access_level_check CHECK (access_level IN (1, 2, 3, 4));

-- Verify the constraint was updated
SELECT
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
  AND conname = 'profiles_access_level_check';

-- Show all users and their access levels
SELECT 
  id, 
  email, 
  name, 
  role, 
  is_approved, 
  access_level, 
  created_at 
FROM public.profiles 
ORDER BY created_at DESC;

