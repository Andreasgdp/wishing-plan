import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { getProductInfo } from '../utils/scraping/scrapeMethodSelector';

export type ScrapingOutput = ReturnType<typeof getProductInfo> | undefined;

export const scrapingRouter = router({
	get: protectedProcedure
		.input(z.object({ url: z.string() }))
		.mutation(({ input }) => {
			return getProductInfo(input.url);
		}),
});
