import prisma from '../config/database.js';
import { parseInstructorName } from '../utils/name.js';

export async function getProfileByUserId(userId) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });
  return profile;
}

/**
 * Updates a user profile with role-aware onboarding protection and name resolution.
 *
 * @param {string} userId - User ID
 * @param {object} rawUpdateData - Validated profile fields to update
 * @param {string} [userRole] - Role of authenticated user (STUDENT, COMPANY, INSTRUCTOR, ADMIN)
 * @returns {Promise<object>} Updated profile with user relation
 */
export async function updateProfile(userId, rawUpdateData = {}, userRole = null) {
  const existing = await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, email: true, role: true } },
    },
  });

  const updateData = { ...rawUpdateData };

  // Handle single `name` field if provided: parse into firstName / lastName
  if (updateData.name) {
    const parsed = parseInstructorName(updateData.name, existing);
    if (!updateData.firstName && parsed.firstName) {
      updateData.firstName = parsed.firstName;
    }
    if (!updateData.lastName && parsed.lastName !== undefined) {
      updateData.lastName = parsed.lastName;
    }
    delete updateData.name;
  }

  // Mandatory Onboarding Field Protection:
  // Ensure profile updates never clear required onboarding fields that would invalidate onboarding status.
  const role = userRole || existing?.user?.role;

  if (existing && role) {
    if (role === 'STUDENT' && existing.university && existing.major) {
      if (updateData.university !== undefined && (!updateData.university || !String(updateData.university).trim())) {
        const error = new Error('Cannot clear mandatory onboarding field: university');
        error.statusCode = 400;
        error.code = 'MANDATORY_FIELD_REQUIRED';
        throw error;
      }
      if (updateData.major !== undefined && (!updateData.major || !String(updateData.major).trim())) {
        const error = new Error('Cannot clear mandatory onboarding field: major');
        error.statusCode = 400;
        error.code = 'MANDATORY_FIELD_REQUIRED';
        throw error;
      }
    } else if (role === 'COMPANY' && existing.companyName && existing.industry && existing.companySize) {
      if (updateData.companyName !== undefined && (!updateData.companyName || String(updateData.companyName).trim().length < 2)) {
        const error = new Error('Cannot clear mandatory onboarding field: companyName');
        error.statusCode = 400;
        error.code = 'MANDATORY_FIELD_REQUIRED';
        throw error;
      }
      if (updateData.industry !== undefined && (!updateData.industry || !String(updateData.industry).trim())) {
        const error = new Error('Cannot clear mandatory onboarding field: industry');
        error.statusCode = 400;
        error.code = 'MANDATORY_FIELD_REQUIRED';
        throw error;
      }
      if (updateData.companySize !== undefined && (!updateData.companySize || !String(updateData.companySize).trim())) {
        const error = new Error('Cannot clear mandatory onboarding field: companySize');
        error.statusCode = 400;
        error.code = 'MANDATORY_FIELD_REQUIRED';
        throw error;
      }
    } else if (role === 'INSTRUCTOR' && existing.experience && Array.isArray(existing.expertise) && existing.expertise.length > 0) {
      if (updateData.experience !== undefined && (!updateData.experience || !String(updateData.experience).trim())) {
        const error = new Error('Cannot clear mandatory onboarding field: experience');
        error.statusCode = 400;
        error.code = 'MANDATORY_FIELD_REQUIRED';
        throw error;
      }
      if (updateData.expertise !== undefined && (!Array.isArray(updateData.expertise) || updateData.expertise.length === 0)) {
        const error = new Error('Cannot clear mandatory onboarding field: expertise');
        error.statusCode = 400;
        error.code = 'MANDATORY_FIELD_REQUIRED';
        throw error;
      }
    }
  }

  // If profile doesn't exist yet, create it
  if (!existing) {
    return prisma.profile.create({
      data: {
        userId,
        firstName: updateData.firstName || 'User',
        lastName: updateData.lastName || '',
        ...updateData,
      },
      include: {
        user: { select: { id: true, email: true, role: true } },
      },
    });
  }

  // If no fields to update, return existing
  if (Object.keys(updateData).length === 0) {
    return existing;
  }

  return prisma.profile.update({
    where: { userId },
    data: updateData,
    include: {
      user: { select: { id: true, email: true, role: true } },
    },
  });
}
