import { TRPCError } from "@trpc/server";
import { Context } from "../context";

/**
 *
 * @param ctx The context
 * @param wishListId The ID of the wish list
 */
export const assertIsWishListCreator = async (
  ctx: Context,
  wishListId: string,
) => {
  // Get the authenticated user's ID
  const userId = ctx.auth.userId;

  // Get the wish list
  const wishList = await ctx.prisma.wishList.findFirst({
    where: { id: wishListId },
  });
  if (!wishList) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  // Verify that the authenticated user is the creator of the wish list
  if (wishList.creatorId !== userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
};
