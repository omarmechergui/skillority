import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';

const app = express();

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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimiter);

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Base Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'skillority-backend',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Authentication & RBAC Routes
app.use('/api/auth', authRoutes);

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
  console.error('[EXPRESS ERROR]:', err);
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

