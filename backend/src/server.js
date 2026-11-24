import 'dotenv/config';
import app from './app.js';
import prisma from './config/database.js';
import { validateAuthConfig } from './utils/jwt.js';

// Validate security secrets at application startup
validateAuthConfig();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Skillority Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Skillority Backend] Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`[Skillority Backend] Environment: ${process.env.NODE_ENV || 'development'}`);
});

async function gracefulShutdown(signal) {
  console.log(`[Skillority Backend] ${signal} signal received: closing HTTP server and database connections`);
  server.close(async () => {
    console.log('[Skillority Backend] HTTP server closed');
    try {
      await prisma.$disconnect();
      console.log('[Skillority Backend] Database connections disconnected gracefully');
      process.exit(0);
    } catch (err) {
      console.error('[Skillority Backend] Error disconnecting database during shutdown:', err);
      process.exit(1);
    }
  });

  // Force shutdown after timeout if pending connections hang
  setTimeout(() => {
    console.error('[Skillority Backend] Graceful shutdown timed out; forcing exit');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

