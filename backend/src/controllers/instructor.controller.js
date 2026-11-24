import prisma from '../config/database.js';
import {
  hashPassword,
  generateCryptoToken,
  hashCryptoToken,
} from '../utils/security.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/**
 * Admin: Generate and issue Instructor Invitation
 */
export async function inviteInstructor(req, res, next) {
  try {
    const email = (req.validatedBody.email || '').trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_ALREADY_EXISTS',
          message: 'A user account with this email address already exists.',
        },
      });
    }

    const rawToken = generateCryptoToken(32);
    const tokenHash = hashCryptoToken(rawToken);

    // Invalidate prior unaccepted invitations for this email
    await prisma.adminInvitation.deleteMany({
      where: { email, isAccepted: false },
    });

    const invitation = await prisma.adminInvitation.create({
      data: {
        email,
        tokenHash,
        role: 'INSTRUCTOR',
        createdById: req.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
      },
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV NOTICE] Instructor invitation generated for ${email}: token = ${rawToken}`);
    }

    res.status(201).json({
      success: true,
      message: 'Instructor invitation successfully generated.',
      data: {
        invitationId: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        invitationToken: rawToken, // Provided to admin to send out or displayed in preview
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Public: Validate Invitation Token Before Acceptance
 */
export async function verifyInstructorInvite(req, res, next) {
  try {
    const { token } = req.params;
    const tokenHash = hashCryptoToken(token);

    const invite = await prisma.adminInvitation.findUnique({
      where: { tokenHash },
    });

    if (!invite || invite.isAccepted || invite.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INVITATION',
          message: 'Invitation is invalid, expired, or has already been accepted.',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Public: Accept Instructor Invitation & Activate Account
 */
export async function acceptInstructorInvite(req, res, next) {
  try {
    const { token, password, firstName, lastName, expertise, experience } = req.validatedBody;
    const tokenHash = hashCryptoToken(token);

    const invite = await prisma.adminInvitation.findUnique({
      where: { tokenHash },
    });

    if (!invite || invite.isAccepted || invite.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INVITATION',
          message: 'Invitation is invalid, expired, or has already been accepted.',
        },
      });
    }

    const passwordHash = await hashPassword(password);

    // Atomic creation of instructor user and mark invitation accepted
    const user = await prisma.user.create({
      data: {
        email: (invite.email || '').trim().toLowerCase(),
        passwordHash,
        role: 'INSTRUCTOR',
        isVerified: true,
        invitedByAdminId: invite.createdById,
        profile: {
          create: {
            firstName,
            lastName,
            expertise: expertise || [],
            experience: experience || '',
          },
        },
      },
      include: { profile: true },
    });

    await prisma.adminInvitation.update({
      where: { id: invite.id },
      data: { isAccepted: true },
    });

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });
    const refreshToken = signRefreshToken({
      id: user.id,
      tokenVersion: user.tokenVersion,
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashCryptoToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });

    res.status(201).json({
      success: true,
      message: 'Instructor account successfully activated.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Revoke Instructor Access
 * Immediately invalidates active tokens via User.tokenVersion increment.
 */
export async function revokeInstructor(req, res, next) {
  try {
    const { instructorId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: instructorId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Instructor not found.' },
      });
    }

    if (user.role !== 'INSTRUCTOR') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ROLE', message: 'Target user is not an Instructor.' },
      });
    }

    // Deactivate user, increment tokenVersion (revoking all active JWTs), revoke stored refresh tokens
    const updated = await prisma.user.update({
      where: { id: instructorId },
      data: {
        isActive: false,
        tokenVersion: { increment: 1 },
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        tokenVersion: true,
      },
    });

    await prisma.refreshToken.updateMany({
      where: { userId: instructorId },
      data: { revoked: true },
    });

    res.status(200).json({
      success: true,
      message: 'Instructor access has been revoked and all active sessions invalidated.',
      data: { user: updated },
    });
  } catch (err) {
    next(err);
  }
}
