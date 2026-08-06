import { useState, useEffect, useRef } from "react";
import { useParams, Link, Navigate } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/app/types/article";
import { AnimatedArrowUpRight, ArrowUpRightIconHandle } from "@/app/components/AnimatedArrowUpRight";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [prev, setPrev] = useState<Article | null>(null);
  const [next, setNext] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const arrowRef = useRef<ArrowUpRightIconHandle>(null);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  async function loadArticle() {
    if (!slug) return;

    setLoading(true);

    // Charger l'article actuel
    const { data: currentArticle, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("visible", true)
      .single();

    if (error || !currentArticle) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setArticle(currentArticle);

    // Charger tous les articles pour navigation
    const { data: allArticles } = await supabase
      .from("articles")
      .select("*")
      .eq("visible", true)
      .order("date", { ascending: false });

    if (allArticles) {
      const idx = allArticles.findIndex((a) => a.slug === slug);
      setPrev(allArticles[idx - 1] ?? null);
      setNext(allArticles[idx + 1] ?? null);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (notFound || !article) {
    return <Navigate to="/journal" replace />;
  }

  return (
    <div className="pt-16 bg-background">
      {/* HEADER FULL WIDTH */}
      <div className="w-full px-8 md:px-16 pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors mb-16"
            >
              <ArrowLeft size={12} />
              Retour au journal
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[10px] tracking-widest uppercase text-accent mb-8"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {article.categorie} · {formatDate(article.date)}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.1] mb-10 max-w-[1000px]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {article.titre}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-[800px]"
          >
            {article.extrait}
          </motion.p>
        </div>
      </div>

      {/* IMAGE COUVERTURE FULL WIDTH */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full px-8 md:px-16 mb-20 md:mb-28"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <img
              src={article.banniere_url}
              alt={article.titre}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      {/* CONTENU */}
      <div className="max-w-[720px] mx-auto px-6 md:px-8 pb-32 md:pb-40 space-y-8">
        {article.contenu.map((bloc, i) => {
          if (bloc.type === "text") {
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="text-base md:text-lg leading-[1.8] text-foreground font-light"
              >
                {bloc.content}
              </motion.p>
            );
          }
          if (bloc.type === "quote") {
            return (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="my-12 md:my-16 py-8 md:py-12"
              >
                <p
                  className="text-2xl md:text-3xl lg:text-4xl italic text-accent leading-[1.3]"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}
                >
                  "{bloc.content}"
                </p>
              </motion.blockquote>
            );
          }
          if (bloc.type === "image") {
            return (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                className="my-12 md:my-16 -mx-6 md:mx-0"
              >
                <div className="overflow-hidden">
                  <img
                    src={bloc.src}
                    alt={bloc.caption ?? ""}
                    className="w-full object-cover"
                  />
                </div>
                {bloc.caption && (
                  <figcaption
                    className="mt-4 px-6 md:px-0 text-xs text-muted-foreground uppercase tracking-wider"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {bloc.caption}
                  </figcaption>
                )}
              </motion.figure>
            );
          }
          if (bloc.type === "video") {
            return (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                className="my-12 md:my-16 -mx-6 md:mx-0"
              >
                <div className="aspect-video bg-black overflow-hidden">
                  <iframe
                    src={bloc.src}
                    className="w-full h-full"
                    allowFullScreen
                    title={bloc.caption || "Vidéo"}
                  />
                </div>
                {bloc.caption && (
                  <figcaption
                    className="mt-4 px-6 md:px-0 text-xs text-muted-foreground uppercase tracking-wider"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {bloc.caption}
                  </figcaption>
                )}
              </motion.figure>
            );
          }
          return null;
        })}
      </div>

      {/* CTA CONTACT */}
      <div className="border-t border-border bg-card">
        <div className="max-w-4xl mx-auto px-8 md:px-16 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p
              className="text-3xl md:text-4xl font-normal mb-2"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Un projet de jardin en tête ?
            </p>
            <p className="text-sm text-muted-foreground">
              Discutons ensemble de vos envies et de votre espace.
            </p>
          </div>
          <motion.a
            href="/#contact"
            onHoverStart={() => arrowRef.current?.startAnimation()}
            onHoverEnd={() => arrowRef.current?.stopAnimation()}
            whileHover={{ backgroundColor: "rgba(250,246,238,0.9)" }}
            whileTap={{ backgroundColor: "rgba(250,246,238,0.8)" }}
            transition={{ duration: 0.2 }}
            className="group relative inline-flex items-center gap-2 px-6 py-3.5 text-xs tracking-widest uppercase"
            style={{ backgroundColor: "#faf6ee", color: "#1e2319" }}
          >
            Prendre contact
            <AnimatedArrowUpRight ref={arrowRef} size={13} />
          </motion.a>
        </div>
      </div>

      {/* NAVIGATION ENTRE ARTICLES */}
      <div className="border-t border-border bg-background">
        <div className="max-w-4xl mx-auto px-8 md:px-16 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {prev ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to={`/journal/${prev.slug}`} className="group flex flex-col gap-3">
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                  <ArrowLeft size={11} /> Article précédent
                </span>
                <span
                  className="text-xl md:text-2xl font-normal group-hover:text-accent transition-colors leading-snug"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {prev.titre}
                </span>
              </Link>
            </motion.div>
          ) : <div />}

          {next ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to={`/journal/${next.slug}`} className="group flex flex-col gap-3 md:text-right md:items-end">
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                  Article suivant <ArrowUpRight size={11} />
                </span>
                <span
                  className="text-xl md:text-2xl font-normal group-hover:text-accent transition-colors leading-snug"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {next.titre}
                </span>
              </Link>
            </motion.div>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
