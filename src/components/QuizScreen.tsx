import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  AlertTriangle,
  RotateCcw,
  BookOpen,
  CornerDownLeft
} from 'lucide-react';
import { BOX_CONFIGS, CHAPTERS_DATA } from '../constants';
import { ProgressMap, Question, QuizAnswerRecord } from '../types';
import { calculateLeitnerUpdate, getQuestionProgress } from '../utils/leitner';

interface QuizScreenProps {
  chapterId: number | 'all';
  questions: Question[];
  progress: ProgressMap;
  currentSession: number;
  onFinishQuiz: (records: QuizAnswerRecord[]) => void;
  onQuit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  chapterId,
  questions,
  progress,
  currentSession,
  onFinishQuiz,
  onQuit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [records, setRecords] = useState<QuizAnswerRecord[]>([]);
  const [showConfirmQuit, setShowConfirmQuit] = useState(false);

  const currentQ = questions[currentIndex];
  const qProg = currentQ ? getQuestionProgress(progress, currentQ.id) : { box: 1, nextSession: 1 };
  const currentBoxConfig = BOX_CONFIGS.find((b) => b.box === qProg.box) || BOX_CONFIGS[0];

  // Chapter info
  const chapterMeta = CHAPTERS_DATA.find((c) => c.id === currentQ?.chapterId);

