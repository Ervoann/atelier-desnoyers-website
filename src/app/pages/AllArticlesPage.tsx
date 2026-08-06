import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/app/types/article";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AllArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("visible", true)
      .order("date", { ascending: false });

    if (error) {
      console.error("Erreur de chargement des articles:", error);
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <p className="text-muted-foreground">Chargement des articles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="w-full px-8 md:px-16 pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] tracking-widest uppercase text-accent mb-6"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Journal
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] mb-6"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Tous les <em>articles</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[800px]"
          >
            Découvrez mes réflexions, conseils et inspirations autour du jardin et du paysage.
          </motion.p>
        </div>
      </div>

      {/* Grille d'articles */}
      <div className="w-full px-8 md:px-16 pb-32 md:pb-40">
        <div className="max-w-[1400px] mx-auto">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Aucun article publié pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {articles.map((article, i) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                >
                  <Link to={`/journal/${article.slug}`} className="group block">
                    {/* Image */}
                    <div className="aspect-[4/3] bg-muted overflow-hidden mb-4 border-t-[3px] border-accent/60">
                      <img
                        src={article.banniere_url}
                        alt={article.titre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Métadonnées */}
                    <p
                      className="text-[10px] tracking-widest uppercase text-muted-foreground mb-3"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {article.categorie} · {formatDate(article.date)}
                    </p>

                    {/* Titre */}
                    <h2
                      className="text-2xl font-normal leading-snug mb-3 group-hover:text-accent transition-colors"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {article.titre}
                    </h2>

                    {/* Extrait */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {article.extrait}
                    </p>

                    {/* Lien */}
                    <span className="inline-flex items-center gap-1 text-xs tracking-widest uppercase text-accent group-hover:gap-2 transition-all">
                      Lire l'article <ArrowUpRight size={11} />
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
