-- Надати роль адміністратора та підтвердити профіль
UPDATE public.profiles
SET
  role = 'admin',
  is_approved = true
WHERE email = 'stepan@advantage-agency.co'; -- <-- ЗАМІНІТЬ НА ВАШ EMAIL

-- Якщо профіль не був створений автоматично, цей запит його створить
INSERT INTO public.profiles (id, email, name, role, is_approved)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', 'Admin'),
  'admin',
  true
FROM auth.users u
WHERE u.email = 'stepan@advantage-agency.co' -- <-- І ТУТ ТАКОЖ ЗАМІНІТЬ
ON CONFLICT (id) DO NOTHING;

-- Перевірка, чи був створений адміністратор
SELECT
  email,
  role,
  is_approved
FROM public.profiles
WHERE email = 'stepan@advantage-agency.co'; -- <-- І ТУТ