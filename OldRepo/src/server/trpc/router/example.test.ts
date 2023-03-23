import type { Example, PrismaClient } from '@prisma/client';
import { createContextInner } from '@server/trpc/context';
import type { inferProcedureInput } from '@trpc/server';
import { mockDeep } from 'jest-mock-extended';
import type { Session } from 'next-auth';
import type { AppRouter } from './_app';
import { appRouter } from './_app';

describe('example', () => {
	const prismaMock = mockDeep<PrismaClient>();
	let sessionMock: Session;
	let caller: ReturnType<AppRouter['createCaller']>;

	describe('example without session', () => {
		beforeAll(async () => {
			caller = appRouter.createCaller(
				createContextInner({ session: null, prisma: prismaMock }),
			);
		});

		test('hello test', async () => {
			const caller = appRouter.createCaller(
				createContextInner({ session: null }),
			);

			type Input = inferProcedureInput<AppRouter['example']['hello']>;

			const input: Input = {
				text: 'test',
			};

			const result = await caller.example.hello(input);

			expect(result).toStrictEqual({ greeting: 'Hello test' });
		});

		test('getAll test', async () => {
			const prismaMock = mockDeep<PrismaClient>();

			const mockOutput: Example[] = [
				{
					id: 'test-user-id',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			prismaMock.example.findMany.mockResolvedValue(mockOutput);

			const caller = appRouter.createCaller(
				createContextInner({ session: null, prisma: prismaMock }),
			);

			const result = await caller.example.getAll();

			expect(result).toHaveLength(mockOutput.length);
			expect(result).toStrictEqual(mockOutput);
		});
	});

	describe('example with session', () => {
		beforeAll(async () => {
			sessionMock = {
				expires: new Date().toISOString(),
				user: { id: 'test-user-id', name: 'Test User' },
			};

			caller = appRouter.createCaller(
				createContextInner({ session: sessionMock, prisma: prismaMock }),
			);
		});

		test('getSecretMessage test', async () => {
			const result = await caller.example.getSecretMessage();

			expect(result).toBe('you can now see this secret message!');
		});
	});
});
