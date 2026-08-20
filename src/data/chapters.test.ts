import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Question } from '../types';

describe('QCM Chapter JSON Files Validation', () => {
  const chapterFiles = [
    { file: 'chapitre_1.json', expectedChapterId: 1 },
    { file: 'chapitre_2.json', expectedChapterId: 2 },
    { file: 'chapitre_3.json', expectedChapterId: 3 },
    { file: 'chapitre_4.json', expectedChapterId: 4 },
  ];

  const allQuestionIds = new Set<string>();

  chapterFiles.forEach(({ file, expectedChapterId }) => {
    describe(`Testing ${file}`, () => {
      const filePath = path.resolve(process.cwd(), 'public/data', file);

      it(`should exist and be valid JSON`, () => {
        expect(fs.existsSync(filePath)).toBe(true);
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        expect(() => JSON.parse(rawContent)).not.toThrow();
      });

      it(`should contain valid questions matching the QCM schema`, () => {
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        const questions: Question[] = JSON.parse(rawContent);

        expect(Array.isArray(questions)).toBe(true);
        expect(questions.length).toBeGreaterThan(0);

        questions.forEach((q, idx) => {
          // Check ID
          expect(typeof q.id).toBe('string');
          expect(q.id.trim().length).toBeGreaterThan(0);
          expect(allQuestionIds.has(q.id)).toBe(false);
          allQuestionIds.add(q.id);

          // Check Chapter ID
          expect(q.chapterId).toBe(expectedChapterId);

          // Check Question text
          expect(typeof q.question).toBe('string');
          expect(q.question.trim().length).toBeGreaterThan(0);

          // Check Options array (must be 4 options)
          expect(Array.isArray(q.options)).toBe(true);
          expect(q.options.length).toBe(4);
          q.options.forEach((opt) => {
            expect(typeof opt).toBe('string');
            expect(opt.trim().length).toBeGreaterThan(0);
          });

          // Check correctAnswer
          expect(typeof q.correctAnswer).toBe('number');
          expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
          expect(q.correctAnswer).toBeLessThan(4);
        });
      });
    });
  });
});
