# Story 1.6.5: Address Testing Debt from User Management

**Epic**: 1 - Foundation & Infrastructure
**Status**: in-progress
**Priority**: HIGH - CRITICAL before Story 1.7 (RBAC)
**Created**: 2025-11-09 (Sprint Change Proposal)

---

## Reversion Impact Note

**Date**: 2025-11-12
**Status Change**: done → in-progress

This story was completed for better-auth implementation with 123 passing tests and >90% coverage. However, due to the reversion to Clerk (Sprint Change Proposal 2025-11-12), all test files will be deleted as part of git revert operations.

**Work Completed (Pre-Reversion)**:
- ✅ Created lib/tasks.ts and lib/invitations.ts with extracted helper functions
- ✅ 123 tests passing (20 tasks + 24 invitations + 79 existing)
- ✅ Coverage: 94.92% statements, 98.55% branches, 80.55% functions, 94.73% lines

**Work Lost in Reversion**:
- tests/tasks.test.ts (20 tests)
- tests/invitations.test.ts (24 tests)
- tests/permissions.test.ts (79 tests)
- lib/invitations.ts (better-auth specific)
- lib/permissions.ts (better-auth specific)

**Next Steps**:
- Re-implement Story 1.6.5 after Clerk reversion stabilizes
- Adapt test patterns for Clerk authentication
- Target same coverage thresholds (>90%)

**See**: Sprint Change Proposal (`docs/sprint-change-proposal-2025-11-12.md`)

---

## User Story

As a Developer,
I want comprehensive test coverage for user management mutations (invitations.ts) and RLS examples (tasks.ts),
So that security-critical code has automated verification before RBAC implementation.

---

## Background

### Why This Story Exists

During implementation of Stories 1.3-1.5 (Convex initialization, RLS foundation, better-auth integration), testing infrastructure did not yet exist (Story 1.6). Business logic was implemented without accompanying tests due to the "chicken and egg" problem - testing infrastructure couldn't be built until foundational code existed.

After Story 1.6 completed and testing infrastructure was established (Vitest configured, 79 tests written for auth system), a technical debt audit revealed **356 lines of untested business logic** across two security-critical files:

1. **`packages/convex/invitations.ts`**: 281 lines, 0% coverage
   - 4 complex mutations with permission checks, multi-tenant validation, and role assignment
   - Implements core user management for the entire platform

2. **`packages/convex/tasks.ts`**: 75 lines, 0% coverage
   - 4 endpoints demonstrating RLS enforcement patterns
   - Examples for tenant-scoped queries and mutations

### Critical Path Impact

**Story 1.7 (RBAC)** implements 12-role access control that **directly depends** on user/role management from Story 1.5. Building complex RBAC on untested user management creates exponential technical debt risk:

- RBAC bugs could be caused by untested user management bugs
- Refactoring user management later is high-risk when RBAC depends on it
- Security vulnerabilities in user management affect all 12 roles

**This story MUST complete before Story 1.7 proceeds.**

---

## Acceptance Criteria

### 1. Unit Tests for `packages/convex/invitations.ts`

Write comprehensive unit tests for all 4 mutations:

#### 1.1 `createUser` Mutation Tests
- ✅ Test System Administrator can create users in any tenant
- ✅ Test non-admin users cannot create users (permission denied)
- ✅ Test user creation with valid data (email, firstName, lastName, role)
- ✅ Test user creation assigns correct tenantId (multi-tenant validation)
- ✅ Test user creation assigns specified role from 12-role enum
- ✅ Test user creation sets isActive: true by default
- ✅ Test email uniqueness enforcement (duplicate email fails)
- ✅ Test error handling for invalid role values

#### 1.2 `listUsers` Mutation Tests
- ✅ Test System Administrator sees all users across all tenants
- ✅ Test non-admin users see only users in their own tenant (RLS filtering)
- ✅ Test empty result when tenant has no users
- ✅ Test result includes all user fields (email, firstName, lastName, role, isActive)

#### 1.3 `setUserActiveStatus` Mutation Tests
- ✅ Test System Administrator can activate/deactivate any user
- ✅ Test non-admin users cannot modify user status (permission denied)
- ✅ Test activating an inactive user (isActive: false → true)
- ✅ Test deactivating an active user (isActive: true → false)
- ✅ Test error when user not found
- ✅ Test cannot deactivate self (System Administrator protections)

