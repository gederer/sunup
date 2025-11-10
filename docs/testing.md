# Testing Documentation

**Story 1.6**: Setup Testing Infrastructure with Playwright and Vitest

## Overview

Sunup uses a comprehensive testing strategy with three layers:

1. **Unit Tests** (Vitest): Test individual functions, helpers, and business logic
2. **Integration Tests** (Vitest + Convex): Test Convex queries/mutations with database interactions
3. **End-to-End Tests** (Playwright): Test complete user workflows through the browser

**Coverage Target**: 95%+ for authentication and core business logic

---

## Quick Start

```bash
# Run unit/integration tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode (interactive)
pnpm test:e2e:ui

# Run E2E tests in debug mode
pnpm test:e2e:debug
```

---

## Unit Testing with Vitest

### Configuration

- **Config File**: `vitest.config.ts`
- **Test Location**: `packages/convex/tests/`
- **File Pattern**: `*.test.ts` or `*.spec.ts`
- **Coverage**: 95%+ threshold for auth system components

### Writing Unit Tests

#### Testing Convex Helper Functions

```typescript
// packages/convex/lib/permissions.test.ts
import { describe, it, expect } from 'vitest'
import { hasPermission, hasAnyRole } from './permissions'

describe('hasPermission', () => {
  it('should return true when user has required permission', () => {
    const user = {
      roles: ['System Administrator']
    }
    expect(hasPermission(user, 'user:create')).toBe(true)
  })

  it('should return false when user lacks permission', () => {
    const user = {
      roles: ['Setter']
    }
    expect(hasPermission(user, 'user:create')).toBe(false)
  })
})

describe('hasAnyRole', () => {
  it('should return true when user has at least one role', () => {
    const user = { roles: ['Setter', 'Consultant'] }
    expect(hasAnyRole(user, ['Setter', 'Sales Manager'])).toBe(true)
  })

  it('should return false when user has no matching roles', () => {
    const user = { roles: ['Setter'] }
    expect(hasAnyRole(user, ['Recruiter', 'Trainer'])).toBe(false)
  })
})
```

#### Testing Row-Level Security (RLS) Helpers

```typescript
// packages/convex/lib/rls.test.ts
import { describe, it, expect } from 'vitest'

describe('Row-Level Security', () => {
  it('should enforce tenant isolation in queries', () => {
    // TODO: Implement with Convex test utilities
    // Test that queries only return data for authenticated user's tenant
  })

  it('should throw error when querying without authentication', () => {
    // TODO: Implement with Convex test utilities
    // Test that unauthenticated queries are rejected
  })
})
```

---

## Integration Testing with Convex

### Testing Convex Queries and Mutations

Integration tests verify that Convex queries and mutations work correctly with the database.

```typescript
// packages/convex/tests/users.integration.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
// TODO: Import Convex test utilities when available

describe('users.current', () => {
  it('should return null for unauthenticated users', async () => {
    // TODO: Set up test environment
    // const result = await ctx.run(api.users.current, {})
    // expect(result).toBeNull()
  })

  it('should return user with tenant and roles', async () => {
    // TODO: Set up authenticated test context
    // const user = await ctx.run(api.users.current, {})
    // expect(user).toHaveProperty('tenantId')
    // expect(user).toHaveProperty('roles')
  })
})

describe('invitations.createUser', () => {
  it('should create user with assigned roles', async () => {
    // TODO: Set up admin test context
    // const userId = await ctx.run(api.invitations.createUser, {
    //   email: 'test@example.com',
    //   firstName: 'Test',
    //   lastName: 'User',
    //   tenantId: testTenantId,
    //   roles: ['Setter']
    // })
    // expect(userId).toBeDefined()
  })

  it('should enforce permission checks', async () => {
    // TODO: Set up non-admin test context
    // await expect(
    //   ctx.run(api.invitations.createUser, {...})
    // ).rejects.toThrow('Insufficient permissions')
  })
})
```

### Testing Multi-Tenant Isolation

