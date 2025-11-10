# Story 1.7.5: User Invitation Workflow (Basic Implementation)

**Status:** Not yet created in epics.md (reference document)
**Prerequisite:** Story 1.7 (RBAC implemented)
**Priority:** Must be in Epic 1 (required for user onboarding)

---

## Context

**Why This Story is Needed:**
- Public signup is disabled for security (Story 1.4 RLS requirement)
- Users must be invited by authorized personnel (Recruiter, Trainer, Manager, System Admin)
- `tenantId` must be assigned during invitation process (not at signup time)

**Current State (Post-Story 1.4):**
- `upsertFromClerk` requires `tenantId` in Clerk public metadata
- Throws error for uninvited users: "Account registration requires an invitation"
- Development helper exists: `createDevInvitation` (manual Clerk metadata setup)

**Target State:**
- Authorized users can invite new users via UI
- Invitation email sent with magic link (via Clerk)
- `tenantId` automatically set during invitation process
- Invited users can complete signup successfully

---

## Story Definition

**As a** Recruiter/Trainer/Manager/System Administrator,
**I want** to invite new users to the platform,
**So that** they can create accounts with the correct tenant assignment.

---

## Acceptance Criteria (Basic Implementation)

### 1. Schema: `userInvitations` table
- Fields: `email`, `tenantId`, `invitedBy`, `role`, `status`, `createdAt`
- Indexes: `by_email`, `by_tenant`, `by_status`
- Status enum: `"pending"`, `"accepted"`, `"cancelled"`

### 2. Mutation: `inviteUser` (RBAC-protected)
- Requires role: Recruiter, Trainer, Setter Manager, Sales Manager, or System Administrator
- Creates invitation record in database
- Uses Clerk API to:
  - Create invitation in Clerk
  - Set `tenantId` in invitation metadata (public_metadata)
  - Set initial role (e.g., "Setter Trainee")
- Returns invitation status

### 3. Updated `upsertFromClerk` webhook handler
- Check if user was invited (query `userInvitations` by email)
- If invitation exists:
  - Extract `tenantId` from invitation record (or Clerk metadata as fallback)
  - Create user with assigned `tenantId`
  - Mark invitation as "accepted"
- If no invitation exists:
  - Throw error: "Account registration requires an invitation"

### 4. Query: `listPendingInvitations` (for admins)
- Returns pending invitations for current tenant
- Includes: email, role, invited by, created date

### 5. Mutation: `cancelInvitation` (RBAC-protected)
- Requires role: Same as `inviteUser`
- Marks invitation as "cancelled"
- Cannot cancel accepted invitations

### 6. Documentation
- Update `docs/multi-tenant-rls.md` with invitation workflow
- Add developer guide: "How to invite users"

### 7. Manual testing procedures
- Test: Authorized user can invite new user
- Test: Invitation email received (check Clerk dashboard)
- Test: Invited user can signup successfully
- Test: Uninvited user cannot signup
- Test: tenantId correctly assigned

---

## Implementation Notes

### Schema Addition

```typescript
// packages/convex/schema.ts
userInvitations: defineTable({
  email: v.string(),
  tenantId: v.id("tenants"),
  invitedBy: v.id("users"),
  role: v.string(), // Initial role assignment (e.g., "Setter Trainee")
  status: v.union(
    v.literal("pending"),
    v.literal("accepted"),
    v.literal("cancelled")
  ),
  createdAt: v.number(),
})
  .index("by_email", ["email"])
  .index("by_tenant", ["tenantId"])
  .index("by_status", ["status"])
  .index("by_tenant_and_status", ["tenantId", "status"]),
```

### Clerk Integration Pattern

