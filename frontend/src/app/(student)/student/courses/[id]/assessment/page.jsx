'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { assessmentApi, coursesApi } from '@/lib/api';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Download,
  Share2,
  Loader2,
} from 'lucide-react';

export default function FinalAssessmentPage() {
  const params = useParams();
  const courseId = params?.id || '';
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [backendResult, setBackendResult] = useState(null);

  useEffect(() => {
    async function loadCourse() {
      if (!courseId) {
        setLoading(false);
        return;
      }
      try {
        const res = await coursesApi.getCourse(courseId);
        if (res.data) {
          setCourse(res.data);
        }
      } catch {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <DashboardShell roleTitle="Student Portal" navItems={studentNav}>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  if (!course) {
    return (
      <DashboardShell roleTitle="Student Portal" navItems={studentNav}>
        <div className="space-y-6 max-w-4xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Assessment Not Found</h2>
            <p className="text-sm text-slate-500">The requested course final assessment could not be found or has not been loaded.</p>
            <Link href="/student/learn">
              <Button variant="outline" className="text-xs">Back to Learning</Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  const assessment = course.finalAssessment || {
    id: 'fa-default',
    title: `${course.title} Final Certification`,
    durationMinutes: 45,
    totalQuestions: 5,
    passingPercentage: 80,
    instructions: [
      'Answer all comprehensive domain questions.',
      'Achieve 80% or higher to earn the official verified credential.',
      'Review answers before final confirmation.',
    ],
    questions: [
      {
        id: 'faq1',
        prompt: 'What constitutes the key architectural benefit of Prisma ORM with MongoDB?',
        options: [
          'Type safety and declarative schema models with automated client generation',
          'Eliminates the need for indexing permanently',
          'Enforces MySQL tables in MongoDB',
          'Prevents network requests from Express',
        ],
      },
    ],
  };

  const currentQ = assessment.questions?.[currentIdx];

  const handleSelect = (option) => {
    if (isCompleted || submitting || !currentQ) return;
    setAnswers({ ...answers, [currentQ.id]: option });
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitDialogOpen(false);
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await assessmentApi.submitAssessment(courseId, answers);
      if (res.data) {
        setBackendResult(res.data);
        setIsCompleted(true);
      } else {
        throw new Error(res.error?.message || 'Failed to submit assessment');
      }
    } catch (err) {
      setSubmitError(err.response?.data?.error?.message || err.message || 'Failed to evaluate final assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const finalScore = backendResult?.score ?? 0;
  const isCertified = Boolean(backendResult?.passed);
  const certificateData = backendResult?.certificate;

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div>
          <Link
            href={`/student/courses/${course.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {course.title}
          </Link>
        </div>

        {/* Error Alert */}
        {submitError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Phase 1: Intro / Rules Screen */}
        {!hasStarted && !isCompleted && (
          <Card className="p-8 space-y-8 bg-white border-border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" className="bg-amber-50 text-amber-800 border-amber-200">
                    <Award className="w-3.5 h-3.5 mr-1 text-amber-600 inline" /> Official Certification
                  </Badge>
                  <span className="text-xs text-slate-400">Final Milestone</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {assessment.title}
                </h1>
                <p className="text-xs text-slate-500">
                  Course: <strong className="text-slate-800">{course.title}</strong>
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 shrink-0">
                <div className="text-center">
                  <div className="text-base font-bold text-slate-900">{assessment.durationMinutes || 45} min</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Duration</div>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="text-center">
                  <div className="text-base font-bold text-slate-900">{assessment.questions?.length || 0}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Questions</div>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="text-center">
                  <div className="text-base font-bold text-emerald-600">{assessment.passingPercentage || 80}%</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Passing Score</div>
                </div>
              </div>
            </div>

            {/* Assessment Rules */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Examination Protocol</h3>
              <div className="space-y-2">
                {assessment.instructions?.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{inst}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credential Verification Guarantee */}
            <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <span className="font-bold">Credential Protocol:</span> Passing this assessment certifies domain mastery and issues a cryptographically verifiable completion certificate recorded on your profile.
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="primary" size="lg" onClick={() => setHasStarted(true)}>
                Begin Final Assessment <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Phase 2: Active Exam Runner */}
        {hasStarted && !isCompleted && currentQ && (
          <Card className="p-6 sm:p-8 space-y-6 bg-white border-border shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Question {currentIdx + 1} of {assessment.questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Timed Session</span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.prompt}
              </h2>

              <div className="space-y-3 pt-3">
                {currentQ.options?.map((option, idx) => {
                  const isSelected = answers[currentQ.id] === option;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-primary bg-blue-50/80 text-primary ring-1 ring-primary'
                          : 'border-border bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{option}</span>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                          isSelected ? 'border-primary bg-primary text-white font-bold' : 'border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pagination / Submit Bar */}
            <div className="pt-6 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => prev - 1)}
              >
                Previous
              </Button>

              {currentIdx < assessment.questions.length - 1 ? (
                <Button variant="primary" size="sm" onClick={() => setCurrentIdx((prev) => prev + 1)}>
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => setIsSubmitDialogOpen(true)}
                >
                  {submitting ? 'Submitting...' : 'Finalize & Submit Exam'}
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Phase 3: Results & Certificate Eligibility Screen */}
        {isCompleted && (
          <Card className="p-8 space-y-6 text-center bg-white border-border shadow-sm">
            <div className="inline-flex p-4 rounded-full mx-auto bg-slate-50 border border-border">
              {isCertified ? (
                <Award className="w-16 h-16 text-amber-500 fill-amber-400" />
              ) : (
                <RotateCcw className="w-16 h-16 text-slate-400" />
              )}
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {isCertified ? 'Congratulations! Certified' : 'Assessment Incomplete'}
              </h2>
              <p className="text-sm text-slate-500">
                Final Score: <strong className="text-slate-900 font-bold text-base">{finalScore}%</strong> (Passing requirement: {assessment.passingPercentage}%)
              </p>
            </div>

            {/* Certificate Card */}
            {isCertified && certificateData ? (
              <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl max-w-xl mx-auto shadow-xl space-y-4 text-left border border-slate-700">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    Verified Course Credential
                  </div>
                  <Badge variant="primary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                    Official Credential
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Certified Program</div>
                  <div className="text-base font-semibold text-amber-200">{course.title}</div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/80">
                  <span>Issued by Skillority Academic Board</span>
                  <span className="font-mono text-amber-300">ID: {certificateData.credentialId}</span>
                </div>
              </div>
            ) : isCertified ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 max-w-md mx-auto text-xs text-emerald-800">
                Assessment passed! Your official credential is being generated and linked to your profile.
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-xs text-slate-600">
                You did not reach the {assessment.passingPercentage || 80}% passing threshold. You may review the course chapters and re-attempt the assessment anytime.
              </div>
            )}

            <div className="pt-6 border-t border-border flex flex-wrap justify-center gap-3">
              {isCertified && certificateData ? (
                <>
                  <Link href={`/certificates/${certificateData.credentialId}`}>
                    <Button variant="primary" size="md">
                      <Download className="w-4 h-4 mr-2" /> View Certificate
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      if (navigator?.clipboard) {
                        navigator.clipboard.writeText(`${window.location.origin}/certificates/${certificateData.credentialId}`);
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Copy Credential Link
                  </Button>
                </>
              ) : !isCertified ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setAnswers({});
                    setIsCompleted(false);
                    setHasStarted(false);
                    setCurrentIdx(0);
                    setBackendResult(null);
                    setSubmitError(null);
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Retake Assessment
                </Button>
              ) : null}

              <Link href="/student/dashboard">
                <Button variant="secondary" size="md">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Confirmation Dialog on Final Submit */}
        <ConfirmDialog
          isOpen={isSubmitDialogOpen}
          onClose={() => setIsSubmitDialogOpen(false)}
          onConfirm={handleConfirmSubmit}
          title="Submit Final Assessment?"
          description="Are you sure you want to finalize your answers? Your score and certification eligibility will be evaluated immediately."
          confirmText="Yes, Submit Exam"
          variant="primary"
        />
      </div>
    </DashboardShell>
  );
}