```typescript
describe('Multi-Tenant Isolation', () => {
  it('should not leak data across tenants', async () => {
    // TODO: Set up two tenants with data
    // 1. Create data in tenant A
    // 2. Query as user from tenant B
    // 3. Verify tenant B user cannot see tenant A data
  })
})
```

---

## End-to-End Testing with Playwright

### Configuration

- **Config File**: `playwright.config.ts`
- **Test Location**: `apps/web/tests/e2e/`
- **File Pattern**: `*.spec.ts`
- **Browsers**: Chromium (can add Firefox, WebKit)

### Writing E2E Tests

#### Testing Authentication Flows

```typescript
// apps/web/tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('unauthenticated user sees sign-in button', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('magic link authentication', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('/login')

    // 2. Enter email
    await page.getByLabel('Email').fill('test@example.com')

    // 3. Submit form
    await page.getByRole('button', { name: /send/i }).click()

    // 4. Wait for success message
    await expect(page.getByText(/check your email/i)).toBeVisible()

    // TODO: Handle magic link retrieval and verification
  })

  test('authenticated user can access profile', async ({ page }) => {
    // TODO: Set up authenticated context
    await page.goto('/profile')

    // Verify user info displayed
    await expect(page.getByText(/signed in as/i)).toBeVisible()
  })
})
```

#### Testing Protected Routes

```typescript
// apps/web/tests/e2e/routes.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Protected Routes', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/profile')

    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })

  test('admin can access admin routes', async ({ page }) => {
    // TODO: Set up admin authenticated context
    await page.goto('/admin/users')

    // Verify admin page loaded
    await expect(page.getByRole('heading', { name: /user management/i })).toBeVisible()
  })

  test('non-admin cannot access admin routes', async ({ page }) => {
    // TODO: Set up non-admin authenticated context
    await page.goto('/admin/users')

    // Verify access denied
    await expect(page.getByText(/access denied/i)).toBeVisible()
  })
})
```

#### Testing User Workflows

```typescript
// apps/web/tests/e2e/admin-create-user.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Admin User Creation', () => {
  test('admin can create new user', async ({ page }) => {
    // TODO: Set up admin authenticated context
    await page.goto('/admin/users/create')

    // Fill form
    await page.getByLabel('First Name').fill('John')
    await page.getByLabel('Last Name').fill('Doe')
    await page.getByLabel('Email').fill('john@example.com')

    // Select role
    await page.getByText('Setter').click()

    // Submit
    await page.getByRole('button', { name: /create user/i }).click()

    // Verify success
    await expect(page.getByText(/user.*created successfully/i)).toBeVisible()
  })
})
```

---

## Test Organization

```
sunup/
├── packages/convex/tests/          # Unit & integration tests
│   ├── users.test.ts
│   ├── permissions.test.ts
│   ├── rls.test.ts
│   └── invitations.test.ts
│
├── apps/web/tests/e2e/             # E2E tests
│   ├── auth.spec.ts                # Authentication flows
│   ├── routes.spec.ts              # Route protection
│   └── admin-create-user.spec.ts   # Admin workflows
│
├── vitest.config.ts                # Vitest configuration
├── playwright.config.ts            # Playwright configuration
└── coverage/                       # Coverage reports (gitignored)
```

---

## Coverage Reporting

### Generating Coverage Reports

```bash
# Run tests with coverage
pnpm test:coverage

# Open coverage report in browser
open coverage/index.html
```

### Coverage Thresholds

The project enforces 95%+ coverage for core components:

```typescript
// vitest.config.ts
coverage: {
  thresholds: {
    lines: 95,
    functions: 95,
    branches: 95,
    statements: 95,
  },
}
```

### Coverage Focus Areas

**High Priority** (95%+ required):
- Authentication helpers (`packages/convex/lib/auth.ts`)
- Permission system (`packages/convex/lib/permissions.ts`)
- RLS helpers (`packages/convex/lib/rls.ts`)
- User management (`packages/convex/users.ts`, `packages/convex/invitations.ts`)

