'use client';

import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import {
  Mail,
  Calendar,
  Building,
  Edit,
  CheckCircle,
  Briefcase,
  User,
} from 'lucide-react';

export default function RecruiterPersonalProfilePage() {
  const { user } = useAuth();

  const firstName = user?.profile?.firstName || '';
  const lastName = user?.profile?.lastName || '';
  const name = `${firstName} ${lastName}`.trim() || user?.email || 'Recruiter Representative';
  const email = user?.email || '';
  const companyName = user?.profile?.companyName || 'Your Company';
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member';
  const avatar = user?.profile?.avatar || null;

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Recruiter Identity</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Recruiter Profile
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Personal recruiter profile visible to candidate applicants and talent networks.
            </p>
          </div>

          <Link href="/company/settings">
            <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
              <Edit className="w-3.5 h-3.5" />
              Edit Settings
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 shrink-0 bg-slate-100 flex items-center justify-center">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-primary font-bold text-2xl">
                {firstName ? firstName[0].toUpperCase() : 'R'}
              </span>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{name}</h2>
              <span className="p-0.5 rounded-full bg-blue-500 text-white">
                <CheckCircle className="w-3.5 h-3.5 fill-blue-500 text-white" />
              </span>
            </div>
            <p className="text-sm font-semibold text-primary">Authorized Talent Representative</p>
            <p className="text-xs text-slate-500">{companyName}</p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-2 border-t border-border">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {email}
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {companyName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Member since {joinedDate}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
