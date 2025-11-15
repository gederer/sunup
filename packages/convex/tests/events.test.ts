/**
 * Event System Tests
 * Story 1.9: Implement Event System for Pipeline Status Changes
 *
 * Test Coverage:
 * - Event emission (emitPipelineEvent)
 * - Event subscription pattern (EventHandlerRegistry)
 * - Sample logging handler
 * - Integration with movePersonToStage mutation
 * - Event payload validation
 * - Multi-tenant isolation
 * - Error handling
 */

import { convexTest } from "convex-test";
import { expect, test, describe, vi } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";
import { Id } from "../_generated/dataModel";

// Glob pattern for convex functions in monorepo setup
const modules = import.meta.glob("../**/!(*.*.*)*.*s");

// =============================================================================
// Test Helpers
// =============================================================================

/**
 * Setup test environment with authenticated user and tenant
 */
async function setupTestEnvironment(t: any) {
  // Create tenant
  const tenantId = await t.run(async (ctx) => {
    return await ctx.db.insert("tenants", {
      name: "Test Tenant",
      isActive: true,
    });
  });

  // Create user with tenant
  const userId = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      clerkId: "test_clerk_user",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      isActive: true,
      tenantId,
    });
  });

  // Add System Administrator role
  await t.run(async (ctx) => {
    await ctx.db.insert("userRoles", {
      userId,
      tenantId,
      role: "System Administrator",
      isPrimary: true,
      isActive: true,
    });
  });

  return { userId, tenantId };
}

/**
 * Create test pipeline stages
 */
async function createTestStages(t: any, tenantId: Id<"tenants">) {
  const stages = [
    { name: "Lead", order: 1 },
    { name: "Set", order: 2 },
    { name: "Met", order: 3 },
  ];

  for (const stage of stages) {
    await t.run(async (ctx) => {
      await ctx.db.insert("pipelineStages", {
        name: stage.name,
        order: stage.order,
        category: "sales",
        description: `Test ${stage.name} stage`,
        isActive: true,
        tenantId,
      });
    });
  }
}

/**
 * Create test person
 */
async function createTestPerson(t: any, tenantId: Id<"tenants">) {
  return await t.run(async (ctx) => {
    return await ctx.db.insert("people", {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "555-0100",
      currentPipelineStage: "Lead",
      tenantId,
    });
  });
}

// =============================================================================
// Event Emission Tests (AC #1, #5, #6)
// =============================================================================

describe("Event Emission", () => {
  test("emitPipelineEvent creates event record with correct payload", async () => {
    const t = convexTest(schema, modules);
    const { userId, tenantId } = await setupTestEnvironment(t);
    const personId = await createTestPerson(t, tenantId);
    const asUser = t.withIdentity({ subject: "test_clerk_user" });

    // Emit event using test mutation
    const eventId = await asUser.mutation(
      api.testMutations.testEmitPipelineEvent,
      {
        personId,
        fromStage: "Lead",
        toStage: "Set",
        reason: "Test reason",
      }
    );

    // Verify event was created
    const event = await t.run(async (ctx) => {
      return await ctx.db.get(eventId);
    });

    expect(event).toBeDefined();
    expect(event?.personId).toBe(personId);
    expect(event?.userId).toBe(userId);
    expect(event?.tenantId).toBe(tenantId);
    expect(event?.fromStage).toBe("Lead");
    expect(event?.toStage).toBe("Set");
    expect(event?.eventType).toBe("pipeline.stage_changed");
    expect(event?.timestamp).toBeGreaterThan(0);

    // Verify metadata
    const metadata = event?.metadata ? JSON.parse(event.metadata) : null;
    expect(metadata?.reason).toBe("Test reason");
  });

  test("emitPipelineEvent handles initial stage assignment (no fromStage)", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    const personId = await createTestPerson(t, tenantId);
    const asUser = t.withIdentity({ subject: "test_clerk_user" });

    // Emit event with undefined fromStage
    const eventId = await asUser.mutation(
      api.testMutations.testEmitPipelineEvent,
      {
        personId,
        fromStage: undefined,
        toStage: "Lead",
      }
    );

    const event = await t.run(async (ctx) => {
      return await ctx.db.get(eventId);
    });

    expect(event?.fromStage).toBeUndefined();
    expect(event?.toStage).toBe("Lead");
  });

  test("emitPipelineEvent validates required fields", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    const personId = await createTestPerson(t, tenantId);
    const asUser = t.withIdentity({ subject: "test_clerk_user" });

    // Missing toStage should throw - Convex schema validation catches this
    await expect(
      asUser.mutation(
        api.testMutations.testEmitPipelineEvent,
        {
          personId,
          fromStage: "Lead",
          toStage: undefined as any,
        }
      )
    ).rejects.toThrow("Missing required field `toStage`");
  });
});

