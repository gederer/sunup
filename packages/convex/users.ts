import {query, QueryCtx} from "./_generated/server";
import {getAuthUserWithTenant} from "./lib/auth";

export const current = query({
  args: {},
  handler: async (ctx) => {
    // Use RLS helper to get current user with tenant information
    const { user } = await getAuthUserWithTenant(ctx);
    return user;
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