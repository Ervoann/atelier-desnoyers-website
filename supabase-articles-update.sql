-- =============================================
-- MISE À JOUR TABLE ARTICLES
-- Ajout du support vidéo et vérification RLS
-- =============================================

-- Si la table existe déjà, on peut ajouter des colonnes si nécessaire
-- Sinon, créer la table complète avec support vidéo

-- Vérifier que la table articles existe
DO $$
BEGIN
  -- Si la table n'existe pas, la créer
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'articles') THEN
    CREATE TABLE public.articles (
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
      -- Format: [{ type: 'text' | 'quote' | 'image' | 'video', content?: string, src?: string, caption?: string }]
      contenu JSONB NOT NULL DEFAULT '[]'::jsonb,

      -- Gestion de l'ordre et visibilité
      ordre INTEGER NOT NULL DEFAULT 0,
      visible BOOLEAN NOT NULL DEFAULT true
    );

    -- Index pour optimiser les requêtes
    CREATE INDEX idx_articles_slug ON public.articles(slug);
    CREATE INDEX idx_articles_visible_ordre ON public.articles(visible, ordre);
    CREATE INDEX idx_articles_date ON public.articles(date DESC);

    -- Trigger pour mettre à jour updated_at
    CREATE OR REPLACE FUNCTION update_articles_updated_at()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    CREATE TRIGGER articles_updated_at
      BEFORE UPDATE ON public.articles
      FOR EACH ROW
      EXECUTE FUNCTION update_articles_updated_at();
  END IF;
END $$;

-- =============================================
-- SUPPRESSION ET RECRÉATION DES POLICIES RLS
-- Pour s'assurer qu'elles sont correctes
-- =============================================

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Articles visibles lisibles par tous" ON public.articles;
DROP POLICY IF EXISTS "Admin peut lire tous les articles" ON public.articles;
DROP POLICY IF EXISTS "Admin peut créer articles" ON public.articles;
DROP POLICY IF EXISTS "Admin peut modifier articles" ON public.articles;
DROP POLICY IF EXISTS "Admin peut supprimer articles" ON public.articles;

-- Activer RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Lecture publique (SEULEMENT articles visibles, non authentifié)
CREATE POLICY "Articles visibles lisibles par tous"
  ON public.articles
  FOR SELECT
  USING (
    visible = true
    OR auth.role() = 'authenticated'
  );

-- Policy 2: Admin authentifié peut CRÉER des articles
CREATE POLICY "Admin peut créer articles"
  ON public.articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 3: Admin authentifié peut MODIFIER des articles
CREATE POLICY "Admin peut modifier articles"
  ON public.articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 4: Admin authentifié peut SUPPRIMER des articles
CREATE POLICY "Admin peut supprimer articles"
  ON public.articles
  FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- MISE À JOUR DES TYPES (pour référence)
-- =============================================

-- Les types de blocs supportés sont maintenant :
-- - text : Paragraphe de texte
--   { "type": "text", "content": "..." }
--
-- - quote : Citation
--   { "type": "quote", "content": "..." }
--
-- - image : Image avec légende optionnelle
--   { "type": "image", "src": "https://...", "caption": "..." }
--
-- - video : Vidéo avec légende optionnelle
--   { "type": "video", "src": "https://...", "caption": "...", "provider": "youtube|vimeo|direct" }

-- =============================================
-- EXEMPLE DE MISE À JOUR D'UN ARTICLE EXISTANT
-- Pour ajouter une vidéo à un article
-- =============================================

-- EXEMPLE (à ne pas exécuter tel quel) :
-- UPDATE public.articles
-- SET contenu = contenu || '[{"type": "video", "src": "https://www.youtube.com/embed/VIDEO_ID", "caption": "Vidéo de présentation", "provider": "youtube"}]'::jsonb
-- WHERE slug = 'votre-article-slug';

-- =============================================
-- VÉRIFICATIONS
-- =============================================

-- Vérifier que RLS est activé
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'articles';

-- Lister toutes les policies
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'articles';

-- Afficher quelques articles
SELECT id, titre, slug, visible, ordre, created_at
FROM public.articles
ORDER BY ordre
LIMIT 5;
