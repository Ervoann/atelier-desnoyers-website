-- ============================================
-- SCRIPT COMPLET DE CRÉATION DES TABLES SUPABASE
-- Atelier Desnoyers - Base de données complète
-- Structure exacte de l'ancien Supabase
-- ============================================

-- ============================================
-- SUPPRESSION DES TABLES EXISTANTES
-- ============================================
-- ATTENTION: Cette section supprime TOUTES les tables et leurs données!
-- Assurez-vous d'avoir sauvegardé vos données avant d'exécuter ce script.

DROP TABLE IF EXISTS portfolio_slides CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS portraits CASCADE;
DROP TABLE IF EXISTS demarche_accompagners CASCADE;
DROP TABLE IF EXISTS demarche_realisers CASCADE;
DROP TABLE IF EXISTS demarche_dessiners CASCADE;
DROP TABLE IF EXISTS demarche_observers CASCADE;
DROP TABLE IF EXISTS citations CASCADE;
DROP TABLE IF EXISTS homepages CASCADE;

-- ============================================
-- 1. TABLE HOMEPAGES
-- ============================================
CREATE TABLE IF NOT EXISTS homepages (
  id SERIAL PRIMARY KEY,
  document_id VARCHAR,
  hero_surtitre VARCHAR,
  hero_titre VARCHAR,
  hero_description VARCHAR,
  hero_cta_principal VARCHAR,
  hero_cta_secondaire VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR
);

ALTER TABLE homepages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on homepages" ON homepages;
CREATE POLICY "Allow public read access on homepages"
  ON homepages FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on homepages" ON homepages;
CREATE POLICY "Allow authenticated write on homepages"
  ON homepages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 2. TABLE CITATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS citations (
  id SERIAL PRIMARY KEY,
  document_id VARCHAR,
  texte JSONB,
  sous_texte TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR
);

ALTER TABLE citations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on citations" ON citations;
CREATE POLICY "Allow public read access on citations"
  ON citations FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on citations" ON citations;
CREATE POLICY "Allow authenticated write on citations"
  ON citations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. TABLE DEMARCHE_OBSERVERS
-- ============================================
CREATE TABLE IF NOT EXISTS demarche_observers (
  id SERIAL PRIMARY KEY,
  document_id VARCHAR,
  titre VARCHAR,
  sous_titre VARCHAR,
  paragraphe_1 TEXT,
  paragraphe_2 TEXT,
  action_1_titre VARCHAR,
  action_1_description VARCHAR,
  action_2_titre VARCHAR,
  action_2_description VARCHAR,
  action_3_titre VARCHAR,
  action_3_description VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR
);

ALTER TABLE demarche_observers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on demarche_observers" ON demarche_observers;
CREATE POLICY "Allow public read access on demarche_observers"
  ON demarche_observers FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on demarche_observers" ON demarche_observers;
CREATE POLICY "Allow authenticated write on demarche_observers"
  ON demarche_observers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. TABLE DEMARCHE_DESSINERS
-- ============================================
CREATE TABLE IF NOT EXISTS demarche_dessiners (
  id SERIAL PRIMARY KEY,
  document_id VARCHAR,
  titre VARCHAR,
  sous_titre VARCHAR,
  citation TEXT,
  paragraphe TEXT,
  aspect_1_titre VARCHAR,
  aspect_1_detail TEXT,
  aspect_2_titre VARCHAR,
  aspect_2_detail TEXT,
  aspect_3_titre VARCHAR,
  aspect_3_detail TEXT,
  aspect_4_titre VARCHAR,
  aspect_4_detail TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  published_at TIMESTAMP,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR
);

ALTER TABLE demarche_dessiners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on demarche_dessiners" ON demarche_dessiners;
CREATE POLICY "Allow public read access on demarche_dessiners"
  ON demarche_dessiners FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on demarche_dessiners" ON demarche_dessiners;
CREATE POLICY "Allow authenticated write on demarche_dessiners"
  ON demarche_dessiners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. TABLE DEMARCHE_REALISERS
