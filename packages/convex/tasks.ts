import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserWithTenant } from "./lib/auth";

/**
 * Simple tasks demo to demonstrate Convex real-time subscriptions
 * Updated in Story 1.4 to enforce Row-Level Security (RLS)
 *
 * All queries and mutations now filter by tenantId to ensure data isolation.
 */

export const list = query({
  args: {},
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    return await ctx.db
      .query("tasks")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .order("desc")
      .take(10);
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      createdAt: Date.now(),
      tenantId,
    });
    return taskId;
  },
});

export const toggle = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");

    // Verify task belongs to user's tenant (security check)
    if (task.tenantId !== tenantId) {
      throw new Error("Unauthorized: Task belongs to different tenant");
    }

    await ctx.db.patch(args.id, {
      isCompleted: !task.isCompleted,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");

    // Verify task belongs to user's tenant (security check)
    if (task.tenantId !== tenantId) {
      throw new Error("Unauthorized: Task belongs to different tenant");
    }

    await ctx.db.delete(args.id);
  },
});
