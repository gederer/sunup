# Story 1.12: Deploy Initial Application to Vercel Production

Status: ready-for-dev

## Story

As a Developer,
I want the foundation application deployed to Vercel production,
So that stakeholders can access the live application and Epic 2 features can be deployed incrementally.

## Acceptance Criteria

1. Application deployed to Vercel production environment
2. Custom domain configured (if available) or Vercel subdomain accessible
3. Environment variables configured in Vercel dashboard
4. Convex production deployment linked to Vercel app
5. Clerk production instance configured with correct redirect URLs
6. Smoke test verifies: Sign-in works, protected route accessible with correct role
7. Production URL documented in README.md and shared with team

## Tasks / Subtasks

- [ ] Deploy application to Vercel production (AC: #1, #2)
  - [ ] Create Vercel production project via dashboard or CLI
  - [ ] Link GitHub repository to Vercel project
  - [ ] Configure deployment settings (build command, output directory)
  - [ ] Deploy to production and verify deployment success
  - [ ] Configure custom domain (if available) or note Vercel subdomain

- [ ] Configure environment variables in Vercel (AC: #3)
  - [ ] Set NEXT_PUBLIC_CONVEX_URL from Convex production deployment
  - [ ] Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from Clerk production instance
  - [ ] Set CLERK_SECRET_KEY from Clerk production instance
  - [ ] Set CLERK_WEBHOOK_SECRET for Clerk webhook security
  - [ ] Verify all required environment variables are set
  - [ ] Redeploy application to apply environment variables

- [ ] Create and link Convex production deployment (AC: #4)
  - [ ] Run `npx convex deploy --prod` to create production deployment
  - [ ] Copy production deployment URL
  - [ ] Update NEXT_PUBLIC_CONVEX_URL in Vercel environment variables
  - [ ] Verify Convex schema deployed correctly
  - [ ] Test database connection from production app

- [ ] Configure Clerk production instance (AC: #5)
  - [ ] Create Clerk production instance (or verify existing)
  - [ ] Configure redirect URLs with production domain/subdomain
  - [ ] Add production URL to allowed origins
  - [ ] Update webhook endpoint URL to production domain
  - [ ] Verify Clerk authentication keys match Vercel environment variables
  - [ ] Test webhook delivery to production endpoint

- [ ] Perform smoke tests (AC: #6)
  - [ ] Test sign-in flow: Navigate to production URL → Click sign-in → Authenticate successfully
  - [ ] Test protected route: After sign-in, navigate to dashboard → Verify access granted
  - [ ] Test role-based access: Sign in as System Administrator → Verify correct role assigned
  - [ ] Test multi-tenant isolation: Verify tenantId correctly set in Clerk metadata
  - [ ] Test Convex connection: Verify queries execute and return data
  - [ ] Document any issues found and resolve

- [ ] Update documentation (AC: #7)
  - [ ] Add production URL to README.md
  - [ ] Document deployment process in README.md
  - [ ] Add deployment badge (optional) to README.md
  - [ ] Share production URL with team (Slack, email, or project documentation)

## Dev Notes

### Learnings from Previous Story

**From Story 1-11-setup-git-hub-actions-ci-cd-pipeline (Status: done)**

- **CI/CD Infrastructure**:
  - GitHub Actions workflow operational: `.github/workflows/ci.yml`
  - CI job runs on every pull request: lint, type-check, test (129/129 passing)
  - CD job deploys to Vercel on push to main branch
  - Vercel CLI deployment pattern: `vercel pull → vercel build → vercel deploy --prebuilt --prod`
  - GitHub secrets configured: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
  - Application environment variables managed in Vercel dashboard (not GitHub Actions)

- **Deployment Configuration**:
  - Web app location: `apps/web` (Next.js 16.0.0)
  - Build command: `pnpm build` (Turborepo builds all packages)
  - Output directory: `.next` (Next.js default)
  - Node.js version: 18.x (matches CI environment)
  - Package manager: pnpm 10.20.0

- **Environment Variables Required**:
  - `NEXT_PUBLIC_CONVEX_URL`: Convex production deployment URL
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
  - `CLERK_SECRET_KEY`: Clerk secret key
  - `CLERK_WEBHOOK_SECRET`: Clerk webhook secret for validation
  - Note: All configured in Vercel dashboard, not in code or GitHub

- **Testing Before Deployment**:
  - All 129 tests passing locally and in CI
  - Lint and type-check passing across all 4 packages
  - Pre-existing errors were fixed in Story 1.11 (linting, type-check)
  - Build succeeds locally: `pnpm build` completes without errors

- **Review Findings**:
  - Advisory: Consider pinning Vercel CLI version for reproducibility (currently uses `vercel@latest`)
  - CI/CD badge suggested but not yet added to README
  - After deployment, configure GitHub secrets and test workflow with sample PR
  - Branch protection rules documented but not yet enabled (manual setup required)

[Source: stories/1-11-setup-git-hub-actions-ci-cd-pipeline.md#Dev-Agent-Record]

### Architecture Context

**Deployment Stack (from architecture.md):**
- **Web App Hosting**: Vercel
  - Next.js optimized platform
  - Automatic CI/CD from Git
  - Edge network for low latency
  - Serverless functions for API routes
  - Zero-downtime deployments via rolling updates
- **Backend/Database**: Convex Cloud (managed)
  - Serverless database + backend
  - Real-time subscriptions
  - Automatic scaling
  - Production deployment separate from dev
- **Authentication**: Clerk
  - OAuth2, passwordless authentication with magic links
  - MFA support
  - Webhook-based user sync to Convex
  - Production instance with separate keys
  - Multi-tenant support via metadata

**Environment Strategy (from architecture.md):**
1. **Local Development**: `npm run dev` (web), Convex dev deployment
2. **Staging**: Vercel preview deployments, Convex staging deployment
3. **Production**: Vercel production, Convex production deployment

**Security Requirements:**
- All sensitive data encrypted in transit (HTTPS/TLS 1.3+)
- Authentication via Clerk with session management
- Multi-tenant Row-Level Security enforced at query layer
- Environment variables never committed to code
- Webhook signature verification for Clerk webhooks
- Production secrets managed in Vercel dashboard

**Smoke Test Requirements:**
- 99.5% uptime SLA target (maximum 3.65 hours downtime per month)
- Page load time: <2 seconds (P95)
- Time to interactive: <3 seconds
- Sign-in flow must work (Clerk authentication)
- Protected routes enforce authentication
- Role-based access control functional
- Multi-tenant isolation verified

[Source: docs/architecture.md - Deployment Architecture section (lines 948-1005)]

### Project Structure Notes

**Deployment Directory Structure:**
```
sunup/ (root)
├── apps/
│   └── web/                    # Next.js web app (deployment target)
│       ├── app/                # App Router pages
│       ├── middleware.ts       # Clerk auth middleware
│       ├── package.json        # App-specific dependencies
│       └── next.config.js      # Next.js configuration
├── packages/
│   ├── convex/                 # Shared Convex backend (deployed separately)
│   ├── ui/                     # Shared UI components
│   ├── types/                  # Shared TypeScript types
│   └── config/                 # Shared configs
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD workflow (automated deployment)
└── README.md                   # MODIFY: Add production URL
```

**Vercel Project Configuration:**
- Root directory: `/` (monorepo root)
- Build command: `cd apps/web && pnpm build`
- Output directory: `apps/web/.next`
- Install command: `pnpm install --frozen-lockfile`
- Node.js version: 18.x
- Framework preset: Next.js

**Convex Production Deployment:**
- Command: `npx convex deploy --prod` (run from project root)
- Deployment URL: Will be generated (e.g., `https://your-project.convex.cloud`)
- Schema: Automatically deployed from `packages/convex/schema.ts`
- Functions: All queries, mutations, actions deployed
- Note: Requires Convex account and project setup

**Clerk Production Configuration:**
- Production instance: Separate from development instance
- Redirect URLs: Must include production domain (e.g., `https://app.sunup.com`, `https://sunup.vercel.app`)
- Webhook endpoint: `https://[production-domain]/api/webhooks/clerk`
- Allowed origins: Production domain for CORS
- Environment variables: Separate keys for production

### References

- [Source: docs/epics.md - Story 1.12 requirements (lines 314-329)]
- [Source: docs/architecture.md - Deployment architecture (lines 948-1005)]
- [Source: docs/architecture.md - Technology stack (lines 28-56)]
- [Source: stories/1-11-setup-git-hub-actions-ci-cd-pipeline.md - CI/CD infrastructure (lines 69-98)]
- [Source: README.md - Current project structure and commands]
- [Vercel Documentation - Deploying Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Convex Documentation - Production Deployment](https://docs.convex.dev/production)
- [Clerk Documentation - Production Checklist](https://clerk.com/docs/deployments/overview)

## Dev Agent Record

### Context Reference

- `docs/stories/1-12-deploy-initial-application-to-vercel-production.context.xml` - Generated 2025-11-15

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

### File List
