import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	/**
	 * Players Table
	 * Manages user information and game state for each player
	 */
	players: defineTable({
		userId: v.string(),        // Authentication identifier from auth provider
		username: v.string(),      // Player's display name
		score: v.number(),         // Current cumulative score across rounds
		isDoctor: v.boolean(),     // Whether this player is currently "Dr. Whatchamacallit"
		avatar: v.string(),        // Avatar color/style identifier (e.g., "bg-blue-500")
	}).index("by_userId", ["userId"]),

	/**
	 * Rooms Table  
	 * Manages multiplayer game sessions and player coordination
	 */
	rooms: defineTable({
		hostId: v.id("players"),                // Player who created the room (host)
		playerIds: v.array(v.id("players")),   // Array of all players currently in the room
		roomCode: v.string(),                  // Unique 5-digit code for joining the room
	}).index("by_room_code", ["roomCode"]),

	/**
	 * Games Table
	 * Tracks active game state and progression through rounds
	 */
	games: defineTable({
		roomId: v.id("rooms"),          // Which room this game belongs to
		gamePhase: v.string(),          // Current phase: "waiting", "answering", "guessing", "revealing"
		currentRound: v.number(),       // Current round number (1-based indexing)
		totalRounds: v.number(),        // Total number of rounds configured for this game
		currentPrompt: v.string(),      // The creative prompt players are responding to
		selectedAnswer: v.optional(v.string()), // Answer selected during guessing phase (optional)
	}).index("by_room", ["roomId"]),

	/**
	 * Answers Table
	 * Stores player submissions for each round with metadata
	 */
	answers: defineTable({
		roomId: v.id("rooms"),     // Which room/game this answer belongs to
		round: v.number(),         // Which round this answer was submitted in
		playerId: v.id("players"), // Player who submitted this answer
		answer: v.string(),        // The creative answer text submitted by the player
		isDoctor: v.boolean(),     // Whether this answer came from "Dr. Whatchamacallit"
	})
		.index("by_room_round", ["roomId", "round"])     // Primary index for fetching round answers
		.index("by_player_round", ["playerId", "round"]), // Secondary index for player history
});
