# Clerk Authentication Integration

**Status:** Implemented (Story 1.5)
**Last Updated:** 2025-11-08
**Applies To:** All authenticated routes and user management features

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Configuration](#configuration)
4. [Protected Routes](#protected-routes)
5. [Authentication Patterns](#authentication-patterns)
6. [Invitation-Based Onboarding](#invitation-based-onboarding)
7. [User Profile](#user-profile)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [Security Best Practices](#security-best-practices)

---

## Overview

Sunup uses [Clerk](https://clerk.com) for authentication and user management, integrated with [Convex](https://convex.dev) for backend data persistence and multi-tenant row-level security (RLS).

**Key Features:**
- ✅ Secure authentication with JWT tokens
- ✅ Multi-tenant isolation via Convex RLS
- ✅ Invitation-based onboarding (public signup disabled)
- ✅ Protected routes via middleware
- ✅ Server and client component auth patterns
- ✅ Webhook-based user synchronization
- ✅ Profile management with Clerk UI

**Dependencies:**
- `@clerk/nextjs` v6.34.0
- `convex` v1.28.0
- `next` v16.0.0

---

## Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User attempts to access protected route                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Clerk Middleware checks authentication                  │
│    - Unauthenticated → Redirect to sign-in                 │
│    - Authenticated → Allow access                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Page/Component renders with Clerk user data             │
│    - Server: auth(), currentUser()                         │
│    - Client: useAuth(), useUser()                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Convex queries use RLS (getAuthUserWithTenant)          │
│    - Extract tenantId from Clerk JWT                       │
│    - Filter all data by tenantId                           │
└─────────────────────────────────────────────────────────────┘
```

### Webhook Synchronization

```
┌─────────────────────────────────────────────────────────────┐
│ User signs up/updates profile in Clerk                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Clerk fires webhook to Convex                              │
│ POST https://your-convex-deployment.convex.site/clerk      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ upsertFromClerk mutation (packages/convex/users.ts)        │
│ - Validates tenantId in public_metadata (required)         │
│ - Creates/updates user record in Convex                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

### Environment Variables

Required variables in `apps/web/.env.local`:

```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev

# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-deployment
```

**Security Note:** NEVER commit `.env.local` to git. Keep `CLERK_SECRET_KEY` confidential.

### Middleware Setup

**File:** `apps/web/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
```

### Root Layout

**File:** `apps/web/app/layout.tsx`

```typescript
import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/components/ConvexClientProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

**Provider Order Matters:**
1. ClerkProvider (outermost)
2. ConvexClientProvider (uses Clerk's useAuth)
3. Your app content

### Convex + Clerk Integration

**File:** `apps/web/components/ConvexClientProvider.tsx`

```typescript
'use client';

import { ReactNode } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
```

---

## Protected Routes

### Middleware-Level Protection

**Best for:** Entire route trees that should redirect unauthenticated users.

```typescript
const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',      // Protects /profile and all sub-routes
  '/dashboard(.*)',    // Protects /dashboard and all sub-routes
  '/admin(.*)',        // Protects /admin and all sub-routes
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();  // Redirects to sign-in if not authenticated
  }
});
```

### Component-Level Protection

**Best for:** Conditional rendering within a page.

```typescript
import { Authenticated, Unauthenticated } from '@clerk/nextjs';

export default function HomePage() {
  return (
    <>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>

      <Authenticated>
        <UserButton />
        <p>Welcome back!</p>
      </Authenticated>
    </>
  );
}
```

### Role-Based Protection

```typescript
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect({ role: 'org:admin' });
  }
});
```

---

## Authentication Patterns

### Server Component Pattern

**Recommended for:** Pages that need auth data on initial render.

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  // Get user ID
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get full user details
  const user = await currentUser();

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
```

### Client Component Pattern

**Recommended for:** Interactive components that need real-time auth state.

```typescript
'use client';

import { useAuth, useUser } from '@clerk/nextjs';

export function UserProfile() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) return <div>Not signed in</div>;

  return (
    <div>
      <p>User ID: {userId}</p>
      <p>Name: {user?.firstName} {user?.lastName}</p>
    </div>
  );
}
```

### Convex Query with RLS

**Critical:** All Convex queries MUST use RLS for multi-tenant security.

