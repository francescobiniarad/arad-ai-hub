import { Button } from './button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
      <div className="bg-brand-surface rounded-sm border border-gray-200 shadow-2xl p-6 max-w-sm w-full">
        <h3 className="font-heading text-base mb-2">{title}</h3>
        {message && <p className="text-brand-muted text-sm mb-5">{message}</p>}
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel}>Annulla</Button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
};
