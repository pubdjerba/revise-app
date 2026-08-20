import React, { useEffect, useState } from 'react';
import { 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  BookOpen, 
  Sparkles,
  Award
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { InfoModal } from './components/InfoModal';
import { QuizScreen } from './components/QuizScreen';
import { ResetModal } from './components/ResetModal';
import { SummaryScreen } from './components/SummaryScreen';
import { ProgressMap, Question, QuizAnswerRecord, SessionResult } from './types';
import { 
  getQuestionProgress, 
  isQuestionReady, 
  loadCurrentSession, 
  loadStoredProgress, 
  resetAllProgress, 
  saveCurrentSession, 
  saveStoredProgress 
} from './utils/leitner';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [currentSession, setCurrentSession] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Navigation state: 'dashboard' | 'quiz' | 'summary'
  const [currentView, setCurrentView] = useState<'dashboard' | 'quiz' | 'summary'>('dashboard');
  const [activeQuizChapter, setActiveQuizChapter] = useState<number | 'all'>('all');
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [previousSessionNumber, setPreviousSessionNumber] = useState<number>(1);

  // Modals
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // 1. Initial Data Loading from /data/chapitre_1.json, etc.
  const loadAllChapters = async () => {
    setIsLoading(true);
    setLoadError(null);

    const chapterFiles = [
      '/data/chapitre_1.json',
      '/data/chapitre_2.json',
      '/data/chapitre_3.json',
      '/data/chapitre_4.json',
    ];

    try {
      const fetchPromises = chapterFiles.map(async (file) => {
        const res = await fetch(file);
        if (!res.ok) {
          throw new Error(`Échec du chargement de ${file} (${res.status})`);
        }
        const data: Question[] = await res.json();
        return data;
      });

      const results = await Promise.all(fetchPromises);
      const allLoadedQuestions = results.flat();

      setQuestions(allLoadedQuestions);

      // Load progression & session count from localStorage
      const savedProgress = loadStoredProgress();
      const savedSession = loadCurrentSession();

      setProgress(savedProgress);
      setCurrentSession(savedSession);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Erreur lors du chargement des chapitres JSON:', err);
      setLoadError(err.message || 'Impossible de charger les fichiers QCM.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllChapters();
  }, []);

  // Handler: Start a revision session for a chapter or all ready questions
  const handleStartQuiz = (chapterId: number | 'all') => {
    setActiveQuizChapter(chapterId);
    setCurrentView('quiz');
  };

  // Handler: Finish revision session
  const handleFinishQuiz = (records: QuizAnswerRecord[]) => {
    const oldSession = currentSession;
    const nextSessionNumber = currentSession + 1;

    // 1. Update questions progression in state and localStorage
    const updatedProgress = { ...progress };
    records.forEach((rec) => {
      updatedProgress[rec.question.id] = {
        box: rec.newBox,
        nextSession: rec.newNextSession,
        lastAnsweredCorrect: rec.isCorrect,
        timesAnswered: (updatedProgress[rec.question.id]?.timesAnswered || 0) + 1,
      };
    });

    // Save to localStorage
    saveStoredProgress(updatedProgress);
    saveCurrentSession(nextSessionNumber);

    // 2. Set updated state
    setProgress(updatedProgress);
    setCurrentSession(nextSessionNumber);
    setPreviousSessionNumber(oldSession);

    const correctCount = records.filter((r) => r.isCorrect).length;
    setSessionResult({
      chapterId: activeQuizChapter,
      sessionNumber: oldSession,
      totalQuestions: records.length,
      correctCount,
      records,
      timestamp: Date.now(),
    });

    setCurrentView('summary');
  };

  // Handler: Reset progress
  const handleConfirmReset = () => {
    resetAllProgress();
    setProgress({});
    setCurrentSession(1);
    setCurrentView('dashboard');
  };

  // Filter ready questions for active quiz
  const activeQuizQuestions = questions.filter((q) => {
    if (activeQuizChapter !== 'all' && q.chapterId !== activeQuizChapter) {
      return false;
    }
    return isQuestionReady(progress, q.id, currentSession);
  });

  const totalReadyAll = questions.filter((q) => isQuestionReady(progress, q.id, currentSession)).length;

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-white">
      {/* Header */}
      <Header
        currentSession={currentSession}
        totalReady={totalReadyAll}
        totalQuestions={questions.length}
        currentView={currentView}
        onNavigateHome={() => {
          if (currentView === 'quiz') {
            if (window.confirm('Voulez-vous quitter la séance en cours ?')) {
              setCurrentView('dashboard');
            }
          } else {
            setCurrentView('dashboard');
          }
        }}
        onOpenInfo={() => setIsInfoOpen(true)}
        onReset={() => setIsResetOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-6 py-3.5 sm:py-6 pb-safe">
        {/* Loading State */}
        {isLoading && (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full border border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A]">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-serif italic text-[#1A1A1A]">
                Chargement des QCM des 4 Chapitres...
              </h3>
              <p className="text-xs font-mono uppercase text-[#1A1A1A]/60 mt-1">
                Lecture des données & progression Leitner
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && loadError && (
          <div className="p-6 bg-white border-2 border-[#1A1A1A] rounded-2xl text-center space-y-4 my-8">
            <div className="w-12 h-12 rounded-full border border-rose-600 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-serif italic text-rose-950">Erreur de chargement</h3>
              <p className="text-xs text-[#1A1A1A]/70 mt-1">{loadError}</p>
            </div>
            <button
              onClick={loadAllChapters}
              className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white font-bold text-xs uppercase tracking-widest rounded-full inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réessayer</span>
            </button>
          </div>
        )}

        {/* Loaded Content */}
        {!isLoading && !loadError && (
          <>
            {currentView === 'dashboard' && (
              <Dashboard
                questions={questions}
                progress={progress}
                currentSession={currentSession}
                onStartQuiz={handleStartQuiz}
                onOpenInfo={() => setIsInfoOpen(true)}
              />
            )}

            {currentView === 'quiz' && (
              <QuizScreen
                chapterId={activeQuizChapter}
                questions={activeQuizQuestions}
                progress={progress}
                currentSession={currentSession}
                onFinishQuiz={handleFinishQuiz}
                onQuit={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'summary' && sessionResult && (
              <SummaryScreen
                result={sessionResult}
                previousSession={previousSessionNumber}
                newSession={currentSession}
                onReturnHome={() => setCurrentView('dashboard')}
                hasMoreReadyQuestions={totalReadyAll > 0}
                onStartNextSession={() => {
                  setActiveQuizChapter('all');
                  setCurrentView('quiz');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        currentSession={currentSession}
      />

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
