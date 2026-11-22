import * as profileService from '../services/profile.service.js';

export async function getMyProfile(req, res, next) {
  try {
    const profile = await profileService.getProfileByUserId(req.user.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: 'Profile not found' },
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(req, res, next) {
  try {
    const updated = await profileService.updateProfile(
      req.user.id,
      req.validatedBody,
      req.user.role
    );
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPublicProfile(req, res, next) {
  try {
    const { userId } = req.params;
    const profile = await profileService.getProfileByUserId(userId);
    if (!profile || !profile.user || !profile.user.isActive) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: 'User profile not found or inactive' },
      });
    }

    // Sanitize private fields for public view
    const publicData = {
      id: profile.id,
      userId: profile.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar,
      bio: profile.bio,
      skills: profile.skills,
      role: profile.user.role,
      university: profile.university,
      major: profile.major,
      graduationYear: profile.graduationYear,
      companyName: profile.companyName,
      companyDescription: profile.companyDescription,
      industry: profile.industry,
      expertise: profile.expertise,
      experience: profile.experience,
      createdAt: profile.createdAt,
    };

    return res.status(200).json({
      success: true,
      data: publicData,
    });
  } catch (err) {
    next(err);
  }
}
