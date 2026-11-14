'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  ArrowLeft,
  PenSquare,
  Sparkles,
  HelpCircle,
  Users,
  Briefcase,
  MessagesSquare,
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Link2,
  Quote,
  Image as ImageIcon,
  Award,
  Globe,
  Lock,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const POST_TYPES = [
  { id: 'all', label: 'General Discussion', icon: MessagesSquare, desc: 'Share insights, study habits, or start an open dialogue.' },
  { id: 'questions', label: 'Course Questions & Help', icon: HelpCircle, desc: 'Ask about challenging concepts, bugs, or exercise logic.' },
  { id: 'showcase', label: 'Project Showcase', icon: Sparkles, desc: 'Share your deployed app, Figma prototype, or GitHub repository.' },
  { id: 'study_groups', label: 'Study Group Meetup', icon: Users, desc: 'Organize study sessions or coordinate peer code reviews.' },
  { id: 'career_advice', label: 'Career & Portfolio Advice', icon: Briefcase, desc: 'Discuss technical resumes, interviews, or hiring tips.' }
];

export default function CreateCommunityPostPage() {
  const router = useRouter();

  // Form states
  const [selectedType, setSelectedType] = useState('all');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [snippetFilename, setSnippetFilename] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [milestoneAttached, setMilestoneAttached] = useState(false);
  const [audience, setAudience] = useState('public'); // 'public' | 'track_only'

  // Validation & UI states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftToast, setDraftToast] = useState(false);

  const titleMaxLength = 120;

  // Formatting actions (prototype simulation)
  const handleFormatText = (prefix, suffix = '') => {
    setContent(prev => `${prev}\n${prefix}Formatted text${suffix}\n`);
  };

  // Mock Attachment Handling
  const handleSimulateAttachment = () => {
    setAttachmentPreview('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80');
  };

  const handleSaveDraft = () => {
    setDraftToast(true);
    setTimeout(() => setDraftToast(false), 2500);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Post title is required';
    } else if (title.length > titleMaxLength) {
      newErrors.title = `Title exceeds ${titleMaxLength} characters limit`;
    }

    if (!content.trim()) {
      newErrors.content = 'Post content description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/student/community');
    }, 400);
  };

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Draft Notification Toast */}
        {draftToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Post draft saved locally in browser!</span>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/student/community" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Community Feed
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">Create a Post</span>
        </div>

        {/* Page Header (Stitch Screen 25 reference) */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create a Community Post
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Share something you learned, ask for feedback on code exercises, or start a supportive discussion with your learning peers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2.5 py-1 rounded-md">
              Draft Mode
            </span>
          </div>
        </div>

        {/* Post Creation Form Container */}
        <form onSubmit={handlePublish} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6 bg-white border-border shadow-xs">
            {/* Step 1: Post Type / Category Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                1. Select Discussion Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {POST_TYPES.map(type => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-blue-50/70 text-primary ring-1 ring-primary'
                          : 'border-border bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs mb-1">
                        <Icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{type.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Post Title with Live Character Counter */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label htmlFor="post-title" className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Post Title <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[11px] font-mono ${title.length > titleMaxLength ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                  {title.length}/{titleMaxLength}
                </span>
              </div>
              <input
                id="post-title"
                type="text"
                value={title}
                maxLength={titleMaxLength}
                onChange={e => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
                placeholder="e.g. My experience building responsive flexbox navigation without negative margin hacks"
                className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-border'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                </p>
              )}
            </div>

            {/* Step 3: Content Editor & Formatting Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label htmlFor="post-content" className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                3. Discussion Content <span className="text-rose-500">*</span>
              </label>

              {/* Toolbar Controls (Stitch design reference) */}
              <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-50 border border-border rounded-lg text-slate-600 text-xs">
                <button
                  type="button"
                  onClick={() => handleFormatText('**', '**')}
                  className="p-1.5 rounded hover:bg-slate-200/70 hover:text-slate-900"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText('*', '*')}
                  className="p-1.5 rounded hover:bg-slate-200/70 hover:text-slate-900"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowCodeEditor(!showCodeEditor)}
                  className={`p-1.5 rounded transition-colors ${
                    showCodeEditor ? 'bg-primary text-white' : 'hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                  title="Toggle Code Snippet Block"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText('- ')}
                  className="p-1.5 rounded hover:bg-slate-200/70 hover:text-slate-900"
                  title="Bullet List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText('1. ')}
                  className="p-1.5 rounded hover:bg-slate-200/70 hover:text-slate-900"
                  title="Numbered List"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatText('> ')}
                  className="p-1.5 rounded hover:bg-slate-200/70 hover:text-slate-900"
                  title="Blockquote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Textarea */}
              <textarea
                id="post-content"
                rows={6}
                value={content}
                onChange={e => {
                  setContent(e.target.value);
                  if (errors.content) setErrors({ ...errors, content: null });
                }}
                placeholder="Share what you've learned, paste an example, or explain where you're feeling stuck. Supportive community members and course instructors review posts daily..."
                className={`w-full p-3.5 text-xs bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y ${
                  errors.content ? 'border-rose-400 bg-rose-50/30' : 'border-border'
                }`}
              />
              {errors.content && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.content}
                </p>
              )}

              {/* Optional Code Snippet Drawer */}
              {showCodeEditor && (
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                      <Code className="w-4 h-4 text-primary" /> Code Snippet Block
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCodeEditor(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={snippetFilename}
                    onChange={e => setSnippetFilename(e.target.value)}
                    placeholder="Filename or component name (e.g., ResponsiveNavbar.jsx)"
                    className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-primary"
                  />
                  <textarea
                    rows={4}
                    value={codeSnippet}
                    onChange={e => setCodeSnippet(e.target.value)}
                    placeholder="// Paste your clean code snippet here..."
                    className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              )}
            </div>

            {/* Step 4: Attachments (Image & Milestone Badge) */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                4. Optional Attachments
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleSimulateAttachment}
                  className="text-xs text-slate-700"
                >
                  <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  {attachmentPreview ? 'Change Screenshot' : 'Attach Screenshot'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setMilestoneAttached(!milestoneAttached)}
                  className={`text-xs ${milestoneAttached ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'text-slate-700'}`}
                >
                  <Award className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  {milestoneAttached ? 'Milestone Attached ✓' : 'Attach Course Credential'}
                </Button>
              </div>

              {/* Attachment Previews */}
              {attachmentPreview && (
                <div className="relative w-full max-w-sm h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
                  <Image
                    src={attachmentPreview}
                    alt="Attachment preview"
                    fill
                    sizes="384px"
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => setAttachmentPreview(null)}
                    className="absolute top-2 right-2 p-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {milestoneAttached && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between max-w-md text-xs text-emerald-950 font-medium">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Verified Full-Stack Web Engineering Milestone</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMilestoneAttached(false)}
                    className="text-emerald-700 hover:text-emerald-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Step 5: Audience Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                5. Audience Visibility
              </label>
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="radio"
                    name="audience"
                    value="public"
                    checked={audience === 'public'}
                    onChange={() => setAudience('public')}
                    className="text-primary focus:ring-primary"
                  />
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>All Platform Learners</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="radio"
                    name="audience"
                    value="track_only"
                    checked={audience === 'track_only'}
                    onChange={() => setAudience('track_only')}
                    className="text-primary focus:ring-primary"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Enrolled Course Track Only</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                type="button"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto text-xs"
              >
                Save Draft (Local)
              </Button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link href="/student/community" className="w-full sm:w-auto">
                  <Button variant="secondary" size="md" type="button" className="w-full text-xs">
                    Cancel
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto text-xs shadow-xs"
                >
                  <PenSquare className="w-3.5 h-3.5 mr-1.5" />
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </DashboardShell>
  );
}

