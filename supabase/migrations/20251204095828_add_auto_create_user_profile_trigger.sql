/*
  # Création automatique des profils utilisateurs

  1. Fonction et Trigger
    - Crée une fonction qui crée automatiquement un profil dans `user_profiles` quand un utilisateur s'inscrit
    - Ajoute un trigger sur `auth.users` pour appeler cette fonction
  
  2. Sécurité
    - Le profil est créé avec `is_admin = false` par défaut
    - Seul le superadmin peut modifier le statut admin

  3. Notes importantes
    - Ce trigger garantit que chaque utilisateur aura automatiquement un profil
    - Le trigger s'exécute après l'insertion dans auth.users
*/

-- Créer la fonction qui crée automatiquement le profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, is_admin)
  VALUES (new.id, new.email, false)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger qui appelle la fonction lors de l'inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Créer les profils pour tous les utilisateurs existants qui n'en ont pas
INSERT INTO public.user_profiles (id, email, is_admin)
SELECT id, email, false
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.users.id
)
ON CONFLICT (id) DO NOTHING;