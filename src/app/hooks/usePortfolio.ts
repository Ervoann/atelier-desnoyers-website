import { useState, useEffect } from 'react';
import type { Slide } from '../data';

export interface PortfolioProject {
  id?: number;
  slug: string;
  titre: string;
  lieu: string;
  type: string;
  annee: string;
  surface: string;
  img: string;
  slides: Array<{ type: 'image' | 'youtube'; src: string }>;
  description: string;
  tags: string[];
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        // Essayer de charger les projets depuis /content/portfolio/
        const response = await fetch('/content/portfolio/');

        if (!response.ok) {
          // Si pas de dossier portfolio, utiliser les données par défaut
          const { portfolio: defaultPortfolio } = await import('../data');
          setPortfolio(defaultPortfolio);
          setLoading(false);
          return;
        }

        // Pour l'instant, on charge manuellement les fichiers connus
        // TODO: Implémenter un système de listing automatique
        const projects: PortfolioProject[] = [];

        try {
          const project1 = await fetch('/content/portfolio/jardin-naturaliste-lyon.json');
          if (project1.ok) {
            const data = await project1.json();
            projects.push({ ...data, id: projects.length + 1 });
          }
        } catch (e) {
          console.log('Projet non trouvé:', e);
        }

        if (projects.length > 0) {
          setPortfolio(projects);
        } else {
          // Fallback sur les données par défaut
          const { portfolio: defaultPortfolio } = await import('../data');
          setPortfolio(defaultPortfolio);
        }

        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement du portfolio:', err);
        setError(err as Error);

        // Fallback sur les données par défaut en cas d'erreur
        try {
          const { portfolio: defaultPortfolio } = await import('../data');
          setPortfolio(defaultPortfolio);
        } catch (fallbackErr) {
          console.error('Erreur fallback:', fallbackErr);
        }

        setLoading(false);
      }
    }

    loadPortfolio();
  }, []);

  return { portfolio, loading, error };
}
