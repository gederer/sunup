'use client'

/**
 * Login Page with Magic Link Authentication
 *
 * Users enter their email and receive a magic link to sign in.
 * No passwords required - implements passwordless authentication flow.
 *
 * Story: 1.5 - Integrate better-auth Authentication (Phase 4)
 */

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/profile'

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Send magic link via better-auth
      const result = await authClient.signIn.magicLink({
        email,
        callbackURL: returnUrl,
      })

      if (result.error) {
        setMessage({
          type: 'error',
          text: result.error.message || 'Failed to send magic link',
        })
      } else {
        setMessage({
          type: 'success',
          text: 'Magic link sent! Check your email to sign in.',
        })
        setEmail('') // Clear email field
      }
    } catch (error) {
      console.error('Magic link error:', error)
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign in to Sunup
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a magic link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMagicLinkLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
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

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  How it works
                </span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>1. Enter your email address</p>
              <p>2. Receive a magic link in your inbox</p>
              <p>3. Click the link to sign in securely</p>
              <p className="text-xs mt-4">
                Note: Your account must be created by an administrator.
                Contact your system administrator if you need access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
