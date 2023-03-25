import type { Plan, PlanWish, Prisma, Wish } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Context } from "../../context";
import {
  removePlacement,
  SavingsFrequency,
  updatePlacement,
} from "./planUtils";

import { protectedProcedure, router } from "../../trpc";
import { assertHasAccessToPlan } from "../../utils/assertHasAccessToPlan";

export interface PlanWishType extends Wish {
  placement: number;
  sumOfMoney: number;
}

export const planRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        planId: z.string().nullish(),
      }),
    )
    .query(({ input, ctx }) => {
      if (!input.planId) {
        return getMainPlan(ctx);
      } else {
        return getPlan(ctx, input.planId);
      }
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;

    const plans = await ctx.prisma.plan.findMany({
      where: {
        OR: [
          {
            userId,
            mainUser: null,
          },
          {
            sharedWith: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
    });

    return plans;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.userId;

      const plan = await ctx.prisma.plan.create({
        data: {
          user: {
            connect: { id: userId },
          },
          name: input.name,
          description: input.description,
          amountToSave: 0,
          currentAmountSaved: 0,
          firstSaving: new Date(),
          frequency: SavingsFrequency.SOM,
        },
      });

      return plan;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        name: z.string(),
        description: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const planId = input.planId;
      await assertHasAccessToPlan(ctx, planId);

      const plan = await ctx.prisma.plan.update({
        where: { id: planId },
        data: {
          name: input.name,
          description: input.description,
        },
      });

      return plan;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const planId = input.planId;
      await assertHasAccessToPlan(ctx, planId);

      const plan = await ctx.prisma.plan.delete({
        where: { id: planId },
      });

      return plan;
    }),
  createAndAddWish: protectedProcedure
    .input(
      z.object({
        planId: z.string().nullish(),
        wishTitle: z.string(),
        wishDescription: z.string().nullish(),
        wishPrice: z.number(),
        wishUrl: z.string(),
        wishImageUrl: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const planId = input.planId ?? (await getPlanIdFromSession(ctx));
      await assertHasAccessToPlan(ctx, planId);

      const userId = ctx.auth.userId;

      // check if wish already exists based on url
      const existingWish = await ctx.prisma.wish.findFirst({
        where: { url: input.wishUrl },
      });

      if (existingWish && input.wishUrl) {
        // check if wish is already in plan
        const existingPlanWish = await ctx.prisma.planWish.findFirst({
          where: { planId: planId, wishId: existingWish.id },
        });

        if (existingPlanWish) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Wish already exists in plan",
          });
        }
      }

      const wish = await ctx.prisma.wish.create({
        data: {
          creator: {
            connect: { id: userId },
          },
          title: input.wishTitle,
          description: input.wishDescription,
          price: input.wishPrice,
          url: input.wishUrl,
          imageUrl: input.wishImageUrl,
        },
      });

      const largestPlacementWish = await ctx.prisma.planWish.findFirst({
        where: { planId: planId },
        orderBy: { placement: "desc" },
      });

      const newPlacement = (largestPlacementWish?.placement ?? 0) + 1;

      const bridge = await ctx.prisma.planWish.create({
        data: {
          plan: {
            connect: { id: planId },
          },
          wish: {
            connect: { id: wish.id },
          },
          placement: newPlacement,
        },
      });

      return { wish, bridge };
    }),
  editWish: protectedProcedure
    .input(
      z.object({
        planId: z.string().nullish(),
        wishId: z.string(),
        wishTitle: z.string(),
        wishDescription: z.string().nullish(),
        wishPrice: z.number(),
        wishUrl: z.string(),
        wishImageUrl: z.string().nullish(),
        placement: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const planId = input.planId ?? (await getPlanIdFromSession(ctx));

      await assertHasAccessToPlan(ctx, planId);

      const planWish = await ctx.prisma.planWish.findFirst({
        where: { planId: planId, wishId: input.wishId },
      });

      if (!planWish) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const wish = await ctx.prisma.wish.update({
        where: { id: input.wishId },
        data: {
          title: input.wishTitle,
          description: input.wishDescription,
          price: input.wishPrice,
          url: input.wishUrl,
          imageUrl: input.wishImageUrl,
        },
      });

      const bridge = await ctx.prisma.planWish.update({
        where: { id: planWish.id },
        data: {
          placement: input.placement,
        },
      });

      return { wish, bridge };
    }),
  relocateWish: protectedProcedure
    .input(
      z.object({
        planId: z.string().nullish(),
        wishId: z.string(),
        oldIndex: z.number(),
        newIndex: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const planId = input.planId ?? (await getPlanIdFromSession(ctx));
      await assertHasAccessToPlan(ctx, planId);

      const { planWishes } = await getPlanWishes(ctx, planId, input.wishId);

      const newPlanWishes = updatePlacement(
        planWishes,
        input.oldIndex,
        input.newIndex,
      );

      return await Promise.all(
        newPlanWishes.map((planWish) => {
          return ctx.prisma.planWish.update({
            where: { id: planWish.id },
            data: { placement: planWish.placement },
          });
        }),
      );
    }),
  deleteWish: protectedProcedure

    .input(z.object({ planId: z.string().nullish(), wishId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const planId = input.planId ?? (await getPlanIdFromSession(ctx));

      await assertHasAccessToPlan(ctx, planId);

      const { planWishes, planWish } = await getPlanWishes(
        ctx,
        planId,
        input.wishId,
      );

      const newPlanWishes = removePlacement(planWishes, planWish.placement);

      await Promise.all(
        newPlanWishes.map((planWish) => {
          return ctx.prisma.planWish.update({
            where: { id: planWish.id },
            data: { placement: planWish.placement },
          });
        }),
      );

      await ctx.prisma.planWish.delete({
        where: { id: planWish.id },
      });

      return await ctx.prisma.wish.delete({
        where: { id: input.wishId },
      });
    }),

  updatePlan: protectedProcedure
    .input(
      z.object({
        planId: z.string().nullish(),
        amountToSave: z.number(),
        currentAmountSaved: z.number(),
        firstSaving: z.date(),
        frequency: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const planId = input.planId ?? (await getPlanIdFromSession(ctx));

      await assertHasAccessToPlan(ctx, planId);

      return ctx.prisma.plan.update({
        where: { id: planId },
        data: {
          amountToSave: input.amountToSave,
          currentAmountSaved: input.currentAmountSaved,
          firstSaving: input.firstSaving,
          frequency: input.frequency,
        },
      });
    }),
  sharePlan: protectedProcedure
    .input(
      z.object({
        planId: z.string().nullish(),
        emails: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const planId = input.planId ?? (await getPlanIdFromSession(ctx));

      await assertHasAccessToPlan(ctx, planId);

      const plan = ctx.prisma.plan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const users = await ctx.prisma.user.findMany({
        where: { email: { in: input.emails } },
      });

      const sharedWith = await plan.sharedWith();

      if (!sharedWith) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const newSharedWith = users.filter(
        (user) => !sharedWith.find((shared) => shared.id === user.id),
      );

      return await ctx.prisma.plan.update({
        where: { id: planId },
        data: {
          sharedWith: {
            connect: newSharedWith.map((user) => ({ id: user.id })),
          },
        },
      });
    }),
});

async function getPlanWishes(ctx: Context, planId: string, wishId: string) {
  const planWish = await ctx.prisma.planWish.findFirst({
    where: { planId: planId, wishId },
  });

  if (!planWish) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  const planWishes = await ctx.prisma.planWish.findMany({
    where: { planId: planId },
    orderBy: { placement: "asc" },
  });
  return { planWish, planWishes };
}

async function getMainPlan(ctx: Context) {
  const userId = ctx.auth.userId;

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const planPromise = ctx.prisma.user
    .findUnique({ where: { id: userId } })
    .mainPlan();

  return modifyPlan(planPromise, ctx);
}

async function getPlan(ctx: Context, planId: string) {
  const planPromise = ctx.prisma.plan.findUnique({
    where: { id: planId },
  });

  return modifyPlan(planPromise, ctx);
}

async function modifyPlan(
  planPromise: Prisma.Prisma__PlanClient<Plan | null, null>,
  ctx: Context,
) {
  const sharedWith = await planPromise.sharedWith();
  let owner = await planPromise.mainUser();
  if (!owner) {
    owner = await planPromise.user();
  }

  const plan = await planPromise;
  if (!plan) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Plan not found",
    });
  }

  // get wishes
  return ctx.prisma.planWish
    .findMany({
      where: { planId: plan.id },
      orderBy: { placement: "asc" },
      include: { wish: true },
    })
    .then((planWishes) => {
      return appendPlacementAndSumOfMoney(planWishes);
    })
    .then((wishes) => {
      return {
        plan: { ...plan },
        sharedWith: sharedWith ?? [],
        owner: owner ?? null,
        wishes,
      };
    });
}

function appendPlacementAndSumOfMoney(
  planWishes: (PlanWish & { wish: Wish })[],
) {
  let currentSum = 0;
  return planWishes.map((planWish) => {
    const wishSum = currentSum + planWish.wish.price;
    currentSum = wishSum;
    return {
      ...planWish.wish,
      placement: planWish.placement,
      sumOfMoney: wishSum,
    };
  });
}

async function getPlanIdFromSession(ctx: Context) {
  const userId = ctx.auth.userId;

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // get planId from userId
  const planId = (
    await ctx.prisma.user.findUnique({ where: { id: userId } }).mainPlan()
  )?.id;

  if (!planId || planId === undefined) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  return planId;
}
