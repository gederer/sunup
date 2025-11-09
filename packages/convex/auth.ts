/**
 * Better Auth Server Configuration
 * Configures authentication with Convex adapter, Admin plugin, and Access Control
 */

import { betterAuth } from "better-auth";
import { admin as adminPlugin } from "better-auth/plugins";
import { convexAdapter } from "@convex-dev/better-auth/convex-adapter";
import { ac, roles } from "./auth/permissions";
import { GenericDataModel } from "convex/server";

/**
 * Create better-auth instance with Convex integration
 * This should be called within a Convex HTTP action with ctx
 */
export function createAuth(ctx: { db: any }) {
  return betterAuth({
    database: convexAdapter(ctx),

    // Email/password authentication with magic links
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Magic links handle verification
    },

    // Admin plugin for user management and role-based access
    plugins: [
      adminPlugin({
        ac,
        roles,
        defaultRole: "setter", // Default role for new users
        adminRoles: ["systemAdmin"], // Who can access admin endpoints
      }),
    ],

    // Base URL for magic links
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

    // Secret for JWT signing
    secret: process.env.BETTER_AUTH_SECRET || "development-secret-change-in-production",
  });
}

/**
 * Type for better-auth instance
 */
export type Auth = ReturnType<typeof createAuth>;
