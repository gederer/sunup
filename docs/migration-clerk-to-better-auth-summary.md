# Correct-Course Workflow: Clerk → Better Auth Migration

**Status**: In Progress - Section 1 of 6 Complete
**Workflow**: `/bmad:bmm:workflows:correct-course` (Incremental Mode)
**Date**: 2025-11-08

---

## 1. Primary Request and Intent

### Initial Request
User requested guidance on **removing Clerk authentication completely** and replacing it with **better-auth** library. This came after discovering Clerk webhook integration was causing errors and didn't align with the desired authentication model.

### User's Explicit Requirements
1. **Remove all Clerk integration** from the project (not just fix webhooks)
2. **Replace with better-auth** for authentication
3. **Use magic links** for authentication (passwordless)
4. **Admin-created users only** - authorized users create accounts, new users receive magic links
5. **No self-signup** - no public registration
6. **Full stack integration**: Must work with:
   - Convex (serverless backend)
   - Next.js (web app)
   - React Native/Expo (mobile app)
   - Turborepo monorepo structure

### Process Request
User asked: **"What is the BMAD procedure for doing this?"**

I launched the **correct-course workflow** (`/bmad:bmm:workflows:correct-course`) which is specifically designed for handling significant architectural changes during sprint execution.

User selected **Incremental Mode** (option 1): Work through each change proposal collaboratively, refining one at a time.

---

## 2. Key Technical Concepts

### Authentication Architecture
- **Clerk** (current): JWT-based, webhook-driven user sync, OAuth social providers
- **better-auth** (target): Framework-agnostic, Convex-native, magic link support, admin-controlled user creation
- **Magic Links**: Passwordless authentication via email links
- **Admin-Created Users**: Authorized admins create user accounts directly in Convex, users receive magic links

### Technology Stack
- **Convex 1.28.0**: Serverless backend, real-time database
- **Next.js 16.0.0**: App Router, Server Components
- **React Native / Expo ~52.0.0**: Mobile app
- **Turborepo 2.6.0**: Monorepo build system
- **pnpm 10.20.0**: Package manager

### Better Auth Integration Packages
- **@convex-dev/better-auth**: Official Convex adapter (Trust Score 9.9)
- **@better-auth/expo**: Official Expo/React Native support
- **better-auth**: Core authentication library
- **better-auth-ui** (optional): shadcn/ui styled components

### Better Auth Plugins (Authorization)
- **Admin Plugin** (`better-auth/plugins/admin`): User management, role assignment, session control
- **Access Control Plugin** (`better-auth/plugins/access`): Fine-grained resource permissions
- Combined: Provides complete RBAC system for 12-role authorization model

### Multi-Tenant Security (RLS)
- Row-Level Security from Story 1.4
- All queries must call `getAuthUserWithTenant(ctx)`
- Tenant ID never accepted from client
- Better Auth must integrate with existing RLS patterns

### BMAD Workflows
- **correct-course workflow**: For navigating significant changes during sprint execution
- **Change Navigation Checklist**: 6-section systematic analysis
- **Sprint Change Proposal**: Output artifact documenting issue, impact, and recommendations

---

## 3. Files and Code Sections

### Files Already Modified (Webhook Removal)

#### `packages/convex/http.ts`
**Why Important**: Removed Clerk webhook handler that was causing errors
**Changes Made**: Deleted entire webhook route and validation logic

**Before** (108 lines):
```typescript
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Error occured", { status: 400 });
    }
    switch (event.type) {
      case "user.created":
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;
      case "user.deleted":
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }
    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;
```

**After** (8 lines):
```typescript
import { httpRouter } from "convex/server";

const http = httpRouter();

// Webhook handlers can be added here as needed
// Example: http.route({ path: "/example", method: "POST", handler: httpAction(...) })

export default http;
```

**Git Commit**: `refactor: Remove Clerk webhook handler for magic link auth model` (abd912d)

---

#### `packages/convex/users.ts`
**Why Important**: Removed webhook-based user sync mutations
**Changes Made**: Removed `upsertFromClerk` and `deleteFromClerk` mutations

