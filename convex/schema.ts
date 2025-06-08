import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	players: defineTable({
		userId: v.string(),
		username: v.string(),
		score: v.number(),
		isDoctor: v.boolean(),
		avatar: v.string(),
	}).index("by_userId", ["userId"]),

	rooms: defineTable({
		hostId: v.id("players"),
		playerIds: v.array(v.id("players")),
		roomCode: v.string(),
	}).index("by_room_code", ["roomCode"]),

	games: defineTable({
		roomId: v.id("rooms"),
		gamePhase: v.string(),
		currentRound: v.number(),
		totalRounds: v.number(),
		currentPrompt: v.string(),
		selectedAnswer: v.optional(v.string()),
	}).index("by_room", ["roomId"]),

	answers: defineTable({
		roomId: v.id("rooms"),
		round: v.number(),
		playerId: v.id("players"),
		answer: v.string(),
		isDoctor: v.boolean(),
	}).index("by_room_round", ["roomId", "round"]),
});