#### 1.4 `updateUserRole` Mutation Tests
- ✅ Test System Administrator can add roles to users
- ✅ Test System Administrator can remove roles from users
- ✅ Test non-admin users cannot modify user roles (permission denied)
- ✅ Test adding valid role from 12-role enum
- ✅ Test removing existing role
- ✅ Test error when adding duplicate role
- ✅ Test error when removing non-existent role
- ✅ Test error when user not found
- ✅ Test role validation (only valid roles from enum accepted)

### 2. Integration Tests for `packages/convex/tasks.ts`

Write comprehensive integration tests for all 4 endpoints:

#### 2.1 `list` Query Tests
- ✅ Test authenticated user sees only tasks in their tenant (RLS filtering)
- ✅ Test unauthenticated user is rejected (unauthorized error)
- ✅ Test empty result when tenant has no tasks
- ✅ Test result includes all task fields (_id, text, isCompleted, tenantId)
- ✅ Test uses correct index (by_tenant) for efficient queries

#### 2.2 `add` Mutation Tests
- ✅ Test authenticated user can create task
- ✅ Test task automatically assigned to user's tenantId
- ✅ Test task created with isCompleted: false by default
- ✅ Test unauthenticated user cannot create task (unauthorized error)
- ✅ Test user cannot specify arbitrary tenantId (RLS enforcement)

#### 2.3 `toggle` Mutation Tests
- ✅ Test user can toggle their own tenant's task (isCompleted: false → true)
- ✅ Test user can toggle their own tenant's task (isCompleted: true → false)
- ✅ Test user cannot toggle task from different tenant (cross-tenant security)
- ✅ Test error when task not found
- ✅ Test unauthenticated user cannot toggle task (unauthorized error)

#### 2.4 `remove` Mutation Tests
- ✅ Test user can remove their own tenant's task
- ✅ Test user cannot remove task from different tenant (cross-tenant security)
- ✅ Test error when task not found
- ✅ Test unauthenticated user cannot remove task (unauthorized error)
- ✅ Test task is actually deleted from database (verify via list query)

### 3. Test Coverage Verification

- ✅ Run `pnpm test:coverage` and verify:
  - `invitations.ts`: >95% line coverage
  - `invitations.ts`: >95% function coverage
  - `invitations.ts`: >95% branch coverage
  - `invitations.ts`: >95% statement coverage
  - `tasks.ts`: >95% line coverage
  - `tasks.ts`: >95% function coverage
  - `tasks.ts`: >95% branch coverage
  - `tasks.ts`: >95% statement coverage

### 4. Test Quality Standards

- ✅ All tests follow patterns from `auth.test.ts` and `permissions.test.ts`:
  - Use `vi.mock()` for better-auth access control plugin
  - Mock Convex context (`auth.getUserIdentity()`, `db.query()`)
  - Use fixture data (mockTenantId, mockUserId, mockAuthId, mockUser)
  - Verify correct index usage in queries (by_auth_id, by_tenant, by_user_id)

- ✅ Tests use descriptive names explaining what they verify
- ✅ Tests are organized with `describe` blocks per function/endpoint
- ✅ Tests verify both success and error cases

### 5. Regression Prevention

- ✅ All existing tests remain passing:
  - `auth.test.ts`: 15 tests passing
  - `permissions.test.ts`: 49 tests passing
  - `users.test.ts`: 7 tests passing
  - `rls.test.ts`: 8 tests passing
  - **Total**: 79 existing tests + new tests (invitations + tasks)

### 6. Test Files Created

- ✅ Create `packages/convex/tests/invitations.test.ts`
- ✅ Create `packages/convex/tests/tasks.test.ts`
- ✅ Both files included in Vitest test run (`pnpm test`)

### 7. Documentation

- ✅ Add JSDoc comments to test files explaining what each test suite covers
- ✅ Reference test patterns from Story 1.6 in inline comments where helpful

---

## Prerequisites

- **Story 1.6**: Testing infrastructure configured (Vitest, Playwright, test commands)
- **Story 1.5**: better-auth authentication integrated with user management mutations
- **Story 1.4**: Multi-tenant RLS foundation implemented
- **Story 1.3**: Convex backend and database initialized

---

## Technical Notes

