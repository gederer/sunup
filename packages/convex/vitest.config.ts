import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '@sunup/test-config/edge'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/_generated/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        reportsDirectory: './coverage',
        include: ['lib/**/*.ts', 'auth/**/*.ts'],
        exclude: [
          '_generated/**',
          'tests/**',
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/node_modules/**',
          '**/dist/**'
        ],
        thresholds: {
          lines: 90,
          functions: 70,
          branches: 95,
          statements: 90
        }
      }
    }
  })
)
