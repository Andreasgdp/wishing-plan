import { assertIsWishListCreator } from '@server/trpc/utils/assertIsWishListCreator';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { protectedProcedure, router } from '../../trpc';

export const wishListRouter = router({
	getAll: protectedProcedure.query(({ ctx }) => {
		const userId = ctx.session?.user?.id;

		return ctx.prisma.wishList.findMany({
			where: { creatorId: userId },
		});
	}),
	getById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input, ctx }) => {
			await assertIsWishListCreator(ctx, input.id);
			return ctx.prisma.wishList.findFirst({ where: { id: input.id } });
		}),
	getWishes: protectedProcedure
		.input(z.object({ id: z.string().nullish() }))
		.query(async ({ input, ctx }) => {
			if (!input.id) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}
			await assertIsWishListCreator(ctx, input.id);

			return ctx.prisma.wish.findMany({
				where: { wishListId: input.id },
			});
		}),
	moveWishToWishList: protectedProcedure
		.input(
			z.object({
				wishId: z.string(),
				fromWishListId: z.string(),
				toWishListId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			await assertIsWishListCreator(ctx, input.fromWishListId);
			await assertIsWishListCreator(ctx, input.toWishListId);

			return ctx.prisma.wish.update({
				where: { id: input.wishId },
				data: {
					wishList: {
						connect: { id: input.toWishListId },
					},
				},
			});
		}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				description: z.string(),
			}),
		)
		.mutation(({ input, ctx }) => {
			const userId = ctx.session?.user?.id;

			return ctx.prisma.wishList.create({
				data: {
					creator: {
						connect: { id: userId },
					},
					name: input.name,
					description: input.description,
				},
			});
		}),
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
				description: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			await assertIsWishListCreator(ctx, input.id);
			return ctx.prisma.wishList.update({
				where: { id: input.id },
				data: {
					name: input.name,
					description: input.description,
				},
			});
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			await assertIsWishListCreator(ctx, input.id);
			return ctx.prisma.wishList.delete({ where: { id: input.id } });
		}),
});
