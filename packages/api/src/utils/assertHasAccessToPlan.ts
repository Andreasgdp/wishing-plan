import type { Plan, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Context } from "../context";

/**
 *
 * @param ctx The context
 * @param planId The ID of the wish list
 */
export const assertHasAccessToPlan = async (ctx: Context, planId: string) => {
  // Get the authenticated user's ID
  const userId = ctx.userId;

  if (!userId) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  const planPromise = ctx.prisma.plan.findFirst({
    where: { id: planId },
  });

  const plan = await planPromise;

  if (!plan) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  const sharedWith = await planPromise.sharedWith();

  checkAuthority(plan, userId, sharedWith);
};

function checkAuthority(plan: Plan, userId: string, sharedWith: User[] | null) {
  const isPlanOwner = plan.mainUserId === userId || plan.userId === userId;
  const isSharedWith = sharedWith?.map((user) => user.id).includes(userId);

  if (!isPlanOwner && !isSharedWith) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
}
