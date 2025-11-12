# Decision Architecture

## Executive Summary

Sunup is an enterprise-grade, multi-tenant B2B SaaS platform for solar installation companies, built on a modern serverless stack with real-time capabilities. The architecture prioritizes data isolation (Convex RLS), real-time updates (Convex subscriptions), and AI agent consistency (strict implementation patterns). The system supports 12 roles across 6 major functional areas (CRM, Predictive Dialer, Video Conferencing, Commissions, Gamification, Project Management) serving thousands of tenants with 1-2000 users each.

## Project Initialization

**Current Status:** Project already initialized with core stack.

**Monorepo Refactor Required (Story 1.1):**
```bash
# Refactor to Convex Expo monorepo structure
# Reference: https://github.com/get-convex/turbo-expo-nextjs-clerk-convex-monorepo
```

This must be the **first implementation story** to establish proper code sharing between web and mobile apps.

**Existing Foundation:**
- Next.js 16.0.0 with App Router
- React 19.2.0
- TypeScript 5.x
- TailwindCSS 4.x
- Convex 1.28.0 (backend + real-time database)
- Clerk 6.34.0 (authentication with 12-role RBAC)
- shadcn/ui components
- Multi-tenant schema with RLS (all tables include tenantId)

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| **Frontend Framework** | Next.js with App Router | 16.0.0 | All | Modern React framework, server components, optimal performance |
| **React** | React | 19.2.0 | All | Latest stable with concurrent features |
| **Language** | TypeScript | 5.x | All | Type safety, better DX, prevents runtime errors |
| **Styling** | TailwindCSS | 4.x | All | Utility-first, rapid development, consistent design |
| **UI Components** | shadcn/ui | Latest | All | Accessible, customizable, copy-paste components |
| **Backend/Database** | Convex | 1.28.0 | All | Real-time subscriptions, serverless, TypeScript-native |
| **Authentication** | Clerk | 6.34.0 | Epic 1 | OAuth2, passwordless, MFA support, webhook-based user sync, multi-tenant support via metadata |
| **Telephony** | SignalWire Programmable Voice | Latest SDK | Epic 3 | SIP-based predictive dialer, call routing, recordings |
| **WebRTC/Video** | Mediasoup SFU (separate server) | v3.x | Epic 4 | Custom WebRTC for 1-to-1 video, full control, scalable |
| **TURN/STUN** | Self-hosted coturn | Latest | Epic 4 | NAT traversal for WebRTC, cost-effective |
| **Maps** | Mapbox GL JS + react-map-gl | 3.16.0 | Epic 2 | Satellite imagery, property visualization |
| **File Storage** | Cloudflare R2 | N/A | Epic 3, Epic 6 | Call recordings, photos, S3-compatible, cheap egress |
| **Mobile** | Expo (React Native) | Latest | Epic 3, Epic 4 | Cross-platform iOS/Android, shared code with web |
| **Monorepo** | Turborepo | Latest | All | Code sharing between web/mobile, unified builds |
| **Testing (Unit)** | Vitest | Latest | All | Fast, modern, Vite-native |
| **Testing (Component)** | React Testing Library | Latest | All | User-centric testing, accessibility focus |
| **Testing (E2E)** | Playwright | Latest | All | Cross-browser, reliable, great DX |
| **Error Monitoring** | Sentry | Latest | All | Error tracking, performance monitoring, alerts |
| **Form Handling** | React Hook Form | Latest | All | Performance, Zod integration, minimal re-renders |
| **Validation** | Zod | Latest | All | Type-safe schemas, runtime validation |
| **Date Handling** | date-fns | Latest | All | Lightweight, tree-shakeable, immutable |
| **State Management** | Convex + Zustand (optional) | Latest | All | Server state via Convex, client UI state via Zustand |
| **Icons** | lucide-react | 0.548.0 | All | Consistent icon system, React-optimized |
| **Notifications** | Sonner (shadcn) | Latest | All | Toast notifications, accessible |

## Project Structure

**Post-Monorepo Refactor Structure:**

