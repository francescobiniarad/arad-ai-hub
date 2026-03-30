import { useState, useEffect } from 'react';
import { Button, Input, Textarea, ConfirmDialog } from '../../components/ui';
import { PlusIcon, TrashIcon } from '../../components/icons';
import { subscribeToWorkshops, saveWorkshop, deleteWorkshop, subscribeToProposals, deleteProposal } from '../../services/firestore';
import type { Workshop, Proposal } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_WORKSHOPS: Workshop[] = [
  { id: 'w1', date: '', topic: '', leader: '', notes: '' },
];

export const WorkshopPage = () => {
  const [data, setData] = useState<Workshop[]>(INITIAL_WORKSHOPS);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showProposals, setShowProposals] = useState(false);
  const [confirmDeleteProposalId, setConfirmDeleteProposalId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    const unsubscribe = subscribeToWorkshops((workshops) => {
      if (workshops.length > 0) {
        const sorted = [...workshops].sort((a, b) => {
          if (!a.createdAt && !b.createdAt) return 0;
          if (!a.createdAt) return -1;
          if (!b.createdAt) return 1;
          return a.createdAt.getTime() - b.createdAt.getTime();
        });
        setData(sorted);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    return subscribeToProposals(setProposals, (e) => console.error('Workshop proposals error:', e));
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

  const handleAdd = async () => {
    const newWorkshop: Workshop = {
      id: `w_${crypto.randomUUID()}`,
      date: '',
      topic: '',
      leader: '',
      notes: '',
    };
    setData((prev) => [...prev, newWorkshop]);
    try {
      await saveWorkshop(newWorkshop);
    } catch {
      toast.error('Failed to create workshop');
    }
  };

  if (loading) {
    return <div className="text-center text-brand-muted py-12">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="font-heading text-2xl">Workshop AI</h1>
        <Button
          size="sm"
          variant={showProposals ? 'primary' : undefined}
          onClick={() => setShowProposals((v) => !v)}
        >
          🏢 Proposte Workshop AI {proposals.filter((p) => p.proposalType === 'workshop').length > 0 && `(${proposals.filter((p) => p.proposalType === 'workshop').length})`}
        </Button>
      </div>
      <p className="text-brand-muted text-sm leading-relaxed mb-7 max-w-3xl">
        Sessioni di un'ora e mezza ogni sei settimane, condotte da referenti interni, per deep dive su argomenti specifici.
      </p>

      {showProposals && (() => {
        const items = proposals.filter((p) => p.proposalType === 'workshop');
        return (
          <div className="mb-6 overflow-x-auto border border-brand-gold/20 rounded-sm">
            <div className="px-3 py-2 bg-brand-gold/5 border-b border-brand-gold/20 text-[10px] font-bold text-brand-gold uppercase tracking-widest">
              Proposte Workshop AI
            </div>
            {items.length === 0 ? (
              <p className="text-brand-muted text-sm italic p-4">Nessuna proposta ricevuta.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Argomento', 'Perché', 'Teoria', 'Pratica', 'Vuole presentare', 'Quando', 'Email', 'Data', ''].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-brand-gold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-brand-ice align-top">
                      <td className="px-3 py-2 text-xs font-medium min-w-[140px]">{p.sessionTopic || '—'}</td>
                      <td className="px-3 py-2 text-xs text-brand-muted min-w-[140px] max-w-[200px] whitespace-pre-wrap">{p.sessionWhy || '—'}</td>
                      <td className="px-3 py-2 text-xs text-brand-muted min-w-[140px] max-w-[200px] whitespace-pre-wrap">{p.sessionTeoria || '—'}</td>
                      <td className="px-3 py-2 text-xs text-brand-muted min-w-[140px] max-w-[200px] whitespace-pre-wrap">{p.sessionPratica || '—'}</td>
                      <td className="px-3 py-2 text-xs text-brand-muted whitespace-nowrap">{p.sessionIsPresenter ? 'Sì' : 'No'}</td>
                      <td className="px-3 py-2 text-xs text-brand-muted whitespace-nowrap">{p.sessionWhen || '—'}</td>
                      <td className="px-3 py-2 text-xs text-brand-muted whitespace-nowrap">{p.email || '—'}</td>
                      <td className="px-3 py-2 text-xs text-brand-muted whitespace-nowrap">{p.createdAt?.toLocaleDateString('it-IT') || '—'}</td>
                      <td className="px-2 py-2">
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => setConfirmDeleteProposalId(p.id)} className="text-red-500/30 hover:text-red-500 p-1 transition-colors">
                          <TrashIcon size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })()}

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
      <ConfirmDialog
        isOpen={!!confirmDeleteProposalId}
        title="Eliminare questa proposta?"
        message="Questa azione non può essere annullata."
        onConfirm={async () => {
          if (!confirmDeleteProposalId) return;
          const id = confirmDeleteProposalId;
          setConfirmDeleteProposalId(null);
          setProposals((prev) => prev.filter((p) => p.id !== id));
          await deleteProposal(id);
        }}
        onCancel={() => setConfirmDeleteProposalId(null)}
      />
    </div>
  );
};