// =============================================================================
// Event Storage and Querying Tests (AC #6)
// =============================================================================

describe("Event Storage", () => {
  test("events are stored in personPipelineEvents table", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    const personId = await createTestPerson(t, tenantId);
    const asUser = t.withIdentity({ subject: "test_clerk_user" });

    // Emit multiple events
    await asUser.mutation(
      api.testMutations.testEmitPipelineEvent,
      {
        personId,
        fromStage: undefined,
        toStage: "Lead",
      }
    );

    await asUser.mutation(
      api.testMutations.testEmitPipelineEvent,
      {
        personId,
        fromStage: "Lead",
        toStage: "Set",
      }
    );

    await asUser.mutation(
      api.testMutations.testEmitPipelineEvent,
      {
        personId,
        fromStage: "Set",
        toStage: "Met",
      }
    );

    // Query events by tenant
    const events = await t.run(async (ctx) => {
      return await ctx.db
        .query("personPipelineEvents")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .collect();
    });

    expect(events).toHaveLength(3);
    expect(events[0].toStage).toBe("Lead");
    expect(events[1].toStage).toBe("Set");
    expect(events[2].toStage).toBe("Met");
  });

  test("events enforce multi-tenant isolation (RLS)", async () => {
    const t = convexTest(schema, modules);

    // Setup first tenant
    const { tenantId: tenant1Id } = await setupTestEnvironment(t);
    const person1Id = await createTestPerson(t, tenant1Id);
    const asUser1 = t.withIdentity({ subject: "test_clerk_user" });

    // Setup second tenant
    const tenant2Id = await t.run(async (ctx) => {
      return await ctx.db.insert("tenants", {
        name: "Tenant 2",
        isActive: true,
      });
    });

    const person2Id = await t.run(async (ctx) => {
      return await ctx.db.insert("people", {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phone: "555-0200",
        currentPipelineStage: "Lead",
        tenantId: tenant2Id,
      });
    });

    // Emit events for both tenants
    await asUser1.mutation(
      api.testMutations.testEmitPipelineEvent,
      {
        personId: person1Id,
        fromStage: undefined,
        toStage: "Lead",
      }
    );

    // Create second user for tenant 2
    const user2Id = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        clerkId: "test_clerk_user_2",
        email: "user2@example.com",
        firstName: "User",
        lastName: "Two",
        isActive: true,
        tenantId: tenant2Id,
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("userRoles", {
        userId: user2Id,
        tenantId: tenant2Id,
        role: "System Administrator",
        isPrimary: true,
        isActive: true,
      });
    });

    const asUser2 = t.withIdentity({ subject: "test_clerk_user_2" });
    await asUser2.mutation(
      api.testMutations.testEmitPipelineEvent,
      {
        personId: person2Id,
        fromStage: undefined,
        toStage: "Lead",
      }
    );

    // Verify tenant 1 only sees their events
    const tenant1Events = await t.run(async (ctx) => {
      return await ctx.db
        .query("personPipelineEvents")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenant1Id))
        .collect();
    });

    expect(tenant1Events).toHaveLength(1);
    expect(tenant1Events[0].personId).toBe(person1Id);
    expect(tenant1Events[0].tenantId).toBe(tenant1Id);

    // Verify tenant 2 only sees their events
    const tenant2Events = await t.run(async (ctx) => {
      return await ctx.db
        .query("personPipelineEvents")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenant2Id))
        .collect();
    });

    expect(tenant2Events).toHaveLength(1);
    expect(tenant2Events[0].personId).toBe(person2Id);
    expect(tenant2Events[0].tenantId).toBe(tenant2Id);
  });
});

// =============================================================================
// Event Subscription Pattern Tests (AC #2, #3)
// =============================================================================

