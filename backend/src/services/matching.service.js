/**
 * Deterministic Candidate & Opportunity Matching Engine (Module 3E)
 * Transparent, explainable, normalized scoring between 0 and 100.
 */

/**
 * Canonical dictionary mapping technology aliases and variants to standard canonical names.
 */
export const SKILL_ALIASES = {
  // Programming Languages & Environments
  'js': 'javascript',
  'javascript': 'javascript',
  'ts': 'typescript',
  'typescript': 'typescript',
  'py': 'python',
  'python': 'python',
  'golang': 'go',
  'go': 'go',
  'cpp': 'c++',
  'c++': 'c++',
  'csharp': 'c#',
  'c#': 'c#',
  'c sharp': 'c#',
  'c': 'c',
  'r': 'r',
  'rb': 'ruby',
  'ruby': 'ruby',
  'php': 'php',
  'java': 'java',
  'rust': 'rust',
  'kotlin': 'kotlin',
  'swift': 'swift',

  // Frontend & UI
  'react': 'react',
  'reactjs': 'react',
  'react js': 'react',
  'vue': 'vue',
  'vuejs': 'vue',
  'vue js': 'vue',
  'angular': 'angular',
  'angularjs': 'angular',
  'next': 'nextjs',
  'nextjs': 'nextjs',
  'next js': 'nextjs',
  'html': 'html',
  'html5': 'html',
  'css': 'css',
  'css3': 'css',
  'tailwind': 'tailwind css',
  'tailwindcss': 'tailwind css',
  'tailwind css': 'tailwind css',
  'sass': 'sass',
  'scss': 'sass',
  'bootstrap': 'bootstrap',

  // Backend & Databases
  'node': 'nodejs',
  'nodejs': 'nodejs',
  'node js': 'nodejs',
  'express': 'expressjs',
  'expressjs': 'expressjs',
  'express js': 'expressjs',
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'mongo': 'mongodb',
  'mongodb': 'mongodb',
  'sql': 'sql',
  'mysql': 'mysql',
  'redis': 'redis',
  'graphql': 'graphql',
  'rest': 'rest api',
  'rest api': 'rest api',
  'restful': 'rest api',

  // DevOps, Cloud & Tools
  'k8s': 'kubernetes',
  'kubernetes': 'kubernetes',
  'docker': 'docker',
  'aws': 'amazon web services',
  'amazon web services': 'amazon web services',
  'gcp': 'google cloud',
  'google cloud': 'google cloud',
  'google cloud platform': 'google cloud',
  'azure': 'microsoft azure',
  'microsoft azure': 'microsoft azure',
  'git': 'git',
  'github': 'github',
  'ci cd': 'ci/cd',
  'cicd': 'ci/cd',

  // AI, Data & CS
  'ml': 'machine learning',
  'machine learning': 'machine learning',
  'ai': 'artificial intelligence',
  'artificial intelligence': 'artificial intelligence',
  'dl': 'deep learning',
  'deep learning': 'deep learning',
  'nlp': 'natural language processing',
  'natural language processing': 'natural language processing',
  'dsa': 'data structures and algorithms',
  'data structures': 'data structures and algorithms',
  'algorithms': 'data structures and algorithms',
};

