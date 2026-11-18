'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { mockOpportunities } from '@/lib/mockCareerData';
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
  UserCheck,
  Send,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params?.id || 'opp-1';

  const [opportunity, setOpportunity] = useState(
    mockOpportunities.find(o => o.id === opportunityId) || mockOpportunities[0]
  );

  const [isSaved, setIsSaved] = useState(opportunity.isSaved || false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('https://github.com/alexrivera');

  useEffect(() => {
    async function loadOpportunity() {
      try {
        const res = await careerApi.getOpportunity(opportunityId);
        if (res.data?.data) {
          const o = res.data.data;
          setOpportunity(prev => ({
            ...prev,
            ...o,
            company: o.company?.companyName || prev.company,
            companyLogo: o.company?.logoUrl || prev.companyLogo,
            location: o.location || prev.location,
            stipend: o.salaryRange || prev.stipend,
            type: o.type || prev.type,
            matchedSkills: o.skills || prev.matchedSkills || [],
            skillsMatchPercentage: prev.skillsMatchPercentage || 85,
            workplaceType: o.workplaceType || prev.workplaceType || 'Remote',
            duration: o.duration || prev.duration || '3-6 months',
            deadline: o.deadline || prev.deadline || 'Open',
            responsibilities: o.responsibilities || prev.responsibilities || [],
            requirements: o.requirements || prev.requirements || [],
            aboutCompany: o.aboutCompany || prev.aboutCompany || '',
            mentorshipDetails: prev.mentorshipDetails,
          }));
        }
      } catch {
        // Keep mock/default data
      }
    }
    loadOpportunity();
  }, [opportunityId]);

  const handleConfirmApplication = async () => {
    try {
      await careerApi.applyToOpportunity(opportunityId, coverNote || '');
      setHasApplied(true);
      setIsApplyModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to submit application.');
    }
  };

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

        {/* Opportunity Header Card (Stitch Screen 22 reference) */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                <Image
                  src={opportunity.companyLogo}
                  alt={opportunity.company}
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">{opportunity.company}</span>
                  <Badge variant="primary" className="text-xs">{opportunity.type}</Badge>
                  <Badge variant="outline" className="text-xs">{opportunity.workplaceType}</Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {opportunity.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" /> {opportunity.location}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-bold text-slate-900">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> {opportunity.stipend}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" /> {opportunity.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-blue-50 text-primary border-blue-200'
                    : 'bg-white text-slate-600 border-border hover:bg-slate-50'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4 fill-primary" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? 'Saved' : 'Save Role'}</span>
              </button>

              {hasApplied ? (
                <Badge variant="success" className="px-4 py-2 text-xs font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Applied (Demo)
                </Badge>
              ) : (
                <Button variant="primary" size="md" onClick={() => setIsApplyModalOpen(true)}>
                  <Send className="w-4 h-4 mr-1.5" /> Submit Application
                </Button>
              )}
            </div>
          </div>

          {/* Profile Match Banner */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-emerald-950">
                  {opportunity.skillsMatchPercentage}% Profile Match with your Skillority Courses
                </span>
                <p className="text-emerald-800 text-[11px]">
                  Matched skills: {opportunity.matchedSkills.join(', ')}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded font-mono self-start sm:self-auto">
              Sample Fit Indicator
            </span>
          </div>
        </div>

        {/* 2-Column Content Layout: Job Body + Sidebar Mentorship */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description & Criteria */}
          <div className="lg:col-span-2 space-y-6">
            {/* About the Role */}
            <Card className="p-6 space-y-3 bg-white border-border">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Role Overview
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {opportunity.description}
              </p>
            </Card>

            {/* What You'll Work On (Responsibilities) */}
            <Card className="p-6 space-y-4 bg-white border-border">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                What You Will Work On
              </h3>
              <div className="space-y-2.5">
                {opportunity.responsibilities.map((resp, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Applicant Requirements */}
            <Card className="p-6 space-y-4 bg-white border-border">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                What They Look For in Applicants
              </h3>
              <div className="space-y-2.5">
                {opportunity.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* About Company */}
            <Card className="p-6 space-y-3 bg-white border-border">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> About {opportunity.company}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {opportunity.aboutCompany}
              </p>
            </Card>
          </div>

          {/* Sidebar: Mentorship & Application Details */}
          <div className="space-y-6">
            {/* Mentorship Guarantee Card */}
            {opportunity.mentorshipDetails && (
              <Card className="p-5 space-y-4 bg-white border-border">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Structured Mentorship
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <Image
                      src={opportunity.mentorshipDetails.mentorAvatar}
                      alt={opportunity.mentorshipDetails.mentorName}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {opportunity.mentorshipDetails.mentorName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {opportunity.mentorshipDetails.mentorTitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-border">
                  Cadence: <strong>{opportunity.mentorshipDetails.cadence}</strong>
                </p>
              </Card>
            )}

            {/* Application Overview Card */}
            <Card className="p-5 space-y-3 bg-white border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Application Overview
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Deadline:</span>
                  <span className="font-semibold text-slate-900">{opportunity.deadline}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Workplace:</span>
                  <span className="font-semibold text-slate-900">{opportunity.workplaceType}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Stipend:</span>
                  <span className="font-semibold text-slate-900">{opportunity.stipend}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-semibold text-slate-900">{opportunity.duration}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full text-xs"
                  disabled={hasApplied}
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  {hasApplied ? 'Application Submitted' : 'Apply Now'}
                </Button>
              </div>
            </Card>

            {/* Disclaimer Callout */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-800">Skillority Partnership Policy</p>
              <p className="leading-relaxed">
                Skillority connects students directly to vetted hiring partners. Companies manage applicant review and final hiring outcomes independently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Submission Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit Application"
        subtitle={`Applying to ${opportunity.company} for ${opportunity.title}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
            Your verified course certifications and Skillority student profile will be automatically attached to this application.
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">Portfolio / GitHub Profile URL</label>
            <input
              type="text"
              value={portfolioLink}
              onChange={e => setPortfolioLink(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">Short Note to Recruiter (Optional)</label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={e => setCoverNote(e.target.value)}
              placeholder="Highlight relevant coursework, projects, or why you are excited about this role..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2.5">
            <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmApplication}>
              Confirm & Submit (Demo)
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}

