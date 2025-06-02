import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLatest = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("posts").order("desc").first();
	},
});

export const create = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("posts", {
			name: args.name,
		});
	},
});
