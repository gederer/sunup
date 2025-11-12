# Sprint Change Proposal
**Date**: 2025-11-12
**Project**: Sunup
**Epic**: Epic 1 - Foundation & Infrastructure
**Triggering Story**: Story 1.6.5 - Address Testing Debt from User Management
**Workflow**: `/bmad:bmm:workflows:correct-course`

---

## Section 1: Issue Summary

### Problem Statement

During Story 1.6.5 implementation (testing debt for user management), comprehensive research into the Convex Better Auth integration revealed critical capability gaps. The **Organization and Admin plugins** from better-auth, which are **required for multi-tenant architecture with 12-role RBAC**, are **not supported** in the Convex Better Auth integration (`@convex-dev/better-auth@0.9.7`).

### Context

**When Discovered**: 2025-11-12, during Story 1.6.5 implementation
**Discovered By**: Development team during better-auth integration research
**Current State**: Story 1.5 completed a Clerk → better-auth migration (Nov 9, 2025) in 5 phases

### Evidence

1. **Technical Constraint**: Convex Better Auth adapter lacks Organization and Admin plugin support
2. **Feature Requirements**: Multi-tenant user management requires Organization plugin capabilities
3. **RBAC Requirements**: 12-role permission system requires Admin plugin features
4. **PRD Alignment**: Original PRD (FR005) explicitly specifies "Clerk" for authentication
5. **Migration History**:
   - Story 1.5 originally specified Clerk integration
   - Nov 8: Completed initial Clerk implementation
   - Nov 9: Migrated Clerk → better-auth via correct-course workflow
   - Nov 12: Research reveals better-auth limitations, proposing reversion

### Impact on Current Sprint

- **Story 1.6.5**: 123 tests completed but will be lost in reversion (tests written for better-auth)
- **Story 1.7**: Blocked - cannot implement RBAC without stable auth system
- **Epic 1**: Cannot be completed until auth system is finalized

---

## Section 2: Impact Analysis

### Epic Impact

**Epic 1: Foundation & Infrastructure**
- ❌ **Blocked**: Cannot complete until auth system stabilized
- **Affected Stories**:
  - Story 1.5: Requires status update (done → needs reversion documentation)
  - Story 1.6.5: Status change (done → backlog, work will be lost)
  - Story 1.7: Blocked until Clerk reversion complete
- **Timeline Impact**: +1-2 days to redo Story 1.6.5 after reversion

**Epic 2-6: All Future Epics**
- ⚠️ **Blocked**: All epics depend on stable authentication
- No direct changes required, but all blocked until Epic 1 complete

### Story Impact

**Story 1.5: Integrate Clerk Authentication**
- Status: done (remains done, but with reversion note)
- Changes Required:
  - Add reversion documentation
  - Update acceptance criteria back to Clerk scope
  - Document migration attempt and decision to revert

**Story 1.6.5: Address Testing Debt**
- Status: done → **backlog**
- **Work Lost**:
  - tests/tasks.test.ts (20 tests)
  - tests/invitations.test.ts (24 tests)
  - tests/permissions.test.ts (79 tests)
  - lib/invitations.ts (better-auth implementation)
  - lib/permissions.ts (better-auth implementation)
- **Work Preserved**:
  - lib/tasks.ts (auth-agnostic)
  - Vitest configuration patterns
  - Test coverage approach (>90% thresholds)
- Must be redone after Clerk stabilizes

**Story 1.7: Implement RBAC for 12 Roles**
- Status: backlog (unchanged)
- Blocked until Clerk reversion complete

### Artifact Conflicts

**PRD (docs/PRD.md)**
- ✅ **No Conflicts**: PRD explicitly specifies Clerk (FR005)
- Reversion **aligns with original product requirements**

**Architecture (docs/architecture.md)**
- ❌ **Conflicts Found**: Document updated to better-auth during migration
- **Sections Requiring Update**:
  - Line 25: Technology stack list
  - Line 39: Tech stack table
  - Lines 174, 210, 245-246: Authentication sections
  - Integration patterns and flow descriptions

**UI/UX Specifications**
- ✅ **No Conflicts**: No dedicated UI/UX spec documents
- UI code will be restored via git revert

