import React from 'react';
import { X, Layers, CheckCircle2, RotateCcw } from 'lucide-react';
import { BOX_CONFIGS } from '../constants';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: number;
  onSetSession?: (session: number) => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  currentSession,
  onSetSession,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#1A1A1A] space-y-6 animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E4DE] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#1A1A1A]/60 block">
              Notice Méthodologique
            </span>
            <h3 className="text-2xl font-serif italic font-bold text-[#1A1A1A]">
              Système Leitner par Séances
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#E5E4DE] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Concept description */}
        <div className="space-y-4 text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-sans">
          <p>
            Contrairement aux applications basées sur des dates calendaires, ce système utilise un
            <strong> compteur de séances discret</strong> (<code className="px-2 py-0.5 rounded border border-[#E5E4DE] bg-[#FBFBF9] text-[#1A1A1A] font-bold font-mono text-xs">currentSession</code>).
          </p>

          {/* 5 Boxes Table */}
          <div className="rounded-xl border border-[#1A1A1A] overflow-hidden text-xs">
            <div className="bg-[#FBFBF9] px-3.5 py-2 font-mono uppercase font-bold text-[10px] text-[#1A1A1A] border-b border-[#1A1A1A] flex justify-between">
              <span>Palier Leitner</span>
              <span>Délai d'espacement</span>
            </div>
            <div className="divide-y divide-[#E5E4DE]">
              {BOX_CONFIGS.map((cfg) => (
                <div key={cfg.box} className="px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1A1A1A]">B{cfg.box}</span>
                    <span className="text-[#1A1A1A]/70 text-xs">({cfg.label})</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#1A1A1A]">
                    {cfg.interval}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-2 pt-1">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
              Règles de transition mnésique
            </h4>
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs font-mono uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Bonne réponse :</span>
              </div>
              <p className="text-xs text-emerald-950 font-sans">
                La question monte d'une boîte (<code className="font-mono font-bold">Boîte + 1</code>, max 5) et est programmée pour <code className="font-mono font-bold">Session + intervalle</code>.
              </p>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs font-mono uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                <span>Erreur :</span>
              </div>
              <p className="text-xs text-rose-950 font-sans">
                La question retombe immédiatement en <strong>Boîte 1</strong> et est reprogrammée dès la séance suivante (<code className="font-mono font-bold">Session + 1</code>).
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors cursor-pointer"
          >
            Fermer la notice
          </button>
        </div>
      </div>
    </div>
  );
};