**Before**:
```typescript
import {internalMutation, query, QueryCtx} from "./_generated/server";
import {UserJSON} from "@clerk/backend";
import {v, Validator} from "convex/values";
import {getAuthUserWithTenant} from "./lib/auth";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await getAuthUserWithTenant(ctx);
    return user;
  }
});

export const upsertFromClerk = internalMutation({
  args: {data: v.any() as Validator<UserJSON>},
  async handler(ctx, {data}) {
    const userAttributes = {
      firstName: data.first_name ?? "",
      lastName: data.last_name ?? "",
      email: data.email_addresses[0]?.email_address ?? "",
      clerkId: data.id,
      isActive: true
    };

    const user = await userByClerkId(ctx, data.id);
    if (user === null) {
      const tenantId = (data.public_metadata as any)?.tenantId;
      if (!tenantId) {
        throw new Error(
          "Account registration requires an invitation. " +
          "Please contact your organization's administrator to receive an invitation."
        );
      }
      await ctx.db.insert("users", {
        ...userAttributes,
        tenantId,
      });
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  }
});

export const deleteFromClerk = internalMutation({
  args: {clerkUserId: v.string()},
  async handler(ctx, {clerkUserId}) {
    const user = await userByClerkId(ctx, clerkUserId);
    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`);
    }
  }
});

// ... helper functions
```

**After**:
```typescript
import {query, QueryCtx} from "./_generated/server";
import {getAuthUserWithTenant} from "./lib/auth";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await getAuthUserWithTenant(ctx);
    return user;
  }
});

// getCurrentUserOrThrow and other helpers remain...
```

**Git Commit**: Same as above (abd912d)

---

### Files Referenced (Not Modified Yet)

#### `docs/stories/1-5-integrate-clerk-authentication.md`
**Why Important**: Current story being worked on, needs major revision
**Current Status**: "in-progress" with review follow-ups
**Needs**: Complete rewrite for better-auth migration

#### `docs/clerk-integration.md`
**Why Important**: 400+ line documentation of Clerk integration
**Action Needed**: Delete or replace with better-auth docs

#### `docs/story-1.6.5-invitation-workflow-reference.md`
**Why Important**: References webhook-based invitation model
**Action Needed**: Update for better-auth magic link model

#### `docs/architecture.md`
**Why Important**: Lists Clerk 6.34.0 as authentication decision
**Action Needed**: Update to reflect better-auth choice

#### `docs/epics.md`
**Why Important**: Epic 1 contains authentication stories
**Action Needed**: Review all Epic 1 stories for Clerk dependencies

#### `apps/web/middleware.ts`
**Why Important**: Contains Clerk middleware for protected routes
**Current Code**:
```typescript
import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```
**Action Needed**: Replace with better-auth middleware

#### `apps/web/app/layout.tsx`
**Why Important**: Wraps app with ClerkProvider
**Current Code**:
```typescript
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
```
**Action Needed**: Replace ClerkProvider with ConvexBetterAuthProvider

#### `apps/web/components/ConvexClientProvider.tsx`
**Why Important**: Integrates Clerk with Convex
**Current Code**:
```typescript
'use client'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export default function ConvexClientProvider({ children }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}
```
**Action Needed**: Replace with ConvexBetterAuthProvider

#### `apps/web/app/profile/page.tsx`
**Why Important**: Uses Clerk auth() and currentUser()
**Current Code** (excerpt):
```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }
  const user = await currentUser();
  // ... render profile
}
```
**Action Needed**: Replace with better-auth session access

#### `apps/web/app/page.tsx`
**Why Important**: Uses Clerk components (SignInButton, UserButton)
**Action Needed**: Replace with better-auth UI components

---

## 4. Errors and Fixes

### Error 1: Clerk Webhook Validation Failures
**Error Logs** (from user):
```
11/8/2025, 10:26:37 AM [CONVEX H(POST /clerk-users-webhook)]
Uncaught Error: Secret can't be empty.
    at new Webhook (../node_modules/.pnpm/svix@1.81.0/node_modules/svix/src/webhook.ts:48:17)
    at validateRequest (../packages/convex/http.ts:45:6)
