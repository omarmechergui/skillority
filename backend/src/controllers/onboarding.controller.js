import prisma from '../config/database.js';

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
