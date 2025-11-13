/**
 * Person Management Functions
 * Story 1.8: Create Pipeline Data Model and Schema
 *
 * CRUD operations for managing people in the CRM system.
 * Includes validation, tenant isolation, and pipeline integration.
 */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserWithTenant } from "./lib/auth";
import { Id } from "./_generated/dataModel";

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Create a new person
 *
 * Validates:
 * - Email format
 * - Required fields (firstName, lastName, email)
 * - Unique email within tenant
 *
 * @returns Created person record
 */
export const createPerson = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    currentPipelineStage: v.optional(v.string()),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Validate required fields
    if (!args.firstName || args.firstName.trim().length === 0) {
      throw new Error("First name is required");
    }

    if (!args.lastName || args.lastName.trim().length === 0) {
      throw new Error("Last name is required");
    }

    if (!args.email || args.email.trim().length === 0) {
      throw new Error("Email is required");
    }

    // Validate email format
    if (!isValidEmail(args.email)) {
      throw new Error("Invalid email format");
    }

    // Check for duplicate email within tenant
    const existing = await ctx.db
      .query("people")
      .withIndex("by_tenant_and_email", (q) =>
        q.eq("tenantId", tenantId).eq("email", args.email.toLowerCase())
      )
      .first();

    if (existing) {
      throw new Error(`A person with email "${args.email}" already exists`);
    }

    // If organizationId provided, verify it belongs to this tenant
    if (args.organizationId) {
      const org = await ctx.db.get(args.organizationId);
      if (!org || org.tenantId !== tenantId) {
        throw new Error("Invalid organization");
      }
    }

    // If pipelineStage provided, verify it exists and is active
    if (args.currentPipelineStage) {
      const stage = await ctx.db
        .query("pipelineStages")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .filter((q) =>
          q.and(
            q.eq(q.field("name"), args.currentPipelineStage),
            q.eq(q.field("isActive"), true)
          )
        )
        .first();

      if (!stage) {
        throw new Error(`Invalid pipeline stage: "${args.currentPipelineStage}"`);
      }
    }

    // Create the person
    const personId = await ctx.db.insert("people", {
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      email: args.email.toLowerCase().trim(),
      phone: args.phone?.trim(),
      currentPipelineStage: args.currentPipelineStage,
      organizationId: args.organizationId,
      tenantId,
    });

    // If pipeline stage was set, log it in history
    if (args.currentPipelineStage) {
      const user = await getAuthUserWithTenant(ctx);
      await ctx.db.insert("pipelineHistory", {
        personId,
        fromStage: undefined, // Initial assignment
        toStage: args.currentPipelineStage,
        changedByUserId: user.user._id,
        changeReason: "Initial person creation",
        timestamp: Date.now(),
        tenantId,
      });
    }

    return await ctx.db.get(personId);
  },
});

/**
 * Update an existing person
 *
 * Validates:
 * - Person belongs to current tenant
 * - Email format (if changed)
 * - No duplicate email (if changed)
 *
 * Note: Use movePersonToStage mutation for pipeline stage changes
 */
