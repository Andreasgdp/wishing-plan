import { appRouter, createContext } from "@wishingplan/api";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
});

// If you need to enable cors, you can do so like shown here:
// https://github.com/clerkinc/t3-turbo-and-clerk/blob/2d3b6e38edae8bbb98edb8a084a3ec5daea481e7/apps/nextjs/src/pages/api/trpc/%5Btrpc%5D.ts#L10-L22
