import { TRPCError } from "@trpc/server";
import { Context } from "../context";

/**
 *
 * @param ctx The context
 * @param wishId The ID of the wish list
 */
export const assertIsWishCreator = async (ctx: Context, wishId: string) => {
  // Get the authenticated user's ID
  const userId = ctx.userId;

  // Get the wish list
  const wish = await ctx.prisma.wish.findFirst({
    where: { id: wishId },
  });
  if (!wish) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  // Verify that the authenticated user is the creator of the wish list
  if (wish.creatorId !== userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
};
