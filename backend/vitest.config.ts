import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist'],
    },
    globals: true,
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/panacea_test',
      JWT_SECRET: 'test-jwt-secret-min-32-chars-required-for-signing',
      JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-min-32-chars-for-refresh',
      FRONTEND_URL: 'http://localhost:3000',
    },
  },
});
