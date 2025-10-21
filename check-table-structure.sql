-- Check if access_level column exists in profiles table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check current profiles data
SELECT 
  id, 
  email, 
  name, 
  role, 
  is_approved, 
  created_at,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' 
      AND column_name = 'access_level'
      AND table_schema = 'public'
    ) THEN 'access_level column EXISTS'
    ELSE 'access_level column MISSING'
  END as access_level_status
FROM public.profiles 
LIMIT 3;
