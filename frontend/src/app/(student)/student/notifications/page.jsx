'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockNotifications } from '@/lib/mockStudentData';
import {
  Bell,
  CheckCircle2,
  Coins,
  BookOpen,
  MessageSquare,
  Briefcase,
  Users,
  Check,
  Trash2,
  Filter,
} from 'lucide-react';

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('ALL');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markSingleAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'COINS') return n.badge === 'Coins';
    if (filter === 'COURSES') return n.badge === 'Course';
    if (filter === 'CHAT') return n.badge === 'Chat';
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reward':
        return <Coins className="w-5 h-5 text-amber-600 fill-amber-500" />;
      case 'course':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'career':
        return <Briefcase className="w-5 h-5 text-emerald-600" />;
      case 'community':
        return <Users className="w-5 h-5 text-sky-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
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
              Notifications & Alerts
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Stay up to date with course releases, coin bonuses, direct chat messages, and recruiter views.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
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
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="inline-flex rounded-lg border border-border p-1 bg-slate-50 text-xs">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Alerts ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('UNREAD')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'UNREAD' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('COINS')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'COINS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Coins & Rewards
            </button>
            <button
              type="button"
              onClick={() => setFilter('COURSES')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'COURSES' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Courses
            </button>
            <button
              type="button"
              onClick={() => setFilter('CHAT')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'CHAT' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chat
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No notifications found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You have caught up with all current notifications and platform activity.
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notif) => (
              <Card
                key={notif.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-all hover:shadow-sm ${
                  !notif.read ? 'bg-blue-50/30 border-blue-200' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                      <Badge variant="outline" className="text-[10px] py-0 px-2">
                        {notif.badge}
                      </Badge>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    <p className="text-[11px] text-slate-400 pt-1">{notif.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => markSingleAsRead(notif.id)}
                      title="Mark as read"
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotification(notif.id)}
                    title="Delete notification"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

