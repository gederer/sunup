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
import {
  createUserInTenant,
  listUsersForTenant,
  setUserActiveStatusInTenant,
  updateUserRoleInTenant,
} from "./lib/invitations";

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
    return await createUserInTenant(ctx, args);
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
    return await listUsersForTenant(ctx, args.limit);
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
    return await setUserActiveStatusInTenant(ctx, args);
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
    return await updateUserRoleInTenant(ctx, args);
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
