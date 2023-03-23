import { assertIsWishCreator } from '@server/trpc/utils/assertIsWishCreator';
import { z } from 'zod';

import { protectedProcedure, router } from '../../trpc';

export const wishRouter = router({
	getAll: protectedProcedure.query(({ ctx }) => {
		const userId = ctx.session?.user?.id;

		return ctx.prisma.wish.findMany({
			where: { creatorId: userId },
		});
	}),
	getById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input, ctx }) => {
			await assertIsWishCreator(ctx, input.id);

			return ctx.prisma.wish.findFirst({ where: { id: input.id } });
		}),
	create: protectedProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string().nullish(),
				price: z.number(),
				url: z.string(),
				imageUrl: z.string().nullish(),
				wishListId: z.string(),
			}),
		)
		.mutation(({ input, ctx }) => {
			const userId = ctx.session?.user?.id;

			return ctx.prisma.wish.create({
				data: {
					creator: {
						connect: { id: userId },
					},
					title: input.title,
					description: input.description,
					price: input.price,
					url: input.url,
					imageUrl: input.imageUrl,
					wishList: {
						connect: { id: input.wishListId },
					},
				},
			});
		}),
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string(),
				description: z.string().nullish(),
				price: z.number(),
				url: z.string(),
				imageUrl: z.string().nullish(),
				wishListId: z.string().nullish(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!input.wishListId) {
				throw new Error('wishListId is required');
			}

			await assertIsWishCreator(ctx, input.id);

			return ctx.prisma.wish.update({
				where: { id: input.id },
				data: {
					title: input.title,
					description: input.description,
					price: input.price,
					url: input.url,
					imageUrl: input.imageUrl,
					wishList: {
						connect: { id: input.wishListId },
					},
				},
			});
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			await assertIsWishCreator(ctx, input.id);

			return ctx.prisma.wish.delete({ where: { id: input.id } });
		}),
});
