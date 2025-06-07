import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const createRoom = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Client is not authenticated");
    }
    const roomId = await ctx.db.insert("rooms", {
      hostId: userId,
      playerIds: [userId],
    });
    return roomId;
  },
});

export const joinRoom = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, { roomId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Client is not authenticated");
    }
    const room = await ctx.db.get(roomId);
    if (!room) {
      throw new Error("Room not found");
    }
    if (!room.playerIds.includes(userId)) {
      await ctx.db.patch(roomId, {
        playerIds: [...room.playerIds, userId],
      });
    }
    return true;
  },
});

export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const room = await ctx.db.get(roomId);
    return room;
  },
}); 