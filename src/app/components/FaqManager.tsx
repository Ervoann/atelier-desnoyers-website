import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { FaqData } from '../hooks/useSupabaseData';
import { Edit2, Trash2, GripVertical, Plus } from 'lucide-react';
import Tooltip from './Tooltip';

interface FaqManagerProps {
  faqs: FaqData[];
  onReload: () => void;
}

interface FaqFormProps {
  faq: Partial<FaqData>;
  onSave: () => void;
  onCancel: () => void;
}

function FaqForm({ faq, onSave, onCancel }: FaqFormProps) {
  const [question, setQuestion] = useState(faq.question || '');
  const [reponse, setReponse] = useState(faq.reponse || '');
  const [ordre, setOrdre] = useState(faq.ordre || 1);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const faqData = {
        question,
        reponse,
        ordre,
      };

      if (faq.id) {
        const { error } = await supabase
          .from('faqs')
          .update(faqData)
          .eq('id', faq.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert(faqData);

        if (error) throw error;
      }

      onSave();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-green-200 rounded-lg p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Réponse *</label>
        <textarea
          value={reponse}
          onChange={(e) => setReponse(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}

export default function FaqManager({ faqs, onReload }: FaqManagerProps) {
  const [items, setItems] = useState<FaqData[]>([]);
  const [editingFaq, setEditingFaq] = useState<FaqData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    setItems(faqs.sort((a, b) => a.ordre - b.ordre));
  }, [faqs]);

  const handleReorder = async (newOrder: FaqData[]) => {
    setItems(newOrder);

    try {
      await Promise.all(
        newOrder.map((item, index) =>
          supabase
            .from('faqs')
            .update({ ordre: index + 1 })
            .eq('id', item.id)
        )
      );
      onReload();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'ordre:', err);
      alert('Erreur lors de la mise à jour de l\'ordre');
      setItems(faqs.sort((a, b) => a.ordre - b.ordre));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette FAQ ?')) return;

    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      onReload();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleSaveComplete = () => {
    setEditingFaq(null);
    setIsAddingNew(false);
    onReload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Questions Fréquentes</h2>
          <p className="text-sm text-gray-600">Glissez-déposez pour réorganiser</p>
        </div>
        <Tooltip text="Créer une nouvelle FAQ">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={18} />
            Nouvelle FAQ
          </button>
        </Tooltip>
      </div>

      {/* Add FAQ Form */}
      {isAddingNew && (
        <FaqForm
          faq={{ question: '', reponse: '', ordre: items.length + 1 }}
          onSave={handleSaveComplete}
          onCancel={() => setIsAddingNew(false)}
        />
      )}

      {/* FAQ List */}
      <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
        {items.map((faq) => (
          <Reorder.Item
            key={faq.id}
            value={faq}
            id={`faq-${faq.id}`}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 cursor-move hover:border-green-300 transition-colors"
          >
            {editingFaq?.id === faq.id ? (
              <FaqForm
                faq={editingFaq}
                onSave={handleSaveComplete}
                onCancel={() => setEditingFaq(null)}
              />
            ) : (
              <div className="flex items-start gap-4">
                <Tooltip text="Glisser pour réordonner">
                  <div className="p-2 cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} className="text-gray-400" />
                  </div>
                </Tooltip>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      #{faq.ordre}
                    </span>
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{faq.reponse}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Tooltip text="Éditer">
                    <button
                      onClick={() => setEditingFaq(faq)}
                      className="p-2 hover:bg-green-100 rounded text-green-600 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip text="Supprimer">
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {items.length === 0 && !isAddingNew && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">Aucune FAQ pour le moment</p>
          <p className="text-sm text-gray-400 mt-1">Cliquez sur "Nouvelle FAQ" pour commencer</p>
        </div>
      )}
    </div>
  );
}