export const updatePerson = mutation({
  args: {
    personId: v.id("people"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Get existing person
    const person = await ctx.db.get(args.personId);
    if (!person) {
      throw new Error("Person not found");
    }

    if (person.tenantId !== tenantId) {
      throw new Error("Cannot access person from another tenant");
    }

    // Prepare update object
    const updates: any = {};

    // Validate and update firstName
    if (args.firstName !== undefined) {
      if (args.firstName.trim().length === 0) {
        throw new Error("First name cannot be empty");
      }
      updates.firstName = args.firstName.trim();
    }

    // Validate and update lastName
    if (args.lastName !== undefined) {
      if (args.lastName.trim().length === 0) {
        throw new Error("Last name cannot be empty");
      }
      updates.lastName = args.lastName.trim();
    }

    // Validate and update email
    if (args.email !== undefined) {
      const newEmail = args.email.toLowerCase().trim();

      if (newEmail.length === 0) {
        throw new Error("Email cannot be empty");
      }

      if (!isValidEmail(newEmail)) {
        throw new Error("Invalid email format");
      }

      // Check for duplicate email (excluding current person)
      if (newEmail !== person.email) {
        const existing = await ctx.db
          .query("people")
          .withIndex("by_tenant_and_email", (q) =>
            q.eq("tenantId", tenantId).eq("email", newEmail)
          )
          .first();

        if (existing && existing._id !== args.personId) {
          throw new Error(`A person with email "${newEmail}" already exists`);
        }
      }

      updates.email = newEmail;
    }

    // Update phone
    if (args.phone !== undefined) {
      updates.phone = args.phone.trim() || undefined;
    }

    // Validate and update organizationId
    if (args.organizationId !== undefined) {
      const org = await ctx.db.get(args.organizationId);
      if (!org || org.tenantId !== tenantId) {
        throw new Error("Invalid organization");
      }
      updates.organizationId = args.organizationId;
    }

    // Apply updates
    await ctx.db.patch(args.personId, updates);

    return await ctx.db.get(args.personId);
  },
});

/**
 * Delete a person (soft delete - consider hard delete in future)
 *
 * Currently performs hard delete. Consider soft delete for audit purposes.
 */
export const deletePerson = mutation({
  args: {
    personId: v.id("people"),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Get person
    const person = await ctx.db.get(args.personId);
    if (!person) {
      throw new Error("Person not found");
    }

    if (person.tenantId !== tenantId) {
      throw new Error("Cannot delete person from another tenant");
    }

    // TODO: Check for related records (leads, appointments, etc.) and handle accordingly
    // For now, perform simple delete

    await ctx.db.delete(args.personId);

    return { success: true, deletedId: args.personId };
  },
});

/**
 * Get a person by ID
 *
 * Returns null if person not found or belongs to another tenant.
 */
export const getPersonById = query({
  args: {
    personId: v.id("people"),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const person = await ctx.db.get(args.personId);

    // Return null if not found or wrong tenant
    if (!person || person.tenantId !== tenantId) {
      return null;
    }

    return person;
  },
});

/**
 * List persons by tenant
 *
 * Returns paginated list of all persons in the tenant.
 * Supports filtering by pipeline stage.
 *
 * @param pipelineStage - Optional filter by current pipeline stage
 * @param limit - Maximum number of results (default: 50, max: 100)
 * @param cursor - Pagination cursor from previous result
 */
export const listPersonsByTenant = query({
  args: {
    pipelineStage: v.optional(v.string()),
    limit: v.optional(v.number()),
    // Note: Convex doesn't have built-in cursor pagination in the same way
    // We'll use a simple limit-based approach for now
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const limit = Math.min(args.limit ?? 50, 100); // Cap at 100

    let persons;

    if (args.pipelineStage) {
      // Filter by pipeline stage
      persons = await ctx.db
        .query("people")
        .withIndex("by_tenant_and_stage", (q) =>
          q.eq("tenantId", tenantId).eq("currentPipelineStage", args.pipelineStage)
        )
        .take(limit);
    } else {
      // All persons in tenant
      persons = await ctx.db
        .query("people")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .take(limit);
    }

    return persons;
  },
});

/**
 * Get persons by organization
 *
 * Returns all persons affiliated with a specific organization.
 */
export const getPersonsByOrganization = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Verify organization belongs to tenant
    const org = await ctx.db.get(args.organizationId);
    if (!org || org.tenantId !== tenantId) {
      throw new Error("Organization not found or access denied");
    }

    // Get persons for this organization
    const persons = await ctx.db
      .query("people")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();

    return persons;
  },
});

/**
 * Search persons by name or email
 *
 * Simple text search across firstName, lastName, and email.
 * Returns up to 20 matching results.
 */
export const searchPersons = query({
  args: {
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const limit = Math.min(args.limit ?? 20, 50);
    const searchLower = args.searchTerm.toLowerCase();

    // Get all persons for tenant (will be filtered)
    const allPersons = await ctx.db
      .query("people")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();

    // Client-side filtering (Convex doesn't support full-text search on strings)
    const matches = allPersons.filter(
      (p) =>
        p.firstName.toLowerCase().includes(searchLower) ||
        p.lastName.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower)
    );

    return matches.slice(0, limit);
  },
});
