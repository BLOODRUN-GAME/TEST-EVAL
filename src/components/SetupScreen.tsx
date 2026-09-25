import React, { useState } from 'react';
import type { MarkingScheme, QuestionEntryMode } from '../types/quiz';
import { Play, Sparkles, CheckCircle, XCircle, MinusCircle, Award, HelpCircle, BookOpen, Layers, History } from 'lucide-react';
import { formatMark, round } from '../utils/scoreCalculator';

interface SetupScreenProps {
  onStartTest: (questionCount: number, markingScheme: MarkingScheme, entryMode: QuestionEntryMode) => void;
  onOpenHistory?: () => void;
  historyCount?: number;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ 
  onStartTest, 
  onOpenHistory,
  historyCount = 0,
}) => {
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [entryMode, setEntryMode] = useState<QuestionEntryMode>('number_based');
  const [correctMark, setCorrectMark] = useState<number>(2);
  const [incorrectMark, setIncorrectMark] = useState<number>(-0.5);
  const [notAttemptedMark, setNotAttemptedMark] = useState<number>(0);

  // Quick preset pills
  const presets = [5, 10, 15, 20, 25, 30, 50];

  // Live preview calculation: Maximum Score = questionCount * correctMark
  const maximumScore = round(Math.max(0, questionCount) * correctMark, 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionCount <= 0) return;
    onStartTest(
      questionCount, 
      {
        correct: correctMark,
        incorrect: incorrectMark,
        notAttempted: notAttemptedMark,
      },
      entryMode
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Self-Evaluation Exam Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create Your Test
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Configure your test parameters, set custom marking rules, and evaluate your own performance accurately.
        </p>

        {historyCount > 0 && onOpenHistory && (
          <div className="mt-3">
            <button
              type="button"
              onClick={onOpenHistory}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>You have {historyCount} past test session{historyCount > 1 ? 's' : ''} in history &rarr;</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Configuration Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-7"
        >
          {/* Question Count Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="questionCount" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                How many questions do you want to attempt?
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Example: &ldquo;25&rdquo;
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <input
                  id="questionCount"
                  type="number"
                  min="1"
                  max="200"
                  value={questionCount || ''}
                  onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full text-lg font-bold px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
                  placeholder="25"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                  Questions
                </span>
              </div>
            </div>

            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuestionCount(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    questionCount === preset
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset} Qs
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Question Entry Mode Section (Requirement 5) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Question Entry Mode
              </label>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                Flexible Testing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Number-Based Test */}
              <button
                type="button"
                onClick={() => setEntryMode('number_based')}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  entryMode === 'number_based'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold text-sm mb-1">
                  <Layers className={`w-4 h-4 ${entryMode === 'number_based' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>Number-Based Test</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Generates Question 1, 2... with generic A, B, C, D choices. Ideal for physical books, PDFs & printed papers. No question text required!
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded">
                  Recommended for Score Tracking
                </span>
              </button>

              {/* Manual Questions */}
              <button
                type="button"
                onClick={() => setEntryMode('manual')}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  entryMode === 'manual'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold text-sm mb-1">
                  <BookOpen className={`w-4 h-4 ${entryMode === 'manual' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>Manual Questions</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Includes full question text and options from the curated question bank or custom question prompts.
                </p>
              </button>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Marking Scheme Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Marking Scheme
              </h2>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                Configurable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Correct Answer */}
              <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Correct Answer</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={correctMark}
                    onChange={(e) => setCorrectMark(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg text-emerald-950 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">Default: +2</p>
              </div>

              {/* Incorrect Answer */}
              <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-800 dark:text-rose-300">
                  <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Incorrect Answer</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    max="0"
                    value={incorrectMark}
                    onChange={(e) => setIncorrectMark(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-700 rounded-lg text-rose-950 dark:text-rose-100 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <p className="text-[11px] text-rose-700/80 dark:text-rose-400">Default: -0.5</p>
              </div>

              {/* Not Attempted */}
              <div className="bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <MinusCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>Not Attempted</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    value={notAttemptedMark}
                    onChange={(e) => setNotAttemptedMark(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Default: 0</p>
              </div>
            </div>
          </div>

          {/* Start Test CTA */}
          <button
            type="submit"
            className="w-full group flex items-center justify-center space-x-2 py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-bold text-lg shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Start Test</span>
            <Play className="w-5 h-5 fill-current transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Sidebar: Live Preview Card & How It Works */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl shadow-indigo-950/20 border border-indigo-800/40 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-300">
                Live Preview
              </span>
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs text-indigo-200">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Test Config</span>
              </div>
            </div>

            {/* The exact live preview block specified in requirements */}
            <div className="space-y-3.5 font-mono text-sm bg-black/30 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between items-center text-slate-200">
                <span className="font-sans font-medium text-slate-400">Questions:</span>
                <span className="text-base font-bold text-white">{questionCount}</span>
              </div>
              <div className="flex justify-between items-center text-slate-200">
                <span className="font-sans font-medium text-emerald-400">Correct:</span>
                <span className="font-bold text-emerald-300">{formatMark(correctMark)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-200">
                <span className="font-sans font-medium text-rose-400">Incorrect:</span>
                <span className="font-bold text-rose-300">{formatMark(incorrectMark)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-200">
                <span className="font-sans font-medium text-slate-400">Not Attempted:</span>
                <span className="font-bold text-slate-300">{formatMark(notAttemptedMark)}</span>
              </div>
              <div className="pt-2 border-t border-white/15 flex justify-between items-center">
                <span className="font-sans font-semibold text-amber-300">Maximum Score:</span>
                <span className="text-xl font-extrabold text-amber-300">{maximumScore}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Max score is calculated as <code className="text-indigo-300 font-mono">{questionCount} × {formatMark(correctMark)} = {maximumScore}</code>.
            </p>
          </div>

          {/* Self-Evaluation Explainer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-semibold text-sm">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>How Self-Evaluation Works</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">1.</span>
                <span>Select option (A, B, C, or D) corresponding to your answer.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">2.</span>
                <span>Click <strong>Next →</strong> to record your selection.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">3.</span>
                <span>Manually choose whether your answer was <strong>Correct</strong>, <strong>Incorrect</strong>, or <strong>Not Attempted</strong>.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">4.</span>
                <span>Use <strong>Finish Test</strong> at any point to conclude early with remaining marked 0.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
