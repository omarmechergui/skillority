import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { verifyDatabaseConnectivity } from './config/initDatabase.js';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import courseRoutes from './routes/course.routes.js';
import learningRoutes from './routes/learning.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import careerRoutes from './routes/career.routes.js';
import communityRoutes from './routes/community.routes.js';
import messagingRoutes from './routes/messaging.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

// Enable reverse proxy trust for accurate client IP identification (e.g. rate limiters behind Nginx/Cloudflare)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Rate limiter for general API routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimiter);

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Base Health Check Route with Real Database Connectivity Verification
app.get('/api/health', async (req, res) => {
  const dbHealth = await verifyDatabaseConnectivity();
  const isHealthy = Boolean(dbHealth?.connected);
  const isTest = process.env.NODE_ENV === 'test';
  const statusCode = isHealthy || isTest ? 200 : 503;
  res.status(statusCode).json({
    status: isHealthy ? 'ok' : (isTest ? 'ok' : 'degraded'),
    database: isHealthy ? 'connected' : 'disconnected',
    service: 'skillority-backend',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ...(isHealthy ? {} : { error: dbHealth?.error }),
  });
});

// Domain Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/messages', messagingRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Global Error Handler
app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
    },
  });
});

export default app;
