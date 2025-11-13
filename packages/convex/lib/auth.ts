/**
 * Multi-Tenant Row-Level Security (RLS) and RBAC Helpers
 *
 * These helpers enforce tenant isolation and role-based access control by:
 * 1. Extracting user identity from Clerk JWT tokens
 * 2. Looking up the user in the database
 * 3. Returning the user's tenantId for query filtering
 * 4. Checking user roles for authorization
 *
 * CRITICAL SECURITY RULES:
 * - EVERY query and mutation MUST use getAuthUserWithTenant
 * - NEVER accept tenantId as a parameter from the client
 * - NEVER skip tenantId validation
 * - ALWAYS filter queries by tenantId
 *
 * Story: 1.4 - Implement Multi-Tenant Row-Level Security (RLS) Foundation
 * Story: 1.7 - Implement Role-Based Access Control (RBAC) for 15 Roles
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Valid roles in the Sunup platform (15 total)
 */
export type Role =
  | "Setter"
  | "Setter Trainee"
  | "Setter Manager"
  | "Consultant"
  | "Sales Manager"
  | "Lead Manager"
  | "Project Manager"
  | "Installer"
  | "Support Staff"
  | "Recruiter"
  | "Trainer"
  | "System Administrator"
  | "Executive"
  | "Finance"
  | "Operations";

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
  allowedRoles: Role[]
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
    (r) => allowedRoles.includes(r.role as Role) && r.isActive
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

/**
 * Check if the authenticated user has a specific role (non-throwing)
 *
 * This is a non-throwing version of requireRole that returns a boolean.
 * Useful for conditional logic in queries/mutations or UI rendering.
 *
 * @param ctx - Query or Mutation context
 * @param role - The role to check for
 * @returns true if user has the role (and it's active), false otherwise
 *
 * @example
 * ```typescript
 * export const listSensitiveData = query({
 *   handler: async (ctx) => {
 *     const isAdmin = await hasRole(ctx, "System Administrator");
 *
 *     if (isAdmin) {
 *       // Return all data for admins
 *       return await ctx.db.query("sensitiveData").collect();
 *     } else {
 *       // Return filtered data for non-admins
 *       return [];
 *     }
 *   }
 * });
 * ```
 */
export async function hasRole(
  ctx: QueryCtx | MutationCtx,
  role: Role
): Promise<boolean> {
  try {
    const { user } = await getAuthUserWithTenant(ctx);

    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user_and_role", (q) =>
        q.eq("userId", user._id).eq("role", role)
      )
      .first();

    return userRole !== null && userRole.isActive;
  } catch (error) {
    // Return false if not authenticated or user not found
    return false;
  }
}

/**
 * Get all active roles for the authenticated user
 *
 * Returns an array of role objects including metadata (isPrimary, tenantId).
 * Only returns active roles (isActive: true).
 *
 * @param ctx - Query or Mutation context
 * @returns Array of active role objects, or empty array if not authenticated
 *
 * @example
 * ```typescript
 * export const getUserProfile = query({
 *   handler: async (ctx) => {
 *     const { user } = await getAuthUserWithTenant(ctx);
 *     const roles = await getUserRoles(ctx);
 *
 *     return {
 *       ...user,
 *       roles: roles.map(r => r.role),
 *       primaryRole: roles.find(r => r.isPrimary)?.role
 *     };
 *   }
 * });
 * ```
 */
export async function getUserRoles(
  ctx: QueryCtx | MutationCtx
): Promise<Array<{
  _id: Id<"userRoles">;
  _creationTime: number;
  userId: Id<"users">;
  role: Role;
  isActive: boolean;
  isPrimary: boolean;
  tenantId: Id<"tenants">;
}>> {
  try {
    const { user } = await getAuthUserWithTenant(ctx);

    const roles = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Filter to only active roles
    return roles.filter((r) => r.isActive) as any;
  } catch (error) {
    // Return empty array if not authenticated
    return [];
  }
}

/**
 * Check if the authenticated user has any of the specified roles
 *
 * Returns true if the user has at least one of the specified roles.
 * All roles must be active (isActive: true).
 *
 * @param ctx - Query or Mutation context
 * @param roles - Array of roles to check for
 * @returns true if user has any of the roles, false otherwise
 *
 * @example
 * ```typescript
 * export const viewFinancialReports = query({
 *   handler: async (ctx) => {
 *     const canView = await hasAnyRole(ctx, ["Finance", "Executive", "System Administrator"]);
 *
 *     if (!canView) {
 *       throw new Error("Forbidden");
 *     }
 *
 *     return await ctx.db.query("financialReports").collect();
 *   }
 * });
 * ```
 */
export async function hasAnyRole(
  ctx: QueryCtx | MutationCtx,
  roles: Role[]
): Promise<boolean> {
  try {
    const { user } = await getAuthUserWithTenant(ctx);

    const userRoles = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return userRoles.some(
      (r) => roles.includes(r.role as Role) && r.isActive
    );
  } catch (error) {
    // Return false if not authenticated
    return false;
  }
}

/**
 * Require that the authenticated user's primary role matches the specified role
 *
 * This is stricter than requireRole - it checks that the specified role
 * is marked as the user's primary role (isPrimary: true).
 *
 * @param ctx - Query or Mutation context
 * @param role - The required primary role
 * @returns Object containing user record and tenantId
 * @throws "Unauthorized" if no user identity
 * @throws "User not found" if user doesn't exist
 * @throws "Forbidden" if user's primary role doesn't match
 *
 * @example
 * ```typescript
 * export const manageTeam = mutation({
 *   handler: async (ctx, args) => {
 *     // Only allow if Sales Manager is the user's PRIMARY role
 *     const { user, tenantId } = await requirePrimaryRole(ctx, "Sales Manager");
 *     // Proceed with team management...
 *   }
 * });
 * ```
 */
export async function requirePrimaryRole(
  ctx: QueryCtx | MutationCtx,
  role: Role
): Promise<UserWithTenant> {
  // First get authenticated user
  const { user, tenantId } = await getAuthUserWithTenant(ctx);

  // Look up the primary role for this user
  const primaryRole = await ctx.db
    .query("userRoles")
    .withIndex("by_user_and_role", (q) =>
      q.eq("userId", user._id).eq("role", role)
    )
    .first();

  if (!primaryRole || !primaryRole.isActive || !primaryRole.isPrimary) {
    throw new Error("Forbidden");
  }

  return { user, tenantId };
}
