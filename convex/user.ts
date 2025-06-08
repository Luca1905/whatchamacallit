import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { type QueryCtx, mutation, query } from "./_generated/server";

export const getUsername = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}
		return identity?.name;
	},
});

export const createPlayer = mutation({
	args: {
		username: v.string(),
	},
	handler: async (ctx, { username }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}

		const existingPlayer = await ctx.db
			.query("players")
			.withIndex("by_userId", (q) => q.eq("userId", identity.tokenIdentifier))
			.first();

		if (existingPlayer) {
			return existingPlayer._id;
		}

		const playerId = await ctx.db.insert("players", {
			userId: identity.tokenIdentifier,
			username,
			score: 0,
			isDoctor: false,
		});

		return playerId;
	},
});

export async function getPlayerByUserid(ctx: QueryCtx, userId: string) {
	const player = await ctx.db
		.query("players")
		.withIndex("by_userId", (q) => q.eq("userId", userId))
		.first();
	if (!player) {
		throw new Error("User not a player");
	}
	return player;
}
