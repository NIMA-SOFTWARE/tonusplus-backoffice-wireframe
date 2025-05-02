import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable("users", {
  id: integer("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type SessionStatus = 'draft' | 'open' | 'closed' | 'on going' | 'finished' | 'cancelled';

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface EquipmentTimeSlot {
  startMinute: number; // Minutes from the session start time (0-45 for a 1-hour session)
  endMinute: number;   // End minute (startMinute + 15 usually, max is session duration)
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
  enableWaitlist: boolean;
  status: SessionStatus;
  participants: Participant[];
  waitlist: Participant[];
  createdAt: string;
  equipmentBookings?: {
    laser?: EquipmentTimeSlot[];
    reformer?: EquipmentTimeSlot[];
    cadillac?: EquipmentTimeSlot[];
    barrel?: EquipmentTimeSlot[];
    chair?: EquipmentTimeSlot[];
  };
}

export interface CreateSessionInput {
  name: string;
  trainer: string;
  room: string;
  date: string;
  startTime: string;
  duration: number;
  maxSpots: number;
  enableWaitlist: boolean;
  status: SessionStatus;
  equipmentBookings?: {
    laser?: EquipmentTimeSlot[];
    reformer?: EquipmentTimeSlot[];
    cadillac?: EquipmentTimeSlot[];
    barrel?: EquipmentTimeSlot[];
    chair?: EquipmentTimeSlot[];
  };
}

// Schema for equipment time slot
const equipmentTimeSlotSchema = z.object({
  startMinute: z.number().int().min(0, "Start minute must be positive"),
  endMinute: z.number().int().min(0, "End minute must be positive")
});

export const createSessionSchema = z.object({
  name: z.string().min(1, "Activity name is required"),
  trainer: z.string().min(1, "Trainer name is required"),
  room: z.string().min(1, "Room is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  duration: z.number().int().min(15, "Duration must be at least 15 minutes"),
  maxSpots: z.number().int().min(1, "Maximum spots must be at least 1"),
  enableWaitlist: z.boolean().default(true),
  status: z.enum(['draft', 'open', 'closed', 'on going', 'finished', 'cancelled']),
  equipmentBookings: z.object({
    laser: equipmentTimeSlotSchema.optional(),
    reformer: equipmentTimeSlotSchema.optional(),
    cadillac: equipmentTimeSlotSchema.optional(),
    barrel: equipmentTimeSlotSchema.optional(),
    chair: equipmentTimeSlotSchema.optional()
  }).optional()
});

export const bookSessionSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  notes: z.string().optional()
});

export type BookSessionInput = z.infer<typeof bookSessionSchema>;