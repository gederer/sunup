import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Id } from '../_generated/dataModel'

/**
 * Tasks (RLS Examples) Integration Tests
 *
 * Tests for task management endpoints with Row-Level Security (RLS) enforcement.
 *
 * Story 1.6.5: Address Testing Debt from User Management
 * Story 1.4: Implement Multi-Tenant Row-Level Security (RLS) Foundation
 *
 * This test suite covers:
 * - list: Tenant-scoped task listing with RLS filtering
 * - add: Task creation with automatic tenantId assignment
 * - toggle: Task update with cross-tenant security verification
 * - remove: Task deletion with cross-tenant security verification
 */

// Import the testable helper functions (refactored in Story 1.6.5)
const {
  listTasksForTenant,
  addTaskToTenant,
  toggleTaskCompletion,
  removeTask,
} = await import('../lib/tasks')

// Import auth helper to mock
const { getAuthUserWithTenant } = await import('../lib/auth')

// Mock the getAuthUserWithTenant helper
vi.mock('../lib/auth', () => ({
  getAuthUserWithTenant: vi.fn(),
}))

// Mock types for Convex context
interface MockQueryCtx {
  db: {
    query: (table: string) => MockQuery
    get: (id: Id<any>) => Promise<any>
    insert: (table: string, doc: any) => Promise<Id<any>>
    patch: (id: Id<any>, fields: any) => Promise<void>
    delete: (id: Id<any>) => Promise<void>
  }
}

interface MockQuery {
  withIndex: (index: string, fn: (q: any) => any) => MockQuery
  order: (direction: string) => MockQuery
  take: (limit: number) => Promise<any[]>
}

// Test fixtures
const mockTenantId1 = 'tenant123' as Id<'tenants'>
const mockTenantId2 = 'tenant456' as Id<'tenants'>
const mockUserId = 'user123' as Id<'users'>
const mockTaskId1 = 'task123' as Id<'tasks'>
const mockTaskId2 = 'task456' as Id<'tasks'>

const mockTask1 = {
  _id: mockTaskId1,
  _creationTime: Date.now(),
  text: 'Task 1 for tenant 1',
  isCompleted: false,
  createdAt: Date.now(),
  tenantId: mockTenantId1,
}

const mockTask2 = {
  _id: mockTaskId2,
  _creationTime: Date.now(),
  text: 'Task 2 for tenant 1',
  isCompleted: true,
  createdAt: Date.now() - 1000,
  tenantId: mockTenantId1,
}

const mockTaskFromDifferentTenant = {
  _id: 'task789' as Id<'tasks'>,
  _creationTime: Date.now(),
  text: 'Task from tenant 2',
  isCompleted: false,
  createdAt: Date.now(),
  tenantId: mockTenantId2, // Different tenant
}

const mockAuth = {
  user: {
    _id: mockUserId,
    tenantId: mockTenantId1,
    email: 'test@example.com',
  },
  tenantId: mockTenantId1,
  roles: ['Setter'],
}

describe('list query', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return only tasks from authenticated user tenant (RLS filtering)', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const tenantTasks = [mockTask1, mockTask2]

    const ctx = {
      db: {
        query: vi.fn(() => ({
          withIndex: vi.fn(() => ({
            order: vi.fn(() => ({
              take: vi.fn().mockResolvedValue(tenantTasks),
            })),
          })),
        })),
        get: vi.fn(),
        insert: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    const result = await listTasksForTenant(ctx as any)

    expect(result).toEqual(tenantTasks)
    expect(result).toHaveLength(2)
    expect(result.every(t => t.tenantId === mockTenantId1)).toBe(true)
  })

  it('should reject unauthenticated user (unauthorized error)', async () => {
    vi.mocked(getAuthUserWithTenant).mockRejectedValue(new Error('Unauthorized'))

    const ctx = {
      db: {
        query: vi.fn(),
        get: vi.fn(),
        insert: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await expect(listTasksForTenant(ctx as any)).rejects.toThrow('Unauthorized')
  })

  it('should return empty array when tenant has no tasks', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        query: vi.fn(() => ({
          withIndex: vi.fn(() => ({
            order: vi.fn(() => ({
              take: vi.fn().mockResolvedValue([]),
            })),
          })),
        })),
        get: vi.fn(),
        insert: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    const result = await listTasksForTenant(ctx as any)

    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })

  it('should include all task fields in result', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        query: vi.fn(() => ({
          withIndex: vi.fn(() => ({
            order: vi.fn(() => ({
              take: vi.fn().mockResolvedValue([mockTask1]),
            })),
          })),
        })),
        get: vi.fn(),
        insert: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    const result = await listTasksForTenant(ctx as any)

    expect(result[0]).toHaveProperty('_id')
    expect(result[0]).toHaveProperty('text')
    expect(result[0]).toHaveProperty('isCompleted')
    expect(result[0]).toHaveProperty('tenantId')
    expect(result[0]).toHaveProperty('createdAt')
  })

  it('should use correct index for efficient RLS queries', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const mockWithIndex = vi.fn(() => ({
      order: vi.fn(() => ({
        take: vi.fn().mockResolvedValue([]),
      })),
    }))

    const ctx = {
      db: {
        query: vi.fn(() => ({
          withIndex: mockWithIndex,
        })),
        get: vi.fn(),
        insert: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await listTasksForTenant(ctx as any)

    // Verify by_tenant index is used for RLS
    expect(mockWithIndex).toHaveBeenCalledWith('by_tenant', expect.any(Function))
  })
})

