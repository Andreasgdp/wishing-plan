import {
	removePlacement,
	updatePlacement,
} from '@components/screens/Plan/planUtils';
import type { Wish } from '@prisma/client';
import type { Context } from '@server/trpc/context';
import { assertHasAccessToPlan } from '@server/trpc/utils/assertHasAccessToPlan';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { protectedProcedure, router } from '../../trpc';

export interface PlanWishType extends Wish {
	placement: number;
	sumOfMoney: number;
}

export const planRouter = router({
	get: protectedProcedure.query(({ ctx }) => {
		const userId = ctx.session?.user?.id;

		return ctx.prisma.plan.findFirst({ where: { userId: userId } });
	}),
	getWishes: protectedProcedure.query(async ({ ctx }) => {
		const planId = await getPlanIdFromSession(ctx);
		assertHasAccessToPlan(ctx, planId);

		return ctx.prisma.planWish
			.findMany({
				where: { planId: planId },
				orderBy: { placement: 'asc' },
				include: { wish: true },
			})
			.then((planWishes) => {
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
			});
	}),
	createAndAddWish: protectedProcedure
		.input(
			z.object({
				wishTitle: z.string(),
				wishDescription: z.string().nullish(),
				wishPrice: z.number(),
				wishUrl: z.string(),
				wishImageUrl: z.string().nullish(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const planId = await getPlanIdFromSession(ctx);
			assertHasAccessToPlan(ctx, planId);

			const userId = ctx.session?.user?.id;

			// check if wish already exists based on url
			const existingWish = await ctx.prisma.wish.findFirst({
				where: { url: input.wishUrl },
			});

			if (existingWish) {
				// check if wish is already in plan
				const existingPlanWish = await ctx.prisma.planWish.findFirst({
					where: { planId: planId, wishId: existingWish.id },
				});

				if (existingPlanWish) {
					throw new TRPCError({
						code: 'CONFLICT',
						message: 'Wish already exists in plan',
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
				orderBy: { placement: 'desc' },
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
			const planId = await getPlanIdFromSession(ctx);

			assertHasAccessToPlan(ctx, planId);

			const planWish = await ctx.prisma.planWish.findFirst({
				where: { planId: planId, wishId: input.wishId },
			});

			if (!planWish) {
				throw new TRPCError({ code: 'NOT_FOUND' });
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
				wishId: z.string(),
				oldIndex: z.number(),
				newIndex: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const planId = await getPlanIdFromSession(ctx);

			assertHasAccessToPlan(ctx, planId);

			const planWish = await ctx.prisma.planWish.findFirst({
				where: { planId: planId, wishId: input.wishId },
			});

			if (!planWish) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}

			const planWishes = await ctx.prisma.planWish.findMany({
				where: { planId: planId },
				orderBy: { placement: 'asc' },
			});

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

		.input(
			z.object({
				wishId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const planId = await getPlanIdFromSession(ctx);

			assertHasAccessToPlan(ctx, planId);

			const planWish = await ctx.prisma.planWish.findFirst({
				where: { planId: planId, wishId: input.wishId },
			});

			if (!planWish) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}

			const planWishes = await ctx.prisma.planWish.findMany({
				where: { planId: planId },
				orderBy: { placement: 'asc' },
			});

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
				amountToSave: z.number(),
				currentAmountSaved: z.number(),
				firstSaving: z.date(),
				frequency: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const planId = await getPlanIdFromSession(ctx);

			assertHasAccessToPlan(ctx, planId);
			const userId = ctx.session?.user?.id;

			return ctx.prisma.plan.update({
				where: { userId: userId },
				data: {
					amountToSave: input.amountToSave,
					currentAmountSaved: input.currentAmountSaved,
					firstSaving: input.firstSaving,
					frequency: input.frequency,
				},
			});
		}),
});

async function getPlanIdFromSession(ctx: Context) {
	const userId = ctx.session?.user?.id;
	if (!userId) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	// get planId from userId
	const planId = (
		await ctx.prisma.plan.findFirst({
			where: { userId: userId },
			select: { id: true },
		})
	)?.id;

	if (!planId || planId === undefined) {
		throw new TRPCError({ code: 'NOT_FOUND' });
	}

	return planId;
}