```typescript
import { query } from './_generated/server';
import { getAuthUserWithTenant } from './lib/auth';

export const current = query({
  handler: async (ctx) => {
    // REQUIRED: Get authenticated user with tenant isolation
    const { user, tenantId } = await getAuthUserWithTenant(ctx);
    return user;
  }
});

export const listTasks = query({
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    // Filter by tenantId for multi-tenant isolation
    return await ctx.db
      .query('tasks')
      .withIndex('by_tenant', (q) => q.eq('tenantId', tenantId))
      .collect();
  }
});
```

---

## Invitation-Based Onboarding

### Why Invitation-Only?

**Public signup is DISABLED** for Sunup. All users must be invited by authorized personnel (System Admins, Tenant Admins).

**Security Benefits:**
- ✅ Prevents unauthorized account creation
- ✅ Ensures all users belong to a valid tenant
- ✅ Maintains data isolation integrity
- ✅ Compliance with B2B SaaS security requirements

### How It Works

1. **Admin creates invitation** (Story 1.6.5 - full workflow)
   - Sets user email and tenantId
   - Stores invitation record in Convex
   - Sends invitation email with sign-up link

2. **User signs up via Clerk**
   - Clicks invitation link
   - Completes Clerk sign-up flow
   - Clerk sets `tenantId` in `publicMetadata` from invitation

3. **Webhook syncs to Convex**
   - `upsertFromClerk` validates `tenantId` exists
   - Creates user record with correct tenant association
   - Rejects signup if no valid invitation (throws error)

### Development Testing

**Option A: Use Dev Helper Mutation**

```typescript
// Run in Convex dashboard
await ctx.runMutation(api.invitations.createDevInvitation, {
  email: "test@example.com",
  tenantId: "<your-tenant-id>"
});
```

**Option B: Manual Metadata Setup**

1. Create user in Clerk dashboard
2. Navigate to user's profile
3. Set `publicMetadata`:
   ```json
   {
     "tenantId": "<your-convex-tenant-id>"
   }
   ```

**Testing Uninvited Users:**
- Attempt signup without invitation → Should see error:
  "Account registration requires an invitation. Please contact your organization's administrator."

### Webhook Handler

**File:** `packages/convex/users.ts`

```typescript
export const upsertFromClerk = internalMutation({
  args: { data: v.any() },
  async handler(ctx, { data }) {
    const user = await userByClerkId(ctx, data.id);

    if (user === null) {
      // New user signup - REQUIRE invitation (tenantId in metadata)
      const tenantId = (data.public_metadata as any)?.tenantId;

      if (!tenantId) {
        throw new Error(
          "Account registration requires an invitation. " +
          "Please contact your organization's administrator."
        );
      }

      // Create user with tenantId from invitation
      await ctx.db.insert("users", {
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
        email: data.email_addresses[0]?.email_address ?? "",
        clerkId: data.id,
        tenantId,
        isActive: true
      });
    } else {
      // Existing user - update profile only
      await ctx.db.patch(user._id, {
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
        email: data.email_addresses[0]?.email_address ?? ""
      });
    }
  }
});
```

---

## User Profile

### Profile Page

**Route:** `/profile`
**Protection:** Middleware-level (requires auth)
**Pattern:** Server Component

**Features:**
- ✅ Display user info (name, email, avatar, join date)
- ✅ Link to Clerk user settings for editing
- ✅ Styled with shadcn/ui components
- ✅ Responsive design

**Implementation:** See `apps/web/app/profile/page.tsx`

### Edit Profile

Users edit their profile via Clerk's built-in UI:
- Link: `https://your-clerk-domain.clerk.accounts.dev/user`
- Or use UserButton component (includes profile link)

---

## Testing

### Manual Testing Checklist

Story 1.5 uses manual testing (Story 1.11 will add automation).

**✅ Sign-Up Flow:**
- [ ] Create invitation for test email
- [ ] Click sign-up link
- [ ] Complete Clerk sign-up form
- [ ] Verify webhook creates user in Convex
- [ ] Check user has correct tenantId
- [ ] Test without invitation → verify error message

**✅ Sign-In Flow:**
- [ ] Click "Sign in" button
- [ ] Enter credentials
- [ ] Verify successful login (UserButton appears)
- [ ] Verify user data displayed correctly

**✅ Protected Routes:**
- [ ] Access `/profile` logged out → redirects to sign-in
- [ ] Log in → access `/profile` → page loads
- [ ] Verify middleware protection works
- [ ] Test `<Authenticated>` / `<Unauthenticated>` components

