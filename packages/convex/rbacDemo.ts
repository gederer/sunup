/**
 * RBAC Demo Queries
 *
 * These queries demonstrate role-based access control (RBAC) patterns.
 * Each query enforces specific role requirements using the RBAC helpers.
 *
 * Purpose:
 * - Show developers how to use requireRole, hasRole, hasAnyRole helpers
 * - Demonstrate different access patterns (single role, multiple roles, hierarchical)
 * - Provide examples for testing RBAC enforcement
 *
 * Story: 1.7 - Implement Role-Based Access Control (RBAC) for 15 Roles
 */

import { query } from "./_generated/server";
import { requireRole } from "./lib/auth";

/**
 * List Financial Reports
 *
 * Restricted to: Finance, Executive, System Administrator
 *
 * Demonstrates: Multi-role access control for sensitive financial data
 */
export const listFinancialReports = query({
  handler: async (ctx) => {
    // Enforce role-based access
    await requireRole(ctx, ["Finance", "Executive", "System Administrator"]);

    // Mock financial data for demonstration
    return [
      {
        id: "report-1",
        type: "Monthly Revenue",
        amount: 125000,
        month: "2025-01",
        status: "finalized",
      },
      {
        id: "report-2",
        type: "Commission Summary",
        amount: 32500,
        month: "2025-01",
        status: "pending_approval",
      },
      {
        id: "report-3",
        type: "Expense Report",
        amount: 18750,
        month: "2025-01",
        status: "finalized",
      },
    ];
  },
});

/**
 * List Sales Metrics
 *
 * Restricted to: Sales Manager, Executive, System Administrator
 *
 * Demonstrates: Management-level access to sales performance data
 */
export const listSalesMetrics = query({
  handler: async (ctx) => {
    // Enforce role-based access
    await requireRole(ctx, ["Sales Manager", "Executive", "System Administrator"]);

    // Mock sales metrics for demonstration
    return [
      {
        id: "metric-1",
        metric: "Total Leads",
        value: 342,
        period: "2025-01",
        trend: "+12%",
      },
      {
        id: "metric-2",
        metric: "Conversion Rate",
        value: 24.5,
        period: "2025-01",
        trend: "+3.2%",
      },
      {
        id: "metric-3",
        metric: "Average Deal Size",
        value: 42500,
        period: "2025-01",
        trend: "+8.7%",
      },
      {
        id: "metric-4",
        metric: "Pipeline Value",
        value: 2850000,
        period: "2025-01",
        trend: "+15.3%",
      },
    ];
  },
});

/**
 * List User Management Data
 *
 * Restricted to: System Administrator ONLY
 *
 * Demonstrates: Single-role access control for administrative functions
 */
export const listUserManagement = query({
  handler: async (ctx) => {
    // Enforce role-based access (admin only)
    await requireRole(ctx, ["System Administrator"]);

    // Mock user management data for demonstration
    return [
      {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        roles: ["Sales Manager", "Consultant"],
        primaryRole: "Sales Manager",
        status: "active",
        lastLogin: "2025-01-13T10:30:00Z",
      },
      {
        id: "user-2",
        name: "Jane Smith",
        email: "jane@example.com",
        roles: ["Setter Manager"],
        primaryRole: "Setter Manager",
        status: "active",
        lastLogin: "2025-01-13T09:15:00Z",
      },
      {
        id: "user-3",
        name: "Bob Johnson",
        email: "bob@example.com",
        roles: ["Consultant"],
        primaryRole: "Consultant",
        status: "inactive",
        lastLogin: "2025-01-10T14:22:00Z",
      },
    ];
  },
});

/**
 * List My Team Metrics
 *
 * Restricted to: Sales Manager, Setter Manager, Project Manager
 *
 * Demonstrates: Manager-level access across different departments
 */
export const listMyTeamMetrics = query({
  handler: async (ctx) => {
    // Enforce role-based access (managers only)
    const { user } = await requireRole(ctx, [
      "Sales Manager",
      "Setter Manager",
      "Project Manager",
    ]);

    // Mock team metrics for demonstration
    // In a real implementation, this would filter by the manager's actual team
    return [
      {
        id: "team-1",
        teamMember: "Alice Cooper",
        role: "Setter",
        performance: {
          leadsContacted: 145,
          appointmentsSet: 32,
          conversionRate: 22.1,
        },
        period: "2025-01",
        manager: user._id,
      },
      {
        id: "team-2",
        teamMember: "Charlie Davis",
        role: "Consultant",
        performance: {
          meetingsCompleted: 28,
          proposalsCreated: 24,
          closureRate: 71.4,
        },
        period: "2025-01",
        manager: user._id,
      },
      {
        id: "team-3",
        teamMember: "Diana Evans",
        role: "Setter",
        performance: {
          leadsContacted: 167,
          appointmentsSet: 41,
          conversionRate: 24.6,
        },
        period: "2025-01",
        manager: user._id,
      },
    ];
  },
});
