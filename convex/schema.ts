import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
	posts: defineTable({
		name: v.string(),
	}),
	players: defineTable({
		userId: v.id("users"),
		score: v.number(),
		isDoctor: v.boolean(),
	}),
	rooms: defineTable({
		hostId: v.id("users"),
		playerIds: v.array(v.id("users")),
	}),
	...authTables,
});
