'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { careerApi } from '@/lib/api';
import {
  FileCheck2,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  Compass,
  Target,
  Video,
  Award,
} from 'lucide-react';

const STATUS_FILTERS = ['ALL', 'PENDING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedAppId, setExpandedAppId] = useState(null);

  // Withdraw modal state
  const [withdrawModalApp, setWithdrawModalApp] = useState(null);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  // Offer response state
  const [respondingOfferId, setRespondingOfferId] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await careerApi.getMyApplications();
      if (Array.isArray(res?.data)) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawModalApp) return;
    setWithdrawing(true);
    try {
      await careerApi.withdrawApplication(withdrawModalApp.id, withdrawReason);
      setNotification({ type: 'success', message: 'Application withdrawn successfully.' });
      setWithdrawModalApp(null);
      setWithdrawReason('');
      await loadApplications();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to withdraw application.' });
    } finally {
      setWithdrawing(false);
    }
  };

  const handleRespondToOffer = async (offerId, decision) => {
    setRespondingOfferId(offerId);
    try {
      await careerApi.respondToOffer(offerId, { status: decision });
      setNotification({
        type: 'success',
        message: decision === 'ACCEPTED' ? 'Offer accepted! Congratulations on your internship.' : 'Offer declined.',
      });
      await loadApplications();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to update offer.' });
    } finally {
      setRespondingOfferId(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/student/dashboard" className="hover:text-primary transition-colors">
              Student Workspace
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">Application Tracking</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Link href="/student/careers">
              <Button variant="outline" size="sm" className="text-xs">
                <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Internship Marketplace
              </Button>
            </Link>
            <Link href="/student/careers/paths">
              <Button variant="outline" size="sm" className="text-xs">
                <Compass className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Career Paths
              </Button>
            </Link>
            <Link href="/student/careers/dashboard">
              <Button variant="outline" size="sm" className="text-xs">
                <Target className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                My Career Dashboard
              </Button>
            </Link>
            <Link href="/student/careers/applications">
              <Button variant="primary" size="sm" className="text-xs">
                <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
                My Applications ({applications.length})
              </Button>
            </Link>
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

        {/* Hero Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Applications Tracker</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Internship Applications
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track the progress of your submitted applications, view scheduled technical interviews, manage formal offers, and review company feedback in one centralized place.
            </p>
          </div>

          <Link href="/student/careers">
            <Button variant="outline" className="text-xs font-semibold">
              Browse More Opportunities
            </Button>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none bg-white p-3 rounded-xl border border-border">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-50 border border-border text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Applications' : st}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-xl border border-border">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-xs text-slate-500">Loading your applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <Card className="p-12 text-center space-y-4 border-border">
            <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No applications in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore the internship marketplace to discover verified partner positions matching your skillset.
            </p>
            <Link href="/student/careers">
              <Button variant="primary" size="sm" className="text-xs">
                Explore Marketplace <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const isExpanded = expandedAppId === app.id;
              const hasInterview = app.interviews && app.interviews.length > 0;
              const latestInterview = hasInterview ? app.interviews[app.interviews.length - 1] : null;
              const hasOffer = Boolean(app.offer);
              const canWithdraw = ['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW'].includes(app.status);

              return (
                <Card
                  key={app.id}
                  className="p-6 bg-white border-border hover:shadow-xs transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-slate-600">{app.companyName}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {app.type || 'INTERNSHIP'}
                          </Badge>
                          <Badge
                            variant={
                              app.status === 'ACCEPTED'
                                ? 'success'
                                : app.status === 'OFFERED'
                                ? 'primary'
                                : app.status === 'INTERVIEW'
                                ? 'warning'
                                : app.status === 'REJECTED' || app.status === 'WITHDRAWN'
                                ? 'outline'
                                : 'primary'
                            }
                            className="text-[10px] font-bold"
                          >
                            {app.status}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">
                          <Link href={`/student/careers/${app.opportunityId}`}>{app.title}</Link>
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {app.location || 'Remote'}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Applied{' '}
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-semibold text-emerald-700">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> {app.matchScore || 85}% Match
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {canWithdraw && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setWithdrawModalApp(app)}
                          className="text-xs text-slate-500 hover:text-rose-600"
                        >
                          Withdraw
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                        className="text-xs flex items-center gap-1"
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>

                  {/* High-Priority Callout: Interview Scheduled */}
                  {latestInterview && latestInterview.status === 'SCHEDULED' && (
                    <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5 text-amber-800">
                          <Video className="w-4 h-4 text-amber-600" /> Technical Interview Scheduled
                        </span>
                        <Badge variant="warning" className="text-[10px]">
                          {latestInterview.interviewType}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-amber-800 space-y-1">
                        <p>
                          <span className="font-semibold">Date & Time: </span>
                          {new Date(latestInterview.scheduledAt).toLocaleString()} ({latestInterview.timezone})
                        </p>
                        {latestInterview.instructions && (
                          <p>
                            <span className="font-semibold">Instructions: </span>
                            {latestInterview.instructions}
                          </p>
                        )}
                        {latestInterview.meetingLink && (
                          <p className="pt-1">
                            <a
                              href={latestInterview.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-primary hover:underline flex items-center gap-1"
                            >
                              Join Video Meeting Link <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* High-Priority Callout: Offer Extended */}
                  {hasOffer && app.offer.status === 'PENDING' && (
                    <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-xs text-emerald-950">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-emerald-600" />
                          <span className="font-extrabold text-sm text-emerald-900">
                            Official Internship Offer Extended!
                          </span>
                        </div>
                        <Badge variant="success" className="text-[10px]">
                          Action Required
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-white/80 rounded-lg border border-emerald-100 text-[11px]">
                        <div>
                          <span className="text-slate-500 block">Offer Title:</span>
                          <span className="font-bold text-slate-900">{app.offer.title}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Monthly Stipend:</span>
                          <span className="font-bold text-emerald-700">{app.offer.stipend || 'Competitive'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Engagement Duration:</span>
                          <span className="font-bold text-slate-900">{app.offer.duration || '6 months'}</span>
                        </div>
                      </div>

                      {app.offer.conditions && (
                        <p className="text-[11px] text-emerald-900 leading-relaxed">
                          <span className="font-semibold">Conditions: </span>
                          {app.offer.conditions}
                        </p>
                      )}

                      <div className="flex items-center gap-3 pt-1">
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={respondingOfferId === app.offer.id}
                          onClick={() => handleRespondToOffer(app.offer.id, 'ACCEPTED')}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700"
                        >
                          {respondingOfferId === app.offer.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          )}
                          Accept Offer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={respondingOfferId === app.offer.id}
                          onClick={() => handleRespondToOffer(app.offer.id, 'DECLINED')}
                          className="text-xs text-slate-600 hover:text-rose-600"
                        >
                          Decline Offer
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Expanded Details Pane: Timeline & Submission */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-border space-y-4 text-xs">
                      {app.coverLetter && (
                        <div className="space-y-1">
                          <span className="font-bold text-slate-800">Your Submitted Statement:</span>
                          <p className="p-3 bg-slate-50 rounded-lg text-slate-600 whitespace-pre-line leading-relaxed">
                            {app.coverLetter}
                          </p>
                        </div>
                      )}

                      {app.portfolioUrl && (
                        <div className="text-xs">
                          <span className="font-bold text-slate-800">Portfolio Link: </span>
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {app.portfolioUrl} <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {/* Timeline Audit History */}
                      {app.timeline && app.timeline.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-border">
                          <span className="font-bold text-slate-800">Recruitment Activity Timeline:</span>
                          <div className="space-y-2">
                            {app.timeline.map((event, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-[11px] text-slate-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <div>
                                  <span className="font-semibold text-slate-900">{event.action.replace(/_/g, ' ')}</span>
                                  {event.note && <span className="text-slate-500"> — {event.note}</span>}
                                  <span className="text-slate-400 block">
                                    {new Date(event.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Withdraw Application Modal */}
        {withdrawModalApp && (
          <Modal
            isOpen={Boolean(withdrawModalApp)}
            onClose={() => !withdrawing && setWithdrawModalApp(null)}
            title="Withdraw Application"
          >
            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to withdraw your application for{' '}
                <span className="font-bold text-slate-900">{withdrawModalApp.title}</span> at{' '}
                <span className="font-bold text-slate-900">{withdrawModalApp.companyName}</span>? This action will remove you from the active candidate pool.
              </p>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Reason for Withdrawal (Optional)</label>
                <textarea
                  rows={3}
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  placeholder="e.g. Accepted another offer, relocation, schedule conflict..."
                  className="w-full p-2.5 rounded-lg border border-border bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWithdrawModalApp(null)}
                  disabled={withdrawing}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="bg-rose-600 hover:bg-rose-700" disabled={withdrawing}>
                  {withdrawing ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Withdrawing...
                    </span>
                  ) : (
                    'Confirm Withdrawal'
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
