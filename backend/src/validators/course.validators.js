import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.string().min(2, 'Category is required'),
  level: z.string().min(2, 'Level is required'),
  thumbnail: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createChapterSchema = z.object({
  title: z.string().min(3, 'Chapter title must be at least 3 characters').max(100),
  order: z.number().int().min(0, 'Chapter order must be >= 0'),
  isFree: z.boolean().default(true),
  coinsCost: z.number().int().min(0).default(0),
});

export const createLessonSchema = z.object({
  title: z.string().min(3, 'Lesson title must be at least 3 characters').max(100),
  order: z.number().int().min(0),
  duration: z.number().int().min(1).optional(),
  content: z.any(), // Flexible rich JSON blocks (text, code, video, callout)
});

export const reviewDecisionSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reviewNote: z.string().max(1000).optional(),
});