**Documentation**
- `docs/better-auth-integration.md`: DELETE (created during migration)
- `docs/clerk-integration.md`: RESTORE (from git revert)
- `README.md`: Verify Clerk docs link exists

### Technical Impact

**Code Changes (via Git Revert)**
- **Revert 3 commits**:
  - `1147163`: Phase 3 - Authorization with permission helpers
  - `b39f874`: Phase 2 - Install better-auth with Admin plugin
  - `22c6251`: Phase 1 - Remove Clerk authentication
- **Files Restored**: All Clerk implementation files
- **Files Deleted**: All better-auth specific code
- **Schema Changes**: `authId` → `clerkId` (automatic via revert)

**Package Dependencies**
- **Removed**: `better-auth@1.3.34`, `@convex-dev/better-auth@0.9.7`, `@better-auth/expo@1.3.34`
- **Restored**: `@clerk/nextjs@6.34.0`, `@clerk/backend`

**Database Schema**
- Field rename: `authId` → `clerkId` (handled by git revert)
- Index updates: `by_auth_id` → `by_clerk_id` (handled by git revert)

**Infrastructure**
- Environment variables: Restore `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Webhooks: Clerk webhook endpoint (already configured)

---

## Section 3: Recommended Approach

### Selected Path: **Option 1 - Git Revert (Direct Adjustment)**

**Decision**: Revert the 3-commit better-auth migration and return to Clerk implementation.

### Rationale

**Strategic Alignment**
1. ✅ **PRD Compliance**: Original product spec explicitly calls for Clerk (FR005)
2. ✅ **Feature Completeness**: Clerk provides all required Organization and Admin capabilities
3. ✅ **Proven Approach**: Clerk integration was working before migration attempt

**Technical Feasibility**
1. ✅ **Clean Reversion**: Git revert provides clean rollback mechanism
2. ✅ **Known State**: Returning to previously working implementation
3. ✅ **Full Feature Set**: Clerk has all multi-tenant RBAC features needed

**Risk Assessment**
1. ✅ **Low Risk**: Returning to known-working state vs. new implementation
2. ✅ **Fast Timeline**: 3 git reverts vs. weeks of new development
3. ✅ **Team Momentum**: Quick resolution allows Epic 1 completion

**Trade-offs Accepted**
1. ⚠️ **Lost Work**: Story 1.6.5 testing work (123 tests) deleted in revert
2. ⚠️ **Rework Required**: Story 1.6.5 must be redone with Clerk patterns
3. ⚠️ **Documentation**: better-auth integration docs (500+ lines) discarded

### Effort Estimate

**Git Revert Operations**: 30 minutes
- Execute 3 git revert commands
- Run `pnpm install` to restore packages
- Verify environment variables

**Documentation Updates**: 1 hour
- Update architecture.md (4 sections)
- Update Story 1.5 with reversion notes
- Update Story 1.6.5 status to backlog
- Delete better-auth docs, verify Clerk docs

**Testing & Verification**: 1 hour
- Manual auth flow testing
- Verify Clerk webhooks working
- Confirm protected routes functional

**Story 1.6.5 Redo**: 1-2 days
- Re-implement test helpers for Clerk
- Adapt test patterns from better-auth version
- Achieve >90% coverage target

**Total Timeline Impact**: +2-3 days

### Risk Level: **LOW**

**Mitigation Factors**:
- Returning to previously working implementation
- Full git history preserved for audit trail
- Clerk documentation already exists
- Team familiar with Clerk integration

---

## Section 4: Detailed Change Proposals

### Change Group A: Git Operations

#### Proposal A1: Revert Migration Commits

**Type**: Git Revert
**Affected**: Multiple files (all migration changes)

**Commands**:
```bash
git revert 1147163 --no-edit  # Revert Phase 3 (authorization)
git revert b39f874 --no-edit  # Revert Phase 2 (better-auth install)
git revert 22c6251 --no-edit  # Revert Phase 1 (Clerk removal)
pnpm install                   # Restore Clerk packages
```

**Impact**:
- ✅ Restores: All Clerk code, packages, middleware
- ✅ Removes: better-auth packages and integration code
- ✅ Reverts: Schema changes (authId → clerkId)
- ❌ Deletes: Story 1.6.5 test files

**Justification**: Clean reversion using git history, preserves audit trail

---

### Change Group B: Documentation Updates

#### Proposal B1: Update Architecture Document

**File**: `docs/architecture.md`

**Change B1a - Technology Stack (Line 25)**

```diff
- better-auth 1.3.34 (passwordless authentication with 12-role RBAC)
+ Clerk 6.34.0 (authentication with 12-role RBAC)
```

**Change B1b - Tech Stack Table (Line 39)**

```diff
- | **Authentication** | better-auth | 1.3.34 | Epic 1 | Magic link passwordless auth, Admin plugin with 12-role RBAC, multi-tenant support |
+ | **Authentication** | Clerk | 6.34.0 | Epic 1 | OAuth2, passwordless, MFA support, webhook-based user sync, multi-tenant support via metadata |
```

**Change B1c - Authentication Section (Lines 210, 245-246)**

```diff
- **Authentication:** better-auth 1.3.34 with @convex-dev/better-auth 0.9.7
+ **Authentication:** Clerk 6.34.0 with Convex integration

