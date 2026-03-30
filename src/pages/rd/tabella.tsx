import { useState, useEffect, useRef, ReactNode } from 'react';
import { Button, Modal, Input, Textarea, Select, ConfirmDialog } from '../../components/ui'; // Textarea still used in IdeaModal
import { PlusIcon, TrashIcon } from '../../components/icons';
import { subscribeToStreams, subscribeToIdeas, saveStream, saveIdea, deleteIdea, subscribeToProposals, deleteProposal } from '../../services/firestore';
import { KANBAN_COLUMNS } from '../../types';
import type { Stream, Idea, KanbanColumnId, Proposal } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_STREAMS: Stream[] = [
  { id: 's1', name: 'Ways of Working', leader: 'Francesco', substreams: [
    { id: 'ss1', name: 'Interactive Webapps', leader: 'Francesco' },
    { id: 'ss2', name: 'Claude Skills', leader: 'Francesco' },
    { id: 'ss3', name: 'Get Things Done', leader: '[NOME]' },
  ]},
  { id: 's2', name: 'New Services & Products', leader: 'Francesco', substreams: [] },
  { id: 's3', name: 'Formazione AI', leader: 'Andrea', substreams: [
    { id: 'ss4', name: 'Interactive Learning Hub', leader: '[NOME]' },
    { id: 'ss5', name: 'Gamification Duolingo', leader: '[NOME]' },
  ]},
  { id: 's4', name: 'Change Management', leader: 'Andrea', substreams: [] },
  { id: 's5', name: 'Agentic Commerce', leader: 'Sofia', substreams: [] },
  { id: 's6', name: 'ARAD Model', leader: 'Alessio', substreams: [] },
];

const INITIAL_IDEAS: Idea[] = [
  { id: 'n1', ideaId: 1, text: 'Contract Drafter', description: 'Skill Claude per creazione contratti commerciali ARAD', streamId: 's1', substreamId: 'ss2', col: 'done', partenza: 'Contratti fatti manualmente con copy/paste da contratti precedenti.', arrivo: 'Caricare su Claude appunti Gemini, Slides e docs → output in minuti. Solo rileggere, modificare e approvare.' },
  { id: 'n2', ideaId: 2, text: 'ARAD Portfolio Services', description: 'Webapp interattiva portfolio servizi ARAD', streamId: 's1', substreamId: 'ss1', col: 'backlog', partenza: '', arrivo: '' },
  { id: 'n3', ideaId: 3, text: 'Conversational Website', description: 'Sito web conversazionale AI-powered', streamId: 's1', substreamId: 'ss1', col: 'backlog', partenza: '', arrivo: '' },
  { id: 'n4', ideaId: 4, text: 'Agentic Commerce Dashboard', description: 'Dashboard interattiva agentic commerce', streamId: 's1', substreamId: 'ss1', col: 'backlog', partenza: '', arrivo: '' },
  { id: 'n5', ideaId: 5, text: 'Modello ARAD', description: 'Definizione modello operativo ARAD', streamId: 's6', substreamId: null, col: 'backlog', partenza: '', arrivo: '' },
];

