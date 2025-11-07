# Sunup - Epic Breakdown

**Author:** Greg
**Date:** 2025-11-05
**Project Level:** 4
**Target Scale:** Enterprise Platform

---

## Overview

This document provides the detailed epic breakdown for Sunup, expanding on the high-level epic list in the [PRD](./PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

## Epic Summary

**Total Epics:** 6
**Total Stories:** 86 stories
**Target Timeline:** 21 weeks (MVP)

| Epic | Stories | Focus Area |
|------|---------|------------|
| Epic 1: Foundation & Infrastructure | 12 | Multi-tenant architecture, auth, pipeline system, CI/CD |
| Epic 2: Core CRM & Pipeline Management | 13 | Person/Organization CRUD, pipeline tracking, Mapbox, notifications |
| Epic 3: Predictive Dialer & Campaign Management | 21 | SignalWire SIP telephony, predictive dialing, call routing, scripts |
| Epic 4: Video Conferencing & Unified Meeting Interface | 18 | Mediasoup WebRTC, unified meeting view, handoff system, financing |
| Epic 5: Commission Engine & Financial Dashboards | 12 | kW-based commissions, approval workflows, audit trail, payment tracking |
| Epic 6: Gamification, Leaderboards & Contractor Engagement | 10 | Leaderboards, achievement badges, call library, announcements, knowledge base |

**Value Delivery Progression:**
1. Epic 1 → Secure, scalable foundation with 12-role RBAC
2. Epic 2 → CRM enables lead/customer management and pipeline visibility
3. Epic 3 → Setters can make appointments at scale via predictive dialer
4. Epic 4 → Consultants can conduct video meetings with unified interface
5. Epic 5 → Contractors see real-time commission transparency (key retention driver)
6. Epic 6 → Gamification and learning drive engagement and performance

**Total Story Count vs. PRD Estimate:** 86 stories (PRD estimate: 63-91) ✅ Within range

---

# Epic 1: Foundation & Infrastructure

## Expanded Goal

Establish the technical foundation for Sunup with multi-tenant architecture, authentication, and core pipeline system. This epic delivers a deployable skeleton application with authentication, basic data models, and CI/CD pipeline—ready for feature development in subsequent epics. All subsequent work depends on this foundation, making security (multi-tenant RLS) and scalability (event-driven architecture) first-class concerns from Day 1.

**Value Delivery:** By the end of this epic, we have a secure, scalable foundation that supports 12 roles, enforces tenant isolation, and enables real-time pipeline updates. Developers can immediately begin building features in Epic 2+ without refactoring core architecture.

---

## Story Breakdown

**Story 1.1: Refactor to Turborepo Monorepo Structure**

As a Developer,
I want to refactor the existing Next.js project to a Turborepo monorepo structure,
So that web and mobile apps can share code via packages (convex, ui, types, config) and we can build both platforms from a unified codebase.

**Acceptance Criteria:**
1. Turborepo configured with workspace structure (see reference repo below)
2. Existing convex code moved to `packages/convex` with proper exports
3. Existing web app moved to `apps/web` with updated import paths
4. Mobile app scaffold created in `apps/mobile` using Expo Router
5. Shared UI components package created in `packages/ui` (shadcn/ui components)
6. Shared types package created in `packages/types` (Convex types, domain types)
7. Shared config package created in `packages/config` (ESLint, TypeScript, Tailwind configs)
8. All builds working via turbo commands (`turbo build`, `turbo dev`)
9. Package dependencies properly configured (internal workspace dependencies)
10. Documentation updated (README.md explains monorepo structure)

**Reference Repository:** https://github.com/get-convex/turbo-expo-nextjs-clerk-convex-monorepo

**Prerequisites:** None (first story - CRITICAL: Must be completed before all other stories as they assume monorepo structure exists)

**Note:** This is a brownfield refactor. The project already has Next.js 16+, TypeScript 5.8+, Convex, Clerk, and shadcn/ui configured. This story moves that existing code into a monorepo structure to enable code sharing between web and mobile apps.

---

**Story 1.2: Setup TailwindCSS 4+ and shadcn/ui Component Library**

As a Developer,
I want TailwindCSS 4+ and shadcn/ui configured with theming support,
So that I can build consistent, accessible UI components with light/dark mode.

**Acceptance Criteria:**
1. TailwindCSS 4+ installed and configured with Next.js
2. shadcn/ui initialized with components directory (`/components/ui`)
3. tweakcn theme system configured for light/dark mode switching
4. Basic theme variables defined (colors, spacing, typography)
5. Sample page demonstrates theme switching functionality
6. Tailwind typography plugin configured for content rendering
7. All shadcn/ui components are accessible (WCAG 2.1 Level AA compliant by default)

**Prerequisites:** Story 1.1 (project initialization)

---

**Story 1.3: Initialize Convex Backend and Database**

As a Developer,
I want Convex backend initialized with TypeScript schemas and database connection,
So that I have a real-time, serverless backend for data management.

**Acceptance Criteria:**
1. Convex project initialized with TypeScript
2. Convex client configured in Next.js app (`ConvexClientProvider`)
3. Basic schema file created (`convex/schema.ts`)
4. Database connection verified with simple query/mutation
5. Real-time subscription working (demonstrate with test component)
6. Convex dashboard accessible and linked in README
7. Environment variables configured for Convex connection

**Prerequisites:** Story 1.1 (project initialization)

---

**Story 1.4: Implement Multi-Tenant Row-Level Security (RLS) Foundation**

As a Developer,
I want every database query to enforce tenantId filtering at the query layer,
So that data isolation between tenants is guaranteed and cross-tenant data leakage is impossible.

**Acceptance Criteria:**
1. All Convex tables include mandatory `tenantId` field in schema
2. Helper function `getAuthUserWithTenant(ctx)` returns authenticated user + tenantId
3. Query wrapper ensures every query/mutation checks tenantId
4. Composite indexes created: `(tenantId, otherField)` for efficient tenant-scoped queries
5. Test suite verifies cross-tenant queries return empty results
6. Code linting rule flags queries missing tenantId check
7. Documentation in `/docs/multi-tenant-rls.md` explains RLS patterns

**Prerequisites:** Story 1.3 (Convex backend initialized)

---

**Story 1.5: Integrate Clerk Authentication**

As a Developer,
I want Clerk authentication integrated with Next.js,
So that users can securely sign in and access the application.

**Acceptance Criteria:**
1. Clerk installed and configured with Next.js middleware
2. Sign-in and sign-up flows working via Clerk components
3. Protected routes require authentication (redirect to sign-in if not authenticated)
4. User session accessible in server and client components
5. Clerk webhook configured for user sync to Convex database
6. User profile page displays Clerk user data
7. Sign-out functionality working correctly

**Prerequisites:** Story 1.3 (Convex backend initialized)

---

**Story 1.6: Implement Role-Based Access Control (RBAC) for 12 Roles**

As a System Admin,
I want users assigned to one of 12 roles with role-based permissions enforced,
So that each user has appropriate access to features and data.

**Acceptance Criteria:**
1. User schema includes `role` field with enum: `Setter, Consultant, SalesManager, SetterManager, ProjectManager, Installer, Recruiter, Trainer, SystemAdmin, Executive, Finance, Operations`
2. Clerk metadata syncs role to Convex user record
3. Role-checking helper functions: `hasRole(ctx, role)`, `requireRole(ctx, role)`
4. Sample protected query demonstrates role enforcement (e.g., only SalesManager can access)
5. Role assignment interface for SystemAdmin (simple form)
6. Test suite verifies unauthorized role access returns error
7. Documentation in `/docs/rbac.md` explains role hierarchy and permissions

**Prerequisites:** Story 1.5 (Clerk authentication integrated)

---

**Story 1.7: Create Pipeline Data Model and Schema**

As a Developer,
I want a configurable pipeline schema supporting Lead → Set → Met → QMet → Sale → Installation stages,
So that all roles can track customer progress through the sales lifecycle.

**Acceptance Criteria:**
1. `pipelineStages` table with tenant-scoped stages (default: Lead, Set, Met, QMet, Sale, Installation)
2. `persons` table includes `currentPipelineStage` field
3. Pipeline stage transitions are logged in `pipelineHistory` table
4. Query function `getPipelineStageOrder(tenantId)` returns ordered stages
5. Validation prevents skipping stages (e.g., cannot go Lead → Sale directly)
6. System Admin can add/remove/reorder pipeline stages per tenant
7. Sample data seeded for testing (3 persons at different stages)

**Prerequisites:** Story 1.4 (Multi-tenant RLS foundation)

---

**Story 1.8: Implement Event System for Pipeline Status Changes**

As a Developer,
I want pipeline status changes to trigger events that notify other parts of the system,
So that cascading actions (notifications, commission calculations) happen automatically.

**Acceptance Criteria:**
1. Event emitter function `emitPipelineEvent(ctx, personId, fromStage, toStage)` publishes events
2. Event subscription pattern allows listeners to register handlers
3. Sample event handler logs pipeline changes (demonstrates pattern)
4. Pipeline mutation triggers event on status change
5. Event payload includes: tenantId, personId, userId (who changed), timestamp, fromStage, toStage
6. Events are stored in `pipelineEvents` table for audit trail
7. Documentation in `/docs/event-system.md` explains event patterns

**Prerequisites:** Story 1.7 (Pipeline data model created)

---

**Story 1.9: Create Person and Organization Base Schema**

As a Developer,
I want Person and Organization data models with tenant isolation and basic fields,
So that subsequent epics can build CRM functionality on this foundation.

**Acceptance Criteria:**
1. `persons` table with fields: tenantId, firstName, lastName, email, phone, currentPipelineStage, organizationId
2. `organizations` table with fields: tenantId, name, address, primaryContactId
3. Composite indexes: `(tenantId, email)`, `(tenantId, organizationId)`
4. CRUD mutations with tenantId enforcement: `createPerson`, `updatePerson`, `deletePerson`
5. Query functions: `getPersonById`, `listPersonsByTenant`, `getPersonsByOrganization`
6. Validation: Email format, required fields
7. Sample data seeded for testing (10 persons, 3 organizations)

**Prerequisites:** Story 1.7 (Pipeline data model created)

---

**Story 1.10: Setup GitHub Actions CI/CD Pipeline**

As a Developer,
I want automated testing and deployment on every push to main branch,
So that code quality is maintained and deployments are reliable.

**Acceptance Criteria:**
1. GitHub Actions workflow file (`.github/workflows/ci.yml`) created
2. CI pipeline runs on every pull request: lint, type-check, test
3. CD pipeline deploys to Vercel on push to main branch
4. Environment secrets configured in GitHub (Convex, Clerk, Vercel)
5. Branch protection rules require CI passing before merge
6. Deployment status visible in GitHub PR checks
7. README.md documents CI/CD pipeline and deployment process

**Prerequisites:** Story 1.9 (schemas created, testable codebase exists)

---

**Story 1.11: Setup Testing Infrastructure with Playwright and Vitest**

As a Developer,
I want testing infrastructure configured with E2E and unit test capabilities,
So that I can write tests for all features in subsequent epics.

**Acceptance Criteria:**
1. Vitest 4.0.7+ configured for unit/integration tests
2. Playwright 1.56+ configured for E2E tests
3. Sample unit test demonstrates Convex query/mutation testing
4. Sample E2E test demonstrates authentication flow (sign-in, protected route access)
5. Test commands in package.json: `npm test`, `npm run test:e2e`
6. Code coverage reporting configured (aim for 95%+ target)
7. Documentation in `/docs/testing.md` explains testing patterns

**Prerequisites:** Story 1.6 (RBAC implemented, testable features exist)

---

**Story 1.12: Deploy Initial Application to Vercel Production**

As a Developer,
I want the foundation application deployed to Vercel production,
So that stakeholders can access the live application and Epic 2 features can be deployed incrementally.

**Acceptance Criteria:**
1. Application deployed to Vercel production environment
2. Custom domain configured (if available) or Vercel subdomain accessible
3. Environment variables configured in Vercel dashboard
4. Convex production deployment linked to Vercel app
5. Clerk production instance configured with correct redirect URLs
6. Smoke test verifies: Sign-in works, protected route accessible with correct role
7. Production URL documented in README.md and shared with team

**Prerequisites:** Story 1.10 (CI/CD pipeline configured)

---

## Epic 1 Summary

**Total Stories:** 12
**Estimated Timeline:** 3-4 weeks
**Key Deliverable:** Secure, scalable foundation deployed to production with authentication, multi-tenant RLS, pipeline system, and CI/CD

**Epic Complete When:**
- ✅ Application deployed to production
- ✅ Authentication working (Clerk)
- ✅ 12 roles defined with RBAC enforcement
- ✅ Multi-tenant RLS enforced on all queries
- ✅ Pipeline data model with event system
- ✅ CI/CD pipeline operational
- ✅ Testing infrastructure ready for Epic 2+

---

# Epic 2: Core CRM & Pipeline Management (SunCRM)

## Expanded Goal

Deliver complete CRM functionality with Person/Organization management, pipeline tracking, bidirectional visibility, and Mapbox integration for property visualization. This epic transforms the foundation from Epic 1 into a functional CRM that all roles can use to manage customer relationships and track pipeline progress. The CRM becomes the "source of truth" for customer data, enabling Setters to set appointments, Consultants to conduct meetings, and all roles to track progress.

**Value Delivery:** By the end of this epic, users can create/edit Persons and Organizations, track their pipeline status, view complete activity history, see satellite property imagery, and experience real-time pipeline updates across all roles. This establishes the data layer that all subsequent features (dialer, video conferencing, commissions) will build upon.

---

## Story Breakdown

**Story 2.1: Build Person List View with Search and Filtering**

As a Setter/Consultant/Sales Manager,
I want to view a list of all Persons with search and filtering capabilities,
So that I can quickly find specific people I need to contact or manage.

**Acceptance Criteria:**
1. Person list page displays all Persons for current tenant with pagination (50 per page)
2. Search box filters by firstName, lastName, email, phone (real-time, debounced)
3. Filter dropdowns: Pipeline Stage, Organization, Date Created
4. Table columns: Name, Email, Phone, Pipeline Stage, Organization, Last Activity
5. Clicking a Person row navigates to Person detail page
6. List updates in real-time when Person data changes (Convex subscription)
7. Empty state message when no Persons match filters

**Prerequisites:** Epic 1 complete (Person schema exists)

---

**Story 2.2: Build Person Detail Page with Complete Profile**

As a Setter/Consultant/Sales Manager,
I want to view a Person's complete profile with all details and history,
So that I have full context when interacting with that Person.

**Acceptance Criteria:**
1. Person detail page displays: Name, Email, Phone, Current Pipeline Stage, Organization, Address, Created Date
2. Editable fields: Click to edit in-place with auto-save
3. Organization displayed with link to Organization detail page
4. Pipeline history timeline shows all stage transitions with dates and user who made change
5. Activity timeline section (prepared for notes in Story 2.3)
6. Real-time updates when Person data changes
7. Breadcrumb navigation: Home → Persons → [Person Name]

**Prerequisites:** Story 2.1 (Person list view exists for navigation)

---

**Story 2.3: Implement Notes and Activity Timeline**

As a Setter/Consultant/Sales Manager,
I want to add notes to a Person's timeline and view complete activity history,
So that I have documented context for all interactions.

**Acceptance Criteria:**
1. Notes table created with fields: tenantId, personId, userId, content, timestamp
2. Add note form on Person detail page (textarea + save button)
3. Activity timeline displays: Notes, Pipeline changes, other system events in chronological order
4. Each timeline entry shows: User avatar, User name, Action, Timestamp (relative, e.g., "2 hours ago")
5. Notes are editable/deletable by creator or SalesManager role
6. Real-time updates when new notes added
7. Timeline infinite scroll loads older entries on demand

**Prerequisites:** Story 2.2 (Person detail page exists)

---

**Story 2.4: Build Person Create/Edit Forms**

As a Setter/Consultant/Sales Manager,
I want to create new Persons and edit existing Person details,
So that I can manage customer data accurately.

**Acceptance Criteria:**
1. "Create Person" button on Person list page opens modal/form
2. Form fields: First Name (required), Last Name (required), Email (required, validated), Phone (optional), Organization (dropdown, optional), Address (optional)
3. Form validation: Email format, required fields, duplicate email check
4. Save creates Person with currentPipelineStage = "Lead"
5. Edit form pre-fills with existing data, allows updating all fields
6. Success toast notification on save
7. Form accessible via keyboard navigation

**Prerequisites:** Story 2.1 (Person list view provides entry point)

---

**Story 2.5: Build Organization List and Detail Views**

As a Sales Manager/Operations,
I want to view and manage Organizations (companies) with associated Persons,
So that I can track relationships at the organizational level.

**Acceptance Criteria:**
1. Organization list page with search and pagination
2. Organization detail page shows: Name, Address, Primary Contact, List of all associated Persons
3. Create/Edit Organization forms with validation
4. Link from Person detail to Organization detail (if associated)
5. Organization deletion prevents if Persons still associated (show warning)
6. Real-time updates for Organization data
7. Breadcrumb navigation: Home → Organizations → [Organization Name]

**Prerequisites:** Epic 1 complete (Organization schema exists)

---

**Story 2.6: Implement Pipeline Stage Transition with Validation**

As a Setter/Consultant/Sales Manager,
I want to move Persons through pipeline stages with validation and automatic logging,
So that pipeline status is always accurate and auditable.

**Acceptance Criteria:**
1. Pipeline stage dropdown on Person detail page shows all stages for tenant
2. Changing stage triggers validation: Cannot skip stages (must progress sequentially)
3. Validation prevents invalid transitions (e.g., Lead → Sale without intermediate stages)
4. Stage change emits pipeline event (triggers event system from Epic 1)
5. Pipeline history logs transition with user and timestamp
6. Toast notification confirms stage change
7. Real-time updates propagate to all users viewing that Person

**Prerequisites:** Story 2.2 (Person detail page exists), Epic 1 Story 1.8 (Event system)

---

**Story 2.7: Integrate Mapbox for Satellite Property Imagery**

As a Setter/Consultant,
I want to view satellite imagery of a Person's property address,
So that I can assess solar viability and prepare for conversations.

**Acceptance Criteria:**
1. Mapbox API integrated with Sunup (API key configured)
2. Person detail page displays satellite map if address exists
3. Map shows property location with pin marker
4. Zoom controls allow close-up view of roof
5. Satellite layer (not street map) displayed by default
6. Map updates when address field changes
7. Graceful error handling if address cannot be geocoded

**Prerequisites:** Story 2.2 (Person detail page exists)

---

**Story 2.8: Implement Bidirectional Visibility for Setters**

As a Setter,
I want to see the outcome of my Sets (Met → QMet → Sale status),
So that I know when my appointments result in sales and commissions.

**Acceptance Criteria:**
1. Setter Dashboard page created (route: `/setter/dashboard`)
2. "My Sets" section displays all Persons where Setter set the appointment (tracked in Person record)
3. For each Set, display: Person Name, Set Date, Current Pipeline Stage, Commission Status
4. Real-time updates when Set progresses through pipeline (Met → QMet → Sale)
5. Visual indicators: Green checkmark for QMet/Sale, Yellow for Met, Gray for pending
6. Filter: "All Sets", "This Week", "This Month"
7. Count badges: Total Sets, QMets, Sales (this week/month)

**Prerequisites:** Story 2.6 (Pipeline transitions working), Epic 1 Story 1.6 (RBAC for Setter role)

---

**Story 2.9: Implement Bidirectional Visibility for Consultants**

As a Consultant,
I want to see installation progress for my closed sales,
So that I know when customers complete installation and I can follow up if needed.

**Acceptance Criteria:**
1. Consultant Dashboard page created (route: `/consultant/dashboard`)
2. "My Sales" section displays all Persons where Consultant closed the sale
3. For each Sale, display: Person Name, Sale Date, Current Pipeline Stage (Sale → Installation Scheduled → Installation Complete), Installation Date (if scheduled)
4. Real-time updates when Sale progresses to Installation stages
5. Visual indicators: Green for Installation Complete, Yellow for in-progress, Gray for scheduled
6. Filter: "All Sales", "This Week", "This Month"
7. Count badges: Total Sales, Installations Complete, Pending Installations

**Prerequisites:** Story 2.6 (Pipeline transitions working), Epic 1 Story 1.6 (RBAC for Consultant role)

---

**Story 2.10: Build Sales Manager Dashboard with Pipeline Overview**

As a Sales Manager,
I want a dashboard showing pipeline health and team performance,
So that I can identify bottlenecks and coach effectively.

**Acceptance Criteria:**
1. Sales Manager Dashboard page created (route: `/sales-manager/dashboard`)
2. Pipeline overview chart: Bar chart showing Person count per stage (Lead, Set, Met, QMet, Sale, Installation)
3. Conversion funnel visualization: Lead → Set → Met → QMet → Sale percentages
4. Team performance summary: Top Setters (by Sets), Top Consultants (by Sales)
5. Recent activity feed: Latest 10 pipeline transitions with Person name and stage change
6. Real-time updates for all dashboard metrics
7. Date range filter: Today, This Week, This Month, All Time

**Prerequisites:** Story 2.6 (Pipeline transitions working), Epic 1 Story 1.6 (RBAC for SalesManager role)

---

**Story 2.11: Implement Search Across Person/Organization Records**

As a Sales Manager/Operations,
I want global search across all Person and Organization records,
So that I can quickly find anyone or any company regardless of current view.

**Acceptance Criteria:**
1. Global search bar in main navigation (accessible from any page)
2. Search query searches: Person firstName, lastName, email, phone; Organization name
3. Search results dropdown shows matches grouped: Persons (top 5), Organizations (top 5)
4. Clicking result navigates to Person/Organization detail page
5. "View all results" link if more than 10 total matches
6. Search debounced (300ms delay before query)
7. Keyboard navigation: Arrow keys to select result, Enter to navigate

**Prerequisites:** Story 2.1 (Person list), Story 2.5 (Organization list)

---

**Story 2.12: Add Pipeline Stage Filtering to Dashboard Views**

As a Setter/Consultant/Sales Manager,
I want to filter dashboard lists by pipeline stage,
So that I can focus on specific segments (e.g., only QMets, only pending installations).

**Acceptance Criteria:**
1. Setter Dashboard "My Sets" section has stage filter dropdown: All, Met, QMet, Sale
2. Consultant Dashboard "My Sales" section has stage filter dropdown: All, Sale, Installation Scheduled, Installation Complete
3. Sales Manager Dashboard has global stage filter affecting all metrics
4. Filter state persists in URL query params (shareable links)
5. Filter updates list/charts in real-time
6. "Clear filters" button resets to default (All)
7. Count badges reflect filtered results

**Prerequisites:** Story 2.8 (Setter Dashboard), Story 2.9 (Consultant Dashboard), Story 2.10 (Sales Manager Dashboard)

---

**Story 2.13: Implement Real-Time Notifications for Pipeline Changes**

As a Setter/Consultant/Sales Manager,
I want real-time toast notifications when pipeline changes affect my work,
So that I stay informed without constantly refreshing dashboards.

**Acceptance Criteria:**
1. Toast notification library integrated (e.g., sonner, react-hot-toast)
2. Setters receive notification when their Set becomes QMet or Sale: "🎉 John Smith is now a QMet!"
3. Consultants receive notification when their Sale moves to Installation Complete: "✅ Jane Doe installation complete"
4. Sales Managers receive notification for all team pipeline changes (configurable in settings)
5. Notifications display for 5 seconds, dismissible with click
6. Notification sound optional (user preference toggle)
7. Notification history accessible in notification dropdown (last 20)

**Prerequisites:** Story 2.6 (Pipeline transitions emit events), Epic 1 Story 1.8 (Event system)

---

## Epic 2 Summary

**Total Stories:** 13
**Estimated Timeline:** 3-4 weeks
**Key Deliverable:** Functional CRM with Person/Organization management, pipeline tracking, bidirectional visibility, property maps, and real-time notifications

**Epic Complete When:**
- ✅ Person/Organization CRUD fully functional
- ✅ Pipeline transitions tracked and audited
- ✅ Mapbox satellite imagery displaying for addresses
- ✅ Setter Dashboard showing Set outcomes
- ✅ Consultant Dashboard showing installation progress
- ✅ Sales Manager Dashboard with pipeline overview
- ✅ Real-time notifications for pipeline changes
- ✅ Global search working across all records

---

# Epic 3: Predictive Dialer & Campaign Management (Sundialer)

## Expanded Goal

Implement a true predictive dialer using SignalWire Programmable Voice API (SIP) that automatically places outbound calls from campaign queues and routes both outbound and incoming calls to available Setters. This epic delivers intelligent call distribution, configurable dialing ratios, script guidance during live calls, and qualification enforcement—transforming manual calling into an automated, high-efficiency appointment-setting system.

**Value Delivery:** By the end of this epic, the system automatically dials campaign leads and distributes connected calls to available Setters, eliminating manual dialing time. Setters focus on conversations (not dialing), follow scripts with real-time guidance, and book qualified appointments that automatically update the pipeline. Setter Managers configure dialing parameters, monitor team activity, and ensure productivity standards are met.

---

## Story Breakdown

**Story 3.1: Create Campaign Data Model and Schema**

As a Developer,
I want a Campaign schema with Person assignments and tenant isolation,
So that Setter Managers can create targeted calling campaigns.

**Acceptance Criteria:**
1. `campaigns` table created with fields: tenantId, name, description, status (active/paused/complete), dialingRatio (default: 1.5), routingAlgorithm (round-robin/longest-idle), createdBy, createdAt
2. `campaignAssignments` table links Persons to Campaigns: tenantId, campaignId, personId, assignedAt, callStatus (pending/dialing/connected/completed/no-answer/busy/voicemail)
3. Composite indexes: `(tenantId, campaignId)`, `(tenantId, campaignId, callStatus)`
4. Query functions: `getCampaignById`, `listCampaignsByTenant`, `getPersonsInCampaign`
5. Validation: Campaign name required, status enum enforcement, dialingRatio between 1.0 and 5.0
6. Sample data seeded: 2 campaigns with 20 Persons each
7. Documentation in `/docs/campaign-model.md`

**Prerequisites:** Epic 2 complete (Person schema available for assignment)

---

**Story 3.2: Implement Tenant Phone Number Management**

As a System Admin,
I want to assign phone numbers to my tenant for inbound/outbound calling,
So that our company has dedicated numbers for campaigns.

**Acceptance Criteria:**
1. `tenantPhoneNumbers` table: tenantId, phoneNumber (E.164 format), label, isPrimary, createdAt
2. System Admin interface (route: `/admin/phone-numbers`) to add/remove phone numbers
3. Phone number validation: E.164 format, unique across all tenants
4. Primary phone number designation (one per tenant for outbound caller ID)
5. List view shows all tenant phone numbers with labels ("Main Line", "Campaign A", etc.)
6. Remove phone number button (soft delete, preserves call history)
7. Phone numbers automatically provisioned via SignalWire API (manual assignment for MVP)

**Prerequisites:** Epic 1 Story 1.6 (RBAC for SystemAdmin role)

---

**Story 3.3: Integrate SignalWire Programmable Voice API**

As a Developer,
I want SignalWire Programmable Voice integrated with authentication and webhooks,
So that the system can make/receive calls via SIP.

**Acceptance Criteria:**
1. SignalWire SDK installed and configured (API credentials in environment variables)
2. SignalWire Space created with project credentials (Space URL, Project ID, API Token)
3. Webhook endpoints created for call events: `/api/webhooks/signalwire/call-initiated`, `/api/webhooks/signalwire/call-answered`, `/api/webhooks/signalwire/call-completed`
4. Webhook signature verification implemented (validate requests from SignalWire)
5. Test call successfully places outbound call and receives webhook callbacks
6. Error handling and logging for webhook failures
7. Documentation in `/docs/signalwire-integration.md`

**Prerequisites:** Epic 1 complete (webhook infrastructure)

---

**Story 3.4: Build Campaign Management Interface for Setter Managers**

As a Setter Manager,
I want to create and manage campaigns with configurable dialing parameters,
So that I can optimize calling efficiency for my Setter team.

**Acceptance Criteria:**
1. Campaign list page (route: `/setter-manager/campaigns`) displays all campaigns with status badges
2. "Create Campaign" button opens form with fields: Name, Description, Dialing Ratio (1.0-5.0 slider), Routing Algorithm (dropdown: round-robin/longest-idle), Status (active/paused)
3. Dialing Ratio tooltip explains: "Number of calls to place per available Setter (e.g., 2.0 = 2 calls per Setter)"
4. Campaign detail page shows: Name, Description, Dialing Ratio, Routing Algorithm, Assigned Persons count, Active Setters count, Call stats (dialed/connected/completed)
5. Edit campaign form allows updating all fields including dialing parameters
6. Pause/Resume campaign buttons (changes status, stops/starts predictive dialing)
7. Real-time updates when campaign data changes

**Prerequisites:** Story 3.1 (Campaign schema with dialingRatio and routingAlgorithm fields), Epic 1 Story 1.6 (RBAC for SetterManager role)

---

**Story 3.5: Implement Person Assignment to Campaigns**

As a Setter Manager,
I want to assign Persons to a campaign from the Person list,
So that the predictive dialer has a queue of people to call.

**Acceptance Criteria:**
1. Campaign detail page has "Assign Persons" button
2. Person selection modal displays filterable Person list (by pipeline stage = "Lead", organization)
3. Multi-select checkbox allows bulk Person assignment
4. Assigned Persons appear in campaign's Person list with callStatus: "pending"
5. Remove Person from campaign button (unassigns without deleting Person)
6. Validation prevents assigning same Person to campaign twice
7. Real-time count updates: "25 Persons assigned, 18 pending calls"

**Prerequisites:** Story 3.4 (Campaign management interface exists)

---

**Story 3.6: Implement Predictive Dialing Engine**

As a Developer,
I want a background job that automatically dials Persons based on available Setters and dialing ratio,
So that Setters receive connected calls without manual dialing.

**Acceptance Criteria:**
1. Scheduled Convex function runs every 10 seconds: `predictiveDialer.ts`
2. For each active campaign, calculate: `callsToPlace = availableSetters * dialingRatio`
3. Query pending Persons from campaign (callStatus = "pending"), prioritize oldest assignments
4. For each Person, place outbound call via SignalWire API: `client.calls.create()`
5. Update campaignAssignment callStatus: pending → dialing
6. Store call SID in `calls` table: tenantId, personId, setterId (null initially), callSid, direction (outbound), status (initiated), startTime
7. Webhook receives call events, updates call status and campaignAssignment status

**Prerequisites:** Story 3.3 (SignalWire integrated), Story 3.5 (Persons assigned to campaigns)

---

**Story 3.7: Implement Call Routing and Handoff Logic**

As a Developer,
I want connected calls automatically routed to available Setters based on routing algorithm,
So that Setters receive calls without delay.

**Acceptance Criteria:**
1. Webhook endpoint `/api/webhooks/signalwire/call-answered` receives event when call connects
2. Query available Setters in campaign (status = "available", not currently on call)
3. Apply routing algorithm:
   - Round-robin: Select next Setter in rotation
   - Longest-idle: Select Setter with longest time since last call
4. Assign call to Setter: Update `calls` table setterId field, set status = "connected"
5. Emit real-time event to Setter's browser: `callIncoming` with Person data and call SID
6. If no Setters available, queue call for 30 seconds, then route to Setter Manager with alert
7. Log routing decision in `callRoutingLog` table for analysis

**Prerequisites:** Story 3.6 (Predictive dialer places calls), Story 3.15 (Setter availability status)

---

**Story 3.8: Build Setter "Join Campaign" and Availability Interface**

As a Setter,
I want to join a campaign and set my availability status,
So that the predictive dialer routes calls to me.

**Acceptance Criteria:**
1. Setter Dashboard displays "Active Campaigns" section listing all active campaigns
2. Each campaign shows: Name, Description, Assigned Persons count, Active Setters count, Dialing Ratio
3. "Join Campaign" button changes Setter status to "Available" in that campaign, navigates to Dialer View
4. Availability status dropdown on Dialer View: "Available", "On Break", "Offline"
5. "Available" status enables call routing; "On Break" pauses routing; "Offline" leaves campaign
6. Setter can only be in one campaign at a time (joining new campaign leaves previous)
7. Real-time updates show Setters joining/leaving, availability changes

**Prerequisites:** Story 3.4 (Campaigns exist), Epic 2 Story 2.8 (Setter Dashboard exists)

---

**Story 3.9: Build Dialer View with Live Call Interface**

As a Setter,
I want a dialer interface that displays Person details when a call is routed to me,
So that I have context when the call connects.

**Acceptance Criteria:**
1. Dialer View page (route: `/setter/dialer`) displays when Setter joins campaign
2. Default state shows: "Waiting for call..." with availability status toggle
3. When call routed (real-time event), interface updates:
   - Person details panel: Name, Phone, Email, Address, Organization, Pipeline Stage
   - Satellite map of property (Epic 2 Mapbox integration)
   - Script overlay in right panel (Story 3.10)
   - Call controls: "End Call" button, call timer
4. Audio/video element connects to SignalWire call SID (WebRTC browser connection)
5. Call timer starts when call connects
6. Layout: Person details (left), Map (center), Script (right) - collapsible panels
7. When call ends, interface returns to "Waiting for call..." state

**Prerequisites:** Story 3.7 (Call routing sends real-time event), Story 3.8 (Setter joins campaign), Epic 2 Story 2.7 (Mapbox integration)

---

**Story 3.10: Implement Script Overlay with Real-Time Progress Tracking**

As a Setter,
I want a script overlay with progress checkmarks during live calls,
So that I follow the Sales Manager-defined script and track completion.

**Acceptance Criteria:**
1. `scripts` table created: tenantId, name, content (markdown with sections), scriptType (setter/consultant), createdBy
2. Campaign schema adds scriptId field (foreign key to scripts table)
3. Script displays in right panel of Dialer View with sections parsed from markdown
4. Each script section has checkbox for completion tracking
5. Clicking checkbox marks section complete, updates progress bar: "5/8 sections complete"
6. Script progress auto-saves to `callAttempts` table: tenantId, callId, sectionCompletionStatus (JSON array)
7. Script Management page for Sales Managers (route: `/sales-manager/scripts`) to create/edit scripts (CRUD interface)

**Prerequisites:** Story 3.9 (Dialer View shows live calls)

---

**Story 3.11: Implement Qualification Enforcement**

As a Setter Manager,
I want to prevent Setters from booking appointments until required qualification questions are answered,
So that only quality Mets reach Consultants.

**Acceptance Criteria:**
1. Script markdown supports special syntax for required questions: `[REQUIRED] Question text`
2. Required questions displayed with highlighted background (e.g., yellow) in script overlay
3. "Book Appointment" button disabled until all required question checkboxes checked
4. Tooltip on disabled button: "Complete all required questions to book appointment"
5. Backend validation on appointment booking mutation prevents bypassing
6. Visual indicator shows "✅ Qualified - Ready to Book" when all requirements met
7. Qualification metadata saved in `callAttempts` table

**Prerequisites:** Story 3.10 (Script overlay exists)

---

**Story 3.12: Implement Call Disposition and Appointment Booking**

As a Setter,
I want to disposition calls and book appointments during or after calls,
So that Person status updates and Consultants know who to meet.

**Acceptance Criteria:**
1. Call disposition panel appears during call with buttons: "Booked", "Not Interested", "No Answer", "Call Back Later", "Bad Number"
2. "Booked" button opens appointment booking modal with date/time picker
3. Booking appointment creates `appointments` table entry: tenantId, personId, setterId, scheduledAt, status (scheduled)
4. Booking updates Person pipeline: Lead → Set (campaign assignment) → Met will happen in Epic 4 when Consultant starts meeting
5. Pipeline event emitted on booking (for Epic 2 bidirectional visibility)
6. Other dispositions update campaignAssignment callStatus and Person notes
7. "End Call" button triggers disposition if not already selected, ends SignalWire call

**Prerequisites:** Story 3.11 (Qualification enforcement enables "Book" button), Story 3.9 (Live call interface)

---

**Story 3.13: Implement Incoming Call Handling with Caller ID Lookup**

As a Setter,
I want incoming calls automatically routed to me with context about the caller,
So that I can answer calls professionally.

**Acceptance Criteria:**
1. SignalWire webhook endpoint `/api/webhooks/signalwire/incoming-call` receives inbound call events
2. Caller ID (phone number) extracted from webhook payload
3. Database query searches Persons by phone number within tenant
4. If Person found: Identify campaign (if assigned), route call to available Setter with full context
5. If Person not found: Create new Person record (firstName: "Unknown", phone: caller ID), route to available Setter with toast: "Incoming caller: Campaign unknown"
6. Call routing uses same algorithm as outbound (round-robin or longest-idle from tenant config)
7. Incoming calls logged in `calls` table with direction = "inbound"

**Prerequisites:** Story 3.7 (Call routing logic), Story 3.2 (Tenant phone numbers for inbound routing)

---

**Story 3.14: Implement Hours-Active Tracking**

As a Setter Manager,
I want to track Setter hours-active per campaign,
So that I can ensure minimum 30 hours/week requirement is met.

**Acceptance Criteria:**
1. `setterActivity` table tracks: tenantId, setterId, campaignId, startTime, endTime, totalMinutes
2. Joining campaign (status = "Available") starts activity timer
3. Status changes:
   - "Available" → "On Break": Pause timer
   - "On Break" → "Available": Resume timer
   - "Available" → "Offline": Stop timer, log entry
4. Setter Dashboard displays: "Hours this week: 12.5 / 30 (minimum)"
5. Visual indicator: Green if ≥30 hours, Yellow if 20-29, Red if <20
6. Setter Manager campaign view shows per-Setter hours-active leaderboard
7. Scheduled Convex function calculates weekly totals (runs daily)

**Prerequisites:** Story 3.8 (Setter availability status), Story 3.15 (Availability toggle functional)

---

**Story 3.15: Implement Setter Availability Status Management**

As a Setter,
I want to manage my availability status with accurate state tracking,
So that the system knows when to route calls to me.

**Acceptance Criteria:**
1. User schema includes `availabilityStatus` field: available, on-break, offline, on-call
2. Dialer View has status dropdown with options: "Available", "On Break", "Offline"
3. Status "available" → Setter in routing pool, receives calls
4. Status "on-break" → Pauses hours-active timer, removed from routing pool
5. Status "offline" → Stops timer, logs activity entry, removes from routing pool
6. Status automatically changes to "on-call" when call connected, back to "available" when call ends
7. Real-time status updates visible in Setter Manager monitoring dashboard

**Prerequisites:** Story 3.8 (Join campaign), Story 3.9 (Dialer View)

---

**Story 3.16: Enhance Setter Dashboard with Live Dialer Stats**

As a Setter,
I want my dashboard to show real-time dialer metrics,
So that I can track my calling performance and commission potential.

**Acceptance Criteria:**
1. Setter Dashboard "Today's Stats" section: Calls Received, Calls Answered, Sets Booked, Hours Active
2. "This Week" section: Total Calls, Total Sets, Conversion Rate (Sets/Calls %), QMets, Commission Earned
3. Real-time counters update during active calling (WebSocket subscriptions)
4. Visual charts: Calls per day (line chart, last 7 days), Conversion rate trend (line chart)
5. "Currently Active" badge shows campaign name and availability status with toggle
6. Commission tracker integrated (pending commissions for QMets/Sales from Epic 5)
7. Motivational message: "3 more Sets to reach top 3 on leaderboard!"

**Prerequisites:** Story 3.14 (Hours tracking), Story 3.12 (Call dispositions tracked), Epic 2 Story 2.8 (Setter Dashboard foundation)

---

**Story 3.17: Build Setter Manager Real-Time Campaign Monitoring Dashboard**

As a Setter Manager,
I want to monitor active campaigns with real-time Setter activity and call flow,
So that I can provide support and optimize team productivity.

**Acceptance Criteria:**
1. Setter Manager Dashboard (route: `/setter-manager/dashboard`)
2. "Active Campaigns" section lists campaigns with live metrics: Total Persons, Calls Dialing, Calls Connected, Sets Booked, Active Setters, Current Dialing Ratio
3. Per-campaign drill-down shows:
   - Setter leaderboard: Calls received, Sets booked, Hours active, Current status
   - Call queue status: Pending persons, Currently dialing, Average wait time
   - Call flow visualization: Dialed → Answered → Connected → Completed funnel
4. "Team Activity" real-time feed: "Sarah just booked an appointment with John Smith", "Mike answered call from Jane Doe"
5. Alerts section: Setters below 30-hour minimum, Low answer rates, Queue depletion warnings
6. Configuration controls: Adjust dialing ratio, Change routing algorithm, Pause/Resume campaign
7. All metrics update in real-time (WebSocket subscriptions)

**Prerequisites:** Story 3.14 (Hours tracking), Story 3.12 (Dispositions), Story 3.6 (Predictive dialer running), Epic 1 Story 1.6 (RBAC for SetterManager role)

---

**Story 3.18: Implement Call Metadata and Performance Analytics**

As a Sales Manager,
I want detailed call metadata tracked for performance analysis and coaching,
So that I can identify improvement opportunities.

**Acceptance Criteria:**
1. `callAttempts` table stores: tenantId, callId, personId, setterId, campaignId, direction, startTime, endTime, duration, disposition, scriptCompletionPercentage, qualificationMet (boolean)
2. Call metadata logged on every call completion (disposition selected)
3. Sales Manager performance page (route: `/sales-manager/performance/setters`) lists all Setters
4. Clicking Setter shows detailed call history table: Date, Person, Direction, Duration, Disposition, Script %, Qualification Met
5. Aggregate metrics: Average call duration, Disposition breakdown (pie chart), Script adherence trend
6. Filters: Date range, Campaign, Disposition type, Qualification status
7. Export to CSV for offline analysis

**Prerequisites:** Story 3.12 (Call dispositions), Story 3.11 (Qualification tracking), Epic 1 Story 1.6 (RBAC for SalesManager role)

---

**Story 3.19: Implement Campaign Scheduling and Auto-Activation**

As a Setter Manager,
I want to schedule campaigns with start/end dates and automatic status changes,
So that campaigns run during optimal times without manual intervention.

**Acceptance Criteria:**
1. Campaign schema adds fields: scheduledStartDate, scheduledEndDate
2. Campaign create/edit form includes optional date/time pickers
3. Scheduled Convex function runs hourly, checks all campaigns:
   - If scheduledStartDate ≤ now && status = "scheduled" → set status = "active", start predictive dialing
   - If scheduledEndDate ≤ now && status = "active" → set status = "complete", stop dialing
4. Campaign list shows scheduled campaigns with countdown: "Starts in 3 days 4 hours"
5. Active campaigns show time remaining: "Ends in 5 days 2 hours"
6. Setters can only join "active" campaigns (scheduled/complete campaigns not visible in join list)
7. Real-time notifications when campaign status changes

**Prerequisites:** Story 3.4 (Campaign management), Story 3.6 (Predictive dialer controlled by campaign status)

---

**Story 3.20: Implement Answer Detection Configuration (Research Required)**

As a System Admin,
I want to configure answer detection parameters for the predictive dialer,
So that the system accurately identifies when humans answer vs voicemail/busy signals.

**Acceptance Criteria:**
1. Research SignalWire answer detection capabilities and best practices (AMD - Answering Machine Detection)
2. System Admin configuration page (route: `/admin/dialer-config`) with answer detection settings
3. Configurable parameters: Detection timeout (ms), Silence threshold, Initial silence, Greeting duration, Total analysis time
4. Test mode: Place test call with current settings, show detection result
5. Documentation in `/docs/answer-detection-config.md` explaining each parameter
6. Default settings recommended by SignalWire applied on initial setup
7. Settings stored in `tenantConfig` table, applied to all outbound calls for tenant

**Prerequisites:** Story 3.3 (SignalWire integration), Story 3.6 (Predictive dialer)

**Note:** This story requires research into SignalWire's AMD capabilities. May need to iterate based on findings.

---

**Story 3.21: Implement Manual Outbound Calling for Setters**

As a Setter,
I want to manually place outbound calls to specific Persons when needed,
So that I can follow up on callbacks or reach out to leads outside of campaign context.

**Acceptance Criteria:**
1. Person detail page has "Call" button for Setters (visible when Setter is "available" or "on-break")
2. Clicking "Call" button initiates outbound call via SignalWire API to Person's phone number
3. Call connects directly to Setter (no routing to other Setters)
4. Dialer View loads with Person context, script overlay, and call controls
5. Manual calls logged in `calls` table with direction = "outbound-manual", no campaignId
6. Call disposition and booking workflow same as predictive dialer calls (Story 3.12)
7. Manual calls count toward Setter's daily/weekly metrics but separately tracked for analysis

**Prerequisites:** Story 3.9 (Dialer View), Story 3.12 (Call disposition), Epic 2 Story 2.2 (Person detail page)

---

## Epic 3 Summary

**Total Stories:** 21
**Estimated Timeline:** 5-6 weeks (increased from original 4-5 weeks due to telephony complexity)
**Key Deliverable:** Fully automated predictive dialer using SignalWire with intelligent call routing, real-time Setter monitoring, and configurable dialing parameters

**Epic Complete When:**
- ✅ SignalWire Programmable Voice integrated with SIP
- ✅ Predictive dialer automatically places calls based on available Setters and configurable dialing ratio
- ✅ Connected calls automatically routed to available Setters using configurable algorithm (round-robin or longest-idle)
- ✅ Incoming calls identified via caller ID lookup and routed appropriately
- ✅ Setters can manually place outbound calls when needed (callbacks, ad-hoc outreach)
- ✅ Setters receive calls with full Person context, script guidance, and qualification enforcement
- ✅ Appointments booked update pipeline (Lead → Set)
- ✅ Hours-active tracking enforces 30-hour minimum
- ✅ Setter Dashboard shows real-time calling metrics
- ✅ Setter Manager Dashboard monitors campaigns, team activity, and call flow in real-time
- ✅ Call metadata captured for performance analysis and coaching

**Key Technical Dependencies:**
- SignalWire Space configuration and phone number provisioning
- Webhook infrastructure for real-time call events
- WebRTC browser connection to SignalWire for audio handling
- Real-time event system for call routing and UI updates

**Open Questions for Epic 3:**
1. Answer detection parameter tuning (Story 3.20 - requires testing)
2. Optimal default dialing ratio per campaign type
3. Call recording storage strategy (deferred to Phase 2, metadata only in MVP)

---

# Epic 4: Video Conferencing & Unified Meeting Interface (SunMeeting)

## Expanded Goal

Deliver 1-to-1 WebRTC video conferencing with a unified Consultant meeting interface that eliminates app-switching during solar consultations. This epic implements custom WebRTC using Mediasoup SFU, intelligent meeting handoff with availability-based routing, financing integration with automated form delivery, and comprehensive meeting tools (slideshow, calculator, knowledge base, scripts). Consultants conduct entire meetings—from intro to close—in a single interface without leaving the platform.

**Value Delivery:** By the end of this epic, Consultants receive scheduled appointments, conduct video meetings with all necessary tools integrated (scripts, maps, financing, presentations), and close sales with automatic pipeline updates. The meeting handoff system ensures no appointment goes unmet due to Consultant unavailability, and Sales Managers have visibility into coverage gaps. This completes the sales workflow: Setter books appointment → Consultant conducts meeting → Sale closes.

---

## Story Breakdown

**Story 4.1: Setup Mediasoup SFU Infrastructure**

As a Developer,
I want Mediasoup SFU server configured for 1-to-1 WebRTC video sessions,
So that Consultants and Persons can conduct live video meetings.

**Acceptance Criteria:**
1. Mediasoup SFU server installed and configured (Node.js server, separate from Next.js app)
2. Mediasoup server deployed to hosting environment (Vercel serverless functions or separate VPS)
3. WebSocket server for signaling (connection negotiation, ICE candidates)
4. TURN/STUN servers configured for NAT traversal (coturn or managed service)
5. Test 1-to-1 video call successfully connects between two browsers
6. Mediasoup room management: Create room, join room, leave room, close room
7. Documentation in `/docs/mediasoup-setup.md`

**Prerequisites:** Epic 1 complete (infrastructure foundation)

---

**Story 4.2: Implement WebRTC Client Library and Connection Management**

As a Developer,
I want a reusable WebRTC client library for video/audio connections,
So that video calling can be integrated across Consultant and Person interfaces.

**Acceptance Criteria:**
1. WebRTC client library created: `/lib/webrtc-client.ts`
2. Functions: `initializeConnection()`, `createOffer()`, `handleAnswer()`, `addIceCandidate()`, `closeConnection()`
3. Media stream management: `getUserMedia()` for camera/microphone access, `addLocalStream()`, `addRemoteStream()`
4. Connection state handling: connecting, connected, disconnected, failed with event callbacks
5. Error handling and reconnection logic (automatic retry on disconnect)
6. Browser permission handling (camera/microphone access with user prompts)
7. Unit tests verify connection lifecycle

**Prerequisites:** Story 4.1 (Mediasoup infrastructure)

---

**Story 4.3: Build Meeting Scheduling and Appointment Management**

As a Consultant,
I want to view my scheduled appointments with Person details,
So that I can prepare for upcoming meetings.

**Acceptance Criteria:**
1. Consultant Dashboard "Today's Appointments" section displays scheduled appointments (from Epic 3 Story 3.12 `appointments` table)
2. Each appointment shows: Person Name, Scheduled Time, Set By (Setter name), Person Phone/Email, Meeting Status (scheduled/in-progress/completed/cancelled)
3. Appointments sorted chronologically (earliest first)
4. "Start Meeting" button appears 15 minutes before scheduled time
5. Clicking "Start Meeting" navigates to Meeting View (Story 4.5)
6. Calendar view toggle: List view (default) vs Day/Week calendar grid
7. Real-time updates when new appointments booked or status changes

**Prerequisites:** Epic 3 Story 3.12 (Appointments table created), Epic 2 Story 2.9 (Consultant Dashboard foundation)

---

**Story 4.4: Implement Pre-Meeting Alerts and Availability Checking**

As a Consultant,
I want pre-meeting alerts 15 minutes before scheduled appointments,
So that I can prepare and confirm availability.

**Acceptance Criteria:**
1. Scheduled Convex function runs every minute, checks upcoming appointments (next 15 minutes)
2. Alert sent to assigned Consultant: Toast notification + browser notification (if enabled)
3. Alert message: "Meeting with [Person Name] in 15 minutes - Take or Handoff?"
4. Alert includes buttons: "Take Meeting" (confirms availability), "Handoff" (triggers handoff flow)
5. If Consultant doesn't respond within 5 minutes, second alert: "Meeting with [Person Name] in 10 minutes"
6. Consultant availability status automatically checked: "available" → alert sent, "on-break" or "offline" → auto-trigger handoff
7. Alert history logged in `meetingAlerts` table

**Prerequisites:** Story 4.3 (Appointments visible), Epic 3 Story 3.15 (Availability status exists)

---

**Story 4.5: Build Unified Meeting View Interface**

As a Consultant,
I want a unified meeting interface with all tools in one view,
So that I never need to switch apps during consultations.

**Acceptance Criteria:**
1. Meeting View page (route: `/consultant/meeting/[appointmentId]`) with multi-panel layout
2. **Left Panel:** Person details (Name, Email, Phone, Address, Organization, Pipeline Stage, Historical notes from Epic 2)
3. **Center Panel:** Video area with local/remote video streams, call controls (mute, camera off, end call), call timer
4. **Right Panel:** Tabbed interface with Script, Knowledge Base, Calculator (tabs switchable)
5. **Bottom Panel (collapsible):** Slideshow viewer, Financing forms area
6. All panels collapsible/resizable with user preferences saved per Consultant
7. Keyboard shortcuts: M (mute), V (camera), S (script), K (knowledge base), C (calculator)

**Prerequisites:** Story 4.2 (WebRTC client library), Story 4.3 (Appointments scheduled)

---

**Story 4.6: Implement 1-to-1 Video Calling in Meeting View**

As a Consultant,
I want to initiate video calls with Persons from the Meeting View,
So that I can conduct face-to-face solar consultations remotely.

**Acceptance Criteria:**
1. "Start Call" button in Meeting View initiates WebRTC connection
2. System generates unique meeting room ID for appointment
3. Person invitation sent via SMS/Email: "Join video meeting: [link to join page]"
4. Person join page (public route: `/meeting/join/[roomId]`) prompts for camera/microphone permission
5. When Person joins, Consultant sees remote video stream, Person sees Consultant stream
6. Call controls functional: Mute audio, Disable camera, End call
7. Call duration timer displays for both parties

**Prerequisites:** Story 4.5 (Meeting View interface), Story 4.2 (WebRTC client)

---

**Story 4.7: Implement Script Overlay for Consultants**

As a Consultant,
I want the Consultant script displayed during meetings with progress tracking,
So that I follow the Sales Manager-defined consultation flow.

**Acceptance Criteria:**
1. Script tab in right panel displays script assigned to appointment (from Epic 3 `scripts` table, scriptType = "consultant")
2. Script sections parsed from markdown with collapsible headers
3. Each section has checkbox for completion tracking
4. Progress bar shows completion: "6/10 sections complete"
5. Script progress auto-saves to `meetingAttempts` table (similar to callAttempts from Epic 3)
6. Consultant can navigate script via scroll or section jump links
7. Script remains visible when switching to other tabs (floating mini-view option)

**Prerequisites:** Story 4.5 (Meeting View with script tab), Epic 3 Story 3.10 (Scripts table and management)

---

**Story 4.8: Implement Slideshow Viewer with Screen Sharing**

As a Consultant,
I want to present slideshows to Persons without external tools,
So that I can showcase solar solutions visually during meetings.

**Acceptance Criteria:**
1. `presentations` table created: tenantId, name, fileUrl (PDF or image set), uploadedBy, createdAt
2. Presentation management page (route: `/consultant/presentations`) for uploading/managing presentations
3. Meeting View slideshow viewer displays presentation with navigation (prev/next slide)
4. "Share with Person" button shares current slide in Person's browser view (not screen sharing)
5. Slide synchronized between Consultant and Person (Consultant controls navigation, both see same slide)
6. Full-screen mode for both Consultant and Person
7. Slide notes panel (visible to Consultant only) displays presenter notes

**Prerequisites:** Story 4.5 (Meeting View with slideshow area)

---

**Story 4.9: Implement Financing Integration with Automated Form Delivery**

As a Consultant,
I want financing options automatically presented with forms delivered to Person's browser,
So that I can secure financing approvals during meetings.

**Acceptance Criteria:**
1. `financingPartners` table: tenantId, name, apiEndpoint (optional), formUrl, aprRange, termsRange, requiresPersonFill (boolean)
2. Financing options panel displays during meeting (triggered by script section or manual button)
3. System auto-presents 2-3 financing options based on Person location/credit tier (configurable logic)
4. Consultant selects financing option → System displays form in Person's browser via real-time sync
5. Form simultaneously visible in Consultant's Meeting View (screen sharing mode) so Consultant can guide Person
6. Person fills form directly in their browser, submits to financing partner API (if integrated) or emails to partner
7. Approval status displayed to both parties (if API integrated: approved/denied with details)

**Prerequisites:** Story 4.5 (Meeting View), Story 4.6 (Video calling for real-time sync)

---

**Story 4.10: Implement ROI Calculator Tool**

As a Consultant,
I want a solar ROI calculator accessible during meetings,
So that I can demonstrate financial benefits to Persons in real-time.

**Acceptance Criteria:**
1. Calculator tab in right panel opens ROI calculator interface
2. Input fields: System size (kW), Electric bill ($/month), Panel cost ($/kW), Financing APR (%), Term (years)
3. Calculations: Total system cost, Monthly payment, Annual savings, Payback period, 25-year ROI
4. Results displayed with visual charts (payback timeline, cumulative savings graph)
5. "Share Results" button syncs calculator to Person's browser view
6. Save calculation to Person's activity timeline (for future reference)
7. Pre-fill system size based on property analysis (if available from Mapbox integration)

**Prerequisites:** Story 4.5 (Meeting View with calculator tab)

---

**Story 4.11: Implement Knowledge Base Integration**

As a Consultant,
I want searchable knowledge base access during meetings,
So that I can quickly find answers to Person questions without leaving the interface.

**Acceptance Criteria:**
1. Knowledge Base tab in right panel displays searchable articles
2. Articles organized by categories: Products, Financing, Installation Process, Warranties, FAQs
3. Search bar with auto-complete suggestions
4. Clicking article displays content with formatting (markdown rendering)
5. "Recently Viewed" section shows last 5 articles accessed
6. Knowledge base management page (route: `/sales-manager/knowledge-base`) for creating/editing articles (CRUD)
7. Real-time search across article titles and content

**Prerequisites:** Story 4.5 (Meeting View with knowledge base tab)

---

**Story 4.12: Implement Meeting Handoff System with Round-Robin Routing**

As a Consultant,
I want to hand off meetings I can't attend to available Consultants,
So that no appointments go unmet.

**Acceptance Criteria:**
1. Meeting handoff triggered by: Consultant clicks "Handoff" on alert (Story 4.4), Consultant no response within 10 minutes, Consultant status "offline"
2. System queries available Consultants (status = "available", not currently in meeting)
3. Apply routing algorithm (configurable in tenant settings: round-robin or longest-idle, similar to Epic 3 Setter routing)
4. Send handoff alert to selected Consultant: "Meeting with [Person Name] handed off to you - Starts in [X] minutes"
5. Accepting Consultant reassigned in appointments table, original Consultant notified
6. If handoff Consultant also unavailable, cascade to next available Consultant (up to 3 attempts)
7. Handoff history logged in `meetingHandoffs` table

**Prerequisites:** Story 4.4 (Pre-meeting alerts), Epic 3 Story 3.7 (Routing logic pattern)

---

**Story 4.13: Implement Sales Manager Escalation for No Coverage**

As a Sales Manager,
I want alerts when no Consultants are available for meetings,
So that I can intervene and prevent missed appointments.

**Acceptance Criteria:**
1. If meeting handoff cascades through all available Consultants with no acceptance, escalate to Sales Manager
2. Sales Manager receives urgent notification: "Meeting with [Person Name] in [X] minutes - No Consultant coverage"
3. Notification includes 5 action options:
   - "Take Meeting Myself" (assign to Sales Manager)
   - "Reschedule" (opens reschedule modal, notifies Person)
   - "Manual Assign" (dropdown to force-assign specific Consultant)
   - "Cancel Meeting" (notifies Person with apology, removes from queue)
   - "Ignore" (meeting remains unassigned, Person may not get meeting)
4. Sales Manager dashboard shows "Coverage Gaps" widget with upcoming at-risk appointments
5. Escalation history logged for operational analysis
6. System learns optimal staffing patterns (Phase 2 AI feature - placeholder for now)
7. Email backup sent to Sales Manager if no browser response within 5 minutes

**Prerequisites:** Story 4.12 (Handoff system), Epic 1 Story 1.6 (RBAC for SalesManager role)

---

**Story 4.14: Implement Meeting Disposition and Pipeline Updates**

As a Consultant,
I want to disposition meetings and update pipeline status,
So that sales progress is tracked accurately.

**Acceptance Criteria:**
1. Meeting View has disposition panel with options: "QMet" (qualified), "Not Qualified", "Reschedule", "No Show"
2. "QMet" disposition updates Person pipeline: Met → QMet (triggers commission for Setter from Epic 5)
3. "QMet" disposition opens sale details form: System size (kW), Products selected, Total price, Financing option selected
4. Submitting sale details updates pipeline: QMet → Sale (triggers commission for Consultant from Epic 5)
5. "Not Qualified" updates notes, Person returns to pipeline for follow-up
6. "Reschedule" opens calendar picker, creates new appointment
7. Pipeline events emitted for all transitions (for Epic 2 bidirectional visibility)

**Prerequisites:** Story 4.5 (Meeting View), Epic 2 Story 2.6 (Pipeline transitions), Epic 3 Story 3.12 (Appointment booking pattern)

---

**Story 4.15: Enhance Consultant Dashboard with Meeting Metrics**

As a Consultant,
I want my dashboard to show meeting-specific metrics,
So that I can track consultation effectiveness and commission potential.

**Acceptance Criteria:**
1. Consultant Dashboard "Today's Stats" section: Meetings Scheduled, Meetings Completed, QMets, Sales, Commission Earned
2. "This Week" section: Total Meetings, Conversion Rate (Meetings → QMets %), Conversion Rate (QMets → Sales %), Total Commission
3. "Upcoming Appointments" widget with next 5 meetings, countdown timers
4. Visual charts: Meetings per day (bar chart), Conversion funnel (Mets → QMets → Sales)
5. "Recent Activity" feed: "Closed sale with John Smith - $35K system", "QMet with Jane Doe"
6. Availability status toggle (available/on-break/offline) prominently displayed
7. Real-time updates for all metrics

**Prerequisites:** Story 4.14 (Meeting dispositions tracked), Epic 2 Story 2.9 (Consultant Dashboard foundation)

---

**Story 4.16: Implement Meeting Recording Metadata (No Audio/Video Storage)**

As a Sales Manager,
I want meeting metadata tracked for performance analysis,
So that I can coach Consultants effectively.

**Acceptance Criteria:**
1. `meetingAttempts` table stores: tenantId, appointmentId, consultantId, personId, startTime, endTime, duration, disposition, scriptCompletionPercentage, qualificationMet (boolean), saleAmount (if closed)
2. Meeting metadata logged on every disposition
3. Sales Manager performance page (route: `/sales-manager/performance/consultants`) lists all Consultants
4. Clicking Consultant shows meeting history: Date, Person, Duration, Disposition, Script %, Sale Amount
5. Aggregate metrics: Average meeting duration, Conversion rates, Script adherence trend, Total sales volume
6. Filters: Date range, Disposition type, Sale amount range
7. Export to CSV for offline analysis

**Prerequisites:** Story 4.14 (Meeting dispositions), Epic 3 Story 3.18 (Performance analytics pattern)

---

**Story 4.17: Implement Consultant Availability Toggle and Status Management**

As a Consultant,
I want to manage my availability status with accurate state tracking,
So that the meeting handoff system knows when to route meetings to me.

**Acceptance Criteria:**
1. User schema `availabilityStatus` field applies to Consultants (same as Setters from Epic 3): available, on-break, offline, in-meeting
2. Consultant Dashboard has prominent status dropdown: "Available", "On Break", "Offline"
3. Status "available" → Consultant in handoff routing pool, receives pre-meeting alerts
4. Status "on-break" → Removed from routing pool, existing meetings preserved
5. Status "offline" → Removed from routing pool, triggers handoff for assigned meetings
6. Status automatically changes to "in-meeting" when meeting starts, back to "available" when meeting ends
7. Real-time status updates visible in Sales Manager dashboard

**Prerequisites:** Story 4.5 (Meeting View), Epic 3 Story 3.15 (Availability status pattern)

---

**Story 4.18: Implement Mobile App Support for Consultants**

As a Consultant,
I want to conduct meetings from my mobile device,
So that I can consult with customers from anywhere.

**Acceptance Criteria:**
1. React Native mobile app (iOS/Android) for Consultants includes Meeting View
2. Mobile Meeting View adapts layout: Stacked panels instead of side-by-side (limited screen space)
3. Video calling works on mobile (WebRTC on mobile browsers/native)
4. Script, Calculator, Knowledge Base accessible via bottom sheet (slide-up panel)
5. Slideshow sharing functional on mobile
6. Financing form delivery works on mobile (Person's browser, Consultant mobile view)
7. Meeting disposition and pipeline updates functional on mobile

**Prerequisites:** Story 4.5 (Meeting View), Story 4.6 (Video calling), Epic 1 Story 1.2 (React Native setup assumption)

**Note:** Mobile app development may extend timeline. Consider web-responsive design as interim solution if mobile app delayed.

---

## Epic 4 Summary

**Total Stories:** 18
**Estimated Timeline:** 5-6 weeks
**Key Deliverable:** 1-to-1 WebRTC video conferencing with unified Consultant meeting interface, intelligent handoff system, and integrated sales tools (financing, slideshow, calculator, knowledge base)

**Epic Complete When:**
- ✅ Mediasoup SFU infrastructure deployed for WebRTC video
- ✅ 1-to-1 video calling functional between Consultants and Persons
- ✅ Unified Meeting View eliminates app-switching (all tools in one interface)
- ✅ Pre-meeting alerts ensure Consultants are prepared (15-min warning)
- ✅ Meeting handoff system prevents missed appointments (round-robin routing)
- ✅ Sales Manager escalation handles no-coverage scenarios
- ✅ Financing integration delivers forms to Person's browser with Consultant guidance
- ✅ Slideshow, calculator, knowledge base accessible during meetings
- ✅ Meeting dispositions update pipeline (Met → QMet → Sale)
- ✅ Consultant Dashboard tracks meeting metrics and conversion rates
- ✅ Consultant mobile app supports full meeting workflow

**Key Technical Dependencies:**
- Mediasoup SFU server infrastructure (hosting, scaling considerations)
- TURN/STUN servers for NAT traversal
- WebRTC browser compatibility (Chrome, Firefox, Safari)
- Real-time signaling server (WebSocket)
- Financing partner API integrations (if available)

**Open Questions for Epic 4:**
1. Mediasoup hosting strategy (separate VPS vs managed service)
2. TURN/STUN server provider (self-hosted coturn vs managed like Twilio STUN/TURN)
3. Financing partner selection and API availability (Story 4.9)
4. Mobile app development timeline (Story 4.18) - may be deferred if resource constrained

---

## Epic 5: Commission Engine & Financial Dashboards

**Goal:** Automate commission calculations with real-time contractor visibility and Finance approval workflows to eliminate payment disputes and build contractor trust

**Key Deliverables:**
- Configurable commission rules engine (kW-based formulas, product-specific rates)
- Multi-stage commission triggers (QMet for Setters, Sale for Consultants)
- Real-time commission visibility for contractors
- Finance commission dashboard (approval queue, bulk actions, dispute tracking)
- Audit trail for all commission calculations and adjustments
- Sales Manager commission approval workflow
- Commission dispute resolution system

**Total Stories: 12**

---

### Story 5.1: Design Commission Rules Data Model

As a Developer,
I want a flexible commission rules data model that supports kW-based formulas and product-specific rates,
So that each tenant can configure custom commission structures without code changes.

**Acceptance Criteria:**
1. `commissionRules` table created with schema:
   - `tenantId`, `ruleId`, `ruleName`, `roleType` (Setter, Consultant)
   - `triggerStage` (QMet, Sale), `baseRatePerKw` (dollars per kW)
   - `tieredRates` (JSON: breakpoints for progressive tiers, e.g., 0-5kW: $200/kW, 5-10kW: $220/kW)
   - `productModifiers` (JSON: product-specific multipliers, e.g., premium panels: 1.2x)
   - `minimumPayout`, `maximumPayout` (optional caps)
   - `effectiveStartDate`, `effectiveEndDate` (for seasonal/promotional rules)
   - `isActive` (boolean)
2. Default commission rules seeded for new tenants (Setter: $150/kW at QMet, Consultant: $200/kW at Sale)
3. Validation ensures: triggerStage must be valid pipeline stage, baseRatePerKw > 0, tieredRates breakpoints non-overlapping
4. Test suite validates rule creation, retrieval, and validation logic
5. Documentation in `/docs/commission-rules-model.md`

**Prerequisites:** Epic 1 complete (Convex schema, multi-tenant RLS)

---

### Story 5.2: Implement Commission Calculation Engine

As a Developer,
I want a reusable commission calculation function that applies rules to system size (kW) and products,
So that commission amounts are calculated consistently across the platform.

**Acceptance Criteria:**
1. Function `calculateCommission(tenantId, ruleId, systemSizeKw, products[])` created
2. Retrieves active commission rule by ruleId
3. Applies tiered rates based on systemSizeKw:
   - Example: 7.5kW system with tiers [0-5kW: $200/kW, 5-10kW: $220/kW] = (5 × $200) + (2.5 × $220) = $1,550
4. Applies product modifiers: If premium panels selected (1.2x), multiply result by 1.2
5. Enforces minimum/maximum payout caps if configured
6. Returns calculation breakdown object: `{ baseAmount, tieredBreakdown[], productModifiers[], finalAmount }`
7. Unit tests cover: basic calculation, tiered rates, product modifiers, min/max caps, edge cases (0kW, missing products)

**Prerequisites:** Story 5.1 (Commission rules model)

---

### Story 5.3: Implement Pipeline Event-Triggered Commission Creation

As a Developer,
I want commissions automatically created when Person reaches trigger stage (QMet for Setters, Sale for Consultants),
So that contractors see earned commissions in real-time.

**Acceptance Criteria:**
1. `commissions` table created with schema:
   - `tenantId`, `commissionId`, `personId`, `setterId` (if Setter commission), `consultantId` (if Consultant commission)
   - `ruleId` (links to commissionRules), `systemSizeKw`, `products[]`
   - `calculationBreakdown` (JSON from calculateCommission result)
   - `amount` (finalAmount from calculation)
   - `status` (pending_review, approved, paid, disputed)
   - `triggerStage` (QMet, Sale), `triggeredAt` (timestamp)
   - `approvedBy` (userId), `approvedAt` (timestamp)
   - `createdAt`, `updatedAt`
2. Pipeline event listener: When Person.status changes to "QMet", create Setter commission
3. Pipeline event listener: When Person.status changes to "Sale", create Consultant commission
4. Commission calculation uses Person.systemSizeKw and Person.products[] fields
5. Commission rule selected based on roleType and triggerStage
6. Real-time event emitted to affected user (Setter/Consultant): `commissionEarned`
7. Test suite validates commission creation on status changes, correct rule selection, proper calculation

**Prerequisites:** Story 5.2 (Calculation engine), Epic 2 complete (Pipeline system with event-driven updates)

---

### Story 5.4: Build Contractor Commission Dashboard

As a Setter/Consultant,
I want to view all my commissions with status, amounts, and calculation breakdowns,
So that I can track earnings and verify payment accuracy.

**Acceptance Criteria:**
1. Dashboard route created: `/dashboard/commissions` (Setter/Consultant only)
2. Displays commissions table filtered by current user's setterId or consultantId:
   - Columns: Person name, System size (kW), Trigger stage, Amount, Status, Triggered date
   - Color-coded status badges: Pending (yellow), Approved (green), Paid (blue), Disputed (red)
3. Sortable by: Amount (high/low), Triggered date (newest/oldest)
4. Filterable by: Status, Date range, Trigger stage
5. Click row to expand accordion showing calculation breakdown:
   - Base rate: $200/kW
   - Tiered calculation: (5kW × $200) + (2.5kW × $220) = $1,550
   - Product modifiers: Premium panels (1.2x) = $1,860
   - Final amount: $1,860
6. Summary cards at top: Total Pending ($X), Total Approved ($Y), Total Paid ($Z), Total Earned ($W)
7. Mobile-responsive design (visible in Setter/Consultant mobile apps)

**Prerequisites:** Story 5.3 (Commissions created), Epic 2 Story 2.1 (Dashboard layout)

---

### Story 5.5: Build Finance Commission Review Dashboard

As a Finance user,
I want a dashboard to review pending commissions in bulk,
So that I can efficiently approve or dispute commissions.

**Acceptance Criteria:**
1. Dashboard route created: `/finance/commissions` (Finance role only)
2. Displays all commissions with status = "pending_review" across all tenants (tenant-scoped)
3. Table columns: Contractor name, Role (Setter/Consultant), Person name, System size, Amount, Triggered date, Actions
4. Bulk selection: Checkboxes to select multiple commissions
5. Bulk actions toolbar (appears when ≥1 selected):
   - "Approve Selected" button → Changes status to "approved", sets approvedBy and approvedAt
   - "Dispute Selected" button → Opens dispute modal (Story 5.7)
6. Individual row actions: "Approve" button, "Dispute" button, "View Details" link (shows calculation breakdown)
7. Summary metrics: Total Pending ($X), Total Approved This Month ($Y), Total Paid This Month ($Z)
8. Filters: Date range, Role (Setter/Consultant), Status
9. Real-time updates: New pending commissions appear automatically via Convex reactivity

**Prerequisites:** Story 5.4 (Commissions data exists), Epic 1 Story 1.5 (RBAC for Finance role)

---

### Story 5.6: Implement Sales Manager Commission Approval Workflow

As a Sales Manager,
I want to review and approve Setter/Consultant commissions for my team before Finance processes payment,
So that I can verify accuracy and prevent fraudulent claims.

**Acceptance Criteria:**
1. Commission status flow updated: pending_review → **manager_review** → approved → paid
2. Sales Manager dashboard route: `/manager/commissions` (Sales Manager role only)
3. Displays commissions for team members (Setters/Consultants assigned to current Sales Manager)
4. Table shows: Contractor name, Person name, System size, Amount, Triggered date, Actions
5. Individual actions: "Approve" button → Changes status to "approved", "Reject" button → Opens rejection modal (provide reason)
6. Rejection creates notification to contractor with reason, commission status set to "rejected"
7. Approved commissions move to Finance queue (visible in Story 5.5 dashboard)
8. Summary metrics: Pending Manager Review ($X), Approved This Week ($Y), Rejected This Week (count)
9. Mobile-responsive (Sales Managers may review on mobile)

**Prerequisites:** Story 5.5 (Commission approval flow), Epic 2 Story 2.13 (Sales Manager role assignments)

---

### Story 5.7: Implement Commission Dispute System

As a Finance user,
I want to dispute commissions with documented reasons and notify contractors,
So that payment errors can be investigated and resolved.

**Acceptance Criteria:**
1. `commissionDisputes` table created:
   - `tenantId`, `disputeId`, `commissionId`, `disputedBy` (userId), `disputedAt`
   - `reason` (text), `resolutionNotes` (text), `resolvedBy` (userId), `resolvedAt`
   - `status` (open, resolved), `originalAmount`, `adjustedAmount`
2. Dispute modal in Finance dashboard (Story 5.5):
   - Text area for dispute reason (required, min 20 characters)
   - "Submit Dispute" button → Creates dispute record, sets commission.status = "disputed"
3. Disputed commission removed from Finance approval queue
4. Notification sent to contractor via real-time event and in-app notification bell:
   - Message: "Your commission for [Person name] has been disputed. Reason: [reason text]. Contact Finance for resolution."
5. Dispute resolution workflow (Finance only):
   - Disputed commissions visible in separate "Disputed Commissions" tab in Finance dashboard
   - Resolution modal: Enter resolution notes, adjust amount (if needed), "Resolve & Approve" button
   - Resolution updates commission.amount (if adjusted), status = "approved", creates audit log entry
6. Contractor sees resolved dispute in commission dashboard with adjusted amount and resolution notes

**Prerequisites:** Story 5.5 (Finance dashboard), Story 5.4 (Contractor dashboard)

---

### Story 5.8: Implement Commission Audit Trail

As a Finance user/Developer,
I want every commission calculation, approval, dispute, and adjustment logged with timestamps and user attribution,
So that we have complete financial audit compliance.

**Acceptance Criteria:**
1. `commissionAuditLog` table created:
   - `tenantId`, `logId`, `commissionId`, `eventType` (created, approved, disputed, resolved, adjusted, paid)
   - `performedBy` (userId), `performedAt` (timestamp)
   - `changesSnapshot` (JSON: before/after values for amount, status, etc.)
   - `notes` (text, optional)
2. Audit log entry created automatically for every commission state change:
   - Commission created (Story 5.3)
   - Manager approval/rejection (Story 5.6)
   - Finance approval (Story 5.5)
   - Dispute creation (Story 5.7)
   - Dispute resolution with amount adjustment (Story 5.7)
   - Payment marked (Story 5.9)
3. Audit log view in Finance dashboard: `/finance/commissions/audit`
   - Filterable by: Commission ID, Event type, Date range, User
   - Displays: Timestamp, User, Event type, Commission details, Changes, Notes
4. Export audit log to CSV for external compliance systems
5. Retention policy: Audit logs retained for 7 years (compliance requirement)

**Prerequisites:** Story 5.3 (Commission creation), Stories 5.5-5.7 (Approval/dispute workflows)

---

### Story 5.9: Implement Commission Payment Tracking

As a Finance user,
I want to mark approved commissions as "paid" with payment date and method,
So that contractors can see payment history and Finance can reconcile payments.

**Acceptance Criteria:**
1. Commission schema updated with payment fields:
   - `paymentMethod` (check, direct_deposit, paypal)
   - `paidAt` (timestamp)
   - `paymentReferenceId` (check number, transaction ID, etc.)
2. Finance dashboard "Approved Commissions" tab:
   - Displays commissions with status = "approved" (ready for payment)
   - Bulk selection with "Mark as Paid" button
   - Payment modal: Select payment method, enter payment reference ID, confirm
3. "Mark as Paid" action:
   - Updates commission.status = "paid", sets paymentMethod, paidAt, paymentReferenceId
   - Creates audit log entry (Story 5.8)
   - Sends notification to contractor: "Your commission for [Person name] ($X) has been paid via [method]"
4. Contractor dashboard (Story 5.4) shows paid commissions with payment date and method
5. Finance payment history report: Filter by date range, export to CSV (for accounting reconciliation)

**Prerequisites:** Story 5.5 (Finance dashboard), Story 5.8 (Audit trail)

---

### Story 5.10: Build Commission Rules Configuration UI

As a System Admin,
I want a UI to create, edit, and manage commission rules,
So that commission structures can be updated without developer intervention.

**Acceptance Criteria:**
1. Admin dashboard route: `/admin/commission-rules` (System Admin only)
2. Rules list view displays all active commission rules:
   - Columns: Rule name, Role type, Trigger stage, Base rate, Effective dates, Actions
3. "Create Rule" button opens modal form:
   - Fields: Rule name, Role type (dropdown), Trigger stage (dropdown), Base rate per kW
   - Tiered rates builder (dynamic form rows): Add tier breakpoints (e.g., 0-5kW: $200, 5-10kW: $220)
   - Product modifiers builder: Add product types with multipliers (e.g., Premium panels: 1.2x)
   - Min/max payout (optional)
   - Effective start/end dates (date pickers)
4. Form validation: Base rate > 0, tier breakpoints non-overlapping, effective dates logical
5. "Edit" action opens pre-filled modal, allows updates (creates new version, doesn't modify existing rule to preserve historical calculations)
6. "Deactivate" action sets isActive = false (rule no longer applied to new commissions)
7. Historical rules preserved (cannot delete, only deactivate) for audit compliance
8. Test mode: "Preview Calculation" button simulates commission for test inputs (system size, products)

**Prerequisites:** Story 5.1 (Commission rules model), Epic 1 Story 1.6 (System Admin role)

---

### Story 5.11: Add Commission Export and Reporting

As a Finance user,
I want to export commission data to CSV/Excel with filtering options,
So that I can integrate with external accounting systems and create financial reports.

**Acceptance Criteria:**
1. Finance dashboard has "Export" button with dropdown options:
   - Export All Commissions (filtered by current view filters)
   - Export Approved Commissions (for payment processing)
   - Export Paid Commissions (for reconciliation)
2. Export modal:
   - Date range picker (required)
   - Status filter (multi-select: Pending, Approved, Paid, Disputed)
   - Role filter (Setter, Consultant, All)
   - Format selection (CSV, Excel)
3. Generated file includes columns:
   - Commission ID, Contractor name, Role, Person name, System size (kW), Products, Amount, Status, Triggered date, Approved date, Paid date, Payment method, Payment reference ID
4. Calculation breakdown included in separate sheet (Excel) or as JSON column (CSV)
5. Export filename format: `commissions_[startDate]_to_[endDate]_[timestamp].csv`
6. Large exports (>10,000 rows) processed asynchronously with download link sent via notification
7. Export action logged in audit trail (Story 5.8)

**Prerequisites:** Story 5.5 (Finance dashboard), Story 5.9 (Payment tracking)

---

### Story 5.12: Implement Mobile Commission Visibility

As a Setter/Consultant,
I want to view my commissions on the mobile app with real-time updates,
So that I can track earnings while in the field.

**Acceptance Criteria:**
1. Mobile app (React Native) route: "Commissions" tab in main navigation
2. Mobile commission list displays:
   - Card-based layout (optimized for mobile scrolling)
   - Each card shows: Person name, Amount, Status badge, Triggered date
   - Tap card to expand and show calculation breakdown
3. Summary cards at top: Total Pending, Total Approved, Total Paid (swipeable carousel)
4. Pull-to-refresh gesture updates commission list
5. Real-time updates via Convex subscription (new commissions appear automatically)
6. Status filter dropdown: All, Pending, Approved, Paid, Disputed
7. Empty state messaging: "No commissions yet. Keep setting appointments to earn!"
8. Offline mode: Cached commissions displayed, synced when connection restored

**Prerequisites:** Story 5.4 (Contractor dashboard web version), Epic 3 Story 3.10 (Setter mobile app foundation)

---

## Epic 5 Completion Checklist

**Core Commission Engine:**
- ✅ Commission rules data model supports flexible configurations (Story 5.1)
- ✅ Calculation engine handles kW-based formulas, tiers, and product modifiers (Story 5.2)
- ✅ Commissions auto-created on pipeline events (QMet, Sale) (Story 5.3)

**Contractor Visibility:**
- ✅ Web dashboard displays commissions with detailed breakdowns (Story 5.4)
- ✅ Mobile app provides real-time commission tracking (Story 5.12)

**Finance Workflows:**
- ✅ Finance dashboard enables bulk approval and dispute management (Story 5.5)
- ✅ Sales Manager approval workflow prevents fraudulent claims (Story 5.6)
- ✅ Dispute system documents and resolves payment errors (Story 5.7)
- ✅ Payment tracking reconciles approved commissions (Story 5.9)
- ✅ Export functionality integrates with external accounting (Story 5.11)

**Compliance & Administration:**
- ✅ Audit trail logs all commission events for 7-year retention (Story 5.8)
- ✅ Admin UI allows non-technical rule configuration (Story 5.10)

**Key Technical Dependencies:**
- Event-driven pipeline system from Epic 2 for triggering commission creation
- RBAC from Epic 1 for role-based dashboard access (Finance, Sales Manager, System Admin)
- Real-time Convex subscriptions for live commission updates
- Mobile app foundation from Epic 3 for Setter/Consultant mobile commission visibility

**Open Questions for Epic 5:**
1. Integration with external payroll systems (ADP, Gusto) for automated payment processing (potential future enhancement)
2. Tax withholding calculation for 1099 contractors (deferred to Phase 2)
3. Multi-tier commission structures (e.g., team bonuses, recruiter commissions) - current scope limited to individual Setter/Consultant commissions
4. Commission clawback policies (if sale is canceled post-payment) - business logic TBD

---

## Epic 6: Gamification, Leaderboards & Contractor Engagement

**Goal:** Drive contractor engagement and performance through competitive leaderboards, achievement recognition, peer learning, and transparent career progression

**Key Deliverables:**
- Real-time leaderboards (Sets, QMets, conversion rates with time filters)
- Achievement badge system with milestone unlocking
- Top performer call recording library (playback, search, tagging)
- Announcement system for Setter Managers (daily focus, contests, team updates)
- Internal messaging between roles
- Searchable knowledge base with training materials
- Career progression visibility (Setter → Consultant path)

**Total Stories: 10**

---

### Story 6.1: Design Leaderboard Metrics Data Model

As a Developer,
I want a data model that tracks contractor performance metrics for leaderboards,
So that real-time rankings can be calculated and displayed.

**Acceptance Criteria:**
1. `leaderboardMetrics` table created with schema:
   - `tenantId`, `userId`, `roleType` (Setter, Consultant), `metricDate` (date for daily rollup)
   - `setsCount`, `qmetsCount`, `salesCount` (daily counts)
   - `conversionRateSetToQmet` (calculated: qmets / sets), `conversionRateQmetToSale` (calculated: sales / qmets)
   - `totalCommissionsEarned` (sum of commissions for date)
   - `createdAt`, `updatedAt`
2. Scheduled Convex function runs daily at midnight: `rollupLeaderboardMetrics.ts`
   - Aggregates previous day's pipeline transitions (Lead → Set, Set → QMet, QMet → Sale)
   - Calculates conversion rates
   - Upserts daily metric records for each active contractor
3. Real-time metric updates: Pipeline events also update current day's metrics immediately (no wait until midnight)
4. Historical metrics preserved (never deleted, only appended) for trend analysis
5. Composite indexes: `(tenantId, metricDate, roleType)`, `(tenantId, userId, metricDate)`
6. Test suite validates metric calculation accuracy, daily rollup, real-time updates

**Prerequisites:** Epic 2 complete (Pipeline system), Epic 5 Story 5.3 (Commission data)

---

### Story 6.2: Build Real-Time Leaderboard UI for Setters

As a Setter,
I want to view real-time leaderboard showing top performers by Sets, QMets, and conversion rates,
So that I can see where I rank and stay motivated to improve.

**Acceptance Criteria:**
1. Dashboard route created: `/leaderboard` (Setter role)
2. Leaderboard tabs: "Sets", "QMets", "Conversion Rate (Set → QMet)"
3. Each tab displays ranked list:
   - Rank (1, 2, 3 with trophy icons), Setter name, Metric value, Progress bar
   - Highlight current user's row with accent color
4. Time period filters: Today, This Week, This Month, All Time
   - Filter applies to all tabs simultaneously
5. Top 3 performers displayed with podium visual (1st: gold, 2nd: silver, 3rd: bronze)
6. Current user's rank badge at top: "You're ranked #7 in Sets this week"
7. Real-time updates: Leaderboard refreshes automatically as metrics change (Convex subscription)
8. Empty state if no metrics: "Start setting appointments to appear on the leaderboard!"
9. Mobile-responsive design (visible in Setter mobile app)

**Prerequisites:** Story 6.1 (Metrics data model), Epic 3 Story 3.10 (Setter dashboard foundation)

---

### Story 6.3: Build Real-Time Leaderboard UI for Consultants

As a Consultant,
I want to view real-time leaderboard showing top performers by QMets, Sales, and conversion rates,
So that I can compete with peers and improve my closing rate.

**Acceptance Criteria:**
1. Dashboard route: `/leaderboard` (Consultant role - shared route with Setters, but role-filtered)
2. Leaderboard tabs for Consultants: "QMets", "Sales", "Conversion Rate (QMet → Sale)"
3. Ranked list with same UI pattern as Story 6.2
4. Time period filters: Today, This Week, This Month, All Time
5. Top 3 performers with podium visual
6. Current user's rank badge: "You're ranked #4 in Sales this month"
7. Real-time updates via Convex subscription
8. Additional metric tab: "Commissions Earned" (leaderboard by total earnings)
9. Mobile-responsive design (visible in Consultant mobile app)

**Prerequisites:** Story 6.1 (Metrics data model), Epic 4 Story 4.14 (Consultant dashboard foundation)

---

### Story 6.4: Implement Achievement Badge System

As a Developer,
I want a badge system that automatically unlocks achievements when contractors reach milestones,
So that contractors receive recognition for accomplishments.

**Acceptance Criteria:**
1. `badges` table created with schema:
   - `tenantId`, `badgeId`, `badgeName`, `description`, `iconUrl`, `badgeType` (milestone, performance, learning)
   - `unlockCriteria` (JSON: e.g., {metric: "setsCount", threshold: 50, timeframe: "allTime"})
   - `tier` (bronze, silver, gold, platinum)
2. `userBadges` table: tenantId, userId, badgeId, unlockedAt, progress (percentage toward next tier)
3. Default badges seeded for new tenants:
   - Setter badges: "First Set" (1 set), "On Fire" (10 sets/day), "Setter Master" (500 sets all-time)
   - Consultant badges: "First Sale" (1 sale), "Closer" (10 sales/month), "Million Dollar Consultant" ($1M commissions all-time)
   - Learning badges: "Knowledge Seeker" (10 knowledge base articles read), "Call Study" (5 top performer recordings watched)
4. Badge unlock logic runs on metric updates (Story 6.1):
   - Check if user meets unlock criteria for any locked badges
   - If criteria met, create userBadge record, emit real-time event: `badgeUnlocked`
5. Multi-tier progression: Unlocking bronze badge creates locked silver badge with progress tracking
6. Notification sent to user when badge unlocked: "🎉 You've unlocked the 'On Fire' badge!"
7. Test suite validates badge unlock logic for all badge types

**Prerequisites:** Story 6.1 (Metrics data model)

---

### Story 6.5: Display Badges in User Profiles and Dashboards

As a Setter/Consultant,
I want to see my unlocked badges and progress toward next tier,
So that I feel recognized for my achievements.

**Acceptance Criteria:**
1. User profile page (`/profile`) displays "Achievements" section:
   - Grid of unlocked badges (icon + badge name)
   - Locked badges shown in grayscale with progress bar (e.g., "50/100 sets toward Setter Master")
2. Tooltip on hover shows badge description and unlock date (if unlocked)
3. Dashboard widget: "Recent Achievements" (3 most recent badges, expandable to full list)
4. Badge notification toast when unlocked (real-time event from Story 6.4):
   - Animated badge icon slides in, "Congratulations! You've earned [badge name]"
   - Click toast to view full badge details
5. Leaderboard displays badges next to user names (top 3 badges only, highest tier prioritized)
6. Public profile view: Other users can see each other's badges (fosters peer recognition)
7. Mobile app displays badges in profile tab

**Prerequisites:** Story 6.4 (Badge system), Stories 6.2-6.3 (Leaderboards)

---

### Story 6.6: Build Call Recording Library for Top Performers

As a Setter Manager/Trainer,
I want a library of top performer call recordings with playback and search,
So that new contractors can learn from successful calls.

**Acceptance Criteria:**
1. `callRecordings` table created:
   - `tenantId`, `recordingId`, `callId` (links to calls table from Epic 3), `setterId`/`consultantId`
   - `recordingUrl` (S3/Cloudflare R2 storage URL), `duration` (seconds)
   - `outcome` (set_successful, qmet_successful, sale_successful)
   - `tags` (array: e.g., ["objection_handling", "financing_questions", "rapport_building"])
   - `isPublic` (boolean: visible to all contractors vs. manager-only)
   - `uploadedBy` (userId), `uploadedAt`, `viewCount`
2. Call recordings automatically saved when call ends (SignalWire recording feature enabled in Epic 3 Story 3.3)
3. Setter Manager dashboard: `/manager/call-library` (Setter Manager/Trainer roles)
   - Table displays all call recordings: Contractor name, Duration, Outcome, Tags, View count, Actions
   - "Tag" action: Add/remove tags (multi-select dropdown: objection_handling, closing_techniques, etc.)
   - "Mark as Top Performer" toggle: Sets isPublic = true, recording appears in contractor library
4. Search/filter: Text search by tags, filter by outcome, sort by view count (most viewed)
5. Playback modal: Audio player with waveform visualization, playback speed controls (0.5x, 1x, 1.5x, 2x)
6. Storage quota management: Automatic deletion of recordings older than 90 days (configurable)

**Prerequisites:** Epic 3 Story 3.3 (SignalWire integration with recording), Epic 3 Story 3.12 (Call outcome tracking)

---

### Story 6.7: Build Contractor-Facing Call Recording Library

As a Setter/Consultant,
I want to browse and listen to top performer call recordings,
So that I can learn successful techniques and improve my performance.

**Acceptance Criteria:**
1. Dashboard route: `/training/call-library` (Setter/Consultant roles)
2. Displays recordings where isPublic = true, filtered by user's role:
   - Setters see Setter recordings (outcome = set_successful, qmet_successful)
   - Consultants see Consultant recordings (outcome = sale_successful)
3. Card-based layout: Recording thumbnail (waveform preview), duration, outcome badge, tags
4. Filter by tags (multi-select): "Show me calls with 'objection_handling' and 'financing_questions'"
5. Sort options: Most viewed, Newest, Shortest, Longest
6. Playback modal (same as Story 6.6):
   - Audio player with waveform, playback speed controls
   - "Mark as Watched" button → Creates learningProgress record (for "Call Study" badge tracking)
7. Related recordings suggestion: "You might also like..." (based on similar tags)
8. Empty state: "No recordings available yet. Check back soon!"
9. Mobile-responsive design (Setter/Consultant mobile apps)

**Prerequisites:** Story 6.6 (Call library backend and tagging), Story 6.4 (Badge system for "Call Study" badge)

---

### Story 6.8: Implement Announcement System for Setter Managers

As a Setter Manager,
I want to create announcements for my team (daily focus, contests, updates),
So that I can communicate priorities and motivate contractors.

**Acceptance Criteria:**
1. `announcements` table created:
   - `tenantId`, `announcementId`, `title`, `body` (rich text markdown)
   - `authorId` (userId of Setter Manager/Trainer), `targetRoles` (array: [Setter, Consultant])
   - `priority` (normal, high, urgent), `expiresAt` (optional auto-removal date)
   - `isPinned` (boolean: pinned to top), `createdAt`
2. Setter Manager dashboard: `/manager/announcements` (Setter Manager/Trainer roles)
   - "Create Announcement" button opens modal form:
     - Fields: Title (required), Body (markdown editor with preview), Target roles (multi-select), Priority (dropdown), Expiry date (optional date picker), Pin toggle
   - Announcement list displays all active announcements with edit/delete actions
3. Validation: Title max 100 chars, body max 5000 chars, expiry date must be future
4. Real-time broadcast: Creating announcement emits event to all users in targetRoles
5. Edit/delete functionality: Edit updates announcement, delete soft-deletes (archived)
6. Contest announcement template: Pre-filled markdown template for weekly contests (leaderboard integration)

**Prerequisites:** Epic 1 Story 1.5 (RBAC for Setter Manager/Trainer roles)

---

### Story 6.9: Display Announcements in Contractor Dashboards

As a Setter/Consultant,
I want to see announcements from my managers on my dashboard,
So that I stay informed about contests, priorities, and team updates.

**Acceptance Criteria:**
1. Dashboard widget: "Announcements" section (top of dashboard, highly visible)
2. Displays announcements filtered by:
   - User's role in targetRoles
   - Not expired (expiresAt is null or future date)
   - Ordered by: isPinned (pinned first), priority (urgent → high → normal), createdAt (newest first)
3. Announcement cards:
   - Priority badge (urgent = red, high = orange, normal = gray)
   - Title (bold), body preview (first 100 chars), "Read More" link
   - Timestamp: "Posted 2 hours ago"
4. "Read More" expands accordion to show full markdown-rendered body
5. Pinned announcements stay at top with pin icon
6. Real-time updates: New announcements appear immediately via Convex subscription
7. Dismissible announcements: "Dismiss" button removes announcement from view (creates userAnnouncementDismissal record, prevents re-display)
8. Empty state: "No announcements. Check back later!"
9. Mobile-responsive (visible in Setter/Consultant mobile apps)

**Prerequisites:** Story 6.8 (Announcement creation backend)

---

### Story 6.10: Build Searchable Knowledge Base with Training Materials

As a Setter/Consultant/Trainer,
I want a searchable knowledge base with training articles, scripts, and FAQs,
So that I can quickly find answers and improve my skills.

**Acceptance Criteria:**
1. `knowledgeBaseArticles` table created:
   - `tenantId`, `articleId`, `title`, `body` (rich markdown), `category` (scripts, training, faq, product_info)
   - `authorId`, `targetRoles` (array: which roles can see this article)
   - `tags` (array: searchable keywords), `viewCount`, `isPinned`
   - `createdAt`, `updatedAt`
2. Trainer dashboard: `/trainer/knowledge-base` (Trainer/System Admin roles)
   - "Create Article" button opens markdown editor with WYSIWYG preview
   - Article list with search, filter by category, edit/delete actions
3. Contractor dashboard route: `/training/knowledge-base` (Setter/Consultant roles)
4. Article browser displays:
   - Search bar with full-text search (title + body + tags)
   - Category filter tabs: All, Scripts, Training, FAQ, Product Info
   - Article cards: Title, category badge, tags, view count, last updated date
5. Article detail page: Full markdown-rendered content, "Was this helpful?" feedback buttons
6. Pinned articles displayed at top (e.g., "Getting Started Guide")
7. Article view tracking: viewCount incremented, creates learningProgress record (for "Knowledge Seeker" badge)
8. Related articles suggestion: "You might also like..." (based on similar tags)
9. Mobile-optimized reading experience

**Prerequisites:** Story 6.4 (Badge system for "Knowledge Seeker" badge), Epic 1 Story 1.5 (RBAC for Trainer role)

---

## Epic 6 Completion Checklist

**Leaderboards & Competition:**
- ✅ Metrics data model tracks contractor performance (Story 6.1)
- ✅ Real-time Setter leaderboards drive competition (Story 6.2)
- ✅ Real-time Consultant leaderboards enable peer comparison (Story 6.3)

**Achievement & Recognition:**
- ✅ Badge system unlocks achievements automatically (Story 6.4)
- ✅ Badges displayed in profiles and dashboards (Story 6.5)

**Peer Learning:**
- ✅ Call recording library enables manager curation (Story 6.6)
- ✅ Contractors can browse and learn from top performers (Story 6.7)

**Communication & Training:**
- ✅ Announcement system enables manager-to-team communication (Story 6.8)
- ✅ Announcements displayed prominently in dashboards (Story 6.9)
- ✅ Knowledge base provides searchable training materials (Story 6.10)

**Key Technical Dependencies:**
- Leaderboard metrics calculation depends on pipeline system from Epic 2
- Commission leaderboard tab depends on Epic 5 commission data
- Call recordings depend on SignalWire integration from Epic 3
- Badge system integrates with learning progress tracking (knowledge base views, recording watches)
- RBAC from Epic 1 for role-based content filtering (Trainer, Setter Manager)

**Open Questions for Epic 6:**
1. Internal messaging system scope - defer to Phase 2 or include in MVP? (listed in PRD but not detailed in stories - recommend deferring to Phase 2 given MVP timeline constraints)
2. Career progression visibility (Setter → Consultant path) - needs product input on promotion criteria and workflow (recommend separate epic if critical for MVP)
3. Call recording storage costs and retention policy - need to validate 90-day retention vs. business needs
4. Leaderboard gaming prevention - rate limiting, suspicious pattern detection (defer to post-MVP monitoring)

**Notes:**
- Internal messaging and career progression visibility from original Epic 6 scope have been deprioritized to maintain MVP timeline focus
- These features can be added in Phase 2 or as standalone epics if proven critical during early customer feedback
- Current 10 stories deliver core gamification, learning, and communication features that directly address contractor engagement goals

---

---

## Story Guidelines Reference

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```

**Story Requirements:**

- **Vertical slices** - Complete, testable functionality delivery
- **Sequential ordering** - Logical progression within epic
- **No forward dependencies** - Only depend on previous work
- **AI-agent sized** - Completable in 2-4 hour focused session
- **Value-focused** - Integrate technical enablers into value-delivering stories

---

**For implementation:** Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown.
