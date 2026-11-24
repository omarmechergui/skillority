import prisma from '../config/database.js';
import {
  hashPassword,
  comparePassword,
  generateCryptoToken,
  hashCryptoToken,
} from '../utils/security.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

// Cookie configuration for tokens
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Register Student
 */
export async function registerStudent(req, res, next) {
  try {
    const { password, firstName, lastName } = req.validatedBody;
    const email = (req.validatedBody.email || '').trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'An account with this email address already exists',
        },
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'STUDENT',
        isVerified: true, // Verification placeholder
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
        wallet: {
          create: {
            balance: 100, // Initial complimentary credits
          },
        },
      },
      include: {
        profile: true,
      },
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

    // Store hashed refresh token in DB
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
      message: 'Student account created successfully',
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
 * Register Company
 */
export async function registerCompany(req, res, next) {
  try {
    const { password, firstName, lastName, companyName } = req.validatedBody;
    const email = (req.validatedBody.email || '').trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'An account with this email address already exists',
        },
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'COMPANY',
        isVerified: true,
        profile: {
          create: {
            firstName,
            lastName,
            companyName,
          },
        },
      },
      include: {
        profile: true,
      },
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
      message: 'Company account created successfully',
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
 * Login
 */
export async function login(req, res, next) {
  try {
    const { password } = req.validatedBody;
    const email = (req.validatedBody.email || '').trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password combination',
        },
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'Your account has been deactivated or suspended',
        },
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password combination',
        },
      });
    }

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

    // Save refresh token hash
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashCryptoToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });

    res.status(200).json({
      success: true,
      message: 'Login successful',
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
 * Logout
 */
export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const hashed = hashCryptoToken(refreshToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash: hashed },
        data: { revoked: true },
      });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Refresh Token
 */
export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_REFRESH_TOKEN',
          message: 'Refresh token is required',
        },
      });
    }

    const { valid, payload, error } = verifyRefreshToken(refreshToken);
    if (!valid || !payload) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: error === 'TokenExpiredError' ? 'Refresh token has expired' : 'Invalid refresh token',
        },
      });
    }

    const hashed = hashCryptoToken(refreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashed },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token has expired or is invalid',
        },
      });
    }

    // Refresh token reuse detection: If already revoked, invalidate entire user session!
    if (storedToken.revoked) {
      await prisma.refreshToken.updateMany({
        where: { userId: payload.id },
        data: { revoked: true },
      });
      await prisma.user.update({
        where: { id: payload.id },
        data: { tokenVersion: { increment: 1 } },
      });
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(401).json({
        success: false,
        error: {
          code: 'SECURITY_ALERT_TOKEN_REUSE',
          message: 'Security breach detected: Revoked token was reused. All active sessions invalidated.',
        },
      });
    }

    // Rotate refresh token atomically via transaction
    const newRefreshToken = signRefreshToken({
      id: payload.id,
      tokenVersion: payload.tokenVersion,
    });
    const newHashed = hashCryptoToken(newRefreshToken);

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      }),
      prisma.refreshToken.create({
        data: {
          userId: payload.id,
          tokenHash: newHashed,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { profile: true },
    });

    if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'SESSION_REVOKED',
          message: 'Session has been invalidated',
        },
      });
    }

    const newAccessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', newAccessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Forgot Password
 */
export async function forgotPassword(req, res, next) {
  try {
    const email = (req.validatedBody.email || '').trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const rawToken = generateCryptoToken(32);
      const tokenHash = hashCryptoToken(rawToken);

      // Invalidate existing unused tokens for this email
      await prisma.passwordResetToken.updateMany({
        where: { email, used: false },
        data: { used: true },
      });

      await prisma.passwordResetToken.create({
        data: {
          email,
          tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      // In production, send email with reset link. In dev, log token:
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV SECURITY NOTICE] Password reset token for ${email}: ${rawToken}`);
      }
    }

    // Always return 200 to prevent user enumeration
    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been dispatched.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Reset Password
 */
export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.validatedBody;
    const tokenHash = hashCryptoToken(token);

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_RESET_TOKEN',
          message: 'The password reset token is invalid, used, or expired.',
        },
      });
    }

    const normalizedEmail = (resetRecord.email || '').trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found.' },
      });
    }

    const passwordHash = await hashPassword(newPassword);

    // Update password, increment tokenVersion to revoke all active sessions, mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          tokenVersion: { increment: 1 },
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: user.id },
        data: { revoked: true },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Password reset successful. All active sessions have been invalidated. Please sign in.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get Current User Profile (Me)
 */
export async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        profile: true,
        wallet: { select: { balance: true } },
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}
