/*
  # Add display order to document types

  1. Changes
    - Add `display_order` column to `document_types` table
    - Set priority order with most important documents first
    - "Autre Document" is placed last as requested
  
  2. Display Order (by importance)
    1. Carte Nationale d'Identité (CNI) - Most important ID
    2. Passeport - International travel document
    3. Permis de Conduire - Driving license
    4. Carte CHIFAA - Health insurance
    5. Carte d'Étudiant - Student ID
    6. Carte Bancaire - Bank card
    7. BADGE Professionnel - Professional badge
    8. Autre Document - Other documents (last)
  
  3. Indexes
    - Add index on display_order for efficient sorting
*/

-- Add display_order column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_types' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE document_types ADD COLUMN display_order integer DEFAULT 999;
  END IF;
END $$;

-- Set display order for each document type
UPDATE document_types SET display_order = 1 WHERE name_fr = 'Carte Nationale d''Identité (CNI)';
UPDATE document_types SET display_order = 2 WHERE name_fr = 'Passeport';
UPDATE document_types SET display_order = 3 WHERE name_fr = 'Permis de Conduire';
UPDATE document_types SET display_order = 4 WHERE name_fr = 'Carte CHIFAA';
UPDATE document_types SET display_order = 5 WHERE name_fr = 'Carte d''Étudiant';
UPDATE document_types SET display_order = 6 WHERE name_fr = 'Carte Bancaire';
UPDATE document_types SET display_order = 7 WHERE name_fr = 'BADGE Professionnel';
UPDATE document_types SET display_order = 8 WHERE name_fr = 'Autre Document';

-- Create index for efficient sorting
CREATE INDEX IF NOT EXISTS idx_document_types_display_order 
  ON document_types(display_order);

-- Add comment for documentation
COMMENT ON COLUMN document_types.display_order IS 'Order for displaying document types, lower numbers appear first. "Autre Document" should always be last.';
