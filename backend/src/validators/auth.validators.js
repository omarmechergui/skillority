import { z } from 'zod';

export const registerStudentSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
});

export const registerCompanySchema = z.object({
  email: z.string().email('Please enter a valid work email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'Contact first name is required').max(50),
  lastName: z.string().min(1, 'Contact last name is required').max(50),
  companyName: z.string().min(2, 'Company name is required').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
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
  email: z.string().email('Please enter a valid email address for the instructor'),
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

export function validate(schema) {
  return (req, res, next) => {
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
