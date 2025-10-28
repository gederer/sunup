import {defineSchema, defineTable} from "convex/server";
import { v } from "convex/values";

// Extend this schema with tables as your data model evolves.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
});
