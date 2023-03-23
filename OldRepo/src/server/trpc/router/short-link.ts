import { z } from 'zod';
import { prisma } from '../../db/client';

import { publicProcedure, router } from '../trpc';

export const shortLinkRouter = router({
	slugCheck: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const count = await prisma.shortLink.count({
				where: {
					slug: input.slug,
				},
			});
			return { used: count > 0 };
		}),
	createSlug: publicProcedure
		.input(z.object({ slug: z.string(), url: z.string() }))
		.mutation(async ({ input }) => {
			try {
				await prisma.shortLink.create({
					data: {
						slug: input.slug,
						url: input.url,
					},
				});
			} catch (e) {
				console.log(e);
			}
		}),
});
