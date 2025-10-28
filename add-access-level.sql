-- Safe script to add access_level column to existing profiles table
-- This script is safe to run on existing data

-- Add access_level column if it doesn't exist
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN access_level INTEGER NOT NULL DEFAULT 1 CHECK (access_level IN (1, 2, 3, 4));
    RAISE NOTICE 'access_level column added successfully';
  EXCEPTION
    WHEN duplicate_column THEN
      RAISE NOTICE 'access_level column already exists, skipping...';
  END;
END;
$$;

-- Update existing users to have access_level = 1 if they don't have it set
UPDATE public.profiles 
SET access_level = 3 
WHERE access_level IS NULL;

-- Verify the changes
SELECT 
  id, 
  email, 
  name, 
  role, 
  is_approved, 
  access_level, 
  created_at 
FROM public.profiles 
LIMIT 5;
