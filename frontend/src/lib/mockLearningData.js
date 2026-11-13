// Mock Learning Data for Skillority Phase UI-2 (Demonstration & Prototype Fixture)
// Architecturally Approved Rules:
// 1. Course -> Chapters (Chapters 0-5 are free, Chapter 6+ unlocked with coins) -> Lessons -> Chapter Quiz
// 2. Final Assessment is held at the course level for final assessment certification.
// 3. Course completion certificate and Final Assessment certificate remain separate.
// 4. Chapter unlock prices (e.g., 250 Coins) and passing thresholds (e.g., 75% or 80%) are configurable demonstration data values.
// 5. Quiz completion rewards: configured per-quiz in mock data for UI testing.


export const mockCourses = [
  {
    id: 'course-1',
    slug: 'fullstack-modern-web',
    title: 'Modern Full-Stack Web Development',
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: '48 hours',
    rating: 4.9,
    reviewsCount: 1240,
    enrolledCount: 3820,
    badge: 'Popular',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    description: 'Master contemporary web engineering with React, Next.js, Node.js, and modern distributed database architectures. Build production-grade SaaS products with end-to-end best practices.',
    instructor: {
      name: 'Dr. Sarah Jenkins',
      title: 'Principal Engineer & Google Developer Expert',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Former Staff Engineer at Stripe with 14+ years of distributed systems and frontend architecture experience.',
      coursesCount: 6,
      studentsCount: 28400,
    },
    learningObjectives: [
      'Architect robust web applications using Next.js App Router and Server Components.',
      'Design type-safe API boundaries and RESTful backend architectures with Express.',
      'Model efficient relational and document databases with Prisma ORM.',
      'Implement enterprise-grade JWT session authentication and role-based access control.',
      'Deploy, monitor, and scale production applications with high availability.',
    ],
    prerequisites: ['HTML, CSS & JavaScript fundamentals', 'Basic Git workflow familiarity'],
    totalChapters: 8,
    completedChapters: 2,
    progressPercentage: 28,
    isEnrolled: true,
    certificateEligible: false,
    chapters: [
      {
        id: 'chap-0',
        chapterNumber: 0,
        title: 'Course Orientation & Environment Setup',
        description: 'Understand the course roadmap, configure your developer tooling, and align on core architectural principles.',
        duration: '1.5 hrs',
        isFree: true,
        isUnlocked: true,
        completed: true,
        coinsCost: 0,
        quizPassed: true,
        lessons: [
          {
            id: 'les-0-1',
            title: 'Welcome to Skillority Full-Stack Engineering',
            duration: '10 min',
            type: 'video',
            completed: true,
            summary: 'Course overview, mindset, and what separates junior developers from senior system designers.',
            content: {
              lead: 'Welcome to your deep dive into modern software engineering. Throughout this program, you will transition from writing isolated scripts to architecting resilient, production-ready web platforms.',
              keyTakeaways: [
                'Understand client-server boundaries and separation of concerns',
                'Emphasize security, idempotency, and clean domain boundaries',
                'Adopt test-driven mindset and modular component design'
              ],
              codeSnippet: `// Welcome Script: verify your runtime environment
console.log('Welcome to Skillority! Environment is ready.');
const studentProfile = {
  name: 'Alex Rivera',
  track: 'Full-Stack Engineering',
  status: 'Ready to build'
};
console.table(studentProfile);`,
            }
          },
          {
            id: 'les-0-2',
            title: 'Workstation Setup: Node.js, pnpm & Git',
            duration: '25 min',
            type: 'article',
            completed: true,
            summary: 'Installing strict runtime versions and establishing consistent monorepo developer tooling.',
            content: {
              lead: 'A solid development environment prevents subtle bugs and deployment failures.',
              keyTakeaways: [
                'Use Node.js 20+ LTS with native ES modules support',
                'Leverage pnpm workspaces for fast, disk-efficient dependency deduplication',
                'Configure Git hooks for automated linting and formatting'
              ],
              codeSnippet: `pnpm --version
node --version
git --version`,
            }
          }
        ],
        quiz: {
          id: 'quiz-0',
          title: 'Chapter 0 Knowledge Check',
          passingScore: 80,
          rewardCoins: 50,
          questions: [
            {
              id: 'q1',
              type: 'single',
              prompt: 'Which package manager is strictly mandated for this monorepo project?',
              options: ['npm', 'yarn', 'pnpm', 'bun'],
              correctAnswer: 'pnpm',
              explanation: 'pnpm uses hard links and symlinks to provide strict dependency isolation and fast installation speeds.'
            },
            {
              id: 'q2',
              type: 'multiple',
              prompt: 'Select all foundational requirements for production-grade Node.js environments:',
              options: [
                'Node.js LTS runtime',
                'Global variable pollution across modules',
                'Strict package management via lockfiles',
                'Environment variable separation (.env)'
              ],
              correctAnswer: ['Node.js LTS runtime', 'Strict package management via lockfiles', 'Environment variable separation (.env)'],
              explanation: 'Never pollute global scope; always enforce reproducible lockfiles and secure environment secrets.'
            }
          ]
        }
      },
      {
        id: 'chap-1',
        chapterNumber: 1,
        title: 'Modern JavaScript & Node.js Deep Dive',
        description: 'Explore the JavaScript event loop, asynchronous execution patterns, and Node.js process internals.',
        duration: '4.5 hrs',
        isFree: true,
        isUnlocked: true,
        completed: true,
        coinsCost: 0,
        quizPassed: true,
        lessons: [
          {
            id: 'les-1-1',
            title: 'Event Loop, Microtasks & Macrotasks',
            duration: '25 min',
            type: 'video',
            completed: true,
            summary: 'Deconstruct how V8 schedules execution: call stack, microtask queue, and libuv thread pool.',
            content: {
              lead: 'Node.js is single-threaded in its JavaScript execution thread, but relies on libuv for multi-threaded background asynchronous I/O operations.',
              keyTakeaways: [
                'Promise callbacks and process.nextTick execute in the microtask queue',
                'Timers and I/O callbacks run in subsequent macrotask phases',
                'Never block the CPU loop with heavy synchronous computations'
              ],
              codeSnippet: `console.log('1: Sync script start');

setTimeout(() => {
  console.log('4: Macrotask setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask promise resolved');
});

console.log('2: Sync script end');
// Execution order: 1 -> 2 -> 3 -> 4`,
            }
          },
          {
            id: 'les-1-2',
            title: 'Robust Error Handling & Async/Await Patterns',
            duration: '35 min',
            type: 'code',
            completed: true,
            summary: 'Building centralized error boundaries and fail-safe async handlers in Node.js applications.',
            content: {
              lead: 'Unhandled promise rejections can crash server instances or cause memory leaks.',
              keyTakeaways: [
                'Wrap async controller handlers with higher-order error wrappers',
                'Distinguish operational errors (4xx) from programmer bugs (500)',
                'Always sanitize error stacks before returning responses to clients'
              ],
              codeSnippet: `export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};`,
            }
          }
        ],
        quiz: {
          id: 'quiz-1',
          title: 'Chapter 1 Knowledge Check',
          passingScore: 80,
          rewardCoins: 50,
          questions: [
            {
              id: 'q1',
              type: 'single',
              prompt: 'Which queue has priority when the call stack clears in Node.js?',
              options: ['Macrotask queue (setTimeout)', 'Microtask queue (Promises / process.nextTick)', 'I/O poll queue', 'Check phase (setImmediate)'],
              correctAnswer: 'Microtask queue (Promises / process.nextTick)',
              explanation: 'Microtasks are drained completely after the currently running script and before progressing to the next event loop phase.'
            }
          ]
        }
      },
      {
        id: 'chap-2',
        chapterNumber: 2,
        title: 'React Fundamentals & Component Architecture',
        description: 'Component lifecycles, unidirectional data flow, custom hooks, and memoization patterns.',
        duration: '5 hrs',
        isFree: true,
        isUnlocked: true,
        completed: false,
        coinsCost: 0,
        quizPassed: false,
        lessons: [
          {
            id: 'les-2-1',
            title: 'Thinking in React: Atomic Design & State Lifting',
            duration: '30 min',
            type: 'video',
            completed: false,
            summary: 'Structuring maintainable UI components from primitive design tokens to feature organisms.',
            content: {
              lead: 'Great frontend architecture starts with clean boundaries between presentational and container components.',
              keyTakeaways: [
                'Keep atoms and molecules purely functional and styling-consistent',
                'Colocate state close to the components that need it',
                'Avoid premature context abstraction for shallow trees'
              ],
              codeSnippet: `export function CourseProgressBadge({ progress }) {
  const isComplete = progress >= 100;
  return (
    <span className={isComplete ? "text-emerald-700 bg-emerald-50" : "text-blue-700 bg-blue-50"}>
      {isComplete ? "Completed" : \`\${progress}% in progress\`}
    </span>
  );
}`,
            }
          },
          {
            id: 'les-2-2',
            title: 'Custom Hooks for Business Logic Separation',
            duration: '40 min',
            type: 'code',
            completed: false,
            summary: 'Extracting data fetching, local storage synchronization, and form handling into testable hooks.',
            content: {
              lead: 'Custom hooks allow you to package reactive business logic cleanly away from rendering markup.',
              keyTakeaways: [
                'Follow the rules of hooks: only call at top level',
                'Return stable references using useCallback when exposing mutating handlers',
                'Leverage AbortController to cancel stale network requests'
              ],
              codeSnippet: `import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}`,
            }
          }
        ],
        quiz: {
          id: 'quiz-2',
          title: 'Chapter 2 Knowledge Check',
          passingScore: 80,
          rewardCoins: 50,
          questions: [
            {
              id: 'q1',
              type: 'single',
              prompt: 'What happens when state is lifted up to a shared parent component?',
              options: [
                'Both sibling components can access and respond to the shared state changes',
                'React re-mounts the entire DOM from root',
                'State becomes immutable across the session',
                'Components bypass virtual DOM reconciler'
              ],
              correctAnswer: 'Both sibling components can access and respond to the shared state changes',
              explanation: 'Lifting state allows multiple child components to share a single source of truth passed down via props.'
            }
          ]
        }
      },
      {
        id: 'chap-3',
        chapterNumber: 3,
        title: 'Next.js App Router & Server Components',
        description: 'Server vs Client components, routing conventions, layout nesting, and streaming SSR.',
        duration: '6 hrs',
        isFree: true,
        isUnlocked: true,
        completed: false,
        coinsCost: 0,
        quizPassed: false,
        lessons: [
          {
            id: 'les-3-1',
            title: 'Server Components vs Client Components Demystified',
            duration: '35 min',
            type: 'article',
            completed: false,
            summary: 'Understanding zero-bundle-size server execution and when to declare "use client".',
            content: {
              lead: 'React Server Components execute strictly on the server and never ship their dependencies to the browser bundle.',
              keyTakeaways: [
                'Default to Server Components for data fetching and static markup',
                'Add "use client" only when needing useState, useEffect, or DOM event handlers',
                'Pass server components as children to client wrapper components to preserve zero-bundle benefits'
              ],
              codeSnippet: `// Server Component by default
export default async function CourseCatalogPage() {
  const courses = await fetchCoursesFromDatabase();
  return <CourseCatalogList initialData={courses} />;
}`,
            }
          }
        ],
        quiz: {
          id: 'quiz-3',
          title: 'Chapter 3 Knowledge Check',
          passingScore: 80,
          rewardCoins: 50,
          questions: [
            {
              id: 'q1',
              type: 'single',
              prompt: 'Which directive instructs Next.js that a file is a Client Component?',
              options: ['"use client"', '"client only"', '"directive: client"', '"use browser"'],
              correctAnswer: '"use client"',
              explanation: 'Next.js App Router uses the "use client" directive at the top of a file to declare the boundary.'
            }
          ]
        }
      },
      {
        id: 'chap-4',
        chapterNumber: 4,
        title: 'RESTful Backend Design with Express & Node.js',
        description: 'Designing resilient REST APIs, middleware chains, input validation, and rate limiting.',
        duration: '5 hrs',
        isFree: true,
        isUnlocked: true,
        completed: false,
        coinsCost: 0,
        quizPassed: false,
        lessons: [
          {
            id: 'les-4-1',
            title: 'Clean Architecture: Controllers, Services & Repositories',
            duration: '45 min',
            type: 'code',
            completed: false,
            summary: 'Structuring modular Express applications that scale gracefully as features expand.',
            content: {
              lead: 'Decouple routing definitions from business logic and database access layers.',
              keyTakeaways: [
                'Routes define HTTP paths and attach validation middleware',
                'Controllers parse request payloads and format JSON responses',
                'Services execute core domain rules and coordinate database calls'
              ],
              codeSnippet: `router.post('/courses', authenticateUser, validate(createCourseSchema), courseController.create);`,
            }
          }
        ],
        quiz: {
          id: 'quiz-4',
          title: 'Chapter 4 Knowledge Check',
          passingScore: 80,
          rewardCoins: 50,
          questions: [
            {
              id: 'q1',
              type: 'single',
              prompt: 'Where should database queries be initiated in clean architecture?',
              options: ['Inside the router declaration', 'In the view template', 'Within the service or repository layer', 'Directly in the client browser'],
              correctAnswer: 'Within the service or repository layer',
              explanation: 'Keeping data access inside services/repositories prevents controllers from tightly coupling to database drivers.'
            }
          ]
        }
      },
      {
        id: 'chap-5',
        chapterNumber: 5,
        title: 'Database Modeling with Prisma ORM & MongoDB',
        description: 'Schema modeling, ObjectId relations, indexes, and transactional data integrity.',
        duration: '5.5 hrs',
        isFree: true,
        isUnlocked: true,
        completed: false,
        coinsCost: 0,
        quizPassed: false,
        lessons: [
          {
            id: 'les-5-1',
            title: 'Prisma Schema Modeling for Document Databases',
            duration: '40 min',
            type: 'video',
            completed: false,
            summary: 'Managing MongoDB collections with declarative Prisma schema definitions.',
            content: {
              lead: 'Prisma provides compile-time query safety while working with MongoDB flexible document storage.',
              keyTakeaways: [
                'Always annotate IDs with @id @default(auto()) @map("_id") @db.ObjectId',
                'Use scalar list arrays and embedded types where document nesting is optimal',
                'Add compound indexes for frequent query filter combinations'
              ],
              codeSnippet: `model Chapter {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  courseId  String   @db.ObjectId
  order     Int
  title     String
  isFree    Boolean  @default(true)
  coinsCost Int      @default(0)
}`,
            }
          }
        ],
        quiz: {
          id: 'quiz-5',
          title: 'Chapter 5 Knowledge Check',
          passingScore: 80,
          rewardCoins: 50,
          questions: [
            {
              id: 'q1',
              type: 'single',
              prompt: 'What attribute maps a Prisma field to MongoDB native ObjectID in Prisma schema?',
              options: ['@id @map("_id") @db.ObjectId', '@primary_key', '@objectIdAuto', '@foreignKey'],
              correctAnswer: '@id @map("_id") @db.ObjectId',
              explanation: 'Prisma uses @map("_id") and the @db.ObjectId native type attribute for MongoDB ObjectId mapping.'
            }
          ]
        }
      },
      {
        id: 'chap-6',
        chapterNumber: 6,
        title: 'Advanced Authentication, Tokens & RBAC Security',
        description: 'JWT tokens, refresh rotation, CSRF protection, and multi-tenant authorization.',
        duration: '6 hrs',
        isFree: false,
        isUnlocked: false,
        completed: false,
        coinsCost: 250,
        quizPassed: false,
        lessons: [
          {
            id: 'les-6-1',
            title: 'Stateless JWTs & Secure Refresh Token Rotation',
            duration: '45 min',
            type: 'code',
            completed: false,
            summary: 'Defending against token replay attacks and token theft in production SaaS platforms.',
            content: {
              lead: 'Short-lived access tokens paired with family-tracked rotating refresh tokens deliver maximum security.',
              keyTakeaways: [
                'Keep access token lifetime short (15 minutes)',
                'Store refresh tokens in secure HttpOnly SameSite cookies',
                'Invalidate the entire token family if a reuse anomaly is detected'
              ],
              codeSnippet: `// Token verification middleware
const token = req.cookies.refreshToken;
if (isTokenRevoked(token)) {
  throw new ForbiddenError('Token has been revoked');
}`,
            }
          }
        ],
        quiz: {
          id: 'quiz-6',
          title: 'Chapter 6 Knowledge Check',
          passingScore: 80,
          rewardCoins: 50,
          questions: [
            {
              id: 'q1',
              type: 'single',
              prompt: 'Why should refresh tokens be stored in HttpOnly cookies rather than localStorage?',
              options: [
                'HttpOnly cookies are inaccessible to client-side JavaScript, mitigating XSS token theft',
                'Cookies allow infinite storage size',
                'LocalStorage is deprecated in modern browsers',
                'Cookies automatically bypass HTTPS encryption'
              ],
              correctAnswer: 'HttpOnly cookies are inaccessible to client-side JavaScript, mitigating XSS token theft',
              explanation: 'HttpOnly flags block malicious XSS injection scripts from reading the authorization credentials.'
            }
          ]
        }
      },
      {
        id: 'chap-7',
        chapterNumber: 7,
        title: 'Microservices, Caching & Production Deployment',
        description: 'Redis caching strategies, CDN asset distribution, Docker containers, and CI/CD pipelines.',
        duration: '7 hrs',
        isFree: false,
        isUnlocked: false,
        completed: false,
        coinsCost: 300,
        quizPassed: false,
        lessons: [
          {
            id: 'les-7-1',
            title: 'Containerization & Production Readiness Checklist',
            duration: '50 min',
            type: 'article',
            completed: false,
            summary: 'Dockerizing Next.js multi-stage builds and Express microservices for zero-downtime deployment.',
            content: {
              lead: 'Prepare applications for cloud scale with automated builds, health probes, and structured JSON logs.',
              keyTakeaways: [
                'Leverage multi-stage Docker builds to reduce final image sizes to < 100MB',
                'Implement readiness and liveness endpoints for orchestrator probes',
                'Collect centralized metrics for p99 latency monitoring'
              ],
              codeSnippet: `FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]`,
            }
          }
        ],
        quiz: {
          id: 'quiz-7',
          title: 'Chapter 7 Knowledge Check',
          passingScore: 80,
          rewardCoins: 50,
          questions: [
            {
              id: 'q1',
              type: 'single',
              prompt: 'What is the primary benefit of multi-stage Docker builds for web apps?',
              options: [
                'Drastically reduced production container image size by stripping dev dependencies and compilers',
                'Faster CPU clock rates during container execution',
                'Automatic database replication without configuration',
                'Disables HTTPS requirement'
              ],
              correctAnswer: 'Drastically reduced production container image size by stripping dev dependencies and compilers',
              explanation: 'Only compiled runtime artifacts are copied into the final lean production image.'
            }
          ]
        }
      }
    ],
    finalAssessment: {
      id: 'fa-1',
      title: 'Full-Stack Engineering Certification Assessment',
      durationMinutes: 45,
      totalQuestions: 10,
      passingPercentage: 80,
      instructions: [
        'You have 45 minutes to complete all questions.',
        'A minimum score of 80% is required to earn the official Skillority Verified Credential.',
        'You may review and change your answers before final submission.',
        'Once submitted, the results are computed immediately and recorded to your verified profile.'
      ],
      questions: [
        {
          id: 'fa-q1',
          prompt: 'What constitutes the critical boundary between React Server Components and Client Components?',
          options: [
            'RSCs execute solely on the server and stream HTML/RSC payload; Client Components hydrate and run JavaScript in browser',
            'RSCs require MongoDB direct connection in every component file',
            'Client Components can never accept props from Server Components',
            'Server components only run inside Docker containers'
          ],
          correctAnswer: 'RSCs execute solely on the server and stream HTML/RSC payload; Client Components hydrate and run JavaScript in browser',
        },
        {
          id: 'fa-q2',
          prompt: 'Which security header prevents your web application from being embedded in malicious iframes (Clickjacking)?',
          options: ['X-Frame-Options: DENY / Content-Security-Policy', 'Access-Control-Allow-Origin: *', 'X-Powered-By: Express', 'Cache-Control: no-cache'],
          correctAnswer: 'X-Frame-Options: DENY / Content-Security-Policy',
        },
        {
          id: 'fa-q3',
          prompt: 'In Prisma with MongoDB, which decorator marks a primary key as an ObjectID?',
          options: ['@id @default(auto()) @map("_id") @db.ObjectId', '@primaryKey @autoUuid', '@mongoId', '@default(cuid())'],
          correctAnswer: '@id @default(auto()) @map("_id") @db.ObjectId',
        },
        {
          id: 'fa-q4',
          prompt: 'When should you invalidate a JWT refresh token family immediately?',
          options: [
            'When a previously rotated refresh token is attempted to be used again (replay attack detection)',
            'Whenever a user changes their avatar picture',
            'Every 30 seconds during active usage',
            'When the user opens a new browser tab'
          ],
          correctAnswer: 'When a previously rotated refresh token is attempted to be used again (replay attack detection)',
        },
        {
          id: 'fa-q5',
          prompt: 'Which HTTP status code is most appropriate when a validly authenticated user tries to access an Admin-only resource?',
          options: ['403 Forbidden', '401 Unauthorized', '404 Not Found', '500 Internal Server Error'],
          correctAnswer: '403 Forbidden',
        }
      ]
    }
  },
  {
    id: 'course-2',
    slug: 'data-analytics-sql-bi',
    title: 'Enterprise Data Analytics & SQL Mastery',
    category: 'Data & Analytics',
    difficulty: 'Beginner to Intermediate',
    duration: '36 hours',
    rating: 4.8,
    reviewsCount: 890,
    enrolledCount: 2450,
    badge: 'High Demand',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    description: 'Master advanced SQL querying, data warehouse design, dbt transformations, and interactive dashboard storytelling for business intelligence.',
    instructor: {
      name: 'Marcus Vance',
      title: 'Lead Data Architect at Databricks',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Ex-Amazon Senior BI Engineer specializing in petabyte-scale data pipelines and enterprise analytics.',
      coursesCount: 4,
      studentsCount: 16200,
    },
    learningObjectives: [
      'Write complex analytical SQL queries using window functions and CTEs.',
      'Design star and snowflake schemas for performant OLAP queries.',
      'Build automated data transformation pipelines using dbt and modern warehousing.',
      'Publish executive-ready KPI dashboards with clear data narratives.'
    ],
    prerequisites: ['Basic spreadsheet familiarity', 'No prior programming experience required'],
    totalChapters: 7,
    completedChapters: 0,
    progressPercentage: 0,
    isEnrolled: false,
    certificateEligible: false,
    chapters: [
      {
        id: 'c2-chap-0',
        chapterNumber: 0,
        title: 'Introduction to Data Warehousing & Analytics',
        duration: '1 hr',
        isFree: true,
        isUnlocked: true,
        completed: false,
        coinsCost: 0,
        quizPassed: false,
        lessons: [
          {
            id: 'c2-les-0-1',
            title: 'The Modern Data Stack: From OLTP to OLAP',
            duration: '20 min',
            type: 'video',
            completed: false,
            summary: 'Understanding row-oriented vs columnar storage engines.',
            content: {
              lead: 'Learn why analytical workloads require specialized columnar data warehouses like BigQuery and Snowflake.',
              keyTakeaways: ['OLTP systems prioritize fast ACID row updates', 'OLAP databases compress columnar data for scanning billions of records'],
              codeSnippet: `SELECT customer_id, SUM(order_total) FROM sales GROUP BY 1;`,
            }
          }
        ],
        quiz: {
          id: 'c2-quiz-0',
          title: 'Analytics Foundation Quiz',
          passingScore: 80,
          rewardCoins: 50,
          questions: [
            {
              id: 'c2-q1',
              type: 'single',
              prompt: 'Which database type is optimized for heavy aggregation queries over millions of rows?',
              options: ['OLAP Columnar', 'OLTP Row-oriented', 'Key-Value Cache', 'Flat CSV files'],
              correctAnswer: 'OLAP Columnar',
              explanation: 'Columnar storage only scans requested columns, maximizing analytical query throughput.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-3',
    slug: 'ui-ux-design-systems',
    title: 'Product Design Systems & Figma Architecture',
    category: 'UI/UX Design',
    difficulty: 'Beginner',
    duration: '28 hours',
    rating: 4.95,
    reviewsCount: 1540,
    enrolledCount: 4100,
    badge: 'Top Rated',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60',
    description: 'Learn enterprise design systems from foundation to delivery: tokens, auto-layout 5.0, variables, component variants, and developer handoff.',
    instructor: {
      name: 'Elena Rostova',
      title: 'Design Director & Figma Partner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Head of Design Systems at Fintech Unicorn with a passion for systematic craft and tokenized interfaces.',
      coursesCount: 5,
      studentsCount: 32000,
    },
    learningObjectives: [
      'Build scalable multi-brand design systems in Figma.',
      'Leverage Figma Variables for modes, theming, and responsive typography.',
      'Bridge the gap between design tokens and frontend CSS frameworks.'
    ],
    prerequisites: ['Figma free account', 'Keen eye for visual hierarchy'],
    totalChapters: 6,
    completedChapters: 0,
    progressPercentage: 0,
    isEnrolled: false,
    certificateEligible: false,
    chapters: []
  },
  {
    id: 'course-4',
    slug: 'python-ai-agents',
    title: 'Practical AI Agents & LLM Applications with Python',
    category: 'AI & Machine Learning',
    difficulty: 'Advanced',
    duration: '42 hours',
    rating: 4.92,
    reviewsCount: 960,
    enrolledCount: 3120,
    badge: 'Trending',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60',
    description: 'Build production-ready multi-agent workflows, tool-calling pipelines, RAG with vector search, and structured output parsers using modern Python frameworks.',
    instructor: {
      name: 'Dr. Tariq Mansoor',
      title: 'AI Research Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      bio: 'Applied AI researcher focused on agentic tool calling, retrieval augmented generation, and deterministic evaluations.',
      coursesCount: 3,
      studentsCount: 19800,
    },
    learningObjectives: [
      'Design robust autonomous agent workflows with memory and tool calling.',
      'Implement hybrid lexical + dense vector search RAG systems.',
      'Evaluate LLM outputs with deterministic test suites and cost guardrails.'
    ],
    prerequisites: ['Solid Python programming knowledge', 'Understanding of REST APIs'],
    totalChapters: 8,
    completedChapters: 0,
    progressPercentage: 0,
    isEnrolled: false,
    certificateEligible: false,
    chapters: []
  }
];

export const mockStudentProfile = {
  id: 'usr-student-01',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  title: 'Aspiring Full-Stack Software Engineer',
  coinsBalance: 480,
  currentStreakDays: 14,
  coursesCompleted: 2,
  hoursLearned: 38.5,
  certificatesEarned: 1,
  dailyMissions: [
    { id: 'm1', title: 'Complete 1 lesson in Full-Stack Track', reward: 15, completed: true },
    { id: 'm2', title: 'Score 80%+ on any Chapter Quiz', reward: 50, completed: false },
    { id: 'm3', title: 'Maintain your 14-day study streak', reward: 20, completed: true }
  ],
  upcomingActivities: [
    { id: 'act-1', title: 'Live Mentorship Office Hours', date: 'Thursday, 4:00 PM EST', host: 'Dr. Sarah Jenkins', type: 'Google Meet', comingSoon: true },
    { id: 'act-2', title: 'Peer Code Review Circle', date: 'Saturday, 11:00 AM EST', host: 'Skillority Community', type: 'Community' }
  ],
  recentOpportunities: [
    { id: 'opp-1', company: 'Nova Labs', role: 'Junior Frontend Engineer', location: 'Remote (US/EU)', stipend: '$3,500/mo', match: '94% Match' },
    { id: 'opp-2', company: 'Crestline AI', role: 'Full-Stack Developer Intern', location: 'Hybrid · New York', stipend: '$3,800/mo', match: '89% Match' }
  ]
};