```

**Root Cause**: Missing or incorrect `CLERK_WEBHOOK_SECRET` environment variable

**User Feedback**: "We're not going to allow users to sign up. Instead, authorized users will create accounts for new users, and the system will send new users magic links."

**Fix Applied**: Removed entire webhook handler (not just fixed the secret)
- Deleted webhook route from `packages/convex/http.ts`
- Deleted webhook mutations from `packages/convex/users.ts`
- Committed changes: `refactor: Remove Clerk webhook handler for magic link auth model`

---

### Error 2: Schema Validation Failure
**Error Logs** (from user):
```
11/8/2025, 10:49:14 AM [CONVEX M(users:upsertFromClerk)]
Uncaught Error: Failed to insert or update a document in table "users"
because it does not match the schema: Value does not match validator.
Path: .tenantId
Value: "default"
Validator: v.id("tenants")
```

**Root Cause**: Webhook receiving `tenantId: "default"` as string, but schema expects `v.id("tenants")` (Convex table ID reference)

**User Feedback**: Confirmed authentication model change - no self-signup, admin-created users only

**Fix Applied**: Removed webhook entirely as it's incompatible with desired model

---

### Error 3: Context Loss Risk
**User Message**: "Claude Code is about to auto-compact. Can you write this to a file so we don't lose anything?"

**Fix In Progress**: Creating this comprehensive summary document to preserve all context before auto-compact

---

## 5. Better Auth Admin Plugin & Authorization Architecture

### Admin Plugin Capabilities

The better-auth Admin plugin provides the perfect foundation for Sunup's admin-created user model:

**User Management:**
- `admin.createUser()`: Create users with email, password, name, and initial role(s)
- `admin.updateUser()`: Update user details and roles
- `admin.deleteUser()`: Remove users
- `admin.setRole()`: Assign single or multiple roles to users
- `admin.listUsers()`: Query users with filtering and sorting

**Session Management:**
- `admin.listUserSessions()`: View all sessions for a user
- `admin.revokeUserSession()`: Force logout specific sessions
- `admin.impersonateUser()`: Admin can impersonate users for support
- `admin.stopImpersonating()`: End impersonation session

**Security:**
- `admin.banUser()`: Ban users with optional expiration date
- `admin.unbanUser()`: Remove ban
- `admin.hasPermission()`: Check user permissions
- `admin.userHasPermission()`: Server-side permission verification

### Authorization Model: 12 Roles with Access Control

**Resource Definitions:**
```typescript
// packages/convex/auth/permissions.ts
import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  // CRM Resources
  person: ["create", "read", "update", "delete", "assign"],
  organization: ["create", "read", "update", "delete"],

  // Campaign & Dialer Resources
  campaign: ["create", "read", "update", "delete", "activate"],
  call: ["initiate", "answer", "transfer", "record"],

  // Meeting & Consultation Resources
  appointment: ["create", "read", "update", "cancel", "reassign"],
  meeting: ["create", "join", "end", "record"],

  // Commission Resources
  commission: ["create", "read", "approve", "dispute", "pay"],
  commissionRule: ["create", "read", "update", "delete"],

  // User & Admin Resources
  user: ["create", "read", "update", "delete", "ban", "impersonate"],
  tenant: ["create", "read", "update", "delete"],

  // Analytics & Reporting
  analytics: ["view", "export"],
  leaderboard: ["view", "manage"],

  // System Resources
  settings: ["read", "update"],
  audit: ["read"],
} as const;

export const ac = createAccessControl(statement);
```

**12 Role Permission Sets:**
```typescript
// Setter: Make calls, set appointments, view own commissions
export const setter = ac.newRole({
  person: ["read", "update", "assign"],
  call: ["initiate", "answer"],
  appointment: ["create"],
  commission: ["read"],
  leaderboard: ["view"],
});

// Consultant: Conduct meetings, close sales, view own commissions
export const consultant = ac.newRole({
  person: ["read", "update"],
  appointment: ["read", "update"],
  meeting: ["create", "join", "end"],
  organization: ["read", "update"],
  commission: ["read"],
  leaderboard: ["view"],
});

// Sales Manager: Oversee sales, manage pipeline, approve commissions
export const salesManager = ac.newRole({
  person: ["create", "read", "update", "delete"],
  organization: ["create", "read", "update", "delete"],
  appointment: ["create", "read", "update", "cancel", "reassign"],
  commission: ["read", "approve"],
  analytics: ["view", "export"],
  leaderboard: ["view", "manage"],
});

// Setter Manager: Manage campaigns, monitor setters, approve setter commissions
export const setterManager = ac.newRole({
  person: ["read", "assign"],
  campaign: ["create", "read", "update", "delete", "activate"],
  call: ["read", "transfer"],
  user: ["create", "read"], // Can create setter accounts
  commission: ["read", "approve"],
  analytics: ["view", "export"],
});

// Project Manager: Oversee installations, manage schedules
export const projectManager = ac.newRole({
  person: ["read", "update"],
  organization: ["read"],
  appointment: ["read"],
  analytics: ["view"],
});

