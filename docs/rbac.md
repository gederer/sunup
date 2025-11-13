# Role-Based Access Control (RBAC) Guide

**Story:** 1.7 - Implement Role-Based Access Control (RBAC) for 15 Roles
**Last Updated:** 2025-01-13

---

## Table of Contents

1. [Overview](#overview)
2. [15 Roles Defined](#15-roles-defined)
3. [Role Hierarchy](#role-hierarchy)
4. [Permission Matrix](#permission-matrix)
5. [Using RBAC Helpers](#using-rbac-helpers)
6. [Testing RBAC](#testing-rbac)
7. [Role Assignment](#role-assignment)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### What is RBAC?

Role-Based Access Control (RBAC) is a security model that restricts system access based on a user's role within an organization. In Sunup, RBAC enforces:

- **Authorization**: Who can access what features and data
- **Data isolation**: Users only see data relevant to their role
- **Audit compliance**: Track who performed which actions
- **Multi-tenancy**: Roles are scoped to tenants for data isolation

### Why RBAC Matters for Sunup

Sunup serves 15 distinct roles across the solar sales and installation lifecycle. Each role needs:

- **Appropriate access**: Setters see lead data, Finance sees commissions, Admins see everything
- **Data protection**: Sensitive financial data restricted to Finance/Executive roles
- **Workflow enforcement**: Only authorized roles can perform critical actions (e.g., approve commissions)

### Multi-Tenant RBAC

- Roles are **scoped to tenants** - a user in Tenant A cannot access Tenant B's data
- Row-Level Security (RLS) enforces tenant isolation at the database layer
- Role checks happen **after** tenant isolation - double security

---

## 15 Roles Defined

Sunup supports **15 roles** across sales, operations, and management functions:

### Sales & Lead Generation

1. **Setter**
   - **Purpose**: Lead generation and appointment setting
   - **Access**: Contact lists, dialer campaigns, appointment booking
   - **Key Activities**: Cold calling, qualifying leads, setting appointments

2. **Setter Trainee**
   - **Purpose**: Learning role for new setters with limited permissions
   - **Access**: Supervised dialer access, limited lead visibility
   - **Key Activities**: Training calls, shadowing experienced setters

3. **Setter Manager**
   - **Purpose**: Manages setter team and campaign performance
   - **Access**: Team metrics, campaign management, lead assignment
   - **Key Activities**: Coaching setters, optimizing campaigns, reviewing performance

4. **Consultant**
   - **Purpose**: Sales consultations and proposal creation
   - **Access**: Customer data, meeting tools, proposal builder, satellite imagery
   - **Key Activities**: Conducting sales meetings, creating proposals, closing deals

5. **Sales Manager**
   - **Purpose**: Oversees sales team and pipeline performance
   - **Access**: Pipeline oversight, team metrics, commission approval
   - **Key Activities**: Coaching consultants, forecasting, approving deals

6. **Lead Manager**
   - **Purpose**: Lead distribution and campaign strategy
   - **Access**: Lead database, campaign analytics, assignment workflows
   - **Key Activities**: Distributing leads, analyzing campaign ROI, optimizing lead sources

### Operations & Installation

7. **Project Manager**
   - **Purpose**: Installation project oversight and crew coordination
   - **Access**: Project timelines, crew scheduling, installation updates
   - **Key Activities**: Managing installation projects, coordinating crews, updating customers

8. **Installer**
   - **Purpose**: Field installation work and project updates
   - **Access**: Assigned projects, photo uploads, completion tracking
   - **Key Activities**: Installing solar systems, documenting work, updating project status

9. **Operations**
   - **Purpose**: Operational metrics, scheduling, and resource management
   - **Access**: Company-wide operations dashboards, scheduling tools, inventory
   - **Key Activities**: Optimizing workflows, managing resources, tracking operational KPIs

### Support & Human Resources

10. **Support Staff**
    - **Purpose**: Customer support and communication management
    - **Access**: Customer communication logs, ticket management, knowledge base
    - **Key Activities**: Handling customer inquiries, resolving issues, maintaining support tickets

11. **Recruiter**
    - **Purpose**: Hiring and onboarding workflows
    - **Access**: Candidate tracking, onboarding materials, hiring dashboards
    - **Key Activities**: Recruiting contractors, managing hiring pipeline, onboarding new hires

12. **Trainer**
    - **Purpose**: Training materials and performance tracking
    - **Access**: Training content, certification management, learner progress
    - **Key Activities**: Creating training materials, certifying contractors, tracking skill development

### Administration & Executive

13. **System Administrator**
    - **Purpose**: Full system access and user management
    - **Access**: Everything - user roles, tenant settings, system configuration
    - **Key Activities**: Managing users, configuring system, troubleshooting issues

14. **Executive**
    - **Purpose**: Company-wide reporting and strategic insights
    - **Access**: All analytics, financial reports, operational dashboards
    - **Key Activities**: Reviewing company performance, strategic planning, decision-making

15. **Finance**
    - **Purpose**: Financial reporting and commission management
    - **Access**: Financial reports, commission data, accounting integrations
    - **Key Activities**: Processing commissions, financial reporting, managing payments

---

## Role Hierarchy

### Access Levels

```
┌─────────────────────────────────────────────────────────┐
│ Level 1: Executive & System Administrator              │
│ (Highest Access - Company-wide visibility)             │
├─────────────────────────────────────────────────────────┤
│ Level 2: Finance, Sales Manager, Setter Manager,       │
│          Project Manager, Operations                    │
│ (Department Leadership - Team visibility)              │
├─────────────────────────────────────────────────────────┤
│ Level 3: Lead Manager, Trainer, Recruiter              │
│ (Functional Specialists - Function-specific access)    │
├─────────────────────────────────────────────────────────┤
│ Level 4: Consultant, Installer, Support Staff          │
│ (Individual Contributors - Personal + assigned data)   │
├─────────────────────────────────────────────────────────┤
│ Level 5: Setter, Setter Trainee                        │
│ (Entry-Level - Limited access to assigned data)        │
└─────────────────────────────────────────────────────────┘
```

### Inheritance Principle

- **Higher levels have broader access** but NOT automatic access to everything
- Each role's access is **explicitly defined** by feature
- Multi-role users have **combined permissions** from all active roles

---

## Permission Matrix

| Feature | System Admin | Executive | Finance | Sales Mgr | Setter Mgr | PM | Consultant | Setter |
|---------|:------------:|:---------:|:-------:|:---------:|:----------:|:--:|:----------:|:------:|
| **User Management** |
| Create/Delete Users | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Assign Roles | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| View All Users | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Financial** |
| View Financial Reports | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Approve Commissions | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View Own Commissions | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Sales & Pipeline** |
| View All Pipeline | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Manage Own Leads | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| Approve Deals | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Campaigns & Dialer** |
| Create Campaigns | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| Join Campaigns | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ |
| View Team Performance | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |
| **Projects** |
| Manage All Projects | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| View Assigned Projects | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ |
| Update Installation Status | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |

**Legend:**
- ✓ = Has permission
- ✗ = No permission
- Not all roles/features shown (truncated for brevity)

---

## Using RBAC Helpers

Sunup provides **5 RBAC helper functions** in `packages/convex/lib/auth.ts`:

### 1. `requireRole(ctx, allowedRoles)`

**Use when:** You want to enforce role-based access and **throw an error** if unauthorized.

**Example:**
```typescript
import { mutation } from "./_generated/server";
import { requireRole } from "./lib/auth";

export const approveCommission = mutation({
  args: { commissionId: v.id("commissions") },
  handler: async (ctx, args) => {
    // Only Finance, Executive, or System Administrator can approve
    const { user, tenantId } = await requireRole(ctx, [
      "Finance",
      "Executive",
      "System Administrator"
    ]);

    // ... proceed with commission approval
  },
});
```

**Throws:**
- `"Unauthorized"` - User not authenticated
- `"User not found"` - Clerk user not synced to database
- `"Forbidden"` - User lacks required role

---

### 2. `hasRole(ctx, role)`

**Use when:** You want to **check** if a user has a role without throwing an error (conditional logic).

**Example:**
```typescript
import { query } from "./_generated/server";
import { hasRole, getAuthUserWithTenant } from "./lib/auth";

export const listSensitiveData = query({
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);
    const isAdmin = await hasRole(ctx, "System Administrator");

    if (isAdmin) {
      // Return all data for admins
      return await ctx.db
        .query("sensitiveData")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .collect();
    } else {
      // Return filtered data for non-admins
      return await ctx.db
        .query("sensitiveData")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .filter((q) => q.eq(q.field("isPublic"), true))
        .collect();
    }
  },
});
```

**Returns:**
- `true` - User has the role (and it's active)
- `false` - User lacks the role, role is inactive, or user not authenticated

---

### 3. `getUserRoles(ctx)`

**Use when:** You need to retrieve all active roles for the current user.

**Example:**
```typescript
import { query } from "./_generated/server";
import { getUserRoles, getAuthUserWithTenant } from "./lib/auth";

export const getUserProfile = query({
  handler: async (ctx) => {
    const { user } = await getAuthUserWithTenant(ctx);
    const roles = await getUserRoles(ctx);

    return {
      ...user,
      roles: roles.map(r => r.role),
      primaryRole: roles.find(r => r.isPrimary)?.role,
      isMultiRole: roles.length > 1,
    };
  },
});
```

**Returns:**
- Array of active role objects with `{ _id, userId, role, isActive, isPrimary, tenantId }`
- Empty array if user has no roles or is not authenticated

---

### 4. `hasAnyRole(ctx, roles)`

**Use when:** User needs **at least one** of several roles (OR logic).

**Example:**
```typescript
import { query } from "./_generated/server";
import { hasAnyRole, getAuthUserWithTenant } from "./lib/auth";

export const viewFinancialReports = query({
  handler: async (ctx) => {
    const { tenantId } = await getAuthUserWithTenant(ctx);

    const canView = await hasAnyRole(ctx, [
      "Finance",
      "Executive",
      "System Administrator"
    ]);

    if (!canView) {
      throw new Error("Forbidden: You need Finance, Executive, or Admin role");
    }

    return await ctx.db
      .query("financialReports")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});
```

**Returns:**
- `true` - User has at least one of the specified roles (active)
- `false` - User has none of the roles or is not authenticated

---

### 5. `requirePrimaryRole(ctx, role)`

**Use when:** The specified role must be the user's **primary role** (stricter than `requireRole`).

**Example:**
```typescript
import { mutation } from "./_generated/server";
import { requirePrimaryRole } from "./lib/auth";

export const manageTeam = mutation({
  args: { teamMemberId: v.id("users") },
  handler: async (ctx, args) => {
    // Only users whose PRIMARY role is Sales Manager
    const { user, tenantId } = await requirePrimaryRole(ctx, "Sales Manager");

    // This prevents multi-role users (e.g., Sales Manager + Consultant)
    // from managing teams unless Sales Manager is their primary focus
    // ... team management logic
  },
});
```

**Throws:**
- `"Unauthorized"` - User not authenticated
- `"User not found"` - Clerk user not synced
- `"Forbidden"` - User doesn't have this role OR it's not marked as primary

---

## Testing RBAC

### Test Patterns

Reference: `packages/convex/tests/rbac.test.ts`

**Example: Testing `requireRole`**

```typescript
import { describe, it, expect, vi } from 'vitest'
import type { QueryCtx } from '../_generated/server'
import { requireRole } from '../lib/auth'

describe('requireRole', () => {
  it('should allow user with matching role', async () => {
    const mockUser = {
      _id: 'user123' as Id<'users'>,
      tenantId: 'tenant123' as Id<'tenants'>,
      // ... other fields
    }

    const mockUserRole = {
      _id: 'role123' as Id<'userRoles'>,
      userId: 'user123' as Id<'users'>,
      role: 'Finance',
      isActive: true,
      isPrimary: true,
      tenantId: 'tenant123' as Id<'tenants'>,
    }

    const ctx = {
      auth: {
        getUserIdentity: vi.fn().mockResolvedValue({ subject: 'clerk_123' }),
      },
      db: {
        query: vi.fn().mockImplementation((table: string) => {
          if (table === 'users') {
            return {
              withIndex: vi.fn().mockReturnThis(),
              first: vi.fn().mockResolvedValue(mockUser),
            }
          } else {
            return {
              withIndex: vi.fn().mockReturnThis(),
              collect: vi.fn().mockResolvedValue([mockUserRole]),
            }
          }
        }),
      },
    } as unknown as QueryCtx

    const result = await requireRole(ctx, ['Finance'])
    expect(result.user._id).toBe('user123')
  })
})
```

### Mocking Roles in Tests

Key patterns:

1. **Mock Clerk authentication:** `ctx.auth.getUserIdentity()`
2. **Mock user lookup:** `ctx.db.query("users")`
3. **Mock role lookup:** `ctx.db.query("userRoles")`
4. **Test both success and error cases**

---

## Role Assignment

### How System Admins Assign Roles

**Location:** `packages/convex/userRoles.ts`

**Mutations:**
- `assignRole({ userId, role, isPrimary })` - Assign a role to a user
- `deactivateRole({ userRoleId })` - Deactivate a role (soft delete)
- `setPrimaryRole({ userId, userRoleId })` - Set primary role

**Queries:**
- `listUserRoles({ userId })` - List all roles for a user
- `getMyRoles()` - Get current user's active roles

**Example: Assigning a Role**

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function RoleAssignmentUI() {
  const assignRole = useMutation(api.userRoles.assignRole);

  const handleAssign = async () => {
    await assignRole({
      userId: "user_abc123",
      role: "Sales Manager",
      isPrimary: true, // Make this the primary role
    });
  };

  return <button onClick={handleAssign}>Assign Sales Manager Role</button>;
}
```

### Multi-Role Users

Users can have **multiple roles** with combined permissions:

**Example:**
- User has roles: `["Finance", "Executive"]`
- Can access Financial Reports (Finance role)
- Can also access Executive Dashboards (Executive role)
- Primary role determines default view in UI

### Primary Role Designation

- Each user should have **one primary role** (`isPrimary: true`)
- Primary role represents the user's **main function**
- Used for UI defaults and hierarchical workflows

---

## Troubleshooting

### "Forbidden" Error When Accessing Protected Queries

**Symptom:** User gets "Forbidden" error despite having correct Clerk authentication

**Possible Causes:**

1. **Missing role assignment**
   - Check: `listUserRoles({ userId })` - Does user have the required role?
   - Fix: Assign role via `assignRole` mutation

2. **Inactive role**
   - Check: `isActive` field in `userRoles` table
   - Fix: Re-assign role or set `isActive: true`

3. **Wrong role specified in code**
   - Check: Does `requireRole` match user's actual roles?
   - Fix: Update role requirements or assign correct role

### Role Not Syncing from Clerk

**Symptom:** Roles assigned in Clerk dashboard don't appear in Convex

**Note:** Clerk metadata sync (Phase 6) is not yet implemented.

**Workaround:** Use `assignRole` mutation directly to assign roles in Convex.

**Future:** Clerk webhook will sync `publicMetadata.roles` automatically.

### Multiple Roles Not Working as Expected

**Symptom:** User has multiple roles but can't access features for secondary roles

**Check:**

1. All roles are **active** (`isActive: true`)
2. Feature uses `hasAnyRole` or `requireRole` with array (not single role check)
3. RLS isn't overriding role permissions

**Example Fix:**

```typescript
// ❌ Wrong - only checks Finance
await requireRole(ctx, ["Finance"])

// ✓ Correct - checks all allowed roles
await requireRole(ctx, ["Finance", "Executive", "System Administrator"])
```

---

## Next Steps

### Completed (Story 1.7)

✅ Schema with 15 roles defined
✅ 5 RBAC helper functions implemented
✅ Role assignment mutations (assignRole, deactivateRole, setPrimaryRole)
✅ Demo queries with role enforcement
✅ 39 comprehensive tests (77% coverage for auth.ts)
✅ RBAC documentation

### Future Enhancements (Post-Story 1.7)

⏸ **Clerk Metadata Sync** - Automatic role sync from Clerk `publicMetadata`
⏸ **Role Management UI** - Admin interface for assigning/removing roles
⏸ **Fine-grained Permissions** - Beyond roles (e.g., "can edit own leads only")
⏸ **Custom Roles** - Tenant-specific role creation
⏸ **Role Templates** - Pre-configured role bundles for common scenarios
⏸ **Audit Logging** - Track who changed roles when

### Using RBAC in Future Stories

**Stories 1.8+** can now use RBAC helpers confidently:

- **Story 1.8 (Pipeline):** Restrict pipeline access by role
- **Story 2.x (CRM):** Role-based visibility for person/organization data
- **Story 3.x (Dialer):** Campaign management for Setter Managers only
- **Story 5.x (Commissions):** Finance role for commission approval

---

**End of RBAC Documentation**
