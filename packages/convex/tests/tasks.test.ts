/**
 * Task Management Tests (Clerk Authentication)
 * Story 1.6.5: Address Testing Debt from User Management
 *
 * Tests the RLS helper functions in lib/tasks.ts that enforce
 * tenant isolation for task management operations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Id } from '../_generated/dataModel'
import {
  listTasksForTenant,
  addTaskToTenant,
  toggleTaskCompletion,
  removeTask,
  type TasksQueryCtx,
  type TasksMutationCtx,
} from '../lib/tasks'

// Mock dependencies
vi.mock('../lib/auth', () => ({
  getAuthUserWithTenant: vi.fn(),
}))

import { getAuthUserWithTenant } from '../lib/auth'

describe('lib/tasks.ts - RLS Task Management', () => {
  const mockTenantId = 'tenant123' as Id<'tenants'>
  const mockOtherTenantId = 'tenant456' as Id<'tenants'>
  const mockUserId = 'user123' as Id<'users'>
  const mockTaskId = 'task123' as Id<'tasks'>

  const mockUser = {
    _id: mockUserId,
    _creationTime: Date.now(),
    clerkId: 'clerk_user123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    tenantId: mockTenantId,
  }

  const mockTask = {
    _id: mockTaskId,
    _creationTime: Date.now(),
    text: 'Test task',
    isCompleted: false,
    createdAt: Date.now(),
    tenantId: mockTenantId,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listTasksForTenant', () => {
    it('should list tasks for authenticated users tenant', async () => {
      const mockTasks = [mockTask]
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        take: vi.fn().mockResolvedValue(mockTasks),
      }

      const ctx = {
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as unknown as TasksQueryCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      const result = await listTasksForTenant(ctx)

      expect(getAuthUserWithTenant).toHaveBeenCalledWith(ctx)
      expect(ctx.db.query).toHaveBeenCalledWith('tasks')
      expect(mockQuery.withIndex).toHaveBeenCalledWith('by_tenant', expect.any(Function))
      expect(mockQuery.order).toHaveBeenCalledWith('desc')
      expect(mockQuery.take).toHaveBeenCalledWith(10)
      expect(result).toEqual(mockTasks)
    })

    it('should throw error when user is not authenticated', async () => {
      const ctx = {
        db: {
          query: vi.fn(),
        },
      } as unknown as TasksQueryCtx

      vi.mocked(getAuthUserWithTenant).mockRejectedValue(new Error('User not found'))

      await expect(listTasksForTenant(ctx)).rejects.toThrow('User not found')
    })

    it('should return empty array when tenant has no tasks', async () => {
      const mockQuery = {
        withIndex: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        take: vi.fn().mockResolvedValue([]),
      }

      const ctx = {
        db: {
          query: vi.fn().mockReturnValue(mockQuery),
        },
      } as unknown as TasksQueryCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      const result = await listTasksForTenant(ctx)

      expect(result).toEqual([])
    })
  })

  describe('addTaskToTenant', () => {
    it('should create task with authenticated users tenantId', async () => {
      const mockNewTaskId = 'newTask123' as Id<'tasks'>
      const taskText = 'New test task'

      const ctx = {
        db: {
          insert: vi.fn().mockResolvedValue(mockNewTaskId),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      const result = await addTaskToTenant(ctx, taskText)

      expect(getAuthUserWithTenant).toHaveBeenCalledWith(ctx)
      expect(ctx.db.insert).toHaveBeenCalledWith('tasks', {
        text: taskText,
        isCompleted: false,
        createdAt: expect.any(Number),
        tenantId: mockTenantId,
      })
      expect(result).toBe(mockNewTaskId)
    })

    it('should set isCompleted to false by default', async () => {
      const mockNewTaskId = 'newTask123' as Id<'tasks'>

      const ctx = {
        db: {
          insert: vi.fn().mockResolvedValue(mockNewTaskId),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      await addTaskToTenant(ctx, 'Test')

      const insertCall = vi.mocked(ctx.db.insert).mock.calls[0]
      expect(insertCall[1]).toMatchObject({ isCompleted: false })
    })

    it('should throw error when user is not authenticated', async () => {
      const ctx = {
        db: {
          insert: vi.fn(),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockRejectedValue(new Error('User not found'))

      await expect(addTaskToTenant(ctx, 'Test task')).rejects.toThrow('User not found')
    })
  })

  describe('toggleTaskCompletion', () => {
    it('should toggle task from incomplete to complete', async () => {
      const ctx = {
        db: {
          get: vi.fn().mockResolvedValue(mockTask),
          patch: vi.fn(),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      await toggleTaskCompletion(ctx, mockTaskId)

      expect(ctx.db.get).toHaveBeenCalledWith(mockTaskId)
      expect(ctx.db.patch).toHaveBeenCalledWith(mockTaskId, {
        isCompleted: true,
      })
    })

    it('should toggle task from complete to incomplete', async () => {
      const completedTask = { ...mockTask, isCompleted: true }

      const ctx = {
        db: {
          get: vi.fn().mockResolvedValue(completedTask),
          patch: vi.fn(),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      await toggleTaskCompletion(ctx, mockTaskId)

      expect(ctx.db.patch).toHaveBeenCalledWith(mockTaskId, {
        isCompleted: false,
      })
    })

    it('should throw error when task not found', async () => {
      const ctx = {
        db: {
          get: vi.fn().mockResolvedValue(null),
          patch: vi.fn(),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      await expect(toggleTaskCompletion(ctx, mockTaskId)).rejects.toThrow('Task not found')
      expect(ctx.db.patch).not.toHaveBeenCalled()
    })

    it('should throw error when task belongs to different tenant (RLS)', async () => {
      const otherTenantTask = { ...mockTask, tenantId: mockOtherTenantId }

      const ctx = {
        db: {
          get: vi.fn().mockResolvedValue(otherTenantTask),
          patch: vi.fn(),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      await expect(toggleTaskCompletion(ctx, mockTaskId)).rejects.toThrow(
        'Unauthorized: Task belongs to different tenant'
      )
      expect(ctx.db.patch).not.toHaveBeenCalled()
    })

    it('should throw error when user is not authenticated', async () => {
      const ctx = {
        db: {
          get: vi.fn(),
          patch: vi.fn(),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockRejectedValue(new Error('User not found'))

      await expect(toggleTaskCompletion(ctx, mockTaskId)).rejects.toThrow('User not found')
    })
  })

  describe('removeTask', () => {
    it('should delete task when it belongs to users tenant', async () => {
      const ctx = {
        db: {
          get: vi.fn().mockResolvedValue(mockTask),
          delete: vi.fn(),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      await removeTask(ctx, mockTaskId)

      expect(ctx.db.get).toHaveBeenCalledWith(mockTaskId)
      expect(ctx.db.delete).toHaveBeenCalledWith(mockTaskId)
    })

    it('should throw error when task not found', async () => {
      const ctx = {
        db: {
          get: vi.fn().mockResolvedValue(null),
          delete: vi.fn(),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      await expect(removeTask(ctx, mockTaskId)).rejects.toThrow('Task not found')
      expect(ctx.db.delete).not.toHaveBeenCalled()
    })

    it('should throw error when task belongs to different tenant (RLS)', async () => {
      const otherTenantTask = { ...mockTask, tenantId: mockOtherTenantId }

      const ctx = {
        db: {
          get: vi.fn().mockResolvedValue(otherTenantTask),
          delete: vi.fn(),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockResolvedValue({
        user: mockUser,
        tenantId: mockTenantId,
      })

      await expect(removeTask(ctx, mockTaskId)).rejects.toThrow(
        'Unauthorized: Task belongs to different tenant'
      )
      expect(ctx.db.delete).not.toHaveBeenCalled()
    })

    it('should throw error when user is not authenticated', async () => {
      const ctx = {
        db: {
          get: vi.fn(),
          delete: vi.fn(),
        },
      } as unknown as TasksMutationCtx

      vi.mocked(getAuthUserWithTenant).mockRejectedValue(new Error('User not found'))

      await expect(removeTask(ctx, mockTaskId)).rejects.toThrow('User not found')
    })
  })
})
