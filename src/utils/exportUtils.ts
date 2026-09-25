import type { QuestionRecord, TestStats, MarkingScheme } from '../types/quiz';

/**
 * Downloads a text file with given filename and content.
 */
function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports test results and full question log to CSV.
 */
export function exportToCSV(
  records: QuestionRecord[],
  stats: TestStats,
  scheme: MarkingScheme
) {
  const lines: string[] = [];

  // Summary headers
  lines.push('--- SELF-EVALUATION TEST SUMMARY ---');
  lines.push(`Final Score,${stats.finalScore} / ${stats.maximumScore}`);
  lines.push(`Total Questions,${stats.totalQuestions}`);
  lines.push(`Attempted,${stats.attempted}`);
  lines.push(`Not Attempted,${stats.notAttempted}`);
  lines.push(`Correct Answers,${stats.correct}`);
  lines.push(`Incorrect Answers,${stats.incorrect}`);
  lines.push(`Accuracy,${stats.accuracy}%`);
  lines.push(`Percentage,${stats.percentage}%`);
  lines.push(`Marking Scheme,"Correct: +${scheme.correct} | Incorrect: ${scheme.incorrect} | Not Attempted: ${scheme.notAttempted}"`);
  lines.push('');
  
  // Table headers
  lines.push('Question,Selected Option,Result,Marks,Question Text');

  // Rows
  for (const record of records) {
    const qNum = `Q${record.questionNumber}`;
    const selected = record.selectedOption ?? '—';
    const resultText = record.result === 'not_attempted' ? 'Not Attempted' : record.result.toUpperCase();
    const marksText = record.marksObtained > 0 ? `+${record.marksObtained}` : `${record.marksObtained}`;
    const rawText = record.questionText || `Question ${record.questionNumber}`;
    const escapedText = `"${rawText.replace(/"/g, '""')}"`;
    lines.push(`${qNum},${selected},${resultText},${marksText},${escapedText}`);
  }

  const csvContent = lines.join('\n');
  const filename = `self_eval_test_results_${Date.now()}.csv`;
  downloadFile(filename, csvContent, 'text/csv;charset=utf-8;');
}

/**
 * Exports test results as structured JSON.
 */
export function exportToJSON(
  records: QuestionRecord[],
  stats: TestStats,
  scheme: MarkingScheme
) {
  const payload = {
    testDate: new Date().toISOString(),
    markingScheme: scheme,
    summary: stats,
    questionsLog: records.map(r => ({
      questionNumber: r.questionNumber,
      questionText: r.questionText,
      selectedOption: r.selectedOption,
      result: r.result,
      marksObtained: r.marksObtained,
    })),
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const filename = `self_eval_test_results_${Date.now()}.json`;
  downloadFile(filename, jsonString, 'application/json');
}
