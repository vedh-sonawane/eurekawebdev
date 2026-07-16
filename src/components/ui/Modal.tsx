import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: string;
}

export function Modal({ open, onClose, children, title, maxWidth = 'max-w-3xl' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-forest-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} my-auto rounded-2xl bg-forest-900 border border-forest-700/60 shadow-2xl shadow-forest-950/50 animate-fade-up`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-forest-700/50">
            <h2 className="font-display text-xl font-semibold text-cream-50">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-cream-50 hover:bg-forest-800 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg text-stone-400 hover:text-cream-50 hover:bg-forest-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
