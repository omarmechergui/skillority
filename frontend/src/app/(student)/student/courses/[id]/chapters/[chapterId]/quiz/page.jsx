'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { assessmentApi, coursesApi } from '@/lib/api';
import {
  HelpCircle,
  Coins,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function ChapterQuizPage() {
  const params = useParams();
  const courseId = params?.id || '';
  const chapterId = params?.chapterId || '';

  const [course, setCourse] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [backendResult, setBackendResult] = useState(null);
  const [coinsAwarded, setCoinsAwarded] = useState(false);

  useEffect(() => {
    async function loadQuizData() {
      setLoading(true);
      try {
        const res = await coursesApi.getCourse(courseId);
        if (res.data) {
          setCourse(res.data);
          const foundChapter = res.data.chapters?.find((ch) => ch.id === chapterId);
          if (foundChapter) {
            setChapter(foundChapter);
            if (foundChapter.quiz?.questions?.length > 0) {
              setQuiz(foundChapter.quiz);
            }
          }
        }
      } catch (err) {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    }
    loadQuizData();
  }, [courseId, chapterId]);

  const activeCourse = course || { id: courseId, title: 'Course' };
  const activeChapter = chapter || { id: chapterId, chapterNumber: 1 };

  if (loading) {
    return (
      <DashboardShell role="STUDENT" navItems={studentNav}>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  if (!quiz) {
    return (
      <DashboardShell role="STUDENT" navItems={studentNav}>
        <div className="max-w-3xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Quiz Not Found</h2>
            <p className="text-sm text-slate-500">There is no quiz available for this chapter.</p>
            <Link href={`/student/courses/${courseId}`}>
              <Button variant="outline" className="text-xs">Back to Course</Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex] || quiz.questions[0];

  const handleSelectOption = (option) => {
    if (isSubmitted || submitting) return;
    if (currentQuestion.type === 'multiple') {
      const currentList = selectedAnswers[currentQuestion.id] || [];
      const updated = currentList.includes(option)
        ? currentList.filter((item) => item !== option)
        : [...currentList, option];
      setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: updated });
    } else {
      setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: option });
    }
  };

  const calculateClientScore = () => {
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (q.type === 'multiple') {
        const sortedUser = Array.isArray(userAns) ? [...userAns].sort() : [];
        const sortedCorrect = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : [];
        if (JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect)) {
          correctCount++;
        }
      } else {
        if (userAns === q.correctAnswer) {
          correctCount++;
        }
      }
    });
    return Math.round((correctCount / quiz.questions.length) * 100);
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await assessmentApi.submitQuiz(chapterId, selectedAnswers);
      if (res.data) {
        setBackendResult(res.data);
        setIsSubmitted(true);
        if (res.data.passed && res.data.coinsAwarded > 0) {
          setCoinsAwarded(true);
        }
      } else {
        const clientScore = calculateClientScore();
        const clientPassed = clientScore >= (quiz.passingScore || 70);
        setBackendResult({ score: clientScore, passed: clientPassed, coinsAwarded: clientPassed ? 20 : 0 });
        setIsSubmitted(true);
        if (clientPassed) setCoinsAwarded(true);
      }
    } catch (err) {
      const clientScore = calculateClientScore();
      const clientPassed = clientScore >= (quiz.passingScore || 70);
      setBackendResult({ score: clientScore, passed: clientPassed, coinsAwarded: clientPassed ? 20 : 0 });
      setIsSubmitted(true);
      if (clientPassed) setCoinsAwarded(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setBackendResult(null);
    setCurrentQuestionIndex(0);
    setCoinsAwarded(false);
  };

  const displayScore = backendResult?.score ?? (isSubmitted ? calculateClientScore() : 0);
  const isPassed = backendResult?.passed ?? (displayScore >= (quiz.passingScore || 70));

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumb Bar */}
        <div>
          <Link
            href={`/student/courses/${activeCourse.id}/chapters/${activeChapter.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Chapter {activeChapter.chapterNumber || activeChapter.order || 0}
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quiz Header */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="bg-amber-50 text-amber-800 border-amber-200 text-xs">
                <Coins className="w-3.5 h-3.5 mr-1 text-amber-600 inline" /> +{quiz.rewardCoins || 20} Coins Reward
              </Badge>
              <span className="text-xs text-slate-400">Chapter Knowledge Check</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{quiz.title}</h1>
            <p className="text-xs text-slate-500">
              Passing requirement: <strong>{quiz.passingScore || 70}%</strong> · {quiz.questions.length} questions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Question</span>
            <span className="text-base font-bold text-primary">
              {currentQuestionIndex + 1} / {quiz.questions.length}
            </span>
          </div>
        </div>

        {/* Quiz Main Body / Question Viewer */}
        {!isSubmitted ? (
          <Card className="p-6 sm:p-8 space-y-6 bg-white border-border shadow-sm">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Question {currentQuestionIndex + 1} ({currentQuestion.type === 'multiple' ? 'Select all that apply' : 'Single Choice'})
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {currentQuestion.prompt}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected =
                  currentQuestion.type === 'multiple'
                    ? (selectedAnswers[currentQuestion.id] || []).includes(option)
                    : selectedAnswers[currentQuestion.id] === option;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-primary bg-blue-50/70 text-primary shadow-sm ring-1 ring-primary'
                        : 'border-border bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{option}</span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                        isSelected
                          ? 'border-primary bg-primary text-white font-bold'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={currentQuestionIndex === 0 || submitting}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              >
                Previous
              </Button>

              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                >
                  Next Question <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                  onClick={handleSubmitQuiz}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Evaluating Answers...
                    </>
                  ) : (
                    'Submit Quiz'
                  )}
                </Button>
              )}
            </div>
          </Card>
        ) : (
          /* Results Screen */
          <Card className="p-8 space-y-6 text-center bg-white border-border shadow-sm">
            <div className="inline-flex p-4 rounded-full mx-auto bg-slate-50 border border-border">
              {isPassed ? (
                <Trophy className="w-12 h-12 text-amber-500 fill-amber-400" />
              ) : (
                <RotateCcw className="w-12 h-12 text-slate-400" />
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {isPassed ? 'Congratulations! Quiz Passed' : 'Keep Practicing!'}
              </h2>
              <p className="text-sm text-slate-500">
                You scored <strong className="text-slate-900 font-bold">{displayScore}%</strong> (Passing threshold: {quiz.passingScore || 70}%)
              </p>
            </div>

            {/* Coins Earned Banner */}
            {coinsAwarded && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 inline-flex items-center gap-3 text-left max-w-md mx-auto">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Reward Earned</div>
                  <div className="text-base font-extrabold text-amber-950">+{backendResult?.coinsAwarded || 20} Skillority Coins Added!</div>
                </div>
              </div>
            )}

            {/* Answers Breakdown / Review */}
            <div className="text-left space-y-4 pt-4 border-t border-border">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Review Explanations:</h3>
              <div className="space-y-3">
                {quiz.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-border bg-slate-50/60 space-y-2 text-xs">
                    <p className="font-bold text-slate-900">{idx + 1}. {q.prompt}</p>
                    <p className="text-slate-600">
                      <strong>Correct Answer:</strong>{' '}
                      {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                    </p>
                    <p className="text-slate-500 italic">Explanation: {q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-center gap-3">
              {!isPassed && (
                <Button variant="outline" size="md" onClick={handleRetake}>
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Retake Quiz
                </Button>
              )}
              <Link href={`/student/courses/${activeCourse.id}`}>
                <Button variant="primary" size="md">
                  Continue Curriculum <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}

