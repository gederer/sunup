/**
 * Event Handlers - Event Subscription Pattern
 * Story 1.9: Implement Event System for Pipeline Status Changes
 *
 * This module demonstrates the event subscription pattern for processing
 * pipeline events. Handlers can be registered to respond to specific event types.
 *
 * @see docs/event-system.md for complete documentation
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

/**
 * Event Handler Function Type
 *
 * Event handlers receive the event and context, and can perform any
 * side effects (logging, notifications, commission calculations, etc.)
 */
export type EventHandler = (
  ctx: QueryCtx | MutationCtx,
  event: Doc<"personPipelineEvents">
) => Promise<void>;

/**
 * Event Handler Registry
 *
 * Simple registry pattern for managing event handlers.
 * Handlers can be registered for specific event types.
 *
 * **Usage Pattern:**
 * 1. Define handler functions
 * 2. Register handlers for event types
 * 3. Process events by calling registered handlers
 */
export class EventHandlerRegistry {
  private handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Register an event handler for a specific event type
   *
   * @param eventType - Type of event to handle (e.g., "pipeline.stage_changed")
   * @param handler - Handler function to execute when event occurs
   *
   * @example
   * ```typescript
   * const registry = new EventHandlerRegistry();
   * registry.register("pipeline.stage_changed", logPipelineChange);
   * registry.register("pipeline.stage_changed", calculateCommission);
   * ```
   */
  register(eventType: string, handler: EventHandler): void {
    const existing = this.handlers.get(eventType) || [];
    this.handlers.set(eventType, [...existing, handler]);
  }

  /**
   * Get all handlers for a specific event type
   */
  getHandlers(eventType: string): EventHandler[] {
    return this.handlers.get(eventType) || [];
  }

  /**
   * Process an event by calling all registered handlers
   *
   * @param ctx - Query or Mutation context
   * @param event - Event to process
   */
  async processEvent(
    ctx: QueryCtx | MutationCtx,
    event: Doc<"personPipelineEvents">
  ): Promise<void> {
    const handlers = this.getHandlers(event.eventType);

    // Execute all handlers (in parallel for performance)
    await Promise.all(
      handlers.map(async (handler) => {
        try {
          await handler(ctx, event);
        } catch (error) {
          console.error(
            `Event handler failed for ${event.eventType}:`,
            error
          );
          // Don't throw - one handler failure shouldn't stop others
        }
      })
    );
  }
}

/**
 * Sample Event Handler: Log Pipeline Changes
 *
 * Demonstrates the event subscription pattern by logging pipeline stage changes.
 * This handler can be used as a template for creating other event handlers
 * (e.g., sending notifications, calculating commissions, updating analytics).
 *
 * **AC #3:** Sample event handler logs pipeline changes (demonstrates pattern)
 *
 * @param ctx - Query or Mutation context
 * @param event - Pipeline event containing stage change details
 *
 * @example
 * ```typescript
 * // Register the handler
 * const registry = new EventHandlerRegistry();
 * registry.register("pipeline.stage_changed", logPipelineChange);
 *
 * // Process an event
 * await registry.processEvent(ctx, pipelineEvent);
 * ```
 */
export async function logPipelineChange(
  ctx: QueryCtx | MutationCtx,
  event: Doc<"personPipelineEvents">
): Promise<void> {
  // Fetch person details for logging
  const person = await ctx.db.get(event.personId);
  if (!person) {
    console.warn(
      `[Event Handler] Person not found for event ${event._id}`
    );
    return;
  }

  // Fetch user who made the change
  const user = await ctx.db.get(event.userId);
  const userName = user
    ? `${user.firstName} ${user.lastName}`
    : "Unknown User";

  // Parse metadata if present
  let metadata: { reason?: string } = {};
  if (event.metadata) {
    try {
      metadata = JSON.parse(event.metadata);
    } catch (error) {
      console.warn("Failed to parse event metadata:", error);
    }
  }

  // Log the pipeline change
  console.log(
    `[Pipeline Event] ${new Date(event.timestamp).toISOString()}`,
    {
      event: event.eventType,
      person: `${person.firstName} ${person.lastName}`,
      personId: event.personId,
      transition: `${event.fromStage || "(initial)"} → ${event.toStage}`,
      changedBy: userName,
      userId: event.userId,
      tenantId: event.tenantId,
      reason: metadata.reason || "(not specified)",
    }
  );
}

/**
 * Global Event Handler Registry
 *
 * Default registry for application-wide event handlers.
 * Initialize with default handlers on startup.
 */
export const globalEventRegistry = new EventHandlerRegistry();

// Register default handlers
globalEventRegistry.register("pipeline.stage_changed", logPipelineChange);

/**
 * How to Add New Event Handlers:
 *
 * 1. Create a handler function:
 *    ```typescript
 *    async function sendNotification(ctx, event) {
 *      // Your notification logic here
 *    }
 *    ```
 *
 * 2. Register the handler:
 *    ```typescript
 *    globalEventRegistry.register("pipeline.stage_changed", sendNotification);
 *    ```
 *
 * 3. Events will automatically trigger all registered handlers
 *
 * @see docs/event-system.md for complete guide
 */
