import React from 'react';
import { RotateCcw, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full border-2 border-[#1A1A1A] space-y-5 animate-in fade-in zoom-in-95 text-center">
        <div className="w-12 h-12 rounded-full border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center mx-auto">
          <RotateCcw className="w-5 h-5" />
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-rose-700 block mb-1">
            Zone de Réinitialisation
          </span>
          <h3 className="text-xl font-serif italic font-bold text-[#1A1A1A]">
            Remise à zéro complète ?
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 mt-2 leading-relaxed font-sans">
            Toutes vos boîtes Leitner seront remises en Boîte 1 et le compteur reviendra à la Séance #1.
          </p>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs font-mono font-bold uppercase rounded-full border border-[#E5E4DE] hover:bg-[#FBFBF9] text-[#1A1A1A] transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 text-xs font-mono font-bold uppercase rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};
