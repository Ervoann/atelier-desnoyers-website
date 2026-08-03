import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Play } from "lucide-react";
import type { PortfolioData, PortfolioSlideData } from "@/app/hooks/useSupabaseData";

type Projet = PortfolioData;
type Slide = PortfolioSlideData;

interface ProjetModalProps {
  projet: Projet | null;
  onClose: () => void;
}

function ImageSlide({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
    />
  );
}

function YoutubeSlide({ videoId }: { videoId: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=1&rel=0&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>
    </div>
  );
}

function SlideIcon({ slide }: { slide: Slide }) {
  if (slide.type === "youtube") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary/80">
        <div className="w-8 h-8 border border-white/40 flex items-center justify-center">
          <Play size={14} className="text-white/70 ml-0.5" />
        </div>
      </div>
    );
  }
  return (
    <img src={(slide.src || '').replace("w=1600&h=900", "w=120&h=90")} alt="" className="w-full h-full object-cover" />
  );
}

export default function ProjetModal({ projet, onClose }: ProjetModalProps) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => {
    if (!projet || !projet.slides) return;
    setCurrent((c) => (c - 1 + projet.slides.length) % projet.slides.length);
  }, [projet]);

  const next = useCallback(() => {
    if (!projet || !projet.slides) return;
    setCurrent((c) => (c + 1) % projet.slides.length);
  }, [projet]);

  useEffect(() => {
    setCurrent(0);
  }, [projet]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    if (projet) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [projet, prev, next, onClose]);

  if (!projet || !projet.slides) return null;

  const slide = projet.slides[current];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "rgba(30,35,25,0.88)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-6xl bg-background flex flex-col md:flex-row overflow-hidden border-t-[3px] border-accent"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Liseré gauche vertical */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[3px] bg-accent/20 z-10" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 z-20 w-10 h-10 bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors"
          aria-label="Fermer"
        >
          <X size={14} className="text-accent-foreground" />
        </button>

        {/* ── CARROUSEL ── */}
        <div className="relative md:w-[60%] flex-shrink-0 flex flex-col bg-primary">
          {/* Slide area */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
            {projet.slides.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
              >
                {s.type === "image" ? (
                  <ImageSlide src={s.src || ''} alt={`${projet.titre} — vue ${i + 1}`} />
                ) : (
                  <YoutubeSlide videoId={s.video_id || ''} />
                )}
              </div>
            ))}

            {/* Arrows — toujours visibles */}
            <button
              onClick={prev}
              className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-primary/0 hover:bg-primary/40 transition-colors group z-10"
              aria-label="Précédent"
            >
              <ChevronLeft size={20} className="text-white/70 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center bg-primary/0 hover:bg-primary/40 transition-colors group z-10"
              aria-label="Suivant"
            >
              <ChevronRight size={20} className="text-white/70 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Counter */}
          <div className="flex flex-col items-center gap-1.5 py-3 border-t border-accent/20">
            <div className="flex gap-1.5">
              {projet.slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-px transition-all duration-300 ${
                    i === current ? "w-6 bg-accent" : "w-3 bg-accent/25"
                  }`}
                />
              ))}
            </div>
            <span
              className="text-[10px] text-muted-foreground"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {String(current + 1).padStart(2, "0")} / {String(projet.slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* ── INFOS ── */}
        <div className="flex-1 flex flex-col overflow-y-auto border-l-[2px] border-accent/30">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-border">
            <p
              className="text-[10px] tracking-widest uppercase text-accent mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {projet.typeProjet || 'Jardin'} · {projet.annee}
            </p>
            <h2
              className="text-3xl md:text-4xl font-normal leading-[1.05] mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {projet.titre}
            </h2>
            <p className="text-sm text-muted-foreground">{projet.lieu}</p>
          </div>

          {/* Description */}
          <div className="px-8 py-6 border-b border-border flex-1">
            <p
              className="text-sm md:text-base leading-relaxed text-muted-foreground"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 300 }}
            >
              {projet.description}
            </p>
          </div>

          {/* Fiche technique */}
          <div className="px-8 py-5 border-b border-border">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Surface", value: projet.surface },
                { label: "Lieu", value: projet.lieu.split(",")[0] },
                { label: "Année", value: projet.annee },
              ].map((row) => (
                <div key={row.label} className="border-l-[2px] border-accent/40 pl-3">
                  <p
                    className="text-[9px] tracking-widest uppercase text-muted-foreground mb-1"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {row.label}
                  </p>
                  <p className="text-sm text-foreground">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="px-8 py-5 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {projet.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[11px] border border-accent/40 text-accent tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="px-8 py-6">
            <a
              href="/#contact"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:opacity-80 transition-opacity border-b-[2px] border-accent/60"
            >
              Votre projet de jardin <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
