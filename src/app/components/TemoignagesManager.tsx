import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Grip, Trash2, Save, X, Eye, EyeOff, Star } from 'lucide-react';
import type { TemoignageData } from '../hooks/useSupabaseData';

interface TemoignagesManagerProps {
  temoignages: TemoignageData[];
  onUpdate: () => void;
}

export default function TemoignagesManager({ temoignages: initialTemoignages, onUpdate }: TemoignagesManagerProps) {
  const [temoignages, setTemoignages] = useState<TemoignageData[]>(initialTemoignages);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setTemoignages(initialTemoignages);
  }, [initialTemoignages]);

  const handleDragStart = (id: number) => {
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggingId === null || draggingId === targetId) return;

    const dragIndex = temoignages.findIndex(t => t.id === draggingId);
    const targetIndex = temoignages.findIndex(t => t.id === targetId);

    const newTemoignages = [...temoignages];
    const [draggedItem] = newTemoignages.splice(dragIndex, 1);
    newTemoignages.splice(targetIndex, 0, draggedItem);

    const updatedTemoignages = newTemoignages.map((t, index) => ({
      ...t,
      ordre: index + 1
    }));

    setTemoignages(updatedTemoignages);
  };

  const handleDragEnd = async () => {
    if (draggingId === null) return;

    setSaving(true);
    try {
      await Promise.all(
        temoignages.map(t =>
          supabase
            .from('temoignages')
            .update({ ordre: t.ordre })
            .eq('id', t.id)
        )
      );

      setMessage('✓ Ordre sauvegardé');
      setTimeout(() => setMessage(null), 2000);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'ordre:', err);
      setMessage('✗ Erreur de sauvegarde');
    } finally {
      setSaving(false);
      setDraggingId(null);
    }
  };

  const handleUpdate = (id: number, field: keyof TemoignageData, value: string | number | boolean) => {
    const updated = temoignages.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    );
    setTemoignages(updated);
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    const temoignage = temoignages.find(t => t.id === id);
    if (!temoignage) return;

    try {
      const { error } = await supabase
        .from('temoignages')
        .update({
          nom: temoignage.nom,
          lieu: temoignage.lieu,
          date: temoignage.date,
          note: temoignage.note,
          avis: temoignage.avis,
          visible: temoignage.visible
        })
        .eq('id', id);

      if (error) throw error;

      setMessage('✓ Sauvegardé');
      setTimeout(() => setMessage(null), 2000);
      setEditingId(null);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setMessage('✗ Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisible = async (id: number) => {
    const temoignage = temoignages.find(t => t.id === id);
    if (!temoignage) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('temoignages')
        .update({ visible: !temoignage.visible })
        .eq('id', id);

      if (error) throw error;

      setTemoignages(temoignages.map(t =>
        t.id === id ? { ...t, visible: !t.visible } : t
      ));
      setMessage(temoignage.visible ? '✓ Masqué' : '✓ Affiché');
      setTimeout(() => setMessage(null), 2000);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors du basculement:', err);
      setMessage('✗ Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce témoignage ?')) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('temoignages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemoignages(temoignages.filter(t => t.id !== id));
      setMessage('✓ Supprimé');
      setTimeout(() => setMessage(null), 2000);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setMessage('✗ Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      const maxOrdre = Math.max(...temoignages.map(t => t.ordre), 0);

      const { data, error } = await supabase
        .from('temoignages')
        .insert({
          nom: 'Nouveau témoignage',
          lieu: 'Ville',
          date: 'Mois Année',
          note: 5,
          avis: 'Texte du témoignage...',
          ordre: maxOrdre + 1,
          visible: true
        })
        .select()
        .single();

      if (error) throw error;

      const newTemoignage: TemoignageData = {
        id: data.id,
        nom: 'Nouveau témoignage',
        lieu: 'Ville',
        date: 'Mois Année',
        note: 5,
        avis: 'Texte du témoignage...',
        ordre: maxOrdre + 1,
        visible: true
      };

      setTemoignages([...temoignages, newTemoignage]);
      setEditingId(data.id);
      setMessage('✓ Témoignage ajouté');
      setTimeout(() => setMessage(null), 2000);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setMessage('✗ Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ce qu'ils en disent</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les témoignages clients. Glissez-déposez pour réorganiser.
          </p>
        </div>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          + Ajouter un témoignage
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.startsWith('✓') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {temoignages.map((temoignage, index) => (
          <div
            key={temoignage.id}
            draggable
            onDragStart={() => handleDragStart(temoignage.id)}
            onDragOver={(e) => handleDragOver(e, temoignage.id)}
            onDragEnd={handleDragEnd}
            className={`bg-white border-2 rounded-lg p-4 transition ${
              draggingId === temoignage.id
                ? 'opacity-50 border-green-500'
                : 'border-gray-200 hover:border-gray-300'
            } ${editingId === temoignage.id ? 'ring-2 ring-green-500' : ''} ${
              !temoignage.visible ? 'opacity-60' : ''
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Grip className="text-gray-400 cursor-move" size={20} />
                <span className="text-sm font-medium text-gray-700">
                  Témoignage {index + 1}
                  {temoignage.visible ? (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">Visible</span>
                  ) : (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">Masqué</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {editingId === temoignage.id ? (
                  <>
                    <button
                      onClick={() => handleSave(temoignage.id)}
                      disabled={saving}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
                      title="Sauvegarder"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition"
                      title="Annuler"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleToggleVisible(temoignage.id)}
                      disabled={saving}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                      title={temoignage.visible ? 'Masquer' : 'Afficher'}
                    >
                      {temoignage.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => setEditingId(temoignage.id)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(temoignage.id)}
                      disabled={saving}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            {editingId === temoignage.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={temoignage.nom}
                      onChange={(e) => handleUpdate(temoignage.id, 'nom', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Sophie M."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Lieu</label>
                    <input
                      type="text"
                      value={temoignage.lieu}
                      onChange={(e) => handleUpdate(temoignage.id, 'lieu', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Lyon 6e"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={temoignage.date}
                      onChange={(e) => handleUpdate(temoignage.id, 'date', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Mars 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Note (1-5 étoiles)</label>
                    <select
                      value={temoignage.note}
                      onChange={(e) => handleUpdate(temoignage.id, 'note', parseInt(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Avis</label>
                  <textarea
                    value={temoignage.avis}
                    onChange={(e) => handleUpdate(temoignage.id, 'avis', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Texte du témoignage..."
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
                <div className="space-y-2">
                  <div className="flex gap-0.5">
                    {[...Array(temoignage.note)].map((_, i) => (
                      <Star key={i} size={14} fill="#3a5c32" color="#3a5c32" />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{temoignage.nom}</p>
                  <p className="text-xs text-gray-600">{temoignage.lieu}</p>
                  <p className="text-xs text-gray-500">{temoignage.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-700 italic">"{temoignage.avis}"</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {temoignages.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun témoignage. Cliquez sur "Ajouter un témoignage" pour commencer.</p>
        </div>
      )}
    </div>
  );
}
