import { useState, useEffect } from 'react';
import { Button, Input } from '../../components/ui';
import { PlusIcon, TrashIcon } from '../../components/icons';
import { subscribeToMaterialiUtili, saveMaterialeUtile, deleteMaterialeUtile } from '../../services/firestore';
import type { MaterialeUtile } from '../../types';
import toast from 'react-hot-toast';

export const MaterialiPage = () => {
  const [data, setData] = useState<MaterialeUtile[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    const unsubscribe = subscribeToMaterialiUtili((materiali) => {
      setData(materiali);
    });
    return unsubscribe;
  }, []);

  const handleUpdateLocal = (id: string, field: keyof MaterialeUtile, value: string) => {
    setData((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleSave = async (id: string) => {
    const materiale = data.find((m) => m.id === id);
    if (materiale) {
      try {
        await saveMaterialeUtile(materiale);
      } catch {
        toast.error('Errore nel salvataggio');
      }
    }
  };

  const handleAdd = () => {
    const newRow: MaterialeUtile = {
      id: `m_${crypto.randomUUID()}`,
      url: '',
      descrizione: '',
    };
    setData((prev) => [...prev, newRow]);
  };

  const handleDeleteRequest = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    setData((prev) => prev.filter((row) => row.id !== confirmDeleteId));
    setConfirmDeleteId(null);
    try {
      await deleteMaterialeUtile(confirmDeleteId);
      toast.success('Materiale eliminato');
    } catch {
      toast.error('Errore nella cancellazione');
    }
  };

  if (loading) {
    return <div className="text-center text-brand-muted py-12">Loading...</div>;
  }

  const itemToDelete = data.find((m) => m.id === confirmDeleteId);

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl mb-3">Materiali Utili</h1>
      <p className="text-brand-muted text-sm leading-relaxed mb-7 max-w-3xl">
        Raccolta di link utili: video YouTube, certificazioni, articoli, tool e qualsiasi risorsa rilevante per il team AI.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {['Link', 'Descrizione', ''].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-brand-gold bg-brand-gold/5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-brand-ice">
                <td className="p-2 min-w-[300px]">
                  {row.url ? (
                    <div className="flex items-center gap-2">
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-gold underline underline-offset-2 text-xs truncate max-w-[280px] hover:text-brand-gold/80"
                        title={row.url}
                      >
                        {row.url}
                      </a>
                      <button
                        onClick={() => handleUpdateLocal(row.id, 'url', '')}
                        className="text-brand-muted hover:text-brand-body text-[10px] shrink-0"
                        title="Modifica URL"
                      >
                        ✎
                      </button>
                    </div>
                  ) : (
                    <Input
                      value={row.url}
                      onChange={(e) => handleUpdateLocal(row.id, 'url', e.target.value)}
                      onBlur={() => handleSave(row.id)}
                      placeholder="https://..."
                      className="min-w-[280px]"
                    />
                  )}
                </td>
                <td className="p-2">
                  <Input
                    value={row.descrizione}
                    onChange={(e) => handleUpdateLocal(row.id, 'descrizione', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    placeholder="Breve descrizione del contenuto"
                    className="min-w-[260px]"
                  />
                </td>
                <td className="p-2">
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleDeleteRequest(row.id)}
                    className="text-red-500/50 hover:text-red-500 p-2 transition-colors"
                    title="Elimina"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="text-center py-10 text-brand-muted italic text-sm">
            Nessun materiale ancora. Clicca "Aggiungi link" per iniziare.
          </div>
        )}
      </div>

      <Button onClick={handleAdd} className="mt-4">
        <PlusIcon /> Aggiungi link
      </Button>

      {/* Delete confirmation dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div className="bg-brand-surface rounded-sm border border-gray-200 shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-heading text-base mb-2">Eliminare questo materiale?</h3>
            <p className="text-brand-muted text-sm mb-1">
              Stai per eliminare definitivamente questo link:
            </p>
            {itemToDelete?.url && (
              <p className="text-brand-gold text-xs truncate mb-4" title={itemToDelete.url}>
                {itemToDelete.url}
              </p>
            )}
            <p className="text-brand-muted text-sm mb-5">Questa azione non può essere annullata.</p>
            <div className="flex gap-3 justify-end">
              <Button onClick={() => setConfirmDeleteId(null)}>Annulla</Button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
