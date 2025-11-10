import { describe, it, expect, vi } from 'vitest'
import type { Id } from '../_generated/dataModel'

/**
 * Users Query Integration Tests
 *
 * Tests for Convex users queries with authentication and RLS enforcement.
 *
 * Story 1.6: Setup Testing Infrastructure (Phase 3)
 * Story 1.4: Implement Multi-Tenant Row-Level Security (RLS) Foundation
 * Story 1.5: Integrate better-auth Authentication
 *
 * NOTE: These tests focus on the underlying helper functions rather than
 * the Convex query wrapper, as Convex queries require special test utilities.
 * The getAuthUserWithTenant helper (which users.current uses) is fully tested
 * in auth.test.ts, providing coverage of the core authentication logic.
 */

// Import the underlying auth helper that users.current depends on
const { getAuthUserWithTenant } = await import('../lib/auth')

// Mock types for Convex context
interface MockQueryCtx {
  auth: {
    getUserIdentity: () => Promise<{ subject: string } | null>
  }
  db: {
    query: (table: string) => MockQuery
  }
}

interface MockQuery {
  withIndex: (index: string, fn: (q: any) => any) => MockQuery
  first: () => Promise<any>
  collect: () => Promise<any[]>
}

// Test fixtures
const mockTenantId = 'tenant123' as Id<'tenants'>
const mockUserId = 'user123' as Id<'users'>
const mockAuthId = 'auth123'

const mockUser = {
  _id: mockUserId,
  _creationTime: Date.now(),
  authId: mockAuthId,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  isActive: true,
  tenantId: mockTenantId,
}

const mockUserRoles = [
  {
    _id: 'role1' as Id<'userRoles'>,
    _creationTime: Date.now(),
    userId: mockUserId,
    role: 'System Administrator',
    isActive: true,
    isPrimary: true,
  },
  {
    _id: 'role2' as Id<'userRoles'>,
    _creationTime: Date.now(),
    userId: mockUserId,
    role: 'Trainer',
    isActive: true,
    isPrimary: false,
  },
]

describe('users.current query logic', () => {
  it('should return user with roles when authenticated (via getAuthUserWithTenant)', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue({ subject: mockAuthId }),
      },
      db: {
        query: vi.fn((table: string) => {
          if (table === 'users') {
            return {
              withIndex: vi.fn(() => ({
                first: vi.fn().mockResolvedValue(mockUser),
              })),
            }
          } else if (table === 'userRoles') {
            return {
              withIndex: vi.fn(() => ({
                collect: vi.fn().mockResolvedValue(mockUserRoles),
              })),
            }
          }
          return {
            withIndex: vi.fn(() => ({
              first: vi.fn().mockResolvedValue(null),
              collect: vi.fn().mockResolvedValue([]),
            })),
          }
        }),
      },
    } as unknown as MockQueryCtx

    // users.current calls getAuthUserWithTenant
    const result = await getAuthUserWithTenant(ctx as any)

    // Should return user data with tenantId and roles
    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('tenantId', mockTenantId)
    expect(result).toHaveProperty('roles')
    expect(result.roles).toEqual(['System Administrator', 'Trainer'])
    expect(result.user._id).toBe(mockUserId)
    expect(result.user.email).toBe('test@example.com')

    // Verify auth was checked
    expect(ctx.auth.getUserIdentity).toHaveBeenCalled()
  })

  it('should throw "Unauthorized" when user is not authenticated', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue(null),
      },
      db: {
        query: vi.fn(),
      },
    } as unknown as MockQueryCtx

    // users.current calls getAuthUserWithTenant which should throw
    await expect(getAuthUserWithTenant(ctx as any)).rejects.toThrow('Unauthorized')

    expect(ctx.auth.getUserIdentity).toHaveBeenCalled()
    expect(ctx.db.query).not.toHaveBeenCalled()
  })

  it('should throw "User not found" when user does not exist in database', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue({ subject: 'unknown_auth_id' }),
      },
      db: {
        query: vi.fn((table: string) => {
          if (table === 'users') {
            return {
              withIndex: vi.fn(() => ({
                first: vi.fn().mockResolvedValue(null), // User not found
              })),
            }
          }
          return {
            withIndex: vi.fn(() => ({
              first: vi.fn().mockResolvedValue(null),
              collect: vi.fn().mockResolvedValue([]),
            })),
          }
        }),
      },
    } as unknown as MockQueryCtx

    await expect(getAuthUserWithTenant(ctx as any)).rejects.toThrow(
      'User not found - please contact administrator'
    )

    expect(ctx.auth.getUserIdentity).toHaveBeenCalled()
    expect(ctx.db.query).toHaveBeenCalledWith('users')
  })

  it('should return correct data structure for users.current response', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue({ subject: mockAuthId }),
      },
      db: {
        query: vi.fn((table: string) => {
          if (table === 'users') {
            return {
              withIndex: vi.fn(() => ({
                first: vi.fn().mockResolvedValue(mockUser),
              })),
            }
          } else if (table === 'userRoles') {
            return {
              withIndex: vi.fn(() => ({
                collect: vi.fn().mockResolvedValue(mockUserRoles),
              })),
            }
          }
          return {
            withIndex: vi.fn(() => ({
              first: vi.fn().mockResolvedValue(null),
              collect: vi.fn().mockResolvedValue([]),
            })),
          }
        }),
      },
    } as unknown as MockQueryCtx

    const { user, roles } = await getAuthUserWithTenant(ctx as any)

    // users.current spreads { ...user, roles }
    const currentResult = { ...user, roles }

    // Verify structure matches what users.current returns
    expect(currentResult).toHaveProperty('_id', mockUserId)
    expect(currentResult).toHaveProperty('email', 'test@example.com')
    expect(currentResult).toHaveProperty('firstName', 'Test')
    expect(currentResult).toHaveProperty('lastName', 'User')
    expect(currentResult).toHaveProperty('tenantId', mockTenantId)
    expect(currentResult).toHaveProperty('roles')
    expect(currentResult.roles).toEqual(['System Administrator', 'Trainer'])
  })
})

