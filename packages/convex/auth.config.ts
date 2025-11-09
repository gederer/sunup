/**
 * Convex Auth Configuration for better-auth
 *
 * Configures Convex to accept JWT tokens from better-auth.
 *
 * Story: 1.5 - Integrate better-auth Authentication
 */

import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // better-auth JWT configuration
      // The domain should match BETTER_AUTH_URL
      domain: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;