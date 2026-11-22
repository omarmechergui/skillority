'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { careerApi } from '@/lib/api';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  Sparkles,
  FileCheck,
  MessageSquare,
  ThumbsUp,
  XCircle,
  Star,
  ExternalLink,
  Video,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const STAGES = ['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'REJECTED'];

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params?.id;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Evaluation form state
  const [rating, setRating] = useState(0);
  const [internalNotes, setInternalNotes] = useState('');
  const [savingEvaluation, setSavingEvaluation] = useState(false);

  // Interview modal
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    scheduledAt: '',
    timezone: 'UTC',
    interviewType: 'TECHNICAL',
    meetingLink: '',
    instructions: '',
  });
  const [scheduling, setScheduling] = useState(false);

  // Offer modal
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: '',
    stipend: '',
    duration: '6 months',
    conditions: '',
  });
  const [extendingOffer, setExtendingOffer] = useState(false);

  const loadApplication = async () => {
    if (!applicationId) return;
    setLoading(true);
    try {
      const res = await careerApi.getCompanyApplicationDetails(applicationId);
      if (res?.data) {
        setApplication(res.data);
        setRating(res.data.rating || 0);
        setInternalNotes(res.data.internalNotes || '');
        setOfferForm((prev) => ({
          ...prev,
          title: res.data.opportunity?.title || '',
          stipend: res.data.opportunity?.stipend || '',
        }));
      }
    } catch (err) {
      console.error('Failed to load application:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await careerApi.updateApplicationStatus(applicationId, newStatus);
      setNotification({ type: 'success', message: `Candidate stage updated to ${newStatus}` });
      await loadApplication();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to update status' });
    }
  };

  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    setSavingEvaluation(true);
    try {
      await careerApi.evaluateCandidate(applicationId, {
        rating: rating || undefined,
        internalNotes: internalNotes.trim() || undefined,
      });
      setNotification({ type: 'success', message: 'Internal recruiter evaluation saved securely.' });
      await loadApplication();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to save evaluation.' });
    } finally {
      setSavingEvaluation(false);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    setScheduling(true);
    try {
      await careerApi.scheduleInterview(applicationId, {
        scheduledAt: new Date(interviewForm.scheduledAt).toISOString(),
        timezone: interviewForm.timezone,
        interviewType: interviewForm.interviewType,
        meetingLink: interviewForm.meetingLink.trim() || undefined,
        instructions: interviewForm.instructions.trim() || undefined,
      });
      setIsInterviewModalOpen(false);
      setNotification({ type: 'success', message: 'Interview scheduled and candidate notified.' });
      await loadApplication();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to schedule interview.' });
    } finally {
      setScheduling(false);
    }
  };

  const handleExtendOffer = async (e) => {
    e.preventDefault();
    setExtendingOffer(true);
    try {
      await careerApi.createOffer(applicationId, {
        title: offerForm.title.trim(),
        stipend: offerForm.stipend.trim() || undefined,
        duration: offerForm.duration.trim() || undefined,
        conditions: offerForm.conditions.trim() || undefined,
      });
      setIsOfferModalOpen(false);
      setNotification({ type: 'success', message: 'Formal offer extended and candidate notified!' });
      await loadApplication();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to extend offer.' });
    } finally {
      setExtendingOffer(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
        <div className="p-16 text-center space-y-3 max-w-4xl mx-auto">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-slate-500">Loading candidate screening details...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!application) {
    return (
      <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
        <div className="space-y-6 max-w-xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4 border-border">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Application Not Found</h2>
            <p className="text-xs text-slate-500">The requested application could not be located or you are not authorized.</p>
            <Link href="/company/applications">
              <Button variant="outline" className="text-xs">
                Back to Inbox
              </Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  const candidateName = [application.student?.profile?.firstName, application.student?.profile?.lastName]
    .filter(Boolean)
    .join(' ') || application.student?.email || 'Candidate';
  const profile = application.student?.profile || {};
  const certificates = Array.isArray(application.student?.certificates) ? application.student.certificates : [];
  const enrollments = Array.isArray(application.student?.enrollments) ? application.student.enrollments : [];
  const completedCourses = enrollments.filter((e) => e.isCompleted || (e.progressPercent && e.progressPercent >= 100));

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/company/applications">
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="text-[10px]">
                  Applicant Review
                </Badge>
                <Badge variant="success" className="text-[10px]">
                  {application.matchScore || 85}% Match
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{candidateName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInterviewModalOpen(true)}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <Video className="w-4 h-4 text-primary" />
              Schedule Interview
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsOfferModalOpen(true)}
              disabled={Boolean(application.offer)}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              {application.offer ? 'Offer Already Extended' : 'Extend Offer'}
            </Button>
          </div>
        </div>

        {notification && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">
              ✕
            </button>
          </div>
        )}

        {/* Pipeline Stage Bar */}
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Candidate Pipeline Status:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {STAGES.map((st) => (
              <button
                key={st}
                onClick={() => handleUpdateStatus(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  application.status === st
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 border border-border text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Candidate Credentials & Application Statement */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Overview Card */}
            <Card className="p-6 space-y-4 bg-white border-border">
              <h2 className="text-base font-bold text-slate-900">Candidate Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-slate-900">{application.student?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">University / Institution</span>
                  <span className="font-semibold text-slate-900">{profile.university || 'Tech University'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Major / Specialization</span>
                  <span className="font-semibold text-slate-900">{profile.major || 'Computer Science'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Graduation Year</span>
                  <span className="font-semibold text-slate-900">{profile.graduationYear || '2026'}</span>
                </div>
              </div>

              {profile.bio && (
                <div className="pt-2 border-t border-border space-y-1 text-xs">
                  <span className="text-slate-400 text-[11px] font-semibold">Candidate Bio:</span>
                  <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Portfolio & External Links */}
              <div className="flex flex-wrap gap-3 pt-2 text-xs">
                {application.portfolioUrl && (
                  <a
                    href={application.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    Portfolio <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {application.githubUrl && (
                  <a
                    href={application.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    GitHub <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {application.linkedinUrl && (
                  <a
                    href={application.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    LinkedIn <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </Card>

            {/* Application Cover Letter / Statement */}
            <Card className="p-6 space-y-3 bg-white border-border">
              <h3 className="text-base font-bold text-slate-900">Candidate Statement</h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-border">
                {application.coverLetter || application.notes || 'No statement provided by candidate.'}
              </p>
            </Card>

            {/* Verified Coursework Credentials */}
            <Card className="p-6 space-y-4 bg-white border-border">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" /> Verified Credentials & Coursework
                </h3>
                <span className="text-xs text-slate-500">
                  {certificates.length} Certificate(s) · {completedCourses.length} Completed Course(s)
                </span>
              </div>

              {certificates.length === 0 && completedCourses.length === 0 ? (
                <p className="text-xs text-slate-500">Candidate is in early stages of coursework.</p>
              ) : (
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-emerald-900">
                          {cert.type === 'FINAL_ASSESSMENT' ? 'Final Assessment Certificate' : 'Course Completion Certificate'}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold">{cert.credentialId}</span>
                    </div>
                  ))}

                  {completedCourses.map((enr) => (
                    <div
                      key={enr.id}
                      className="p-3 bg-slate-50 border border-border rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-slate-800">{enr.course?.title || 'Completed Course'}</span>
                      </div>
                      <Badge variant="success" className="text-[10px]">
                        100% Completed
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Column: Recruiter Internal Evaluation & Scoring */}
          <div className="space-y-6">
            {/* Private Scorecard Form (Module 3D.3) */}
            <Card className="p-6 space-y-5 bg-white border-border">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-500" /> Recruiter Internal Notes
                </h3>
                <Badge variant="outline" className="text-[10px] text-slate-500">
                  Private to Company
                </Badge>
              </div>

              <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
                {/* 1-5 Star Rating */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Candidate Rating (1–5 Stars)</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          rating >= star
                            ? 'text-amber-500 bg-amber-50 border-amber-200'
                            : 'text-slate-300 bg-slate-50 border-border hover:text-slate-500'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${rating >= star ? 'fill-amber-500' : ''}`} />
                      </button>
                    ))}
                    {rating > 0 && <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5</span>}
                  </div>
                </div>

                {/* Private Internal Notes */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    Confidential Evaluation Notes
                  </label>
                  <textarea
                    rows={4}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Candidate technical strengths, interview notes, concerns... (Never visible to students)"
                    className="w-full p-2.5 rounded-lg border border-border bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <Button type="submit" size="sm" variant="primary" disabled={savingEvaluation} className="w-full text-xs">
                  {savingEvaluation ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </span>
                  ) : (
                    'Save Private Evaluation'
                  )}
                </Button>
              </form>
            </Card>

            {/* Scheduled Interviews History */}
            {application.interviews && application.interviews.length > 0 && (
              <Card className="p-6 space-y-3 bg-white border-border">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Scheduled Interviews ({application.interviews.length})
                </h4>
                <div className="space-y-2 text-xs">
                  {application.interviews.map((inv) => (
                    <div key={inv.id} className="p-3 bg-slate-50 rounded-lg border border-border space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{inv.interviewType}</span>
                        <Badge variant="warning" className="text-[10px]">
                          {inv.status}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(inv.scheduledAt).toLocaleString()} ({inv.timezone})
                      </div>
                      {inv.meetingLink && (
                        <a
                          href={inv.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-[11px] flex items-center gap-1"
                        >
                          Join Link <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Active Offer Status */}
            {application.offer && (
              <Card className="p-6 space-y-3 bg-emerald-50/50 border-emerald-200">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Extended Offer Status
                </h4>
                <div className="space-y-1.5 text-xs text-emerald-950">
                  <div>
                    <span className="font-semibold">Role: </span>
                    {application.offer.title}
                  </div>
                  <div>
                    <span className="font-semibold">Stipend: </span>
                    {application.offer.stipend || 'Competitive'}
                  </div>
                  <div>
                    <span className="font-semibold">Status: </span>
                    <Badge variant={application.offer.status === 'ACCEPTED' ? 'success' : 'primary'}>
                      {application.offer.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Schedule Interview Modal */}
        {isInterviewModalOpen && (
          <Modal
            isOpen={isInterviewModalOpen}
            onClose={() => !scheduling && setIsInterviewModalOpen(false)}
            title="Schedule Candidate Interview"
          >
            <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Interview Date & Time *</label>
                <Input
                  required
                  type="datetime-local"
                  value={interviewForm.scheduledAt}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Timezone</label>
                  <Input
                    value={interviewForm.timezone}
                    onChange={(e) => setInterviewForm({ ...interviewForm, timezone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Interview Type</label>
                  <select
                    value={interviewForm.interviewType}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewType: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-slate-50 text-xs"
                  >
                    <option value="SCREENING">Screening</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="BEHAVIORAL">Behavioral</option>
                    <option value="FINAL">Final</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">External Video Meeting Link</label>
                <Input
                  type="url"
                  placeholder="https://meet.google.com/xyz or Zoom link"
                  value={interviewForm.meetingLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Candidate Preparation Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Please be prepared to discuss your React project and walk through code samples..."
                  value={interviewForm.instructions}
                  onChange={(e) => setInterviewForm({ ...interviewForm, instructions: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-slate-50 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsInterviewModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={scheduling}>
                  {scheduling ? 'Scheduling...' : 'Schedule & Notify Candidate'}
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* Extend Offer Modal */}
        {isOfferModalOpen && (
          <Modal
            isOpen={isOfferModalOpen}
            onClose={() => !extendingOffer && setIsOfferModalOpen(false)}
            title="Extend Official Offer"
          >
            <form onSubmit={handleExtendOffer} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Offer Title *</label>
                <Input
                  required
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Monthly Stipend</label>
                  <Input
                    value={offerForm.stipend}
                    onChange={(e) => setOfferForm({ ...offerForm, stipend: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Duration</label>
                  <Input
                    value={offerForm.duration}
                    onChange={(e) => setOfferForm({ ...offerForm, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Terms & Conditions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. 40 hours per week, full remote setup, conversion upon completion..."
                  value={offerForm.conditions}
                  onChange={(e) => setOfferForm({ ...offerForm, conditions: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-slate-50 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOfferModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={extendingOffer}>
                  {extendingOffer ? 'Extending Offer...' : 'Send Official Offer'}
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </DashboardShell>
  );
}
