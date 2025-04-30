import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Custom types for pilates application
export type SessionStatus = 'pending' | 'open' | 'closed' | 'ongoing' | 'finished' | 'cancelled';

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface PilatesSession {
  id: string;
  name: string;
  trainer: string;
  room: string;
  date: string;
  startTime: string;
  duration: number;
  maxSpots: number;
  maxWaitlist: number;
  status: SessionStatus;
  participants: Participant[];
  waitlist: Participant[];
  createdAt: string;
}

export interface CreateSessionInput {
  name: string;
  trainer: string;
  room: string;
  date: string;
  startTime: string;
  duration: number;
  maxSpots: number;
  maxWaitlist: number;
  status: SessionStatus;
}

export const createSessionSchema = z.object({
  name: z.string().min(1, "Activity name is required"),
  trainer: z.string().min(1, "Trainer name is required"),
  room: z.string().min(1, "Room is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  duration: z.number().int().min(15, "Duration must be at least 15 minutes"),
  maxSpots: z.number().int().min(1, "Maximum spots must be at least 1"),
  maxWaitlist: z.number().int().min(0, "Maximum waitlist must be at least 0"),
  status: z.enum(['pending', 'open', 'closed', 'ongoing', 'finished', 'cancelled'])
});

export const bookSessionSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  notes: z.string().optional()
});

export type BookSessionInput = z.infer<typeof bookSessionSchema>;
