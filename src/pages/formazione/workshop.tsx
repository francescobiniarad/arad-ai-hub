import { useState, useEffect } from 'react';
import { Button, Input, Textarea, ConfirmDialog } from '../../components/ui';
import { PlusIcon, TrashIcon } from '../../components/icons';
import { subscribeToWorkshops, saveWorkshop, deleteWorkshop } from '../../services/firestore';
import type { Workshop } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_WORKSHOPS: Workshop[] = [
  { id: 'w1', date: '', topic: '', leader: '', notes: '' },
];

export const WorkshopPage = () => {
  const [data, setData] = useState<Workshop[]>(INITIAL_WORKSHOPS);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    const unsubscribe = subscribeToWorkshops((workshops) => {
      if (workshops.length > 0) {
        setData(workshops);
      }
    });
    return unsubscribe;
  }, []);

  // Local update only (no Firestore save)
  const handleUpdateLocal = (id: string, field: keyof Workshop, value: string) => {
    setData((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  // Save to Firestore on blur
  const handleSave = async (id: string) => {
    const workshop = data.find((w) => w.id === id);
    if (workshop) {
      try {
        await saveWorkshop(workshop);
      } catch {
        toast.error('Failed to save changes');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    setData((prev) => prev.filter((row) => row.id !== confirmDeleteId));
    setConfirmDeleteId(null);
    try {
      await deleteWorkshop(confirmDeleteId);
    } catch {
      toast.error('Failed to delete workshop');
    }
  };

  const handleAdd = () => {
    const newWorkshop: Workshop = {
      id: `w_${crypto.randomUUID()}`,
      date: '',
      topic: '',
      leader: '',
      notes: '',
    };
    setData((prev) => [...prev, newWorkshop]);
  };

  if (loading) {
    return <div className="text-center text-brand-muted py-12">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl mb-3">Workshop AI</h1>
      <p className="text-brand-muted text-sm leading-relaxed mb-7 max-w-3xl">
        Sessioni di un'ora e mezza ogni sei settimane, condotte da referenti interni, per deep dive su argomenti specifici.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {['Data', 'Argomento', 'Leader', 'Notes', ''].map((h) => (
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
                <td className="p-2">
                  <Input
                    value={row.date}
                    onChange={(e) => handleUpdateLocal(row.id, 'date', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    className="min-w-[100px]"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={row.topic}
                    onChange={(e) => handleUpdateLocal(row.id, 'topic', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    className="min-w-[200px]"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={row.leader}
                    onChange={(e) => handleUpdateLocal(row.id, 'leader', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    className="min-w-[120px]"
                  />
                </td>
                <td className="p-2">
                  <Textarea
                    value={row.notes}
                    onChange={(e) => handleUpdateLocal(row.id, 'notes', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    rows={2}
                    className="min-w-[200px]"
                  />
                </td>
                <td className="p-2">
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setConfirmDeleteId(row.id)}
                    className="text-red-500/50 hover:text-red-500 p-2"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={handleAdd} className="mt-4">
        <PlusIcon /> Aggiungi riga
      </Button>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Eliminare questo workshop?"
        message="Questa azione non può essere annullata."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
