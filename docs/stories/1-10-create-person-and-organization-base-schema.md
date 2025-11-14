# Story 1.10: Create Person and Organization Base Schema

Status: review

## Story

As a Developer,
I want Person and Organization data models with tenant isolation and basic fields,
So that subsequent epics can build CRM functionality on this foundation.

## Acceptance Criteria

1. `persons` table with fields: tenantId, firstName, lastName, email, phone, currentPipelineStage, organizationId ✅ **COMPLETE** (Story 1.8)
2. `organizations` table with fields: tenantId, name, address, primaryContactId ✅ **SCHEMA COMPLETE** (Story 1.8), **CRUD OPERATIONS REQUIRED**
3. Composite indexes: `(tenantId, email)`, `(tenantId, organizationId)` ✅ **COMPLETE** (Story 1.8)
4. CRUD mutations with tenantId enforcement:
   - ✅ `createPerson`, `updatePerson`, `deletePerson` **COMPLETE** (Story 1.8)
   - ❌ `createOrganization`, `updateOrganization`, `deleteOrganization` **REQUIRED**
5. Query functions:
   - ✅ `getPersonById`, `listPersonsByTenant`, `getPersonsByOrganization` **COMPLETE** (Story 1.8)
   - ❌ `getOrganizationById`, `listOrganizationsByTenant` **REQUIRED**
6. Validation: Email format, required fields ✅ **PERSONS COMPLETE** (Story 1.8), **ORGANIZATIONS VALIDATION REQUIRED**
7. Sample data seeded for testing (10 persons, 3 organizations) ✅ **COMPLETE** (Story 1.8 - seedPipelineData.ts)

**Implementation Scope:** This story focuses on creating `packages/convex/organizations.ts` with full CRUD operations and validation, completing the CRM foundation started in Story 1.8.

## Tasks / Subtasks