```typescript
// packages/convex/invitations.ts
import { requireRole } from "./lib/auth";

export const inviteUser = mutation({
  args: {
    email: v.string(),
    role: v.string(), // "Setter Trainee", "Recruiter", etc.
  },
  handler: async (ctx, args) => {
    // Check caller has permission
    const { user, tenantId } = await requireRole(ctx, [
      "Recruiter",
      "Trainer",
      "Setter Manager",
      "Sales Manager",
      "System Administrator"
    ]);

    // Create invitation record
    const invitationId = await ctx.db.insert("userInvitations", {
      email: args.email,
      tenantId,
      invitedBy: user._id,
      role: args.role,
      status: "pending",
      createdAt: Date.now(),
    });

    // Use Clerk Backend SDK to create invitation
    // This sets tenantId in Clerk public metadata
    // Clerk sends invitation email with signup link

    // NOTE: Requires Clerk API key in environment variables
    // See: https://clerk.com/docs/users/invitations

    return { success: true, invitationId };
  }
});
```

### Updated Webhook Handler

```typescript
// packages/convex/users.ts - upsertFromClerk
if (user === null) {
  // Check for invitation
  const invitation = await ctx.db
    .query("userInvitations")
    .withIndex("by_email", (q) => q.eq("email", userAttributes.email))
    .filter((q) => q.eq(q.field("status"), "pending"))
    .first();

  if (!invitation) {
    throw new Error(
      "Account registration requires an invitation. " +
      "Please contact your organization's administrator."
    );
  }

  // Accept invitation
  await ctx.db.insert("users", {
    ...userAttributes,
    tenantId: invitation.tenantId,
  });

  // Mark invitation accepted
  await ctx.db.patch(invitation._id, { status: "accepted" });
}
```

---

## Clerk Configuration Required

1. **Enable Clerk Invitations:**
   - Clerk Dashboard > Configure > Restrictions
   - Enable "Invitations"
   - Disable "Allow sign-ups" (public signup disabled)

2. **Clerk Backend API Key:**
   - Add to `.env.local`: `CLERK_SECRET_KEY=sk_...`
   - Used for creating invitations via Clerk SDK

3. **Invitation Email Template:**
   - Customize in Clerk Dashboard > Email & SMS > Templates
   - Email should explain invitation and include signup link

---

## Future Enhancements (Post-Epic 1)

These can be added in later stories:

1. **Expiration:** Invitations expire after 7 days
2. **Resend:** Ability to resend invitation email
3. **Bulk Invite:** Upload CSV of email addresses
4. **Role Assignment:** Set initial role during invitation (already basic support)
5. **Custom Email:** Custom invitation email templates per tenant
6. **Invitation History:** Audit log of all invitations sent

---

## Development/Testing Instructions

**For Development (Manual Testing):**

1. Create a test tenant in Convex dashboard
2. Create a System Admin user manually (set tenantId in Clerk metadata)
3. Log in as System Admin
4. Use `inviteUser` mutation to invite test user
5. Check email for invitation
6. Complete signup as invited user
7. Verify user created with correct tenantId

**For Manual Clerk Setup (Development Only):**

If Clerk API integration is complex, can defer to Story 1.7.5 and use manual process:
1. Run `createDevInvitation` mutation (from Story 1.4)
2. Manually set tenantId in Clerk dashboard (user public metadata)
3. User can signup successfully

---

## Questions to Resolve

1. **Clerk Backend SDK:** Do we use `@clerk/backend` npm package for creating invitations programmatically?
2. **Email Service:** Does Clerk send invitation emails, or do we need custom email service?
3. **Role Assignment:** Should initial role be set during invitation, or after first login by admin?
4. **Multiple Roles:** Can user be invited with multiple roles (e.g., "Setter" + "Trainer")?

---

## References

- [Clerk Invitations Documentation](https://clerk.com/docs/users/invitations)
- [Clerk Backend SDK](https://clerk.com/docs/references/backend/overview)
- Story 1.4: Multi-Tenant RLS (tenantId requirement)
- Story 1.7: RBAC (role-based access to invite users)
- `docs/multi-tenant-rls.md` - Security patterns

---

**This document serves as a reference for creating Story 1.7.5 in epics.md and implementing the invitation workflow.**
