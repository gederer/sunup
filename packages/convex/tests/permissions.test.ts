import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UserWithTenant } from '../lib/auth'
import type { Id } from '../_generated/dataModel'

/**
 * Permission Helpers Unit Tests
 *
 * Tests for role-based access control (RBAC) permission system.
 *
 * Story 1.6: Setup Testing Infrastructure (Phase 3)
 * Story 1.5: Integrate better-auth Authentication
 */

// Mock better-auth access control plugin with proper role mapping
vi.mock('better-auth/plugins/access', () => ({
  createAccessControl: (statement: any) => ({
    newRole: (permissions: any) => ({
      getPermissions: () => permissions
    })
  })
}))

// Mock the roles object to use display names as keys
vi.mock('../auth/permissions', async (importOriginal) => {
  const actual = await importOriginal() as any

  // Create role mapping with display names
  const roleMapping = {
    'System Administrator': actual.systemAdmin,
    'Setter': actual.setter,
    'Consultant': actual.consultant,
    'Sales Manager': actual.salesManager,
    'Setter Manager': actual.setterManager,
    'Project Manager': actual.projectManager,
    'Installer': actual.installer,
    'Recruiter': actual.recruiter,
    'Trainer': actual.trainer,
    'Executive': actual.executive,
    'Finance': actual.finance,
    'Operations': actual.operations,
  }

  return {
    ...actual,
    roles: roleMapping
  }
})

// Import after mocking
const {
  hasPermission,
  requirePermission,
  hasAnyRole,
  hasAllRoles,
  verifyTenantOwnership,
  PermissionPatterns,
} = await import('../lib/permissions')

// Test fixtures
const createMockUser = (roles: string[], tenantId: string = 'tenant123'): UserWithTenant => ({
  user: {
    _id: 'user123' as Id<'users'>,
    _creationTime: Date.now(),
    authId: 'auth123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    tenantId: tenantId as Id<'tenants'>,
  },
  tenantId: tenantId as Id<'tenants'>,
  roles,
})

describe('hasPermission', () => {
  it('should return true when user has required permission (System Administrator)', () => {
    const user = createMockUser(['System Administrator'])

    // System Administrators should have all permissions
    expect(hasPermission(user, 'user', 'create')).toBe(true)
    expect(hasPermission(user, 'user', 'update')).toBe(true)
    expect(hasPermission(user, 'user', 'delete')).toBe(true)
    expect(hasPermission(user, 'tenant', 'create')).toBe(true)
  })

  it('should return true when user has specific role with permission', () => {
    // Finance role should have commission permissions
    const financeUser = createMockUser(['Finance'])
    expect(hasPermission(financeUser, 'commission', 'approve')).toBe(true)

    // Sales Manager should have person permissions
    const salesManager = createMockUser(['Sales Manager'])
    expect(hasPermission(salesManager, 'person', 'create')).toBe(true)
    expect(hasPermission(salesManager, 'person', 'read')).toBe(true)
  })

  it('should return false when user lacks permission', () => {
    // Setter should not have user creation permissions
    const setter = createMockUser(['Setter'])
    expect(hasPermission(setter, 'user', 'create')).toBe(false)
    expect(hasPermission(setter, 'tenant', 'create')).toBe(false)

    // Consultant should not have campaign management permissions
    const consultant = createMockUser(['Consultant'])
    expect(hasPermission(consultant, 'campaign', 'create')).toBe(false)

    // Installer should not have analytics permissions
    const installer = createMockUser(['Installer'])
    expect(hasPermission(installer, 'analytics', 'view')).toBe(false)
  })

  it('should return true when user has multiple roles and one grants permission', () => {
    // User with Setter and Recruiter roles
    const user = createMockUser(['Setter', 'Recruiter'])

    // Setter permissions
    expect(hasPermission(user, 'person', 'read')).toBe(true)

    // Recruiter permissions (user:create)
    expect(hasPermission(user, 'user', 'create')).toBe(true)
  })

  it('should return false for unknown roles', () => {
    const user = createMockUser(['UnknownRole'])
    expect(hasPermission(user, 'user', 'create')).toBe(false)
  })

  it('should return false for user with empty roles array', () => {
    const user = createMockUser([])
    expect(hasPermission(user, 'user', 'create')).toBe(false)
    expect(hasPermission(user, 'person', 'read')).toBe(false)
  })
})

