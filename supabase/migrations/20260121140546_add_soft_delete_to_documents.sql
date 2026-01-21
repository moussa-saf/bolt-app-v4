/*
  # Ajouter la suppression logique (soft delete) aux documents

  1. Modifications
    - Ajouter la colonne `is_deleted` à la table `found_documents`
    - Définir la valeur par défaut à `false`
    - Ajouter un index pour améliorer les performances des requêtes

  2. Sécurité
    - Les utilisateurs peuvent supprimer leurs propres documents
    - Les administrateurs peuvent supprimer n'importe quel document
*/

-- Ajouter la colonne is_deleted
ALTER TABLE found_documents 
ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false NOT NULL;

-- Créer un index pour améliorer les performances des requêtes filtrant les documents non supprimés
CREATE INDEX IF NOT EXISTS idx_found_documents_is_deleted 
ON found_documents(is_deleted) 
WHERE is_deleted = false;

-- Créer un index composite pour les requêtes courantes
CREATE INDEX IF NOT EXISTS idx_found_documents_status_deleted 
ON found_documents(status, is_deleted) 
WHERE is_deleted = false;