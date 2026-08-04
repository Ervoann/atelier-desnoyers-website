-- ============================================
-- CONFIGURATION DU STORAGE SUPABASE
-- Atelier Desnoyers - Bucket pour les portfolios
-- ============================================

-- ============================================
-- CRÉATION DU BUCKET PORTFOLIOS
-- ============================================

-- Insérer le bucket dans la table storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolios',
  'portfolios',
  true,  -- Public: les images sont accessibles sans authentification
  52428800,  -- 50 MB limit par fichier
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

-- ============================================
-- POLICIES POUR LE BUCKET PORTFOLIOS
-- ============================================

-- Policy pour permettre la lecture publique
DROP POLICY IF EXISTS "Public Access for portfolios" ON storage.objects;
CREATE POLICY "Public Access for portfolios"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'portfolios');

-- Policy pour permettre l'upload (utilisateurs authentifiés uniquement)
DROP POLICY IF EXISTS "Authenticated users can upload to portfolios" ON storage.objects;
CREATE POLICY "Authenticated users can upload to portfolios"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolios');

-- Policy pour permettre la mise à jour (utilisateurs authentifiés uniquement)
DROP POLICY IF EXISTS "Authenticated users can update portfolios" ON storage.objects;
CREATE POLICY "Authenticated users can update portfolios"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolios')
  WITH CHECK (bucket_id = 'portfolios');

-- Policy pour permettre la suppression (utilisateurs authentifiés uniquement)
DROP POLICY IF EXISTS "Authenticated users can delete from portfolios" ON storage.objects;
CREATE POLICY "Authenticated users can delete from portfolios"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolios');

-- ============================================
-- FIN DU SCRIPT DE CONFIGURATION STORAGE
-- ============================================

-- NOTES D'UTILISATION:
-- 1. Exécutez ce script dans le SQL Editor de votre nouveau Supabase
-- 2. Le bucket "portfolios" sera créé avec accès public en lecture
-- 3. Seuls les utilisateurs authentifiés pourront upload/modifier/supprimer
-- 4. Limite de 50 MB par fichier
-- 5. Formats acceptés: JPEG, PNG, GIF, WebP, SVG
--
-- MIGRATION DES IMAGES:
-- Après avoir exécuté ce script, téléchargez toutes les images depuis
-- l'ancien bucket et uploadez-les dans le nouveau via l'interface Supabase Storage
