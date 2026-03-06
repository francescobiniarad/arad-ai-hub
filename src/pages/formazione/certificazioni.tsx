import { useState, useEffect } from 'react';
import { Button, Input, Textarea } from '../../components/ui';
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

  const handleDelete = async (id: string) => {
    setData((prev) => prev.filter((row) => row.id !== id));
    try {
      await deleteCertification(id);
    } catch {
      toast.error('Failed to delete certification');
    }
  };

  const handleAdd = () => {
    const newCert: Certification = {
      id: `c${Date.now()}`,
      name: '',
      provider: '',
      description: '',
      level: '',
      members: '',
    };
    setData((prev) => [...prev, newCert]);
  };

  if (loading) {
    return <div className="text-center text-slate-500 py-12">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-mono text-2xl font-bold mb-3">🎓 Certificazioni AI</h1>
      <p className="text-slate-400 text-sm leading-relaxed mb-7 max-w-3xl">
        Il team prenderà parte alle certificazioni AI offerte da Google, proposte in base al livello e al ruolo. Costo sostenuto da ARAD. Ognuno procederà in autonomia.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary-500/20">
              {['Certificazione', 'Provider', 'Descrizione', 'Livello', 'Partecipanti', ''].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-primary-300 bg-primary-500/10"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-slate-700/50 hover:bg-primary-500/5">
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
                  <Input
                    value={row.level}
                    onChange={(e) => handleUpdateLocal(row.id, 'level', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    className="min-w-[90px]"
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
                    onClick={() => handleDelete(row.id)}
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
    </div>
  );
};
