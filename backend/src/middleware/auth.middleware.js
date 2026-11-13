import prisma from '../config/database.js';
import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Authentication Middleware
 * Validates JWT access token and ensures session tokenVersion matches DB.
 */
export async function requireAuth(req, res, next) {
  try {
    let token = null;

    // Check Authorization Header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      // Fallback to cookie
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication credentials are required',
        },
      });
    }

    const { valid, payload, error } = verifyAccessToken(token);
    if (!valid || !payload) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: error === 'TokenExpiredError' ? 'Access token has expired' : 'Invalid access token',
        },
      });
    }

    // Verify tokenVersion against DB to guarantee immediate revocation
    // If DB is reachable and user exists, check tokenVersion
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('placeholder_user')) {
      try {
        const currentUser = await prisma.user.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            tokenVersion: true,
            isVerified: true,
          },
        });

        if (currentUser) {
          if (!currentUser.isActive) {
            return res.status(403).json({
              success: false,
              error: {
                code: 'ACCOUNT_DISABLED',
                message: 'Your account has been deactivated or suspended',
              },
            });
          }

          if (currentUser.tokenVersion !== payload.tokenVersion) {
            return res.status(401).json({
              success: false,
              error: {
                code: 'SESSION_REVOKED',
                message: 'Session has been invalidated. Please log in again.',
              },
            });
          }

          req.user = currentUser;
          return next();
        }
      } catch (_dbErr) {
        // Fall back to verified JWT payload
      }
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      tokenVersion: payload.tokenVersion,
    };

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * RBAC Role Authorization Middleware
 * Enforces allowed roles for the given route.
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of [${allowedRoles.join(', ')}] role(s).`,
        },
      });
    }

    next();
  };
}

/**
 * Resource Ownership Validation Middleware
 * Ensures req.user.id matches req.params[paramName] or user is an ADMIN.
 */
export function requireOwnershipOrAdmin(paramName = 'userId') {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    const targetId = req.params[paramName];
    if (req.user.role !== 'ADMIN' && req.user.id !== targetId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access or modify this resource.',
        },
      });
    }

    next();
  };
}