- **better-auth ↔ Convex:**
- better-auth stores sessions in Convex via @convex-dev/better-auth adapter
+ **Clerk ↔ Convex:**
+ Clerk webhooks sync user data to Convex
+ Session validation via Clerk JWT tokens
+ Multi-tenant isolation via tenantId in Clerk metadata
```

**Change B1d - Epic 1 Stack (Line 174)**

```diff
- | **Epic 1: Foundation & Infrastructure** | ... | Turborepo, Convex, better-auth, Vitest, Playwright, Sentry |
+ | **Epic 1: Foundation & Infrastructure** | ... | Turborepo, Convex, Clerk, Vitest, Playwright, Sentry |
```

**Justification**: Align architecture documentation with reverted authentication provider

---

#### Proposal B2: Update Story 1.5

**File**: `docs/stories/1-5-integrate-clerk-authentication.md`

**Change B2a - Title and Status**

```diff
- # Story 1.5: Integrate better-auth Authentication (Migration from Clerk)
+ # Story 1.5: Integrate Clerk Authentication
```

**Change B2b - Add Reversion Note**

```markdown
## Reversion Note

**Date**: 2025-11-12
**Decision**: Reverted better-auth migration, returned to Clerk

During Story 1.6.5 implementation, research revealed that Convex Better Auth integration
lacks support for Organization and Admin plugins required for multi-tenant RBAC.
Decision made via correct-course workflow to revert to Clerk as specified in original PRD.

**Commits Reverted**:
- 1147163: Phase 3 - Implement 12-role authorization with permission helpers
- b39f874: Phase 2 - Install and configure better-auth with Admin plugin
- 22c6251: Phase 1 - Remove Clerk authentication system

**See**: Sprint Change Proposal (docs/sprint-change-proposal-2025-11-12.md)
```

**Change B2c - Restore Clerk Acceptance Criteria**

```diff
- ## Acceptance Criteria (Updated for better-auth)
+ ## Acceptance Criteria (Clerk - Original Scope)

