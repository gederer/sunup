'use client'

/**
 * User Profile Page
 *
 * Displays current user information, roles, and provides sign-out functionality.
 *
 * Story: 1.5 - Integrate better-auth Authentication (Phase 4)
 */

import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@sunup/convex/_generated/api'
import { authClient } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfilePage() {
  const router = useRouter()
  const user = useQuery(api.users.current)

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/login')
  }

  if (user === undefined) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user === null) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <div className="space-y-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={user.isActive ? 'default' : 'destructive'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* User Roles */}
        <Card>
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Your assigned roles in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {user.roles && user.roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-sm">
                    {role}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No roles assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Technical information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="text-sm font-mono">{user._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tenant ID</span>
              <span className="text-sm font-mono">{user.tenantId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Account Created</span>
              <span className="text-sm">
                {new Date(user._creationTime).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
