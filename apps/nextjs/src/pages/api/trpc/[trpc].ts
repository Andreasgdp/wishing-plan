import { appRouter, createContext } from "@wishingplan/api";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// export API handler
export default createNextApiHandler({
	router: appRouter,
	createContext,
	responseMeta({ ctx, paths, type, errors }) {
		// checking that no procedures errored
		const allOk = errors.length === 0;
		// checking we're doing a query request
		const isQuery = type === 'query';
		if (ctx?.res && allOk && isQuery) {
			// cache request for 1 day + revalidate once every second
			const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
			return {
				headers: {
					'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
				},
			};
		}
		return {};
	},
});

// If you need to enable cors, you can do so like shown here:
// https://github.com/clerkinc/t3-turbo-and-clerk/blob/2d3b6e38edae8bbb98edb8a084a3ec5daea481e7/apps/nextjs/src/pages/api/trpc/%5Btrpc%5D.ts#L10-L22
