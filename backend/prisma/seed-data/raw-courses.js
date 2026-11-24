/**
 * Comprehensive Course Catalog Seed Data (105 Realistic Courses)
 * Covers Web Development, Mobile, Data Science & AI, Cloud & DevOps,
 * Cybersecurity, Software Architecture, and UI/UX Design.
 */

export const COURSE_DEFINITIONS = [
  // -------------------------------------------------------------
  // 1. WEB DEVELOPMENT (25 Courses)
  // -------------------------------------------------------------
  {
    title: 'Full-Stack Web Development with Next.js 15 & Node.js',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Build enterprise-grade full-stack web applications using Next.js 15 App Router, React Server Components, Tailwind CSS, Express, MongoDB, and Prisma.',
    tags: ['Next.js', 'React', 'Node.js', 'Prisma', 'MongoDB', 'Tailwind CSS'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Next.js 15 App Router Fundamentals',
      'React Server Components & Server Actions',
      'Database Modeling with Prisma & MongoDB Atlas',
      'Authentication with JWT, HTTP-Only Cookies & Sessions',
      'State Management & Optimistic UI Updates',
      'Deployment to Vercel & Docker Containerization'
    ]
  },
  {
    title: 'Mastering React 19: Architecture, Hooks & Modern Patterns',
    category: 'Web Development',
    level: 'Advanced',
    description: 'Deep dive into React 19 capabilities: Actions, useActionState, useOptimistic, compiler optimizations, ref as a prop, and scalable component architecture.',
    tags: ['React', 'JavaScript', 'TypeScript', 'Frontend'],
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'React 19 Core Mental Model & Concurrent Engine',
      'Mastering Modern Hooks & Custom Abstractions',
      'Form Actions & Transition APIs',
      'Performance Optimization & Memory Profiling',
      'Building Accessible Design Systems with Tailwind'
    ]
  },
  {
    title: 'Building Scalable RESTful & GraphQL APIs with Express and Prisma',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Design, secure, test, and document production-ready REST and GraphQL APIs using Node.js, Express, Prisma ORM, and Apollo Server.',
    tags: ['Node.js', 'Express', 'GraphQL', 'REST', 'Prisma', 'Backend'],
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'API Design Principles & RESTful Constraints',
      'Express Middleware Pipeline & Error Handling Architecture',
      'Prisma ORM Relations & Query Optimization',
      'GraphQL Schema Design & Resolvers with Apollo',
      'Rate Limiting, Helmet Security & OWASP Defense'
    ]
  },
  {
    title: 'Modern TypeScript for Production Web Applications',
    category: 'Web Development',
    level: 'Beginner',
    description: 'From static typing basics to advanced generics, utility types, mapped types, and TypeScript integration in React and Node.js codebases.',
    tags: ['TypeScript', 'JavaScript', 'Web Development'],
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc155d9c222?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'TypeScript Foundations: Types, Interfaces & Unions',
      'Functions, Generics & Type Assertions',
      'Advanced Type Narrowing & Discriminated Unions',
      'TypeScript with React Props, State & Context',
      'Strict Mode Best Practices & Compiler Configuration'
    ]
  },
  {
    title: 'Advanced CSS & Tailwind CSS: Systems, Layouts & Animations',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Master CSS Grid, Flexbox, subgrid, container queries, custom Tailwind CSS configuration, and performant micro-interactions.',
    tags: ['CSS', 'Tailwind CSS', 'UI Design', 'Frontend'],
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Modern Layout Engines: Grid, Subgrid & Flexbox',
      'Responsive Design with Container Queries',
      'Tailwind CSS Theming & Custom Plugin Architecture',
      'Smooth CSS Transitions & Keyframe Animations',
      'Accessibility (a11y) & Dark Mode Implementations'
    ]
  },
  {
    title: 'Full-Stack E-Commerce Engineering with Stripe & MongoDB',
    category: 'Web Development',
    level: 'Advanced',
    description: 'Architect a complete multi-vendor e-commerce store with shopping cart persistence, Stripe webhooks, inventory locks, and automated receipts.',
    tags: ['E-Commerce', 'Next.js', 'Stripe', 'MongoDB', 'Node.js'],
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Store Architecture & Catalog Schema Modeling',
      'Persistent Cart Management with Redis & LocalStorage',
      'Stripe Payment Elements & Webhook Verification',
      'Order Lifecycle & Transactional Email Confirmations',
      'Admin Merchant Analytics & Sales Dashboard'
    ]
  },
  {
    title: 'Micro-Frontends Architecture: Principles and Implementation',
    category: 'Web Development',
    level: 'Advanced',
    description: 'Decompose monolithic web apps into independently deployable micro-frontends using Module Federation, Webpack, and single-spa.',
    tags: ['Architecture', 'Webpack', 'React', 'Micro-Frontends'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Monolith vs Micro-Frontend Tradeoffs',
      'Webpack Module Federation Core Mechanics',
      'Cross-Application State & Event Bus Sharing',
      'Independent Deployment Pipelines & Versioning',
      'Performance Optimization & Asset Caching'
    ]
  },
  {
    title: 'Progressive Web Apps (PWA) with Next.js and Service Workers',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Transform web apps into installable, offline-ready progressive applications with service worker caching and push notifications.',
    tags: ['PWA', 'Next.js', 'Service Workers', 'Mobile Web'],
    thumbnail: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'PWA Manifest & App Icon Specifications',
      'Service Worker Lifecycle & Cache Strategies',
      'Offline-First Data Sync with IndexedDB',
      'Web Push Notifications & Background Sync',
      'Auditing with Lighthouse & Production Release'
    ]
  },
  {
    title: 'Vue 3 & Nuxt 3 Masterclass: Enterprise Web Applications',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Learn Vue 3 Composition API, Pinia state management, SSR with Nuxt 3, and full-stack routing with server middleware.',
    tags: ['Vue.js', 'Nuxt.js', 'Pinia', 'JavaScript'],
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Vue 3 Composition API & Script Setup Syntax',
      'Global State Management with Pinia Stores',
      'Nuxt 3 Server-Side Rendering (SSR) & Nitro Engine',
      'File-Based Routing & Dynamic Layouts',
      'Deploying Nuxt 3 to Serverless Cloud'
    ]
  },
  {
    title: 'Real-Time Web Applications with WebSockets and Socket.io',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Build collaborative whiteboards, live multiplayer chat, and streaming dashboards using Node.js, Socket.io, and Redis adapter.',
    tags: ['WebSockets', 'Socket.io', 'Node.js', 'Real-time'],
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'HTTP Polling vs Server-Sent Events vs WebSockets',
      'Socket.io Connection Lifecycle & Room Multiplexing',
      'Scaling Real-Time Sockets with Redis Pub/Sub',
      'Building Collaborative Multi-User Chat Rooms',
      'Reconnection Strategies & Fallback Transports'
    ]
  },
  {
    title: 'Angular 18 Enterprise Architecture & Signals',
    category: 'Web Development',
    level: 'Advanced',
    description: 'Build scalable single-page enterprise apps with Angular 18 standalone components, Signals reactive model, and NgRx store.',
    tags: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Enterprise'],
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Angular 18 Standalone Components & Directives',
      'Signals Reactive Primitives & Computed Values',
      'Angular Router, Lazy Loading & Functional Guards',
      'State Management Architecture with NgRx',
      'Enterprise Unit Testing with Jest & Karma'
    ]
  },
  {
    title: 'Web Performance Optimization: Core Web Vitals to 100/100',
    category: 'Web Development',
    level: 'Advanced',
    description: 'Diagnose and remediate LCP, INP, and CLS bottlenecks using Chrome DevTools, bundle analysis, font loading, and edge caching.',
    tags: ['Web Performance', 'Core Web Vitals', 'LCP', 'INP', 'Lighthouse'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Core Web Vitals Metric Specifications (LCP, INP, CLS)',
      'Critical Rendering Path & JavaScript Execution Budgeting',
      'Image Optimization, Next-Gen Formats & CDN Tuning',
      'Code Splitting, Tree Shaking & Dynamic Imports',
      'Real User Monitoring (RUM) & Continuous Audits'
    ]
  },
  {
    title: 'Web Accessibility (a11y) & WCAG 2.2 Compliance in Practice',
    category: 'Web Development',
    level: 'Beginner',
    description: 'Ensure your web interfaces are inclusive and compliant with WCAG 2.2 AA standards through semantic HTML, ARIA, and screen reader tests.',
    tags: ['Accessibility', 'a11y', 'WCAG', 'HTML', 'Frontend'],
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'WCAG 2.2 Core Principles (POUR Framework)',
      'Semantic HTML5 & Keyboard Navigation Traps',
      'ARIA Roles, States & Properties',
      'Screen Reader Testing (NVDA & VoiceOver)',
      'Automated a11y Auditing in CI/CD'
    ]
  },
  {
    title: 'Building Modern Component Libraries with Storybook & Tailwind',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Publish your own reusable React UI library with Storybook documentation, automated visual regression tests, and npm publishing.',
    tags: ['Design System', 'Storybook', 'React', 'Tailwind CSS', 'npm'],
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Design Token Architecture & Spacing Scales',
      'Building Storybook Stories for Atoms & Molecules',
      'Component Variant API Design with CVA',
      'Visual Regression Testing with Chromatic',
      'Packaging & Publishing as an npm Module'
    ]
  },
  {
    title: 'Automated Testing for Web Apps: Jest, Vitest, and Playwright',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'End-to-end testing strategies: unit testing with Vitest, React component testing with Testing Library, and browser automation with Playwright.',
    tags: ['Testing', 'Playwright', 'Jest', 'Vitest', 'QA'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'The Modern Testing Pyramid for Full-Stack Web',
      'Unit & Integration Testing with Vitest',
      'React Testing Library Best Practices',
      'End-to-End Browser Testing with Playwright',
      'Running Tests in GitHub Actions CI'
    ]
  },
  {
    title: 'JAMstack Development with Astro and Headless CMS',
    category: 'Web Development',
    level: 'Beginner',
    description: 'Build blazing-fast, content-driven websites with zero JS by default using Astro, Markdown/MDX, and Headless CMS APIs.',
    tags: ['Astro', 'JAMstack', 'CMS', 'Markdown', 'Static Site'],
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Astro Island Architecture & Zero-JS By Default',
      'Content Collections & Schema Validation with Zod',
      'Integrating React Components on Demand',
      'Fetching Data from Headless CMS',
      'SEO Optimization & Static Generation'
    ]
  },
  {
    title: 'Svelte 5 & SvelteKit: The Next Evolution of Web Development',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Explore Svelte 5 runes ($state, $derived, $effect), server routes, form actions, and build lightning-fast web experiences.',
    tags: ['Svelte', 'SvelteKit', 'JavaScript', 'Frontend'],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Svelte 5 Runes & Fine-Grained Reactivity',
      'SvelteKit Project Architecture & File Routing',
      'Form Actions & Server-Side Data Loading',
      'Stores & Context API Integration',
      'Production Deployment with SvelteKit Adapters'
    ]
  },
  {
    title: 'Serverless Functions & Edge Computing with Cloudflare Workers',
    category: 'Web Development',
    level: 'Advanced',
    description: 'Deploy ultra-low latency serverless APIs, KV storage, and reverse proxies right at the edge with Cloudflare Workers and Hono.',
    tags: ['Serverless', 'Cloudflare', 'Edge Computing', 'Hono', 'TypeScript'],
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Edge Computing Architecture vs Traditional Servers',
      'Writing Lightweight APIs with Hono on Workers',
      'Using Cloudflare KV & D1 SQLite at the Edge',
      'Edge Middleware: Auth, Headers & Rate Limiting',
      'Deploying with Wrangler CLI'
    ]
  },
  {
    title: 'Mastering SQL & Relational Databases for Web Developers',
    category: 'Web Development',
    level: 'Beginner',
    description: 'Comprehensive guide to PostgreSQL, normalization, joins, indexing, transactions (ACID), and query performance analysis with EXPLAIN.',
    tags: ['PostgreSQL', 'SQL', 'Databases', 'Backend'],
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Relational Theory & Database Normalization (1NF-3NF)',
      'Complex Queries, Joins & Subqueries',
      'Indexing Strategies: B-Tree, GIN & Hash Indexes',
      'Transactions, Isolation Levels & Concurrency Locks',
      'Query Performance Tuning with EXPLAIN ANALYZE'
    ]
  },
  {
    title: 'MongoDB Schema Design & Aggregation Pipelines for Node.js',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Master MongoDB document modeling patterns, embedding vs referencing tradeoffs, multi-stage aggregation pipelines, and sharding basics.',
    tags: ['MongoDB', 'NoSQL', 'Database', 'Node.js', 'Prisma'],
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Document Modeling Patterns & Embed vs Reference',
      'Aggregation Pipeline Operators ($match, $group, $lookup)',
      'Indexing in MongoDB: Compound & Partial Indexes',
      'Prisma ORM with MongoDB Atlas Best Practices',
      'Handling High-Volume Writes & Sharding Overview'
    ]
  },
  {
    title: 'Web3 & Decentralized Apps (dApps) with Ethereum and Ethers.js',
    category: 'Web Development',
    level: 'Advanced',
    description: 'Learn Solidity smart contract development, MetaMask wallet integration, and building responsive React dApps on Ethereum.',
    tags: ['Web3', 'Ethereum', 'Solidity', 'Smart Contracts', 'React'],
    thumbnail: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Blockchain Fundamentals & Ethereum Architecture',
      'Solidity Smart Contract Development with Hardhat',
      'Connecting React Frontends with Ethers.js & Wagmi',
      'Handling Gas Fees, Transactions & Event Logs',
      'Security Auditing & Reentrancy Vulnerability Defense'
    ]
  },
  {
    title: 'High-Concurrency Backend Development with Go & Gin',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Leverage Go goroutines, channels, and the Gin HTTP framework to build lightning-fast web microservices with sub-millisecond latencies.',
    tags: ['Go', 'Golang', 'Gin', 'Microservices', 'Backend'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Go Syntax, Structs, Interfaces & Memory Model',
      'Goroutines, Channels & Concurrent Synchronization',
      'Building REST APIs with Gin Web Framework',
      'GORM Database Modeling & Connection Pooling',
      'Benchmarking & Microservice Containerization'
    ]
  },
  {
    title: 'FastAPI & Modern Python for Async Web Backends',
    category: 'Web Development',
    level: 'Intermediate',
    description: 'Harness Python async/await, Pydantic schema validation, and automatic OpenAPI documentation with FastAPI for production backends.',
    tags: ['Python', 'FastAPI', 'Pydantic', 'Async', 'Backend'],
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Python Type Hints & Pydantic Data Validation',
      'FastAPI Routing, Path Parameters & Query Enums',
      'Dependency Injection & JWT Authentication',
      'Async Database Access with SQLAlchemy & AsyncPG',
      'Background Tasks, WebSockets & Docker Deploy'
    ]
  },
  {
    title: 'Web Authentication & Security: Passkeys, OAuth2, and OpenID Connect',
    category: 'Web Development',
    level: 'Advanced',
    description: 'Implement modern passwordless authentication with WebAuthn Passkeys, Google/GitHub OAuth2, and secure session management.',
    tags: ['Security', 'Auth', 'OAuth2', 'Passkeys', 'WebAuthn'],
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Modern Authentication Protocols (OAuth 2.0 & OIDC)',
      'Passwordless Authentication with WebAuthn / Passkeys',
      'JWT Security: Signing, Refresh Rotations & Revocation',
      'Cross-Site Scripting (XSS) & CSRF Protections',
      'Multi-Factor Authentication (TOTP) Implementation'
    ]
  },
  {
    title: 'Introduction to HTML5, CSS3, and Modern JavaScript',
    category: 'Web Development',
    level: 'Beginner',
    description: 'The definitive starting point for aspiring software engineers. Learn standard HTML5 semantics, modern CSS styling, and interactive JavaScript.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Beginners', 'Web Development'],
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Web Foundations: How the Internet Works',
      'Semantic HTML5 & Document Structure',
      'CSS3 Fundamentals: Selectors, Box Model & Colors',
      'JavaScript Essentials: Variables, Loops & Functions',
      'DOM Manipulation & Event Listeners'
    ]
  },

  // -------------------------------------------------------------
  // 2. MOBILE DEVELOPMENT (15 Courses)
  // -------------------------------------------------------------
  {
    title: 'Cross-Platform Mobile Apps with React Native & Expo',
    category: 'Mobile Development',
    level: 'Intermediate',
    description: 'Build native iOS and Android apps using React Native, Expo Router, native device sensors, push notifications, and offline SQLite.',
    tags: ['React Native', 'Expo', 'Mobile', 'iOS', 'Android'],
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'React Native Mental Model & Expo Project Setup',
      'Expo Router: File-Based Navigation for Mobile',
      'Styling with NativeWind & Responsive Mobile Layouts',
      'Hardware Sensors: Camera, GPS & Accelerometer',
      'Offline Storage with SQLite & App Store Submission'
    ]
  },
  {
    title: 'Flutter & Dart Masterclass: Build iOS and Android Apps',
    category: 'Mobile Development',
    level: 'Beginner',
    description: 'From Dart programming syntax to Flutter reactive widgets, provider state management, clean architecture, and material design.',
    tags: ['Flutter', 'Dart', 'Mobile', 'Cross-Platform'],
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Dart Programming Language Essentials',
      'Flutter Widget Tree & Stateful vs Stateless Widgets',
      'Responsive Mobile UI with Material 3 & Cupertino',
      'State Management with Riverpod / Bloc',
      'Networking, REST APIs & JSON Serialization'
    ]
  },
  {
    title: 'Modern Android Development with Kotlin & Jetpack Compose',
    category: 'Mobile Development',
    level: 'Intermediate',
    description: 'Declarative Android UI engineering with Jetpack Compose, Coroutines, Flow, Room database, and MVVM architecture.',
    tags: ['Android', 'Kotlin', 'Jetpack Compose', 'Mobile'],
    thumbnail: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Kotlin Modern Syntax & Idiomatic Android',
      'Jetpack Compose Declarative UI Components',
      'State Management & ViewModel Architecture',
      'Asynchronous Programming with Kotlin Coroutines & Flow',
      'Local Persistence with Room Database'
    ]
  },
  {
    title: 'iOS 18 App Development with Swift & SwiftUI',
    category: 'Mobile Development',
    level: 'Intermediate',
    description: 'Create elegant iOS apps utilizing SwiftUI, SwiftData, async/await concurrency, widgets, and Apple Human Interface Guidelines.',
    tags: ['iOS', 'Swift', 'SwiftUI', 'Apple', 'Mobile'],
    thumbnail: 'https://images.unsplash.com/photo-1510519138161-58474ebf8993?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Swift 6 Syntax, Optionals & Closures',
      'SwiftUI View Hierarchies & State Bindings',
      'Data Modeling with SwiftData & Persistence',
      'Swift Concurrency: Actors, Tasks & Async/Await',
      'App Store Guidelines & TestFlight Deployment'
    ]
  },
  {
    title: 'Mobile Architecture: Offline-First, SQLite, and State Management',
    category: 'Mobile Development',
    level: 'Advanced',
    description: 'Architect resilient mobile applications that function flawlessly offline, synchronizing data seamlessly upon network reconnection.',
    tags: ['Mobile Architecture', 'Offline-First', 'SQLite', 'Sync'],
    thumbnail: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Offline-First Architectural Patterns & Conflict Resolution',
      'Local Storage Schema Design with SQLite / WatermelonDB',
      'Delta Synchronization & Background Work Queues',
      'Network State Detection & Exponential Backoff',
      'Automated Testing for Offline Edge Cases'
    ]
  },
  {
    title: 'Mobile App Security & Reverse Engineering Defense',
    category: 'Mobile Development',
    level: 'Advanced',
    description: 'Harden iOS and Android apps against code tampering, jailbreak/root detection, SSL pinning, and API token extraction.',
    tags: ['Mobile Security', 'App Hardening', 'SSL Pinning', 'Cybersecurity'],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Mobile Threat Landscape (OWASP Mobile Top 10)',
      'SSL Pinning & Network Traffic Interception Defense',
      'Jailbreak & Root Detection Mechanisms',
      'Secure Key Storage in Keychain & Keystore',
      'Code Obfuscation with ProGuard / DexGuard'
    ]
  },
  {
    title: 'Flutter Clean Architecture & BLoC Pattern',
    category: 'Mobile Development',
    level: 'Advanced',
    description: 'Implement enterprise Clean Architecture in Flutter with separation of data, domain, and presentation layers using BLoC.',
    tags: ['Flutter', 'Clean Architecture', 'BLoC', 'Dart'],
    thumbnail: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Clean Architecture Principles in Flutter',
      'Domain Layer: Entities, Use Cases & Repository Contracts',
      'Data Layer: Data Sources, Models & Network Serialization',
      'Presentation Layer: BLoC Events, States & Builders',
      'Dependency Injection with GetIt & Unit Testing'
    ]
  },
  {
    title: 'Building Augmented Reality (AR) Apps with Unity & ARKit/ARCore',
    category: 'Mobile Development',
    level: 'Advanced',
    description: 'Create interactive Augmented Reality experiences for mobile devices tracking horizontal planes, image markers, and 3D interactions.',
    tags: ['AR', 'Unity', 'ARKit', 'ARCore', 'C#'],
    thumbnail: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'AR Foundations: Coordinate Systems & Pose Tracking',
      'Setting up Unity AR Foundation',
      'Plane Detection & Placing 3D Objects',
      'Image Tracking & Augmented Reality Markers',
      'Lighting Estimation & Environmental Shadows'
    ]
  },
  {
    title: 'Mobile Game Development with Godot Engine',
    category: 'Mobile Development',
    level: 'Beginner',
    description: 'Design and publish 2D mobile arcade games using the lightweight open-source Godot Engine and GDScript.',
    tags: ['Game Development', 'Godot', 'Mobile Games', 'GDScript'],
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Godot Node Hierarchy & Scene Organization',
      'GDScript Basics: Physics, Collisions & Movement',
      'Touch Controls & Virtual Joysticks for Mobile',
      'Audio Effects, Particle Systems & Juice',
      'Exporting to Android APK and iOS Xcode'
    ]
  },
  {
    title: 'React Native Animations with Reanimated 3 & Gesture Handler',
    category: 'Mobile Development',
    level: 'Intermediate',
    description: 'Craft fluid 60/120fps gesture-driven animations in React Native running exclusively on the native UI thread.',
    tags: ['React Native', 'Animations', 'Reanimated', 'Mobile UI'],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'React Native Animation Performance & UI Thread Bridge',
      'Reanimated 3 Shared Values & useAnimatedStyle',
      'Pan, Pinch & Rotation Gestures with Gesture Handler',
      'Interactive Bottom Sheets & Swipeable Cards',
      'Shared Element Transitions between Screens'
    ]
  },
  {
    title: 'Building Audio & Media Streaming Apps for Mobile',
    category: 'Mobile Development',
    level: 'Intermediate',
    description: 'Develop podcast and music streaming mobile applications with background audio playback, lock screen controls, and caching.',
    tags: ['Media', 'Streaming', 'Mobile', 'Audio', 'React Native'],
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Audio Lifecycle & Background Playback Modes',
      'Integrating Lock Screen & Car Display Media Controls',
      'Handling Audio Buffering, Bitrate Switching & HLS',
      'Audio Waveform Visualizers & Playback State',
      'Offline Audio File Storage & Download Managers'
    ]
  },
  {
    title: 'In-App Purchases & Mobile Subscriptions Engineering',
    category: 'Mobile Development',
    level: 'Intermediate',
    description: 'Implement reliable recurring subscriptions in iOS and Android using RevenueCat, handling store webhooks and entitlements.',
    tags: ['Monetization', 'In-App Purchases', 'RevenueCat', 'Mobile'],
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Apple StoreKit 2 & Google Play Billing Fundamentals',
      'Setting up RevenueCat for Cross-Platform Subscriptions',
      'Paywall Design & Conversion Rate Optimization',
      'Server-Side Receipt Validation & Webhook Verification',
      'Grace Periods, Billing Retries & Churn Prevention'
    ]
  },
  {
    title: 'Bluetooth Low Energy (BLE) Programming on Mobile',
    category: 'Mobile Development',
    level: 'Advanced',
    description: 'Connect mobile apps to IoT microcontrollers, wearables, and medical devices using Bluetooth Low Energy protocols.',
    tags: ['BLE', 'Bluetooth', 'IoT', 'Mobile', 'Embedded'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'BLE Architecture: Central vs Peripheral Roles & GATT Profiles',
      'Scanning, Advertising & RSSI Signal Filtering',
      'Reading and Writing Characteristics & Notifications',
      'Handling Connection Drops & MTU Size Negotiation',
      'Background BLE Scanning Guidelines for iOS & Android'
    ]
  },
  {
    title: 'Automated CI/CD for Mobile: Fastlane & GitHub Actions',
    category: 'Mobile Development',
    level: 'Intermediate',
    description: 'Automate code signing certificates, provisioning profiles, screenshot generation, and store distribution with Fastlane.',
    tags: ['CI/CD', 'Fastlane', 'DevOps', 'Mobile Release'],
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Mobile Code Signing: Certificates & Keystores Decoded',
      'Writing Fastlane Lanes for iOS & Android Builds',
      'Automated App Store Screenshots with Fastlane Snapshot',
      'Deploying Automated Beta Builds to TestFlight & Google Play',
      'Setting up GitHub Actions Self-Hosted macOS Runners'
    ]
  },
  {
    title: 'Mobile Deep Linking & Push Notifications Architecture',
    category: 'Mobile Development',
    level: 'Intermediate',
    description: 'Configure universal links, app links, custom schemes, and reliable push notifications with Firebase Cloud Messaging (FCM).',
    tags: ['Deep Linking', 'Push Notifications', 'FCM', 'Mobile Growth'],
    thumbnail: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Universal Links (iOS) & App Links (Android) Verification',
      'Routing In-App Navigation from Deep Link Payloads',
      'FCM Setup & Device Token Registration Architecture',
      'Handling Foreground, Background & Killed State Notifications',
      'Notification Analytics & Campaign Attribution'
    ]
  },

  // -------------------------------------------------------------
  // 3. DATA SCIENCE & AI (20 Courses)
  // -------------------------------------------------------------
  {
    title: 'Applied Machine Learning with Python & Scikit-Learn',
    category: 'Data Science & AI',
    level: 'Beginner',
    description: 'Supervised and unsupervised learning: linear regression, decision trees, random forests, clustering, model evaluation, and cross-validation.',
    tags: ['Machine Learning', 'Python', 'Scikit-learn', 'Data Science'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Exploratory Data Analysis with Pandas & Seaborn',
      'Linear & Logistic Regression for Predictive Modeling',
      'Decision Trees, Random Forests & Ensemble Methods',
      'Clustering Algorithms (K-Means, DBSCAN) & PCA',
      'Model Evaluation Metrics (ROC-AUC, Precision, Recall)'
    ]
  },
  {
    title: 'Deep Learning & Neural Networks with PyTorch',
    category: 'Data Science & AI',
    level: 'Intermediate',
    description: 'Tensors, autograd, feedforward neural nets, convolutional networks (CNNs), transfer learning, and training on GPU hardware.',
    tags: ['PyTorch', 'Deep Learning', 'Neural Networks', 'AI'],
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'PyTorch Tensor Operations & Automatic Differentiation',
      'Building Feedforward Multi-Layer Perceptrons',
      'Convolutional Neural Networks (CNNs) for Image Classification',
      'Transfer Learning with ResNet and EfficientNet',
      'Training Optimization: Adam, Learning Rate Schedulers & GPU Acceleration'
    ]
  },
  {
    title: 'Generative AI & LLM Application Development with LangChain',
    category: 'Data Science & AI',
    level: 'Intermediate',
    description: 'Build production Retrieval-Augmented Generation (RAG) applications with OpenAI, Anthropic, open-source LLMs, and vector databases.',
    tags: ['Generative AI', 'LangChain', 'RAG', 'LLMs', 'Vector DB'],
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Large Language Models Mental Model & Prompt Engineering',
      'Building Chains and Agents with LangChain & LangGraph',
      'Vector Embeddings & Semantic Search with Pinecone / Chroma',
      'Retrieval-Augmented Generation (RAG) Architecture',
      'Evaluating LLM Outputs & Hallucination Mitigation'
    ]
  },
  {
    title: 'Data Engineering Fundamentals: Spark, Airflow & Data Lakes',
    category: 'Data Science & AI',
    level: 'Advanced',
    description: 'Design robust ETL pipelines, schedule DAGs with Apache Airflow, process big data with PySpark, and manage cloud data warehouses.',
    tags: ['Data Engineering', 'PySpark', 'Airflow', 'Big Data', 'ETL'],
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Data Engineering Architecture: Data Lakes vs Warehouses',
      'Distributed Data Processing with Apache Spark & PySpark',
      'Orchestrating Workflows & DAGs with Apache Airflow',
      'Building Resilient Batch & Streaming ETL Pipelines',
      'Data Quality Monitoring & Schema Evolution'
    ]
  },
  {
    title: 'Computer Vision in Practice: OpenCV, YOLO & Deep Learning',
    category: 'Data Science & AI',
    level: 'Intermediate',
    description: 'Object detection, face recognition, semantic segmentation, and video analytics using OpenCV, YOLOv8, and custom PyTorch models.',
    tags: ['Computer Vision', 'OpenCV', 'YOLO', 'Deep Learning'],
    thumbnail: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Image Filtering, Morphological Transforms & Edge Detection',
      'Real-Time Object Detection with YOLOv8',
      'Semantic & Instance Segmentation with Mask R-CNN',
      'Facial Landmark Detection & Biometric Embeddings',
      'Deploying Vision Models to Real-Time RTSP Video Feeds'
    ]
  },
  {
    title: 'Natural Language Processing (NLP) from Fundamentals to Transformers',
    category: 'Data Science & AI',
    level: 'Advanced',
    description: 'Text preprocessing, tokenization, word embeddings (Word2Vec), attention mechanisms, and fine-tuning Hugging Face Transformers.',
    tags: ['NLP', 'Transformers', 'Hugging Face', 'BERT', 'AI'],
    thumbnail: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Text Preprocessing, Tokenization & N-Grams',
      'Word & Sentence Embeddings (Word2Vec, FastText)',
      'The Transformer Architecture & Self-Attention Decoded',
      'Fine-Tuning BERT & RoBERTa for Classification',
      'Hugging Face Pipelines & Production Inference'
    ]
  },
  {
    title: 'MLOps: Deploying and Monitoring Machine Learning Models',
    category: 'Data Science & AI',
    level: 'Advanced',
    description: 'Bridge the gap between ML models and production. Learn model registry with MLflow, containerization with Docker, and drift monitoring.',
    tags: ['MLOps', 'Docker', 'MLflow', 'Model Deployment'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'The MLOps Lifecycle & CI/CD for Machine Learning',
      'Experiment Tracking & Model Registry with MLflow',
      'Packaging Inference APIs with FastAPI & Docker',
      'Model Serving on Kubernetes & Triton Inference Server',
      'Data Drift & Model Performance Degradation Monitoring'
    ]
  },
  {
    title: 'Time Series Forecasting with Python: ARIMA to Deep Learning',
    category: 'Data Science & AI',
    level: 'Intermediate',
    description: 'Forecast financial assets, energy demand, and sales data using statistical models (ARIMA, SARIMAX), Prophet, and LSTM neural nets.',
    tags: ['Time Series', 'Forecasting', 'Python', 'Statistics'],
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Time Series Decomposition: Trend, Seasonality & Residuals',
      'Statistical Forecasting: Auto-ARIMA & SARIMAX',
      'Facebook Prophet for Business Forecasting',
      'Deep Learning for Sequences: LSTM & GRU Networks',
      'Backtesting Strategies & Evaluating Forecast Accuracy'
    ]
  },
  {
    title: 'Reinforcement Learning: From Q-Learning to AlphaGo',
    category: 'Data Science & AI',
    level: 'Advanced',
    description: 'Learn Markov Decision Processes (MDP), Bellman equations, Deep Q-Networks (DQN), Policy Gradients, and train agents in Gymnasium.',
    tags: ['Reinforcement Learning', 'AI', 'PyTorch', 'Gymnasium'],
    thumbnail: 'https://images.unsplash.com/photo-1534972195531-a756b1140f6c?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Markov Decision Processes & Bellman Optimality Equations',
      'Tabular Q-Learning & Exploration vs Exploitation',
      'Deep Q-Networks (DQN) & Experience Replay',
      'Policy Gradient Methods (REINFORCE, PPO)',
      'Training Autonomous Game Agents with Gymnasium'
    ]
  },
  {
    title: 'Feature Engineering & Data Cleaning Masterclass',
    category: 'Data Science & AI',
    level: 'Beginner',
    description: 'Transform raw, noisy, imperfect datasets into high-signal feature matrices using advanced imputations, encodings, and scaling techniques.',
    tags: ['Feature Engineering', 'Data Cleaning', 'Pandas', 'Data Science'],
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Handling Missing Values: Imputation Strategies',
      'Outlier Detection with IQR, Z-Score & Isolation Forests',
      'Categorical Encodings: Target, One-Hot & Frequency Encoding',
      'Feature Transformation & Power Transforms (Box-Cox)',
      'Feature Selection Techniques & Dimensionality Reduction'
    ]
  },
  {
    title: 'AI Ethics, Explainability, and Responsible AI Systems',
    category: 'Data Science & AI',
    level: 'Intermediate',
    description: 'Audit AI models for demographic bias, implement SHAP and LIME model explainability, and comply with EU AI Act regulations.',
    tags: ['AI Ethics', 'SHAP', 'LIME', 'Explainable AI', 'Compliance'],
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Understanding Algorithmic Bias in Predictive Models',
      'Model Interpretability with SHAP (SHapley Additive exPlanations)',
      'Local Explanations with LIME',
      'Fairness Metrics & Bias Mitigation Algorithms',
      'The European Union AI Act: Developer Guidelines'
    ]
  },
  {
    title: 'Data Visualization & Storytelling with Python & Tableau',
    category: 'Data Science & AI',
    level: 'Beginner',
    description: 'Communicate data insights compellingly with Matplotlib, Seaborn, Plotly interactive graphics, and executive Tableau dashboards.',
    tags: ['Data Visualization', 'Tableau', 'Plotly', 'Python', 'BI'],
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Principles of Visual Perception & Chart Selection',
      'Static Visualizations with Matplotlib and Seaborn',
      'Interactive Web Charts with Plotly',
      'Building Executive Dashboards in Tableau',
      'Data Storytelling: Presenting to Non-Technical Leaders'
    ]
  },
  {
    title: 'Graph Neural Networks & Network Analysis with PyTorch Geometric',
    category: 'Data Science & AI',
    level: 'Advanced',
    description: 'Model interconnected social networks, molecular graphs, and recommendation engines using Graph Convolutional Networks (GCN).',
    tags: ['Graph Neural Networks', 'PyTorch Geometric', 'AI', 'Data Science'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Graph Theory Fundamentals & NetworkX Analysis',
      'Graph Convolutional Networks (GCN) Core Mathematics',
      'Node Classification & Link Prediction in PyTorch Geometric',
      'Graph Attention Networks (GAT)',
      'Real-World Fraud Detection on Financial Graphs'
    ]
  },
  {
    title: 'Recommendation Systems: Collaborative Filtering to Deep Learning',
    category: 'Data Science & AI',
    level: 'Advanced',
    description: 'Engineer recommendation engines for e-commerce and streaming using matrix factorization, cosine similarity, and two-tower neural architectures.',
    tags: ['RecSys', 'Recommendation Systems', 'Machine Learning'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Recommendation System Architecture & Cold-Start Challenges',
      'Content-Based Filtering & TF-IDF Similarity',
      'Collaborative Filtering with SVD Matrix Factorization',
      'Deep Learning Recommendations: Two-Tower Neural Models',
      'Evaluating RecSys: Hit Rate, NDCG & Diversity Metrics'
    ]
  },
  {
    title: 'Vector Databases in Practice: Pinecone, Qdrant & Milvus',
    category: 'Data Science & AI',
    level: 'Intermediate',
    description: 'Master approximate nearest neighbor (ANN) search algorithms (HNSW, IVFFlat) and implement high-throughput vector retrieval for AI.',
    tags: ['Vector Database', 'Pinecone', 'Qdrant', 'AI Search'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'High-Dimensional Vector Spaces & Similarity Metrics',
      'Approximate Nearest Neighbors (ANN) & HNSW Indexing',
      'Implementing Vector Search with Qdrant & Pinecone',
      'Hybrid Search: Combining BM25 Keyword & Dense Vector Search',
      'Metadata Filtering & Scaling Multi-Tenant Vector Indices'
    ]
  },
  {
    title: 'Autonomous AI Agents: Autogen, CrewAI & Tool Use',
    category: 'Data Science & AI',
    level: 'Advanced',
    description: 'Architect multi-agent collaborative workflows where autonomous AI agents research, code, test, and critique outputs collaboratively.',
    tags: ['AI Agents', 'CrewAI', 'Autogen', 'Generative AI'],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Autonomous Agent Architecture: Memory, Tools & Planning',
      'Building Multi-Agent Systems with CrewAI',
      'Agentic Tool Calling & Safe Execution Environments',
      'Self-Correction, Reflection & Critic Loops',
      'Deploying Autonomous Agent Workflows to Production'
    ]
  },
  {
    title: 'Audio Processing & Speech Recognition with Whisper and Python',
    category: 'Data Science & AI',
    level: 'Intermediate',
    description: 'Spectrogram analysis, feature extraction (MFCC), voice activity detection, and speech-to-text transcription with OpenAI Whisper.',
    tags: ['Audio AI', 'Whisper', 'Speech Recognition', 'Python'],
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Digital Audio Fundamentals: Sampling Rate, Quantization & FFT',
      'Spectrograms & Mel-Frequency Cepstral Coefficients (MFCCs)',
      'Automatic Speech Recognition (ASR) with Whisper',
      'Speaker Diarization & Audio Segmentation',
      'Real-Time Microphone Audio Transcription Pipeline'
    ]
  },
  {
    title: 'SQL for Data Analysts & Analytics Engineers',
    category: 'Data Science & AI',
    level: 'Beginner',
    description: 'Master advanced SQL window functions, common table expressions (CTEs), cohort analysis, and data modeling with dbt.',
    tags: ['SQL', 'Data Analytics', 'dbt', 'Data Science'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Advanced SQL Aggregations & Grouping Sets',
      'Window Functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD',
      'Common Table Expressions (CTEs) & Recursive Queries',
      'Cohort Retention & Funnel Conversion Analysis in SQL',
      'Data Transformation & Testing with dbt (data build tool)'
    ]
  },
  {
    title: 'Financial Machine Learning & Algorithmic Trading',
    category: 'Data Science & AI',
    level: 'Advanced',
    description: 'Quantitative finance techniques: backtesting algorithmic strategies, portfolio optimization (Markowitz), and risk models with Python.',
    tags: ['Quant', 'Finance', 'Machine Learning', 'Trading', 'Python'],
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Financial Market Data Ingestion & Returns Calculations',
      'Statistical Arbitrage & Pairs Trading Strategies',
      'Portfolio Optimization & Efficient Frontier Analysis',
      'Machine Learning Alpha Generation & Overfitting Risks',
      'Backtesting Frameworks with VectorBT and Backtrader'
    ]
  },
  {
    title: 'Practical Deep Reinforcement Learning for Robotics',
    category: 'Data Science & AI',
    level: 'Advanced',
    description: 'Train robotic arms and mobile rovers in physics simulators (PyBullet / Isaac Sim) using Proximal Policy Optimization (PPO).',
    tags: ['Robotics', 'Reinforcement Learning', 'PyBullet', 'AI'],
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Robotics Simulation in PyBullet & ROS2 Bridges',
      'Continuous Action Spaces & Actor-Critic Algorithms',
      'Proximal Policy Optimization (PPO) in Robotics',
      'Sim-to-Real Transfer & Domain Randomization',
      'Evaluating Robotic Manipulation Accuracy'
    ]
  },

  // -------------------------------------------------------------
  // 4. CLOUD & DEVOPS (15 Courses)
  // -------------------------------------------------------------
  {
    title: 'Docker & Container Orchestration for Developers',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    description: 'Master containerization: Dockerfiles, multi-stage builds, Docker Compose, volume persistence, networking, and security best practices.',
    tags: ['Docker', 'Containers', 'DevOps', 'Cloud'],
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Virtual Machines vs Linux Containers',
      'Writing Optimized Multi-Stage Dockerfiles',
      'Docker Networking & Volume Management',
      'Multi-Container Stacks with Docker Compose',
      'Container Image Security Audits & Scanning'
    ]
  },
  {
    title: 'Kubernetes in Production: Architecture, Deployments & Helm',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'Deploy, scale, and manage resilient microservices on Kubernetes using Pods, Deployments, Services, Ingress, ConfigMaps, and Helm charts.',
    tags: ['Kubernetes', 'Helm', 'DevOps', 'Cloud', 'Microservices'],
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Kubernetes Control Plane & Worker Node Architecture',
      'Deployments, ReplicaSets & Zero-Downtime Rolling Updates',
      'Networking: ClusterIP, NodePort, LoadBalancer & Ingress',
      'Configuring State with ConfigMaps, Secrets & PersistentVolumes',
      'Packaging Microservice Applications with Helm Charts'
    ]
  },
  {
    title: 'AWS Certified Solutions Architect: Cloud Engineering Track',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'Comprehensive AWS architecture: VPC design, EC2 auto-scaling, S3 security, RDS high-availability, IAM policies, and CloudWatch.',
    tags: ['AWS', 'Cloud', 'Solutions Architect', 'DevOps'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'AWS Global Infrastructure & IAM Security Governance',
      'Virtual Private Cloud (VPC) Subnetting & Gateways',
      'Compute: EC2, Auto-Scaling Groups & Application Load Balancers',
      'Storage & Databases: S3, RDS Multi-AZ & DynamoDB',
      'Serverless Foundations: AWS Lambda, API Gateway & EventBridge'
    ]
  },
  {
    title: 'CI/CD Automation Pipelines with GitHub Actions & Docker',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    description: 'Automate code testing, linting, Docker image building, and production deployment using GitHub Actions workflows.',
    tags: ['CI/CD', 'GitHub Actions', 'Automation', 'DevOps'],
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Continuous Integration Principles & Trigger Matrix',
      'GitHub Actions Syntax, Runners & Secrets Management',
      'Automated Testing & Linting Workflows',
      'Building & Pushing Docker Images to Docker Hub / ECR',
      'Deployment Stages, Approval Environments & Rollbacks'
    ]
  },
  {
    title: 'Infrastructure as Code (IaC) with Terraform & Ansible',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    description: 'Declare, version, and orchestrate cloud infrastructure across multi-cloud environments using HashiCorp Terraform and Ansible playbooks.',
    tags: ['Terraform', 'Ansible', 'IaC', 'DevOps', 'Cloud'],
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Infrastructure as Code (IaC) Paradigms & Benefits',
      'Terraform HCL Syntax, Resources & State Management',
      'Reusable Terraform Modules & Remote State Locking',
      'Configuration Management with Ansible Playbooks',
      'Automated Terraform Drift Detection in CI'
    ]
  },
  {
    title: 'Site Reliability Engineering (SRE): Monitoring with Prometheus & Grafana',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    description: 'Implement the 4 Golden Signals of monitoring, instrument services with Prometheus metrics, and create alerts in Grafana.',
    tags: ['SRE', 'Prometheus', 'Grafana', 'Monitoring', 'DevOps'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'SRE Foundations: SLIs, SLOs, SLAs & Error Budgets',
      'Prometheus Architecture, Exporters & PromQL Syntax',
      'Designing Executive Operational Dashboards in Grafana',
      'Alertmanager Rules, PagerDuty Integration & Runbooks',
      'Distributed Tracing with OpenTelemetry & Jaeger'
    ]
  },
  {
    title: 'Linux Server Administration & Bash Shell Scripting',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    description: 'Master the Linux terminal: process management, systemd services, user permissions, networking, SSH hardening, and automation scripts.',
    tags: ['Linux', 'Bash', 'SysAdmin', 'Terminal', 'DevOps'],
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Linux File Hierarchy & Command Line Navigation',
      'User Management, File Permissions & Sudo Privileges',
      'Process Monitoring, Signals & Systemd Unit Files',
      'Networking Troubleshooting: netstat, curl, iptables & SSH',
      'Writing Robust Bash Automation Scripts with Cron'
    ]
  },
  {
    title: 'Google Cloud Platform (GCP) Architecture & Cloud Run',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'Deploy serverless containerized applications on GCP Cloud Run, manage Cloud SQL databases, and configure Google IAM policies.',
    tags: ['GCP', 'Google Cloud', 'Cloud Run', 'DevOps'],
    thumbnail: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Google Cloud Project Hierarchy & Resource Manager',
      'Deploying Autoscaling Containers with Cloud Run',
      'Cloud SQL Managed Databases & Private Service Connect',
      'Asynchronous Event Pipelines with Cloud Pub/Sub',
      'GCP IAM Governance & Service Account Keys Security'
    ]
  },
  {
    title: 'Azure Cloud Fundamentals for Developers',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    description: 'Learn Microsoft Azure core services: App Services, Azure Functions, Blob Storage, Cosmos DB, and Entra ID (Azure AD) authentication.',
    tags: ['Azure', 'Microsoft', 'Cloud', 'DevOps'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Azure Subscriptions, Resource Groups & Regions',
      'Hosting Web Apps on Azure App Service',
      'Serverless Event-Driven Logic with Azure Functions',
      'Globally Distributed Data with Azure Cosmos DB',
      'Enterprise Identity with Microsoft Entra ID'
    ]
  },
  {
    title: 'GitOps Continuous Delivery with ArgoCD & Kubernetes',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    description: 'Implement declarative GitOps workflows where Git serves as the single source of truth for Kubernetes cluster deployments via ArgoCD.',
    tags: ['GitOps', 'ArgoCD', 'Kubernetes', 'DevOps'],
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'GitOps Principles & Architecture Overview',
      'Installing and Configuring ArgoCD on Kubernetes',
      'Managing Multi-Environment Clusters (Dev, Staging, Prod)',
      'Automated Sync, Self-Healing & Drift Remediation',
      'Canary & Blue-Green Deployments with Argo Rollouts'
    ]
  },
  {
    title: 'Service Mesh Architecture with Istio',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    description: 'Manage microservice traffic routing, fault injection, mutual TLS (mTLS) encryption, and distributed observability using Istio.',
    tags: ['Istio', 'Service Mesh', 'Kubernetes', 'Microservices'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Why Service Mesh? Microservices Network Challenges',
      'Istio Control Plane & Envoy Sidecar Proxy Injection',
      'Traffic Management: VirtualServices & DestinationRules',
      'Zero-Trust Security with Mutual TLS (mTLS)',
      'Circuit Breaking & Fault Injection Testing'
    ]
  },
  {
    title: 'Log Management & Centralized Observability with ELK Stack',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'Collect, parse, index, and visualize application logs at scale using Elasticsearch, Logstash, Kibana (ELK), and Filebeat.',
    tags: ['ELK', 'Elasticsearch', 'Kibana', 'Logging', 'DevOps'],
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Log Aggregation Architectural Patterns',
      'Shipping Logs with Filebeat & Logstash Filters',
      'Elasticsearch Indices, Shards & Query DSL',
      'Building Incident Investigation Dashboards in Kibana',
      'Index Lifecycle Management (ILM) & Retention Policies'
    ]
  },
  {
    title: 'Chaos Engineering: Testing System Resilience under Failure',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    description: 'Proactively inject network latency, server terminations, and disk fills into distributed clusters using Chaos Mesh and LitmusChaos.',
    tags: ['Chaos Engineering', 'Resilience', 'SRE', 'DevOps'],
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Principles of Chaos Engineering & Steady State Hypotheses',
      'Setting up Chaos Mesh in Kubernetes',
      'Simulating Network Latency, Packet Loss & DNS Failures',
      'Simulating Pod Kills & Resource Exhaustion',
      'Evaluating Automated Recovery & Incident GameDays'
    ]
  },
  {
    title: 'FinOps: Cloud Cost Optimization and Governance',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'Analyze, budget, and reduce AWS and Azure cloud spend using rightsizing, reserved instances, Spot fleets, and Kubecost.',
    tags: ['FinOps', 'Cloud Costs', 'AWS', 'Kubernetes'],
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'The FinOps Framework: Inform, Optimize, Operate',
      'AWS Cost Explorer, Budgets & Tagging Strategies',
      'EC2 Rightsizing, Savings Plans & Spot Instances',
      'Monitoring Container Spend in Kubernetes with Kubecost',
      'Automated Orphaned Resource Cleanup Scripts'
    ]
  },
  {
    title: 'Edge Computing and CDN Architecture with Cloudflare and Fastly',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'Optimize global asset distribution, caching headers (stale-while-revalidate), edge compute logic, and DDoS mitigation.',
    tags: ['CDN', 'Edge', 'Cloudflare', 'Networking'],
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'How Content Delivery Networks (CDNs) Work',
      'HTTP Caching Headers: Cache-Control, ETag & S-MaxAge',
      'Stale-While-Revalidate & Cache Invalidation Strategies',
      'Deploying Edge Workers for Geo-Routing',
      'DDoS Protection & Web Application Firewall (WAF) Rules'
    ]
  },

  // -------------------------------------------------------------
  // 5. CYBERSECURITY (10 Courses)
  // -------------------------------------------------------------
  {
    title: 'Web Application Security & OWASP Top 10 Remediation',
    category: 'Cybersecurity',
    level: 'Intermediate',
    description: 'Learn to exploit and patch the most critical web vulnerabilities: SQLi, XSS, CSRF, SSRF, Broken Access Control, and Insecure Deserialization.',
    tags: ['Security', 'OWASP', 'Penetration Testing', 'AppSec'],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'The OWASP Top 10 Security Risks Overview',
      'Injection Vulnerabilities: SQLi, NoSQLi & Command Injection',
      'Broken Access Control & IDOR Vulnerabilities',
      'Cross-Site Scripting (XSS) & Content Security Policy (CSP)',
      'Server-Side Request Forgery (SSRF) & Safe Implementations'
    ]
  },
  {
    title: 'Ethical Hacking & Penetration Testing Methodologies',
    category: 'Cybersecurity',
    level: 'Intermediate',
    description: 'Reconnaissance, network scanning with Nmap, vulnerability assessment, exploitation with Metasploit, and professional report writing.',
    tags: ['Ethical Hacking', 'Penetration Testing', 'Kali Linux', 'Metasploit'],
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Ethical Hacking Legal Frameworks & Rules of Engagement',
      'Passive & Active Reconnaissance (OSINT, Nmap)',
      'Vulnerability Scanning with Nessus & OpenVAS',
      'Exploitation Frameworks & Metasploit Basics',
      'Post-Exploitation PrivEsc & Professional Reporting'
    ]
  },
  {
    title: 'Defensive Security, SIEM & Incident Response Basics',
    category: 'Cybersecurity',
    level: 'Beginner',
    description: 'SOC analyst fundamentals: security telemetry, event correlation with Wazuh, malware triage, and incident response lifecycles.',
    tags: ['Defensive Security', 'SIEM', 'SOC', 'Incident Response'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Security Operations Center (SOC) Roles & Threat Landscape',
      'Endpoint Detection and Response (EDR) Telemetry',
      'SIEM Event Correlation & Alert Rules in Wazuh',
      'Investigating Phishing & Suspicious Network Beacons',
      'Incident Response Framework (NIST & SANS)'
    ]
  },
  {
    title: 'Cryptography Fundamentals & Secure Communications',
    category: 'Cybersecurity',
    level: 'Advanced',
    description: 'Symmetric encryption (AES-GCM), asymmetric key exchange (RSA, ECC), digital signatures, TLS 1.3 handshake, and public key infrastructure (PKI).',
    tags: ['Cryptography', 'TLS', 'PKI', 'AES', 'Security'],
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Symmetric Encryption: Block Ciphers, Modes & AES-GCM',
      'Asymmetric Cryptography: Diffie-Hellman, RSA & Elliptic Curves',
      'Hash Functions, HMACs & Digital Signatures',
      'Public Key Infrastructure (PKI) & X.509 Certificate Authorities',
      'TLS 1.3 Protocol Handshake & Perfect Forward Secrecy'
    ]
  },
  {
    title: 'API Security & OAuth2 Hardening for Backend Engineers',
    category: 'Cybersecurity',
    level: 'Advanced',
    description: 'Defend REST and GraphQL endpoints against BOLA, token replay attacks, mass assignment, and excessive data exposure.',
    tags: ['API Security', 'OAuth2', 'OWASP API', 'Backend'],
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'OWASP API Security Top 10 Vulnerabilities',
      'Broken Object Level Authorization (BOLA/IDOR) Defense',
      'Securing OAuth 2.0 & Token Introspection Protocols',
      'Preventing Mass Assignment & Data Exposure',
      'Automated API Security Testing in CI/CD'
    ]
  },
  {
    title: 'Cloud Security Posture Management (CSPM) in AWS & Azure',
    category: 'Cybersecurity',
    level: 'Intermediate',
    description: 'Audit cloud configurations, detect misconfigured S3 buckets, enforce zero-trust IAM roles, and maintain compliance standards (SOC2, ISO27001).',
    tags: ['Cloud Security', 'CSPM', 'AWS Security', 'Zero Trust'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Cloud Shared Responsibility Model & Common Misconfigurations',
      'Hardening AWS IAM: Least Privilege & Session Boundaries',
      'Securing Cloud Storage Buckets & Encrypting Data at Rest',
      'Automated Security Auditing with ScoutSuite & Prowler',
      'Continuous Compliance with CIS Benchmarks & SOC 2'
    ]
  },
  {
    title: 'DevSecOps: Integrating Security into the CI/CD Pipeline',
    category: 'Cybersecurity',
    level: 'Intermediate',
    description: 'Automate Static Application Security Testing (SAST), Software Bill of Materials (SBOM), container scanning, and secret leak detection.',
    tags: ['DevSecOps', 'CI/CD', 'SAST', 'SBOM', 'Security'],
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Shifting Security Left in the Software Development Life Cycle',
      'Automated Secret Detection with Gitleaks & Trufflehog',
      'Static Code Analysis (SAST) with Semgrep and SonarQube',
      'Software Supply Chain Security & SBOM Generation',
      'Container Image Vulnerability Scanning with Trivy'
    ]
  },
  {
    title: 'Network Defense & Firewalls: WireGuard, pfSense, and Snort',
    category: 'Cybersecurity',
    level: 'Intermediate',
    description: 'Design secure network zones, configure modern WireGuard VPN tunnels, and detect intrusion attempts with Snort IDS/IPS.',
    tags: ['Networking', 'VPN', 'Firewalls', 'IDS', 'Security'],
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Network Segmentation, DMZs & VLAN Topologies',
      'Stateful Packet Inspection with pfSense Firewall',
      'Modern High-Speed VPNs with WireGuard',
      'Intrusion Detection & Prevention Systems (Snort / Suricata)',
      'Defending Against Denial-of-Service (DDoS) Attacks'
    ]
  },
  {
    title: 'Malware Analysis & Reverse Engineering Fundamentals',
    category: 'Cybersecurity',
    level: 'Advanced',
    description: 'Safely disassemble and analyze suspicious binaries in an isolated sandbox using Ghidra, x64dbg, and behavioral analysis tools.',
    tags: ['Malware Analysis', 'Reverse Engineering', 'Ghidra', 'Security'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Setting up a Safe Malware Analysis Lab Environment',
      'Static Analysis: Strings, PE Headers & Hashes',
      'Dynamic Behavioral Analysis in Sandboxes',
      'Disassembling x86/x64 Binaries with Ghidra',
      'Documenting Indicators of Compromise (IoCs)'
    ]
  },
  {
    title: 'Social Engineering Defense & Cybersecurity Awareness',
    category: 'Cybersecurity',
    level: 'Beginner',
    description: 'Recognize sophisticated phishing, spear-phishing, credential harvesting, and business email compromise (BEC) attacks.',
    tags: ['Social Engineering', 'Phishing', 'Awareness', 'Security'],
    thumbnail: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Human Psychology & Social Engineering Tactics',
      'Anatomy of Spear-Phishing & Quishing (QR Code) Attacks',
      'Business Email Compromise (BEC) Prevention',
      'Password Hygiene, Managers & Multi-Factor Authentication',
      'Establishing a Resilient Security Culture in Organizations'
    ]
  },

  // -------------------------------------------------------------
  // 6. SOFTWARE ARCHITECTURE (10 Courses)
  // -------------------------------------------------------------
  {
    title: 'Clean Architecture & Domain-Driven Design (DDD) in Node.js',
    category: 'Software Architecture',
    level: 'Advanced',
    description: 'Implement onion/hexagonal architecture, bounded contexts, entities, value objects, aggregates, and domain events in enterprise Node.js.',
    tags: ['Architecture', 'Clean Architecture', 'DDD', 'Node.js', 'Design Patterns'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'The Clean Architecture Paradigm & Separation of Concerns',
      'Strategic Domain-Driven Design: Ubiquitous Language & Bounded Contexts',
      'Tactical DDD: Entities, Value Objects & Aggregates',
      'Domain Events & Asynchronous Outbox Pattern',
      'Repository Pattern & Decoupling Persistence Frameworks'
    ]
  },
  {
    title: 'High-Performance System Design for Distributed Scale',
    category: 'Software Architecture',
    level: 'Advanced',
    description: 'Learn the architectural blueprints behind systems handling millions of requests: sharding, caching, CAP theorem, and event streaming.',
    tags: ['System Design', 'Scalability', 'Distributed Systems', 'Architecture'],
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Distributed Systems Principles: CAP Theorem & PACELC',
      'Scalable Caching Strategies: Write-Through, Write-Behind, Cache-Aside',
      'Database Sharding & Consistent Hashing Rings',
      'Rate Limiters, Token Bucket & Circuit Breaker Patterns',
      'Designing Real-World Systems: Twitter Timeline & URL Shortener'
    ]
  },
  {
    title: 'Design Patterns in Modern JavaScript & TypeScript',
    category: 'Software Architecture',
    level: 'Intermediate',
    description: 'Creational, structural, and behavioral design patterns: Factory, Singleton, Strategy, Observer, Decorator, and Adapter applied in modern TS.',
    tags: ['Design Patterns', 'TypeScript', 'JavaScript', 'Architecture'],
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc155d9c222?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Object-Oriented & Functional Programming Paradigms in TypeScript',
      'Creational Patterns: Factory Method, Builder & Singleton',
      'Structural Patterns: Adapter, Composite & Proxy',
      'Behavioral Patterns: Strategy, Observer, Command & State',
      'Refactoring Legacy Spaghetti Code into Elegant Patterns'
    ]
  },
  {
    title: 'Event-Driven Architecture with Apache Kafka & RabbitMQ',
    category: 'Software Architecture',
    level: 'Advanced',
    description: 'Build decoupled, fault-tolerant distributed systems using message queues, pub/sub topics, consumer groups, and event sourcing.',
    tags: ['Kafka', 'RabbitMQ', 'Event-Driven', 'Microservices'],
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Message Queues vs Event Streams: RabbitMQ vs Apache Kafka',
      'Kafka Architecture: Topics, Partitions & Consumer Offsets',
      'Event Sourcing & CQRS (Command Query Responsibility Segregation)',
      'Idempotent Event Consumers & Dead Letter Queues (DLQ)',
      'Transactional Outbox Pattern for Distributed Consistency'
    ]
  },
  {
    title: 'Database Reliability Engineering & High Availability',
    category: 'Software Architecture',
    level: 'Advanced',
    description: 'Ensure 99.999% uptime for database tiers: replication topologies, failover automation, connection pooling, and online migrations.',
    tags: ['Database', 'High Availability', 'Replication', 'SRE'],
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Database Replication Architectures: Master-Replica & Multi-Master',
      'Automated Failover Protocols (Raft & Paxos)',
      'Connection Pooling at Scale with PgBouncer',
      'Zero-Downtime Database Schema Migrations (Expand/Contract)',
      'Disaster Recovery Planning: RPO and RTO Targets'
    ]
  },
  {
    title: 'API Gateway Architecture & Service Mesh Integration',
    category: 'Software Architecture',
    level: 'Intermediate',
    description: 'Centralize routing, authentication, rate limiting, and observability for microservices using Kong, Envoy, and Express Gateway.',
    tags: ['API Gateway', 'Kong', 'Microservices', 'Architecture'],
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'The API Gateway Pattern & Backend-for-Frontend (BFF)',
      'Configuring Kong API Gateway Routes and Plugins',
      'Centralized Authentication & JWT Verification',
      'Request Throttling, Quotas & Distributed Rate Limiting',
      'Telemetry Logging & Edge Error Normalization'
    ]
  },
  {
    title: 'Microservices Decomposition: Breaking the Monolith',
    category: 'Software Architecture',
    level: 'Advanced',
    description: 'Strategic roadmap for migrating legacy monolithic codebases into autonomous microservices using the Strangler Fig pattern.',
    tags: ['Microservices', 'Refactoring', 'Migration', 'Architecture'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Monolith vs Microservices: Assessing Organizational Readiness',
      'The Strangler Fig Pattern: Incremental Service Extraction',
      'Decoupling Monolithic Shared Databases',
      'Managing Distributed Transactions with the Saga Pattern',
      'Service Boundaries & Independent Deployment Pipelines'
    ]
  },
  {
    title: 'Asynchronous Programming & Concurrency Models Decoded',
    category: 'Software Architecture',
    level: 'Intermediate',
    description: 'Deep dive into event loops, thread pools, green threads, coroutines, reactive streams, and lock-free data structures.',
    tags: ['Concurrency', 'Async', 'Event Loop', 'Architecture'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Operating System Threads, Processes & Context Switching',
      'The Node.js Event Loop & Libuv Architecture',
      'Actor Model & Message Passing Concurrency',
      'Reactive Extensions (RxJS) & Observable Streams',
      'Deadlocks, Race Conditions & Mutex Locking Strategies'
    ]
  },
  {
    title: 'Legacy Code Modernization & Technical Debt Management',
    category: 'Software Architecture',
    level: 'Intermediate',
    description: 'Turn unmaintainable legacy applications into tested, documented, modern codebases without halting ongoing feature delivery.',
    tags: ['Legacy Code', 'Refactoring', 'Technical Debt', 'Software Engineering'],
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Characterizing Legacy Code & Quantifying Technical Debt',
      'Characterization Tests: Adding Tests to Untested Codebases',
      'Safe Refactoring Techniques (Martin Fowler Patterns)',
      'Modularizing Spaghetti Code with Facades & Adapters',
      'Continuous Code Quality Metrics in Pull Requests'
    ]
  },
  {
    title: 'Serverless Architecture & Cloud Native Patterns',
    category: 'Software Architecture',
    level: 'Intermediate',
    description: 'Design highly available, zero-maintenance backend systems using serverless functions, managed event buses, and pay-per-execution cloud services.',
    tags: ['Serverless', 'Cloud Native', 'AWS Lambda', 'Architecture'],
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'The Serverless Mental Model & Cold Start Mitigation',
      'Event-Driven Choreography with EventBridge & SQS',
      'Serverless Relational & NoSQL Data Access Patterns',
      'Observability in Distributed Serverless Architectures',
      'Local Testing & Emulation of Serverless Cloud Stacks'
    ]
  },

  // -------------------------------------------------------------
  // 7. UI/UX DESIGN (10 Courses)
  // -------------------------------------------------------------
  {
    title: 'UI/UX Design Systems with Figma: From Wireframe to Code',
    category: 'UI/UX Design',
    level: 'Intermediate',
    description: 'Master Figma variables, auto layout, component variants, interactive prototypes, and seamless developer handoff workflows.',
    tags: ['Figma', 'UI/UX', 'Design System', 'Product Design'],
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Design System Foundations: Design Tokens & Variables in Figma',
      'Advanced Auto Layout: Responsive Padding, Hug & Fill',
      'Component Properties & Interactive Variants',
      'Interactive Prototyping with Smart Animate',
      'Developer Handoff: Specs, Assets & Code Connect'
    ]
  },
  {
    title: 'User Research, Interviews & Usability Testing in Practice',
    category: 'UI/UX Design',
    level: 'Beginner',
    description: 'Conduct insightful user interviews, synthesize qualitative findings into affinity maps, build personas, and run unmoderated user tests.',
    tags: ['User Research', 'UX', 'Usability Testing', 'Product Design'],
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'UX Research Methodologies: Qualitative vs Quantitative',
      'Formulating Unbiased User Interview Questionnaires',
      'Synthesizing Insights with Affinity Diagrams & Personas',
      'Running Moderated and Unmoderated Usability Tests',
      'Translating Findings into Actionable Product Requirements'
    ]
  },
  {
    title: 'Interactive Prototyping & Micro-Interactions in Figma',
    category: 'UI/UX Design',
    level: 'Intermediate',
    description: 'Delight users with thoughtful micro-interactions: animated button states, skeleton loaders, drawer transitions, and haptic feedback design.',
    tags: ['Prototyping', 'Figma', 'Micro-interactions', 'UI Design'],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'The Science of Micro-Interactions & User Delight',
      'Figma Smart Animate Timing Curves (Ease In/Out, Spring)',
      'Interactive Form Fields & Error State Transitions',
      'Skeleton Loaders, Progress Spinners & Empty States',
      'Exporting Animation Specs for React & CSS'
    ]
  },
  {
    title: 'Typography, Color Theory & Visual Hierarchy for Digital Products',
    category: 'UI/UX Design',
    level: 'Beginner',
    description: 'Learn the core principles of visual layout: type pairings, modular scales, contrast ratios, 60-30-10 color rules, and whitespace balance.',
    tags: ['Typography', 'Color Theory', 'Visual Design', 'UI'],
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Visual Hierarchy & Scanning Patterns (F-Pattern & Z-Pattern)',
      'Digital Typography: Modular Scales, Leading & Hierarchy',
      'Color Harmonies & Accessible Contrast Ratios (WCAG AA)',
      'The Power of Negative Space & 8pt Grid Systems',
      'Evaluating UI Designs with Heuristic Checklists'
    ]
  },
  {
    title: 'Designing Mobile Interfaces for iOS and Android',
    category: 'UI/UX Design',
    level: 'Intermediate',
    description: 'Compare Apple Human Interface Guidelines and Google Material Design 3 to craft native-feeling mobile applications.',
    tags: ['Mobile UI', 'Material 3', 'iOS Guidelines', 'UX Design'],
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Apple Human Interface Guidelines vs Material Design 3',
      'Touch Target Ergonomics & Mobile Thumb Zones',
      'Mobile Navigation Paradigms: Tabs, Drawers & Stacks',
      'Responsive Scaling Across Foldable & Tablet Displays',
      'Dark Mode Theming Guidelines for Mobile Screens'
    ]
  },
  {
    title: 'Design for Conversion: Landing Page & Checkout UX Optimization',
    category: 'UI/UX Design',
    level: 'Intermediate',
    description: 'Optimize user journeys to maximize signups and purchases: reduce cognitive load, write compelling copy, and conduct A/B test experiments.',
    tags: ['Conversion UX', 'CRO', 'Landing Pages', 'E-Commerce'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Conversion Rate Optimization (CRO) Core Metrics',
      'Hero Section Blueprint: Value Propositions & Call-to-Actions',
      'Minimizing Friction in Registration & Onboarding Flows',
      'Frictionless Checkout UX: Forms, Trust Badges & Payments',
      'Setting up A/B Tests and Analyzing Heatmaps'
    ]
  },
  {
    title: 'Information Architecture & Navigation Systems Design',
    category: 'UI/UX Design',
    level: 'Intermediate',
    description: 'Structure complex web platforms: card sorting, tree testing, sitemaps, breadcrumbs, faceted search, and content taxonomies.',
    tags: ['Information Architecture', 'Sitemaps', 'UX', 'Navigation'],
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Information Architecture Fundamentals & Mental Models',
      'User Research Methods: Open & Closed Card Sorting',
      'Evaluating Navigation Hierarchies with Tree Testing',
      'Designing Complex Mega-Menus & Breadcrumb Systems',
      'Faceted Search & Multi-Filter Filtering UX'
    ]
  },
  {
    title: 'Accessible Design: Inclusive Color Palettes & Screen Reader UX',
    category: 'UI/UX Design',
    level: 'Beginner',
    description: 'Design digital products accessible to everyone, including color-blind, visually impaired, motor-impaired, and neurodiverse users.',
    tags: ['Accessibility', 'Inclusive Design', 'a11y', 'UI Design'],
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'Understanding Diverse Disabilities & Assistive Technologies',
      'Color Blindness Simulations & Accessible Palette Generation',
      'Designing Focus States & Keyboard Navigation Targets',
      'Writing Clear Alt Text & Audio Descriptions for UI',
      'Accessible Form Input Error States & Guidance'
    ]
  },
  {
    title: 'Design Ops: Scaling Design Teams and Workflows',
    category: 'UI/UX Design',
    level: 'Advanced',
    description: 'Standardize design file naming, version control, branching in Figma, design-to-development governance, and team alignment.',
    tags: ['DesignOps', 'Figma', 'Product Teams', 'Management'],
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'What is DesignOps? Pillars, People & Processes',
      'Figma File Organization, Branching & Merge Reviews',
      'Design Token Versioning & Synchronizing with GitHub',
      'Cross-Functional Design-Development Critique Ceremonies',
      'Measuring Design System Adoption & Impact Metrics'
    ]
  },
  {
    title: 'UX Writing & Content Design for Digital Products',
    category: 'UI/UX Design',
    level: 'Beginner',
    description: 'Craft clear, concise, human microcopy: button labels, error messages, onboarding tooltips, empty states, and voice-and-tone guides.',
    tags: ['UX Writing', 'Content Design', 'Microcopy', 'Product Design'],
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=60',
    chapterTitles: [
      'The Role of UX Writing in Modern Product Interfaces',
      'Writing Actionable Call-to-Actions (CTAs) & Button Text',
      'Constructive Error Messages & De-escalation Copy',
      'Onboarding Walkthroughs, Tooltips & Empty State Copy',
      'Creating a Brand Voice, Tone & Product Glossary Guide'
    ]
  }
];
