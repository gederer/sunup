import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * Shared Vitest configuration for React component testing.
 * Used for UI components and Next.js applications.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    testTimeout: 5000,
    passWithNoTests: true
  }
})
