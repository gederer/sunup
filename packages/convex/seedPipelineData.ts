/**
 * Seed Pipeline Data
 * Story 1.8: Create Pipeline Data Model and Schema
 *
 * Seeds the database with:
 * - Default pipeline stages (Lead → Set → Met → QMet → Sale → Installation)
 * - Sample persons at different pipeline stages for testing
 * - Sample organizations
 *
 * Usage: Call this mutation from Convex dashboard or via script
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Seed pipeline data for a tenant
 *
 * Creates:
 * - 6 default pipeline stages
 * - 3 sample organizations
 * - 10 sample persons across different stages
 *
 * @param tenantId - Tenant to seed data for
 * @param userId - User ID to attribute changes to
 */
export const seedPipelineData = mutation({
  args: {
    tenantId: v.id("tenants"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { tenantId, userId } = args;

    // ============================================
    // 1. Create Default Pipeline Stages
    // ============================================
    console.log("Creating pipeline stages...");

    const stages = [
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
    for (const stage of stages) {
      const id = await ctx.db.insert("pipelineStages", stage);
      stageIds.push(id);
    }

    console.log(`Created ${stageIds.length} pipeline stages`);

    // ============================================
    // 2. Create Sample Organizations
    // ============================================
    console.log("Creating sample organizations...");

    const organizations = [
      {
        name: "Johnson Family Residence",
        type: "Residential" as const,
        billingAddress: {
          street: "123 Maple Street",
          city: "Sacramento",
          state: "CA",
          zipCode: "95814",
          country: "USA",
        },
        tenantId,
      },
      {
        name: "Smith Household",
        type: "Residential" as const,
        billingAddress: {
          street: "456 Oak Avenue",
          city: "San Diego",
          state: "CA",
          zipCode: "92101",
          country: "USA",
        },
        tenantId,
      },
      {
        name: "Greenfield Community Center",
        type: "Nonprofit" as const,
        taxId: "12-3456789",
        billingAddress: {
          street: "789 Community Blvd",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90001",
          country: "USA",
        },
        tenantId,
      },
    ];

    const orgIds = [];
    for (const org of organizations) {
      const id = await ctx.db.insert("organizations", org);
      orgIds.push(id);
    }

    console.log(`Created ${orgIds.length} organizations`);

    // ============================================
    // 3. Create Sample Persons
    // ============================================
    console.log("Creating sample persons...");

    const persons = [
      // Lead stage (2 persons)
      {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.johnson@example.com",
        phone: "+1-555-0101",
        currentPipelineStage: "Lead",
        organizationId: orgIds[0],
        tenantId,
      },
      {
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.williams@example.com",
        phone: "+1-555-0102",
        currentPipelineStage: "Lead",
        organizationId: undefined,
        tenantId,
      },
      // Set stage (2 persons)
      {
        firstName: "David",
        lastName: "Smith",
        email: "david.smith@example.com",
        phone: "+1-555-0103",
        currentPipelineStage: "Set",
        organizationId: orgIds[1],
        tenantId,
      },
      {
        firstName: "Jennifer",
        lastName: "Brown",
        email: "jennifer.brown@example.com",
        phone: "+1-555-0104",
        currentPipelineStage: "Set",
        organizationId: undefined,
        tenantId,
      },
      // Met stage (2 persons)
      {
        firstName: "Robert",
        lastName: "Davis",
        email: "robert.davis@example.com",
        phone: "+1-555-0105",
        currentPipelineStage: "Met",
        organizationId: undefined,
        tenantId,
      },
      {
        firstName: "Lisa",
        lastName: "Martinez",
        email: "lisa.martinez@example.com",
        phone: "+1-555-0106",
        currentPipelineStage: "Met",
        organizationId: undefined,
        tenantId,
      },
      // QMet stage (1 person)
      {
        firstName: "James",
        lastName: "Garcia",
        email: "james.garcia@example.com",
        phone: "+1-555-0107",
        currentPipelineStage: "QMet",
        organizationId: undefined,
        tenantId,
      },
      // Sale stage (2 persons)
      {
        firstName: "Mary",
        lastName: "Wilson",
        email: "mary.wilson@example.com",
        phone: "+1-555-0108",
        currentPipelineStage: "Sale",
        organizationId: undefined,
        tenantId,
      },
      {
        firstName: "Thomas",
        lastName: "Green",
        email: "thomas.green@example.com",
        phone: "+1-555-0109",
        currentPipelineStage: "Sale",
        organizationId: orgIds[2], // Nonprofit org
        tenantId,
      },
      // Installation stage (1 person)
      {
        firstName: "Patricia",
        lastName: "Taylor",
        email: "patricia.taylor@example.com",
        phone: "+1-555-0110",
        currentPipelineStage: "Installation",
        organizationId: undefined,
        tenantId,
      },
    ];

    const personIds = [];
    for (const person of persons) {
      const id = await ctx.db.insert("people", person);
      personIds.push({ id, stage: person.currentPipelineStage });

      // Create pipeline history entry for initial stage assignment
      await ctx.db.insert("pipelineHistory", {
        personId: id,
        fromStage: undefined,
        toStage: person.currentPipelineStage!,
        changedByUserId: userId,
        changeReason: "Initial seed data creation",
        timestamp: Date.now(),
        tenantId,
      });
    }

    console.log(`Created ${personIds.length} persons with pipeline history`);

    // ============================================
    // 4. Return Summary
    // ============================================
    const summary = {
      pipelineStages: {
        count: stageIds.length,
        stages: stages.map((s) => s.name),
      },
      organizations: {
        count: orgIds.length,
        ids: orgIds,
      },
      persons: {
        count: personIds.length,
        byStage: {
          Lead: personIds.filter((p) => p.stage === "Lead").length,
          Set: personIds.filter((p) => p.stage === "Set").length,
          Met: personIds.filter((p) => p.stage === "Met").length,
          QMet: personIds.filter((p) => p.stage === "QMet").length,
          Sale: personIds.filter((p) => p.stage === "Sale").length,
          Installation: personIds.filter((p) => p.stage === "Installation").length,
        },
      },
    };

    console.log("Seed data created successfully:", summary);

    return summary;
  },
});

/**
 * Clear all pipeline-related data for a tenant (DANGER!)
 *
 * Use with caution - deletes:
 * - Pipeline stages
 * - Pipeline history
 * - Persons (only if clearPersons = true)
 *
 * @param tenantId - Tenant to clear data for
 * @param clearPersons - Whether to also delete persons (default: false)
 */
export const clearPipelineData = mutation({
  args: {
    tenantId: v.id("tenants"),
    clearPersons: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { tenantId, clearPersons = false } = args;

    console.log("Clearing pipeline data for tenant:", tenantId);

    // Delete pipeline history
    const history = await ctx.db
      .query("pipelineHistory")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();

    for (const entry of history) {
      await ctx.db.delete(entry._id);
    }
    console.log(`Deleted ${history.length} pipeline history entries`);

    // Delete pipeline stages
    const stages = await ctx.db
      .query("pipelineStages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();

    for (const stage of stages) {
      await ctx.db.delete(stage._id);
    }
    console.log(`Deleted ${stages.length} pipeline stages`);

    // Optionally delete persons
    let personsDeleted = 0;
    if (clearPersons) {
      const persons = await ctx.db
        .query("people")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .collect();

      for (const person of persons) {
        await ctx.db.delete(person._id);
      }
      personsDeleted = persons.length;
      console.log(`Deleted ${personsDeleted} persons`);
    }

    return {
      deleted: {
        pipelineHistory: history.length,
        pipelineStages: stages.length,
        persons: personsDeleted,
      },
    };
  },
});
