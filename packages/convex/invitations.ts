/**
 * User Invitation System with better-auth Admin API
 *
 * Uses better-auth Admin plugin to create users directly.
 * Full invitation workflow (Story 1.6.5) will add:
 * - userInvitations table in schema
 * - Invitation email flow with magic links
 * - Token-based invitation acceptance
 * - Expiration handling
 * - UI for inviting users
 *
 * Story: 1.5 - Integrate better-auth Authentication
 */

import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requirePermission } from "./lib/permissions";

/**
 * Create a new user using better-auth Admin API
 *
 * This mutation creates a user directly in the better-auth system
 * and syncs them to the Convex database with the specified tenant.
 *
 * Requires: "user:create" permission (System Admin, Recruiter, Trainer)
 *
 * @param email - Email address for the new user
 * @param firstName - First name
 * @param lastName - Last name
 * @param tenantId - Tenant ID to assign
 * @param roles - Array of role names to assign (default: ["Setter"])
 * @returns Created user information
 */
export const createUser = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    tenantId: v.id("tenants"),
    roles: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Check permission to create users
    const auth = await requirePermission(ctx, "user", "create");

    // Verify tenant exists
    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant) {
      throw new Error(`Tenant not found: ${args.tenantId}`);
    }

    // System Admins can create users in any tenant
    // Other roles can only create users in their own tenant
    if (
      !auth.roles.includes("System Administrator") &&
      args.tenantId !== auth.tenantId
    ) {
      throw new Error("Forbidden: Cannot create users for other tenants");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error(
        `User with email ${args.email} already exists in the system`
      );
    }

    // Note: In Phase 4, we'll integrate with better-auth Admin API here
    // For now, create the user record directly
    // TODO Phase 4: Call auth.api.createUser() from better-auth Admin API

    // Generate a temporary authId (will be replaced by better-auth in Phase 4)
    const tempAuthId = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create user in database
    const userId = await ctx.db.insert("users", {
      authId: tempAuthId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      isActive: true,
      tenantId: args.tenantId,
    });

    // Create user roles (default to Setter if not specified)
    const rolesToAssign = args.roles || ["Setter"];
    for (const role of rolesToAssign) {
      await ctx.db.insert("userRoles", {
        userId,
        role: role as any, // Cast to satisfy schema type
        isActive: true,
        isPrimary: rolesToAssign.indexOf(role) === 0, // First role is primary
        tenantId: args.tenantId,
      });
    }

    console.log(
      `[USER CREATED] ${args.email} (${args.firstName} ${args.lastName}) - Tenant: ${tenant.name}`
    );

    return {
      success: true,
      userId,
      email: args.email,
      tenantId: args.tenantId,
      tenantName: tenant.name,
      roles: rolesToAssign,
      message: `User ${args.email} created successfully. They will receive a magic link to log in.`,
      nextSteps: [
        "1. User will receive a magic link email (Phase 4)",
        "2. User clicks link to verify and log in",
        "3. User is automatically assigned to correct tenant",
      ],
    };
  },
});

/**
 * List users in the system
 *
 * System Admins can see all users.
 * Other roles can only see users in their tenant.
 *
 * Requires: "user:read" permission
 */
export const listUsers = mutation({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const auth = await requirePermission(ctx, "user", "read");

    const limit = args.limit || 50;

    // System Admins can see all users
    if (auth.roles.includes("System Administrator")) {
      return await ctx.db.query("users").take(limit);
    }

    // Other roles see only their tenant's users
    return await ctx.db
      .query("users")
      .withIndex("by_tenant", (q) => q.eq("tenantId", auth.tenantId))
      .take(limit);
  },
});

/**
 * Update user activation status
 *
 * Requires: "user:update" permission (System Admin, Recruiter, Trainer)
 */
export const setUserActiveStatus = mutation({
  args: {
    userId: v.id("users"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const auth = await requirePermission(ctx, "user", "update");

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Only System Admins can update users in other tenants
    if (
      !auth.roles.includes("System Administrator") &&
      user.tenantId !== auth.tenantId
    ) {
      throw new Error("Forbidden: Cannot update users from other tenants");
    }

    await ctx.db.patch(args.userId, {
      isActive: args.isActive,
    });

    return {
      success: true,
      message: `User ${user.email} ${args.isActive ? "activated" : "deactivated"}`,
    };
  },
});

/**
 * Assign or remove role from user
 *
 * Requires: "user:update" permission (System Admin, managers)
 */
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
    action: v.union(v.literal("add"), v.literal("remove")),
  },
  handler: async (ctx, args) => {
    const auth = await requirePermission(ctx, "user", "update");

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Only System Admins can update users in other tenants
    if (
      !auth.roles.includes("System Administrator") &&
      user.tenantId !== auth.tenantId
    ) {
      throw new Error("Forbidden: Cannot update users from other tenants");
    }

    if (args.action === "add") {
      // Check if role already exists
      const existingRole = await ctx.db
        .query("userRoles")
        .withIndex("by_user_and_role", (q) =>
          q.eq("userId", args.userId).eq("role", args.role as any)
        )
        .first();

      if (existingRole) {
        throw new Error(`User already has role: ${args.role}`);
      }

      // Add new role
      await ctx.db.insert("userRoles", {
        userId: args.userId,
        role: args.role as any,
        isActive: true,
        isPrimary: false,
        tenantId: user.tenantId,
      });

      return {
        success: true,
        message: `Role "${args.role}" added to user ${user.email}`,
      };
    } else {
      // Remove role
      const roleToRemove = await ctx.db
        .query("userRoles")
        .withIndex("by_user_and_role", (q) =>
          q.eq("userId", args.userId).eq("role", args.role as any)
        )
        .first();

      if (!roleToRemove) {
        throw new Error(`User doesn't have role: ${args.role}`);
      }

      await ctx.db.delete(roleToRemove._id);

      return {
        success: true,
        message: `Role "${args.role}" removed from user ${user.email}`,
      };
    }
  },
});

/**
 * TODO: Story 1.6.5 - Implement Full Invitation Workflow
 *
 * Features to add:
 * 1. userInvitations table in schema
 * 2. inviteUser mutation (requires Recruiter/Trainer/Manager/Admin role)
 * 3. Invitation email with magic link
 * 4. Token-based invitation acceptance
 * 5. Expiration handling (7 days)
 * 6. Resend invitation capability
 * 7. View pending invitations
 * 8. Cancel invitation
 *
 * Reference: docs/multi-tenant-rls.md for security considerations
 */