// Installer: View assigned installations, update status
export const installer = ac.newRole({
  person: ["read"],
  organization: ["read"],
  appointment: ["read"],
});

// Recruiter: Manage contractor onboarding, create user accounts
export const recruiter = ac.newRole({
  user: ["create", "read", "update"],
  analytics: ["view"],
});

// Trainer: Manage training content, view trainee progress
export const trainer = ac.newRole({
  user: ["read"],
  leaderboard: ["view"],
  analytics: ["view"],
});

// System Admin: Full system access
export const systemAdmin = ac.newRole({
  person: ["create", "read", "update", "delete"],
  organization: ["create", "read", "update", "delete"],
  campaign: ["create", "read", "update", "delete", "activate"],
  appointment: ["create", "read", "update", "cancel", "reassign"],
  commission: ["create", "read", "approve", "dispute", "pay"],
  commissionRule: ["create", "read", "update", "delete"],
  user: ["create", "read", "update", "delete", "ban", "impersonate"],
  tenant: ["create", "read", "update", "delete"],
  analytics: ["view", "export"],
  settings: ["read", "update"],
  audit: ["read"],
});

// Executive: View-only analytics and reports
export const executive = ac.newRole({
  person: ["read"],
  organization: ["read"],
  analytics: ["view", "export"],
  leaderboard: ["view"],
  audit: ["read"],
});

// Finance: Manage commissions and payments
export const finance = ac.newRole({
  person: ["read"],
  commission: ["read", "approve", "dispute", "pay"],
  commissionRule: ["read"],
  analytics: ["view", "export"],
  audit: ["read"],
});

// Operations: Manage daily operations, view analytics
export const operations = ac.newRole({
  person: ["read", "update"],
  organization: ["read", "update"],
  appointment: ["read", "update"],
  analytics: ["view", "export"],
  settings: ["read"],
});
```

**Server-Side Setup:**
```typescript
// packages/convex/auth.ts
import { betterAuth } from "better-auth";
import { admin as adminPlugin, access } from "better-auth/plugins";
import { convex } from "@convex-dev/better-auth/plugins";
import { ac, setter, consultant, salesManager, setterManager,
         projectManager, installer, recruiter, trainer,
         systemAdmin, executive, finance, operations } from "./auth/permissions";

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: process.env.SITE_URL,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Magic links handle verification
    },
    plugins: [
      convex({ jwtExpirationSeconds: 900 }), // 15-minute JWT tokens

      // Admin plugin for user management
      adminPlugin({
        ac,
        roles: {
          setter,
          consultant,
          salesManager,
          setterManager,
          projectManager,
          installer,
          recruiter,
          trainer,
          systemAdmin,
          executive,
          finance,
          operations,
        },
        defaultRole: "setter", // Default for new users
        adminRoles: ["systemAdmin"], // Who can use admin endpoints
      }),

      // Access control for fine-grained permissions
      access({
        ac,
      }),
    ],
  });
```

**Client-Side Setup:**
```typescript
// lib/auth-client.ts (Next.js)
import { createAuthClient } from "better-auth/react";
import { adminClient, accessClient } from "better-auth/client/plugins";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { ac, setter, consultant, /* ... all roles ... */ } from "@/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
  plugins: [
    convexClient(),
    adminClient({
      ac,
      roles: {
        setter,
        consultant,
        // ... all 12 roles
      },
    }),
    accessClient(),
  ],
});
```

**Permission Checking Patterns:**

**Server-Side (Convex Functions):**
```typescript
// packages/convex/mutations/commissions.ts
import { mutation } from "./_generated/server";
import { getAuthUserWithTenant } from "./lib/auth";

export const approveCommission = mutation({
  args: { commissionId: v.id("commissions") },
  handler: async (ctx, args) => {
    const { user, tenantId } = await getAuthUserWithTenant(ctx);

    // Check permission via better-auth admin plugin
    const hasPermission = await ctx.auth.admin.hasPermission({
      userId: user._id,
      permissions: {
        commission: ["approve"],
      },
    });

    if (!hasPermission) {
      throw new Error("Unauthorized: Only Sales Managers and Finance can approve commissions");
    }

    // Proceed with approval...
  },
});
```

**Client-Side (React Components):**
```tsx
// apps/web/components/CommissionApprovalButton.tsx
import { authClient } from "@/lib/auth-client";

