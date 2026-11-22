import { z } from 'zod';

// ============================================================================
// MODULE 3A: CAREER PATHS & GOALS VALIDATORS
// ============================================================================

export const skillItemSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(80),
  proficiency: z.enum(['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']).default('Intermediate'),
  importance: z.enum(['CORE', 'IMPORTANT', 'RECOMMENDED', 'NICE_TO_HAVE']).default('CORE'),
  weight: z.number().min(0).max(100).optional(),
  description: z.string().max(500).optional(),
  relatedCourses: z.array(z.string()).optional(),
});

export const createCareerPathSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lower-case alphanumeric with dashes'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.string().min(2, 'Category is required'),
  industry: z.string().optional(),
  difficultyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('INTERMEDIATE'),
  estimatedDuration: z.string().optional(),
  requiredSkills: z.array(skillItemSchema).min(1, 'At least one required skill must be defined'),
  recommendedSkills: z.array(skillItemSchema).optional().default([]),
  optionalSkills: z.array(skillItemSchema).optional().default([]),
  learningResources: z.array(z.object({
    title: z.string().min(1),
    url: z.string().url().or(z.string()),
    type: z.string().optional(),
    isFree: z.boolean().default(true),
  })).optional().default([]),
  recommendedCourseIds: z.array(z.string()).optional().default([]),
  relatedCareerSlugs: z.array(z.string()).optional().default([]),
  salaryRange: z.string().optional(),
  jobOutlook: z.string().optional(),
  employmentOpportunities: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateCareerPathSchema = createCareerPathSchema.partial();

export const setCareerGoalSchema = z.object({
  careerPathId: z.string().min(1, 'careerPathId is required'),
  isPrimary: z.boolean().optional().default(true),
  targetDate: z.string().datetime().or(z.string()).optional(),
  notes: z.string().max(500).optional(),
});

// ============================================================================
// MODULE 3B: INTERNSHIP & OPPORTUNITY VALIDATORS
// ============================================================================

export const createOpportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  type: z.enum(['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT']).default('INTERNSHIP'),
  category: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().min(2, 'Location is required').max(120),
  workplaceType: z.enum(['REMOTE', 'ONSITE', 'HYBRID']).default('REMOTE'),
  duration: z.string().max(60).optional(),
  startDate: z.string().datetime().or(z.string()).optional(),
  deadline: z.string().datetime().or(z.string()).optional(),
  positions: z.number().int().min(1, 'At least 1 position required').default(1),
  skills: z.array(z.string().min(1)).default([]),
  optionalSkills: z.array(z.string().min(1)).optional().default([]),
  educationalRequirements: z.string().max(300).optional(),
  experienceLevel: z.string().max(100).optional(),
  responsibilities: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  stipend: z.string().max(100).optional(),
  eligibility: z.string().max(500).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).default('PUBLISHED'),
});

export const updateOpportunitySchema = createOpportunitySchema.partial();

// ============================================================================
// MODULE 3C & 3D: APPLICATION & EVALUATION VALIDATORS
// ============================================================================

export const applyOpportunitySchema = z.object({
  coverLetter: z.string().max(3000).optional(),
  resumeUrl: z.string().max(500).optional(),
  portfolioUrl: z.string().max(500).optional(),
  githubUrl: z.string().max(500).optional(),
  linkedinUrl: z.string().max(500).optional(),
  candidateSkills: z.array(z.string()).optional(),
  answers: z.record(z.any()).optional(),
  notes: z.string().max(1000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'REVIEWING',
    'SHORTLISTED',
    'INTERVIEW',
    'OFFERED',
    'ACCEPTED',
    'REJECTED',
    'WITHDRAWN',
    'CANCELLED'
  ]),
  notes: z.string().max(1000).optional(),
  internalNotes: z.string().max(2000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  rejectionReason: z.string().max(1000).optional(),
});

export const evaluateCandidateSchema = z.object({
  internalNotes: z.string().max(2000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  rejectionReason: z.string().max(1000).optional(),
  notes: z.string().max(1000).optional(),
});

// ============================================================================
// MODULE 3F: INTERVIEW & OFFER VALIDATORS
// ============================================================================

export const scheduleInterviewSchema = z.object({
  scheduledAt: z.string().min(1, 'Interview date & time is required'),
  timezone: z.string().default('UTC'),
  interviewType: z.enum(['SCREENING', 'TECHNICAL', 'BEHAVIORAL', 'FINAL']).default('TECHNICAL'),
  meetingLink: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  instructions: z.string().max(2000).optional(),
});

export const updateInterviewSchema = z.object({
  scheduledAt: z.string().optional(),
  timezone: z.string().optional(),
  interviewType: z.enum(['SCREENING', 'TECHNICAL', 'BEHAVIORAL', 'FINAL']).optional(),
  meetingLink: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  instructions: z.string().max(2000).optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']).optional(),
  feedback: z.string().max(2000).optional(),
});

export const createOfferSchema = z.object({
  title: z.string().min(3, 'Offer title is required').max(120),
  stipend: z.string().max(100).optional(),
  startDate: z.string().optional(),
  duration: z.string().max(60).optional(),
  conditions: z.string().max(3000).optional(),
  expiresAt: z.string().optional(),
});

export const respondOfferSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
  declinedReason: z.string().max(1000).optional(),
});
