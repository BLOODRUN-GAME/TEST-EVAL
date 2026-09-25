import React from 'react';
import type { TestHistoryItem } from '../types/quiz';
import { History, X, Trash2, Calendar, CheckCircle, XCircle, MinusCircle, ArrowRight } from 'lucide-react';

interface TestHistoryModalProps {
  isOpen: boolean;
  history: TestHistoryItem[];
  onClose: () => void;
  onSelectTest: (test: TestHistoryItem) => void;
  onClearHistory: () => void;
}

export const TestHistoryModal: React.FC<TestHistoryModalProps> = ({
  isOpen,
  history,
  onClose,
  onSelectTest,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Test History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {history.length} saved test session{history.length !== 1 ? 's' : ''} stored locally
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Clear all saved tests"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                No Tests Recorded Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Complete or finish a test to automatically save your evaluation logs and score history here.
              </p>
            </div>
          ) : (
            history.map((item, idx) => {
              const testNum = history.length - idx;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectTest(item);
                    onClose();
                  }}
                  className="group cursor-pointer p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-slate-850 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 shadow-sm transition-all relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        #{testNum}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            Test #{testNum}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.actualTestLength ?? item.questionCount} Questions
                          </span>
                          {item.completionType === 'finished_early' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                              Finished at Q{item.actualTestLength ?? item.questionCount} (Configured: {item.configuredLimit ?? item.questionCount})
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                              Completed Normally
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.entryMode === 'number_based' ? 'Number-Based Mode' : 'Manual Questions'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Score badge */}
                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Score</span>
                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                          {item.stats.finalScore} <span className="text-xs text-slate-400 font-normal">/ {item.stats.maximumScore}</span>
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                  {/* Stat pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Attempted:</span>
                      <strong className="text-slate-900 dark:text-white">{item.stats.attempted}</strong>
                    </div>
                    <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{item.stats.correct} Correct</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-rose-600 dark:text-rose-400">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{item.stats.incorrect} Incorrect</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <MinusCircle className="w-3.5 h-3.5" />
                      <span>{item.stats.notAttempted} Unattempted</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 font-semibold col-span-2 sm:col-span-1">
                      <span>Acc: {item.stats.accuracy}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
