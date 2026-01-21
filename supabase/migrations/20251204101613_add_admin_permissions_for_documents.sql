/*
  # Add admin permissions for document management

  1. Problem
    - Admins cannot view, modify, or delete documents
    - No RLS policies exist on found_documents table
  
  2. Solution
    - Create a helper function to check if user is admin (avoids RLS recursion)
    - Add RLS policies for admins to:
      - Read all documents
      - Update all documents
      - Delete all documents
  
  3. Security
    - Use SECURITY DEFINER function to bypass RLS when checking admin status
    - Only authenticated users can access
    - Policies verify admin status before allowing operations
*/

-- Create a secure function to check if current user is admin
-- SECURITY DEFINER allows it to bypass RLS policies
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;

-- Add RLS policies for admins on found_documents table

-- Admins can read all documents
CREATE POLICY "Admins can read all documents"
  ON public.found_documents
  FOR SELECT
  TO authenticated
  USING (public.is_current_user_admin());

-- Admins can update all documents
CREATE POLICY "Admins can update all documents"
  ON public.found_documents
  FOR UPDATE
  TO authenticated
  USING (public.is_current_user_admin())
  WITH CHECK (public.is_current_user_admin());

-- Admins can delete all documents
CREATE POLICY "Admins can delete all documents"
  ON public.found_documents
  FOR DELETE
  TO authenticated
  USING (public.is_current_user_admin());

-- Also add policies for document_claims table
CREATE POLICY "Admins can read all claims"
  ON public.document_claims
  FOR SELECT
  TO authenticated
  USING (public.is_current_user_admin());

CREATE POLICY "Admins can update all claims"
  ON public.document_claims
  FOR UPDATE
  TO authenticated
  USING (public.is_current_user_admin())
  WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can delete all claims"
  ON public.document_claims
  FOR DELETE
  TO authenticated
  USING (public.is_current_user_admin());
