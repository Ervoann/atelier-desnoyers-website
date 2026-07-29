import { useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { portfolio } from "@/app/data-generated";

export default function ProjetPage() {
  const { slug } = useParams<{ slug: string }>();
  const projet = portfolio.find((p) => p.slug === slug);

  const [current, setCurrent] = useState(0);

  if (!projet) return <Navigate to="/" replace />;

  const prev = () => setCurrent((c) => (c - 1 + projet.images.length) % projet.images.length);
  const next = () => setCurrent((c) => (c + 1) % projet.images.length);

  const currentIndex = portfolio.findIndex((p) => p.slug === slug);
  const prevProjet = portfolio[currentIndex - 1] ?? null;
  const nextProjet = portfolio[currentIndex + 1] ?? null;

  return (
    <div className="pt-16">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-12 pb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors mb-10"
        >
          <ArrowLeft size={12} />
          Portfolio
        </Link>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p
              className="text-xs tracking-widest uppercase text-accent mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {projet.type} · {projet.annee}
            </p>
            <h1
              className="text-4xl md:text-6xl font-normal leading-[1.04]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {projet.titre}
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1 text-sm text-muted-foreground">
            <span>{projet.lieu}</span>
            <span>{projet.surface}</span>
          </div>
        </div>
      </div>

      {/* CAROUSEL */}
      <div className="relative bg-primary overflow-hidden" style={{ aspectRatio: "16/9", maxHeight: "80vh" }}>
        {/* Images */}
        <div className="relative w-full h-full">
          {projet.images.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <img
                src={img}
                alt={`${projet.titre} — vue ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Image précédente"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Image suivante"
        >
          <ChevronRight size={18} />
        </button>

        {/* Counter */}
        <div
          className="absolute bottom-4 right-4 text-white/60 text-xs"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {String(current + 1).padStart(2, "0")} / {String(projet.images.length).padStart(2, "0")}
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {projet.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300"
              aria-label={`Vue ${i + 1}`}
            >
              <div
                className={`h-px transition-all duration-300 ${
                  i === current ? "w-8 bg-white" : "w-4 bg-white/35"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-12 gap-12">
        {/* Description */}
        <div className="md:col-span-7">
          <p
            className="text-xs tracking-widest uppercase text-muted-foreground mb-6"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Note de projet
          </p>
          <p
            className="text-lg md:text-xl leading-relaxed text-foreground"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300 }}
          >
            {projet.description}
          </p>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-5 md:pl-8 md:border-l border-border">
          <div className="space-y-6">
            {[
              { label: "Lieu", value: projet.lieu },
              { label: "Type", value: projet.type },
              { label: "Surface", value: projet.surface },
              { label: "Année", value: projet.annee },
            ].map((row) => (
              <div key={row.label} className="flex flex-col gap-1 border-b border-border pb-5">
                <span
                  className="text-[10px] tracking-widest uppercase text-muted-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {row.label}
                </span>
                <span className="text-sm text-foreground">{row.value}</span>
              </div>
            ))}

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <span
                className="text-[10px] tracking-widest uppercase text-muted-foreground"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Thématiques
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {projet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs border border-accent/40 text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a
              href="/#contact"
              className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-4 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
            >
              Votre projet de jardin <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* NAVIGATION ENTRE PROJETS */}
      <div className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 flex justify-between gap-4">
          {prevProjet ? (
            <Link
              to={`/projets/${prevProjet.slug}`}
              className="group flex flex-col gap-1 max-w-xs"
            >
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground flex items-center gap-1">
                <ArrowLeft size={10} /> Projet précédent
              </span>
              <span
                className="text-lg font-normal group-hover:text-accent transition-colors"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {prevProjet.titre}
              </span>
              <span className="text-xs text-muted-foreground">{prevProjet.lieu}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextProjet ? (
            <Link
              to={`/projets/${nextProjet.slug}`}
              className="group flex flex-col gap-1 max-w-xs text-right"
            >
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground flex items-center justify-end gap-1">
                Projet suivant <ArrowUpRight size={10} />
              </span>
              <span
                className="text-lg font-normal group-hover:text-accent transition-colors"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {nextProjet.titre}
              </span>
              <span className="text-xs text-muted-foreground">{nextProjet.lieu}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
