/*
  # Mise à jour des types de documents

  1. Modifications
    - Suppression du type "Acte de Naissance"
    - Ajout du type "Carte CHIFAA"
    - Ajout du type "BADGE Professionnel"
*/

DELETE FROM document_types WHERE name_fr = 'Acte de Naissance';

INSERT INTO document_types (name_fr, name_ar, icon) VALUES
  ('Carte CHIFAA', 'بطاقة الشيفاع', 'CreditCard'),
  ('BADGE Professionnel', 'شارة مهنية', 'Briefcase')
ON CONFLICT DO NOTHING;