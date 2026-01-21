/*
  # Ajout du suivi de l'acceptation de la politique de confidentialité

  1. Modifications
    - Ajoute la colonne `privacy_policy_accepted_at` à la table `user_profiles`
    - Cette colonne stocke la date et l'heure d'acceptation de la Loi 18-07
    - NULL = pas encore accepté, NOT NULL = accepté
  
  2. Sécurité
    - Les utilisateurs peuvent mettre à jour leur propre acceptation
    - Les admins peuvent voir qui a accepté la politique
  
  3. Notes importantes
    - Ce champ est obligatoire pour accéder à la plateforme
    - Les utilisateurs existants devront accepter la politique à leur prochaine connexion
    - Conformité avec la Loi 18-07 sur la protection des données personnelles
*/

-- Ajouter la colonne privacy_policy_accepted_at à la table user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'privacy_policy_accepted_at'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN privacy_policy_accepted_at timestamptz DEFAULT NULL;
  END IF;
END $$;

-- Créer un index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_user_profiles_privacy_accepted 
ON public.user_profiles(privacy_policy_accepted_at);

-- Mettre à jour la politique RLS pour permettre aux utilisateurs de mettre à jour leur acceptation
DROP POLICY IF EXISTS "Users can update own privacy acceptance" ON public.user_profiles;
CREATE POLICY "Users can update own privacy acceptance"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);