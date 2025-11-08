# Story 1.4: Implement Multi-Tenant Row-Level Security (RLS) Foundation

Status: drafted

## Story

As a Developer,
I want every database query to enforce tenantId filtering at the query layer,
So that data isolation between tenants is guaranteed and cross-tenant data leakage is impossible.

## Acceptance Criteria

1. All Convex tables include mandatory `tenantId` field in schema (AC: #1)
2. Helper function `getAuthUserWithTenant(ctx)` returns authenticated user + tenantId (AC: #2)
3. Query wrapper ensures every query/mutation checks tenantId (AC: #3)
4. Composite indexes created: `(tenantId, otherField)` for efficient tenant-scoped queries (AC: #4)
5. Test suite verifies cross-tenant queries return empty results (AC: #5)
6. Code linting rule flags queries missing tenantId check (AC: #6)
7. Documentation in `/docs/multi-tenant-rls.md` explains RLS patterns (AC: #7)

## Tasks / Subtasks

- [ ] Audit and fix schema for RLS compliance (AC: #1, #4)
  - [ ] Verify all tables have `tenantId: v.id("tenants")` field
  - [ ] Fix `tasks` table schema to add tenantId (only table missing it)
  - [ ] Verify all tables have `.index("by_tenant", ["tenantId"])`
  - [ ] Verify composite indexes exist for common query patterns: `(tenantId, otherField)`
  - [ ] Run `npx convex dev` to sync schema changes
  - [ ] Verify schema changes in Convex dashboard

- [ ] Create RLS helper functions (AC: #2, #3)
  - [ ] Create `packages/convex/lib/auth.ts` with `getAuthUserWithTenant(ctx)` helper
  - [ ] Helper extracts Clerk JWT identity and looks up user + tenantId
  - [ ] Helper throws clear error if user not authenticated or not found
  - [ ] Create `withTenantIsolation` query wrapper function
  - [ ] Wrapper automatically filters all queries by tenantId
  - [ ] Add TypeScript types for helper return values
  - [ ] Test helper functions with sample query

- [ ] Update existing queries/mutations to use RLS helpers (AC: #3)
  - [ ] Update `packages/convex/users.ts` to use `getAuthUserWithTenant`
  - [ ] Update `packages/convex/tasks.ts` to enforce tenantId filtering
  - [ ] Verify all queries use `.withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))`
  - [ ] Verify all mutations check tenantId before write operations
  - [ ] Test queries return only tenant-scoped data

- [ ] Create test suite for RLS (AC: #5)
  - [ ] Create `packages/convex/tests/rls.test.ts`
  - [ ] Test: Query with tenant A returns only tenant A data
  - [ ] Test: Query with tenant B returns only tenant B data (no overlap)
  - [ ] Test: Mutation from tenant A cannot modify tenant B data
  - [ ] Test: `getAuthUserWithTenant` throws error for unauthenticated requests
  - [ ] Test: Cross-tenant queries return empty results (not errors)
  - [ ] Run test suite and verify all tests pass

- [ ] Setup linting rule for tenantId checks (AC: #6)
  - [ ] Research ESLint custom rule for Convex query patterns
  - [ ] Create ESLint rule to flag queries missing `.withIndex("by_tenant")`
  - [ ] Add rule to `packages/config/eslint/base.js`
  - [ ] Test linting rule detects missing tenantId checks
  - [ ] Document linting rule in ESLint config comments
  - [ ] Run linter across codebase and fix any violations

- [ ] Create RLS documentation (AC: #7)
  - [ ] Create `/docs/multi-tenant-rls.md` file
  - [ ] Document: Why RLS is critical (data isolation, security, compliance)
  - [ ] Document: How to use `getAuthUserWithTenant(ctx)` helper
  - [ ] Document: Required query pattern with `.withIndex("by_tenant")`
  - [ ] Document: Common pitfalls and how to avoid them
  - [ ] Provide code examples: query, mutation, and action patterns
  - [ ] Document: Testing strategy for RLS
  - [ ] Link documentation in README.md

## Dev Notes

### Architecture Context

**Story Context:** This is Story 1.4, building on the Convex backend initialization (Story 1.3). This story enforces multi-tenant Row-Level Security (RLS) to ensure complete data isolation between tenants—the foundational security requirement for a B2B SaaS platform.

**Current Status (Post-Story 1.3):**
- Convex 1.28.0 initialized at `packages/convex/`
- Comprehensive schema with 20+ tables defined in `packages/convex/schema.ts`
- Most tables already include `tenantId` field and `by_tenant` index
- One exception: `tasks` table (demo table) missing tenantId
- ConvexClientProvider configured with Clerk authentication
- No RLS enforcement helpers or query wrappers exist yet
- No automated tests for cross-tenant isolation

**Target State:**
- ALL tables include mandatory `tenantId` field (including `tasks`)
- Helper function `getAuthUserWithTenant(ctx)` available for all queries/mutations
- Query wrapper pattern enforces tenantId filtering
- Composite indexes: `(tenantId, otherField)` for efficient tenant-scoped queries
- Test suite verifies cross-tenant isolation
- ESLint rule flags queries missing tenantId checks
- Documentation explains RLS patterns and best practices

### Learnings from Previous Stories

**From Story 1.1 (Status: done)**
- Monorepo structure at `apps/web/` and `packages/`
- Build validation via `turbo build --filter=@sunup/web`
- Use `workspace:*` protocol for internal dependencies

**From Story 1.2 (Status: done)**
- TailwindCSS 4.1.17 with @plugin syntax
- shadcn/ui components at `apps/web/components/ui/`
- Theme system with `.dark` class selector
- Manual testing until Story 1.11 (no automated tests yet)

**From Story 1.3 (Status: done)**
- Convex location: `packages/convex/` (monorepo structure)
- Schema file: `packages/convex/schema.ts`
- Most tables already have tenantId field and by_tenant index
- ConvexClientProvider: `apps/web/components/ConvexClientProvider.tsx`
- Clerk integration working with `ConvexProviderWithClerk`
- Updated .env.local with deployment: `affable-albatross-627`
- Manual testing approach (no automated tests until Story 1.11)

### Project Structure Notes

**Current Schema Status:**
The schema at `packages/convex/schema.ts` already has excellent multi-tenant foundation:
- 19 out of 20 tables have `tenantId: v.id("tenants")` field
- All 19 tables have `.index("by_tenant", ["tenantId"])`
- Many tables have composite indexes: `by_tenant_and_email`, `by_tenant_and_stage`, `by_tenant_and_role`
- **Only exception:** `tasks` table (lines 448-454) is missing tenantId—it's a demo table from Story 1.3

**Expected Structure After Story 1.4:**
```
sunup/
├── packages/
│   └── convex/
│       ├── schema.ts                 # All tables have tenantId (tasks fixed)
│       ├── lib/
│       │   └── auth.ts               # getAuthUserWithTenant helper
│       ├── tests/
│       │   └── rls.test.ts           # RLS test suite
│       ├── users.ts                  # Updated to use RLS helpers
│       └── tasks.ts                  # Updated with tenantId enforcement
├── docs/
│   └── multi-tenant-rls.md           # RLS documentation
└── packages/config/
    └── eslint/
        └── base.js                   # ESLint rule for tenantId checks
```

### RLS Implementation Pattern

**From architecture.md (lines 670-719):**

**1. Authentication Helper Pattern:**
```typescript
// packages/convex/lib/auth.ts
export async function getAuthUserWithTenant(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user) throw new Error("User not found");

  return { user, tenantId: user.tenantId };
}
```

**2. Query Pattern with RLS:**
```typescript
// Example query
export const listTasks = query({
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // ALWAYS filter by tenantId
    return await ctx.db
      .query("tasks")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  }
});
```

**3. Mutation Pattern with RLS:**
```typescript
// Example mutation
export const createTask = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const { user, tenantId } = await getAuthUserWithTenant(ctx);

    // Insert with tenantId
    return await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      tenantId: tenantId,
      createdAt: Date.now()
    });
  }
});
```

**4. Role Checking with RLS (Future Use):**
```typescript
// packages/convex/lib/auth.ts
export async function requireRole(ctx, allowedRoles: string[]) {
  const { user, tenantId } = await getAuthUserWithTenant(ctx);

  const roles = await ctx.db
    .query("userRoles")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .collect();

  const hasRole = roles.some(r => allowedRoles.includes(r.role) && r.isActive);
  if (!hasRole) throw new Error("Forbidden");

  return { user, tenantId };
}
```

### Testing Strategy

**Manual Testing (Story 1.4):**
1. **Schema Verification:** `npx convex dev` syncs schema without errors
2. **Helper Function Test:** Create sample query using `getAuthUserWithTenant`, verify it returns user + tenantId
3. **Query Isolation Test:** Create tasks for two different users, verify each query returns only tenant-scoped data
4. **Mutation Test:** Attempt to create/update records, verify tenantId is enforced
5. **Cross-tenant Test:** Manually verify queries with different Clerk users return different data sets
6. **Build Verification:** `turbo build --filter=@sunup/web` succeeds

**Note:** Story 1.11 will add automated test infrastructure (Vitest + Playwright). For Story 1.4, we'll create test files (`packages/convex/tests/rls.test.ts`) with test placeholders, but they won't run automatically until Story 1.11 sets up the test runner.

### Security Considerations

**Critical Security Principle:**
- **EVERY query and mutation MUST filter by tenantId**
- **NEVER trust client-provided tenantId** (always extract from authenticated context)
- **NEVER skip tenantId validation** (even for "admin" operations)

**Common Pitfalls to Avoid:**
1. ❌ Querying without `.withIndex("by_tenant")` filter
2. ❌ Accepting tenantId as a function argument from client
3. ❌ Using `ctx.db.get(id)` without verifying tenantId matches
4. ❌ Conditional RLS (e.g., "skip RLS for system admin")
5. ❌ Forgetting to add tenantId to junction tables (many-to-many)

**Why RLS Matters:**
- **Data Privacy:** Prevents tenant A from accessing tenant B's data
- **Compliance:** Required for SOC 2, GDPR, HIPAA compliance
- **Trust:** B2B customers expect complete data isolation
- **Security:** Defense-in-depth against bugs, misconfigurations, and attacks

### Potential Gotchas

1. **Clerk JWT Metadata:**
   - Tenant identification relies on Clerk user metadata
   - User must exist in Convex `users` table (synced via webhook)
   - If user not found, RLS helper throws error (by design)

2. **Existing Queries:**
   - `packages/convex/users.ts` may have queries without tenantId filtering
   - `packages/convex/tasks.ts` definitely needs tenantId enforcement (it's a demo table)
   - Must audit ALL query/mutation files for RLS compliance

3. **Tasks Table Fix:**
   - `tasks` table missing tenantId field and index (only table with this issue)
   - Adding tenantId is a schema migration
   - Existing demo tasks (if any) will need tenantId backfilled or deleted

4. **Composite Indexes:**
   - Most tables already have `by_tenant` index
   - Composite indexes improve query performance: `by_tenant_and_email`, `by_tenant_and_stage`
   - Order matters: tenantId should be first in composite index

5. **Testing Without Automated Tests:**
   - Story 1.11 sets up Vitest/Playwright
   - For Story 1.4, create test files with manual test procedures
   - Document how to manually verify RLS isolation

6. **ESLint Rule:**
   - Custom ESLint rules for Convex patterns may require research
   - Fallback: Document the pattern clearly and rely on code review
   - Can enhance linting in future story if custom rule is too complex

### References

- [Source: docs/epics.md#Story-1.4] - Story definition and acceptance criteria (lines 133-149)
- [Source: docs/architecture.md#Authentication-&-Authorization] - RLS pattern examples (lines 669-719)
- [Source: docs/architecture.md#Data-Architecture] - Multi-tenancy requirements (lines 770-777)
- [Source: docs/architecture.md#Security-Architecture] - RLS security principles (lines 873-883)
- [Convex Documentation] - https://docs.convex.dev/
- [Convex Row-Level Security] - https://docs.convex.dev/security/row-level-security
- [Clerk + Convex Integration] - https://docs.convex.dev/auth/clerk

## Dev Agent Record

### Context Reference

Context file will be created by story-context workflow after story is marked ready-for-dev.

### Agent Model Used

<!-- Will be filled during implementation -->

### Debug Log References

<!-- Implementation details, issues encountered, and solutions will be logged here during development -->

### Completion Notes List

<!-- Will be filled upon story completion -->

### File List

**Files to be Created:**
- `packages/convex/lib/auth.ts` - RLS helper functions
- `packages/convex/tests/rls.test.ts` - RLS test suite
- `docs/multi-tenant-rls.md` - RLS documentation

**Files to be Modified:**
- `packages/convex/schema.ts` - Fix tasks table to add tenantId
- `packages/convex/users.ts` - Update to use RLS helpers
- `packages/convex/tasks.ts` - Update with tenantId enforcement
- `packages/config/eslint/base.js` - Add ESLint rule for tenantId checks (if feasible)
- `README.md` - Link to RLS documentation

## Change Log

- 2025-11-08: Story drafted by create-story workflow from epics.md (Story 1.4, lines 133-149)
