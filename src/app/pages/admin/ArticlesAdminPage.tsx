import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, GripVertical, Eye, EyeOff, Edit2, Trash2 } from "lucide-react";
import { Reorder } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/app/types/article";

interface ArticleItemProps {
  article: Article;
  onToggleVisible: (id: string, visible: boolean) => void;
  onDelete: (id: string) => void;
}

function ArticleItem({ article, onToggleVisible, onDelete }: ArticleItemProps) {
  return (
    <Reorder.Item
      value={article}
      id={`article-${article.id}`}
      className="bg-card border border-border p-4 cursor-move hover:bg-accent/5 transition-colors"
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing">
          <GripVertical size={20} className="text-muted-foreground" />
        </div>

        {/* Thumbnail */}
        <div className="w-24 h-16 bg-muted overflow-hidden flex-shrink-0">
          <img
            src={article.banniere_url}
            alt={article.titre}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{article.titre}</h3>
          <p className="text-sm text-muted-foreground">
            {article.categorie} • {new Date(article.date).toLocaleDateString("fr-FR")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleVisible(article.id, !article.visible)}
            className="p-2 hover:bg-accent/10 rounded transition-colors"
            title={article.visible ? "Masquer" : "Afficher"}
          >
            {article.visible ? (
              <Eye size={18} className="text-accent" />
            ) : (
              <EyeOff size={18} className="text-muted-foreground" />
            )}
          </button>

          <Link
            to={`/admin/articles/${article.id}`}
            className="p-2 hover:bg-accent/10 rounded transition-colors"
            title="Modifier"
          >
            <Edit2 size={18} className="text-muted-foreground hover:text-accent" />
          </Link>

          <button
            onClick={() => {
              if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
                onDelete(article.id);
              }
            }}
            className="p-2 hover:bg-destructive/10 rounded transition-colors"
            title="Supprimer"
          >
            <Trash2 size={18} className="text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("ordre", { ascending: true });

    if (error) {
      console.error("Erreur de chargement des articles:", error);
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  }

  async function handleReorder(newOrder: Article[]) {
    setArticles(newOrder);

    // Mettre à jour l'ordre dans Supabase
    const updates = newOrder.map((article, index) => ({
      id: article.id,
      ordre: index,
    }));

    for (const update of updates) {
      await supabase
        .from("articles")
        .update({ ordre: update.ordre })
        .eq("id", update.id);
    }
  }

  async function handleToggleVisible(id: string, visible: boolean) {
    const { error } = await supabase
      .from("articles")
      .update({ visible })
      .eq("id", id);

    if (error) {
      console.error("Erreur de mise à jour de la visibilité:", error);
    } else {
      setArticles((prev) =>
        prev.map((article) =>
          article.id === id ? { ...article, visible } : article
        )
      );
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur de suppression:", error);
    } else {
      setArticles((prev) => prev.filter((article) => article.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Articles</h1>
            <p className="text-muted-foreground">
              Gérer les articles du blog • {articles.length} article{articles.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/admin/articles/nouveau"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background hover:bg-accent/90 transition-colors"
          >
            <Plus size={18} />
            Nouvel article
          </Link>
        </div>

        {/* Liste des articles avec drag & drop */}
        {articles.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center">
            <p className="text-muted-foreground mb-4">Aucun article pour le moment</p>
            <Link
              to="/admin/articles/nouveau"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background hover:bg-accent/90 transition-colors"
            >
              <Plus size={18} />
              Créer votre premier article
            </Link>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={articles}
            onReorder={handleReorder}
            className="space-y-2"
          >
            {articles.map((article) => (
              <ArticleItem
                key={article.id}
                article={article}
                onToggleVisible={handleToggleVisible}
                onDelete={handleDelete}
              />
            ))}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
}
