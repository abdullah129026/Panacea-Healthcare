import 'dotenv/config.js';
import app from './app.js';
import config from './config.js';

const server = app.listen(config.port, () => {
  console.log(`[server] listening on port ${config.port}`);
  console.log(`[server] NODE_ENV=${config.nodeEnv}`);
  console.log(`[server] frontend origin: ${config.frontendUrl}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('[server] shutdown complete');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[server] SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('[server] shutdown complete');
    process.exit(0);
  });
});
