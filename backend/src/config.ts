/**
 * Typed environment configuration
 * Mirrors frontend pattern: src/lib/env.ts
 * Throws on startup if required vars are missing
 */

const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value && requiredVars.includes(key)) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
}

export const config = {
  // Server
  nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  port: parseInt(process.env.PORT || '4000', 10),

  // Database
  databaseUrl: getEnv('DATABASE_URL'),

  // JWT
  jwtSecret: getEnv('JWT_SECRET'),
  jwtRefreshSecret: getEnv('JWT_REFRESH_SECRET'),
  jwtExpiresIn: '24h',
  jwtRefreshExpiresIn: '7d',

  // File Storage (Cloudinary)
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',

  // Email (SendGrid)
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',

  // Redis
  redisUrl: process.env.REDIS_URL || '',

  // Frontend (CORS)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Computed
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

export default config;
