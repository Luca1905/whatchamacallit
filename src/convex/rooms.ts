import { v } from "convex/values";
import {
	type MutationCtx,
	type QueryCtx,
	mutation,
	query,
} from "./_generated/server";
import { getPlayerByUserid } from "./user";

export const createRoom = mutation({
	args: {},
	returns: v.string(),
	handler: async (ctx: MutationCtx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("User not authenticated");
		}
		const player = await getPlayerByUserid(ctx, identity.tokenIdentifier);

		const roomCode = Math.floor(1e5 + Math.random() * 9e4).toString();
		await ctx.db.insert("rooms", {
			hostId: player._id,
			playerIds: [player._id],
			roomCode,
		});
		return roomCode;
	},
});

export const joinRoom = mutation({
	args: {
		roomCode: v.string(),
	},
	returns: v.boolean(),
	handler: async (ctx: MutationCtx, { roomCode }: { roomCode: string }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("User not authenticated");
		}
		const room = await ctx.db
			.query("rooms")
			.withIndex("by_room_code", (q) => q.eq("roomCode", roomCode))
			.first();
		if (!room) {
			throw new Error("Room not found");
		}
		const player = await getPlayerByUserid(ctx, identity.tokenIdentifier);

		if (!room.playerIds.includes(player._id)) {
			await ctx.db.patch(room._id, {
				playerIds: [...room.playerIds, player._id],
			});
		}
		return true;
	},
});

export const getRoom = query({
	args: { roomCode: v.string() },
	handler: async (ctx: QueryCtx, { roomCode }: { roomCode: string }) => {
		const room = await ctx.db
			.query("rooms")
			.withIndex("by_room_code", (q) => q.eq("roomCode", roomCode))
			.first();
		return room;
	},
});

export const listPlayersByRoom = query({
	args: { roomCode: v.string() },
	returns: v.array(v.any()),
	handler: async (ctx: QueryCtx, { roomCode }: { roomCode: string }) => {
		const room = await ctx.db
			.query("rooms")
			.withIndex("by_room_code", (q) => q.eq("roomCode", roomCode))
			.first();
		if (!room) {
			throw new Error("Room not found");
		}
		const players = [];
		for await (const player of ctx.db.query("players")) {
			if (room.playerIds.includes(player._id)) {
				players.push(player);
			}
		}
		return players;
	},
});

export const playerIsHost = query({
	args: { roomCode: v.string() },
	handler: async (ctx: QueryCtx, { roomCode }: { roomCode: string }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("User not authenticated");
		}
		const player = await getPlayerByUserid(ctx, identity.tokenIdentifier);
		const room = await ctx.db
			.query("rooms")
			.withIndex("by_room_code", (q) => q.eq("roomCode", roomCode))
			.first();
		return room?.hostId === player._id;
	},
});
