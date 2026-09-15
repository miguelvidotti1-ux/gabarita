import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (type: 'success' | 'error', message: string) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onToast }) => {
  const [notifications, setNotifications] = useState(true);
  const [completionSound, setCompletionSound] = useState(true);

  useEffect(() => {
    const savedNotif = localStorage.getItem('vesthub_notif_pref');
    const savedSound = localStorage.getItem('vesthub_sound_pref');
    if (savedNotif !== null) setNotifications(savedNotif === 'true');
    if (savedSound !== null) setCompletionSound(savedSound === 'true');
  }, []);

  const handleSave = () => {
    localStorage.setItem('vesthub_notif_pref', String(notifications));
    localStorage.setItem('vesthub_sound_pref', String(completionSound));
    onClose();
    onToast('success', 'Configurações salvas!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-overlay)] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[600px] bg-[var(--bg-modal)] rounded-2xl shadow-2xl border border-[var(--border-light)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-7 py-5 border-b border-[var(--border-light)] flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--text-main)]">
                Configurações
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-light)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-7 space-y-5">
              {/* Notificações */}
              <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-light)]">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-main)]">
                    Notificações
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    Receber lembretes de estudo
                  </div>
                </div>
                <div
                  onClick={() => setNotifications(!notifications)}
                  className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 ease-in-out relative shrink-0 ${
                    notifications ? 'bg-[var(--primary)]' : 'bg-[var(--border-color)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
                      notifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Som ao concluir simulado */}
              <div className="flex items-center justify-between py-3.5">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-main)]">
                    Som ao concluir simulado
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    Toca um som ao finalizar
                  </div>
                </div>
                <div
                  onClick={() => setCompletionSound(!completionSound)}
                  className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 ease-in-out relative shrink-0 ${
                    completionSound ? 'bg-[var(--primary)]' : 'bg-[var(--border-color)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
                      completionSound ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 border-t border-[var(--border-light)] flex items-center justify-end gap-3 bg-[var(--bg-card)]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-hover)] hover:bg-[var(--border-light)] text-[var(--text-main)] text-sm font-semibold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--shadow-primary)] inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Salvar</span>
                <Check size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfigModal;
