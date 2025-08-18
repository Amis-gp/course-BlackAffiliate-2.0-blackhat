-- Drop existing triggers, functions and policies if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Anyone can view registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Admins can view all registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Admins can delete registration requests" ON public.registration_requests;

-- Enable Row Level Security

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registration_requests table
CREATE TABLE IF NOT EXISTS public.registration_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    (auth.jwt() ->> 'role') = 'admin'
  );

-- Create policies for registration_requests table
CREATE POLICY "Anyone can insert registration requests" ON public.registration_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view registration requests" ON public.registration_requests
  FOR SELECT USING (true);

CREATE POLICY "Admins can view all registration requests" ON public.registration_requests
  FOR SELECT USING (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can delete registration requests" ON public.registration_requests
  FOR DELETE USING (
    (auth.jwt() ->> 'role') = 'admin'
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, is_approved)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'user', false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create admin user manually through Supabase Auth UI first
-- Then run this script to set admin role

-- Step 1: Go to Supabase Dashboard -> Authentication -> Users -> Add user
-- Create user with email: stepan@advantage-agency.co and password: admin123

-- Step 2: Run this query to set admin role
UPDATE public.profiles 
SET role = 'admin', is_approved = true 
WHERE email = 'stepan@advantage-agency.co';

-- Step 3: If profile doesn't exist, create it
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