```
sunup/
├── apps/
│   ├── web/                          # Next.js web application
│   │   ├── app/
│   │   │   ├── (auth)/              # Auth routes (sign-in, sign-up)
│   │   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   │   ├── setters/         # Setter-specific pages
│   │   │   │   ├── consultants/     # Consultant-specific pages
│   │   │   │   ├── managers/        # Manager dashboards
│   │   │   │   ├── finance/         # Finance workflows
│   │   │   │   ├── admin/           # System admin
│   │   │   │   └── commissions/     # Commission tracking
│   │   │   ├── api/                 # API routes
│   │   │   │   └── webhooks/        # Clerk, SignalWire webhooks
│   │   │   ├── components/          # App-specific components
│   │   │   │   ├── features/        # Feature components
│   │   │   │   └── layouts/         # Layout components
│   │   │   └── lib/                 # Web-specific utilities
│   │   ├── public/                  # Static assets
│   │   ├── middleware.ts            # Clerk auth middleware
│   │   └── package.json
│   │
│   ├── mobile/                       # Expo React Native app
│   │   ├── app/                     # Expo Router structure
│   │   │   ├── (tabs)/              # Tab navigation
│   │   │   │   ├── setters/
│   │   │   │   ├── consultants/
│   │   │   │   └── installers/
│   │   │   └── (auth)/              # Auth screens
│   │   ├── components/              # Mobile-specific components
│   │   ├── assets/                  # Images, fonts
│   │   └── package.json
│   │
│   └── mediasoup-server/            # WebRTC SFU server
│       ├── src/
│       │   ├── server.ts            # WebSocket server
│       │   ├── room-manager.ts      # Room lifecycle
│       │   └── handlers/            # Event handlers
│       ├── config/                  # Mediasoup config
│       └── package.json
│
├── packages/
│   ├── convex/                      # Shared Convex backend
│   │   ├── schema.ts                # Database schema (EXISTING)
│   │   ├── queries/                 # Convex queries
│   │   │   ├── users.ts
│   │   │   ├── people.ts
│   │   │   ├── projects.ts
│   │   │   ├── campaigns.ts
│   │   │   ├── commissions.ts
│   │   │   └── leaderboards.ts
│   │   ├── mutations/               # Convex mutations
│   │   │   ├── pipeline.ts          # Pipeline updates
│   │   │   ├── calls.ts             # Call management
│   │   │   ├── appointments.ts
│   │   │   └── commissions.ts
│   │   ├── actions/                 # External API calls
│   │   │   ├── signalwire.ts        # Telephony
│   │   │   ├── mapbox.ts            # Geocoding
│   │   │   └── cloudflare-r2.ts     # File uploads
│   │   ├── crons/                   # Scheduled functions
│   │   │   ├── leaderboard-rollup.ts
│   │   │   └── predictive-dialer.ts
│   │   └── http.ts                  # HTTP actions (webhooks)
│   │
│   ├── ui/                          # Shared UI components
│   │   ├── src/
│   │   │   ├── components/          # shadcn/ui components
│   │   │   ├── hooks/               # Shared React hooks
│   │   │   └── utils/               # UI utilities
│   │   └── package.json
│   │
│   ├── types/                       # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── convex.ts            # Convex type exports
│   │   │   ├── api.ts               # API types
│   │   │   └── domain.ts            # Business domain types
│   │   └── package.json
│   │
│   └── config/                      # Shared configs
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── docs/                            # Documentation (EXISTING)
│   ├── PRD.md
│   ├── epics.md
│   ├── architecture.md              # This document
│   └── stories/                     # Implementation stories
│
├── turbo.json                       # Turborepo config
├── package.json                     # Root package.json
└── pnpm-workspace.yaml              # Workspace config
```

**Current Structure (Pre-Refactor):**
```
sunup/ (current)
├── app/                             # Next.js App Router
├── components/                      # Components
├── convex/                          # Convex backend
├── docs/                            # Documentation
├── lib/                             # Utilities
├── public/                          # Static assets
└── package.json
```

## Epic to Architecture Mapping

| Epic | Primary Modules/Services | Key Technologies |
|------|-------------------------|------------------|
| **Epic 1: Foundation & Infrastructure** | `packages/convex`, `apps/web`, monorepo setup, CI/CD | Turborepo, Convex, Clerk, Vitest, Playwright, Sentry |
| **Epic 2: Core CRM & Pipeline Management** | `packages/convex/mutations/pipeline.ts`, `apps/web/app/(dashboard)/crm/` | Convex mutations, Mapbox GL JS, real-time subscriptions |
| **Epic 3: Predictive Dialer & Campaign Management** | `packages/convex/actions/signalwire.ts`, `packages/convex/crons/predictive-dialer.ts`, `apps/mobile/app/(tabs)/setters/` | SignalWire SDK, Convex actions, Cloudflare R2, React Native |
| **Epic 4: Video Conferencing & Unified Meeting Interface** | `apps/mediasoup-server`, `apps/web/app/(dashboard)/consultants/meeting/`, `apps/mobile/app/(tabs)/consultants/` | Mediasoup v3, WebRTC, coturn, WebSockets, React Native |
| **Epic 5: Commission Engine & Financial Dashboards** | `packages/convex/mutations/commissions.ts`, `apps/web/app/(dashboard)/finance/`, `apps/web/app/(dashboard)/commissions/` | Convex mutations, real-time calculations, React Hook Form + Zod |
| **Epic 6: Gamification, Leaderboards & Contractor Engagement** | `packages/convex/crons/leaderboard-rollup.ts`, `apps/web/app/(dashboard)/leaderboards/`, `packages/convex/queries/leaderboards.ts` | Convex scheduled functions, Cloudflare R2 (recordings), real-time subscriptions |

## Technology Stack Details

### Core Technologies

**Frontend (Web):**
- **Framework:** Next.js 16.0.0 with App Router
  - Server Components for performance
  - Parallel routes for dashboard layouts
  - API routes for webhooks
- **React:** 19.2.0 with concurrent features
- **TypeScript:** 5.x with strict mode
- **Styling:** TailwindCSS 4.x + tweakcn theme system
- **UI Library:** shadcn/ui (copy-paste components, fully customizable)
- **Icons:** lucide-react (0.548.0)

