-- Table pour les projets de portfolio
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

-- Table pour les slides/galerie de chaque projet
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

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_portfolio_slides_portfolio_id ON portfolio_slides(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_ordre ON portfolios(ordre);
CREATE INDEX IF NOT EXISTS idx_portfolio_slides_ordre ON portfolio_slides(ordre);

-- RLS (Row Level Security)
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_slides ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
DROP POLICY IF EXISTS "Allow public read access on portfolios" ON portfolios;
CREATE POLICY "Allow public read access on portfolios"
  ON portfolios FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow public read access on portfolio_slides" ON portfolio_slides;
CREATE POLICY "Allow public read access on portfolio_slides"
  ON portfolio_slides FOR SELECT
  TO public
  USING (true);

-- Politique pour permettre l'insertion aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Allow authenticated insert on portfolios" ON portfolios;
CREATE POLICY "Allow authenticated insert on portfolios"
  ON portfolios FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated insert on portfolio_slides" ON portfolio_slides;
CREATE POLICY "Allow authenticated insert on portfolio_slides"
  ON portfolio_slides FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Allow authenticated update on portfolios" ON portfolios;
CREATE POLICY "Allow authenticated update on portfolios"
  ON portfolios FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update on portfolio_slides" ON portfolio_slides;
CREATE POLICY "Allow authenticated update on portfolio_slides"
  ON portfolio_slides FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politique pour permettre la suppression aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Allow authenticated delete on portfolios" ON portfolios;
CREATE POLICY "Allow authenticated delete on portfolios"
  ON portfolios FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete on portfolio_slides" ON portfolio_slides;
CREATE POLICY "Allow authenticated delete on portfolio_slides"
  ON portfolio_slides FOR DELETE
  TO authenticated
  USING (true);

-- Insérer les données du portfolio existant
INSERT INTO portfolios (id, slug, titre, lieu, type_projet, annee, surface, image_principale, description, tags, ordre) VALUES
(1, 'jardin-naturaliste-lyon', 'Jardin naturaliste', 'Lyon 6e, 69', 'Jardin privé', '2024', '320 m²', 'https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=600&h=600&fit=crop&auto=format', 'Un jardin de ville reconverti en espace vivant, planté de graminées, de vivaces et d''arbustes à floraison décalée pour assurer une présence végétale tout au long de l''année. Le sol a été travaillé en profondeur pour favoriser la vie microbienne et limiter les arrosages. La composition s''inspire des prairies naturelles de la région lyonnaise, retraduites dans un cadre privé.', ARRAY['Vivaces', 'Graminées', 'Sol vivant', 'Aménagement'], 1),
(2, 'prairie-fleurie-annecy', 'Prairie fleurie', 'Annecy, 74', 'Jardin privé', '2024', '800 m²', 'https://images.unsplash.com/photo-1594886551831-610f739902e9?w=600&h=600&fit=crop&auto=format', 'Une vaste parcelle en pente douce, transformée en prairie naturelle semée de fleurs sauvages et de bulbes automnaux. Le projet cherchait à créer un paysage de montagne apprivoisé — libre dans son allure mais pensé dans ses rythmes et ses contrastes. La tonte différenciée crée des chemins informels qui invitent à la promenade.', ARRAY['Prairie', 'Bulbes', 'Pente', 'Biodiversité'], 2),
(3, 'massif-de-vivaces-grenoble', 'Massif de vivaces', 'Grenoble, 38', 'Espace partagé', '2023', '150 m²', 'https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=600&h=600&fit=crop&auto=format', 'Un massif conçu pour un espace partagé entre copropriétaires, avec l''ambition d''être à la fois beau et résilient. La palette végétale privilégie les espèces peu gourmandes en eau, résistantes au calcaire et attrayantes pour les pollinisateurs. Chaque plante a été choisie pour son comportement à la fois individuel et en groupe.', ARRAY['Vivaces', 'Pollinisateurs', 'Espace collectif'], 3),
(4, 'cour-interieure-lyon', 'Cour intérieure', 'Lyon 3e, 69', 'Cour urbaine', '2023', '80 m²', 'https://images.unsplash.com/photo-1771830916705-ab69d12196af?w=600&h=600&fit=crop&auto=format', 'Un espace minéral et ombragé, transformé en jardin de cour intérieure à Lyon. Le défi était de travailler dans une contrainte forte — peu de lumière directe, sol bétonné — pour créer un espace habité, végétalisé et agréable à vivre toute l''année. Des bacs sur mesure, des plantes d''ombre et un travail soigné sur les matériaux.', ARRAY['Cour urbaine', 'Ombre', 'Bacs', 'Minéral'], 4),
(5, 'jardin-automnal-villefranche', 'Jardin automnal', 'Villefranche-sur-Saône, 69', 'Jardin privé', '2023', '450 m²', 'https://images.unsplash.com/photo-1764070140879-1120c0a9e9eb?w=600&h=600&fit=crop&auto=format', 'Conçu autour d''une palette végétale aux coloris chauds — ocres, rouilles, bordeaux — ce jardin célèbre l''automne comme sa saison de gloire. Graminées en mouvement, hydrangéas persistants, feuillages colorés et baies ornementales composent un tableau qui change de semaine en semaine entre septembre et décembre.', ARRAY['Couleurs d''automne', 'Graminées', 'Feuillages'], 5),
(6, 'jardin-mediterraneen-vienne', 'Jardin méditerranéen', 'Vienne, 38', 'Jardin privé', '2022', '250 m²', 'https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=600&h=600&fit=crop&auto=format', 'Un jardin inspiré des paysages du Sud, planté d''oliviers, de lavandes, d''agrumes et de plantes aromatiques. Le terrain en restanques a été conservé et mis en valeur, chaque niveau accueillant une ambiance végétale différente. Les matériaux locaux — pierres sèches, graviers ocres — renforcent l''identité méditerranéenne du lieu.', ARRAY['Méditerranéen', 'Restanques', 'Plantes aromatiques'], 6)
ON CONFLICT (id) DO NOTHING;

-- Insérer les slides pour chaque projet
INSERT INTO portfolio_slides (portfolio_id, type, src, video_id, ordre) VALUES
-- Projet 1
(1, 'image', 'https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=1600&h=900&fit=crop&auto=format', NULL, 1),
(1, 'youtube', NULL, 'r_epbFJ231Y', 2),
(1, 'image', 'https://images.unsplash.com/photo-1532211387405-12202cb81d7b?w=1600&h=900&fit=crop&auto=format', NULL, 3),
(1, 'image', 'https://images.unsplash.com/photo-1492496913980-501348b61469?w=1600&h=900&fit=crop&auto=format', NULL, 4),
-- Projet 2
(2, 'image', 'https://images.unsplash.com/photo-1594886551831-610f739902e9?w=1600&h=900&fit=crop&auto=format', NULL, 1),
(2, 'image', 'https://images.unsplash.com/photo-1764070140879-1120c0a9e9eb?w=1600&h=900&fit=crop&auto=format', NULL, 2),
(2, 'image', 'https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=1600&h=900&fit=crop&auto=format', NULL, 3),
(2, 'image', 'https://images.unsplash.com/photo-1719174724959-58e1876a1dc4?w=1600&h=900&fit=crop&auto=format', NULL, 4),
-- Projet 3
(3, 'image', 'https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=1600&h=900&fit=crop&auto=format', NULL, 1),
(3, 'image', 'https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=1600&h=900&fit=crop&auto=format', NULL, 2),
(3, 'image', 'https://images.unsplash.com/photo-1594886551831-610f739902e9?w=1600&h=900&fit=crop&auto=format', NULL, 3),
(3, 'image', 'https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=1600&h=900&fit=crop&auto=format', NULL, 4),
-- Projet 4
(4, 'image', 'https://images.unsplash.com/photo-1771830916705-ab69d12196af?w=1600&h=900&fit=crop&auto=format', NULL, 1),
(4, 'image', 'https://images.unsplash.com/photo-1492496913980-501348b61469?w=1600&h=900&fit=crop&auto=format', NULL, 2),
(4, 'image', 'https://images.unsplash.com/photo-1532211387405-12202cb81d7b?w=1600&h=900&fit=crop&auto=format', NULL, 3),
(4, 'image', 'https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=1600&h=900&fit=crop&auto=format', NULL, 4),
-- Projet 5
(5, 'image', 'https://images.unsplash.com/photo-1764070140879-1120c0a9e9eb?w=1600&h=900&fit=crop&auto=format', NULL, 1),
(5, 'image', 'https://images.unsplash.com/photo-1719174724959-58e1876a1dc4?w=1600&h=900&fit=crop&auto=format', NULL, 2),
(5, 'image', 'https://images.unsplash.com/photo-1594886551831-610f739902e9?w=1600&h=900&fit=crop&auto=format', NULL, 3),
(5, 'image', 'https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=1600&h=900&fit=crop&auto=format', NULL, 4),
-- Projet 6
(6, 'image', 'https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=1600&h=900&fit=crop&auto=format', NULL, 1),
(6, 'image', 'https://images.unsplash.com/photo-1764070140879-1120c0a9e9eb?w=1600&h=900&fit=crop&auto=format', NULL, 2),
(6, 'image', 'https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=1600&h=900&fit=crop&auto=format', NULL, 3),
(6, 'image', 'https://images.unsplash.com/photo-1492496913980-501348b61469?w=1600&h=900&fit=crop&auto=format', NULL, 4);

-- Réinitialiser la séquence pour permettre de nouveaux ID
SELECT setval('portfolios_id_seq', (SELECT MAX(id) FROM portfolios));
SELECT setval('portfolio_slides_id_seq', (SELECT MAX(id) FROM portfolio_slides));
