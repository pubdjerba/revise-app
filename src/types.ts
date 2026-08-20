export interface Question {
  id: string;
  chapterId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuestionProgress {
  box: number; // 1 to 5
  nextSession: number; // The session number at which this question is due
  lastAnsweredCorrect?: boolean;
  timesAnswered?: number;
}

export type ProgressMap = Record<string, QuestionProgress>;

export interface ChapterMeta {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  color: string;
  bgLight: string;
  borderLight: string;
  iconName: string;
  dataFile: string;
}

export interface QuizAnswerRecord {
  question: Question;
  selectedOption: number;
  isCorrect: boolean;
  previousBox: number;
  newBox: number;
  newNextSession: number;
}

export interface SessionResult {
  chapterId: number | 'all';
  sessionNumber: number;
  totalQuestions: number;
  correctCount: number;
  records: QuizAnswerRecord[];
  timestamp: number;
}
