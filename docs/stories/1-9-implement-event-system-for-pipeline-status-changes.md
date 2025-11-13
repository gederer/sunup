# Story 1.9: Implement Event System for Pipeline Status Changes

Status: ready-for-dev

## Story

As a Developer,
I want pipeline status changes to trigger events that notify other parts of the system,
So that cascading actions (notifications, commission calculations) happen automatically.

## Acceptance Criteria

1. Event emitter function `emitPipelineEvent(ctx, personId, fromStage, toStage)` publishes events
2. Event subscription pattern allows listeners to register handlers
3. Sample event handler logs pipeline changes (demonstrates pattern)
4. Pipeline mutation triggers event on status change
5. Event payload includes: tenantId, personId, userId (who changed), timestamp, fromStage, toStage
6. Events are stored in `pipelineEvents` table for audit trail
7. Documentation in `/docs/event-system.md` explains event patterns

## Tasks / Subtasks

- [ ] Create `pipelineEvents` table in schema (AC: #6)
  - [ ] Define schema with fields: tenantId, personId, userId, timestamp, fromStage, toStage, eventType, metadata
  - [ ] Add indexes: by_tenant, by_person_and_timestamp, by_tenant_and_timestamp
  - [ ] Add RLS (tenantId filtering)

- [ ] Create event emitter utilities in `packages/convex/lib/events.ts` (AC: #1, #5)
  - [ ] Implement `emitPipelineEvent(ctx, payload)` function
  - [ ] Define event payload interface with required fields
  - [ ] Insert event record into pipelineEvents table
  - [ ] Ensure multi-tenant isolation (tenantId validation)

- [ ] Implement event subscription pattern (AC: #2)
  - [ ] Create event handler registry/pattern for listeners
  - [ ] Document subscription pattern in code comments
  - [ ] Provide example handler registration

- [ ] Create sample event handler for logging (AC: #3)
  - [ ] Implement `logPipelineChange` handler in `packages/convex/lib/eventHandlers.ts`
  - [ ] Handler logs: timestamp, person, fromStage, toStage, userId
  - [ ] Demonstrate subscription pattern usage

- [ ] Update `movePersonToStage` mutation to emit events (AC: #4)
  - [ ] Import emitPipelineEvent function
  - [ ] Call emitPipelineEvent after successful stage transition
  - [ ] Pass complete event payload
  - [ ] Ensure event emission doesn't fail entire mutation

- [ ] Write comprehensive tests
  - [ ] Unit test for emitPipelineEvent function
  - [ ] Integration test for movePersonToStage event emission
  - [ ] Test event subscription pattern
  - [ ] Test multi-tenant isolation of events
  - [ ] Test event payload structure validation

- [ ] Create documentation in `/docs/event-system.md` (AC: #7)
  - [ ] Explain event-driven architecture pattern
  - [ ] Document how to emit events
  - [ ] Document how to subscribe to events
  - [ ] Provide code examples
  - [ ] List available event types

## Dev Notes

### Learnings from Previous Story

**From Story 1-8-create-pipeline-data-model-and-schema (Status: done)**

- **Pipeline Functions Available**:
  - `packages/convex/pipeline.ts` - 8 functions including `movePersonToStage()` mutation (this is where we'll add event emission)
  - `packages/convex/persons.ts` - 7 person management functions

- **Schema Pattern Established**:
  - All tables include `tenantId` for RLS
  - Composite indexes pattern: `(tenantId, otherField)` for efficient queries
  - Use `v.id("tableName")` for foreign keys

- **Testing Infrastructure**:
  - Convex-test v0.0.38 now properly configured with:
    - `@edge-runtime/vm` package installed
    - `vitest.config.mts` using `edge-runtime` environment
    - `import.meta.glob("../**/!(*.*.*)*.*s")` pattern for monorepo
    - Authentication via `t.withIdentity({ subject: "test_clerk_user" })`
  - All 88 tests passing (6 pipeline tests + 82 existing)

- **RLS Pattern**: Use `getAuthUserWithTenant(ctx)` helper from `lib/auth.ts` for tenantId validation

- **Convex Version**: 1.29.0 (latest stable)

[Source: stories/1-8-create-pipeline-data-model-and-schema.md#Dev-Agent-Record]

### Architecture Context

**Event System Design:**
- Convex mutations are inherently real-time via subscriptions
- Events table provides audit trail and enables async processing
- Event handlers can be implemented as Convex actions or scheduled functions
- Future: Can integrate with external event systems (webhooks, message queues)

**Multi-Tenant Considerations:**
- All events must include tenantId
- Event queries must filter by tenantId (RLS)
- Event handlers should validate tenant context

### Project Structure Notes

**Files to Create:**
- `packages/convex/lib/events.ts` - Event emitter utilities
- `packages/convex/lib/eventHandlers.ts` - Sample event handlers
- `docs/event-system.md` - Event system documentation

**Files to Modify:**
- `packages/convex/schema.ts` - Add pipelineEvents table
- `packages/convex/pipeline.ts` - Update movePersonToStage to emit events

**Testing:**
- Create `packages/convex/tests/events.test.ts` for event system tests
- Follow patterns from `packages/convex/tests/pipeline.test.ts`

### References

- [Source: docs/epics.md#Story-1.9]
- [Source: docs/architecture.md - Convex backend, real-time subscriptions]
- [Source: stories/1-8-create-pipeline-data-model-and-schema.md - Pipeline implementation]
- [Source: packages/convex/schema.ts - Schema patterns]
- [Source: packages/convex/pipeline.ts - movePersonToStage mutation]

## Dev Agent Record

### Context Reference

- `docs/stories/1-9-implement-event-system-for-pipeline-status-changes.context.xml`

### Agent Model Used

Claude 3.5 Sonnet (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-13: Story drafted (from backlog status)
