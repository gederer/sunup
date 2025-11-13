/**
 * Authentication and RLS Helper Tests (Clerk Authentication)
 * Story 1.6.5: Address Testing Debt from User Management
 *
 * Tests the RLS helper functions in lib/auth.ts that enforce
 * tenant isolation and role-based access control.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Id } from '../_generated/dataModel'
import type { QueryCtx, MutationCtx } from '../_generated/server'
import {
  getAuthUserWithTenant,
  requireRole,
  getCurrentUserOrNull,
  type UserWithTenant,
} from '../lib/auth'

describe('lib/auth.ts - RLS and Authentication Helpers', () => {
  const mockTenantId = 'tenant123' as Id<'tenants'>
  const mockUserId = 'user123' as Id<'users'>
  const mockClerkId = 'clerk_user123'

  const mockUser = {
    _id: mockUserId,
    _creationTime: Date.now(),
    clerkId: mockClerkId,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    tenantId: mockTenantId,
  }

  const mockUserRole = {
    _id: 'role123' as Id<'userRoles'>,
    _creationTime: Date.now(),
    userId: mockUserId,
    role: 'System Administrator' as const,
    isActive: true,
    isPrimary: true,
    tenantId: mockTenantId,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAuthUserWithTenant', () => {
    it('should return user and tenantId when authenticated', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(mockUser),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as unknown as QueryCtx

      const result = await getAuthUserWithTenant(ctx)

      expect(ctx.auth.getUserIdentity).toHaveBeenCalled()
      expect(ctx.db.query).toHaveBeenCalledWith('users')
      expect(mockQuery.withIndex).toHaveBeenCalledWith('by_clerk_id', expect.any(Function))
      expect(result).toEqual({
        user: mockUser,
        tenantId: mockTenantId,
      })
    })

    it('should throw "Unauthorized" when no user identity', async () => {
      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue(null),
        },
        db: {
          query: vi.fn(),
        },
      } as unknown as QueryCtx

      await expect(getAuthUserWithTenant(ctx)).rejects.toThrow('Unauthorized')
      expect(ctx.db.query).not.toHaveBeenCalled()
    })

    it('should throw "User not found" when user not in database', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(null),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as unknown as QueryCtx

      await expect(getAuthUserWithTenant(ctx)).rejects.toThrow('User not found')
    })

    it('should use by_clerk_id index for efficient lookup', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(mockUser),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as unknown as QueryCtx

      await getAuthUserWithTenant(ctx)

      expect(mockQuery.withIndex).toHaveBeenCalledWith('by_clerk_id', expect.any(Function))
    })
  })

  describe('requireRole', () => {
    it('should return user when user has allowed role', async () => {
      const mockUserQuery = {
        withIndex: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(mockUser),
      }

      const mockRolesQuery = {
        withIndex: vi.fn().mockReturnThis(),
        collect: vi.fn().mockResolvedValue([mockUserRole]),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockImplementation((table: string) => {
            return table === 'users' ? mockUserQuery : mockRolesQuery
          }),
        },
      } as unknown as MutationCtx

      const result = await requireRole(ctx, ['System Administrator'])

      expect(result).toEqual({
        user: mockUser,
        tenantId: mockTenantId,
      })
      expect(mockRolesQuery.withIndex).toHaveBeenCalledWith('by_user', expect.any(Function))
    })

    it('should return user when user has one of multiple allowed roles', async () => {
      const mockUserQuery = {
        withIndex: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(mockUser),
      }

      const mockRolesQuery = {
        withIndex: vi.fn().mockReturnThis(),
        collect: vi.fn().mockResolvedValue([mockUserRole]),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockImplementation((table: string) => {
            return table === 'users' ? mockUserQuery : mockRolesQuery
          }),
        },
      } as unknown as MutationCtx

      const result = await requireRole(ctx, ['Finance', 'System Administrator'])

      expect(result).toEqual({
        user: mockUser,
        tenantId: mockTenantId,
      })
    })

    it('should throw "Forbidden" when user does not have allowed role', async () => {
      const mockUserQuery = {
        withIndex: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(mockUser),
      }

      const mockRolesQuery = {
        withIndex: vi.fn().mockReturnThis(),
        collect: vi.fn().mockResolvedValue([mockUserRole]),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockImplementation((table: string) => {
            return table === 'users' ? mockUserQuery : mockRolesQuery
          }),
        },
      } as unknown as MutationCtx

      await expect(requireRole(ctx, ['Finance', 'Setter'])).rejects.toThrow('Forbidden')
    })

    it('should throw "Forbidden" when user role is inactive', async () => {
      const inactiveRole = { ...mockUserRole, isActive: false }

      const mockUserQuery = {
        withIndex: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(mockUser),
      }

      const mockRolesQuery = {
        withIndex: vi.fn().mockReturnThis(),
        collect: vi.fn().mockResolvedValue([inactiveRole]),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockImplementation((table: string) => {
            return table === 'users' ? mockUserQuery : mockRolesQuery
          }),
        },
      } as unknown as MutationCtx

      await expect(requireRole(ctx, ['System Administrator'])).rejects.toThrow('Forbidden')
    })

    it('should throw "Unauthorized" when user is not authenticated', async () => {
      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue(null),
        },
        db: {
          query: vi.fn(),
        },
      } as unknown as MutationCtx

      await expect(requireRole(ctx, ['System Administrator'])).rejects.toThrow('Unauthorized')
    })

    it('should throw "User not found" when user not in database', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(null),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as unknown as MutationCtx

      await expect(requireRole(ctx, ['System Administrator'])).rejects.toThrow('User not found')
    })
  })

  describe('getCurrentUserOrNull', () => {
    it('should return user and tenantId when authenticated', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(mockUser),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as unknown as QueryCtx

      const result = await getCurrentUserOrNull(ctx)

      expect(result).toEqual({
        user: mockUser,
        tenantId: mockTenantId,
      })
    })

    it('should return null when user is not authenticated', async () => {
      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue(null),
        },
        db: {
          query: vi.fn(),
        },
      } as unknown as QueryCtx

      const result = await getCurrentUserOrNull(ctx)

      expect(result).toBeNull()
    })

    it('should return null when user not found in database', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(null),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as unknown as QueryCtx

      const result = await getCurrentUserOrNull(ctx)

      expect(result).toBeNull()
    })

    it('should not throw errors for authentication failures', async () => {
      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue(null),
        },
        db: {
          query: vi.fn(),
        },
      } as unknown as QueryCtx

      await expect(getCurrentUserOrNull(ctx)).resolves.toBeNull()
    })
  })
})