describe('requirePermission', () => {
  // Mock Convex context for requirePermission tests
  const mockAuthId = 'auth123'
  const mockUserId = 'user123' as Id<'users'>
  const mockTenantId = 'tenant123' as Id<'tenants'>

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
  ]

  it('should return auth object when user has required permission', async () => {
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
    } as any

    // System Administrator should have all permissions
    const result = await requirePermission(ctx, 'user', 'create')

    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('tenantId', mockTenantId)
    expect(result).toHaveProperty('roles')
    expect(result.roles).toContain('System Administrator')
  })

  it('should throw "Forbidden" when user lacks required permission', async () => {
    const setterRoles = [
      {
        _id: 'role1' as Id<'userRoles'>,
        _creationTime: Date.now(),
        userId: mockUserId,
        role: 'Setter',
        isActive: true,
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
                collect: vi.fn().mockResolvedValue(setterRoles),
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
    } as any

    // Setter should not be able to create users
    await expect(requirePermission(ctx, 'user', 'create')).rejects.toThrow(
      "Forbidden: You don't have permission to create user"
    )
  })

  it('should throw "Unauthorized" when user is not authenticated', async () => {
    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue(null),
      },
      db: {
        query: vi.fn(),
      },
    } as any

    await expect(requirePermission(ctx, 'person', 'read')).rejects.toThrow('Unauthorized')
  })

  it('should include resource and action in error message', async () => {
    const consultantRoles = [
      {
        _id: 'role1' as Id<'userRoles'>,
        _creationTime: Date.now(),
        userId: mockUserId,
        role: 'Consultant',
        isActive: true,
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
                collect: vi.fn().mockResolvedValue(consultantRoles),
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
    } as any

    // Consultant should not be able to create campaigns
    await expect(requirePermission(ctx, 'campaign', 'create')).rejects.toThrow(
      "Forbidden: You don't have permission to create campaign"
    )
  })

  it('should work with different resource types', async () => {
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
    } as any

    // System Admin should have access to all resources
    await expect(requirePermission(ctx, 'user', 'create')).resolves.toBeDefined()
    await expect(requirePermission(ctx, 'person', 'update')).resolves.toBeDefined()
    await expect(requirePermission(ctx, 'commission', 'approve')).resolves.toBeDefined()
    await expect(requirePermission(ctx, 'tenant', 'create')).resolves.toBeDefined()
  })
})

describe('hasAnyRole', () => {
  it('should return true when user has at least one of the allowed roles', () => {
    const user = createMockUser(['Setter', 'Consultant'])
    expect(hasAnyRole(user, ['Setter', 'Sales Manager'])).toBe(true)
    expect(hasAnyRole(user, ['Consultant', 'Finance'])).toBe(true)
  })

  it('should return false when user has none of the allowed roles', () => {
    const user = createMockUser(['Setter'])
    expect(hasAnyRole(user, ['Finance', 'Executive'])).toBe(false)
    expect(hasAnyRole(user, ['System Administrator', 'Recruiter'])).toBe(false)
  })

  it('should return true when user has all allowed roles', () => {
    const user = createMockUser(['Setter', 'Consultant', 'Trainer'])
    expect(hasAnyRole(user, ['Setter', 'Consultant'])).toBe(true)
  })

  it('should return false for empty allowed roles array', () => {
    const user = createMockUser(['Setter'])
    expect(hasAnyRole(user, [])).toBe(false)
  })

  it('should return false when user has no roles', () => {
    const user = createMockUser([])
    expect(hasAnyRole(user, ['Setter', 'Consultant'])).toBe(false)
  })
})

describe('hasAllRoles', () => {
  it('should return true when user has all required roles', () => {
    const user = createMockUser(['Setter', 'Consultant', 'Trainer'])
    expect(hasAllRoles(user, ['Setter', 'Consultant'])).toBe(true)
    expect(hasAllRoles(user, ['Trainer'])).toBe(true)
  })

  it('should return false when user is missing at least one required role', () => {
    const user = createMockUser(['Setter', 'Consultant'])
    expect(hasAllRoles(user, ['Setter', 'Consultant', 'Trainer'])).toBe(false)
    expect(hasAllRoles(user, ['Finance'])).toBe(false)
  })

  it('should return true for empty required roles array', () => {
    const user = createMockUser(['Setter'])
    expect(hasAllRoles(user, [])).toBe(true)
  })

  it('should return false when user has no roles', () => {
    const user = createMockUser([])
    expect(hasAllRoles(user, ['Setter'])).toBe(false)
  })

  it('should handle single role requirement', () => {
    const user = createMockUser(['System Administrator'])
    expect(hasAllRoles(user, ['System Administrator'])).toBe(true)
    expect(hasAllRoles(user, ['Finance'])).toBe(false)
  })
})

