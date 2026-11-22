import 'dotenv/config';
import app from './app.js';
import { validateAuthConfig } from './utils/jwt.js';

// Validate security secrets at application startup
validateAuthConfig();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Skillority Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Skillority Backend] Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`[Skillority Backend] Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

