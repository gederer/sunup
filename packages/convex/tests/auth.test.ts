import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Id } from '../_generated/dataModel'

/**
 * RLS Helper Functions Unit Tests
 *
 * Tests for multi-tenant row-level security helpers that enforce
 * tenant isolation and authentication requirements.
 *
 * Story 1.6: Setup Testing Infrastructure (Phase 3)
 * Story 1.4: Implement Multi-Tenant Row-Level Security (RLS) Foundation
 * Story 1.5: Integrate better-auth Authentication
 */

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

// Import after we set up the context
const {
  getAuthUserWithTenant,
  requireRole,
  getCurrentUserOrNull,
} = await import('../lib/auth')

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

describe('getAuthUserWithTenant', () => {
  it('should return user with tenant and roles when authenticated', async () => {
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

    expect(result).toEqual({
      user: mockUser,
      tenantId: mockTenantId,
      roles: ['System Administrator', 'Trainer'],
    })

    // Verify auth was checked
    expect(ctx.auth.getUserIdentity).toHaveBeenCalled()

    // Verify user was queried by auth ID
    expect(ctx.db.query).toHaveBeenCalledWith('users')

    // Verify roles were queried by user ID
    expect(ctx.db.query).toHaveBeenCalledWith('userRoles')
  })

  it('should throw "Unauthorized" when no identity', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue(null),
      },
      db: {
        query: vi.fn(),
      },
    } as unknown as MockQueryCtx

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

  it('should return empty roles array when user has no roles', async () => {
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
                collect: vi.fn().mockResolvedValue([]), // No roles
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

    expect(result).toEqual({
      user: mockUser,
      tenantId: mockTenantId,
      roles: [],
    })
  })

  it('should filter out inactive roles', async () => {
    const rolesWithInactive = [
      ...mockUserRoles,
      {
        _id: 'role3' as Id<'userRoles'>,
        _creationTime: Date.now(),
        userId: mockUserId,
        role: 'Finance',
        isActive: false, // Inactive role
        isPrimary: false,
      },
    ]

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
                collect: vi.fn().mockResolvedValue(rolesWithInactive),
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

    // Should only include active roles
    expect(result.roles).toEqual(['System Administrator', 'Trainer'])
    expect(result.roles).not.toContain('Finance')
  })

  it('should use correct index for user lookup', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue({ subject: mockAuthId }),
      },
      db: {
        query: vi.fn((table: string) => {
          if (table === 'users') {
            return {
              withIndex: vi.fn((index: string, fn: any) => {
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
  })
})

describe('requireRole', () => {
  it('should return user when user has any of the allowed roles', async () => {
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

    const result = await requireRole(ctx as any, ['System Administrator', 'Finance'])

    expect(result).toEqual({
      user: mockUser,
      tenantId: mockTenantId,
    })
  })

  it('should throw "Forbidden" when user lacks all required roles', async () => {
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

    // User has "System Administrator" and "Trainer" roles
    // Requiring "Finance" or "Setter" should fail
    await expect(requireRole(ctx as any, ['Finance', 'Setter'])).rejects.toThrow('Forbidden')
  })

  it('should throw "Forbidden" when user has inactive matching role', async () => {
    const inactiveRoles = [
      {
        _id: 'role1' as Id<'userRoles'>,
        _creationTime: Date.now(),
        userId: mockUserId,
        role: 'Finance',
        isActive: false, // Inactive
        isPrimary: true,
      },
    ]

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
                collect: vi.fn().mockResolvedValue(inactiveRoles),
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

    await expect(requireRole(ctx as any, ['Finance'])).rejects.toThrow('Forbidden')
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

    await expect(requireRole(ctx as any, ['System Administrator'])).rejects.toThrow('Unauthorized')
  })

  it('should accept single role in array', async () => {
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

    const result = await requireRole(ctx as any, ['System Administrator'])

    expect(result.user).toEqual(mockUser)
    expect(result.tenantId).toEqual(mockTenantId)
  })
})

describe('getCurrentUserOrNull', () => {
  it('should return user when authenticated', async () => {
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

    const result = await getCurrentUserOrNull(ctx as any)

    expect(result).toEqual({
      user: mockUser,
      tenantId: mockTenantId,
      roles: ['System Administrator', 'Trainer'],
    })
  })

  it('should return null when not authenticated', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue(null),
      },
      db: {
        query: vi.fn(),
      },
    } as unknown as MockQueryCtx

    const result = await getCurrentUserOrNull(ctx as any)

    expect(result).toBeNull()
    expect(ctx.auth.getUserIdentity).toHaveBeenCalled()
  })

  it('should return null when user not found in database', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue({ subject: 'unknown_id' }),
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

    const result = await getCurrentUserOrNull(ctx as any)

    expect(result).toBeNull()
  })

  it('should not throw errors for optional authentication scenarios', async () => {
    const errorCases = [
      // Unauthenticated
      {
        auth: { getUserIdentity: vi.fn().mockResolvedValue(null) },
        db: { query: vi.fn() },
      },
      // User not found
      {
        auth: { getUserIdentity: vi.fn().mockResolvedValue({ subject: 'test' }) },
        db: {
          query: vi.fn(() => ({
            withIndex: vi.fn(() => ({
              first: vi.fn().mockResolvedValue(null),
            })),
          })),
        },
      },
    ]

    for (const ctx of errorCases) {
      const result = await getCurrentUserOrNull(ctx as any)
      expect(result).toBeNull()
    }
  })
})

/**
 * Coverage Summary:
 * - getAuthUserWithTenant: 6 tests covering auth, user lookup, roles, error cases
 * - requireRole: 5 tests covering role checking, inactive roles, auth errors
 * - getCurrentUserOrNull: 4 tests covering authenticated/unauthenticated cases
 *
 * Total: 15 tests for RLS helper functions
 */
