# @sunup/types

Shared TypeScript types package for Sunup web and mobile applications.

## Structure

- `src/convex.ts` - Convex schema inferred types (Doc, Id types for all tables)
- `src/domain.ts` - Business logic types (Role, PipelineStage, etc.)
- `src/index.ts` - Main entry point that re-exports all types

## Usage

```typescript
// Import Convex types
import { User, UserId, Person } from '@sunup/types/convex';

// Import domain types
import { Role, PipelineStage } from '@sunup/types/domain';

// Import all types
import { User, Role } from '@sunup/types';
```

## Type Categories

### Convex Types
- User, Person, Organization, Campaign, Call, Appointment, Commission, Leaderboard
- Corresponding Id types for each entity

### Domain Types
- Role: User roles (admin, setter, consultant, etc.)
- PipelineStage: Sales pipeline stages
- CallStatus: Call statuses
- CallDisposition: Call outcomes
- AppointmentStatus: Appointment statuses
- CommissionStatus: Commission payment statuses
- AvailabilityStatus: User availability statuses