describe('verifyTenantOwnership', () => {
  it('should not throw when record belongs to user tenant', () => {
    const tenantId = 'tenant123' as Id<'tenants'>
    const record = { tenantId, name: 'Test Task' }

    expect(() => {
      verifyTenantOwnership(record, tenantId, 'task')
    }).not.toThrow()
  })

  it('should throw when record belongs to different tenant', () => {
    const userTenantId = 'tenant123' as Id<'tenants'>
    const recordTenantId = 'tenant456' as Id<'tenants'>
    const record = { tenantId: recordTenantId, name: 'Other Task' }

    expect(() => {
      verifyTenantOwnership(record, userTenantId, 'task')
    }).toThrow('Unauthorized: This task belongs to a different tenant')
  })

  it('should include resource name in error message', () => {
    const userTenantId = 'tenant123' as Id<'tenants'>
    const recordTenantId = 'tenant456' as Id<'tenants'>
    const record = { tenantId: recordTenantId, id: 'person123' }

    expect(() => {
      verifyTenantOwnership(record, userTenantId, 'person')
    }).toThrow('Unauthorized: This person belongs to a different tenant')

    expect(() => {
      verifyTenantOwnership(record, userTenantId, 'project')
    }).toThrow('Unauthorized: This project belongs to a different tenant')
  })

  it('should work with different record structures', () => {
    const tenantId = 'tenant123' as Id<'tenants'>

    // Task record
    const task = { tenantId, text: 'Test task', isCompleted: false }
    expect(() => verifyTenantOwnership(task, tenantId, 'task')).not.toThrow()

    // Person record
    const person = { tenantId, firstName: 'John', lastName: 'Doe' }
    expect(() => verifyTenantOwnership(person, tenantId, 'person')).not.toThrow()

    // Project record
    const project = { tenantId, name: 'Solar Installation', status: 'active' }
    expect(() => verifyTenantOwnership(project, tenantId, 'project')).not.toThrow()
  })
})

