/**
 * Pipeline Management Functions
 * Story 1.8: Create Pipeline Data Model and Schema
 *
 * Manages configurable pipeline stages for person lifecycle tracking.
 * Default stages: Lead → Set → Met → QMet → Sale → Installation
 *
 * Features:
 * - Tenant-scoped pipeline configuration
 * - Stage transition validation (prevents skipping stages)
 * - Pipeline history tracking
 * - Admin stage management (add/remove/reorder)
 */

import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserWithTenant, requireRole } from "./lib/auth";
import { Id } from "./_generated/dataModel";
import { emitPipelineEvent } from "./lib/events";

/**
 * Get ordered pipeline stages for a tenant
 *
 * Returns stages sorted by order field.
 * Only returns active stages by default.
 *
 * @param includeInactive - Whether to include inactive stages (default: false)
 * @returns Array of pipeline stages sorted by order
 */
export const getPipelineStageOrder = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    let stages = await ctx.db
      .query("pipelineStages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();

    // Filter to active stages only unless includeInactive is true
    if (!args.includeInactive) {
      stages = stages.filter((s) => s.isActive);
    }

    // Sort by order field
    return stages.sort((a, b) => a.order - b.order);
  },
});

/**
 * Get a specific pipeline stage by name
 *
 * @param stageName - The name of the stage to retrieve
 * @returns Pipeline stage or null if not found
 */
