import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_skillority_must_change';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_skillority_must_change';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export function signAccessToken(payload) {
  // payload: { id, email, role, tokenVersion }
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccessToken(token) {
  try {
    return { valid: true, payload: jwt.verify(token, ACCESS_SECRET) };
  } catch (error) {
    return { valid: false, error: error.name, message: error.message };
  }
}

export function verifyRefreshToken(token) {
  try {
    return { valid: true, payload: jwt.verify(token, REFRESH_SECRET) };
  } catch (error) {
    return { valid: false, error: error.name, message: error.message };
  }
}
