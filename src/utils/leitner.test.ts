import { describe, it, expect, beforeEach } from 'vitest';
import { 
  calculateLeitnerUpdate, 
  getQuestionProgress, 
  isQuestionReady, 
  loadStoredProgress, 
  saveStoredProgress, 
  loadCurrentSession, 
  saveCurrentSession, 
  resetAllProgress 
} from './leitner';
import { STORAGE_KEY_PROGRESS, STORAGE_KEY_SESSION, LEITNER_INTERVALS } from '../constants';
import { ProgressMap } from '../types';

// Mock localStorage for Node test runner
const mockStore: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => mockStore[key] ?? null,
  setItem: (key: string, value: string) => {
    mockStore[key] = String(value);
  },
  removeItem: (key: string) => {
    delete mockStore[key];
  },
  clear: () => {
    for (const k of Object.keys(mockStore)) {
      delete mockStore[k];
    }
  },
};

globalThis.localStorage = mockLocalStorage as any;

describe('Leitner Spaced Repetition Algorithm', () => {
  describe('calculateLeitnerUpdate', () => {
    it('should promote from Box 1 to Box 2 on correct answer with interval +2', () => {
      const currentSession = 1;
      const result = calculateLeitnerUpdate(1, true, currentSession);
      expect(result.newBox).toBe(2);
      expect(result.interval).toBe(2);
      expect(result.nextSession).toBe(3); // 1 + 2 = 3
    });

    it('should promote from Box 2 to Box 3 on correct answer with interval +4', () => {
      const currentSession = 3;
      const result = calculateLeitnerUpdate(2, true, currentSession);
      expect(result.newBox).toBe(3);
      expect(result.interval).toBe(4);
      expect(result.nextSession).toBe(7); // 3 + 4 = 7
    });

    it('should promote from Box 3 to Box 4 on correct answer with interval +7', () => {
      const currentSession = 7;
      const result = calculateLeitnerUpdate(3, true, currentSession);
      expect(result.newBox).toBe(4);
      expect(result.interval).toBe(7);
      expect(result.nextSession).toBe(14); // 7 + 7 = 14
    });

    it('should promote from Box 4 to Box 5 on correct answer with interval +12', () => {
      const currentSession = 14;
      const result = calculateLeitnerUpdate(4, true, currentSession);
      expect(result.newBox).toBe(5);
      expect(result.interval).toBe(12);
      expect(result.nextSession).toBe(26); // 14 + 12 = 26
    });

    it('should cap at Box 5 on correct answer with interval +12', () => {
      const currentSession = 26;
      const result = calculateLeitnerUpdate(5, true, currentSession);
      expect(result.newBox).toBe(5);
      expect(result.interval).toBe(12);
      expect(result.nextSession).toBe(38); // 26 + 12 = 38
    });

    it('should demote from any box to Box 1 on wrong answer with interval +1', () => {
      const currentSession = 10;
      
      // From Box 5
      const fromB5 = calculateLeitnerUpdate(5, false, currentSession);
      expect(fromB5.newBox).toBe(1);
      expect(fromB5.interval).toBe(1);
      expect(fromB5.nextSession).toBe(11); // 10 + 1 = 11

      // From Box 4
      const fromB4 = calculateLeitnerUpdate(4, false, currentSession);
      expect(fromB4.newBox).toBe(1);
      expect(fromB4.interval).toBe(1);
      expect(fromB4.nextSession).toBe(11);

      // From Box 2
      const fromB2 = calculateLeitnerUpdate(2, false, currentSession);
      expect(fromB2.newBox).toBe(1);
      expect(fromB2.interval).toBe(1);
      expect(fromB2.nextSession).toBe(11);

      // From Box 1
      const fromB1 = calculateLeitnerUpdate(1, false, currentSession);
      expect(fromB1.newBox).toBe(1);
      expect(fromB1.interval).toBe(1);
      expect(fromB1.nextSession).toBe(11);
    });
  });

  describe('getQuestionProgress & isQuestionReady', () => {
    it('should return default Box 1, Session 1 for unattempted question', () => {
      const progress: ProgressMap = {};
      const p = getQuestionProgress(progress, 'q_unknown');
      expect(p).toEqual({ box: 1, nextSession: 1 });
    });

    it('should correctly identify if a question is ready for the current session', () => {
      const progress: ProgressMap = {
        q1: { box: 1, nextSession: 1 },
        q2: { box: 2, nextSession: 3 },
        q3: { box: 3, nextSession: 5 },
      };

      // In Session 1: q1 is ready, q2 and q3 are not
      expect(isQuestionReady(progress, 'q1', 1)).toBe(true);
      expect(isQuestionReady(progress, 'q2', 1)).toBe(false);
      expect(isQuestionReady(progress, 'q3', 1)).toBe(false);

      // In Session 3: q1 and q2 are ready (since nextSession <= 3), q3 is not
      expect(isQuestionReady(progress, 'q1', 3)).toBe(true);
      expect(isQuestionReady(progress, 'q2', 3)).toBe(true);
      expect(isQuestionReady(progress, 'q3', 3)).toBe(false);

      // In Session 5: all are ready
      expect(isQuestionReady(progress, 'q1', 5)).toBe(true);
      expect(isQuestionReady(progress, 'q2', 5)).toBe(true);
      expect(isQuestionReady(progress, 'q3', 5)).toBe(true);
    });
  });

  describe('LocalStorage Persistence', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should save and load progress accurately', () => {
      const progressData: ProgressMap = {
        'ch1_q01': { box: 2, nextSession: 3 },
        'ch1_q02': { box: 3, nextSession: 7 },
      };

      saveStoredProgress(progressData);
      const loaded = loadStoredProgress();
      expect(loaded).toEqual(progressData);
    });

    it('should save and load current session number accurately', () => {
      expect(loadCurrentSession()).toBe(1); // default

      saveCurrentSession(4);
      expect(loadCurrentSession()).toBe(4);
    });

    it('should reset all progress correctly', () => {
      saveStoredProgress({ 'ch1_q01': { box: 4, nextSession: 12 } });
      saveCurrentSession(8);

      resetAllProgress();

      expect(loadStoredProgress()).toEqual({});
      expect(loadCurrentSession()).toBe(1);
    });
  });
});
