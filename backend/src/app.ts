import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { config } from './config.js';
import { errorHandler } from './middleware/index.js';
import { authenticate } from './middleware/auth.js';
import { enforceTenant } from './middleware/tenant.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';

const app = express();

// Middleware
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root API endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'panacea-api',
    version: '0.1.0',
    status: 'running',
  });
});

// Auth routes (public, no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes middleware
// All routes below this point require authentication + tenant isolation
app.use('/api', authenticate, enforceTenant);

// Protected domain routes (require auth + tenant isolation)
app.use('/api/patients', patientRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
