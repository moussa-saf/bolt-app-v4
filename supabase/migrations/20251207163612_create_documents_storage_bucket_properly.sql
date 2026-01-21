/*
  # Création du bucket de stockage pour les documents avec les bonnes permissions

  1. Création du bucket 'documents' pour stocker les images scannées
  2. Configuration des policies de sécurité RLS pour le bucket
     - Lecture publique : Tous peuvent lire les images
     - Upload authentifié : Les utilisateurs authentifiés peuvent uploader
     - Mise à jour propriétaire : Seul le créateur peut modifier ses fichiers
     - Suppression propriétaire : Seul le créateur peut supprimer ses fichiers
*/

-- Créer le bucket s'il n'existe pas déjà
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Policy pour permettre la lecture publique
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documents');

-- Policy pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Policy pour permettre la mise à jour uniquement au propriétaire
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy pour permettre la suppression uniquement au propriétaire
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);