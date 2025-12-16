-- ScriptFlow Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension (usually already enabled, but just in case)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the scripts table
CREATE TABLE IF NOT EXISTS scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source_url TEXT,
  raw_text TEXT NOT NULL,
  title TEXT NOT NULL,
  content_cn_draft TEXT NOT NULL,
  content_cn_final TEXT,
  content_en TEXT,
  audio_url TEXT,
  status TEXT CHECK (status IN ('new', 'editing', 'done')) DEFAULT 'new',
  tags TEXT[] DEFAULT '{}'
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations for authenticated users
-- Adjust this based on your security requirements
CREATE POLICY "Allow all operations for authenticated users" ON scripts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Alternative: Allow public read/write (for development only)
-- CREATE POLICY "Allow public access" ON scripts
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

