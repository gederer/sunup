/**
 * Event System - Pipeline Event Emitter
 * Story 1.9: Implement Event System for Pipeline Status Changes
 *
 * This module provides utilities for emitting pipeline events that enable
 * cascading actions (notifications, commission calculations) to happen automatically.
 *
 * @see docs/event-system.md for complete documentation
 */

import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { getAuthUserWithTenant } from "./auth";

/**
 * Pipeline Event Payload
 *
 * Represents the data for a pipeline status change event.
 */
export type PipelineEventPayload = {
  /** ID of the person whose pipeline stage changed */
  personId: Id<"people">;
  /** Previous stage (undefined for initial stage assignment) */
  fromStage: string | undefined;
  /** New stage */
  toStage: string;
  /** Optional reason for the change */
  reason?: string;
};

/**
 * Emit Pipeline Event
 *
 * Publishes a pipeline status change event to the pipelineEvents table.
 * This creates an audit trail and enables event-driven cascading actions.
 *
 * **Multi-tenant:** Automatically includes tenantId from authenticated user context.
 * **Error Handling:** Wrapped in try/catch by caller to prevent blocking main operations.
 *
 * @param ctx - Mutation context (provides db and auth)
 * @param payload - Event data (personId, fromStage, toStage, optional reason)
 * @returns Promise<Id<"personPipelineEvents">> - ID of created event record
 *
 * @example
 * ```typescript
 * // In a mutation that changes pipeline stage
 * try {
 *   await emitPipelineEvent(ctx, {
 *     personId: args.personId,
 *     fromStage: currentStage,
 *     toStage: args.newStage,
 *     reason: "Qualified by setter"
 *   });
 * } catch (error) {
 *   console.error("Failed to emit pipeline event:", error);
 *   // Don't fail the mutation - event emission is non-critical
 * }
 * ```
 */
export async function emitPipelineEvent(
  ctx: MutationCtx,
  payload: PipelineEventPayload
): Promise<Id<"personPipelineEvents">> {
  // Get authenticated user and tenantId for RLS
  const { user, tenantId } = await getAuthUserWithTenant(ctx);

  // Validate required fields
  if (!payload.personId) {
    throw new Error("emitPipelineEvent: personId is required");
  }
  if (!payload.toStage) {
    throw new Error("emitPipelineEvent: toStage is required");
  }

  // Prepare metadata (optional fields as JSON)
  const metadata = payload.reason
    ? JSON.stringify({ reason: payload.reason })
    : undefined;

  // Insert event record
  const eventId = await ctx.db.insert("personPipelineEvents", {
    tenantId,
    personId: payload.personId,
    userId: user._id,
    timestamp: Date.now(),
    fromStage: payload.fromStage,
    toStage: payload.toStage,
    eventType: "pipeline.stage_changed",
    metadata,
  });

  return eventId;
}
