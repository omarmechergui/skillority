'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import {
  Globe,
  Mail,
  MapPin,
  Star,
  Users,
  Award,
  BookOpen,
  Edit,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';

export default function InstructorMyProfilePage() {
  const { user } = useAuth();
  const profile = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Instructor',
    title: 'Senior Software Architect & Instructor',
    bio: 'Educating developers on modern enterprise web architectures, distributed systems, and real-world software engineering practices.',
    email: user?.email || '',
    location: '',
    website: 'https://skillority.com',
    expertise: ['Web Development', 'System Architecture', 'React & Next.js'],
    coverPhoto: null,
    avatar: null,
    stats: {
      totalStudents: 0,
      activeCourses: 0,
      averageRating: 0,
    },
  };

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Cover Photo */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-border shadow-sm">
          <div className="relative h-48 sm:h-64 w-full bg-slate-800 flex items-center justify-center">
            {profile.coverPhoto ? (
              <Image
                src={profile.coverPhoto}
                alt={profile.name}
                fill
                className="object-cover opacity-80"
                unoptimized
              />
            ) : (
              <div className="text-slate-500 font-bold text-sm">Instructor Profile Banner</div>
            )}
          </div>

          <div className="px-6 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <GraduationCap className="w-10 h-10 text-primary" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{profile.name}</h1>
                    <span className="p-0.5 rounded-full bg-blue-500 text-white">
                      <CheckCircle className="w-4 h-4 fill-blue-500 text-white" />
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">{profile.title}</p>
                  <p className="text-xs text-slate-400">{profile.location} · {profile.email}</p>
                </div>
              </div>

              <Link href="/instructor/settings">
                <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                  <Edit className="w-3.5 h-3.5" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bio & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Instructor Biography</h2>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900">Teaching Statistics</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-slate-500">Students Taught:</span>
                <span className="font-bold text-slate-900">{profile.stats.totalStudents}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-slate-500">Rating:</span>
                <span className="font-bold text-amber-600">{profile.stats.averageRating} ★</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reviews:</span>
                <span className="font-semibold text-slate-800">{profile.stats.reviewsCount}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

