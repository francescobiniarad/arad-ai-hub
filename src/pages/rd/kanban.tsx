import { useState, useEffect } from 'react';
import { Button, Modal, Input, Textarea, Select } from '../../components/ui';
import { PlusIcon, TrashIcon, EditIcon, ChevronDownIcon, ChevronRightIcon } from '../../components/icons';
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
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [modalType, setModalType] = useState<'idea' | 'stream' | 'substream' | 'editIdea' | null>(null);
  const [substreamParent, setSubstreamParent] = useState<string | null>(null);

  useEffect(() => {
    let seeded = false;

    const unsubStreams = subscribeToStreams(async (data) => {
      if (data.length > 0) {
        setStreams(data);
      } else if (!seeded) {
        // Firestore is empty - seed with initial data
        seeded = true;
        for (const stream of INITIAL_STREAMS) {
          await saveStream(stream);
        }
      }
      setLoading(false);
    });

    const unsubIdeas = subscribeToIdeas(async (data) => {
      if (data.length > 0) {
        setIdeas(data);
      } else if (!seeded) {
        // Firestore is empty - seed with initial ideas
        for (const idea of INITIAL_IDEAS) {
          await saveIdea(idea);
        }
      }
    });

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

  const handleDeleteIdea = async (id: string) => {
    setIdeas((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteIdea(id);
    } catch {
      toast.error('Failed to delete idea');
    }
  };

  const handleUpdateSubstreamLeaderLocal = (streamId: string, substreamId: string, leader: string) => {
    // Only update local state, don't save to Firestore yet
    setStreams((prev) => prev.map((s) =>
      s.id === streamId
        ? { ...s, substreams: s.substreams.map((ss) => ss.id === substreamId ? { ...ss, leader } : ss) }
        : s
    ));
  };

  const handleSaveSubstreamLeader = async (streamId: string) => {
    // Save the stream to Firestore when user finishes editing
    const stream = streams.find((s) => s.id === streamId);
    if (stream) {
      try {
        await saveStream(stream);
      } catch {
        toast.error('Failed to update leader');
      }
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

  const toggle = (id: string) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  if (loading) {
    return <div className="text-center text-slate-500 py-12">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <h1 className="font-mono text-2xl font-bold">Kanban</h1>
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
          const newStream: Stream = { id: `s${Date.now()}`, name, leader, substreams: [] };
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
              ? { ...s, substreams: [...s.substreams, { id: `ss${Date.now()}`, name, leader: leader || '[NOME]' }] }
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
            <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Stream / Substream
            </div>
            {KANBAN_COLUMNS.map((col) => (
              <div
                key={col.id}
                className="px-2 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-t-lg"
                style={{ color: col.color, background: col.bg, borderBottom: `3px solid ${col.color}` }}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Streams */}
          {streams.map((st) => {
            const isCollapsed = collapsed[st.id];
            const hasSubs = st.substreams.length > 0;
            const directIdeas = ideas.filter((n) => n.streamId === st.id && !n.substreamId);

            return (
              <div key={st.id} className="mb-1.5">
                {/* Stream row */}
                <div className="grid gap-1" style={{ gridTemplateColumns: '260px repeat(6, 1fr)' }}>
                  <div className="p-3 bg-primary-500/10 rounded-lg border-l-4 border-primary-500 flex items-center gap-2">
                    {hasSubs && (
                      <button onClick={() => toggle(st.id)} className="text-primary-300 p-0.5">
                        {isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
                      </button>
                    )}
                    {!hasSubs && <div className="w-[18px]" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{st.name}</div>
                      <div className="text-xs text-primary-300">{st.leader}</div>
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
                  {!hasSubs && KANBAN_COLUMNS.map((col) => (
                    <KanbanCell
                      key={col.id}
                      col={col}
                      items={directIdeas.filter((n) => n.col === col.id)}
                      onDrop={(e) => handleDrop(e, col.id, st.id, null)}
                      onDragStart={handleDragStart}
                      onDelete={handleDeleteIdea}
                      onEdit={() => setModalType('editIdea')}
                      dragId={dragId}
                    />
                  ))}
                  {hasSubs && KANBAN_COLUMNS.map((col) => (
                    <div key={col.id} className="bg-primary-500/5 rounded min-h-[12px]" />
                  ))}
                </div>

                {/* Substream rows */}
                {hasSubs && !isCollapsed && st.substreams.map((ss) => {
                  const ssIdeas = ideas.filter((n) => n.substreamId === ss.id);
                  return (
                    <div key={ss.id} className="grid gap-1 mt-0.5" style={{ gridTemplateColumns: '260px repeat(6, 1fr)' }}>
                      <div className="p-2 pl-10 bg-slate-800/40 rounded-md border-l-4 border-primary-500/25 flex items-center gap-2">
                        <span className="text-[10px] text-slate-600 leading-none">└</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-300 truncate">{ss.name}</div>
                          <input
                            value={ss.leader}
                            onChange={(e) => handleUpdateSubstreamLeaderLocal(st.id, ss.id, e.target.value)}
                            onBlur={() => handleSaveSubstreamLeader(st.id)}
                            className="bg-transparent border-b border-dashed border-primary-500/20 text-[10px] text-primary-300 py-0.5 w-24 outline-none focus:border-primary-500/50"
                            placeholder="[NOME]"
                          />
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
                          onDelete={handleDeleteIdea}
                          onEdit={() => setModalType('editIdea')}
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
      <div className="flex gap-4 flex-wrap mt-3 p-3 bg-slate-800/40 rounded-xl">
        {KANBAN_COLUMNS.map((col) => (
          <div key={col.id} className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-3 h-3 rounded" style={{ background: col.color }} />
            {col.label}
          </div>
        ))}
      </div>
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
  onEdit: () => void;
  dragId: string | null;
}

const KanbanCell = ({ col, items, onDrop, onDragStart, onDelete, onEdit, dragId }: KanbanCellProps) => {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
      onDrop={(e) => { onDrop(e); setIsOver(false); }}
      onDragEnter={() => setIsOver(true)}
      onDragLeave={() => setIsOver(false)}
      className={`rounded-md p-1.5 min-h-[44px] flex flex-col gap-1 transition-colors ${
        isOver ? 'bg-primary-500/10' : 'bg-slate-900/25'
      }`}
    >
      {items.map((p) => (
        <div
          key={p.id}
          draggable
          onDragStart={(e) => onDragStart(e, p.id)}
          className={`px-2 py-1.5 rounded text-xs font-semibold cursor-grab relative shadow-md hover:scale-105 hover:-rotate-1 transition-transform ${
            dragId === p.id ? 'opacity-40' : ''
          }`}
          style={{ background: col.color, color: '#1E293B', paddingRight: '38px' }}
        >
          {p.text}
          <div className="absolute top-1 right-1 flex gap-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="bg-black/10 rounded p-0.5"
            >
              <EditIcon size={12} />
            </button>
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
      id: `n${Date.now()}`,
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
    <Modal isOpen={isOpen} onClose={handleClose} title="💡 Nuova Idea" maxWidth="max-w-xl">
      {error && (
        <div className="bg-red-500/15 border border-red-500/30 rounded-lg px-3 py-2 mb-3 text-xs text-red-400">
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
  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
    {children}
  </label>
);
