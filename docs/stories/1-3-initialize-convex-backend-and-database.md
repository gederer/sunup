# Story 1.3: Initialize Convex Backend and Database

Status: done

## Story

As a Developer,
I want Convex backend initialized with TypeScript schemas and database connection,
So that I have a real-time, serverless backend for data management.

## Acceptance Criteria

1. Convex project initialized with TypeScript (AC: #1)
2. Convex client configured in Next.js app (`ConvexClientProvider`) (AC: #2)
3. Basic schema file created (`convex/schema.ts`) (AC: #3)
4. Database connection verified with simple query/mutation (AC: #4)
5. Real-time subscription working (demonstrate with test component) (AC: #5)
6. Convex dashboard accessible and linked in README (AC: #6)
7. Environment variables configured for Convex connection (AC: #7)

## Tasks / Subtasks

- [ ] Initialize Convex project with TypeScript (AC: #1)
  - [ ] Run `npx convex dev` in project root
  - [ ] Follow prompts to create Convex project
  - [ ] Verify `convex/` directory created
  - [ ] Confirm `convex.json` configuration file exists
  - [ ] Verify TypeScript configuration in Convex project

- [ ] Configure Convex client in Next.js app (AC: #2)
  - [ ] Install `convex` package in `apps/web/`
  - [ ] Create `ConvexClientProvider` wrapper component
  - [ ] Add provider to root layout (`app/layout.tsx`)
  - [ ] Configure NEXT_PUBLIC_CONVEX_URL environment variable
  - [ ] Verify client connection in browser console

- [ ] Create basic schema file (AC: #3)
  - [ ] Create `convex/schema.ts` file
  - [ ] Define initial schema structure with `defineSchema`
  - [ ] Add sample table (e.g., `tasks` or `users`)
  - [ ] Include proper TypeScript types
  - [ ] Run `npx convex dev` to sync schema

- [ ] Verify database connection with query/mutation (AC: #4)
  - [ ] Create sample query in `convex/queries/` (e.g., `getTasks.ts`)
  - [ ] Create sample mutation in `convex/mutations/` (e.g., `addTask.ts`)
  - [ ] Test query returns data from database
  - [ ] Test mutation successfully writes to database
  - [ ] Verify operations in Convex dashboard

- [ ] Demonstrate real-time subscription (AC: #5)
  - [ ] Create test component in `apps/web/app/convex-demo/`
  - [ ] Use `useQuery` hook to subscribe to data
  - [ ] Add button to trigger mutation
  - [ ] Verify UI updates automatically when data changes
  - [ ] Test in multiple browser tabs to confirm real-time sync

- [ ] Document Convex dashboard access (AC: #6)
  - [ ] Access Convex dashboard at dashboard.convex.dev
  - [ ] Document deployment URL in README
  - [ ] Add link to Convex dashboard
  - [ ] Document how to view data, logs, and functions
  - [ ] Include screenshots/instructions for team

- [ ] Configure environment variables (AC: #7)
  - [ ] Add `CONVEX_DEPLOYMENT` to `.env.local`
  - [ ] Add `NEXT_PUBLIC_CONVEX_URL` to `.env.local`
  - [ ] Create `.env.local.example` with placeholder values
  - [ ] Document required environment variables in README
  - [ ] Verify deployment works with environment variables

## Dev Notes

### Architecture Context

**Story Context:** This is Story 1.3, building on the monorepo foundation (Story 1.1) and UI system (Story 1.2). This story establishes the real-time, serverless backend that will power all future features.

**Current Status (Post-Story 1.2):**
- Turborepo monorepo structure established at `apps/web/` and `packages/`
- Next.js 16.0.0 with App Router
- TailwindCSS 4 + shadcn/ui configured with theme system
- No backend or database currently connected

**Target State:**
- Convex 1.28.0 initialized and connected
- Real-time client configured in Next.js app
- Basic schema defined with sample table
- Query/mutation verified working
- Real-time subscriptions demonstrated
- Dashboard accessible with documentation
- Environment variables configured

### Learnings from Previous Stories

**From Story 1.1 (Status: done)**
- Monorepo structure at `apps/web/` and `packages/`
- Build validation via `turbo build --filter=@sunup/web`
- Use `workspace:*` protocol for internal dependencies

**From Story 1.2 (Status: done)**
- TailwindCSS 4.1.17 with @plugin syntax
- shadcn/ui components at `apps/web/components/ui/`
- Theme system with `.dark` class selector
- Manual testing until Story 1.6 (no automated tests yet)

### Project Structure Notes

**Convex Location:**
According to architecture.md:
- **Current (pre-refactor):** `convex/` at project root
- **Post-refactor (Story 1.1):** Should be at `packages/convex/`

Since Story 1.1 established the monorepo structure, we should verify the actual current location and follow the established pattern. The Convex CLI typically creates `convex/` at the root by default.

**Expected Structure After Story 1.3:**
```
sunup/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── convex-demo/          # Test component (AC: #5)
│       │   │   └── page.tsx
│       │   └── layout.tsx            # ConvexClientProvider added here
│       └── .env.local                # CONVEX_* environment variables
├── convex/                           # Convex backend (location TBD)
│   ├── schema.ts                     # Basic schema (AC: #3)
│   ├── queries/                      # Query functions
│   │   └── getTasks.ts               # Sample query (AC: #4)
│   ├── mutations/                    # Mutation functions
│   │   └── addTask.ts                # Sample mutation (AC: #4)
│   └── convex.json                   # Convex config
├── .env.local.example                # Environment variable template
└── README.md                         # Updated with Convex dashboard link
```

### Convex Integration Notes

**From architecture.md:**
- **Version:** Convex 1.28.0
- **Features:**
  - Real-time subscriptions (no polling)
  - TypeScript-native queries/mutations
  - Serverless (automatic scaling)
  - Row-Level Security (RLS) - Story 1.4
- **Authentication:** Integrates with Clerk (JWT tokens) - Story 1.5
- **Multi-tenancy:** Every table includes `tenantId` - Story 1.4

**Convex Client Setup:**
```typescript
// app/layout.tsx
import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Wrap children with <ConvexProvider client={convex}>
```

**Sample Schema Pattern:**
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
```

### Testing Strategy

Since Story 1.6 sets up testing infrastructure (Playwright + Vitest), **NO automated tests** are required for this story. Validation is manual:

1. **Initialization Verification:** Convex CLI completes successfully
2. **Client Verification:** Browser console shows successful connection
3. **Schema Verification:** `npx convex dev` syncs schema without errors
4. **Query/Mutation Verification:** Test component displays and updates data
5. **Real-time Verification:** Multiple browser tabs sync changes instantly
6. **Dashboard Verification:** Convex dashboard accessible and shows data
7. **Build Verification:** `turbo build --filter=@sunup/web` succeeds

Future stories (1.11+) will add automated backend testing.

### Dependency Management

**Packages to Install:**
- `convex` (latest 1.28.0+)

**Installation Command:**
```bash
# In apps/web/
pnpm add convex
```

**Convex CLI:**
```bash
# Install globally (if not already installed)
npm install -g convex

# Or use via npx
npx convex dev
```

### Potential Gotchas

1. **Convex Directory Location:**
   - Convex CLI defaults to creating `convex/` at project root
   - With monorepo, may need to configure location
   - Verify `convex.json` points to correct deployment

2. **Environment Variables:**
   - `NEXT_PUBLIC_CONVEX_URL` must be prefixed with `NEXT_PUBLIC_` for client access
   - Format: `https://<deployment-name>.convex.cloud`
   - Must restart dev server after changing .env.local

3. **ConvexClientProvider Placement:**
   - Must wrap all components that use Convex hooks
   - Place high in component tree (root layout)
   - Only client components can use Convex hooks (not Server Components)

4. **Schema Sync:**
   - Schema changes require `npx convex dev` to be running
   - Database migrations happen automatically on schema changes
   - Breaking schema changes may require manual migration

5. **TypeScript Types:**
   - Convex auto-generates TypeScript types from schema
   - Import generated types from `convex/_generated/dataModel`
   - Types update automatically when schema changes

6. **Deployment URL:**
   - Dev deployment URL different from production
   - Must update `NEXT_PUBLIC_CONVEX_URL` when deploying to production
   - Convex dashboard shows deployment URLs

### References

- [Source: docs/epics.md#Story-1.3] - Story definition and acceptance criteria (lines 114-129)
- [Source: docs/architecture.md#Technology-Stack-Details] - Convex 1.28.0 details (lines 203-210)
- [Source: docs/architecture.md#Project-Structure] - Monorepo structure (lines 58-156)
- [Source: docs/architecture.md#Setup-Commands] - Convex initialization commands (lines 1020-1050)
- [Convex Documentation] - https://docs.convex.dev/
- [Convex Quickstart] - https://docs.convex.dev/quickstart
- [Convex + Next.js] - https://docs.convex.dev/quickstart/nextjs
- [Convex Dashboard] - https://dashboard.convex.dev/

## Dev Agent Record

### Context Reference

Context file will be created by story-context workflow after story is marked ready-for-dev.

### Agent Model Used

Claude 3.7 Sonnet (claude-sonnet-4-5-20250929)

### Debug Log References

<!-- Implementation details, issues encountered, and solutions will be logged here during development -->

### Completion Notes List

**Story 1.3 Completed: 2025-11-08**

All acceptance criteria verified:

1. ✅ **Convex project initialized with TypeScript**
   - Location: `packages/convex/` (monorepo structure)
   - Comprehensive schema with 20+ tables
   - Full TypeScript type generation working

2. ✅ **ConvexClientProvider configured**
   - Component: `apps/web/components/ConvexClientProvider.tsx`
   - Integrated with Clerk authentication via `ConvexProviderWithClerk`
   - Connected in root layout

3. ✅ **Basic schema file created**
   - File: `packages/convex/schema.ts`
   - Multi-tenant schema with proper indexes
   - Added `tasks` table for demo purposes

4. ✅ **Database connection verified with query/mutation**
   - Queries: `packages/convex/tasks.ts` (list)
   - Mutations: add, toggle, remove tasks
   - User authentication: `packages/convex/users.ts`

5. ✅ **Real-time subscription demo**
   - Page: `apps/web/app/convex-demo/page.tsx`
   - Demonstrates real-time updates across multiple tabs
   - Interactive task list with add/toggle/delete

6. ✅ **Convex dashboard accessible**
   - URL: https://dashboard.convex.dev/deployment/affable-albatross-627
   - Documented in README.md
   - Environment variable configured in dashboard

7. ✅ **Environment variables configured**
   - Updated `.env.local` with correct deployment: `affable-albatross-627`
   - CLERK_JWT_ISSUER_DOMAIN set in Convex dashboard
   - NEXT_PUBLIC_CONVEX_URL configured

**Key Accomplishments:**
- Fixed incorrect Convex subdomain (careful-chipmunk-77 → affable-albatross-627)
- Created real-time demo showcasing Convex subscriptions
- Verified full build pipeline works (`turbo build --filter=@sunup/web`)
- Updated README with dashboard links and demo page
- Schema sync working with proper TypeScript type generation

### File List

**Files Created:**
- `apps/web/app/convex-demo/page.tsx` - Real-time subscription demo page
- `packages/convex/tasks.ts` - Task queries and mutations for demo

**Files Modified:**
- `.env.local` - Updated Convex deployment URL to affable-albatross-627
- `packages/convex/schema.ts` - Added tasks table
- `README.md` - Added Convex dashboard links and demo page documentation

**Files Already Existing (Verified):**
- `apps/web/components/ConvexClientProvider.tsx` - Client provider setup
- `apps/web/app/layout.tsx` - Provider integration
- `packages/convex/schema.ts` - Comprehensive multi-tenant schema
- `packages/convex/users.ts` - User authentication queries
- `convex.json` - Convex configuration

## Change Log

- 2025-11-08: Story drafted by SM agent from epics.md (Story 1.3, lines 114-129)
- 2025-11-08: Story completed - All 7 acceptance criteria verified and build passing
