'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateLessonBasicsPage({ params }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    duration: '20 min',
    chapter: '0',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/instructor/courses/${params.id}/lessons/les-new/edit`);
  };

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href={`/instructor/courses/${params.id}/curriculum`}>
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create Lesson Basics</h1>
            <p className="text-xs text-slate-500">Configure title, chapter association, and duration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Lesson Title</label>
              <Input
                placeholder="e.g. Server-Side Rendering vs Static Site Generation"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Chapter</label>
                <select
                  value={form.chapter}
                  onChange={(e) => setForm({ ...form, chapter: e.target.value })}
                  className="w-full rounded-lg border border-border p-2.5 text-xs bg-white text-slate-900"
                >
                  <option value="0">Chapter 0: Orientation & Setup (Free)</option>
                  <option value="1">Chapter 1: Next.js App Router (Free)</option>
                  <option value="6">Chapter 6: Edge Middleware (250 Coins)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Duration</label>
                <Input
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700">Brief Summary</label>
              <textarea
                rows={3}
                placeholder="Core topics and code exercises covered in this lesson..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href={`/instructor/courses/${params.id}/curriculum`}>
              <Button type="button" variant="outline" className="text-xs">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="text-xs flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Save & Open Hybrid Builder
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