describe('add mutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should allow authenticated user to create task', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        insert: vi.fn().mockResolvedValue(mockTaskId1),
        query: vi.fn(),
        get: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    const taskId = await addTaskToTenant(ctx as any, 'New task')

    expect(taskId).toBe(mockTaskId1)
    expect(ctx.db.insert).toHaveBeenCalledWith('tasks', expect.objectContaining({
      text: 'New task',
      isCompleted: false,
      tenantId: mockTenantId1,
    }))
  })

  it('should automatically assign task to user tenantId', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        insert: vi.fn().mockResolvedValue(mockTaskId1),
        query: vi.fn(),
        get: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await addTaskToTenant(ctx as any, 'New task')

    // Verify tenantId is automatically assigned from auth context
    expect(ctx.db.insert).toHaveBeenCalledWith('tasks', expect.objectContaining({
      tenantId: mockAuth.tenantId,
    }))
  })

  it('should create task with isCompleted false by default', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        insert: vi.fn().mockResolvedValue(mockTaskId1),
        query: vi.fn(),
        get: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await addTaskToTenant(ctx as any, 'New task')

    expect(ctx.db.insert).toHaveBeenCalledWith('tasks', expect.objectContaining({
      isCompleted: false,
    }))
  })

  it('should reject unauthenticated user (RLS enforcement)', async () => {
    vi.mocked(getAuthUserWithTenant).mockRejectedValue(new Error('Unauthorized'))

    const ctx = {
      db: {
        insert: vi.fn(),
        query: vi.fn(),
        get: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await expect(addTaskToTenant(ctx as any, 'New task')).rejects.toThrow('Unauthorized')
    expect(ctx.db.insert).not.toHaveBeenCalled()
  })

  it('should include createdAt timestamp', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        insert: vi.fn().mockResolvedValue(mockTaskId1),
        query: vi.fn(),
        get: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await addTaskToTenant(ctx as any, 'New task')

    expect(ctx.db.insert).toHaveBeenCalledWith('tasks', expect.objectContaining({
      createdAt: expect.any(Number),
    }))
  })
})

