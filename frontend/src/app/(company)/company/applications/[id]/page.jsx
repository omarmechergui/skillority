'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockCandidates } from '@/lib/mockCompanyData';
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
} from 'lucide-react';

export default function ApplicationDetailsPage({ params }) {
  const candidate = mockCandidates.find((c) => c.id === params.id) || mockCandidates[0];
  const [currentStage, setCurrentStage] = useState(candidate.stage);

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-5xl mx-auto">
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
                <Badge variant="primary" className="text-[10px]">Application Review</Badge>
                <Badge variant="success" className="text-[10px]">{candidate.matchScore}% Match</Badge>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{candidate.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href={`/company/talent/${candidate.id}/evaluate`}>
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                Scorecard / Evaluate
              </Button>
            </Link>
            <Link href="/company/messages">
              <Button className="text-xs font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Message Candidate
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Snapshot Header */}
        <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border shrink-0">
            <Image
              src={candidate.avatar}
              alt={candidate.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-1 flex-1">
            <h2 className="text-lg font-bold text-slate-900">{candidate.name}</h2>
            <p className="text-xs text-slate-600 font-medium">{candidate.title}</p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {candidate.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Applied on {candidate.appliedDate}
              </span>
            </div>
          </div>

          {/* Quick Stage Selector */}
          <div className="p-3 bg-slate-50 rounded-xl border border-border space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500">Pipeline Stage</label>
            <select
              value={currentStage}
              onChange={(e) => setCurrentStage(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-border rounded-lg p-1.5 text-slate-900"
            >
              <option value="APPLIED">APPLIED</option>
              <option value="SCREENING">SCREENING</option>
              <option value="INTERVIEW">INTERVIEW</option>
              <option value="OFFER">OFFER</option>
              <option value="HIRED">HIRED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </Card>

        {/* Detail Tabs / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Application Info & Role Applied</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Opportunity:</span>
                <span className="font-bold text-slate-900">{candidate.appliedRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Academic Background:</span>
                <span className="font-semibold text-slate-800">{candidate.education}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course Completion Rate:</span>
                <span className="font-bold text-emerald-600">{candidate.courseCompletionRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Study Streak:</span>
                <span className="font-semibold text-slate-800">{candidate.studyStreak} Days Active</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 pt-2">Skills & Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((s) => (
                <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                  {s}
                </span>
              ))}
            </div>

            {candidate.verifiedCertificates.length > 0 && (
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Verified Platform Certificates</h4>
                {candidate.verifiedCertificates.map((cert) => (
                  <div key={cert.name} className="flex items-center gap-2 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{cert.name}</span>
                    <span className="text-slate-400 text-[11px]">• Issued {cert.issued}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Recruiter Actions</h3>

            <div className="space-y-2">
              <Button className="w-full text-xs font-semibold flex items-center justify-center gap-1.5">
                <ThumbsUp className="w-4 h-4" />
                Advance to Next Stage
              </Button>
              <Button variant="outline" className="w-full text-xs font-semibold flex items-center justify-center gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50">
                <XCircle className="w-4 h-4" />
                Reject Application
              </Button>
            </div>

            <div className="pt-4 border-t border-border text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700">Evaluation Notes:</p>
              <p className="italic text-[11px] leading-relaxed">
                {candidate.evaluation?.notes || 'No evaluation notes recorded yet. Click Evaluate to submit a technical scorecard.'}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

