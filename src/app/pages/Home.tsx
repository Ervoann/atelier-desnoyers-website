import { ArrowUpRight, ChevronDown } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { accompagnements } from "@/app/data";
import { supabase } from "@/lib/supabase";
import type { Article } from "@/app/types/article";
import ProjetModal from "@/app/components/ProjetModal";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoBlancSrc from "@/imports/ATELIER-DESNOYERS-BLANC-1.png";
import { AnimatedArrowUpRight, type ArrowUpRightIconHandle } from "@/app/components/AnimatedArrowUpRight";
import { SplitTextReveal } from "@/app/components/SplitTextReveal";
import { useHomepage, useCitation, useDemarcheObserver, useDemarcheDessiner, useDemarcheRealiser, useDemarcheAccompagner, usePortrait, useFaqs, usePortfolios, useJardinImages, useTemoignages } from "@/app/hooks/useSupabaseData";
import type { PortfolioData } from "@/app/hooks/useSupabaseData";

type Projet = PortfolioData;

// Citation word reveal component with blur effect
function CitationWordReveal({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <div>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0.3, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            delay: index * 0.08, // 80ms entre chaque mot
            ease: "easeOut"
          }}
          style={{
            display: "inline-block",
            marginRight: "0.35em"
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// Section component for Observer, Dessiner, Realiser, Accompagner with Daylight-style scroll animations
function StackingSection({ children, id, className, zIndex }: { children: React.ReactNode; id: string; className?: string; zIndex: number }) {
  return (
    <section
      id={id}
      className={`min-h-screen py-16 md:py-24 ${className}`}
      style={{ zIndex }}
    >
      {children}
    </section>
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

// Observer section content with Daylight-style asymmetric layout
function ObserverContent({ observer }: { observer: any }) {
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the image container itself for smooth parallax
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax effect for image - stronger movement like Daylight
  const imageY = useTransform(imageScrollProgress, [0, 1], ["-20%", "20%"]);

  // Decorative element movement - moves in opposite direction for depth
  const overlayY = useTransform(imageScrollProgress, [0, 1], ["10%", "-10%"]);
  const overlayOpacity = useTransform(imageScrollProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div className="w-full">
      {/* Layout: Contenu gauche 70% | Image droite 30% */}
      <div className="flex flex-col lg:flex-row items-stretch min-h-screen">

        {/* Left Column - Title + Text + Action Cards */}
        <div className="flex-1 flex flex-col justify-between px-8 md:px-16 lg:pl-24 lg:pr-12 py-16 md:py-40 gap-8">

          {/* Title + Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-accent mb-6"><IconObserver /></div>
              <p className="text-xs tracking-widest uppercase text-accent mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
                LA DÉMARCHE — 01
              </p>
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] mb-8" style={{ fontFamily: "'Fraunces', serif" }}>
              <SplitTextReveal text={observer?.titre || "Observer"} delay={0.1} />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-accent mb-6 font-medium"
            >
              {observer?.sousTitre || "Visite & diagnostic"}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 max-w-lg"
            >
              {observer?.paragraphe1 || "Chaque jardin commence par une rencontre. J'observe le lieu tel qu'il est : sa topographie, la nature de son sol, son exposition, ses vues, ses contraintes et ses richesses parfois discrètes. J'écoute également les habitants, leurs usages, leurs envies et leur manière d'habiter le paysage."}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg"
            >
              {observer?.paragraphe2 || "Avant toute intervention, il s'agit de comprendre. Un jardin existe souvent déjà en puissance."}
            </motion.p>
          </div>

          {/* Action cards in 3 columns grid - desktop only with cascade animation */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {(observer ? [
              { verb: observer.action1Titre, desc: observer.action1Description },
              { verb: observer.action2Titre, desc: observer.action2Description },
              { verb: observer.action3Titre, desc: observer.action3Description },
            ] : [
              { verb: "Arpenter", desc: "Mesurer, topographier, analyser" },
              { verb: "Débusquer", desc: "Relever les plantes bio-indicatrices" },
              { verb: "S'imprégner", desc: "Laisser infuser pour faire éclore le concept" },
            ]).map((s, i) => (
              <motion.div
                key={s.verb}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.8 + (i * 0.15) }}
                className="bg-card p-6 border-t-[4px] border-accent"
              >
                <div className="text-xs text-accent/60 mb-3 font-medium tracking-wider" style={{ fontFamily: "'DM Mono', monospace" }}>0{i + 1}</div>
                <h3 className="text-xl font-normal text-foreground mb-4" style={{ fontFamily: "'Fraunces', serif" }}>{s.verb}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column - Image 30% */}
        <div className="lg:w-[30%] flex-shrink-0 self-stretch">
          <div ref={imageContainerRef} className="w-full h-full min-h-[500px] overflow-hidden bg-muted border-t-[3px] border-accent/60 relative">
            <motion.img
              style={{ y: imageY }}
              src={observer?.imageUrl || "https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=900&h=1200&fit=crop&auto=format"}
              alt="Observation et diagnostic du sol"
              className="w-full h-full object-cover scale-125"
            />
            {/* Decorative overlay element that moves with scroll */}
            <motion.div
              style={{ y: overlayY, opacity: overlayOpacity }}
              className="absolute bottom-12 left-8 right-8 pointer-events-none hidden lg:block"
            >
              <p
                className="text-6xl font-normal text-white/20"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                01
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action cards for mobile - below with cascade */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 px-8 md:px-16 pb-16">
        {(observer ? [
          { verb: observer.action1Titre, desc: observer.action1Description },
          { verb: observer.action2Titre, desc: observer.action2Description },
          { verb: observer.action3Titre, desc: observer.action3Description },
        ] : [
          { verb: "Arpenter", desc: "Mesurer, topographier, analyser" },
          { verb: "Débusquer", desc: "Relever les plantes bio-indicatrices" },
          { verb: "S'imprégner", desc: "Laisser infuser pour faire éclore le concept" },
        ]).map((s, i) => (
          <motion.div
            key={s.verb}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="bg-card p-6 md:p-8 border-t-[3px] border-accent/60"
          >
            <div className="text-xl md:text-2xl font-normal mb-2 md:mb-3 text-accent" style={{ fontFamily: "'Fraunces', serif" }}>{s.verb}</div>
            <div className="text-sm text-muted-foreground leading-relaxed">{s.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Dessiner section content with Daylight-style layout (image left, content right)
function DessinerContent({ dessiner }: { dessiner: any }) {
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the image container itself for smooth parallax
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax effect for image - stronger movement like Daylight
  const imageY = useTransform(imageScrollProgress, [0, 1], ["-20%", "20%"]);

  // Decorative element movement - moves in opposite direction for depth
  const overlayY = useTransform(imageScrollProgress, [0, 1], ["10%", "-10%"]);
  const overlayOpacity = useTransform(imageScrollProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div className="w-full">
      {/* Layout: Image gauche 30% | Contenu droite 70% */}
      <div className="flex flex-col lg:flex-row items-stretch min-h-screen">

        {/* Left Column - Image 30% (no padding) */}
        <div className="lg:w-[30%] flex-shrink-0 self-stretch order-2 lg:order-1">
          <div ref={imageContainerRef} className="w-full h-full min-h-[500px] overflow-hidden bg-muted border-t-[3px] border-accent/60 relative">
            <motion.img
              style={{ y: imageY }}
              src={dessiner?.imageUrl || "https://images.unsplash.com/photo-1532211387405-12202cb81d7b?w=900&h=1200&fit=crop&auto=format"}
              alt="Conception et esquisses de jardin"
              className="w-full h-full object-cover scale-125"
            />
            {/* Decorative overlay element that moves with scroll */}
            <motion.div
              style={{ y: overlayY, opacity: overlayOpacity }}
              className="absolute bottom-12 left-8 right-8 pointer-events-none hidden lg:block"
            >
              <p
                className="text-6xl font-normal text-white/20"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                02
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Title + Text + Aspects */}
        <div className="flex-1 flex flex-col justify-between px-8 md:px-16 lg:pl-12 lg:pr-24 py-16 md:py-40 gap-8 order-1 lg:order-2 overflow-hidden">

          {/* Title + Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-accent mb-6"><IconDessiner /></div>
              <p className="text-xs tracking-widest uppercase text-accent mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
                LA DÉMARCHE — 02
              </p>
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] mb-8" style={{ fontFamily: "'Fraunces', serif" }}>
              <SplitTextReveal text={dessiner?.titre || "Dessiner"} delay={0.1} />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-accent mb-6 font-medium"
            >
              {dessiner?.sousTitre || "Conception du jardin"}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg"
            >
              {dessiner?.paragraphe || "Vient ensuite le temps du dessin. Croquis, esquisses, recherches et rêveries permettent de faire émerger une vision. Le projet prend forme progressivement, guidé par l'esprit du lieu autant que par les aspirations de ses habitants."}
            </motion.p>
          </div>

          {/* Aspect cards in 2x2 grid - desktop only with cascade */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
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
            ]).map((d, i) => (
              <motion.div
                key={d.titre}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.6 + (i * 0.15) }}
                className="bg-background p-6 border-t-[4px] border-accent"
              >
                <div className="text-xs text-accent/60 mb-3 font-medium tracking-wider" style={{ fontFamily: "'DM Mono', monospace" }}>0{i + 1}</div>
                <h3 className="text-xl font-normal text-foreground mb-4" style={{ fontFamily: "'Fraunces', serif" }}>{d.titre}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Aspects for mobile - below with cascade */}
      <div className="lg:hidden flex flex-col gap-4 mt-8 px-8 md:px-16 pb-16">
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
        ]).map((d, i) => (
          <motion.div
            key={d.titre}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="bg-card p-5 border-t-[3px] border-accent/60"
          >
            <div className="text-base font-medium text-accent mb-2">{d.titre}</div>
            <div className="text-sm text-muted-foreground leading-relaxed">{d.detail}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Realiser section content with Daylight-style layout (content left, image right)
function RealiserContent({ realiser }: { realiser: any }) {
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the image container itself for smooth parallax
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax effect for image - stronger movement like Daylight
  const imageY = useTransform(imageScrollProgress, [0, 1], ["-20%", "20%"]);

  // Decorative element movement - moves in opposite direction for depth
  const overlayY = useTransform(imageScrollProgress, [0, 1], ["10%", "-10%"]);
  const overlayOpacity = useTransform(imageScrollProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div className="w-full">
      {/* Layout: Contenu gauche 70% | Image droite 30% */}
      <div className="flex flex-col lg:flex-row items-stretch min-h-screen">

        {/* Left Column - Title + Text + Action Cards */}
        <div className="flex-1 flex flex-col justify-between px-8 md:px-16 lg:pl-24 lg:pr-12 py-16 md:py-40 gap-8">

          {/* Title + Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-accent mb-6"><IconRealiser /></div>
              <p className="text-xs tracking-widest uppercase text-accent mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
                LA DÉMARCHE — 03
              </p>
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] mb-8" style={{ fontFamily: "'Fraunces', serif" }}>
              <SplitTextReveal text={realiser?.titre || 'Réaliser'} delay={0.1} />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-accent mb-6 font-medium"
            >
              {realiser?.sousTitre || 'Aménagement & plantation'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 max-w-lg"
            >
              {realiser?.paragraphe1 || 'Comme un peintre prépare sa toile, le jardin nécessite des fondations solides. Le terrain est préparé, modelé si nécessaire, les réseaux mis en place et les différents aménagements réalisés pour accueillir durablement les plantations.'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 max-w-lg"
            >
              {realiser?.paragraphe2 || 'C\'est le moment où le jardin entre en terre. Les végétaux sont implantés avec soin, en tenant compte de leur développement futur, des équilibres écologiques et des relations qu\'ils tisseront entre eux au fil des saisons.'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-sm md:text-base italic text-accent max-w-lg"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {realiser?.citation || 'Le jardin naît, mais il n\'est pas encore achevé.'}
            </motion.p>
          </div>

          {/* Action cards in 3 columns grid - desktop only with cascade */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {[
              { n: realiser?.action1Titre || "Préparer", t: realiser?.action1Description || "Ouvrir, nettoyer, organiser et enrichir" },
              { n: realiser?.action2Titre || "Acheminer", t: realiser?.action2Description || "Arbres, vivaces, bulbes, matériaux, décor" },
              { n: realiser?.action3Titre || "Implanter", t: realiser?.action3Description || "Avec joie et maestria" },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 1.0 + (i * 0.15) }}
                className="bg-card p-6 border-t-[4px] border-accent"
              >
                <div className="text-xs text-accent/60 mb-3 font-medium tracking-wider" style={{ fontFamily: "'DM Mono', monospace" }}>0{i + 1}</div>
                <h3 className="text-xl font-normal text-foreground mb-4" style={{ fontFamily: "'Fraunces', serif" }}>{s.n}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.t}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column - Image 30% */}
        <div className="lg:w-[30%] flex-shrink-0 self-stretch">
          <div ref={imageContainerRef} className="w-full h-full min-h-[500px] overflow-hidden bg-muted border-t-[3px] border-accent/60 relative">
            <motion.img
              style={{ y: imageY }}
              src={realiser?.imageUrl || "https://images.unsplash.com/photo-1492496913980-501348b61469?w=900&h=1200&fit=crop&auto=format"}
              alt="Plantation en cours — mise en terre des végétaux"
              className="w-full h-full object-cover scale-125"
            />
            {/* Decorative overlay element that moves with scroll */}
            <motion.div
              style={{ y: overlayY, opacity: overlayOpacity }}
              className="absolute bottom-12 left-8 right-8 pointer-events-none hidden lg:block"
            >
              <p
                className="text-6xl font-normal text-white/20"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                03
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action cards for mobile - below with cascade */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 px-8 md:px-16 pb-16">
        {[
          { n: realiser?.action1Titre || "Préparer", t: realiser?.action1Description || "Ouvrir, nettoyer, organiser et enrichir" },
          { n: realiser?.action2Titre || "Acheminer", t: realiser?.action2Description || "Arbres, vivaces, bulbes, matériaux, décor" },
          { n: realiser?.action3Titre || "Implanter", t: realiser?.action3Description || "Avec joie et maestria" },
        ].map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="bg-card p-6 md:p-8 border-t-[3px] border-accent/60"
          >
            <div className="text-xl md:text-2xl font-normal mb-2 md:mb-3 text-accent" style={{ fontFamily: "'Fraunces', serif" }}>{s.n}</div>
            <div className="text-sm text-muted-foreground leading-relaxed">{s.t}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Accompagner section content with Daylight-style layout (image left, content right)
// Portrait — bloc de texte à gauche, 3 images en collage légèrement superposé à droite
// (même vocabulaire visuel que les blocs de démarche : fond muted + liseré vert en haut)
function PortraitCollage({ portrait }: { portrait: any }) {
  const paragraphes = [
    portrait?.paragraphe1 || 'J\'ai commencé à prendre soin des jardins et à en dessiner à partir de 2016. Peintre et graphiste de formation, diplômé de l\'École Émile Cohl, j\'ai peu à peu ressenti le besoin de quitter les écrans et l\'atelier pour me tourner vers le vivant. J\'ai alors entrepris d\'apprendre à le nommer, à le comprendre et à cultiver cet artisanat patient qu\'est l\'art du jardin.',
    portrait?.paragraphe2 || 'De la botanique à la faune — auxiliaires comme parasites — en passant par l\'étude des sols et des différents biotopes, j\'ai appris à observer, reconnaître et déchiffrer ce que le terrain avait à raconter. Au fil des saisons, cette attention portée au détail a nourri mon regard autant que mon émerveillement.',
    portrait?.paragraphe3 || 'Chaque jardin possède son caractère, son rythme et ses promesses. Si vous souhaitez les révéler, je serai heureux de cheminer à vos côtés pour imaginer ensemble un lieu qui vous ressemble.',
  ];

  // Parallax léger au scroll : chaque image dérive à une vitesse différente
  // pour donner de la profondeur au collage (comme les blocs de démarche).
  const clusterRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: clusterRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["9%", "-9%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-center px-8 md:px-16 py-12 md:py-16">
      {/* Bloc de texte */}
      <div className="w-full lg:w-[40%] space-y-6 md:space-y-8">
        {paragraphes.map((texte, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed"
          >
            {texte}
          </motion.p>
        ))}
      </div>

      {/* Collage d'images légèrement superposées — occupe nettement plus d'espace que le texte */}
      <div ref={clusterRef} className="relative w-full lg:w-[60%] pt-8 pb-12 md:pt-12 md:pb-20">
        {/* Image 1 — photo principale, en haut à gauche de la zone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ y: y1 }}
          className="relative w-[70%] aspect-[4/3] overflow-hidden bg-muted border-t-[3px] border-accent/60 shadow-xl z-10"
        >
          <img
            src={portrait?.image1Url || "https://images.unsplash.com/photo-1680176104120-9dba9c415e89?w=1200&h=900&fit=crop&auto=format"}
            alt="Portrait — Atelier DESNOYERS dans son jardin"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Image 3 — petite touche décalée nettement à droite, pour ne pas s'aligner avec l'image 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          style={{ y: y3 }}
          className="absolute top-0 right-[-6%] w-[30%] sm:w-[32%] aspect-square overflow-hidden bg-muted border-t-[3px] border-accent/60 shadow-lg z-20"
        >
          <img
            src={portrait?.image3Url || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=900&fit=crop&auto=format"}
            alt="Jardin imaginé et créé ensemble"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Image 2 — décalée en bas à droite, chevauche le coin de l'image 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          style={{ y: y2 }}
          className="absolute bottom-[-6%] right-[-4%] w-[44%] aspect-[4/3] overflow-hidden bg-muted border-t-[3px] border-accent/60 shadow-xl z-30"
        >
          <img
            src={portrait?.image2Url || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=900&fit=crop&auto=format"}
            alt="Observation de la nature et du jardin"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
}

function AccompagnerContent({ accompagner }: { accompagner: any }) {
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the image container itself for smooth parallax
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax effect for image - stronger movement like Daylight
  const imageY = useTransform(imageScrollProgress, [0, 1], ["-20%", "20%"]);

  // Decorative element movement - moves in opposite direction for depth
  const overlayY = useTransform(imageScrollProgress, [0, 1], ["10%", "-10%"]);
  const overlayOpacity = useTransform(imageScrollProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div className="w-full">
      {/* Layout: Image gauche 30% | Contenu droite 70% */}
      <div className="flex flex-col lg:flex-row items-stretch min-h-screen">

        {/* Left Column - Image 30% */}
        <div className="lg:w-[30%] flex-shrink-0 self-stretch order-2 lg:order-1">
          <div ref={imageContainerRef} className="w-full h-full min-h-[500px] overflow-hidden bg-muted border-t-[3px] border-accent/60 relative">
            <motion.img
              style={{ y: imageY }}
              src={accompagner?.imageUrl || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&h=1200&fit=crop&auto=format"}
              alt="Accompagnement et entretien du jardin"
              className="w-full h-full object-cover scale-125"
            />
            {/* Decorative overlay element that moves with scroll */}
            <motion.div
              style={{ y: overlayY, opacity: overlayOpacity }}
              className="absolute bottom-12 left-8 right-8 pointer-events-none hidden lg:block"
            >
              <p
                className="text-6xl font-normal text-white/20"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                04
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Title + Text + Offres */}
        <div className="flex-1 flex flex-col justify-between px-8 md:px-16 lg:pl-12 lg:pr-24 py-16 md:py-40 gap-4 order-1 lg:order-2">

          {/* Title + Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-accent mb-6"><IconAccompagner /></div>
              <p className="text-xs tracking-widest uppercase text-accent mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
                LA DÉMARCHE — 04
              </p>
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
              <SplitTextReveal text={accompagner?.titre || 'Accompagner'} delay={0.1} />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 max-w-lg"
            >
              {accompagner?.paragraphe1 || 'Un jardin est un organisme vivant en constante évolution, il nous faut le laisser s\'épanouir et l\'aider à s\'installer. Je propose un suivi attentif afin d\'observer son développement, d\'ajuster certaines plantations et de transmettre les gestes qui permettent de gagner en autonomie.'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm md:text-base text-foreground max-w-lg"
            >
              {accompagner?.paragraphe2 || 'Voici mes quatre offres d\'entretien — à choisir selon votre rythme et votre envie de vous impliquer dans la vie du jardin.'}
            </motion.p>
          </div>

          {/* Offers in 2x2 grid - desktop only with cascade */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            {[
              { titre: accompagner?.offre1Titre || 'Saison', rythme: accompagner?.offre1Rythme || '2 visites / an', desc: accompagner?.offre1Description || 'Les moments essentiels. On observe les moments clés du jardin au fil de l\'année.' },
              { titre: accompagner?.offre2Titre || 'Cycle', rythme: accompagner?.offre2Rythme || '4 visites / an', desc: accompagner?.offre2Description || 'Le rythme complet du jardin. Observer, ajuster, tailler, enrichir, conseiller. Le client participe s\'il le souhaite.' },
              { titre: accompagner?.offre3Titre || 'Présence', rythme: accompagner?.offre3Rythme || '6 à 8 visites / an', desc: accompagner?.offre3Description || 'Un accompagnement attentif tout au long de l\'année : suivi des plantations, interventions ciblées, recommandations saisonnières, ajustements et conseils à distance.' },
              { titre: accompagner?.offre4Titre || 'Cocréation', rythme: accompagner?.offre4Rythme || '½ journée ou journée', desc: accompagner?.offre4Description || 'Le jardin devient une œuvre commune. Je vous transmets le jardin et vous donne des outils : comprendre son sol, composer un massif naturaliste, reconnaître les végétaux, tailler sans crainte.' },
            ].map((a, i) => (
              <motion.div
                key={a.titre}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.6 + (i * 0.15) }}
                className="bg-background p-6 border-t-[4px] border-accent"
              >
                <div className="text-xs text-accent/60 mb-3 font-medium tracking-wider" style={{ fontFamily: "'DM Mono', monospace" }}>0{i + 1}</div>
                <h3 className="text-xl font-normal text-foreground mb-2" style={{ fontFamily: "'Fraunces', serif" }}>{a.titre}</h3>
                <p className="text-sm text-accent font-semibold mb-4 tracking-wide">{a.rythme}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Offres grid for mobile - below with cascade */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 px-8 md:px-16 pb-16">
        {[
          { titre: accompagner?.offre1Titre || 'Saison', rythme: accompagner?.offre1Rythme || '2 visites / an', desc: accompagner?.offre1Description || 'Les moments essentiels. On observe les moments clés du jardin au fil de l\'année.' },
          { titre: accompagner?.offre2Titre || 'Cycle', rythme: accompagner?.offre2Rythme || '4 visites / an', desc: accompagner?.offre2Description || 'Le rythme complet du jardin. Observer, ajuster, tailler, enrichir, conseiller. Le client participe s\'il le souhaite.' },
          { titre: accompagner?.offre3Titre || 'Présence', rythme: accompagner?.offre3Rythme || '6 à 8 visites / an', desc: accompagner?.offre3Description || 'Un accompagnement attentif tout au long de l\'année : suivi des plantations, interventions ciblées, recommandations saisonnières, ajustements et conseils à distance.' },
          { titre: accompagner?.offre4Titre || 'Cocréation', rythme: accompagner?.offre4Rythme || '½ journée ou journée', desc: accompagner?.offre4Description || 'Le jardin devient une œuvre commune. Je vous transmets le jardin et vous donne des outils : comprendre son sol, composer un massif naturaliste, reconnaître les végétaux, tailler sans crainte.' },
        ].map((a, i) => (
          <motion.div
            key={a.titre}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="bg-background p-5 md:p-7 flex flex-col border-t-[3px] border-accent/60"
          >
            <span className="text-xs text-muted-foreground mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>0{i + 1}</span>
            <h3 className="text-2xl font-normal mb-1" style={{ fontFamily: "'Fraunces', serif" }}>{a.titre}</h3>
            <p className="text-xs text-accent font-medium mb-4">{a.rythme}</p>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Citation section with scroll-based reveal animation
function CitationSection({ citation }: { citation: any }) {
  return (
    <section className="relative border-t border-b border-border md:min-h-screen flex items-center justify-center py-16 md:py-32">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={citation?.imageFondUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&h=1080&fit=crop&auto=format&q=80"}
          alt="Jardin paysager naturel"
          className="w-full h-full object-cover brightness-[0.3]"
        />
      </div>

      {/* Content container - centered */}
      <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 text-center">
        {/* Giant title with blur word reveal animation */}
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] md:leading-[1.05] text-white font-normal mb-6 md:mb-12" style={{ fontFamily: "'Fraunces', serif" }}>
          <CitationWordReveal text={citation?.texte || '"Des jardins comme des tableaux vivants."'} />
        </div>

        {/* Small secondary text below with secondary font */}
        {citation?.sousTexte && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
            className="text-sm md:text-base lg:text-lg text-white/70"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {citation.sousTexte}
          </motion.p>
        )}
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
    <div className="border-b border-border">
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-6 py-8 text-left group"
        whileHover={{ backgroundColor: "rgba(250,246,238,0.02)" }}
        transition={{ duration: 0.2 }}
      >
        <span
          className="text-[10px] text-muted-foreground/40 shrink-0 mt-2 w-6"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`flex-1 text-xl md:text-2xl font-normal leading-snug transition-colors duration-300 ${open ? "text-accent" : "group-hover:text-accent/80"}`}
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {q}
        </span>
        <motion.div
          className={`shrink-0 mt-2 w-6 h-6 border-[1.5px] rounded-full flex items-center justify-center ${open ? "border-accent bg-accent" : "border-border group-hover:border-accent/50"}`}
          animate={{
            rotate: open ? 180 : 0,
            scale: open ? 1.05 : 1
          }}
          transition={{
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          <ChevronDown
            size={14}
            className={`transition-colors duration-300 ${open ? "text-background" : "text-muted-foreground"}`}
          />
        </motion.div>
      </motion.button>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0
        }}
        transition={{
          height: {
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1]
          },
          opacity: {
            duration: 0.3,
            ease: "easeOut"
          }
        }}
        className="overflow-hidden"
      >
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: open ? 0 : -10 }}
          transition={{
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1]
          }}
          className="pl-12 pb-8 pr-6"
        >
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line border-l-[3px] border-accent/20 pl-6">
            {a}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

const HERO_VIDEO_ID = "r_epbFJ231Y";
const HERO_VIDEO_LOOP_END = 30; // secondes — on coupe avant le titrage final puis on reboucle

function HeroVideo() {
  const iframeId = "hero-youtube-player";

  // Le paramètre `end` de l'URL YouTube n'est pas fiable une fois que loop=1
  // reprend la main (la vidéo rejoue parfois jusqu'au bout). On pilote donc
  // le bouclage nous-mêmes via l'IFrame API : dès que la lecture dépasse
  // HERO_VIDEO_LOOP_END, on revient au début.
  useEffect(() => {
    let player: any;
    let checkInterval: ReturnType<typeof setInterval>;

    const startWatcher = () => {
      checkInterval = setInterval(() => {
        if (player?.getCurrentTime && player.getCurrentTime() >= HERO_VIDEO_LOOP_END) {
          player.seekTo(0, true);
        }
      }, 500);
    };

    const createPlayer = () => {
      player = new (window as any).YT.Player(iframeId, {
        events: {
          onReady: startWatcher,
        },
      });
    };

    if ((window as any).YT?.Player) {
      createPlayer();
    } else {
      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        createPlayer();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    }

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
      <iframe
        id={iframeId}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          scale: "1.5",
          width: "100vw",
          height: "56.25vw", // 16:9 aspect ratio
          minHeight: "100vh",
          minWidth: "177.77vh", // 16:9 aspect ratio
          pointerEvents: 'none'
        }}
        src={`https://www.youtube-nocookie.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO_ID}&start=0&end=${HERO_VIDEO_LOOP_END}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1&fs=0&cc_load_policy=0`}
        title="Background video"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        loading="eager"
      />
    </div>
  );
}

export default function Home() {
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const { data: homepage, loading, error } = useHomepage();
  const { data: citation } = useCitation();
  const { data: observer } = useDemarcheObserver();
  const { data: dessiner } = useDemarcheDessiner();
  const { data: realiser } = useDemarcheRealiser();
  const { data: accompagner } = useDemarcheAccompagner();
  const { data: portrait } = usePortrait();
  const { data: faqs } = useFaqs();
  const { data: portfolio } = usePortfolios();
  const { data: jardinImages } = useJardinImages();
  const { data: temoignages } = useTemoignages();

  // Charger les articles depuis Supabase
  useEffect(() => {
    async function loadArticles() {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("visible", true)
        .order("date", { ascending: false })
        .limit(3);

      if (data) {
        setArticles(data);
      }
    }
    loadArticles();
  }, []);

  const handleNextProjet = () => {
    if (!portfolio || !selectedProjet) return;
    // Filtrer seulement les projets visibles (ordre <= 6)
    const visibleProjects = portfolio.filter(p => p.ordre <= 6);
    const currentIndex = visibleProjects.findIndex(p => p.id === selectedProjet.id);
    const nextIndex = (currentIndex + 1) % visibleProjects.length;
    setSelectedProjet(visibleProjects[nextIndex]);
  };

  return (
    <>
      <ProjetModal
        projet={selectedProjet}
        onClose={() => setSelectedProjet(null)}
        onNextProjet={handleNextProjet}
      />

      {/* HERO — full screen video */}
      {/* h-screen-safe (voir tailwind.css) : sur mobile, la barre d'adresse qui
          apparaît/disparaît fait que 100vh ne correspond pas à la zone réellement
          visible, ce qui poussait le surtitre sous le header. */}
      {/* pt-24 : réserve un espace sous le header fixe, pour que le contenu (ancré en bas)
          ne remonte jamais derrière le logo/menu quand la hauteur visible est très compressée. */}
      <section className="relative h-screen-safe min-h-[700px] flex items-end overflow-hidden bg-[#1a1f16] pt-24">
        <HeroVideo />
        {/* Gradient en haut pour lisibilité menu */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
        {/* Gradient en bas pour lisibilité titre */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full px-8 md:px-16 lg:px-24 pb-8 sm:pb-16 md:pb-32 lg:pb-40"
        >
          <div className="flex items-end justify-between gap-16">
            {/* Left side - Giant title */}
            <div className="flex-1 max-w-[1200px]">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-[10px] md:text-sm tracking-widest uppercase text-white/40 mb-8 md:mb-10 leading-relaxed"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {loading ? (
                  "Chargement..."
                ) : (
                  (() => {
                    const surtitre = homepage?.heroSurtitre || "Jardinier · Designer — Lyon & Rhône-Alpes Auvergne";
                    const [premiereLigne, ...reste] = surtitre.split("—");
                    const secondeLigne = reste.join("—").trim();
                    return secondeLigne ? (
                      <>
                        {premiereLigne.trim()}
                        <br />
                        {secondeLigne}
                      </>
                    ) : (
                      surtitre
                    );
                  })()
                )}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal leading-[0.95] text-white"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {loading ? (
                  "Chargement..."
                ) : homepage?.heroTitre ? (
                  <>
                    {homepage.heroTitre.split(" ").slice(0, 2).join(" ")}
                    <br />
                    {homepage.heroTitre.split(" ").slice(2, 4).join(" ")}
                    <br />
                    <em className="text-white/90">{homepage.heroTitre.split(" ").slice(4).join(" ")}</em>
                  </>
                ) : (
                  <>
                    Des jardins
                    <br />
                    comme des
                    <br />
                    <em className="text-white/90">tableaux vivants.</em>
                  </>
                )}
              </motion.h1>
            </div>

            {/* Right side - Logo, description, CTAs - aligned to bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="hidden lg:flex flex-col w-[380px] flex-shrink-0 pb-2"
            >
              <img
                src={logoBlancSrc}
                alt="Atelier DESNOYERS"
                className="w-44 xl:w-52 mb-8"
              />
              <p className="text-sm xl:text-base text-white/70 leading-relaxed mb-8">
                {loading ? "Chargement..." : homepage?.heroDescription || "Je conçois des jardins naturalistes et les accompagne dans le temps. Entre conception et soin, créer des lieux vivants, sensibles et durables."}
              </p>
              <div className="flex flex-col gap-3">
                {(() => {
                  const arrowRef1 = useRef<ArrowUpRightIconHandle>(null);
                  return (
                    <motion.button
                      onClick={() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      onHoverStart={() => arrowRef1.current?.startAnimation()}
                      onHoverEnd={() => arrowRef1.current?.stopAnimation()}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                      whileTap={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                      transition={{ duration: 0.2 }}
                      className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-primary text-xs tracking-widest uppercase overflow-hidden"
                    >
                      {homepage?.heroCtaPrincipal || "Projet de jardin"}
                      <AnimatedArrowUpRight ref={arrowRef1} size={13} />
                    </motion.button>
                  );
                })()}
                {(() => {
                  const arrowRef2 = useRef<ArrowUpRightIconHandle>(null);
                  return (
                    <motion.button
                      onClick={() => {
                        document.getElementById('observer')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      onHoverStart={() => arrowRef2.current?.startAnimation()}
                      onHoverEnd={() => arrowRef2.current?.stopAnimation()}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.8)" }}
                      whileTap={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      transition={{ duration: 0.2 }}
                      className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/30 text-white text-xs tracking-widest uppercase overflow-hidden"
                    >
                      {homepage?.heroCtaSecondaire || "La démarche"}
                      <AnimatedArrowUpRight ref={arrowRef2} size={13} />
                    </motion.button>
                  );
                })()}
              </div>
            </motion.div>
          </div>

          {/* Mobile CTA section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="lg:hidden mt-12"
          >
            <img
              src={logoBlancSrc}
              alt="Atelier DESNOYERS"
              className="w-20 mb-6"
            />
            <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-md">
              {loading ? "Chargement..." : homepage?.heroDescription || "Je conçois des jardins naturalistes et les accompagne dans le temps. Entre conception et soin, créer des lieux vivants, sensibles et durables."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {(() => {
                const arrowRef3 = useRef<ArrowUpRightIconHandle>(null);
                return (
                  <motion.button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    onHoverStart={() => arrowRef3.current?.startAnimation()}
                    onHoverEnd={() => arrowRef3.current?.stopAnimation()}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                    whileTap={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                    transition={{ duration: 0.2 }}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-primary text-xs tracking-widest uppercase"
                  >
                    {homepage?.heroCtaPrincipal || "Projet de jardin"}
                    <AnimatedArrowUpRight ref={arrowRef3} size={12} />
                  </motion.button>
                );
              })()}
              {(() => {
                const arrowRef4 = useRef<ArrowUpRightIconHandle>(null);
                return (
                  <motion.button
                    onClick={() => document.getElementById('observer')?.scrollIntoView({ behavior: 'smooth' })}
                    onHoverStart={() => arrowRef4.current?.startAnimation()}
                    onHoverEnd={() => arrowRef4.current?.stopAnimation()}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.8)" }}
                    whileTap={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    transition={{ duration: 0.2 }}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/30 text-white text-xs tracking-widest uppercase"
                  >
                    {homepage?.heroCtaSecondaire || "La démarche"}
                    <AnimatedArrowUpRight ref={arrowRef4} size={12} />
                  </motion.button>
                );
              })()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-[10px] tracking-widest uppercase">Défiler</span>
            <div className="w-px h-10 bg-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* PORTFOLIO */}
      <section className="border-t border-border overflow-hidden py-20 md:py-32">
        <div className="w-full px-8 md:px-16 lg:px-24">
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
                className="text-4xl md:text-5xl lg:text-6xl font-normal"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {portfolio && portfolio.slice(0, 8).map((p, index) => (
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
      <StackingSection id="accompagner" className="border-t border-border bg-card" zIndex={40}>
        <AccompagnerContent accompagner={accompagner} />
      </StackingSection>

      {/* PORTRAIT - Full width with scroll reveals like Daylight */}
      <section id="portrait" className="relative z-50 bg-background py-16 md:py-24">

        {/* Intro section with title */}
        <div className="flex items-center justify-center px-8 md:px-16 py-20 md:py-32">
          <div className="max-w-4xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-xs tracking-widest uppercase text-muted-foreground mb-6"
            >
              {portrait?.surtitre || 'Portrait'}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] mb-8"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {portrait?.titreLigne1 || 'Le regard du designer'}
              <br />
              {portrait?.titreLigne2 || 'et les gestes du jardinier.'}
            </motion.h2>
          </div>
        </div>

        {/* Texte à gauche, images en collage superposé à droite — écho des blocs de démarche */}
        <PortraitCollage portrait={portrait} />
      </section>

      {/* BLOG */}
      <section id="journal" className="relative z-50 border-t border-border bg-card py-24 md:py-40">
        <div className="w-full px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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
              to="/journal"
              className="hidden md:inline-flex items-center gap-2 text-sm text-accent hover:opacity-70 transition-opacity"
            >
              Tous les articles <ArrowUpRight size={14} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              >
                <Link
                  to={`/journal/${article.slug}`}
                  className="group flex flex-col"
                >
                {/* Image */}
                <div className="relative overflow-hidden border-t-[2px] border-accent/60 mb-4" style={{ aspectRatio: "3/2" }}>
                  <img
                    src={article.banniere_url}
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
      <section className="relative z-50 border-t border-border bg-background py-24 md:py-40">
        <div className="w-full px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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
            {(temoignages || []).map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
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
      <section id="contact" className="relative z-50 py-24 md:py-40" style={{ backgroundColor: "#b85c3a", color: "#faf6ee" }}>
        <div className="w-full px-8 md:px-16 grid md:grid-cols-12 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
              {(() => {
                const arrowRef = useRef<ArrowUpRightIconHandle>(null);
                return (
                  <motion.button
                    type="submit"
                    onHoverStart={() => arrowRef.current?.startAnimation()}
                    onHoverEnd={() => arrowRef.current?.stopAnimation()}
                    whileHover={{ backgroundColor: "rgba(250,246,238,0.9)" }}
                    whileTap={{ backgroundColor: "rgba(250,246,238,0.8)" }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 self-start group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs tracking-widest uppercase overflow-hidden"
                    style={{ backgroundColor: "#faf6ee", color: "#1e2319" }}
                  >
                    Envoyer ma demande
                    <AnimatedArrowUpRight ref={arrowRef} size={13} />
                  </motion.button>
                );
              })()}
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-50 border-t border-border bg-card py-24 md:py-40">
        <div className="w-full px-8 md:px-16 py-8 md:py-12">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20">

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
        <div className="w-full px-8 md:px-16 py-12">
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
            {(jardinImages || []).slice(0, 6).map((img, i) => (
              <a
                key={img.id}
                href={img.linkUrl || 'https://www.instagram.com/antoine.desnoyers/'}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden bg-muted group cursor-pointer border-t-[3px] border-accent/60"
              >
                <img
                  src={img.imageUrl}
                  alt={img.altText || `Photo jardin ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
