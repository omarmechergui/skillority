'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { careerApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  Briefcase,
  Plus,
  Users,
  Search,
  Filter,
  Calendar,
  MoreVertical,
  ArrowRight,
  Edit,
  Eye,
  Trash2,
  Loader2,
} from 'lucide-react';

export default function CompanyOpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function loadOpportunities() {
      setLoading(true);
      try {
        const params = {};
        if (user?.id) params.companyId = user.id;
        const res = await careerApi.getOpportunities(params);
        if (res.data?.opportunities && res.data.opportunities.length > 0) {
          const liveList = res.data.opportunities.map((opp) => ({
            id: opp.id,
            title: opp.title,
            department: 'Core Operations',
            location: opp.location || 'Remote',
            type: opp.type === 'FULL_TIME' ? 'Full-Time' : opp.type,
            status: opp.isOpen ? 'ACTIVE' : 'CLOSED',
            description: opp.description,
            requiredSkills: opp.skills || [],
            applicantsCount: opp._count?.applications || 0,
            viewsCount: 120,
            postedDate: new Date(opp.createdAt).toLocaleDateString(),
          }));
          setOpportunities(liveList);
        } else if (res.data?.opportunities && res.data.opportunities.length === 0) {
          setOpportunities([]);
        }
      } catch (err) {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    }
    loadOpportunities();
  }, [user]);

  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || opp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Job Listings</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Company Opportunities
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Create and manage job postings, internships, and apprenticeships targeted at verified learners.
            </p>
          </div>

          <Link href="/company/opportunities/create">
            <Button className="text-xs font-semibold flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              Create New Opportunity
            </Button>
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="inline-flex rounded-lg border border-border p-1 bg-slate-50 text-xs w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Listings ({opportunities.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ACTIVE')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'ACTIVE' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({opportunities.filter((o) => o.status === 'ACTIVE').length})
            </button>
          </div>
        </div>

        {opportunities.length === 0 && !loading && (
          <Card className="p-8 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No opportunities posted yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Publish your first internship or full-time position to discover verified talent.
            </p>
            <Link href="/company/opportunities/create">
              <Button size="sm" className="text-xs">Post an Opportunity</Button>
            </Link>
          </Card>
        )}

        {/* Opportunities List */}
        <div className="space-y-4">
          {filteredOpps.map((opp) => (
            <Card key={opp.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-shadow">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <Badge variant="primary" className="text-[10px]">
                    {opp.type}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {opp.status}
                  </Badge>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">{opp.location}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {opp.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{opp.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.requiredSkills?.map((sk) => (
                    <span key={sk} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                <div className="text-center sm:text-right">
                  <div className="text-xl font-black text-slate-900">{opp.applicantsCount}</div>
                  <div className="text-[11px] text-slate-400">Applicants</div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/company/opportunities/${opp.id}`}>
                    <Button variant="outline" className="text-xs font-semibold flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/company/opportunities/${opp.id}/edit`}>
                    <Button variant="ghost" className="text-xs font-semibold p-2">
                      <Edit className="w-4 h-4 text-slate-600" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

