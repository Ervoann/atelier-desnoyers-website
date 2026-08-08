import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { HomepageData, CitationData, DemarcheObserverData, DemarcheDessinerData, DemarcheRealiserData, DemarcheAccompagnerData, PortraitData, FaqData, PortfolioData, PortfolioSlideData, JardinImageData, TemoignageData } from '../hooks/useSupabaseData';
import ImageUploader from '../components/ImageUploader';
import ImageGalleryModal from '../components/ImageGalleryModal';
import ImageGallery from '../components/ImageGallery';
import PortfolioManager from '../components/PortfolioManager';
import FaqManager from '../components/FaqManager';
import ArticleManager from '../components/ArticleManager';
import JardinManager from '../components/JardinManager';
import TemoignagesManager from '../components/TemoignagesManager';

type Section = 'homepage' | 'citation' | 'observer' | 'dessiner' | 'realiser' | 'accompagner' | 'portrait' | 'jardin' | 'temoignages' | 'faq' | 'portfolio' | 'galerie' | 'articles';

// Portfolio Form Component
function PortfolioForm({
  portfolio,
  onSave,
  onCancel
}: {
  portfolio: Partial<PortfolioData>,
  onSave: (portfolio: any) => void,
  onCancel: () => void
}) {
  const [slug, setSlug] = useState(portfolio.slug || '');
  const [titre, setTitre] = useState(portfolio.titre || '');
  const [chantierNumero, setChantierNumero] = useState(portfolio.chantierNumero || '');
  const [lieu, setLieu] = useState(portfolio.lieu || '');
  const [typeProjet, setTypeProjet] = useState(portfolio.typeProjet || '');
  const [annee, setAnnee] = useState(portfolio.annee || '');
  const [surface, setSurface] = useState(portfolio.surface || '');
  const [imagePrincipale, setImagePrincipale] = useState(portfolio.imagePrincipale || '');
  const [description, setDescription] = useState(portfolio.description || '');
  const [tags, setTags] = useState((portfolio.tags || []).join(', '));
  const [ordre, setOrdre] = useState(portfolio.ordre || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...portfolio,
      slug,
      titre,
      chantierNumero,
      lieu,
      typeProjet,
      annee,
      surface,
      imagePrincipale,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      ordre
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border-2 border-green-200">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Titre du projet *</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL) *</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="mon-projet-jardin"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chantier #</label>
          <input
            type="text"
            value={chantierNumero}
            onChange={(e) => setChantierNumero(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="65"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Année *</label>
          <input
            type="text"
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="2026"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Surface *</label>
          <input
            type="text"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="1 000 m²"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lieu *</label>
          <input
            type="text"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Caluire et Cuire"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de projet</label>
          <input
            type="text"
            value={typeProjet}
            onChange={(e) => setTypeProjet(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Jardin privé"
          />
        </div>
      </div>

      <div>
        <ImageUploader
          currentImageUrl={imagePrincipale}
          onImageUploaded={setImagePrincipale}
          label="Image principale *"
        />
        <div className="mt-2">
          <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
          <input
            type="text"
            value={imagePrincipale}
            onChange={(e) => setImagePrincipale(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="https://... (optionnel si vous uploadez)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description / Note *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Description détaillée du projet..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (séparés par des virgules)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Vivaces, Graminées, Sol vivant"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage *</label>
          <input
            type="number"
            value={ordre}
            onChange={(e) => setOrdre(parseInt(e.target.value))}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          Sauvegarder le projet
        </button>
      </div>
    </form>
  );
}

// Slide Form Component
function SlideForm({
  portfolioId,
  existingSlidesCount,
  onAdd,
  onCancel
}: {
  portfolioId: number,
  existingSlidesCount: number,
  onAdd: (portfolioId: number, slide: Omit<PortfolioSlideData, 'id' | 'portfolio_id'>) => void,
  onCancel: () => void
}) {
  const [type, setType] = useState<'image' | 'youtube'>('image');
  const [src, setSrc] = useState('');
  const [videoId, setVideoId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(portfolioId, {
      type,
      src: type === 'image' ? src : null,
      video_id: type === 'youtube' ? videoId : null,
      ordre: existingSlidesCount + 1
    });
    setSrc('');
    setVideoId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-green-50 p-4 rounded-lg border border-green-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type de slide</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'image' | 'youtube')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="image">Image</option>
          <option value="youtube">Vidéo YouTube</option>
        </select>
      </div>

      {type === 'image' ? (
        <div>
          <ImageUploader
            currentImageUrl={src}
            onImageUploaded={setSrc}
            label="Image de la galerie"
          />
          <div className="mt-2">
            <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
            <input
              type="text"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="https://... (optionnel si vous uploadez)"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video ID</label>
          <input
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="r_epbFJ231Y"
          />
          <p className="text-xs text-gray-500 mt-1">L'ID se trouve dans l'URL: youtube.com/watch?v=<strong>VIDEO_ID</strong></p>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
}

// FAQ Form Component
function FaqForm({
  faq,
  onSave,
  onCancel
}: {
  faq: Partial<FaqData>,
  onSave: (faq: any) => void,
  onCancel: () => void
}) {
  const [question, setQuestion] = useState(faq.question || '');
  const [reponse, setReponse] = useState(faq.reponse || '');
  const [ordre, setOrdre] = useState(faq.ordre || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...faq, question, reponse, ordre });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg border border-gray-300">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Quelle est la question ?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Réponse</label>
        <textarea
          value={reponse}
          onChange={(e) => setReponse(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="La réponse à cette question..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ordre</label>
        <input
          type="number"
          value={ordre}
          onChange={(e) => setOrdre(parseInt(e.target.value))}
          required
          min="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          Sauvegarder
        </button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('homepage');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // États pour les données
  const [homepage, setHomepage] = useState<Partial<HomepageData>>({});
  const [citation, setCitation] = useState<Partial<CitationData>>({});
  const [observer, setObserver] = useState<Partial<DemarcheObserverData>>({});
  const [dessiner, setDessiner] = useState<Partial<DemarcheDessinerData>>({});
  const [realiser, setRealiser] = useState<Partial<DemarcheRealiserData>>({});
  const [accompagner, setAccompagner] = useState<Partial<DemarcheAccompagnerData>>({});
  const [portrait, setPortrait] = useState<Partial<PortraitData>>({});
  const [jardinImages, setJardinImages] = useState<JardinImageData[]>([]);
  const [temoignages, setTemoignages] = useState<TemoignageData[]>([]);
  const [faqs, setFaqs] = useState<FaqData[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);

  // États pour l'édition de FAQ
  const [editingFaq, setEditingFaq] = useState<FaqData | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  // États pour l'édition de Portfolio
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioData | null>(null);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [managingGallery, setManagingGallery] = useState<number | null>(null);

  // État pour le mode édition des autres sections
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (user) loadData();
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadData();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Rediriger vers /login si pas connecté
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const loadData = async () => {
    try {
      // Charger Homepage
      const { data: homepageData } = await supabase.from('homepages').select('*').limit(1).single();
      if (homepageData) {
        setHomepage({
          heroSurtitre: homepageData.hero_surtitre || '',
          heroTitre: homepageData.hero_titre || '',
          heroDescription: homepageData.hero_description || '',
          heroCtaPrincipal: homepageData.hero_cta_principal || '',
          heroCtaSecondaire: homepageData.hero_cta_secondaire || '',
          heroVideoUrl: homepageData.hero_video_url || '',
        });
      }

      // Charger Citation
      const { data: citationData } = await supabase.from('citations').select('*').limit(1).single();
      if (citationData) {
        // Convertir le Rich Text en texte simple si c'est un objet
        let texte = citationData.texte;
        if (typeof texte === 'object' && Array.isArray(texte)) {
          // Rich Text de Strapi - convertir en texte simple
          texte = texte
            .map((block: any) => {
              if (block.children && Array.isArray(block.children)) {
                return block.children.map((child: any) => child.text || '').join('');
              }
              return '';
            })
            .join('\n')
            .trim();
        }

        setCitation({
          texte: texte || '',
          sousTexte: citationData.sousTexte || citationData.sous_texte || '',
          imageFondUrl: citationData.image_fond_url || '',
        });
      }

      // Charger Observer
      const { data: observerData } = await supabase.from('demarche_observers').select('*').limit(1).single();
      if (observerData) {
        setObserver({
          titre: observerData.titre || '',
          sousTitre: observerData.sous_titre || '',
          paragraphe1: observerData.paragraphe_1 || '',
          paragraphe2: observerData.paragraphe_2 || '',
          action1Titre: observerData.action_1_titre || '',
          action1Description: observerData.action_1_description || '',
          action2Titre: observerData.action_2_titre || '',
          action2Description: observerData.action_2_description || '',
          action3Titre: observerData.action_3_titre || '',
          action3Description: observerData.action_3_description || '',
          imageUrl: observerData.image_url || '',
        });
      }

      // Charger Dessiner
      const { data: dessinerData } = await supabase.from('demarche_dessiners').select('*').limit(1).single();
      if (dessinerData) {
        setDessiner({
          titre: dessinerData.titre || '',
          sousTitre: dessinerData.sousTitre || dessinerData.sous_titre || '',
          citation: dessinerData.citation || '',
          paragraphe: dessinerData.paragraphe || '',
          aspect1Titre: dessinerData.aspect_1_titre || '',
          aspect1Detail: dessinerData.aspect_1_detail || '',
          aspect2Titre: dessinerData.aspect_2_titre || '',
          aspect2Detail: dessinerData.aspect_2_detail || '',
          aspect3Titre: dessinerData.aspect_3_titre || '',
          aspect3Detail: dessinerData.aspect_3_detail || '',
          aspect4Titre: dessinerData.aspect_4_titre || '',
          aspect4Detail: dessinerData.aspect_4_detail || '',
          imageUrl: dessinerData.image_url || '',
        });
      }

      // Charger Realiser
      const { data: realiserData } = await supabase.from('demarche_realisers').select('*').limit(1).single();
      if (realiserData) {
        setRealiser({
          titre: realiserData.titre || '',
          sousTitre: realiserData.sous_titre || '',
          paragraphe1: realiserData.paragraphe_1 || '',
          paragraphe2: realiserData.paragraphe_2 || '',
          citation: realiserData.citation || '',
          action1Titre: realiserData.action_1_titre || '',
          action1Description: realiserData.action_1_description || '',
          action2Titre: realiserData.action_2_titre || '',
          action2Description: realiserData.action_2_description || '',
          action3Titre: realiserData.action_3_titre || '',
          action3Description: realiserData.action_3_description || '',
          imageUrl: realiserData.image_url || '',
        });
      }

      // Charger Accompagner
      const { data: accompagnerData } = await supabase.from('demarche_accompagners').select('*').limit(1).single();
      if (accompagnerData) {
        setAccompagner({
          titre: accompagnerData.titre || '',
          paragraphe1: accompagnerData.paragraphe_1 || '',
          paragraphe2: accompagnerData.paragraphe_2 || '',
          offre1Titre: accompagnerData.offre_1_titre || '',
          offre1Rythme: accompagnerData.offre_1_rythme || '',
          offre1Description: accompagnerData.offre_1_description || '',
          offre2Titre: accompagnerData.offre_2_titre || '',
          offre2Rythme: accompagnerData.offre_2_rythme || '',
          offre2Description: accompagnerData.offre_2_description || '',
          offre3Titre: accompagnerData.offre_3_titre || '',
          offre3Rythme: accompagnerData.offre_3_rythme || '',
          offre3Description: accompagnerData.offre_3_description || '',
          offre4Titre: accompagnerData.offre_4_titre || '',
          offre4Rythme: accompagnerData.offre_4_rythme || '',
          offre4Description: accompagnerData.offre_4_description || '',
          imageUrl: accompagnerData.image_url || '',
        });
      }

      // Charger Portrait
      const { data: portraitData } = await supabase.from('portraits').select('*').limit(1).single();
      if (portraitData) {
        setPortrait({
          surtitre: portraitData.surtitre || '',
          titreLigne1: portraitData.titre_ligne_1 || '',
          titreLigne2: portraitData.titre_ligne_2 || '',
          paragraphe1: portraitData.paragraphe_1 || '',
          paragraphe2: portraitData.paragraphe_2 || '',
          paragraphe3: portraitData.paragraphe_3 || '',
          image1Url: portraitData.image_1_url || '',
          image2Url: portraitData.image_2_url || '',
          image3Url: portraitData.image_3_url || '',
        });
      }

      // Charger Jardin Images
      const { data: jardinData } = await supabase.from('jardin_images').select('*').order('ordre', { ascending: true });
      if (jardinData) {
        setJardinImages(jardinData.map(img => ({
          id: img.id,
          imageUrl: img.image_url || '',
          altText: img.alt_text || null,
          linkUrl: img.link_url || null,
          ordre: img.ordre || 0,
        })));
      }

      // Charger Témoignages (tous, même cachés pour l'admin)
      const { data: temoignagesData } = await supabase.from('temoignages').select('*').order('ordre', { ascending: true });
      if (temoignagesData) {
        setTemoignages(temoignagesData.map(t => ({
          id: t.id,
          nom: t.nom || '',
          lieu: t.lieu || '',
          date: t.date || '',
          note: t.note || 5,
          avis: t.avis || '',
          ordre: t.ordre || 0,
          visible: t.visible !== false,
        })));
      }

      // Charger FAQs
      const { data: faqsData } = await supabase.from('faqs').select('*').order('ordre', { ascending: true });
      if (faqsData) {
        setFaqs(faqsData);
      }

      // Charger Portfolios avec leurs slides
      const { data: portfoliosData } = await supabase.from('portfolios').select('*').order('ordre', { ascending: true });
      if (portfoliosData) {
        const portfoliosWithSlides = await Promise.all(
          portfoliosData.map(async (portfolio) => {
            const { data: slidesData } = await supabase
              .from('portfolio_slides')
              .select('*')
              .eq('portfolio_id', portfolio.id)
              .order('ordre', { ascending: true });

            return {
              id: portfolio.id,
              slug: portfolio.slug,
              titre: portfolio.titre,
              chantierNumero: portfolio.chantier_numero,
              lieu: portfolio.lieu,
              typeProjet: portfolio.type_projet,
              annee: portfolio.annee,
              surface: portfolio.surface,
              imagePrincipale: portfolio.image_principale,
              description: portfolio.description,
              tags: portfolio.tags || [],
              ordre: portfolio.ordre,
              slides: slidesData || []
            };
          })
        );
        setPortfolios(portfoliosWithSlides);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleEdit = () => {
    // Sauvegarder l'état actuel pour pouvoir annuler
    setOriginalData({
      homepage: { ...homepage },
      citation: { ...citation },
      observer: { ...observer },
      dessiner: { ...dessiner },
      realiser: { ...realiser },
      accompagner: { ...accompagner },
      portrait: { ...portrait },
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Restaurer les données originales
    if (originalData) {
      setHomepage(originalData.homepage);
      setCitation(originalData.citation);
      setObserver(originalData.observer);
      setDessiner(originalData.dessiner);
      setRealiser(originalData.realiser);
      setAccompagner(originalData.accompagner);
      setPortrait(originalData.portrait);
    }
    setIsEditing(false);
    setOriginalData(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      if (activeSection === 'homepage') {
        const { error } = await supabase
          .from('homepages')
          .update({
            hero_surtitre: homepage.heroSurtitre,
            hero_titre: homepage.heroTitre,
            hero_description: homepage.heroDescription,
            hero_cta_principal: homepage.heroCtaPrincipal,
            hero_cta_secondaire: homepage.heroCtaSecondaire,
            hero_video_url: homepage.heroVideoUrl,
          })
          .eq('id', (await supabase.from('homepages').select('id').limit(1).single()).data?.id);

        if (error) throw error;
      } else if (activeSection === 'citation') {
        const { error } = await supabase
          .from('citations')
          .update({
            texte: citation.texte,
            sous_texte: citation.sousTexte,
            image_fond_url: citation.imageFondUrl,
          })
          .eq('id', (await supabase.from('citations').select('id').limit(1).single()).data?.id);

        if (error) throw error;
      } else if (activeSection === 'observer') {
        const { error } = await supabase
          .from('demarche_observers')
          .update({
            titre: observer.titre,
            sous_titre: observer.sousTitre,
            paragraphe_1: observer.paragraphe1,
            paragraphe_2: observer.paragraphe2,
            action_1_titre: observer.action1Titre,
            action_1_description: observer.action1Description,
            action_2_titre: observer.action2Titre,
            action_2_description: observer.action2Description,
            action_3_titre: observer.action3Titre,
            action_3_description: observer.action3Description,
            image_url: observer.imageUrl,
          })
          .eq('id', (await supabase.from('demarche_observers').select('id').limit(1).single()).data?.id);

        if (error) throw error;
      } else if (activeSection === 'dessiner') {
        const { error } = await supabase
          .from('demarche_dessiners')
          .update({
            titre: dessiner.titre,
            sous_titre: dessiner.sousTitre,
            citation: dessiner.citation,
            paragraphe: dessiner.paragraphe,
            aspect_1_titre: dessiner.aspect1Titre,
            aspect_1_detail: dessiner.aspect1Detail,
            aspect_2_titre: dessiner.aspect2Titre,
            aspect_2_detail: dessiner.aspect2Detail,
            aspect_3_titre: dessiner.aspect3Titre,
            aspect_3_detail: dessiner.aspect3Detail,
            aspect_4_titre: dessiner.aspect4Titre,
            aspect_4_detail: dessiner.aspect4Detail,
            image_url: dessiner.imageUrl,
          })
          .eq('id', (await supabase.from('demarche_dessiners').select('id').limit(1).single()).data?.id);

        if (error) throw error;
      } else if (activeSection === 'realiser') {
        const { error } = await supabase
          .from('demarche_realisers')
          .update({
            titre: realiser.titre,
            sous_titre: realiser.sousTitre,
            paragraphe_1: realiser.paragraphe1,
            paragraphe_2: realiser.paragraphe2,
            citation: realiser.citation,
            action_1_titre: realiser.action1Titre,
            action_1_description: realiser.action1Description,
            action_2_titre: realiser.action2Titre,
            action_2_description: realiser.action2Description,
            action_3_titre: realiser.action3Titre,
            action_3_description: realiser.action3Description,
            image_url: realiser.imageUrl,
          })
          .eq('id', (await supabase.from('demarche_realisers').select('id').limit(1).single()).data?.id);

        if (error) throw error;
      } else if (activeSection === 'accompagner') {
        const { error } = await supabase
          .from('demarche_accompagners')
          .update({
            titre: accompagner.titre,
            paragraphe_1: accompagner.paragraphe1,
            paragraphe_2: accompagner.paragraphe2,
            offre_1_titre: accompagner.offre1Titre,
            offre_1_rythme: accompagner.offre1Rythme,
            offre_1_description: accompagner.offre1Description,
            offre_2_titre: accompagner.offre2Titre,
            offre_2_rythme: accompagner.offre2Rythme,
            offre_2_description: accompagner.offre2Description,
            offre_3_titre: accompagner.offre3Titre,
            offre_3_rythme: accompagner.offre3Rythme,
            offre_3_description: accompagner.offre3Description,
            offre_4_titre: accompagner.offre4Titre,
            offre_4_rythme: accompagner.offre4Rythme,
            offre_4_description: accompagner.offre4Description,
            image_url: accompagner.imageUrl,
          })
          .eq('id', (await supabase.from('demarche_accompagners').select('id').limit(1).single()).data?.id);

        if (error) throw error;
      } else if (activeSection === 'portrait') {
        const { error } = await supabase
          .from('portraits')
          .update({
            surtitre: portrait.surtitre,
            titre_ligne_1: portrait.titreLigne1,
            titre_ligne_2: portrait.titreLigne2,
            paragraphe_1: portrait.paragraphe1,
            paragraphe_2: portrait.paragraphe2,
            paragraphe_3: portrait.paragraphe3,
            image_1_url: portrait.image1Url,
            image_2_url: portrait.image2Url,
            image_3_url: portrait.image3Url,
          })
          .eq('id', (await supabase.from('portraits').select('id').limit(1).single()).data?.id);

        if (error) throw error;
      }

      setSaveMessage('✓ Sauvegardé avec succès !');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    } finally {
      setSaving(false);
      setIsEditing(false);
      setOriginalData(null);
    }
  };

  // FAQ handlers
  const handleAddFaq = async (faq: Omit<FaqData, 'id'>) => {
    try {
      const { error } = await supabase.from('faqs').insert({
        question: faq.question,
        reponse: faq.reponse,
        ordre: faq.ordre,
      });

      if (error) throw error;

      // Recharger les FAQs
      await loadData();
      setIsAddingFaq(false);
      setSaveMessage('✓ FAQ ajoutée avec succès !');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  const handleUpdateFaq = async (faq: FaqData) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({
          question: faq.question,
          reponse: faq.reponse,
          ordre: faq.ordre,
        })
        .eq('id', faq.id);

      if (error) throw error;

      // Recharger les FAQs
      await loadData();
      setEditingFaq(null);
      setSaveMessage('✓ FAQ mise à jour avec succès !');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette FAQ ?')) return;

    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);

      if (error) throw error;

      // Recharger les FAQs
      await loadData();
      setSaveMessage('✓ FAQ supprimée avec succès !');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  const handleMoveFaq = async (faqId: number, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex(f => f.id === faqId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;

    try {
      // Swap ordre values
      const currentFaq = faqs[currentIndex];
      const targetFaq = faqs[newIndex];

      const { error: error1 } = await supabase
        .from('faqs')
        .update({ ordre: targetFaq.ordre })
        .eq('id', currentFaq.id);

      const { error: error2 } = await supabase
        .from('faqs')
        .update({ ordre: currentFaq.ordre })
        .eq('id', targetFaq.id);

      if (error1 || error2) throw error1 || error2;

      // Recharger les FAQs
      await loadData();
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  // Portfolio handlers
  const handleAddPortfolio = async (portfolio: Omit<PortfolioData, 'id' | 'slides'>) => {
    try {
      const { data: newPortfolio, error } = await supabase.from('portfolios').insert({
        slug: portfolio.slug,
        titre: portfolio.titre,
        chantier_numero: portfolio.chantierNumero,
        lieu: portfolio.lieu,
        type_projet: portfolio.typeProjet,
        annee: portfolio.annee,
        surface: portfolio.surface,
        image_principale: portfolio.imagePrincipale,
        description: portfolio.description,
        tags: portfolio.tags,
        ordre: portfolio.ordre,
      }).select().single();

      if (error) throw error;

      await loadData();
      setIsAddingPortfolio(false);
      setSaveMessage('✓ Projet ajouté avec succès !');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  const handleUpdatePortfolio = async (portfolio: PortfolioData) => {
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({
          slug: portfolio.slug,
          titre: portfolio.titre,
          chantier_numero: portfolio.chantierNumero,
          lieu: portfolio.lieu,
          type_projet: portfolio.typeProjet,
          annee: portfolio.annee,
          surface: portfolio.surface,
          image_principale: portfolio.imagePrincipale,
          description: portfolio.description,
          tags: portfolio.tags,
          ordre: portfolio.ordre,
        })
        .eq('id', portfolio.id);

      if (error) throw error;

      await loadData();
      setEditingPortfolio(null);
      setSaveMessage('✓ Projet mis à jour avec succès !');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Toutes les images/vidéos seront également supprimées.')) return;

    try {
      const { error } = await supabase.from('portfolios').delete().eq('id', id);

      if (error) throw error;

      await loadData();
      setSaveMessage('✓ Projet supprimé avec succès !');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  const handleMovePortfolio = async (portfolioId: number, direction: 'up' | 'down') => {
    const currentIndex = portfolios.findIndex(p => p.id === portfolioId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= portfolios.length) return;

    try {
      const currentPortfolio = portfolios[currentIndex];
      const targetPortfolio = portfolios[newIndex];

      const { error: error1 } = await supabase
        .from('portfolios')
        .update({ ordre: targetPortfolio.ordre })
        .eq('id', currentPortfolio.id);

      const { error: error2 } = await supabase
        .from('portfolios')
        .update({ ordre: currentPortfolio.ordre })
        .eq('id', targetPortfolio.id);

      if (error1 || error2) throw error1 || error2;

      await loadData();
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  // Gallery/Slides handlers
  const handleAddSlide = async (portfolioId: number, slide: Omit<PortfolioSlideData, 'id' | 'portfolio_id'>) => {
    try {
      const { error } = await supabase.from('portfolio_slides').insert({
        portfolio_id: portfolioId,
        type: slide.type,
        src: slide.src,
        video_id: slide.video_id,
        ordre: slide.ordre,
      });

      if (error) throw error;

      await loadData();
      setSaveMessage('✓ Slide ajoutée avec succès !');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  const handleDeleteSlide = async (slideId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette slide ?')) return;

    try {
      const { error } = await supabase.from('portfolio_slides').delete().eq('id', slideId);

      if (error) throw error;

      await loadData();
      setSaveMessage('✓ Slide supprimée avec succès !');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  const handleMoveSlide = async (portfolioId: number, slideId: number, direction: 'up' | 'down') => {
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (!portfolio || !portfolio.slides) return;

    const currentIndex = portfolio.slides.findIndex(s => s.id === slideId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= portfolio.slides.length) return;

    try {
      const currentSlide = portfolio.slides[currentIndex];
      const targetSlide = portfolio.slides[newIndex];

      const { error: error1 } = await supabase
        .from('portfolio_slides')
        .update({ ordre: targetSlide.ordre })
        .eq('id', currentSlide.id);

      const { error: error2 } = await supabase
        .from('portfolio_slides')
        .update({ ordre: currentSlide.ordre })
        .eq('id', targetSlide.id);

      if (error1 || error2) throw error1 || error2;

      await loadData();
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;  // Afficher rien pendant la redirection
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Atelier Desnoyers</h1>
            <p className="text-sm text-gray-500">Gestion du contenu</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-2 border-t border-gray-100">
          <button
            onClick={() => setActiveSection('homepage')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'homepage'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Homepage
          </button>
          <button
            onClick={() => setActiveSection('portfolio')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'portfolio'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveSection('citation')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'citation'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Citation
          </button>
          <button
            onClick={() => setActiveSection('observer')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'observer'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Observer
          </button>
          <button
            onClick={() => setActiveSection('dessiner')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'dessiner'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Dessiner
          </button>
          <button
            onClick={() => setActiveSection('realiser')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'realiser'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Réaliser
          </button>
          <button
            onClick={() => setActiveSection('accompagner')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'accompagner'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Accompagner
          </button>
          <button
            onClick={() => setActiveSection('portrait')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'portrait'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Portrait
          </button>
          <button
            onClick={() => setActiveSection('faq')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'faq'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveSection('articles')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'articles'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setActiveSection('jardin')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'jardin'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Jardin
          </button>
          <button
            onClick={() => setActiveSection('temoignages')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'temoignages'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Témoignages
          </button>
          <button
            onClick={() => setActiveSection('galerie')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              activeSection === 'galerie'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Galerie
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Edit/Save Buttons */}
          {activeSection !== 'faq' && activeSection !== 'portfolio' && activeSection !== 'galerie' && activeSection !== 'articles' && activeSection !== 'jardin' && activeSection !== 'temoignages' && (
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {activeSection === 'homepage' && 'Page d\'accueil - Hero Section'}
                {activeSection === 'citation' && 'Citation'}
                {activeSection === 'observer' && 'Démarche - Observer'}
                {activeSection === 'dessiner' && 'Démarche - Dessiner'}
                {activeSection === 'realiser' && 'Démarche - Réaliser'}
                {activeSection === 'accompagner' && 'Démarche - Accompagner'}
                {activeSection === 'portrait' && 'Portrait'}
              </h2>
              <div className="flex gap-3 items-center">
                {saveMessage && (
                  <span className={`text-sm ${saveMessage.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                    {saveMessage}
                  </span>
                )}
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Modifier
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                    >
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Homepage Form */}
          {activeSection === 'homepage' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Surtitre</label>
                <input
                  type="text"
                  value={homepage.heroSurtitre || ''}
                  onChange={(e) => setHomepage({ ...homepage, heroSurtitre: e.target.value })}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Jardinier · Designer — Lyon & Rhône-Alpes Auvergne"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={homepage.heroTitre || ''}
                  onChange={(e) => setHomepage({ ...homepage, heroTitre: e.target.value })}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Des jardins comme des tableaux vivants"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={homepage.heroDescription || ''}
                  onChange={(e) => setHomepage({ ...homepage, heroDescription: e.target.value })}
                  readOnly={!isEditing}
                  rows={4}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Je conçois des jardins naturalistes et les entretiens au fil du temps..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bouton principal</label>
                  <input
                    type="text"
                    value={homepage.heroCtaPrincipal || ''}
                    onChange={(e) => setHomepage({ ...homepage, heroCtaPrincipal: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="Projet de jardin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bouton secondaire</label>
                  <input
                    type="text"
                    value={homepage.heroCtaSecondaire || ''}
                    onChange={(e) => setHomepage({ ...homepage, heroCtaSecondaire: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="La démarche"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vidéo de fond (URL YouTube embed)</label>
                <input
                  type="url"
                  value={homepage.heroVideoUrl || ''}
                  onChange={(e) => setHomepage({ ...homepage, heroVideoUrl: e.target.value })}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="https://www.youtube-nocookie.com/embed/..."
                />
                <p className="text-xs text-gray-500 mt-1">URL d'embed YouTube avec paramètres autoplay, mute, loop, etc.</p>
              </div>
            </div>
          )}

          {/* Citation Form */}
          {activeSection === 'citation' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texte de la citation</label>
                <textarea
                  value={citation.texte || ''}
                  onChange={(e) => setCitation({ ...citation, texte: e.target.value })}
                  readOnly={!isEditing}
                  rows={4}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Entre conception et soin..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sous-texte</label>
                <input
                  type="text"
                  value={citation.sousTexte || ''}
                  onChange={(e) => setCitation({ ...citation, sousTexte: e.target.value })}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="L'histoire d'un jardin ne s'arrête pas le jour où on le plante..."
                />
              </div>

              <div>
                <ImageUploader
                  currentImageUrl={citation.imageFondUrl || ''}
                  onImageUploaded={(url) => setCitation({ ...citation, imageFondUrl: url })}
                  label="Image de fond"
                  bucketName="portfolios"
                  disabled={!isEditing}
                />
                {isEditing && (
                  <div className="mt-2">
                    <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
                    <input
                      type="url"
                      value={citation.imageFondUrl || ''}
                      onChange={(e) => setCitation({ ...citation, imageFondUrl: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Observer Form */}
          {activeSection === 'observer' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={observer.titre || ''}
                    onChange={(e) => setObserver({ ...observer, titre: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={observer.sousTitre || ''}
                    onChange={(e) => setObserver({ ...observer, sousTitre: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 1</label>
                <textarea
                  value={observer.paragraphe1 || ''}
                  onChange={(e) => setObserver({ ...observer, paragraphe1: e.target.value })}
                  readOnly={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 2</label>
                <textarea
                  value={observer.paragraphe2 || ''}
                  onChange={(e) => setObserver({ ...observer, paragraphe2: e.target.value })}
                  readOnly={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Actions</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 1 - Titre</label>
                      <input
                        type="text"
                        value={observer.action1Titre || ''}
                        onChange={(e) => setObserver({ ...observer, action1Titre: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 1 - Description</label>
                      <input
                        type="text"
                        value={observer.action1Description || ''}
                        onChange={(e) => setObserver({ ...observer, action1Description: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 2 - Titre</label>
                      <input
                        type="text"
                        value={observer.action2Titre || ''}
                        onChange={(e) => setObserver({ ...observer, action2Titre: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 2 - Description</label>
                      <input
                        type="text"
                        value={observer.action2Description || ''}
                        onChange={(e) => setObserver({ ...observer, action2Description: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 3 - Titre</label>
                      <input
                        type="text"
                        value={observer.action3Titre || ''}
                        onChange={(e) => setObserver({ ...observer, action3Titre: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 3 - Description</label>
                      <input
                        type="text"
                        value={observer.action3Description || ''}
                        onChange={(e) => setObserver({ ...observer, action3Description: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploader
                      currentImageUrl={observer.imageUrl || ''}
                      onImageUploaded={(url) => setObserver({ ...observer, imageUrl: url })}
                      label="Image de la section"
                      bucketName="portfolios"
                      disabled={!isEditing}
                    />
                    {isEditing && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
                        <input
                          type="url"
                          value={observer.imageUrl || ''}
                          onChange={(e) => setObserver({ ...observer, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dessiner Form */}
          {activeSection === 'dessiner' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={dessiner.titre || ''}
                    onChange={(e) => setDessiner({ ...dessiner, titre: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={dessiner.sousTitre || ''}
                    onChange={(e) => setDessiner({ ...dessiner, sousTitre: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Citation</label>
                <textarea
                  value={dessiner.citation || ''}
                  onChange={(e) => setDessiner({ ...dessiner, citation: e.target.value })}
                  readOnly={!isEditing}
                  rows={2}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe</label>
                <textarea
                  value={dessiner.paragraphe || ''}
                  onChange={(e) => setDessiner({ ...dessiner, paragraphe: e.target.value })}
                  readOnly={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Aspects</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 1 - Titre</label>
                      <input
                        type="text"
                        value={dessiner.aspect1Titre || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect1Titre: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 1 - Détail</label>
                      <input
                        type="text"
                        value={dessiner.aspect1Detail || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect1Detail: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 2 - Titre</label>
                      <input
                        type="text"
                        value={dessiner.aspect2Titre || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect2Titre: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 2 - Détail</label>
                      <input
                        type="text"
                        value={dessiner.aspect2Detail || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect2Detail: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 3 - Titre</label>
                      <input
                        type="text"
                        value={dessiner.aspect3Titre || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect3Titre: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 3 - Détail</label>
                      <input
                        type="text"
                        value={dessiner.aspect3Detail || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect3Detail: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 4 - Titre</label>
                      <input
                        type="text"
                        value={dessiner.aspect4Titre || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect4Titre: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 4 - Détail</label>
                      <input
                        type="text"
                        value={dessiner.aspect4Detail || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect4Detail: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploader
                      currentImageUrl={dessiner.imageUrl || ''}
                      onImageUploaded={(url) => setDessiner({ ...dessiner, imageUrl: url })}
                      label="Image de la section"
                      bucketName="portfolios"
                      disabled={!isEditing}
                    />
                    {isEditing && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
                        <input
                          type="url"
                          value={dessiner.imageUrl || ''}
                          onChange={(e) => setDessiner({ ...dessiner, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Realiser Form */}
          {activeSection === 'realiser' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={realiser.titre || ''}
                    onChange={(e) => setRealiser({ ...realiser, titre: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={realiser.sousTitre || ''}
                    onChange={(e) => setRealiser({ ...realiser, sousTitre: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 1</label>
                <textarea
                  value={realiser.paragraphe1 || ''}
                  onChange={(e) => setRealiser({ ...realiser, paragraphe1: e.target.value })}
                  readOnly={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 2</label>
                <textarea
                  value={realiser.paragraphe2 || ''}
                  onChange={(e) => setRealiser({ ...realiser, paragraphe2: e.target.value })}
                  readOnly={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Citation</label>
                <textarea
                  value={realiser.citation || ''}
                  onChange={(e) => setRealiser({ ...realiser, citation: e.target.value })}
                  readOnly={!isEditing}
                  rows={2}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Actions</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 1 - Titre</label>
                      <input
                        type="text"
                        value={realiser.action1Titre || ''}
                        onChange={(e) => setRealiser({ ...realiser, action1Titre: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 1 - Description</label>
                      <input
                        type="text"
                        value={realiser.action1Description || ''}
                        onChange={(e) => setRealiser({ ...realiser, action1Description: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 2 - Titre</label>
                      <input
                        type="text"
                        value={realiser.action2Titre || ''}
                        onChange={(e) => setRealiser({ ...realiser, action2Titre: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 2 - Description</label>
                      <input
                        type="text"
                        value={realiser.action2Description || ''}
                        onChange={(e) => setRealiser({ ...realiser, action2Description: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 3 - Titre</label>
                      <input
                        type="text"
                        value={realiser.action3Titre || ''}
                        onChange={(e) => setRealiser({ ...realiser, action3Titre: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 3 - Description</label>
                      <input
                        type="text"
                        value={realiser.action3Description || ''}
                        onChange={(e) => setRealiser({ ...realiser, action3Description: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploader
                      currentImageUrl={realiser.imageUrl || ''}
                      onImageUploaded={(url) => setRealiser({ ...realiser, imageUrl: url })}
                      label="Image de la section"
                      bucketName="portfolios"
                      disabled={!isEditing}
                    />
                    {isEditing && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
                        <input
                          type="url"
                          value={realiser.imageUrl || ''}
                          onChange={(e) => setRealiser({ ...realiser, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accompagner Form */}
          {activeSection === 'accompagner' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={accompagner.titre || ''}
                  onChange={(e) => setAccompagner({ ...accompagner, titre: e.target.value })}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 1</label>
                <textarea
                  value={accompagner.paragraphe1 || ''}
                  onChange={(e) => setAccompagner({ ...accompagner, paragraphe1: e.target.value })}
                  readOnly={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 2</label>
                <textarea
                  value={accompagner.paragraphe2 || ''}
                  onChange={(e) => setAccompagner({ ...accompagner, paragraphe2: e.target.value })}
                  readOnly={!isEditing}
                  rows={2}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Offres d'entretien</h3>

                <div className="space-y-6">
                  {/* Offre 1 */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Offre 1</h4>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                        <input
                          type="text"
                          value={accompagner.offre1Titre || ''}
                          onChange={(e) => setAccompagner({ ...accompagner, offre1Titre: e.target.value })}
                          readOnly={!isEditing}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rythme</label>
                        <input
                          type="text"
                          value={accompagner.offre1Rythme || ''}
                          onChange={(e) => setAccompagner({ ...accompagner, offre1Rythme: e.target.value })}
                          readOnly={!isEditing}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={accompagner.offre1Description || ''}
                        onChange={(e) => setAccompagner({ ...accompagner, offre1Description: e.target.value })}
                        readOnly={!isEditing}
                        rows={2}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Offre 2 */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Offre 2</h4>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                        <input
                          type="text"
                          value={accompagner.offre2Titre || ''}
                          onChange={(e) => setAccompagner({ ...accompagner, offre2Titre: e.target.value })}
                          readOnly={!isEditing}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rythme</label>
                        <input
                          type="text"
                          value={accompagner.offre2Rythme || ''}
                          onChange={(e) => setAccompagner({ ...accompagner, offre2Rythme: e.target.value })}
                          readOnly={!isEditing}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={accompagner.offre2Description || ''}
                        onChange={(e) => setAccompagner({ ...accompagner, offre2Description: e.target.value })}
                        readOnly={!isEditing}
                        rows={2}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Offre 3 */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Offre 3</h4>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                        <input
                          type="text"
                          value={accompagner.offre3Titre || ''}
                          onChange={(e) => setAccompagner({ ...accompagner, offre3Titre: e.target.value })}
                          readOnly={!isEditing}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rythme</label>
                        <input
                          type="text"
                          value={accompagner.offre3Rythme || ''}
                          onChange={(e) => setAccompagner({ ...accompagner, offre3Rythme: e.target.value })}
                          readOnly={!isEditing}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={accompagner.offre3Description || ''}
                        onChange={(e) => setAccompagner({ ...accompagner, offre3Description: e.target.value })}
                        readOnly={!isEditing}
                        rows={2}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Offre 4 */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Offre 4</h4>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                        <input
                          type="text"
                          value={accompagner.offre4Titre || ''}
                          onChange={(e) => setAccompagner({ ...accompagner, offre4Titre: e.target.value })}
                          readOnly={!isEditing}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rythme</label>
                        <input
                          type="text"
                          value={accompagner.offre4Rythme || ''}
                          onChange={(e) => setAccompagner({ ...accompagner, offre4Rythme: e.target.value })}
                          readOnly={!isEditing}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={accompagner.offre4Description || ''}
                        onChange={(e) => setAccompagner({ ...accompagner, offre4Description: e.target.value })}
                        readOnly={!isEditing}
                        rows={2}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploader
                      currentImageUrl={accompagner.imageUrl || ''}
                      onImageUploaded={(url) => setAccompagner({ ...accompagner, imageUrl: url })}
                      label="Image de la section"
                      bucketName="portfolios"
                      disabled={!isEditing}
                    />
                    {isEditing && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
                        <input
                          type="url"
                          value={accompagner.imageUrl || ''}
                          onChange={(e) => setAccompagner({ ...accompagner, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portrait Form */}
          {activeSection === 'portrait' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Surtitre</label>
                <input
                  type="text"
                  value={portrait.surtitre || ''}
                  onChange={(e) => setPortrait({ ...portrait, surtitre: e.target.value })}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre - Ligne 1</label>
                  <input
                    type="text"
                    value={portrait.titreLigne1 || ''}
                    onChange={(e) => setPortrait({ ...portrait, titreLigne1: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre - Ligne 2</label>
                  <input
                    type="text"
                    value={portrait.titreLigne2 || ''}
                    onChange={(e) => setPortrait({ ...portrait, titreLigne2: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 1</label>
                <textarea
                  value={portrait.paragraphe1 || ''}
                  onChange={(e) => setPortrait({ ...portrait, paragraphe1: e.target.value })}
                  readOnly={!isEditing}
                  rows={4}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 2</label>
                <textarea
                  value={portrait.paragraphe2 || ''}
                  onChange={(e) => setPortrait({ ...portrait, paragraphe2: e.target.value })}
                  readOnly={!isEditing}
                  rows={4}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 3</label>
                <textarea
                  value={portrait.paragraphe3 || ''}
                  onChange={(e) => setPortrait({ ...portrait, paragraphe3: e.target.value })}
                  readOnly={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="space-y-6 border-t pt-6">
                <h3 className="text-md font-semibold text-gray-800">Images du portrait</h3>

                <div>
                  <ImageUploader
                    currentImageUrl={portrait.image1Url || ''}
                    onImageUploaded={(url) => setPortrait({ ...portrait, image1Url: url })}
                    label="Image 1 (paragraphe 1 - droite)"
                    bucketName="portfolios"
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <div className="mt-2">
                      <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
                      <input
                        type="url"
                        value={portrait.image1Url || ''}
                        onChange={(e) => setPortrait({ ...portrait, image1Url: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </div>

                <div>
                  <ImageUploader
                    currentImageUrl={portrait.image2Url || ''}
                    onImageUploaded={(url) => setPortrait({ ...portrait, image2Url: url })}
                    label="Image 2 (paragraphe 2 - gauche)"
                    bucketName="portfolios"
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <div className="mt-2">
                      <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
                      <input
                        type="url"
                        value={portrait.image2Url || ''}
                        onChange={(e) => setPortrait({ ...portrait, image2Url: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </div>

                <div>
                  <ImageUploader
                    currentImageUrl={portrait.image3Url || ''}
                    onImageUploaded={(url) => setPortrait({ ...portrait, image3Url: url })}
                    label="Image 3 (paragraphe 3 - droite)"
                    bucketName="portfolios"
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <div className="mt-2">
                      <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
                      <input
                        type="url"
                        value={portrait.image3Url || ''}
                        onChange={(e) => setPortrait({ ...portrait, image3Url: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Jardin Management */}
          {activeSection === 'jardin' && (
            <JardinManager images={jardinImages} onUpdate={loadData} />
          )}

          {/* Temoignages Management */}
          {activeSection === 'temoignages' && (
            <TemoignagesManager temoignages={temoignages} onUpdate={loadData} />
          )}

          {/* FAQ Management */}
          {activeSection === 'faq' && (
            <FaqManager faqs={faqs} onReload={loadData} />
          )}

          {/* Portfolio Management */}
          {activeSection === 'portfolio' && (
            <PortfolioManager portfolios={portfolios} onReload={loadData} />
          )}

          {/* Articles Management */}
          {activeSection === 'articles' && (
            <ArticleManager onReload={loadData} />
          )}

          {/* FAQ save messages */}
          {activeSection === 'faq' && saveMessage && (
            <div className="mt-4">
              <span className={`text-sm ${saveMessage.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage}
              </span>
            </div>
          )}

          {/* Portfolio save messages */}
          {activeSection === 'portfolio' && saveMessage && (
            <div className="mt-4">
              <span className={`text-sm ${saveMessage.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage}
              </span>
            </div>
          )}

          {/* Galerie Section */}
          {activeSection === 'galerie' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Galerie d'images</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Gérez toutes les images uploadées dans le bucket Supabase
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-6 space-y-2">
                  <p className="text-sm text-gray-600">
                    Cette galerie affiche toutes les images stockées dans votre bucket Supabase.
                  </p>
                  <p className="text-sm text-gray-600">
                    Pour uploader de nouvelles images, utilisez les formulaires dans l'onglet <strong>Portfolio</strong>.
                  </p>
                </div>
                <ImageGallery bucketName="portfolios" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
