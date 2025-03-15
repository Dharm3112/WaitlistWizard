import { pgTable, text, serial, type PgArray } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  interests: text("interests").array().notNull(),
  location: text("location").notNull(),
  profession: text("profession").notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  email: true,
  fullName: true,
  interests: true,
  location: true,
  profession: true,
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;