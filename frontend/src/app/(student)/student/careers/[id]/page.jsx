'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { careerApi } from '@/lib/api';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Send,
  FileText,
  AlertCircle,
  ExternalLink,
  Loader2,
  Users,
} from 'lucide-react';

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params?.id || '';

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationError, setApplicationError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    coverLetter: '',
    portfolioUrl: '',
    githubUrl: '',
    linkedinUrl: '',
  });

  useEffect(() => {
    async function loadOpportunity() {
      if (!opportunityId) return;
      setLoading(true);
      try {
        const res = await careerApi.getOpportunity(opportunityId);
        if (res?.data) {
          const o = res.data;
          setOpportunity(o);
          setHasApplied(Boolean(o.hasApplied));
        }
      } catch (err) {
        console.error('Failed to load opportunity:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunity();
  }, [opportunityId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplicationError(null);

    try {
      await careerApi.applyToOpportunity(opportunityId, {
        coverLetter: formData.coverLetter.trim(),
        portfolioUrl: formData.portfolioUrl.trim() || undefined,
        githubUrl: formData.githubUrl.trim() || undefined,
        linkedinUrl: formData.linkedinUrl.trim() || undefined,
      });

      setHasApplied(true);
      setIsApplyModalOpen(false);
      setSuccessMessage('Application submitted successfully! Track your status in your Applications dashboard.');
    } catch (err) {
      if (err.code === 'ALREADY_APPLIED' || err.message?.includes('ALREADY_APPLIED')) {
        setApplicationError('You have already applied to this opportunity.');
      } else {
        setApplicationError(err.message || 'Failed to submit application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="STUDENT" navItems={studentNav}>
        <div className="p-16 text-center space-y-3 max-w-4xl mx-auto">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-slate-500">Loading opportunity details...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!opportunity) {
    return (
      <DashboardShell role="STUDENT" navItems={studentNav}>
        <div className="space-y-6 max-w-2xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4 border-border">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Opportunity Not Found</h2>
            <p className="text-xs text-slate-500">The requested opportunity is closed, expired, or does not exist.</p>
            <Link href="/student/careers">
              <Button variant="outline" className="text-xs">
                Back to Opportunities
              </Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  const companyName = opportunity.company?.companyName || 'Verified Partner';
  const skills = Array.isArray(opportunity.skills) ? opportunity.skills : [];
  const optionalSkills = Array.isArray(opportunity.optionalSkills) ? opportunity.optionalSkills : [];
  const responsibilities = Array.isArray(opportunity.responsibilities) ? opportunity.responsibilities : [];
  const benefits = Array.isArray(opportunity.benefits) ? opportunity.benefits : [];
  const matchScore = opportunity.matchScore || 85;
  const matchExplanation = opportunity.matchExplanation || null;
  const isClosed = !opportunity.isOpen || opportunity.status === 'CLOSED';

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/student/careers" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Career Opportunities
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 truncate max-w-xs">{opportunity.title}</span>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <Link href="/student/careers/applications">
              <Button variant="outline" size="sm" className="text-xs bg-white text-emerald-800 border-emerald-300">
                View in Applications Tracker
              </Button>
            </Link>
          </div>
        )}

        {/* Opportunity Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shrink-0">
                <Building2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">{companyName}</span>
                  <Badge variant="primary" className="text-xs">
                    {opportunity.type || 'INTERNSHIP'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {opportunity.workplaceType || 'REMOTE'}
                  </Badge>
                  {isClosed && (
                    <Badge variant="error" className="text-xs">
                      Closed
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {opportunity.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" /> {opportunity.location || 'Remote'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-bold text-slate-900">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> {opportunity.stipend || 'Competitive'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" /> {opportunity.duration || '3-6 months'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-slate-400" /> {opportunity.positions || 1} open position(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Save & Apply Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-blue-50 text-primary border-blue-200'
                    : 'bg-white text-slate-400 border-border hover:text-slate-700 hover:bg-slate-50'
                }`}
                aria-label={isSaved ? 'Unsave' : 'Save'}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5 fill-primary" /> : <Bookmark className="w-5 h-5" />}
              </button>

              {hasApplied ? (
                <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Applied</span>
                </div>
              ) : isClosed ? (
                <Button disabled variant="outline" className="text-xs">
                  Applications Closed
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="text-xs font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="p-6 space-y-3 border-border">
              <h2 className="text-base font-bold text-slate-900">About the Opportunity</h2>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {opportunity.description}
              </p>
            </Card>

            {/* Responsibilities */}
            {responsibilities.length > 0 && (
              <Card className="p-6 space-y-3 border-border">
                <h3 className="text-base font-bold text-slate-900">Responsibilities</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Required Technical Skills */}
            <Card className="p-6 space-y-4 border-border">
              <h3 className="text-base font-bold text-slate-900">Required Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {optionalSkills.length > 0 && (
                <div className="pt-3 border-t border-border space-y-2">
                  <span className="text-xs font-semibold text-slate-500">Nice-to-Have Optional Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {optionalSkills.map((opt, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-border"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Educational & Eligibility Requirements */}
            {(opportunity.educationalRequirements || opportunity.eligibility) && (
              <Card className="p-6 space-y-3 border-border">
                <h3 className="text-base font-bold text-slate-900">Eligibility & Qualifications</h3>
                {opportunity.educationalRequirements && (
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Education: </span>
                    {opportunity.educationalRequirements}
                  </div>
                )}
                {opportunity.eligibility && (
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Criteria: </span>
                    {opportunity.eligibility}
                  </div>
                )}
              </Card>
            )}

            {/* Benefits & Perks */}
            {benefits.length > 0 && (
              <Card className="p-6 space-y-3 border-border">
                <h3 className="text-base font-bold text-slate-900">Benefits & Engagement Perks</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar: Match Explanation & Company Info */}
          <div className="space-y-6">
            {/* Candidate Match Breakdown Card */}
            <Card className="p-6 space-y-4 border-border bg-white">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Profile Compatibility
                </h3>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="text-3xl font-extrabold text-slate-900">{matchScore}%</div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 pt-1">Deterministic skill & curriculum match</p>
              </div>

              {matchExplanation?.explanations && (
                <div className="space-y-2 text-xs text-slate-600 border-t border-border pt-3">
                  <span className="font-semibold text-slate-800 block text-[11px]">Match Explanation:</span>
                  <ul className="space-y-1.5">
                    {matchExplanation.explanations.map((exp, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {matchExplanation?.recommendations && matchExplanation.recommendations.length > 0 && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-1">
                  <span className="font-bold block">How to Boost Your Match:</span>
                  {matchExplanation.recommendations.map((rec, i) => (
                    <p key={i}>• {rec}</p>
                  ))}
                </div>
              )}
            </Card>

            {/* Company Info Card */}
            <Card className="p-6 space-y-4 border-border bg-white">
              <h3 className="text-sm font-bold text-slate-900">About the Employer</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">{companyName}</p>
                {opportunity.company?.description && (
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {opportunity.company.description}
                  </p>
                )}
                <div className="pt-2 border-t border-border space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Industry:</span>
                    <span className="font-medium text-slate-800">{opportunity.company?.industry || 'Technology'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-medium text-slate-800">{opportunity.location}</span>
                  </div>
                  {opportunity.company?.website && (
                    <div className="pt-1">
                      <a
                        href={opportunity.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Visit Website <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Application Modal */}
        {isApplyModalOpen && (
          <Modal
            isOpen={isApplyModalOpen}
            onClose={() => !submitting && setIsApplyModalOpen(false)}
            title={`Apply to ${opportunity.title}`}
          >
            <form onSubmit={handleConfirmApplication} className="space-y-4 text-xs">
              <p className="text-slate-500">
                Submit your application details directly to <span className="font-bold text-slate-800">{companyName}</span>. Your verified coursework credentials will automatically accompany your application.
              </p>

              {applicationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{applicationError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Cover Letter & Technical Statement</label>
                <textarea
                  name="coverLetter"
                  required
                  rows={4}
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Explain why you are interested in this position and highlight your key projects and skills..."
                  className="w-full p-2.5 rounded-lg border border-border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Portfolio / Personal Website URL</label>
                <Input
                  name="portfolioUrl"
                  type="url"
                  placeholder="https://myportfolio.dev"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">GitHub Profile URL</label>
                  <Input
                    name="githubUrl"
                    type="url"
                    placeholder="https://github.com/username"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">LinkedIn Profile URL</label>
                  <Input
                    name="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsApplyModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </DashboardShell>
  );
}
