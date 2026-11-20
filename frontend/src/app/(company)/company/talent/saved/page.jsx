'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  BookmarkCheck,
  ArrowLeft,
  Users,
  Trash2,
  Eye,
  FileCheck,
} from 'lucide-react';

export default function SavedCandidatesPage() {
  const [candidates, setCandidates] = useState([]);

  const removeSaved = (id) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Shortlist</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Saved Candidates
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Candidates bookmarked for future roles, outreach campaigns, and recruiter pipeline sourcing.
            </p>
          </div>

          <Link href="/company/talent">
            <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              Discover More Candidates
            </Button>
          </Link>
        </div>

        {/* List */}
        {candidates.length === 0 ? (
          <Card className="p-12 text-center space-y-3">
            <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No saved candidates</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have not bookmarked any candidates yet. Browse Talent Discovery to shortlist profiles.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {candidates.map((c) => (
              <Card key={c.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border">
                    <Image
                      src={c.avatar}
                      alt={c.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                    <p className="text-xs text-slate-500">{c.title}</p>
                    <p className="text-[11px] text-slate-400 pt-0.5">{c.location} · {c.education}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="success" className="text-[10px]">
                    {c.matchScore}% Match
                  </Badge>
                  <Link href={`/company/talent/${c.id}`}>
                    <Button variant="outline" className="text-xs font-semibold flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      View Profile
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeSaved(c.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
