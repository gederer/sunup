import { defineConfig } from 'vitest/config'

/**
 * Shared Vitest configuration for Node.js environment.
 * Used for testing utilities, type guards, and server-side logic.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 5000,
    passWithNoTests: true
  }
})
