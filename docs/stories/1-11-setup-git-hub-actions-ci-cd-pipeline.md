# Story 1.11: Setup GitHub Actions CI/CD Pipeline

Status: ready-for-dev

## Story

As a Developer,
I want automated testing and deployment on every push to main branch,
So that code quality is maintained and deployments are reliable.

## Acceptance Criteria

1. GitHub Actions workflow file (`.github/workflows/ci.yml`) created ✅
2. CI pipeline runs on every pull request: lint, type-check, test ✅
3. CD pipeline deploys to Vercel on push to main branch ✅
4. Environment secrets configured in GitHub (Convex, Clerk, Vercel) ✅
5. Branch protection rules require CI passing before merge ✅
6. Deployment status visible in GitHub PR checks ✅
7. README.md documents CI/CD pipeline and deployment process ✅

## Tasks / Subtasks

- [ ] Create GitHub Actions workflow file (AC: #1, #2, #3)
  - [ ] Create `.github/workflows/ci.yml` file in repository root
  - [ ] Configure job for pull request CI checks
    - [ ] Set up Node.js 18.x environment
    - [ ] Install pnpm package manager
    - [ ] Install dependencies with pnpm
    - [ ] Run lint: `pnpm lint`
    - [ ] Run type-check: `pnpm type-check`
    - [ ] Run unit tests: `pnpm test` (packages/convex tests)
  - [ ] Configure job for CD deployment to Vercel
    - [ ] Trigger on push to `main` branch only
    - [ ] Deploy web app to Vercel using Vercel CLI
    - [ ] Link deployment with GitHub PR/commit
    - [ ] Report deployment status and URL

- [ ] Configure environment secrets in GitHub (AC: #4)
  - [ ] Add `VERCEL_TOKEN` secret for Vercel deployments
  - [ ] Add `VERCEL_ORG_ID` secret for Vercel organization
  - [ ] Add `VERCEL_PROJECT_ID` secret for web app project
  - [ ] Document secret setup process in README.md
  - [ ] Note: Convex and Clerk secrets managed in Vercel dashboard (not GitHub Actions)

- [ ] Set up branch protection rules (AC: #5, #6)
  - [ ] Enable branch protection for `main` branch
  - [ ] Require status checks to pass before merging:
    - [ ] Require `CI / lint-type-check-test` check to pass
  - [ ] Require pull request reviews before merging (optional, recommend 1 approver)
  - [ ] Require branches to be up to date before merging
  - [ ] Document branch protection setup in README.md

- [ ] Update README.md with CI/CD documentation (AC: #7)
  - [ ] Add "CI/CD Pipeline" section
  - [ ] Document GitHub Actions workflows (CI and CD)
  - [ ] Document required GitHub secrets setup
  - [ ] Document branch protection rules
  - [ ] Document deployment process and Vercel integration
  - [ ] Add badges for build status (optional)

- [ ] Test CI/CD pipeline end-to-end (AC: all)
  - [ ] Create test pull request with intentional lint error, verify CI fails
  - [ ] Fix lint error, verify CI passes
  - [ ] Merge to main, verify Vercel deployment triggers
  - [ ] Verify deployment URL is reported in GitHub commit status
  - [ ] Confirm all 129 tests pass in CI environment

## Dev Notes

### Learnings from Previous Story

**From Story 1-10-create-person-and-organization-base-schema (Status: done)**

- **Testing Infrastructure**:
  - 129 tests passing across 9 test files (100% pass rate)
  - Vitest for unit tests (`pnpm test`)
  - Convex-test 0.0.38 for Convex function testing
  - Tests run successfully with authentication context: `t.withIdentity({ subject: "test_clerk_user" })`
  - Test command: `pnpm test` in packages/convex

- **Monorepo Structure**:
  - Turborepo with pnpm workspaces
  - Root-level commands: `pnpm lint`, `pnpm type-check`, `pnpm test`, `pnpm build`
  - Apps: `@sunup/web`, `@sunup/mobile`
  - Packages: `@sunup/convex`, `@sunup/ui`, `@sunup/types`, `@sunup/config`
  - Turbo.json defines pipeline tasks (build, lint, type-check)

- **Key Files from Story 1.10**:
  - Created: `packages/convex/organizations.ts`, `packages/convex/tests/organizations.test.ts`
  - Modified: `docs/sprint-status.yaml`
  - No GitHub Actions workflows exist yet

- **Code Quality Standards**:
  - TypeScript strict mode enabled
  - ESLint configured with Next.js and Turbo rules
  - All code must pass lint, type-check, and tests before merge

[Source: stories/1-10-create-person-and-organization-base-schema.md#Dev-Agent-Record]

### Architecture Context

**CI/CD Requirements (from Story 1.11 in epics.md):**
- GitHub Actions for continuous integration and deployment
- CI checks on every pull request: lint, type-check, test
- CD deploys to Vercel on push to main branch
- Branch protection requires passing CI before merge

**Current Testing Infrastructure:**
- **Unit Tests**: Vitest 4.0.7 (`pnpm test`)
  - 129 tests across 9 test files (packages/convex/tests/)
  - Coverage available via: `pnpm test:coverage`
- **E2E Tests**: Playwright 1.49.1 (`pnpm test:e2e`)
  - Note: E2E tests deferred to Epic 2 (frontend development)
  - E2E setup exists but no tests written yet
- **Lint**: ESLint 9 with Next.js config (`pnpm lint`)
- **Type-check**: TypeScript 5 strict mode (`pnpm type-check`)

**Deployment Stack:**
- **Target**: Vercel (Next.js hosting)
- **Web App**: apps/web (Next.js 16.0.0)
- **Backend**: Convex 1.29.0 (serverless, managed separately)
- **Auth**: Clerk 6.34.0 (configured via environment variables)

**Environment Variables Required:**
- `NEXT_PUBLIC_CONVEX_URL`: Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key
- `CLERK_WEBHOOK_SECRET`: Clerk webhook secret
- Note: These are configured in Vercel dashboard, not GitHub Actions

**GitHub Actions Best Practices:**
- Use pnpm for package management (already configured in root package.json)
- Cache pnpm store to speed up CI runs
- Run jobs on ubuntu-latest for consistency
- Use matrix strategy if testing multiple Node versions (optional for now)
- Use Vercel CLI for deployments with proper project linking

### Project Structure Notes

**Files to Create:**
- `.github/workflows/ci.yml` - Main CI/CD workflow file

**Files to Modify:**
- `README.md` - Add CI/CD documentation section

**Directory Structure:**
```
sunup/
├── .github/
│   └── workflows/
│       └── ci.yml          # NEW: GitHub Actions workflow
├── apps/
│   ├── web/                # Deploy target for Vercel
│   └── mobile/
├── packages/
│   ├── convex/             # Contains tests to run in CI
│   ├── ui/
│   ├── types/
│   └── config/
├── docs/
│   └── stories/
└── README.md               # MODIFY: Add CI/CD section
```

**Turborepo Pipeline (turbo.json):**
- `build`: Builds all apps and packages
- `lint`: Runs ESLint across all packages
- `type-check`: Runs TypeScript compiler checks
- `test`: Runs Vitest unit tests
- `test:e2e`: Runs Playwright E2E tests (deferred to Epic 2)

### Implementation Patterns to Follow

**GitHub Actions Workflow Structure:**
```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint-type-check-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10.20.0
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test

  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    needs: lint-type-check-test
    steps:
      - uses: actions/checkout@v4
      - run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Vercel CLI Deployment Pattern:**
- Use `vercel` CLI with `--prod` flag for production deployments
- Use `--token` flag with GitHub secret for authentication
- Link project with `--scope` (org ID) and project ID
- Automatic environment variable injection from Vercel dashboard

**Branch Protection Configuration:**
- Protect `main` branch
- Require status checks: `CI / lint-type-check-test`
- Require pull request reviews: 1 approver (recommended)
- Require branches to be up to date before merging
- Do not allow force pushes
- Do not allow deletions

### Testing Strategy

**CI Test Execution:**
1. Install dependencies: `pnpm install`
2. Run linting: `pnpm lint` (checks code style and catches common errors)
3. Run type-checking: `pnpm type-check` (validates TypeScript types)
4. Run unit tests: `pnpm test` (executes all Vitest tests)
5. E2E tests: Skipped for now (deferred to Epic 2)

**Expected Test Results:**
- 129 tests should pass in CI (same as local)
- Tests run with Node.js 18.x in CI (same as local development)
- No flaky tests expected (all tests are deterministic)

**Deployment Verification:**
- Successful build exit code (0)
- Vercel deployment URL returned
- Deployment status visible in GitHub PR/commit checks
- Web app accessible at deployment URL

### References

- [Source: docs/epics.md - Story 1.11 requirements (lines 295-310)]
- [Source: docs/architecture.md - Technology stack and testing strategy (lines 28-56)]
- [Source: package.json - Root scripts and testing commands (lines 9-19)]
- [Source: README.md - Current project structure and commands (lines 1-207)]
- [Source: stories/1-10-create-person-and-organization-base-schema.md - Testing infrastructure (lines 249-253)]
- [GitHub Actions Documentation - pnpm setup](https://github.com/pnpm/action-setup)
- [GitHub Actions Documentation - Node.js](https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

## Dev Agent Record

### Context Reference

- `docs/stories/1-11-setup-git-hub-actions-ci-cd-pipeline.context.xml` (generated 2025-11-14)

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-14: Story drafted (create-story workflow) - GitHub Actions CI/CD pipeline with Vercel deployment, branch protection, and README documentation
