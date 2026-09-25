import React from 'react';
import type { ActiveTestSession } from '../types/quiz';
import { RotateCcw, Play, AlertTriangle } from 'lucide-react';

interface ResumeSessionModalProps {
  session: ActiveTestSession | null;
  onResume: () => void;
  onDiscard: () => void;
}

export const ResumeSessionModal: React.FC<ResumeSessionModalProps> = ({
  session,
  onResume,
  onDiscard,
}) => {
  if (!session) return null;

  const completedCount = Object.values(session.records).filter(
    (r) => r.result !== 'unanswered'
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-6 text-center"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Resume Previous Test?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            An active test in progress was detected on this device.
          </p>
        </div>

        {/* Session details */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2 text-left">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Questions Configured:</span>
            <strong className="text-slate-900 dark:text-white">{session.questionCount}</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Current Progress:</span>
            <strong className="text-indigo-600 dark:text-indigo-400">
              Question {session.currentQuestionIndex + 1} of {session.questionCount}
            </strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Evaluated So Far:</span>
            <strong className="text-slate-900 dark:text-white">{completedCount} Completed</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Mode:</span>
            <strong className="text-slate-900 dark:text-white">
              {session.entryMode === 'number_based' ? 'Number-Based Test' : 'Manual Questions'}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onResume}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Previous Test</span>
          </button>

          <button
            type="button"
            onClick={onDiscard}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Test (Discard Previous)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
