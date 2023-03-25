import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { planRouter } from "./Plan/plan";
import { wishRouter } from "./Wish/wish";
import { wishListRouter } from "./Wish/wishlist";
import { exampleRouter } from "./example";
import { scrapingRouter } from "./scraping";
import { settingsRouter } from "./settings";
import { shortLinkRouter } from "./short-link";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  plan: planRouter,
  wish: wishRouter,
  wishList: wishListRouter,
  example: exampleRouter,
  shortLink: shortLinkRouter,
  settings: settingsRouter,
  scraping: scrapingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
