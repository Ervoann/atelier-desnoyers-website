import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Grip, Trash2, ExternalLink, Save, X } from 'lucide-react';
import type { JardinImageData } from '../hooks/useSupabaseData';
import ImageUploader from './ImageUploader';

interface JardinManagerProps {
  images: JardinImageData[];
  onUpdate: () => void;
}

export default function JardinManager({ images: initialImages, onUpdate }: JardinManagerProps) {
  const [images, setImages] = useState<JardinImageData[]>(initialImages);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleDragStart = (id: number) => {
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggingId === null || draggingId === targetId) return;

    const dragIndex = images.findIndex(img => img.id === draggingId);
    const targetIndex = images.findIndex(img => img.id === targetId);

    const newImages = [...images];
    const [draggedItem] = newImages.splice(dragIndex, 1);
    newImages.splice(targetIndex, 0, draggedItem);

    // Mettre à jour les ordres
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      ordre: index + 1
    }));

    setImages(updatedImages);
  };

  const handleDragEnd = async () => {
    if (draggingId === null) return;

    setSaving(true);
    try {
      // Mettre à jour l'ordre dans Supabase
      await Promise.all(
        images.map(img =>
          supabase
            .from('jardin_images')
            .update({ ordre: img.ordre })
            .eq('id', img.id)
        )
      );

      setMessage('✓ Ordre sauvegardé');
      setTimeout(() => setMessage(null), 2000);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'ordre:', err);
      setMessage('✗ Erreur de sauvegarde');
    } finally {
      setSaving(false);
      setDraggingId(null);
    }
  };

  const handleUpdate = async (id: number, field: 'imageUrl' | 'altText' | 'linkUrl', value: string) => {
    const updated = images.map(img =>
      img.id === id ? { ...img, [field]: value } : img
    );
    setImages(updated);
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    const img = images.find(i => i.id === id);
    if (!img) return;

    try {
      const { error } = await supabase
        .from('jardin_images')
        .update({
          image_url: img.imageUrl,
          alt_text: img.altText,
          link_url: img.linkUrl
        })
        .eq('id', id);

      if (error) throw error;

      setMessage('✓ Sauvegardé');
      setTimeout(() => setMessage(null), 2000);
      setEditingId(null);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setMessage('✗ Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette image ?')) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('jardin_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImages(images.filter(img => img.id !== id));
      setMessage('✓ Supprimée');
      setTimeout(() => setMessage(null), 2000);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setMessage('✗ Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      const maxOrdre = Math.max(...images.map(img => img.ordre), 0);

      const { data, error } = await supabase
        .from('jardin_images')
        .insert({
          image_url: '',
          alt_text: '',
          link_url: 'https://www.instagram.com/antoine.desnoyers/',
          ordre: maxOrdre + 1
        })
        .select()
        .single();

      if (error) throw error;

      const newImage: JardinImageData = {
        id: data.id,
        imageUrl: '',
        altText: '',
        linkUrl: 'https://www.instagram.com/antoine.desnoyers/',
        ordre: maxOrdre + 1
      };

      setImages([...images, newImage]);
      setEditingId(data.id);
      setMessage('✓ Image ajoutée');
      setTimeout(() => setMessage(null), 2000);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setMessage('✗ Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Le jardin en images</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les images de la galerie Instagram. Glissez-déposez pour réorganiser. Les 6 premières sont visibles sur le site.
          </p>
        </div>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          + Ajouter une image
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.startsWith('✓') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {images.map((img, index) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => handleDragStart(img.id)}
            onDragOver={(e) => handleDragOver(e, img.id)}
            onDragEnd={handleDragEnd}
            className={`bg-white border-2 rounded-lg p-4 transition ${
              draggingId === img.id
                ? 'opacity-50 border-green-500'
                : 'border-gray-200 hover:border-gray-300'
            } ${editingId === img.id ? 'ring-2 ring-green-500' : ''} ${
              index < 6 ? '' : 'opacity-60'
            }`}
          >
            {/* Header avec drag handle */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Grip className="text-gray-400 cursor-move" size={20} />
                <span className="text-sm font-medium text-gray-700">
                  Image {index + 1}
                  {index < 6 ? (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">Visible</span>
                  ) : (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">Cachée</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {editingId === img.id ? (
                  <>
                    <button
                      onClick={() => handleSave(img.id)}
                      disabled={saving}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
                      title="Sauvegarder"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition"
                      title="Annuler"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingId(img.id)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(img.id)}
                      disabled={saving}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Preview ou uploader */}
            {editingId === img.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageUploader
                    currentImageUrl={img.imageUrl}
                    onImageUploaded={(url) => handleUpdate(img.id, 'imageUrl', url)}
                    label="Image"
                    bucketName="portfolios"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Texte alternatif
                    </label>
                    <input
                      type="text"
                      value={img.altText || ''}
                      onChange={(e) => handleUpdate(img.id, 'altText', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Description de l'image"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Lien (URL)
                    </label>
                    <input
                      type="url"
                      value={img.linkUrl || ''}
                      onChange={(e) => handleUpdate(img.id, 'linkUrl', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://www.instagram.com/p/..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                <div>
                  {img.imageUrl ? (
                    <img
                      src={img.imageUrl}
                      alt={img.altText || ''}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                      Aucune image
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center space-y-2">
                  {img.altText && (
                    <p className="text-sm text-gray-800"><span className="font-medium">Description :</span> {img.altText}</p>
                  )}
                  {img.linkUrl && (
                    <a
                      href={img.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink size={14} />
                      Voir la publication
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucune image. Cliquez sur "Ajouter une image" pour commencer.</p>
        </div>
      )}
    </div>
  );
}
