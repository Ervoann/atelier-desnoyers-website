-- Migration SQL pour ajouter la gestion des images de la section "Le jardin en images"
-- Version: 0.0.5
-- Date: 2026-08-08

-- =============================================
-- Table: jardin_images
-- Description: Stocke les 6 images de la galerie Instagram/Jardin
-- =============================================

CREATE TABLE IF NOT EXISTS jardin_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  link_url TEXT,
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Pré-remplir avec les images actuelles
-- =============================================

INSERT INTO jardin_images (image_url, alt_text, link_url, ordre) VALUES
  ('https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=400&h=400&fit=crop&auto=format', 'Vivaces naturalistes', 'https://www.instagram.com/antoine.desnoyers/', 1),
  ('https://images.unsplash.com/photo-1594886551831-610f739902e9?w=400&h=400&fit=crop&auto=format', 'Massif fleuri', 'https://www.instagram.com/antoine.desnoyers/', 2),
  ('https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=400&h=400&fit=crop&auto=format', 'Plantation', 'https://www.instagram.com/antoine.desnoyers/', 3),
  ('https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=400&h=400&fit=crop&auto=format', 'Jardin de vivaces', 'https://www.instagram.com/antoine.desnoyers/', 4),
  ('https://images.unsplash.com/photo-1764070140879-1120c0a9e9eb?w=400&h=400&fit=crop&auto=format', 'Jardin automnal', 'https://www.instagram.com/antoine.desnoyers/', 5),
  ('https://images.unsplash.com/photo-1680176104120-9dba9c415e89?w=400&h=400&fit=crop&auto=format', 'Prairie fleurie', 'https://www.instagram.com/antoine.desnoyers/', 6)
ON CONFLICT DO NOTHING;

-- =============================================
-- Index pour améliorer les performances
-- =============================================

CREATE INDEX IF NOT EXISTS idx_jardin_images_ordre ON jardin_images(ordre);

-- =============================================
-- Trigger pour mettre à jour updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_jardin_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_jardin_images_updated_at
  BEFORE UPDATE ON jardin_images
  FOR EACH ROW
  EXECUTE FUNCTION update_jardin_images_updated_at();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE jardin_images ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture publique
CREATE POLICY "Jardin images are viewable by everyone"
  ON jardin_images FOR SELECT
  USING (true);

-- Politique pour l'insertion (authentification requise)
CREATE POLICY "Jardin images are insertable by authenticated users"
  ON jardin_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique pour la mise à jour (authentification requise)
CREATE POLICY "Jardin images are updatable by authenticated users"
  ON jardin_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politique pour la suppression (authentification requise)
CREATE POLICY "Jardin images are deletable by authenticated users"
  ON jardin_images FOR DELETE
  TO authenticated
  USING (true);
