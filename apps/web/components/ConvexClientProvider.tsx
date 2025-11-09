'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProvider } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/better-auth/react'
import { authClient } from '../lib/auth-client'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

/**
 * Convex Client Provider with better-auth Integration
 *
 * Wraps the application with both Convex and better-auth providers,
 * enabling authenticated Convex queries/mutations and auth state management.
 *
 * Story: 1.5 - Integrate better-auth Authentication (Phase 4)
 */
export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ConvexAuthProvider client={authClient}>
        {children}
      </ConvexAuthProvider>
    </ConvexProvider>
  )
}
