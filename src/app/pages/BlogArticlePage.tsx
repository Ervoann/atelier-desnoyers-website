import { useParams, Link, Navigate } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { articles } from "@/app/data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/" replace />;

  const idx = articles.findIndex((a) => a.slug === slug);
  const prev = articles[idx - 1] ?? null;
  const next = articles[idx + 1] ?? null;

  return (
    <div className="pt-16">
      {/* HEADER */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 pt-12 pb-0">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors mb-10"
        >
          <ArrowLeft size={12} />
          Journal
        </Link>

        <p
          className="text-[10px] tracking-widest uppercase text-accent mb-4"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {article.categorie} · {formatDate(article.date)}
        </p>
        <h1
          className="text-4xl md:text-5xl font-normal leading-[1.06] mb-6"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {article.titre}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed border-l-[2px] border-accent/50 pl-5 mb-12">
          {article.extrait}
        </p>
      </div>

      {/* IMAGE COUVERTURE */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 mb-12">
        <div className="w-full overflow-hidden border-t-[3px] border-accent/60" style={{ aspectRatio: "16/9" }}>
          <img
            src={article.image}
            alt={article.titre}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 pb-20 space-y-8">
        {article.contenu.map((bloc, i) => {
          if (bloc.type === "text") {
            return (
              <p
                key={i}
                className="text-base md:text-lg leading-relaxed text-foreground"
                style={{ fontWeight: 300 }}
              >
                {bloc.content}
              </p>
            );
          }
          if (bloc.type === "quote") {
            return (
              <blockquote
                key={i}
                className="border-l-[3px] border-accent pl-6 py-1"
              >
                <p
                  className="text-xl md:text-2xl italic text-accent leading-relaxed"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}
                >
                  "{bloc.content}"
                </p>
              </blockquote>
            );
          }
          if (bloc.type === "image") {
            return (
              <figure key={i} className="my-10">
                <div className="overflow-hidden border-t-[2px] border-accent/50">
                  <img
                    src={bloc.src}
                    alt={bloc.caption ?? ""}
                    className="w-full object-cover"
                  />
                </div>
                {bloc.caption && (
                  <figcaption
                    className="mt-2 text-xs text-muted-foreground"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {bloc.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          return null;
        })}
      </div>

      {/* CTA CONTACT */}
      <div className="border-t border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p
            className="text-xl font-normal"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Un projet de jardin en tête ?
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
          >
            Prendre contact <ArrowUpRight size={12} />
          </a>
        </div>
      </div>

      {/* NAVIGATION ENTRE ARTICLES */}
      <div className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-10 flex justify-between gap-4">
          {prev ? (
            <Link to={`/journal/${prev.slug}`} className="group flex flex-col gap-1 max-w-xs">
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground flex items-center gap-1">
                <ArrowLeft size={10} /> Article précédent
              </span>
              <span
                className="text-base font-normal group-hover:text-accent transition-colors"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {prev.titre}
              </span>
            </Link>
          ) : <div />}

          {next ? (
            <Link to={`/journal/${next.slug}`} className="group flex flex-col gap-1 max-w-xs text-right">
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground flex items-center justify-end gap-1">
                Article suivant <ArrowUpRight size={10} />
              </span>
              <span
                className="text-base font-normal group-hover:text-accent transition-colors"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {next.titre}
              </span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