**Medium Priority** (80%+ target):
- API routes
- Middleware
- UI components

**Low Priority** (no minimum):
- Configuration files
- Type definitions
- Generated code

---

## Testing Best Practices

### 1. Test Naming Conventions

Use descriptive test names that explain the behavior:

```typescript
// ✅ Good
it('should return null when user is not authenticated')
it('should enforce tenant isolation in queries')
it('should throw error when creating user without admin permission')

// ❌ Bad
it('works')
it('test user creation')
it('returns data')
```

### 2. Arrange-Act-Assert Pattern

Structure tests clearly:

```typescript
it('should create user with assigned roles', async () => {
  // Arrange: Set up test data
  const testUser = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: ['Setter']
  }

  // Act: Execute the function
  const userId = await createUser(testUser)

  // Assert: Verify the result
  expect(userId).toBeDefined()
  expect(userId.length).toBeGreaterThan(0)
})
```

### 3. Isolation and Independence

Each test should be independent:

```typescript
describe('User Management', () => {
  beforeEach(async () => {
    // Set up clean state for each test
    await clearTestDatabase()
    await seedTestData()
  })

  afterEach(async () => {
    // Clean up after each test
    await clearTestDatabase()
  })

  it('test 1', () => { /* ... */ })
  it('test 2', () => { /* ... */ })
})
```

### 4. Test User Setup

Create dedicated test users for different roles:

```typescript
// Test user fixtures
const TEST_USERS = {
  admin: {
    email: 'admin@test.sunup.dev',
    roles: ['System Administrator']
  },
  setter: {
    email: 'setter@test.sunup.dev',
    roles: ['Setter']
  },
  consultant: {
    email: 'consultant@test.sunup.dev',
    roles: ['Consultant']
  }
}
```

### 5. Mocking External Services

Mock external services to avoid dependencies:

```typescript
// Mock email service for magic link tests
vi.mock('./lib/email', () => ({
  sendMagicLink: vi.fn().mockResolvedValue({ success: true })
}))
```

---

## CI/CD Integration

### GitHub Actions (Story 1.11)

Tests will run automatically on:
- Pull requests (all tests)
- Push to main (all tests + coverage)

```yaml
# .github/workflows/test.yml (Future)
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:coverage
      - run: pnpm test:e2e
```

---

## Troubleshooting

### Vitest Issues

**Problem**: Tests not found
```bash
# Verify vitest can find tests
pnpm vitest list
```

**Problem**: Coverage thresholds not met
```bash
# Check coverage report for uncovered lines
pnpm test:coverage
open coverage/index.html
```

### Playwright Issues

**Problem**: Browser not installed
```bash
# Install browsers
npx playwright install chromium
```

