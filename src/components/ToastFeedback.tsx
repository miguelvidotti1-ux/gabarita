import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export const ToastFeedback: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto px-5 py-3.5 rounded-xl font-medium text-sm text-white shadow-xl flex items-center gap-2.5 min-w-[240px] ${
              toast.type === 'success' 
                ? 'bg-[var(--success)] shadow-emerald-950/20' 
                : 'bg-[var(--error)] shadow-rose-950/20'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} className="shrink-0" />
            ) : (
              <AlertCircle size={18} className="shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastFeedback;