**✅ User Session:**
- [ ] Reload page while logged in → session persists
- [ ] Open in new tab → session shared
- [ ] Test across different browsers
- [ ] Test session timeout (default: 7 days)

**✅ Webhook:**
- [ ] Create user in Clerk → appears in Convex
- [ ] Update user in Clerk → Convex updates
- [ ] Test with/without tenantId metadata
- [ ] Verify error handling

**✅ Sign-Out:**
- [ ] Click UserButton → Sign out
- [ ] Session cleared
- [ ] Cannot access protected routes
- [ ] Test across multiple tabs

---

## Troubleshooting

### Common Issues

**1. "Unauthorized" error in Convex queries**

**Cause:** Missing RLS helper call
**Fix:** All queries must call `getAuthUserWithTenant(ctx)`

```typescript
// ❌ Wrong
export const myQuery = query({
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect();
  }
});

// ✅ Correct
export const myQuery = query({
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);
    return await ctx.db.query('tasks')
      .withIndex('by_tenant', (q) => q.eq('tenantId', tenantId))
      .collect();
  }
});
```

**2. "Account registration requires an invitation"**

**Cause:** User signing up without invitation
**Fix:** Create invitation first or set tenantId in Clerk metadata

**3. Middleware not protecting routes**

**Cause:** Route pattern not matching
**Fix:** Check matcher patterns use glob syntax correctly

```typescript
// Protects /profile and all sub-routes
'/profile(.*)'

// Protects only /profile (not /profile/edit)
'/profile'
```

**4. Session not persisting**

**Cause:** ClerkProvider not wrapping app
**Fix:** Verify provider hierarchy in layout.tsx

**5. Build errors with auth()**

**Cause:** Not awaiting auth() in Next.js 16
**Fix:** Always await: `const { userId } = await auth();`

---

## Security Best Practices

### 1. Environment Variables

- ✅ Keep `CLERK_SECRET_KEY` secret (never commit)
- ✅ Use `.env.local` for local development
- ✅ Use Vercel environment variables for production
- ✅ Rotate keys if compromised

### 2. Multi-Tenant Isolation

- ✅ ALWAYS use `getAuthUserWithTenant` in Convex queries
- ✅ NEVER accept tenantId as parameter from client
- ✅ Filter all queries by tenantId
- ✅ See `docs/multi-tenant-rls.md` for detailed patterns

### 3. Invitation-Based Onboarding

- ✅ Public signup DISABLED
- ✅ Validate tenantId in webhook
- ✅ Reject signups without invitation
- ✅ Audit invitation usage

### 4. Session Management

- ✅ Default session duration: 7 days (Clerk default)
- ✅ Sessions automatically refreshed
- ✅ Sign-out clears all sessions
- ✅ Consider MFA for sensitive tenants

### 5. Webhook Security

- ✅ Validate webhook signatures (implement in Story 1.6)
- ✅ Use HTTPS endpoints only
- ✅ Rate limit webhook endpoints
- ✅ Log webhook failures for monitoring

### 6. Protected Routes

- ✅ Use middleware-level protection (better UX)
- ✅ Validate auth server-side (never trust client)
- ✅ Redirect unauthenticated users to sign-in
- ✅ Implement role-based access for admin routes

---

## Related Documentation

- [Multi-Tenant RLS Guide](./multi-tenant-rls.md) - Comprehensive RLS patterns
- [Invitation Workflow Reference](./story-1.6.5-invitation-workflow-reference.md) - Full invitation system (Story 1.6.5)
- [Architecture Document](./architecture.md) - System architecture overview
- [Clerk Documentation](https://clerk.com/docs) - Official Clerk docs
- [Clerk + Next.js](https://clerk.com/docs/quickstarts/nextjs) - Next.js integration guide
- [Clerk + Convex](https://docs.convex.dev/auth/clerk) - Convex integration guide

---

## Changelog

- **2025-11-08:** Initial documentation (Story 1.5 - Integrate Clerk Authentication)
  - Comprehensive integration guide
  - Protected routes patterns
  - Invitation-based onboarding documentation
  - Testing procedures
  - Troubleshooting guide

---

_This documentation is the single source of truth for Clerk authentication integration. For questions or issues, refer to this document first, then consult the related documentation linked above._
