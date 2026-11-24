import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const INSECURE_PATTERNS = [
  'change_me',
  'placeholder',
  'must_change',
  'default',
  'dev_access_secret',
  'dev_refresh_secret',
  'skillority_development',
  'replace_with',
  'secret_key',
  'jwt_secret',
  'example',
  'dummy',
];

/**
 * Validates a JWT secret against minimum security requirements:
 * - Must be present and non-empty
 * - Must be at least 32 characters in length
 * - In production, must not contain known placeholder / development patterns
 */
export function validateJwtSecret(name, secret) {
  if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
    throw new Error(`CRITICAL SECURITY FAILURE: ${name} is required and must not be empty.`);
  }

  if (secret.length < 32) {
    throw new Error(
      `CRITICAL SECURITY FAILURE: ${name} must be at least 32 characters long for cryptographic safety (received ${secret.length}).`
    );
  }

  if (process.env.NODE_ENV === 'production') {
    const lower = secret.toLowerCase();
    for (const pattern of INSECURE_PATTERNS) {
      if (lower.includes(pattern)) {
        throw new Error(
          `CRITICAL SECURITY FAILURE: ${name} contains insecure placeholder pattern "${pattern}". In production, a cryptographically secure 32+ character key is required.`
        );
      }
    }
  }

  return secret;
}

export function getSecret(name) {
  let val = process.env[name];
  // Allow test environments setting a generic JWT_SECRET
  if (!val && (name === 'JWT_ACCESS_SECRET' || name === 'JWT_REFRESH_SECRET')) {
    val = process.env.JWT_SECRET;
  }
  return validateJwtSecret(name, val);
}

/**
 * Validates all required auth secrets at application startup.
 */
export function validateAuthConfig() {
  getSecret('JWT_ACCESS_SECRET');
  getSecret('JWT_REFRESH_SECRET');
  if (process.env.NODE_ENV === 'production') {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl.includes('placeholder_user') || dbUrl.includes('placeholder_pass')) {
      throw new Error('CRITICAL SECURITY FAILURE: DATABASE_URL must not contain placeholder credentials in production.');
    }
  }
}

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export function signAccessToken(payload) {
  const secret = getSecret('JWT_ACCESS_SECRET');
  return jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    secret,
    { expiresIn: ACCESS_EXPIRES }
  );
}

export function signRefreshToken(payload) {
  const secret = getSecret('JWT_REFRESH_SECRET');
  return jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    secret,
    { expiresIn: REFRESH_EXPIRES }
  );
}

export function verifyAccessToken(token) {
  try {
    const secret = getSecret('JWT_ACCESS_SECRET');
    return { valid: true, payload: jwt.verify(token, secret) };
  } catch (error) {
    return { valid: false, error: error.name, message: error.message };
  }
}

export function verifyRefreshToken(token) {
  try {
    const secret = getSecret('JWT_REFRESH_SECRET');
    return { valid: true, payload: jwt.verify(token, secret) };
  } catch (error) {
    return { valid: false, error: error.name, message: error.message };
  }
}
