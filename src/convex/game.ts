/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { v } from "convex/values";
import {
	type MutationCtx,
	type QueryCtx,
	mutation,
	query,
} from "./_generated/server";

const prompts = [
	"The secret ingredient in my grandmother's famous recipe is whatchamacallit.",
	"I can't believe they're selling whatchamacallit at the grocery store now.",
	"My doctor told me to avoid whatchamacallit for my health.",
	"The new superhero's power is controlling whatchamacallit with their mind.",
	"Scientists just discovered that whatchamacallit is the key to time travel.",
	"My pet's favorite toy is a squeaky whatchamacallit.",
	"The restaurant's specialty dish is deep-fried whatchamacallit with sauce.",
	"I lost my job because I accidentally spilled whatchamacallit on my boss.",
	"The weather forecast calls for a 90% chance of whatchamacallit tomorrow.",
	"My therapist says I have an unhealthy obsession with whatchamacallit.",
];

// Helper to get room doc by roomCode
async function getRoomByCode(ctx: QueryCtx | MutationCtx, roomCode: string) {
	const room = await ctx.db
		.query("rooms")
		.withIndex("by_room_code", (q: any) => q.eq("roomCode", roomCode))
		.first();
	if (!room) {
		throw new Error("Room not found");
	}
	return room;
}

export const getGameState = query({
	args: { roomCode: v.string() },
	// Return type is any to avoid verbose nested validators
	returns: v.any(),
	handler: async (ctx: QueryCtx, { roomCode }: { roomCode: string }) => {
		const room = await getRoomByCode(ctx, roomCode);

		// Fetch players in the room
		const players: any[] = [];
		for (const playerId of room.playerIds) {
			const player = await ctx.db.get(playerId);
			if (player) players.push(player);
		}

		// Get the active game for this room (should be 0 or 1)
		const game = await ctx.db
			.query("games")
			.withIndex("by_room", (q: any) => q.eq("roomId", room._id))
			.first();

		let currentRoundAnswers: any[] = [];
		if (game) {
			currentRoundAnswers = await ctx.db
				.query("answers")
				.withIndex("by_room_round", (q: any) =>
					q.eq("roomId", room._id).eq("round", game.currentRound),
				)
				.collect();

			// Shuffle answers so order is random for clients
			currentRoundAnswers = currentRoundAnswers.sort(() => Math.random() - 0.5);
		}

		return {
			players,
			gamePhase: game?.gamePhase ?? "waiting",
			roundState: game
				? {
						currentRound: game.currentRound,
						totalRounds: game.totalRounds,
						currentPrompt: game.currentPrompt,
						selectedAnswer: game.selectedAnswer ?? null,
						answers: currentRoundAnswers,
					}
				: null,
		};
	},
});

export const startGame = mutation({
	args: { roomCode: v.string(), totalRounds: v.optional(v.number()) },
	returns: v.null(),
	handler: async (
		ctx: MutationCtx,
		{ roomCode, totalRounds }: { roomCode: string; totalRounds?: number },
	) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Not authenticated");
		}
		const room = await getRoomByCode(ctx, roomCode);

		// Ensure caller is part of room
		const player = await ctx.db
			.query("players")
			.withIndex("by_userId", (q: any) =>
				q.eq("userId", identity.tokenIdentifier),
			)
			.first();
		if (!player || !room.playerIds.includes(player._id)) {
			throw new Error("Player not in room");
		}
		// Only the host can start the game
		if (room.hostId !== player._id) {
			throw new Error("Only the host can start the game");
		}
		// Assign a random doctor for this game: reset flags and choose one
		for (const pid of room.playerIds) {
			await ctx.db.patch(pid, { isDoctor: false });
		}
		const randomIndex = Math.floor(Math.random() * room.playerIds.length);
		const doctorId = room.playerIds[randomIndex]!;
		await ctx.db.patch(doctorId, { isDoctor: true });

		// Remove old game if exists
		const existingGame = await ctx.db
			.query("games")
			.withIndex("by_room", (q: any) => q.eq("roomId", room._id))
			.first();
		if (existingGame) {
			await ctx.db.delete(existingGame._id);
		}

		const newPrompt = prompts[Math.floor(Math.random() * prompts.length)] ?? "";

		await ctx.db.insert("games", {
			roomId: room._id,
			gamePhase: "answering",
			currentRound: 1,
			totalRounds: totalRounds ?? 5,
			currentPrompt: newPrompt,
			selectedAnswer: undefined,
		});
		return null;
	},
});

