import jwt from 'jsonwebtoken';

function getSecret(name, fallbackDev) {
  const secret = process.env[name];
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`CRITICAL SECURITY FAILURE: Environment variable ${name} must be set in production!`);
    }
    return fallbackDev;
  }
  return secret;
}

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export function signAccessToken(payload) {
  // payload: { id, email, role, tokenVersion }
  const secret = getSecret('JWT_ACCESS_SECRET', 'dev_access_secret_skillority_must_change');
  return jwt.sign(payload, secret, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(payload) {
  const secret = getSecret('JWT_REFRESH_SECRET', 'dev_refresh_secret_skillority_must_change');
  return jwt.sign(payload, secret, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccessToken(token) {
  try {
    const secret = getSecret('JWT_ACCESS_SECRET', 'dev_access_secret_skillority_must_change');
    return { valid: true, payload: jwt.verify(token, secret) };
  } catch (error) {
    return { valid: false, error: error.name, message: error.message };
  }
}

export function verifyRefreshToken(token) {
  try {
    const secret = getSecret('JWT_REFRESH_SECRET', 'dev_refresh_secret_skillority_must_change');
    return { valid: true, payload: jwt.verify(token, secret) };
  } catch (error) {
    return { valid: false, error: error.name, message: error.message };
  }
}