describe('PermissionPatterns', () => {
  describe('canManageUsers', () => {
    it('should return true for System Administrator', () => {
      const admin = createMockUser(['System Administrator'])
      expect(PermissionPatterns.canManageUsers(admin)).toBe(true)
    })

    it('should return true for Recruiter', () => {
      const recruiter = createMockUser(['Recruiter'])
      expect(PermissionPatterns.canManageUsers(recruiter)).toBe(true)
    })

    it('should return true for Setter Manager', () => {
      // Setter Manager can create setter accounts
      const setterManager = createMockUser(['Setter Manager'])
      expect(PermissionPatterns.canManageUsers(setterManager)).toBe(true)
    })

    it('should return false for Setter', () => {
      const setter = createMockUser(['Setter'])
      expect(PermissionPatterns.canManageUsers(setter)).toBe(false)
    })

    it('should return false for Consultant', () => {
      const consultant = createMockUser(['Consultant'])
      expect(PermissionPatterns.canManageUsers(consultant)).toBe(false)
    })

    it('should return false for Trainer', () => {
      // Trainer only has user:read permission, not create/update/delete
      const trainer = createMockUser(['Trainer'])
      expect(PermissionPatterns.canManageUsers(trainer)).toBe(false)
    })
  })

  describe('canViewAnalytics', () => {
    it('should return true for roles with analytics permissions', () => {
      expect(PermissionPatterns.canViewAnalytics(createMockUser(['System Administrator']))).toBe(true)
      expect(PermissionPatterns.canViewAnalytics(createMockUser(['Sales Manager']))).toBe(true)
      expect(PermissionPatterns.canViewAnalytics(createMockUser(['Executive']))).toBe(true)
    })

    it('should return false for Setter', () => {
      const setter = createMockUser(['Setter'])
      expect(PermissionPatterns.canViewAnalytics(setter)).toBe(false)
    })
  })

  describe('canManageCampaigns', () => {
    it('should return true for Setter Manager', () => {
      const setterManager = createMockUser(['Setter Manager'])
      expect(PermissionPatterns.canManageCampaigns(setterManager)).toBe(true)
    })

    it('should return true for System Administrator', () => {
      const admin = createMockUser(['System Administrator'])
      expect(PermissionPatterns.canManageCampaigns(admin)).toBe(true)
    })

    it('should return false for regular Setter', () => {
      const setter = createMockUser(['Setter'])
      expect(PermissionPatterns.canManageCampaigns(setter)).toBe(false)
    })
  })

  describe('canApproveCommissions', () => {
    it('should return true for Finance role', () => {
      const finance = createMockUser(['Finance'])
      expect(PermissionPatterns.canApproveCommissions(finance)).toBe(true)
    })

    it('should return true for System Administrator', () => {
      const admin = createMockUser(['System Administrator'])
      expect(PermissionPatterns.canApproveCommissions(admin)).toBe(true)
    })

    it('should return true for Sales Manager', () => {
      // Sales Manager can approve commissions according to the permission system
      const salesManager = createMockUser(['Sales Manager'])
      expect(PermissionPatterns.canApproveCommissions(salesManager)).toBe(true)
    })

    it('should return false for Setter', () => {
      const setter = createMockUser(['Setter'])
      expect(PermissionPatterns.canApproveCommissions(setter)).toBe(false)
    })
  })

  describe('canManageTenants', () => {
    it('should return true for System Administrator only', () => {
      const admin = createMockUser(['System Administrator'])
      expect(PermissionPatterns.canManageTenants(admin)).toBe(true)
    })

    it('should return false for all other roles', () => {
      expect(PermissionPatterns.canManageTenants(createMockUser(['Executive']))).toBe(false)
      expect(PermissionPatterns.canManageTenants(createMockUser(['Finance']))).toBe(false)
      expect(PermissionPatterns.canManageTenants(createMockUser(['Sales Manager']))).toBe(false)
    })
  })

  describe('isSystemAdmin', () => {
    it('should return true for System Administrator', () => {
      const admin = createMockUser(['System Administrator'])
      expect(PermissionPatterns.isSystemAdmin(admin)).toBe(true)
    })

    it('should return false for other roles', () => {
      expect(PermissionPatterns.isSystemAdmin(createMockUser(['Executive']))).toBe(false)
      expect(PermissionPatterns.isSystemAdmin(createMockUser(['Finance']))).toBe(false)
      expect(PermissionPatterns.isSystemAdmin(createMockUser(['Setter']))).toBe(false)
    })

    it('should return true when System Administrator is one of multiple roles', () => {
      const user = createMockUser(['System Administrator', 'Trainer'])
      expect(PermissionPatterns.isSystemAdmin(user)).toBe(true)
    })
  })

  describe('isManagement', () => {
    it('should return true for manager roles', () => {
      expect(PermissionPatterns.isManagement(createMockUser(['Sales Manager']))).toBe(true)
      expect(PermissionPatterns.isManagement(createMockUser(['Setter Manager']))).toBe(true)
      expect(PermissionPatterns.isManagement(createMockUser(['Project Manager']))).toBe(true)
    })

    it('should return true for System Administrator and Executive', () => {
      expect(PermissionPatterns.isManagement(createMockUser(['System Administrator']))).toBe(true)
      expect(PermissionPatterns.isManagement(createMockUser(['Executive']))).toBe(true)
      expect(PermissionPatterns.isManagement(createMockUser(['Operations']))).toBe(true)
    })

    it('should return false for non-management roles', () => {
      expect(PermissionPatterns.isManagement(createMockUser(['Setter']))).toBe(false)
      expect(PermissionPatterns.isManagement(createMockUser(['Consultant']))).toBe(false)
      expect(PermissionPatterns.isManagement(createMockUser(['Installer']))).toBe(false)
    })

    it('should return true if user has at least one management role', () => {
      const user = createMockUser(['Setter', 'Sales Manager'])
      expect(PermissionPatterns.isManagement(user)).toBe(true)
    })
  })
})

/**
 * Coverage Summary:
 * - hasPermission: 7 tests covering single/multiple roles, unknown roles, empty roles
 * - hasAnyRole: 5 tests covering various role combinations
 * - hasAllRoles: 5 tests covering complete/incomplete role sets
 * - verifyTenantOwnership: 4 tests covering same/different tenants and error messages
 * - PermissionPatterns: 26 tests covering all 8 helper functions
 *
 * Total: 47 tests for permission helpers
 */
