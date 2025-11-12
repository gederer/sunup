import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'packages/convex/lib/**/*.ts',
        'packages/convex/auth/**/*.ts',
      ],
      exclude: [
        'packages/convex/_generated/**',
        'packages/convex/tests/**',
        'packages/convex/**/*.test.ts',
        'packages/convex/**/*.spec.ts',
        '**/node_modules/**',
        '**/dist/**',
      ],
      thresholds: {
        lines: 90,
        functions: 75,
        branches: 95,
        statements: 90,
      },
    },

    // Test file patterns
    include: ['packages/convex/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],

    // Test timeout
    testTimeout: 10000,

    // Globals (optional, enables describe/it/expect without imports)
    globals: true,

    // Reporter
    reporters: ['verbose'],
  },

  resolve: {
    alias: {
      '@sunup/convex': path.resolve(__dirname, './packages/convex'),
    },
  },
})
