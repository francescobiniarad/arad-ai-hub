import { useState, useEffect } from 'react';
import { Button, Input, Textarea } from '../../components/ui';
import { PlusIcon, TrashIcon } from '../../components/icons';
import { subscribeToPracticalSessions, savePracticalSession, deletePracticalSession } from '../../services/firestore';
import type { PracticalSession } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_SESSIONS: PracticalSession[] = [
  { id: 'p1', date: '13/03', topic: 'Google Sheet + Gemini', referente: '', theory: '', practice: '' },
  { id: 'p2', date: '20/03', topic: 'Come usare NotebookLM', referente: '', theory: '', practice: '' },
  { id: 'p3', date: '27/03', topic: 'Google Slides + Gemini', referente: '', theory: '', practice: '' },
  { id: 'p4', date: '03/04', topic: 'Gemini + Google AI Studio + Gmail', referente: '', theory: '', practice: '' },
  { id: 'p5', date: '10/04', topic: 'Quando come e perché usare Google AI Studio', referente: '', theory: '', practice: '' },
  { id: 'p6', date: '17/04', topic: 'Creare interfacce su Claude', referente: '', theory: '', practice: '' },
  { id: 'p7', date: '24/04', topic: 'Claude Skill e contract drafter', referente: '', theory: '', practice: '' },
  { id: 'p8', date: '08/05', topic: 'Bug - costi e come usarla nel piccolo', referente: '', theory: '', practice: '' },
  { id: 'p9', date: '15/05', topic: 'Sostituire Google Sheet con interfacce AI', referente: '', theory: '', practice: '' },
  { id: 'p10', date: '22/05', topic: 'Sostituire Google Slides con interfacce AI', referente: '', theory: '', practice: '' },
  { id: 'p11', date: '29/05', topic: 'Analisi dati su Claude', referente: '', theory: '', practice: '' },
  { id: 'p12', date: '05/06', topic: "Pratiche di project management 'Summarize'", referente: '', theory: '', practice: '' },
];

export const PracticalPage = () => {
  const [data, setData] = useState<PracticalSession[]>(INITIAL_SESSIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const unsubscribe = subscribeToPracticalSessions((sessions) => {
      if (sessions.length > 0) {
        setData(sessions);
      }
    });
    return unsubscribe;
  }, []);

  // Local update only (no Firestore save)
  const handleUpdateLocal = (id: string, field: keyof PracticalSession, value: string) => {
    setData((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  // Save to Firestore on blur
  const handleSave = async (id: string) => {
    const session = data.find((s) => s.id === id);
    if (session) {
      try {
        await savePracticalSession(session);
      } catch {
        toast.error('Failed to save changes');
      }
    }
  };

  const handleDelete = async (id: string) => {
    setData((prev) => prev.filter((row) => row.id !== id));
    try {
      await deletePracticalSession(id);
    } catch {
      toast.error('Failed to delete session');
    }
  };

  const handleAdd = () => {
    const newSession: PracticalSession = {
      id: `p${Date.now()}`,
      date: '',
      topic: '',
      referente: '',
      theory: '',
      practice: '',
    };
    setData((prev) => [...prev, newSession]);
  };

  if (loading) {
    return <div className="text-center text-slate-500 py-12">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-mono text-2xl font-bold mb-3">⚡ Practical AI</h1>
      <p className="text-slate-400 text-sm leading-relaxed mb-7 max-w-3xl">
        Sessioni di 30-45 minuti settimanali. Focus: mostrare una best practice AI e testarla rapidamente insieme.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary-500/20">
              {['Data', 'Argomento', 'Referente', 'Teoria', 'Pratica', ''].map((h) => (
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
                    value={row.date}
                    onChange={(e) => handleUpdateLocal(row.id, 'date', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    className="min-w-[80px]"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={row.topic}
                    onChange={(e) => handleUpdateLocal(row.id, 'topic', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    className="min-w-[200px]"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={row.referente}
                    onChange={(e) => handleUpdateLocal(row.id, 'referente', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    className="min-w-[120px]"
                  />
                </td>
                <td className="p-2">
                  <Textarea
                    value={row.theory}
                    onChange={(e) => handleUpdateLocal(row.id, 'theory', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    rows={2}
                    className="min-w-[160px]"
                  />
                </td>
                <td className="p-2">
                  <Textarea
                    value={row.practice}
                    onChange={(e) => handleUpdateLocal(row.id, 'practice', e.target.value)}
                    onBlur={() => handleSave(row.id)}
                    rows={2}
                    className="min-w-[160px]"
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
