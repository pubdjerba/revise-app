import { describe, it, expect } from 'vitest';
import { isQuestionReady, calculateLeitnerUpdate } from './leitner';
import { Question, ProgressMap, SessionResult } from '../types';

describe('Session Workflow & Quiz Calculation', () => {
  const mockQuestions: Question[] = [
    { id: 'q1', chapterId: 1, question: 'Question 1', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'Exp 1' },
    { id: 'q2', chapterId: 1, question: 'Question 2', options: ['A', 'B', 'C', 'D'], correctAnswer: 1, explanation: 'Exp 2' },
    { id: 'q3', chapterId: 2, question: 'Question 3', options: ['A', 'B', 'C', 'D'], correctAnswer: 2, explanation: 'Exp 3' },
    { id: 'q4', chapterId: 2, question: 'Question 4', options: ['A', 'B', 'C', 'D'], correctAnswer: 3, explanation: 'Exp 4' },
  ];

  it('should filter ready questions for global session', () => {
    const progress: ProgressMap = {
      q1: { box: 1, nextSession: 1 },
      q2: { box: 2, nextSession: 3 },
      q3: { box: 1, nextSession: 1 },
      q4: { box: 3, nextSession: 5 },
    };

    const session1Ready = mockQuestions.filter((q) => isQuestionReady(progress, q.id, 1));
    expect(session1Ready.map((q) => q.id)).toEqual(['q1', 'q3']);

    const session3Ready = mockQuestions.filter((q) => isQuestionReady(progress, q.id, 3));
    expect(session3Ready.map((q) => q.id)).toEqual(['q1', 'q2', 'q3']);
  });

  it('should filter ready questions by specific chapter', () => {
    const progress: ProgressMap = {
      q1: { box: 1, nextSession: 1 },
      q2: { box: 2, nextSession: 3 },
      q3: { box: 1, nextSession: 1 },
      q4: { box: 3, nextSession: 5 },
    };

    // Chapter 1 only
    const ch1Questions = mockQuestions.filter((q) => q.chapterId === 1);
    const ch1Session1Ready = ch1Questions.filter((q) => isQuestionReady(progress, q.id, 1));
    expect(ch1Session1Ready.map((q) => q.id)).toEqual(['q1']);

    // Chapter 2 only
    const ch2Questions = mockQuestions.filter((q) => q.chapterId === 2);
    const ch2Session1Ready = ch2Questions.filter((q) => isQuestionReady(progress, q.id, 1));
    expect(ch2Session1Ready.map((q) => q.id)).toEqual(['q3']);
  });

  it('should accurately simulate a full quiz session and update progress map', () => {
    let progress: ProgressMap = {
      q1: { box: 1, nextSession: 1 },
      q2: { box: 1, nextSession: 1 },
    };
    const currentSession = 1;

    // Simulate answering: q1 correct, q2 incorrect
    const q1Result = calculateLeitnerUpdate(progress.q1.box, true, currentSession);
    const q2Result = calculateLeitnerUpdate(progress.q2.box, false, currentSession);

    const updatedProgress: ProgressMap = {
      ...progress,
      q1: { box: q1Result.newBox, nextSession: q1Result.nextSession },
      q2: { box: q2Result.newBox, nextSession: q2Result.nextSession },
    };

    expect(updatedProgress.q1).toEqual({ box: 2, nextSession: 3 }); // 1 + 2
    expect(updatedProgress.q2).toEqual({ box: 1, nextSession: 2 }); // 1 + 1

    // Simulate session increment
    const nextSession = currentSession + 1; // Session 2
    expect(nextSession).toBe(2);

    // In session 2, q2 is due (nextSession 2 <= 2), but q1 is not due yet (nextSession 3 > 2)
    expect(isQuestionReady(updatedProgress, 'q1', 2)).toBe(false);
    expect(isQuestionReady(updatedProgress, 'q2', 2)).toBe(true);
  });
});
