/**
 * Multi-Tenant Row-Level Security (RLS) Helpers
 *
 * These helpers enforce tenant isolation by:
 * 1. Extracting user identity from Clerk JWT tokens
 * 2. Looking up the user in the database
 * 3. Returning the user's tenantId for query filtering
 *
 * CRITICAL SECURITY RULES:
 * - EVERY query and mutation MUST use getAuthUserWithTenant
 * - NEVER accept tenantId as a parameter from the client
 * - NEVER skip tenantId validation
 * - ALWAYS filter queries by tenantId
 *
 * Story: 1.4 - Implement Multi-Tenant Row-Level Security (RLS) Foundation
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Type representing a user with tenant information
 */
export interface UserWithTenant {
  user: {
    _id: Id<"users">;
    _creationTime: number;
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    tenantId: Id<"tenants">;
  };
  tenantId: Id<"tenants">;
}

/**
 * Get authenticated user with tenant information
 *
 * This is the core RLS helper that MUST be called at the start of every
 * query and mutation to enforce tenant isolation.
 *
 * @param ctx - Query or Mutation context
 * @returns Object containing user record and tenantId
 * @throws "Unauthorized" if no user identity (not logged in)
 * @throws "User not found" if Clerk user not synced to database
 *
 * @example
 * ```typescript
 * export const listTasks = query({
 *   handler: async (ctx) => {
 *     const { tenantId } = await getAuthUserWithTenant(ctx);
 *     return await ctx.db
 *       .query("tasks")
 *       .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
 *       .collect();
 *   }
 * });
 * ```
 */
export async function getAuthUserWithTenant(
  ctx: QueryCtx | MutationCtx
): Promise<UserWithTenant> {
  // Get Clerk JWT identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  // Look up user by Clerk ID
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  // Return user and tenantId for RLS filtering
  return {
    user,
    tenantId: user.tenantId,
  };
}

/**
 * Require specific role(s) for the authenticated user
 *
 * This extends getAuthUserWithTenant to also check user roles.
 * Useful for operations that should only be accessible to certain roles
 * (e.g., System Admin, Finance, Manager).
 *
 * @param ctx - Query or Mutation context
 * @param allowedRoles - Array of roles that are allowed to perform this operation
 * @returns Object containing user record and tenantId
 * @throws "Unauthorized" if no user identity
 * @throws "User not found" if user doesn't exist
 * @throws "Forbidden" if user doesn't have any of the allowed roles
 *
 * @example
 * ```typescript
 * export const createCommission = mutation({
 *   handler: async (ctx, args) => {
 *     const { user, tenantId } = await requireRole(ctx, ["Finance", "System Administrator"]);
 *     // Proceed with operation...
 *   }
 * });
 * ```
 */
export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  allowedRoles: string[]
): Promise<UserWithTenant> {
  // First get authenticated user
  const { user, tenantId } = await getAuthUserWithTenant(ctx);

  // Look up user's roles
  const roles = await ctx.db
    .query("userRoles")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .collect();

  // Check if user has any of the allowed roles (must be active)
  const hasRole = roles.some(
    (r) => allowedRoles.includes(r.role) && r.isActive
  );

  if (!hasRole) {
    throw new Error("Forbidden");
  }

  return { user, tenantId };
}

/**
 * Get current user or return null if not authenticated
 *
 * This is a non-throwing version of getAuthUserWithTenant,
 * useful for optional authentication scenarios.
 *
 * @param ctx - Query or Mutation context
 * @returns UserWithTenant object or null if not authenticated
 *
 * @example
 * ```typescript
 * export const listPublicAndPrivateTasks = query({
 *   handler: async (ctx) => {
 *     const auth = await getCurrentUserOrNull(ctx);
 *
 *     if (auth) {
 *       // User is authenticated - show their tenant's tasks
 *       return await ctx.db
 *         .query("tasks")
 *         .withIndex("by_tenant", (q) => q.eq("tenantId", auth.tenantId))
 *         .collect();
 *     } else {
 *       // User not authenticated - show only public tasks
 *       return [];
 *     }
 *   }
 * });
 * ```
 */
export async function getCurrentUserOrNull(
  ctx: QueryCtx | MutationCtx
): Promise<UserWithTenant | null> {
  try {
    return await getAuthUserWithTenant(ctx);
  } catch (error) {
    // Return null if unauthorized or user not found
    return null;
  }
}
