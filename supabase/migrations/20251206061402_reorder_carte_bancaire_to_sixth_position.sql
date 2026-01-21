/*
  # Reorder Carte Bancaire to sixth position

  1. Changes
    - Move Carte Bancaire from first to sixth position (display_order = 6)
    - Adjust other document types accordingly
  
  2. New Display Order
    1. Carte Nationale d'Identité (CNI) - National ID
    2. Passeport - Passport
    3. Permis de Conduire - Driving license
    4. Carte CHIFAA - Health insurance
    5. Carte d'Étudiant - Student ID
    6. Carte Bancaire - Bank card (moved to sixth)
    7. BADGE Professionnel - Professional badge
    8. Autre Document - Other documents (last)
*/

UPDATE document_types SET display_order = 1 WHERE name_fr = 'Carte Nationale d''Identité (CNI)';
UPDATE document_types SET display_order = 2 WHERE name_fr = 'Passeport';
UPDATE document_types SET display_order = 3 WHERE name_fr = 'Permis de Conduire';
UPDATE document_types SET display_order = 4 WHERE name_fr = 'Carte CHIFAA';
UPDATE document_types SET display_order = 5 WHERE name_fr = 'Carte d''Étudiant';
UPDATE document_types SET display_order = 6 WHERE name_fr = 'Carte Bancaire';
UPDATE document_types SET display_order = 7 WHERE name_fr = 'BADGE Professionnel';
UPDATE document_types SET display_order = 8 WHERE name_fr = 'Autre Document';
