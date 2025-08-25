-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);



-- Trigger to create a profile for a new user
CREATE OR REPLACE FUNCTION on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, is_approved)
  VALUES (new.id, new.raw_user_meta_data->>'name', 'user', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can delete registration requests" ON registration_requests;
CREATE POLICY "Admins can delete registration requests" ON registration_requests
  FOR DELETE USING (auth.uid() IS NOT NULL);

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