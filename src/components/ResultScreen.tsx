import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, PlusCircle, FileSpreadsheet, 
  FileJson, Printer, CheckCircle, XCircle, MinusCircle, 
  Search, Eye, Flag, History, CheckCheck
} from 'lucide-react';
import type { QuestionRecord, TestStats, MarkingScheme, TestCompletionType } from '../types/quiz';
import { formatMark } from '../utils/scoreCalculator';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { QuestionReviewModal } from './QuestionReviewModal';

interface ResultScreenProps {
  records: QuestionRecord[];
  stats: TestStats;
  markingScheme: MarkingScheme;
  completionType: TestCompletionType;
  configuredLimit?: number;
  onRetakeTest: () => void;
  onNewTest: () => void;
  onOpenHistory?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  records,
  stats,
  markingScheme,
  completionType,
  configuredLimit,
  onRetakeTest,
  onNewTest,
  onOpenHistory,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'not_attempted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewingRecord, setReviewingRecord] = useState<QuestionRecord | null>(null);

  // Fire celebratory confetti on mount if score is positive
  useEffect(() => {
    try {
      if (stats.finalScore > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch {
      // ignore
    }
  }, [stats.finalScore]);

  // Filtered records - strictly within actualTestLength
  const effectiveLength = stats.actualTestLength || records.length;
  const filteredRecords = records
    .filter((r) => r.questionNumber <= effectiveLength)
    .filter((r) => {
      const matchesFilter = filter === 'all' ? true : r.result === filter;
      const qLabel = `q${r.questionNumber}`;
      const matchesSearch = searchQuery === '' || 
        (r.questionText && r.questionText.toLowerCase().includes(searchQuery.toLowerCase())) ||
        qLabel.includes(searchQuery.toLowerCase()) ||
        (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });

  const handlePrint = () => {
    window.print();
  };

  const isEarly = completionType === 'finished_early';
  const effectiveConfiguredLimit = configuredLimit ?? stats.configuredLimit ?? effectiveLength;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Test Status Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm transition-all">
          {isEarly ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300">
              <Flag className="w-4 h-4 text-amber-600" />
              <span>Test Status: Finished Early at Q{effectiveLength}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Test Status: Completed Normally</span>
            </span>
          )}
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Performance & Evaluation Report
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          {isEarly
            ? `Completed Range: Q1–Q${effectiveLength} (${effectiveLength} Questions) • Configured Limit: ${effectiveConfiguredLimit} Questions`
            : `All ${effectiveLength} questions completed and manually self-evaluated.`}
        </p>
      </div>

      {/* Main Score Showcase (Requirement 11 & 12: Large Score: e.g. 14 / 50) */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left: Large Score Display */}
          <div className="md:col-span-6 space-y-3 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Total Score Obtained
            </span>
            <div className="flex items-baseline justify-center md:justify-start space-x-3">
              <span className="text-6xl sm:text-7xl font-black tracking-tight text-white">
                {stats.finalScore}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-indigo-300">
                / {stats.maximumScore}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-200/80">
              Percentage: <strong className="text-white font-bold">{stats.percentage}%</strong> • Accuracy: <strong className="text-emerald-300 font-bold">{stats.accuracy}%</strong>
            </p>
          </div>

          {/* Right: Step 12 Mathematical Calculation Breakdown */}
          <div className="md:col-span-6 space-y-3 bg-black/30 p-5 rounded-2xl border border-white/10 font-mono text-xs sm:text-sm">
            <div className="font-sans text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Marking Calculation Breakdown
            </div>
            <div className="flex justify-between items-center text-emerald-300">
              <span>Correct:</span>
              <span>
                {stats.correct} × {formatMark(markingScheme.correct)} = +{(stats.correct * markingScheme.correct).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center text-rose-300">
              <span>Incorrect:</span>
              <span>
                {stats.incorrect} × {formatMark(markingScheme.incorrect)} = {(stats.incorrect * markingScheme.incorrect).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sky-300">
              <span>Not Attempted:</span>
              <span>
                {stats.notAttempted} × {formatMark(markingScheme.notAttempted)} = 0
              </span>
            </div>
            <div className="pt-2 border-t border-white/15 flex justify-between items-center font-bold text-base text-amber-300">
              <span>Final Score:</span>
              <span>{stats.finalScore} / {stats.maximumScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (Requirement 11 exact cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Correct */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-xs text-emerald-800 dark:text-emerald-300 block mb-1 font-semibold">Correct</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.correct}</span>
        </div>

        {/* Incorrect */}
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-xs text-rose-800 dark:text-rose-300 block mb-1 font-semibold">Incorrect</span>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400">{stats.incorrect}</span>
        </div>

        {/* Unattempted */}
        <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-xs text-sky-800 dark:text-sky-300 block mb-1 font-semibold">Unattempted</span>
          <span className="text-3xl font-black text-sky-600 dark:text-sky-400">{stats.notAttempted}</span>
        </div>

        {/* Attempted */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Attempted</span>
          <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.attempted}</span>
        </div>

        {/* Accuracy */}
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-xs text-indigo-800 dark:text-indigo-300 block mb-1 font-semibold">Accuracy</span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{stats.accuracy}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Correct / Attempted</span>
        </div>

        {/* Percentage */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 shadow-sm text-center">
          <span className="text-xs text-amber-800 dark:text-amber-300 block mb-1 font-semibold">Percentage</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats.percentage}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Score / Max Score</span>
        </div>
      </div>

      {/* Action Toolbar (Requirement 16: Retake Test & New Test) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Retake Test Button */}
          <button
            type="button"
            onClick={onRetakeTest}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Test</span>
          </button>

          {/* New Test Button */}
          <button
            type="button"
            onClick={onNewTest}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Test</span>
          </button>

          {/* View History Button */}
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-indigo-500" />
              <span>Test History</span>
            </button>
          )}
        </div>

        {/* Export / Print */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => exportToCSV(records, stats, markingScheme)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            title="Download CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => exportToJSON(records, stats, markingScheme)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            title="Download JSON"
          >
            <FileJson className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            title="Print Summary"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Detailed Answer Log (Requirement 13) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Detailed Question & Answer Log
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete audit trail with individual review controls for every question.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All ({records.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              Correct ({stats.correct})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'incorrect'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
              }`}
            >
              Incorrect ({stats.incorrect})
            </button>
            <button
              onClick={() => setFilter('not_attempted')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'not_attempted'
                  ? 'bg-sky-600 text-white'
                  : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100'
              }`}
            >
              Not Attempted ({stats.notAttempted})
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search question text or number (e.g. '1' or 'Q1')..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>

        {/* The Table (Requirement 13: Q | Selected | Result | Marks + Review button) */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Q</th>
                <th className="py-3 px-4">Question Details</th>
                <th className="py-3 px-4 text-center">Selected</th>
                <th className="py-3 px-4 text-center">Result</th>
                <th className="py-3 px-4 text-center">Marks</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((r) => {
                const isCorrect = r.result === 'correct';
                const isIncorrect = r.result === 'incorrect';
                const isNotAttempted = r.result === 'not_attempted' || r.result === 'unanswered';

                return (
                  <tr key={r.questionNumber} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Q # */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {r.questionNumber}
                    </td>

                    {/* Question Content & Notes */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-xs sm:max-w-md">
                      <span className="line-clamp-2 font-medium">
                        {r.questionText || `Question ${r.questionNumber}`}
                      </span>
                      {r.notes && (
                        <span className="block text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 truncate">
                          Note: {r.notes}
                        </span>
                      )}
                    </td>

                    {/* Selected Option */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {r.selectedOption ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                          {r.selectedOption}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono font-semibold">—</span>
                      )}
                    </td>

                    {/* Result */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isCorrect && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Correct</span>
                        </span>
                      )}
                      {isIncorrect && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          <span>Incorrect</span>
                        </span>
                      )}
                      {isNotAttempted && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                          <MinusCircle className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                          <span>Not Attempted</span>
                        </span>
                      )}
                    </td>

                    {/* Marks */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold whitespace-nowrap">
                      <span
                        className={
                          r.marksObtained > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : r.marksObtained < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-400'
                        }
                      >
                        {formatMark(r.marksObtained)}
                      </span>
                    </td>

                    {/* Action: Review Button (Requirement 13) */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setReviewingRecord(r)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:border-indigo-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Question Review Modal (Requirement 13) */}
      <QuestionReviewModal
        isOpen={reviewingRecord !== null}
        record={reviewingRecord}
        onClose={() => setReviewingRecord(null)}
      />
    </div>
  );
};