export const getPipelineStageByName = query({
  args: {
    stageName: v.string(),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const stage = await ctx.db
      .query("pipelineStages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .filter((q) => q.eq(q.field("name"), args.stageName))
      .first();

    return stage;
  },
});

/**
 * Initialize default pipeline stages for a tenant
 *
 * Creates the standard 6-stage pipeline: Lead → Set → Met → QMet → Sale → Installation
 * This should be called once per tenant during onboarding.
 *
 * Restricted to: System Administrator
 */
export const initializeDefaultPipelineStages = mutation({
  args: {
    tenantIdOverride: v.optional(v.id("tenants")), // For admin initialization
  },
  handler: async (ctx, args) => {
    const { tenantId: authTenantId } = await requireRole(ctx, [
      "System Administrator",
    ]);

    const tenantId = args.tenantIdOverride ?? authTenantId;

    // Check if stages already exist
    const existingStages = await ctx.db
      .query("pipelineStages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();

    if (existingStages.length > 0) {
      throw new Error("Pipeline stages already initialized for this tenant");
    }

    // Create default stages
    const defaultStages = [
      {
        name: "Lead",
        order: 1,
        category: "sales" as const,
        description: "Initial contact, not yet qualified",
        isActive: true,
        tenantId,
      },
      {
        name: "Set",
        order: 2,
        category: "sales" as const,
        description: "Appointment set with consultant",
        isActive: true,
        tenantId,
      },
      {
        name: "Met",
        order: 3,
        category: "sales" as const,
        description: "Consultation completed",
        isActive: true,
        tenantId,
      },
      {
        name: "QMet",
        order: 4,
        category: "sales" as const,
        description: "Qualified meeting (customer interested)",
        isActive: true,
        tenantId,
      },
      {
        name: "Sale",
        order: 5,
        category: "sales" as const,
        description: "Contract signed, sale closed",
        isActive: true,
        tenantId,
      },
      {
        name: "Installation",
        order: 6,
        category: "installation" as const,
        description: "Installation in progress or completed",
        isActive: true,
        tenantId,
      },
    ];

    const stageIds = [];
    for (const stage of defaultStages) {
      const id = await ctx.db.insert("pipelineStages", stage);
      stageIds.push(id);
    }

    return { stageIds, count: stageIds.length };
  },
});

/**
 * Add a new pipeline stage
 *
 * Restricted to: System Administrator
 *
 * @param name - Stage name
 * @param order - Stage order in pipeline
 * @param category - Stage category (sales/installation/completed)
 * @param description - Optional stage description
 */
export const addPipelineStage = mutation({
  args: {
    name: v.string(),
    order: v.number(),
    category: v.union(
      v.literal("sales"),
      v.literal("installation"),
      v.literal("completed")
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requireRole(ctx, ["System Administrator"]);

    // Check for duplicate name
    const existing = await ctx.db
      .query("pipelineStages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existing) {
      throw new Error(`Pipeline stage "${args.name}" already exists`);
    }

    // Check for duplicate order
    const existingOrder = await ctx.db
      .query("pipelineStages")
      .withIndex("by_tenant_and_order", (q) =>
        q.eq("tenantId", tenantId).eq("order", args.order)
      )
      .first();

    if (existingOrder) {
      throw new Error(`A stage with order ${args.order} already exists. Please choose a different order.`);
    }

    const stageId = await ctx.db.insert("pipelineStages", {
      name: args.name,
      order: args.order,
      category: args.category,
      description: args.description,
      isActive: true,
      tenantId,
    });

    return await ctx.db.get(stageId);
  },
});

/**
 * Reorder pipeline stages
 *
 * Updates the order of multiple stages at once.
 * Useful for drag-and-drop reordering in UI.
 *
 * Restricted to: System Administrator
 *
 * @param stageOrders - Array of { stageId, newOrder } objects
 */
export const reorderPipelineStages = mutation({
  args: {
    stageOrders: v.array(
      v.object({
        stageId: v.id("pipelineStages"),
        newOrder: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requireRole(ctx, ["System Administrator"]);

    // Validate all stages belong to this tenant
    for (const { stageId } of args.stageOrders) {
      const stage = await ctx.db.get(stageId);
      if (!stage) {
        throw new Error(`Stage ${stageId} not found`);
      }
      if (stage.tenantId !== tenantId) {
        throw new Error("Cannot reorder stages from other tenants");
      }
    }

    // Update orders
    for (const { stageId, newOrder } of args.stageOrders) {
      await ctx.db.patch(stageId, { order: newOrder });
    }

    return { success: true, updatedCount: args.stageOrders.length };
  },
});

/**
 * Deactivate a pipeline stage
 *
 * Soft deletes a stage by setting isActive to false.
 * Prevents deletion of stages that have persons currently in them.
 *
 * Restricted to: System Administrator
 *
 * @param stageId - ID of stage to deactivate
 */
export const deactivatePipelineStage = mutation({
  args: {
    stageId: v.id("pipelineStages"),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requireRole(ctx, ["System Administrator"]);

    const stage = await ctx.db.get(args.stageId);
    if (!stage) {
      throw new Error("Stage not found");
    }

    if (stage.tenantId !== tenantId) {
      throw new Error("Cannot modify stages from other tenants");
    }

    // Check if any persons are currently in this stage
    const personsInStage = await ctx.db
      .query("people")
      .withIndex("by_tenant_and_stage", (q) =>
        q.eq("tenantId", tenantId).eq("currentPipelineStage", stage.name)
      )
      .first();

    if (personsInStage) {
      throw new Error(
        `Cannot deactivate stage "${stage.name}" because there are people currently in this stage. Move them to another stage first.`
      );
    }

    await ctx.db.patch(args.stageId, { isActive: false });

    return { success: true, stageName: stage.name };
  },
});

/**
 * Move a person to a new pipeline stage
 *
 * Validates:
 * - Stage transition is valid (no skipping stages)
 * - User has permission to move persons
 * - Logs the transition in pipeline history
 *
 * @param personId - ID of person to move
 * @param toStage - Name of target stage
 * @param reason - Optional reason for the change
 */
export const movePersonToStage = mutation({
  args: {
    personId: v.id("people"),
    toStage: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user, tenantId } = await getAuthUserWithTenant(ctx);

    // Get the person
    const person = await ctx.db.get(args.personId);
    if (!person) {
      throw new Error("Person not found");
    }

    if (person.tenantId !== tenantId) {
      throw new Error("Cannot access person from another tenant");
    }

    // Get all active stages ordered
    const stages = await ctx.db
      .query("pipelineStages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const orderedStages = stages.sort((a, b) => a.order - b.order);

    // Find current and target stage indexes
    const currentStageIndex = person.currentPipelineStage
      ? orderedStages.findIndex((s) => s.name === person.currentPipelineStage)
      : -1;

    const targetStageIndex = orderedStages.findIndex(
      (s) => s.name === args.toStage
    );

    if (targetStageIndex === -1) {
      throw new Error(`Invalid stage: "${args.toStage}"`);
    }

    // Validate stage transition (prevent skipping stages forward)
    // Allow moving backward or staying in same stage
    if (currentStageIndex >= 0) {
      const stageDiff = targetStageIndex - currentStageIndex;

      if (stageDiff > 1) {
        const skippedStages = orderedStages
          .slice(currentStageIndex + 1, targetStageIndex)
          .map((s) => s.name)
          .join(", ");

        throw new Error(
          `Cannot skip stages. You must move through: ${skippedStages} before reaching ${args.toStage}`
        );
      }
    }

    // Update person's current stage
    await ctx.db.patch(args.personId, {
      currentPipelineStage: args.toStage,
    });

    // Log the transition in pipeline history
    await ctx.db.insert("pipelineHistory", {
      personId: args.personId,
      fromStage: person.currentPipelineStage ?? undefined,
      toStage: args.toStage,
      changedByUserId: user._id,
      changeReason: args.reason,
      timestamp: Date.now(),
      tenantId,
    });

    // Emit pipeline event for cascading actions (Story 1.9)
    // Wrapped in try/catch to prevent blocking the main mutation
    try {
      await emitPipelineEvent(ctx, {
        personId: args.personId,
        fromStage: person.currentPipelineStage ?? undefined,
        toStage: args.toStage,
        reason: args.reason,
      });
    } catch (error) {
      console.error("Failed to emit pipeline event:", error);
      // Don't fail the mutation - event emission is non-critical
    }

    return {
      success: true,
      fromStage: person.currentPipelineStage,
      toStage: args.toStage,
    };
  },
});

/**
 * Get pipeline history for a person
 *
 * Returns chronological list of all stage changes for a person.
 *
 * @param personId - ID of person
 * @param limit - Maximum number of history entries to return (default: 50)
 */
export const getPersonPipelineHistory = query({
  args: {
    personId: v.id("people"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Verify person belongs to tenant
    const person = await ctx.db.get(args.personId);
    if (!person || person.tenantId !== tenantId) {
      throw new Error("Person not found or access denied");
    }

    // Get history entries, ordered by timestamp (newest first)
    let history = await ctx.db
      .query("pipelineHistory")
      .withIndex("by_person_and_timestamp", (q) =>
        q.eq("personId", args.personId)
      )
      .collect();

    // Sort by timestamp descending (newest first)
    history = history.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    if (args.limit) {
      history = history.slice(0, args.limit);
    }

    // Enrich with user information
    const enrichedHistory = await Promise.all(
      history.map(async (entry) => {
        const user = await ctx.db.get(entry.changedByUserId);
        return {
          ...entry,
          changedByUser: user
            ? {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              }
            : null,
        };
      })
    );

    return enrichedHistory;
  },
});

/**
 * Get pipeline statistics for a tenant
 *
 * Returns count of persons in each stage.
 * Useful for dashboard widgets and reporting.
 */
export const getPipelineStatistics = query({
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Get all active stages
    const stages = await ctx.db
      .query("pipelineStages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const orderedStages = stages.sort((a, b) => a.order - b.order);

    // Count persons in each stage
    const statistics = await Promise.all(
      orderedStages.map(async (stage) => {
        const count = await ctx.db
          .query("people")
          .withIndex("by_tenant_and_stage", (q) =>
            q.eq("tenantId", tenantId).eq("currentPipelineStage", stage.name)
          )
          .collect()
          .then((results) => results.length);

        return {
          stageName: stage.name,
          stageOrder: stage.order,
          stageCategory: stage.category,
          count,
        };
      })
    );

    // Count persons with no stage assigned
    const noStageCount = await ctx.db
      .query("people")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .filter((q) => q.eq(q.field("currentPipelineStage"), undefined))
      .collect()
      .then((results) => results.length);

    return {
      stages: statistics,
      noStageAssigned: noStageCount,
      totalPersons:
        statistics.reduce((sum, s) => sum + s.count, 0) + noStageCount,
    };
  },
});
