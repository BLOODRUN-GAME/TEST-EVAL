import React from 'react';
import { AlertCircle, Flag, CheckCircle2, HelpCircle } from 'lucide-react';

export type CurrentQuestionFinishStatus = 'evaluated' | 'pending_evaluation' | 'unattempted';

interface FinishTestModalProps {
  isOpen: boolean;
  currentQuestionNumber: number;
  configuredLimit: number;
  currentStatus: CurrentQuestionFinishStatus;
  selectedOptionForCurrent?: 'A' | 'B' | 'C' | 'D' | null;
  onCancel: () => void;
  onFinishAtEndpoint: (endpoint: number, includeCurrentAsNotAttempted?: boolean) => void;
  onEvaluateCurrentThenFinish: () => void;
}

export const FinishTestModal: React.FC<FinishTestModalProps> = ({
  isOpen,
  currentQuestionNumber,
  configuredLimit,
  currentStatus,
  selectedOptionForCurrent,
  onCancel,
  onFinishAtEndpoint,
  onEvaluateCurrentThenFinish,
}) => {
  if (!isOpen) return null;

  const previousQuestionNumber = Math.max(1, currentQuestionNumber - 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="finish-title"
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
          <Flag className="w-6 h-6" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 id="finish-title" className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Finish Test Session
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Configure your test endpoint. Questions beyond your chosen endpoint will not exist in the final test.
          </p>
        </div>

        {/* CASE 1: Current question is ALREADY EVALUATED */}
        {currentStatus === 'evaluated' && (
          <div className="space-y-5">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm space-y-2.5 text-left font-mono">
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-sans font-medium">Configured Question Limit:</span>
                <strong className="text-slate-900 dark:text-white">{configuredLimit}</strong>
              </div>
              <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-300 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                <span className="font-sans font-medium">Actual Test Endpoint:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-base">
                  Q1 → Q{currentQuestionNumber} ({currentQuestionNumber} Questions)
                </strong>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl text-left text-xs text-indigo-900 dark:text-indigo-200">
              <p>
                ✓ Q1 through Q{currentQuestionNumber} will form the complete test.
              </p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Questions after Q{currentQuestionNumber} will be completely omitted and will not affect your score.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all cursor-pointer"
              >
                Continue Test
              </button>

              <button
                type="button"
                onClick={() => onFinishAtEndpoint(currentQuestionNumber)}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Finish Test (Q1–Q{currentQuestionNumber})
              </button>
            </div>
          </div>
        )}

        {/* CASE 2: Current question has answer selected but NOT YET EVALUATED */}
        {currentStatus === 'pending_evaluation' && (
          <div className="space-y-5">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Q{currentQuestionNumber} has not been evaluated yet.</span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                You selected <strong>Option {selectedOptionForCurrent ?? '—'}</strong>, but have not confirmed whether it was Correct or Incorrect.
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
                What would you like to do?
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Evaluate Q8 */}
              <button
                type="button"
                onClick={onEvaluateCurrentThenFinish}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Evaluate Q{currentQuestionNumber} & Finish (Include Q{currentQuestionNumber})</span>
              </button>

              {/* Option 2: Finish Without Q8 */}
              {currentQuestionNumber > 1 && (
                <button
                  type="button"
                  onClick={() => onFinishAtEndpoint(previousQuestionNumber)}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Finish Without Q{currentQuestionNumber} (End test at Q{previousQuestionNumber})
                </button>
              )}

              {/* Cancel */}
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2.5 px-4 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* CASE 3: Current question is UNATTEMPTED (e.g. user answered Q1..Q7 and is viewing Q8) */}
        {currentStatus === 'unattempted' && (
          <div className="space-y-5">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>You are currently viewing Question {currentQuestionNumber} (unanswered).</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Opening Question {currentQuestionNumber} does not automatically mean you want it included in your test results.
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
                What would you like to do?
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Finish at Q7 (Recommended) */}
              {currentQuestionNumber > 1 ? (
                <button
                  type="button"
                  onClick={() => onFinishAtEndpoint(previousQuestionNumber)}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer text-left flex items-center justify-between"
                >
                  <span>Finish at Q{previousQuestionNumber} (Q1–Q{previousQuestionNumber} only)</span>
                  <span className="text-[11px] font-normal opacity-80">Recommended</span>
                </button>
              ) : null}

              {/* Option 2: Include Q8 as Not Attempted */}
              <button
                type="button"
                onClick={() => onFinishAtEndpoint(currentQuestionNumber, true)}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Include Q{currentQuestionNumber} as Not Attempted (End test at Q{currentQuestionNumber})
              </button>

              {/* Cancel */}
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2.5 px-4 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel / Continue Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
