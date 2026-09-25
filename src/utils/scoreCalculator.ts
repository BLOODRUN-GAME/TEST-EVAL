import type { MarkingScheme, QuestionRecord, TestStats } from '../types/quiz';

/**
 * Rounds a floating point number to specified decimal places cleanly.
 */
export function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Calculates test statistics and marks strictly for the actual test range (Q1 to Q{actualLength}).
 * Any questions beyond actualLength are ignored and do NOT affect score or unattempted counts.
 */
export function calculateTestStats(
  records: QuestionRecord[],
  scheme: MarkingScheme,
  actualLength: number,
  configuredLimit?: number
): TestStats {
  let correctCount = 0;
  let incorrectCount = 0;
  let explicitNotAttemptedCount = 0;
  let unansweredCount = 0;
  let totalScore = 0;
  let grossPositive = 0;
  let grossPenalty = 0;

  // Filter records to only those within the actual test range 1..actualLength
  const validRecords = records.filter((r) => r.questionNumber <= actualLength);
  const seenNumbers = new Set<number>();

  for (const record of validRecords) {
    seenNumbers.add(record.questionNumber);
    if (record.result === 'correct') {
      correctCount++;
      const marks = scheme.correct;
      totalScore += marks;
      grossPositive += marks;
    } else if (record.result === 'incorrect') {
      incorrectCount++;
      const marks = scheme.incorrect; // usually negative, e.g. -0.5
      totalScore += marks;
      grossPenalty += Math.abs(marks);
    } else if (record.result === 'not_attempted') {
      explicitNotAttemptedCount++;
      totalScore += scheme.notAttempted;
    } else {
      unansweredCount++;
    }
  }

  // Any questions between 1 and actualLength that were never created in records
  for (let i = 1; i <= actualLength; i++) {
    if (!seenNumbers.has(i)) {
      unansweredCount++;
    }
  }

  // Completed questions are those with an evaluation: correct, incorrect, or not_attempted
  const completedQuestionsCount = correctCount + incorrectCount + explicitNotAttemptedCount;
  const remainingQuestionsCount = Math.max(0, actualLength - completedQuestionsCount);

  // Total unattempted includes both explicitly marked not attempted AND any unanswered questions within 1..actualLength
  const totalNotAttempted = explicitNotAttemptedCount + unansweredCount;
  const attemptedCount = correctCount + incorrectCount;

  // Maximum Score based strictly on actual test length (e.g. 8 * 2 = 16)
  const maximumScore = round(actualLength * scheme.correct, 2);
  const finalScore = round(totalScore, 2);

  const accuracy = attemptedCount > 0 
    ? round((correctCount / attemptedCount) * 100, 2) 
    : 0;

  const percentage = maximumScore > 0 
    ? round((finalScore / maximumScore) * 100, 2) 
    : 0;

  return {
    totalQuestions: actualLength,
    configuredLimit: configuredLimit ?? actualLength,
    actualTestLength: actualLength,
    attempted: attemptedCount,
    notAttempted: totalNotAttempted,
    correct: correctCount,
    incorrect: incorrectCount,
    accuracy,
    percentage,
    finalScore,
    maximumScore,
    grossPositive: round(grossPositive, 2),
    grossPenalty: round(grossPenalty, 2),
    completedQuestionsCount,
    remainingQuestionsCount,
  };
}

/**
 * Formats mark with sign, e.g. "+2", "-0.5", "0"
 */
export function formatMark(mark: number): string {
  if (mark > 0) return `+${mark}`;
  if (mark < 0) return `${mark}`;
  return '0';
}
