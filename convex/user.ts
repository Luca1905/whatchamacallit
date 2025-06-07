import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUsername = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (userId === null) {
			throw new Error("Client is not authenticated");
		}
		const user = await ctx.db.get(userId);
		return user?.name;
	},
});

export const setUsername = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, { name }) => {
		const userId = await getAuthUserId(ctx);
		if (userId === null) {
			throw new Error("Client is not authenticated");
		}
		await ctx.db.patch(userId, { name });
		return true;
	},
});
