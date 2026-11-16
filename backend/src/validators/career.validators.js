import { z } from 'zod';

export const createOpportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  type: z.enum(['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT']).default('INTERNSHIP'),
  location: z.string().min(2, 'Location is required'),
  skills: z.array(z.string()).default([]),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWING', 'INTERVIEW', 'OFFERED', 'REJECTED']),
  notes: z.string().max(1000).optional(),
});
