import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '@sunup/test-config/react'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/tests/e2e/**' // Exclude Playwright E2E tests
      ]
    }
  })
)
