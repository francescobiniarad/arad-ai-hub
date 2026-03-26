import { useState, useEffect, useRef } from 'react';
import { Button, Modal, Input, Textarea, Select, ConfirmDialog } from '../../components/ui';
import { PlusIcon, TrashIcon, XIcon } from '../../components/icons';
import { subscribeToStreams, subscribeToIdeas, saveStream, deleteStream, saveIdea, deleteIdea } from '../../services/firestore';
import { KANBAN_COLUMNS } from '../../types';
import type { Stream, Idea, KanbanColumnId } from '../../types';
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

export const KanbanPage = () => {
  const [streams, setStreams] = useState<Stream[]>(INITIAL_STREAMS);
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'idea' | 'stream' | 'substream' | null>(null);
  const [substreamParent, setSubstreamParent] = useState<string | null>(null);
  const [confirmDeleteIdeaId, setConfirmDeleteIdeaId] = useState<string | null>(null);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedIdeaId) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [selectedIdeaId]);

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
        console.error('Kanban streams error:', error);
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
        console.error('Kanban ideas error:', error);
      }
    );

    return () => { unsubStreams(); unsubIdeas(); };
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e: React.DragEvent, col: KanbanColumnId, streamId: string, substreamId: string | null) => {
    e.preventDefault();
    if (!dragId) return;

    const updated = ideas.map((n) =>
      n.id === dragId ? { ...n, col, streamId, substreamId } : n
    );
    setIdeas(updated);

    const idea = updated.find((i) => i.id === dragId);
    if (idea) {
      try {
        await saveIdea(idea);
      } catch {
        toast.error('Failed to update idea');
      }
    }
    setDragId(null);
  };

  const handleDeleteIdeaConfirm = async () => {
    if (!confirmDeleteIdeaId) return;
    if (selectedIdeaId === confirmDeleteIdeaId) setSelectedIdeaId(null);
    setIdeas((prev) => prev.filter((n) => n.id !== confirmDeleteIdeaId));
    setConfirmDeleteIdeaId(null);
    try {
      await deleteIdea(confirmDeleteIdeaId);
    } catch {
      toast.error('Failed to delete idea');
    }
  };

  const handleDeleteSubstream = async (streamId: string, substreamId: string, substreamName: string) => {
    // Confirm before deleting
    const ideasCount = ideas.filter((i) => i.substreamId === substreamId).length;
    const message = ideasCount > 0
      ? `Delete "${substreamName}" and its ${ideasCount} idea(s)?`
      : `Delete "${substreamName}"?`;

    if (!window.confirm(message)) return;

    // Also delete ideas assigned to this substream
    const ideasToDelete = ideas.filter((i) => i.substreamId === substreamId);
    const updated = streams.map((s) =>
      s.id === streamId
        ? { ...s, substreams: s.substreams.filter((ss) => ss.id !== substreamId) }
        : s
    );
    setStreams(updated);
    setIdeas((prev) => prev.filter((i) => i.substreamId !== substreamId));

    const stream = updated.find((s) => s.id === streamId);
    if (stream) {
      try {
        await saveStream(stream);
        for (const idea of ideasToDelete) {
          await deleteIdea(idea.id);
        }
        toast.success('Substream deleted');
      } catch {
        toast.error('Failed to delete substream');
      }
    }
  };

  const handleDeleteStream = async (streamId: string, streamName: string) => {
    const streamIdeas = ideas.filter((i) => i.streamId === streamId);
    const subsCount = streams.find((s) => s.id === streamId)?.substreams.length ?? 0;

    const parts = [];
    if (subsCount > 0) parts.push(`${subsCount} substream(s)`);
    if (streamIdeas.length > 0) parts.push(`${streamIdeas.length} idea(s)`);
    const detail = parts.length > 0 ? ` and its ${parts.join(' and ')}` : '';

    if (!window.confirm(`Delete stream "${streamName}"${detail}?`)) return;

    setStreams((prev) => prev.filter((s) => s.id !== streamId));
    setIdeas((prev) => prev.filter((i) => i.streamId !== streamId));

    try {
      await deleteStream(streamId);
      for (const idea of streamIdeas) {
        await deleteIdea(idea.id);
      }
      toast.success('Stream deleted');
    } catch {
      toast.error('Failed to delete stream');
    }
  };

  const HIDDEN_STREAM_NAMES = ['arad model'];
  const displayStreamName = (name: string) => name.toLowerCase() === 'formazione ai' ? 'Formazione' : name;
  const visibleStreams = streams.filter((s) => !HIDDEN_STREAM_NAMES.includes(s.name.toLowerCase()));

  if (loading) {
    return <div className="text-center text-brand-muted py-12">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <h1 className="font-heading text-2xl">Kanban</h1>
        <Button onClick={() => setModalType('idea')}>
          <PlusIcon /> Nuova Idea
        </Button>
        <Button onClick={() => setModalType('stream')}>
          <PlusIcon /> Stream
        </Button>
      </div>

      {/* Modals */}
      <IdeaModal
        isOpen={modalType === 'idea'}
        onClose={() => setModalType(null)}
        streams={streams}
        ideas={ideas}
        onAdd={async (idea) => {
          setIdeas((prev) => [...prev, idea]);
          try {
            await saveIdea(idea);
            toast.success('Idea created');
          } catch {
            toast.error('Failed to create idea');
          }
        }}
      />

      <StreamModal
        isOpen={modalType === 'stream'}
        onClose={() => setModalType(null)}
        onAdd={async (name, leader) => {
          const newStream: Stream = { id: `s_${crypto.randomUUID()}`, name, leader, substreams: [] };
          setStreams((prev) => [...prev, newStream]);
          try {
            await saveStream(newStream);
            toast.success('Stream created');
          } catch {
            toast.error('Failed to create stream');
          }
        }}
      />

      <SubstreamModal
        isOpen={modalType === 'substream'}
        onClose={() => { setModalType(null); setSubstreamParent(null); }}
        onAdd={async (name, leader) => {
          if (!substreamParent) return;
          const updated = streams.map((s) =>
            s.id === substreamParent
              ? { ...s, substreams: [...s.substreams, { id: `ss_${crypto.randomUUID()}`, name, leader: leader || '[NOME]' }] }
              : s
          );
          setStreams(updated);
          const stream = updated.find((s) => s.id === substreamParent);
          if (stream) {
            try {
              await saveStream(stream);
              toast.success('Substream created');
            } catch {
              toast.error('Failed to create substream');
            }
          }
        }}
      />

      {/* Board */}
      <div className="overflow-x-auto pb-3">
        <div className="min-w-[1200px]">
          {/* Headers */}
          <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '260px repeat(6, 1fr)' }}>
            <div className="px-3 py-2 text-[10px] font-bold text-brand-muted uppercase tracking-widest">
              Stream / Substream
            </div>
            {KANBAN_COLUMNS.map((col) => (
              <div
                key={col.id}
                className="px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-t-sm"
                style={{ color: col.color, background: col.bg, borderBottom: `3px solid ${col.color}` }}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Streams */}
          {visibleStreams.map((st) => {
            const hasSubs = st.substreams.length > 0;
            const directIdeas = ideas.filter((n) => n.streamId === st.id && !n.substreamId);

            return (
              <div key={st.id} className="mb-1.5">
                {/* Stream row */}
                {hasSubs ? (
                  /* Full-width label when stream has substreams — no empty kanban cells */
                  <div className="px-3 py-1.5 mb-0.5 bg-brand-gold/10 border-l-4 border-brand-gold flex items-center gap-2 rounded-sm">
                    <div className="font-bold text-sm text-brand-title">{displayStreamName(st.name)}</div>
                    <div className="flex-1" />
                    <Button
                      size="sm"
                      className="px-1.5 py-1 text-[10px]"
                      onClick={() => { setSubstreamParent(st.id); setModalType('substream'); }}
                    >
                      <PlusIcon size={12} />
                    </Button>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleDeleteStream(st.id, st.name)}
                      className="text-red-500/30 hover:text-red-500 p-1 transition-colors"
                      title="Delete stream"
                    >
                      <TrashIcon size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-1" style={{ gridTemplateColumns: '260px repeat(6, 1fr)' }}>
                    <div className="p-3 bg-brand-gold/10 rounded-sm border-l-4 border-brand-gold flex items-center gap-2">
                      <div className="w-[18px]" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-brand-title truncate">{displayStreamName(st.name)}</div>
                      </div>
                      <Button
                        size="sm"
                        className="px-1.5 py-1 text-[10px]"
                        onClick={() => { setSubstreamParent(st.id); setModalType('substream'); }}
                      >
                        <PlusIcon size={12} />
                      </Button>
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleDeleteStream(st.id, st.name)}
                        className="text-red-500/30 hover:text-red-500 p-1 transition-colors"
                        title="Delete stream"
                      >
                        <TrashIcon size={12} />
                      </button>
                    </div>
                    {KANBAN_COLUMNS.map((col) => (
                      <KanbanCell
                        key={col.id}
                        col={col}
                        items={directIdeas.filter((n) => n.col === col.id)}
                        onDrop={(e) => handleDrop(e, col.id, st.id, null)}
                        onDragStart={handleDragStart}
                        onDelete={setConfirmDeleteIdeaId}
                        onSelect={(id) => setSelectedIdeaId((prev) => prev === id ? null : id)}
                        selectedId={selectedIdeaId}
                        dragId={dragId}
                      />
                    ))}
                  </div>
                )}

                {/* Substream rows */}
                {hasSubs && st.substreams.map((ss) => {
                  const ssIdeas = ideas.filter((n) => n.substreamId === ss.id);
                  return (
                    <div key={ss.id} className="grid gap-1 mt-0.5" style={{ gridTemplateColumns: '260px repeat(6, 1fr)' }}>
                      <div className="p-2 pl-10 bg-brand-ice rounded-sm border-l-4 border-gray-200 flex items-center gap-2">
                        <span className="text-[10px] text-brand-muted leading-none">└</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-brand-body truncate">{ss.name}</div>
                        </div>
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleDeleteSubstream(st.id, ss.id, ss.name)}
                          className="text-red-500/30 hover:text-red-500 p-1 transition-colors"
                          title="Delete substream"
                        >
                          <TrashIcon size={12} />
                        </button>
                      </div>
                      {KANBAN_COLUMNS.map((col) => (
                        <KanbanCell
                          key={col.id}
                          col={col}
                          items={ssIdeas.filter((n) => n.col === col.id)}
                          onDrop={(e) => handleDrop(e, col.id, st.id, ss.id)}
                          onDragStart={handleDragStart}
                          onDelete={setConfirmDeleteIdeaId}
                              onSelect={(id) => setSelectedIdeaId((prev) => prev === id ? null : id)}
                          selectedId={selectedIdeaId}
                          dragId={dragId}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap mt-3 p-3 bg-brand-ice rounded-sm">
        {KANBAN_COLUMNS.map((col) => (
          <div key={col.id} className="flex items-center gap-2 text-xs text-brand-muted">
            <div className="w-3 h-3 rounded-sm" style={{ background: col.color }} />
            {col.label}
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteIdeaId}
        title="Eliminare questa idea?"
        message="Questa azione non può essere annullata."
        onConfirm={handleDeleteIdeaConfirm}
        onCancel={() => setConfirmDeleteIdeaId(null)}
      />

      {/* Idea Detail Panel */}
      {selectedIdeaId && (() => {
        const idea = ideas.find((i) => i.id === selectedIdeaId);
        if (!idea) return null;
        const stream = streams.find((s) => s.id === idea.streamId);
        const substream = stream?.substreams.find((ss) => ss.id === idea.substreamId);
        const column = KANBAN_COLUMNS.find((c) => c.id === idea.col);
        return (
          <div ref={detailRef} className="mt-6 border border-gray-200 rounded-sm bg-brand-surface animate-fade-in scroll-mt-6">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-brand-muted">#{idea.ideaId}</span>
                <h2 className="font-heading text-base text-brand-title">{idea.text}</h2>
                {column && (
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm"
                    style={{ background: column.bg, color: column.color, border: `1px solid ${column.color}40` }}
                  >
                    {column.label}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedIdeaId(null)}
                className="text-brand-muted hover:text-brand-body p-1 transition-colors"
                title="Chiudi"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Panel body */}
            <div className="p-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Stream / Substream */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-brand-muted mb-1">Stream</div>
                <div className="text-sm text-brand-body">
                  {stream?.name ?? '—'}
                  {substream && (
                    <span className="text-brand-muted"> › {substream.name}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              {idea.description && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-brand-muted mb-1">Descrizione</div>
                  <div className="text-sm text-brand-body">{idea.description}</div>
                </div>
              )}

              {/* AS IS */}
              {idea.partenza && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-brand-muted mb-1">AS IS — Punto di partenza</div>
                  <div className="text-sm text-brand-body whitespace-pre-wrap">{idea.partenza}</div>
                </div>
              )}

              {/* TO BE */}
              {idea.arrivo && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-brand-muted mb-1">TO BE — Punto d'arrivo</div>
                  <div className="text-sm text-brand-body whitespace-pre-wrap">{idea.arrivo}</div>
                </div>
              )}

              {/* Empty state */}
              {!idea.description && !idea.partenza && !idea.arrivo && (
                <div className="sm:col-span-2 text-brand-muted text-sm italic">
                  Nessun dettaglio aggiunto per questa idea.
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// Kanban Cell Component
interface KanbanCellProps {
  col: (typeof KANBAN_COLUMNS)[number];
  items: Idea[];
  onDrop: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
  dragId: string | null;
}

const KanbanCell = ({ col, items, onDrop, onDragStart, onDelete, onSelect, selectedId, dragId }: KanbanCellProps) => {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
      onDrop={(e) => { onDrop(e); setIsOver(false); }}
      onDragEnter={() => setIsOver(true)}
      onDragLeave={() => setIsOver(false)}
      className={`rounded-sm p-1.5 min-h-[44px] flex flex-col gap-1 transition-colors ${
        isOver ? 'bg-brand-gold/10' : 'bg-brand-ice/50'
      }`}
    >
      {items.map((p) => (
        <div
          key={p.id}
          draggable
          onDragStart={(e) => onDragStart(e, p.id)}
          onClick={() => onSelect(p.id)}
          className={`px-2 py-1.5 rounded-sm text-xs font-semibold cursor-pointer relative shadow-sm hover:scale-105 hover:-rotate-1 transition-transform ${
            dragId === p.id ? 'opacity-40' : ''
          }`}
          style={{
            background: col.color,
            color: '#1E293B',
            paddingRight: '28px',
            outline: selectedId === p.id ? '2px solid rgba(255,255,255,0.7)' : 'none',
            outlineOffset: '1px',
          }}
        >
          {p.text}
          <div className="absolute top-1 right-1">
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
              className="bg-black/10 rounded p-0.5"
            >
              <TrashIcon size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Idea Modal
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

  const targets = streams
    .filter((s) => s.name.toLowerCase() !== 'arad model')
    .flatMap((s) => [
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

// Stream Modal
interface StreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, leader: string) => void;
}

const StreamModal = ({ isOpen, onClose, onAdd }: StreamModalProps) => {
  const [name, setName] = useState('');
  const [leader, setLeader] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), leader.trim());
    setName(''); setLeader('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuovo Stream">
      <div className="space-y-3">
        <div>
          <Label>Nome Stream</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div>
          <Label>Leader</Label>
          <Input value={leader} onChange={(e) => setLeader(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-5">
        <Button onClick={onClose}>Annulla</Button>
        <Button variant="primary" onClick={handleSubmit}>Aggiungi</Button>
      </div>
    </Modal>
  );
};

// Substream Modal
const SubstreamModal = ({ isOpen, onClose, onAdd }: StreamModalProps) => {
  const [name, setName] = useState('');
  const [leader, setLeader] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), leader.trim());
    setName(''); setLeader('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuovo Substream">
      <div className="space-y-3">
        <div>
          <Label>Nome Substream</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div>
          <Label>Leader</Label>
          <Input value={leader} onChange={(e) => setLeader(e.target.value)} placeholder="[NOME]" />
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-5">
        <Button onClick={onClose}>Annulla</Button>
        <Button variant="primary" onClick={handleSubmit}>Aggiungi</Button>
      </div>
    </Modal>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] text-brand-muted uppercase tracking-wider mb-1">
    {children}
  </label>
);
