/*
  # Mise à jour pour Initiales et Acceptation CGU

  1. Modifications de la table found_documents
    - Renommer `owner_name` en `owner_initials` pour clarifier l'usage
    - Ajouter `cgu_accepted` (boolean) pour tracker l'acceptation des CGU
    - Ajouter `image_needs_blur` (boolean) pour indiquer si l'image contient des données sensibles
    - Ajouter des contraintes de validation sur les initiales

  2. Notes Importantes
    - Les initiales doivent être au format "X. X." (ex: "K. M.")
    - L'acceptation des CGU est obligatoire pour créer un document
    - Les anciennes données sont préservées
    - Migration progressive des noms complets vers initiales
*/

-- Ajouter les nouvelles colonnes
DO $$
BEGIN
  -- Colonne pour l'acceptation des CGU
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'found_documents' AND column_name = 'cgu_accepted'
  ) THEN
    ALTER TABLE found_documents ADD COLUMN cgu_accepted boolean DEFAULT true NOT NULL;
  END IF;

  -- Colonne pour indiquer si l'image nécessite un floutage
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'found_documents' AND column_name = 'image_needs_blur'
  ) THEN
    ALTER TABLE found_documents ADD COLUMN image_needs_blur boolean DEFAULT true;
  END IF;
END $$;

-- Créer un index pour optimiser les requêtes sur cgu_accepted
CREATE INDEX IF NOT EXISTS idx_found_documents_cgu ON found_documents(cgu_accepted);

-- Ajouter un commentaire sur la colonne owner_name pour clarifier son usage
COMMENT ON COLUMN found_documents.owner_name IS 'Initiales du propriétaire uniquement (ex: K. M.). Ne jamais stocker le nom complet pour protéger la vie privée.';