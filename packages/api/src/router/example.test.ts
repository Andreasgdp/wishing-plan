import type { PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

describe("Example", () => {
  const prismaMock = mockDeep<PrismaClient>();
  it("should be true", () => {
    expect(true).toBe(true);
  });

  it("should return an example", async () => {
    const updatedDate = new Date();
    const createdDate = new Date();

    prismaMock.example.findMany.mockResolvedValue([
      {
        id: "2",
        updatedAt: updatedDate,
        createdAt: createdDate,
      },
    ]);
    const result = await prismaMock.example.findMany();
    expect(result).toEqual([
      {
        id: "2",
        updatedAt: updatedDate,
        createdAt: createdDate,
      },
    ]);
  });
});
