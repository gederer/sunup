# Event System Documentation

**Story:** 1.9 - Implement Event System for Pipeline Status Changes
**Status:** Implemented
**Last Updated:** 2025-11-13

---

## Overview

The Sunup event system enables event-driven architecture for pipeline status changes, allowing cascading actions (notifications, commission calculations, analytics) to happen automatically when pipeline events occur.

**Key Features:**
- **Audit Trail**: All events stored in `pipelineEvents` table
- **Multi-Tenant Isolation**: Events respect tenant boundaries via RLS
- **Event Subscription Pattern**: Register handlers for specific event types
- **Non-Blocking**: Event emission failures don't block mutations
- **Real-Time**: Built on Convex's real-time subscription infrastructure

---

## Architecture

### Event Flow

```
Pipeline Mutation (e.g., movePersonToStage)
    ↓
emitPipelineEvent()
    ↓
Insert into pipelineEvents table
    ↓
EventHandlerRegistry processes event
    ↓
Registered handlers execute (logging, notifications, etc.)
```

### Components

1. **Event Emitter** (`packages/convex/lib/events.ts`)
   - `emitPipelineEvent()` - Publishes events to the events table
   - `PipelineEventPayload` - Type definition for event data

2. **Event Handlers** (`packages/convex/lib/eventHandlers.ts`)
   - `EventHandlerRegistry` - Manages event subscriptions
   - `logPipelineChange()` - Sample logging handler
   - `globalEventRegistry` - Default application-wide registry

3. **Event Storage** (`pipelineEvents` table in schema)
   - Persistent audit trail of all pipeline events
   - Indexed for efficient querying by tenant, person, timestamp

---

## How to Emit Events

### Basic Usage

Events are automatically emitted by the `movePersonToStage` mutation. You can also emit events manually from any mutation:

```typescript
import { emitPipelineEvent } from "./lib/events";

export const myMutation = mutation({
  handler: async (ctx, args) => {
    // Your mutation logic here...

    // Emit pipeline event (wrapped in try/catch to prevent blocking)
    try {
      await emitPipelineEvent(ctx, {
        personId: args.personId,
        fromStage: currentStage,
        toStage: newStage,
        reason: "Optional reason for the change",
      });
    } catch (error) {
      console.error("Failed to emit pipeline event:", error);
      // Don't fail the mutation - event emission is non-critical
    }

    return { success: true };
  },
});
```

### Event Payload Structure

```typescript
type PipelineEventPayload = {
  personId: Id<"people">;           // Required: Person whose stage changed
  fromStage: string | undefined;     // Previous stage (undefined for initial)
  toStage: string;                   // Required: New stage
  reason?: string;                   // Optional: Reason for the change
};
```

**Automatic Fields:**
- `tenantId` - Extracted from authenticated user context
- `userId` - User who triggered the event (from auth)
- `timestamp` - Event timestamp (Date.now())
- `eventType` - Set to "pipeline.stage_changed"
- `metadata` - JSON-encoded optional fields (reason, etc.)

---

## How to Subscribe to Events

### Event Subscription Pattern

The event system uses a registry pattern to manage event handlers. Handlers are functions that receive an event and perform side effects.

### Creating an Event Handler

```typescript
import { EventHandler } from "./lib/eventHandlers";

// Define your handler function
const sendNotification: EventHandler = async (ctx, event) => {
  // Fetch related data
  const person = await ctx.db.get(event.personId);
  if (!person) return;

  // Perform your side effect
  console.log(`Sending notification: ${person.firstName} moved to ${event.toStage}`);

  // TODO: Call notification service, send email, etc.
};
```

### Registering a Handler

```typescript
import { globalEventRegistry } from "./lib/eventHandlers";
import { sendNotification } from "./myHandlers";

// Register handler for specific event type
globalEventRegistry.register("pipeline.stage_changed", sendNotification);
```

### Multiple Handlers

Multiple handlers can be registered for the same event type. They execute in parallel:

```typescript
globalEventRegistry.register("pipeline.stage_changed", logPipelineChange);
globalEventRegistry.register("pipeline.stage_changed", sendNotification);
globalEventRegistry.register("pipeline.stage_changed", calculateCommission);
```

### Processing Events

The `EventHandlerRegistry` can process events automatically or manually:

```typescript
import { globalEventRegistry } from "./lib/eventHandlers";

// In a scheduled function or action
export const processRecentEvents = internalAction({
  handler: async (ctx) => {
    // Query recent events
    const events = await ctx.runQuery(internal.events.getRecentEvents);

    // Process each event
    for (const event of events) {
      await globalEventRegistry.processEvent(ctx, event);
    }
  },
});
```

---

## Sample Event Handler: Logging

The system includes a sample logging handler that demonstrates the pattern:

