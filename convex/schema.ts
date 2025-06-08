import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	players: defineTable({
		userId: v.string(),
		username: v.string(),
		score: v.number(),
		isDoctor: v.boolean(),
	}).index("by_userId", ["userId"]),

	rooms: defineTable({
		hostId: v.id("players"),
		playerIds: v.array(v.id("players")),
		roomCode: v.string(),
	}).index("by_room_code", ["roomCode"]),
});
