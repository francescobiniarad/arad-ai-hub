import { useState, useEffect } from 'react';
import { subscribeToProposals, subscribeToStreams, deleteProposal } from '../services/firestore';
import { ConfirmDialog } from '../components/ui';
import { TrashIcon } from '../components/icons';
import type { Proposal, Stream } from '../types';

const TYPE_LABELS: Record<string, string> = {
  idea: 'Idea',
  prototype: 'Prototipo',
  practical: 'Practical AI',
  workshop: 'Workshop AI',
};

const TYPE_COLORS: Record<string, string> = {
  idea: 'bg-blue-100 text-blue-700',
  prototype: 'bg-purple-100 text-purple-700',
  practical: 'bg-green-100 text-green-700',
  workshop: 'bg-orange-100 text-orange-700',
};

export const PropostePage = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    const unsub1 = subscribeToProposals(
      setProposals,
      (error) => console.error('Proposte error:', error)
    );
    const unsub2 = subscribeToStreams(
      setStreams,
      (error) => console.error('Proposte streams error:', error)
    );
    return () => { unsub1(); unsub2(); };
  }, []);

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setProposals((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteProposal(id);
    } catch {
      // Error is non-fatal; listener will resync
    }
  };

  const getTitle = (p: Proposal) =>
    p.titolo || p.prototypeCosa || p.sessionTopic || '—';

  const getDescrizione = (p: Proposal) =>
    p.descrizione || p.prototypeDescrizione || p.sessionWhy || '—';

  if (loading) {
    return <div className="text-center text-brand-muted py-12">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <h1 className="font-heading text-2xl">Tutte le proposte</h1>
        {proposals.length > 0 && (
          <span className="text-xs text-brand-muted">{proposals.length} proposta{proposals.length !== 1 ? 'e' : ''}</span>
        )}
      </div>

      {proposals.length === 0 ? (
        <div className="rounded-sm border border-dashed border-brand-gold/30 bg-brand-ice p-12 text-center">
          <p className="text-brand-muted text-sm">Nessuna proposta ancora ricevuta.</p>
          <p className="text-brand-muted/60 text-xs mt-2 italic">Le proposte inviate tramite il pulsante "Proponi" appariranno qui.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Tipo', 'Titolo / Argomento', 'Descrizione / Perché', 'Dettagli', 'Stream', 'Data', ''].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-brand-gold bg-brand-gold/5 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => {
                const type = p.proposalType || 'idea';
                const stream = streams.find((s) => s.id === p.streamId);

                // Build a "details" summary specific to each type
                let details = '—';
                if (type === 'idea') {
                  const parts = [p.asIs && `AS IS: ${p.asIs}`, p.toBe && `TO BE: ${p.toBe}`, p.roi && `ROI: ${p.roi}`].filter(Boolean);
                  details = parts.join(' · ') || '—';
                } else if (type === 'prototype') {
                  details = p.prototypeLink
                    ? `Link: ${p.prototypeLink}${p.prototypeRoi ? ` · ROI: ${p.prototypeRoi}` : ''}`
                    : p.prototypeRoi || '—';
                } else if (type === 'practical' || type === 'workshop') {
                  const parts = [
                    p.sessionTeoria && `Teoria: ${p.sessionTeoria}`,
                    p.sessionPratica && `Pratica: ${p.sessionPratica}`,
                    p.sessionIsPresenter && 'Vuole presentare',
                    p.sessionWhen && `Disponibile: ${p.sessionWhen}`,
                  ].filter(Boolean);
                  details = parts.join(' · ') || '—';
                }

                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-brand-ice align-top">
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${TYPE_COLORS[type] || TYPE_COLORS.idea}`}>
                        {TYPE_LABELS[type] || type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-brand-title min-w-[140px] max-w-[200px]">
                      {getTitle(p)}
                    </td>
                    <td className="px-3 py-2.5 text-brand-body text-xs min-w-[160px] max-w-[220px] whitespace-pre-wrap">
                      {getDescrizione(p)}
                    </td>
                    <td className="px-3 py-2.5 text-brand-body text-xs min-w-[160px] max-w-[260px] whitespace-pre-wrap">
                      {type === 'prototype' && p.prototypeLink ? (
                        <a href={p.prototypeLink} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline break-all">
                          ↗ {p.prototypeLink}
                        </a>
                      ) : details}
                    </td>
                    <td className="px-3 py-2.5 text-brand-muted text-xs whitespace-nowrap">{stream?.name || '—'}</td>
                    <td className="px-3 py-2.5 text-brand-muted text-xs whitespace-nowrap">
                      {p.createdAt ? p.createdAt.toLocaleDateString('it-IT') : '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setConfirmDeleteId(p.id)}
                        className="text-red-500/30 hover:text-red-500 p-1 transition-colors"
                        title="Elimina proposta"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Eliminare questa proposta?"
        message="Questa azione non può essere annullata."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
