import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/dist/api";
import type { Example, PrismaClient } from "@prisma/client";
import type { inferProcedureInput } from "@trpc/server";
import { mockDeep } from "jest-mock-extended";
import { appRouter, AppRouter } from ".";
import { createContextInner } from "../context";

describe("example", () => {
  const prismaMock = mockDeep<PrismaClient>();
  const signedInMock = mockDeep<SignedInAuthObject>();
  const signedOutMock = mockDeep<SignedOutAuthObject>();
  let caller: ReturnType<AppRouter["createCaller"]>;

  describe("example without session", () => {
    beforeAll(async () => {
      caller = appRouter.createCaller(
        await createContextInner({ auth: signedOutMock, prisma: prismaMock }),
      );
    });

    test("hello test", async () => {
      const caller = appRouter.createCaller(
        await createContextInner({ auth: signedOutMock }),
      );

      type Input = inferProcedureInput<AppRouter["example"]["hello"]>;

      const input: Input = {
        text: "test",
      };

      const result = await caller.example.hello(input);

      expect(result).toStrictEqual({ greeting: "Hello test" });
    });

    test("getAll test", async () => {
      const prismaMock = mockDeep<PrismaClient>();

      const mockOutput: Example[] = [
        {
          id: "test-user-id",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.example.findMany.mockResolvedValue(mockOutput);

      const caller = appRouter.createCaller(
        await createContextInner({ auth: signedOutMock, prisma: prismaMock }),
      );

      const result = await caller.example.getAll();

      expect(result).toHaveLength(mockOutput.length);
      expect(result).toStrictEqual(mockOutput);
    });
  });

  describe("example with session", () => {
    beforeAll(async () => {
      caller = appRouter.createCaller(
        await createContextInner({ auth: signedInMock, prisma: prismaMock }),
      );
    });

    test("getSecretMessage test", async () => {
      const result = await caller.example.getSecretMessage();

      expect(result).toBe("you can now see this secret message!");
    });
  });
});
