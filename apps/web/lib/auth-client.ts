/**
 * Better Auth Client Configuration
 * Client-side authentication setup for Next.js web app
 */

"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, roles } from "@sunup/convex/auth/permissions";

/**
 * Create better-auth client instance
 * Used throughout the web app for authentication operations
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",

  plugins: [
    // Admin client for user management
    adminClient({
      ac,
      roles,
    }),
  ],
});

/**
 * Re-export useful hooks and functions
 */
export const {
  useSession,
  signIn,
  signOut,
  signUp,
} = authClient;
