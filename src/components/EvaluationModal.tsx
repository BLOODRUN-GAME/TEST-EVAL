import React, { useEffect, useState } from 'react';
import type { EvaluationResult, MarkingScheme, Option } from '../types/quiz';
import { Check, X, MinusCircle, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { formatMark } from '../utils/scoreCalculator';

interface EvaluationModalProps {
  isOpen: boolean;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  options: Option[];
  markingScheme: MarkingScheme;
  referenceAnswer?: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  onEvaluate: (result: EvaluationResult) => void;
  onClose: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  isOpen,
  questionNumber,
  totalQuestions,
  selectedOption,
  options,
  markingScheme,
  referenceAnswer,
  explanation,
  onEvaluate,
  onClose,
}) => {
  const [showReference, setShowReference] = useState(false);

  // Reset showReference when opened for a new question
  useEffect(() => {
    setShowReference(false);
  }, [questionNumber, isOpen]);

  // Keyboard shortcut listener: 'c' = correct, 'i'/'x' = incorrect, 'n' = not attempted, 'escape' = close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'c' || key === '1') {
        e.preventDefault();
        onEvaluate('correct');
      } else if (key === 'i' || key === 'x' || key === '2') {
        e.preventDefault();
        onEvaluate('incorrect');
      } else if (key === 'n' || key === '3') {
        e.preventDefault();
        onEvaluate('not_attempted');
      } else if (key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onEvaluate, onClose]);

  if (!isOpen) return null;

  const selectedOptionObj = options.find((opt) => opt.id === selectedOption);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Top Header Badge */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              ANSWER RECORDED
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Q {questionNumber} / {totalQuestions}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-center">
          {/* Selected Option Feedback */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60">
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wide block mb-1">
              You selected
            </span>
            <div className="inline-flex items-center space-x-2 text-slate-900 dark:text-white">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {selectedOption ?? '—'}
              </span>
              <span className="text-base font-semibold truncate max-w-[280px] sm:max-w-xs text-left">
                {selectedOptionObj?.text ?? 'No option selected'}
              </span>
            </div>
          </div>

          {/* Evaluation Prompt */}
          <div className="space-y-1">
            <h2 id="modal-title" className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Was your answer correct?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Honest self-evaluation ensures accurate performance analytics.
            </p>
          </div>

          {/* Two Large Action Buttons: Correct & Incorrect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* Correct Button */}
            <button
              type="button"
              onClick={() => onEvaluate('correct')}
              className="group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Check className="w-6 h-6 stroke-[3]" />
                <span className="text-xl">Correct</span>
              </div>
              <span className="text-xs font-semibold text-emerald-100 bg-emerald-600/60 px-2 py-0.5 rounded-full">
                Marks: {formatMark(markingScheme.correct)}
              </span>
              <span className="text-[10px] text-emerald-200 mt-1 opacity-70">
                Key shortcut: [C]
              </span>
            </button>

            {/* Incorrect Button */}
            <button
              type="button"
              onClick={() => onEvaluate('incorrect')}
              className="group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2 mb-1">
                <X className="w-6 h-6 stroke-[3]" />
                <span className="text-xl">Incorrect</span>
              </div>
              <span className="text-xs font-semibold text-rose-100 bg-rose-600/60 px-2 py-0.5 rounded-full">
                Marks: {formatMark(markingScheme.incorrect)}
              </span>
              <span className="text-[10px] text-rose-200 mt-1 opacity-70">
                Key shortcut: [I]
              </span>
            </button>
          </div>

          {/* Not Attempted Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onEvaluate('not_attempted')}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              <MinusCircle className="w-4 h-4 text-slate-400" />
              <span>Not Attempted ({formatMark(markingScheme.notAttempted)})</span>
              <span className="text-[10px] text-slate-400 ml-1">[N]</span>
            </button>
          </div>

          {/* Future-Ready Reference Answer Toggle */}
          {referenceAnswer && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
              <button
                type="button"
                onClick={() => setShowReference(!showReference)}
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
              >
                {showReference ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showReference ? 'Hide Reference Answer' : 'Check Reference Answer Key (Practice Aid)'}</span>
              </button>

              {showReference && (
                <div className="mt-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center space-x-1.5 font-bold mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reference Key: Option {referenceAnswer}</span>
                  </div>
                  {explanation && <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90">{explanation}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
