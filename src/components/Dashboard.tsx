import React from 'react';
import { 
  Play, 
  ChevronRight, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { BOX_CONFIGS, CHAPTERS_DATA } from '../constants';
import { ProgressMap, Question } from '../types';
import { getQuestionProgress, isQuestionReady } from '../utils/leitner';

interface DashboardProps {
  questions: Question[];
  progress: ProgressMap;
  currentSession: number;
  onStartQuiz: (chapterId: number | 'all') => void;
  onOpenInfo: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  questions,
  progress,
  currentSession,
  onStartQuiz,
  onOpenInfo,
}) => {
  // Compute ready count overall
  const readyQuestions = questions.filter((q) => isQuestionReady(progress, q.id, currentSession));
  const totalReady = readyQuestions.length;

  // Compute breakdown by box (1 to 5)
  const boxCounts = [1, 2, 3, 4, 5].map((boxNum) => {
    const questionsInBox = questions.filter((q) => {
      const p = getQuestionProgress(progress, q.id);
      return p.box === boxNum;
    });
    const readyInBox = questionsInBox.filter((q) => isQuestionReady(progress, q.id, currentSession));
    return {
      boxNum,
      count: questionsInBox.length,
      readyCount: readyInBox.length,
      percent: questions.length > 0 ? Math.round((questionsInBox.length / questions.length) * 100) : 0,
    };
  });

  const maxBoxCount = Math.max(...boxCounts.map((b) => b.count), 1);
  const masteredCount = boxCounts.find((b) => b.boxNum === 5)?.count || 0;
  const masteryPercentage = questions.length > 0 ? Math.round((masteredCount / questions.length) * 100) : 0;

  return (
    <div id="dashboard-view" className="space-y-5 sm:space-y-7 pb-10">
      {/* 1. Editorial Header / Summary Card */}
      <section
        id="summary-card"
        className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4.5 sm:p-7 relative shadow-none"
      >
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
              Système Leitner • Session #{currentSession}
            </span>
            <button
              onClick={onOpenInfo}
              className="text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/70 hover:text-[#1A1A1A] underline underline-offset-4 transition-colors font-bold cursor-pointer"
            >
              Notice Méthode
            </button>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-serif italic text-[#1A1A1A] leading-tight">
              Prépa Concours
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#1A1A1A]/70 mt-1.5 leading-relaxed">
              Algorithme d'espacement mnésique à 5 boîtes séquentielles. Révisez au rythme de vos séances.
            </p>
          </div>

          {/* Badges and metric pills */}
          <div className="flex flex-wrap gap-2 items-center pt-0.5">
            <div className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] sm:text-[11px] font-mono font-bold rounded-full uppercase tracking-tight">
              {totalReady} QCM {totalReady > 1 ? 'PRÊTS' : 'PRÊT'}
            </div>
            <div className="px-3 py-1 border border-[#1A1A1A] text-[#1A1A1A] text-[10px] sm:text-[11px] font-mono font-bold rounded-full uppercase tracking-tight">
              Maîtrise B5 : {masteryPercentage}%
            </div>
            <div className="px-3 py-1 border border-[#E5E4DE] bg-[#FBFBF9] text-[#1A1A1A]/70 text-[10px] sm:text-[11px] font-mono font-bold rounded-full uppercase tracking-tight">
              Total : {questions.length} QCM
            </div>
          </div>

          {/* Main Action Button */}
          {totalReady > 0 && (
            <div className="pt-1">
              <button
                id="start-all-quiz-btn"
                onClick={() => onStartQuiz('all')}
                className="w-full py-3.5 sm:py-4 px-5 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm active:scale-[0.98] min-h-[48px]"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white flex-shrink-0" />
                <span className="truncate">Lancer la séance globale ({totalReady} QCM)</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. Répartition et Graphique Editorial des Boîtes Leitner */}
      <section id="leitner-boxes-section" className="bg-white border border-[#1A1A1A] rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between border-b border-[#E5E4DE] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-[#1A1A1A]/50 block">
              Courbe d'acquisition
            </span>
            <h3 className="text-lg sm:text-xl font-serif italic text-[#1A1A1A]">
              Distribution des 5 Boîtes
            </h3>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#1A1A1A]/60">5 paliers</span>
        </div>

        {/* Vertical Editorial Bar Graph */}
        <div className="pt-4 pb-1">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 h-24 sm:h-28 items-end px-1 sm:px-4 border-b border-[#1A1A1A]">
            {boxCounts.map((b) => {
              const heightPercent = Math.max(18, Math.round((b.count / maxBoxCount) * 100));
              const isMastered = b.boxNum === 5;
              const isB1 = b.boxNum === 1;

              return (
                <div
                  key={`chart-box-${b.boxNum}`}
                  className="flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Floating Count badge */}
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#1A1A1A] mb-1">
                    {b.count}
                  </span>

                  {/* Vertical Column */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[40px] sm:max-w-[48px] rounded-t-sm transition-all duration-500 relative ${
                      isMastered
                        ? 'bg-emerald-600'
                        : isB1
                        ? 'bg-[#1A1A1A]'
                        : 'bg-[#2C2C2C]'
                    }`}
                  >
                    {b.readyCount > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1 py-0.2 rounded bg-[#1A1A1A] text-white text-[8px] sm:text-[9px] font-mono font-bold">
                        {b.readyCount}
                      </span>
                    )}
                  </div>

                  {/* Bottom Label */}
                  <span className="mt-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                    B{b.boxNum}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Micro-table breakdown */}
        <div className="grid grid-cols-5 gap-1 text-center pt-0.5">
          {BOX_CONFIGS.map((cfg) => (
            <div key={`box-mini-${cfg.box}`} className="p-1.5 sm:p-2 rounded-lg bg-[#FBFBF9] border border-[#E5E4DE]">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase font-bold text-[#1A1A1A]/60 block truncate">
                {cfg.name}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#1A1A1A] mt-0.5 block truncate">
                {cfg.interval}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Liens de révision des Chapitres (Style Editorial) */}
      <section id="chapters-section" className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
          <h3 className="text-[11px] uppercase tracking-widest font-mono font-bold text-[#1A1A1A]/70">
            Modules du Concours
          </h3>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#1A1A1A]/50">4 chapitres</span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {CHAPTERS_DATA.map((ch) => {
            const chQuestions = questions.filter((q) => q.chapterId === ch.id);
            const chReady = chQuestions.filter((q) => isQuestionReady(progress, q.id, currentSession));
            const readyCount = chReady.length;
            const isReady = readyCount > 0;

            let nextDueSession: number | null = null;
            if (!isReady && chQuestions.length > 0) {
              const dueSessions = chQuestions.map((q) => getQuestionProgress(progress, q.id).nextSession);
              nextDueSession = Math.min(...dueSessions);
            }

            return (
              <div
                key={`chapter-row-${ch.id}`}
                id={`chapter-${ch.id}-card`}
                className={`bg-white border border-[#E5E4DE] hover:border-[#1A1A1A] rounded-2xl p-4 sm:p-5 transition-all ${
                  !isReady ? 'opacity-85' : ''
                }`}
              >
                {/* Top Row: Title and Count */}
                <div className="flex justify-between items-start mb-1.5 gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest font-bold text-[#1A1A1A]/50 block mb-0.5">
                      {ch.category}
                    </span>
                    <h4 className="text-lg sm:text-xl font-serif italic text-[#1A1A1A] leading-snug">
                      {ch.title}
                    </h4>
                  </div>
                  <div className="text-right flex-shrink-0 pl-2">
                    <span className="text-base sm:text-lg font-mono font-bold text-[#1A1A1A]">
                      {chQuestions.length < 10 ? `0${chQuestions.length}` : chQuestions.length}
                    </span>
                    <span className="text-[9px] font-mono text-[#1A1A1A]/40 block uppercase">
                      QCM
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#1A1A1A]/65 line-clamp-1 mb-2.5">
                  {ch.subtitle}
                </p>

                {/* Hairline Divider */}
                <div
                  className={`h-[1px] w-full mb-3 transition-colors ${
                    isReady ? 'bg-[#1A1A1A]' : 'bg-[#E5E4DE]'
                  }`}
                />

                {/* Bottom Row: Status and Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="min-w-0">
                    {isReady ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                        <span className="truncate">{readyCount} QCM prêt{readyCount > 1 ? 's' : ''}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase text-[#1A1A1A]/50 bg-[#FBFBF9] px-2.5 py-1 rounded-full border border-[#E5E4DE]">
                        <Clock className="w-3 h-3 text-[#1A1A1A]/40 flex-shrink-0" />
                        <span className="truncate">
                          {nextDueSession
                            ? `Retour S#${nextDueSession}`
                            : 'À jour'}
                        </span>
                      </span>
                    )}
                  </div>

                  <button
                    id={`start-chapter-${ch.id}-btn`}
                    onClick={() => isReady && onStartQuiz(ch.id)}
                    disabled={!isReady}
                    className={`w-full sm:w-auto px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all min-h-[38px] ${
                      isReady
                        ? 'bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white cursor-pointer active:scale-95'
                        : 'bg-[#F4F3EF] text-[#1A1A1A]/30 border border-[#E5E4DE] cursor-not-allowed'
                    }`}
                  >
                    <span>{isReady ? 'Réviser' : 'Verrouillé'}</span>
                    {isReady && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Mémo Méthode Leitner */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E4DE] text-[#1A1A1A] space-y-2">
        <div className="flex items-center justify-between border-b border-[#E5E4DE] pb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#1A1A1A]/60">
            Protocole de Répétition
          </span>
          <span className="text-[10px] font-mono font-bold text-[#1A1A1A]">Session #{currentSession}</span>
        </div>
        <p className="text-xs leading-relaxed text-[#1A1A1A]/80 font-sans">
          <strong>Succès :</strong> La question progresse (<code className="font-mono text-emerald-800 font-bold">Boîte + 1</code>, espacements <code className="font-mono">+1, +2, +4, +7, +12</code>).<br />
          <strong>Erreur :</strong> La question retombe en <strong className="text-rose-700">Boîte 1</strong> dès la séance suivante.
        </p>
      </section>
    </div>
  );
};
