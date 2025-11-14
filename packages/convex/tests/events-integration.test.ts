/**
 * Event System Integration Test
 * Story 1.9 - Simple integration test to verify event system works
 */

import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

const modules = import.meta.glob("../**/!(*.*.*)*.*s");

async function setupTest(t: any) {
  const tenantId = await t.run(async (ctx) => {
    return await ctx.db.insert("tenants", {
      name: "Test Tenant",
      isActive: true,
    });
  });

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

  await t.run(async (ctx) => {
    await ctx.db.insert("userRoles", {
      userId,
      tenantId,
      role: "System Administrator",
      isPrimary: true,
      isActive: true,
    });
  });

  // Create pipeline stages
  await t.run(async (ctx) => {
    await ctx.db.insert("pipelineStages", {
      name: "Lead",
      order: 1,
      category: "sales",
      description: "Lead stage",
      isActive: true,
      tenantId,
    });
    await ctx.db.insert("pipelineStages", {
      name: "Set",
      order: 2,
      category: "sales",
      description: "Set stage",
      isActive: true,
      tenantId,
    });
  });

  return { userId, tenantId };
}

describe("Event System Integration", () => {
  test("movePersonToStage emits pipeline event", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTest(t);
    const asUser = t.withIdentity({ subject: "test_clerk_user" });

    // Create person with initial pipeline stage
    const person = await asUser.mutation(api.persons.createPerson, {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      currentPipelineStage: "Lead",
    });

    // Move person to next stage
    await asUser.mutation(api.pipeline.movePersonToStage, {
      personId: person!._id,
      toStage: "Set",
      reason: "Qualified",
    });

    // Verify event was emitted
    const events = await t.run(async (ctx) => {
      return await ctx.db
        .query("personPipelineEvents")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .collect();
    });

    expect(events).toHaveLength(1);
    expect(events[0].personId).toBe(person!._id);
    expect(events[0].fromStage).toBe("Lead");
    expect(events[0].toStage).toBe("Set");
    expect(events[0].eventType).toBe("pipeline.stage_changed");
    expect(events[0].tenantId).toBe(tenantId);
  });
});
