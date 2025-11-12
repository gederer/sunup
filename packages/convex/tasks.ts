import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  listTasksForTenant,
  addTaskToTenant,
  toggleTaskCompletion,
  removeTask,
} from "./lib/tasks";

/**
 * Simple tasks demo to demonstrate Convex real-time subscriptions
 * Updated in Story 1.4 to enforce Row-Level Security (RLS)
 * Refactored in Story 1.6.5 to extract testable business logic
 *
 * All queries and mutations now filter by tenantId to ensure data isolation.
 */

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await listTasksForTenant(ctx);
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    return await addTaskToTenant(ctx, args.text);
  },
});

export const toggle = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await toggleTaskCompletion(ctx, args.id);
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await removeTask(ctx, args.id);
  },
});
