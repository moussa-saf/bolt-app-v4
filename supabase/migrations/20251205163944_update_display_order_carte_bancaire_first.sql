/*
  # Update display order - Carte Bancaire first

  1. Changes
    - Move Carte Bancaire to first position (display_order = 1)
    - Adjust other document types accordingly
  
  2. New Display Order
    1. Carte Bancaire - Bank card (moved to first)
    2. Carte Nationale d'Identité (CNI) - National ID
    3. Passeport - Passport
    4. Permis de Conduire - Driving license
    5. Carte CHIFAA - Health insurance
    6. Carte d'Étudiant - Student ID
    7. BADGE Professionnel - Professional badge
    8. Autre Document - Other documents (last)
*/

UPDATE document_types SET display_order = 1 WHERE name_fr = 'Carte Bancaire';
UPDATE document_types SET display_order = 2 WHERE name_fr = 'Carte Nationale d''Identité (CNI)';
UPDATE document_types SET display_order = 3 WHERE name_fr = 'Passeport';
UPDATE document_types SET display_order = 4 WHERE name_fr = 'Permis de Conduire';
UPDATE document_types SET display_order = 5 WHERE name_fr = 'Carte CHIFAA';
UPDATE document_types SET display_order = 6 WHERE name_fr = 'Carte d''Étudiant';
UPDATE document_types SET display_order = 7 WHERE name_fr = 'BADGE Professionnel';
UPDATE document_types SET display_order = 8 WHERE name_fr = 'Autre Document';
