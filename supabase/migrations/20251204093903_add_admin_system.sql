/*
  # Add Admin System

  ## Overview
  This migration creates an admin system to manage the platform with role-based access control.

  ## Changes

  ### 1. New Table: `user_profiles`
  - `id` (uuid, primary key) - References auth.users(id)
  - `email` (text) - User's email for display
  - `is_admin` (boolean, default false) - Admin role flag
  - `created_at` (timestamptz) - Account creation date
  - `updated_at` (timestamptz) - Last update date

  ### 2. Security
  - Enable RLS on `user_profiles` table
  - Policy: Users can read their own profile
  - Policy: Only admins can read all profiles
  - Policy: Only admins can update admin status

  ### 3. Functions
  - `is_admin()`: Helper function to check if current user is admin
  - `handle_new_user()`: Automatically create profile for new users

  ## Important Notes
  - First registered user should be manually set as admin via Supabase dashboard
  - Admins can manage documents, testimonials, and user roles
  - Non-admins cannot access admin functions
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy: Admins can update profiles
CREATE POLICY "Admins can update profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically create profile for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, is_admin)
  VALUES (NEW.id, NEW.email, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin 
  ON user_profiles(is_admin);

-- Update found_documents policies to allow admin access
DROP POLICY IF EXISTS "Admins can update any document" ON found_documents;
CREATE POLICY "Admins can update any document"
  ON found_documents
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete any document" ON found_documents;
CREATE POLICY "Admins can delete any document"
  ON found_documents
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Update testimonials policies to allow admin access
DROP POLICY IF EXISTS "Admins can update testimonials" ON testimonials;
CREATE POLICY "Admins can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());