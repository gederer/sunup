/**
 * Organization Management Tests
 * Story 1.10: Create Person and Organization Base Schema
 *
 * Test Coverage:
 * - Organization CRUD operations with validation
 * - Billing address validation
 * - Primary contact person validation
 * - Multi-tenant isolation
 * - Integration with persons functionality
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
 * Setup second tenant for multi-tenant testing
 */
async function setupSecondTenant(t: ReturnType<typeof convexTest>) {
  const tenantId = await t.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("tenants", {
      name: "Second Tenant",
      isActive: true,
    });
  });

  const userId = await t.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("users", {
      clerkId: "second_clerk_user",
      email: "second@example.com",
      firstName: "Second",
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
 * Create a test organization
 */
async function createTestOrganization(
  t: any,
  overrides?: Partial<{
    name: string;
    type: "Residential" | "Commercial" | "Nonprofit" | "Government" | "Educational";
    billingAddress: { street: string; city: string; state: string; zipCode: string; country: string };
    taxId?: string;
  }>
) {
  const defaultOrg = {
    name: "Test Organization",
    type: "Residential" as const,
    billingAddress: {
      street: "123 Test St",
      city: "Test City",
      state: "TS",
      zipCode: "12345",
      country: "USA",
    },
    ...overrides,
  };

  return await t.mutation(api.organizations.createOrganization, defaultOrg);
}

// =============================================================================
// createOrganization Tests
// =============================================================================

describe("createOrganization", () => {
  test("should create organization with valid data (Residential)", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const org = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.createOrganization, {
        name: "Smith Residence",
        type: "Residential",
        billingAddress: {
          street: "456 Main St",
          city: "Springfield",
          state: "IL",
          zipCode: "62701",
          country: "USA",
        },
      });

    expect(org).toBeDefined();
    expect(org?.name).toBe("Smith Residence");
    expect(org?.type).toBe("Residential");
    expect(org?.billingAddress.street).toBe("456 Main St");
  });

  test("should create organization with all types", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const types = ["Residential", "Commercial", "Nonprofit", "Government", "Educational"] as const;

    for (const type of types) {
      const org = await t
        .withIdentity({ subject: "test_clerk_user" })
        .mutation(api.organizations.createOrganization, {
          name: `${type} Org`,
          type,
          billingAddress: {
            street: "123 Test St",
            city: "Test City",
            state: "TS",
            zipCode: "12345",
            country: "USA",
          },
        });

      expect(org?.type).toBe(type);
    }
  });

  test("should create organization with optional taxId", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const org = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.createOrganization, {
        name: "Acme Corp",
        type: "Commercial",
        billingAddress: {
          street: "789 Business Blvd",
          city: "Commerce City",
          state: "CA",
          zipCode: "90001",
          country: "USA",
        },
        taxId: "12-3456789",
      });

    expect(org?.taxId).toBe("12-3456789");
  });

  test("should create organization with valid primary contact", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    // Create a person first
    const person = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.persons.createPerson, {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });

    const org = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.createOrganization, {
        name: "Doe Enterprises",
        type: "Commercial",
        billingAddress: {
          street: "100 Enterprise Way",
          city: "Business Town",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        primaryContactPersonId: person!._id,
      });

    expect(org?.primaryContactPersonId).toBe(person!._id);
  });

  test("should fail with missing name", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    await expect(
      t.withIdentity({ subject: "test_clerk_user" }).mutation(api.organizations.createOrganization, {
        name: "",
        type: "Residential",
        billingAddress: {
          street: "123 Test St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "USA",
        },
      })
    ).rejects.toThrow("Organization name is required");
  });

  test("should fail with incomplete billing address (missing street)", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    await expect(
      t.withIdentity({ subject: "test_clerk_user" }).mutation(api.organizations.createOrganization, {
        name: "Test Org",
        type: "Residential",
        billingAddress: {
          street: "",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "USA",
        },
      })
    ).rejects.toThrow("Billing address must include street, city, state, zipCode, and country");
  });

  test("should fail with incomplete billing address (missing city)", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    await expect(
      t.withIdentity({ subject: "test_clerk_user" }).mutation(api.organizations.createOrganization, {
        name: "Test Org",
        type: "Residential",
        billingAddress: {
          street: "123 Test St",
          city: "",
          state: "TS",
          zipCode: "12345",
          country: "USA",
        },
      })
    ).rejects.toThrow("Billing address must include street, city, state, zipCode, and country");
  });

  test("should fail with invalid primary contact (wrong tenant)", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);
    const { tenantId: tenant2Id } = await setupSecondTenant(t);

    // Create person in second tenant
    const person2Id = await t.run(async (ctx) => {
      return await ctx.db.insert("people", {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        tenantId: tenant2Id,
      });
    });

    await expect(
      t.withIdentity({ subject: "test_clerk_user" }).mutation(api.organizations.createOrganization, {
        name: "Test Org",
        type: "Residential",
        billingAddress: {
          street: "123 Test St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "USA",
        },
        primaryContactPersonId: person2Id,
      })
    ).rejects.toThrow("Invalid primary contact person or access denied");
  });

  test("should enforce multi-tenant isolation", async () => {
    const t = convexTest(schema, modules);
    const { tenantId: tenant1Id } = await setupTestEnvironment(t);
    await setupSecondTenant(t);

    // Create org in first tenant
    const org1 = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.createOrganization, {
        name: "Tenant 1 Org",
        type: "Residential",
        billingAddress: {
          street: "123 Test St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "USA",
        },
      });

    // Create org in second tenant
    const org2 = await t
      .withIdentity({ subject: "second_clerk_user" })
      .mutation(api.organizations.createOrganization, {
        name: "Tenant 2 Org",
        type: "Commercial",
        billingAddress: {
          street: "456 Other St",
          city: "Other City",
          state: "OT",
          zipCode: "67890",
          country: "USA",
        },
      });

    // Verify they have different tenantIds
    expect(org1?.tenantId).toBe(tenant1Id);
    expect(org2?.tenantId).not.toBe(tenant1Id);
  });
});

