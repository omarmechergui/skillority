'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockCompanyNotifications } from '@/lib/mockCompanyData';
import {
  Bell,
  Check,
  Trash2,
  Users,
  Briefcase,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function RecruiterNotificationsPage() {
  const [notifications, setNotifications] = useState(mockCompanyNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Activity Center</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Recruiter Notifications
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Stay alerted on new applicant submissions, interview confirmations, and high-match candidate recommendations.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all as read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-all ${
                !n.read ? 'bg-blue-50/30 border-blue-200' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                  {n.type === 'application' && <Users className="w-5 h-5 text-blue-600" />}
                  {n.type === 'interview' && <Calendar className="w-5 h-5 text-purple-600" />}
                  {n.type === 'talent' && <Sparkles className="w-5 h-5 text-emerald-600" />}
                  {n.type === 'system' && <Briefcase className="w-5 h-5 text-amber-600" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                  <p className="text-[11px] text-slate-400 pt-1">{n.time}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteNotification(n.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

