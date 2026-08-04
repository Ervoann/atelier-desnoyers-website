import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Trash2, Check } from 'lucide-react';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string) => void;
  bucketName?: string;
}

interface StorageImage {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function ImageGalleryModal({
  isOpen,
  onClose,
  onSelectImage,
  bucketName = 'portfolios'
}: ImageGalleryModalProps) {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

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

  const handleSelect = (url: string) => {
    if (onSelectImage) {
      onSelectImage(url);
      onClose();
    } else {
      setSelectedImage(url);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-white rounded-lg shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Galerie d'images</h2>
            <p className="text-sm text-gray-500 mt-1">
              {images.length} image{images.length !== 1 ? 's' : ''} dans le bucket
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg mb-2">Aucune image dans la galerie</p>
              <p className="text-sm">Uploadez des images via les formulaires de projet pour les voir ici</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.name}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image.url
                      ? 'border-green-500 ring-2 ring-green-500'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => handleSelect(image.url)}
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

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2">
                    {onSelectImage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(image.url);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Sélectionner
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.name);
                      }}
                      disabled={deleting === image.name}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting === image.name ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>

                  {/* Selected indicator */}
                  {selectedImage === image.url && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <Check size={16} />
                    </div>
                  )}

                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">
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

        {/* Footer */}
        {!onSelectImage && (
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
