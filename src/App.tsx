import React, { useState, useEffect } from 'react';
import type { 
  QuizPhase, MarkingScheme, Question, QuestionRecord, 
  EvaluationResult, QuestionEntryMode, TestCompletionType, 
  TestHistoryItem, ActiveTestSession 
} from './types/quiz';
import { generateQuestionSet } from './data/questionBanks';
import { calculateTestStats } from './utils/scoreCalculator';
import { Navbar } from './components/Navbar';
import { SetupScreen } from './components/SetupScreen';
import { TestScreen } from './components/TestScreen';
import { LiveScoreBar } from './components/LiveScoreBar';
import { ResultScreen } from './components/ResultScreen';
import { TestHistoryModal } from './components/TestHistoryModal';
import { ResumeSessionModal } from './components/ResumeSessionModal';

const ACTIVE_SESSION_KEY = 'self_eval_active_session';
const HISTORY_KEY = 'self_eval_quiz_history';
const THEME_KEY = 'self_eval_dark_mode';

export const App: React.FC = () => {
  // Test Phase
  const [phase, setPhase] = useState<QuizPhase>('setup');

  // Dark Mode Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'false');
    }
  }, [darkMode]);

  // Quiz Configuration
  const [markingScheme, setMarkingScheme] = useState<MarkingScheme>({
    correct: 2,
    incorrect: -0.5,
    notAttempted: 0,
  });

  const [entryMode, setEntryMode] = useState<QuestionEntryMode>('number_based');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [configuredQuestionsLimit, setConfiguredQuestionsLimit] = useState<number>(25);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [records, setRecords] = useState<Record<number, QuestionRecord>>({});
  const [completionType, setCompletionType] = useState<TestCompletionType>('completed_normally');

  // Modals state
  const [isFinishModalOpen, setIsFinishModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [savedActiveSession, setSavedActiveSession] = useState<ActiveTestSession | null>(null);

  // History state
  const [history, setHistory] = useState<TestHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Check for saved active session on mount (Requirement 17: Prevent Accidental Data Loss)
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (rawSession) {
        const parsed: ActiveTestSession = JSON.parse(rawSession);
        if (parsed && parsed.questions && parsed.questions.length > 0) {
          setSavedActiveSession(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save active session to localStorage whenever in testing phase
  useEffect(() => {
    if (phase === 'testing' && questions.length > 0) {
      const sessionData: ActiveTestSession = {
        questionCount: questions.length,
        entryMode,
        markingScheme,
        currentQuestionIndex,
        questions,
        records,
        startedAt: Date.now(),
        lastUpdated: Date.now(),
      };
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(sessionData));
    }
  }, [phase, questions, entryMode, markingScheme, currentQuestionIndex, records]);

  // Helper to persist history
  const saveToHistory = (
    finalRecords: QuestionRecord[],
    testStats: ReturnType<typeof calculateTestStats>,
    finishType: TestCompletionType,
    endpoint: number
  ) => {
    const historyItem: TestHistoryItem = {
      id: `test_${Date.now()}`,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      questionCount: endpoint,
      configuredLimit: configuredQuestionsLimit,
      actualTestLength: endpoint,
      endpointQuestion: endpoint,
      entryMode,
      completionType: finishType,
      completedQuestionsCount: testStats.completedQuestionsCount,
      remainingQuestionsCount: testStats.remainingQuestionsCount,
      stats: testStats,
      markingScheme,
      records: finalRecords,
    };

    setHistory((prev) => {
      const updated = [historyItem, ...prev];
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Resume active test from modal
  const handleResumeSession = () => {
    if (!savedActiveSession) return;
    setQuestions(savedActiveSession.questions);
    setConfiguredQuestionsLimit(savedActiveSession.questionCount);
    setRecords(savedActiveSession.records);
    setMarkingScheme(savedActiveSession.markingScheme);
    setEntryMode(savedActiveSession.entryMode);
    setCurrentQuestionIndex(savedActiveSession.currentQuestionIndex);
    setPhase('testing');
    setSavedActiveSession(null);
  };

  // Discard saved session
  const handleDiscardSession = () => {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    setSavedActiveSession(null);
  };

  // Start Test action from Setup Screen
  const handleStartTest = (count: number, scheme: MarkingScheme, mode: QuestionEntryMode) => {
    const generated = generateQuestionSet(count, mode);
    setQuestions(generated);
    setConfiguredQuestionsLimit(count);
    setMarkingScheme(scheme);
    setEntryMode(mode);
    setCurrentQuestionIndex(0);
    setCompletionType('completed_normally');

    // Initialize clean records
    const initialRecords: Record<number, QuestionRecord> = {};
    generated.forEach((q) => {
      initialRecords[q.id] = {
        questionNumber: q.id,
        questionText: q.text,
        notes: q.notes,
        selectedOption: null,
        result: 'unanswered',
        marksObtained: 0,
      };
    });
    setRecords(initialRecords);
    setPhase('testing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Log Selected Answer without assigning marks (Requirement 6 & 7: single record per question)
  const handleSelectOption = (
    questionIndex: number, 
    optionId: 'A' | 'B' | 'C' | 'D' | null,
    notes?: string
  ) => {
    const qNum = questionIndex + 1;
    const currentQ = questions[questionIndex];

    setRecords((prev) => {
      const existing = prev[qNum] || {
        questionNumber: qNum,
        questionText: currentQ.text,
        result: 'unanswered',
        marksObtained: 0,
      };

      return {
        ...prev,
        [qNum]: {
          ...existing,
          selectedOption: optionId,
          notes: notes !== undefined ? notes : existing.notes,
        },
      };
    });
  };

  // Step 4: Record Result (Manual Self-Evaluation)
  const handleRecordEvaluation = (
    questionIndex: number, 
    result: EvaluationResult,
    notes?: string
  ) => {
    const qNum = questionIndex + 1;
    const currentQ = questions[questionIndex];

    let marks = 0;
    if (result === 'correct') {
      marks = markingScheme.correct;
    } else if (result === 'incorrect') {
      marks = markingScheme.incorrect;
    } else if (result === 'not_attempted') {
      marks = markingScheme.notAttempted;
    }

    setRecords((prev) => {
      const existing = prev[qNum] || {
        questionNumber: qNum,
        questionText: currentQ.text,
        selectedOption: null,
      };

      return {
        ...prev,
        [qNum]: {
          ...existing,
          questionNumber: qNum,
          questionText: currentQ.text,
          notes: notes !== undefined ? notes : existing.notes,
          selectedOption: result === 'not_attempted' ? null : existing.selectedOption,
          result: result,
          marksObtained: marks,
          timestamp: Date.now(),
        },
      };
    });
  };

  // Safe question jump
  const handleNavigateQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Conclude Test: truncate strictly at endpoint N
  const finalizeTest = (endpoint: number, type: TestCompletionType) => {
    setCompletionType(type);
    setIsFinishModalOpen(false);

    // Truncate questions strictly to endpoint Q1..Q{endpoint}
    const truncatedQuestions = questions.slice(0, endpoint);
    setQuestions(truncatedQuestions);

    // Build final records strictly for Q1..Q{endpoint}
    const finalRecords: Record<number, QuestionRecord> = {};
    truncatedQuestions.forEach((q) => {
      const existing = records[q.id];
      if (existing && existing.result !== 'unanswered') {
        finalRecords[q.id] = existing;
      } else {
        // Any question inside the completed range 1..endpoint that was not answered is marked Not Attempted
        finalRecords[q.id] = {
          questionNumber: q.id,
          questionText: q.text,
          notes: q.notes,
          selectedOption: null,
          result: 'not_attempted',
          marksObtained: markingScheme.notAttempted, // 0 marks
          timestamp: Date.now(),
        };
      }
    });

    setRecords(finalRecords);

    // Calculate final stats based on actual endpoint (e.g. 8) and configured limit (e.g. 25)
    const finalStats = calculateTestStats(
      Object.values(finalRecords),
      markingScheme,
      endpoint,
      configuredQuestionsLimit
    );

    // Save to test history
    saveToHistory(Object.values(finalRecords), finalStats, type, endpoint);

    // Clear active in-progress session
    localStorage.removeItem(ACTIVE_SESSION_KEY);

    setPhase('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User clicks Finish Test at any point
  const handleRequestFinishTest = () => {
    setIsFinishModalOpen(true);
  };

  const handleConfirmFinishTest = (endpoint: number) => {
    const isEarly = endpoint < configuredQuestionsLimit;
    finalizeTest(endpoint, isEarly ? 'finished_early' : 'completed_normally');
  };

  // Retake Same Test (Restores original configured limit)
  const handleRetakeTest = () => {
    const generated = generateQuestionSet(configuredQuestionsLimit, entryMode);
    setQuestions(generated);
    const freshRecords: Record<number, QuestionRecord> = {};
    generated.forEach((q) => {
      freshRecords[q.id] = {
        questionNumber: q.id,
        questionText: q.text,
        notes: q.notes,
        selectedOption: null,
        result: 'unanswered',
        marksObtained: 0,
      };
    });
    setRecords(freshRecords);
    setCurrentQuestionIndex(0);
    setCompletionType('completed_normally');
    setPhase('testing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to Setup (Requirement 16)
  const handleNewTest = () => {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    setPhase('setup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quit / reset confirmation
  const handleResetTest = () => {
    if (phase === 'testing') {
      const confirmed = window.confirm('Are you sure you want to quit the current test? Your progress will be discarded.');
      if (!confirmed) return;
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
    setPhase('setup');
  };

  // Open past test from history
  const handleSelectHistoryItem = (item: TestHistoryItem) => {
    setQuestions(
      item.records.map((r) => ({
        id: r.questionNumber,
        text: r.questionText,
        notes: r.notes,
        options: [
          { id: 'A', text: 'Option A' },
          { id: 'B', text: 'Option B' },
          { id: 'C', text: 'Option C' },
          { id: 'D', text: 'Option D' },
        ],
        isNumberBased: item.entryMode === 'number_based',
      }))
    );
    const recMap: Record<number, QuestionRecord> = {};
    item.records.forEach((r) => {
      recMap[r.questionNumber] = r;
    });
    setRecords(recMap);
    setConfiguredQuestionsLimit(item.configuredLimit || item.questionCount);
    setMarkingScheme(item.markingScheme);
    setEntryMode(item.entryMode);
    setCompletionType(item.completionType);
    setPhase('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all test history?')) {
      localStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    }
  };

  // Current stats calculation
  const stats = calculateTestStats(
    Object.values(records),
    markingScheme,
    questions.length || 25
  );

  // Explicit unattempted count during active test (Requirement 10)
  const explicitUnattemptedCount = Object.values(records).filter(
    (r) => r.result === 'not_attempted'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        phase={phase}
        darkMode={darkMode}
        historyCount={history.length}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onResetTest={handleResetTest}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />

      {/* Live Score Ticker (Only during active testing) */}
      {phase === 'testing' && questions.length > 0 && (
        <LiveScoreBar
          currentQuestionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          stats={stats}
          explicitUnattemptedCount={explicitUnattemptedCount}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {phase === 'setup' && (
          <SetupScreen 
            onStartTest={handleStartTest} 
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            historyCount={history.length}
          />
        )}

        {phase === 'testing' && questions.length > 0 && (
          <TestScreen
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            records={records}
            markingScheme={markingScheme}
            onSelectOption={handleSelectOption}
            onRecordEvaluation={handleRecordEvaluation}
            onNavigateQuestion={handleNavigateQuestion}
            onRequestFinishTest={handleRequestFinishTest}
            isFinishModalOpen={isFinishModalOpen}
            onCloseFinishModal={() => setIsFinishModalOpen(false)}
            onConfirmFinishTest={handleConfirmFinishTest}
          />
        )}

        {phase === 'results' && (
          <ResultScreen
            records={Object.values(records)}
            stats={stats}
            markingScheme={markingScheme}
            completionType={completionType}
            configuredLimit={configuredQuestionsLimit}
            onRetakeTest={handleRetakeTest}
            onNewTest={handleNewTest}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>SelfEval Quiz Platform • Manual Self-Evaluation & Accurate Test Tracking Engine</p>
      </footer>

      {/* Test History Modal */}
      <TestHistoryModal
        isOpen={isHistoryModalOpen}
        history={history}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectTest={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Resume Session Modal (Accidental Data Loss Prevention) */}
      <ResumeSessionModal
        session={savedActiveSession}
        onResume={handleResumeSession}
        onDiscard={handleDiscardSession}
      />
    </div>
  );
};

export default App;