  // If no questions ready
  if (!currentQ || questions.length === 0) {
    return (
      <div className="text-center py-16 px-4 space-y-4">
        <div className="w-12 h-12 rounded-full border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center mx-auto">
          <BookOpen className="w-5 h-5" />
        </div>
        <h3 className="text-2xl font-serif italic text-[#1A1A1A]">Aucun QCM à réviser</h3>
        <p className="text-xs font-mono text-[#1A1A1A]/70 max-w-md mx-auto uppercase">
          Tous les QCM de cette sélection sont à jour pour la séance #{currentSession}.
        </p>
        <button
          onClick={onQuit}
          className="px-6 py-3 bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest rounded-full cursor-pointer hover:bg-[#2C2C2C] transition-colors"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const handleSelectOption = (optIndex: number) => {
    if (hasAnswered) return; // Prevent changing answer

    setSelectedOption(optIndex);
    setHasAnswered(true);

    const isCorrect = optIndex === currentQ.correctAnswer;
    const { newBox, nextSession } = calculateLeitnerUpdate(qProg.box, isCorrect, currentSession);

    const newRecord: QuizAnswerRecord = {
      question: currentQ,
      selectedOption: optIndex,
      isCorrect,
      previousBox: qProg.box,
      newBox,
      newNextSession: nextSession,
    };

    setRecords((prev) => [...prev, newRecord]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed all questions in this session
      onFinishQuiz(records);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showConfirmQuit) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowConfirmQuit(false);
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setShowConfirmQuit(true);
        return;
      }

      if (!hasAnswered) {
        if (['1', 'a', 'A'].includes(e.key) && currentQ?.options[0] !== undefined) {
          handleSelectOption(0);
        } else if (['2', 'b', 'B'].includes(e.key) && currentQ?.options[1] !== undefined) {
          handleSelectOption(1);
        } else if (['3', 'c', 'C'].includes(e.key) && currentQ?.options[2] !== undefined) {
          handleSelectOption(2);
        } else if (['4', 'd', 'D'].includes(e.key) && currentQ?.options[3] !== undefined) {
          handleSelectOption(3);
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, currentIndex, questions, records, showConfirmQuit]);

  const isLastQuestion = currentIndex === questions.length - 1;
  const isCorrect = selectedOption === currentQ.correctAnswer;
  const leitnerUpdate = hasAnswered
    ? calculateLeitnerUpdate(qProg.box, isCorrect, currentSession)
    : null;

  return (
    <div id="quiz-screen" className="space-y-4 sm:space-y-6 pb-12">
      {/* Top Bar / Navigation & Progress */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <button
            id="quiz-quit-btn"
            onClick={() => setShowConfirmQuit(true)}
            className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors py-1.5 px-3 rounded-full border border-[#E5E4DE] bg-white hover:border-[#1A1A1A] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quitter</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#1A1A1A]">
              QCM {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} / {questions.length < 10 ? `0${questions.length}` : questions.length}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1A1A1A] text-white uppercase tracking-wider">
              S#{currentSession}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-[#E5E4DE] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1A1A1A] transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Confirmation Modal to Quit */}
      {showConfirmQuit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-xs w-full border-2 border-[#1A1A1A] space-y-4 text-center">
            <div className="w-10 h-10 rounded-full border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-serif italic font-bold text-[#1A1A1A]">Interrompre la séance ?</h4>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">
                La progression de cette séance en cours ne sera pas validée.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowConfirmQuit(false)}
                className="flex-1 py-2.5 text-xs font-mono font-bold uppercase rounded-full border border-[#E5E4DE] hover:bg-[#FBFBF9] text-[#1A1A1A] transition-colors cursor-pointer"
              >
                Continuer
              </button>
              <button
                onClick={onQuit}
                className="flex-1 py-2.5 text-xs font-mono font-bold uppercase rounded-full bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white transition-colors cursor-pointer"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter & Leitner Box Badge Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-[#E5E4DE] pb-2.5">
        <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#1A1A1A]/70 uppercase tracking-wider truncate max-w-[220px] sm:max-w-none">
          {chapterMeta?.category || `Chapitre 0${currentQ.chapterId}`} • {chapterMeta?.title || 'Concours'}
        </span>

        {/* Current Box Badge */}
        <div
          id="current-question-box-badge"
          className="flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider border border-[#1A1A1A] bg-white text-[#1A1A1A] flex-shrink-0"
        >
          <span>{currentBoxConfig.name} ({currentBoxConfig.interval})</span>
        </div>
      </div>

      {/* Question Card */}
      <div
        id="question-card"
        className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-4.5 sm:p-7 space-y-4 sm:space-y-5 shadow-none"
      >
        <h2 className="text-lg sm:text-2xl font-serif italic text-[#1A1A1A] leading-snug">
          {currentQ.question}
        </h2>

        {/* Options List (A, B, C, D) */}
        <div className="space-y-2.5 pt-1">
          {currentQ.options.map((option, optIdx) => {
            const letter = ['A', 'B', 'C', 'D'][optIdx] || String(optIdx + 1);
            const isSelected = selectedOption === optIdx;
            const isOptionCorrect = optIdx === currentQ.correctAnswer;

            let buttonStyle = 'border-[#E5E4DE] bg-white hover:border-[#1A1A1A] text-[#1A1A1A]';
            let badgeStyle = 'border-[#1A1A1A] text-[#1A1A1A] bg-white';
            let statusIcon = null;

            if (hasAnswered) {
              if (isOptionCorrect) {
                buttonStyle = 'border-2 border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
              } else if (isSelected && !isOptionCorrect) {
                buttonStyle = 'border-2 border-rose-500 bg-rose-50/70 text-rose-950 font-medium';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
                statusIcon = <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
              } else {
                buttonStyle = 'border-[#E5E4DE] bg-[#FBFBF9] text-[#1A1A1A]/35 opacity-60';
                badgeStyle = 'border-[#E5E4DE] text-[#1A1A1A]/40 bg-[#FBFBF9]';
              }
            }

            return (
              <button
                key={`opt-${currentQ.id}-${optIdx}`}
                id={`option-btn-${optIdx}`}
                onClick={() => handleSelectOption(optIdx)}
                disabled={hasAnswered}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 min-h-[50px] ${buttonStyle} ${
                  !hasAnswered ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={`w-6.5 h-6.5 rounded-full flex items-center justify-center font-mono font-bold text-xs border flex-shrink-0 transition-colors ${badgeStyle}`}
                  >
                    {letter}
                  </span>
                  <span className="text-xs sm:text-base leading-snug">
                    {option}
                  </span>
                </div>
                {statusIcon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Navigation Section (Shown after answer) */}
      {hasAnswered && (
        <div id="explanation-box" className="space-y-3.5">
          {/* Leitner Box Movement Alert */}
          <div
            className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {isCorrect ? (
              <div className="w-6.5 h-6.5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
                ✓
              </div>
            ) : (
              <div className="w-6.5 h-6.5 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
                ✕
              </div>
            )}
            <div className="text-xs sm:text-sm font-sans leading-relaxed">
              {isCorrect ? (
                <span>
                  <strong>Réponse exacte.</strong> Progression en{' '}
                  <strong className="underline">Boîte {leitnerUpdate?.newBox}</strong>.
                  Prochaine révision à la <strong>Séance #{leitnerUpdate?.nextSession}</strong> (+{leitnerUpdate?.interval} séance{leitnerUpdate?.interval && leitnerUpdate.interval > 1 ? 's' : ''}).
                </span>
              ) : (
                <span>
                  <strong>Réponse incorrecte.</strong> Rétrogradation en{' '}
                  <strong className="underline text-rose-700">Boîte 1</strong>.
                  Révision dès la <strong>Séance #{leitnerUpdate?.nextSession}</strong> (+1 séance).
                </span>
              )}
            </div>
          </div>

          {/* Note Pédagogique */}
          {currentQ.explanation && (
            <div
              id="pedagogical-note"
              className="p-4 sm:p-5 rounded-2xl border border-[#E5E4DE] bg-white space-y-2 text-[#1A1A1A]"
            >
              <div className="flex items-center gap-2 border-b border-[#E5E4DE] pb-2">
                <BookOpen className="w-3.5 h-3.5 text-[#1A1A1A]/70" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#1A1A1A]/70">
                  Note Pédagogique
                </span>
              </div>
              <p className="text-xs sm:text-sm font-sans leading-relaxed text-[#1A1A1A]/85">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="pt-1 sticky bottom-3 pb-safe z-20">
            <button
              id="quiz-next-btn"
              onClick={handleNext}
              className="w-full py-3.5 sm:py-4 px-5 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white font-bold text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer shadow-lg min-h-[48px]"
            >
              <span>{isLastQuestion ? 'Terminer la séance' : 'Question suivante'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
