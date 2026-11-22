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
  CheckCircle2,
  XCircle,
  Building2,
} from 'lucide-react';

export default function CompanyOpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notification, setNotification] = useState(null);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (user?.id) params.companyId = user.id;
      const res = await careerApi.getOpportunities(params);
      if (res.data?.opportunities) {
        setOpportunities(res.data.opportunities);
      } else if (Array.isArray(res.data)) {
        setOpportunities(res.data);
      }
    } catch (err) {
      console.error('Failed to load company opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [user]);

  const handleCloseOpportunity = async (oppId) => {
    try {
      await careerApi.closeOpportunity(oppId);
      setNotification({ type: 'success', message: 'Opportunity marked as closed.' });
      await loadOpportunities();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to close opportunity.' });
    }
  };

  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OPEN' ? opp.isOpen : !opp.isOpen) ||
      opp.status === statusFilter;
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
              Post New Opportunity
            </Button>
          </Link>
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

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'OPEN', 'CLOSED', 'DRAFT'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === st
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 border border-border text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities Table / Card Feed */}
        {loading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-xl border border-border">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-xs text-slate-500">Loading opportunities...</p>
          </div>
        ) : filteredOpps.length === 0 ? (
          <Card className="p-12 text-center space-y-3 border-border">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No opportunities found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by creating your first internship or job opportunity to receive verified applicants.
            </p>
            <Link href="/company/opportunities/create">
              <Button size="sm" className="text-xs mt-2">
                <Plus className="w-4 h-4 mr-1.5" />
                Post First Opportunity
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOpps.map((opp) => {
              const applicantsCount = opp._count?.applications || 0;
              const isClosed = !opp.isOpen || opp.status === 'CLOSED';

              return (
                <Card
                  key={opp.id}
                  className="p-6 bg-white border-border hover:shadow-xs transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {opp.type || 'INTERNSHIP'}
                        </Badge>
                        <Badge
                          variant={isClosed ? 'error' : 'success'}
                          className="text-[10px] font-bold"
                        >
                          {isClosed ? 'CLOSED' : 'ACTIVE'}
                        </Badge>
                        <span className="text-xs text-slate-500">{opp.category || 'Engineering'}</span>
                        <span className="text-xs text-slate-400">· {opp.workplaceType || 'Remote'}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        <Link href={`/company/opportunities/${opp.id}`}>{opp.title}</Link>
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                        <span>{opp.location}</span>
                        <span>·</span>
                        <span>Stipend: {opp.stipend || 'Competitive'}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-700">
                          Capacity: {opp.filledPositions || 0} / {opp.positions || 1} filled
                        </span>
                        <span>·</span>
                        <span>Posted {new Date(opp.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right px-3 py-1 bg-slate-50 rounded-lg border border-border">
                        <div className="text-base font-extrabold text-slate-900">{applicantsCount}</div>
                        <div className="text-[10px] text-slate-400">Applicants</div>
                      </div>

                      <Link href={`/company/applications?opportunityId=${opp.id}`}>
                        <Button variant="primary" size="sm" className="text-xs">
                          <Users className="w-3.5 h-3.5 mr-1" />
                          View Candidates
                        </Button>
                      </Link>

                      {!isClosed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCloseOpportunity(opp.id)}
                          className="text-xs text-slate-500 hover:text-rose-600"
                        >
                          Close Role
                        </Button>
                      )}
                    </div>
                  </div>

                  {opp.skills && opp.skills.length > 0 && (
                    <div className="pt-2 border-t border-border flex flex-wrap gap-1.5 items-center">
                      <span className="text-[11px] font-semibold text-slate-400 mr-1">Skills:</span>
                      {opp.skills.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md border border-blue-200/60 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
