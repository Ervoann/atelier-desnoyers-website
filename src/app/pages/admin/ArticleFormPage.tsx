import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import type { Article, ArticleFormData } from "@/app/types/article";
import ArticleEditForm from "@/app/components/ArticleEditForm";

export default function ArticleFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const isNew = id === "nouveau";

  useEffect(() => {
    if (!isNew) {
      loadArticle();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function loadArticle() {
    if (!id) return;

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erreur de chargement:", error);
      alert("Article introuvable");
      navigate("/admin/articles");
    } else {
      setArticle(data);
    }
    setLoading(false);
  }

  async function handleSave(formData: ArticleFormData) {
    if (isNew) {
      // Obtenir le dernier ordre
      const { data: lastArticle } = await supabase
        .from("articles")
        .select("ordre")
        .order("ordre", { ascending: false })
        .limit(1)
        .single();

      const ordre = lastArticle ? lastArticle.ordre + 1 : 0;

      const { error } = await supabase
        .from("articles")
        .insert({
          ...formData,
          ordre,
        });

      if (error) {
        console.error("Erreur de création:", error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from("articles")
        .update(formData)
        .eq("id", id);

      if (error) {
        console.error("Erreur de mise à jour:", error);
        throw error;
      }
    }

    navigate("/admin/articles");
  }

  function handleCancel() {
    navigate("/admin/articles");
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isNew ? "Nouvel article" : "Modifier l'article"}
        </h1>

        <ArticleEditForm
          initialData={article ? {
            titre: article.titre,
            slug: article.slug,
            extrait: article.extrait,
            categorie: article.categorie,
            date: article.date,
            banniere_url: article.banniere_url,
            contenu: article.contenu,
            visible: article.visible,
          } : undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
