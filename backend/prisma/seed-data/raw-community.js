/**
 * Community Posts & Discussions Seed Data
 * Authentic community conversations covering career guidance, technical questions,
 * PFE internship prep in Tunisia, tech stacks, and project feedback.
 */

export const COMMUNITY_TOPICS = [
  {
    title: 'Tips for landing a top PFE (End of Studies) internship in Tunisia for 2026?',
    content: 'Hello everyone! I am entering my final engineering year and starting to prepare applications for my PFE internship. For alumni and current interns at InstaDeep, Vermeg, Expensya, or abroad: what made your application stand out? Should I prioritize GitHub open source projects or leetcode style problem solving?',
    tags: ['careers', 'pfe-internship', 'advice', 'tunisia-tech'],
    comments: [
      'Focus on having 1 or 2 deep, well-architected full-stack or ML projects on GitHub with a live demo URL and clear README. Hiring managers rarely have time to clone repos without a demo.',
      'Definitely prepare your core fundamentals! In technical interviews, expect questions on asynchronous programming, database indexing, and how your project handles edge cases.',
      'Don’t hesitate to reach out directly to engineering leads on LinkedIn with a polite, tailored message explaining why their specific tech stack excites you.',
      'Also make sure your resume fits on one clean page with quantifiable achievements (e.g. "improved query response time by 40%").'
    ]
  },
  {
    title: 'Next.js 15 App Router vs Pages Router: What are you using in production?',
    content: 'We recently started refactoring our startup platform from Next.js Pages router to Next.js 15 App Router with React Server Components. The mental model shift took a couple of days, but the automatic data fetching waterfall reduction and smaller client bundle sizes are incredible. Curious how many teams in our community have migrated?',
    tags: ['nextjs', 'react', 'web-development', 'architecture'],
    comments: [
      'We made the jump 3 months ago! Server actions drastically simplified our form handling without having to write separate API route boilerplate.',
      'The initial caching behavior in earlier versions was tricky, but Next 15 making fetches un-cached by default made mental models so much cleaner.',
      'Make sure to audit your third-party component libraries! Any library using browser APIs needs "use client" boundaries.'
    ]
  },
  {
    title: 'How to properly optimize MongoDB queries and aggregation pipelines with Prisma?',
    content: 'Hey developers! I noticed that some of our findMany queries were taking over 250ms on MongoDB Atlas as our collections grew past 50k documents. What are your golden rules for compound indexing in Prisma schema and avoiding unindexed in-memory sorts?',
    tags: ['mongodb', 'prisma', 'database', 'backend'],
    comments: [
      'Always add @@index([status, createdAt]) or whatever fields you filter and sort by together. In MongoDB, sort order must match the index prefix.',
      'Use select carefully to only fetch the exact fields you need rather than entire large document blobs.',
      'For complex analytical queries, consider raw MongoDB aggregation commands via prisma.$runCommandRaw if the Prisma abstraction generates sub-optimal pipelines.'
    ]
  },
  {
    title: 'Best roadmap to transition from Junior Frontend to Full-Stack Engineer?',
    content: 'I have been working with React and Tailwind CSS for about a year and feel comfortable with UI development. I want to expand into backend architecture (Node.js, databases, Docker, API design). What courses or milestones on Skillority helped you bridge this gap most effectively?',
    tags: ['career-advice', 'fullstack', 'nodejs', 'learning'],
    comments: [
      'Check out the "Building Scalable RESTful & GraphQL APIs with Express and Prisma" course here on Skillority! It gives you the exact mental model for relational & document modeling.',
      'Learn how HTTP works thoroughly: status codes, headers, cookie-based sessions vs JWT, CORS, and rate limiting.',
      'Try building an authenticated project from scratch without any meta-frameworks once, just Express and a database. You will appreciate what frameworks do under the hood.'
    ]
  },
  {
    title: 'Docker in development: How do you handle hot reloading without high CPU usage on Windows?',
    content: 'When mounting host volumes into Docker containers for Next.js and Node.js with WSL2, I occasionally see vmmem taking significant RAM and CPU during file watching. Anyone have tips for optimal WSL2 and Docker Desktop configurations?',
    tags: ['docker', 'devops', 'wsl2', 'tooling'],
    comments: [
      'Crucial tip: keep your source code inside the Linux WSL2 filesystem (~/projects) instead of mounting from /mnt/c/! Cross-OS filesystem event translation causes the slowdown.',
      'Add a .wslconfig file in your Windows user directory limiting WSL2 memory to 50% or 60% of total host RAM.',
      'Make sure your node_modules is excluded from the volume bind mount using an anonymous volume.'
    ]
  },
  {
    title: 'Showcase: Built a real-time collaborative code editor using WebSockets and Skillority courses!',
    content: 'Hey community! After finishing the Real-Time Web Applications course, I built a browser-based collaborative markdown editor where multiple peers can type simultaneously with operational transformation and live cursor tracking. Would love your feedback and code review on my GitHub repo!',
    tags: ['showcase', 'websockets', 'projects', 'frontend'],
    comments: [
      'Just tried the demo, the cursor synchronization is super smooth! How did you handle network reconnects when someone loses Wi-Fi?',
      'Awesome project! Adding syntax highlighting for Python and TypeScript would take this to the next level.',
      'Great work! This is the exact kind of project that wows recruiters in PFE technical interviews.'
    ]
  },
  {
    title: 'Which mobile framework should a student learn in 2026: Flutter or React Native?',
    content: 'I want to build cross-platform mobile apps for my graduation project. Some seniors swear by Flutter and Dart, while others recommend React Native with Expo Router because of shared TypeScript knowledge. What is the current industry demand in Tunisia and Europe?',
    tags: ['mobile', 'flutter', 'react-native', 'career-advice'],
    comments: [
      'If you already know React and TypeScript, React Native with Expo is a no-brainer. You will ship 3x faster and reuse your web mental models.',
      'Flutter is huge in Tunisia and MENA startups right now because of its single-codebase UI consistency across Android and iOS.',
      'Honestly, both have great job markets. Pick the language you enjoy writing more: Dart or TypeScript!'
    ]
  },
  {
    title: 'Understanding System Design: When to choose Kafka vs RabbitMQ vs Redis Streams?',
    content: 'I am studying distributed systems architecture and want to make sure I understand the practical tradeoffs between RabbitMQ (AMQP message broker), Apache Kafka (distributed event log), and Redis Streams. In what scenarios would you choose one over the others?',
    tags: ['system-design', 'architecture', 'kafka', 'redis'],
    comments: [
      'Use RabbitMQ when you need complex routing rules (topic exchanges, direct exchanges) and traditional worker task queues where messages are discarded once acknowledged.',
      'Use Kafka when you have high-throughput event streaming, need replayability of past events, or have multiple independent consumer groups reading the same stream at their own pace.',
      'Redis Streams is fantastic for lightweight pub/sub with persistence when you already have Redis in your infrastructure stack and don’t want the operational overhead of a Kafka cluster.'
    ]
  },
  {
    title: 'How to prepare for System Design interviews as a junior/mid engineer?',
    content: 'Most tech companies are now including a 45-minute system design or architecture discussion even for junior and mid-level roles. What are the best resources and structures for approaching these questions without getting overwhelmed?',
    tags: ['system-design', 'interviews', 'careers'],
    comments: [
      'Structure is everything! Always start by clarifying requirements: functional requirements, non-functional requirements (read vs write heavy, latency, availability), and back-of-the-envelope calculations.',
      'Draw the high-level diagram first (Client -> CDN -> Load Balancer -> Web Server -> Database) before diving into deep components like caching or queues.',
      'Take the High-Performance System Design course here on Skillority — the walkthroughs of URL Shortener and Notification System are spot on.'
    ]
  },
  {
    title: 'Why clean code and automated testing saves your sanity in large teams',
    content: 'After spending the last week debugging a production regression caused by an untested side effect, I cannot emphasize enough the importance of unit tests and clear boundaries. Even just having a 15-minute Jest test suite that runs on pull requests prevents 80% of preventable defects.',
    tags: ['testing', 'best-practices', 'software-engineering'],
    comments: [
      'Preach! Tests aren’t written for the code you write today; they are written for the engineer who has to refactor it 6 months from now.',
      'Combine Vitest for unit tests with Playwright for 3 or 4 critical happy paths (e.g. login, payment, course enrollment). That gives you immense deployment confidence.'
    ]
  }
];