**Frontend (Mobile):**
- **Framework:** Expo (React Native)
  - Expo Router for file-based navigation
  - Expo modules for native APIs (camera, location)
- **Shared UI:** Reuses components from `packages/ui`
- **Platform-specific:** iOS/Android native modules as needed

**Backend:**
- **Database + Backend:** Convex 1.28.0
  - Real-time subscriptions (no polling)
  - Row-Level Security (RLS) for multi-tenancy
  - TypeScript-native queries/mutations
  - Scheduled functions (crons)
  - HTTP actions for external APIs
- **Authentication:** Clerk 6.34.0 with Convex integration
  - OAuth2, passwordless authentication with magic links
  - MFA support for enhanced security
  - Webhook-based user sync to Convex
  - Multi-tenant support via Clerk metadata
  - Admin-created users (no public signup)

**External Services:**
- **Telephony:** SignalWire Programmable Voice API
  - SIP-based predictive dialer
  - Call recordings → Cloudflare R2
  - Webhooks → Next.js API routes
- **WebRTC:** Mediasoup SFU v3 (separate Node.js server)
  - Custom 1-to-1 video conferencing
  - WebSocket signaling
  - Self-hosted coturn for TURN/STUN
- **Maps:** Mapbox GL JS 3.16.0 + react-map-gl
  - Satellite imagery for property visualization
  - Geocoding API for address → coordinates
- **Storage:** Cloudflare R2
  - Call recordings (audio files)
  - Site survey photos
  - User-uploaded documents
  - S3-compatible API

**Developer Tools:**
- **Monorepo:** Turborepo for build orchestration
- **Testing:** Vitest (unit) + React Testing Library (component) + Playwright (E2E)
- **Monitoring:** Sentry (errors, performance, alerts)
- **Validation:** Zod schemas for runtime validation
- **Forms:** React Hook Form with Zod resolvers
- **Date Handling:** date-fns (tree-shakeable, modern)
- **State Management:** Convex (server state) + Zustand (optional client state)

### Integration Points

**Clerk ↔ Convex:**
- Clerk webhooks sync user data to Convex (user creation, updates, deletions)
- Next.js middleware validates Clerk sessions and protects routes
- Session validation via Clerk JWT tokens passed to Convex
- Convex auth helpers retrieve authenticated user with tenant context
- Multi-tenant isolation via tenantId stored in Clerk public metadata
- All queries enforce RLS via tenantId check

**SignalWire ↔ Convex:**
- Convex actions place outbound calls via SignalWire SDK
- SignalWire sends webhooks to Next.js API routes (`/api/webhooks/signalwire/*`)
- Webhook handlers update Convex database (call status, routing)
- Real-time subscriptions notify Setters of incoming calls

**Mediasoup ↔ Web/Mobile:**
- WebSocket signaling server manages room lifecycle
- Web/mobile apps connect via WebSocket
- SDP exchange for WebRTC negotiation
- Self-hosted coturn provides TURN/STUN services

**Mapbox ↔ Web:**
- Client-side Mapbox GL JS embedded in React components
- Geocoding API called from Convex actions (address validation)
- Satellite tiles loaded on-demand

**Cloudflare R2 ↔ Convex:**
- Convex actions generate pre-signed upload URLs
- Clients upload directly to R2 (no server intermediary)
- Convex stores R2 URLs in database
- Read access via public or pre-signed URLs

**Real-time Event Flow:**
```
User Action (mutation)
  → Convex mutation updates database
  → Triggers pipelineEvents insert
  → Scheduled function processes events (or immediate calculation)
  → Side effects: commissions, notifications, leaderboard updates
  → All subscribed clients receive updates automatically
```

## Novel Pattern Designs

### 1. Predictive Dialer with Intelligent Call Routing

**Challenge:** Auto-dial leads based on available Setters, route connected calls intelligently, handle incoming calls with caller ID lookup.

**Components:**
- **Dialer Engine** (`packages/convex/crons/predictive-dialer.ts`): Scheduled function runs every 10 seconds
- **Call Router** (`packages/convex/actions/signalwire.ts`): Routes connected calls to available Setters
- **Availability Manager** (`packages/convex/mutations/calls.ts`): Tracks Setter availability status

**Data Flow:**
1. Scheduled function queries: `availableSetters` (status="available", not on call)
2. Calculates: `callsToPlace = availableSetters.length × dialingRatio`
3. Queries pending Persons from campaign (oldest assignments first)
4. Places calls via SignalWire API (Convex action)
5. Webhook receives `call-answered` event → Routes to available Setter
6. Routing algorithm (configurable): round-robin OR longest-idle-first
7. Emits real-time event to Setter's browser: `callIncoming` with Person context
8. Setter's Dialer View auto-loads Person details, script overlay

**Edge Cases:**
- **No Setters available:** Queue call for 30 seconds → Route to Setter Manager with alert
- **Incoming call (unknown):** Caller ID lookup → Create new Person → Route to available Setter
- **Manual call:** Setter clicks "Call" button → Direct connection (no routing)

