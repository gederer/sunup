import { query } from "./_generated/server";
import { getAuthUserWithTenant } from "./lib/auth";

/**
 * User Queries
 *
 * Provides access to current user information with full RLS and
 * role-based access control enforcement.
 *
 * Story: 1.5 - Integrate better-auth Authentication
 */

/**
 * Get current authenticated user
 *
 * Returns the current user's record including all fields and
 * their tenant information. Automatically enforces RLS.
 *
 * @returns Current user record
 * @throws "Unauthorized" if not logged in
 * @throws "User not found" if user not synced to database
 */
export const current = query({
  args: {},
  handler: async (ctx) => {
    // Use RLS helper to get current user with tenant information
    const { user, roles } = await getAuthUserWithTenant(ctx);

    // Return user with roles for client-side permission checks
    return {
      ...user,
      roles, // Include roles for client-side UI adjustments
    };
  },
});