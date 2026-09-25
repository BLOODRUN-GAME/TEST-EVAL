import React, { useState, useEffect } from 'react';
import type { Question, QuestionRecord, MarkingScheme, EvaluationResult } from '../types/quiz';
import { ArrowLeft, AlertCircle, MinusCircle, LayoutGrid, Clock, Check, Flag } from 'lucide-react';
import { EvaluationModal } from './EvaluationModal';
import { QuestionPalette } from './QuestionPalette';
import { FinishTestModal, type CurrentQuestionFinishStatus } from './FinishTestModal';
import { formatMark } from '../utils/scoreCalculator';

interface TestScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  records: Record<number, QuestionRecord>;
  markingScheme: MarkingScheme;
  onSelectOption: (questionIndex: number, optionId: 'A' | 'B' | 'C' | 'D' | null, notes?: string) => void;
  onRecordEvaluation: (questionIndex: number, result: EvaluationResult, notes?: string) => void;
  onNavigateQuestion: (index: number) => void;
  onRequestFinishTest: () => void;
  isFinishModalOpen: boolean;
  onCloseFinishModal: () => void;
  onConfirmFinishTest: (endpoint: number) => void;
}

export const TestScreen: React.FC<TestScreenProps> = ({
  questions,
  currentQuestionIndex,
  records,
  markingScheme,
  onSelectOption,
  onRecordEvaluation,
  onNavigateQuestion,
  onRequestFinishTest,
  isFinishModalOpen,
  onCloseFinishModal,
  onConfirmFinishTest,
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const qNum = currentQuestionIndex + 1;
  const totalQuestions = questions.length;
  const currentRecord = records[qNum];

  // Local selection state (defaults to existing recorded answer if any)
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(
    currentRecord?.selectedOption ?? null
  );

  // Optional question reference/notes (e.g. "HC Verma Q14" or "JEE 2024 Q5")
  const [questionNotes, setQuestionNotes] = useState<string>(
    currentRecord?.notes ?? currentQuestion.notes ?? ''
  );

  // Validation warning state
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modal open state for Step 3: Self-Evaluation
  const [isEvaluationOpen, setIsEvaluationOpen] = useState<boolean>(false);
  const [isEvaluatingBeforeFinish, setIsEvaluatingBeforeFinish] = useState<boolean>(false);

  // Mobile drawer state for palette
  const [isPaletteOpenMobile, setIsPaletteOpenMobile] = useState<boolean>(false);

  // Elapsed timer
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds as mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Track previous question index to ONLY sync states and reset modal when navigating to a DIFFERENT question
  const prevQuestionIndexRef = React.useRef(currentQuestionIndex);

  useEffect(() => {
    if (prevQuestionIndexRef.current !== currentQuestionIndex) {
      prevQuestionIndexRef.current = currentQuestionIndex;
      const rec = records[currentQuestionIndex + 1];
      const q = questions[currentQuestionIndex];
      setSelectedOption(rec?.selectedOption ?? null);
      setQuestionNotes(rec?.notes ?? q?.notes ?? '');
      setValidationError(null);
      setIsEvaluationOpen(false);
    }
  }, [currentQuestionIndex, records, questions]);

  // Handle option click (Requirement 6 & 7: Changing the selected option)
  const handleOptionClick = (optionId: 'A' | 'B' | 'C' | 'D') => {
    const previousOption = selectedOption;
    setSelectedOption(optionId);
    setValidationError(null);
    onSelectOption(currentQuestionIndex, optionId, questionNotes);

    // If changing from an already recorded answer, or clicking option in an already evaluated question,
    // trigger evaluation modal as per Requirement 7:
    // "User changes the answer to: Selected: B. The application should ask again: Was your answer correct?"
    if (currentRecord && currentRecord.result !== 'unanswered' && previousOption !== optionId) {
      setIsEvaluationOpen(true);
    }
  };

  // Keyboard navigation for options A, B, C, D and Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEvaluationOpen || isFinishModalOpen) return; // let modal handle keys
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return; // ignore if typing in notes input

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        e.preventDefault();
        handleOptionClick(key as 'A' | 'B' | 'C' | 'D');
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const map: Record<string, 'A' | 'B' | 'C' | 'D'> = {
          '1': 'A',
          '2': 'B',
          '3': 'C',
          '4': 'D',
        };
        handleOptionClick(map[e.key]);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNextClick();
      } else if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        e.preventDefault();
        onNavigateQuestion(currentQuestionIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEvaluationOpen, isFinishModalOpen, selectedOption, currentQuestionIndex]);

  // Handling "Next"
  const handleNextClick = () => {
    if (!selectedOption) {
      setValidationError('Please select an answer first.');
      return;
    }

    // If this question was already evaluated and the selected option has not changed, simply advance
    if (currentRecord && currentRecord.result !== 'unanswered' && currentRecord.selectedOption === selectedOption) {
      advanceToNext();
      return;
    }

    // Log selected answer and open Step 3 self-evaluation modal
    onSelectOption(currentQuestionIndex, selectedOption, questionNotes);
    setValidationError(null);
    setIsEvaluationOpen(true);
  };

  // Directly mark as Not Attempted
  const handleMarkNotAttemptedDirect = () => {
    setSelectedOption(null);
    onSelectOption(currentQuestionIndex, null, questionNotes);
    onRecordEvaluation(currentQuestionIndex, 'not_attempted', questionNotes);
    advanceToNext();
  };

  // Step 4: After user confirms evaluation
  const handleEvaluationResult = (result: EvaluationResult) => {
    setIsEvaluationOpen(false);
    onRecordEvaluation(currentQuestionIndex, result, questionNotes);
    if (isEvaluatingBeforeFinish) {
      setIsEvaluatingBeforeFinish(false);
      onConfirmFinishTest(currentQuestionIndex + 1);
    } else {
      advanceToNext();
    }
  };

  const handleFinishAtEndpoint = (endpoint: number, includeCurrentAsNotAttempted?: boolean) => {
    onCloseFinishModal();
    if (includeCurrentAsNotAttempted) {
      onRecordEvaluation(currentQuestionIndex, 'not_attempted', questionNotes);
    }
    onConfirmFinishTest(endpoint);
  };

  const handleEvaluateCurrentThenFinish = () => {
    onCloseFinishModal();
    setIsEvaluatingBeforeFinish(true);
    if (!selectedOption) {
      setValidationError('Please select an option first to evaluate Q' + qNum);
      return;
    }
    onSelectOption(currentQuestionIndex, selectedOption, questionNotes);
    setIsEvaluationOpen(true);
  };

  const advanceToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      onNavigateQuestion(currentQuestionIndex + 1);
    } else {
      // Last question reached and evaluated -> finalize test!
      onConfirmFinishTest(totalQuestions);
    }
  };

  // Determine current question status for Finish modal
  const currentStatus: CurrentQuestionFinishStatus = 
    currentRecord && currentRecord.result !== 'unanswered'
      ? 'evaluated'
      : selectedOption !== null
      ? 'pending_evaluation'
      : 'unattempted';

  const completedQuestionsCount = Object.values(records).filter(
    (r) => r.result !== 'unanswered'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile Top Bar */}
      <div className="flex lg:hidden items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Time: {formatTime(secondsElapsed)}</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Mobile Finish Test Button */}
          <button
            type="button"
            onClick={onRequestFinishTest}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold cursor-pointer"
          >
            <Flag className="w-3 h-3" />
            <span>Finish</span>
          </button>

          {/* Mobile Palette Toggle */}
          <button
            onClick={() => setIsPaletteOpenMobile(!isPaletteOpenMobile)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isPaletteOpenMobile ? 'Close Palette' : 'Palette'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Palette Dropdown */}
      {isPaletteOpenMobile && (
        <div className="block lg:hidden mb-6">
          <QuestionPalette
            totalQuestions={totalQuestions}
            currentQuestionIndex={currentQuestionIndex}
            records={records}
            pendingAnswer={selectedOption}
            onSelectQuestion={(idx) => {
              onNavigateQuestion(idx);
              setIsPaletteOpenMobile(false);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Test Examination Card */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-10 space-y-8">
          {/* Card Top: Examination Header & Finish Test Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs uppercase tracking-wide">
                TEST
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Question {qNum} <span className="text-slate-400 font-normal text-base">of {totalQuestions}</span>
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              {/* Evaluated Status Pill if already evaluated */}
              {currentRecord && currentRecord.result !== 'unanswered' ? (
                <div
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    currentRecord.result === 'correct'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                      : currentRecord.result === 'incorrect'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300'
                      : 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300'
                  }`}
                >
                  {currentRecord.result === 'correct' && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>
                    {currentRecord.result === 'correct'
                      ? `Correct (${formatMark(currentRecord.marksObtained)})`
                      : currentRecord.result === 'incorrect'
                      ? `Incorrect (${formatMark(currentRecord.marksObtained)})`
                      : 'Not Attempted (0)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEvaluationOpen(true)}
                    className="ml-1 text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
                    title="Change evaluation result"
                  >
                    Edit
                  </button>
                </div>
              ) : null}

              {/* Requirement 1: Finish Test Button (Clearly visible at ANY point) */}
              <button
                type="button"
                onClick={onRequestFinishTest}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors cursor-pointer"
                title="Finish Test at any time"
              >
                <Flag className="w-3.5 h-3.5 text-rose-600" />
                <span>Finish Test</span>
              </button>
            </div>
          </div>

          {/* Question Text & Optional Notes (Requirement 4 & 5) */}
          <div className="space-y-3">
            {currentQuestion.isNumberBased ? (
              /* Number-Based Test Mode: No question text required! */
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                  <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                    Number-Based Test Tracker
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                    Question {qNum}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Refer to your physical book, PDF, or question paper and select your chosen answer below.
                  </p>
                </div>

                {/* Optional question reference / notes field */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={questionNotes}
                      onChange={(e) => {
                        setQuestionNotes(e.target.value);
                        onSelectOption(currentQuestionIndex, selectedOption, e.target.value);
                      }}
                      placeholder="Optional question notes / reference (e.g. 'Ch 3 Q14' or leave blank)..."
                      className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Manual Questions Mode */
              <div className="space-y-2">
                <p className="text-lg sm:text-xl font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                  {currentQuestion.text}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Select an option below and press &ldquo;Next →&rdquo; to proceed to self-evaluation.
                </p>
              </div>
            )}
          </div>

          {/* Options List (Requirement 5: Large generic choices A, B, C, D in Number-Based mode) */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionClick(option.id)}
                  className={`w-full min-h-[56px] group text-left flex items-center p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-md shadow-indigo-600/10 scale-[1.01]'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {/* Option Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-sm mr-4 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200'
                    }`}
                  >
                    {option.id}
                  </div>

                  {/* Option Text */}
                  <span className="text-base sm:text-lg font-medium flex-1">
                    {currentQuestion.isNumberBased ? (
                      <span className="font-semibold">Option {option.id}</span>
                    ) : (
                      option.text
                    )}
                  </span>

                  {/* Checked indicator */}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center ml-2">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center justify-between p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-150">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{validationError}</span>
              </div>
              <button
                type="button"
                onClick={handleMarkNotAttemptedDirect}
                className="underline hover:text-rose-900 dark:hover:text-rose-100 font-bold ml-2 cursor-pointer"
              >
                Or Mark as Not Attempted
              </button>
            </div>
          )}

          {/* Action Bar (Requirement 9: Side-by-Side [ ← Previous ] and [ Next → ]) */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Not Attempted option */}
            <div>
              <button
                type="button"
                onClick={handleMarkNotAttemptedDirect}
                className="min-h-[48px] flex items-center space-x-1.5 px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <MinusCircle className="w-4 h-4" />
                <span>Mark Not Attempted</span>
              </button>
            </div>

            {/* Right: Side-by-side Previous and Next (Requirement 9) */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => currentQuestionIndex > 0 && onNavigateQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className={`min-h-[48px] flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm transition-all ${
                  currentQuestionIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800 text-slate-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextClick}
                className="min-h-[48px] flex-1 sm:flex-initial min-w-[140px] flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{currentQuestionIndex === totalQuestions - 1 ? 'Evaluate & Finish' : 'Next →'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar: Question Palette, Timer & Finish Test */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          {/* Timer Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Test Duration</span>
            </div>
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
              {formatTime(secondsElapsed)}
            </span>
          </div>

          {/* Palette */}
          <QuestionPalette
            totalQuestions={totalQuestions}
            currentQuestionIndex={currentQuestionIndex}
            records={records}
            pendingAnswer={selectedOption}
            onSelectQuestion={onNavigateQuestion}
          />

          {/* Finish Test Card (Requirement 1 & 2) */}
          <div className="bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-4 text-center space-y-2 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedQuestionsCount} of {totalQuestions} questions completed. You can finish at any time!
            </p>
            <button
              type="button"
              onClick={onRequestFinishTest}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Flag className="w-4 h-4" />
              <span>Finish Test Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation / Self-Evaluation Modal */}
      <EvaluationModal
        isOpen={isEvaluationOpen}
        questionNumber={qNum}
        totalQuestions={totalQuestions}
        selectedOption={selectedOption}
        options={currentQuestion.options}
        markingScheme={markingScheme}
        referenceAnswer={currentQuestion.correctOption}
        explanation={currentQuestion.explanation}
        onEvaluate={handleEvaluationResult}
        onClose={() => setIsEvaluationOpen(false)}
      />

      {/* Finish Test Confirmation Modal */}
      <FinishTestModal
        isOpen={isFinishModalOpen}
        currentQuestionNumber={qNum}
        configuredLimit={totalQuestions}
        currentStatus={currentStatus}
        selectedOptionForCurrent={selectedOption}
        onCancel={onCloseFinishModal}
        onFinishAtEndpoint={handleFinishAtEndpoint}
        onEvaluateCurrentThenFinish={handleEvaluateCurrentThenFinish}
      />
    </div>
  );
};