### Test Patterns to Follow

**From `auth.test.ts`**:
```typescript
// Mock Convex context
interface MockQueryCtx {
  auth: {
    getUserIdentity: () => Promise<{ subject: string } | null>
  }
  db: {
    query: (table: string) => MockQuery
  }
}

const ctx = {
  auth: {
    getUserIdentity: vi.fn().mockResolvedValue({ subject: mockAuthId }),
  },
  db: {
    query: vi.fn((table: string) => {
      // Return different mocks based on table name
    }),
  },
} as unknown as MockQueryCtx
```

**From `permissions.test.ts`**:
```typescript
// Mock better-auth access control plugin
vi.mock('better-auth/plugins/access', () => ({
  createAccessControl: (statement: any) => ({
    newRole: (permissions: any) => ({
      getPermissions: () => permissions
    })
  })
}))

// Role mapping for display names to role keys
const roleMapping = {
  'System Administrator': actual.systemAdmin,
  'Setter': actual.setter,
  // ... all 12 roles
}
```

### Files to Test

**`packages/convex/invitations.ts`** (lines 34-264):
- `createUser`: Lines 34-121 (87 lines)
- `listUsers`: Lines 131-151 (20 lines)
- `setUserActiveStatus`: Lines 158-188 (30 lines)
- `updateUserRole`: Lines 195-264 (69 lines)

**`packages/convex/tasks.ts`** (lines 12-74):
- `list`: Lines 12-23 (11 lines)
- `add`: Lines 25-38 (13 lines)
- `toggle`: Lines 40-57 (17 lines)
- `remove`: Lines 59-74 (15 lines)

### Index Usage Verification

Tests should verify that queries use the correct indexes for RLS:
- `users` table: `by_auth_id` (for looking up user by authId)
- `tasks` table: `by_tenant` (for RLS tenant filtering)
- `userRoles` table: `by_user_id` (for fetching user's roles)

This ensures queries are efficient and follow RLS patterns.

---

## Success Metrics

**Coverage**:
- invitations.ts: >95% coverage (currently 0%)
- tasks.ts: >95% coverage (currently 0%)
- Total untested business logic reduced from 356 lines to <18 lines

**Test Count**:
- Estimated 30-40 new tests for invitations.ts
- Estimated 15-20 new tests for tasks.ts
- Total test suite grows from 79 tests to 125-140 tests

**Confidence**:
- Story 1.7 (RBAC) can proceed with confidence in user/role management foundation
- Security-critical code has automated verification
- Regression prevention for future changes

---

## Estimated Effort

**Total**: 8-12 hours (1-2 days)

**Breakdown**:
- invitations.test.ts: 4-6 hours (4 mutations, complex permission logic)
- tasks.test.ts: 2-3 hours (4 endpoints, simpler logic)
- Coverage verification and documentation: 1-2 hours
- Buffer for unexpected issues: 1 hour

---

## Definition of Done

- ✅ All 7 acceptance criteria met
- ✅ All tests passing locally (`pnpm test`)
- ✅ Coverage report shows >95% for both files
- ✅ No regression in existing 79 tests
- ✅ Story marked as "done" in `docs/sprint-status.yaml`
- ✅ Ready to proceed to Story 1.7 (RBAC)

---

## Handoff to Developer

**Files to Create**:
- `packages/convex/tests/invitations.test.ts`
- `packages/convex/tests/tasks.test.ts`

**Reference Test Files**:
- `packages/convex/tests/auth.test.ts` (91.66% coverage model)
- `packages/convex/tests/permissions.test.ts` (100% coverage model)

**Source Files to Test**:
- `packages/convex/invitations.ts` (4 mutations to test)
- `packages/convex/tasks.ts` (4 endpoints to test)

**Commands to Use**:
```bash
# Run tests during development
pnpm test

# Watch mode for rapid iteration
pnpm test --watch

# Generate coverage report
pnpm test:coverage

# View coverage in browser
open coverage/index.html
```

**Test Framework**: Vitest 4.0.7
**Coverage Provider**: v8
**Coverage Target**: 95%+ (lines, functions, branches, statements)

---

**Next Story**: 1.7 - Implement Role-Based Access Control (RBAC) for 12 Roles
**Prerequisite for**: Story 1.7 (CRITICAL - do not proceed until this story is done)
