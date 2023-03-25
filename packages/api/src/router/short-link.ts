import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const shortLinkRouter = router({
  slugCheck: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const count = await ctx.prisma.shortLink.count({
        where: {
          slug: input.slug,
        },
      });
      return { used: count > 0 };
    }),
  createSlug: publicProcedure
    .input(z.object({ slug: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.shortLink.create({
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
