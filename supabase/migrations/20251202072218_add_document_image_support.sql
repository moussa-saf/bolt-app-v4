/*
  # Ajout du support des images pour les documents trouvés

  1. Modifications
    - Ajout d'une colonne 'image_url' à la table 'found_documents' pour stocker l'URL de l'image scannée
    - Création du bucket de stockage Supabase pour les images des documents
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'found_documents' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE found_documents ADD COLUMN image_url text;
  END IF;
END $$;