**Problem**: Server not starting
```bash
# Check if port 3000 is available
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

**Problem**: Tests timeout
- Increase timeout in `playwright.config.ts`
- Check if Convex dev server is running
- Verify database has test data

---

## Next Steps

### Phase 3: Implement Comprehensive Tests

After completing Story 1.6 infrastructure setup, Phase 3 will implement:

1. **Unit Tests** for authentication system:
   - Permission helpers (`hasPermission`, `requirePermission`, etc.)
   - RLS helpers (`getAuthUserWithTenant`, etc.)
   - User management functions

2. **Integration Tests** for Convex:
   - User creation with role assignment
   - Permission enforcement in mutations
   - Multi-tenant data isolation

3. **E2E Tests** for user workflows:
   - Magic link authentication flow
   - Protected route access
   - Admin user creation workflow
   - Sign-out functionality

**Target**: 95%+ coverage for authentication system

---

## Testing Debt Resolution

### Background

During implementation of Stories 1.3-1.5 (Convex initialization, RLS foundation, better-auth integration), testing infrastructure did not yet exist (Story 1.6). Business logic was implemented in `invitations.ts` (user management) and `tasks.ts` (RLS examples) without accompanying tests.

After Story 1.6 completed and testing infrastructure was established, a technical debt audit revealed **356 lines of untested business logic** across these two security-critical files.

### Story 1.6.5: Address Testing Debt

**Created**: 2025-11-09 (Sprint Change Proposal approved)
**Priority**: HIGH - Must complete before Story 1.7 (RBAC)

**Rationale**: Story 1.7 implements 12-role RBAC that depends on user/role management from Story 1.5. Building complex RBAC on untested user management creates exponential technical debt risk.

**Scope**:
- `packages/convex/invitations.ts` (281 lines, 4 mutations):
  - `createUser`: Permission checks, multi-tenant validation, role assignment
  - `listUsers`: RLS filtering (System Admin sees all, others see own tenant)
  - `setUserActiveStatus`: User activation/deactivation with permission checks
  - `updateUserRole`: Add/remove roles with validation logic

- `packages/convex/tasks.ts` (75 lines, 4 endpoints):
  - `list`: Tenant-scoped task listing with RLS
  - `add`: Task creation with automatic tenantId assignment
  - `toggle`: Task update with cross-tenant security verification
  - `remove`: Task deletion with security checks

**Success Criteria**: >95% coverage for both files, all existing tests remain passing (79 tests)

### Lessons Learned

**Root Cause**: The "chicken and egg" problem - testing infrastructure (Story 1.6) couldn't be implemented until after some foundational code (Stories 1.3-1.5) existed, but that foundational code then lacked tests.

**Prevention**: Going forward, follow these patterns to prevent technical debt accumulation.

---

## Test-First vs Test-After: When to Use Each

### Test-First (Preferred for Most Cases)

**When to Use**:
- ✅ Building on tested foundation (Stories 1.7+)
- ✅ Implementing complex business logic
- ✅ Adding mutations with security/permission checks
- ✅ Creating queries with RLS enforcement
- ✅ Refactoring existing code

**Benefits**:
- Clarifies requirements before writing code
- Catches edge cases early
- Prevents technical debt accumulation
- Provides confidence during refactoring

**Example Pattern**:
```typescript
// 1. Write failing test first
describe('createOrder mutation', () => {
  it('should enforce user has "Sales Manager" role', async () => {
    // Test fails initially (mutation doesn't exist yet)
    await expect(createOrder(ctx, args)).rejects.toThrow('Forbidden')
  })
})

// 2. Implement mutation to make test pass
export const createOrder = mutation({
  handler: async (ctx, args) => {
    await requireRole(ctx, ['Sales Manager'])
    // ... implementation
  }
})
```

### Test-After (Acceptable for Infrastructure)

**When to Use**:
- ⚠️ Setting up infrastructure/configuration (Story 1.1, 1.2, 1.6)
- ⚠️ Initial scaffolding before testing infrastructure exists
- ⚠️ Prototyping/exploration (must be followed by test writing)

**Requirements**:
- **MUST** write tests immediately after infrastructure is ready
- **MUST** achieve >95% coverage before building dependent features
- **MUST** document technical debt if tests are deferred

**Example** (Story 1.6.5):
```typescript
// invitations.ts implemented in Story 1.5 (before testing infrastructure)
// Story 1.6 established testing infrastructure
// Story 1.6.5 retroactively adds tests before Story 1.7 (RBAC) proceeds
```

### Critical Decision Point: Story 1.7 and Beyond

**Rule**: All future stories (1.7+) MUST use Test-First approach.

**Rationale**:
- Testing infrastructure exists (Story 1.6 ✅)
- Test patterns established (auth.test.ts, permissions.test.ts ✅)
- Technical debt resolved (Story 1.6.5 🔄)

**Enforcement**: Story acceptance criteria must include "Unit tests written before implementation" where applicable.

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Convex Testing Guide](https://docs.convex.dev/testing) (when available)
- [better-auth Testing](https://www.better-auth.com/docs/testing) (if available)

---

**Story 1.6 Complete**: Testing infrastructure configured ✅
**Next**: Phase 3 - Write comprehensive tests for auth system
