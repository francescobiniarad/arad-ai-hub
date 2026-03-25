import { useState, useEffect } from 'react';
import { subscribeToProposals, subscribeToStreams } from '../services/firestore';
import type { Proposal, Stream } from '../types';

export const PropostePage = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

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
          <p className="text-brand-muted/60 text-xs mt-2 italic">Le proposte inviate tramite "Proponi un'idea" appariranno qui.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Titolo', 'Descrizione', 'Perché', 'AS IS', 'TO BE', 'Stream', 'ROI', 'Tipologia', 'Data'].map((h) => (
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
                const stream = streams.find((s) => s.id === p.streamId);
                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-brand-ice align-top">
                    <td className="px-3 py-2.5 font-medium text-brand-title min-w-[140px] max-w-[200px]">{p.titolo}</td>
                    <td className="px-3 py-2.5 text-brand-body text-xs min-w-[160px] max-w-[220px] whitespace-pre-wrap">{p.descrizione || '—'}</td>
                    <td className="px-3 py-2.5 text-brand-body text-xs min-w-[140px] max-w-[200px] whitespace-pre-wrap">{p.perche || '—'}</td>
                    <td className="px-3 py-2.5 text-brand-body text-xs min-w-[140px] max-w-[200px] whitespace-pre-wrap">{p.asIs || '—'}</td>
                    <td className="px-3 py-2.5 text-brand-body text-xs min-w-[140px] max-w-[200px] whitespace-pre-wrap">{p.toBe || '—'}</td>
                    <td className="px-3 py-2.5 text-brand-muted text-xs whitespace-nowrap">{stream?.name || '—'}</td>
                    <td className="px-3 py-2.5 text-brand-body text-xs min-w-[140px] max-w-[200px] whitespace-pre-wrap">{p.roi || '—'}</td>
                    <td className="px-3 py-2.5 text-brand-muted text-xs whitespace-nowrap capitalize">{p.tipologia || '—'}</td>
                    <td className="px-3 py-2.5 text-brand-muted text-xs whitespace-nowrap">
                      {p.createdAt ? p.createdAt.toLocaleDateString('it-IT') : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
