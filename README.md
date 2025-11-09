# Sunup - Solar Installation Management Platform

Sunup is a comprehensive SaaS platform for solar installation companies, built as a Turborepo monorepo with Next.js (web) and Expo (mobile) applications sharing a unified Convex backend.

## 🏗️ Monorepo Structure

This project uses **Turborepo** for efficient monorepo management with pnpm workspaces.

```
sunup/
├── apps/
│   ├── web/              # Next.js 16 web application
│   ├── mobile/           # Expo React Native mobile app
│   └── mediasoup-server/ # WebRTC SFU server (coming soon)
├── packages/
│   ├── convex/           # Shared Convex backend (queries, mutations, schema)
│   ├── ui/               # Shared UI components (shadcn/ui)
│   ├── types/            # Shared TypeScript types (Convex + domain)
│   └── config/           # Shared configs (ESLint, TypeScript, Tailwind)
├── docs/                 # Project documentation
├── turbo.json            # Turborepo pipeline configuration
└── pnpm-workspace.yaml   # pnpm workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0 (install with `npm install -g pnpm`)
- **Convex** account (sign up at [convex.dev](https://convex.dev))
- **Clerk** account for authentication (sign up at [clerk.com](https://clerk.com))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sunup
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# apps/web/.env.local
NEXT_PUBLIC_CONVEX_URL=https://affable-albatross-627.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
CLERK_SECRET_KEY=<your-clerk-secret>
```

4. Start the development servers:
```bash
pnpm dev
```

This will start:
- **Web app**: http://localhost:3000
- **Mobile app**: Expo dev server (follow terminal instructions)
- **Convex backend**: Live sync with your Convex deployment

## 📦 Workspace Packages

### Apps

#### `@sunup/web`
Next.js 16 web application with App Router.

**Development:**
```bash
pnpm --filter @sunup/web dev
```

**Build:**
```bash
pnpm --filter @sunup/web build
```

#### `@sunup/mobile`
Expo React Native mobile app with Expo Router.

**Development:**
```bash
pnpm --filter @sunup/mobile dev
```

**iOS Simulator:**
```bash
pnpm --filter @sunup/mobile ios
```

**Android Emulator:**
```bash
pnpm --filter @sunup/mobile android
```

### Packages

#### `@sunup/convex`
Shared Convex backend with schema, queries, mutations, and actions.

**Deploy to Convex:**
```bash
pnpm --filter @sunup/convex deploy
```

#### `@sunup/ui`
Shared UI components built with shadcn/ui and Tailwind CSS.

**Usage:**
```typescript
import { cn } from '@sunup/ui/lib/utils';
```

#### `@sunup/types`
Shared TypeScript types for Convex schema and domain logic.

**Usage:**
```typescript
import { User, Role, PipelineStage } from '@sunup/types';
```

#### `@sunup/config`
Shared configuration files for ESLint, TypeScript, and Tailwind.

## 🛠️ Development Commands

### Run all apps in development mode
```bash
pnpm dev
```

### Build all apps and packages
```bash
pnpm build
```

### Run linting across all packages
```bash
pnpm lint
```

### Run type-checking across all packages
```bash
pnpm type-check
```

### Run tests (when implemented)
```bash
pnpm test
```

## 🔧 Technology Stack

- **Frontend (Web)**: Next.js 16.0.0, React 19.2.0, TypeScript 5
- **Frontend (Mobile)**: Expo ~52.0.0, React Native 0.76.0
- **Backend**: Convex 1.28.0 (serverless backend)
- **Auth**: Clerk 6.34.0
- **UI**: shadcn/ui with Tailwind CSS 4
- **Build System**: Turborepo 2.6.0
- **Package Manager**: pnpm 10.20.0

## 📊 Dashboard & Admin

- **Convex Dashboard**: [https://dashboard.convex.dev/deployment/affable-albatross-627](https://dashboard.convex.dev/deployment/affable-albatross-627)
  - View database tables and documents
  - Monitor function logs and performance
  - Test queries and mutations
- **Convex Demo Page**: [http://localhost:3000/convex-demo](http://localhost:3000/convex-demo)
  - Real-time subscription demonstration
  - Verify Convex connection

## 📚 Project Documentation

- **Architecture**: See `docs/architecture.md`
- **PRD**: See `docs/PRD.md`
- **Epics**: See `docs/epics.md`
- **Stories**: See `docs/stories/`
- **Git Workflow**: See `docs/git-workflow.md`
- **Multi-Tenant RLS**: See `docs/multi-tenant-rls.md` - Row-Level Security patterns and best practices
- **Clerk Integration**: See `docs/clerk-integration.md` - Authentication setup, protected routes, and invitation-based onboarding

## 🤝 Contributing

This project follows the BMAD Method framework for AI-guided development. See `docs/git-workflow.md` for branching strategy and commit conventions.

### Story Development Workflow

1. **Create story branch**: `git checkout -b story/X-Y-story-name`
2. **Implement story**: Follow acceptance criteria in `docs/stories/`
3. **Commit frequently**: Use WIP commits during development
4. **Code review**: Run `/bmad:bmm:workflows:code-review`
5. **Merge to feat branch**: After story completion

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Built with [Turborepo](https://turbo.build)
- Reference implementation: [turbo-expo-nextjs-clerk-convex-monorepo](https://github.com/get-convex/turbo-expo-nextjs-clerk-convex-monorepo)
- UI components from [shadcn/ui](https://ui.shadcn.com)
