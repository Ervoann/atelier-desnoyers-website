import { useState } from "react";
import { GripVertical, X, Type, Quote, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { Reorder } from "framer-motion";
import type { ArticleBlock, ArticleFormData } from "@/app/types/article";
import ImageUploader from "./ImageUploader";
import ImageGalleryModal from "./ImageGalleryModal";

interface BlockItemProps {
  block: ArticleBlock & { id: string };
  index: number;
  onUpdate: (index: number, block: ArticleBlock) => void;
  onDelete: (index: number) => void;
}

function BlockItem({ block, index, onUpdate, onDelete }: BlockItemProps) {
  const [showGallery, setShowGallery] = useState(false);

  const handleImageSelect = (url: string) => {
    if (block.type === 'image') {
      onUpdate(index, { ...block, src: url });
    }
    setShowGallery(false);
  };

  return (
    <>
      <Reorder.Item
        value={block}
        id={block.id}
        className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div className="cursor-grab active:cursor-grabbing mt-2">
            <GripVertical size={20} className="text-gray-400" />
          </div>

          {/* Block Content */}
          <div className="flex-1">
            {block.type === "text" && (
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-600 uppercase">
                  Paragraphe
                </label>
                <textarea
                  value={block.content}
                  onChange={(e) => onUpdate(index, { ...block, content: e.target.value })}
                  rows={4}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-green-500"
                  placeholder="Contenu du paragraphe..."
                />
              </div>
            )}

            {block.type === "quote" && (
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-600 uppercase">
                  Citation
                </label>
                <textarea
                  value={block.content}
                  onChange={(e) => onUpdate(index, { ...block, content: e.target.value })}
                  rows={3}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg p-3 text-sm italic focus:outline-none focus:border-green-500"
                  placeholder="Votre citation..."
                />
              </div>
            )}

            {block.type === "image" && (
              <div className="space-y-3">
                {block.src ? (
                  <div className="relative">
                    <img
                      src={block.src}
                      alt="Prévisualisation"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdate(index, { ...block, src: '' })}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setShowGallery(true)}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                  >
                    <ImageIcon className="text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 mb-1">Cliquez pour sélectionner une image</p>
                    <p className="text-xs text-gray-400">Depuis la galerie Supabase</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowGallery(true)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <ImageIcon size={16} />
                  {block.src ? 'Changer l\'image' : 'Choisir depuis la galerie'}
                </button>

                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-600 uppercase">
                    Ou entrez une URL directement
                  </label>
                  <input
                    type="url"
                    value={block.src}
                    onChange={(e) => onUpdate(index, { ...block, src: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-600 uppercase">
                    Légende (optionnel)
                  </label>
                  <input
                    type="text"
                    value={block.caption || ""}
                    onChange={(e) => onUpdate(index, { ...block, caption: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="Légende de l'image..."
                  />
                </div>
              </div>
            )}

            {block.type === "video" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-600 uppercase">
                    Type de vidéo
                  </label>
                  <select
                    value={block.provider || 'youtube'}
                    onChange={(e) => onUpdate(index, { ...block, provider: e.target.value as 'youtube' | 'vimeo' | 'direct' })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="direct">URL directe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-600 uppercase">
                    URL de la vidéo
                  </label>
                  <input
                    type="url"
                    value={block.src}
                    onChange={(e) => onUpdate(index, { ...block, src: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder={
                      block.provider === 'youtube'
                        ? "https://www.youtube.com/embed/VIDEO_ID"
                        : block.provider === 'vimeo'
                        ? "https://player.vimeo.com/video/VIDEO_ID"
                        : "https://..."
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {block.provider === 'youtube' && "Utilisez l'URL d'embed YouTube"}
                    {block.provider === 'vimeo' && "Utilisez l'URL d'embed Vimeo"}
                    {block.provider === 'direct' && "URL directe vers le fichier vidéo"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-600 uppercase">
                    Légende (optionnel)
                  </label>
                  <input
                    type="text"
                    value={block.caption || ""}
                    onChange={(e) => onUpdate(index, { ...block, caption: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="Légende de la vidéo..."
                  />
                </div>
                {block.src && (
                  <div className="mt-2 aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={block.src}
                      className="w-full h-full"
                      allowFullScreen
                      title="Prévisualisation vidéo"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors mt-1"
            title="Supprimer ce bloc"
          >
            <X size={18} className="text-red-600" />
          </button>
        </div>
      </Reorder.Item>

      {showGallery && block.type === 'image' && (
        <ImageGalleryModal
          isOpen={showGallery}
          onClose={() => setShowGallery(false)}
          onSelectImage={handleImageSelect}
          bucketName="portfolios"
        />
      )}
    </>
  );
}

interface ArticleEditFormProps {
  initialData?: ArticleFormData;
  onSave: (data: ArticleFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ArticleEditForm({ initialData, onSave, onCancel }: ArticleEditFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>(
    initialData || {
      titre: "",
      slug: "",
      extrait: "",
      categorie: "Inspiration",
      date: new Date().toISOString().split("T")[0],
      banniere_url: "",
      contenu: [],
      visible: true,
    }
  );

  const [saving, setSaving] = useState(false);

  // Générer un slug à partir du titre
  function generateSlug(titre: string) {
    return titre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleTitreChange(titre: string) {
    setFormData((prev) => ({
      ...prev,
      titre,
      slug: generateSlug(titre),
    }));
  }

  function addBlock(type: ArticleBlock["type"]) {
    const newBlock: ArticleBlock =
      type === "text"
        ? { type: "text", content: "" }
        : type === "quote"
        ? { type: "quote", content: "" }
        : type === "image"
        ? { type: "image", src: "", caption: "" }
        : { type: "video", src: "", caption: "", provider: "youtube" };

    setFormData((prev) => ({
      ...prev,
      contenu: [...prev.contenu, newBlock],
    }));
  }

  function updateBlock(index: number, block: ArticleBlock) {
    setFormData((prev) => ({
      ...prev,
      contenu: prev.contenu.map((b, i) => (i === index ? block : b)),
    }));
  }

  function deleteBlock(index: number) {
    setFormData((prev) => ({
      ...prev,
      contenu: prev.contenu.filter((_, i) => i !== index),
    }));
  }

  function handleReorder(newOrder: (ArticleBlock & { id: string })[]) {
    setFormData((prev) => ({
      ...prev,
      contenu: newOrder.map(({ id, ...block }) => block),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      alert("Erreur lors de la sauvegarde de l'article");
    }
    setSaving(false);
  }

  const blocksWithIds = formData.contenu.map((block, i) => ({
    ...block,
    id: `block-${i}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Métadonnées */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => handleTitreChange(e.target.value)}
              required
              className="w-full bg-white border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
              placeholder="Titre de l'article..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL) *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="w-full bg-white border-2 border-gray-300 rounded-lg p-3 text-sm text-gray-600 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Extrait *</label>
          <textarea
            value={formData.extrait}
            onChange={(e) => setFormData({ ...formData, extrait: e.target.value })}
            required
            rows={3}
            className="w-full bg-white border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
            placeholder="Description courte de l'article..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
            <select
              value={formData.categorie}
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
              className="w-full bg-white border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
            >
              <option value="Inspiration">Inspiration</option>
              <option value="Conseils">Conseils</option>
              <option value="Sélection">Sélection</option>
              <option value="Réalisation">Réalisation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date de publication *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full bg-white border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <ImageUploader
            currentImageUrl={formData.banniere_url}
            onImageUploaded={(url) => setFormData({ ...formData, banniere_url: url })}
            label="Image de bannière *"
            bucketName="portfolios"
          />
          <div className="mt-2">
            <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
            <input
              type="text"
              value={formData.banniere_url}
              onChange={(e) => setFormData({ ...formData, banniere_url: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="visible"
            checked={formData.visible}
            onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="visible" className="text-sm font-medium text-gray-700">
            Article visible publiquement
          </label>
        </div>
      </div>

      {/* Contenu avec blocs */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Contenu de l'article</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addBlock("text")}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-green-500 transition text-sm"
              title="Ajouter un paragraphe"
            >
              <Type size={16} />
              Texte
            </button>
            <button
              type="button"
              onClick={() => addBlock("quote")}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-green-500 transition text-sm"
              title="Ajouter une citation"
            >
              <Quote size={16} />
              Citation
            </button>
            <button
              type="button"
              onClick={() => addBlock("image")}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-green-500 transition text-sm"
              title="Ajouter une image"
            >
              <ImageIcon size={16} />
              Image
            </button>
            <button
              type="button"
              onClick={() => addBlock("video")}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-green-500 transition text-sm"
              title="Ajouter une vidéo"
            >
              <VideoIcon size={16} />
              Vidéo
            </button>
          </div>
        </div>

        {blocksWithIds.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-white">
            <p className="text-gray-500 mb-4">
              Aucun bloc de contenu. Commencez par ajouter un élément.
            </p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={blocksWithIds}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {blocksWithIds.map((block, index) => (
              <BlockItem
                key={block.id}
                block={block}
                index={index}
                onUpdate={updateBlock}
                onDelete={deleteBlock}
              />
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
        >
          {saving ? "Enregistrement..." : "Enregistrer l'article"}
        </button>
      </div>

    </form>
  );
}