export function CommissionApprovalButton({ commissionId }) {
  const [canApprove, setCanApprove] = React.useState(false);

  React.useEffect(() => {
    authClient.admin.hasPermission({
      permissions: { commission: ["approve"] },
    }).then(result => setCanApprove(result));
  }, []);

  if (!canApprove) return null;

  return <Button onClick={() => approveCommission(commissionId)}>Approve</Button>;
}
```

**Admin User Creation Workflow:**
```typescript
// apps/web/app/admin/users/create/page.tsx
import { authClient } from "@/lib/auth-client";

async function createNewUser(data: {
  email: string;
  name: string;
  role: string;
  tenantId: string;
}) {
  // Admin creates user via better-auth admin plugin
  const result = await authClient.admin.createUser({
    email: data.email,
    password: crypto.randomUUID(), // Temporary password
    name: data.name,
    role: data.role,
    data: {
      tenantId: data.tenantId,
    },
  });

  // Send magic link for user to set their own password
  await authClient.signIn.magicLink({
    email: data.email,
    callbackURL: "/onboarding",
  });

  return result;
}
```

### Migration Benefits: Clerk vs Better Auth Admin

| Feature | Clerk | Better Auth Admin |
|---------|-------|-------------------|
| **User Creation** | Webhook-based sync | Direct admin API |
| **Role Assignment** | Custom metadata | Built-in role API |
| **Permission Checking** | Custom helpers | Built-in permission system |
| **Multi-Role Support** | Custom table | Native array support |
| **Fine-Grained Permissions** | Custom implementation | Access Control plugin |
| **Admin UI** | External dashboard | Can build custom with API |
| **Cost** | Per-user pricing | Self-hosted (free) |

### Integration with Story 1.4 RLS

The better-auth authorization integrates seamlessly with existing RLS patterns:

```typescript
// packages/convex/lib/auth.ts
export async function getAuthUserWithTenant(ctx: QueryCtx) {
  // Get authenticated user from better-auth
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  // Get user record with tenantId
  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_id", (q) => q.eq("authId", identity.subject))
    .unique();

  if (!user) throw new Error("User not found");

  // Get user roles and permissions
  const roles = await ctx.db
    .query("userRoles")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .collect();

  return {
    user,
    tenantId: user.tenantId,
    roles: roles.map(r => r.role),
  };
}
```

**All existing RLS patterns continue to work** - just swap authentication provider, authorization model becomes more powerful!

---

## 6. Better Auth Integration Patterns

### Key Pattern 1: Server-Side Better Auth Setup
```typescript
// packages/convex/auth.ts
import { betterAuth } from "better-auth";
import { GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { DataModel } from "./_generated/dataModel";

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: process.env.SITE_URL,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    plugins: [
      convex({ jwtExpirationSeconds: 900 }), // 15-minute JWT tokens
    ],
  });
```

### Key Pattern 2: Client Setup (Next.js)
```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
  plugins: [convexClient()],
});
```

### Key Pattern 3: React Provider
```typescript
// app/ConvexClientProvider.tsx
"use client";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!,
  { expectAuth: true }
);

