import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { PortfolioData, PortfolioSlideData } from '../hooks/useSupabaseData';
import { X, Trash2, GripVertical, Plus, Video } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface PortfolioEditFormProps {
  portfolio: PortfolioData | null;
  onClose: () => void;
  onSave: () => void;
}

export default function PortfolioEditForm({ portfolio, onClose, onSave }: PortfolioEditFormProps) {
  // Form states
  const [slug, setSlug] = useState(portfolio?.slug || '');
  const [titre, setTitre] = useState(portfolio?.titre || '');
  const [chantierNumero, setChantierNumero] = useState(portfolio?.chantierNumero || '');
  const [lieu, setLieu] = useState(portfolio?.lieu || '');
  const [typeProjet, setTypeProjet] = useState(portfolio?.typeProjet || '');
  const [annee, setAnnee] = useState(portfolio?.annee || '');
  const [surface, setSurface] = useState(portfolio?.surface || '');
  const [imagePrincipale, setImagePrincipale] = useState(portfolio?.imagePrincipale || '');
  const [description, setDescription] = useState(portfolio?.description || '');
  const [tags, setTags] = useState((portfolio?.tags || []).join(', '));
  const [ordre, setOrdre] = useState(portfolio?.ordre || 1);

  // Gallery states
  const [slides, setSlides] = useState<PortfolioSlideData[]>(portfolio?.slides || []);
  const [newSlideType, setNewSlideType] = useState<'image' | 'youtube'>('image');
  const [newSlideImage, setNewSlideImage] = useState('');
  const [newSlideVideo, setNewSlideVideo] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load slides if editing existing portfolio
  useEffect(() => {
    if (portfolio?.id) {
      loadSlides();
    }
  }, [portfolio?.id]);

  const loadSlides = async () => {
    if (!portfolio?.id) return;

    try {
      const { data, error } = await supabase
        .from('portfolio_slides')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('ordre', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (err) {
      console.error('Error loading slides:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const portfolioData = {
        slug,
        titre,
        chantier_numero: chantierNumero,
        lieu,
        type_projet: typeProjet,
        annee,
        surface,
        image_principale: imagePrincipale,
        description,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        ordre,
      };

      if (portfolio?.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from('portfolios')
          .update(portfolioData)
          .eq('id', portfolio.id);

        if (updateError) throw updateError;
      } else {
        // Create new
        const { data: newPortfolio, error: insertError } = await supabase
          .from('portfolios')
          .insert(portfolioData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Update portfolio ID for slides
        if (newPortfolio) {
          portfolio = { ...newPortfolio, slides: [] } as PortfolioData;
        }
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
      setSaving(false);
    }
  };

  const handleAddSlide = async () => {
    if (!portfolio?.id) {
      alert('Veuillez d\'abord enregistrer le portfolio');
      return;
    }

    if (newSlideType === 'image' && !newSlideImage) return;
    if (newSlideType === 'youtube' && !newSlideVideo) return;

    try {
      const { error } = await supabase.from('portfolio_slides').insert({
        portfolio_id: portfolio.id,
        type: newSlideType,
        src: newSlideType === 'image' ? newSlideImage : null,
        video_id: newSlideType === 'youtube' ? newSlideVideo : null,
        ordre: slides.length + 1,
      });

      if (error) throw error;

      setNewSlideImage('');
      setNewSlideVideo('');
      await loadSlides();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDeleteSlide = async (slideId: number) => {
    if (!confirm('Supprimer cette slide ?')) return;

    try {
      const { error } = await supabase
        .from('portfolio_slides')
        .delete()
        .eq('id', slideId);

      if (error) throw error;
      await loadSlides();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleReorderSlides = async (newOrder: PortfolioSlideData[]) => {
    setSlides(newOrder);

    try {
      await Promise.all(
        newOrder.map((slide, index) =>
          supabase
            .from('portfolio_slides')
            .update({ ordre: index + 1 })
            .eq('id', slide.id)
        )
      );
    } catch (err) {
      console.error('Error reordering slides:', err);
      await loadSlides();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-5xl w-full my-8">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">
              {portfolio?.id ? 'Éditer le portfolio' : 'Nouveau portfolio'}
            </h2>
            <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded" title="Fermer sans sauvegarder">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chantier numéro</label>
                <input
                  type="text"
                  value={chantierNumero}
                  onChange={(e) => setChantierNumero(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lieu *</label>
                <input
                  type="text"
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de projet</label>
                <input
                  type="text"
                  value={typeProjet}
                  onChange={(e) => setTypeProjet(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Année *</label>
                <input
                  type="text"
                  value={annee}
                  onChange={(e) => setAnnee(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Surface *</label>
                <input
                  type="text"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordre</label>
                <input
                  type="number"
                  value={ordre}
                  onChange={(e) => setOrdre(parseInt(e.target.value))}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (séparés par des virgules)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="jardin, paysage, design"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image principale *</label>
              <ImageUploader
                currentImageUrl={imagePrincipale}
                onImageUploaded={setImagePrincipale}
                label=""
              />
            </div>

            {/* Gallery Section */}
            {portfolio?.id && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Galerie du projet</h3>

                {/* Existing Slides */}
                {slides.length > 0 && (
                  <Reorder.Group
                    axis="y"
                    values={slides}
                    onReorder={handleReorderSlides}
                    className="space-y-3 mb-4"
                  >
                    {slides.map((slide) => (
                      <Reorder.Item
                        key={slide.id}
                        value={slide}
                        className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 cursor-move hover:border-green-300"
                      >
                        <div className="flex items-center gap-3">
                          <div title="Glissez pour réordonner">
                            <GripVertical size={18} className="text-gray-400" />
                          </div>

                          <div className="w-24 h-24 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                            {slide.type === 'image' && slide.src ? (
                              <img src={slide.src} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video className="text-gray-400" size={32} />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                              #{slide.ordre} • {slide.type}
                            </span>
                            {slide.type === 'youtube' && (
                              <p className="text-sm text-gray-600 mt-1">Video ID: {slide.video_id}</p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSlide(slide.id);
                            }}
                            className="p-2 hover:bg-red-100 rounded text-red-600"
                            title="Supprimer cette slide"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )}

                {/* Add New Slide */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Ajouter une slide</h4>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setNewSlideType('image')}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        newSlideType === 'image'
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      title="Ajouter une image"
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewSlideType('youtube')}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        newSlideType === 'youtube'
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      title="Ajouter une vidéo YouTube"
                    >
                      Vidéo YouTube
                    </button>
                  </div>

                  {newSlideType === 'image' ? (
                    <ImageUploader
                      currentImageUrl={newSlideImage}
                      onImageUploaded={setNewSlideImage}
                      label=""
                    />
                  ) : (
                    <input
                      type="text"
                      value={newSlideVideo}
                      onChange={(e) => setNewSlideVideo(e.target.value)}
                      placeholder="ID de la vidéo YouTube (ex: dQw4w9WgXcQ)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleAddSlide}
                    disabled={!newSlideImage && !newSlideVideo}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Ajouter cette slide à la galerie"
                  >
                    <Plus size={18} />
                    Ajouter la slide
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              title="Annuler et fermer sans sauvegarder"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              title="Enregistrer toutes les modifications"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
