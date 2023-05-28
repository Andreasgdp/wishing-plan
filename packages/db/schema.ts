import {
  datetime,
  index,
  int,
  mysqlTable,
  primaryKey,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const example = mysqlTable("Example", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
    .default("CURRENT_TIMESTAMP(3)")
    .notNull(),
  updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
});

export const plan = mysqlTable(
  "Plan",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default("CURRENT_TIMESTAMP(3)")
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    name: varchar("name", { length: 191 }),
    description: varchar("description", { length: 191 }),
    currentAmountSaved: int("currentAmountSaved").notNull(),
    amountToSave: int("amountToSave").notNull(),
    firstSaving: datetime("firstSaving", { mode: "string", fsp: 3 }).notNull(),
    frequency: varchar("frequency", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }),
    mainUserId: varchar("mainUserId", { length: 191 }),
  },
  (table) => {
    return {
      mainUserIdKey: uniqueIndex("Plan_mainUserId_key").on(table.mainUserId),
      userIdIdx: index("Plan_userId_idx").on(table.userId),
    };
  },
);

export const planWishBridge = mysqlTable(
  "PlanWishBridge",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    planId: varchar("planId", { length: 191 }).notNull(),
    wishId: varchar("wishId", { length: 191 }).notNull(),
    placement: int("placement").notNull(),
  },
  (table) => {
    return {
      planIdIdx: index("PlanWishBridge_planId_idx").on(table.planId),
      wishIdIdx: index("PlanWishBridge_wishId_idx").on(table.wishId),
    };
  },
);

export const post = mysqlTable("Post", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  title: varchar("title", { length: 191 }).notNull(),
  content: varchar("content", { length: 191 }).notNull(),
});

export const shortLink = mysqlTable(
  "ShortLink",
  {
    id: int("id").autoincrement().primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default("CURRENT_TIMESTAMP(3)")
      .notNull(),
    url: varchar("url", { length: 2000 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      slugKey: uniqueIndex("ShortLink_slug_key").on(table.slug),
      slugIdx: index("ShortLink_slug_idx").on(table.slug),
    };
  },
);

export const user = mysqlTable("User", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
});

export const userSettings = mysqlTable(
  "UserSettings",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default("CURRENT_TIMESTAMP(3)")
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    currency: varchar("currency", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      userIdKey: uniqueIndex("UserSettings_userId_key").on(table.userId),
      userIdIdx: index("UserSettings_userId_idx").on(table.userId),
    };
  },
);

export const wish = mysqlTable(
  "Wish",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default("CURRENT_TIMESTAMP(3)")
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    title: varchar("title", { length: 191 }).notNull(),
    description: varchar("description", { length: 191 }),
    price: int("price").notNull(),
    url: varchar("url", { length: 191 }).notNull(),
    imageUrl: varchar("imageUrl", { length: 191 }),
    creatorId: varchar("creatorId", { length: 191 }).notNull(),
    wishListId: varchar("wishListId", { length: 191 }),
    planId: varchar("planId", { length: 191 }),
  },
  (table) => {
    return {
      creatorIdIdx: index("Wish_creatorId_idx").on(table.creatorId),
      wishListIdIdx: index("Wish_wishListId_idx").on(table.wishListId),
      planIdIdx: index("Wish_planId_idx").on(table.planId),
    };
  },
);

export const wishList = mysqlTable(
  "WishList",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default("CURRENT_TIMESTAMP(3)")
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    creatorId: varchar("creatorId", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    description: varchar("description", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      creatorIdIdx: index("WishList_creatorId_idx").on(table.creatorId),
    };
  },
);

export const sharedPlans = mysqlTable(
  "_SharedPlans",
  {
    a: varchar("A", { length: 191 }).notNull(),
    b: varchar("B", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_SharedPlans_AB_unique").on(table.a, table.b),
      bIdx: index("b_idx").on(table.b),
      sharedPlansAB: primaryKey(table.a, table.b),
    };
  },
);

export const sharedWishLists = mysqlTable(
  "_SharedWishLists",
  {
    a: varchar("A", { length: 191 }).notNull(),
    b: varchar("B", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_SharedWishLists_AB_unique").on(table.a, table.b),
      bIdx: index("b_idx").on(table.b),
      sharedWishListsAB: primaryKey(table.a, table.b),
    };
  },
);
