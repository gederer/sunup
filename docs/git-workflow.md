# Git Workflow - MANDATORY Procedures

**Status:** MANDATORY - MUST be followed for ALL story implementations
**Last Updated:** 2025-11-06
**Applies To:** All Phase 4 implementation work (Epics 1-6, Stories 1.1-6.10)

---

## 🚨 CRITICAL RULES (NEVER VIOLATE)

<critical>
1. **NEVER start a story without committing all current work first**
2. **NEVER work on a story without a safety checkpoint (branch or tag)**
3. **ALWAYS commit frequently during story implementation (WIP commits)**
4. **ALWAYS test builds before committing completed stories**
5. **ALWAYS create recovery points before risky refactors**
</critical>

---

## 📋 Pre-Story Implementation Checklist

**BEFORE starting ANY story implementation, ALWAYS:**

```bash
# 1. Check current status
git status

# 2. If there are uncommitted changes:
git add .
git commit -m "wip: checkpoint before Story X.Y"

# 3. Verify you're on the right branch
git branch --show-current
# Should be on: feat/sundialer (or appropriate feature branch)

# 4. Create story branch
git checkout -b story/X-Y-story-name

# 5. Verify branch created
git branch --show-current
```

**IF YOU SKIP THIS CHECKLIST, YOU RISK LOSING WORK!**

---

## 🌿 Branching Strategy

### Branch Hierarchy

```
main (production)
  └── feat/sundialer (feature branch)
        ├── story/1-1-monorepo-refactor (Story 1.1)
        ├── story/1-2-tailwind-setup (Story 1.2)
        ├── story/1-3-convex-backend (Story 1.3)
        └── ... (one branch per story)
```

### Branch Naming Convention

**Format:** `story/X-Y-brief-description`

**Examples:**
- `story/1-1-monorepo-refactor`
- `story/1-2-tailwind-setup`
- `story/2-1-person-list-view`
- `story/3-6-predictive-dialing-engine`

**Rules:**
- Always use story number (e.g., `1-1`, `2-3`)
- Keep description brief (2-4 words, kebab-case)
- Must match sprint-status.yaml key format

---

## 📝 Story Implementation Workflow

### Step 1: Before Starting Story

```bash
# Commit any uncommitted work
git status
git add .
git commit -m "wip: checkpoint before Story X.Y"

# Create story branch from feature branch
git checkout feat/sundialer
git pull  # If working with remote
git checkout -b story/X-Y-story-name

# Verify
git branch --show-current
```

### Step 2: During Story Implementation

**Commit Frequently (Every 30-60 minutes or after each logical change):**

```bash
# Work in progress commits
git add .
git commit -m "wip: implement X component"
git commit -m "wip: add Y functionality"
git commit -m "wip: refactor Z module"

# Build/test checkpoints
git commit -m "wip: builds successfully"
git commit -m "wip: all tests passing"
```

**Commit Message Prefixes:**
- `wip:` - Work in progress (incomplete)
- `feat:` - New feature (story complete)
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `docs:` - Documentation only
- `chore:` - Build/config changes

### Step 3: Complete Story

```bash
# Run final checks
npm run build
npm run lint
npm run test  # When tests exist

# Final commit (story complete)
git add .
git commit -m "feat: complete Story X.Y - Brief description

Implements:
- Acceptance criteria 1
- Acceptance criteria 2
- Acceptance criteria 3

Tests: All passing
Build: Successful

Story tracking: sprint-status.yaml updated to 'review' status

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Merge back to feature branch
git checkout feat/sundialer
git merge story/X-Y-story-name --no-ff

# Optional: Delete story branch (keep if you want history)
git branch -d story/X-Y-story-name
```

### Step 4: After Story Complete

```bash
# Update sprint status
# (Edit sprint-status.yaml: story X-Y-story-name: review)

# Commit sprint status update
git add docs/sprint-status.yaml
git commit -m "chore: update sprint status - Story X.Y to review"

# Push to remote (if applicable)
git push origin feat/sundialer
```

---

## 🚨 Emergency Recovery Procedures

### If Story Implementation Goes Wrong

**Option 1: Discard All Changes (Nuclear option)**
```bash
# Check what would be lost
git status
git diff

# Discard uncommitted changes
git restore .

# Or reset to last commit
git reset --hard HEAD

# Or reset to specific commit
git reset --hard <commit-hash>
```

**Option 2: Stash Changes and Start Fresh**
```bash
# Save work without committing
git stash push -m "Story X.Y attempt 1 - trying different approach"

# Start fresh
git restore .

# View stashed work later
git stash list
git stash show -p stash@{0}

# Recover if needed
git stash pop
```