describe('users - Row-Level Security enforcement', () => {
  it('should enforce tenant isolation through getAuthUserWithTenant', async () => {
    // users.current relies on getAuthUserWithTenant which enforces tenant isolation by:
    // 1. Getting authenticated user's authId from auth context
    // 2. Looking up user by authId (not by user input)
    // 3. Returning user's tenantId from the database
    // This prevents cross-tenant access since each user has exactly one tenantId

    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue({ subject: mockAuthId }),
      },
      db: {
        query: vi.fn((table: string) => {
          if (table === 'users') {
            return {
              withIndex: vi.fn(() => ({
                first: vi.fn().mockResolvedValue(mockUser),
              })),
            }
          } else if (table === 'userRoles') {
            return {
              withIndex: vi.fn(() => ({
                collect: vi.fn().mockResolvedValue(mockUserRoles),
              })),
            }
          }
          return {
            withIndex: vi.fn(() => ({
              first: vi.fn().mockResolvedValue(null),
              collect: vi.fn().mockResolvedValue([]),
            })),
          }
        }),
      },
    } as unknown as MockQueryCtx

    const result = await getAuthUserWithTenant(ctx as any)

    // User lookup was based on authenticated identity, not user input
    expect(ctx.auth.getUserIdentity).toHaveBeenCalled()

    // Result contains the tenantId from the database user record
    expect(result.tenantId).toBe(mockTenantId)

    // This ensures users can only see their own tenant's data
  })

  it('should throw error when querying without authentication', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue(null),
      },
      db: {
        query: vi.fn(),
      },
    } as unknown as MockQueryCtx

    // Unauthenticated queries should be rejected
    await expect(getAuthUserWithTenant(ctx as any)).rejects.toThrow('Unauthorized')

    // No database queries should be made
    expect(ctx.db.query).not.toHaveBeenCalled()
  })

  it('should use by_auth_id index for secure user lookup', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue({ subject: mockAuthId }),
      },
      db: {
        query: vi.fn((table: string) => {
          if (table === 'users') {
            return {
              withIndex: vi.fn((index: string, fn: any) => {
                // Verify correct index is used for user lookup
                expect(index).toBe('by_auth_id')
                const mockQ = {
                  eq: vi.fn((field: string, value: any) => {
                    expect(field).toBe('authId')
                    expect(value).toBe(mockAuthId)
                    return mockQ
                  }),
                }
                fn(mockQ)
                return {
                  first: vi.fn().mockResolvedValue(mockUser),
                }
              }),
            }
          } else if (table === 'userRoles') {
            return {
              withIndex: vi.fn(() => ({
                collect: vi.fn().mockResolvedValue(mockUserRoles),
              })),
            }
          }
          return {
            withIndex: vi.fn(() => ({
              first: vi.fn().mockResolvedValue(null),
              collect: vi.fn().mockResolvedValue([]),
            })),
          }
        }),
      },
    } as unknown as MockQueryCtx

    await getAuthUserWithTenant(ctx as any)

    // Assertions happen in the withIndex mock above
    // This verifies that the query uses the correct RLS pattern
  })
})

/**
 * Coverage Summary:
 * - users.current query logic: 4 tests covering authenticated/unauthenticated cases, data structure
 * - Row-Level Security: 3 tests verifying tenant isolation and auth enforcement
 *
 * Total: 7 tests for users query logic
 *
 * Note: These tests validate the core logic that users.current depends on (getAuthUserWithTenant).
 * Full end-to-end testing of the actual Convex query will be done in E2E tests.
 */
