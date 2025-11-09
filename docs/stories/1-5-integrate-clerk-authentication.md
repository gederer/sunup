# Story 1.5: Integrate Clerk Authentication

Status: ready-for-dev

## Story

As a Developer,
I want Clerk authentication integrated with Next.js,
So that users can securely sign in and access the application.

## Acceptance Criteria

1. Clerk installed and configured with Next.js middleware (AC: #1)
2. Sign-in and sign-up flows working via Clerk components (AC: #2)
3. Protected routes require authentication (redirect to sign-in if not authenticated) (AC: #3)
4. User session accessible in server and client components (AC: #4)
5. Clerk webhook configured for user sync to Convex database (AC: #5)
6. User profile page displays Clerk user data (AC: #6)
7. Sign-out functionality working correctly (AC: #7)

## Tasks / Subtasks

- [ ] Verify Clerk configuration and middleware (AC: #1)
  - [ ] Confirm Clerk middleware configured in `apps/web/middleware.ts`
  - [ ] Verify environment variables set (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
  - [ ] Test Clerk dashboard connectivity
  - [ ] Verify ClerkProvider wrapping app in layout.tsx

- [ ] Verify sign-in and sign-up flows (AC: #2)
  - [ ] Test SignInButton modal opens correctly
  - [ ] Test SignUpButton modal opens correctly
  - [ ] Verify users can complete sign-up flow
  - [ ] Verify users can sign in with existing credentials
  - [ ] Test error handling for invalid credentials

- [ ] Implement and test protected routes (AC: #3)
  - [ ] Review current middleware route protection
  - [ ] Add route-level protection for sensitive pages (if needed)
  - [ ] Test unauthenticated users redirected to sign-in
  - [ ] Test authenticated users can access protected pages
  - [ ] Verify `<Authenticated>` / `<Unauthenticated>` components work

- [ ] Verify user session accessibility (AC: #4)
  - [ ] Test `useAuth()` hook in client components
  - [ ] Test `auth()` helper in server components/actions
  - [ ] Verify UserButton displays user info
  - [ ] Test session persistence across page reloads

- [ ] Verify Clerk webhook for user sync (AC: #5)
  - [ ] Review `packages/convex/users.ts` - upsertFromClerk webhook
  - [ ] Verify webhook endpoint configured in Clerk dashboard
  - [ ] Test new user creation syncs to Convex
  - [ ] Test user updates sync to Convex
  - [ ] Verify tenantId requirement from Story 1.4 (invitation-based onboarding)
  - [ ] Test webhook handles errors gracefully

- [ ] Create user profile page (AC: #6)
  - [ ] Create `/profile` route (if doesn't exist)
  - [ ] Display user data: firstName, lastName, email
  - [ ] Display Clerk profile image
  - [ ] Add "Edit Profile" link to Clerk user settings
  - [ ] Style profile page with shadcn/ui components
  - [ ] Test profile page displays correct data

- [ ] Verify sign-out functionality (AC: #7)
  - [ ] Confirm UserButton includes sign-out option
  - [ ] Test sign-out clears session
  - [ ] Verify user redirected after sign-out
  - [ ] Test sign-out on multiple tabs/windows

- [ ] Create authentication documentation (Bonus)
  - [ ] Document Clerk + Convex integration patterns
  - [ ] Document protected route patterns
  - [ ] Document webhook setup
  - [ ] Add troubleshooting guide
  - [ ] Link documentation in README.md

## Dev Notes

### Architecture Context

**Story Context:** This is Story 1.5, building on the Convex + RLS foundation (Stories 1.3 and 1.4). Clerk authentication basics were initialized during early setup, but this story formally verifies, completes, and documents the integration for production readiness.

**Current Status (Post-Story 1.4):**
- Clerk is already substantially integrated (from initial setup)
- `apps/web/middleware.ts` has `clerkMiddleware` configured
- `apps/web/app/layout.tsx` wraps app with `ClerkProvider`
- `apps/web/components/ConvexClientProvider.tsx` uses `ConvexProviderWithClerk`
- `apps/web/app/page.tsx` demonstrates auth flow: SignInButton, SignUpButton, UserButton
- `packages/convex/users.ts` has `upsertFromClerk` webhook handler
- Environment variables configured: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
- Basic authenticated/unauthenticated UI shown with `<Authenticated>` / `<Unauthenticated>` components

**Target State:**
- All acceptance criteria verified as working
- Missing pieces implemented (dedicated profile page, documentation)
- Protected routes tested and working
- Webhook fully tested with invitation-based onboarding (tenantId requirement from Story 1.4)
- Complete documentation for developers

### Learnings from Previous Story

**From Story 1.4 (Status: done)**

**Critical Security Requirement - Invitation-Based Onboarding:**
- **Public signup DISABLED**: Users must be invited by authorized personnel
- `upsertFromClerk` requires `tenantId` in Clerk public metadata
- Throws error for uninvited users: "Account registration requires an invitation"
- Development helper available: `createDevInvitation` mutation (manual Clerk metadata setup)
- Story 1.6.5 will implement full invitation workflow

**Implementation Pattern:**
```typescript
// packages/convex/users.ts - upsertFromClerk (Story 1.4 fix)
if (user === null) {
  const tenantId = (data.public_metadata as any)?.tenantId;

  if (!tenantId) {
    throw new Error(
      "Account registration requires an invitation. " +
      "Please contact your organization's administrator."
    );
  }

  // Create user with tenantId from invitation
  await ctx.db.insert("users", {
    ...userAttributes,
    tenantId,
  });
}
```

**For Story 1.5 Testing:**
1. **Cannot test with regular Clerk signup** - public signup is disabled
2. **Must use invitation-based testing:**
   - Option A: Run `createDevInvitation` mutation in Convex dashboard
   - Option B: Manually set `tenantId` in Clerk user public metadata
   - Option C: Wait for Story 1.6.5 full invitation workflow
3. **Test webhook with invited users only**
4. **Verify error message for uninvited users**

**New Services/Files Created (Story 1.4):**
- `packages/convex/lib/auth.ts` - RLS helper functions (reuse `getAuthUserWithTenant` for protected queries)
- `packages/convex/invitations.ts` - Development invitation helper
- `docs/multi-tenant-rls.md` - RLS documentation (reference for secure patterns)

**Files Modified (Story 1.4):**
- `packages/convex/users.ts` - Updated with invitation requirement in `upsertFromClerk`
- `packages/convex/schema.ts` - All tables have tenantId and by_tenant indexes

**Testing Notes:**
- Story 1.11 will add automated testing infrastructure (Vitest/Playwright)
- For Story 1.5, use manual testing procedures
- Focus on invitation-based onboarding flow (different from standard Clerk tutorials)

[Source: stories/1-4-implement-multi-tenant-row-level-security-rls-foundation.md#Dev-Agent-Record]

### Project Structure Notes

**Expected Structure:**
```
sunup/
├── apps/
│   └── web/
│       ├── middleware.ts           # Clerk middleware (already exists)
│       ├── app/
│       │   ├── layout.tsx          # ClerkProvider wrapper (already exists)
│       │   ├── page.tsx            # Home with auth demo (already exists)
│       │   └── profile/            # NEW: User profile page
│       │       └── page.tsx
│       └── components/
│           └── ConvexClientProvider.tsx  # Convex+Clerk integration (already exists)
├── packages/
│   └── convex/
│       ├── users.ts                # Webhook handler (already exists, updated in Story 1.4)
│       ├── invitations.ts          # Dev helper (created in Story 1.4)
│       └── lib/
│           └── auth.ts             # RLS helpers (created in Story 1.4)
└── docs/
    ├── clerk-integration.md        # NEW: Clerk integration docs
    └── multi-tenant-rls.md         # Created in Story 1.4
```

**Alignment with Previous Stories:**
- Story 1.1: Monorepo structure at `apps/web/` and `packages/convex/`
- Story 1.2: Use shadcn/ui components for profile page
- Story 1.3: Convex backend at `packages/convex/`
- Story 1.4: RLS helpers available - use `getAuthUserWithTenant` for profile queries

### Key Implementation Patterns

**1. Protected Route Pattern (Middleware):**
```typescript
// apps/web/middleware.ts
import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/dashboard(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

**2. Server Component Auth Pattern:**
```typescript
// app/profile/page.tsx (Server Component)
import { auth } from '@clerk/nextjs/server'

export default async function ProfilePage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  // Query user from Convex using userId
  return <div>Profile Content</div>
}
```

**3. Client Component Auth Pattern:**
```typescript
// Client component
import { useAuth, useUser } from '@clerk/nextjs'

function UserProfile() {
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()

  if (!isLoaded || !userId) return <div>Loading...</div>

  return <div>{user?.firstName}</div>
}
```

**4. Convex Query with Auth (from Story 1.4):**
```typescript
// packages/convex/users.ts
export const current = query({
  handler: async (ctx) => {
    const { user } = await getAuthUserWithTenant(ctx);
    return user;
  }
});
```

### Testing Strategy

**Manual Testing (Story 1.5):**
1. **Invitation Setup:**
   - Create test tenant in Convex dashboard (if needed)
   - Run `createDevInvitation` mutation for test email
   - Manually set tenantId in Clerk user metadata (if using existing user)

2. **Sign-Up Flow:**
   - Click "Sign up" button
   - Complete Clerk sign-up form
   - Verify webhook creates user in Convex (check Convex dashboard)
   - If no invitation: verify error message shown
   - If invited: verify user created with correct tenantId

3. **Sign-In Flow:**
   - Click "Sign in" button
   - Enter credentials
   - Verify successful login (UserButton appears)
   - Verify user data displayed correctly

4. **Protected Routes:**
   - Access `/profile` while logged out → verify redirect to sign-in
   - Log in, access `/profile` → verify page loads
   - Log out → verify redirect away from protected page

5. **User Session:**
   - Reload page while logged in → verify session persists
   - Open in new tab → verify session shared
   - Test across different browsers

6. **Webhook:**
   - Create new test user in Clerk dashboard
   - Set tenantId in public metadata
   - Verify user appears in Convex `users` table
   - Update user info in Clerk → verify Convex updates

7. **Sign-Out:**
   - Click UserButton → Sign out
   - Verify session cleared
   - Verify cannot access protected routes after sign-out

**Note:** Story 1.11 will add automated test infrastructure (Vitest + Playwright). For Story 1.5, document test procedures and run manual tests.

### Security Considerations

**Critical Security Principles (from Story 1.4):**
- **Never accept tenantId from client** - always extract from authenticated context
- **Public signup disabled** - invitation-based onboarding only
- **All queries use RLS** - call `getAuthUserWithTenant(ctx)` in every query/mutation

**Clerk Security Best Practices:**
1. **Environment Variables:** Keep CLERK_SECRET_KEY secret (never commit to git)
2. **HTTPS Only:** Clerk requires HTTPS in production (Vercel handles this)
3. **Webhook Security:** Clerk webhook should verify signature (implement in Story 1.6 if needed)
4. **Session Duration:** Default Clerk session duration is reasonable for B2B SaaS
5. **Multi-Factor Auth:** Clerk supports MFA - can enable per tenant in future story

### Potential Gotchas

1. **Invitation Requirement:**
   - Standard Clerk tutorials show public signup
   - Sunup requires invitation (tenantId in metadata)
   - Test users must be invited or have metadata manually set

2. **Webhook Timing:**
   - User creation in Clerk → webhook fires → user appears in Convex
   - There's a small delay (usually <1 second)
   - If querying immediately after signup, user might not exist yet

3. **Middleware Route Matching:**
   - Middleware matcher uses glob patterns
   - Must exclude static files and Next.js internals
   - Test that static assets still load (images, CSS, JS)

4. **ConvexProviderWithClerk:**
   - Must wrap with ClerkProvider first (layout.tsx order matters)
   - `useAuth` hook must come from `@clerk/nextjs` (not `@clerk/clerk-react`)

5. **Protected Routes:**
   - Middleware protection vs. component-level protection
   - Middleware redirects before page loads (better UX)
   - Component-level shows loading state (use for partial protection)

6. **User Metadata:**
   - Clerk has `publicMetadata`, `privateMetadata`, `unsafeMetadata`
   - `publicMetadata` is visible to client (use for tenantId)
   - `privateMetadata` is server-only (use for sensitive data)
   - Story 1.4 sets tenantId in `publicMetadata` (safe for client visibility)

### References

- [Source: docs/epics.md#Story-1.5] - Story definition and acceptance criteria (lines 152-168)
- [Source: docs/architecture.md#Authentication] - Clerk + Convex integration patterns
- [Clerk Documentation] - https://clerk.com/docs
- [Clerk + Next.js] - https://clerk.com/docs/quickstarts/nextjs
- [Clerk + Convex] - https://docs.convex.dev/auth/clerk
- [Clerk Webhooks] - https://clerk.com/docs/integrations/webhooks/overview
- [Source: stories/1-4-implement-multi-tenant-row-level-security-rls-foundation.md] - RLS patterns and invitation requirement

## Dev Agent Record

### Context Reference

- docs/stories/1-5-integrate-clerk-authentication.context.xml (Generated: 2025-11-08)

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-08: Story drafted by create-story workflow from epics.md (Story 1.5, lines 152-168)
