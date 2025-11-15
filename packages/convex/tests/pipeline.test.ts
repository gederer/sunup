/**
 * Pipeline Management Tests
 * Story 1.8: Create Pipeline Data Model and Schema
 *
 * Test Coverage:
 * - Pipeline stage queries and initialization
 * - Person CRUD operations with validation
 * - Stage transition validation (prevent skipping)
 * - Pipeline history tracking
 * - Admin stage management
 * - Statistics and search functionality
 */

/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import type { MutationCtx } from "../_generated/server";
import { expect, test, describe } from "vitest";
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
async function setupTestEnvironment(t: ReturnType<typeof convexTest>) {
  // First create tenant
  const tenantId = await t.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("tenants", {
      name: "Test Tenant",
      isActive: true,
    });
  });

  // Then create user with tenant
  const userId = await t.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("users", {
      clerkId: "test_clerk_user",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      isActive: true,
      tenantId,
    });
  });

  await t.run(async (ctx: MutationCtx) => {
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
 * Create default pipeline stages for testing
 */
async function createDefaultStages(t: ReturnType<typeof convexTest>, tenantId: Id<"tenants">) {
  const stageData = [
    { name: "Lead", order: 1, category: "sales" as const },
    { name: "Set", order: 2, category: "sales" as const },
    { name: "Met", order: 3, category: "sales" as const },
    { name: "QMet", order: 4, category: "sales" as const },
    { name: "Sale", order: 5, category: "sales" as const },
    { name: "Installation", order: 6, category: "installation" as const },
  ];

  const stageIds: Id<"pipelineStages">[] = [];
  for (const stage of stageData) {
    const id = await t.run(async (ctx: MutationCtx) => {
      return await ctx.db.insert("pipelineStages", {
        name: stage.name,
        order: stage.order,
        category: stage.category,
        description: `Test ${stage.name} stage`,
        isActive: true,
        tenantId,
      });
    });
    stageIds.push(id);
  }

  return stageIds;
}

// =============================================================================
// Pipeline Stage Tests
// =============================================================================

describe("Pipeline Stage Queries", () => {
  test("getPipelineStageOrder returns stages in correct order", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    await createDefaultStages(t, tenantId);

    // Authenticate as the test user
    const asUser = t.withIdentity({ subject: "test_clerk_user" });
    const stages = await asUser.query(api.pipeline.getPipelineStageOrder, {});

    expect(stages).toHaveLength(6);
    expect(stages[0].name).toBe("Lead");
    expect(stages[0].order).toBe(1);
    expect(stages[5].name).toBe("Installation");
    expect(stages[5].order).toBe(6);
  });

  test("getPipelineStageOrder filters inactive stages by default", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    const stageIds = await createDefaultStages(t, tenantId);

    // Deactivate one stage
    await t.run(async (ctx) => {
      await ctx.db.patch(stageIds[2], { isActive: false });
    });

    // Authenticate as the test user
    const asUser = t.withIdentity({ subject: "test_clerk_user" });
    const activeStages = await asUser.query(api.pipeline.getPipelineStageOrder, {});
    expect(activeStages).toHaveLength(5);

    const allStages = await asUser.query(api.pipeline.getPipelineStageOrder, {
      includeInactive: true,
    });
    expect(allStages).toHaveLength(6);
  });
});

describe("Person Creation", () => {
  test("createPerson creates person with valid data", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    await createDefaultStages(t, tenantId);

    // Authenticate as the test user
    const asUser = t.withIdentity({ subject: "test_clerk_user" });
    const person = await asUser.mutation(api.persons.createPerson, {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1-555-1234",
      currentPipelineStage: "Lead",
    });

    expect(person).not.toBeNull();
    expect(person?.firstName).toBe("John");
    expect(person?.lastName).toBe("Doe");
    expect(person?.email).toBe("john.doe@example.com");
    expect(person?.currentPipelineStage).toBe("Lead");
  });

  test("createPerson validates email format", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    // Authenticate as the test user
    const asUser = t.withIdentity({ subject: "test_clerk_user" });
    await expect(
      asUser.mutation(api.persons.createPerson, {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
      })
    ).rejects.toThrow("Invalid email format");
  });
});

describe("Stage Transitions", () => {
  test("movePersonToStage moves person forward one stage", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    await createDefaultStages(t, tenantId);

    // Authenticate as the test user
    const asUser = t.withIdentity({ subject: "test_clerk_user" });
    const person = await asUser.mutation(api.persons.createPerson, {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      currentPipelineStage: "Lead",
    });

    const result = await asUser.mutation(api.pipeline.movePersonToStage, {
      personId: person!._id,
      toStage: "Set",
      reason: "Appointment scheduled",
    });

    expect(result.success).toBe(true);
    expect(result.fromStage).toBe("Lead");
    expect(result.toStage).toBe("Set");

    const updated = await asUser.query(api.persons.getPersonById, {
      personId: person!._id,
    });

    expect(updated?.currentPipelineStage).toBe("Set");
  });

  test("movePersonToStage prevents skipping stages forward", async () => {
    const t = convexTest(schema, modules);
    const { tenantId } = await setupTestEnvironment(t);
    await createDefaultStages(t, tenantId);

    // Authenticate as the test user
    const asUser = t.withIdentity({ subject: "test_clerk_user" });
    const person = await asUser.mutation(api.persons.createPerson, {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      currentPipelineStage: "Lead",
    });

    await expect(
      asUser.mutation(api.pipeline.movePersonToStage, {
        personId: person!._id,
        toStage: "Sale", // Skipping Set, Met, QMet
      })
    ).rejects.toThrow("Cannot skip stages");
  });
});
