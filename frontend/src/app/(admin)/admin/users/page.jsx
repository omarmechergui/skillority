'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockAdminUsers } from '@/lib/mockAdminData';
import {
  Users,
  Search,
  Filter,
  Eye,
  ShieldAlert,
  CheckCircle,
  MoreVertical,
} from 'lucide-react';

export default function UserManagementDirectoryPage() {
  const [users, setUsers] = useState(mockAdminUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardShell roleTitle="Platform Admin" navItems={adminNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              User Management Directory
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Audit user accounts across student, recruiter, and instructor roles. Manage platform status and moderation.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 text-xs">
          {['ALL', 'STUDENT', 'COMPANY', 'INSTRUCTOR'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                roleFilter === r
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-border hover:bg-slate-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* User Table / List */}
        <div className="space-y-3">
          {filtered.map((u) => (
            <Card key={u.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{u.name}</h3>
                  <Badge variant="primary" className="text-[10px]">{u.role}</Badge>
                  <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'} className="text-[10px]">
                    {u.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{u.email} · Joined {u.joinedDate}</p>
                <p className="text-[11px] text-slate-400">{u.activityCount}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/admin/users/${u.id}`}>
                  <Button variant="outline" className="text-xs font-semibold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Details
                  </Button>
                </Link>
                <Link href={`/admin/users/${u.id}/manage`}>
                  <Button variant="outline" className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50">
                    Moderation
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

