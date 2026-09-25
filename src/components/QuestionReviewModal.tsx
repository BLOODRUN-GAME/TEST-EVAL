import React from 'react';
import type { QuestionRecord, Option } from '../types/quiz';
import { X, CheckCircle, XCircle, MinusCircle, Check } from 'lucide-react';
import { formatMark } from '../utils/scoreCalculator';

interface QuestionReviewModalProps {
  isOpen: boolean;
  record: QuestionRecord | null;
  options?: Option[];
  onClose: () => void;
}

export const QuestionReviewModal: React.FC<QuestionReviewModalProps> = ({
  isOpen,
  record,
  options,
  onClose,
}) => {
  if (!isOpen || !record) return null;

  const defaultOptions: Option[] = options && options.length > 0 ? options : [
    { id: 'A', text: 'Option A' },
    { id: 'B', text: 'Option B' },
    { id: 'C', text: 'Option C' },
    { id: 'D', text: 'Option D' },
  ];

  const isCorrect = record.result === 'correct';
  const isIncorrect = record.result === 'incorrect';
  const isNotAttempted = record.result === 'not_attempted' || record.result === 'unanswered';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              Q{record.questionNumber}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              Question {record.questionNumber} Review
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Question Text / Notes */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60">
            <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">
              Question Prompt
            </span>
            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
              {record.questionText || `Question ${record.questionNumber}`}
            </p>
            {record.notes && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-mono">
                Notes: {record.notes}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-semibold text-slate-400 block">
              Options
            </span>
            <div className="space-y-2">
              {defaultOptions.map((opt) => {
                const isSelected = record.selectedOption === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`flex items-center p-3 rounded-xl border text-xs sm:text-sm font-medium ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md font-bold flex items-center justify-center mr-3 text-xs ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {isSelected && (
                      <span className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-semibold text-xs ml-2">
                        <Check className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evaluation Outcome */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                Confirmed Self-Evaluation
              </span>
              <div className="flex items-center space-x-1.5 font-bold text-sm">
                {isCorrect && (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Correct</span>
                  </span>
                )}
                {isIncorrect && (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center space-x-1">
                    <XCircle className="w-4 h-4" />
                    <span>Incorrect</span>
                  </span>
                )}
                {isNotAttempted && (
                  <span className="text-slate-500 flex items-center space-x-1">
                    <MinusCircle className="w-4 h-4" />
                    <span>Not Attempted</span>
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                Marks Awarded
              </span>
              <span
                className={`font-mono text-base font-extrabold ${
                  record.marksObtained > 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : record.marksObtained < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500'
                }`}
              >
                {formatMark(record.marksObtained)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
