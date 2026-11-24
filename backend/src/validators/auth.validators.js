import { z } from 'zod';

export const registerStudentSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
});

export const registerCompanySchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid work email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().trim().min(1, 'Contact first name is required').max(50),
  lastName: z.string().trim().min(1, 'Contact last name is required').max(50),
  companyName: z.string().trim().min(2, 'Company name is required').max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const inviteInstructorSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address for the instructor'),
});

export const acceptInstructorInviteSchema = z.object({
  token: z.string().min(10, 'Valid invitation token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  expertise: z.array(z.string()).optional(),
  experience: z.string().optional(),
});

export const studentOnboardingSchema = z.object({
  university: z.string().max(100).optional(),
  major: z.string().max(100).optional(),
  graduationYear: z.number().int().min(2000).max(2040).optional(),
  skills: z.array(z.string()).max(20).optional(),
  interests: z.array(z.string()).max(20).optional(),
  learningGoals: z.string().max(500).optional(),
  bio: z.string().max(500).optional(),
});

export const companyOnboardingSchema = z.object({
  companyName: z.string().min(2).max(100).optional(),
  companyDescription: z.string().max(1000).optional(),
  industry: z.string().max(100).optional(),
  companySize: z.string().max(50).optional(),
  website: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  bio: z.string().max(500).optional(),
});

export const instructorOnboardingSchema = z
  .object({
    name: z.string().trim().max(100).optional(),
    firstName: z.string().trim().max(50).optional(),
    lastName: z.string().trim().max(50).optional(),
    headline: z.string().trim().max(500).optional(),
    experience: z.string().trim().max(500).optional(),
    expertise: z.preprocess((val) => {
      if (typeof val === 'string') {
        return Array.from(new Set(val.split(',').map((s) => s.trim()).filter(Boolean)));
      }
      if (Array.isArray(val)) {
        return Array.from(new Set(val.map((s) => String(s).trim()).filter(Boolean)));
      }
      return val;
    }, z.array(z.string().min(1, 'Expertise item cannot be empty').max(100)).min(1, 'At least one domain expertise item is required').max(20)),
    bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').optional().or(z.literal('')),
    courseIdea: z.string().trim().max(200).optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      const exp = (data.experience || data.headline || '').trim();
      return exp.length > 0;
    },
    {
      message: 'Professional headline or experience is required',
      path: ['headline'],
    }
  );

export function validate(schemaOrFn) {
  return (req, res, next) => {
    const schema = typeof schemaOrFn === 'function' ? schemaOrFn(req) : schemaOrFn;
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload',
          details: result.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
      });
    }
    req.validatedBody = result.data;
    next();
  };
}
