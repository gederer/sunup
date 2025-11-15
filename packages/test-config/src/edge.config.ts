import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * Shared Vitest configuration for edge-runtime environment.
 * Used for Convex backend testing.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'edge-runtime',
    testTimeout: 10000,
    passWithNoTests: true,
    server: {
      deps: {
        inline: ['convex-test']
      }
    }
  }
})
