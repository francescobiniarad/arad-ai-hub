import { useState, useEffect } from 'react';
import { Button, Input, Textarea, ConfirmDialog } from '../../components/ui';
import { PlusIcon, TrashIcon } from '../../components/icons';
import { subscribeToCertifications, saveCertification, deleteCertification } from '../../services/firestore';
import type { Certification } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_CERTS: Certification[] = [
  { id: 'c1', name: 'Google AI Essentials', provider: 'Google', description: 'Base AIME mettere Gemma AI modelli base e intro', level: 'Base', members: '' },
  { id: 'c2', name: 'Google Prompting Essentials', provider: 'Google', description: 'Imparare a scrivere prompt efficaci', level: 'Base', members: '' },
  { id: 'c3', name: 'Generative AI Leader', provider: 'Google', description: 'Come far trasformare le aziende, cioè il tipo è PBO leader', level: 'Intermedio', members: '' },
  { id: 'c4', name: 'AI Board Meta', provider: 'Meta', description: '57 video/25 Hr Mid course fra le varie research Field', level: 'Avanzato', members: '' },
  { id: 'c5', name: 'Gemini Enterprise & NotebookLM', provider: 'Google', description: 'Configurazione Gemini per aziende e gestione agenti AI personalizzati', level: 'Intermedio', members: '' },
];

export const CertificazioniPage = () => {
  const [data, setData] = useState<Certification[]>(INITIAL_CERTS);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false); // Show initial data immediately
    const unsubscribe = subscribeToCertifications((certs) => {
      if (certs.length > 0) {
        setData(certs);
      }
    });
    return unsubscribe;
  }, []);

  // Local update only (no Firestore save)
  const handleUpdateLocal = (id: string, field: keyof Certification, value: string) => {
    setData((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  // Save to Firestore on blur
  const handleSave = async (id: string) => {
    const cert = data.find((c) => c.id === id);
    if (cert) {
      try {
        await saveCertification(cert);
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
      await deleteCertification(confirmDeleteId);
    } catch {
      toast.error('Failed to delete certification');
    }
  };

  const handleAdd = () => {
    const newCert: Certification = {
      id: `c_${crypto.randomUUID()}`,
      name: '',
      provider: '',
      description: '',
      level: '',
      members: '',
    };
    setData((prev) => [...prev, newCert]);
  };

  if (loading) {
    return <div className="text-center text-brand-muted py-12">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl mb-3">Certificazioni AI</h1>
      <p className="text-brand-muted text-sm leading-relaxed mb-7 max-w-3xl">
        Il team prenderà parte alle certificazioni AI offerte da Google, proposte in base al livello e al ruolo. Costo sostenuto da ARAD. Ognuno procederà in autonomia.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {['Certificazione', 'Provider', 'Descrizione', 'Partecipanti', ''].map((h) => (
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
                    value={row.name}
                    onChange={(e) => handleUpdateLocal(row.id, 'name', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    className="min-w-[180px]"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={row.provider}
                    onChange={(e) => handleUpdateLocal(row.id, 'provider', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    className="min-w-[80px]"
                  />
                </td>
                <td className="p-2">
                  <Textarea
                    value={row.description}
                    onChange={(e) => handleUpdateLocal(row.id, 'description', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    rows={2}
                    className="min-w-[200px]"
                  />
                </td>

                <td className="p-2">
                  <Textarea
                    value={row.members}
                    onChange={(e) => handleUpdateLocal(row.id, 'members', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    rows={2}
                    className="min-w-[150px]"
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
        title="Eliminare questa certificazione?"
        message="Questa azione non può essere annullata."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
