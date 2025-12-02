-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  access_level INTEGER NOT NULL DEFAULT 1 CHECK (access_level IN (1, 2, 3, 4, 5, 6)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add updated_at column and trigger for profiles table
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  EXCEPTION
    WHEN duplicate_column THEN
      RAISE NOTICE 'column updated_at already exists in profiles.';
  END;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;
CREATE TRIGGER on_profile_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

-- Function to get user role securely
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
DECLARE
  role_val TEXT;
BEGIN
  IF current_setting('rls.is_role_check', true) = 'true' THEN
    RETURN NULL;
  END IF;
  PERFORM set_config('rls.is_role_check', 'true', true);
  SELECT role INTO role_val FROM public.profiles WHERE id = auth.uid();
  PERFORM set_config('rls.is_role_check', 'false', true);
  RETURN role_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Allow insert for all users" ON profiles;
CREATE POLICY "Allow insert for all users" ON profiles
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (get_my_role() = 'admin');

-- Trigger to create a profile for a new user

-- Drop all known versions of triggers and functions to ensure a clean slate.
-- Drop triggers first to remove dependencies on functions.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;

-- Now drop the functions.
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.on_auth_user_created();

-- This is the definitive function to create a profile for a new user.
CREATE OR REPLACE FUNCTION on_auth_user_created()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Check if a profile with the given email already exists.
  -- This prevents errors if an invite is sent to an existing user.
  IF EXISTS(SELECT 1 FROM public.profiles WHERE email = new.email) THEN
    RAISE WARNING 'A profile with email % already exists. Skipping profile creation.', new.email;
    RETURN new;
  END IF;

  -- Determine the user's name from metadata, or fall back to the email.
  user_name := COALESCE(new.raw_user_meta_data->>'name', new.email, 'New User');

  -- Insert the new profile.
  INSERT INTO public.profiles (id, email, name, role, is_approved, access_level)
  VALUES (new.id, new.email, user_name, 'user', false, 1);

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any other unexpected errors.
    RAISE NOTICE 'An error occurred in on_auth_user_created: %', SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This is the definitive trigger that calls the function.
CREATE TRIGGER handle_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION on_auth_user_created();

-- Create registration_requests table
CREATE TABLE IF NOT EXISTS registration_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for registration_requests
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for registration_requests
DROP POLICY IF EXISTS "Anyone can insert registration requests" ON registration_requests;
CREATE POLICY "Anyone can insert registration requests" ON registration_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all registration requests" ON registration_requests;
CREATE POLICY "Admins can view all registration requests" ON registration_requests
  FOR SELECT USING (get_my_role() = 'admin');

DROP POLICY IF EXISTS "Admins can delete registration requests" ON registration_requests;
CREATE POLICY "Admins can delete registration requests" ON registration_requests
  FOR DELETE USING (get_my_role() = 'admin');

-- Insert admin user (replace with your email)
-- Note: This should be done through Supabase Auth UI or API, not directly in SQL
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (
--   gen_random_uuid(),
--   'admin@example.com',
--   crypt('admin123', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW()
-- ) ON CONFLICT (email) DO NOTHING;

-- Insert admin profile
-- Note: After creating admin user through Supabase Auth, update their role:
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'your-admin@email.com');
-- Or use this when you know the admin user ID:
-- INSERT INTO profiles (id, name, role)
-- SELECT id, 'Admin User', 'admin'
-- FROM auth.users
-- WHERE email = 'admin@example.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';