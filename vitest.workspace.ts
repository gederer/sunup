import { defineWorkspace } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineWorkspace([
  {
    plugins: [react(), tsconfigPaths()],
    test: {
      name: 'convex',
      globals: true,
      include: ['packages/convex/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/_generated/**'],
      environment: 'edge-runtime',
      server: {
        deps: {
          inline: ['convex-test'],
        },
      },
    },
  },
])
