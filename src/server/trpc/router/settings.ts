import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const settingsRouter = router({
	get: protectedProcedure.query(({ ctx }) => {
		const userId = ctx.session?.user?.id;

		return ctx.prisma.userSettings.findFirst({
			where: { userId: userId },
		});
	}),
	getCurrency: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id;

		return (
			await ctx.prisma.userSettings.findFirst({
				where: { userId: userId },
			})
		)?.currency;
	}),
	updateCurrency: protectedProcedure
		.input(z.object({ currency: z.string() }))
		.mutation(({ input, ctx }) => {
			const userId = ctx.session?.user?.id;

			return ctx.prisma.userSettings.upsert({
				where: { userId: userId },
				update: { currency: input.currency },
				create: {
					userId: userId,
					currency: input.currency,
				},
			});
		}),
});
