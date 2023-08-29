import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@wishingplan/api/src/router";
import { prisma } from "@wishingplan/db";
import superjson from "superjson";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });
