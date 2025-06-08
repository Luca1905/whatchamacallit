import { v } from "convex/values";
import { type QueryCtx, mutation, query } from "./_generated/server";

export const getUsername = query({
	args: {},
	returns: v.string(),
	handler: async (ctx: any) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}
		return (await getPlayerByUserid(ctx, identity.tokenIdentifier)).username;
	},
});

export const getPlayer = query({
	args: {},
	returns: v.optional(v.any()),
	handler: async (ctx: any) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}
		try {
			return await getPlayerByUserid(ctx, identity.tokenIdentifier);
		} catch (e) {
			return undefined;
		}
	},
});

export const createPlayer = mutation({
	args: {
		username: v.string(),
	},
	returns: v.object({
		existing: v.boolean(),
		playerId: v.id("players"),
	}),
	handler: async (ctx: any, { username }: { username: string }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}

		const existingPlayer = await ctx.db
			.query("players")
			.withIndex("by_userId", (q: any) =>
				q.eq("userId", identity.tokenIdentifier),
			)
			.first();

		if (existingPlayer) {
			return { existing: true, playerId: existingPlayer._id };
		}

		const avatarColors = [
			"bg-red-500",
			"bg-blue-500",
			"bg-green-500",
			"bg-yellow-500",
			"bg-purple-500",
			"bg-pink-500",
			"bg-indigo-500",
			"bg-orange-500",
		];

		const playersArray = await ctx.db.query("players").collect();
		const avatar =
			avatarColors[playersArray.length % avatarColors.length] || "bg-gray-500";

		const playerId = await ctx.db.insert("players", {
			userId: identity.tokenIdentifier,
			username,
			score: 0,
			isDoctor: false,
			avatar,
		});

		return { existing: false, playerId: playerId };
	},
});

export async function getPlayerByUserid(ctx: QueryCtx, userId: string) {
	const player = await ctx.db
		.query("players")
		.withIndex("by_userId", (q: any) => q.eq("userId", userId))
		.first();
	if (!player) {
		throw new Error("User not a player");
	}
	return player;
}