- 1. ✅ better-auth installed and configured with Convex adapter (AC: #1)
+ 1. ✅ Clerk installed and configured with Next.js middleware (AC: #1)
- 2. ✅ Magic link authentication working for passwordless sign-in (AC: #2)
+ 2. ✅ Sign-in and sign-up flows working via Clerk components (AC: #2)
...
```

**Justification**: Document reversion decision and restore original Clerk scope

---

#### Proposal B3: Update Story 1.6.5 Status

**File**: `docs/stories/1-6-5-address-testing-debt-from-user-management.md`

**Change B3a - Add Reversion Impact Note**

```markdown
# Story 1.6.5: Address Testing Debt from User Management

Status: in-progress

## Reversion Impact Note

**Date**: 2025-11-12
**Status Change**: done → in-progress

This story was completed for better-auth implementation with 123 passing tests and >90% coverage.
However, due to the reversion to Clerk (Sprint Change Proposal 2025-11-12), all test files will
be deleted as part of git revert operations.

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
```

**Justification**: Document impact on completed testing work

---

**File**: `docs/sprint-status.yaml`

**Change B3b - Update Sprint Status**

```diff
- 1-6-5-address-testing-debt-from-user-management: done  # Tests for invitations.ts and tasks.ts - 123 tests passing with 90%+ coverage
+ 1-6-5-address-testing-debt-from-user-management: backlog  # Reverted due to auth system change - will redo with Clerk
```

**Justification**: Reflect that story needs to be redone

---

#### Proposal B4: Remove better-auth Documentation

**Action**: DELETE `docs/better-auth-integration.md`

**Justification**: Documentation no longer relevant after reversion, Clerk has own docs

---

#### Proposal B5: Verify Clerk Documentation Link

**File**: `README.md`

**Action**: Verify link exists after git revert:

```markdown
- [Clerk Integration](docs/clerk-integration.md) - Authentication setup and patterns
```

**Justification**: Ensure developers can find Clerk documentation

---

## Section 5: Implementation Handoff

### Change Scope Classification: **MINOR**

**Justification**:
- Clean git revert operation (low complexity)
- Documentation updates only
- No new feature development required
- Returns to known-working state

### Handoff Recipients

**Primary**: Development Team (Direct Implementation)

**Responsibilities**:
1. Execute git revert commands
2. Run `pnpm install` to restore packages
3. Update documentation files as specified
4. Manual testing of Clerk authentication flow
5. Verify environment variables configured
6. Confirm webhooks functioning

**Secondary**: Product Owner / Scrum Master

**Responsibilities**:
1. Update sprint tracking (Story 1.6.5 status)
2. Communicate timeline impact to stakeholders
3. Re-prioritize Story 1.6.5 in backlog

### Success Criteria

**Authentication System**:
- ✅ Clerk authentication flows working (sign-in, sign-up, sign-out)
- ✅ Protected routes enforcing authentication
- ✅ User profile page displaying Clerk data
- ✅ Webhooks syncing users to Convex
- ✅ Multi-tenant isolation via Clerk metadata

**Documentation**:
- ✅ Architecture.md reflects Clerk integration
- ✅ Story 1.5 documents reversion decision
- ✅ Story 1.6.5 status reflects incomplete state
- ✅ better-auth docs removed
- ✅ Clerk docs linked in README

**Testing**:
- ✅ Manual authentication testing complete
- ✅ Story 1.6.5 re-prioritized in backlog
- ✅ Test approach documented for redo

### Timeline

**Immediate** (Same Day):
- Execute git revert operations
- Update documentation files
- Manual testing verification

**Next Sprint**:
- Re-implement Story 1.6.5 with Clerk patterns
- Target: 2-3 days for completion

---

## Appendix: Files Modified Summary

### Git Revert Will Affect

**Restored** (Clerk Implementation):
- `apps/web/middleware.ts` (Clerk middleware)
- `apps/web/app/layout.tsx` (ClerkProvider)
- `apps/web/components/ConvexClientProvider.tsx` (Clerk integration)
- `apps/web/app/login/page.tsx` (Clerk login UI)
- `apps/web/app/profile/page.tsx` (Clerk profile)
- `packages/convex/users.ts` (Clerk webhook handlers)
- `packages/convex/schema.ts` (clerkId field)
- `packages/convex/lib/auth.ts` (Clerk auth helpers)
- `package.json` (Clerk dependencies)

**Deleted** (better-auth Implementation):
- `packages/convex/auth.ts`
- `packages/convex/auth/permissions.ts`
- `packages/convex/lib/permissions.ts`
- `packages/convex/lib/invitations.ts` (better-auth version)
- `apps/web/lib/auth-client.ts`
- `apps/web/app/admin/users/create/page.tsx`
- `apps/web/app/admin/users/page.tsx`
- `packages/convex/tests/permissions.test.ts`
- `packages/convex/tests/invitations.test.ts`
- `packages/convex/tests/tasks.test.ts`

### Manual Documentation Updates Required

- `docs/architecture.md` (4 sections)
- `docs/stories/1-5-integrate-clerk-authentication.md` (title, reversion note, AC)
- `docs/stories/1-6-5-address-testing-debt-from-user-management.md` (reversion impact)
- `docs/sprint-status.yaml` (Story 1.6.5 status)
- `docs/better-auth-integration.md` (DELETE)

---

**End of Sprint Change Proposal**
