/**
 * Organization Management Functions
 * Story 1.10: Create Person and Organization Base Schema
 *
 * CRUD operations for managing organizations in the CRM system.
 * Includes validation, tenant isolation, and integration with persons.
 */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserWithTenant } from "./lib/auth";
import { Id } from "./_generated/dataModel";

/**
 * Validate billing address structure
 * Ensures all required fields are present and non-empty
 */
function isValidBillingAddress(address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}): boolean {
  return !!(
    address.street?.trim() &&
    address.city?.trim() &&
    address.state?.trim() &&
    address.zipCode?.trim() &&
    address.country?.trim()
  );
}

/**
 * Create a new organization
 *
 * Validates:
 * - Required fields (name, type, billingAddress)
 * - Billing address structure (all 5 fields present)
 * - Primary contact person (if provided, must belong to tenant)
 *
 * @returns Created organization record
 */
export const createOrganization = mutation({
  args: {
    name: v.string(),
    type: v.union(
      v.literal("Residential"),
      v.literal("Commercial"),
      v.literal("Nonprofit"),
      v.literal("Government"),
      v.literal("Educational")
    ),
    billingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    taxId: v.optional(v.string()),
    primaryContactPersonId: v.optional(v.id("people")),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Validate required fields
    if (!args.name || args.name.trim().length === 0) {
      throw new Error("Organization name is required");
    }

    // Validate billing address structure
    if (!isValidBillingAddress(args.billingAddress)) {
      throw new Error(
        "Billing address must include street, city, state, zipCode, and country"
      );
    }

    // If primaryContactPersonId provided, verify it belongs to this tenant
    if (args.primaryContactPersonId) {
      const person = await ctx.db.get(args.primaryContactPersonId);
      if (!person || person.tenantId !== tenantId) {
        throw new Error("Invalid primary contact person or access denied");
      }
    }

    // Create the organization
    const organizationId = await ctx.db.insert("organizations", {
      name: args.name.trim(),
      type: args.type,
      billingAddress: {
        street: args.billingAddress.street.trim(),
        city: args.billingAddress.city.trim(),
        state: args.billingAddress.state.trim(),
        zipCode: args.billingAddress.zipCode.trim(),
        country: args.billingAddress.country.trim(),
      },
      taxId: args.taxId?.trim(),
      primaryContactPersonId: args.primaryContactPersonId,
      tenantId,
    });

    return await ctx.db.get(organizationId);
  },
});

/**
 * Update an existing organization
 *
 * Validates:
 * - Organization belongs to current tenant
 * - Billing address structure (if provided)
 * - Primary contact person (if provided, must belong to tenant)
 *
 * Supports partial updates - only provided fields are updated.
 */
export const updateOrganization = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("Residential"),
        v.literal("Commercial"),
        v.literal("Nonprofit"),
        v.literal("Government"),
        v.literal("Educational")
      )
    ),
    billingAddress: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        country: v.string(),
      })
    ),
    taxId: v.optional(v.string()),
    primaryContactPersonId: v.optional(v.id("people")),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Get existing organization
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    if (organization.tenantId !== tenantId) {
      throw new Error("Cannot access organization from another tenant");
    }

    // Prepare update object
    const updates: any = {};

    // Validate and update name
    if (args.name !== undefined) {
      if (args.name.trim().length === 0) {
        throw new Error("Organization name cannot be empty");
      }
      updates.name = args.name.trim();
    }

    // Update type
    if (args.type !== undefined) {
      updates.type = args.type;
    }

    // Validate and update billing address
    if (args.billingAddress !== undefined) {
      if (!isValidBillingAddress(args.billingAddress)) {
        throw new Error(
          "Billing address must include street, city, state, zipCode, and country"
        );
      }
      updates.billingAddress = {
        street: args.billingAddress.street.trim(),
        city: args.billingAddress.city.trim(),
        state: args.billingAddress.state.trim(),
        zipCode: args.billingAddress.zipCode.trim(),
        country: args.billingAddress.country.trim(),
      };
    }

    // Update taxId
    if (args.taxId !== undefined) {
      updates.taxId = args.taxId.trim() || undefined;
    }

    // Validate and update primaryContactPersonId
    if (args.primaryContactPersonId !== undefined) {
      const person = await ctx.db.get(args.primaryContactPersonId);
      if (!person || person.tenantId !== tenantId) {
        throw new Error("Invalid primary contact person or access denied");
      }
      updates.primaryContactPersonId = args.primaryContactPersonId;
    }

    // Apply updates
    await ctx.db.patch(args.organizationId, updates);

    return await ctx.db.get(args.organizationId);
  },
});

/**
 * Delete an organization
 *
 * Currently performs hard delete.
 * Future enhancement: Check for dependent records (people, projects) and handle accordingly.
 */
export const deleteOrganization = mutation({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Get organization
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    if (organization.tenantId !== tenantId) {
      throw new Error("Cannot delete organization from another tenant");
    }

    // TODO: Check for related records (people, projects) and handle accordingly
    // For now, perform simple delete

    await ctx.db.delete(args.organizationId);

    return { success: true, deletedId: args.organizationId };
  },
});

/**
 * Get an organization by ID
 *
 * Returns null if organization not found or belongs to another tenant.
 */
export const getOrganizationById = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const organization = await ctx.db.get(args.organizationId);

    // Return null if not found or wrong tenant
    if (!organization || organization.tenantId !== tenantId) {
      return null;
    }

    return organization;
  },
});

/**
 * List organizations by tenant
 *
 * Returns paginated list of all organizations in the tenant.
 * Supports filtering by organization type.
 *
 * @param type - Optional filter by organization type
 * @param limit - Maximum number of results (default: 50, max: 100)
 */
export const listOrganizationsByTenant = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("Residential"),
        v.literal("Commercial"),
        v.literal("Nonprofit"),
        v.literal("Government"),
        v.literal("Educational")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const limit = Math.min(args.limit ?? 50, 100); // Cap at 100

    let organizations;

    if (args.type) {
      // Filter by organization type
      organizations = await ctx.db
        .query("organizations")
        .withIndex("by_type", (q) => q.eq("type", args.type))
        .filter((q) => q.eq(q.field("tenantId"), tenantId))
        .take(limit);
    } else {
      // All organizations in tenant
      organizations = await ctx.db
        .query("organizations")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .take(limit);
    }

    return organizations;
  },
});
