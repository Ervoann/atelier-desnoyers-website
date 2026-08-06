import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/app/types/article';
import { Edit2, Trash2, GripVertical, Eye, EyeOff, Plus } from 'lucide-react';
import ArticleEditForm from './ArticleEditForm';
import type { ArticleFormData } from '@/app/types/article';

interface ArticleManagerProps {
  onReload: () => void;
}

interface ReorderItemProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onToggleVisible: (id: string) => void;
}

function ReorderItem({ article, onEdit, onDelete, onToggleVisible }: ReorderItemProps) {
  return (
    <Reorder.Item
      value={article}
      id={`article-${article.id}`}
      className="bg-white border-2 rounded-lg p-4 cursor-move hover:border-green-300 transition-colors"
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div className="p-2 cursor-grab active:cursor-grabbing">
          <GripVertical size={20} className="text-gray-400" />
        </div>

        {/* Image */}
        <div className="w-20 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={article.banniere_url}
            alt={article.titre}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              article.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {article.visible ? 'Visible' : 'Masqué'}
            </span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {article.categorie}
            </span>
          </div>
          <h3 className="font-medium text-gray-900">{article.titre}</h3>
          <p className="text-sm text-gray-600">{new Date(article.date).toLocaleDateString('fr-FR')}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisible(article.id);
            }}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title={article.visible ? 'Masquer' : 'Afficher'}
          >
            {article.visible ? <Eye size={18} className="text-gray-600" /> : <EyeOff size={18} className="text-gray-400" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(article);
            }}
            className="p-2 hover:bg-green-100 rounded text-green-600 transition-colors"
            title="Éditer"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
                onDelete(article.id);
              }
            }}
            className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function ArticleManager({ onReload }: ArticleManagerProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isAddingArticle, setIsAddingArticle] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('ordre', { ascending: true });

    if (error) {
      console.error('Erreur chargement articles:', error);
    } else {
      setArticles(data || []);
    }
  }

  async function handleReorder(newOrder: Article[]) {
    setArticles(newOrder);

    // Mettre à jour l'ordre
    const updates = newOrder.map((article, index) => ({
      id: article.id,
      ordre: index,
    }));

    for (const update of updates) {
      await supabase
        .from('articles')
        .update({ ordre: update.ordre })
        .eq('id', update.id);
    }
  }

  async function handleToggleVisible(id: string) {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    const { error } = await supabase
      .from('articles')
      .update({ visible: !article.visible })
      .eq('id', id);

    if (!error) {
      loadArticles();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (!error) {
      loadArticles();
    }
  }

  async function handleSaveArticle(formData: ArticleFormData) {
    if (editingArticle) {
      // Update
      const { error } = await supabase
        .from('articles')
        .update(formData)
        .eq('id', editingArticle.id);

      if (!error) {
        setEditingArticle(null);
        loadArticles();
        onReload();
      }
    } else {
      // Create
      const { data: lastArticle } = await supabase
        .from('articles')
        .select('ordre')
        .order('ordre', { ascending: false })
        .limit(1)
        .single();

      const ordre = lastArticle ? lastArticle.ordre + 1 : 0;

      const { error } = await supabase
        .from('articles')
        .insert({
          ...formData,
          ordre,
        });

      if (!error) {
        setIsAddingArticle(false);
        loadArticles();
        onReload();
      }
    }
  }

  if (isAddingArticle || editingArticle) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
        </h3>
        <ArticleEditForm
          initialData={editingArticle ? {
            titre: editingArticle.titre,
            slug: editingArticle.slug,
            extrait: editingArticle.extrait,
            categorie: editingArticle.categorie,
            date: editingArticle.date,
            banniere_url: editingArticle.banniere_url,
            contenu: editingArticle.contenu,
            visible: editingArticle.visible,
          } : undefined}
          onSave={handleSaveArticle}
          onCancel={() => {
            setEditingArticle(null);
            setIsAddingArticle(false);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Articles ({articles.length})
        </h3>
        <button
          onClick={() => setIsAddingArticle(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={18} />
          Ajouter un article
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">Aucun article pour le moment</p>
          <button
            onClick={() => setIsAddingArticle(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={18} />
            Créer votre premier article
          </button>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={articles}
          onReorder={handleReorder}
          className="space-y-3"
        >
          {articles.map((article) => (
            <ReorderItem
              key={article.id}
              article={article}
              onEdit={setEditingArticle}
              onDelete={handleDelete}
              onToggleVisible={handleToggleVisible}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
