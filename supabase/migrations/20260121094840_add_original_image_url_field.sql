/*
  # Add original image URL field for admin access

  1. Changes
    - Add `original_image_url` column to `found_documents` table
    - This will store the unblurred version of document images
    - Only accessible by administrators
  
  2. Security
    - Regular users see the blurred image via `image_url`
    - Administrators can access the original via `original_image_url`
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'found_documents' AND column_name = 'original_image_url'
  ) THEN
    ALTER TABLE found_documents ADD COLUMN original_image_url text;
  END IF;
END $$;
