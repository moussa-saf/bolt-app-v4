/*
  # Système de Témoignages et Statistiques

  1. Nouvelle Table
    - `testimonials` - Témoignages et remerciements des personnes ayant récupéré leur document
      - `id` (uuid, clé primaire)
      - `found_document_id` (uuid, référence à found_documents)
      - `claimer_name` (texte, prénom ou initiales de la personne)
      - `message` (texte, message de remerciement)
      - `rating` (integer, note de 1 à 5)
      - `is_approved` (boolean, modération)
      - `created_at` (timestamp)

  2. Modifications
    - Ajout d'une colonne `testimonial_submitted` sur `found_documents` pour tracker si un témoignage a été soumis
    - Index pour optimiser les requêtes

  3. Sécurité
    - Enable RLS sur la table testimonials
    - Politique pour lecture publique des témoignages approuvés
    - Politique pour insertion publique
    - Protection contre le spam (un seul témoignage par document)

  4. Notes Importantes
    - Les témoignages nécessitent une approbation avant publication
    - Système de notation pour mesurer la satisfaction
    - Affichage public pour encourager l'utilisation de la plateforme
*/

-- Création de la table testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  found_document_id uuid REFERENCES found_documents(id) ON DELETE CASCADE NOT NULL,
  claimer_name text NOT NULL,
  message text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Ajout de la colonne testimonial_submitted sur found_documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'found_documents' AND column_name = 'testimonial_submitted'
  ) THEN
    ALTER TABLE found_documents ADD COLUMN testimonial_submitted boolean DEFAULT false;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour testimonials
CREATE POLICY "Anyone can view approved testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Anyone can submit testimonials"
  ON testimonials FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique pour permettre la mise à jour du champ testimonial_submitted
CREATE POLICY "Anyone can update testimonial status on documents"
  ON found_documents FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_testimonials_document ON testimonials(found_document_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_found_documents_testimonial ON found_documents(testimonial_submitted);

-- Contrainte unique pour éviter les doublons de témoignages
CREATE UNIQUE INDEX IF NOT EXISTS idx_testimonials_unique_document 
  ON testimonials(found_document_id);