-- ============================================
CREATE TABLE IF NOT EXISTS demarche_realisers (
  id BIGSERIAL PRIMARY KEY,
  titre TEXT DEFAULT 'Réaliser',
  sous_titre TEXT DEFAULT 'Aménagement & plantation',
  paragraphe_1 TEXT,
  paragraphe_2 TEXT,
  citation TEXT DEFAULT 'Le jardin naît, mais il n''est pas encore achevé.',
  action_1_titre TEXT DEFAULT 'Préparer',
  action_1_description TEXT DEFAULT 'Ouvrir, nettoyer, organiser et enrichir',
  action_2_titre TEXT DEFAULT 'Acheminer',
  action_2_description TEXT DEFAULT 'Arbres, vivaces, bulbes, matériaux, décor',
  action_3_titre TEXT DEFAULT 'Implanter',
  action_3_description TEXT DEFAULT 'Avec joie et maestria',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE demarche_realisers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on demarche_realisers" ON demarche_realisers;
CREATE POLICY "Allow public read access on demarche_realisers"
  ON demarche_realisers FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on demarche_realisers" ON demarche_realisers;
CREATE POLICY "Allow authenticated write on demarche_realisers"
  ON demarche_realisers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 6. TABLE DEMARCHE_ACCOMPAGNERS
-- ============================================
CREATE TABLE IF NOT EXISTS demarche_accompagners (
  id BIGSERIAL PRIMARY KEY,
  titre TEXT DEFAULT 'Accompagner',
  paragraphe_1 TEXT,
  paragraphe_2 TEXT,
  offre_1_titre TEXT DEFAULT 'Saison',
  offre_1_rythme TEXT DEFAULT '2 visites / an',
  offre_1_description TEXT,
  offre_2_titre TEXT DEFAULT 'Cycle',
  offre_2_rythme TEXT DEFAULT '4 visites / an',
  offre_2_description TEXT,
  offre_3_titre TEXT DEFAULT 'Présence',
  offre_3_rythme TEXT DEFAULT '6 à 8 visites / an',
  offre_3_description TEXT,
  offre_4_titre TEXT DEFAULT 'Cocréation',
  offre_4_rythme TEXT DEFAULT '½ journée ou journée',
  offre_4_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE demarche_accompagners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on demarche_accompagners" ON demarche_accompagners;
CREATE POLICY "Allow public read access on demarche_accompagners"
  ON demarche_accompagners FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on demarche_accompagners" ON demarche_accompagners;
CREATE POLICY "Allow authenticated write on demarche_accompagners"
  ON demarche_accompagners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 7. TABLE PORTRAITS
-- ============================================
CREATE TABLE IF NOT EXISTS portraits (
  id BIGSERIAL PRIMARY KEY,
  surtitre TEXT DEFAULT 'Portrait',
  titre_ligne_1 TEXT DEFAULT 'Le regard du designer',
  titre_ligne_2 TEXT DEFAULT 'et les gestes du jardinier.',
  paragraphe_1 TEXT,
  paragraphe_2 TEXT,
  paragraphe_3 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE portraits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on portraits" ON portraits;
CREATE POLICY "Allow public read access on portraits"
  ON portraits FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on portraits" ON portraits;
CREATE POLICY "Allow authenticated write on portraits"
  ON portraits FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 8. TABLE FAQS
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  reponse TEXT NOT NULL,
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_ordre ON faqs(ordre);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on faqs" ON faqs;
CREATE POLICY "Allow public read access on faqs"
  ON faqs FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on faqs" ON faqs;
CREATE POLICY "Allow authenticated write on faqs"
  ON faqs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 9. TABLE PORTFOLIOS
-- ============================================
CREATE TABLE IF NOT EXISTS portfolios (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titre TEXT NOT NULL,
  chantier_numero TEXT,
  lieu TEXT NOT NULL,
  type_projet TEXT,
  annee TEXT NOT NULL,
  surface TEXT NOT NULL,
  image_principale TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  ordre INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolios_ordre ON portfolios(ordre);

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on portfolios" ON portfolios;
CREATE POLICY "Allow public read access on portfolios"
  ON portfolios FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on portfolios" ON portfolios;
CREATE POLICY "Allow authenticated write on portfolios"
  ON portfolios FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 10. TABLE PORTFOLIO_SLIDES
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_slides (
  id SERIAL PRIMARY KEY,
  portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'youtube')),
  src TEXT,
  video_id TEXT,
  ordre INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_slides_portfolio_id ON portfolio_slides(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_slides_ordre ON portfolio_slides(ordre);

ALTER TABLE portfolio_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on portfolio_slides" ON portfolio_slides;
CREATE POLICY "Allow public read access on portfolio_slides"
  ON portfolio_slides FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated write on portfolio_slides" ON portfolio_slides;
CREATE POLICY "Allow authenticated write on portfolio_slides"
  ON portfolio_slides FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- FIN DU SCRIPT DE CRÉATION DES TABLES
-- ============================================

-- NOTE: Ce script crée UNIQUEMENT la structure des tables.
-- Les données doivent être importées séparément via CSV ou INSERT statements.
