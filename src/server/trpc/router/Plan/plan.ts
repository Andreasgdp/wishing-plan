import {
	removePlacement,
	SavingsFrequency,
	updatePlacement,
} from '@components/screens/Plan/planUtils';
import type { Plan, PlanWish, Wish } from '@prisma/client';
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
		const userId = ctx.session?.user?.id;

		// get all plans where not main plan
		const plans = await ctx.prisma.plan.findMany({
			where: {
				userId,
				mainUser: null,
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
			const userId = ctx.session?.user?.id;

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
				planId: z.string().nullish(),
				wishId: z.string(),
				oldIndex: z.number(),
				newIndex: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const planId = input.planId ?? (await getPlanIdFromSession(ctx));
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

		.input(z.object({ planId: z.string().nullish(), wishId: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const planId = input.planId ?? (await getPlanIdFromSession(ctx));

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
				planId: z.string().nullish(),
				amountToSave: z.number(),
				currentAmountSaved: z.number(),
				firstSaving: z.date(),
				frequency: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const planId = input.planId ?? (await getPlanIdFromSession(ctx));

			assertHasAccessToPlan(ctx, planId);

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
});

function getMainPlan(ctx: Context) {
	const userId = ctx.session?.user?.id;

	return ctx.prisma.user
		.findUnique({ where: { id: userId } })
		.mainPlan()
		.then((plan) => {
			return modifyPlan(plan, ctx);
		});
}

function getPlan(ctx: Context, planId: string) {
	return ctx.prisma.plan.findUnique({ where: { id: planId } }).then((plan) => {
		return modifyPlan(plan, ctx);
	});
}

function modifyPlan(plan: Plan | null, ctx: Context) {
	if (!plan) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'Plan not found',
		});
	}

	// get wishes
	return ctx.prisma.planWish
		.findMany({
			where: { planId: plan.id },
			orderBy: { placement: 'asc' },
			include: { wish: true },
		})
		.then((planWishes) => {
			return appendPlacementAndSumOfMoney(planWishes);
		})
		.then((wishes) => {
			return {
				plan: { ...plan },
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
	const userId = ctx.session?.user?.id;
	if (!userId) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	// get planId from userId
	const planId = (
		await ctx.prisma.user.findUnique({ where: { id: userId } }).mainPlan()
	)?.id;

	if (!planId || planId === undefined) {
		throw new TRPCError({ code: 'NOT_FOUND' });
	}

	return planId;
}
