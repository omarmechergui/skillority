import { z } from 'zod';

/**
 * Normalizes input that may be either an array of strings or a comma-separated string:
 * - Trims whitespace
 * - Discards empty entries
 * - Deduplicates items (preserving order of first occurrence)
 * - Validates max items and per-item length
 */
export function normalizeStringArray(maxItems, itemMaxLen = 100) {
  return z.preprocess((val) => {
    if (typeof val === 'string') {
      const parts = val.split(',').map((s) => s.trim()).filter(Boolean);
      return Array.from(new Set(parts));
    }
    if (Array.isArray(val)) {
      const parts = val.map((s) => (s != null ? String(s).trim() : '')).filter(Boolean);
      return Array.from(new Set(parts));
    }
    return val;
  }, z.array(z.string().min(1, 'Item cannot be empty').max(itemMaxLen, `Item cannot exceed ${itemMaxLen} characters`)).max(maxItems, `Cannot exceed ${maxItems} items`));
}

// Common profile attributes permitted across all authenticated roles
const commonFields = {
  firstName: z.string().trim().min(1, 'First name is required').max(50, 'First name cannot exceed 50 characters').optional(),
  lastName: z.string().trim().min(1, 'Last name is required').max(50, 'Last name cannot exceed 50 characters').optional(),
  name: z.string().trim().max(100, 'Name cannot exceed 100 characters').optional(),
  bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').optional().or(z.literal('')),
  avatar: z.string().trim().url('Avatar must be a valid URL').optional().or(z.literal('')),
  skills: normalizeStringArray(30, 50).optional(),
};

// Student role-specific profile schema
export const updateStudentProfileSchema = z.object({
  ...commonFields,
  university: z.string().trim().min(1, 'University cannot be empty').max(100, 'University cannot exceed 100 characters').optional(),
  major: z.string().trim().min(1, 'Major cannot be empty').max(100, 'Major cannot exceed 100 characters').optional(),
  graduationYear: z.number().int('Graduation year must be an integer').min(1980, 'Graduation year must be 1980 or later').max(2040, 'Graduation year cannot exceed 2040').optional(),
  interests: normalizeStringArray(20, 50).optional(),
  learningGoals: z.string().trim().max(500, 'Learning goals cannot exceed 500 characters').optional().or(z.literal('')),
}).strict();

// Company role-specific profile schema
export const updateCompanyProfileSchema = z.object({
  ...commonFields,
  companyName: z.string().trim().min(2, 'Company name must be at least 2 characters').max(100, 'Company name cannot exceed 100 characters').optional(),
  companyDescription: z.string().trim().max(1000, 'Company description cannot exceed 1000 characters').optional().or(z.literal('')),
  industry: z.string().trim().min(1, 'Industry cannot be empty').max(100, 'Industry cannot exceed 100 characters').optional(),
  companySize: z.string().trim().min(1, 'Company size cannot be empty').max(50, 'Company size cannot exceed 50 characters').optional(),
  website: z.string().trim().url('Website must be a valid URL').optional().or(z.literal('')),
}).strict();

// Instructor role-specific profile schema
export const updateInstructorProfileSchema = z.object({
  ...commonFields,
  experience: z.string().trim().min(1, 'Experience cannot be empty').max(500, 'Experience cannot exceed 500 characters').optional(),
  expertise: z.preprocess((val) => {
    if (typeof val === 'string') {
      const parts = val.split(',').map((s) => s.trim()).filter(Boolean);
      return Array.from(new Set(parts));
    }
    if (Array.isArray(val)) {
      const parts = val.map((s) => (s != null ? String(s).trim() : '')).filter(Boolean);
      return Array.from(new Set(parts));
    }
    return val;
  }, z.array(z.string().min(1, 'Expertise item cannot be empty').max(100, 'Expertise item cannot exceed 100 characters')).min(1, 'At least one domain expertise item is required').max(20, 'Cannot exceed 20 expertise items')).optional(),
  website: z.string().trim().url('Website must be a valid URL').optional().or(z.literal('')),
}).strict();

// Admin role-specific profile schema
export const updateAdminProfileSchema = z.object({
  ...commonFields,
}).strict();

/**
 * Returns role-specific Zod schema based on user role string
 */
export function getUpdateProfileSchema(role) {
  switch (role) {
    case 'STUDENT':
      return updateStudentProfileSchema;
    case 'COMPANY':
      return updateCompanyProfileSchema;
    case 'INSTRUCTOR':
      return updateInstructorProfileSchema;
    case 'ADMIN':
      return updateAdminProfileSchema;
    default:
      return null;
  }
}

/**
 * Backward-compatible comprehensive schema for external callers or tests
 */
export const updateProfileSchema = z.object({
  ...commonFields,
  university: z.string().trim().min(1).max(100).optional(),
  major: z.string().trim().min(1).max(100).optional(),
  graduationYear: z.number().int().min(1980).max(2040).optional(),
  interests: normalizeStringArray(20, 50).optional(),
  learningGoals: z.string().trim().max(500).optional().or(z.literal('')),
  companyName: z.string().trim().min(2).max(100).optional(),
  companyDescription: z.string().trim().max(1000).optional().or(z.literal('')),
  industry: z.string().trim().min(1).max(100).optional(),
  companySize: z.string().trim().min(1).max(50).optional(),
  website: z.string().trim().url().optional().or(z.literal('')),
  expertise: normalizeStringArray(20, 100).optional(),
  experience: z.string().trim().min(1).max(500).optional(),
});

/**
 * Role-aware Profile Update Validation Middleware
 */
export function validateProfileUpdate(req, res, next) {
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required before validating profile update',
      },
    });
  }

  const schema = getUpdateProfileSchema(req.user.role);
  if (!schema) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ROLE',
        message: `No profile update schema configured for role '${req.user.role}'`,
      },
    });
  }

  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details: result.error.errors.map((e) => {
          if (e.code === 'unrecognized_keys') {
            return {
              field: e.keys[0] || 'unknown',
              message: `Field(s) ${e.keys.map((k) => `'${k}'`).join(', ')} not allowed for role ${req.user.role}`,
            };
          }
          return {
            field: e.path.join('.'),
            message: e.message,
          };
        }),
      },
    });
  }

  req.validatedBody = result.data;
  next();
}
