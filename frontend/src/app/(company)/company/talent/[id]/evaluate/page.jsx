'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  ArrowLeft,
  FileCheck,
  Star,
  Save,
  CheckCircle,
} from 'lucide-react';

export default function CandidateEvaluationPage({ params }) {
  const router = useRouter();
  const [candidate] = useState(null);

  const [scores, setScores] = useState({
    technical: 0,
    communication: 0,
    problemSolving: 0,
    notes: '',
    recommendation: 'STRONG_HIRE',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/company/talent/${params.id}`);
  };

  if (!candidate) {
    return (
      <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
        <div className="space-y-6 max-w-3xl mx-auto py-12 text-center">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Candidate Not Found</h2>
            <p className="text-sm text-slate-500">The requested candidate evaluation could not be found or has not been loaded.</p>
            <Link href="/company/talent">
              <Button variant="outline" className="text-xs">Back to Talent Discovery</Button>
            </Link>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href={`/company/talent/${params.id}`}>
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Candidate Evaluation Scorecard</h1>
            <p className="text-xs text-slate-500">Record structured feedback and hiring recommendation for {candidate.name}</p>
          </div>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Evaluation scorecard saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 border border-border rounded-xl">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border">
                <Image
                  src={candidate.avatar}
                  alt={candidate.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{candidate.name}</h3>
                <p className="text-xs text-slate-500">{candidate.title}</p>
                <p className="text-[11px] text-slate-400">Match score: {candidate.matchScore}%</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-700">Technical Foundation (1–100)</label>
                  <span className="font-bold text-primary">{scores.technical}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={scores.technical}
                  onChange={(e) => setScores({ ...scores, technical: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-700">Communication & Team Collaboration (1–100)</label>
                  <span className="font-bold text-primary">{scores.communication}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={scores.communication}
                  onChange={(e) => setScores({ ...scores, communication: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-700">Analytical & Problem Solving (1–100)</label>
                  <span className="font-bold text-primary">{scores.problemSolving}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={scores.problemSolving}
                  onChange={(e) => setScores({ ...scores, problemSolving: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700">Hiring Recommendation</label>
                <select
                  value={scores.recommendation}
                  onChange={(e) => setScores({ ...scores, recommendation: e.target.value })}
                  className="w-full rounded-lg border border-border p-2.5 text-xs bg-white text-slate-900"
                >
                  <option value="STRONG_HIRE">Strong Hire — Recommend for immediate offer</option>
                  <option value="HIRE">Hire — Meets all core engineering qualifications</option>
                  <option value="NEUTRAL">Neutral — Needs additional team panel review</option>
                  <option value="NO_HIRE">No Hire — Does not meet minimum standards</option>
                </select>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700">Detailed Evaluator Notes</label>
                <textarea
                  rows={4}
                  placeholder="Record interview notes, technical strengths, and behavioral observations..."
                  value={scores.notes}
                  onChange={(e) => setScores({ ...scores, notes: e.target.value })}
                  required
                  className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href={`/company/talent/${params.id}`}>
              <Button type="button" variant="outline" className="text-xs">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="text-xs flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Save Evaluation Scorecard
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