**Implementation Pattern:**
- All call state in `calls` table (tenantId, personId, setterId, callSid, status, direction)
- Call routing logged in `callRoutingLog` for analytics
- Setter availability toggled via mutation (available → on_call → on_break)

### 2. Unified Meeting Interface with 7-Panel Layout

**Challenge:** Consultant needs simultaneous access to video, Person details, scripts, maps, financing, calculator, and chat without context switching.

**Components:**
- **Meeting Container** (`apps/web/app/(dashboard)/consultants/meeting/[meetingId]/page.tsx`)
- **Collapsible Panels** (each panel independently resizable/collapsible)
- **Real-time Sync** (all panels react to meeting state changes)

**Panel Architecture:**
```
┌─────────────────────────────────────────┐
│  Video Feed (Person + Consultant)       │  ← Mediasoup WebRTC
├──────────┬──────────┬──────────┬────────┤
│  Person  │  Script  │  Map     │  Fin   │
│  Details │  Overlay │  (Mapbox)│  Form  │
│          │  ✓✓✓     │  📍      │  💰    │
├──────────┴──────────┴──────────┴────────┤
│  Calculator      │  Knowledge Base │ 💬 │
└──────────────────┴─────────────────┴────┘
```

**State Management:**
- **Meeting State** (Convex): appointment record, script progress, Person data
- **UI State** (Zustand): panel visibility, sizes, active tab
- **Video State** (Mediasoup): peer connection, tracks, room info

**Key Patterns:**
- **Script Progress:** Checkboxes saved to database (real-time sync across reload)
- **Financing Integration:** Consultant selects option → Form appears in Person's browser simultaneously
- **Screen Sharing:** Person's browser mirrors Consultant's financing form view
- **Handoff System:** Pre-meeting alert (15 min) → Manual handoff button → 10-min auto-assign

### 3. Real-time Commission Calculation with Multi-Stage Triggers

**Challenge:** Commissions trigger at different pipeline stages (QMet for Setters, Sale for Consultants), calculations must be real-time, auditable, and disputable.

**Components:**
- **Calculation Engine** (`packages/convex/mutations/commissions.ts`): Pure function applies rules to kW + products
- **Trigger Listeners** (Convex mutation): Pipeline stage changes invoke commission creation
- **Audit Logger** (automatic): Every state change logged in `commissionAuditLog`

**Calculation Flow:**
```
Person.status changes to "QMet"
  → Mutation detects change
  → Retrieves Setter commission rule (triggerStage="QMet")
  → Calls calculateCommission(tenantId, ruleId, systemSizeKw, products[])
  → Applies tiered rates:
      Example: 7.5kW with tiers [0-5kW: $200/kW, 5-10kW: $220/kW]
      = (5 × $200) + (2.5 × $220) = $1,550
  → Applies product modifiers: Premium panels (1.2x) = $1,860
  → Creates commission record (status="pending_review")
  → Emits real-time event: `commissionEarned` → Setter sees toast notification
  → Frontend subscription auto-updates commission dashboard
```

**Approval Workflow:**
```
pending_review → manager_review (Sales Manager approves)
              → approved (Finance approves)
              → paid (Finance marks paid with payment reference)
```

**Dispute Handling:**
- Finance user clicks "Dispute" → Modal opens (reason required)
- Creates `commissionDisputes` record
- Status changes to "disputed"
- Contractor receives notification
- Resolution adjusts amount (if needed) → Status back to "approved"

**Implementation Pattern:**
- Commission rules stored in `commissionRules` table (JSON config for flexibility)
- Historical rules preserved (never deleted, only deactivated)
- Audit log captures before/after snapshots for compliance

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `UserCard.tsx`, `MeetingPanel.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`, `calculateCommission.ts`)
- API routes: `kebab-case/route.ts` (e.g., `/api/webhook-handler/route.ts`)
- Test files: `{filename}.test.ts` or `{filename}.spec.ts`

