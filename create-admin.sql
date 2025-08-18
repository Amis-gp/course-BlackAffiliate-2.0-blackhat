-- Simple script to create admin user
-- Method 1: Create user using Supabase signup function
SELECT auth.signup(
  'stepan@advantage-agency.co',
  'admin123',
  '{"name": "Admin User"}'
);

-- Method 2: If user already exists, just update the profile
UPDATE public.profiles 
SET role = 'admin', is_approved = true 
WHERE email = 'stepan@advantage-agency.co';

-- Method 3: If profile doesn't exist, create it
INSERT INTO public.profiles (
  id,
  email,
  name,
  role,
  is_approved,
  created_at
) 
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', 'Admin User'),
  'admin',
  true,
  NOW()
FROM auth.users u 
WHERE u.email = 'stepan@advantage-agency.co'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );

-- Verify admin was created
SELECT 
  p.email,
  p.name,
  p.role,
  p.is_approved,
  p.created_at
FROM public.profiles p
WHERE p.email = 'stepan@advantage-agency.co';