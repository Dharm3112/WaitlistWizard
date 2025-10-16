import {
  pgTable, // Changed from mysqlTable
  serial,
  varchar,
  jsonb, // Changed from json
  timestamp,
  text,
  integer, // Changed from int
  uniqueIndex,
} from "drizzle-orm/pg-core"; // Changed from mysql-core
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Waitlist Table ---
export const waitlist = pgTable("waitlist", { // Changed from mysqlTable
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  fullName: varchar("full_name", { length: 256 }).notNull(),
  interests: jsonb("interests").$type<string[]>().notNull(), // Changed from json
  location: varchar("location", { length: 256 }).notNull(),
  profession: varchar("profession", { length: 256 }).notNull(),
});

// --- User Table ---
export const users = pgTable("users", { // Changed
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Chat Rooms Table ---
export const chatRooms = pgTable("chatRooms", { // Changed
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  interests: jsonb("interests").$type<string[]>().notNull(), // Changed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Messages Table ---
export const messages = pgTable("messages", { // Changed
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(), // Changed
  userId: integer("user_id").notNull(), // Changed
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Participants Table (Junction Table) ---
export const participants = pgTable( // Changed
  "participants",
  {
    id: serial("id").primaryKey(),
    roomId: integer("room_id").notNull(), // Changed
    userId: integer("user_id").notNull(), // Changed
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

export const insertWaitlistSchema = createInsertSchema(waitlist);
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
