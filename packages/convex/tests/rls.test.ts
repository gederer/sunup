/**
 * Row-Level Security (RLS) Tests
 * Story 1.4: Implement Multi-Tenant Row-Level Security (RLS) Foundation
 *
 * NOTE: Automated test runner will be set up in Story 1.11
 * For now, these are manual test procedures documented as code
 *
 * MANUAL TESTING INSTRUCTIONS:
 * ============================
 * 1. Create two test users with different tenants via Clerk dashboard
 * 2. Add tenantId to each user's Clerk metadata
 * 3. Run manual tests via Convex dashboard or browser console
 * 4. Verify RLS isolation between tenants
 */

// These tests will be executable once Vitest is set up in Story 1.11
// For now, they serve as documentation of test scenarios

/**
 * TEST 1: Schema Compliance
 * AC #1, #4
 *
 * Manual Test Procedure:
 * 1. Run `npx convex dev --once`
 * 2. Verify no schema errors
 * 3. Check Convex dashboard schema tab
 * 4. Verify all 20 tables have tenantId field
 * 5. Verify all 20 tables have by_tenant index
 *
 * Expected Result: All tables include tenantId, schema syncs successfully
 */
export function test_schemaCompliance() {
  // Manual verification:
  // - packages/convex/schema.ts has tenantId: v.id("tenants") for all tables
  // - All tables have .index("by_tenant", ["tenantId"])
  // - npx convex dev --once succeeds without schema errors
}

/**
 * TEST 2: Helper Function Returns User and TenantId
 * AC #2
 *
 * Manual Test Procedure:
 * 1. Open Convex dashboard
 * 2. Run query: users.current()
 * 3. Verify it returns user object with tenantId
 * 4. Try calling tasks.list() when authenticated
 * 5. Verify it doesn't throw "Unauthorized" error
 *
 * Expected Result: getAuthUserWithTenant returns { user, tenantId }
 */
export function test_helperFunctionReturnsUserAndTenant() {
  // Manual verification:
  // - Call users.current() via Convex dashboard
  // - Verify response includes user._id, user.tenantId, etc.
  // - Call tasks.list() and verify it works (proves getAuthUserWithTenant works)
}

/**
 * TEST 3: Unauthenticated Access Throws Error
 * AC #2
 *
 * Manual Test Procedure:
 * 1. Log out of application (clear auth cookies)
 * 2. Try to call tasks.list() query
 * 3. Verify it throws "Unauthorized" error
 *
 * Expected Result: getAuthUserWithTenant throws "Unauthorized" when not logged in
 */
export function test_unauthenticatedAccessThrowsError() {
  // Manual verification:
  // - Clear browser cookies / log out
  // - Try calling tasks.list() via browser console
  // - Should see error: "Unauthorized"
}

/**
 * TEST 4: Cross-Tenant Isolation - Query
 * AC #3, #5
 *
 * Manual Test Procedure:
 * 1. Create Tenant A with ID: tenant_A
 * 2. Create Tenant B with ID: tenant_B
 * 3. Create User A with tenantId: tenant_A in Clerk metadata
 * 4. Create User B with tenantId: tenant_B in Clerk metadata
 * 5. Log in as User A, create task "Task A"
 * 6. Log in as User B, create task "Task B"
 * 7. Log in as User A, call tasks.list()
 * 8. Verify only "Task A" is returned (no "Task B")
 * 9. Log in as User B, call tasks.list()
 * 10. Verify only "Task B" is returned (no "Task A")
 *
 * Expected Result: Each tenant sees only their own data, no cross-tenant leakage
 */
export function test_crossTenantIsolation_Query() {
  // Manual verification:
  // - Create two users with different tenantIds in Clerk
  // - Create tasks for each user
  // - Verify each user sees only their tasks
  // - Verify queries return empty array (not error) for other tenant's data
}

/**
 * TEST 5: Cross-Tenant Isolation - Mutation
 * AC #3
 *
 * Manual Test Procedure:
 * 1. Log in as User A (Tenant A)
 * 2. Create a task - verify tenantId is automatically set to Tenant A
 * 3. Note the task ID
 * 4. Log in as User B (Tenant B)
 * 5. Try to toggle or delete User A's task using the task ID
 * 6. Verify it throws "Unauthorized: Task belongs to different tenant"
 *
 * Expected Result: Users cannot modify other tenants' data
 */
export function test_crossTenantIsolation_Mutation() {
  // Manual verification:
  // - User A creates task
  // - User B tries to modify User A's task
  // - Should get "Unauthorized" error
}

/**
 * TEST 6: TenantId Automatically Added to New Records
 * AC #3
 *
 * Manual Test Procedure:
 * 1. Log in as User A
 * 2. Create a new task via tasks.add()
 * 3. Check Convex dashboard data tab
 * 4. Verify the new task has tenantId field set to User A's tenantId
 *
 * Expected Result: TenantId is automatically included in all new records
 */
export function test_tenantIdAutomaticallyAdded() {
  // Manual verification:
  // - Create task via tasks.add({ text: "Test" })
  // - Check Convex dashboard
  // - Verify task record includes tenantId field matching user's tenant
}

/**
 * TEST 7: Composite Index Performance
 * AC #4
 *
 * Manual Test Procedure:
 * 1. Check Convex dashboard schema tab
 * 2. Verify composite indexes exist: by_tenant_and_email, by_tenant_and_stage, etc.
 * 3. Create 1000+ records across multiple tenants
 * 4. Run tenant-scoped query
 * 5. Verify query uses index (fast response time)
 *
 * Expected Result: Composite indexes improve query performance
 */
export function test_compositeIndexPerformance() {
  // Manual verification:
  // - Check schema.ts for composite indexes
  // - Verify indexes follow pattern: .index("by_tenant_and_X", ["tenantId", "X"])
  // - Test query performance with large datasets
}

/**
 * TEST 8: Users Current Query Uses RLS
 * AC #3
 *
 * Manual Test Procedure:
 * 1. Log in as User A
 * 2. Call users.current()
 * 3. Verify it returns User A's data
 * 4. Log in as User B
 * 5. Call users.current()
 * 6. Verify it returns User B's data (not User A)
 *
 * Expected Result: users.current uses getAuthUserWithTenant helper
 */
export function test_usersCurrentQueryUsesRLS() {
  // Manual verification:
  // - Call users.current() as different users
  // - Verify each user sees only their own data
}

/**
 * BUILD VERIFICATION TEST
 *
 * Manual Test Procedure:
 * 1. Run `turbo build --filter=@sunup/web`
 * 2. Verify build succeeds without errors
 * 3. Check for TypeScript errors
 * 4. Verify Convex functions deploy successfully
 *
 * Expected Result: All builds pass, no TypeScript or runtime errors
 */
export function test_buildVerification() {
  // Manual verification:
  // - Run: turbo build --filter=@sunup/web
  // - Check exit code: should be 0 (success)
  // - No TypeScript errors in console output
}

// ============================================
// FUTURE: Automated Tests (Story 1.11)
// ============================================

/**
 * Once Story 1.11 sets up Vitest, these manual tests will be converted to:
 *
 * ```typescript
 * import { describe, it, expect } from 'vitest';
 * import { ConvexTestProvider } from 'convex-test';
 *
 * describe('RLS Tests', () => {
 *   it('should isolate queries by tenantId', async () => {
 *     // Automated test code here
 *   });
 * });
 * ```
 */
