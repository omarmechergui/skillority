/**
 * Raw dataset of companies and opportunities
 * High-profile tech employers operating in Tunisia, Europe, and MENA.
 */

export const COMPANIES_DATA = [
  {
    companyName: 'InstaDeep Tunisia',
    companyDescription: 'Pioneering decision-making AI and machine learning solutions to solve complex problems across healthcare, mobility, and energy.',
    industry: 'Artificial Intelligence & Deep Tech',
    companySize: '250-500 employees',
    website: 'https://instadeep.com',
    location: 'Tunis, Tunisia (Les Berges du Lac)',
    opportunities: [
      {
        title: 'AI Research Intern (PFE 2026)',
        description: 'Join our research team in Tunis to develop state-of-the-art reinforcement learning algorithms and geometric deep learning models for enterprise applications.',
        type: 'INTERNSHIP',
        category: 'Data Science & AI',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: '6 months',
        skills: ['Python', 'PyTorch', 'Reinforcement Learning', 'Git & GitHub', 'Mathematics'],
        optionalSkills: ['Docker', 'JAX', 'C++'],
        educationalRequirements: 'Final-year Master or Engineering student in Computer Science, Applied Mathematics, or AI.',
        experienceLevel: 'Entry / Internship',
        responsibilities: [
          'Design and implement neural network prototypes using PyTorch.',
          'Conduct literature reviews on modern transformer architectures.',
          'Collaborate with senior researchers to benchmark experimental results.',
          'Document findings and contribute to internal and conference publications.'
        ],
        benefits: ['Competitive monthly stipend (1,200 TND)', 'Access to high-performance GPU clusters', 'Direct mentorship from PhD researchers', 'PFE recruitment opportunity'],
        stipend: '1,200 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      },
      {
        title: 'Junior Full-Stack Software Engineer',
        description: 'Develop performant web interfaces and backend microservices that surface deep learning predictions to enterprise clients worldwide.',
        type: 'FULL_TIME',
        category: 'Software Engineering',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: 'Indefinite (CDI)',
        skills: ['TypeScript', 'React', 'Node.js', 'FastAPI', 'Docker', 'PostgreSQL'],
        optionalSkills: ['Kubernetes', 'Tailwind CSS', 'GraphQL'],
        educationalRequirements: 'Engineering Degree or Master in Computer Science.',
        experienceLevel: 'Junior (0-2 years)',
        responsibilities: [
          'Build responsive UI dashboards with Next.js and TypeScript.',
          'Implement RESTful APIs and real-time streaming endpoints with FastAPI and Node.js.',
          'Participate in code reviews, automated unit testing, and continuous deployment.',
          'Ensure high performance and security compliance across cloud platforms.'
        ],
        benefits: ['Health insurance coverage', 'Flexible hybrid remote policy', 'Annual learning budget', 'Performance bonuses'],
        stipend: '2,800 - 3,500 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Vermeg Software',
    companyDescription: 'Specialized financial software solutions provider delivering regulatory reporting, securities processing, and digital banking platforms globally.',
    industry: 'Financial Technology (FinTech)',
    companySize: '1,000+ employees',
    website: 'https://vermeg.com',
    location: 'Tunis, Tunisia (Centre Urbain Nord)',
    opportunities: [
      {
        title: 'Full-Stack Angular & Spring Boot Intern (PFE)',
        description: 'Design and prototype a next-generation regulatory analytics dashboard for European tier-1 investment banks.',
        type: 'INTERNSHIP',
        category: 'Software Engineering',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: '6 months',
        skills: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL', 'RESTful APIs'],
        optionalSkills: ['Docker', 'Kafka', 'TypeScript'],
        educationalRequirements: 'Final-year engineering student in Software Engineering or Business Informatics.',
        experienceLevel: 'Entry / Internship',
        responsibilities: [
          'Implement REST endpoints and business validation layers in Spring Boot.',
          'Create intuitive Angular data-table views with high performance caching.',
          'Participate in agile sprint ceremonies and automated integration testing.'
        ],
        benefits: ['Monthly allowance (800 TND)', 'Transport shuttle', 'Possibility of immediate pre-employment recruitment'],
        stipend: '800 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      },
      {
        title: 'Junior DevOps Engineer',
        description: 'Support enterprise deployment pipelines, cloud provisioning, and test automation across European banking client environments.',
        type: 'FULL_TIME',
        category: 'Cloud & DevOps',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: 'Indefinite (CDI)',
        skills: ['Docker', 'Kubernetes', 'Linux', 'CI/CD Pipelines', 'Git & GitHub'],
        optionalSkills: ['Ansible', 'Terraform', 'Azure'],
        educationalRequirements: 'Computer Engineering Degree.',
        experienceLevel: 'Junior (0-2 years)',
        responsibilities: [
          'Maintain Jenkins and GitLab CI pipelines.',
          'Configure Kubernetes clusters and monitor container health.',
          'Automate routine infrastructure provisioning scripts.'
        ],
        benefits: ['Attractive salary package', 'Private health insurance', 'International travel opportunities'],
        stipend: '2,200 - 2,900 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Expensya',
    companyDescription: 'Next-generation automated business spend management and mobile expense reporting software, part of the Medius Group.',
    industry: 'SaaS & Enterprise Cloud',
    companySize: '200-500 employees',
    website: 'https://expensya.com',
    location: 'Tunis, Tunisia (Ariana)',
    opportunities: [
      {
        title: 'React & Node.js Frontend Engineer (PFE)',
        description: 'Enhance Expensya core web app with real-time receipt scanning verification and multi-currency expense approvals.',
        type: 'INTERNSHIP',
        category: 'Web Development',
        workplaceType: 'HYBRID',
        location: 'Ariana, Tunisia',
        duration: '6 months',
        skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
        optionalSkills: ['Next.js', 'Redux', 'Jest & Testing Library'],
        educationalRequirements: 'Engineering or Master Degree in Computer Science.',
        experienceLevel: 'Internship',
        responsibilities: [
          'Build modern, accessible React interfaces.',
          'Integrate OCR API responses and interactive bounding box reviews.',
          'Write end-to-end and unit tests.'
        ],
        benefits: ['Competitive PFE stipend (1,000 TND)', 'Free catering and coffee bar', 'Pre-employment contract for top performers'],
        stipend: '1,000 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Cognira',
    companyDescription: 'AI-powered promotional planning and merchandising solutions for multinational retail corporations.',
    industry: 'Data Science & Retail Tech',
    companySize: '100-250 employees',
    website: 'https://cognira.com',
    location: 'Tunis, Tunisia (Les Berges du Lac 2)',
    opportunities: [
      {
        title: 'Machine Learning Engineer Intern',
        description: 'Build predictive promotion forecasting models for large grocery retail chains using gradient boosting and neural networks.',
        type: 'INTERNSHIP',
        category: 'Data Science & AI',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: '6 months',
        skills: ['Python', 'Pandas & NumPy', 'Scikit-learn', 'SQL', 'Git & GitHub'],
        optionalSkills: ['Docker', 'AWS', 'Data Visualization'],
        educationalRequirements: 'Computer Engineering or Data Science graduation year.',
        experienceLevel: 'Internship',
        responsibilities: [
          'Clean, preprocess and feature-engineer massive sales transaction datasets.',
          'Train, evaluate and tune promotion responsiveness models.',
          'Package models into Docker containers for production serving.'
        ],
        benefits: ['Top-tier stipend (1,100 TND)', 'Modern workspace overlooking the lake', 'Mentorship by senior US/TN data scientists'],
        stipend: '1,100 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Telnet Holding',
    companyDescription: 'Renowned technology consulting and engineering group specializing in aerospace, embedded telecommunications, defense, and IoT.',
    industry: 'Aerospace & Embedded Systems',
    companySize: '500-1,000 employees',
    website: 'https://groupe-telnet.com',
    location: 'Tunis, Tunisia (El Ghazala Technopark)',
    opportunities: [
      {
        title: 'Embedded Systems & C++ Intern (PFE)',
        description: 'Design low-latency nanosatellite communication protocols and firmware modules for next-gen IoT payloads.',
        type: 'INTERNSHIP',
        category: 'Embedded Systems & IoT',
        workplaceType: 'ONSITE',
        location: 'El Ghazala Technopark, Ariana',
        duration: '6 months',
        skills: ['C++', 'Linux', 'Git & GitHub', 'Microservices'],
        optionalSkills: ['Python', 'Docker'],
        educationalRequirements: 'Final year in Embedded Systems, Telecommunications, or Electrical Engineering.',
        experienceLevel: 'Internship',
        responsibilities: [
          'Develop embedded firmware drivers and telecommand decoders.',
          'Perform hardware-in-the-loop (HIL) laboratory testing.',
          'Optimize memory footprint on ARM microcontrollers.'
        ],
        benefits: ['PFE stipend (850 TND)', 'Working on real satellite aerospace hardware', 'Hiring opportunities upon graduation'],
        stipend: '850 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Sofrecom Tunisia (Orange Group)',
    companyDescription: 'Strategic telecommunications consulting and engineering subsidiary of the Orange Group, driving telecom digital transformation.',
    industry: 'Telecommunications & IT Services',
    companySize: '500-1,000 employees',
    website: 'https://sofrecom.com',
    location: 'Tunis, Tunisia (Technopôle El Ghazala)',
    opportunities: [
      {
        title: 'Cloud & API Microservices Developer',
        description: 'Build backend microservices integrating 5G core network telemetry with modern Orange customer portals.',
        type: 'FULL_TIME',
        category: 'Cloud & DevOps',
        workplaceType: 'HYBRID',
        location: 'Ariana, Tunisia',
        duration: 'Indefinite (CDI)',
        skills: ['Node.js', 'Express', 'Docker', 'MongoDB', 'RESTful APIs'],
        optionalSkills: ['Kubernetes', 'Redis', 'CI/CD Pipelines'],
        educationalRequirements: 'Telecommunications or Computer Engineering degree.',
        experienceLevel: 'Junior (1-2 years)',
        responsibilities: [
          'Develop resilient microservices following event-driven principles.',
          'Maintain OpenAPI contracts and high test coverage.',
          'Deploy services on corporate OpenShift/Kubernetes clusters.'
        ],
        benefits: ['Comprehensive health & life insurance', 'Telecom discounts', 'Generous paid leave policy'],
        stipend: '2,400 - 3,100 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Vistaprint Tunisia (Cimpress)',
    companyDescription: 'Global e-commerce and mass-customization tech hub engineering high-scale manufacturing, 3D preview, and design platforms.',
    industry: 'E-Commerce & Digital Design Tech',
    companySize: '500-1,000 employees',
    website: 'https://vistaprint.com',
    location: 'Tunis, Tunisia (Centre Urbain Nord)',
    opportunities: [
      {
        title: 'React & WebGL Graphics Engineer Intern',
        description: 'Build interactive real-time 3D product previews and customized rendering pipelines in the browser.',
        type: 'INTERNSHIP',
        category: 'Web Development',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: '6 months',
        skills: ['TypeScript', 'React', 'JavaScript', 'HTML5 & CSS3'],
        optionalSkills: ['Next.js', 'Jest & Testing Library', 'UI/UX Prototyping'],
        educationalRequirements: 'Computer Engineering student with strong visual rendering and web fundamentals.',
        experienceLevel: 'Internship',
        responsibilities: [
          'Develop fast browser-based customization canvas widgets.',
          'Optimize WebGL render loops and memory buffers.',
          'Collaborate with international designers and product managers.'
        ],
        benefits: ['Stipend (1,200 TND / month)', 'Full equipment provided', 'High rate of post-PFE hiring'],
        stipend: '1,200 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Cynapsys by Gfi',
    companyDescription: 'Digital transformation consulting firm offering enterprise cloud migration, web architecture, and mobile engineering.',
    industry: 'IT Consulting & Services',
    companySize: '200-500 employees',
    website: 'https://cynapsys.de',
    location: 'Ariana, Tunisia',
    opportunities: [
      {
        title: 'Full-Stack Developer (Vue.js / Node.js)',
        description: 'Deliver international client web solutions across Germany, France, and North Africa.',
        type: 'FULL_TIME',
        category: 'Web Development',
        workplaceType: 'HYBRID',
        location: 'Ariana, Tunisia',
        duration: 'CDI',
        skills: ['JavaScript', 'Vue.js', 'Node.js', 'MongoDB', 'Docker'],
        optionalSkills: ['TypeScript', 'Express', 'Tailwind CSS'],
        educationalRequirements: 'Bachelor or Master in Computer Science.',
        experienceLevel: 'Junior (1-3 years)',
        responsibilities: ['Develop clean frontend and backend code.', 'Write automated tests.', 'Participate in client sprint demos.'],
        benefits: ['Ticket restaurant', 'Complementary medical insurance', 'Language courses (German / English)'],
        stipend: '2,000 - 2,600 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Wevioo Group',
    companyDescription: 'Global consulting and technology partner supporting financial, logistics, and industrial corporations in their digital transitions.',
    industry: 'IT Consulting & Logistics Tech',
    companySize: '500-1,000 employees',
    website: 'https://wevioo.com',
    location: 'Tunis, Tunisia (Les Berges du Lac)',
    opportunities: [
      {
        title: 'IoT & Cloud Platform Developer Intern',
        description: 'Connect industrial supply chain sensors to AWS IoT Core and build tracking dashboards for port logistics.',
        type: 'INTERNSHIP',
        category: 'Cloud & DevOps',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: '6 months',
        skills: ['Python', 'Docker', 'AWS', 'Linux', 'RESTful APIs'],
        optionalSkills: ['Node.js', 'PostgreSQL'],
        educationalRequirements: 'Computer Engineering student.',
        experienceLevel: 'Internship',
        responsibilities: ['Configure MQTT telemetry bridges.', 'Store time-series sensor data.', 'Build analytics dashboards.'],
        benefits: ['PFE stipend (900 TND / month)', 'Friendly work environment', 'Permanent contract on successful completion'],
        stipend: '900 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Actia Engineering Services',
    companyDescription: 'Specialized in connected vehicles, automotive telematics, diagnostic tools, and embedded electronics for global manufacturers.',
    industry: 'Automotive & Embedded Tech',
    companySize: '500-1,000 employees',
    website: 'https://actia.com',
    location: 'Tunis, Tunisia (Chotrana, Ariana)',
    opportunities: [
      {
        title: 'Automotive Software Test Engineer',
        description: 'Validate electronic control units (ECU) and diagnostic software for European commercial vehicle manufacturers.',
        type: 'FULL_TIME',
        category: 'Software Engineering',
        workplaceType: 'ONSITE',
        location: 'Ariana, Tunisia',
        duration: 'CDI',
        skills: ['Python', 'Linux', 'Git & GitHub'],
        optionalSkills: ['C++', 'Docker'],
        educationalRequirements: 'Degree in Electrical or Computer Engineering.',
        experienceLevel: 'Entry / Junior (0-2 years)',
        responsibilities: ['Write Python test scripts for CAN bus protocols.', 'Execute test suites in simulated environments.', 'Log defect reports.'],
        benefits: ['Company transport', 'Annual performance incentives', 'Comprehensive medical cover'],
        stipend: '2,100 - 2,700 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Sagemcom Tunisia',
    companyDescription: 'European leader in high added-value communicating terminals (broadband gateways, smart meters, energy distribution).',
    industry: 'Telecommunications & Smart Energy',
    companySize: '1,000+ employees',
    website: 'https://sagemcom.com',
    location: 'Tunis & Megrine, Tunisia',
    opportunities: [
      {
        title: 'Linux Kernel & Embedded C Intern (PFE)',
        description: 'Optimize Wi-Fi 7 packet processing queues and mesh routing algorithms on high-speed home gateways.',
        type: 'INTERNSHIP',
        category: 'Embedded Systems & IoT',
        workplaceType: 'ONSITE',
        location: 'Megrine, Tunisia',
        duration: '6 months',
        skills: ['C++', 'Linux', 'Git & GitHub'],
        optionalSkills: ['Python', 'Docker'],
        educationalRequirements: 'Final-year in Telecommunications or Computer Systems.',
        experienceLevel: 'Internship',
        responsibilities: ['Port device drivers to updated Linux kernels.', 'Benchmark Wi-Fi throughput under congestion.', 'Diagnose memory leaks.'],
        benefits: ['PFE stipend (850 TND / month)', 'Company restaurant', 'High rate of hire'],
        stipend: '850 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Talan Tunisia',
    companyDescription: 'International consulting firm in innovation and digital transformation assisting major corporate accounts.',
    industry: 'Digital Innovation & Consulting',
    companySize: '500-1,000 employees',
    website: 'https://talan.com',
    location: 'Tunis, Tunisia (Centre Urbain Nord)',
    opportunities: [
      {
        title: 'Data & PowerBI Analytics Consultant Intern',
        description: 'Transform financial and operations data into interactive executive decision dashboards.',
        type: 'INTERNSHIP',
        category: 'Data Science & AI',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: '6 months',
        skills: ['SQL', 'Python', 'Pandas & NumPy', 'Data Visualization'],
        optionalSkills: ['Docker', 'PostgreSQL'],
        educationalRequirements: 'Business Informatics or Computer Science final year student.',
        experienceLevel: 'Internship',
        responsibilities: ['Build ETL pipelines.', 'Design clear data visualizations.', 'Present weekly findings to stakeholders.'],
        benefits: ['Stipend (1,000 TND / month)', 'Dynamic innovation lab', 'Pre-employment opportunities'],
        stipend: '1,000 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Bending Spoons MENA',
    companyDescription: 'Top European mobile app developer behind globally celebrated creator and productivity applications.',
    industry: 'Mobile Consumer Applications',
    companySize: '250-500 employees',
    website: 'https://bendingspoons.com',
    location: 'Tunis, Tunisia (Remote / Hybrid)',
    opportunities: [
      {
        title: 'React Native & iOS Mobile Engineer',
        description: 'Craft buttery-smooth mobile experiences used by over 50 million monthly active creators worldwide.',
        type: 'FULL_TIME',
        category: 'Mobile Development',
        workplaceType: 'REMOTE',
        location: 'Tunis, Tunisia (Remote)',
        duration: 'CDI',
        skills: ['TypeScript', 'React', 'React Native', 'Git & GitHub', 'RESTful APIs'],
        optionalSkills: ['Next.js', 'UI/UX Prototyping', 'Jest & Testing Library'],
        educationalRequirements: 'Computer Engineering Degree.',
        experienceLevel: 'Junior / Mid (1-3 years)',
        responsibilities: ['Implement high-performance mobile UI.', 'Optimize battery and memory consumption.', 'Conduct A/B testing on user flows.'],
        benefits: ['Top international salary benchmark (4,000 - 5,500 TND)', 'MacBook Pro provided', 'Annual company retreats in Italy'],
        stipend: '4,000 - 5,500 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Cloudsmith Systems',
    companyDescription: 'Cloud infrastructure automation, cloud security compliance, and platform engineering for European SaaS companies.',
    industry: 'Cloud Infrastructure & Security',
    companySize: '50-100 employees',
    website: 'https://cloudsmith-systems.io',
    location: 'Tunis, Tunisia (Lac 1)',
    opportunities: [
      {
        title: 'Junior Cloud Security Analyst',
        description: 'Automate vulnerability scanning, enforce IAM least-privilege policies, and monitor AWS cloud security postures.',
        type: 'FULL_TIME',
        category: 'Cybersecurity',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: 'CDI',
        skills: ['Cybersecurity Fundamentals', 'OWASP Top 10', 'AWS', 'Linux', 'Python'],
        optionalSkills: ['Docker', 'Penetration Testing'],
        educationalRequirements: 'Cybersecurity or Computer Engineering Degree.',
        experienceLevel: 'Junior (0-2 years)',
        responsibilities: ['Audit cloud access permissions.', 'Review container image vulnerability reports.', 'Assist in SOC2 compliance preparation.'],
        benefits: ['Continuous certification funding (AWS Security, CompTIA Security+)', 'Competitive compensation package', 'Hybrid flexibility'],
        stipend: '2,500 - 3,200 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Roam Solutions',
    companyDescription: 'Fintech platform delivering instant cross-border remittances and digital wallet infrastructure across African markets.',
    industry: 'FinTech & Mobile Money',
    companySize: '50-100 employees',
    website: 'https://roamfintech.com',
    location: 'Tunis, Tunisia',
    opportunities: [
      {
        title: 'Backend API Developer (Node.js & MongoDB)',
        description: 'Build robust, highly secure transaction processing endpoints with strict idempotency and audit logs.',
        type: 'FULL_TIME',
        category: 'Software Engineering',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: 'CDI',
        skills: ['Node.js', 'Express', 'MongoDB', 'Prisma ORM', 'TypeScript', 'Redis'],
        optionalSkills: ['Docker', 'Microservices', 'GraphQL'],
        educationalRequirements: 'Software Engineering Degree.',
        experienceLevel: 'Junior (1-2 years)',
        responsibilities: ['Implement payment gateway integrations.', 'Ensure sub-second response times for transaction verifications.', 'Write robust unit and integration tests.'],
        benefits: ['Stock options plan', 'Flexible working hours', 'Medical insurance'],
        stipend: '2,600 - 3,400 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Datavora',
    companyDescription: 'E-commerce web scraping, price monitoring, and retail competitive intelligence platform.',
    industry: 'Big Data & E-Commerce Intelligence',
    companySize: '50-100 employees',
    website: 'https://datavora.com',
    location: 'Tunis, Tunisia',
    opportunities: [
      {
        title: 'Web Scraping & Data Extraction Intern (PFE)',
        description: 'Build distributed web crawlers and scraping pipelines extracting structured product catalogs from millions of pages.',
        type: 'INTERNSHIP',
        category: 'Data Science & AI',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: '6 months',
        skills: ['Python', 'Docker', 'MongoDB', 'Git & GitHub'],
        optionalSkills: ['Pandas & NumPy', 'Linux'],
        educationalRequirements: 'Computer Science final year.',
        experienceLevel: 'Internship',
        responsibilities: ['Write resilient scrapers handling dynamic JavaScript rendering.', 'Bypass anti-scraping protections lawfully.', 'Validate extracted data schemas.'],
        benefits: ['PFE stipend (900 TND / month)', 'Great startup culture', 'Recruitment upon graduation'],
        stipend: '900 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Baracoda Group Tunisia',
    companyDescription: 'Connected health technologies and daily preventive wellness devices presented annually at CES Las Vegas.',
    industry: 'HealthTech & Connected Devices',
    companySize: '100-250 employees',
    website: 'https://baracoda.com',
    location: 'Ariana, Tunisia',
    opportunities: [
      {
        title: 'Flutter Mobile App Intern (PFE)',
        description: 'Connect intelligent oral-health hardware via Bluetooth Low Energy (BLE) to a delightful cross-platform mobile companion app.',
        type: 'INTERNSHIP',
        category: 'Mobile Development',
        workplaceType: 'HYBRID',
        location: 'Ariana, Tunisia',
        duration: '6 months',
        skills: ['TypeScript', 'JavaScript', 'Git & GitHub', 'RESTful APIs'],
        optionalSkills: ['React Native', 'UI/UX Prototyping'],
        educationalRequirements: 'Computer Engineering final year student.',
        experienceLevel: 'Internship',
        responsibilities: ['Implement BLE packet parsing and state management.', 'Create smooth animated user progress views.', 'Test cross-compatibility on iOS and Android devices.'],
        benefits: ['PFE stipend (1,000 TND / month)', 'Working on internationally recognized products', 'Direct recruitment'],
        stipend: '1,000 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'NeoXam Tunisia',
    companyDescription: 'Financial software publisher providing asset management, investment accounting, and data management solutions.',
    industry: 'Financial Software (FinTech)',
    companySize: '250-500 employees',
    website: 'https://neoxam.com',
    location: 'Tunis, Tunisia (Centre Urbain Nord)',
    opportunities: [
      {
        title: 'Java & Spring Boot Backend Engineer',
        description: 'Develop high-throughput data processing engines for portfolio risk calculation and multi-asset trade accounting.',
        type: 'FULL_TIME',
        category: 'Software Engineering',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: 'CDI',
        skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Git & GitHub', 'RESTful APIs'],
        optionalSkills: ['Docker', 'Microservices', 'Linux'],
        educationalRequirements: 'Computer Engineering degree.',
        experienceLevel: 'Junior (1-3 years)',
        responsibilities: ['Maintain core Java services.', 'Optimize SQL queries and batch processing pipelines.', 'Collaborate with financial business analysts.'],
        benefits: ['Very attractive salary', 'Ticket restaurant', 'Comprehensive health coverage'],
        stipend: '2,600 - 3,300 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'Advans Tunisie',
    companyDescription: 'Leading international microfinance institution providing loans and financial technology to micro and small businesses.',
    industry: 'Microfinance & Digital Banking',
    companySize: '250-500 employees',
    website: 'https://advanstunisie.com',
    location: 'Tunis, Tunisia',
    opportunities: [
      {
        title: 'Mobile Banking App Support Specialist',
        description: 'Monitor, troubleshoot, and support the rollout of field agent mobile applications and customer loan request portals.',
        type: 'FULL_TIME',
        category: 'Software Engineering',
        workplaceType: 'HYBRID',
        location: 'Tunis, Tunisia',
        duration: 'CDI',
        skills: ['SQL', 'JavaScript', 'Linux', 'Git & GitHub'],
        optionalSkills: ['Node.js', 'React'],
        educationalRequirements: 'Degree in Computer Science or Business Informatics.',
        experienceLevel: 'Junior (0-2 years)',
        responsibilities: ['Investigate application errors in staging and production.', 'Write database synchronization queries.', 'Assist field agents with technical support.'],
        benefits: ['Annual 13th month bonus', 'Health insurance', 'Stable banking institution environment'],
        stipend: '1,800 - 2,400 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  },
  {
    companyName: 'DeepBrain Robotics',
    companyDescription: 'Startup developing computer vision systems and autonomous robotic transport units for smart manufacturing lines.',
    industry: 'Robotics & Computer Vision',
    companySize: '20-50 employees',
    website: 'https://deepbrain-robotics.tn',
    location: 'Sousse, Tunisia (Novation City Technopark)',
    opportunities: [
      {
        title: 'Computer Vision & ROS Intern (PFE)',
        description: 'Deploy real-time object detection and SLAM mapping models on Nvidia Jetson embedded hardware for warehouse robots.',
        type: 'INTERNSHIP',
        category: 'Data Science & AI',
        workplaceType: 'ONSITE',
        location: 'Sousse, Tunisia',
        duration: '6 months',
        skills: ['Python', 'C++', 'Linux', 'PyTorch', 'Git & GitHub'],
        optionalSkills: ['Docker', 'Pandas & NumPy'],
        educationalRequirements: 'Final year student at ENISO, ENIT, INSAT, or equivalent in Robotics/AI.',
        experienceLevel: 'Internship',
        responsibilities: ['Implement YOLOv8 inference pipelines on edge GPUs.', 'Integrate camera feeds with ROS2 navigation packages.', 'Benchmark detection latency in warehouse conditions.'],
        benefits: ['PFE stipend (950 TND / month)', 'Access to hardware prototyping lab', 'Startup equity incentives on pre-hire'],
        stipend: '950 TND / month',
        status: 'PUBLISHED',
        isOpen: true,
      }
    ]
  }
];
