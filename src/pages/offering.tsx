import { useState, useEffect } from 'react';
import { Textarea, Input } from '../components/ui';
import { subscribeToAIOfferings, saveAIOffering } from '../services/firestore';
import type { AIOffering } from '../types';
import toast from 'react-hot-toast';

const INITIAL_OFFERINGS: AIOffering[] = [
  { id: 'o1', stream: 'Change Management / Formazione AI', title: 'AI Readiness Acceleration per Team Digital', description: 'Percorsi di accelerazione guidati per incrementare competenze team digital.', valueProp: "Non è formazione, è un'accelerazione dell'evoluzione delle competenze.", sforzo: 4.2, appetibilita: 9.2, noteAM: 'No brainer' },
  { id: 'o2', stream: 'Change Management / Formazione AI', title: 'AI Leadership - Ongoing Coaching', description: "Percorsi di aggiornamento e accompagnamento per il management retail sull'AI.", valueProp: 'Contenuto per tutte le aree retail + aggiornamento gestito con capacità critica.', sforzo: 7.2, appetibilita: 9.2, noteAM: 'Solo se con Mida' },
  { id: 'o3', stream: 'Change Management / Formazione AI', title: 'Org AI Readiness Check', description: "Valutazione rapida della readiness AI di un'organizzazione tramite agenti.", valueProp: 'Assessment che allestisce una knowledge base aziendale.', sforzo: 7.0, appetibilita: 8.0, noteAM: 'Solo se con Mida e tool proprietario' },
  { id: 'o4', stream: 'Ways of Working', title: 'Slideless Delivery', description: 'Sostituire presentazioni con interfacce web interattive navigabili.', valueProp: 'Maggior engagement, posizionamento AI-native.', sforzo: 4.0, appetibilita: 8.0, noteAM: 'Add-on del AI Readiness Acceleration' },
  { id: 'o5', stream: 'Ways of Working', title: 'Doc Automation for Commercial Teams', description: 'Piattaforma per generazione automatica di contratti e proposte commerciali.', valueProp: 'Documenti standard 75% uguali. Da proposta a offerta in pochi click.', sforzo: 6.0, appetibilita: 6.0, noteAM: 'Non congruo per AI offering esterna' },
  { id: 'o6', stream: 'Ways of Working', title: 'Knowledge Hub', description: 'Infrastruttura per strutturare il dato disordinato in formato JSON.', valueProp: 'Trasformare knowledge in asset aziendale permanente.', sforzo: 8.0, appetibilita: 4.0, noteAM: 'Add-on del AI Readiness Acceleration' },
  { id: 'o7', stream: 'Agentic-Commerce', title: 'Agent-Readiness Audit & Strategy', description: 'Assessment strutturato della readiness per agenti AI autonomi.', valueProp: 'ARAD presidia lo spazio tra SEO e consulenza luxury.', sforzo: 3.8, appetibilita: 8.8, noteAM: 'No brainer.' },
  { id: 'o8', stream: 'Agentic-Commerce', title: 'AI Commerce Content Engine', description: 'Sistema di produzione contenuti commerce per il nuovo ecosistema AI.', valueProp: 'Ponte tra linguaggio luxury e architettura tecnica AI-readable.', sforzo: 6.8, appetibilita: 8.8, noteAM: 'Long shot, valutare partner.' },
  { id: 'o9', stream: 'Agentic-Commerce', title: 'AI Commerce Analytics & Attribution', description: 'Ridisegnare il framework di measurement per nuovi touchpoint AI.', valueProp: 'Bundling naturale con qualsiasi intervento AI commerce.', sforzo: 5.0, appetibilita: 7.0, noteAM: 'Partnership con Search Bridge' },
  { id: 'o10', stream: 'Agentic-Commerce', title: 'Post-Purchase & Returns Intelligence', description: 'Agenti AI che predicono probabilità di reso e attivano retention proattive.', valueProp: 'ROI diretto: riduzione reso 10-20%.', sforzo: 6.0, appetibilita: 8.0, noteAM: 'Effort elevato' },
  { id: 'o11', stream: 'Agentic-Commerce', title: 'Dynamic Pricing Intelligence', description: 'Pricing intelligence brand-safe per marketplace.', valueProp: 'Layer di intelligenza tra tool di pricing e brand luxury.', sforzo: 7.0, appetibilita: 8.0, noteAM: 'Wishful thinking' },
  { id: 'o12', stream: 'Ways of Working', title: 'AI Augmented Assessment', description: "Core business potenziato dall'AI per assessment interni.", valueProp: 'Assessment più veloci tramite voice + knowledge base.', sforzo: 9.0, appetibilita: 7.0, noteAM: 'Non chiaro il cliente target' },
];

