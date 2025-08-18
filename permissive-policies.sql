-- Видалити всі існуючі політики для registration_requests
DROP POLICY IF EXISTS "Anyone can insert registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Anyone can view registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Admins can view all registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Admins can delete registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.registration_requests;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.registration_requests;
DROP POLICY IF EXISTS "Admins can view all" ON public.registration_requests;
DROP POLICY IF EXISTS "Admins can delete" ON public.registration_requests;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.registration_requests;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.registration_requests;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.registration_requests;

-- Створити одну універсальну політику для всіх операцій
CREATE POLICY "Allow all operations for everyone" ON public.registration_requests
  FOR ALL USING (true) WITH CHECK (true);

-- Перевірити політики
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'registration_requests';