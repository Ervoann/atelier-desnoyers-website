import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { HomepageData, CitationData, DemarcheObserverData, DemarcheDessinerData, DemarcheRealiserData } from '../hooks/useSupabaseData';

type Section = 'homepage' | 'citation' | 'observer' | 'dessiner' | 'realiser';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('homepage');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // États pour les données
  const [homepage, setHomepage] = useState<Partial<HomepageData>>({});
  const [citation, setCitation] = useState<Partial<CitationData>>({});
  const [observer, setObserver] = useState<Partial<DemarcheObserverData>>({});
  const [dessiner, setDessiner] = useState<Partial<DemarcheDessinerData>>({});
  const [realiser, setRealiser] = useState<Partial<DemarcheRealiserData>>({});

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
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
          })
          .eq('id', (await supabase.from('homepages').select('id').limit(1).single()).data?.id);

        if (error) throw error;
      } else if (activeSection === 'citation') {
        const { error } = await supabase
          .from('citations')
          .update({
            texte: citation.texte,
            sous_texte: citation.sousTexte,
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
          })
          .eq('id', (await supabase.from('demarche_realisers').select('id').limit(1).single()).data?.id);

        if (error) throw error;
      }

      setSaveMessage('✓ Sauvegardé avec succès !');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('✗ Erreur: ' + err.message);
    } finally {
      setSaving(false);
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Atelier Desnoyers
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Panneau d'administration
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Homepage Form */}
          {activeSection === 'homepage' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Page d'accueil - Hero Section</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Surtitre</label>
                <input
                  type="text"
                  value={homepage.heroSurtitre || ''}
                  onChange={(e) => setHomepage({ ...homepage, heroSurtitre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Jardinier · Designer — Lyon & Rhône-Alpes Auvergne"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={homepage.heroTitre || ''}
                  onChange={(e) => setHomepage({ ...homepage, heroTitre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Des jardins comme des tableaux vivants"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={homepage.heroDescription || ''}
                  onChange={(e) => setHomepage({ ...homepage, heroDescription: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Projet de jardin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bouton secondaire</label>
                  <input
                    type="text"
                    value={homepage.heroCtaSecondaire || ''}
                    onChange={(e) => setHomepage({ ...homepage, heroCtaSecondaire: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="La démarche"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Citation Form */}
          {activeSection === 'citation' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Citation</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texte de la citation</label>
                <textarea
                  value={citation.texte || ''}
                  onChange={(e) => setCitation({ ...citation, texte: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Entre conception et soin..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sous-texte</label>
                <input
                  type="text"
                  value={citation.sousTexte || ''}
                  onChange={(e) => setCitation({ ...citation, sousTexte: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="L'histoire d'un jardin ne s'arrête pas le jour où on le plante..."
                />
              </div>
            </div>
          )}

          {/* Observer Form */}
          {activeSection === 'observer' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Démarche - Observer</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={observer.titre || ''}
                    onChange={(e) => setObserver({ ...observer, titre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={observer.sousTitre || ''}
                    onChange={(e) => setObserver({ ...observer, sousTitre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 1</label>
                <textarea
                  value={observer.paragraphe1 || ''}
                  onChange={(e) => setObserver({ ...observer, paragraphe1: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 2</label>
                <textarea
                  value={observer.paragraphe2 || ''}
                  onChange={(e) => setObserver({ ...observer, paragraphe2: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 1 - Description</label>
                      <input
                        type="text"
                        value={observer.action1Description || ''}
                        onChange={(e) => setObserver({ ...observer, action1Description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 2 - Description</label>
                      <input
                        type="text"
                        value={observer.action2Description || ''}
                        onChange={(e) => setObserver({ ...observer, action2Description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 3 - Description</label>
                      <input
                        type="text"
                        value={observer.action3Description || ''}
                        onChange={(e) => setObserver({ ...observer, action3Description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dessiner Form */}
          {activeSection === 'dessiner' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Démarche - Dessiner</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={dessiner.titre || ''}
                    onChange={(e) => setDessiner({ ...dessiner, titre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={dessiner.sousTitre || ''}
                    onChange={(e) => setDessiner({ ...dessiner, sousTitre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Citation</label>
                <textarea
                  value={dessiner.citation || ''}
                  onChange={(e) => setDessiner({ ...dessiner, citation: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe</label>
                <textarea
                  value={dessiner.paragraphe || ''}
                  onChange={(e) => setDessiner({ ...dessiner, paragraphe: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 1 - Détail</label>
                      <input
                        type="text"
                        value={dessiner.aspect1Detail || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect1Detail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 2 - Détail</label>
                      <input
                        type="text"
                        value={dessiner.aspect2Detail || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect2Detail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 3 - Détail</label>
                      <input
                        type="text"
                        value={dessiner.aspect3Detail || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect3Detail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aspect 4 - Détail</label>
                      <input
                        type="text"
                        value={dessiner.aspect4Detail || ''}
                        onChange={(e) => setDessiner({ ...dessiner, aspect4Detail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Realiser Form */}
          {activeSection === 'realiser' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Démarche - Réaliser</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={realiser.titre || ''}
                    onChange={(e) => setRealiser({ ...realiser, titre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={realiser.sousTitre || ''}
                    onChange={(e) => setRealiser({ ...realiser, sousTitre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 1</label>
                <textarea
                  value={realiser.paragraphe1 || ''}
                  onChange={(e) => setRealiser({ ...realiser, paragraphe1: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphe 2</label>
                <textarea
                  value={realiser.paragraphe2 || ''}
                  onChange={(e) => setRealiser({ ...realiser, paragraphe2: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Citation</label>
                <textarea
                  value={realiser.citation || ''}
                  onChange={(e) => setRealiser({ ...realiser, citation: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 1 - Description</label>
                      <input
                        type="text"
                        value={realiser.action1Description || ''}
                        onChange={(e) => setRealiser({ ...realiser, action1Description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 2 - Description</label>
                      <input
                        type="text"
                        value={realiser.action2Description || ''}
                        onChange={(e) => setRealiser({ ...realiser, action2Description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Action 3 - Description</label>
                      <input
                        type="text"
                        value={realiser.action3Description || ''}
                        onChange={(e) => setRealiser({ ...realiser, action3Description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div>
              {saveMessage && (
                <span className={`text-sm ${saveMessage.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                  {saveMessage}
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
