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
  Users,
  Search,
  Bookmark,
  BookmarkCheck,
  Award,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function TalentDiscoveryPage() {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('ALL');

  const toggleSave = (id) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isSaved: !c.isSaved } : c))
    );
  };

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkill =
      skillFilter === 'ALL' || c.skills.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Candidate Search</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Talent Discovery
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Source verified engineering talent evaluated on real assignments, chapter quizzes, and certified course tracks.
            </p>
          </div>

          <Link href="/company/talent/saved">
            <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-amber-500" />
              Saved Candidates ({candidates.filter((c) => c.isSaved).length})
            </Button>
          </Link>
        </div>

        {/* Search & Skill Filter Chips */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, skill, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {['ALL', 'React.js', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'].map((sk) => (
              <button
                key={sk}
                type="button"
                onClick={() => setSkillFilter(sk)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                  skillFilter === sk
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-600 border-border hover:bg-slate-50'
                }`}
              >
                {sk}
              </button>
            ))}
          </div>
        </div>

        {/* Talent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <Card key={c.id} className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
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
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{c.name}</h3>
                      <p className="text-xs text-slate-500">{c.location}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSave(c.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                  >
                    {c.isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{c.title}</p>

                {/* Score badge & Completion */}
                <div className="p-3 bg-slate-50 rounded-xl border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase">Match Score</span>
                    <span className="font-extrabold text-emerald-600">{c.matchScore}% Match</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase">Certificates</span>
                    <span className="font-bold text-slate-800">{c.certificatesCount} Verified</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase">Streak</span>
                    <span className="font-bold text-orange-600">{c.studyStreak} Days</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {c.skills.slice(0, 4).map((sk) => (
                    <span key={sk} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                      {sk}
                    </span>
                  ))}
                  {c.skills.length > 4 && (
                    <span className="text-[10px] text-slate-400 px-1 py-0.5">
                      +{c.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-5 border-t border-border mt-4 flex items-center gap-2">
                <Link href={`/company/talent/${c.id}`} className="flex-1">
                  <Button variant="outline" className="w-full text-xs font-semibold">
                    View Profile
                  </Button>
                </Link>
                <Link href={`/company/talent/${c.id}/evaluate`}>
                  <Button className="text-xs font-semibold">
                    Evaluate
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

