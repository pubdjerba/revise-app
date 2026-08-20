import { LEITNER_INTERVALS, STORAGE_KEY_PROGRESS, STORAGE_KEY_SESSION } from '../constants';
import { ProgressMap, Question, QuestionProgress } from '../types';

export function loadStoredProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erreur lecture progression localStorage:', e);
    return {};
  }
}

export function saveStoredProgress(progress: ProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Erreur sauvegarde progression localStorage:', e);
  }
}

export function loadCurrentSession(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return 1;
    const val = parseInt(raw, 10);
    return isNaN(val) || val < 1 ? 1 : val;
  } catch (e) {
    console.error('Erreur lecture session localStorage:', e);
    return 1;
  }
}

export function saveCurrentSession(session: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESSION, String(session));
  } catch (e) {
    console.error('Erreur sauvegarde session localStorage:', e);
  }
}

export function getQuestionProgress(progressMap: ProgressMap, questionId: string): QuestionProgress {
  if (progressMap[questionId]) {
    return progressMap[questionId];
  }
  // Default values for an unattempted question: Box 1, due on Session 1
  return {
    box: 1,
    nextSession: 1,
  };
}

export function isQuestionReady(progressMap: ProgressMap, questionId: string, currentSession: number): boolean {
  const p = getQuestionProgress(progressMap, questionId);
  return p.nextSession <= currentSession;
}

export function calculateLeitnerUpdate(
  currentBox: number,
  isCorrect: boolean,
  currentSession: number
): { newBox: number; nextSession: number; interval: number } {
  if (isCorrect) {
    const newBox = Math.min(5, (currentBox || 1) + 1);
    const interval = LEITNER_INTERVALS[newBox] ?? 1;
    const nextSession = currentSession + interval;
    return { newBox, nextSession, interval };
  } else {
    const newBox = 1;
    const interval = LEITNER_INTERVALS[1]; // +1 session
    const nextSession = currentSession + interval;
    return { newBox, nextSession, interval };
  }
}

export function resetAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    localStorage.setItem(STORAGE_KEY_SESSION, '1');
  } catch (e) {
    console.error('Erreur lors de la réinitialisation:', e);
  }
}
