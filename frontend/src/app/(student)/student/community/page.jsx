'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  mockCommunityCategories,
  mockCommunityPosts,
  mockTrendingTopics,
  mockActivePeers,
  mockCommunityGuidelines
} from '@/lib/mockCommunityData';
import {
  MessagesSquare,
  HelpCircle,
  Sparkles,
  Users,
  Briefcase,
  Search,
  PenSquare,
  Heart,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  Share2,
  Code,
  Image as ImageIcon,
  Award,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Radio,
  Clock,
  Send,
  CheckCircle2,
  Filter
} from 'lucide-react';

const categoryIcons = {
  all: MessagesSquare,
  questions: HelpCircle,
  showcase: Sparkles,
  study_groups: Users,
  career_advice: Briefcase,
};

export default function CommunityFeedPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState(mockCommunityPosts);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [shareToast, setShareToast] = useState(false);

  // Like interaction
  const handleLike = (postId) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1
          };
        }
        return post;
      })
    );
  };

  // Save interaction
  const handleSave = (postId) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  // Comment submission
  const handleAddComment = (postId) => {
    if (!newCommentText.trim()) return;
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: 'c-' + Date.now(),
            author: 'Alex Rivera',
            role: 'Student (You)',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            content: newCommentText.trim(),
            timestamp: 'Just now'
          };
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...(post.comments || []), newComment]
          };
        }
        return post;
      })
    );
    setNewCommentText('');
  };

  const handleShare = (postTitle) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  // Filtered posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Share Feedback Toast */}
        {shareToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Link copied to clipboard!</span>
          </div>
        )}

        {/* Section A: Page Header */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs">
                Student Network
              </Badge>
              <span className="text-xs text-slate-400">Collaborative Learning Space</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Community Feed
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect with fellow students, share completed chapter milestones, ask technical questions, and participate in peer code reviews.
            </p>
          </div>

          <div>
            <Link href="/student/community/create">
              <Button variant="primary" size="md" className="whitespace-nowrap shadow-xs">
                <PenSquare className="w-4 h-4 mr-2" /> Create Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Section B: Quick Post Composer Bar */}
        <Card className="p-4 sm:p-5 flex items-center gap-3.5 bg-white border-border shadow-xs">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="Alex Rivera"
              fill
              sizes="40px"
              className="object-cover"
              unoptimized
            />
          </div>
          <Link
            href="/student/community/create"
            className="flex-1 bg-slate-50 hover:bg-slate-100/80 border border-border rounded-xl px-4 py-2.5 text-xs text-slate-500 transition-colors flex items-center justify-between"
          >
            <span>Share what you are learning, ask a question, or showcase your project...</span>
            <PenSquare className="w-4 h-4 text-slate-400" />
          </Link>
        </Card>

        {/* Section C & D: Community Navigation & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {mockCommunityCategories.map(cat => {
              const Icon = categoryIcons[cat.id] || MessagesSquare;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white border border-border text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search discussions by topic, keyword, or author..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* 2-Column Layout: Main Feed (Col 2) + Sidebar (Col 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-5">
            {filteredPosts.length === 0 ? (
              <Card className="p-12 text-center space-y-3 bg-white border-border">
                <MessagesSquare className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No discussions found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No posts matched "${searchQuery}". Try a different keyword or reset filters.`
                    : 'Be the first to start a conversation in this topic!'}
                </p>
                <div className="pt-2">
                  <Link href="/student/community/create">
                    <Button variant="primary" size="sm">
                      <PenSquare className="w-3.5 h-3.5 mr-1.5" /> Create New Post
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              filteredPosts.map(post => (
                <Card key={post.id} className="p-6 space-y-4 bg-white border-border shadow-xs hover:border-blue-200 transition-all">
                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{post.author.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {post.author.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {post.author.role} · <span className="text-slate-400">{post.timestamp}</span>
                        </p>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-[11px] text-slate-600">
                      {post.categoryLabel}
                    </Badge>
                  </div>

                  {/* Post Title & Text */}
                  <div className="space-y-2">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Code Snippet Attachment (if present) */}
                  {post.codeSnippet && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Code className="w-3.5 h-3.5 text-primary" /> {post.codeSnippet.fileName}
                        </span>
                        <span>JavaScript / JSX</span>
                      </div>
                      <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                        <code>{post.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Image Attachment (if present) */}
                  {post.imageAttachment && (
                    <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-200 mt-2 bg-slate-100">
                      <Image
                        src={post.imageAttachment}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Milestone Badge (if present) */}
                  {post.milestoneBadge && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Milestone Achievement: <strong>{post.milestoneBadge}</strong></span>
                    </div>
                  )}

                  {/* Post Interactions Bar */}
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 font-medium transition-colors ${
                          post.isLiked ? 'text-rose-600' : 'hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600' : ''}`} />
                        <span>{post.likesCount}</span>
                      </button>

                      {/* Comment Toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveCommentPostId(
                            activeCommentPostId === post.id ? null : post.id
                          )
                        }
                        className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentsCount} Comments</span>
                      </button>

                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={() => handleShare(post.title)}
                        className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>

                    {/* Bookmark Save */}
                    <button
                      type="button"
                      onClick={() => handleSave(post.id)}
                      className={`p-1.5 rounded-md hover:bg-slate-50 transition-colors ${
                        post.isSaved ? 'text-primary' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {post.isSaved ? <BookmarkCheck className="w-4 h-4 fill-primary" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expandable Comments Section */}
                  {activeCommentPostId === post.id && (
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newCommentText}
                          onChange={e => setNewCommentText(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Write a constructive reply..."
                          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newCommentText.trim()}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {/* Existing Comments List */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {post.comments.map(c => (
                            <div key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900">{c.author}</span>
                                  <span className="text-slate-400">· {c.role}</span>
                                </div>
                                <span className="text-slate-400">{c.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-700">{c.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* Section F: Community Sidebar */}
          <div className="space-y-6">
            {/* 1. Community Guidelines */}
            <Card className="p-5 space-y-3 bg-white border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Community Guidelines
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                {mockCommunityGuidelines.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 2. Trending Topics */}
            <Card className="p-5 space-y-3 bg-white border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Trending Topics
              </h3>
              <div className="space-y-2">
                {mockTrendingTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchQuery(topic.tag.replace('#', ''))}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs transition-colors text-left"
                  >
                    <span className="font-semibold text-primary">{topic.tag}</span>
                    <span className="text-slate-400">{topic.count}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* 3. Active Study Peers */}
            <Card className="p-5 space-y-3 bg-white border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Active Study Peers
              </h3>
              <div className="space-y-2.5">
                {mockActivePeers.map((peer, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-200 shrink-0">
                        <Image
                          src={peer.avatar}
                          alt={peer.name}
                          fill
                          sizes="28px"
                          className="object-cover"
                          unoptimized
                        />
                        {peer.online && (
                          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 leading-none">{peer.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{peer.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 4. Live Study Rooms (Coming Soon Placeholder) */}
            <Card className="p-5 space-y-3 bg-slate-50 border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-600" /> Live Study Rooms
                </h3>
                <Badge variant="outline" className="text-[10px] bg-slate-200/80 text-slate-700">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live audio & video collaborative study lounges are currently in pilot review. Connect with peers asynchronously via community discussions.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

