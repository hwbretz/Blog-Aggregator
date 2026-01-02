import { pgTable, timestamp, uuid, text, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export type User = typeof users.$inferSelect; // feeds is the table object in schema.ts

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
  url: text("url").notNull().unique(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade'}),
  last_fetched_at: timestamp("last_fetched_at"),
});

export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts 

export const feed_follows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade'}),
  feed_id: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: 'cascade'}),
},
(table) => {
  return {
    feedFollowsUnique: uniqueIndex("unique_feed_user_combo").on(table.user_id,table.feed_id),
  }
}
);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  title: text("title"),
  url: text("url").notNull().unique(),
  description: text("description"),
  published_at: timestamp("published_at"),
  feed_id: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: 'cascade'}),
});