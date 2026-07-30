import { useState, useEffect } from 'react';

// Use relative URL in production (same domain), localhost in development
const STRAPI_URL = import.meta.env.PROD ? '' : 'http://localhost:1337';

// Fonction utilitaire pour convertir le Rich Text de Strapi en texte simple
function richTextToPlainText(richText: any): string {
  if (typeof richText === 'string') return richText;
  if (!richText || !Array.isArray(richText)) return '';

  return richText
    .map((block: any) => {
      if (block.children && Array.isArray(block.children)) {
        return block.children
          .map((child: any) => child.text || '')
          .join('');
      }
      return '';
    })
    .join('\n')
    .trim();
}

export interface HomepageData {
  heroSurtitre: string;
  heroTitre: string;
  heroDescription: string;
  heroCtaPrincipal: string;
  heroCtaSecondaire: string;
}

export interface CitationData {
  texte: string;
  sousTexte: string;
}

export interface DemarcheObserverData {
  titre: string;
  sousTitre: string;
  paragraphe1: string;
  paragraphe2: string;
  action1Titre: string;
  action1Description: string;
  action2Titre: string;
  action2Description: string;
  action3Titre: string;
  action3Description: string;
}

export interface DemarcheDessinerData {
  titre: string;
  sousTitre: string;
  citation: string;
  paragraphe: string;
  aspect1Titre: string;
  aspect1Detail: string;
  aspect2Titre: string;
  aspect2Detail: string;
  aspect3Titre: string;
  aspect3Detail: string;
  aspect4Titre: string;
  aspect4Detail: string;
}

export function useHomepage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Temporairement, on utilise /api/homepages (collection) au lieu de /api/homepage (single type)
    fetch(`${STRAPI_URL}/api/homepages`)
      .then(res => res.json())
      .then(response => {
        console.log('Homepage data from Strapi:', response);
        if (response.data && response.data.length > 0) {
          // Dans Strapi v5, les attributs sont directement dans data[0], pas dans data[0].attributes
          const firstItem = response.data[0];
          setData({
            heroSurtitre: firstItem.heroSurtitre,
            heroTitre: firstItem.heroTitre,
            heroDescription: firstItem.heroDescription,
            heroCtaPrincipal: firstItem.heroCtaPrincipal,
            heroCtaSecondaire: firstItem.heroCtaSecondaire,
          });
        } else {
          setError('Aucune donnée trouvée');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération de la Homepage:', err);
        setError('Erreur de connexion à Strapi');
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useStrapiTestText() {
  const [text, setText] = useState<string>('Chargement depuis Strapi...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${STRAPI_URL}/api/test-texts`)
      .then(res => res.json())
      .then(data => {
        console.log('Strapi data:', data);
        if (data.data && data.data.length > 0) {
          const firstEntry = data.data[0];
          // Essaye d'abord message, puis title
          const message = firstEntry.attributes?.message || firstEntry.attributes?.title || firstEntry.message || firstEntry.title;
          setText(message || 'Pas de message trouvé');
        } else {
          setText('Aucun texte trouvé dans Strapi');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur Strapi:', err);
        setError('Erreur de connexion à Strapi');
        setLoading(false);
      });
  }, []);

  return { text, loading, error };
}

export function useCitation() {
  const [data, setData] = useState<CitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${STRAPI_URL}/api/citations`)
      .then(res => res.json())
      .then(response => {
        console.log('Citation data from Strapi:', response);
        if (response.data && response.data.length > 0) {
          const firstItem = response.data[0];
          setData({
            texte: richTextToPlainText(firstItem.texte),
            sousTexte: firstItem.sousTexte || '',
          });
        } else {
          setError('Aucune donnée trouvée');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération de la Citation:', err);
        setError('Erreur de connexion à Strapi');
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useDemarcheObserver() {
  const [data, setData] = useState<DemarcheObserverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${STRAPI_URL}/api/demarche-observers`)
      .then(res => res.json())
      .then(response => {
        console.log('Demarche Observer data from Strapi:', response);
        if (response.data && response.data.length > 0) {
          const firstItem = response.data[0];
          setData({
            titre: firstItem.titre || '',
            sousTitre: firstItem.sousTitre || '',
            paragraphe1: firstItem.paragraphe1 || '',
            paragraphe2: firstItem.paragraphe2 || '',
            action1Titre: firstItem.action1Titre || '',
            action1Description: firstItem.action1Description || '',
            action2Titre: firstItem.action2Titre || '',
            action2Description: firstItem.action2Description || '',
            action3Titre: firstItem.action3Titre || '',
            action3Description: firstItem.action3Description || '',
          });
        } else {
          setError('Aucune donnée trouvée');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération de Demarche Observer:', err);
        setError('Erreur de connexion à Strapi');
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useDemarcheDessiner() {
  const [data, setData] = useState<DemarcheDessinerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${STRAPI_URL}/api/demarche-dessiners`)
      .then(res => res.json())
      .then(response => {
        console.log('Demarche Dessiner data from Strapi:', response);
        if (response.data && response.data.length > 0) {
          const firstItem = response.data[0];
          setData({
            titre: firstItem.titre || '',
            sousTitre: firstItem.sousTitre || '',
            citation: firstItem.citation || '',
            paragraphe: firstItem.paragraphe || '',
            aspect1Titre: firstItem.aspect1Titre || '',
            aspect1Detail: firstItem.aspect1Detail || '',
            aspect2Titre: firstItem.aspect2Titre || '',
            aspect2Detail: firstItem.aspect2Detail || '',
            aspect3Titre: firstItem.aspect3Titre || '',
            aspect3Detail: firstItem.aspect3Detail || '',
            aspect4Titre: firstItem.aspect4Titre || '',
            aspect4Detail: firstItem.aspect4Detail || '',
          });
        } else {
          setError('Aucune donnée trouvée');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération de Demarche Dessiner:', err);
        setError('Erreur de connexion à Strapi');
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
