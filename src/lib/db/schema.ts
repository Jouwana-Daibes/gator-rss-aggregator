import { pgTable,timestamp, uuid, text, unique, serial } from "drizzle-orm/pg-core";
import { users, feeds } from "./schema";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  name: text("name").notNull().unique(),
});


export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  name: text("name").notNull(),

  url: text("url").notNull().unique(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
})

export type Feed = typeof feeds.$inferSelect

export const feedFollows = pgTable(
  "feed_follows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueFollow: unique().on(table.userId, table.feedId),
  })
);

export const schema = {
  users,
  feeds,
  feedFollows,
};

