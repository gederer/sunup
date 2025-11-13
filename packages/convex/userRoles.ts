/**
 * User Role Assignment Mutations
 *
 * These mutations handle role management for users in the system.
 * All mutations require System Administrator role for security.
 *
 * Features:
 * - Assign roles to users (with primary role designation)
 * - Deactivate roles (soft delete)
 * - Set primary role for users
 * - List user roles with proper authorization
 *
 * Story: 1.7 - Implement Role-Based Access Control (RBAC) for 15 Roles
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireRole, getAuthUserWithTenant, hasRole, Role } from "./lib/auth";
import { Id } from "./_generated/dataModel";

/**
 * Assign a role to a user
 *
 * Restricted to: System Administrator
 *
 * @param userId - The user to assign the role to
 * @param role - The role to assign (must be valid Role enum value)
 * @param isPrimary - Whether this should be the user's primary role (default: false)
 * @returns The created userRole record
 * @throws "Forbidden" if not System Administrator
 * @throws "Invalid role" if role is not in the enum
 * @throws "Role already assigned" if user already has this role
 */
export const assignRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
    isPrimary: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Only System Administrators can assign roles
    const { tenantId } = await requireRole(ctx, ["System Administrator"]);

    // Validate role is in the enum
    const validRoles: Role[] = [
      "Setter",
      "Setter Trainee",
      "Setter Manager",
      "Consultant",
      "Sales Manager",
      "Lead Manager",
      "Project Manager",
      "Installer",
      "Support Staff",
      "Recruiter",
      "Trainer",
      "System Administrator",
      "Executive",
      "Finance",
      "Operations",
    ];

    if (!validRoles.includes(args.role as Role)) {
      throw new Error(`Invalid role: ${args.role}`);
    }

    // Check for duplicate role assignment
    const existingRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user_and_role", (q) =>
        q.eq("userId", args.userId).eq("role", args.role)
      )
      .first();

    if (existingRole) {
      throw new Error("Role already assigned to this user");
    }

    // If setting as primary, unset other primary roles
    if (args.isPrimary) {
      const userRoles = await ctx.db
        .query("userRoles")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();

      for (const role of userRoles) {
        if (role.isPrimary) {
          await ctx.db.patch(role._id, { isPrimary: false });
        }
      }
    }

    // Create the role assignment
    const userRoleId = await ctx.db.insert("userRoles", {
      userId: args.userId,
      role: args.role as any,
      isActive: true,
      isPrimary: args.isPrimary ?? false,
      tenantId,
    });

    return await ctx.db.get(userRoleId);
  },
});

/**
 * Deactivate a role for a user (soft delete)
 *
 * Restricted to: System Administrator
 *
 * Sets isActive: false on the role. Does not delete the record.
 * Prevents deactivating the last active role.
 *
 * @param userRoleId - The ID of the userRole record to deactivate
 * @returns The updated userRole record
 * @throws "Forbidden" if not System Administrator
 * @throws "User role not found" if userRoleId doesn't exist
 * @throws "Cannot deactivate last active role" if this is the user's only role
 */
export const deactivateRole = mutation({
  args: {
    userRoleId: v.id("userRoles"),
  },
  handler: async (ctx, args) => {
    // Only System Administrators can deactivate roles
    await requireRole(ctx, ["System Administrator"]);

    // Get the role to deactivate
    const roleToDeactivate = await ctx.db.get(args.userRoleId);
    if (!roleToDeactivate) {
      throw new Error("User role not found");
    }

    // Check if this is the last active role
    const userRoles = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", roleToDeactivate.userId))
      .collect();

    const activeRoles = userRoles.filter((r) => r.isActive);
    if (activeRoles.length === 1 && activeRoles[0]._id === args.userRoleId) {
      throw new Error("Cannot deactivate last active role");
    }

    // If this was the primary role, set another active role as primary
    if (roleToDeactivate.isPrimary) {
      const newPrimaryRole = userRoles.find(
        (r) => r.isActive && r._id !== args.userRoleId
      );
      if (newPrimaryRole) {
        await ctx.db.patch(newPrimaryRole._id, { isPrimary: true });
      }
    }

    // Deactivate the role
    await ctx.db.patch(args.userRoleId, { isActive: false, isPrimary: false });

    return await ctx.db.get(args.userRoleId);
  },
});

/**
 * Set a role as the user's primary role
 *
 * Restricted to: System Administrator
 *
 * Sets isPrimary: true on the specified role and false on all others.
 * The role must be active.
 *
 * @param userId - The user whose primary role to set
 * @param userRoleId - The ID of the userRole to make primary
 * @returns The updated userRole record
 * @throws "Forbidden" if not System Administrator
 * @throws "User role not found" if userRoleId doesn't exist
 * @throws "Role is not active" if the role is deactivated
 * @throws "Role does not belong to user" if userRoleId belongs to different user
 */
export const setPrimaryRole = mutation({
  args: {
    userId: v.id("users"),
    userRoleId: v.id("userRoles"),
  },
  handler: async (ctx, args) => {
    // Only System Administrators can set primary roles
    await requireRole(ctx, ["System Administrator"]);

    // Get the role to make primary
    const roleToSetPrimary = await ctx.db.get(args.userRoleId);
    if (!roleToSetPrimary) {
      throw new Error("User role not found");
    }

    // Verify it belongs to the specified user
    if (roleToSetPrimary.userId !== args.userId) {
      throw new Error("Role does not belong to user");
    }

    // Verify the role is active
    if (!roleToSetPrimary.isActive) {
      throw new Error("Role is not active");
    }

    // Unset primary on all other roles for this user
    const userRoles = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const role of userRoles) {
      if (role.isPrimary && role._id !== args.userRoleId) {
        await ctx.db.patch(role._id, { isPrimary: false });
      }
    }

    // Set this role as primary
    await ctx.db.patch(args.userRoleId, { isPrimary: true });

    return await ctx.db.get(args.userRoleId);
  },
});

/**
 * List all roles for a user
 *
 * Authorization:
 * - System Administrators can see all users' roles
 * - Other users can only see their own roles
 *
 * @param userId - The user whose roles to list
 * @returns Array of userRole records (active and inactive)
 * @throws "Forbidden" if non-admin trying to view another user's roles
 */
export const listUserRoles = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { user } = await getAuthUserWithTenant(ctx);

    // Check authorization: admin can see all, others see only their own
    const isAdmin = await hasRole(ctx, "System Administrator");

    if (!isAdmin && user._id !== args.userId) {
      throw new Error("Forbidden");
    }

    // Return all roles for the user (including inactive)
    const roles = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return roles;
  },
});

/**
 * Get the current user's active roles
 *
 * Returns only active roles for the authenticated user.
 * Useful for UI components that need to check permissions.
 *
 * @returns Array of active userRole records for current user
 */
export const getMyRoles = query({
  handler: async (ctx) => {
    const { user } = await getAuthUserWithTenant(ctx);

    const roles = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Return only active roles
    return roles.filter((r) => r.isActive);
  },
});