```typescript
// packages/convex/lib/eventHandlers.ts

export async function logPipelineChange(
  ctx: QueryCtx | MutationCtx,
  event: Doc<"pipelineEvents">
): Promise<void> {
  const person = await ctx.db.get(event.personId);
  const user = await ctx.db.get(event.userId);

  console.log(`[Pipeline Event] ${new Date(event.timestamp).toISOString()}`, {
    event: event.eventType,
    person: `${person?.firstName} ${person?.lastName}`,
    transition: `${event.fromStage || "(initial)"} → ${event.toStage}`,
    changedBy: `${user?.firstName} ${user?.lastName}`,
  });
}
```

This handler is automatically registered in `globalEventRegistry` and logs all pipeline stage changes.

---

## Available Event Types

### Currently Implemented

| Event Type | Description | Emitted By |
|------------|-------------|------------|
| `pipeline.stage_changed` | Person moved to new pipeline stage | `movePersonToStage` mutation |

### Future Event Types

The event system is designed to be extensible. Future event types may include:

- `pipeline.person_created` - New person added to pipeline
- `pipeline.person_deleted` - Person removed from pipeline
- `commission.calculated` - Commission calculation completed
- `notification.sent` - Notification sent to user
- `meeting.scheduled` - Meeting scheduled for person

---

## Querying Events

### By Tenant

```typescript
const events = await ctx.db
  .query("pipelineEvents")
  .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
  .collect();
```

### By Person and Time

```typescript
const personEvents = await ctx.db
  .query("pipelineEvents")
  .withIndex("by_person_and_timestamp", (q) =>
    q.eq("personId", personId)
  )
  .order("desc")
  .take(10);
```

### By Tenant and Time Range

```typescript
const recentEvents = await ctx.db
  .query("pipelineEvents")
  .withIndex("by_tenant_and_timestamp", (q) =>
    q.eq("tenantId", tenantId)
      .gte("timestamp", startTime)
      .lte("timestamp", endTime)
  )
  .collect();
```

---

## Multi-Tenant Considerations

### Automatic Tenant Isolation

Events automatically include `tenantId` from the authenticated user context. All event queries must filter by `tenantId` to enforce Row-Level Security (RLS):

```typescript
// ✅ Correct - filters by tenantId
const events = await ctx.db
  .query("pipelineEvents")
  .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
  .collect();

// ❌ Incorrect - violates RLS, would return all tenants' events
const events = await ctx.db
  .query("pipelineEvents")
  .collect();
```

### Tenant Validation in Handlers

Event handlers should validate tenant context when performing actions:

```typescript
const myHandler: EventHandler = async (ctx, event) => {
  // Get authenticated user's tenantId
  const { tenantId } = await getAuthUserWithTenant(ctx);

  // Verify event belongs to same tenant
  if (event.tenantId !== tenantId) {
    throw new Error("Cannot process event from another tenant");
  }

  // Proceed with handler logic...
};
```

---

## Error Handling

### Non-Blocking Event Emission

Event emission is wrapped in try/catch to prevent failures from blocking mutations:

```typescript
// In movePersonToStage mutation
try {
  await emitPipelineEvent(ctx, { ... });
} catch (error) {
  console.error("Failed to emit pipeline event:", error);
  // Mutation continues - event emission failure is non-critical
}
```

### Handler Error Isolation

The `EventHandlerRegistry` isolates handler errors so one failure doesn't stop others:

```typescript
// In EventHandlerRegistry.processEvent()
await Promise.all(
  handlers.map(async (handler) => {
    try {
      await handler(ctx, event);
    } catch (error) {
      console.error(`Event handler failed:`, error);
      // Don't throw - one handler failure shouldn't stop others
    }
  })
);
```

---

## Best Practices

### 1. Use Events for Side Effects

Events are ideal for:
- ✅ Sending notifications
- ✅ Calculating commissions
- ✅ Updating analytics
- ✅ Triggering workflows
- ✅ Audit logging

Events are NOT ideal for:
- ❌ Critical business logic (use direct function calls)
- ❌ Synchronous validation (use mutation logic)
- ❌ Required data consistency (use transactions)

### 2. Keep Handlers Idempotent

Handlers may be called multiple times for the same event:

```typescript
// ✅ Idempotent - safe to call multiple times
const sendNotification: EventHandler = async (ctx, event) => {
  // Check if notification already sent
  const existing = await ctx.db
    .query("notifications")
    .withIndex("by_event", (q) => q.eq("eventId", event._id))
    .first();

  if (existing) return; // Already processed

  // Send notification...
};
```

### 3. Use Metadata for Context

Store additional context in the metadata field:

```typescript
await emitPipelineEvent(ctx, {
  personId,
  fromStage: "Set",
  toStage: "Met",
  reason: JSON.stringify({
    meetingId: "xyz123",
    outcome: "qualified",
    notes: "Customer excited about product",
  }),
});
```

### 4. Monitor Event Processing

Add monitoring to track event handler performance:

```typescript
const myHandler: EventHandler = async (ctx, event) => {
  const startTime = Date.now();

  try {
    // Handler logic...
  } finally {
    const duration = Date.now() - startTime;
    console.log(`Handler processed event in ${duration}ms`);
  }
};
```

---

## Testing

### Unit Tests

Test event emission in isolation:

```typescript
test("emitPipelineEvent creates event record", async () => {
  const eventId = await t.mutation(
    async (ctx) => {
      return await emitPipelineEvent(ctx, {
        personId,
        fromStage: "Lead",
        toStage: "Set",
      });
    },
    { auth: { subject: "test_clerk_user" } }
  );

  const event = await t.run(async (ctx) => {
    return await ctx.db.get(eventId);
  });

  expect(event?.toStage).toBe("Set");
});
```

### Integration Tests

Test event emission from mutations:

```typescript
test("movePersonToStage emits event", async () => {
  await t.mutation(
    api.pipeline.movePersonToStage,
    { personId, toStage: "Set" },
    { auth: { subject: "test_clerk_user" } }
  );

  const events = await t.run(async (ctx) => {
    return await ctx.db
      .query("pipelineEvents")
      .withIndex("by_person_and_timestamp", (q) =>
        q.eq("personId", personId)
      )
      .collect();
  });

  expect(events).toHaveLength(1);
});
```

### Handler Tests

Test event handlers process events correctly:

```typescript
test("logPipelineChange logs correctly", async () => {
  const consoleSpy = vi.spyOn(console, "log");

  await t.run(async (ctx) => {
    await logPipelineChange(ctx, event);
  });

  expect(consoleSpy).toHaveBeenCalled();
});
```

---

## Implementation References

### File Locations

- **Event Emitter**: `packages/convex/lib/events.ts`
- **Event Handlers**: `packages/convex/lib/eventHandlers.ts`
- **Schema**: `packages/convex/schema.ts` (pipelineEvents table)
- **Pipeline Mutation**: `packages/convex/pipeline.ts` (movePersonToStage)
- **Tests**: `packages/convex/tests/events.test.ts`

### Related Stories

- **Story 1.8**: Create Pipeline Data Model and Schema (prerequisite)
- **Story 1.9**: Implement Event System for Pipeline Status Changes (current)
- **Future**: Event-driven notifications, commission calculations, analytics

---

## Extending the Event System

### Adding New Event Types

1. Define the event type constant:
```typescript
export const EVENT_TYPES = {
  PIPELINE_STAGE_CHANGED: "pipeline.stage_changed",
  PERSON_CREATED: "pipeline.person_created",
  // Add new types here
} as const;
```

2. Create an emitter function:
```typescript
export async function emitPersonCreatedEvent(
  ctx: MutationCtx,
  personId: Id<"people">
) {
  const { user, tenantId } = await getAuthUserWithTenant(ctx);

  await ctx.db.insert("pipelineEvents", {
    tenantId,
    personId,
    userId: user._id,
    timestamp: Date.now(),
    eventType: EVENT_TYPES.PERSON_CREATED,
    fromStage: undefined,
    toStage: "Lead", // Or appropriate initial stage
  });
}
```

3. Create handlers for the new event type:
```typescript
const onPersonCreated: EventHandler = async (ctx, event) => {
  // Handle person created event
};

globalEventRegistry.register(EVENT_TYPES.PERSON_CREATED, onPersonCreated);
```

### Adding Event Processing Workflows

Create scheduled functions to process events asynchronously:

```typescript
import { internalAction } from "./_generated/server";
import { globalEventRegistry } from "./lib/eventHandlers";

export const processEventsScheduled = internalAction({
  handler: async (ctx) => {
    // Query unprocessed events
    const events = await ctx.runQuery(internal.events.getUnprocessedEvents);

    // Process in batches
    for (const event of events) {
      await globalEventRegistry.processEvent(ctx, event);

      // Mark as processed (add processed flag to schema if needed)
      await ctx.runMutation(internal.events.markProcessed, {
        eventId: event._id,
      });
    }
  },
});
```

---

## FAQ

**Q: When should I use events vs. direct function calls?**
A: Use events for non-critical side effects (notifications, analytics). Use direct calls for critical business logic that must succeed.

**Q: Can event handlers modify database state?**
A: Yes, but they should be idempotent since they may be called multiple times.

**Q: How do I debug event handler failures?**
A: Check the Convex logs for error messages. Handlers log errors but don't throw to prevent blocking other handlers.

**Q: Can I query historical events?**
A: Yes, all events are stored permanently in the `pipelineEvents` table with indexes for efficient querying.

**Q: How do I test event emission?**
A: Use the convex-test library with authenticated contexts. See `packages/convex/tests/events.test.ts` for examples.

---

**For more information:**
- See `packages/convex/lib/events.ts` for implementation details
- See `packages/convex/tests/events.test.ts` for comprehensive examples
- Review Story 1.9 in `docs/stories/1-9-implement-event-system-for-pipeline-status-changes.md`