export const submitAnswer = mutation({
	args: { roomCode: v.string(), answer: v.string() },
	returns: v.null(),
	handler: async (
		ctx: MutationCtx,
		{ roomCode, answer }: { roomCode: string; answer: string },
	) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const room = await getRoomByCode(ctx, roomCode);
		const player = await ctx.db
			.query("players")
			.withIndex("by_userId", (q: any) =>
				q.eq("userId", identity.tokenIdentifier),
			)
			.first();
		if (!player || !room.playerIds.includes(player._id)) {
			throw new Error("Player not in room");
		}

		const game = await ctx.db
			.query("games")
			.withIndex("by_room", (q: any) => q.eq("roomId", room._id))
			.first();
		if (!game) throw new Error("Game not started");
		if (game.gamePhase !== "answering") {
			throw new Error("Not accepting answers now");
		}

		// Prevent duplicate answers by same player
		const existingAnswer = await ctx.db
			.query("answers")
			.withIndex("by_room_round", (q: any) =>
				q.eq("roomId", room._id).eq("round", game.currentRound),
			)
			.filter((q: any) => q.eq(q.field("playerId"), player._id))
			.first();
		if (existingAnswer) {
			await ctx.db.patch(existingAnswer._id, { answer });
		} else {
			await ctx.db.insert("answers", {
				roomId: room._id,
				round: game.currentRound,
				playerId: player._id,
				answer,
				isDoctor: player.isDoctor,
			});
		}

		// Check if all players have submitted answers
		const answersForRound = await ctx.db
			.query("answers")
			.withIndex("by_room_round", (q: any) =>
				q.eq("roomId", room._id).eq("round", game.currentRound),
			)
			.collect();

		if (answersForRound.length >= room.playerIds.length) {
			// Move to guessing phase
			await ctx.db.patch(game._id, { gamePhase: "guessing" });
		}
		return null;
	},
});

export const selectAnswer = mutation({
	args: { roomCode: v.string(), selectedAnswer: v.string() },
	returns: v.null(),
	handler: async (
		ctx: MutationCtx,
		{ roomCode, selectedAnswer }: { roomCode: string; selectedAnswer: string },
	) => {
		const room = await getRoomByCode(ctx, roomCode);
		const game = await ctx.db
			.query("games")
			.withIndex("by_room", (q: any) => q.eq("roomId", room._id))
			.first();
		if (!game) throw new Error("Game not started");

		// Get all answers for current round to check if guess is correct
		const roundAnswers = await ctx.db
			.query("answers")
			.withIndex("by_room_round", (q: any) =>
				q.eq("roomId", room._id).eq("round", game.currentRound),
			)
			.collect();

		// Find the doctor's answer
		const doctorAnswer = roundAnswers.find((answer: any) => answer.isDoctor);

		// If the selected answer matches the doctor's answer, award points to all players
		if (doctorAnswer && selectedAnswer === doctorAnswer.answer) {
			// Award 10 points to all players for finding the doctor's answer
			for (const playerId of room.playerIds) {
				const player = await ctx.db.get(playerId);
				if (player) {
					await ctx.db.patch(playerId, {
						score: player.score + 10,
					});
				}
			}
		}
		// Award 5 points to the doctor for creating a convincing answer
		if (doctorAnswer) {
			const doctorPlayer = await ctx.db.get(doctorAnswer.playerId);
			if (doctorPlayer) {
				await ctx.db.patch(doctorAnswer.playerId, {
					score: doctorPlayer.score + 5,
				});
			}
		}

		await ctx.db.patch(game._id, {
			selectedAnswer,
			gamePhase: "revealing",
		});
		return null;
	},
});

export const nextRound = mutation({
	args: { roomCode: v.string() },
	returns: v.null(),
	handler: async (ctx: MutationCtx, { roomCode }: { roomCode: string }) => {
		const room = await getRoomByCode(ctx, roomCode);
		const game = await ctx.db
			.query("games")
			.withIndex("by_room", (q: any) => q.eq("roomId", room._id))
			.first();
		if (!game) throw new Error("Game not started");

		if (game.currentRound >= game.totalRounds) {
			// End game, reset phase
			await ctx.db.patch(game._id, { gamePhase: "waiting" });
			return null;
		}

		const newPrompt = prompts[Math.floor(Math.random() * prompts.length)] ?? "";

		await ctx.db.patch(game._id, {
			gamePhase: "answering",
			currentRound: game.currentRound + 1,
			currentPrompt: newPrompt,
			selectedAnswer: undefined,
		});
		return null;
	},
});
