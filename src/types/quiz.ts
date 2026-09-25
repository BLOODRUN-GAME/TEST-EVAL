export type EvaluationResult = 'correct' | 'incorrect' | 'not_attempted' | 'unanswered';

export type QuestionEntryMode = 'number_based' | 'manual';

export type TestCompletionType = 'completed_normally' | 'finished_early';

export interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  text?: string;
  notes?: string;
  options: Option[];
  category?: string;
  isNumberBased?: boolean;
  // Future-ready metadata for optional automated grading / learning reference
  correctOption?: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface MarkingScheme {
  correct: number;      // e.g. +2
  incorrect: number;    // e.g. -0.5
  notAttempted: number; // e.g. 0
}

export interface QuestionRecord {
  questionNumber: number;
  questionText?: string;
  notes?: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  result: EvaluationResult;
  marksObtained: number;
  timestamp?: number;
}

export interface TestStats {
  totalQuestions: number;          // Actual test length (e.g. 8)
  configuredLimit?: number;        // Maximum configured limit (e.g. 25)
  actualTestLength: number;        // Endpoint question count (e.g. 8)
  attempted: number;
  notAttempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;     // (correct / attempted) * 100
  percentage: number;   // (finalScore / maxScore) * 100
  finalScore: number;
  maximumScore: number; // actualTestLength * correctMark (e.g. 8 * 2 = 16)
  grossPositive: number;
  grossPenalty: number;
  completedQuestionsCount: number;
  remainingQuestionsCount: number;
}

export interface TestHistoryItem {
  id: string;
  date: string;
  timestamp: number;
  questionCount: number;          // actual test length (e.g. 8)
  configuredLimit: number;        // configured limit (e.g. 25)
  actualTestLength: number;        // e.g. 8
  endpointQuestion: number;       // e.g. 8
  entryMode: QuestionEntryMode;
  completionType: TestCompletionType;
  completedQuestionsCount: number;
  remainingQuestionsCount: number;
  stats: TestStats;
  markingScheme: MarkingScheme;
  records: QuestionRecord[];
}

export interface ActiveTestSession {
  questionCount: number;
  entryMode: QuestionEntryMode;
  markingScheme: MarkingScheme;
  currentQuestionIndex: number;
  questions: Question[];
  records: Record<number, QuestionRecord>;
  startedAt: number;
  lastUpdated: number;
}

export type QuizPhase = 'setup' | 'testing' | 'results';
