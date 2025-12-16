-- Fix RLS Policy to allow public access
-- This allows anonymous users (using anon key) to read and write scripts
-- Required for the frontend to work without authentication

-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON scripts;

-- Create a new policy that allows public access (for development)
-- This allows anyone using the anon key to read and write
CREATE POLICY "Allow public access to scripts" ON scripts
  FOR ALL
  USING (true)
  WITH CHECK (true);


