import { prisma, PrismaClient } from "@wishingplan/db";
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/dist/api";
import { getAuth } from "@clerk/nextjs/server";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type AuthContextProps = CreateNextContextOptions & {
  auth: SignedInAuthObject | SignedOutAuthObject;
  prisma?: PrismaClient;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async (opts: AuthContextProps) => {
  return {
    auth: opts.auth,
    prisma: opts.prisma || prisma,
    req: opts.req,
    res: opts.res,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  return await createContextInner({
    auth: getAuth(opts.req),
    req: opts.req,
    res: opts.res,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
