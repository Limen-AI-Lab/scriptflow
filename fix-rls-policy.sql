-- Fix RLS Policy for Public Access
-- This allows anonymous users (using anon key) to read and write scripts
-- Run this in your Supabase SQL Editor

-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON scripts;

-- Create a new policy that allows public access (for development)
-- This allows anyone using the anon key to read and write
CREATE POLICY "Allow public access to scripts" ON scripts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'scripts';


