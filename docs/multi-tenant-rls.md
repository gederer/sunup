# Multi-Tenant Row-Level Security (RLS)

**Status:** Implemented (Story 1.4)
**Last Updated:** 2025-11-08
**Applies To:** All Convex queries, mutations, and actions

---

## 📋 Table of Contents

1. [Why RLS is Critical](#why-rls-is-critical)
2. [How RLS Works in Sunup](#how-rls-works-in-sunup)
3. [Implementation Patterns](#implementation-patterns)
4. [Common Pitfalls](#common-pitfalls)
5. [Testing Strategy](#testing-strategy)
6. [Examples](#examples)
7. [Security Checklist](#security-checklist)

---

## Why RLS is Critical

Row-Level Security (RLS) is the **foundational security mechanism** that ensures complete data isolation between tenants in the Sunup platform. Without RLS, tenant data could be accidentally or maliciously accessed by users from different organizations.

### Business Impact

- **Data Privacy**: Prevents Tenant A from accessing Tenant B's sensitive data (customers, projects, financials)
- **Compliance**: Required for SOC 2, GDPR, HIPAA compliance audits
- **Trust**: B2B customers expect and require complete data isolation
- **Liability**: Data breaches can result in legal liability, fines, and loss of business

### Technical Impact

- **Defense-in-Depth**: RLS enforced at database query layer (cannot be bypassed)
- **Automatic Enforcement**: Every query/mutation automatically filters by tenantId
- **Type Safety**: TypeScript enforces tenantId field in schema
- **Runtime Safety**: Queries throw errors if RLS helper not called

---

## How RLS Works in Sunup

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ Client Request                                              │
│ (Authenticated with Clerk JWT)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Convex Query/Mutation Handler                               │
│                                                              │
│  1. Call getAuthUserWithTenant(ctx)                         │
│     ├─ Extract Clerk JWT identity                           │
│     ├─ Look up user in database                             │
│     └─ Return { user, tenantId }                            │
│                                                              │
│  2. Filter query by tenantId                                │
│     └─ .withIndex("by_tenant", q => q.eq("tenantId", ...)) │
│                                                              │
│  3. Return results (only tenant's data)                     │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Schema**: All tables include `tenantId: v.id("tenants")` field
2. **Indexes**: All tables have `.index("by_tenant", ["tenantId"])` for efficient queries
3. **Helper Function**: `getAuthUserWithTenant(ctx)` extracts tenantId from authenticated context
4. **Query Pattern**: All queries filter by tenantId using `.withIndex("by_tenant", ...)`
5. **Mutation Pattern**: All mutations include tenantId when creating records

---

## Implementation Patterns

### 1. Query Pattern (Read Operations)

**Template:**
```typescript
import { query } from "./_generated/server";
import { getAuthUserWithTenant } from "./lib/auth";

export const listItems = query({
  args: {},
  handler: async (ctx) => {
    // STEP 1: Get authenticated user and tenantId
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // STEP 2: Query with tenantId filter
    return await ctx.db
      .query("items")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  }
});
```

**Key Points:**
- **ALWAYS** call `getAuthUserWithTenant(ctx)` first
- **ALWAYS** filter by tenantId using `.withIndex("by_tenant", ...)`
- **NEVER** accept tenantId as a parameter from the client

### 2. Mutation Pattern (Write Operations)

**Template:**
```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserWithTenant } from "./lib/auth";

export const createItem = mutation({
  args: { name: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    // STEP 1: Get authenticated user and tenantId
    const { user, tenantId } = await getAuthUserWithTenant(ctx);

    // STEP 2: Insert with tenantId
    return await ctx.db.insert("items", {
      name: args.name,
      description: args.description,
      tenantId,  // Automatically include tenantId
      createdBy: user._id,
      createdAt: Date.now(),
    });
  }
});
```

**Key Points:**
- **ALWAYS** include tenantId in all inserts
- **NEVER** accept tenantId from client (extract from auth context)
- Verify tenantId matches before updates/deletes (see example below)

### 3. Update/Delete Pattern (Verify Ownership)

**Template:**
```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserWithTenant } from "./lib/auth";

export const updateItem = mutation({
  args: { id: v.id("items"), name: v.string() },
  handler: async (ctx, args) => {
    // STEP 1: Get authenticated user and tenantId
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // STEP 2: Load the record
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Item not found");

    // STEP 3: Verify record belongs to user's tenant
    if (item.tenantId !== tenantId) {
      throw new Error("Unauthorized: Item belongs to different tenant");
    }

    // STEP 4: Perform update
    await ctx.db.patch(args.id, {
      name: args.name,
      updatedAt: Date.now(),
    });
  }
});
```

**Key Points:**
- **ALWAYS** verify tenantId matches before update/delete
- **ALWAYS** throw clear error if tenantId mismatch
- Use same pattern for delete operations

### 4. Role-Based Access Control (RBAC) with RLS

**Template:**
```typescript
import { mutation } from "./_generated/server";
import { requireRole } from "./lib/auth";

export const createCommission = mutation({
  args: { ... },
  handler: async (ctx, args) => {
    // Combines RLS with RBAC
    const { user, tenantId } = await requireRole(ctx, [
      "Finance",
      "System Administrator"
    ]);

    // Only Finance or System Administrator can create commissions
    // And only for their own tenant
    return await ctx.db.insert("commissions", {
      ...args,
      tenantId,
      createdBy: user._id,
    });
  }
});
```

**Key Points:**
- Use `requireRole` instead of `getAuthUserWithTenant` when RBAC needed
- RLS is still enforced (tenantId filtering)
- Roles are tenant-scoped (user can only have roles in their tenant)

---

## Common Pitfalls

### ❌ PITFALL 1: Querying Without tenantId Filter

**WRONG:**
```typescript
export const listTasks = query({
  handler: async (ctx) => {
    // ❌ NO tenantId filter - returns ALL tenants' tasks!
    return await ctx.db.query("tasks").collect();
  }
});
```

**RIGHT:**
```typescript
export const listTasks = query({
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);
    // ✅ Filtered by tenantId
    return await ctx.db
      .query("tasks")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  }
});
```

### ❌ PITFALL 2: Accepting TenantId from Client

**WRONG:**
```typescript
export const listTasks = query({
  args: { tenantId: v.id("tenants") }, // ❌ NEVER accept tenantId from client!
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
  }
});
```

**RIGHT:**
```typescript
export const listTasks = query({
  args: {}, // ✅ No tenantId parameter
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx); // ✅ Extract from auth
    return await ctx.db
      .query("tasks")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  }
});
```

### ❌ PITFALL 3: Using ctx.db.get() Without Verification

**WRONG:**
```typescript
export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    // ❌ No verification - could delete other tenant's task!
    await ctx.db.delete(args.id);
  }
});
```

**RIGHT:**
```typescript
export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");

    // ✅ Verify tenantId matches
    if (task.tenantId !== tenantId) {
      throw new Error("Unauthorized: Task belongs to different tenant");
    }

    await ctx.db.delete(args.id);
  }
});
```

### ❌ PITFALL 4: Conditional RLS (Don't Do This!)

**WRONG:**
```typescript
export const listTasks = query({
  handler: async (ctx) => {
    const { user, tenantId } = await getAuthUserWithTenant(ctx);

    // ❌ NEVER skip RLS for "admin" users!
    if (user.isSystemAdmin) {
      return await ctx.db.query("tasks").collect(); // All tenants!
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  }
});
```

**RIGHT:**
```typescript
export const listTasks = query({
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // ✅ ALWAYS filter by tenantId (even for admins)
    return await ctx.db
      .query("tasks")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  }
});
```

**Why:** System admins should have admin access **within their tenant**, not across all tenants. True "super admin" functionality (if needed) should be a separate internal tool with explicit audit logging.

### ❌ PITFALL 5: Forgetting TenantId on Junction Tables

**WRONG:**
```typescript
// ❌ Many-to-many junction table without tenantId
projectContacts: defineTable({
  projectId: v.id("projects"),
  personId: v.id("people"),
  role: v.string(),
}),
```

**RIGHT:**
```typescript
// ✅ Junction table includes tenantId
projectContacts: defineTable({
  projectId: v.id("projects"),
  personId: v.id("people"),
  role: v.string(),
  tenantId: v.id("tenants"), // ✅ Required for RLS
})
  .index("by_tenant", ["tenantId"])
  .index("by_project", ["projectId"])
  .index("by_person", ["personId"]),
```

---

## Testing Strategy

### Manual Testing (Current - Until Story 1.11)

**Test 1: Cross-Tenant Isolation**
1. Create two test users with different tenantIds in Clerk metadata
2. Log in as User A, create a task
3. Log in as User B, call `tasks.list()`
4. **Verify:** User B sees empty array (not User A's task)

**Test 2: Unauthenticated Access**
1. Log out (clear cookies)
2. Try to call `tasks.list()` via browser console
3. **Verify:** Error thrown: "Unauthorized"

**Test 3: Mutation Ownership Verification**
1. Log in as User A, create a task, note task ID
2. Log in as User B, try to delete User A's task
3. **Verify:** Error thrown: "Unauthorized: Task belongs to different tenant"

**Test 4: Schema Compliance**
1. Run `npx convex dev --once`
2. **Verify:** No schema errors, all tables include tenantId

### Automated Testing (Future - Story 1.11)

Once Vitest is set up in Story 1.11, convert manual tests to automated tests:
- See `packages/convex/tests/rls.test.ts` for test scenarios
- Use Convex test utilities to mock different tenants
- Run as part of CI/CD pipeline

---

## Examples

### Example 1: List Users in Same Tenant

```typescript
import { query } from "./_generated/server";
import { getAuthUserWithTenant } from "./lib/auth";

export const listTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    return await ctx.db
      .query("users")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  }
});
```

### Example 2: Create Project with RLS

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserWithTenant } from "./lib/auth";

export const createProject = mutation({
  args: {
    projectName: v.string(),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const { user, tenantId } = await getAuthUserWithTenant(ctx);

    // Verify organization belongs to same tenant
    const org = await ctx.db.get(args.organizationId);
    if (!org || org.tenantId !== tenantId) {
      throw new Error("Organization not found or unauthorized");
    }

    return await ctx.db.insert("projects", {
      projectName: args.projectName,
      organizationId: args.organizationId,
      projectType: "Solar Installation",
      pipelineStage: "Lead",
      tenantId,
      consultantUserId: user._id,
      _creationTime: Date.now(),
    });
  }
});
```

### Example 3: Search Across Tenant's Data

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserWithTenant } from "./lib/auth";

export const searchPeople = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Search is still tenant-scoped
    const people = await ctx.db
      .query("people")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();

    const searchLower = args.searchTerm.toLowerCase();
    return people.filter(
      (p) =>
        p.firstName.toLowerCase().includes(searchLower) ||
        p.lastName.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower)
    );
  }
});
```

---

## Security Checklist

Before deploying any new query or mutation, verify:

- [ ] Called `getAuthUserWithTenant(ctx)` at the start of handler
- [ ] All queries filter by tenantId using `.withIndex("by_tenant", ...)`
- [ ] All mutations include tenantId when creating records
- [ ] Update/delete operations verify tenantId matches before proceeding
- [ ] No tenantId parameters accepted from client
- [ ] No conditional RLS (always enforce, even for admins)
- [ ] Junction tables include tenantId field
- [ ] Error messages don't leak tenant information
- [ ] Tested with multiple tenants to verify isolation
- [ ] Code reviewed by another developer

---

## References

- **Implementation:** `packages/convex/lib/auth.ts` - RLS helper functions
- **Examples:** `packages/convex/tasks.ts`, `packages/convex/users.ts` - Working examples
- **Schema:** `packages/convex/schema.ts` - All tables with tenantId
- **Tests:** `packages/convex/tests/rls.test.ts` - Test scenarios
- **Architecture:** `docs/architecture.md` - High-level RLS design
- **Convex Docs:** https://docs.convex.dev/security/row-level-security

---

**Questions or Issues?**
- See Story 1.4 in `docs/stories/` for implementation details
- Review architecture.md for high-level security architecture
- Check Convex documentation for advanced patterns

**Remember:** RLS is the foundation of our security model. When in doubt, err on the side of more restrictive access control.