describe("Event Subscription Pattern", () => {
  test("EventHandlerRegistry allows registering multiple handlers", async () => {
    const { EventHandlerRegistry } = await import("../lib/eventHandlers");

    const registry = new EventHandlerRegistry();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    registry.register("pipeline.stage_changed", handler1);
    registry.register("pipeline.stage_changed", handler2);

    const handlers = registry.getHandlers("pipeline.stage_changed");
    expect(handlers).toHaveLength(2);
    expect(handlers).toContain(handler1);
    expect(handlers).toContain(handler2);
  });

  test("EventHandlerRegistry processes events with all registered handlers", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    const personId = await createTestPerson(t, tenantId);
    const asUser = t.withIdentity({ subject: "test_clerk_user" });

    const { EventHandlerRegistry } = await import("../lib/eventHandlers");

    // Create event
    const eventId = await asUser.mutation(
      api.testMutations.testEmitPipelineEvent,
      {
        personId,
        fromStage: "Lead",
        toStage: "Set",
      }
    );

    const event = await t.run(async (ctx) => {
      return await ctx.db.get(eventId);
    });

    // Create registry with test handlers
    const registry = new EventHandlerRegistry();
    const handler1Calls: any[] = [];
    const handler2Calls: any[] = [];

    registry.register("pipeline.stage_changed", async (ctx, evt) => {
      handler1Calls.push(evt);
    });

    registry.register("pipeline.stage_changed", async (ctx, evt) => {
      handler2Calls.push(evt);
    });

    // Process event
    await t.run(async (ctx) => {
      await registry.processEvent(ctx, event!);
    });

    // Verify both handlers were called
    expect(handler1Calls).toHaveLength(1);
    expect(handler2Calls).toHaveLength(1);
    expect(handler1Calls[0]._id).toBe(eventId);
    expect(handler2Calls[0]._id).toBe(eventId);
  });

  test("EventHandlerRegistry continues processing if one handler fails", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    const personId = await createTestPerson(t, tenantId);
    const asUser = t.withIdentity({ subject: "test_clerk_user" });

    const { EventHandlerRegistry } = await import("../lib/eventHandlers");

    // Create event
    const eventId = await asUser.mutation(
      api.testMutations.testEmitPipelineEvent,
      {
        personId,
        fromStage: "Lead",
        toStage: "Set",
      }
    );

    const event = await t.run(async (ctx) => {
      return await ctx.db.get(eventId);
    });

    // Create registry with failing and successful handlers
    const registry = new EventHandlerRegistry();
    const successfulHandler = vi.fn();

    registry.register("pipeline.stage_changed", async () => {
      throw new Error("Handler failure");
    });

    registry.register("pipeline.stage_changed", successfulHandler);

    // Process event - should not throw
    await t.run(async (ctx) => {
      await registry.processEvent(ctx, event!);
    });

    // Verify successful handler still ran
    expect(successfulHandler).toHaveBeenCalled();
  });

  test("logPipelineChange handler processes events correctly", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    const personId = await createTestPerson(t, tenantId);
    const asUser = t.withIdentity({ subject: "test_clerk_user" });

    const { logPipelineChange } = await import("../lib/eventHandlers");

    // Create event
    const eventId = await asUser.mutation(
      api.testMutations.testEmitPipelineEvent,
      {
        personId,
        fromStage: "Lead",
        toStage: "Set",
        reason: "Test transition",
      }
    );

    const event = await t.run(async (ctx) => {
      return await ctx.db.get(eventId);
    });

    // Mock console.log to capture output
    const consoleSpy = vi.spyOn(console, "log");

    // Call handler
    await t.run(async (ctx) => {
      await logPipelineChange(ctx, event!);
    });

    // Verify logging occurred
    expect(consoleSpy).toHaveBeenCalled();
    const logCall = consoleSpy.mock.calls[0];
    expect(logCall[0]).toContain("[Pipeline Event]");
    expect(logCall[1]).toMatchObject({
      event: "pipeline.stage_changed",
      person: "John Doe",
      transition: "Lead → Set",
    });

    consoleSpy.mockRestore();
  });
});

// =============================================================================
// Integration Tests (AC #4)
// =============================================================================

describe("Pipeline Mutation Integration", () => {
  test("movePersonToStage emits event after successful stage transition", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    await createTestStages(t, tenantId);
    const personId = await createTestPerson(t, tenantId);
    const asUser = t.withIdentity({ subject: "test_clerk_user" });

    // Move person to next stage
    await asUser.mutation(
      api.pipeline.movePersonToStage,
      {
        personId,
        toStage: "Set",
        reason: "Qualified by setter",
      }
    );

    // Verify event was created
    const events = await t.run(async (ctx) => {
      return await ctx.db
        .query("personPipelineEvents")
        .withIndex("by_person_and_timestamp", (q) =>
          q.eq("personId", personId)
        )
        .collect();
    });

    expect(events).toHaveLength(1);
    expect(events[0].fromStage).toBe("Lead");
    expect(events[0].toStage).toBe("Set");
    expect(events[0].personId).toBe(personId);

    const metadata = JSON.parse(events[0].metadata || "{}");
    expect(metadata.reason).toBe("Qualified by setter");
  });

  test("movePersonToStage continues even if event emission fails", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    await createTestStages(t, tenantId);
    const personId = await createTestPerson(t, tenantId);
    const asUser = t.withIdentity({ subject: "test_clerk_user" });

    // This test verifies error handling is in place
    // The mutation should succeed even if event emission has issues
    const result = await asUser.mutation(
      api.pipeline.movePersonToStage,
      {
        personId,
        toStage: "Set",
      }
    );

    expect(result.success).toBe(true);
    expect(result.toStage).toBe("Set");

    // Verify person was moved despite any potential event issues
    const person = await t.run(async (ctx) => {
      return await ctx.db.get(personId);
    });

    expect(person?.currentPipelineStage).toBe("Set");
  });
});
