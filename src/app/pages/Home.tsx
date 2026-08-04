import { ArrowUpRight, ChevronDown } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { accompagnements, articles } from "@/app/data";
import ProjetModal from "@/app/components/ProjetModal";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoBlancSrc from "@/imports/ATELIER-DESNOYERS-BLANC-1.png";
import { useHomepage, useCitation, useDemarcheObserver, useDemarcheDessiner, useDemarcheRealiser, useDemarcheAccompagner, usePortrait, useFaqs, usePortfolios } from "@/app/hooks/useSupabaseData";
import type { PortfolioData } from "@/app/hooks/useSupabaseData";

type Projet = PortfolioData;

// Individual word component with transform
function RevealWord({ word, scrollYProgress, index, totalWords }: { word: string; scrollYProgress: any; index: number; totalWords: number }) {
  // Map the scroll progress to reveal words progressively
  // Start at 0.1 and end at 0.7 to finish animation earlier
  const start = 0.1 + (index / totalWords) * 0.6;
  const end = 0.1 + ((index + 1) / totalWords) * 0.6;
  const opacity = useTransform(scrollYProgress, [start, end], [0.3, 1]);
  const filter = useTransform(scrollYProgress, [start, end], ["blur(2px)", "blur(0px)"]);

  return (
    <motion.span
      style={{
        opacity,
        filter,
        display: "inline-block",
        marginRight: "0.35em"
      }}
    >
      {word}
    </motion.span>
  );
}

// Word reveal animation component with scroll-linked progress
function WordReveal({ text, scrollYProgress }: { text: string; scrollYProgress: any }) {
  const words = text.split(" ");

  return (
    <div>
      {words.map((word, index) => (
        <RevealWord
          key={index}
          word={word}
          scrollYProgress={scrollYProgress}
          index={index}
          totalWords={words.length}
        />
      ))}
    </div>
  );
}

// Stacking section component for Observer, Dessiner, Realiser, Accompagner
function StackingSection({ children, id, className, zIndex, isLast }: { children: React.ReactNode; id: string; className?: string; zIndex: number; isLast?: boolean }) {
  return (
    <div className="md:relative md:h-[300vh]" style={{ height: isLast ? 'auto' : undefined }}>
      <section
        id={id}
        className={`md:sticky md:top-0 md:min-h-screen ${className}`}
        style={{
          zIndex,
          willChange: 'transform'
        }}
      >
        {children}
      </section>
    </div>
  );
}

// Hook to create cascade reveal animations based on scroll
function useCascadeReveal(index: number, total: number) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth animations starting at 15%, each element takes 8% to fully reveal, with 2% gap between
  const startOffset = 0.15 + (index * 0.1);  // 15%, 25%, 35%
  const endOffset = startOffset + 0.08;       // +8% for smooth animation

  const opacity = useTransform(scrollYProgress, [startOffset, endOffset], [0, 1]);
  const y = useTransform(scrollYProgress, [startOffset, endOffset], [50, 0]);

  return { ref, opacity, y };
}

