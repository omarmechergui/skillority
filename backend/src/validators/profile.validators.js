import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50).optional(),
  lastName: z.string().min(1, 'Last name is required').max(50).optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  skills: z.array(z.string().min(1)).max(30).optional(),
  // Student fields
  university: z.string().max(100).optional(),
  major: z.string().max(100).optional(),
  graduationYear: z.number().int().min(1980).max(2035).optional(),
  interests: z.array(z.string()).max(20).optional(),
  learningGoals: z.string().max(300).optional(),
  // Company fields
  companyName: z.string().max(100).optional(),
  companyDescription: z.string().max(1000).optional(),
  industry: z.string().max(100).optional(),
  companySize: z.string().max(50).optional(),
  website: z.string().url('Website must be a valid URL').optional().or(z.literal('')),
  // Instructor fields
  expertise: z.array(z.string()).max(20).optional(),
  experience: z.string().max(500).optional(),
});