**Code:**
- React Components: `PascalCase` (e.g., `UserCard`, `SetterDashboard`)
- Functions/methods: `camelCase` (e.g., `calculateCommission`, `routeCall`)
- Convex tables: `camelCase` (e.g., `users`, `pipelineEvents`, `commissionRules`)
- Convex fields: `camelCase` (e.g., `firstName`, `tenantId`, `systemSizeKw`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_UPLOAD_SIZE`, `DEFAULT_DIALING_RATIO`)
- Types/Interfaces: `PascalCase` (e.g., `User`, `Commission`, `CallStatus`)
- Enums: `PascalCase` for enum, `UPPER_SNAKE_CASE` for values

**Database:**
- Tables: Plural, camelCase (e.g., `users`, `commissions`)
- Foreign keys: `{entity}Id` (e.g., `userId`, `tenantId`, `personId`)
- Junction tables: `{entity1}{Entity2}` (e.g., `organizationMembers`, `projectContacts`)
- Indexes: `by_{field}` or `by_{field1}_and_{field2}` (e.g., `by_tenant`, `by_tenant_and_role`)

**API Routes:**
- REST-style: `/api/{resource}/{action}` (e.g., `/api/webhooks/signalwire/call-answered`)
- Kebab-case for multi-word resources

### Code Organization Patterns

**Feature-Based Structure:**
```
apps/web/app/(dashboard)/
├── setters/              # Setter-specific routes
│   ├── campaigns/
│   ├── leaderboard/
│   └── commissions/
├── consultants/          # Consultant-specific routes
│   ├── meetings/
│   ├── appointments/
│   └── commissions/
└── shared/               # Shared components across roles
```

**Component Co-location:**
```
apps/web/app/components/features/dialer/
├── DialerView.tsx        # Main component
├── DialerView.test.tsx   # Tests co-located
├── CallControls.tsx      # Sub-components
└── ScriptOverlay.tsx
```

**Convex Function Organization:**
```
packages/convex/
├── queries/              # Read operations
│   ├── users.ts          # Grouped by domain
│   └── commissions.ts
├── mutations/            # Write operations
│   ├── pipeline.ts
│   └── calls.ts
└── actions/              # External API calls
    ├── signalwire.ts
    └── mapbox.ts
```

### API Response Format

**All Convex queries/mutations return:**

**Success:**
```typescript
return {
  success: true,
  data: result
}
```

**Error:**
```typescript
return {
  success: false,
  error: {
    code: "VALIDATION_ERROR" | "NOT_FOUND" | "UNAUTHORIZED" | "INTERNAL_ERROR",
    message: "Human-readable error message",
    details?: any  // Optional additional context
  }
}
```

**Frontend consumption:**
```typescript
const result = await mutation({ /* args */ });
if (result.success) {
  // Handle result.data
} else {
  // Show toast: result.error.message
  toast.error(result.error.message);
}
```

### Error Handling

**React Error Boundaries:**
- Global error boundary in root layout (`app/layout.tsx`)
- Feature-specific boundaries for isolated failures
- Fallback UI shows friendly error message + "Try again" button

**Convex Error Handling:**
```typescript
// In mutations/queries
try {
  // Operation
  return { success: true, data: result };
} catch (error) {
  console.error("Operation failed:", error);
  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to complete operation"
    }
  };
}
```

**Frontend Error Handling:**
- Use Sonner toast for user-facing errors
- Log errors to Sentry for monitoring
- Retry logic for transient failures (network, race conditions)

**Validation Errors:**
- Use Zod for form validation (client-side)
- Return structured validation errors from Convex
- Display field-level errors in forms

### Logging Strategy

**Structured Logging:**
```typescript
console.log({
  level: "info" | "warn" | "error",
  message: "Human-readable message",
  context: {
    tenantId,
    userId,
    action: "operation_name",
    ...additionalContext
  },
  timestamp: Date.now()
});
```

**Log Levels:**
- `info`: Normal operations, successful actions
- `warn`: Recoverable issues, deprecation notices
- `error`: Failures requiring attention

**Sentry Integration:**
- Auto-capture uncaught exceptions
- Manual capture for critical errors: `Sentry.captureException(error)`
- Set user context: `Sentry.setUser({ id, email, tenantId })`
- Tag errors by feature: `Sentry.setTag("feature", "predictive-dialer")`

**PII Handling:**
- NEVER log sensitive data (passwords, tokens, SSN, credit cards)
- Hash or mask phone numbers, emails in logs
- Use Sentry's data scrubbing for PII

## Consistency Rules

### Date/Time Handling

**Storage:**
- All timestamps stored as **Unix milliseconds** (number) in Convex
- Use `Date.now()` for current timestamp
- Field naming: `*At` suffix (e.g., `createdAt`, `scheduledAt`, `paidAt`)

**Display:**
- Format using `date-fns` library
- Common formats:
  - Absolute: `format(date, 'MMM d, yyyy h:mm a')` → "Nov 6, 2025 2:30 PM"
  - Relative: `formatDistanceToNow(date, { addSuffix: true })` → "2 hours ago"
- Always display in user's local timezone (browser auto-converts)

**Example:**
```typescript
import { format, formatDistanceToNow } from 'date-fns';

// Store
const appointment = {
  scheduledAt: Date.now(),  // 1730918400000
  ...
};

// Display
<p>Scheduled: {format(appointment.scheduledAt, 'MMM d, yyyy h:mm a')}</p>
<p>Created {formatDistanceToNow(appointment.createdAt, { addSuffix: true })}</p>
```

### Form Handling

**Pattern: React Hook Form + Zod**

```typescript
// Define schema
const formSchema = z.object({
  firstName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  systemSizeKw: z.number().min(0).max(100)
});

type FormData = z.infer<typeof formSchema>;

