/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as convex__generated_api from "../convex/_generated/api.js";
import type * as convex__generated_server from "../convex/_generated/server.js";
import type * as http from "../http.js";
import type * as invitations from "../invitations.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_eventHandlers from "../lib/eventHandlers.js";
import type * as lib_events from "../lib/events.js";
import type * as lib_tasks from "../lib/tasks.js";
import type * as persons from "../persons.js";
import type * as pipeline from "../pipeline.js";
import type * as rbacDemo from "../rbacDemo.js";
import type * as seedPipelineData from "../seedPipelineData.js";
import type * as tasks from "../tasks.js";
import type * as testMutations from "../testMutations.js";
import type * as userRoles from "../userRoles.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "convex/_generated/api": typeof convex__generated_api;
  "convex/_generated/server": typeof convex__generated_server;
  http: typeof http;
  invitations: typeof invitations;
  "lib/auth": typeof lib_auth;
  "lib/eventHandlers": typeof lib_eventHandlers;
  "lib/events": typeof lib_events;
  "lib/tasks": typeof lib_tasks;
  persons: typeof persons;
  pipeline: typeof pipeline;
  rbacDemo: typeof rbacDemo;
  seedPipelineData: typeof seedPipelineData;
  tasks: typeof tasks;
  testMutations: typeof testMutations;
  userRoles: typeof userRoles;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
