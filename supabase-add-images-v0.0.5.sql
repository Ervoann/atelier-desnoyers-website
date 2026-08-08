-- =============================================
-- AJOUT DES CHAMPS IMAGES V0.0.5
-- Gestion des images et vidéos depuis l'admin
-- =============================================

-- =============================================
-- 1. HOMEPAGE - Vidéo hero
-- =============================================
ALTER TABLE homepages
ADD COLUMN IF NOT EXISTS hero_video_url TEXT;

COMMENT ON COLUMN homepages.hero_video_url IS 'URL de la vidéo de fond du hero (YouTube, Vimeo ou direct)';

-- =============================================
-- 2. CITATIONS - Image de fond
-- =============================================
ALTER TABLE citations
ADD COLUMN IF NOT EXISTS image_fond_url TEXT;

COMMENT ON COLUMN citations.image_fond_url IS 'URL de l''image de fond pour la section citation';

-- =============================================
-- 3. DEMARCHE OBSERVER - Image
-- =============================================
ALTER TABLE demarche_observers
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN demarche_observers.image_url IS 'URL de l''image pour la section Observer';

-- =============================================
-- 4. DEMARCHE DESSINER - Image
-- =============================================
ALTER TABLE demarche_dessiners
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN demarche_dessiners.image_url IS 'URL de l''image pour la section Dessiner';

-- =============================================
-- 5. DEMARCHE REALISER - Image
-- =============================================
ALTER TABLE demarche_realisers
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN demarche_realisers.image_url IS 'URL de l''image pour la section Réaliser';

-- =============================================
-- 6. DEMARCHE ACCOMPAGNER - Image
-- =============================================
ALTER TABLE demarche_accompagners
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN demarche_accompagners.image_url IS 'URL de l''image pour la section Accompagner';

-- =============================================
-- 7. PORTRAITS - 3 Images
-- =============================================
ALTER TABLE portraits
ADD COLUMN IF NOT EXISTS image_1_url TEXT,
ADD COLUMN IF NOT EXISTS image_2_url TEXT,
ADD COLUMN IF NOT EXISTS image_3_url TEXT;

COMMENT ON COLUMN portraits.image_1_url IS 'URL de la première image (paragraphe 1 - droite)';
COMMENT ON COLUMN portraits.image_2_url IS 'URL de la deuxième image (paragraphe 2 - gauche)';
COMMENT ON COLUMN portraits.image_3_url IS 'URL de la troisième image (paragraphe 3 - droite)';

-- =============================================
-- REMPLISSAGE DES DONNÉES PAR DÉFAUT
-- (avec les images et vidéos actuellement utilisées)
-- =============================================

-- Homepage - Vidéo hero YouTube
UPDATE homepages
SET hero_video_url = 'https://www.youtube-nocookie.com/embed/r_epbFJ231Y?autoplay=1&mute=1&loop=1&playlist=r_epbFJ231Y&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1&fs=0&cc_load_policy=0'
WHERE id = 1;

-- Citations - Image de fond
UPDATE citations
SET image_fond_url = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&h=1080&fit=crop&auto=format&q=80'
WHERE id = 1;

-- Demarche Observer - Image
UPDATE demarche_observers
SET image_url = 'https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=900&h=1200&fit=crop&auto=format'
WHERE id = 1;

-- Demarche Dessiner - Image
UPDATE demarche_dessiners
SET image_url = 'https://images.unsplash.com/photo-1532211387405-12202cb81d7b?w=900&h=1200&fit=crop&auto=format'
WHERE id = 1;

-- Demarche Realiser - Image
UPDATE demarche_realisers
SET image_url = 'https://images.unsplash.com/photo-1492496913980-501348b61469?w=900&h=1200&fit=crop&auto=format'
WHERE id = 1;

-- Demarche Accompagner - Image
UPDATE demarche_accompagners
SET image_url = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&h=1200&fit=crop&auto=format'
WHERE id = 1;

-- Portrait - 3 images
UPDATE portraits
SET
  image_1_url = 'https://images.unsplash.com/photo-1680176104120-9dba9c415e89?w=1200&h=900&fit=crop&auto=format',
  image_2_url = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=900&fit=crop&auto=format',
  image_3_url = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=900&fit=crop&auto=format'
WHERE id = 1;

-- =============================================
-- VÉRIFICATIONS
-- =============================================

-- Vérifier que les colonnes ont été ajoutées
SELECT
  'homepages' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'homepages'
  AND column_name = 'hero_video_url'
UNION ALL
SELECT
  'citations' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'citations'
  AND column_name = 'image_fond_url'
UNION ALL
SELECT
  'demarche_observers' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'demarche_observers'
  AND column_name = 'image_url'
UNION ALL
SELECT
  'demarche_dessiners' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'demarche_dessiners'
  AND column_name = 'image_url'
UNION ALL
SELECT
  'demarche_realisers' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'demarche_realisers'
  AND column_name = 'image_url'
UNION ALL
SELECT
  'demarche_accompagners' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'demarche_accompagners'
  AND column_name = 'image_url'
UNION ALL
SELECT
  'portraits' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'portraits'
  AND column_name IN ('image_1_url', 'image_2_url', 'image_3_url')
ORDER BY table_name, column_name;
