import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { PortfolioData } from '../hooks/useSupabaseData';
import { Edit2, Trash2, GripVertical, Eye, EyeOff, Plus, Image as ImageIcon } from 'lucide-react';
import PortfolioEditForm from './PortfolioEditForm';
import Tooltip from './Tooltip';

interface PortfolioManagerProps {
  portfolios: PortfolioData[];
  onReload: () => void;
}

interface ReorderItemProps {
  portfolio: PortfolioData;
  onEdit: (portfolio: PortfolioData) => void;
  onDelete: (id: number) => void;
  onToggleVisible: (id: number) => void;
}

function ReorderItem({ portfolio, onEdit, onDelete, onToggleVisible }: ReorderItemProps) {
  const isVisible = portfolio.ordre <= 8;

  return (
    <Reorder.Item
      value={portfolio}
      id={`portfolio-${portfolio.id}`}
      className={`bg-white border-2 rounded-lg p-4 cursor-move ${
        !isVisible ? 'opacity-60' : ''
      } hover:border-green-300 transition-colors`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <Tooltip text="Glisser pour réordonner">
          <div className="p-2 cursor-grab active:cursor-grabbing">
            <GripVertical size={20} className="text-gray-400" />
          </div>
        </Tooltip>

        {/* Image */}
        <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
          {portfolio.imagePrincipale ? (
            <img
              src={portfolio.imagePrincipale}
              alt={portfolio.titre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="text-gray-300" size={24} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{portfolio.ordre}
            </span>
            {portfolio.chantierNumero && (
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                Chantier #{portfolio.chantierNumero}
              </span>
            )}
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {isVisible ? 'Visible' : 'Masqué'}
            </span>
          </div>
          <h3 className="font-medium text-gray-900">{portfolio.titre}</h3>
          <p className="text-sm text-gray-600">{portfolio.lieu} • {portfolio.annee}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Tooltip text={isVisible ? 'Masquer du site' : 'Afficher sur le site'}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisible(portfolio.id);
              }}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              {isVisible ? <Eye size={18} className="text-gray-600" /> : <EyeOff size={18} className="text-gray-400" />}
            </button>
          </Tooltip>
          <Tooltip text="Éditer">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(portfolio);
              }}
              className="p-2 hover:bg-green-100 rounded text-green-600 transition-colors"
            >
              <Edit2 size={18} />
            </button>
          </Tooltip>
          <Tooltip text="Supprimer">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(portfolio.id);
              }}
              className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </Tooltip>
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function PortfolioManager({ portfolios, onReload }: PortfolioManagerProps) {
  const [visiblePortfolios, setVisiblePortfolios] = useState<PortfolioData[]>([]);
  const [hiddenPortfolios, setHiddenPortfolios] = useState<PortfolioData[]>([]);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Synchroniser avec les props
  useEffect(() => {
    const visible = portfolios.filter(p => p.ordre <= 8).sort((a, b) => a.ordre - b.ordre);
    const hidden = portfolios.filter(p => p.ordre > 8).sort((a, b) => a.ordre - b.ordre);
    setVisiblePortfolios(visible);
    setHiddenPortfolios(hidden);
  }, [portfolios]);

  const handleReorder = async (newOrder: PortfolioData[]) => {
    // Mise à jour optimiste du UI
    setVisiblePortfolios(newOrder);

    // Mettre à jour l'ordre dans la base de données
    try {
      await Promise.all(
        newOrder.map((item, index) =>
          supabase
            .from('portfolios')
            .update({ ordre: index + 1 })
            .eq('id', item.id)
        )
      );
      onReload();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'ordre:', err);
      alert('Erreur lors de la mise à jour de l\'ordre');
      // Restore from props
      const visible = portfolios.filter(p => p.ordre <= 8).sort((a, b) => a.ordre - b.ordre);
      setVisiblePortfolios(visible);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce portfolio ?')) return;

    try {
      const { error } = await supabase.from('portfolios').delete().eq('id', id);
      if (error) throw error;
      onReload();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleToggleVisible = async (id: number) => {
    const portfolio = portfolios.find(p => p.id === id);
    if (!portfolio) return;

    // Si on veut rendre visible un projet masqué et qu'on a déjà 8 projets visibles
    if (portfolio.ordre > 8 && visiblePortfolios.length >= 8) {
      alert('⚠️ Vous avez déjà 8 projets visibles (maximum).\n\nVeuillez en masquer un avant d\'en rendre visible un autre.');
      return;
    }

    const newOrdre = portfolio.ordre <= 8 ? 999 : visiblePortfolios.length + 1;

    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ ordre: newOrdre })
        .eq('id', id);

      if (error) throw error;
      onReload();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Preview - Portfolios affichés */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Portfolios affichés sur le site</h2>
            <p className="text-sm text-gray-600">
              Maximum 8 projets • Glissez-déposez pour réorganiser
              {visiblePortfolios.length >= 8 && (
                <span className="ml-2 text-orange-600 font-medium">
                  ⚠ Limite atteinte ({visiblePortfolios.length}/8)
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            title="Créer un nouveau portfolio"
          >
            <Plus size={18} />
            Nouveau projet
          </button>
        </div>

        <Reorder.Group axis="y" values={visiblePortfolios} onReorder={handleReorder} className="space-y-3">
          {visiblePortfolios.map((portfolio) => (
            <ReorderItem
              key={portfolio.id}
              portfolio={portfolio}
              onEdit={setEditingPortfolio}
              onDelete={handleDelete}
              onToggleVisible={handleToggleVisible}
            />
          ))}
        </Reorder.Group>

        {visiblePortfolios.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Aucun portfolio affiché</p>
            <p className="text-sm text-gray-400 mt-1">Ajoutez un nouveau projet ou rendez visible un projet masqué</p>
          </div>
        )}
      </div>

      {/* Section Portfolios masqués */}
      {hiddenPortfolios.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolios masqués</h2>
          <div className="space-y-3">
            {hiddenPortfolios.map((portfolio) => (
              <div key={portfolio.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    {portfolio.imagePrincipale ? (
                      <img
                        src={portfolio.imagePrincipale}
                        alt={portfolio.titre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="text-gray-300" size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {portfolio.chantierNumero && (
                        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                          Chantier #{portfolio.chantierNumero}
                        </span>
                      )}
                      <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-500">
                        Masqué
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900">{portfolio.titre}</h3>
                    <p className="text-sm text-gray-600">{portfolio.lieu} • {portfolio.annee}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip text="Afficher sur le site">
                      <button
                        onClick={() => handleToggleVisible(portfolio.id)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <EyeOff size={18} className="text-gray-400" />
                      </button>
                    </Tooltip>
                    <Tooltip text="Éditer">
                      <button
                        onClick={() => setEditingPortfolio(portfolio)}
                        className="p-2 hover:bg-green-100 rounded text-green-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    </Tooltip>
                    <Tooltip text="Supprimer">
                      <button
                        onClick={() => handleDelete(portfolio.id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {(editingPortfolio || isAddingNew) && (
        <PortfolioEditForm
          portfolio={editingPortfolio}
          onClose={() => {
            setEditingPortfolio(null);
            setIsAddingNew(false);
          }}
          onSave={() => {
            setEditingPortfolio(null);
            setIsAddingNew(false);
            onReload();
          }}
        />
      )}
    </div>
  );
}