// Component
function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", email: "", systemSizeKw: 0 }
  });

  const onSubmit = async (data: FormData) => {
    const result = await mutation(data);
    if (!result.success) {
      toast.error(result.error.message);
    }
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

### State Management

**Server State (Convex):**
```typescript
// Query (read)
const users = useQuery(api.queries.users.list, { tenantId });

// Mutation (write)
const createUser = useMutation(api.mutations.users.create);
await createUser({ firstName, lastName, email });
```

**Client UI State (React useState/Zustand):**
```typescript
// Simple UI state
const [isPanelOpen, setIsPanelOpen] = useState(false);

// Complex global UI state (if needed)
import { create } from 'zustand';

const useMeetingUIStore = create((set) => ({
  panels: { video: true, script: true, map: false },
  togglePanel: (name) => set((state) => ({
    panels: { ...state.panels, [name]: !state.panels[name] }
  }))
}));
```

### Authentication & Authorization

**Middleware Pattern (Next.js):**
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in', '/sign-up', '/']);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});
```

**Convex RLS Pattern:**
```typescript
// Every query/mutation
export const listUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const tenantId = identity.tokenIdentifier; // From authenticated session

    // ALWAYS filter by tenantId
    return await ctx.db
      .query("users")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  }
});
```

**Role Checking:**
```typescript
// Helper function
async function requireRole(ctx, allowedRoles: string[]) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const user = await ctx.db.query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user) throw new Error("User not found");

  const roles = await ctx.db.query("userRoles")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .collect();

  const hasRole = roles.some(r => allowedRoles.includes(r.role) && r.isActive);
  if (!hasRole) throw new Error("Forbidden");

  return { user, tenantId: user.tenantId };
}

