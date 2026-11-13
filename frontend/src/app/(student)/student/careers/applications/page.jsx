'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { mockStudentApplications, mockOpportunities } from '@/lib/mockCareerData';
import {
  FileCheck,
  Bookmark,
  Calendar,
  Building2,
  Clock,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Briefcase,
  HelpCircle,
  Info
} from 'lucide-react';

export default function StudentApplicationsPage() {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'saved'
  const [applications, setApplications] = useState(mockStudentApplications);
  const [withdrawAppId, setWithdrawAppId] = useState(null);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  const savedOpportunities = mockOpportunities.filter(o => o.isSaved);

  const handleWithdrawClick = (appId) => {
    setWithdrawAppId(appId);
    setIsWithdrawDialogOpen(true);
  };

  const handleConfirmWithdraw = () => {
    if (withdrawAppId) {
      setApplications(prev => prev.filter(app => app.id !== withdrawAppId));
      setIsWithdrawDialogOpen(false);
      setWithdrawAppId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Interview Scheduled':
        return <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">{status}</Badge>;
      case 'Under Review':
        return <Badge variant="primary" className="bg-blue-50 text-blue-700 border-blue-200">{status}</Badge>;
      case 'Offer Received':
        return <Badge variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/student/careers" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Opportunities
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">My Applications & Saved Roles</span>
        </div>

        {/* Page Header (Stitch Screen 23 reference) */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Applications & Saved Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Track the status of your active candidate submissions, review recruiter timelines, and revisit bookmarked roles.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-border shrink-0">
            <div className="text-center px-2">
              <div className="text-xl font-bold text-slate-900">{applications.length}</div>
              <div className="text-xs text-slate-500">Submitted</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-emerald-600">
                {applications.filter(a => a.status === 'Interview Scheduled').length}
              </div>
              <div className="text-xs text-slate-500">Interviews</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-primary">{savedOpportunities.length}</div>
              <div className="text-xs text-slate-500">Saved</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'applications'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Active Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Opportunities ({savedOpportunities.length})</span>
          </button>
        </div>

        {/* 2-Column Content: Main List + Status Guide Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === 'applications' ? (
              applications.length === 0 ? (
                <Card className="p-8 text-center space-y-3">
                  <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">No active applications found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You have not submitted applications yet. Explore vetted roles in the careers catalog.
                  </p>
                  <Link href="/student/careers">
                    <Button variant="primary" size="sm">Explore Opportunities</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => (
                    <Card key={app.id} className="p-6 space-y-4 bg-white border-border hover:border-blue-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-slate-500">{app.company}</span>
                            {getStatusBadge(app.status)}
                          </div>
                          <h3 className="text-base font-bold text-slate-900">{app.role}</h3>
                        </div>

                        <div className="text-xs text-slate-400">
                          Applied on {app.appliedDate}
                        </div>
                      </div>

                      {/* Recruiter Stage & Notes */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700">Current Stage:</span>
                          <span className="font-bold text-primary">{app.stage}</span>
                        </div>
                        <p className="text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {app.notes}
                        </p>
                      </div>

                      {/* Progression Steps Timeline */}
                      <div className="space-y-1 pt-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Recruitment Timeline
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {app.timeline.map((step, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg border text-[11px] space-y-0.5 ${
                                step.completed
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                  : step.current
                                  ? 'bg-blue-50 border-blue-200 text-blue-900 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                {step.completed ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                                )}
                                <span className="truncate">{step.step}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">{step.date}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleWithdrawClick(app.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Withdraw Application
                        </button>

                        <Link href={`/student/careers/${app.opportunityId}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Opportunity Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              /* Saved Opportunities Tab */
              savedOpportunities.length === 0 ? (
                <Card className="p-8 text-center space-y-3">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">No saved opportunities</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You can bookmark interesting opportunities from the catalog to review them later.
                  </p>
                  <Link href="/student/careers">
                    <Button variant="primary" size="sm">Browse Roles</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {savedOpportunities.map(opp => (
                    <Card key={opp.id} className="p-5 space-y-3 bg-white border-border hover:border-blue-200 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500">{opp.company}</span>
                          <h3 className="text-base font-bold text-slate-900">
                            <Link href={`/student/careers/${opp.id}`} className="hover:text-primary transition-colors">
                              {opp.title}
                            </Link>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">{opp.location} · {opp.stipend}</p>
                        </div>
                        <Link href={`/student/careers/${opp.id}`}>
                          <Button variant="primary" size="sm" className="text-xs">
                            Apply
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Sidebar: Status Guide & Notice (from Stitch Screen 23) */}
          <div className="space-y-6">
            <Card className="p-5 space-y-3 bg-white border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-primary" /> Application Status Guide
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-blue-700">Under Review:</span>
                  <p className="text-slate-500">The hiring company recruiter is reviewing your profile and credentials.</p>
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-700">Interview Scheduled:</span>
                  <p className="text-slate-500">You have been invited for a technical or behavioral interview round.</p>
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-700">Offer Received:</span>
                  <p className="text-slate-500">Congratulations! A formal internship or job offer has been extended.</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-2 bg-slate-50 border-border text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 flex items-center gap-1">
                <HelpCircle className="w-4 h-4 text-slate-500" /> Platform Transparency
              </h4>
              <p className="leading-relaxed">
                Skillority never charges candidates fees for internship applications. Communication with recruiters remains accessible within your messages hub.
              </p>
            </Card>
          </div>
        </div>

        {/* Withdraw Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isWithdrawDialogOpen}
          onClose={() => setIsWithdrawDialogOpen(false)}
          onConfirm={handleConfirmWithdraw}
          title="Withdraw Application?"
          description="Are you sure you want to withdraw this application? The hiring company will be notified that you are no longer in consideration."
          confirmText="Yes, Withdraw"
          danger={true}
        />
      </div>
    </DashboardShell>
  );
}

