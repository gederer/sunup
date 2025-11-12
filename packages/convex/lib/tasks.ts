/**
 * Task Management Helper Functions
 *
 * Extracted business logic for testability.
 * Story 1.6.5: Address Testing Debt from User Management
 */

import type { Id } from "../_generated/dataModel";
import type { QueryCtx, MutationCtx } from "../_generated/server";
import { getAuthUserWithTenant } from "./auth";

export type TasksQueryCtx = QueryCtx;
export type TasksMutationCtx = MutationCtx;

/**
 * List tasks for authenticated user's tenant (RLS filtering)
 */
export async function listTasksForTenant(ctx: TasksQueryCtx) {
  const { tenantId } = await getAuthUserWithTenant(ctx);

  return await ctx.db
    .query("tasks")
    .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
    .order("desc")
    .take(10);
}

/**
 * Add task to authenticated user's tenant
 */
export async function addTaskToTenant(ctx: TasksMutationCtx, text: string) {
  const { tenantId } = await getAuthUserWithTenant(ctx);

  const taskId = await ctx.db.insert("tasks", {
    text,
    isCompleted: false,
    createdAt: Date.now(),
    tenantId,
  });

  return taskId;
}

/**
 * Toggle task completion status (with RLS check)
 */
export async function toggleTaskCompletion(
  ctx: TasksMutationCtx,
  taskId: Id<"tasks">
) {
  const { tenantId } = await getAuthUserWithTenant(ctx);

  const task = await ctx.db.get(taskId);
  if (!task) throw new Error("Task not found");

  // Verify task belongs to user's tenant (security check)
  if (task.tenantId !== tenantId) {
    throw new Error("Unauthorized: Task belongs to different tenant");
  }

  await ctx.db.patch(taskId, {
    isCompleted: !task.isCompleted,
  });
}

/**
 * Remove task (with RLS check)
 */
export async function removeTask(
  ctx: TasksMutationCtx,
  taskId: Id<"tasks">
) {
  const { tenantId } = await getAuthUserWithTenant(ctx);

  const task = await ctx.db.get(taskId);
  if (!task) throw new Error("Task not found");

  // Verify task belongs to user's tenant (security check)
  if (task.tenantId !== tenantId) {
    throw new Error("Unauthorized: Task belongs to different tenant");
  }

  await ctx.db.delete(taskId);
}
