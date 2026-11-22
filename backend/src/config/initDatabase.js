import prisma from './database.js';

/**
 * ============================================================================
 * DATABASE INITIALIZATION & MIGRATION RELIABILITY MODULE
 * ============================================================================
 * 
 * MongoDB + Prisma Architecture Notes:
 * 1. Schema Synchronization:
 *    - In MongoDB, Prisma does not use SQL migration folders (`prisma migrate dev`).
 *    - Schema synchronization is managed via `prisma db push`.
 *    - It creates collections and indexes idempotently without dropping existing data.
 * 
 * 2. Multi-Document Transactions:
 *    - Prisma interactive transactions (`prisma.$transaction(async (tx) => { ... })`)
 *      require MongoDB to run as a Replica Set (e.g. MongoDB Atlas or local `rs0`).
 * 
 * 3. Recovery Behavior:
 *    - If a transaction aborts (e.g. transient network glitch, write conflict),
 *      Prisma automatically triggers rollback on uncommitted operations.
 *    - Handled application-level retries or fail-closed responses prevent partial writes.
 */

export async function verifyDatabaseConnectivity() {
  try {
    // Ping database via a lightweight non-destructive read
    await prisma.$runCommandRaw({ ping: 1 });
    return { connected: true };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      code: err.code || 'DB_CONNECTION_ERROR',
    };
  }
}

export async function checkDatabasePrerequisites() {
  const issues = [];
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.trim().length === 0) {
    issues.push('DATABASE_URL is not configured.');
  }

  return {
    ready: issues.length === 0,
    issues,
  };
}

export default {
  verifyDatabaseConnectivity,
  checkDatabasePrerequisites,
};
