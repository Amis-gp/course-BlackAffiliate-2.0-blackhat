-- Fix registration_requests policies
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Anyone can view registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Admins can view all registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Admins can delete registration requests" ON public.registration_requests;

-- Create correct policies for registration_requests table
CREATE POLICY "Allow anonymous insert" ON public.registration_requests
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated insert" ON public.registration_requests
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can view all" ON public.registration_requests
  FOR SELECT USING (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can delete" ON public.registration_requests
  FOR DELETE USING (
    (auth.jwt() ->> 'role') = 'admin'
  );

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'registration_requests';