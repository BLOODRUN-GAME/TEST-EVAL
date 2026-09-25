import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { TestStats } from '../types/quiz';

interface LiveScoreBarProps {
  currentQuestionNumber: number;
  totalQuestions: number;
  stats: TestStats;
  explicitUnattemptedCount: number;
}

export const LiveScoreBar: React.FC<LiveScoreBarProps> = ({
  currentQuestionNumber,
  totalQuestions,
  stats,
  explicitUnattemptedCount,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between">
          {/* Main indicators matching Requirement 10 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
              <span className="text-slate-400 font-normal">Questions:</span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
                {currentQuestionNumber} / {totalQuestions}
              </span>
            </div>

            {!isMinimized && (
              <>
                <div className="hidden sm:inline-block w-px h-4 bg-slate-200 dark:bg-slate-800" />
                
                <div className="hidden xs:flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Correct:</span>
                  <span className="font-bold">{stats.correct}</span>
                </div>

                <div className="hidden xs:flex items-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400">
                  <span>Incorrect:</span>
                  <span className="font-bold">{stats.incorrect}</span>
                </div>

                <div className="hidden md:flex items-center space-x-1.5 text-xs text-sky-600 dark:text-sky-400">
                  <span>Unattempted:</span>
                  <span className="font-bold">{explicitUnattemptedCount}</span>
                </div>
              </>
            )}
          </div>

          {/* Current Score Indicator & Toggle */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 px-3 py-1.5 rounded-xl border border-indigo-200/60 dark:border-indigo-800/60">
              <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-300">
                Score:
              </span>
              <span className="text-sm sm:text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                {stats.finalScore}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isMinimized ? "Show detailed live score ticker" : "Minimize live score ticker"}
            >
              {isMinimized ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile expanded sub-row */}
        {!isMinimized && (
          <div className="flex xs:hidden items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span className="text-emerald-600">Correct: <strong>{stats.correct}</strong></span>
            <span className="text-rose-600">Incorrect: <strong>{stats.incorrect}</strong></span>
            <span className="text-sky-600">Unattempted: <strong>{explicitUnattemptedCount}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
