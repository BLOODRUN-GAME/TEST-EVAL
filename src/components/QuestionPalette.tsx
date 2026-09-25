import React from 'react';
import type { QuestionRecord } from '../types/quiz';
import { Check, X, Minus, HelpCircle, CheckCircle2 } from 'lucide-react';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  records: Record<number, QuestionRecord>;
  pendingAnswer?: 'A' | 'B' | 'C' | 'D' | null;
  onSelectQuestion: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  currentQuestionIndex,
  records,
  pendingAnswer,
  onSelectQuestion,
}) => {
  const getQuestionStatus = (qIndex: number) => {
    const qNum = qIndex + 1;
    const record = records[qNum];

    // If it's the current question and there is an unconfirmed pending answer
    if (qIndex === currentQuestionIndex && pendingAnswer && (!record || record.result === 'unanswered')) {
      return 'pending';
    }

    if (!record || record.result === 'unanswered') {
      return 'not_started';
    }

    return record.result; // 'correct' | 'incorrect' | 'not_attempted'
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          <span>Question Palette</span>
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {totalQuestions} Total
        </span>
      </div>

      {/* Grid Matrix of Questions (Scrollable) */}
      <div className="grid grid-cols-5 gap-2 max-h-[340px] overflow-y-auto pr-1">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const qNum = i + 1;
          const status = getQuestionStatus(i);
          const isCurrent = i === currentQuestionIndex;

          let btnClasses = 'border text-xs font-bold rounded-xl h-10 w-full flex items-center justify-center transition-all relative cursor-pointer ';
          let icon = null;

          if (isCurrent) {
            btnClasses += 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10 ';
          }

          switch (status) {
            case 'correct': // Green
              btnClasses += 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/20';
              icon = <Check className="w-2.5 h-2.5 stroke-[3] absolute top-1 right-1" />;
              break;

            case 'incorrect': // Red
              btnClasses += 'bg-rose-500 hover:bg-rose-600 border-rose-600 text-white shadow-sm shadow-rose-500/20';
              icon = <X className="w-2.5 h-2.5 stroke-[3] absolute top-1 right-1" />;
              break;

            case 'not_attempted': // Blue / Neutral (Requirement 8)
              btnClasses += 'bg-sky-500 hover:bg-sky-600 border-sky-600 text-white shadow-sm shadow-sky-500/20';
              icon = <Minus className="w-2.5 h-2.5 stroke-[3] absolute top-1 right-1" />;
              break;

            case 'pending': // Yellow (Requirement 8)
              btnClasses += 'bg-amber-400 hover:bg-amber-500 border-amber-500 text-amber-950 font-extrabold shadow-sm animate-pulse';
              icon = <HelpCircle className="w-2.5 h-2.5 absolute top-1 right-1 text-amber-900" />;
              break;

            case 'not_started': // Grey (Requirement 8)
            default:
              btnClasses += isCurrent
                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 text-indigo-700 dark:text-indigo-300'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400';
              break;
          }

          return (
            <button
              key={qNum}
              type="button"
              onClick={() => onSelectQuestion(i)}
              className={btnClasses}
              title={`Go to Question ${qNum} (${status.replace('_', ' ')})`}
            >
              <span>{qNum}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Status Legend (Requirement 8 exact 5 colors) */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5 text-slate-600 dark:text-slate-400">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
          {/* Green - Correct */}
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold">✓</span>
            <span className="font-medium">Green: Correct</span>
          </div>

          {/* Red - Incorrect */}
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-500 flex items-center justify-center text-white text-[9px] font-bold">✗</span>
            <span className="font-medium">Red: Incorrect</span>
          </div>

          {/* Blue - Not Attempted */}
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-sky-500 flex items-center justify-center text-white text-[9px] font-bold">—</span>
            <span className="font-medium">Blue: Not Attempted</span>
          </div>

          {/* Yellow - Pending */}
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500"></span>
            <span className="font-medium">Yellow: Selected</span>
          </div>

          {/* Grey - Not Visited */}
          <div className="flex items-center space-x-1.5 col-span-2">
            <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"></span>
            <span className="font-medium">Grey: Not Visited</span>
          </div>
        </div>
      </div>
    </div>
  );
};