// Usage in mutation
export const createCommission = mutation({
  handler: async (ctx, args) => {
    const { user, tenantId } = await requireRole(ctx, ["Finance", "System Administrator"]);
    // Proceed with operation...
  }
});
```

## Data Architecture

### Core Entities

**Already Defined in Existing Schema:**
- **tenants**: Multi-tenant root (1 tenant = 1 solar company)
- **users**: System users (Setters, Consultants, etc.) with Clerk integration
- **userRoles**: Many-to-many role assignments (12 roles)
- **organizations**: Households, commercial entities (potential customers)
- **people**: Individuals within organizations (decision makers, contacts)
- **projects**: Solar installations (linked to organizations)
- **leads**: Pre-project contacts for Sundialer
- **campaigns**: Dialer campaigns for lead assignment
- **appointments**: Scheduled consultant meetings
- **communications**: Call logs, emails, SMS, in-app messages
- **projectSiteSurveys**: Photo submissions with AI validation
- **pipelineEvents**: Event-driven architecture for cascading updates

**To Be Added (Epic Implementation):**

**Epic 3 Tables:**
- **calls**: Telephony call records (callSid, direction, status, setterId, personId)
- **callRoutingLog**: Audit trail for routing decisions
- **scripts**: Setter/Consultant scripts (tenant-configurable)
- **scriptProgress**: Tracking which checkboxes completed per call

**Epic 4 Tables:**
- **meetings**: WebRTC meeting rooms (roomId, consultantId, personId, status)
- **financingPartners**: Available financing options per tenant
- **financingApplications**: Submitted applications with approval status

**Epic 5 Tables:**
- **commissionRules**: kW-based calculation rules (tiered rates, product modifiers)
- **commissions**: Commission records (amount, status, breakdown)
- **commissionDisputes**: Dispute tracking with resolution notes
- **commissionAuditLog**: Complete audit trail (before/after snapshots)

**Epic 6 Tables:**
- **leaderboardMetrics**: Daily rollup of contractor performance
- **badges**: Achievement definitions (criteria, tiers)
- **userBadges**: Unlocked badges per user with progress
- **callRecordings**: Top performer call library (tags, public flag)
- **announcements**: Manager-to-team communications
- **knowledgeBaseArticles**: Training materials, FAQs
- **learningProgress**: Article views, recording watches for badge tracking

### Relationship Patterns

**Multi-Tenancy:**
- ALL tables include `tenantId: v.id("tenants")`
- ALL tables indexed: `.index("by_tenant", ["tenantId"])`
- ALL queries MUST filter by tenantId (RLS enforcement)

**Many-to-Many:**
- Junction tables pattern: `{entity1}{Entity2}`
- Examples: `organizationMembers`, `projectContacts`, `userRoles`
- Always include `tenantId` for RLS

**Event-Driven Updates:**
- Pipeline changes insert to `pipelineEvents`
- Scheduled functions process events
- Triggers: commission calculations, notifications, metrics updates

## API Contracts

### Convex Query/Mutation Signatures

**Query Example:**
```typescript
export const listPeople = query({
  args: {
    tenantId: v.id("tenants"),
    search: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Implementation
    return { success: true, data: results };
  }
});
```

**Mutation Example:**
```typescript
export const updatePipelineStage = mutation({
  args: {
    personId: v.id("people"),
    toStage: v.string()
  },
  handler: async (ctx, args) => {
    // Validation, update, event trigger
    return { success: true, data: updatedPerson };
  }
});
```

**Action Example (External API):**
```typescript
export const placeCall = action({
  args: {
    personId: v.id("people"),
    phoneNumber: v.string()
  },
  handler: async (ctx, args) => {
    // Call SignalWire API
    return { success: true, data: { callSid } };
  }
});
```

### Webhook Endpoints

**SignalWire Webhooks:**
- `POST /api/webhooks/signalwire/call-initiated`
- `POST /api/webhooks/signalwire/call-answered`
- `POST /api/webhooks/signalwire/call-completed`

**Webhook Pattern:**
```typescript
// app/api/webhooks/signalwire/call-answered/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // 1. Verify webhook signature (SignalWire-specific)
  // 2. Parse payload
  // 3. Update Convex via mutation/action
  // 4. Return 200 OK
  return NextResponse.json({ received: true });
}
```

## Security Architecture

### Authentication & Authorization

**Clerk Integration:**
- OAuth2 and passwordless authentication with magic links
- MFA support for enhanced security
- Webhook-based user sync to Convex (create, update, delete)
- Next.js middleware validates Clerk sessions on protected routes
- Session validation via Clerk JWT tokens
- Convex auth helpers retrieve authenticated user with tenant context
- Multi-tenant isolation via tenantId stored in Clerk public metadata

**RBAC (12 Roles):**
- Roles defined in `userRoles` table
- Multiple roles per user (e.g., Setter + Trainer)
- `isPrimary` flag for default dashboard routing
- Role checks in Convex mutations (requireRole helper)

### Data Security

**Row-Level Security (RLS):**
- Every query filters by `tenantId`
- Prevents cross-tenant data leakage
- Enforced at database query layer (cannot be bypassed)

**PII Protection:**
- Encrypted in transit (HTTPS)
- Sensitive fields (SSN, payment info) stored encrypted (future enhancement)
- Access logged for compliance (commissionAuditLog pattern)

**API Security:**
- Webhook signature verification (SignalWire)
- Rate limiting via Convex (built-in)
- CORS configured for web/mobile origins only

### File Security

**Cloudflare R2:**
- Pre-signed URLs for uploads (time-limited, single-use)
- Private buckets (no public listing)
- Access control via pre-signed download URLs
- Retention policies (90-day auto-delete for call recordings)

## Performance Considerations

### Frontend Performance

**Next.js Optimizations:**
- Server Components for static content (reduce client bundle)
- Dynamic imports for heavy components (Mapbox, video)
- Image optimization via next/image
- Font optimization (local fonts, no external requests)

**React Optimizations:**
- Memoization (React.memo, useMemo, useCallback) for expensive renders
- Virtualization for long lists (react-window)
- Lazy loading for off-screen components

### Backend Performance

**Convex Optimizations:**
- Proper indexing (all foreign keys, tenant scopes)
- Batch operations (bulk inserts, updates)
- Pagination for large queries
- Scheduled functions for background work (avoid blocking mutations)

**Real-time Optimization:**
- Minimize subscription scope (only query what's needed)
- Use reactive queries (automatic caching, deduplication)

### WebRTC Performance

**Mediasoup SFU:**
- VP8 codec for broad compatibility
- Simulcast for adaptive bitrate
- Self-hosted coturn reduces latency vs managed TURN

**Target Metrics:**
- Video latency: <150ms
- Audio latency: <100ms
- Connection establishment: <3s

### Scalability Targets

- **Tenants:** Thousands (multi-tenant pool model)
- **Users per tenant:** 1-2000
- **Concurrent video sessions:** 200 (per Epic 4)
- **Predictive dialer throughput:** 10-20 calls/second per tenant
- **Database growth:** Automatic Convex scaling (serverless)

## Deployment Architecture

### Environment Strategy

**Environments:**
1. **Local Development:** `npm run dev` (web), Convex dev deployment
2. **Staging:** Vercel preview deployments, Convex staging deployment
3. **Production:** Vercel production, Convex production deployment

### Hosting

**Web App:** Vercel
- Next.js optimized platform
- Automatic CI/CD from Git
- Edge network (low latency)
- Serverless functions for API routes

**Mobile App:** Expo EAS Build + App Store / Google Play
- EAS Build for CI/CD
- Over-the-air updates (OTA) for quick fixes

**Mediasoup Server:** Railway / Render
- Dedicated Node.js environment
- WebSocket support
- Persistent processes (not serverless)

**Convex:** Convex Cloud (managed)
- Serverless database + backend
- Real-time subscriptions
- Automatic scaling

**Cloudflare R2:** Cloudflare (managed)
- S3-compatible object storage
- Global CDN for fast access

**coturn (TURN/STUN):** Self-hosted VPS (DigitalOcean, Hetzner)
- UDP/TCP support for NAT traversal
- Multiple regions for low latency

### CI/CD Pipeline

**Automated:**
- Git push → Vercel auto-deploy (web)
- Git push → Convex auto-deploy (backend)
- PR preview deployments (Vercel + Convex preview)

**Testing in CI:**
- Vitest unit tests (required to pass)
- Playwright E2E tests (staging only)
- Type checking (tsc --noEmit)
- Linting (eslint)

**Release Process:**
1. Feature branch → PR
2. CI runs tests
3. Manual review + approval
4. Merge to main → Auto-deploy to production

## Development Environment

### Prerequisites

**Required:**
- **Node.js:** 20.9+ (LTS)
- **pnpm:** 9.x (package manager for monorepo)
- **Git:** 2.x
- **Convex CLI:** `npm install -g convex`

**Accounts:**
- **Convex:** https://convex.dev (free tier for dev)
- **SignalWire:** https://signalwire.com (trial account)
- **Mapbox:** https://mapbox.com (free tier)
- **Cloudflare R2:** https://cloudflare.com (pay-as-you-go)
- **Sentry:** https://sentry.io (free tier)

### Setup Commands

**Initial Setup:**
```bash
# Clone repository
git clone <repo-url> sunup
cd sunup

