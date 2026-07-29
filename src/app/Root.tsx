import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { X, Menu, ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoSrc from "@/imports/Plan_de_travail_1.png";
import logoBlanc from "@/imports/ATELIER-DESNOYERS-BLANC-1.png";

export default function Root() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen bg-background text-foreground relative"
      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
    >
      {/* NAV */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome
            ? "bg-background/95 backdrop-blur-sm border-b-[2px] border-accent"
            : ""
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          <Link
            to="/"
            className="hover:opacity-70 transition-opacity"
            style={{ fontFamily: "'Fraunces', serif", color: isHome && !scrolled ? "#ffffff" : "#1e2319" }}
          >
            <span className="text-xl font-normal tracking-wide">Atelier DESNOYERS</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm">
            {[
              { label: "Observer", href: isHome ? "#observer" : "/#observer" },
              { label: "Dessiner", href: isHome ? "#dessiner" : "/#dessiner" },
              { label: "Réaliser", href: isHome ? "#realiser" : "/#realiser" },
              { label: "Accompagner", href: isHome ? "#accompagner" : "/#accompagner" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href={isHome ? "#contact" : "/#contact"}
              className="ml-2 px-4 py-1.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
            >
              Projet de jardin
            </a>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden bg-background border-b border-border px-6 pb-6 pt-2 flex flex-col gap-1 text-sm">
            {[
              { label: "Observer", href: "/#observer" },
              { label: "Dessiner", href: "/#dessiner" },
              { label: "Réaliser", href: "/#realiser" },
              { label: "Accompagner", href: "/#accompagner" },
              { label: "Portrait", href: "/#portrait" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 border-b border-border last:border-0"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <Outlet />

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={logoSrc}
              alt="Atelier DESNOYERS"
              className="h-8 w-auto object-contain"
            />
            <span className="opacity-40">·</span>
            <span>Lyon & Rhône-Alpes Auvergne</span>
          </div>
          <span>© 2025 · Tous droits réservés</span>
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/antoine.desnoyers/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              Instagram <ArrowUpRight size={10} />
            </a>
            <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
