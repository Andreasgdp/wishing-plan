import { connect } from "@planetscale/database";
import { PrismaClient } from "@prisma/client";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

export * from "@prisma/client";

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// create the connection
const connection = connect({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

export const drizzleDB = drizzle(connection, { schema });
export type DrizzleDB = typeof drizzleDB;

export * from "./schema";