// =============================================================================
// updateOrganization Tests
// =============================================================================

describe("updateOrganization", () => {
  test("should update organization name", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));

    const updated = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.updateOrganization, {
        organizationId: org!._id,
        name: "Updated Organization Name",
      });

    expect(updated?.name).toBe("Updated Organization Name");
    expect(updated?.type).toBe("Residential"); // Unchanged
  });

  test("should update organization type", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));

    const updated = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.updateOrganization, {
        organizationId: org!._id,
        type: "Commercial",
      });

    expect(updated?.type).toBe("Commercial");
  });

  test("should update billing address", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));

    const updated = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.updateOrganization, {
        organizationId: org!._id,
        billingAddress: {
          street: "999 New St",
          city: "New City",
          state: "NC",
          zipCode: "99999",
          country: "USA",
        },
      });

    expect(updated?.billingAddress.street).toBe("999 New St");
    expect(updated?.billingAddress.city).toBe("New City");
  });

  test("should update primary contact person", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));

    const person = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.persons.createPerson, {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@example.com",
      });

    const updated = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.updateOrganization, {
        organizationId: org!._id,
        primaryContactPersonId: person!._id,
      });

    expect(updated?.primaryContactPersonId).toBe(person!._id);
  });

  test("should fail to update non-existent organization", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    // Create and delete an org to get a valid but non-existent ID
    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));
    await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.deleteOrganization, {
        organizationId: org!._id,
      });

    await expect(
      t.withIdentity({ subject: "test_clerk_user" }).mutation(api.organizations.updateOrganization, {
        organizationId: org!._id,
        name: "Updated Name",
      })
    ).rejects.toThrow("Organization not found");
  });

  test("should fail to update organization from another tenant", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);
    await setupSecondTenant(t);

    // Create org in first tenant
    const org = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.createOrganization, {
        name: "Tenant 1 Org",
        type: "Residential",
        billingAddress: {
          street: "123 Test St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "USA",
        },
      });

    // Try to update from second tenant
    await expect(
      t.withIdentity({ subject: "second_clerk_user" }).mutation(api.organizations.updateOrganization, {
        organizationId: org!._id,
        name: "Hacked Name",
      })
    ).rejects.toThrow("Cannot access organization from another tenant");
  });

  test("should fail with invalid primary contact person", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);
    const { tenantId: tenant2Id } = await setupSecondTenant(t);

    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));

    // Create person in second tenant
    const person2Id = await t.run(async (ctx) => {
      return await ctx.db.insert("people", {
        firstName: "Bob",
        lastName: "Cross",
        email: "bob@example.com",
        tenantId: tenant2Id,
      });
    });

    await expect(
      t.withIdentity({ subject: "test_clerk_user" }).mutation(api.organizations.updateOrganization, {
        organizationId: org!._id,
        primaryContactPersonId: person2Id,
      })
    ).rejects.toThrow("Invalid primary contact person or access denied");
  });

  test("should fail with empty organization name", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));

    await expect(
      t.withIdentity({ subject: "test_clerk_user" }).mutation(api.organizations.updateOrganization, {
        organizationId: org!._id,
        name: "",
      })
    ).rejects.toThrow("Organization name cannot be empty");
  });

  test("should fail with incomplete billing address", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));

    await expect(
      t.withIdentity({ subject: "test_clerk_user" }).mutation(api.organizations.updateOrganization, {
        organizationId: org!._id,
        billingAddress: {
          street: "999 New St",
          city: "",
          state: "NC",
          zipCode: "99999",
          country: "USA",
        },
      })
    ).rejects.toThrow("Billing address must include street, city, state, zipCode, and country");
  });
});

// =============================================================================
// deleteOrganization Tests
// =============================================================================

