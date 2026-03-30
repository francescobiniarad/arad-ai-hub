import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Modal, Button, Input, Textarea, Select } from '../components/ui';
import { BeakerIcon, GraduationCapIcon, RocketIcon } from '../components/icons';
import { subscribeToStreams, saveProposal } from '../services/firestore';
import { useAuth } from '../context/auth-context';
import type { Stream, ProposalType } from '../types';
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

const PROPOSAL_TYPES = [
  {
    id: 'idea' as ProposalType,
    label: 'Idea',
    desc: 'Proponi una nuova idea per un progetto AI interno o esterno',
    emoji: '💡',
  },
  {
    id: 'prototype' as ProposalType,
    label: 'Prototipo',
    desc: 'Hai già qualcosa da mostrare? Condividi il link al tuo prototipo',
    emoji: '🔗',
  },
  {
    id: 'practical' as ProposalType,
    label: 'Practical AI',
    desc: 'Proponi una sessione Practical AI per il team',
    emoji: '🎓',
  },
  {
    id: 'workshop' as ProposalType,
    label: 'Workshop AI',
    desc: 'Proponi un Workshop AI da organizzare',
    emoji: '🏢',
  },
];

const EMPTY_IDEA = { titolo: '', descrizione: '', perche: '', asIs: '', toBe: '', streamId: '', roi: '', tipologia: '' };
const EMPTY_PROTO = { link: '', cosa: '', descrizione: '', roi: '' };
const EMPTY_SESSION = { topic: '', why: '', teoria: '', pratica: '', isPresenter: false, when: '' };

