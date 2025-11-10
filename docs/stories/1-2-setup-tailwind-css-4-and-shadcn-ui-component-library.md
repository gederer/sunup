# Story 1.2: Setup TailwindCSS 4 and shadcn/ui Component Library

Status: done

## Story

As a Developer,
I want TailwindCSS 4+ and shadcn/ui configured with theming support,
So that I can build consistent, accessible UI components with light/dark mode.

## Acceptance Criteria

1. TailwindCSS 4+ installed and configured with Next.js
2. shadcn/ui initialized with components directory (`/components/ui`)
3. tweakcn theme system configured for light/dark mode switching
4. Basic theme variables defined (colors, spacing, typography)
5. Sample page demonstrates theme switching functionality
6. Tailwind typography plugin configured for content rendering
7. All shadcn/ui components are accessible (WCAG 2.1 Level AA compliant by default)

## Tasks / Subtasks

- [ ] Verify TailwindCSS 4+ installation and configuration (AC: #1)
  - [ ] Confirm TailwindCSS 4.x in package.json
  - [ ] Verify Tailwind config in apps/web/tailwind.config.ts
  - [ ] Ensure @tailwindcss/postcss plugin configured
  - [ ] Test basic Tailwind utilities work

- [ ] Initialize shadcn/ui with components directory (AC: #2)
  - [ ] Run `npx shadcn@latest init` in apps/web/
  - [ ] Verify components.json configuration
  - [ ] Confirm components directory created at apps/web/components/ui/
  - [ ] Install initial core components: Button, Card, Input, Label
  - [ ] Verify components export properly

- [ ] Configure tweakcn theme system for light/dark mode (AC: #3)
  - [ ] Install next-themes package
  - [ ] Create ThemeProvider component wrapper
  - [ ] Add theme toggle component (using shadcn/ui dropdown-menu)
  - [ ] Configure CSS variables for light/dark themes in globals.css
  - [ ] Test theme switching functionality

- [ ] Define basic theme variables (AC: #4)
  - [ ] Configure color palette (primary, secondary, accent, destructive, muted, etc.)
  - [ ] Define spacing scale (consistent with Tailwind defaults)
  - [ ] Configure typography (font families, sizes, line heights)
  - [ ] Set border radius values
  - [ ] Document theme customization in README

- [ ] Create sample page demonstrating theme switching (AC: #5)
  - [ ] Create /theme-demo page in apps/web/app/
  - [ ] Showcase core shadcn/ui components (Button, Card, Input, etc.)
  - [ ] Add theme toggle in header/navbar
  - [ ] Demonstrate light/dark mode transitions
  - [ ] Include typography samples

- [ ] Configure Tailwind typography plugin (AC: #6)
  - [ ] Install @tailwindcss/typography
  - [ ] Add plugin to Tailwind config
  - [ ] Create sample prose content page
  - [ ] Verify typography styles work in light/dark modes

- [ ] Verify accessibility compliance (AC: #7)
  - [ ] Test keyboard navigation for all components
  - [ ] Verify color contrast ratios (WCAG AA)
  - [ ] Test screen reader compatibility
  - [ ] Ensure focus indicators visible
  - [ ] Validate ARIA attributes on interactive elements

## Dev Notes

### Architecture Context

**Story Context:** This is Story 1.2, building on the monorepo foundation established in Story 1.1. The monorepo structure is now in place with `apps/web/` for the Next.js application and `packages/ui/` for shared UI components.

**Current Status (Post-Story 1.1):**
- Turborepo monorepo structure established
- Next.js 16.0.0 in `apps/web/`
- TailwindCSS 4.x already installed (per architecture.md)
- Shared config package exists at `packages/config/tailwind/tailwind.config.js`
- `packages/ui/src/components/` directory exists but is empty (waiting for shadcn components)

**Target State:**
- TailwindCSS 4+ fully configured with Next.js
- shadcn/ui initialized with components in `apps/web/components/ui/`
- tweakcn theme system enabling light/dark mode switching
- Sample theme demonstration page
- Tailwind typography plugin for content rendering
- All components WCAG 2.1 Level AA accessible by default

### Learnings from Previous Story

**From Story 1.1 (Status: done)**

- **Monorepo Structure Established**: The project now uses Turborepo with pnpm workspaces
  - Web app at `apps/web/`
  - Shared UI package at `packages/ui/`
  - Shared config at `packages/config/`

- **TailwindCSS Already Installed**: Per architecture.md, TailwindCSS 4.x is already installed
  - Verify current config in `apps/web/tailwind.config.ts`
  - Shared Tailwind config exists at `packages/config/tailwind/tailwind.config.js` with theme tokens

- **shadcn/ui Package Structure Ready**: `packages/ui/src/components/` directory exists but is empty
  - Story 1.1 review confirmed this follows the install-on-demand pattern
  - This story will populate it with initial shadcn/ui components

- **Package Exports Pattern**: All packages use proper exports in package.json
  - Follow the established pattern for any new packages
  - Use `workspace:*` protocol for internal dependencies

- **Build Validation Required**: Story 1.1 established `turbo build` as the validation method
  - Ensure `turbo build --filter=@sunup/web` succeeds after changes

[Source: stories/1-1-refactor-to-turborepo-monorepo-structure.md#Implementation-Summary]

### Project Structure Notes

**TailwindCSS 4 Location:**
- Primary config: `apps/web/tailwind.config.ts`
- Shared theme tokens: `packages/config/tailwind/tailwind.config.js`
- Global styles: `apps/web/app/globals.css`

**shadcn/ui Components:**
- Web app components: `apps/web/components/ui/` (will be created by `shadcn init`)
- Shared UI package: `packages/ui/src/components/` (for cross-platform components)
- This story focuses on web app components; mobile sharing comes in future stories

**Theme System Architecture:**
- CSS variables for theme tokens (defined in globals.css)
- next-themes for client-side theme switching
- Dark mode class strategy (class="dark")
- Theme toggle component in navigation

### Testing Strategy

Since Story 1.6 sets up testing infrastructure (Playwright + Vitest), **NO automated tests** are required for this story. Validation is manual:

1. **Build Verification:** `turbo build --filter=@sunup/web` succeeds
2. **Visual Verification:** Theme demo page renders correctly in light/dark modes
3. **Component Verification:** All installed shadcn/ui components render properly
4. **Accessibility Verification:** Manual keyboard navigation and screen reader testing
5. **Typography Verification:** Prose content renders with Tailwind typography styles

Future stories (1.11+) will add automated visual regression and accessibility testing.

### Dependency Management

**Packages to Install:**
- `shadcn@latest` (CLI tool, dev dependency)
- `next-themes` (theme switching)
- `@tailwindcss/typography` (typography plugin)
- shadcn/ui core components: Button, Card, Input, Label, DropdownMenu (via shadcn CLI)

**Installation Commands:**
```bash
# In apps/web/
pnpm add next-themes
pnpm add -D @tailwindcss/typography

# Initialize shadcn/ui
npx shadcn@latest init

# Install core components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dropdown-menu
```

### Potential Gotchas

1. **TailwindCSS 4 CSS Layer Changes:** Tailwind 4 uses native CSS @layer instead of @tailwind directives
   - Verify globals.css uses correct Tailwind 4 syntax
   - Check @layer base, components, utilities usage

2. **shadcn/ui Configuration:** components.json must be properly configured
   - Verify paths point to correct directories (components/ui, lib/utils)
   - Ensure TypeScript aliases work (@/components, @/lib)

3. **Theme Variable Naming:** CSS variables must match between Tailwind config and globals.css
   - Use HSL format for colors (e.g., `hsl(var(--primary))`)
   - Ensure variable names consistent across light/dark modes

4. **Component Accessibility:** shadcn/ui components are accessible by default
   - Don't remove ARIA attributes during customization
   - Maintain keyboard navigation support
   - Verify focus indicators remain visible

5. **Monorepo Path Resolution:** Tailwind content paths must scan correct directories
   ```js
   content: [
     './app/**/*.{ts,tsx}',
     './components/**/*.{ts,tsx}',
     '../../packages/ui/src/**/*.{ts,tsx}' // Include shared UI package
   ]
   ```

### References

- [Source: docs/epics.md#Story-1.2] - Story definition and acceptance criteria (lines 95-112)
- [Source: docs/architecture.md#Technology-Stack-Details] - TailwindCSS 4.x and shadcn/ui versions (lines 181-195)
- [Source: docs/architecture.md#Project-Structure] - Monorepo structure with apps/web and packages/ui (lines 58-156)
- [TailwindCSS 4 Docs] - https://tailwindcss.com/docs
- [shadcn/ui Docs] - https://ui.shadcn.com/docs
- [next-themes Docs] - https://github.com/pacocoursey/next-themes
- [Tailwind Typography Plugin] - https://tailwindcss.com/docs/typography-plugin
- [WCAG 2.1 Level AA Guidelines] - https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=a%2Caaa

## Dev Agent Record

### Context Reference

- `docs/stories/1-2-setup-tailwind-css-4-and-shadcn-ui-component-library.context.xml` - Comprehensive technical context including existing Tailwind 4 config, shadcn setup, theme variables, dependencies, and implementation constraints

### Agent Model Used

Claude 3.7 Sonnet (claude-sonnet-4-5-20250929)

### Debug Log References

<!-- Implementation details, issues encountered, and solutions will be logged here during development -->

### Completion Notes List

<!-- After story completion, key accomplishments, patterns established, and learnings will be documented here -->

### File List

<!-- Files created, modified, or deleted during implementation will be tracked here -->

## Change Log

- 2025-11-07: Story drafted by SM agent from epics.md (Story 1.2, lines 95-112)
