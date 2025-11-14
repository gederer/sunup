/**
 * Test Mutations for Event System Testing
 * Story 1.9
 *
 * These mutations are used solely for testing the event system.
 * They provide test access to internal event functions.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { emitPipelineEvent } from "./lib/events";

/**
 * Test mutation for emitPipelineEvent
 */
export const testEmitPipelineEvent = mutation({
  args: {
    personId: v.id("people"),
    fromStage: v.optional(v.string()),
    toStage: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await emitPipelineEvent(ctx, {
      personId: args.personId,
      fromStage: args.fromStage,
      toStage: args.toStage,
      reason: args.reason,
    });
  },
});
