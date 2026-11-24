/**
 * Raw profiles dataset for realistic user generation
 * Focus on Tunisian engineering/tech talent with authentic names,
 * prestigious academic institutions, diverse skills, and international profiles.
 */

export const TUNISIAN_FIRST_NAMES_MALE = [
  'Mohamed', 'Yassine', 'Ahmed', 'Aziz', 'Omar', 'Karim', 'Selim', 'Mehdi',
  'Hamza', 'Rayen', 'Khalil', 'Fares', 'Bilel', 'Malek', 'Anis', 'Zied',
  'Tarek', 'Walid', 'Skander', 'Aymen', 'Wassim', 'Sami', 'Marwen', 'Seif',
  'Houssem', 'Amine', 'Wissem', 'Iheb', 'Rami', 'Chams', 'Elyes', 'Nader',
  'Hassen', 'Wael', 'Youssef', 'Chaker', 'Raouf', 'Ghaith', 'Habib', 'Adel'
];

export const TUNISIAN_FIRST_NAMES_FEMALE = [
  'Nour', 'Mariem', 'Fatma', 'Sarah', 'Ines', 'Amira', 'Syrine', 'Olfa',
  'Lina', 'Chaima', 'Yasmine', 'Rania', 'Salma', 'Mayssa', 'Dorra', 'Hiba',
  'Aya', 'Emna', 'Ons', 'Molka', 'Khadija', 'Manel', 'Nesrine', 'Meriem',
  'Sirine', 'Asma', 'Nada', 'Rawend', 'Wiem', 'Jihene', 'Imen', 'Ghada',
  'Amina', 'Dhouha', 'Lobna', 'Samar', 'Khouloud', 'Hajer', 'Rym', 'Yosra'
];

export const INTERNATIONAL_FIRST_NAMES_MALE = [
  'Alexandre', 'Lucas', 'Liam', 'David', 'Marcus', 'Carlos', 'Thomas', 'Julian',
  'Chen', 'Daniel', 'Mateo', 'Nicolas', 'Felix', 'Ethan', 'Victor', 'Stefan',
  'Leo', 'Adrian', 'Oliver', 'Samuel', 'Sebastian', 'Gabriel', 'Maxime', 'Arthur'
];

export const INTERNATIONAL_FIRST_NAMES_FEMALE = [
  'Sofia', 'Elena', 'Emily', 'Chloe', 'Clara', 'Isabella', 'Maya', 'Laura',
  'Anna', 'Camille', 'Nina', 'Lucia', 'Freya', 'Lea', 'Hannah', 'Emma',
  'Zoe', 'Maria', 'Eva', 'Alice', 'Charlotte', 'Sophie', 'Victoria', 'Julia'
];

export const TUNISIAN_LAST_NAMES = [
  'Ben Salem', 'Trabelsi', 'Ben Ali', 'Gharbi', 'Chaabane', 'Ayari', 'Jaziri',
  'Dridi', 'Mabrouk', 'Hammami', 'Rekik', 'Khemir', 'Bouzid', 'Mansour',
  'Mechergui', 'Bouazizi', 'Riahi', 'Belhadj', 'Cherif', 'Zouari', 'Meddeb',
  'Ghrab', 'Ellouze', 'Ben Ammar', 'Sassi', 'Mejri', 'Ben Youssef', 'Oueslati',
  'Ferchichi', 'Guedria', 'Zitouni', 'Tlili', 'Kefi', 'Saidi', 'Masmoudi',
  'Abbassi', 'Hadded', 'Baccouche', 'Kouki', 'Gharzoul', 'Boukhris', 'Sellami',
  'Loussaief', 'Guizani', 'Chebbi', 'Maatoug', 'Bouslama', 'Zayani', 'Chahed'
];

export const INTERNATIONAL_LAST_NAMES = [
  'Dupont', 'Müller', 'Schmidt', 'Smith', 'Garcia', 'Rossi', 'Novak', 'Patel',
  'Kowalski', 'Fischer', 'Moreau', 'Becker', 'Laurent', 'Weber', 'Andersson',
  'Martin', 'Lefebvre', 'Santos', 'Schneider', 'Dubois', 'Leroy', 'Fontaine'
];

