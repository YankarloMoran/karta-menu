'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
}: ConfirmDialogProps) {
  const colorMap = {
    danger: {
      icon: 'bg-red-500/10 text-red-400',
      button: 'bg-red-500 hover:bg-red-600 text-white',
    },
    warning: {
      icon: 'bg-amber-500/10 text-amber-400',
      button: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
  };

  const colors = colorMap[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-black/60 backdrop-blur-sm'
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className='relative w-full max-w-sm glass p-8 rounded-3xl shadow-2xl border border-white/10 text-center'
          >
            <button
              onClick={onClose}
              className='absolute top-4 right-4 p-2 text-foreground/30 hover:text-foreground/60 transition-colors'
            >
              <X size={18} />
            </button>

            <div className={`w-16 h-16 rounded-2xl ${colors.icon} flex items-center justify-center mx-auto mb-6`}>
              <AlertTriangle size={28} />
            </div>

            <h3 className='text-xl font-bold mb-2'>{title}</h3>
            <p className='text-sm text-foreground/50 mb-8 leading-relaxed'>{description}</p>

            <div className='flex gap-3'>
              <button
                onClick={onClose}
                className='flex-1 py-3 px-4 rounded-xl font-bold text-foreground/60 hover:bg-white/5 transition-all'
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${colors.button}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
