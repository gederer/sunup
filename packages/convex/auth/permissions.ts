/**
 * Better Auth Access Control Configuration
 * Defines resources and 12-role permission sets for Sunup
 */

import { createAccessControl } from "better-auth/plugins/access";

/**
 * Resource Definitions
 * Define all available actions for each resource in the system
 */
export const statement = {
  // CRM Resources
  person: ["create", "read", "update", "delete", "assign"],
  organization: ["create", "read", "update", "delete"],

  // Campaign & Dialer Resources
  campaign: ["create", "read", "update", "delete", "activate"],
  call: ["initiate", "answer", "transfer", "record"],

  // Meeting & Consultation Resources
  appointment: ["create", "read", "update", "cancel", "reassign"],
  meeting: ["create", "join", "end", "record"],

  // Commission Resources
  commission: ["create", "read", "approve", "dispute", "pay"],
  commissionRule: ["create", "read", "update", "delete"],

  // User & Admin Resources
  user: ["create", "read", "update", "delete", "ban", "impersonate"],
  tenant: ["create", "read", "update", "delete"],

  // Analytics & Reporting
  analytics: ["view", "export"],
  leaderboard: ["view", "manage"],

  // System Resources
  settings: ["read", "update"],
  audit: ["read"],
} as const;

// Create access control instance
export const ac = createAccessControl(statement);

/**
 * Role: Setter
 * Make outbound calls, set appointments, view own commissions
 */
export const setter = ac.newRole({
  person: ["read", "update", "assign"],
  call: ["initiate", "answer"],
  appointment: ["create"],
  commission: ["read"],
  leaderboard: ["view"],
});

/**
 * Role: Consultant
 * Conduct meetings, close sales, view own commissions
 */
export const consultant = ac.newRole({
  person: ["read", "update"],
  appointment: ["read", "update"],
  meeting: ["create", "join", "end"],
  organization: ["read", "update"],
  commission: ["read"],
  leaderboard: ["view"],
});

/**
 * Role: Sales Manager
 * Oversee sales pipeline, manage team, approve commissions
 */
export const salesManager = ac.newRole({
  person: ["create", "read", "update", "delete"],
  organization: ["create", "read", "update", "delete"],
  appointment: ["create", "read", "update", "cancel", "reassign"],
  meeting: ["read"],
  commission: ["read", "approve"],
  analytics: ["view", "export"],
  leaderboard: ["view", "manage"],
  user: ["read"],
});

/**
 * Role: Setter Manager
 * Manage campaigns, monitor setters, approve setter commissions
 */
export const setterManager = ac.newRole({
  person: ["read", "assign"],
  campaign: ["create", "read", "update", "delete", "activate"],
  call: ["read", "transfer"],
  user: ["create", "read"], // Can create setter accounts
  commission: ["read", "approve"],
  analytics: ["view", "export"],
  leaderboard: ["view", "manage"],
});

/**
 * Role: Project Manager
 * Oversee installations, manage project schedules
 */
export const projectManager = ac.newRole({
  person: ["read", "update"],
  organization: ["read"],
  appointment: ["read"],
  analytics: ["view"],
});

/**
 * Role: Installer
 * View assigned installations, update installation status
 */
export const installer = ac.newRole({
  person: ["read"],
  organization: ["read"],
  appointment: ["read"],
});

/**
 * Role: Recruiter
 * Manage contractor onboarding, create user accounts
 */
export const recruiter = ac.newRole({
  user: ["create", "read", "update"],
  analytics: ["view"],
});

/**
 * Role: Trainer
 * Manage training content, view trainee progress
 */
export const trainer = ac.newRole({
  user: ["read"],
  leaderboard: ["view"],
  analytics: ["view"],
});

/**
 * Role: System Administrator
 * Full system access, all permissions
 */
export const systemAdmin = ac.newRole({
  person: ["create", "read", "update", "delete", "assign"],
  organization: ["create", "read", "update", "delete"],
  campaign: ["create", "read", "update", "delete", "activate"],
  call: ["initiate", "answer", "transfer", "record"],
  appointment: ["create", "read", "update", "cancel", "reassign"],
  meeting: ["create", "join", "end", "record"],
  commission: ["create", "read", "approve", "dispute", "pay"],
  commissionRule: ["create", "read", "update", "delete"],
  user: ["create", "read", "update", "delete", "ban", "impersonate"],
  tenant: ["create", "read", "update", "delete"],
  analytics: ["view", "export"],
  leaderboard: ["view", "manage"],
  settings: ["read", "update"],
  audit: ["read"],
});

/**
 * Role: Executive
 * View-only access to analytics and reports
 */
export const executive = ac.newRole({
  person: ["read"],
  organization: ["read"],
  analytics: ["view", "export"],
  leaderboard: ["view"],
  audit: ["read"],
});

/**
 * Role: Finance
 * Manage commissions, payments, and financial reports
 */
export const finance = ac.newRole({
  person: ["read"],
  commission: ["read", "approve", "dispute", "pay"],
  commissionRule: ["read"],
  analytics: ["view", "export"],
  audit: ["read"],
});

/**
 * Role: Operations
 * Manage daily operations, view analytics
 */
export const operations = ac.newRole({
  person: ["read", "update"],
  organization: ["read", "update"],
  appointment: ["read", "update"],
  analytics: ["view", "export"],
  settings: ["read"],
});

/**
 * Export all roles for use in better-auth configuration
 */
export const roles = {
  setter,
  consultant,
  salesManager,
  setterManager,
  projectManager,
  installer,
  recruiter,
  trainer,
  systemAdmin,
  executive,
  finance,
  operations,
} as const;

/**
 * Type-safe role names
 */
export type RoleName = keyof typeof roles;
