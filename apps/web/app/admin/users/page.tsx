'use client'

/**
 * Admin Users List Page
 *
 * Displays all users and provides access to user management functions.
 * Accessible to System Administrators, Recruiters, and Trainers.
 *
 * Story: 1.5 - Integrate better-auth Authentication (Phase 4)
 */

import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@sunup/convex/_generated/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function UsersListPage() {
  const router = useRouter()
  const currentUser = useQuery(api.users.current)

  if (currentUser === undefined) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentUser === null) {
    router.push('/login')
    return null
  }

  // Check if user has permission to view users
  const canManageUsers = currentUser.roles?.some(role =>
    ['System Administrator', 'Recruiter', 'Trainer', 'Sales Manager', 'Setter Manager'].includes(role)
  )

  if (!canManageUsers) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to view users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Contact your system administrator if you need access.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/profile')}
              className="mt-4"
            >
              Go to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users and their roles
          </p>
        </div>
        {currentUser.roles?.some(role =>
          ['System Administrator', 'Recruiter', 'Trainer'].includes(role)
        ) && (
          <Button onClick={() => router.push('/admin/users/create')}>
            Create User
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            All users in the system (tenant-filtered)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              User list will be implemented with the listUsers query
            </p>
            <p className="text-sm text-muted-foreground">
              Note: listUsers mutation needs to be converted to a query for real-time updates
            </p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => router.push('/profile')}>
                Back to Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
