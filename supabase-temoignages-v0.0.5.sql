-- Migration SQL pour ajouter la gestion de la section "Ce qu'ils en disent"
-- Version: 0.0.5
-- Date: 2026-08-08

-- =============================================
-- Table: temoignages
-- Description: Stocke les témoignages/avis clients
-- =============================================

CREATE TABLE IF NOT EXISTS temoignages (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  lieu TEXT NOT NULL,
  date TEXT NOT NULL,
  note INTEGER NOT NULL DEFAULT 5 CHECK (note >= 1 AND note <= 5),
  avis TEXT NOT NULL,
  ordre INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Pré-remplir avec les témoignages actuels
-- =============================================

INSERT INTO temoignages (nom, lieu, date, note, avis, ordre, visible) VALUES
  ('Sophie M.', 'Lyon 6e', 'Mars 2024', 5, 'Antoine a transformé notre cour intérieure en un espace que nous n''osions même pas imaginer. Son écoute, sa précision et son sens du végétal sont remarquables. Chaque plante est à sa place — et cela se sent.', 1, true),
  ('Thomas & Claire R.', 'Annecy', 'Juillet 2024', 5, 'Un vrai jardinier-designer, rare combinaison. Il a su comprendre notre terrain en une seule visite et proposer quelque chose qui lui ressemble vraiment. Le résultat est d''une beauté sobre et durable.', 2, true),
  ('Isabelle L.', 'Grenoble', 'Octobre 2023', 5, 'Très professionnel, à l''écoute et créatif. La palette végétale qu''il a choisie pour notre massif est parfaitement adaptée — les plantes poussent sans effort et le jardin change joliment au fil des saisons.', 3, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- Index pour améliorer les performances
-- =============================================

CREATE INDEX IF NOT EXISTS idx_temoignages_ordre ON temoignages(ordre);
CREATE INDEX IF NOT EXISTS idx_temoignages_visible ON temoignages(visible);

-- =============================================
-- Trigger pour mettre à jour updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_temoignages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_temoignages_updated_at
  BEFORE UPDATE ON temoignages
  FOR EACH ROW
  EXECUTE FUNCTION update_temoignages_updated_at();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE temoignages ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture publique (uniquement les témoignages visibles)
CREATE POLICY "Temoignages visibles are viewable by everyone"
  ON temoignages FOR SELECT
  USING (visible = true);

-- Politique pour l'insertion (authentification requise)
CREATE POLICY "Temoignages are insertable by authenticated users"
  ON temoignages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique pour la mise à jour (authentification requise)
CREATE POLICY "Temoignages are updatable by authenticated users"
  ON temoignages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politique pour la suppression (authentification requise)
CREATE POLICY "Temoignages are deletable by authenticated users"
  ON temoignages FOR DELETE
  TO authenticated
  USING (true);

-- Politique pour l'admin pour voir tous les témoignages (même cachés)
CREATE POLICY "Authenticated users can view all temoignages"
  ON temoignages FOR SELECT
  TO authenticated
  USING (true);
