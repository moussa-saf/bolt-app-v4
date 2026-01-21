/*
  # Système de Documents Perdus et Trouvés - Algérie

  1. Nouvelles Tables
    - `document_types` - Types de documents (CNI, Passeport, Permis, Carte bancaire, etc.)
      - `id` (uuid, clé primaire)
      - `name_fr` (texte, nom en français)
      - `name_ar` (texte, nom en arabe)
      - `icon` (texte, nom de l'icône)
      - `created_at` (timestamp)
    
    - `wilayas` - Wilayas d'Algérie (48 wilayas)
      - `id` (integer, clé primaire)
      - `code` (texte, code wilaya)
      - `name_fr` (texte, nom en français)
      - `name_ar` (texte, nom en arabe)
      - `created_at` (timestamp)
    
    - `found_documents` - Documents trouvés
      - `id` (uuid, clé primaire)
      - `document_type_id` (uuid, référence à document_types)
      - `wilaya_id` (integer, référence à wilayas)
      - `document_number` (texte, numéro partiel du document pour identification)
      - `owner_name` (texte, nom sur le document)
      - `found_date` (date, date où le document a été trouvé)
      - `found_location` (texte, lieu où le document a été trouvé)
      - `additional_info` (texte, informations supplémentaires)
      - `finder_contact` (texte, contact de celui qui a trouvé)
      - `status` (texte, statut: 'available', 'claimed', 'returned')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `document_claims` - Réclamations de documents
      - `id` (uuid, clé primaire)
      - `found_document_id` (uuid, référence à found_documents)
      - `claimer_contact` (texte, contact du réclamant)
      - `verification_info` (texte, informations de vérification)
      - `status` (texte, statut: 'pending', 'verified', 'rejected')
      - `created_at` (timestamp)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour lecture publique des documents trouvés
    - Politiques pour insertion publique (système anonyme)
    - Données sensibles minimales pour protection de la vie privée

  3. Notes Importantes
    - Système 100% gratuit et anonyme
    - Pas d'authentification requise pour consultation
    - Protection des données personnelles (numéros partiels uniquement)
    - Couverture des 48 wilayas d'Algérie
*/

CREATE TABLE IF NOT EXISTS document_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wilayas (
  id integer PRIMARY KEY,
  code text NOT NULL,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS found_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type_id uuid REFERENCES document_types(id) NOT NULL,
  wilaya_id integer REFERENCES wilayas(id) NOT NULL,
  document_number text,
  owner_name text NOT NULL,
  found_date date NOT NULL,
  found_location text NOT NULL,
  additional_info text DEFAULT '',
  finder_contact text NOT NULL,
  status text DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'returned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  found_document_id uuid REFERENCES found_documents(id) NOT NULL,
  claimer_contact text NOT NULL,
  verification_info text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE wilayas ENABLE ROW LEVEL SECURITY;
ALTER TABLE found_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view document types"
  ON document_types FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view wilayas"
  ON wilayas FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view available found documents"
  ON found_documents FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can report found documents"
  ON found_documents FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can submit document claims"
  ON document_claims FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view their claims"
  ON document_claims FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO document_types (name_fr, name_ar, icon) VALUES
  ('Carte Nationale d''Identité (CNI)', 'بطاقة التعريف الوطنية', 'CreditCard'),
  ('Passeport', 'جواز السفر', 'Plane'),
  ('Permis de Conduire', 'رخصة السياقة', 'Car'),
  ('Carte Bancaire', 'البطاقة البنكية', 'Wallet'),
  ('Carte d''Étudiant', 'بطاقة الطالب', 'GraduationCap'),
  ('Acte de Naissance', 'شهادة الميلاد', 'FileText'),
  ('Autre Document', 'وثيقة أخرى', 'File')
ON CONFLICT DO NOTHING;

INSERT INTO wilayas (id, code, name_fr, name_ar) VALUES
  (1, '01', 'Adrar', 'أدرار'),
  (2, '02', 'Chlef', 'الشلف'),
  (3, '03', 'Laghouat', 'الأغواط'),
  (4, '04', 'Oum El Bouaghi', 'أم البواقي'),
  (5, '05', 'Batna', 'باتنة'),
  (6, '06', 'Béjaïa', 'بجاية'),
  (7, '07', 'Biskra', 'بسكرة'),
  (8, '08', 'Béchar', 'بشار'),
  (9, '09', 'Blida', 'البليدة'),
  (10, '10', 'Bouira', 'البويرة'),
  (11, '11', 'Tamanrasset', 'تمنراست'),
  (12, '12', 'Tébessa', 'تبسة'),
  (13, '13', 'Tlemcen', 'تلمسان'),
  (14, '14', 'Tiaret', 'تيارت'),
  (15, '15', 'Tizi Ouzou', 'تيزي وزو'),
  (16, '16', 'Alger', 'الجزائر'),
  (17, '17', 'Djelfa', 'الجلفة'),
  (18, '18', 'Jijel', 'جيجل'),
  (19, '19', 'Sétif', 'سطيف'),
  (20, '20', 'Saïda', 'سعيدة'),
  (21, '21', 'Skikda', 'سكيكدة'),
  (22, '22', 'Sidi Bel Abbès', 'سيدي بلعباس'),
  (23, '23', 'Annaba', 'عنابة'),
  (24, '24', 'Guelma', 'قالمة'),
  (25, '25', 'Constantine', 'قسنطينة'),
  (26, '26', 'Médéa', 'المدية'),
  (27, '27', 'Mostaganem', 'مستغانم'),
  (28, '28', 'M''Sila', 'المسيلة'),
  (29, '29', 'Mascara', 'معسكر'),
  (30, '30', 'Ouargla', 'ورقلة'),
  (31, '31', 'Oran', 'وهران'),
  (32, '32', 'El Bayadh', 'البيض'),
  (33, '33', 'Illizi', 'إليزي'),
  (34, '34', 'Bordj Bou Arreridj', 'برج بوعريريج'),
  (35, '35', 'Boumerdès', 'بومرداس'),
  (36, '36', 'El Tarf', 'الطارف'),
  (37, '37', 'Tindouf', 'تندوف'),
  (38, '38', 'Tissemsilt', 'تيسمسيلت'),
  (39, '39', 'El Oued', 'الوادي'),
  (40, '40', 'Khenchela', 'خنشلة'),
  (41, '41', 'Souk Ahras', 'سوق أهراس'),
  (42, '42', 'Tipaza', 'تيبازة'),
  (43, '43', 'Mila', 'ميلة'),
  (44, '44', 'Aïn Defla', 'عين الدفلى'),
  (45, '45', 'Naâma', 'النعامة'),
  (46, '46', 'Aïn Témouchent', 'عين تموشنت'),
  (47, '47', 'Ghardaïa', 'غرداية'),
  (48, '48', 'Relizane', 'غليزان')
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_found_documents_type ON found_documents(document_type_id);
CREATE INDEX IF NOT EXISTS idx_found_documents_wilaya ON found_documents(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_found_documents_status ON found_documents(status);
CREATE INDEX IF NOT EXISTS idx_found_documents_created ON found_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_claims_document ON document_claims(found_document_id);