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

// Person types
export type Person = Doc<'persons'>;
export type PersonId = Id<'persons'>;

// Organization types
export type Organization = Doc<'organizations'>;
export type OrganizationId = Id<'organizations'>;

// Campaign types
export type Campaign = Doc<'campaigns'>;
export type CampaignId = Id<'campaigns'>;

// Call types
export type Call = Doc<'calls'>;
export type CallId = Id<'calls'>;

// Appointment types
export type Appointment = Doc<'appointments'>;
export type AppointmentId = Id<'appointments'>;

// Commission types
export type Commission = Doc<'commissions'>;
export type CommissionId = Id<'commissions'>;

// Leaderboard types
export type Leaderboard = Doc<'leaderboards'>;
export type LeaderboardId = Id<'leaderboards'>;
