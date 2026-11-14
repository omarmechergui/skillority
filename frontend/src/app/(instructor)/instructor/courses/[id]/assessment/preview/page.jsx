'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, Edit, Award, CheckCircle } from 'lucide-react';

export default function AssessmentPreviewPage({ params }) {
  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/instructor/courses/${params.id}/assessment/edit`}>
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <Badge variant="success" className="text-[10px]">Student Perspective Preview</Badge>
              <h1 className="text-2xl font-bold text-slate-900">Final Assessment Preview</h1>
            </div>
          </div>

          <Link href={`/instructor/courses/${params.id}/assessment/edit`}>
            <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
              <Edit className="w-4 h-4" />
              Back to Builder
            </Button>
          </Link>
        </div>

        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between p-4 bg-purple-50/70 border border-purple-200 rounded-xl">
            <div className="space-y-1">
              <h2 className="font-bold text-sm text-purple-950 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                Course Certification Examination
              </h2>
              <p className="text-xs text-purple-800">
                Passing score requirement: 80% · Grants verified final completion certificate
              </p>
            </div>
            <Badge variant="primary" className="text-xs">Timed Exam</Badge>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                1. Which Next.js API revalidates tagged cache data across edge points?
              </h3>
              <div className="space-y-2 text-xs">
                {['revalidatePath()', 'revalidateTag()', 'cache.clear()', 'purgeCache()'].map((opt, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border bg-slate-50/50 flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center font-bold text-[10px]">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-slate-800 font-medium">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

