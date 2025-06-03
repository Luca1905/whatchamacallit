import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserLogo = query({
	args: {},
	handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!")
    }
    const user = await ctx.db.get(userId);
    return user?.image;
	},
});

export const getUsername = query({
  args: {
  },
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated")
    }
    const user = await ctx.db.get(userId);
    return user?.name;
  }
})
