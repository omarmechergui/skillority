'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, Edit, CheckCircle, Clock } from 'lucide-react';

export default function InstructorLessonPreviewPage({ params }) {
  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/instructor/courses/${params.id}/lessons/${params.lessonId}/edit`}>
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <Badge variant="success" className="text-[10px]">Student Perspective Preview</Badge>
              <h1 className="text-2xl font-bold text-slate-900">Server Actions & Cache Invalidation</h1>
            </div>
          </div>

          <Link href={`/instructor/courses/${params.id}/lessons/${params.lessonId}/edit`}>
            <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
              <Edit className="w-4 h-4" />
              Back to Builder
            </Button>
          </Link>
        </div>

        {/* Rendered Lesson Content */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 text-xs text-slate-500 pb-4 border-b border-border">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              25 min read & exercise
            </span>
            <span>•</span>
            <span>Chapter 1: Next.js App Router Architecture</span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            Server Actions in Next.js 14 allow direct mutation calls without manual API route scaffolding. In this lesson, we dissect progressive enhancement and cache tag revalidation.
          </p>

          <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto">
            <pre>{`'use server';
import { revalidateTag } from 'next/cache';

export async function updateProfile(formData) {
  const name = formData.get('name');
  await db.user.update({ where: { id }, data: { name } });
  revalidateTag('user-profile');
}`}</pre>
          </div>

          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 font-semibold">
            Key takeaway: Always invoke revalidateTag() inside the action handler after database writes complete.
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

