-- Тимчасово відключити RLS для registration_requests
ALTER TABLE public.registration_requests DISABLE ROW LEVEL SECURITY;

-- Альтернативно: створити більш дозвільну політику
-- DROP POLICY IF EXISTS "Allow anonymous insert" ON public.registration_requests;
-- DROP POLICY IF EXISTS "Allow authenticated insert" ON public.registration_requests;
-- DROP POLICY IF EXISTS "Admins can view all" ON public.registration_requests;
-- DROP POLICY IF EXISTS "Admins can delete" ON public.registration_requests;

-- CREATE POLICY "Allow all operations" ON public.registration_requests
--   FOR ALL USING (true) WITH CHECK (true);

-- Перевірити стан RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'registration_requests';