# Install dependencies (monorepo)
pnpm install

# Configure environment variables
cp .env.local.example .env.local
# Fill in: CLERK_*, NEXT_PUBLIC_CLERK_*, CONVEX_*, MAPBOX_*, SIGNALWIRE_*

# Initialize Convex
cd apps/web
npx convex dev
# Follow prompts: Login, create project, save deployment URL

# Start web dev server
pnpm dev:web

# Start mobile dev server (separate terminal)
pnpm dev:mobile

# Start Mediasoup server (separate terminal)
cd apps/mediasoup-server
pnpm dev
```

**Testing:**
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type check
pnpm typecheck

# Lint
pnpm lint
```

### Git Workflow

**MANDATORY:** All story implementation MUST follow the git workflow procedures documented in:
📄 **`docs/git-workflow.md`**

**Key Rules:**
1. **NEVER start a story without committing all current work first**
2. **ALWAYS create a story branch** (format: `story/X-Y-brief-name`)
3. **Commit frequently** during implementation (WIP commits)
4. **Test before completing** each story (build + lint + tests)
5. **Merge back** to feature branch when story complete

**Safety Checkpoints:**
- Tag after each epic: `git tag -a epic-X-complete`
- Tag before risky refactors: `git tag -a pre-story-X-Y`
- Use `git reflog` for emergency recovery

**Branch Strategy:**
```
main (production)
  └── feat/sundialer (feature branch)
        ├── story/1-1-monorepo-refactor
        ├── story/1-2-tailwind-setup
        └── ... (one branch per story)
```

**The dev-story workflow automatically enforces these rules and will block if uncommitted changes exist.**

See `docs/git-workflow.md` for complete procedures, recovery strategies, and emergency procedures.

## Architecture Decision Records (ADRs)

### ADR-001: Convex for Backend + Database

**Status:** Accepted

**Context:** Need real-time updates, multi-tenant RLS, serverless scaling, TypeScript-native backend.

**Decision:** Use Convex as combined backend + database instead of separate solutions (e.g., Supabase, Firebase, custom Node.js + Postgres).

**Rationale:**
- Real-time subscriptions eliminate polling overhead
- Built-in RLS via query filters (no complex policies)
- TypeScript-native (shared types between frontend/backend)
- Serverless (zero ops, automatic scaling)
- Scheduled functions (no separate cron infrastructure)

**Consequences:**
- Vendor lock-in (Convex-specific)
- Limited to Convex query language (not raw SQL)
- New technology (smaller ecosystem than Postgres)

---

### ADR-002: Custom Mediasoup SFU for WebRTC

**Status:** Accepted

**Context:** Need 1-to-1 video conferencing for consultant meetings, scalable to 1-to-200 (future).

**Decision:** Build custom Mediasoup SFU instead of using managed service (Twilio, Daily.co).

**Rationale:**
- Full control over video quality, bitrate, codecs
- Lower cost at scale (no per-minute pricing)
- Custom features (unified meeting interface, handoff system)
- Aligns with PRD requirement for custom build

**Consequences:**
- Additional infrastructure (separate server, coturn)
- More complex deployment vs managed service
- Team must maintain WebRTC expertise

---

### ADR-003: Turborepo Monorepo for Web + Mobile

**Status:** Accepted

**Context:** Need code sharing between Next.js web app and React Native mobile apps (Convex types, UI components, business logic).

**Decision:** Refactor to Turborepo monorepo with shared packages.

**Rationale:**
- Maximum code reuse (80%+ shared types/logic)
- Unified build system (single CI/CD pipeline)
- Consistent dependencies (no version drift)
- Official Convex Expo template provides starting point

**Consequences:**
- Initial refactor effort (Story 1.1)
- More complex project structure vs separate repos
- Build cache management (Turborepo handles this)

---

### ADR-004: Cloudflare R2 for File Storage

**Status:** Accepted

**Context:** Need storage for call recordings (audio), site survey photos, documents.

**Decision:** Use Cloudflare R2 instead of AWS S3 or Convex file storage.

**Rationale:**
- S3-compatible API (easy migration if needed)
- Much cheaper egress costs vs S3
- Global CDN for fast access
- Generous free tier

**Consequences:**
- Pre-signed URLs required (more complex than public buckets)
- Less mature than S3 (fewer third-party integrations)

---

### ADR-005: Real-time Commission Calculations

**Status:** Accepted

**Context:** Commissions must be visible immediately when pipeline stage changes (QMet, Sale).

**Decision:** Calculate commissions in real-time via Convex mutations instead of batch processing.

**Rationale:**
- Real-time visibility drives contractor trust (key PRD goal)
- Convex handles concurrency (no race conditions)
- Audit trail captures every change
- Performance acceptable (calculations are lightweight)

**Consequences:**
- More database writes vs batch (acceptable with Convex pricing)
- Must handle edge cases (duplicate triggers, rollbacks)

---

_Generated by BMAD Decision Architecture Workflow v1.3.2_
_Date: 2025-11-06_
_For: Greg_
