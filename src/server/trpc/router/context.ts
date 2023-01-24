// src/server/router/context.ts
import { prisma } from '@server/db/client';
import type * as trpc from '@trpc/server';
import type * as trpcNext from '@trpc/server/adapters/next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';

export const createContext = async (
	opts?: trpcNext.CreateNextContextOptions,
) => {
	const req = opts?.req;
	const res = opts?.res;

	const session =
		req && res && (await unstable_getServerSession(req, res, authOptions));

	return {
		session,
		prisma,
	};
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