const STREAM_COLORS: Record<string, string> = {
  'Change Management / Formazione AI': '#F59E0B',
  'Ways of Working': '#6366F1',
  'Agentic-Commerce': '#22C55E',
};

export const OfferingPage = () => {
  const [data, setData] = useState<AIOffering[]>(INITIAL_OFFERINGS);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [view, setView] = useState<'table' | 'matrix'>('table');

  useEffect(() => {
    setLoading(false);
    const unsubscribe = subscribeToAIOfferings((offerings) => {
      if (offerings.length > 0) setData(offerings);
    });
    return unsubscribe;
  }, []);

  // Local update only (no Firestore save)
  const handleUpdateLocal = (id: string, field: keyof AIOffering, value: string | number) => {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // Save to Firestore on blur
  const handleSave = async (id: string) => {
    const offering = data.find((o) => o.id === id);
    if (offering) {
      try {
        await saveAIOffering(offering);
      } catch {
        toast.error('Failed to save changes');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-slate-500 py-12">Loading...</div>;
  }

  const matrixData = data.map((d) => ({
    id: d.id,
    title: d.title,
    stream: d.stream,
    x: 10 - d.sforzo,
    y: d.appetibilita,
    noteAM: d.noteAM,
  }));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <h1 className="font-mono text-2xl font-bold">AI Offering Decision Sheet</h1>
        <div className="flex gap-1 bg-slate-800/60 rounded-lg p-0.5">
          <button
            onClick={() => setView('table')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              view === 'table' ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tabella
          </button>
          <button
            onClick={() => setView('matrix')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              view === 'matrix' ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matrice
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <OfferTable
          data={data}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          onUpdateLocal={handleUpdateLocal}
          onSave={handleSave}
        />
      ) : (
        <DecisionMatrix data={matrixData} />
      )}
    </div>
  );
};

interface OfferTableProps {
  data: AIOffering[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onUpdateLocal: (id: string, field: keyof AIOffering, value: string | number) => void;
  onSave: (id: string) => void;
}

const OfferTable = ({ data, expandedId, setExpandedId, onUpdateLocal, onSave }: OfferTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {['Stream', 'Titolo', 'Sforzo', 'Appetibilità', 'Score', 'Note AM'].map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-primary-300 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r) => {
            const score = ((10 - r.sforzo) + r.appetibilita).toFixed(1);
            const isExpanded = expandedId === r.id;
            const color = STREAM_COLORS[r.stream] || '#6366F1';

            return (
              <>
                <tr
                  key={r.id}
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  className={`cursor-pointer border-b border-slate-700/30 ${
                    isExpanded ? 'bg-primary-500/5' : 'hover:bg-primary-500/5'
                  }`}
                >
                  <td className="px-3 py-3 border-l-[3px]" style={{ borderLeftColor: color }}>
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded"
                      style={{ background: `${color}22`, color }}
                    >
                      {r.stream}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold max-w-[300px]">{r.title}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`px-2.5 py-1 rounded font-bold ${
                        r.sforzo > 7
                          ? 'bg-red-500/20 text-red-400'
                          : r.sforzo > 5
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {r.sforzo}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`px-2.5 py-1 rounded font-bold ${
                        r.appetibilita >= 8
                          ? 'bg-green-500/20 text-green-400'
                          : r.appetibilita >= 6
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {r.appetibilita}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`font-mono font-bold text-base ${
                        parseFloat(score) >= 12
                          ? 'text-green-400'
                          : parseFloat(score) >= 9
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {score}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Textarea
                      value={r.noteAM}
                      onChange={(e) => {
                        e.stopPropagation();
                        onUpdateLocal(r.id, 'noteAM', e.target.value);
                      }}
                      onBlur={() => onSave(r.id)}
                      onClick={(e) => e.stopPropagation()}
                      rows={1}
                      className="min-w-[180px]"
                    />
                  </td>
                </tr>
                {isExpanded && (
                  <tr key={`${r.id}-detail`}>
                    <td colSpan={6} className="px-3 pb-4">
                      <div className="bg-slate-900/50 rounded-xl p-5 mt-1 grid grid-cols-2 gap-4">
                        <div>
                          <Label>Descrizione</Label>
                          <Textarea
                            value={r.description}
                            onChange={(e) => onUpdateLocal(r.id, 'description', e.target.value)}
                            onBlur={() => onSave(r.id)}
                            rows={4}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label>Value Proposition</Label>
                          <Textarea
                            value={r.valueProp}
                            onChange={(e) => onUpdateLocal(r.id, 'valueProp', e.target.value)}
                            onBlur={() => onSave(r.id)}
                            rows={4}
                            className="mt-1.5"
                          />
                        </div>
                        <div className="col-span-2 flex gap-4">
                          <div>
                            <Label>Sforzo (1-10)</Label>
                            <Input
                              type="number"
                              min={0}
                              max={10}
                              step={0.1}
                              value={r.sforzo}
                              onChange={(e) => onUpdateLocal(r.id, 'sforzo', parseFloat(e.target.value) || 0)}
                              onBlur={() => onSave(r.id)}
                              className="w-[100px] mt-1.5"
                            />
                          </div>
                          <div>
                            <Label>Appetibilità (1-10)</Label>
                            <Input
                              type="number"
                              min={0}
                              max={10}
                              step={0.1}
                              value={r.appetibilita}
                              onChange={(e) => onUpdateLocal(r.id, 'appetibilita', parseFloat(e.target.value) || 0)}
                              onBlur={() => onSave(r.id)}
                              className="w-[100px] mt-1.5"
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

interface MatrixPoint {
  id: string;
  title: string;
  stream: string;
  x: number;
  y: number;
  noteAM: string;
}

const DecisionMatrix = ({ data }: { data: MatrixPoint[] }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const W = 700;
  const H = 500;
  const P = 60;

  const tX = (v: number) => P + (v / 10) * (W - P * 2);
  const tY = (v: number) => H - P - (v / 10) * (H - P * 2);

  return (
    <div className="bg-slate-800/40 rounded-2xl p-6 overflow-hidden">
      <div className="flex gap-4 mb-4 flex-wrap">
        {Object.entries(STREAM_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            {name}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px] h-auto">
          {/* Quadrants */}
          <rect x={tX(5)} y={tY(10)} width={tX(10) - tX(5)} height={tY(5) - tY(10)} fill="rgba(34,197,94,0.06)" />
          <rect x={tX(0)} y={tY(10)} width={tX(5) - tX(0)} height={tY(5) - tY(10)} fill="rgba(251,191,36,0.06)" />
          <rect x={tX(5)} y={tY(5)} width={tX(10) - tX(5)} height={tY(0) - tY(5)} fill="rgba(251,191,36,0.04)" />
          <rect x={tX(0)} y={tY(5)} width={tX(5) - tX(0)} height={tY(0) - tY(5)} fill="rgba(239,68,68,0.04)" />

          {/* Quadrant labels */}
          <text x={tX(7.5)} y={tY(9.3)} fill="#4ADE80" fontSize="11" textAnchor="middle" opacity="0.6" fontWeight="700">
            🎯 GO
          </text>
          <text x={tX(2.5)} y={tY(9.3)} fill="#FBBF24" fontSize="11" textAnchor="middle" opacity="0.6" fontWeight="700">
            ⚠️ VALUTA
          </text>
          <text x={tX(7.5)} y={tY(0.8)} fill="#94A3B8" fontSize="10" textAnchor="middle" opacity="0.4">
            FACILE MA BASSA APP.
          </text>
          <text x={tX(2.5)} y={tY(0.8)} fill="#F87171" fontSize="10" textAnchor="middle" opacity="0.4">
            ❌ SKIP
          </text>

          {/* Grid lines */}
          {[0, 2, 4, 5, 6, 8, 10].map((v) => (
            <g key={v}>
              <line x1={tX(v)} y1={tY(0)} x2={tX(v)} y2={tY(10)} stroke="rgba(99,102,241,0.08)" />
              <line x1={tX(0)} y1={tY(v)} x2={tX(10)} y2={tY(v)} stroke="rgba(99,102,241,0.08)" />
            </g>
          ))}

          {/* Axes */}
          <line x1={tX(0)} y1={tY(0)} x2={tX(10)} y2={tY(0)} stroke="#475569" strokeWidth="1.5" />
          <line x1={tX(0)} y1={tY(0)} x2={tX(0)} y2={tY(10)} stroke="#475569" strokeWidth="1.5" />

          {/* Axis labels */}
          <text x={tX(5)} y={H - 8} fill="#94A3B8" fontSize="12" textAnchor="middle" fontWeight="600">
            Fattibilità (10 - Sforzo) →
          </text>
          <text
            x={12}
            y={tY(5)}
            fill="#94A3B8"
            fontSize="12"
            textAnchor="middle"
            fontWeight="600"
            transform={`rotate(-90,12,${tY(5)})`}
          >
            Appetibilità →
          </text>

          {/* Axis values */}
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <g key={v}>
              <text x={tX(v)} y={H - P + 18} fill="#64748B" fontSize="10" textAnchor="middle">
                {v}
              </text>
              <text x={P - 10} y={tY(v) + 4} fill="#64748B" fontSize="10" textAnchor="end">
                {v}
              </text>
            </g>
          ))}

          {/* Data points */}
          {data.map((d) => {
            const color = STREAM_COLORS[d.stream] || '#6366F1';
            const isHov = hovered === d.id;
            return (
              <g
                key={d.id}
                onMouseEnter={() => setHovered(d.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={tX(d.x)}
                  cy={tY(d.y)}
                  r={isHov ? 10 : 7}
                  fill={color}
                  opacity={isHov ? 1 : 0.75}
                  stroke={isHov ? 'white' : 'none'}
                  strokeWidth="2"
                  style={{ transition: 'all 0.2s' }}
                />
                {isHov && (
                  <g>
                    <rect
                      x={tX(d.x) + 14}
                      y={tY(d.y) - 36}
                      width={Math.min(d.title.length * 6.5 + 20, 260)}
                      height="48"
                      rx="6"
                      fill="#1E293B"
                      stroke="rgba(99,102,241,0.3)"
                    />
                    <text x={tX(d.x) + 24} y={tY(d.y) - 18} fill="#E2E8F0" fontSize="11" fontWeight="600">
                      {d.title.length > 38 ? d.title.slice(0, 38) + '...' : d.title}
                    </text>
                    <text x={tX(d.x) + 24} y={tY(d.y) - 3} fill="#94A3B8" fontSize="10">
                      {d.noteAM}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] text-primary-500 uppercase tracking-wider font-semibold">
    {children}
  </label>
);
