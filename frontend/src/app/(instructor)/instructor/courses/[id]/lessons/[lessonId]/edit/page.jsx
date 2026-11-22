'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { coursesApi } from '@/lib/api';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Code,
  Image as ImageIcon,
  FileText,
  Video,
  ListPlus,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function HybridLessonBuilderPage() {
  const params = useParams();
  const courseId = params?.id || '';
  const lessonId = params?.lessonId || '';

  const [lessonTitle, setLessonTitle] = useState('Lesson Title');
  const [duration, setDuration] = useState('20');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const [blocks, setBlocks] = useState([
    {
      id: 'b1',
      type: 'TEXT',
      content: 'Server Actions in Next.js allow direct mutation calls without manual API route scaffolding. In this lesson, we dissect progressive enhancement and cache tag revalidation.',
    },
    {
      id: 'b2',
      type: 'CODE',
      language: 'javascript',
      content: `'use server';\nimport { revalidateTag } from 'next/cache';\n\nexport async function updateProfile(formData) {\n  const name = formData.get('name');\n  await db.user.update({ where: { id }, data: { name } });\n  revalidateTag('user-profile');\n}`,
    },
    {
      id: 'b3',
      type: 'CALLOUT',
      content: 'Key takeaway: Always invoke revalidateTag() inside the action handler after database writes complete.',
    },
  ]);

  useEffect(() => {
    async function loadLesson() {
      if (!courseId || !lessonId) return;
      try {
        const res = await coursesApi.getCourse(courseId, { includeContent: 'true' });
        if (res?.data?.chapters) {
          for (const ch of res.data.chapters) {
            const found = ch.lessons?.find((l) => l.id === lessonId);
            if (found) {
              setLessonTitle(found.title);
              if (found.duration) setDuration(String(found.duration));
              if (found.content?.blocks && Array.isArray(found.content.blocks) && found.content.blocks.length > 0) {
                setBlocks(found.content.blocks);
              }
              break;
            }
          }
        }
      } catch (err) {
        // Safe fallback
      }
    }
    loadLesson();
  }, [courseId, lessonId]);

  const addBlock = (type) => {
    const newBlock = {
      id: `b-${Date.now()}`,
      type,
      content: type === 'CODE' ? '// Enter code here...' : 'New content block...',
      language: 'javascript',
    };
    setBlocks([...blocks, newBlock]);
    setShowBlockModal(false);
  };

  const updateBlockContent = (id, content) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleSave = async () => {
    if (!lessonId) return;
    setSaving(true);
    setError(null);
    try {
      const leadBlock = blocks.find((b) => b.type === 'TEXT');
      const codeBlock = blocks.find((b) => b.type === 'CODE');
      const calloutBlocks = blocks.filter((b) => b.type === 'CALLOUT').map((b) => b.content);

      await coursesApi.updateLesson(lessonId, {
        title: lessonTitle.trim(),
        duration: parseInt(duration) || 15,
        content: {
          blocks,
          lead: leadBlock?.content || '',
          codeSnippet: codeBlock?.content || '',
          keyTakeaways: calloutBlocks.length > 0 ? calloutBlocks : undefined,
        },
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err?.message || 'Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/instructor/courses/${params.id}/curriculum`}>
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <Badge variant="primary" className="text-[10px]">Hybrid Lesson Builder</Badge>
              <h1 className="text-2xl font-bold text-slate-900">{lessonTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href={`/instructor/courses/${params.id}/lessons/${params.lessonId}/preview`}>
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                Preview Mode
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={saving} className="text-xs font-semibold flex items-center gap-1.5">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Lesson Draft'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Hybrid lesson blocks saved successfully!
          </div>
        )}

        {/* Lesson Metadata */}
        <Card className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">Lesson Title</label>
            <Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Estimated Duration</label>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
        </Card>

        {/* Blocks Workspace */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Content Blocks Stack</h2>
            <Button onClick={() => setShowBlockModal(true)} variant="outline" className="text-xs font-semibold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              Insert Block
            </Button>
          </div>

          <div className="space-y-4">
            {blocks.map((b, idx) => (
              <Card key={b.id} className="p-5 space-y-3 relative group">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Block {idx + 1}: {b.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBlock(b.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {b.type === 'TEXT' && (
                  <textarea
                    rows={3}
                    value={b.content}
                    onChange={(e) => updateBlockContent(b.id, e.target.value)}
                    className="w-full text-xs text-slate-800 p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  />
                )}

                {b.type === 'CODE' && (
                  <div className="space-y-2">
                    <textarea
                      rows={5}
                      value={b.content}
                      onChange={(e) => updateBlockContent(b.id, e.target.value)}
                      className="w-full font-mono text-xs bg-slate-900 text-emerald-400 p-3 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                    />
                  </div>
                )}

                {b.type === 'CALLOUT' && (
                  <textarea
                    rows={2}
                    value={b.content}
                    onChange={(e) => updateBlockContent(b.id, e.target.value)}
                    className="w-full text-xs font-semibold text-blue-900 bg-blue-50/50 p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  />
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Add Block Modal Overlay (Screen 65) */}
        {showBlockModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-border shadow-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base text-slate-900">Add Content Block</h3>
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => addBlock('TEXT')}
                  className="p-4 rounded-xl border border-border hover:border-primary hover:bg-blue-50/50 flex flex-col items-center gap-2 text-center"
                >
                  <FileText className="w-6 h-6 text-primary" />
                  <span className="font-bold text-slate-800">Rich Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('CODE')}
                  className="p-4 rounded-xl border border-border hover:border-primary hover:bg-blue-50/50 flex flex-col items-center gap-2 text-center"
                >
                  <Code className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold text-slate-800">Code Snippet</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('CALLOUT')}
                  className="p-4 rounded-xl border border-border hover:border-primary hover:bg-blue-50/50 flex flex-col items-center gap-2 text-center"
                >
                  <ListPlus className="w-6 h-6 text-purple-600" />
                  <span className="font-bold text-slate-800">Key Takeaway</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('TEXT')}
                  className="p-4 rounded-xl border border-border hover:border-primary hover:bg-blue-50/50 flex flex-col items-center gap-2 text-center"
                >
                  <Video className="w-6 h-6 text-rose-600" />
                  <span className="font-bold text-slate-800">Video Embed</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

