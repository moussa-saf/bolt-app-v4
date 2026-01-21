/*
  # Add admin read permissions for reference tables

  1. Problem
    - Admins need to read document_types and wilayas to populate edit forms
    - Currently no SELECT policies exist for these tables
  
  2. Solution
    - Add SELECT policies for authenticated users on reference tables
    - These are read-only reference data that all authenticated users should be able to see
  
  3. Security
    - Only SELECT permission, no modification rights
    - Available to all authenticated users
*/

-- Allow authenticated users to read document types
CREATE POLICY "Authenticated users can read document types"
  ON public.document_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to read wilayas
CREATE POLICY "Authenticated users can read wilayas"
  ON public.wilayas
  FOR SELECT
  TO authenticated
  USING (true);