- [x] Create `packages/convex/organizations.ts` file (AC: #2, #4, #5, #6)
  - [x] Implement `createOrganization` mutation with validation
    - [x] Validate required fields (name, type, billingAddress)
    - [x] Validate billingAddress structure (street, city, state, zipCode, country all present)
    - [x] Enforce tenantId isolation
    - [x] Validate primaryContactPersonId if provided (must belong to tenant)
  - [x] Implement `updateOrganization` mutation with validation
    - [x] Verify organization belongs to current tenant
    - [x] Validate updated fields (name, billingAddress structure)
    - [x] Validate primaryContactPersonId if provided
    - [x] Apply partial updates only for provided fields
  - [x] Implement `deleteOrganization` mutation
    - [x] Verify organization belongs to current tenant
    - [x] Check for dependent records (people, projects) and handle appropriately
    - [x] Perform deletion with proper error handling

- [x] Implement query functions for organizations (AC: #5)
  - [x] `getOrganizationById` query
    - [x] Validate organization belongs to current tenant
    - [x] Return null if not found or wrong tenant
  - [x] `listOrganizationsByTenant` query
    - [x] Support pagination (limit parameter, default: 50, max: 100)
    - [x] Filter by organization type (optional parameter)
    - [x] Return all organizations for current tenant

- [x] Write comprehensive tests for organizations (AC: all)
  - [x] Test `createOrganization` mutation
    - [x] Test successful creation with valid data
    - [x] Test validation: required fields (name, type, billingAddress)
    - [x] Test validation: billingAddress structure completeness
    - [x] Test validation: invalid primaryContactPersonId
    - [x] Test multi-tenant isolation (cannot create for another tenant)
  - [x] Test `updateOrganization` mutation
    - [x] Test successful update with partial fields
    - [x] Test validation: cannot update non-existent organization
    - [x] Test validation: cannot update organization from another tenant
    - [x] Test validation: invalid primaryContactPersonId
  - [x] Test `deleteOrganization` mutation
    - [x] Test successful deletion
    - [x] Test validation: cannot delete non-existent organization
    - [x] Test validation: cannot delete organization from another tenant
  - [x] Test query functions
    - [x] Test `getOrganizationById` with valid ID
    - [x] Test `getOrganizationById` with invalid ID (returns null)
    - [x] Test `getOrganizationById` with other tenant's ID (returns null)
    - [x] Test `listOrganizationsByTenant` returns correct results
    - [x] Test `listOrganizationsByTenant` with type filter
    - [x] Test `listOrganizationsByTenant` respects limit parameter

- [x] Verify integration with existing persons functionality (AC: #4, #5)
  - [x] Test `createPerson` with valid organizationId
  - [x] Test `getPersonsByOrganization` query
  - [x] Test organization update doesn't break person relationships
  - [x] Test organization deletion handling with associated persons

- [x] Verify sample data seeding still works (AC: #7)
  - [x] Confirm `seedPipelineData.ts` creates 3 organizations
  - [x] Confirm `seedPipelineData.ts` creates 10 persons (3 with org associations)
  - [x] Test seeding can be run successfully end-to-end

## Dev Notes

### Learnings from Previous Story

**From Story 1-9-implement-event-system-for-pipeline-status-changes (Status: done)**

- **Event System Created**:
  - `personPipelineEvents` table with full RLS and indexing
  - `lib/events.ts` - emitPipelineEvent function with type-safe payload
  - `lib/eventHandlers.ts` - EventHandlerRegistry subscription pattern
  - Events integrated into `movePersonToStage` mutation with error handling

- **Testing Patterns**:
  - Use `t.withIdentity({ subject: "test_clerk_user" })` for authentication in tests
  - Integration tests verify end-to-end flows
  - Comprehensive test suites validate individual functions
  - All 18 tests passing (11 comprehensive + 1 integration + 6 pipeline)

- **Key Files from Story 1.9**:
  - Created: `lib/events.ts`, `lib/eventHandlers.ts`, `tests/events.test.ts`, `tests/events-integration.test.ts`, `docs/event-system.md`
  - Modified: `schema.ts` (lines 374-390), `pipeline.ts` (lines 19, 400-412)

- **RLS Pattern**: Always use `getAuthUserWithTenant(ctx)` helper for tenantId validation
- **Error Handling**: Wrap non-critical operations in try/catch to prevent blocking main mutations
- **Schema Pattern**: Include tenantId, composite indexes `(tenantId, otherField)`, use `v.id("tableName")` for foreign keys

[Source: stories/1-9-implement-event-system-for-pipeline-status-changes.md#Dev-Agent-Record]

### Architecture Context

**Current CRM Foundation (from Story 1.8):**
- **Schema**: `people` and `organizations` tables already exist in schema.ts
  - `people` table: lines 46-62 (firstName, lastName, email, phone, currentPipelineStage, organizationId, tenantId)
  - `organizations` table: lines 18-41 (name, type, taxId, billingAddress, primaryContactPersonId, tenantId)
  - Composite indexes already configured for efficient tenant-scoped queries

- **Existing CRUD Operations**: `packages/convex/persons.ts` (7 functions)
  - Mutations: `createPerson`, `updatePerson`, `deletePerson` (with full validation)
  - Queries: `getPersonById`, `listPersonsByTenant`, `getPersonsByOrganization`, `searchPersons`
  - Email validation pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - Tenant isolation enforced throughout

- **Existing Seeding**: `packages/convex/seedPipelineData.ts`
  - Creates 6 default pipeline stages (Lead → Set → Met → QMet → Sale → Installation)
  - Creates 3 sample organizations (2 Residential, 1 Nonprofit)
  - Creates 10 sample persons across different pipeline stages
  - Initializes pipeline history for all persons

**What's Missing (Story 1.10 Scope):**
- `packages/convex/organizations.ts` with CRUD operations and queries
- Validation functions for organization data (name, type, billingAddress)
- Tests for organization CRUD operations

**Multi-Tenant Considerations:**
- All organizations must include tenantId (enforced by schema)
- Organization queries must filter by tenantId (RLS)
- Organization CRUD must validate tenant context via `getAuthUserWithTenant(ctx)`
- primaryContactPersonId must be validated to belong to same tenant

**Validation Requirements:**
- **Required fields**: name, type, billingAddress (with street, city, state, zipCode, country)
- **Optional fields**: taxId (for non-residential), primaryContactPersonId
- **Type validation**: Must be one of "Residential", "Commercial", "Nonprofit", "Government", "Educational"
- **Address validation**: Ensure all billingAddress fields are present and non-empty strings

### Project Structure Notes

**Files to Create:**
- `packages/convex/organizations.ts` - Organization CRUD operations and queries

**Files to Reference:**
- `packages/convex/persons.ts` - Pattern reference for CRUD operations, validation, and tenant isolation
- `packages/convex/schema.ts` - Lines 18-41 for organizations table definition
- `packages/convex/lib/auth.ts` - `getAuthUserWithTenant(ctx)` helper for RLS enforcement
- `packages/convex/seedPipelineData.ts` - Lines 100-150 for organization seeding examples

**Files to Modify:**
- None - All required schema and seeding already exists

**Testing:**
- Create `packages/convex/tests/organizations.test.ts` for organization tests
- Follow patterns from `packages/convex/tests/pipeline.test.ts` and `packages/convex/tests/events.test.ts`
- Use `t.withIdentity({ subject: "test_clerk_user" })` for authenticated test contexts
- Aim for comprehensive coverage similar to persons.ts (7 functions × ~3 tests each = ~21 tests)

### Implementation Patterns to Follow

**From persons.ts (packages/convex/persons.ts):**
1. **Validation Helper Functions**: Define validation helpers at top of file (e.g., `isValidEmail`, `isValidAddress`)
2. **Mutation Structure**:
   ```typescript
   export const mutationName = mutation({
     args: { /* validated args using v.* validators */ },
     handler: async (ctx, args) => {
       const { tenantId } = await getAuthUserWithTenant(ctx);
       // Validation logic
       // Business logic
       // Return result
     }
   });
   ```
3. **Query Structure**: Always validate tenantId, return null for not found/wrong tenant
4. **Error Messages**: Use clear, specific error messages (e.g., "Organization not found or access denied")
5. **Trimming**: Trim string inputs to prevent whitespace issues
6. **Documentation**: Include JSDoc comments explaining validation and business logic

**Multi-Tenant Validation Pattern:**
```typescript
// For foreign key validation (e.g., primaryContactPersonId)
if (args.primaryContactPersonId) {
  const person = await ctx.db.get(args.primaryContactPersonId);
  if (!person || person.tenantId !== tenantId) {
    throw new Error("Invalid person or access denied");
  }
}
```

### References

- [Source: docs/epics.md - Story 1.10 requirements (lines 276-292)]
- [Source: packages/convex/schema.ts - organizations table definition (lines 18-41)]
- [Source: packages/convex/schema.ts - people table definition (lines 46-62)]
- [Source: packages/convex/persons.ts - CRUD patterns and validation examples]
- [Source: packages/convex/seedPipelineData.ts - Organization seeding examples (lines 100-150)]
- [Source: packages/convex/lib/auth.ts - getAuthUserWithTenant RLS helper]
- [Source: stories/1-8-create-pipeline-data-model-and-schema.md - Pipeline and persons implementation]
- [Source: stories/1-9-implement-event-system-for-pipeline-status-changes.md - Testing patterns and RLS enforcement]

## Dev Agent Record

### Context Reference

- `docs/stories/1-10-create-person-and-organization-base-schema.context.xml` (generated 2025-11-14)

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Implementation Plan:**
1. Created `organizations.ts` following patterns from `persons.ts`
2. Implemented validation helper: `isValidBillingAddress()`
3. Implemented CRUD mutations: `createOrganization`, `updateOrganization`, `deleteOrganization`
4. Implemented query functions: `getOrganizationById`, `listOrganizationsByTenant`
5. Created comprehensive test suite with 29 test cases
6. Fixed 3 test failures related to invalid ID format validation
7. Verified all 129 tests pass across full test suite

**Key Implementation Details:**
- All mutations enforce tenant isolation via `getAuthUserWithTenant(ctx)`
- Billing address validation ensures all 5 required fields are present
- Primary contact person validation checks tenant ownership
- Query functions return null for not-found or wrong-tenant records
- List query supports type filtering and pagination (default 50, max 100)
- All string inputs are trimmed to prevent whitespace issues

### Completion Notes List

✅ **organizations.ts created** - Full CRUD operations with validation following persons.ts patterns
✅ **29 comprehensive tests** - All passing, covering CRUD operations, validation, and multi-tenant isolation
✅ **Integration verified** - Existing persons tests (6) and all other tests (129 total) passing
✅ **Seeding confirmed** - seedPipelineData.ts already creates 3 organizations and 10 persons
✅ **All acceptance criteria met** - Organizations CRUD operations complete CRM foundation from Story 1.8

### File List

**Created:**
- packages/convex/organizations.ts
- packages/convex/tests/organizations.test.ts

**Modified:**
- docs/stories/1-10-create-person-and-organization-base-schema.md (task completion, dev notes)
- docs/sprint-status.yaml (status: ready-for-dev → in-progress → review)

## Change Log

- 2025-11-14: Story drafted (create-story workflow) - Scope: Create organizations.ts with CRUD operations to complete CRM foundation from Story 1.8
- 2025-11-14: Story completed (dev-story workflow) - Created organizations.ts with 5 functions (3 mutations, 2 queries), 29 passing tests, all ACs satisfied
