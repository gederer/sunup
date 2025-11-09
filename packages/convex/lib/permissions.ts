/**
 * Permission Helpers for better-auth Access Control
 *
 * These helpers make it easy to check permissions in queries and mutations.
 * They work alongside the RLS helpers to enforce both tenant isolation
 * and role-based access control.
 *
 * USAGE PATTERN:
 * 1. Call getAuthUserWithTenant() to get user + tenant (enforces RLS)
 * 2. Call requirePermission() to check specific action permissions
 * 3. Proceed with operation if permission check passes
 *
 * Story: 1.5 - Integrate better-auth Authentication (Phase 3)
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { getAuthUserWithTenant, UserWithTenant, requireRole } from "./auth";
import { ac, roles, statement } from "../auth/permissions";

/**
 * Resource names from permission system
 */
export type Resource = keyof typeof statement;

/**
 * Actions for a given resource
 */
export type Action<R extends Resource> = (typeof statement)[R][number];

/**
 * Check if user has permission for an action on a resource
 *
 * @param userWithTenant - User object from getAuthUserWithTenant
 * @param resource - Resource name (e.g., "person", "project")
 * @param action - Action name (e.g., "create", "read", "update")
 * @returns true if user has permission, false otherwise
 *
 * @example
 * ```typescript
 * const auth = await getAuthUserWithTenant(ctx);
 * if (!hasPermission(auth, "person", "create")) {
 *   throw new Error("Forbidden: Cannot create person records");
 * }
 * ```
 */
export function hasPermission<R extends Resource>(
  userWithTenant: UserWithTenant,
  resource: R,
  action: Action<R>
): boolean {
  // Get all permissions for user's roles
  const userRoles = userWithTenant.roles;

  // Check if any of the user's roles grants this permission
  for (const roleName of userRoles) {
    // @ts-ignore - Dynamic role access
    const role = roles[roleName];
    if (!role) continue;

    const permissions = role.getPermissions();
    const resourcePerms = permissions[resource] || [];

    if (resourcePerms.includes(action as any)) {
      return true;
    }
  }

  return false;
}

/**
 * Require permission for an action on a resource (throws if unauthorized)
 *
 * @param ctx - Query or Mutation context
 * @param resource - Resource name
 * @param action - Action name
 * @returns UserWithTenant object if permission granted
 * @throws Error if user doesn't have permission
 *
 * @example
 * ```typescript
 * export const createPerson = mutation({
 *   handler: async (ctx, args) => {
 *     const auth = await requirePermission(ctx, "person", "create");
 *     // Proceed with creation...
 *   }
 * });
 * ```
 */
export async function requirePermission<R extends Resource>(
  ctx: QueryCtx | MutationCtx,
  resource: R,
  action: Action<R>
): Promise<UserWithTenant> {
  // First get authenticated user with tenant
  const auth = await getAuthUserWithTenant(ctx);

  // Check permission
  if (!hasPermission(auth, resource, action)) {
    throw new Error(
      `Forbidden: You don't have permission to ${action as string} ${resource}`
    );
  }

  return auth;
}

/**
 * Require ANY of the specified roles (throws if user doesn't have any)
 *
 * This is a re-export of requireRole from auth.ts for convenience
 * and to keep all permission checks in one place.
 *
 * @example
 * ```typescript
 * const auth = await requireAnyRole(ctx, ["System Administrator", "Finance"]);
 * ```
 */
export const requireAnyRole = requireRole;

/**
 * Check if user has ANY of the specified roles
 *
 * @param userWithTenant - User object from getAuthUserWithTenant
 * @param allowedRoles - Array of role names to check
 * @returns true if user has any of the roles
 *
 * @example
 * ```typescript
 * const auth = await getAuthUserWithTenant(ctx);
 * if (hasAnyRole(auth, ["System Administrator", "Executive"])) {
 *   // Show admin dashboard
 * }
 * ```
 */
export function hasAnyRole(
  userWithTenant: UserWithTenant,
  allowedRoles: string[]
): boolean {
  return userWithTenant.roles.some((role) => allowedRoles.includes(role));
}

/**
 * Check if user has ALL of the specified roles
 *
 * @param userWithTenant - User object from getAuthUserWithTenant
 * @param requiredRoles - Array of role names (user must have all)
 * @returns true if user has all of the roles
 */
export function hasAllRoles(
  userWithTenant: UserWithTenant,
  requiredRoles: string[]
): boolean {
  return requiredRoles.every((role) => userWithTenant.roles.includes(role));
}

/**
 * Verify ownership: Check if a record belongs to user's tenant
 *
 * This is a common pattern for RLS verification after fetching a record.
 * Use this to ensure a record belongs to the user's tenant before
 * performing update/delete operations.
 *
 * @param record - Database record with tenantId field
 * @param userTenantId - User's tenant ID from getAuthUserWithTenant
 * @param resourceName - Name of resource for error message
 * @throws Error if record doesn't belong to user's tenant
 *
 * @example
 * ```typescript
 * const auth = await getAuthUserWithTenant(ctx);
 * const task = await ctx.db.get(args.id);
 * if (!task) throw new Error("Task not found");
 * verifyTenantOwnership(task, auth.tenantId, "task");
 * // Proceed with update/delete...
 * ```
 */
export function verifyTenantOwnership<T extends { tenantId: string }>(
  record: T,
  userTenantId: string,
  resourceName: string
): void {
  if (record.tenantId !== userTenantId) {
    throw new Error(
      `Unauthorized: This ${resourceName} belongs to a different tenant`
    );
  }
}

/**
 * Common permission patterns as reusable helpers
 */
export const PermissionPatterns = {
  /**
   * Check if user can manage users (create, update, delete, ban)
   */
  canManageUsers: (auth: UserWithTenant) =>
    hasPermission(auth, "user", "create") ||
    hasPermission(auth, "user", "update") ||
    hasPermission(auth, "user", "delete"),

  /**
   * Check if user can view analytics
   */
  canViewAnalytics: (auth: UserWithTenant) =>
    hasPermission(auth, "analytics", "view"),

  /**
   * Check if user can manage campaigns
   */
  canManageCampaigns: (auth: UserWithTenant) =>
    hasPermission(auth, "campaign", "create") ||
    hasPermission(auth, "campaign", "update") ||
    hasPermission(auth, "campaign", "delete"),

  /**
   * Check if user can approve commissions
   */
  canApproveCommissions: (auth: UserWithTenant) =>
    hasPermission(auth, "commission", "approve"),

  /**
   * Check if user can manage tenants (System Admin only)
   */
  canManageTenants: (auth: UserWithTenant) =>
    hasPermission(auth, "tenant", "create") ||
    hasPermission(auth, "tenant", "update") ||
    hasPermission(auth, "tenant", "delete"),

  /**
   * Check if user is a System Administrator
   */
  isSystemAdmin: (auth: UserWithTenant) =>
    auth.roles.includes("System Administrator"),

  /**
   * Check if user is in management (any manager or executive role)
   */
  isManagement: (auth: UserWithTenant) =>
    hasAnyRole(auth, [
      "Sales Manager",
      "Setter Manager",
      "Project Manager",
      "System Administrator",
      "Executive",
      "Operations",
    ]),
};
