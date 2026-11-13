// Mock Career Opportunities Data for Skillority Phase UI-3A
// Strictly aligned with Stitch design screens:
// 1. Screen 21: Student Career Opportunities (`/student/careers`)
// 2. Screen 22: Opportunity Details & Application (`/student/careers/[id]`)
// 3. Screen 23: My Applications & Saved Opportunities (`/student/careers/applications`)
//
// Rules: Clearly identified as mock/demonstration fixture data. No automated algorithms or production persistence claimed.

export const mockOpportunities = [
  {
    id: 'opp-1',
    title: 'Junior Frontend Developer Intern',
    company: 'CloudScale Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
    location: 'Remote · San Francisco, CA',
    type: 'Internship',
    workplaceType: 'Remote',
    stipend: '$3,800/mo',
    duration: '3 Months (June – August 2026)',
    deadline: 'May 30, 2026',
    postedAt: '2 days ago',
    featured: true,
    skillsMatchPercentage: 94,
    matchedSkills: ['React.js', 'Next.js App Router', 'Tailwind CSS', 'Git & GitHub'],
    missingSkills: ['Jest / React Testing Library'],
    recommendedTrack: 'Modern Full-Stack Web Development',
    description: 'CloudScale Technologies is seeking an energetic Junior Frontend Developer Intern to join our core cloud platform team. You will build user-facing cloud infrastructure management tools using Next.js and Tailwind CSS while receiving 1:1 mentorship from senior staff engineers.',
    aboutCompany: 'CloudScale is an enterprise developer platform simplifying Kubernetes, multi-cloud networking, and automated infrastructure deployments for over 4,500 engineering teams globally.',
    responsibilities: [
      'Collaborate with product designers to implement pixel-perfect, accessible UI components.',
      'Refactor legacy dashboard views into modern Next.js React Server Components.',
      'Participate in daily engineering standups, sprint reviews, and weekly architecture teardowns.',
      'Write end-to-end user journey tests and contribute to our internal design system repository.'
    ],
    requirements: [
      'Strong foundational knowledge of modern JavaScript (ES6+), HTML5, and CSS3.',
      'Hands-on experience building component-driven interfaces in React or Next.js.',
      'Demonstrated understanding of state management and asynchronous REST API integration.',
      'Enrolled in or graduate of an approved software engineering learning track (e.g., Skillority Full-Stack Track).'
    ],
    mentorshipDetails: {
      mentorName: 'Elena Vasquez',
      mentorTitle: 'Staff Frontend Engineer & Team Lead',
      mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      cadence: 'Weekly 1:1 check-in & continuous PR code reviews'
    },
    isSaved: true
  },
  {
    id: 'opp-2',
    title: 'Web Development Apprentice',
    company: 'Nova Labs Fintech',
    companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=80',
    location: 'Hybrid · New York, NY',
    type: 'Apprenticeship',
    workplaceType: 'Hybrid',
    stipend: '$3,500/mo',
    duration: '6 Months',
    deadline: 'June 15, 2026',
    postedAt: '4 days ago',
    featured: false,
    skillsMatchPercentage: 88,
    matchedSkills: ['Node.js', 'REST APIs', 'React.js'],
    missingSkills: ['PostgreSQL / Prisma', 'Docker Basics'],
    recommendedTrack: 'Modern Full-Stack Web Development',
    description: 'Nova Labs builds algorithmic currency exchange protocols. We are opening an apprenticeship position for self-driven junior developers eager to gain production experience in financial technology.',
    aboutCompany: 'Nova Labs provides real-time cross-border settlements with institutional liquidity and low latency.',
    responsibilities: [
      'Assist backend engineers in optimizing REST and WebSocket client connectors.',
      'Build client transaction ledger dashboards with real-time status updates.',
      'Document API endpoint specifications and integration guides.'
    ],
    requirements: [
      'Familiarity with Node.js runtime and asynchronous execution patterns.',
      'Basic database query knowledge and relational schema understanding.',
      'High attention to security standards and transactional idempotency.'
    ],
    mentorshipDetails: {
      mentorName: 'Marcus Chen',
      mentorTitle: 'Senior Platform Architect',
      mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      cadence: 'Bi-weekly structured technical reviews'
    },
    isSaved: false
  },
  {
    id: 'opp-3',
    title: 'Associate UI/UX & Web Intern',
    company: 'PixelCraft Studio',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    location: 'Remote · Austin, TX',
    type: 'Internship',
    workplaceType: 'Remote',
    stipend: '$3,200/mo',
    duration: '3 Months',
    deadline: 'June 20, 2026',
    postedAt: '1 week ago',
    featured: false,
    skillsMatchPercentage: 81,
    matchedSkills: ['Figma to Code', 'Tailwind CSS', 'Responsive Layouts'],
    missingSkills: ['Figma Variables', 'Motion Design'],
    recommendedTrack: 'Product Design Systems & Figma Architecture',
    description: 'Translate innovative digital design concepts into clean HTML, CSS, and interactive React micro-interactions for high-growth consumer startups.',
    aboutCompany: 'PixelCraft is an award-winning digital design agency crafting memorable digital experiences for technology leaders.',
    responsibilities: [
      'Bridge the gap between design prototypes in Figma and production Tailwind markup.',
      'Audit existing web applications for WCAG AA accessibility compliance.',
      'Build interactive component demos for client presentations.'
    ],
    requirements: [
      'Proficiency with Figma inspection, Auto-Layout, and design token mapping.',
      'Proficiency writing semantic, responsive Tailwind CSS classes.',
      'Passion for craft, micro-interactions, and visual harmony.'
    ],
    mentorshipDetails: {
      mentorName: 'Sarah Lindqvist',
      mentorTitle: 'Creative Director',
      mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      cadence: 'Daily async design syncs and weekly design critiques'
    },
    isSaved: true
  },
  {
    id: 'opp-4',
    title: 'Junior QA & Web Tester',
    company: 'Apex Systems',
    companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80',
    location: 'Hybrid · Seattle, WA',
    type: 'Full-Time Junior',
    workplaceType: 'Hybrid',
    stipend: '$4,200/mo',
    duration: 'Permanent Position',
    deadline: 'July 1, 2026',
    postedAt: '3 days ago',
    featured: false,
    skillsMatchPercentage: 75,
    matchedSkills: ['JavaScript', 'API Testing', 'Git'],
    missingSkills: ['Playwright', 'CI/CD Pipelines'],
    recommendedTrack: 'Modern Full-Stack Web Development',
    description: 'Help ensure reliability across our enterprise fleet of client web applications by executing automated and manual test plans before major releases.',
    aboutCompany: 'Apex Systems develops supply-chain telemetry software deployed across North American logistics hubs.',
    responsibilities: [
      'Execute regression test matrices across web browsers and mobile viewports.',
      'File detailed, reproducible bug reports with network request traces.',
      'Write end-to-end integration tests using Playwright.'
    ],
    requirements: [
      'Solid grasp of HTTP status codes and web browser developer tools.',
      'Detail-oriented investigative mindset.',
      'Basic scripting ability in JavaScript or Python.'
    ],
    mentorshipDetails: {
      mentorName: 'David Kalu',
      mentorTitle: 'QA Engineering Lead',
      mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      cadence: 'Weekly testing sync'
    },
    isSaved: false
  }
];