**Option 3: Create New Branch from Last Good Commit**
```bash
# Find last good commit
git log --oneline

# Create new branch from that commit
git checkout -b story/X-Y-story-name-v2 <good-commit-hash>
```

**Option 4: Use Reflog (Git's Time Machine)**
```bash
# Git keeps ALL history for 30+ days
git reflog

# See what happened
git log --oneline --graph --all

# Reset to any point in history
git reset --hard HEAD@{5}
git reset --hard <commit-hash>
```

### If You've Lost Uncommitted Work

```bash
# Check stash
git stash list

# Check reflog
git reflog

# Git may have auto-saved
git fsck --lost-found
```

### Nuclear Reset (Last Resort)

```bash
# Reset to safe checkpoint tag
git reset --hard phase3-complete

# Or reset to specific tag
git reset --hard epic-1-complete
```

---

## 📌 Safe Checkpoint Creation

### After Each Epic

```bash
# After completing all Epic X stories
git tag -a epic-X-complete -m "Epic X: Brief description complete"

# Push tag to remote
git push origin epic-X-complete
```

### Before Major Refactors

```bash
# Before risky changes (like Story 1.1 monorepo refactor)
git tag -a pre-story-X-Y -m "Safe checkpoint before Story X.Y"

# Create experimental branch
git checkout -b story/X-Y-experiment

# Try implementation
# If successful, merge
# If failed, delete branch and start fresh
```

### Phase Completion Tags

```bash
# Already created:
git tag -a phase3-complete -m "Phase 3 complete - safe checkpoint"

# Future tags:
git tag -a epic-1-complete -m "Epic 1: Foundation complete"
git tag -a epic-2-complete -m "Epic 2: CRM complete"
# ... etc
```

---

## 🔍 Commit Before Starting Story - Detection Rules

**The dev workflow MUST check for uncommitted changes:**

```bash
# Check for uncommitted changes
if [[ $(git status --porcelain) ]]; then
  echo "⚠️  WARNING: You have uncommitted changes!"
  echo ""
  git status
  echo ""
  echo "MANDATORY: Commit all changes before starting story implementation."
  echo ""
  echo "Run:"
  echo "  git add ."
  echo "  git commit -m 'wip: checkpoint before Story X.Y'"
  echo ""
  exit 1
fi
```

**This check ensures:**
- No work is lost
- Clean starting point for each story
- Easy rollback if story implementation fails

---

## 📊 Sprint Status Integration

**Always keep sprint-status.yaml in sync:**

```yaml
development_status:
  epic-1: in-progress
  1-1-refactor-to-turborepo-monorepo-structure: in-progress  # Currently working
  1-2-setup-tailwind-css-4-and-shadcn-ui-component-library: backlog
  # ... etc
```

**Status Flow:**
1. `backlog` → Start story, create branch
2. `in-progress` → Working on story (on story branch)
3. `review` → Story complete, merged to feature branch
4. `done` → After code review and acceptance

**Commit sprint status updates:**
```bash
git add docs/sprint-status.yaml
git commit -m "chore: update sprint status - Story X.Y to in-progress"
```

---

## 🎯 Quick Reference Card

**Starting a Story:**
```bash
git status                                    # Check for uncommitted work
git add . && git commit -m "wip: checkpoint"  # Commit if needed
git checkout -b story/X-Y-name                # Create story branch
```

**During Story:**
```bash
git add . && git commit -m "wip: description"  # Commit frequently
npm run build && npm run lint                  # Test before completing
```

**Completing Story:**
```bash
git add . && git commit -m "feat: complete Story X.Y"
git checkout feat/sundialer
git merge story/X-Y-name --no-ff
```

**Emergency Reset:**
```bash
git reflog                          # Find safe point
git reset --hard HEAD@{N}          # Reset to that point
git reset --hard phase3-complete   # Nuclear reset
```

---

## 🔗 Integration Points

This workflow is integrated into:

1. **dev-story workflow** - Reads this file before starting story implementation
2. **story-ready workflow** - Verifies clean git state
3. **code-review workflow** - Checks commits follow conventions
4. **story-done workflow** - Verifies story branch merged properly

**File Location:** `{project-root}/docs/git-workflow.md`

**Enforcement:** All story workflows MUST read and follow this document.

---

## ⚖️ Workflow Violations

**If this workflow is violated, YOU RISK:**
- ❌ Losing uncommitted work
- ❌ Unable to rollback failed implementations
- ❌ Merge conflicts and code chaos
- ❌ Broken builds with no recovery path
- ❌ Hours/days of work lost

**This workflow is MANDATORY and NON-NEGOTIABLE.**

---

_This document is the single source of truth for git workflow during Phase 4 implementation. If you're unsure about any git operation, refer to this document first._

**Last Updated:** 2025-11-06 by Greg (via Claude Code)
