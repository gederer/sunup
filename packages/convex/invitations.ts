/**
 * User Invitation System (Basic Implementation for Story 1.4)
 *
 * Full invitation workflow will be implemented in Story 1.6.5
 * This provides a basic mechanism for development/testing
 *
 * Story 1.6.5 will add:
 * - userInvitations table in schema
 * - Full invitation email flow
 * - Token-based invitation acceptance
 * - Expiration handling
 * - UI for inviting users
 */

import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * DEVELOPMENT ONLY: Manually create an invitation by setting Clerk metadata
 *
 * This is a temporary helper for development until Story 1.6.5 implements
 * the full invitation workflow with email, tokens, and expiration.
 *
 * Usage via Convex dashboard:
 * 1. Run this mutation with email and tenantId
 * 2. Manually set the tenantId in Clerk dashboard:
 *    - Go to Clerk dashboard > Users
 *    - Click on user
 *    - Public metadata: { "tenantId": "j57abc123..." }
 * 3. User can now sign up successfully
 *
 * @param email - Email address to invite
 * @param tenantId - Tenant ID to assign to user
 * @returns Instructions for completing the invitation
 */
export const createDevInvitation = internalMutation({
  args: {
    email: v.string(),
    tenantId: v.id("tenants"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify tenant exists
    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant) {
      throw new Error(`Tenant not found: ${args.tenantId}`);
    }

    // Log invitation for tracking
    console.log(`[DEV INVITATION] Email: ${args.email}, Tenant: ${tenant.name} (${args.tenantId})`);

    return {
      success: true,
      message: "Development invitation created",
      instructions: [
        "1. Go to Clerk dashboard: https://dashboard.clerk.com",
        "2. Navigate to Users section",
        `3. Find or invite user: ${args.email}`,
        "4. Click on the user to edit",
        "5. In 'Public metadata' section, add:",
        `   { "tenantId": "${args.tenantId}" }`,
        "6. Save changes",
        "7. User can now sign up successfully",
      ],
      email: args.email,
      tenantId: args.tenantId,
      tenantName: tenant.name,
      notes: args.notes,
      nextStory: "Story 1.6.5 will automate this process with invitation emails and tokens",
    };
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
