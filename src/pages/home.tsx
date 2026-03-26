import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Modal, Button, Input, Textarea, Select } from '../components/ui';
import { BeakerIcon, GraduationCapIcon, RocketIcon } from '../components/icons';
import { subscribeToStreams, saveProposal } from '../services/firestore';
import { useAuth } from '../context/auth-context';
import type { Stream } from '../types';
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
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([]);

  useEffect(() => {
    return subscribeToStreams(setStreams);
  }, []);

  useEffect(() => {
    const handler = () => setShowModal(true);
    window.addEventListener('open-proponi', handler);
    return () => window.removeEventListener('open-proponi', handler);
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
        <h1 className="font-heading text-4xl md:text-5xl mb-3">
          ARAD Digital AI Hub
        </h1>
        <p className="text-brand-muted text-base max-w-md mx-auto">
          Centro di comando interno per il tracking di tutte le iniziative AI.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-5xl mx-auto">
        {cards.filter((card) => card.id !== 'offering').map((card, index) => (
          <Link key={card.id} to={card.path} className="flex md:w-80">
            <Card hoverable gradient={card.gradient} className="h-full w-full" style={{ animationDelay: `${index * 100}ms` }}>
              <div
                className="w-14 h-14 rounded-sm flex items-center justify-center mb-5 text-white"
                style={{ background: card.gradient }}
              >
                {card.icon}
              </div>
              <h2 className="font-heading text-lg mb-2">{card.label}</h2>
              <p className="text-brand-muted text-sm leading-relaxed">{card.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Proponi un'idea modal */}
      <Modal isOpen={showModal} onClose={handleClose} title="Proponi un'idea" maxWidth="max-w-xl">
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
  <label className="block text-[10px] text-brand-muted uppercase tracking-wider mb-1">
    {children}
  </label>
);