export function ConvexClientProvider({ children }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
```

### Key Pattern 4: Expo/React Native Setup
```typescript
// apps/mobile/lib/auth-client.ts
import { createAuthClient } from "@better-auth/expo/client";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8081",
  plugins: [
    expoClient({
      scheme: "myapp",
      storagePrefix: "myapp",
      storage: SecureStore,
    })
  ]
});
```

---

## 6. Change Navigation Checklist Status

### Completed Sections ✅

- [x] **Section 1: Understand the Trigger and Context** ✅
  - [x] 1.1: Identify triggering story (Story 1.5)
  - [x] 1.2: Define core problem (strategic pivot)
  - [x] 1.3: Assess impact & evidence (webhook failures)

- [x] **Section 2: Epic Impact Assessment** ✅
  - [x] 2.1: Epic 1 evaluated (Stories 1.5 and 1.6 affected)
  - [x] 2.2: Epic-level changes determined (redefine Story 1.5, update Story 1.6)
  - [x] 2.3: Remaining epics reviewed (Epic 2-6 have zero dependencies)
  - [x] 2.4: Future epics validated (no invalidation)
  - [x] 2.5: Epic order considered (no reordering needed)

- [x] **Section 3: Artifact Conflict Analysis** ✅
  - [x] 3.1: PRD conflicts checked (LOW impact - 3 references)
  - [x] 3.2: Architecture document reviewed (MODERATE impact - 6 sections)
  - [x] 3.3: UI/UX specs examined (LOW impact - component updates)
  - [x] 3.4: Other artifacts identified (8 docs need updates)

- [x] **Section 4: Path Forward Evaluation** ✅
  - [x] 4.1: Direct Adjustment evaluated (RECOMMENDED)
  - [x] 4.2: Rollback option evaluated (REJECTED)
  - [x] 4.3: PRD MVP Review evaluated (not needed)
  - [x] 4.4: Recommended path selected (Direct Adjustment)

- [x] **Section 5: Sprint Change Proposal** ✅
  - [x] 5.1: Issue summary created
  - [x] 5.2: Epic impact documented
  - [x] 5.3: Recommended path detailed (5-phase implementation)
  - [x] 5.4: MVP impact assessed (none)
  - [x] 5.5: Handoff plan established

- [x] **Section 6: Final Review** ✅
  - [x] 6.1: Checklist completion reviewed
  - [x] 6.2: Proposal accuracy verified
  - [x] 6.3: User approval requested
  - [x] 6.4: Next steps defined

### Sprint Change Proposal - COMPLETE ✅

**Status:** Ready for user decision

**Recommendation:** ✅ **APPROVE Direct Adjustment Path**

**Summary:**
- **Change:** Clerk → better-auth with Admin plugin
- **Scope:** Epic 1, Stories 1.5 & 1.6 only
- **Timeline:** +3 days (5-6 days total)
- **Risk:** LOW
- **MVP Impact:** None (requirements exceeded)
- **Benefits:** Better alignment, reduced complexity, cost savings, superior RBAC

**Awaiting User Decision:**
- **Option A:** ✅ APPROVE - Proceed with 5-phase implementation
- **Option B:** ⏸️ PAUSE - Discuss concerns
- **Option C:** ❌ REJECT - Revert to Clerk

---

## 7. Implementation Plan (Upon Approval)

### Phase 1: Remove Clerk (1 day)
- Remove Clerk dependencies from package.json
- Delete Clerk components, providers, middleware
- Remove environment variables
- Commit checkpoint

### Phase 2: Install better-auth (1 day)
- Install better-auth packages
- Configure Convex adapter
- Setup environment variables
- Commit checkpoint

### Phase 3: Implement Authorization (2 days)
- Define 12-role permission sets
- Configure Admin plugin
- Implement permission helpers
- Update RLS integration
- Commit checkpoint

### Phase 4: Update UI (1 day)
- Replace auth providers
- Update middleware
- Create admin UI
- Test auth flows
- Commit checkpoint

### Phase 5: Documentation (1 day)
- Update 8 documentation files
- Create better-auth-integration.md
- Update story acceptance criteria
- Write/update tests
- Final commit

### Rollback Plan
- Git tag: `pre-better-auth-migration`
- Independent phase commits
- Can rollback at any checkpoint

**Total Timeline:** 5-6 days
**Risk Level:** LOW
**Epic 1 Impact:** +3 days (within buffer)

### Implementation (After Proposal Approval)
- [ ] Remove all Clerk dependencies from package.json files
- [ ] Install better-auth packages (@convex-dev/better-auth, @better-auth/expo)
- [ ] Create better-auth configuration in packages/convex/auth.ts
- [ ] Update all affected files (15+ files identified)
- [ ] Create/update documentation
- [ ] Test authentication flows (web + mobile)
- [ ] Update Story 1.5 or create new story
- [ ] Update Epic 1 in docs/epics.md

---

## 7. Section 1 Completion Summary

**Check 1.1: Triggering Story** ✅
- Story ID: Story 1.5 (Integrate Clerk Authentication)
- Status: in-progress
- Description: Clerk integration causing webhook failures

**Check 1.2: Core Problem Definition** ✅
- Problem Type: Strategic pivot / Technical decision change
- Clear Statement: Clerk doesn't align with admin-created users + magic link model
- Better Auth provides: Native Convex support, Expo integration, simpler architecture

**Check 1.3: Impact & Evidence** ✅
Evidence gathered:
1. Webhook failures (secret validation, schema mismatches)
2. Architecture misalignment (webhook vs admin-created users)
3. Better Auth advantages (official Convex component, Expo support)
4. Documentation already created (can be replaced)

---

## Next Step: Section 2 - Epic Impact Assessment

The next phase will evaluate Epic 1 (Foundation & Core Setup) to determine:
- Which stories in Epic 1 need modification
- If Story 1.5 should be redefined or replaced
- Review remaining epics for Clerk dependencies
- Assess if epic order/priorities need adjustment
