import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	// Players table - manages user information and game state
	players: defineTable({
		userId: v.string(),        // Authentication identifier
		username: v.string(),      // Display name for the player
		score: v.number(),         // Current game score
		isDoctor: v.boolean(),     // Whether this player is "Dr. Whatchamacallit"
		avatar: v.string(),        // Avatar color/style identifier
	}).index("by_userId", ["userId"]),

	// Rooms table - manages multiplayer game sessions
	rooms: defineTable({
		hostId: v.id("players"),                // Player who created the room
		playerIds: v.array(v.id("players")),   // All players currently in the room
		roomCode: v.string(),                  // Unique code for joining the room
	}).index("by_room_code", ["roomCode"]),

	// Games table - tracks active game state and progression
	games: defineTable({
		roomId: v.id("rooms"),          // Which room this game belongs to
		gamePhase: v.string(),          // Current phase: "waiting", "answering", "guessing", "revealing"
		currentRound: v.number(),       // Current round number (1-based)
		totalRounds: v.number(),        // Total number of rounds in this game
		currentPrompt: v.string(),      // The current creative prompt players are responding to
		selectedAnswer: v.optional(v.string()), // Answer selected during guessing phase
	}).index("by_room", ["roomId"]),

	// Answers table - stores player submissions for each round
	answers: defineTable({
		roomId: v.id("rooms"),     // Which room/game this answer belongs to
		round: v.number(),         // Which round this answer was submitted in
		playerId: v.id("players"), // Player who submitted this answer
		answer: v.string(),        // The creative answer text
		isDoctor: v.boolean(),     // Whether this answer came from Dr. Whatchamacallit
	}).index("by_room_round", ["roomId", "round"])
	  .index("by_player_round", ["playerId", "round"]),
});
