'use client'

/**
 * Admin User Creation Page
 *
 * Allows administrators with "user:create" permission to create new users
 * and assign roles. Only accessible to System Administrators, Recruiters, and Trainers.
 *
 * Story: 1.5 - Integrate better-auth Authentication (Phase 4)
 */

import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@sunup/convex/_generated/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const AVAILABLE_ROLES = [
  'Setter',
  'Setter Trainee',
  'Setter Manager',
  'Consultant',
  'Sales Manager',
  'Lead Manager',
  'Project Manager',
  'Installer',
  'Support Staff',
  'Recruiter',
  'Trainer',
  'System Administrator',
  'Executive',
  'Finance',
  'Operations',
]

export default function CreateUserPage() {
  const router = useRouter()
  const currentUser = useQuery(api.users.current)
  const createUserMutation = useMutation(api.invitations.createUser)

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    tenantId: '',
  })
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Setter'])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await createUserMutation({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        tenantId: formData.tenantId as any, // Use current user's tenant
        roles: selectedRoles,
      })

      setMessage({
        type: 'success',
        text: `User ${formData.email} created successfully! They will receive a magic link to sign in.`,
      })

      // Reset form
      setFormData({ email: '', firstName: '', lastName: '', tenantId: '' })
      setSelectedRoles(['Setter'])

      // Redirect to users list after 2 seconds
      setTimeout(() => {
        router.push('/admin/users')
      }, 2000)
    } catch (error: any) {
      console.error('Create user error:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Failed to create user. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  if (currentUser === undefined) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
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

  // Check if user has permission to create users
  const canCreateUsers = currentUser.roles?.some(role =>
    ['System Administrator', 'Recruiter', 'Trainer'].includes(role)
  )

  if (!canCreateUsers) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to create users.
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

  // Auto-set tenant ID from current user
  if (!formData.tenantId && currentUser.tenantId) {
    setFormData(prev => ({ ...prev, tenantId: currentUser.tenantId }))
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push('/admin/users')}>
          ← Back to Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <CardDescription>
            Add a new user to the system and assign roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  User will receive a magic link at this email to sign in
                </p>
              </div>
            </div>

            {/* Roles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Roles</h3>
              <p className="text-sm text-muted-foreground">
                Select one or more roles for this user
              </p>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_ROLES.map(role => (
                  <Badge
                    key={role}
                    variant={selectedRoles.includes(role) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => !isLoading && toggleRole(role)}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading || selectedRoles.length === 0}
              >
                {isLoading ? 'Creating User...' : 'Create User'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/users')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
