/**
 * User Management Tests (Clerk Authentication)
 * Story 1.6.5: Address Testing Debt from User Management
 *
 * Tests webhook mutations and helper functions in users.ts that handle
 * Clerk user synchronization and authentication.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Id } from '../_generated/dataModel'
import type { UserJSON } from '@clerk/backend'

// Import the functions we'll test
import {
  getCurrentUser,
  getCurrentUserOrThrow,
} from '../users'

describe('users.ts - User Management', () => {
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        unique: vi.fn().mockResolvedValue(mockUser),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as any

      const result = await getCurrentUser(ctx)

      expect(ctx.auth.getUserIdentity).toHaveBeenCalled()
      expect(ctx.db.query).toHaveBeenCalledWith('users')
      expect(mockQuery.withIndex).toHaveBeenCalledWith('by_clerk_id', expect.any(Function))
      expect(result).toEqual(mockUser)
    })

    it('should return null when user is not authenticated', async () => {
      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue(null),
        },
        db: {
          query: vi.fn(),
        },
      } as any

      const result = await getCurrentUser(ctx)

      expect(result).toBeNull()
      expect(ctx.db.query).not.toHaveBeenCalled()
    })

    it('should return null when user not found in database', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        unique: vi.fn().mockResolvedValue(null),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as any

      const result = await getCurrentUser(ctx)

      expect(result).toBeNull()
    })
  })

  describe('getCurrentUserOrThrow', () => {
    it('should return user when authenticated', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        unique: vi.fn().mockResolvedValue(mockUser),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as any

      const result = await getCurrentUserOrThrow(ctx)

      expect(result).toEqual(mockUser)
    })

    it('should throw error when user is not authenticated', async () => {
      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue(null),
        },
        db: {
          query: vi.fn(),
        },
      } as any

      await expect(getCurrentUserOrThrow(ctx)).rejects.toThrow("Can't get current user")
    })

    it('should throw error when user not found in database', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        unique: vi.fn().mockResolvedValue(null),
      }

      const ctx = {
        auth: {
          getUserIdentity: vi.fn().mockResolvedValue({ subject: mockClerkId }),
        },
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as any

      await expect(getCurrentUserOrThrow(ctx)).rejects.toThrow("Can't get current user")
    })
  })

  // Note: Webhook mutations (upsertFromClerk, deleteFromClerk) are tested
  // through integration tests and manual webhook testing. These are thin
  // wrappers around Convex internal mutations that require the full Convex
  // runtime to test properly. The business logic (like auto-assigning default
  // tenant) is verified through manual testing in the Sprint Change Proposal.
})
