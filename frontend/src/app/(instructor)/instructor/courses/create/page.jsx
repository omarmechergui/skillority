'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { coursesApi } from '@/lib/api';
import { BookOpen, ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react';

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Web Development',
    level: 'Intermediate',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await coursesApi.createCourse({
        title: form.title.trim(),
        category: form.category,
        level: form.level,
        description: form.description.trim(),
        tags: [form.category, form.level],
      });

      if (res?.data?.id) {
        router.push(`/instructor/courses/${res.data.id}/curriculum`);
      } else {
        router.push('/instructor/courses');
      }
    } catch (err) {
      setError(err?.message || 'Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/instructor/courses">
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
            <p className="text-xs text-slate-500">Course → Chapters → Lessons → Chapter Quiz → Final Assessment</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-5">
            <h2 className="text-base font-bold text-slate-900">Course Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Course Title</label>
                <Input
                  name="title"
                  placeholder="e.g. Modern Full-Stack Web Development"
                  value={form.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-border p-2.5 text-xs bg-white text-slate-900"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Difficulty Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-border p-2.5 text-xs bg-white text-slate-900"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700">Course Overview & Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Comprehensive description of technologies, architectural patterns, and real-world projects..."
                value={form.description}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-lg border border-border p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href="/instructor/courses">
              <Button type="button" variant="outline" className="text-xs" disabled={loading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="text-xs flex items-center gap-1.5">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Course...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save & Proceed to Curriculum
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

