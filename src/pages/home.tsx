import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Modal, Button, Input, Textarea, Select } from '../components/ui';
import { BeakerIcon, GraduationCapIcon, RocketIcon } from '../components/icons';
import { subscribeToStreams, saveProposal, subscribeToProposals } from '../services/firestore';
import { useAuth } from '../context/auth-context';
import type { Stream, Proposal } from '../types';
import toast from 'react-hot-toast';

const cards = [
  {
    id: 'rd',
    label: 'R&D',
    desc: 'Kanban board e tabella idee per il tracking degli stream AI interni.',
    icon: <BeakerIcon />,
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    path: '/rd',
  },
  {
    id: 'formazione',
    label: 'Formazione AI',
    desc: 'Certificazioni, workshop, sessioni pratiche e gamification.',
    icon: <GraduationCapIcon />,
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    path: '/formazione',
  },
  {
    id: 'offering',
    label: 'AI Offering',
    desc: 'Decision sheet per valutare e prioritizzare le idee di servizio AI.',
    icon: <RocketIcon />,
    gradient: 'linear-gradient(135deg, #22C55E, #06B6D4)',
    path: '/offering',
  },
];

const EMPTY_FORM = {
  titolo: '',
  descrizione: '',
  perche: '',
  asIs: '',
  toBe: '',
  streamId: '',
  roi: '',
  tipologia: '',
};

export const HomePage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showProposte, setShowProposte] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const unsub1 = subscribeToStreams(setStreams);
    const unsub2 = subscribeToProposals(setProposals);
    return () => { unsub1(); unsub2(); };
  }, []);

  useEffect(() => {
    const handler = () => setShowModal(true);
    window.addEventListener('open-proponi', handler);
    return () => window.removeEventListener('open-proponi', handler);
  }, []);

  useEffect(() => {
    const handler = () => setShowProposte(true);
    window.addEventListener('open-proposte', handler);
    return () => window.removeEventListener('open-proposte', handler);
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    if (!form.titolo.trim()) {
      toast.error("Inserisci un titolo per l'idea");
      return;
    }
    setSubmitting(true);
    try {
      await saveProposal({
        titolo: form.titolo,
        descrizione: form.descrizione,
        perche: form.perche,
        asIs: form.asIs,
        toBe: form.toBe,
        streamId: form.streamId || null,
        roi: form.roi,
        tipologia: form.tipologia,
        email: user?.email || '',
      });
      toast.success('Proposta inviata!');
      handleClose();
    } catch {
      toast.error("Errore nell'invio della proposta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-12 animate-fade-in">
      <div className="text-center mb-14">
        <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          ARAD Digital AI Hub
        </h1>
        <p className="text-slate-500 text-base max-w-md mx-auto">
          Centro di comando interno per il tracking di tutte le iniziative AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {cards.map((card, index) => (
          <Link key={card.id} to={card.path}>
            <Card
              hoverable
              gradient={card.gradient}
              className="h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-white"
                style={{ background: card.gradient }}
              >
                {card.icon}
              </div>
              <h2 className="font-mono text-xl font-bold mb-2">{card.label}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {card.desc}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <Modal isOpen={showProposte} onClose={() => setShowProposte(false)} title="📋 Proposte" maxWidth="max-w-6xl">
        {proposals.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">Nessuna proposta ancora ricevuta.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-500/20">
                  {['Titolo', 'Descrizione', 'Perché', 'AS IS', 'TO BE', 'Stream', 'ROI', 'Tipologia', 'Data'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-primary-300 bg-primary-500/10 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => {
                  const stream = streams.find((s) => s.id === p.streamId);
                  return (
                    <tr key={p.id} className="border-b border-slate-700/50 hover:bg-primary-500/5 align-top">
                      <td className="px-3 py-2 font-medium text-slate-200 min-w-[120px]">{p.titolo}</td>
                      <td className="px-3 py-2 text-slate-400 min-w-[150px] max-w-[180px]">{p.descrizione}</td>
                      <td className="px-3 py-2 text-slate-400 min-w-[130px] max-w-[160px]">{p.perche}</td>
                      <td className="px-3 py-2 text-slate-400 min-w-[130px] max-w-[160px]">{p.asIs}</td>
                      <td className="px-3 py-2 text-slate-400 min-w-[130px] max-w-[160px]">{p.toBe}</td>
                      <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{stream?.name || '—'}</td>
                      <td className="px-3 py-2 text-slate-400 min-w-[130px] max-w-[160px]">{p.roi}</td>
                      <td className="px-3 py-2 text-slate-400 whitespace-nowrap capitalize">{p.tipologia || '—'}</td>
                      <td className="px-3 py-2 text-slate-500 whitespace-nowrap text-xs">
                        {p.createdAt ? p.createdAt.toLocaleDateString('it-IT') : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal isOpen={showModal} onClose={handleClose} title="💡 Proponi un'idea" maxWidth="max-w-xl">
        {/* Same style as IdeaModal in kanban */}
        <div className="space-y-3">
          <div>
            <Label>Titolo idea *</Label>
            <Input value={form.titolo} onChange={(e) => setForm((f) => ({ ...f, titolo: e.target.value }))} placeholder="Es. Automazione report clienti" />
          </div>
          <div>
            <Label>Descrizione</Label>
            <Textarea value={form.descrizione} onChange={(e) => setForm((f) => ({ ...f, descrizione: e.target.value }))} rows={2} placeholder="Di cosa si tratta?" />
          </div>
          <div>
            <Label>Perché questa idea?</Label>
            <Textarea value={form.perche} onChange={(e) => setForm((f) => ({ ...f, perche: e.target.value }))} rows={2} placeholder="Qual è il problema o l'opportunità?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>AS IS</Label>
              <Textarea value={form.asIs} onChange={(e) => setForm((f) => ({ ...f, asIs: e.target.value }))} rows={2} placeholder="Situazione attuale" />
            </div>
            <div>
              <Label>TO BE</Label>
              <Textarea value={form.toBe} onChange={(e) => setForm((f) => ({ ...f, toBe: e.target.value }))} rows={2} placeholder="Situazione futura" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Stream (opzionale)</Label>
              <Select value={form.streamId} onChange={(e) => setForm((f) => ({ ...f, streamId: e.target.value }))}>
                <option value="">— Nessuno —</option>
                {streams.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Tipologia</Label>
              <Select value={form.tipologia} onChange={(e) => setForm((f) => ({ ...f, tipologia: e.target.value }))}>
                <option value="">— Seleziona —</option>
                <option value="interno">Interno</option>
                <option value="esterno">Esterno (Offering)</option>
                <option value="entrambi">Entrambi</option>
              </Select>
            </div>
          </div>
          <div>
            <Label>Dove vediamo ROI?</Label>
            <Textarea value={form.roi} onChange={(e) => setForm((f) => ({ ...f, roi: e.target.value }))} rows={2} placeholder="Es. risparmio ore, nuovi ricavi, qualità output..." />
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <Button onClick={handleClose}>Annulla</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Invio...' : 'Invia proposta'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
    {children}
  </label>
);
