import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

export async function getPlayerByUserid(
  ctx: QueryCtx,
  userId: Id<"users">,
) {
  const player = await ctx.db
    .query("players")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
  if (!player) {
    throw new Error("User not a player");
  }
  return player;
}
