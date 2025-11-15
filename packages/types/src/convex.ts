/**
 * Convex Schema Types
 *
 * This module re-exports types from the Convex schema for use across the monorepo.
 * Types are inferred from the schema defined in @sunup/convex/schema
 */

import { Doc, Id } from '@sunup/convex/_generated/dataModel';

// Re-export Convex generated types
export type { Doc, Id };

// User types
export type User = Doc<'users'>;
export type UserId = Id<'users'>;

// Person types (table name: 'people')
export type Person = Doc<'people'>;
export type PersonId = Id<'people'>;

// Organization types
export type Organization = Doc<'organizations'>;
export type OrganizationId = Id<'organizations'>;

// Campaign types
export type Campaign = Doc<'campaigns'>;
export type CampaignId = Id<'campaigns'>;

// Appointment types
export type Appointment = Doc<'appointments'>;
export type AppointmentId = Id<'appointments'>;

// Future table types (to be implemented in later epics)
// export type Call = Doc<'calls'>;
// export type CallId = Id<'calls'>;
// export type Commission = Doc<'commissions'>;
// export type CommissionId = Id<'commissions'>;
// export type Leaderboard = Doc<'leaderboards'>;
// export type LeaderboardId = Id<'leaderboards'>;
