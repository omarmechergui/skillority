/**
 * Comprehensive Career Paths Seed Data for Skillority
 * Covers all 13 standard professions with proficiency levels,
 * importance weights, skill requirements, and learning milestones.
 */

export const INITIAL_CAREER_PATHS = [
  {
    title: 'Frontend Developer',
    slug: 'frontend-developer',
    category: 'Software Engineering',
    industry: 'Information Technology',
    difficultyLevel: 'INTERMEDIATE',
    estimatedDuration: '6-9 months',
    description: 'Design and build engaging, responsive, and accessible user interfaces for modern web applications using HTML5, CSS3, JavaScript, React, and Next.js.',
    salaryRange: '$70,000 - $115,000 / yr',
    jobOutlook: '+16% growth over 5 years (High Demand)',
    employmentOpportunities: 'Frontend Engineer, UI Engineer, React Developer, Web Application Developer',
    requiredSkills: [
      { name: 'JavaScript', proficiency: 'Advanced', importance: 'CORE', weight: 25, description: 'Modern ES6+ syntax, asynchronous programming, closures, and DOM manipulation.' },
      { name: 'React', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'Component lifecycle, hooks, state management, and component composition.' },
      { name: 'HTML5 & CSS3', proficiency: 'Advanced', importance: 'CORE', weight: 20, description: 'Semantic markup, modern layout techniques (Flexbox, Grid), and responsive design.' },
      { name: 'Tailwind CSS', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Utility-first styling, configuration, and design system integration.' },
      { name: 'Git & GitHub', proficiency: 'Basic', importance: 'IMPORTANT', weight: 15, description: 'Version control workflows, branching, pull requests, and merge conflict resolution.' }
    ],
    recommendedSkills: [
      { name: 'Next.js', proficiency: 'Intermediate', importance: 'RECOMMENDED' },
      { name: 'TypeScript', proficiency: 'Basic', importance: 'RECOMMENDED' },
      { name: 'Web Performance Optimization', proficiency: 'Intermediate', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'GraphQL', proficiency: 'Basic' },
      { name: 'Testing Library & Jest', proficiency: 'Basic' },
      { name: 'Figma for Developers', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'MDN Web Docs — JavaScript Guide', url: 'https://developer.mozilla.org', type: 'DOCUMENTATION', isFree: true },
      { title: 'React Documentation', url: 'https://react.dev', type: 'DOCUMENTATION', isFree: true }
    ],
    relatedCareerSlugs: ['full-stack-developer', 'ui-ux-designer', 'mobile-developer'],
    isActive: true
  },
  {
    title: 'Backend Developer',
    slug: 'backend-developer',
    category: 'Software Engineering',
    industry: 'Information Technology',
    difficultyLevel: 'INTERMEDIATE',
    estimatedDuration: '6-9 months',
    description: 'Engineer robust server-side architectures, RESTful APIs, data persistence layers, caching, and scalable microservices.',
    salaryRange: '$75,000 - $125,000 / yr',
    jobOutlook: '+18% growth over 5 years (Very High Demand)',
    employmentOpportunities: 'Backend Engineer, API Developer, Node.js Engineer, Systems Programmer',
    requiredSkills: [
      { name: 'Node.js', proficiency: 'Advanced', importance: 'CORE', weight: 25, description: 'Event loop, streams, non-blocking I/O, and Express/Fastify architectures.' },
      { name: 'Database Design & SQL/NoSQL', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'Relational modeling, MongoDB, PostgreSQL, indexing, and Prisma ORM.' },
      { name: 'REST & GraphQL APIs', proficiency: 'Intermediate', importance: 'CORE', weight: 20, description: 'API contract design, authentication (JWT, OAuth), rate limiting, and HTTP semantics.' },
      { name: 'System Architecture & Security', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'OWASP security guidelines, input validation, hashing, and authorization.' },
      { name: 'Docker Basics', proficiency: 'Basic', importance: 'IMPORTANT', weight: 15, description: 'Containerization, docker-compose, and environment reproduction.' }
    ],
    recommendedSkills: [
      { name: 'Redis Caching', proficiency: 'Intermediate', importance: 'RECOMMENDED' },
      { name: 'Prisma ORM', proficiency: 'Intermediate', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'Microservices & Message Queues (Kafka/RabbitMQ)', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'Node.js Design Patterns', url: 'https://nodejs.org', type: 'GUIDE', isFree: true }
    ],
    relatedCareerSlugs: ['full-stack-developer', 'devops-engineer', 'cloud-engineer'],
    isActive: true
  },
  {
    title: 'Full-Stack Developer',
    slug: 'full-stack-developer',
    category: 'Software Engineering',
    industry: 'Information Technology',
    difficultyLevel: 'ADVANCED',
    estimatedDuration: '9-12 months',
    description: 'Master end-to-end web engineering, bridging dynamic client applications with performant backends, databases, and deployment pipelines.',
    salaryRange: '$80,000 - $135,000 / yr',
    jobOutlook: '+20% growth (Top Hiring Volume)',
    employmentOpportunities: 'Full-Stack Engineer, Software Engineer, Technical Founder, Web App Architect',
    requiredSkills: [
      { name: 'JavaScript & Node.js', proficiency: 'Advanced', importance: 'CORE', weight: 25, description: 'Full JavaScript ecosystem on client and server.' },
      { name: 'React & Next.js', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'Modern React App Router, SSR, and client state.' },
      { name: 'Database Management (MongoDB / PostgreSQL)', proficiency: 'Intermediate', importance: 'CORE', weight: 20, description: 'Data schemas, Prisma, aggregation, and migrations.' },
      { name: 'API Integration & Authentication', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'JWT, session cookies, CORS, and endpoint security.' },
      { name: 'Git & Deployment', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Git versioning, CI/CD basics, and cloud deployment.' }
    ],
    recommendedSkills: [
      { name: 'TypeScript', proficiency: 'Intermediate', importance: 'RECOMMENDED' },
      { name: 'Tailwind CSS', proficiency: 'Intermediate', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'Docker', proficiency: 'Basic' },
      { name: 'Cloud Infrastructure', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'Full Stack Open', url: 'https://fullstackopen.com', type: 'COURSE', isFree: true }
    ],
    relatedCareerSlugs: ['frontend-developer', 'backend-developer', 'devops-engineer'],
    isActive: true
  },
  {
    title: 'Mobile Developer',
    slug: 'mobile-developer',
    category: 'Mobile Engineering',
    industry: 'Information Technology',
    difficultyLevel: 'INTERMEDIATE',
    estimatedDuration: '6-9 months',
    description: 'Build native and cross-platform mobile apps for iOS and Android with React Native or Flutter, offline storage, and smooth native gestures.',
    salaryRange: '$75,000 - $120,000 / yr',
    jobOutlook: '+14% growth (High Demand)',
    employmentOpportunities: 'React Native Developer, Mobile App Engineer, iOS/Android Engineer',
    requiredSkills: [
      { name: 'React Native', proficiency: 'Intermediate', importance: 'CORE', weight: 30, description: 'Cross-platform app development, navigation, and gestures.' },
      { name: 'JavaScript', proficiency: 'Advanced', importance: 'CORE', weight: 25, description: 'Core language, async workflows, and mobile performance.' },
      { name: 'Mobile UI & Responsive Design', proficiency: 'Intermediate', importance: 'CORE', weight: 20, description: 'Device adaptation, safe areas, and touch interactions.' },
      { name: 'REST API Consumption', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Fetching, caching, and background synchronization.' },
      { name: 'App Store / Play Store Deployment', proficiency: 'Basic', importance: 'IMPORTANT', weight: 10, description: 'Packaging, certificate signing, and submission pipelines.' }
    ],
    recommendedSkills: [
      { name: 'TypeScript', proficiency: 'Intermediate', importance: 'RECOMMENDED' },
      { name: 'Expo Framework', proficiency: 'Intermediate', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'Swift Basics', proficiency: 'Beginner' },
      { name: 'Kotlin Basics', proficiency: 'Beginner' }
    ],
    learningResources: [
      { title: 'React Native Docs', url: 'https://reactnative.dev', type: 'DOCUMENTATION', isFree: true }
    ],
    relatedCareerSlugs: ['frontend-developer', 'ui-ux-designer'],
    isActive: true
  },
  {
    title: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    category: 'Product Design',
    industry: 'Creative & Design',
    difficultyLevel: 'BEGINNER',
    estimatedDuration: '4-6 months',
    description: 'Transform complex workflows into intuitive user experiences, design systems, wireframes, prototypes, and user research protocols.',
    salaryRange: '$65,000 - $110,000 / yr',
    jobOutlook: '+15% growth',
    employmentOpportunities: 'Product Designer, UX Researcher, UI Designer, Design System Lead',
    requiredSkills: [
      { name: 'Figma', proficiency: 'Advanced', importance: 'CORE', weight: 30, description: 'Components, auto-layout, design tokens, and interactive prototyping.' },
      { name: 'User Research & Persona Design', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'User interviews, usability testing, and journey mapping.' },
      { name: 'Information Architecture & Wireframing', proficiency: 'Intermediate', importance: 'CORE', weight: 20, description: 'Site maps, low-fidelity wireframing, and user flows.' },
      { name: 'Design Systems & Accessibility (a11y)', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'WCAG standards, contrast, color theory, and reusable components.' },
      { name: 'UI Prototyping', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 10, description: 'High-fidelity animations, micro-interactions, and handoff.' }
    ],
    recommendedSkills: [
      { name: 'Design Tokens', proficiency: 'Basic', importance: 'RECOMMENDED' },
      { name: 'Basic HTML/CSS', proficiency: 'Basic', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'Framer / Webflow', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'Figma Community Guides', url: 'https://help.figma.com', type: 'GUIDE', isFree: true }
    ],
    relatedCareerSlugs: ['frontend-developer', 'product-manager'],
    isActive: true
  },
  {
    title: 'Data Analyst',
    slug: 'data-analyst',
    category: 'Data & Analytics',
    industry: 'Information Technology',
    difficultyLevel: 'BEGINNER',
    estimatedDuration: '4-6 months',
    description: 'Extract business insights from raw data using SQL, statistical modeling, spreadsheet analysis, and interactive business intelligence dashboards.',
    salaryRange: '$65,000 - $100,000 / yr',
    jobOutlook: '+23% growth (High Demand)',
    employmentOpportunities: 'Data Analyst, BI Analyst, Operations Analyst, Marketing Data Analyst',
    requiredSkills: [
      { name: 'SQL', proficiency: 'Advanced', importance: 'CORE', weight: 30, description: 'Complex joins, aggregations, window functions, and query optimization.' },
      { name: 'Python for Data Analysis', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'Pandas, NumPy, and data cleaning pipelines.' },
      { name: 'Data Visualization (PowerBI / Tableau)', proficiency: 'Intermediate', importance: 'CORE', weight: 20, description: 'Executive dashboards, charts, and metric reporting.' },
      { name: 'Statistics & Hypothesis Testing', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Distributions, variance, confidence intervals, and A/B testing.' },
      { name: 'Excel / Spreadsheets Modeling', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 10, description: 'Pivot tables, VLOOKUP/XLOOKUP, and business financial models.' }
    ],
    recommendedSkills: [
      { name: 'Data Warehousing Basics', proficiency: 'Basic', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'R Programming', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'Kaggle Learn', url: 'https://kaggle.com/learn', type: 'TUTORIAL', isFree: true }
    ],
    relatedCareerSlugs: ['data-scientist', 'product-manager'],
    isActive: true
  },
  {
    title: 'Data Scientist',
    slug: 'data-scientist',
    category: 'Data & Analytics',
    industry: 'Information Technology',
    difficultyLevel: 'ADVANCED',
    estimatedDuration: '9-12 months',
    description: 'Develop predictive models, machine learning algorithms, and deep statistical analysis to solve complex operational challenges.',
    salaryRange: '$90,000 - $145,000 / yr',
    jobOutlook: '+35% growth (Very High Demand)',
    employmentOpportunities: 'Data Scientist, Machine Learning Scientist, Quantitative Analyst',
    requiredSkills: [
      { name: 'Python', proficiency: 'Advanced', importance: 'CORE', weight: 25, description: 'Object-oriented Python, scientific computing, and vectorization.' },
      { name: 'Machine Learning Algorithms', proficiency: 'Advanced', importance: 'CORE', weight: 25, description: 'Regression, classification, clustering, random forests, and gradient boosting.' },
      { name: 'Advanced Statistics & Mathematics', proficiency: 'Advanced', importance: 'CORE', weight: 20, description: 'Linear algebra, calculus, probability distributions, and inferential statistics.' },
      { name: 'Data Wrangling & Feature Engineering', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Dimensionality reduction, PCA, scaling, and handling imbalanced datasets.' },
      { name: 'SQL & Big Data', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Complex querying, Spark basics, and data pipelines.' }
    ],
    recommendedSkills: [
      { name: 'Deep Learning Basics (PyTorch/TensorFlow)', proficiency: 'Intermediate', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'MLOps & Model Deployment', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'Scikit-Learn Documentation', url: 'https://scikit-learn.org', type: 'DOCUMENTATION', isFree: true }
    ],
    relatedCareerSlugs: ['data-analyst', 'ai-ml-engineer'],
    isActive: true
  },
  {
    title: 'AI/ML Engineer',
    slug: 'ai-ml-engineer',
    category: 'Artificial Intelligence',
    industry: 'Information Technology',
    difficultyLevel: 'ADVANCED',
    estimatedDuration: '9-12 months',
    description: 'Design, train, and deploy artificial intelligence models, LLM systems, transformer architectures, and production inference pipelines.',
    salaryRange: '$95,000 - $160,000 / yr',
    jobOutlook: '+40% growth (Top Emerging Discipline)',
    employmentOpportunities: 'AI Engineer, Machine Learning Engineer, NLP Engineer, Computer Vision Engineer',
    requiredSkills: [
      { name: 'Python & PyTorch', proficiency: 'Advanced', importance: 'CORE', weight: 25, description: 'Neural network design, tensors, backpropagation, and PyTorch training loops.' },
      { name: 'LLMs & Transformer Architectures', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'Prompt engineering, fine-tuning, embeddings, and vector databases.' },
      { name: 'MLOps & Model Serving', proficiency: 'Intermediate', importance: 'CORE', weight: 20, description: 'FastAPI, Docker, model quantization, and ONNX runtime.' },
      { name: 'Data Pipelines & Preprocessing', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Tokenization, data cleansing, and streaming ingestion.' },
      { name: 'Math & Linear Algebra', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Matrix calculus, optimization algorithms, and regularization.' }
    ],
    recommendedSkills: [
      { name: 'LangChain & LlamaIndex', proficiency: 'Intermediate', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'CUDA & GPU Optimization', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'Hugging Face Courses', url: 'https://huggingface.co/learn', type: 'COURSE', isFree: true }
    ],
    relatedCareerSlugs: ['data-scientist', 'cloud-engineer', 'backend-developer'],
    isActive: true
  },
  {
    title: 'Cybersecurity Analyst',
    slug: 'cybersecurity-analyst',
    category: 'Security & Operations',
    industry: 'Information Technology',
    difficultyLevel: 'INTERMEDIATE',
    estimatedDuration: '6-9 months',
    description: 'Defend systems and networks from cyber threats, conduct vulnerability assessments, manage incident response, and enforce security policies.',
    salaryRange: '$75,000 - $125,000 / yr',
    jobOutlook: '+32% growth (Very High Demand)',
    employmentOpportunities: 'Security Analyst, SOC Analyst, Information Security Specialist, Pentester',
    requiredSkills: [
      { name: 'Network Security & Protocols', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'TCP/IP, DNS, VPNs, firewalls, and packet analysis with Wireshark.' },
      { name: 'Threat Detection & SIEM', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'Log analysis, Splunk, Elastic, alert triage, and intrusion detection.' },
      { name: 'Vulnerability Assessment', proficiency: 'Intermediate', importance: 'CORE', weight: 20, description: 'Nessus, Nmap, OWASP Top 10, and patch management.' },
      { name: 'Operating System Security (Linux/Windows)', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Access controls, auditing, privilege management, and shell scripting.' },
      { name: 'Incident Response & Compliance', proficiency: 'Basic', importance: 'IMPORTANT', weight: 15, description: 'IR procedures, evidence preservation, ISO 27001, and GDPR basics.' }
    ],
    recommendedSkills: [
      { name: 'Python for Security Automation', proficiency: 'Intermediate', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'Ethical Hacking / Penetration Testing', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'OWASP Security Guide', url: 'https://owasp.org', type: 'GUIDE', isFree: true }
    ],
    relatedCareerSlugs: ['devops-engineer', 'cloud-engineer'],
    isActive: true
  },
  {
    title: 'DevOps Engineer',
    slug: 'devops-engineer',
    category: 'Cloud & Infrastructure',
    industry: 'Information Technology',
    difficultyLevel: 'ADVANCED',
    estimatedDuration: '9-12 months',
    description: 'Bridge software development and IT operations through automated CI/CD pipelines, container orchestration, monitoring, and infrastructure-as-code.',
    salaryRange: '$85,000 - $140,000 / yr',
    jobOutlook: '+25% growth (High Demand)',
    employmentOpportunities: 'DevOps Engineer, SRE, Platform Engineer, Infrastructure Specialist',
    requiredSkills: [
      { name: 'CI/CD Pipelines (GitHub Actions / GitLab)', proficiency: 'Advanced', importance: 'CORE', weight: 25, description: 'Automated test, build, artifact caching, and zero-downtime deployment.' },
      { name: 'Docker & Containerization', proficiency: 'Advanced', importance: 'CORE', weight: 25, description: 'Multi-stage builds, image optimization, and container security.' },
      { name: 'Linux System Administration', proficiency: 'Advanced', importance: 'CORE', weight: 20, description: 'Shell scripting (Bash), systemd, networking, and permissions.' },
      { name: 'Kubernetes', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Pods, deployments, services, ingress controllers, and Helm charts.' },
      { name: 'Monitoring & Observability (Prometheus / Grafana)', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Metrics collection, log centralization, alerting, and SLA/SLO tracking.' }
    ],
    recommendedSkills: [
      { name: 'Terraform (Infrastructure as Code)', proficiency: 'Intermediate', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'Ansible / Configuration Management', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'DevOps Roadmap', url: 'https://roadmap.sh/devops', type: 'ROADMAP', isFree: true }
    ],
    relatedCareerSlugs: ['cloud-engineer', 'backend-developer', 'cybersecurity-analyst'],
    isActive: true
  },
  {
    title: 'Cloud Engineer',
    slug: 'cloud-engineer',
    category: 'Cloud & Infrastructure',
    industry: 'Information Technology',
    difficultyLevel: 'ADVANCED',
    estimatedDuration: '9-12 months',
    description: 'Architect, implement, and maintain highly available cloud systems across AWS, GCP, or Azure with security and cost optimization.',
    salaryRange: '$85,000 - $140,000 / yr',
    jobOutlook: '+26% growth (High Demand)',
    employmentOpportunities: 'Cloud Architect, Cloud Solutions Engineer, Cloud Security Specialist',
    requiredSkills: [
      { name: 'Cloud Provider Core (AWS / GCP / Azure)', proficiency: 'Advanced', importance: 'CORE', weight: 30, description: 'Compute (EC2/Lambda), storage (S3), networking (VPC), and IAM security.' },
      { name: 'Infrastructure as Code (Terraform)', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'Declarative resource provisioning, state management, and modules.' },
      { name: 'Cloud Networking & DNS', proficiency: 'Intermediate', importance: 'CORE', weight: 20, description: 'Subnets, routing tables, NAT gateways, CDN, and Route 53.' },
      { name: 'Cost Optimization & Monitoring', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Resource right-sizing, auto-scaling, billing alarms, and CloudWatch.' },
      { name: 'Security & Compliance in Cloud', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 10, description: 'Least-privilege policies, KMS encryption at rest and in transit.' }
    ],
    recommendedSkills: [
      { name: 'Serverless Architecture', proficiency: 'Intermediate', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'Multi-Cloud Management', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'AWS Well-Architected Framework', url: 'https://aws.amazon.com/architecture/well-architected', type: 'GUIDE', isFree: true }
    ],
    relatedCareerSlugs: ['devops-engineer', 'backend-developer'],
    isActive: true
  },
  {
    title: 'QA Engineer',
    slug: 'qa-engineer',
    category: 'Quality Assurance',
    industry: 'Information Technology',
    difficultyLevel: 'BEGINNER',
    estimatedDuration: '4-6 months',
    description: 'Ensure software reliability through automated test suites, end-to-end browser testing, API test harnesses, and regression prevention.',
    salaryRange: '$60,000 - $100,000 / yr',
    jobOutlook: '+12% growth',
    employmentOpportunities: 'SDET, Automation QA Engineer, Quality Engineer, Manual Test Specialist',
    requiredSkills: [
      { name: 'Automated Testing (Playwright / Cypress)', proficiency: 'Intermediate', importance: 'CORE', weight: 30, description: 'End-to-end browser automation, locator strategies, and assertions.' },
      { name: 'API Testing (Postman / Jest / Supertest)', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'HTTP verification, payload assertions, edge cases, and mocking.' },
      { name: 'Test Planning & Bug Reporting', proficiency: 'Intermediate', importance: 'CORE', weight: 20, description: 'Test matrix creation, edge-case analysis, reproduction steps, and Jira.' },
      { name: 'JavaScript / Python for Scripting', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Test scripts, fixtures, data generators, and async execution.' },
      { name: 'CI/CD Test Integration', proficiency: 'Basic', importance: 'IMPORTANT', weight: 10, description: 'Running headless test suites in GitHub Actions pipelines.' }
    ],
    recommendedSkills: [
      { name: 'Performance & Load Testing (k6 / Artillery)', proficiency: 'Basic', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'Security / Penetration Testing Basics', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'Playwright Documentation', url: 'https://playwright.dev', type: 'DOCUMENTATION', isFree: true }
    ],
    relatedCareerSlugs: ['frontend-developer', 'backend-developer', 'devops-engineer'],
    isActive: true
  },
  {
    title: 'Product Manager',
    slug: 'product-manager',
    category: 'Product & Strategy',
    industry: 'Information Technology',
    difficultyLevel: 'INTERMEDIATE',
    estimatedDuration: '6-9 months',
    description: 'Drive the product lifecycle from ideation and user validation to roadmap prioritization, feature delivery, and metric evaluation.',
    salaryRange: '$85,000 - $145,000 / yr',
    jobOutlook: '+18% growth (High Demand)',
    employmentOpportunities: 'Associate Product Manager, Technical PM, Product Owner, Growth PM',
    requiredSkills: [
      { name: 'Product Discovery & User Interviews', proficiency: 'Advanced', importance: 'CORE', weight: 25, description: 'Problem validation, customer empathy interviews, and opportunity scoring.' },
      { name: 'Roadmap Prioritization (RICE / MoSCoW)', proficiency: 'Intermediate', importance: 'CORE', weight: 25, description: 'Balancing technical debt, feature velocity, and business impact.' },
      { name: 'Product Analytics & KPI Tracking', proficiency: 'Intermediate', importance: 'CORE', weight: 20, description: 'Cohort retention, funnel drop-off, North Star metrics, and Mixpanel.' },
      { name: 'Agile & Scrum Delivery', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Sprint planning, user story crafting, acceptance criteria, and backlog grooming.' },
      { name: 'Technical Literacy for PMs', proficiency: 'Intermediate', importance: 'IMPORTANT', weight: 15, description: 'Understanding APIs, databases, architecture constraints, and trade-offs.' }
    ],
    recommendedSkills: [
      { name: 'Basic SQL for Product Analytics', proficiency: 'Intermediate', importance: 'RECOMMENDED' }
    ],
    optionalSkills: [
      { name: 'UI Prototyping Basics', proficiency: 'Basic' }
    ],
    learningResources: [
      { title: 'Product School Resources', url: 'https://productschool.com', type: 'GUIDE', isFree: true }
    ],
    relatedCareerSlugs: ['data-analyst', 'ui-ux-designer'],
    isActive: true
  }
];
