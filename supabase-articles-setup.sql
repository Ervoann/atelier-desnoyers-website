-- =============================================
-- SUPABASE ARTICLES SETUP
-- Tables pour la gestion des articles de blog
-- =============================================

-- Table: articles
-- Description: Stocke les articles du blog avec leur contenu en JSON
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Métadonnées
  titre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  extrait TEXT NOT NULL,
  categorie TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Image de bannière (URL Supabase Storage)
  banniere_url TEXT NOT NULL,

  -- Contenu structuré en JSON
  -- Format: [{ type: 'text' | 'quote' | 'image', content?: string, src?: string, caption?: string }]
  contenu JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Gestion de l'ordre et visibilité
  ordre INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_visible_ordre ON public.articles(visible, ordre);
CREATE INDEX IF NOT EXISTS idx_articles_date ON public.articles(date DESC);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_articles_updated_at();

-- RLS (Row Level Security)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy: Lecture publique (seulement articles visibles)
CREATE POLICY "Articles visibles lisibles par tous"
  ON public.articles
  FOR SELECT
  USING (visible = true);

-- Policy: Lecture admin (tous les articles)
CREATE POLICY "Admin peut lire tous les articles"
  ON public.articles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Admin peut tout faire
CREATE POLICY "Admin peut créer articles"
  ON public.articles
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin peut modifier articles"
  ON public.articles
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin peut supprimer articles"
  ON public.articles
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =============================================
-- DONNÉES DE TEST (optionnel)
-- =============================================

-- Insérer quelques articles d'exemple
INSERT INTO public.articles (titre, slug, extrait, categorie, date, banniere_url, contenu, ordre, visible)
VALUES
  (
    'Les jardins naturalistes : une nouvelle approche du paysage',
    'jardins-naturalistes-nouvelle-approche',
    'Découvrez comment les jardins naturalistes transforment notre rapport à la nature en ville, privilégiant la biodiversité et l''équilibre écologique.',
    'Inspiration',
    '2024-03-15',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=675&fit=crop',
    '[
      {"type": "text", "content": "Les jardins naturalistes représentent une véritable révolution dans l''art du paysage. Contrairement aux jardins traditionnels très structurés, ils misent sur une apparence plus sauvage et spontanée, tout en étant soigneusement pensés."},
      {"type": "text", "content": "Cette approche favorise les plantes vivaces, les graminées et les espèces locales. L''objectif est de créer un écosystème autonome qui nécessite peu d''entretien une fois établi."},
      {"type": "quote", "content": "Un jardin naturaliste n''est pas un jardin abandonné, c''est un jardin qui danse avec la nature."},
      {"type": "image", "src": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop", "caption": "Prairie fleurie en plein été"},
      {"type": "text", "content": "La clé du succès réside dans la sélection des plantes et leur disposition. On privilégie les associations naturelles et on laisse les plantes se ressemer librement, créant ainsi un tableau vivant qui évolue au fil des saisons."}
    ]'::jsonb,
    1,
    true
  ),
  (
    'Comment préparer son jardin pour l''hiver',
    'preparer-jardin-hiver',
    'Les gestes essentiels pour protéger vos plantations et préparer votre espace vert à affronter la saison froide en toute sérénité.',
    'Conseils',
    '2024-02-10',
    'https://images.unsplash.com/photo-1478032660645-89e0e38c57b6?w=1200&h=675&fit=crop',
    '[
      {"type": "text", "content": "L''automne est la saison idéale pour préparer votre jardin à affronter l''hiver. Quelques gestes simples peuvent faire toute la différence pour la santé de vos plantes."},
      {"type": "text", "content": "Commencez par nettoyer les massifs, en retirant les feuilles mortes et les plantes annuelles fanées. Mais attention : ne soyez pas trop zélé ! Certaines tiges sèches offrent un refuge précieux aux insectes utiles."},
      {"type": "quote", "content": "Un jardin d''hiver bien préparé est la promesse d''un printemps éclatant."},
      {"type": "text", "content": "Paillez généreusement les pieds de vos vivaces sensibles au gel. Un bon paillage de 10-15 cm protège les racines et enrichit le sol en se décomposant."}
    ]'::jsonb,
    2,
    true
  ),
  (
    'Les vivaces pour terrains secs : beauté sans arrosage',
    'vivaces-terrains-secs',
    'Sélection de plantes vivaces qui prospèrent dans les sols secs et apportent couleur et texture sans demander un arrosage constant.',
    'Sélection',
    '2024-01-20',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=675&fit=crop',
    '[
      {"type": "text", "content": "Face aux défis climatiques et aux restrictions d''eau, choisir des vivaces adaptées aux terrains secs devient essentiel. Heureusement, beauté rime parfaitement avec économie d''eau."},
      {"type": "text", "content": "Les sauges, sedums, achillées et graminées ornementales sont vos meilleurs alliés. Une fois bien installées, ces plantes résistent remarquablement à la sécheresse tout en offrant un spectacle généreux."},
      {"type": "image", "src": "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&h=600&fit=crop", "caption": "Massif de vivaces résistantes à la sécheresse"},
      {"type": "text", "content": "Le secret : préparer correctement le sol en y incorporant du compost, puis pailler généreusement. Ces deux gestes simples permettent aux racines de se développer en profondeur et de mieux résister aux périodes sèches."}
    ]'::jsonb,
    3,
    true
  );

-- =============================================
-- VÉRIFICATIONS
-- =============================================

-- Afficher toutes les tables articles
SELECT * FROM public.articles ORDER BY ordre;
