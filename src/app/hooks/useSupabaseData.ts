import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

// Fonction utilitaire pour convertir le Rich Text de Strapi en texte simple
// (garde pour compatibilité si les données viennent encore de Strapi)
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

export interface DemarcheRealiserData {
  titre: string;
  sousTitre: string;
  paragraphe1: string;
  paragraphe2: string;
  citation: string;
  action1Titre: string;
  action1Description: string;
  action2Titre: string;
  action2Description: string;
  action3Titre: string;
  action3Description: string;
}

export function useHomepage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHomepage() {
      try {
        const { data: result, error: supabaseError } = await supabase
          .from('homepages')
          .select('*')
          .limit(1)
          .single();

        if (supabaseError) throw supabaseError;

        if (result) {
          setData({
            heroSurtitre: result.heroSurtitre || result.hero_surtitre || '',
            heroTitre: result.heroTitre || result.hero_titre || '',
            heroDescription: result.heroDescription || result.hero_description || '',
            heroCtaPrincipal: result.heroCtaPrincipal || result.hero_cta_principal || '',
            heroCtaSecondaire: result.heroCtaSecondaire || result.hero_cta_secondaire || '',
          });
        } else {
          setError('Aucune donnée trouvée');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de la Homepage:', err);
        setError('Erreur de connexion à Supabase');
      } finally {
        setLoading(false);
      }
    }

    fetchHomepage();
  }, []);

  return { data, loading, error };
}

export function useCitation() {
  const [data, setData] = useState<CitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCitation() {
      try {
        const { data: result, error: supabaseError } = await supabase
          .from('citations')
          .select('*')
          .limit(1)
          .single();

        if (supabaseError) throw supabaseError;

        if (result) {
          setData({
            texte: richTextToPlainText(result.texte),
            sousTexte: result.sousTexte || result.sous_texte || '',
          });
        } else {
          setError('Aucune donnée trouvée');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de la Citation:', err);
        setError('Erreur de connexion à Supabase');
      } finally {
        setLoading(false);
      }
    }

    fetchCitation();
  }, []);

  return { data, loading, error };
}

export function useDemarcheObserver() {
  const [data, setData] = useState<DemarcheObserverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDemarcheObserver() {
      try {
        const { data: result, error: supabaseError } = await supabase
          .from('demarche_observers')
          .select('*')
          .limit(1)
          .single();

        if (supabaseError) throw supabaseError;

        if (result) {
          setData({
            titre: result.titre || '',
            sousTitre: result.sous_titre || '',
            paragraphe1: result.paragraphe_1 || '',
            paragraphe2: result.paragraphe_2 || '',
            action1Titre: result.action_1_titre || '',
            action1Description: result.action_1_description || '',
            action2Titre: result.action_2_titre || '',
            action2Description: result.action_2_description || '',
            action3Titre: result.action_3_titre || '',
            action3Description: result.action_3_description || '',
          });
        } else {
          setError('Aucune donnée trouvée');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de Demarche Observer:', err);
        setError('Erreur de connexion à Supabase');
      } finally {
        setLoading(false);
      }
    }

    fetchDemarcheObserver();
  }, []);

  return { data, loading, error };
}

export function useDemarcheDessiner() {
  const [data, setData] = useState<DemarcheDessinerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDemarcheDessiner() {
      try {
        const { data: result, error: supabaseError } = await supabase
          .from('demarche_dessiners')
          .select('*')
          .limit(1)
          .single();

        if (supabaseError) throw supabaseError;

        if (result) {
          setData({
            titre: result.titre || '',
            sousTitre: result.sousTitre || result.sous_titre || '',
            citation: result.citation || '',
            paragraphe: result.paragraphe || '',
            aspect1Titre: result.aspect_1_titre || result.aspect1Titre || '',
            aspect1Detail: result.aspect_1_detail || result.aspect1Detail || '',
            aspect2Titre: result.aspect_2_titre || result.aspect2Titre || '',
            aspect2Detail: result.aspect_2_detail || result.aspect2Detail || '',
            aspect3Titre: result.aspect_3_titre || result.aspect3Titre || '',
            aspect3Detail: result.aspect_3_detail || result.aspect3Detail || '',
            aspect4Titre: result.aspect_4_titre || result.aspect4Titre || '',
            aspect4Detail: result.aspect_4_detail || result.aspect4Detail || '',
          });
        } else {
          setError('Aucune donnée trouvée');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de Demarche Dessiner:', err);
        setError('Erreur de connexion à Supabase');
      } finally {
        setLoading(false);
      }
    }

    fetchDemarcheDessiner();
  }, []);

  return { data, loading, error };
}

export function useDemarcheRealiser() {
  const [data, setData] = useState<DemarcheRealiserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDemarcheRealiser() {
      try {
        const { data: result, error: supabaseError } = await supabase
          .from('demarche_realisers')
          .select('*')
          .limit(1)
          .single();

        if (supabaseError) throw supabaseError;

        if (result) {
          setData({
            titre: result.titre || '',
            sousTitre: result.sous_titre || '',
            paragraphe1: result.paragraphe_1 || '',
            paragraphe2: result.paragraphe_2 || '',
            citation: result.citation || '',
            action1Titre: result.action_1_titre || '',
            action1Description: result.action_1_description || '',
            action2Titre: result.action_2_titre || '',
            action2Description: result.action_2_description || '',
            action3Titre: result.action_3_titre || '',
            action3Description: result.action_3_description || '',
          });
        } else {
          setError('Aucune donnée trouvée');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de Demarche Realiser:', err);
        setError('Erreur de connexion à Supabase');
      } finally {
        setLoading(false);
      }
    }

    fetchDemarcheRealiser();
  }, []);

  return { data, loading, error };
}
