-- SQL команда для додавання адміністратора
-- Виконайте цю команду в Supabase SQL Editor після створення користувача через Authentication UI

-- Крок 1: Спочатку створіть користувача через Supabase Dashboard:
-- Authentication -> Users -> "Add user"
-- Email: stepan@advantage-agency.co
-- Password: admin123

-- Крок 2: Виконайте цю SQL команду для встановлення ролі адміністратора
UPDATE public.profiles 
SET role = 'admin', is_approved = true 
WHERE email = 'stepan@advantage-agency.co';

-- Крок 3: Якщо профіль не існує, створіть його
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

-- Крок 4: Перевірте що адміністратор створений
SELECT 
  p.email,
  p.name,
  p.role,
  p.is_approved,
  p.created_at
FROM public.profiles p
WHERE p.email = 'stepan@advantage-agency.co';

-- Альтернативний варіант: створення адміністратора одразу через SQL (якщо потрібно)
-- Розкоментуйте наступні рядки якщо хочете створити користувача повністю через SQL:

/*
-- Вставка користувача в auth.users (потребує admin права)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role
) VALUES (
  gen_random_uuid(),
  'stepan@advantage-agency.co',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  'authenticated'
);

-- Створення профілю
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
  'Admin User',
  'admin',
  true,
  NOW()
FROM auth.users u
WHERE u.email = 'stepan@advantage-agency.co';
*/