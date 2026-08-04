import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, RefreshCw, Upload } from 'lucide-react';

interface ImageGalleryProps {
  bucketName?: string;
}

interface StorageImage {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function ImageGallery({
  bucketName = 'portfolio-images'
}: ImageGalleryProps) {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      // List all files at the root of the bucket
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error listing files:', error);
        setImages([]);
        return;
      }

      const allFiles: StorageImage[] = [];

      // Process all files
      if (files) {
        for (const file of files) {
          // Skip folders
          if (file.id === null) continue;

          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(file.name);

          allFiles.push({
            name: file.name,
            url: publicUrl,
            size: file.metadata?.size || 0,
            createdAt: file.created_at || ''
          });
        }
      }

      setImages(allFiles);
    } catch (err) {
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageName: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.')) {
      return;
    }

    setDeleting(imageName);
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([imageName]);

      if (error) throw error;

      // Reload images
      await loadImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Erreur lors de la suppression de l\'image');
    } finally {
      setDeleting(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      const uploadPromises: Promise<void>[] = [];

      for (const file of Array.from(files)) {
        // Validate file type
        if (!validTypes.includes(file.type)) {
          setUploadError(`Type de fichier non supporté: ${file.name}`);
          continue;
        }

        // Validate file size (50MB)
        if (file.size > 50 * 1024 * 1024) {
          setUploadError(`Fichier trop volumineux: ${file.name} (max 50MB)`);
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const uploadPromise = supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })
          .then(({ error }) => {
            if (error) throw error;
          });

        uploadPromises.push(uploadPromise);
      }

      await Promise.all(uploadPromises);

      // Reload images
      await loadImages();

      // Reset file input
      e.target.value = '';
    } catch (err) {
      console.error('Error uploading images:', err);
      setUploadError('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with stats and action buttons */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {images.length} image{images.length !== 1 ? 's' : ''} dans le bucket
        </p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition cursor-pointer disabled:opacity-50">
            <Upload size={14} />
            {uploading ? 'Upload en cours...' : 'Ajouter des images'}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <button
            onClick={loadImages}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Upload error message */}
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{uploadError}</p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-lg mb-2">Aucune image dans la galerie</p>
          <p className="text-sm">Uploadez des images via les formulaires de projet pour les voir ici</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image.name}
              className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-300 transition-all"
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Overlay with delete button */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                <button
                  onClick={() => handleDelete(image.name)}
                  disabled={deleting === image.name}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  title="Supprimer l'image"
                >
                  {deleting === image.name ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>

              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate" title={image.name}>
                  {image.name.split('/').pop()}
                </p>
                <p className="text-white/70 text-xs">
                  {(image.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
