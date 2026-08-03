-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-images',
  'portfolio-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for portfolio-images bucket

-- Allow public read access to all images
DROP POLICY IF EXISTS "Public read access for portfolio images" ON storage.objects;
CREATE POLICY "Public read access for portfolio images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
CREATE POLICY "Authenticated users can upload portfolio images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to update their uploaded images
DROP POLICY IF EXISTS "Authenticated users can update portfolio images" ON storage.objects;
CREATE POLICY "Authenticated users can update portfolio images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to delete images
DROP POLICY IF EXISTS "Authenticated users can delete portfolio images" ON storage.objects;
CREATE POLICY "Authenticated users can delete portfolio images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-images');