describe('toggle mutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should allow user to toggle their own tenant task (false → true)', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const taskToToggle = { ...mockTask1, isCompleted: false }

    const ctx = {
      db: {
        get: vi.fn().mockResolvedValue(taskToToggle),
        patch: vi.fn(),
        query: vi.fn(),
        insert: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await toggleTaskCompletion(ctx as any, mockTaskId1)

    expect(ctx.db.patch).toHaveBeenCalledWith(mockTaskId1, {
      isCompleted: true, // Toggled from false to true
    })
  })

  it('should allow user to toggle their own tenant task (true → false)', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const taskToToggle = { ...mockTask1, isCompleted: true }

    const ctx = {
      db: {
        get: vi.fn().mockResolvedValue(taskToToggle),
        patch: vi.fn(),
        query: vi.fn(),
        insert: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await toggleTaskCompletion(ctx as any, mockTaskId1)

    expect(ctx.db.patch).toHaveBeenCalledWith(mockTaskId1, {
      isCompleted: false, // Toggled from true to false
    })
  })

  it('should reject toggling task from different tenant (cross-tenant security)', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        get: vi.fn().mockResolvedValue(mockTaskFromDifferentTenant),
        patch: vi.fn(),
        query: vi.fn(),
        insert: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await expect(
      toggleTaskCompletion(ctx as any, mockTaskFromDifferentTenant._id)
    ).rejects.toThrow('Unauthorized: Task belongs to different tenant')

    expect(ctx.db.patch).not.toHaveBeenCalled()
  })

  it('should throw error when task not found', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        get: vi.fn().mockResolvedValue(null), // Task not found
        patch: vi.fn(),
        query: vi.fn(),
        insert: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await expect(toggleTaskCompletion(ctx as any, mockTaskId1)).rejects.toThrow('Task not found')
  })

  it('should reject unauthenticated user', async () => {
    vi.mocked(getAuthUserWithTenant).mockRejectedValue(new Error('Unauthorized'))

    const ctx = {
      db: {
        get: vi.fn(),
        patch: vi.fn(),
        query: vi.fn(),
        insert: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await expect(toggleTaskCompletion(ctx as any, mockTaskId1)).rejects.toThrow('Unauthorized')
    expect(ctx.db.get).not.toHaveBeenCalled()
  })
})

describe('remove mutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should allow user to remove their own tenant task', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        get: vi.fn().mockResolvedValue(mockTask1),
        delete: vi.fn(),
        query: vi.fn(),
        insert: vi.fn(),
        patch: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await removeTask(ctx as any, mockTaskId1)

    expect(ctx.db.delete).toHaveBeenCalledWith(mockTaskId1)
  })

  it('should reject removing task from different tenant (cross-tenant security)', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        get: vi.fn().mockResolvedValue(mockTaskFromDifferentTenant),
        delete: vi.fn(),
        query: vi.fn(),
        insert: vi.fn(),
        patch: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await expect(
      removeTask(ctx as any, mockTaskFromDifferentTenant._id)
    ).rejects.toThrow('Unauthorized: Task belongs to different tenant')

    expect(ctx.db.delete).not.toHaveBeenCalled()
  })

  it('should throw error when task not found', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const ctx = {
      db: {
        get: vi.fn().mockResolvedValue(null), // Task not found
        delete: vi.fn(),
        query: vi.fn(),
        insert: vi.fn(),
        patch: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await expect(removeTask(ctx as any, mockTaskId1)).rejects.toThrow('Task not found')
  })

  it('should reject unauthenticated user', async () => {
    vi.mocked(getAuthUserWithTenant).mockRejectedValue(new Error('Unauthorized'))

    const ctx = {
      db: {
        get: vi.fn(),
        delete: vi.fn(),
        query: vi.fn(),
        insert: vi.fn(),
        patch: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await expect(removeTask(ctx as any, mockTaskId1)).rejects.toThrow('Unauthorized')
    expect(ctx.db.get).not.toHaveBeenCalled()
  })

  it('should actually delete task from database', async () => {
    vi.mocked(getAuthUserWithTenant).mockResolvedValue(mockAuth)

    const deleteTaskId = mockTaskId1

    const ctx = {
      db: {
        get: vi.fn().mockResolvedValue(mockTask1),
        delete: vi.fn(),
        query: vi.fn(),
        insert: vi.fn(),
        patch: vi.fn(),
      },
    } as unknown as MockQueryCtx

    await removeTask(ctx as any, deleteTaskId)

    // Verify delete was called with the correct task ID
    expect(ctx.db.delete).toHaveBeenCalledWith(deleteTaskId)
    expect(ctx.db.delete).toHaveBeenCalledTimes(1)
  })
})

/**
 * Coverage Summary:
 * - list: 5 tests covering RLS filtering, unauthenticated access, empty results, field inclusion, index usage
 * - add: 5 tests covering task creation, tenantId assignment, defaults, RLS enforcement
 * - toggle: 5 tests covering toggle both directions, cross-tenant security, errors, auth
 * - remove: 5 tests covering deletion, cross-tenant security, errors, auth, verification
 *
 * Total: 20 tests for tasks.ts RLS example endpoints
 *
 * Note: These tests mock the Convex query/mutation context and getAuthUserWithTenant helper.
 * The tasks file demonstrates Row-Level Security (RLS) patterns that are used throughout
 * the application to ensure multi-tenant data isolation.
 */
