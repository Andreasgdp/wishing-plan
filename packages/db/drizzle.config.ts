import type { Config } from "drizzle-kit";

export default {
    schema: "./schema.ts",
    out: "./drizzle",
    connectionString: "mysql://db_user:db_user_pass@localhost:6033/app_db",
} satisfies Config;
