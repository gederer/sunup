'use client'

/**
 * Home Page
 *
 * Landing page with authentication status and navigation.
 *
 * Story: 1.5 - Integrate better-auth Authentication (Phase 4)
 */

import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@sunup/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  const router = useRouter()
  const user = useQuery(api.users.current)

  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        <span className="font-semibold">Sunup - Solar Installation Management</span>
        <div className="flex gap-2">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => router.push('/profile')}>
                Profile
              </Button>
              {user.roles?.some((role: string) =>
                ['System Administrator', 'Recruiter', 'Trainer'].includes(role)
              ) && (
                <Button variant="ghost" onClick={() => router.push('/admin/users')}>
                  Admin
                </Button>
              )}
            </>
          ) : (
            <Button variant="default" onClick={() => router.push('/login')}>
              Sign In
            </Button>
          )}
        </div>
      </header>
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">Sunup</h1>

        <div className="max-w-4xl mx-auto w-full space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Sunup</CardTitle>
              <CardDescription>
                Enterprise solar installation management platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Signed in as:</span>
                    <span className="font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <Badge variant="secondary">{user.email}</Badge>
                  </div>
                  {user.roles && user.roles.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">Roles:</span>
                      <div className="flex gap-2 flex-wrap">
                        {user.roles.map((role: string) => (
                          <Badge key={role} variant="outline">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <Button onClick={() => router.push('/profile')}>
                      View Profile
                    </Button>
                    {user.roles?.some((role: string) =>
                      ['System Administrator', 'Recruiter', 'Trainer'].includes(role)
                    ) && (
                      <Button variant="outline" onClick={() => router.push('/admin/users/create')}>
                        Create User
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    Sign in to access your solar installation management tools.
                  </p>
                  <Button onClick={() => router.push('/login')}>Sign In</Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Phase 4 - UI Integration Complete</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">✓</Badge>
                <span className="text-sm">better-auth with Admin plugin configured</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">✓</Badge>
                <span className="text-sm">12-role RBAC permission system</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">✓</Badge>
                <span className="text-sm">Magic link passwordless authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">✓</Badge>
                <span className="text-sm">Multi-tenant row-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">✓</Badge>
                <span className="text-sm">Route protection middleware</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
