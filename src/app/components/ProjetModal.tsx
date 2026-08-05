import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedArrowUpRight, type ArrowUpRightIconHandle } from "./AnimatedArrowUpRight";
import type { PortfolioData, PortfolioSlideData } from "@/app/hooks/useSupabaseData";

type Projet = PortfolioData;
type Slide = PortfolioSlideData;

interface ProjetModalProps {
  projet: Projet | null;
  onClose: () => void;
  onNextProjet?: () => void;
}

function ImageSlide({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover object-center"
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

export default function ProjetModal({ projet, onClose, onNextProjet }: ProjetModalProps) {
  const [current, setCurrent] = useState(0);
  const arrowRef = useRef<ArrowUpRightIconHandle>(null);

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 lg:p-12"
      style={{ backgroundColor: "rgba(30,35,25,0.88)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-[1600px] h-[90vh] bg-background flex flex-col md:flex-row overflow-hidden border-t-[3px] border-accent"
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
        <div className="relative md:w-[55%] lg:w-[50%] flex-shrink-0 flex flex-col bg-primary">
          {/* Slide area - carré parfait */}
          <div className="relative overflow-hidden aspect-square">
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

          {/* Counter - dans la bande noire en bas */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-4">
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
          <div className="px-8 lg:px-12 pt-10 lg:pt-12 pb-8 border-b border-border">
            <p
              className="text-[10px] lg:text-xs tracking-widest uppercase text-accent mb-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {projet.typeProjet || 'Jardin'} · {projet.annee}
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.05] mb-2"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {projet.titre}
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground">{projet.lieu}</p>
          </div>

          {/* Description */}
          <div className="px-8 lg:px-12 py-8 lg:py-10 border-b border-border flex-1">
            <p
              className="text-sm md:text-base lg:text-lg leading-relaxed text-muted-foreground"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 300 }}
            >
              {projet.description}
            </p>
          </div>

          {/* Fiche technique */}
          <div className="px-8 lg:px-12 py-6 lg:py-8 border-b border-border">
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              {[
                { label: "Surface", value: projet.surface },
                { label: "Lieu", value: projet.lieu.split(",")[0] },
                { label: "Année", value: projet.annee },
              ].map((row) => (
                <div key={row.label} className="border-l-[2px] border-accent/40 pl-3 lg:pl-4">
                  <p
                    className="text-[9px] lg:text-[10px] tracking-widest uppercase text-muted-foreground mb-1.5"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {row.label}
                  </p>
                  <p className="text-sm lg:text-base text-foreground">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="px-8 lg:px-12 py-6 lg:py-8 border-b border-border">
            <div className="flex flex-wrap gap-2 lg:gap-2.5">
              {projet.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 lg:px-4 py-1.5 text-[11px] lg:text-xs border border-accent/40 text-accent tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="px-8 lg:px-12 py-8">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Votre projet de jardin - avec animation */}
              <motion.a
                href="/#contact"
                onClick={onClose}
                onHoverStart={() => arrowRef.current?.startAnimation()}
                onHoverEnd={() => arrowRef.current?.stopAnimation()}
                whileHover={{ backgroundColor: "rgba(26, 31, 22, 0.9)" }}
                whileTap={{ backgroundColor: "rgba(26, 31, 22, 0.8)" }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground text-xs tracking-widest uppercase border-b-[2px] border-accent/60"
              >
                Votre projet de jardin
                <AnimatedArrowUpRight ref={arrowRef} size={12} />
              </motion.a>

              {/* Projet suivant */}
              {onNextProjet && (
                <motion.button
                  onClick={onNextProjet}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(134,162,98,0.6)" }}
                  whileTap={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-accent/40 text-accent text-xs tracking-widest uppercase"
                >
                  Projet suivant
                  <ChevronRight size={14} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
