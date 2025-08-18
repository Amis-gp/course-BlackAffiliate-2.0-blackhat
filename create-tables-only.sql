-- Створення таблиць без залежностей від auth.users
-- Виконайте цей скрипт першим у Supabase Dashboard -> SQL Editor

-- Створюємо таблицю profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Створюємо таблицю registration_requests
CREATE TABLE IF NOT EXISTS public.registration_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Увімкнути Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

-- Створити базові політики для profiles
CREATE POLICY "Enable read access for all users" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.profiles
  FOR UPDATE USING (true);

-- Створити базові політики для registration_requests
CREATE POLICY "Enable read access for all users" ON public.registration_requests
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.registration_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON public.registration_requests
  FOR DELETE USING (true);

-- Створити адміністратора
INSERT INTO public.profiles (
  email,
  name,
  role,
  is_approved
) VALUES (
  'stepan@advantage-agency.co',
  'Admin User',
  'admin',
  true
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  is_approved = true;

-- Перевірити створення
SELECT * FROM public.profiles WHERE email = 'stepan@advantage-agency.co';
SELECT * FROM public.registration_requests LIMIT 1;