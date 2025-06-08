import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getPlayerByUserid } from "./user";

export const createRoom = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("User not authenticated");
		}
		const player = await getPlayerByUserid(ctx, identity.tokenIdentifier);

		const roomCode = Math.floor(1e5 + Math.random() * 9e4).toString();
		const roomId = await ctx.db.insert("rooms", {
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
	handler: async (ctx, { roomCode }) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Client is not authenticated");
		}
		const room = await ctx.db
			.query("rooms")
			.withIndex("by_room_code", (q) => q.eq("roomCode", roomCode))
			.first();
		if (!room) {
			throw new Error("Room not found");
		}
		const player = await getPlayerByUserid(ctx, userId);

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
	handler: async (ctx, { roomCode }) => {
		const room = await ctx.db
			.query("rooms")
			.withIndex("by_room_code", (q) => q.eq("roomCode", roomCode))
			.first();
		return room;
	},
});

export const listPlayersByRoom = query({
	args: { roomCode: v.string() },
	handler: async (ctx, { roomCode }) => {
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
