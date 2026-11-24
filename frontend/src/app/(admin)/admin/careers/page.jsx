'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { careerApi } from '@/lib/api';
import {
  Compass,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function AdminCareerPathsPage() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // New path form state
  const [isCreating, setIsCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Engineering',
    requiredSkills: '',
    estimatedDurationMonths: 6,
  });

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadPaths = async () => {
    setLoading(true);
    try {
      const res = await careerApi.getCareerPaths();
      if (res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.paths || [];
        setPaths(list);
      }
    } catch {
      // Safe fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaths();
  }, []);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      const skillsArray = formData.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim().toLowerCase(),
        description: formData.description.trim(),
        category: formData.category,
        requiredSkills: skillsArray,
        estimatedDurationMonths: Number(formData.estimatedDurationMonths) || 6,
      };

      const res = await careerApi.createCareerPath(payload);
      if (res.data) {
        setFeedback({ type: 'success', message: 'Career path created successfully!' });
        setIsCreating(false);
        setFormData({
          title: '',
          slug: '',
          description: '',
          category: 'Engineering',
          requiredSkills: '',
          estimatedDurationMonths: 6,
        });
        loadPaths();
      } else {
        throw new Error(res.error?.message || 'Failed to create career path');
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.error?.message || err.message || 'Error creating career path.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    setFeedback(null);
    try {
      await careerApi.deleteCareerPath(deleteTargetId);
      setFeedback({ type: 'success', message: 'Career path deleted successfully.' });
      setDeleteTargetId(null);
      loadPaths();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.error?.message || err.message || 'Failed to delete career path.',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardShell role="ADMIN" navItems={adminNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Compass className="w-8 h-8 text-primary" />
              Career Paths Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Curate structured professional roadmaps, foundational competencies, and career benchmarks for learners.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            {isCreating ? 'Cancel' : 'New Career Path'}
          </Button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Creation Form Card */}
        {isCreating && (
          <Card className="p-6 space-y-6 border-primary/40 shadow-md">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Define New Career Path
              </h2>
              <p className="text-xs text-slate-500">
                Specify curriculum title, URL slug, target industry skills, and estimated completion timeline.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Path Title</label>
                  <Input
                    placeholder="e.g. AI & Machine Learning Engineer"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">URL Slug</label>
                  <Input
                    placeholder="e.g. ai-ml-engineer"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Overview & Purpose</label>
                <textarea
                  rows={3}
                  placeholder="Describe the learning objectives, core responsibilities, and industry demand..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:border-primary focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Security">Security & Cloud</option>
                    <option value="Business">Business & Marketing</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Required Competencies (comma-separated)
                  </label>
                  <Input
                    placeholder="Python, PyTorch, Linear Algebra, Docker"
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Creating Path...' : 'Publish Career Path'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Existing Paths List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-slate-600" />
              Published Career Roadmaps ({paths.length})
            </h2>
          </div>

          {loading ? (
            <Card className="p-8 text-center text-slate-400 text-sm">
              Loading career paths...
            </Card>
          ) : paths.length === 0 ? (
            <Card className="p-8 text-center text-slate-500 text-sm">
              No career paths defined yet. Create your first career roadmap above.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paths.map((p) => (
                <Card key={p.id} className="p-5 flex flex-col justify-between gap-4 hover:shadow-sm transition-shadow">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {p.category || 'General'}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(p.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete Career Path"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {p.description}
                    </p>

                    {Array.isArray(p.requiredSkills) && p.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.requiredSkills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {p.requiredSkills.length > 4 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{p.requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {p.estimatedDurationMonths || 6} months
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      /{p.slug}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={Boolean(deleteTargetId)}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Career Path?"
          description="Are you sure you want to remove this career roadmap? This will remove all student milestones tied to this pathway."
          confirmText={deleting ? 'Deleting...' : 'Delete Path'}
          variant="danger"
        />
      </div>
    </DashboardShell>
  );
}
