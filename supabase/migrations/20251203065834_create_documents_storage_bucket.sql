/*
  # Création du bucket de stockage pour les documents

  1. Création du bucket 'documents' pour stocker les images scannées
  2. Configuration des policies de sécurité RLS pour le bucket
*/

-- Le bucket est créé via Supabase dashboard ou API
-- Cette migration documente les policies requises
-- Le bucket 'documents' doit être créé manuellement via Supabase dashboard

-- Les policies suivantes sont recommandées :
-- 1. Lecture publique : Tous peuvent lire les images
-- 2. Upload authentifié : Les utilisateurs authentifiés peuvent uploader
-- 3. Suppression propriétaire : Seul le créateur peut supprimer