export const HomePage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [proposalType, setProposalType] = useState<ProposalType | null>(null);
  const [ideaForm, setIdeaForm] = useState(EMPTY_IDEA);
  const [protoForm, setProtoForm] = useState(EMPTY_PROTO);
  const [sessionForm, setSessionForm] = useState(EMPTY_SESSION);
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
    setProposalType(null);
    setIdeaForm(EMPTY_IDEA);
    setProtoForm(EMPTY_PROTO);
    setSessionForm(EMPTY_SESSION);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (proposalType === 'idea') {
        if (!ideaForm.titolo.trim()) { toast.error('Inserisci un titolo'); setSubmitting(false); return; }
        await saveProposal({
          proposalType: 'idea',
          email: user?.email || '',
          titolo: ideaForm.titolo,
          descrizione: ideaForm.descrizione,
          perche: ideaForm.perche,
          asIs: ideaForm.asIs,
          toBe: ideaForm.toBe,
          streamId: ideaForm.streamId || null,
          roi: ideaForm.roi,
          tipologia: ideaForm.tipologia,
        });
      } else if (proposalType === 'prototype') {
        if (!protoForm.link.trim() && !protoForm.cosa.trim()) { toast.error('Inserisci almeno il link o una descrizione'); setSubmitting(false); return; }
        await saveProposal({
          proposalType: 'prototype',
          email: user?.email || '',
          prototypeLink: protoForm.link,
          prototypeCosa: protoForm.cosa,
          prototypeDescrizione: protoForm.descrizione,
          prototypeRoi: protoForm.roi,
        });
      } else if (proposalType === 'practical' || proposalType === 'workshop') {
        if (!sessionForm.topic.trim()) { toast.error('Inserisci un argomento'); setSubmitting(false); return; }
        await saveProposal({
          proposalType,
          email: user?.email || '',
          sessionTopic: sessionForm.topic,
          sessionWhy: sessionForm.why,
          sessionTeoria: sessionForm.teoria,
          sessionPratica: sessionForm.pratica,
          sessionIsPresenter: sessionForm.isPresenter,
          sessionWhen: sessionForm.when,
        });
      }
      toast.success('Proposta inviata!');
      handleClose();
    } catch {
      toast.error("Errore nell'invio della proposta");
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = proposalType
    ? PROPOSAL_TYPES.find((t) => t.id === proposalType)?.label || 'Proposta'
    : 'Cosa vuoi proporre?';

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

      {/* Proposal modal */}
      <Modal isOpen={showModal} onClose={handleClose} title={modalTitle} maxWidth="max-w-xl">
        {/* Step 1: type selector */}
        {!proposalType && (
          <div className="grid grid-cols-2 gap-3 mt-1">
            {PROPOSAL_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setProposalType(t.id)}
                className="text-left p-4 rounded-sm border border-gray-200 hover:border-brand-gold hover:bg-brand-gold/5 transition-colors group"
              >
                <div className="text-2xl mb-2">{t.emoji}</div>
                <div className="font-semibold text-sm text-brand-title group-hover:text-brand-gold transition-colors">{t.label}</div>
                <div className="text-xs text-brand-muted mt-1 leading-snug">{t.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2a: Idea form */}
        {proposalType === 'idea' && (
          <div className="space-y-3">
            <button onClick={() => setProposalType(null)} className="text-xs text-brand-muted hover:text-brand-gold mb-1">← Cambia tipo</button>
            <div>
              <Label>Titolo idea *</Label>
              <Input value={ideaForm.titolo} onChange={(e) => setIdeaForm((f) => ({ ...f, titolo: e.target.value }))} placeholder="Es. Automazione report clienti" />
            </div>
            <div>
              <Label>Descrizione</Label>
              <Textarea value={ideaForm.descrizione} onChange={(e) => setIdeaForm((f) => ({ ...f, descrizione: e.target.value }))} rows={2} placeholder="Di cosa si tratta?" />
            </div>
            <div>
              <Label>Perché questa idea?</Label>
              <Textarea value={ideaForm.perche} onChange={(e) => setIdeaForm((f) => ({ ...f, perche: e.target.value }))} rows={2} placeholder="Qual è il problema o l'opportunità?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>AS IS</Label>
                <Textarea value={ideaForm.asIs} onChange={(e) => setIdeaForm((f) => ({ ...f, asIs: e.target.value }))} rows={2} placeholder="Situazione attuale" />
              </div>
              <div>
                <Label>TO BE</Label>
                <Textarea value={ideaForm.toBe} onChange={(e) => setIdeaForm((f) => ({ ...f, toBe: e.target.value }))} rows={2} placeholder="Situazione futura" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Stream (opzionale)</Label>
                <Select value={ideaForm.streamId} onChange={(e) => setIdeaForm((f) => ({ ...f, streamId: e.target.value }))}>
                  <option value="">— Nessuno —</option>
                  {streams.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </div>
              <div>
                <Label>Tipologia</Label>
                <Select value={ideaForm.tipologia} onChange={(e) => setIdeaForm((f) => ({ ...f, tipologia: e.target.value }))}>
                  <option value="">— Seleziona —</option>
                  <option value="interno">Interno</option>
                  <option value="esterno">Esterno (Offering)</option>
                  <option value="entrambi">Entrambi</option>
                </Select>
              </div>
            </div>
            <div>
              <Label>Dove vediamo ROI?</Label>
              <Textarea value={ideaForm.roi} onChange={(e) => setIdeaForm((f) => ({ ...f, roi: e.target.value }))} rows={2} placeholder="Es. risparmio ore, nuovi ricavi, qualità output..." />
            </div>
            <FormActions onCancel={handleClose} onSubmit={handleSubmit} submitting={submitting} />
          </div>
        )}

        {/* Step 2b: Prototype form */}
        {proposalType === 'prototype' && (
          <div className="space-y-3">
            <button onClick={() => setProposalType(null)} className="text-xs text-brand-muted hover:text-brand-gold mb-1">← Cambia tipo</button>
            <div>
              <Label>Link al prototipo *</Label>
              <Input value={protoForm.link} onChange={(e) => setProtoForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://..." />
              {protoForm.link && (
                <a href={protoForm.link} target="_blank" rel="noopener noreferrer" className="text-brand-gold text-xs hover:underline mt-0.5 block">↗ Apri link</a>
              )}
            </div>
            <div>
              <Label>Cos'è questo prototipo?</Label>
              <Input value={protoForm.cosa} onChange={(e) => setProtoForm((f) => ({ ...f, cosa: e.target.value }))} placeholder="Una breve descrizione di cosa fa" />
            </div>
            <div>
              <Label>Descrizione</Label>
              <Textarea value={protoForm.descrizione} onChange={(e) => setProtoForm((f) => ({ ...f, descrizione: e.target.value }))} rows={3} placeholder="Come funziona, cosa risolve, come l'hai costruito..." />
            </div>
            <div>
              <Label>Dove vediamo ROI?</Label>
              <Textarea value={protoForm.roi} onChange={(e) => setProtoForm((f) => ({ ...f, roi: e.target.value }))} rows={2} placeholder="Es. risparmio ore, nuovi ricavi, qualità output..." />
            </div>
            <FormActions onCancel={handleClose} onSubmit={handleSubmit} submitting={submitting} />
          </div>
        )}

        {/* Step 2c: Practical AI / Workshop form (same fields) */}
        {(proposalType === 'practical' || proposalType === 'workshop') && (
          <div className="space-y-3">
            <button onClick={() => setProposalType(null)} className="text-xs text-brand-muted hover:text-brand-gold mb-1">← Cambia tipo</button>
            <div>
              <Label>Argomento *</Label>
              <Input value={sessionForm.topic} onChange={(e) => setSessionForm((f) => ({ ...f, topic: e.target.value }))} placeholder={proposalType === 'practical' ? 'Es. Come usare Claude per automatizzare email' : 'Es. Prompt Engineering per il team'} />
            </div>
            <div>
              <Label>Perché questo argomento?</Label>
              <Textarea value={sessionForm.why} onChange={(e) => setSessionForm((f) => ({ ...f, why: e.target.value }))} rows={2} placeholder="Cosa rende questo utile per il team?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Cosa mostriamo in teoria</Label>
                <Textarea value={sessionForm.teoria} onChange={(e) => setSessionForm((f) => ({ ...f, teoria: e.target.value }))} rows={2} placeholder="Concetti, contesto, spiegazione..." />
              </div>
              <div>
                <Label>Cosa mostriamo in pratica</Label>
                <Textarea value={sessionForm.pratica} onChange={(e) => setSessionForm((f) => ({ ...f, pratica: e.target.value }))} rows={2} placeholder="Demo, esercizi, hands-on..." />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="presenter-check"
                checked={sessionForm.isPresenter}
                onChange={(e) => setSessionForm((f) => ({ ...f, isPresenter: e.target.checked }))}
                className="accent-brand-gold w-4 h-4"
              />
              <label htmlFor="presenter-check" className="text-sm text-brand-body cursor-pointer">
                Voglio essere io il presenter di questa sessione
              </label>
            </div>
            {sessionForm.isPresenter && (
              <div>
                <Label>Quando potresti tenerla?</Label>
                <Input value={sessionForm.when} onChange={(e) => setSessionForm((f) => ({ ...f, when: e.target.value }))} placeholder="Es. settimana del 15 aprile, giovedì mattina..." />
              </div>
            )}
            <FormActions onCancel={handleClose} onSubmit={handleSubmit} submitting={submitting} />
          </div>
        )}
      </Modal>
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] text-brand-muted uppercase tracking-wider mb-1">
    {children}
  </label>
);

const FormActions = ({ onCancel, onSubmit, submitting }: { onCancel: () => void; onSubmit: () => void; submitting: boolean }) => (
  <div className="flex gap-2 justify-end mt-5">
    <Button onClick={onCancel}>Annulla</Button>
    <Button variant="primary" onClick={onSubmit} disabled={submitting}>
      {submitting ? 'Invio...' : 'Invia proposta'}
    </Button>
  </div>
);
