// Mock Community Data for Skillority Phase UI-3B
// Strictly mapped from Google Stitch Screens:
// - Screen 24: Community Feed (`/student/community` - Stitch ID `596c2d5d16204f83ae42479b36b5b1e4`)
// - Screen 25: Create Community Post (`/student/community/create` - Stitch ID `52e654bfcc5b4ff5bd3d017cf04108eb`)
//
// Rules: Clearly identified prototype/demo data. React state manages local likes, saves, comments, and posts.

export const mockCommunityCategories = [
  { id: 'all', label: 'All Discussions', icon: 'MessagesSquare' },
  { id: 'questions', label: 'Questions & Help', icon: 'HelpCircle' },
  { id: 'showcase', label: 'Project Showcases', icon: 'Sparkles' },
  { id: 'study_groups', label: 'Study Groups', icon: 'Users' },
  { id: 'career_advice', label: 'Career Advice', icon: 'Briefcase' }
];

export const mockCommunityPosts = [
  {
    id: 'post-1',
    category: 'showcase',
    categoryLabel: 'Project Showcase',
    author: {
      name: 'Jordan Lee',
      role: 'Junior Web Developer Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Verified Learner'
    },
    timestamp: '2 hours ago',
    title: 'Built a responsive dashboard layout using Next.js App Router and Tailwind grid',
    content: 'Just wrapped up the Chapter 3 challenge! Focused heavily on component modularity and zero layout shifts during async data loading. Would love feedback on the flexbox alignment in the responsive navigation drawer.',
    codeSnippet: {
      fileName: 'components/HeaderNavigation.jsx',
      code: `export function ResponsiveHeader({ isOpen, toggleMenu }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Logo className="w-6 h-6 text-primary" />
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/student/dashboard">Overview</Link>
        </nav>
      </div>
    </header>
  );
}`
    },
    imageAttachment: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    likesCount: 24,
    commentsCount: 8,
    isLiked: false,
    isSaved: true,
    comments: [
      {
        id: 'c1',
        author: 'Dr. Elena Rostova',
        role: 'Course Instructor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        content: 'Clean usage of sticky position and backdrop-blur! Make sure to test WCAG focus rings when tabbing via keyboard.',
        timestamp: '1 hour ago'
      }
    ]
  },
  {
    id: 'post-2',
    category: 'questions',
    categoryLabel: 'Questions & Help',
    author: {
      name: 'Samira Khan',
      role: 'Data Analytics Track',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: 'Chapter 2 Scholar'
    },
    timestamp: '4 hours ago',
    title: 'How do you optimize SQL window functions for cumulative running totals on massive partitions?',
    content: 'I am practicing window functions in Chapter 4 of the Enterprise Data track. When computing running totals using SUM() OVER (PARTITION BY client_id ORDER BY transaction_date), what indexing strategy prevents full partition table scans?',
    codeSnippet: {
      fileName: 'queries/running_totals.sql',
      code: `SELECT 
  client_id,
  transaction_date,
  amount,
  SUM(amount) OVER (
    PARTITION BY client_id 
    ORDER BY transaction_date
  ) as cumulative_total
FROM client_transactions;`
    },
    likesCount: 15,
    commentsCount: 5,
    isLiked: true,
    isSaved: false,
    comments: []
  },
  {
    id: 'post-3',
    category: 'study_groups',
    categoryLabel: 'Study Group',
    author: {
      name: 'Carlos Mendez',
      role: 'UI/UX Track',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badge: 'Active Peer'
    },
    timestamp: 'Yesterday',
    title: 'Weekend Peer Review Circle: Design Systems & WCAG Contrast Lab',
    content: 'We are hosting a Saturday study session at 2:00 PM EST in the student chat lounge. We will review each other’s Figma color variable modes and check accessibility contrast across dark/light surfaces. Comment below if you want to join!',
    milestoneBadge: 'Design Systems Architecture Certified',
    likesCount: 38,
    commentsCount: 14,
    isLiked: false,
    isSaved: false,
    comments: []
  },
  {
    id: 'post-4',
    category: 'career_advice',
    categoryLabel: 'Career Advice',
    author: {
      name: 'Maya Patel',
      role: 'Full-Stack Graduate · Junior Engineer at Velo',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      badge: 'Skillority Alumni'
    },
    timestamp: '2 days ago',
    title: '3 things that actually stood out during my technical internship interview',
    content: '1. Explaining the difference between Client and Server Components without buzzwords.\n2. Having verified code snippets on my profile from course chapter projects.\n3. Asking the interviewer how their engineering team tests database migrations.',
    likesCount: 89,
    commentsCount: 22,
    isLiked: false,
    isSaved: true,
    comments: []
  }
];

export const mockTrendingTopics = [
  { tag: '#NextJSAppRouter', count: '142 posts' },
  { tag: '#SQLWindowFunctions', count: '98 posts' },
  { tag: '#WCAGAccessibility', count: '76 posts' },
  { tag: '#PrismaMongoDB', count: '64 posts' },
  { tag: '#FigmaVariables', count: '51 posts' }
];

export const mockActivePeers = [
  { name: 'Chloe Dubois', role: 'Full-Stack Track', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', online: true },
  { name: 'Devon Vance', role: 'Data Analytics', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', online: true },
  { name: 'Aaliyah Reed', role: 'UI/UX Design', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80', online: false },
  { name: 'Kai Tanaka', role: 'Python AI Track', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', online: true }
];

export const mockCommunityGuidelines = [
  'Be respectful, welcoming, and inclusive to peers of all learning levels.',
  'Share reproducible code snippets and clear questions when asking for debugging help.',
  'Never share direct exam or assessment answers; explain concepts instead.'
];