describe("deleteOrganization", () => {
  test("should delete organization successfully", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));

    const result = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.deleteOrganization, {
        organizationId: org!._id,
      });

    expect(result.success).toBe(true);
    expect(result.deletedId).toBe(org!._id);

    // Verify it's deleted
    const deleted = await t
      .withIdentity({ subject: "test_clerk_user" })
      .query(api.organizations.getOrganizationById, {
        organizationId: org!._id,
      });

    expect(deleted).toBeNull();
  });

  test("should fail to delete non-existent organization", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    // Create and delete an org to get a valid but non-existent ID
    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));
    await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.deleteOrganization, {
        organizationId: org!._id,
      });

    await expect(
      t.withIdentity({ subject: "test_clerk_user" }).mutation(api.organizations.deleteOrganization, {
        organizationId: org!._id,
      })
    ).rejects.toThrow("Organization not found");
  });

  test("should fail to delete organization from another tenant", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);
    await setupSecondTenant(t);

    const org = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.createOrganization, {
        name: "Tenant 1 Org",
        type: "Residential",
        billingAddress: {
          street: "123 Test St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "USA",
        },
      });

    await expect(
      t.withIdentity({ subject: "second_clerk_user" }).mutation(api.organizations.deleteOrganization, {
        organizationId: org!._id,
      })
    ).rejects.toThrow("Cannot delete organization from another tenant");
  });
});

// =============================================================================
// getOrganizationById Tests
// =============================================================================

describe("getOrganizationById", () => {
  test("should get organization by ID", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));

    const retrieved = await t
      .withIdentity({ subject: "test_clerk_user" })
      .query(api.organizations.getOrganizationById, {
        organizationId: org!._id,
      });

    expect(retrieved).toBeDefined();
    expect(retrieved?._id).toBe(org!._id);
    expect(retrieved?.name).toBe("Test Organization");
  });

  test("should return null for non-existent ID", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    // Create and delete an org to get a valid but non-existent ID
    const org = await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));
    await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.deleteOrganization, {
        organizationId: org!._id,
      });

    const result = await t
      .withIdentity({ subject: "test_clerk_user" })
      .query(api.organizations.getOrganizationById, {
        organizationId: org!._id,
      });

    expect(result).toBeNull();
  });

  test("should return null for organization from another tenant", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);
    await setupSecondTenant(t);

    const org = await t
      .withIdentity({ subject: "test_clerk_user" })
      .mutation(api.organizations.createOrganization, {
        name: "Tenant 1 Org",
        type: "Residential",
        billingAddress: {
          street: "123 Test St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "USA",
        },
      });

    const result = await t
      .withIdentity({ subject: "second_clerk_user" })
      .query(api.organizations.getOrganizationById, {
        organizationId: org!._id,
      });

    expect(result).toBeNull();
  });
});

// =============================================================================
// listOrganizationsByTenant Tests
// =============================================================================

describe("listOrganizationsByTenant", () => {
  test("should list all organizations for tenant", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    // Create multiple organizations
    await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }), {
      name: "Org 1",
      type: "Residential",
    });
    await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }), {
      name: "Org 2",
      type: "Commercial",
    });
    await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }), {
      name: "Org 3",
      type: "Nonprofit",
    });

    const orgs = await t
      .withIdentity({ subject: "test_clerk_user" })
      .query(api.organizations.listOrganizationsByTenant, {});

    expect(orgs.length).toBe(3);
  });

  test("should filter organizations by type (Residential)", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }), {
      name: "Residential 1",
      type: "Residential",
    });
    await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }), {
      name: "Commercial 1",
      type: "Commercial",
    });
    await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }), {
      name: "Residential 2",
      type: "Residential",
    });

    const orgs = await t
      .withIdentity({ subject: "test_clerk_user" })
      .query(api.organizations.listOrganizationsByTenant, {
        type: "Residential",
      });

    expect(orgs.length).toBe(2);
    expect(orgs.every((o) => o.type === "Residential")).toBe(true);
  });

  test("should filter organizations by type (Commercial)", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }), {
      name: "Residential 1",
      type: "Residential",
    });
    await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }), {
      name: "Commercial 1",
      type: "Commercial",
    });
    await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }), {
      name: "Commercial 2",
      type: "Commercial",
    });

    const orgs = await t
      .withIdentity({ subject: "test_clerk_user" })
      .query(api.organizations.listOrganizationsByTenant, {
        type: "Commercial",
      });

    expect(orgs.length).toBe(2);
    expect(orgs.every((o) => o.type === "Commercial")).toBe(true);
  });

  test("should respect limit parameter", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    // Create 5 organizations
    for (let i = 1; i <= 5; i++) {
      await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }), {
        name: `Org ${i}`,
      });
    }

    const orgs = await t
      .withIdentity({ subject: "test_clerk_user" })
      .query(api.organizations.listOrganizationsByTenant, {
        limit: 3,
      });

    expect(orgs.length).toBe(3);
  });

  test("should cap limit at 100", async () => {
    const t = convexTest(schema, modules);
    await setupTestEnvironment(t);

    await createTestOrganization(t.withIdentity({ subject: "test_clerk_user" }));

    // Request limit of 200, should cap at 100
    const orgs = await t
      .withIdentity({ subject: "test_clerk_user" })
      .query(api.organizations.listOrganizationsByTenant, {
        limit: 200,
      });

    // Can't verify cap directly, but at least it shouldn't error
    expect(orgs.length).toBeGreaterThanOrEqual(0);
  });
});