export const UNIVERSITIES = [
  { name: 'INSAT (Institut National des Sciences Appliquées et de Technologie)', location: 'Tunis, Tunisia', isTunisian: true },
  { name: 'ENIT (École Nationale d\'Ingénieurs de Tunis)', location: 'Tunis, Tunisia', isTunisian: true },
  { name: 'ESPRIT (École Supérieure Privée d\'Ingénierie et de Technologies)', location: 'Ariana, Tunisia', isTunisian: true },
  { name: 'Faculté des Sciences de Tunis (FST)', location: 'Tunis, Tunisia', isTunisian: true },
  { name: 'ISET\'Com (Institut Supérieur des Études Technologiques en Communications)', location: 'Ariana, Tunisia', isTunisian: true },
  { name: 'Tunis Business School (TBS)', location: 'Ben Arous, Tunisia', isTunisian: true },
  { name: 'ENSI (École Nationale des Sciences de l\'Informatique)', location: 'Manouba, Tunisia', isTunisian: true },
  { name: 'SUP\'COM (École Supérieure des Communications de Tunis)', location: 'Ariana, Tunisia', isTunisian: true },
  { name: 'Université Centrale de Tunis', location: 'Tunis, Tunisia', isTunisian: true },
  { name: 'Université Paris-Dauphine | Tunis', location: 'Tunis, Tunisia', isTunisian: true },
  { name: 'ENISO (École Nationale d\'Ingénieurs de Sousse)', location: 'Sousse, Tunisia', isTunisian: true },
  { name: 'ENIS (École Nationale d\'Ingénieurs de Sfax)', location: 'Sfax, Tunisia', isTunisian: true },
  { name: 'ISG Tunis (Institut Supérieur de Gestion de Tunis)', location: 'Tunis, Tunisia', isTunisian: true },
  { name: 'Sorbonne Université', location: 'Paris, France', isTunisian: false },
  { name: 'Technical University of Munich (TUM)', location: 'Munich, Germany', isTunisian: false },
  { name: 'École Polytechnique Paris', location: 'Palaiseau, France', isTunisian: false },
  { name: 'Politecnico di Milano', location: 'Milan, Italy', isTunisian: false },
  { name: 'University of London', location: 'London, UK', isTunisian: false }
];

export const MAJORS = [
  'Software Engineering',
  'Computer Science & Systems',
  'Artificial Intelligence & Data Science',
  'Cloud Computing & DevOps',
  'Cybersecurity & Network Defense',
  'Business Informatics (Informatique de Gestion)',
  'Mobile Application Development',
  'Embedded Systems & IoT',
  'Distributed Systems & Web Technologies',
  'Data Engineering & Big Data Analytics',
  'Telecommunications Engineering',
  'Financial Engineering & FinTech'
];

export const SKILLS_POOL = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express',
  'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'C++', 'Go',
  'HTML5 & CSS3', 'Tailwind CSS', 'Redux', 'Vue.js', 'Angular',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Prisma ORM', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'CI/CD Pipelines', 'Linux',
  'Git & GitHub', 'RESTful APIs', 'GraphQL', 'Microservices',
  'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-learn',
  'Pandas & NumPy', 'Data Visualization', 'Prompt Engineering',
  'Cybersecurity Fundamentals', 'OWASP Top 10', 'Penetration Testing',
  'UI/UX Prototyping', 'Figma', 'Jest & Testing Library', 'Playwright'
];

export const STUDENT_BIOS = [
  'Passionate computer science student aiming to build scalable web platforms and AI-driven products.',
  'Software engineering enthusiast focused on modern React, Next.js, and cloud backends.',
  'Final-year engineering student actively seeking an innovative End-of-Studies project (PFE) in full-stack dev.',
  'Data science and machine learning learner dedicated to turning raw data into strategic insights.',
  'Motivated backend apprentice mastering Node.js, distributed databases, and containerization.',
  'Frontend developer focused on clean aesthetics, responsive web apps, and modern design systems.',
  'Aspiring DevOps and Cloud architect practicing CI/CD pipelines, Docker, and Kubernetes.',
  'Eager engineering student exploring mobile development with Flutter, React Native, and clean architecture.',
  'Tech explorer and competitive programmer passionate about algorithms and systems performance.',
  'Driven student developer actively leveling up skills across full-stack engineering and cloud operations.'
];

export const INSTRUCTOR_BIOS = [
  'Principal Software Architect with over 12 years of industry experience building large-scale microservices and cloud infrastructures.',
  'Senior Full-Stack Engineer and tech consultant who has trained over 5,000 developers across Europe and North Africa.',
  'Lead Data Scientist and former AI researcher specializing in deep learning architectures and production ML pipelines.',
  'Senior Frontend Architect specializing in React performance, Next.js server components, and design systems.',
  'Cybersecurity specialist and ethical hacker guiding engineering teams on secure coding and OWASP defense.',
  'DevOps Consultant and Cloud Architect passionate about Docker, Kubernetes, and automated deployment pipelines.',
  'Mobile Engineering Lead with published Flutter and iOS apps serving millions of active users.',
  'Database Administrator and Backend Specialist with deep expertise in MongoDB Atlas, PostgreSQL, and Prisma ORM.',
  'Technical Lead and Engineering Director with a passion for software craftmanship and mentoring junior engineers.',
  'Software Engineering Professor and author of practical curricula on distributed systems and software design.'
];

export const INSTRUCTOR_EXPERIENCES = [
  '12+ years in Enterprise Software Architecture and Tech Leadership',
  '8 years as Senior Full-Stack Engineer at international tech companies',
  '10 years leading AI & Machine Learning research and deployment',
  '7 years as Lead Frontend Architect and Design System advocate',
  '9 years in Cyber Security, Penetration Testing & Infrastructure Hardening',
  '11 years in Cloud Operations, DevOps Engineering and Site Reliability',
  '6 years building scalable cross-platform mobile products',
  '14 years in University Instruction and Technical Training Programs',
  '8 years consulting for high-growth tech startups in Paris and Tunis',
  '10 years specializing in Database Performance & Scalable Systems'
];
