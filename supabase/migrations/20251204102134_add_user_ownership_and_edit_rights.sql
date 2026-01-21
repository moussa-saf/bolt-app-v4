/*
  # Add user ownership and edit rights for found documents

  1. Problem
    - Users who find documents cannot edit their own documents
    - No way to track who created a document
    - No UPDATE policy exists for document creators
  
  2. Changes
    - Add `created_by` column to track document creator
    - Add UPDATE policy for users to edit their own documents
    - Existing documents (created_by NULL) can only be edited by admins
  
  3. Security
    - Users can only edit documents they created
    - Admins can edit any document
    - Anonymous documents (created_by IS NULL) require admin to edit
*/

-- Add created_by column to track document creator
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'found_documents' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE found_documents ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_found_documents_created_by 
  ON found_documents(created_by);

-- Add comment for documentation
COMMENT ON COLUMN found_documents.created_by IS 'User who created this document report. NULL for anonymous reports.';

-- Add policy for users to update their own documents
CREATE POLICY "Users can update their own documents"
  ON public.found_documents
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Update the INSERT policy to automatically set created_by
-- First, drop the old policy
DROP POLICY IF EXISTS "Anyone can report found documents" ON found_documents;

-- Create new policy that allows both authenticated and anonymous users
CREATE POLICY "Anyone can report found documents"
  ON public.found_documents
  FOR INSERT
  TO public
  WITH CHECK (
    -- If user is authenticated, created_by must match their ID or be NULL
    -- If user is anonymous, created_by must be NULL
    CASE 
      WHEN auth.uid() IS NOT NULL THEN created_by = auth.uid() OR created_by IS NULL
      ELSE created_by IS NULL
    END
  );