export const TabellaPage = () => {
  const [streams, setStreams] = useState<Stream[]>(INITIAL_STREAMS);
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showIdeaProposals, setShowIdeaProposals] = useState(false);
  const [showProtoProposals, setShowProtoProposals] = useState(false);
  const [confirmDeleteProposalId, setConfirmDeleteProposalId] = useState<string | null>(null);

  useEffect(() => {
    let seeded = false;
    setLoading(false); // Show initial data immediately; Firestore data replaces it on arrival

    const unsubStreams = subscribeToStreams(
      async (data) => {
        if (data.length > 0) {
          setStreams(data);
        } else if (!seeded) {
          seeded = true;
          for (const stream of INITIAL_STREAMS) {
            await saveStream(stream);
          }
        }
      },
      (error) => {
        console.error('Tabella streams error:', error);
        toast.error('Errore nel caricamento degli stream');
      }
    );

    const unsubIdeas = subscribeToIdeas(
      async (data) => {
        if (data.length > 0) {
          setIdeas(data);
        } else if (!seeded) {
          for (const idea of INITIAL_IDEAS) {
            await saveIdea(idea);
          }
        }
      },
      (error) => {
        console.error('Tabella ideas error:', error);
      }
    );

    return () => { unsubStreams(); unsubIdeas(); };
  }, []);

  useEffect(() => {
    return subscribeToProposals(setProposals, (e) => console.error('Tabella proposals error:', e));
  }, []);

  // Build targets list for stream/substream dropdown
  const targets = streams
    .flatMap((s) => [
      ...(s.substreams.length === 0 ? [{ stId: s.id, ssId: null as string | null, label: s.name }] : []),
      ...s.substreams.map((ss) => ({ stId: s.id, ssId: ss.id as string | null, label: `${s.name} → ${ss.name}` })),
    ]);

  const getTargetIndex = (streamId: string, substreamId: string | null): number => {
    // Normalize empty string to null for comparison
    const normalizedSubstreamId = substreamId || null;
    const idx = targets.findIndex((t) => t.stId === streamId && t.ssId === normalizedSubstreamId);
    return idx >= 0 ? idx : 0;
  };

  // Local update only (no Firestore save)
  const handleUpdateLocal = (id: string, field: keyof Idea, value: string | number | null) => {
    setIdeas((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // Save to Firestore on blur
  const handleSave = async (id: string) => {
    const idea = ideas.find((i) => i.id === id);
    if (idea) {
      try {
        await saveIdea(idea);
      } catch {
        toast.error('Failed to save changes');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    setIdeas((prev) => prev.filter((r) => r.id !== confirmDeleteId));
    setConfirmDeleteId(null);
    try {
      await deleteIdea(confirmDeleteId);
    } catch {
      toast.error('Failed to delete idea');
    }
  };

  const handleAdd = async (idea: Idea) => {
    setIdeas((prev) => [...prev, idea]);
    try {
      await saveIdea(idea);
      toast.success('Idea created');
    } catch {
      toast.error('Failed to create idea');
    }
  };

  if (loading) {
    return <div className="text-center text-brand-muted py-12">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl">Tabella Idee</h1>
          <Button onClick={() => setModalOpen(true)}>
            <PlusIcon /> Nuova Idea
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={showIdeaProposals ? 'primary' : undefined}
            onClick={() => setShowIdeaProposals((v) => !v)}
          >
            💡 Proposte Idee {proposals.filter((p) => (p.proposalType || 'idea') === 'idea').length > 0 && `(${proposals.filter((p) => (p.proposalType || 'idea') === 'idea').length})`}
          </Button>
          <Button
            size="sm"
            variant={showProtoProposals ? 'primary' : undefined}
            onClick={() => setShowProtoProposals((v) => !v)}
          >
            🔗 Proposte Prototipi {proposals.filter((p) => p.proposalType === 'prototype').length > 0 && `(${proposals.filter((p) => p.proposalType === 'prototype').length})`}
          </Button>
        </div>
      </div>

      <IdeaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        streams={streams}
        ideas={ideas}
        onAdd={handleAdd}
      />

      {/* Ideas proposals table */}
      {showIdeaProposals && (() => {
        const items = proposals.filter((p) => (p.proposalType || 'idea') === 'idea');
        return (
          <div className="mb-6 overflow-x-auto border border-brand-gold/20 rounded-sm">
            <div className="px-3 py-2 bg-brand-gold/5 border-b border-brand-gold/20 text-[10px] font-bold text-brand-gold uppercase tracking-widest">
              Proposte Idee
            </div>
            {items.length === 0 ? (
              <p className="text-brand-muted text-sm italic p-4">Nessuna proposta idea ricevuta.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Titolo', 'Descrizione', 'Perché', 'AS IS', 'TO BE', 'Stream', 'ROI', 'Tipologia', 'Email', 'Data', ''].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-brand-gold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => {
                    const stream = streams.find((s) => s.id === p.streamId);
                    return (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-brand-ice align-top">
                        <td className="px-3 py-2 text-xs font-medium min-w-[120px]">{p.titolo || '—'}</td>
                        <td className="px-3 py-2 text-xs text-brand-muted min-w-[140px] max-w-[200px] whitespace-pre-wrap">{p.descrizione || '—'}</td>
                        <td className="px-3 py-2 text-xs text-brand-muted min-w-[120px] max-w-[180px] whitespace-pre-wrap">{p.perche || '—'}</td>
                        <td className="px-3 py-2 text-xs text-brand-muted min-w-[120px] max-w-[180px] whitespace-pre-wrap">{p.asIs || '—'}</td>
                        <td className="px-3 py-2 text-xs text-brand-muted min-w-[120px] max-w-[180px] whitespace-pre-wrap">{p.toBe || '—'}</td>
                        <td className="px-3 py-2 text-xs text-brand-muted whitespace-nowrap">{stream?.name || '—'}</td>
                        <td className="px-3 py-2 text-xs text-brand-muted min-w-[120px] max-w-[180px] whitespace-pre-wrap">{p.roi || '—'}</td>
                        <td className="px-3 py-2 text-xs text-brand-muted capitalize whitespace-nowrap">{p.tipologia || '—'}</td>
                        <td className="px-3 py-2 text-xs text-brand-muted whitespace-nowrap">{p.email || '—'}</td>
                        <td className="px-3 py-2 text-xs text-brand-muted whitespace-nowrap">{p.createdAt?.toLocaleDateString('it-IT') || '—'}</td>
                        <td className="px-2 py-2">
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => setConfirmDeleteProposalId(p.id)} className="text-red-500/30 hover:text-red-500 p-1 transition-colors">
                            <TrashIcon size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })()}

      {/* Prototype proposals table */}
      {showProtoProposals && (() => {
        const items = proposals.filter((p) => p.proposalType === 'prototype');
        return (
          <div className="mb-6 overflow-x-auto border border-brand-gold/20 rounded-sm">
            <div className="px-3 py-2 bg-brand-gold/5 border-b border-brand-gold/20 text-[10px] font-bold text-brand-gold uppercase tracking-widest">
              Proposte Prototipi
            </div>
            {items.length === 0 ? (
              <p className="text-brand-muted text-sm italic p-4">Nessuna proposta prototipo ricevuta.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Link', "Cos'è", 'Descrizione', 'ROI', 'Email', 'Data', ''].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-brand-gold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-brand-ice align-top">
                      <td className="px-3 py-2 text-xs min-w-[140px]">
                        {p.prototypeLink
                          ? <a href={p.prototypeLink} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline break-all">↗ {p.prototypeLink}</a>
                          : '—'}
                      </td>
                      <td className="px-3 py-2 text-xs text-brand-muted min-w-[120px] max-w-[180px] whitespace-pre-wrap">{p.prototypeCosa || '—'}</td>
                      <td className="px-3 py-2 text-xs text-brand-muted min-w-[140px] max-w-[200px] whitespace-pre-wrap">{p.prototypeDescrizione || '—'}</td>
                      <td className="px-3 py-2 text-xs text-brand-muted min-w-[120px] max-w-[180px] whitespace-pre-wrap">{p.prototypeRoi || '—'}</td>
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
              {['ID', 'Nome', 'Stream / Substream', 'Descrizione', 'Punto di Partenza', "Punto d'Arrivo", 'Kanban', ''].map((h) => (
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
            {ideas.map((r) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-brand-ice">
                <td className="px-3 py-2.5 font-mono font-bold text-brand-gold">{r.ideaId}</td>
                <td className="p-2 min-w-[140px]">
                  <AutoTextarea
                    value={r.text}
                    onChange={(e) => handleUpdateLocal(r.id, 'text', e.target.value)}
                    onBlur={() => handleSave(r.id)}
                    className="font-semibold"
                  />
                </td>
                <td className="p-2">
                  <Select
                    value={getTargetIndex(r.streamId, r.substreamId)}
                    onChange={(e) => {
                      const target = targets[Number(e.target.value)];
                      if (target) {
                        handleUpdateLocal(r.id, 'streamId', target.stId);
                        handleUpdateLocal(r.id, 'substreamId', target.ssId);
                      }
                    }}
                    onBlur={() => handleSave(r.id)}
                    className="min-w-[180px] text-xs"
                  >
                    {targets.map((t, i) => <option key={i} value={i}>{t.label}</option>)}
                  </Select>
                </td>
                <td className="p-2 min-w-[160px]">
                  <AutoTextarea
                    value={r.description}
                    onChange={(e) => handleUpdateLocal(r.id, 'description', e.target.value)}
                    onBlur={() => handleSave(r.id)}
                  />
                </td>
                <td className="p-2 min-w-[160px]">
                  <AutoTextarea
                    value={r.partenza}
                    onChange={(e) => handleUpdateLocal(r.id, 'partenza', e.target.value)}
                    onBlur={() => handleSave(r.id)}
                  />
                </td>
                <td className="p-2 min-w-[160px]">
                  <AutoTextarea
                    value={r.arrivo}
                    onChange={(e) => handleUpdateLocal(r.id, 'arrivo', e.target.value)}
                    onBlur={() => handleSave(r.id)}
                  />
                </td>
                <td className="p-2">
                  <Select
                    value={r.col}
                    onChange={(e) => handleUpdateLocal(r.id, 'col', e.target.value)}
                    onBlur={() => handleSave(r.id)}
                    className="w-[140px]"
                  >
                    {KANBAN_COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </Select>
                </td>
                <td className="p-2">
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setConfirmDeleteId(r.id)}
                    className="text-red-500/40 hover:text-red-500 p-1"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ideas.length === 0 && (
          <div className="text-center py-10 text-brand-muted italic">
            Nessuna idea ancora. Clicca "Nuova Idea" per iniziare.
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Eliminare questa idea?"
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

// Idea Modal (same as in Kanban)
interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  streams: Stream[];
  ideas: Idea[];
  onAdd: (idea: Idea) => void;
}

const IdeaModal = ({ isOpen, onClose, streams, ideas, onAdd }: IdeaModalProps) => {
  const [name, setName] = useState('');
  const [numId, setNumId] = useState('');
  const [desc, setDesc] = useState('');
  const [targetIdx, setTargetIdx] = useState(0);
  const [col, setCol] = useState<KanbanColumnId>('backlog');
  const [partenza, setPartenza] = useState('');
  const [arrivo, setArrivo] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setName(''); setNumId(''); setDesc(''); setTargetIdx(0);
    setCol('backlog'); setPartenza(''); setArrivo(''); setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const targets = streams.flatMap((s) => [
    ...(s.substreams.length === 0 ? [{ stId: s.id, ssId: null, label: s.name }] : []),
    ...s.substreams.map((ss) => ({ stId: s.id, ssId: ss.id, label: `${s.name} → ${ss.name}` })),
  ]);

  const handleSubmit = () => {
    if (!name.trim()) { setError('Inserisci un nome'); return; }
    const nid = parseInt(numId);
    if (isNaN(nid) || nid < 1) { setError('ID deve essere un numero positivo'); return; }
    if (ideas.some((i) => i.ideaId === nid)) { setError(`ID ${nid} già in uso`); return; }
    if (!targets.length) { setError('Nessun stream disponibile'); return; }

    const t = targets[targetIdx];
    onAdd({
      id: `n_${crypto.randomUUID()}`,
      ideaId: nid,
      text: name.trim(),
      description: desc.trim(),
      streamId: t.stId,
      substreamId: t.ssId,
      col,
      partenza: partenza.trim(),
      arrivo: arrivo.trim(),
    });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nuova Idea" maxWidth="max-w-xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-sm px-3 py-2 mb-3 text-xs text-red-500">
          {error}
        </div>
      )}
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_100px] gap-3">
          <div>
            <Label>Nome idea</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Contract Drafter" />
          </div>
          <div>
            <Label>ID (numerico)</Label>
            <Input value={numId} onChange={(e) => setNumId(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Es. 7" />
          </div>
        </div>
        <div>
          <Label>Descrizione breve</Label>
          <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Es. Skill Claude per creazione contratti" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Destinazione</Label>
            <Select value={targetIdx} onChange={(e) => setTargetIdx(Number(e.target.value))}>
              {targets.map((t, i) => <option key={i} value={i}>{t.label}</option>)}
            </Select>
          </div>
          <div>
            <Label>Colonna Kanban</Label>
            <Select value={col} onChange={(e) => setCol(e.target.value as KanbanColumnId)}>
              {KANBAN_COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </Select>
          </div>
        </div>
        <div>
          <Label>Punto di partenza (AS IS)</Label>
          <Textarea value={partenza} onChange={(e) => setPartenza(e.target.value)} rows={2} placeholder="Da dove si inizia..." />
        </div>
        <div>
          <Label>Punto d'arrivo (TO BE)</Label>
          <Textarea value={arrivo} onChange={(e) => setArrivo(e.target.value)} rows={2} placeholder="L'idea è completata quando..." />
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-5">
        <Button onClick={handleClose}>Annulla</Button>
        <Button variant="primary" onClick={handleSubmit}>Aggiungi</Button>
      </div>
    </Modal>
  );
};

const AutoTextarea = ({
  value,
  onChange,
  onBlur,
  className = '',
  placeholder = '',
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  className?: string;
  placeholder?: string;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={1}
      className={`w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-brand-gold/50 focus:outline-none rounded-sm px-2 py-1.5 text-sm text-brand-body resize-none overflow-hidden leading-snug transition-colors ${className}`}
    />
  );
};

const Label = ({ children }: { children: ReactNode }) => (
  <label className="block text-[10px] text-brand-muted uppercase tracking-wider mb-1">
    {children}
  </label>
);
