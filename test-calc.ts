import { calculateTestStats } from './src/utils/scoreCalculator.ts';
import type { QuestionRecord, MarkingScheme } from './src/types/quiz.ts';

const scheme: MarkingScheme = {
  correct: 2,
  incorrect: -0.5,
  notAttempted: 0,
};

// Scenario 1: Original Baseline Verification
// 25 questions, 15 Correct, 5 Incorrect, 5 Not Attempted
const records1: QuestionRecord[] = [];
for (let i = 1; i <= 15; i++) {
  records1.push({
    questionNumber: i,
    questionText: `Question ${i}`,
    selectedOption: 'A',
    result: 'correct',
    marksObtained: 2,
  });
}
for (let i = 16; i <= 20; i++) {
  records1.push({
    questionNumber: i,
    questionText: `Question ${i}`,
    selectedOption: 'B',
    result: 'incorrect',
    marksObtained: -0.5,
  });
}
for (let i = 21; i <= 25; i++) {
  records1.push({
    questionNumber: i,
    questionText: `Question ${i}`,
    selectedOption: null,
    result: 'not_attempted',
    marksObtained: 0,
  });
}

const stats1 = calculateTestStats(records1, scheme, 25, 25);
console.log("Scenario 1 Stats:", JSON.stringify(stats1, null, 2));

const asserts1 = [
  stats1.totalQuestions === 25,
  stats1.attempted === 20,
  stats1.notAttempted === 5,
  stats1.correct === 15,
  stats1.incorrect === 5,
  stats1.finalScore === 27.5,
  stats1.maximumScore === 50,
  stats1.accuracy === 75,
  stats1.percentage === 55,
];

if (!asserts1.every(Boolean)) {
  console.error("❌ Scenario 1 Failed:", asserts1);
  process.exit(1);
}

// Scenario 2: Truncated Endpoint at Q8 (Exact User Prompt Specification)
// Configured Limit: 25, Actual Test Length = 8
// Q1..Q8: 5 Correct, 2 Incorrect, 1 Not Attempted
// Q9..Q25 must NOT exist or affect the result.
const recordsEndpoint8: QuestionRecord[] = [
  { questionNumber: 1, selectedOption: 'A', result: 'correct', marksObtained: 2 },
  { questionNumber: 2, selectedOption: 'C', result: 'correct', marksObtained: 2 },
  { questionNumber: 3, selectedOption: 'B', result: 'incorrect', marksObtained: -0.5 },
  { questionNumber: 4, selectedOption: 'A', result: 'correct', marksObtained: 2 },
  { questionNumber: 5, selectedOption: null, result: 'not_attempted', marksObtained: 0 },
  { questionNumber: 6, selectedOption: 'D', result: 'correct', marksObtained: 2 },
  { questionNumber: 7, selectedOption: 'C', result: 'incorrect', marksObtained: -0.5 },
  { questionNumber: 8, selectedOption: 'A', result: 'correct', marksObtained: 2 },
];

const statsEndpoint8 = calculateTestStats(recordsEndpoint8, scheme, 8, 25);
console.log("Scenario 2 (Endpoint Q8) Stats:", JSON.stringify(statsEndpoint8, null, 2));

const assertsEndpoint8 = [
  statsEndpoint8.totalQuestions === 8,
  statsEndpoint8.actualTestLength === 8,
  statsEndpoint8.configuredLimit === 25,
  statsEndpoint8.correct === 5,
  statsEndpoint8.incorrect === 2,
  statsEndpoint8.notAttempted === 1,
  statsEndpoint8.attempted === 7,
  statsEndpoint8.finalScore === 9,
  statsEndpoint8.maximumScore === 16, // 8 * 2 = 16, NOT 50!
  statsEndpoint8.accuracy === 71.43,  // 5 / 7 * 100 = 71.43%
  statsEndpoint8.percentage === 56.25, // 9 / 16 * 100 = 56.25%
];

if (!assertsEndpoint8.every(Boolean)) {
  console.error("❌ Scenario 2 Failed:", assertsEndpoint8);
  process.exit(1);
}

console.log("✅ ALL TESTS & ASSERTIONS PASSED SUCCESSFULLY!");
