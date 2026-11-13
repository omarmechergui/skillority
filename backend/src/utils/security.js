import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

export function generateCryptoToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

export function hashCryptoToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
