import type { PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

describe("Example", () => {
  const prismaMock = mockDeep<PrismaClient>();
  it("should be true", () => {
    expect(true).toBe(true);
  });

  it("should return an example", async () => {
    prismaMock.example.findMany.mockResolvedValue([
      {
        id: "2",
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ]);
    const result = await prismaMock.example.findMany();
    expect(result).toEqual([
      {
        id: "2",
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ]);
  });
});
