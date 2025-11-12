import {internalMutation, query, QueryCtx} from "./_generated/server";
import {UserJSON} from "@clerk/backend";
import {v, Validator} from "convex/values";
import {getAuthUserWithTenant} from "./lib/auth";

export const current = query({
  args: {},
  handler: async (ctx) => {
    // Use RLS helper to get current user with tenant information
    const { user } = await getAuthUserWithTenant(ctx);
    return user;
  }
});

export const upsertFromClerk = internalMutation({
  args: {data: v.any() as Validator<UserJSON>}, // no runtime validation, trust Clerk
  async handler(ctx, {data}) {
    const userAttributes = {
      firstName: data.first_name ?? "",
      lastName: data.last_name ?? "",
      email: data.email_addresses[0]?.email_address ?? "",
      clerkId: data.id,
      isActive: true
    };

    const user = await userByClerkId(ctx, data.id);
    if (user === null) {
      // New user signup - must have invitation
      // Story 1.4: RLS requires tenantId assignment
      // Story 1.6.5: Full invitation workflow will be implemented

      // Check if user has tenantId in Clerk metadata (set during invitation)
      const tenantId = (data.public_metadata as any)?.tenantId;

      if (!tenantId) {
        // Public signup is disabled - users must be invited
        // Invitation workflow (Story 1.6.5) will set tenantId in Clerk metadata
        throw new Error(
          "Account registration requires an invitation. " +
          "Please contact your organization's administrator to receive an invitation."
        );
      }

      // User has valid invitation (tenantId set by invitation process)
      await ctx.db.insert("users", {
        ...userAttributes,
        tenantId,
      });
    } else {
      // Existing user - update profile data only
      await ctx.db.patch(user._id, userAttributes);
    }
  }
});

export const deleteFromClerk = internalMutation({
  args: {clerkUserId: v.string()},
  async handler(ctx, {clerkUserId}) {
    const user = await userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  }
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByClerkId(ctx, identity.subject);
}

async function userByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}