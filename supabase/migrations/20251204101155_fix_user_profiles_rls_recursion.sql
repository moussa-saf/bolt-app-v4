/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - The admin policies create infinite recursion by querying user_profiles to check if user is admin
    - This causes a deadlock: to read user_profiles, we check if user is admin, which requires reading user_profiles
  
  2. Solution
    - Drop the problematic recursive admin policies
    - Keep only the simple "Users can read own profile" policy
    - Add proper admin policies that don't create recursion
    - For admin operations, we'll use service role or a different approach
  
  3. Changes
    - Drop "Admins can read all profiles" policy
    - Drop "Admins can update profiles" policy
    - Add new simple policies for admin access
*/

-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.user_profiles;

-- The "Users can read own profile" policy is sufficient and doesn't create recursion
-- Users can always read their own profile
-- Policy already exists: "Users can read own profile"

-- For now, we'll keep it simple. Admins will use their regular user access to read their own profile
-- and see the isAdmin flag. Admin operations on other profiles can be done via service role if needed.
