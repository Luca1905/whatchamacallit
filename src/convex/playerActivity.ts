import { v } from "convex/values";
import {
	type MutationCtx,
	type QueryCtx,
	mutation,
	query,
} from "./_generated/server";

/**
 * Helper to get the room document by its code.
 */
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

/**
 * Mutation to update the player's typing activity in a room.
 */
export const updatePlayerActivity = mutation({
	args: {
		roomCode: v.string(),
		isTyping: v.boolean(),
	},
	returns: v.null(),
	handler: async (
		ctx: MutationCtx,
		{ roomCode, isTyping }: { roomCode: string; isTyping: boolean },
	) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Not authenticated");
		}
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
		const timestamp = Date.now();
		const existing = await ctx.db
			.query("playerActivities")
			.withIndex("by_room_code", (q: any) => q.eq("roomCode", roomCode))
			.filter((q: any) => q.eq(q.field("playerId"), player._id))
			.first();
		if (existing) {
			await ctx.db.patch(existing._id, {
				isTyping,
				lastActivity: timestamp,
			});
		} else {
			await ctx.db.insert("playerActivities", {
				roomCode,
				playerId: player._id,
				playerName: player.username,
				isTyping,
				lastActivity: timestamp,
			});
		}
		return null;
	},
});

/**
 * Query to fetch the current typing activities for a room.
 */
export const getPlayerActivities = query({
	args: { roomCode: v.string() },
	returns: v.any(),
	handler: async (ctx: QueryCtx, { roomCode }: { roomCode: string }) => {
		const now = Date.now();
		const threshold = 5000; // 5 seconds
		const cutoff = now - threshold;
		return await ctx.db
			.query("playerActivities")
			.withIndex("by_room_code", (q: any) => q.eq("roomCode", roomCode))
			.filter((q: any) => q.eq(q.field("isTyping"), true))
			.filter((q: any) => q.gt(q.field("lastActivity"), cutoff))
			.collect();
	},
});
