import prisma from '../config/database.js';
import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Authentication Middleware
 * Validates JWT access token and ensures session tokenVersion matches DB.
 * Fails closed in production or if database lookup confirms account invalidation.
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
          code: error === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
          message: error === 'TokenExpiredError' ? 'Access token has expired' : 'Invalid access token',
        },
      });
    }

    // Database lookup: verify user existence, active status, and tokenVersion
    // Fail-Closed: Never trust unverified JWT claims or bypass DB checks
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

      if (!currentUser) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'The user account associated with this token no longer exists',
          },
        });
      }

      if (!currentUser.isActive) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCOUNT_DISABLED',
            message: 'Your account has been deactivated or suspended',
          },
        });
      }

      const userTokenVersion = currentUser.tokenVersion ?? 0;
      const payloadTokenVersion = payload.tokenVersion ?? 0;
      if (userTokenVersion !== payloadTokenVersion) {
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
    } catch (dbErr) {
      // Fail closed: Database lookup failure must reject token
      return res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Authentication service temporarily unavailable',
        },
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication validation encountered an internal error',
      },
    });
  }
}

/**
 * Optional Authentication Middleware
 * Attaches user to req.user if a valid token and verified active DB account are present;
 * otherwise continues anonymously.
 */
export async function optionalAuth(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next();
    }

    const { valid, payload } = verifyAccessToken(token);
    if (valid && payload?.id) {
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
        const userTokenVersion = currentUser.tokenVersion ?? 0;
        const payloadTokenVersion = payload.tokenVersion ?? 0;
        if (currentUser && currentUser.isActive && userTokenVersion === payloadTokenVersion) {
          req.user = currentUser;
        }
      } catch {
        // Database lookup failure: do not attach user, proceed anonymously
      }
    }
  } catch {
    // Continue anonymously
  }
  return next();
}

/**
 * Role-Based Access Control (RBAC) Guard
 * Ensures req.user possesses at least one of the allowed roles.
 */
export function requireRole(...allowedRoles) {
  const roles = allowedRoles.flat();
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required before checking role permissions',
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of roles: [${roles.join(', ')}]`,
        },
      });
    }

    return next();
  };
}

/**
 * Resource Ownership or Admin Override Guard
 * Accepts a parameter name string (e.g. 'userId') or a resolver function (req => req.params.id)
 */
export function requireOwnershipOrAdmin(ownerParamOrFn) {
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

    if (req.user.role === 'ADMIN') {
      return next();
    }

    const ownerId = typeof ownerParamOrFn === 'function'
      ? ownerParamOrFn(req)
      : req.params[ownerParamOrFn] || req.body[ownerParamOrFn];

    if (!ownerId || ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You are not authorized to access or modify this resource',
        },
      });
    }

    return next();
  };
}
