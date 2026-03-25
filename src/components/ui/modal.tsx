import { ReactNode } from 'react';
import { XIcon } from '../icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 pb-5 pt-[240px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-sm border border-gray-200 bg-brand-surface shadow-2xl p-7`}
      >
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="font-heading text-base">{title}</h3>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-title transition-colors"
          >
            <XIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
