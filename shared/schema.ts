import {
  pgTable,
  serial,
  varchar,
  jsonb,
  timestamp,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Waitlist Table ---
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  fullName: varchar("full_name", { length: 256 }).notNull(),
  interests: jsonb("interests").$type<string[]>().notNull(),
  location: varchar("location", { length: 256 }).notNull(),
  profession: varchar("profession", { length: 256 }).notNull(),
});

// --- User Table ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Chat Rooms Table ---
export const chatRooms = pgTable("chatRooms", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  interests: jsonb("interests").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Messages Table ---
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Participants Table (Junction Table) ---
export const participants = pgTable(
  "participants",
  {
    id: serial("id").primaryKey(),
    roomId: integer("room_id").notNull(),
    userId: integer("user_id").notNull(),
  },
  (table) => {
    return {
      uniqueParticipant: uniqueIndex("unique_participant").on(
        table.userId,
        table.roomId
      ),
    };
  }
);


// ... (rest of the file is the same)

export const insertWaitlistSchema = createInsertSchema(waitlist);
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;