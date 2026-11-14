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
  Bookmark,
  BookmarkCheck,
  Award,
  Flame,
  Coins,
  MapPin,
  Calendar,
  MessageSquare,
  FileCheck,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export default function StudentTalentProfilePage({ params }) {
  const candidate = mockCandidates.find((c) => c.id === params.id) || mockCandidates[0];
  const [isSaved, setIsSaved] = useState(candidate.isSaved);

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/company/talent">
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="text-[10px]">Verified Candidate</Badge>
                <Badge variant="success" className="text-[10px]">{candidate.matchScore}% Match</Badge>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{candidate.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 border border-border rounded-lg text-slate-500 hover:text-amber-500 hover:bg-slate-50"
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <Link href={`/company/talent/${candidate.id}/evaluate`}>
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                Evaluate
              </Button>
            </Link>
            <Link href="/company/messages">
              <Button className="text-xs font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Contact Candidate
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Hero Header */}
        <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 shrink-0">
            <Image
              src={candidate.avatar}
              alt={candidate.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{candidate.name}</h2>
              <span className="p-0.5 rounded-full bg-blue-500 text-white">
                <CheckCircle className="w-3.5 h-3.5 fill-blue-500 text-white" />
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600">{candidate.title}</p>
            <p className="text-xs text-slate-500">{candidate.location} · {candidate.education}</p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5 text-orange-600 font-semibold">
                <Flame className="w-4 h-4 fill-orange-500" />
                {candidate.studyStreak}-Day Learning Streak
              </div>
              <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <Coins className="w-4 h-4 fill-amber-500" />
                {candidate.coinsEarned} Platform Coins Earned
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Certified Skills</h3>
              <p className="text-xs text-slate-500">Skills certified through course completions and assessments</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((s) => (
                <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                  {s}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <h3 className="text-base font-bold text-slate-900">Verified Platform Credentials</h3>
              {candidate.verifiedCertificates.map((cert) => (
                <div key={cert.name} className="p-3.5 bg-slate-50 border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{cert.name}</h4>
                      <p className="text-[11px] text-slate-500">Issued by {cert.issuer} · {cert.issued}</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px]">Verified</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Candidate Evaluation</h3>
            {candidate.evaluation ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Technical Score:</span>
                  <span className="font-bold text-slate-900">{candidate.evaluation.technicalScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Communication:</span>
                  <span className="font-bold text-slate-900">{candidate.evaluation.communicationScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Problem Solving:</span>
                  <span className="font-bold text-slate-900">{candidate.evaluation.problemSolvingScore}/100</span>
                </div>
                <div className="pt-2 border-t border-border text-[11px] text-slate-600 italic">
                  &ldquo;{candidate.evaluation.notes}&rdquo;
                </div>
                <p className="text-[10px] text-slate-400">Evaluated by: {candidate.evaluation.evaluator}</p>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2 text-slate-400">
                <FileCheck className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">No evaluation scorecard submitted yet.</p>
                <Link href={`/company/talent/${candidate.id}/evaluate`}>
                  <Button variant="outline" className="text-xs mt-2">
                    Submit Scorecard
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