/**
 * Normalizes a skill string for case-insensitive, punctuation-resilient matching.
 */
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  return skill
    .toLowerCase()
    .trim()
    .replace(/[._\-/]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Checks whether a candidate's skill set contains a target skill using exact
 * normalized tokens and verified aliases, avoiding unsafe substring matching.
 */
export function hasSkillMatch(candidateSkills, targetSkill) {
  if (!Array.isArray(candidateSkills) || candidateSkills.length === 0) return false;
  const normalizedTarget = normalizeSkill(targetSkill);
  if (!normalizedTarget) return false;

  const canonicalTarget = SKILL_ALIASES[normalizedTarget] || normalizedTarget;

  return candidateSkills.some((s) => {
    const norm = normalizeSkill(s);
    if (!norm) return false;

    // 1. Direct exact match
    if (norm === normalizedTarget) return true;

    // 2. Canonical alias match (e.g., 'golang' matches 'go', 'js' matches 'javascript')
    const canonicalCandidate = SKILL_ALIASES[norm] || norm;
    if (canonicalCandidate === canonicalTarget) return true;

    // 3. Multi-word phrase matching with word boundaries (preventing substring collisions like 'c' in 'css')
    // We only permit token containment if both tokens are multi-word phrases and all significant words match
    if (normalizedTarget.length >= 4 && norm.length >= 4) {
      const targetWords = normalizedTarget.split(' ');
      const candidateWords = norm.split(' ');

      if (targetWords.length > 1 && targetWords.every((tw) => candidateWords.includes(tw))) {
        return true;
      }
      if (candidateWords.length > 1 && candidateWords.every((cw) => targetWords.includes(cw))) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Computes a transparent, deterministic matching score between a student and an opportunity.
 *
 * @param {Object} student - Student object with profile, enrollments, certificates, and career goals
 * @param {Object} opportunity - Opportunity object with skills, optionalSkills, category, workplaceType
 * @returns {Object} { score: number, matchedSkills: string[], missingSkills: string[], matchedOptionalSkills: string[], breakdown: Object, explanations: string[], recommendations: string[] }
 */
export function calculateOpportunityMatch(student = {}, opportunity = {}) {
  const profile = student?.profile || {};
  const studentSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const requiredSkills = Array.isArray(opportunity?.skills) ? opportunity.skills : [];
  const optionalSkills = Array.isArray(opportunity?.optionalSkills) ? opportunity.optionalSkills : [];

  const matchedSkills = [];
  const missingSkills = [];

  // 1. Required Skills Match (Max 40 points)
  let requiredSkillPoints = 0;
  if (requiredSkills.length === 0) {
    requiredSkillPoints = 40;
  } else {
    for (const reqSkill of requiredSkills) {
      if (hasSkillMatch(studentSkills, reqSkill)) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    }
    const ratio = matchedSkills.length / requiredSkills.length;
    requiredSkillPoints = Math.round(ratio * 40);
  }

  // 2. Optional Skills Match (Max 15 points: 5 base + up to 10 for matching optional skills)
  const matchedOptionalSkills = [];
  let optionalSkillPoints = 0;
  if (optionalSkills.length === 0) {
    optionalSkillPoints = 15;
  } else {
    for (const optSkill of optionalSkills) {
      if (hasSkillMatch(studentSkills, optSkill)) {
        matchedOptionalSkills.push(optSkill);
      }
    }
    const ratio = matchedOptionalSkills.length / optionalSkills.length;
    // Optional skills are a bonus; candidates get baseline credit plus bonus for matches
    optionalSkillPoints = Math.round(5 + ratio * 10);
  }

  // 3. Career Path & Category Alignment (Max 15 points)
  let careerAlignmentPoints = 0;
  const oppCategory = (opportunity?.category || opportunity?.title || '').toLowerCase();
  const studentGoals = Array.isArray(student?.careerGoals) ? student.careerGoals : [];
  const primaryGoal = studentGoals.find((g) => g.isPrimary) || studentGoals[0];
  const goalTitle = (primaryGoal?.careerPath?.title || '').toLowerCase();
  const goalCategory = (primaryGoal?.careerPath?.category || '').toLowerCase();
  const studentInterests = Array.isArray(profile?.interests) ? profile.interests.map((i) => i.toLowerCase()) : [];

  if (
    (goalTitle && (oppCategory.includes(goalTitle) || goalTitle.includes(oppCategory))) ||
    (goalCategory && (oppCategory.includes(goalCategory) || goalCategory.includes(oppCategory)))
  ) {
    careerAlignmentPoints = 15;
  } else if (studentInterests.some((interest) => oppCategory.includes(interest) || interest.includes(oppCategory))) {
    careerAlignmentPoints = 10;
  } else if (studentGoals.length > 0) {
    careerAlignmentPoints = 5;
  } else {
    careerAlignmentPoints = 5;
  }

  // 4. Learning Evidence & Course Credentials (Max 20 points)
  let credentialsPoints = 0;
  const enrollments = Array.isArray(student?.enrollments) ? student.enrollments : [];
  const certificates = Array.isArray(student?.certificates) ? student.certificates : [];

  const completedCoursesCount = enrollments.filter((e) => e.isCompleted || (e.progressPercent && e.progressPercent >= 100)).length;
  const certCount = certificates.length;

  if (certCount >= 2 || completedCoursesCount >= 2) {
    credentialsPoints = 20;
  } else if (certCount === 1 || completedCoursesCount === 1) {
    credentialsPoints = 15;
  } else if (enrollments.some((e) => (e.progressPercent || 0) > 20)) {
    credentialsPoints = 10;
  } else {
    credentialsPoints = 5;
  }

  // 5. Profile Completeness & Arrangement Compatibility (Max 10 points)
  let completenessPoints = 0;
  if (profile?.university && profile?.major) completenessPoints += 4;
  if (profile?.bio && profile.bio.length > 10) completenessPoints += 3;
  if (opportunity?.workplaceType === 'REMOTE' || !opportunity?.workplaceType) {
    completenessPoints += 3;
  } else {
    completenessPoints += 3;
  }

  const totalScore = Math.min(100, Math.max(0, requiredSkillPoints + optionalSkillPoints + careerAlignmentPoints + credentialsPoints + completenessPoints));

  // Explanations & Recommendations
  const explanations = [];
  if (matchedSkills.length > 0) {
    explanations.push(`Matched ${matchedSkills.length} of ${requiredSkills.length || 1} required technical skills (${matchedSkills.slice(0, 3).join(', ')}${matchedSkills.length > 3 ? '...' : ''}).`);
  }
  if (missingSkills.length > 0) {
    explanations.push(`Opportunity requires ${missingSkills.length} additional skill(s): ${missingSkills.join(', ')}.`);
  }
  if (completedCoursesCount > 0 || certCount > 0) {
    explanations.push(`Verified credentials detected: ${certCount} certificate(s), ${completedCoursesCount} completed course(s).`);
  }
  if (careerAlignmentPoints >= 10) {
    explanations.push('Strong career alignment with your current learning target.');
  }

  const recommendations = [];
  if (missingSkills.length > 0) {
    recommendations.push(`Explore Skillority courses covering ${missingSkills.slice(0, 2).join(' and ')} to improve your match.`);
  }
  if (completedCoursesCount === 0) {
    recommendations.push('Complete at least one foundational course chapter to boost employer visibility.');
  }
  if (studentSkills.length < 3) {
    recommendations.push('Add more verified skills to your student profile.');
  }

  return {
    score: totalScore,
    matchedSkills,
    missingSkills,
    matchedOptionalSkills,
    breakdown: {
      requiredSkillPoints,
      optionalSkillPoints,
      careerAlignmentPoints,
      credentialsPoints,
      completenessPoints,
    },
    explanations,
    recommendations,
  };
}

/**
 * Calculates Career Progress for a student toward a Career Path (Module 3A.4).
 *
 * @param {Object} student - Student user with profile, enrollments, certificates
 * @param {Object} careerPath - CareerPath object with requiredSkills, recommendedSkills, recommendedCourseIds
 */
export function calculateCareerProgress(student = {}, careerPath = {}) {
  const profile = student?.profile || {};
  const studentSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const requiredSkills = Array.isArray(careerPath?.requiredSkills) ? careerPath.requiredSkills : [];
  const enrollments = Array.isArray(student?.enrollments) ? student.enrollments : [];
  const certificates = Array.isArray(student?.certificates) ? student.certificates : [];

  let totalWeight = 0;
  let earnedWeight = 0;
  const verifiedSkills = [];
  const skillGaps = [];

  for (const req of requiredSkills) {
    const weight = req.weight || (100 / Math.max(requiredSkills.length, 1));
    totalWeight += weight;

    const isMatched = hasSkillMatch(studentSkills, req.name);
    // Skill is verified if matched or if student has certificate/enrollment
    if (isMatched) {
      earnedWeight += weight;
      verifiedSkills.push({
        name: req.name,
        proficiency: req.proficiency || 'Intermediate',
        importance: req.importance || 'CORE',
        status: 'VERIFIED',
      });
    } else {
      skillGaps.push({
        name: req.name,
        proficiency: req.proficiency || 'Intermediate',
        importance: req.importance || 'CORE',
        description: req.description || '',
        status: 'PENDING',
        suggestedAction: `Enroll in courses covering ${req.name}`,
      });
    }
  }

  // Factor in course enrollments and certificates
  const relevantEnrollments = enrollments.filter((e) => {
    if (!careerPath.recommendedCourseIds || careerPath.recommendedCourseIds.length === 0) return true;
    return careerPath.recommendedCourseIds.includes(e.courseId);
  });
  const completedLessons = relevantEnrollments.reduce((sum, e) => sum + (e.completedLessonIds?.length || 0), 0);
  const completedCourses = relevantEnrollments.filter((e) => e.isCompleted).length;

  const rawReadiness = totalWeight > 0 ? (earnedWeight / totalWeight) * 80 : 0;
  const courseBonus = Math.min(20, completedCourses * 10 + Math.min(10, completedLessons * 2));
  const overallReadiness = Math.min(100, Math.round(rawReadiness + courseBonus));

  const milestones = [
    {
      title: 'Target Profession Selected',
      completed: true,
      description: `Targeting ${careerPath.title}`,
    },
    {
      title: 'Core Skills Acquisition',
      completed: verifiedSkills.length >= Math.ceil(requiredSkills.length * 0.6),
      description: `${verifiedSkills.length} of ${requiredSkills.length} core skills acquired`,
    },
    {
      title: 'Course Curriculum Mastery',
      completed: completedCourses >= 1 || completedLessons >= 5,
      description: `${completedLessons} lessons and ${completedCourses} courses completed`,
    },
    {
      title: 'Industry Assessment or Certificate',
      completed: certificates.length > 0,
      description: `${certificates.length} verified credential(s) earned`,
    },
    {
      title: 'Internship Ready',
      completed: overallReadiness >= 75,
      description: overallReadiness >= 75 ? 'Ready to apply for partner internships' : 'Continue learning roadmap to reach 75%+',
    },
  ];

  return {
    readinessScore: overallReadiness,
    verifiedSkills,
    skillGaps,
    milestones,
    stats: {
      totalRequiredSkills: requiredSkills.length,
      verifiedSkillsCount: verifiedSkills.length,
      skillGapsCount: skillGaps.length,
      completedCoursesCount: completedCourses,
      certificatesCount: certificates.length,
    },
  };
}
