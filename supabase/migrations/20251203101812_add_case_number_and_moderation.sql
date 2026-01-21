/*
  # Add Case Number, Duplicate Detection and Moderation System

  ## Overview
  This migration adds three critical features to improve document management:
  1. Automatic case number generation for tracking
  2. Duplicate detection capabilities
  3. Moderation workflow for document approval

  ## Changes

  ### 1. New Columns Added to `found_documents`
  - `case_number` (text, unique, auto-generated)
    - Format: DOC-YYYY-NNNNN (e.g., DOC-2024-00001)
    - Automatically generated using sequence and trigger
    - Indexed for fast lookups
  
  - `is_approved` (boolean, default false)
    - Controls document visibility on the platform
    - Documents must be approved before appearing in public listings
    - Enables moderation workflow
  
  - `approved_at` (timestamptz, nullable)
    - Tracks when document was approved
    - Useful for audit trail
  
  - `approved_by` (text, nullable)
    - Records who approved the document
    - Can store admin identifier

  ### 2. Database Objects Created

  #### Sequence
  - `found_documents_case_seq`: Generates sequential numbers for case_number

  #### Function
  - `generate_case_number()`: Automatically creates formatted case number
    - Triggers before INSERT on found_documents
    - Format: DOC-YYYY-NNNNN
    - Year updates automatically
    - Numbers are padded to 5 digits

  #### Trigger
  - `set_case_number`: Executes generate_case_number() before each insert

  #### Indexes
  - `idx_found_documents_case_number`: Fast case number lookups
  - `idx_found_documents_is_approved`: Efficient filtering of approved documents
  - `idx_found_documents_duplicate_check`: Composite index for duplicate detection
    - Covers: document_type_id, document_number, wilaya_id, status
    - Optimizes duplicate queries

  ### 3. Function for Duplicate Detection
  - `check_duplicate_document()`: Returns potential duplicates
    - Parameters: document_type_id, document_number, wilaya_id
    - Returns matching documents (excluding returned status)
    - Helps prevent duplicate submissions

  ## Security
  - No RLS changes needed (existing policies still apply)
  - Moderation field accessible for filtering
  - Functions are SECURITY DEFINER for proper access

  ## Important Notes
  - Existing documents will NOT have case numbers (NULL values)
  - Only new documents will get auto-generated case numbers
  - Documents require approval (is_approved = true) to be visible
  - Duplicate check is advisory, not enforced by constraint
*/

-- Add new columns to found_documents table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'found_documents' AND column_name = 'case_number'
  ) THEN
    ALTER TABLE found_documents ADD COLUMN case_number text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'found_documents' AND column_name = 'is_approved'
  ) THEN
    ALTER TABLE found_documents ADD COLUMN is_approved boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'found_documents' AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE found_documents ADD COLUMN approved_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'found_documents' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE found_documents ADD COLUMN approved_by text;
  END IF;
END $$;

-- Create sequence for case numbers
CREATE SEQUENCE IF NOT EXISTS found_documents_case_seq START 1;

-- Create function to generate case number
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.case_number := 'DOC-' || 
                     TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || 
                     LPAD(nextval('found_documents_case_seq')::text, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate case number
DROP TRIGGER IF EXISTS set_case_number ON found_documents;
CREATE TRIGGER set_case_number
  BEFORE INSERT ON found_documents
  FOR EACH ROW
  EXECUTE FUNCTION generate_case_number();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_found_documents_case_number 
  ON found_documents(case_number);

CREATE INDEX IF NOT EXISTS idx_found_documents_is_approved 
  ON found_documents(is_approved);

CREATE INDEX IF NOT EXISTS idx_found_documents_duplicate_check 
  ON found_documents(document_type_id, document_number, wilaya_id, status);

-- Create function to check for duplicates
CREATE OR REPLACE FUNCTION check_duplicate_document(
  p_document_type_id text,
  p_document_number text,
  p_wilaya_id int
)
RETURNS TABLE(
  id text,
  case_number text,
  owner_name text,
  found_date date,
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fd.id,
    fd.case_number,
    fd.owner_name,
    fd.found_date,
    fd.status
  FROM found_documents fd
  WHERE fd.document_type_id = p_document_type_id
    AND fd.document_number = p_document_number
    AND fd.wilaya_id = p_wilaya_id
    AND fd.status != 'returned'
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;