// Observer section content with cascade animation
function ObserverContent({ observer }: { observer: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Faster animations on mobile
  const timing = isMobile
    ? { el1: [0.1, 0.2], el2: [0.15, 0.25], el3: [0.2, 0.3] }
    : { el1: [0.15, 0.28], el2: [0.25, 0.38], el3: [0.35, 0.48] };

  const opacity1 = useTransform(scrollYProgress, timing.el1, [0, 1]);
  const y1 = useTransform(scrollYProgress, timing.el1, [isMobile ? 30 : 50, 0]);

  const opacity2 = useTransform(scrollYProgress, timing.el2, [0, 1]);
  const y2 = useTransform(scrollYProgress, timing.el2, [isMobile ? 30 : 50, 0]);

  const opacity3 = useTransform(scrollYProgress, timing.el3, [0, 1]);
  const y3 = useTransform(scrollYProgress, timing.el3, [isMobile ? 30 : 50, 0]);

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-40 md:flex md:items-center md:min-h-screen">
      <div className="w-full">
        <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-start">
          <motion.div style={{ opacity: opacity1, y: y1 }} className="md:col-span-5">
            <div className="text-accent mb-4"><IconObserver /></div>
            <p className="text-xs tracking-widest uppercase text-accent mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>01</p>
            <h2 className="text-3xl md:text-5xl font-normal leading-[1.1] md:leading-[1.06] mb-4 md:mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
              {observer?.titre || "Observer"}
            </h2>
            <p className="text-sm text-muted-foreground mb-2 font-medium">
              {observer?.sousTitre || "Visite & diagnostic"}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              {observer?.paragraphe1 || "Chaque jardin commence par une rencontre. J'observe le lieu tel qu'il est : sa topographie, la nature de son sol, son exposition, ses vues, ses contraintes et ses richesses parfois discrètes. J'écoute également les habitants, leurs usages, leurs envies et leur manière d'habiter le paysage."}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {observer?.paragraphe2 || "Avant toute intervention, il s'agit de comprendre. Un jardin existe souvent déjà en puissance."}
            </p>
          </motion.div>
          <motion.div style={{ opacity: opacity2, y: y2 }} className="md:col-span-7">
            <div className="aspect-[4/3] overflow-hidden bg-muted mb-6 border-t-[3px] border-accent/60">
              <img
                src="https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=900&h=675&fit=crop&auto=format"
                alt="Observation et diagnostic du sol"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        <motion.div style={{ opacity: opacity3, y: y3 }} className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {(observer ? [
            { verb: observer.action1Titre, desc: observer.action1Description },
            { verb: observer.action2Titre, desc: observer.action2Description },
            { verb: observer.action3Titre, desc: observer.action3Description },
          ] : [
            { verb: "Arpenter", desc: "Mesurer, topographier, analyser" },
            { verb: "Débusquer", desc: "Relever les plantes bio-indicatrices" },
            { verb: "S'imprégner", desc: "Laisser infuser pour faire éclore le concept" },
          ]).map((s) => (
            <div
              key={s.verb}
              className="bg-card p-6 md:p-8 border-t-[3px] border-accent/60"
            >
              <div className="text-xl md:text-2xl font-normal mb-2 md:mb-3 text-accent" style={{ fontFamily: "'Fraunces', serif" }}>{s.verb}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Dessiner section content with cascade animation
function DessinerContent({ dessiner }: { dessiner: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const timing = isMobile
    ? { el1: [0.1, 0.2], el2: [0.15, 0.25] }
    : { el1: [0.15, 0.28], el2: [0.25, 0.38] };

  const opacity1 = useTransform(scrollYProgress, timing.el1, [0, 1]);
  const y1 = useTransform(scrollYProgress, timing.el1, [isMobile ? 30 : 50, 0]);

  const opacity2 = useTransform(scrollYProgress, timing.el2, [0, 1]);
  const y2 = useTransform(scrollYProgress, timing.el2, [isMobile ? 30 : 50, 0]);

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-40 md:flex md:items-center md:min-h-screen">
      <div className="w-full">
        <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-start">
          <motion.div style={{ opacity: opacity1, y: y1 }} className="md:col-span-7 order-2 md:order-1">
            <div className="aspect-[4/3] overflow-hidden bg-muted mb-4 md:mb-6 border-t-[3px] border-accent/60">
              <img
                src="https://images.unsplash.com/photo-1532211387405-12202cb81d7b?w=900&h=675&fit=crop&auto=format"
                alt="Conception et esquisses de jardin"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-background border-l-[3px] border-accent/60 p-4 md:p-5 pl-5 md:pl-6">
              <p className="text-sm md:text-base italic text-accent leading-relaxed" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
                {dessiner?.citation || '"À l\'origine, dessin et dessein sont le même mot. Le trait visible naît d\'une intention invisible."'}
              </p>
            </div>
          </motion.div>
          <motion.div style={{ opacity: opacity2, y: y2 }} className="md:col-span-5 order-1 md:order-2">
            <div className="text-accent mb-4"><IconDessiner /></div>
            <p className="text-xs tracking-widest uppercase text-accent mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>02</p>
            <h2 className="text-3xl md:text-5xl font-normal leading-[1.1] md:leading-[1.06] mb-4 md:mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
              {dessiner?.titre || "Dessiner"}
            </h2>
            <p className="text-sm text-muted-foreground mb-2 font-medium">
              {dessiner?.sousTitre || "Conception du jardin"}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8">
              {dessiner?.paragraphe || "Vient ensuite le temps du dessin. Croquis, esquisses, recherches et rêveries permettent de faire émerger une vision. Le projet prend forme progressivement, guidé par l'esprit du lieu autant que par les aspirations de ses habitants."}
            </p>
            <div className="space-y-4">
              {(dessiner ? [
                { titre: dessiner.aspect1Titre, detail: dessiner.aspect1Detail },
                { titre: dessiner.aspect2Titre, detail: dessiner.aspect2Detail },
                { titre: dessiner.aspect3Titre, detail: dessiner.aspect3Detail },
                { titre: dessiner.aspect4Titre, detail: dessiner.aspect4Detail },
              ] : [
                { titre: "Esthétique", detail: "Carnet d'influence, esquisses, dessins d'élévation, illustrations d'ambiance" },
                { titre: "Écologique", detail: "Palette végétale élégante, robuste, adaptée et locale, établie avec mes partenaires pépiniéristes" },
                { titre: "Technique", detail: "Plan d'implantation, de réseau, de structure" },
                { titre: "Économique", detail: "Chiffrage des postes, sélection des fournisseurs, calendrier prévisionnel" },
              ]).map((d) => (
                <div key={d.titre} className="flex gap-4 text-sm">
                  <span className="w-24 flex-shrink-0 text-accent font-medium">{d.titre}</span>
                  <span className="text-muted-foreground leading-relaxed">{d.detail}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Realiser section content with cascade animation
function RealiserContent({ realiser }: { realiser: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const timing = isMobile
    ? { el1: [0.1, 0.2], el2: [0.15, 0.25], el3: [0.2, 0.3] }
    : { el1: [0.15, 0.28], el2: [0.25, 0.38], el3: [0.35, 0.48] };

  const opacity1 = useTransform(scrollYProgress, timing.el1, [0, 1]);
  const y1 = useTransform(scrollYProgress, timing.el1, [isMobile ? 30 : 50, 0]);

  const opacity2 = useTransform(scrollYProgress, timing.el2, [0, 1]);
  const y2 = useTransform(scrollYProgress, timing.el2, [isMobile ? 30 : 50, 0]);

  const opacity3 = useTransform(scrollYProgress, timing.el3, [0, 1]);
  const y3 = useTransform(scrollYProgress, timing.el3, [isMobile ? 30 : 50, 0]);

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-40 md:flex md:items-center md:min-h-screen">
      <div className="w-full">
        <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-start">
          <motion.div style={{ opacity: opacity1, y: y1 }} className="md:col-span-5">
            <div className="text-accent mb-4"><IconRealiser /></div>
            <p className="text-xs tracking-widest uppercase text-accent mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>03</p>
            <h2 className="text-3xl md:text-5xl font-normal leading-[1.1] md:leading-[1.06] mb-4 md:mb-6" style={{ fontFamily: "'Fraunces', serif" }}>{realiser?.titre || 'Réaliser'}</h2>
            <p className="text-sm text-muted-foreground mb-2 font-medium">{realiser?.sousTitre || 'Aménagement & plantation'}</p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-5">
              {realiser?.paragraphe1 || 'Comme un peintre prépare sa toile, le jardin nécessite des fondations solides. Le terrain est préparé, modelé si nécessaire, les réseaux mis en place et les différents aménagements réalisés pour accueillir durablement les plantations.'}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-5">
              {realiser?.paragraphe2 || 'C\'est le moment où le jardin entre en terre. Les végétaux sont implantés avec soin, en tenant compte de leur développement futur, des équilibres écologiques et des relations qu\'ils tisseront entre eux au fil des saisons.'}
            </p>
            <p className="text-sm md:text-base italic text-accent" style={{ fontFamily: "'Fraunces', serif" }}>
              {realiser?.citation || 'Le jardin naît, mais il n\'est pas encore achevé.'}
            </p>
          </motion.div>
          <motion.div style={{ opacity: opacity2, y: y2 }} className="md:col-span-7">
            <div className="aspect-[16/10] overflow-hidden bg-muted border-t-[3px] border-accent/60">
              <img
                src="https://images.unsplash.com/photo-1492496913980-501348b61469?w=900&h=562&fit=crop&auto=format"
                alt="Plantation en cours — mise en terre des végétaux"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
        <motion.div style={{ opacity: opacity3, y: y3 }} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-8 md:mt-12">
          {[
            { n: realiser?.action1Titre || "Préparer", t: realiser?.action1Description || "Ouvrir, nettoyer, organiser et enrichir" },
            { n: realiser?.action2Titre || "Acheminer", t: realiser?.action2Description || "Arbres, vivaces, bulbes, matériaux, décor" },
            { n: realiser?.action3Titre || "Implanter", t: realiser?.action3Description || "Avec joie et maestria" },
          ].map((s) => (
            <div
              key={s.n}
              className="bg-card p-4 md:p-4 border-t-[3px] border-accent/60"
            >
              <div className="text-base md:text-base font-normal mb-1 text-accent" style={{ fontFamily: "'Fraunces', serif" }}>{s.n}</div>
              <div className="text-xs md:text-xs text-muted-foreground">{s.t}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Accompagner section content with cascade animation
function AccompagnerContent({ accompagner }: { accompagner: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const timing = isMobile
    ? { el1: [0.1, 0.2], el2: [0.15, 0.25] }
    : { el1: [0.15, 0.28], el2: [0.25, 0.38] };

  const opacity1 = useTransform(scrollYProgress, timing.el1, [0, 1]);
  const y1 = useTransform(scrollYProgress, timing.el1, [isMobile ? 30 : 50, 0]);

  const opacity2 = useTransform(scrollYProgress, timing.el2, [0, 1]);
  const y2 = useTransform(scrollYProgress, timing.el2, [isMobile ? 30 : 50, 0]);

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-40 md:flex md:items-center md:min-h-screen">
      <div className="w-full">
        <motion.div style={{ opacity: opacity1, y: y1 }} className="grid md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-16">
          <div className="md:col-span-5">
            <div className="text-accent mb-4"><IconAccompagner /></div>
            <p className="text-xs tracking-widest uppercase text-accent mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>04</p>
            <h2 className="text-3xl md:text-5xl font-normal leading-[1.1] md:leading-[1.06] mb-4 md:mb-6" style={{ fontFamily: "'Fraunces', serif" }}>{accompagner?.titre || 'Accompagner'}</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6">
              {accompagner?.paragraphe1 || 'Un jardin est un organisme vivant en constante évolution, il nous faut le laisser s\'épanouir et l\'aider à s\'installer. Je propose un suivi attentif afin d\'observer son développement, d\'ajuster certaines plantations et de transmettre les gestes qui permettent de gagner en autonomie.'}
            </p>
            <p className="text-sm text-foreground">
              {accompagner?.paragraphe2 || 'Voici mes quatre offres d\'entretien — à choisir selon votre rythme et votre envie de vous impliquer dans la vie du jardin.'}
            </p>
          </div>
        </motion.div>
        <motion.div style={{ opacity: opacity2, y: y2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { titre: accompagner?.offre1Titre || 'Saison', rythme: accompagner?.offre1Rythme || '2 visites / an', desc: accompagner?.offre1Description || 'Les moments essentiels. On observe les moments clés du jardin au fil de l\'année.' },
            { titre: accompagner?.offre2Titre || 'Cycle', rythme: accompagner?.offre2Rythme || '4 visites / an', desc: accompagner?.offre2Description || 'Le rythme complet du jardin. Observer, ajuster, tailler, enrichir, conseiller. Le client participe s\'il le souhaite.' },
            { titre: accompagner?.offre3Titre || 'Présence', rythme: accompagner?.offre3Rythme || '6 à 8 visites / an', desc: accompagner?.offre3Description || 'Un accompagnement attentif tout au long de l\'année : suivi des plantations, interventions ciblées, recommandations saisonnières, ajustements et conseils à distance.' },
            { titre: accompagner?.offre4Titre || 'Cocréation', rythme: accompagner?.offre4Rythme || '½ journée ou journée', desc: accompagner?.offre4Description || 'Le jardin devient une œuvre commune. Je vous transmets le jardin et vous donne des outils : comprendre son sol, composer un massif naturaliste, reconnaître les végétaux, tailler sans crainte.' },
          ].map((a, i) => (
            <div
              key={a.titre}
              className="bg-background p-5 md:p-7 flex flex-col border-t-[3px] border-accent/60"
            >
              <span className="text-xs text-muted-foreground mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>0{i + 1}</span>
              <h3 className="text-2xl font-normal mb-1" style={{ fontFamily: "'Fraunces', serif" }}>{a.titre}</h3>
              <p className="text-xs text-accent font-medium mb-4">{a.rythme}</p>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{a.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Citation section with scroll-blocking effect
function CitationSection({ citation }: { citation: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="relative border-t border-b border-border">
      {/* Spacer to create scroll space - reduced on mobile */}
      <div className="h-[250vh] md:h-[400vh]">
        {/* Background layer - sticky and fills only the visible section */}
        <div className="sticky top-0 h-screen w-full z-0">
          <img
            src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&h=1080&fit=crop&auto=format"
            alt="Jardin paysager naturel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-card/90" />
        </div>

        {/* Sticky content container */}
        <div className="sticky top-0 h-screen flex items-center z-10 -mt-[100vh]">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-left">
            <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.3] md:leading-[1.2] text-accent italic" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
              <WordReveal
                text={citation?.texte || '"..."'}
                scrollYProgress={scrollYProgress}
              />
            </div>
            {citation?.sousTexte && (
              <p className="mt-4 md:mt-6 text-sm md:text-base lg:text-lg text-muted-foreground italic" style={{ fontFamily: "'Fraunces', serif" }}>
                {citation.sousTexte}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const IconObserver = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 22 C10 12, 34 12, 40 22 C34 32, 10 32, 4 22 Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M22 16 C26 19, 26 25, 22 28 C18 25, 18 19, 22 16 Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    <line x1="22" y1="16" x2="22" y2="28" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 1.5"/>
    <line x1="22" y1="6" x2="22" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <line x1="10" y1="9" x2="12.5" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <line x1="34" y1="9" x2="31.5" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const IconDessiner = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 8 L36 14 L18 36 L12 38 L14 32 Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
    <line x1="27" y1="11" x2="14" y2="32" stroke="currentColor" strokeWidth="0.8"/>
    <path d="M8 14 C8 14, 14 10, 16 16 C12 18, 8 14, 8 14 Z" stroke="currentColor" strokeWidth="1" fill="none"/>
    <line x1="8" y1="14" x2="16" y2="16" stroke="currentColor" strokeWidth="0.7" strokeDasharray="1 1.5"/>
    <path d="M12 38 Q20 42 28 38" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="2 2"/>
  </svg>
);

const IconRealiser = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 34 Q22 30 38 34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M10 38 Q22 35 34 38" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
    <line x1="22" y1="34" x2="22" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M22 26 C22 26, 12 22, 14 16 C18 18, 22 26, 22 26 Z" stroke="currentColor" strokeWidth="1.1" fill="none"/>
    <path d="M22 20 C22 20, 32 16, 30 10 C26 12, 22 20, 22 20 Z" stroke="currentColor" strokeWidth="1.1" fill="none"/>
    <path d="M22 16 C20 12, 24 8, 22 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="22" cy="6" r="2" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

const IconAccompagner = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="28" r="3" stroke="currentColor" strokeWidth="1" fill="none"/>
    <path d="M13 32 Q22 16 31 32" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 1.5"/>
    <path d="M8 36 Q22 8 36 36" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 1.5" opacity="0.6"/>
    <path d="M22 25 C18 21, 14 22, 12 18" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M22 21 C26 17, 30 18, 32 14" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <line x1="8" y1="38" x2="36" y2="38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="12" y1="40" x2="32" y2="40" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-border transition-colors duration-200 ${open ? "bg-background" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-6 py-6 text-left group"
      >
        <span
          className="text-[10px] text-muted-foreground/50 shrink-0 mt-1.5 w-5"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`flex-1 text-lg font-normal leading-snug transition-colors duration-200 ${open ? "text-accent" : "group-hover:text-accent"}`}
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {q}
        </span>
        <div className={`shrink-0 mt-1 w-5 h-5 border border-border flex items-center justify-center transition-all duration-300 ${open ? "border-accent bg-accent" : "group-hover:border-accent"}`}>
          <ChevronDown
            size={12}
            className={`transition-all duration-300 ${open ? "rotate-180 text-white" : "text-muted-foreground"}`}
          />
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "400px" : "0px" }}
      >
        <div className="pl-11 pb-7 pr-4">
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-l-[2px] border-accent/30 pl-4">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

function HeroVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <iframe
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          scale: "1.5",
          width: "100vw",
          height: "56.25vw", // 16:9 aspect ratio
          minHeight: "100vh",
          minWidth: "177.77vh" // 16:9 aspect ratio
        }}
        src="https://www.youtube.com/embed/r_epbFJ231Y?autoplay=1&mute=1&loop=1&playlist=r_epbFJ231Y&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1"
        title="Background video"
        frameBorder="0"
        allow="autoplay; encrypted-media"
      />
    </div>
  );
}

export default function Home() {
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null);
  const { data: homepage, loading, error } = useHomepage();
  const { data: citation } = useCitation();
  const { data: observer } = useDemarcheObserver();
  const { data: dessiner } = useDemarcheDessiner();
  const { data: realiser } = useDemarcheRealiser();
  const { data: accompagner } = useDemarcheAccompagner();
  const { data: portrait } = usePortrait();
  const { data: faqs } = useFaqs();
  const { data: portfolio } = usePortfolios();

  return (
    <>
      <ProjetModal projet={selectedProjet} onClose={() => setSelectedProjet(null)} />

      {/* HERO — full screen video */}
      <section className="relative h-screen min-h-[700px] flex items-end overflow-hidden bg-[#1a1f16]">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full max-w-6xl mx-auto px-6 md:px-12 pb-20 md:pb-24"
        >
          <div className="grid md:grid-cols-12 items-end gap-10 md:gap-8">
            <div className="md:col-span-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xs tracking-widest uppercase text-white/50 mb-6 md:mb-5"
              >
                {loading ? "Chargement..." : homepage?.heroSurtitre || "Jardinier · Designer — Lyon & Rhône-Alpes Auvergne"}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] text-white mb-6 md:mb-8"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {loading ? (
                  "Chargement..."
                ) : homepage?.heroTitre ? (
                  <>
                    {homepage.heroTitre.split(" ").slice(0, 2).join(" ")}
                    <br />
                    {homepage.heroTitre.split(" ").slice(2, 5).join(" ")}
                    <br />
                    <em>{homepage.heroTitre.split(" ").slice(5).join(" ")}</em>
                  </>
                ) : (
                  <>
                    Des jardins
                    <br />
                    comme des
                    <br />
                    <em>tableaux vivants.</em>
                  </>
                )}
              </motion.h1>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="md:col-span-4 md:pb-2"
            >
              <img
                src={logoBlancSrc}
                alt="Atelier DESNOYERS"
                className="w-20 md:w-56 mb-5 md:mb-8"
              />
              <p className="text-sm md:text-base text-white/70 leading-relaxed mb-8 md:mb-10">
                {loading ? "Chargement..." : homepage?.heroDescription || "Je conçois des jardins naturalistes et les accompagne dans le temps. Entre conception et soin, créer des lieux vivants, sensibles et durables."}
              </p>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-primary text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
                >
                  {homepage?.heroCtaPrincipal || "Projet de jardin"} <ArrowUpRight size={12} />
                </a>
                <a
                  href="#observer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/30 text-white text-xs tracking-widest uppercase hover:border-white/70 transition-colors"
                >
                  {homepage?.heroCtaSecondaire || "La démarche"}
                </a>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40"
          >
            <span className="text-[10px] tracking-widest uppercase">Défiler</span>
            <div className="w-px h-8 bg-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* PORTFOLIO */}
      <section className="border-t border-border overflow-hidden py-20 md:py-32">
        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12 md:mb-16"
          >
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Réalisations</p>
              <h2
                className="text-3xl md:text-4xl font-normal"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Portfolio de mes jardins
              </h2>
            </div>
            <a
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 text-sm text-accent hover:opacity-70 transition-opacity"
            >
              Votre projet <ArrowUpRight size={14} />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {portfolio && portfolio.slice(0, 6).map((p, index) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedProjet(p)}
                className="group flex flex-col text-left"
              >
                <div className="relative aspect-square overflow-hidden bg-muted border-t-[2px] border-accent/60">
                  <img
                    src={p.imagePrincipale}
                    alt={p.titre}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-500" />
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white flex items-center justify-center">
                      <ArrowUpRight size={14} className="text-primary" />
                    </div>
                  </div>
                </div>
                <div className="pt-3 pb-1 flex items-start justify-between gap-2">
                  <div>
                    <p
                      className="text-base font-normal leading-snug text-foreground group-hover:text-accent transition-colors"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {p.titre}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.lieu}</p>
                  </div>
                  <span
                    className="text-[10px] text-muted-foreground uppercase tracking-widest shrink-0 mt-1"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {p.annee}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CITATION */}
      <CitationSection citation={citation} />

      {/* OBSERVER */}
      <StackingSection id="observer" className="bg-background" zIndex={10}>
        <ObserverContent observer={observer} />
      </StackingSection>

      {/* DESSINER */}
      <StackingSection id="dessiner" className="border-t border-border bg-card" zIndex={20}>
        <DessinerContent dessiner={dessiner} />
      </StackingSection>

      {/* RÉALISER */}
      <StackingSection id="realiser" className="bg-background" zIndex={30}>
        <RealiserContent realiser={realiser} />
      </StackingSection>

      {/* ACCOMPAGNER */}
      <StackingSection id="accompagner" className="border-t border-border bg-card" zIndex={40} isLast={true}>
        <AccompagnerContent accompagner={accompagner} />
      </StackingSection>

      {/* PORTRAIT */}
      <section id="portrait" className="relative z-50 bg-background py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-4"
          >
            <div className="aspect-[2/3] overflow-hidden bg-muted border-t-[3px] border-accent/60">
              <img
                src="https://images.unsplash.com/photo-1680176104120-9dba9c415e89?w=600&h=900&fit=crop&auto=format"
                alt="Portrait — Atelier DESNOYERS dans son jardin"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-8 flex flex-col justify-center"
          >
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">{portrait?.surtitre || 'Portrait'}</p>
            <h2 className="text-3xl md:text-4xl font-normal leading-[1.1] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
              {portrait?.titreLigne1 || 'Le regard du designer'}
              <br />
              {portrait?.titreLigne2 || 'et les gestes du jardinier.'}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
              {portrait?.paragraphe1 || 'J\'ai commencé à prendre soin des jardins et à en dessiner à partir de 2016. Peintre et graphiste de formation, diplômé de l\'École Émile Cohl, j\'ai peu à peu ressenti le besoin de quitter les écrans et l\'atelier pour me tourner vers le vivant. J\'ai alors entrepris d\'apprendre à le nommer, à le comprendre et à cultiver cet artisanat patient qu\'est l\'art du jardin.'}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
              {portrait?.paragraphe2 || 'De la botanique à la faune — auxiliaires comme parasites — en passant par l\'étude des sols et des différents biotopes, j\'ai appris à observer, reconnaître et déchiffrer ce que le terrain avait à raconter. Au fil des saisons, cette attention portée au détail a nourri mon regard autant que mon émerveillement.'}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {portrait?.paragraphe3 || 'Chaque jardin possède son caractère, son rythme et ses promesses. Si vous souhaitez les révéler, je serai heureux de cheminer à vos côtés pour imaginer ensemble un lieu qui vous ressemble.'}
            </p>
          </motion.div>
        </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="relative z-50 border-t border-border bg-background py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12 md:mb-16"
          >
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Journal</p>
              <h2
                className="text-3xl md:text-4xl font-normal"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Notes & réflexions
              </h2>
            </div>
            <Link
              to={`/journal/${articles[0].slug}`}
              className="hidden md:inline-flex items-center gap-2 text-sm text-accent hover:opacity-70 transition-opacity"
            >
              Tous les articles <ArrowUpRight size={14} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/journal/${article.slug}`}
                  className="group flex flex-col"
                >
                {/* Image */}
                <div className="relative overflow-hidden border-t-[2px] border-accent/60 mb-4" style={{ aspectRatio: "3/2" }}>
                  <img
                    src={article.image}
                    alt={article.titre}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-all duration-500" />
                  {i === 0 && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-accent text-accent-foreground text-[9px] tracking-widest uppercase"
                      style={{ fontFamily: "'DM Mono', monospace" }}>
                      Récent
                    </div>
                  )}
                </div>

                {/* Méta */}
                <p
                  className="text-[10px] tracking-widest uppercase text-accent mb-2"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {article.categorie} · {new Date(article.date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </p>

                {/* Titre */}
                <h3
                  className="text-xl font-normal leading-snug mb-3 group-hover:text-accent transition-colors"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {article.titre}
                </h3>

                {/* Extrait */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {article.extrait}
                </p>

                {/* Lire */}
                <div className="mt-4 flex items-center gap-1.5 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Lire l'article <ArrowUpRight size={11} />
                </div>
              </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="relative z-50 border-t border-border bg-background py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
          >
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                Avis clients
              </p>
              <h2 className="text-3xl md:text-4xl font-normal" style={{ fontFamily: "'Fraunces', serif" }}>
                Ce qu'ils en disent.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#3a5c32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">5,0 · Google Business</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                nom: "Sophie M.",
                lieu: "Lyon 6e",
                date: "Mars 2024",
                note: 5,
                avis: "Antoine a transformé notre cour intérieure en un espace que nous n'osions même pas imaginer. Son écoute, sa précision et son sens du végétal sont remarquables. Chaque plante est à sa place — et cela se sent.",
              },
              {
                nom: "Thomas & Claire R.",
                lieu: "Annecy",
                date: "Juillet 2024",
                note: 5,
                avis: "Un vrai jardinier-designer, rare combinaison. Il a su comprendre notre terrain en une seule visite et proposer quelque chose qui lui ressemble vraiment. Le résultat est d'une beauté sobre et durable.",
              },
              {
                nom: "Isabelle L.",
                lieu: "Grenoble",
                date: "Octobre 2023",
                note: 5,
                avis: "Très professionnel, à l'écoute et créatif. La palette végétale qu'il a choisie pour notre massif est parfaitement adaptée — les plantes poussent sans effort et le jardin change joliment au fil des saisons.",
              },
            ].map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col gap-5 p-7 bg-card border-t-[2px] border-accent/60"
              >
                {/* Étoiles */}
                <div className="flex gap-0.5">
                  {[...Array(r.note)].map((_, s) => (
                    <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#3a5c32">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>

                {/* Texte */}
                <p
                  className="text-base leading-relaxed text-foreground italic flex-1"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 300 }}
                >
                  "{r.avis}"
                </p>

                {/* Auteur */}
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.nom}</p>
                    <p className="text-xs text-muted-foreground">{r.lieu}</p>
                  </div>
                  <span
                    className="text-[10px] text-muted-foreground"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {r.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Lien Google */}
          <div className="mt-10 text-center">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors"
            >
              Voir tous les avis sur Google <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative z-50 py-28 md:py-40" style={{ backgroundColor: "#b85c3a", color: "#faf6ee" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-5"
          >
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#faf6ee", opacity: 0.6 }}>Projet de jardin</p>
            <h2 className="text-4xl md:text-5xl font-normal leading-[1.05] mb-8" style={{ fontFamily: "'Fraunces', serif" }}>
              Prise de RDV
              <br />
              <em>& demande de devis</em>
            </h2>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "#faf6ee", opacity: 0.75 }}>
              L'Atelier DESNOYERS vous accompagne dans vos projets d'aménagement paysager —
              cour intérieure, toit-terrasse, jardin privé, parc.
            </p>
            <div className="mt-8 flex flex-col gap-2 text-sm" style={{ color: "#faf6ee", opacity: 0.65 }}>
              {["Basé à Lyon", "Interventions en Rhône-Alpes Auvergne", "Et partout ailleurs, sur demande"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#faf6ee" }} />
                  {t}
                </div>
              ))}
            </div>
            <p className="text-sm leading-relaxed mt-8 italic" style={{ fontFamily: "'Fraunces', serif", color: "#faf6ee", opacity: 0.35 }}>
              Chaque détail nous aide à mieux comprendre votre projet et à lui donner vie.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-7"
          >
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { id: "prenom", label: "Prénom", type: "text", placeholder: "Marie" },
                  { id: "nom", label: "Nom", type: "text", placeholder: "Martin" },
                ].map((f) => (
                  <div key={f.id} className="flex flex-col gap-1.5">
                    <label htmlFor={f.id} className="text-xs tracking-widest uppercase" style={{ color: "#faf6ee", opacity: 0.65 }}>{f.label}</label>
                    <input
                      id={f.id}
                      type={f.type}
                      placeholder={f.placeholder}
                      className="w-full bg-transparent py-2 text-sm focus:outline-none transition-colors placeholder:text-white/40"
                      style={{ borderBottom: "1px solid rgba(250,246,238,0.35)", color: "#faf6ee" }}
                    />
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="adresse" className="text-xs tracking-widest uppercase" style={{ color: "#faf6ee", opacity: 0.65 }}>Adresse</label>
                  <input
                    id="adresse"
                    type="text"
                    placeholder="12 rue des Acacias, Lyon"
                    className="w-full bg-transparent py-2 text-sm focus:outline-none placeholder:text-white/40"
                    style={{ borderBottom: "1px solid rgba(250,246,238,0.35)", color: "#faf6ee" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs tracking-widest uppercase" style={{ color: "#faf6ee", opacity: 0.65 }}>Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="marie@exemple.com"
                    className="w-full bg-transparent py-2 text-sm focus:outline-none placeholder:text-white/40"
                    style={{ borderBottom: "1px solid rgba(250,246,238,0.35)", color: "#faf6ee" }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="projet" className="text-xs tracking-widest uppercase" style={{ color: "#faf6ee", opacity: 0.65 }}>Parlez-nous de votre projet</label>
                <textarea
                  id="projet"
                  rows={6}
                  placeholder={"L'adresse du lieu, sa ville et sa surface approximative ;\nQuelques photos, et si possible un plan ou un croquis ;\nVos envies, vos besoins et l'ambiance que vous rêvez d'y créer ;\nLes particularités du site (ombre, vent, accès, arrosage…) ;\nUne idée de votre budget et du calendrier souhaité."}
                  className="w-full bg-transparent py-2 text-sm focus:outline-none resize-none placeholder:text-white/40"
                  style={{ borderBottom: "1px solid rgba(250,246,238,0.35)", color: "#faf6ee" }}
                />
              </div>
              <button
                type="submit"
                className="mt-2 self-start px-6 py-3 text-xs tracking-widest uppercase hover:opacity-70 transition-opacity flex items-center gap-2"
                style={{ backgroundColor: "#faf6ee", color: "#1e2319" }}
              >
                Envoyer ma demande <ArrowUpRight size={12} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-50 border-t border-border bg-card py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">

            {/* Accordéon à gauche */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="md:col-span-8 border-t border-border order-2 md:order-1"
            >
              {faqs && faqs.map((item, i) => (
                <FaqItem key={item.id} q={item.question} a={item.reponse} index={i} />
              ))}
            </motion.div>

            {/* Titre fixe à droite */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="md:col-span-4 order-1 md:order-2"
            >
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                Questions fréquentes
              </p>
              <h2 className="text-4xl md:text-5xl font-normal leading-[1.06] mb-6"
                style={{ fontFamily: "'Fraunces', serif" }}>
                Ce qu'on
                <br />
                me demande
                <br />
                <em>souvent.</em>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Des réponses honnêtes à des questions que je reçois régulièrement — parfois avec un peu d'humour, toujours avec sincérité.
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-accent hover:opacity-70 transition-opacity"
              >
                Poser une question <ArrowUpRight size={11} />
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="relative z-50 border-t border-border bg-background py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs tracking-widest uppercase text-muted-foreground">Le jardin en images</p>
            <a
              href="https://www.instagram.com/antoine.desnoyers/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
            >
              @antoine.desnoyers <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-[5px]">
            {[
              { src: "https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=400&h=400&fit=crop&auto=format", alt: "Vivaces naturalistes" },
              { src: "https://images.unsplash.com/photo-1594886551831-610f739902e9?w=400&h=400&fit=crop&auto=format", alt: "Massif fleuri" },
              { src: "https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=400&h=400&fit=crop&auto=format", alt: "Plantation" },
              { src: "https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=400&h=400&fit=crop&auto=format", alt: "Jardin de vivaces" },
              { src: "https://images.unsplash.com/photo-1764070140879-1120c0a9e9eb?w=400&h=400&fit=crop&auto=format", alt: "Jardin automnal" },
              { src: "https://images.unsplash.com/photo-1680176104120-9dba9c415e89?w=400&h=400&fit=crop&auto=format", alt: "Prairie fleurie" },
            ].map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden bg-muted group cursor-pointer border-t-[3px] border-accent/60">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
