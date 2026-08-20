import React from 'react';
import { Info, RotateCcw, ChevronRight } from 'lucide-react';

interface HeaderProps {
  currentSession: number;
  totalReady: number;
  totalQuestions: number;
  currentView: 'dashboard' | 'quiz' | 'summary';
  onNavigateHome: () => void;
  onOpenInfo: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSession,
  totalReady,
  totalQuestions,
  currentView,
  onNavigateHome,
  onOpenInfo,
  onReset,
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-30 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E5E4DE]">
      <div className="max-w-2xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Logo & App Title (Clickable navigation to home) */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none min-w-0"
          title="Retour au Tableau de Bord"
        >
          <div className="w-8 h-8 rounded-full border border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] text-xs font-mono font-bold group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors flex-shrink-0">
            Q
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <h1 className="text-base sm:text-lg font-serif italic font-bold tracking-tight text-[#1A1A1A] leading-none group-hover:underline underline-offset-2 truncate">
                Prépa Concours
              </h1>
              {currentView !== 'dashboard' && (
                <span className="hidden xs:inline-flex items-center text-[10px] font-mono text-[#1A1A1A]/40 uppercase flex-shrink-0">
                  <ChevronRight className="w-3 h-3 mx-0.5" />
                  {currentView === 'quiz' ? 'Séance' : 'Bilan'}
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/60 mt-0.5 font-bold">
              Leitner Discret
            </p>
          </div>
        </button>

        {/* Macaron Séance & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Badge Séance */}
          <div
            id="session-badge"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-[#1A1A1A] text-white text-[10px] sm:text-[11px] font-mono font-bold rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap"
          >
            <span>S#{currentSession}</span>
          </div>

          {/* Info Modal Button */}
          <button
            id="header-info-btn"
            onClick={onOpenInfo}
            className="w-8 h-8 rounded-full border border-[#E5E4DE] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            title="Système de Répétition Leitner"
            aria-label="Informations Leitner"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Reset Button */}
          <button
            id="header-reset-btn"
            onClick={onReset}
            className="w-8 h-8 rounded-full border border-[#E5E4DE] text-[#1A1A1A]/50 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer flex items-center justify-center"
            title="Réinitialiser la progression"
            aria-label="Réinitialiser"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