export const mockStudentApplications = [
  {
    id: 'app-1',
    opportunityId: 'opp-1',
    role: 'Junior Frontend Developer Intern',
    company: 'CloudScale Technologies',
    appliedDate: 'May 10, 2026',
    status: 'Under Review', // Under Review | Interview Scheduled | Offer Received | Rejected
    stage: 'Recruiter Screening',
    matchPercentage: 94,
    notes: 'Submitted resume and completed Skillority React & Next.js track credentials.',
    timeline: [
      { step: 'Application Submitted', date: 'May 10, 2026', completed: true },
      { step: 'Resume & Profile Screened', date: 'May 12, 2026', completed: true },
      { step: 'Technical Interview', date: 'Pending scheduling', completed: false },
      { step: 'Final Decision', date: 'Expected by May 25', completed: false }
    ]
  },
  {
    id: 'app-2',
    opportunityId: 'opp-2',
    role: 'Web Development Apprentice',
    company: 'Nova Labs Fintech',
    appliedDate: 'May 05, 2026',
    status: 'Interview Scheduled',
    stage: 'Technical Pair Programming',
    matchPercentage: 88,
    notes: 'Technical session scheduled for Thursday May 18 at 2:00 PM EST.',
    timeline: [
      { step: 'Application Submitted', date: 'May 05, 2026', completed: true },
      { step: 'Initial Call with Recruiter', date: 'May 08, 2026', completed: true },
      { step: 'Technical Pair Programming', date: 'May 18, 2026 (Scheduled)', completed: false, current: true },
      { step: 'Final Decision', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'app-3',
    opportunityId: 'opp-4',
    role: 'Junior QA & Web Tester',
    company: 'Apex Systems',
    appliedDate: 'April 28, 2026',
    status: 'Under Review',
    stage: 'Application Received',
    matchPercentage: 75,
    notes: 'Review in progress by engineering hiring manager.',
    timeline: [
      { step: 'Application Submitted', date: 'April 28, 2026', completed: true },
      { step: 'Hiring Team Review', date: 'In progress', completed: false, current: true },
      { step: 'Interview Call', date: 'Pending', completed: false }
    ]
  }
];

export const mockCareerHubStats = {
  activeApplicationsCount: 3,
  savedOpportunitiesCount: 2,
  interviewInvitesCount: 1,
  profileViewsThisWeek: 28,
  topMatchingSkill: 'React.js & Next.js'
};

