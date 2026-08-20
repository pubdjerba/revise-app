import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  TrendingUp, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  Filter,
  Play,
  BookOpen
} from 'lucide-react';
import { CHAPTERS_DATA } from '../constants';
import { SessionResult } from '../types';

interface SummaryScreenProps {
  result: SessionResult;
  previousSession: number;
  newSession: number;
  onReturnHome: () => void;
  onStartNextSession?: () => void;
  hasMoreReadyQuestions?: boolean;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  result,
  previousSession,
  newSession,
  onReturnHome,
  onStartNextSession,
  hasMoreReadyQuestions,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect'>('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const percentage = Math.round((result.correctCount / (result.totalQuestions || 1)) * 100);
  const promotedCount = result.records.filter((r) => r.isCorrect).length;
  const demotedCount = result.records.filter((r) => !r.isCorrect).length;

  const chapterMeta = typeof result.chapterId === 'number'
    ? CHAPTERS_DATA.find((c) => c.id === result.chapterId)
    : null;

  const filteredRecords = result.records.filter((r) => {
    if (filterType === 'correct') return r.isCorrect;
    if (filterType === 'incorrect') return !r.isCorrect;
    return true;
  });

  return (
    <div id="summary-screen" className="space-y-4 sm:space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Score Card */}
      <div
        id="result-hero-card"
        className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4.5 sm:p-7 text-center relative space-y-3 sm:space-y-4 shadow-none"
      >
        <div>
          <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
            {chapterMeta ? `${chapterMeta.category} • Bilan` : 'Bilan de la séance globale'}
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif italic text-[#1A1A1A] mt-2 sm:mt-3">
            {percentage}%
          </h2>
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70 mt-1">
            {result.correctCount} sur {result.totalQuestions} question{result.totalQuestions > 1 ? 's' : ''} validée{result.correctCount > 1 ? 's' : ''}
          </p>
        </div>

        {/* Session increment macaron */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1A1A] text-white text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-center">
            <span>
              S#{previousSession} validée → <strong>Session #{newSession}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Stats Breakdown Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#1A1A1A] flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
            +{promotedCount}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-mono font-bold uppercase text-[#1A1A1A] truncate">
              Boîte supérieure
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-[#1A1A1A]/60 block truncate">
              Espacement accru
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#1A1A1A] flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
            {demotedCount}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-mono font-bold uppercase text-[#1A1A1A] truncate">
              Retour Boîte 1
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-[#1A1A1A]/60 block truncate">
              Révision S#{newSession}
            </span>
          </div>
        </div>
      </div>

      {/* Question by Question Review */}
      <div className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2 px-0.5 flex-wrap gap-2">
          <h3 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
            Détail ({result.records.length})
          </h3>
          
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] overflow-x-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold'
                  : 'bg-white text-[#1A1A1A]/60 border-[#E5E4DE] hover:border-[#1A1A1A]'
              }`}
            >
              Toutes ({result.records.length})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                filterType === 'correct'
                  ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:border-emerald-500'
              }`}
            >
              ✓ Justes ({promotedCount})
            </button>
            <button
              onClick={() => setFilterType('incorrect')}
              className={`px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                filterType === 'incorrect'
                  ? 'bg-rose-700 text-white border-rose-700 font-bold'
                  : 'bg-white text-rose-800 border-rose-200 hover:border-rose-500'
              }`}
            >
              ✕ Erreurs ({demotedCount})
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredRecords.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-[#E5E4DE] text-center text-xs font-mono text-[#1A1A1A]/60">
              Aucune question ne correspond à ce filtre.
            </div>
          ) : (
            filteredRecords.map((rec, idx) => {
              const isExpanded = expandedId === rec.question.id;

              return (
                <div
                  key={`rec-${rec.question.id}-${idx}`}
                  className="rounded-xl border border-[#E5E4DE] bg-white overflow-hidden transition-all"
                >
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : rec.question.id)}
                    className="w-full p-4 flex items-start justify-between gap-3 text-left hover:bg-[#FBFBF9] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5 flex-shrink-0">
                        {rec.isCorrect ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono text-[10px] font-bold">
                            ✓
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-mono text-[10px] font-bold">
                            ✕
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-serif italic text-[#1A1A1A] leading-snug">
                          {rec.question.question}
                        </p>
                        
                        {/* Leitner Box Movement Pill */}
                        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                          <span className="inline-flex items-center gap-1 font-bold text-[#1A1A1A]">
                            <span>B{rec.previousBox}</span>
                            <span>→</span>
                            <strong className={rec.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                              B{rec.newBox}
                            </strong>
                          </span>
                          <span className="text-[#1A1A1A]/30">•</span>
                          <span className="text-[#1A1A1A]/60 text-[11px]">
                            Prochaine : Session #{rec.newNextSession}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[#1A1A1A]/50 p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#E5E4DE] bg-[#FBFBF9] space-y-3 text-xs">
                      {/* Selected option vs correct */}
                      <div className="space-y-1 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#1A1A1A]/60 uppercase text-[10px]">Votre choix :</span>
                          <span className={rec.isCorrect ? 'text-emerald-800 font-bold' : 'text-rose-800 font-bold'}>
                            {rec.question.options[rec.selectedOption]}
                          </span>
                        </div>
                        {!rec.isCorrect && (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-emerald-800 uppercase text-[10px] font-bold">Bonne réponse :</span>
                            <span className="text-emerald-900 font-bold">
                              {rec.question.options[rec.question.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Note Pédagogique */}
                      {rec.question.explanation && (
                        <div className="p-3 bg-white rounded-xl border border-[#E5E4DE] space-y-1.5 mt-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/60">
                            <BookOpen className="w-3 h-3 text-[#1A1A1A]/60" />
                            <span>Note Pédagogique</span>
                          </div>
                          <p className="text-xs text-[#1A1A1A]/85 leading-relaxed font-sans">
                            {rec.question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-2 sticky bottom-3 pb-safe space-y-2 z-20">
        {hasMoreReadyQuestions && onStartNextSession && (
          <button
            id="summary-next-session-btn"
            onClick={onStartNextSession}
            className="w-full py-3.5 sm:py-4 px-5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg min-h-[48px]"
          >
            <Play className="w-4 h-4 fill-white flex-shrink-0" />
            <span className="truncate">Enchaîner avec la Session #{newSession}</span>
          </button>
        )}
        <button
          id="summary-return-btn"
          onClick={onReturnHome}
          className="w-full py-3.5 sm:py-4 px-5 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white font-bold text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg min-h-[48px]"
        >
          <span>Retour au Tableau de Bord</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
