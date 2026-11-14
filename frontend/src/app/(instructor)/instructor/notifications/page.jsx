'use client';

import { useState } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockInstructorNotifications } from '@/lib/mockInstructorData';
import {
  Bell,
  Check,
  Trash2,
  BookOpen,
  Award,
  HelpCircle,
} from 'lucide-react';

export default function InstructorNotificationsPage() {
  const [notifications, setNotifications] = useState(mockInstructorNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Instructor Notifications
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Course approval statuses, quiz completions, and student forum questions.
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
                  {n.type === 'course' && <BookOpen className="w-5 h-5 text-emerald-600" />}
                  {n.type === 'student' && <Award className="w-5 h-5 text-purple-600" />}
                  {n.type === 'question' && <HelpCircle className="w-5 h-5 text-blue-600" />}
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

