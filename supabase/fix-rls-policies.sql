-- Fix RLS policies to allow students to insert their own data

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Students can update their own data" ON students;

-- Recreate with proper INSERT permission
CREATE POLICY "Students can insert their own data" ON students
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own data" ON students
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Students can delete their own data" ON students
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Also fix the profiles table to allow users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Make sure email confirmation is not required (optional but recommended for testing)
-- Run this in Supabase Dashboard if needed
