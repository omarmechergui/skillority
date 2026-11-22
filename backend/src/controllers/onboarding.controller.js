import prisma from '../config/database.js';
import { parseInstructorName } from '../utils/name.js';

/**
 * Complete Student Onboarding
 */
export async function completeStudentOnboarding(req, res, next) {
  try {
    const userId = req.user.id;
    const { university, major, graduationYear, skills, interests, learningGoals, bio } =
      req.validatedBody;

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        university,
        major,
        graduationYear,
        skills: skills || [],
        interests: interests || [],
        learningGoals,
        bio,
      },
      create: {
        userId,
        firstName: req.user.email.split('@')[0],
        lastName: 'Student',
        university,
        major,
        graduationYear,
        skills: skills || [],
        interests: interests || [],
        learningGoals,
        bio,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Student onboarding completed successfully',
      data: { profile: updatedProfile },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Complete Company Onboarding
 */
export async function completeCompanyOnboarding(req, res, next) {
  try {
    const userId = req.user.id;
    const { companyName, companyDescription, industry, companySize, website, bio } =
      req.validatedBody;

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        companyName,
        companyDescription,
        industry,
        companySize,
        website,
        bio,
      },
      create: {
        userId,
        firstName: 'Company',
        lastName: 'Representative',
        companyName,
        companyDescription,
        industry,
        companySize,
        website,
        bio,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Company onboarding completed successfully',
      data: { profile: updatedProfile },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Complete Instructor Onboarding
 */
export async function completeInstructorOnboarding(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, firstName, lastName, headline, experience, expertise, bio } = req.validatedBody;

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    // Derive names if explicitly provided, else parse safely with title handling and profile preservation
    let resolvedFirstName = firstName;
    let resolvedLastName = lastName;

    if (!resolvedFirstName) {
      const parsed = parseInstructorName(name, existingProfile);
      resolvedFirstName = parsed.firstName;
      if (resolvedLastName === undefined) {
        resolvedLastName = parsed.lastName;
      }
    }

    // Resolved experience from headline or experience
    const resolvedExperience = (experience || headline || '').trim();

    // Clean normalized expertise array
    const normalizedExpertise = Array.isArray(expertise) ? expertise : [];

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        ...(resolvedFirstName ? { firstName: resolvedFirstName } : {}),
        ...(resolvedLastName !== undefined && resolvedLastName !== '' ? { lastName: resolvedLastName } : {}),
        experience: resolvedExperience,
        expertise: normalizedExpertise,
        ...(bio !== undefined ? { bio: bio.trim() } : {}),
      },
      create: {
        userId,
        firstName: resolvedFirstName || existingProfile?.firstName || req.user.email.split('@')[0],
        lastName: resolvedLastName || existingProfile?.lastName || 'Instructor',
        experience: resolvedExperience,
        expertise: normalizedExpertise,
        bio: bio ? bio.trim() : undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Instructor onboarding completed successfully',
      data: { profile: updatedProfile },
    });
  } catch (err) {
    next(err);
  }
}
