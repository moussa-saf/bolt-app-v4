/*
  # Correction: Permettre aux admins de voir tous les témoignages
  
  1. Problème identifié
    - Les admins ne peuvent pas voir les témoignages en attente de modération
    - La politique RLS actuelle ne permet que la lecture des témoignages approuvés
  
  2. Solution
    - Ajout d'une politique SELECT pour les admins afin qu'ils puissent voir tous les témoignages
    - Cela permet le bon fonctionnement du dashboard admin
  
  3. Sécurité
    - Seuls les utilisateurs avec le rôle admin peuvent voir les témoignages non approuvés
    - Les utilisateurs normaux continuent de voir uniquement les témoignages approuvés
*/

-- Ajouter une politique pour permettre aux admins de voir tous les témoignages
CREATE POLICY "Admins can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (is_admin());
