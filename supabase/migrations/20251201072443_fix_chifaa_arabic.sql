/*
  # Correction de la traduction arabe pour Carte CHIFAA

  1. Modifications
    - Correction de la traduction arabe de "Carte CHIFAA" vers "بطاقة الشفاء"
*/

UPDATE document_types 
SET name_ar = 'بطاقة الشفاء' 
WHERE name_fr = 'Carte CHIFAA';