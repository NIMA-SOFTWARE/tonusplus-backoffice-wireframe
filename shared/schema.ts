import { pgTable, text, integer, timestamp, serial, boolean, date, primaryKey, json, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';

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
  location: string; // The studio location (e.g., Downtown, Westside, Northside)
  room: string; // The specific room within the location
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
  location: string; // The studio location
  room: string; // The specific room within the location
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
  location: z.string().min(1, "Location is required"),
  room: z.string().min(1, "Room is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  duration: z.number().int().min(15, "Duration must be at least 15 minutes"),
  maxSpots: z.number().int().min(1, "Maximum spots must be at least 1"),
  enableWaitlist: z.boolean().default(true),
  status: z.enum(['draft', 'open', 'closed', 'on going', 'finished', 'cancelled']),
  equipmentBookings: z.object({
    laser: z.array(equipmentTimeSlotSchema).optional(),
    reformer: z.array(equipmentTimeSlotSchema).optional(),
    cadillac: z.array(equipmentTimeSlotSchema).optional(),
    barrel: z.array(equipmentTimeSlotSchema).optional(),
    chair: z.array(equipmentTimeSlotSchema).optional()
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

// Database Schema
export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  trainer: text("trainer").notNull(),
  location: text("location").notNull(),
  room: text("room").notNull(),
  date: date("date").notNull(),
  startTime: text("start_time").notNull(),
  duration: integer("duration").notNull(),
  maxSpots: integer("max_spots").notNull(),
  enableWaitlist: boolean("enable_waitlist").default(true),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  equipmentBookings: json("equipment_bookings").default({})
});

export const participantsTable = pgTable("participants", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessionsTable.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  notes: text("notes"),
  status: text("status").notNull().default('confirmed'), // confirmed, waitlisted, attended, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const sessionsRelations = relations(sessionsTable, ({ many }) => ({
  participants: many(participantsTable),
}));

export const participantsRelations = relations(participantsTable, ({ one }) => ({
  session: one(sessionsTable, {
    fields: [participantsTable.sessionId],
    references: [sessionsTable.id],
  }),
}));

// Insert schemas
export const insertSessionSchema = createInsertSchema(sessionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertParticipantSchema = createInsertSchema(participantsTable).omit({
  id: true,
  createdAt: true
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionsTable.$inferSelect;

export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type SessionParticipant = typeof participantsTable.$inferSelect;

// Create a UI-friendly medical record form schema
export const medicalRecordFormSchema = z.object({
  // Section 2: Recurrent Activities
  recurrentActivities: z.object({
    sportsActivities: z.string().optional(),
    isActive: z.boolean().optional(),
    coffeeConsumption: z.boolean().optional(),
    alcoholConsumption: z.boolean().optional(),
    drivesHeavyVehicles: z.boolean().optional(),
    drivingHoursPerWeek: z.number().int().optional(),
    usesComputer: z.boolean().optional(),
    computerHoursPerWeek: z.number().int().optional(),
    additionalNotes: z.string().optional(),
  }).optional(),
  
  // Section 3: Participation Reason
  participationReason: z.object({
    mainSymptoms: z.array(z.string()).optional(),
    customReason: z.string().optional(),
  }).optional(),
  
  // Section 4: Physical Pains
  physicalPains: z.array(z.object({
    location: z.string(),
    whenItHurts: z.string().optional(),
    howItHurts: z.string().optional(),
    duration: z.string().optional(),
    frequency: z.string().optional(),
    additionalNotes: z.string().optional(),
  })).optional(),
  
  // Section 5: Trauma History
  traumaHistory: z.array(z.object({
    type: z.string(),
    location: z.string().optional(),
    date: z.date().optional(),
    treatmentReceived: z.string().optional(),
    currentStatus: z.string().optional(),
    additionalNotes: z.string().optional(),
  })).optional(),
  
  // Section 6: Surgical Interventions
  surgicalInterventions: z.array(z.object({
    type: z.string(),
    date: z.date().optional(),
    hospital: z.string().optional(),
    surgeon: z.string().optional(),
    outcome: z.string().optional(),
    additionalNotes: z.string().optional(),
  })).optional(),
  
  // Section 7: Physiological History
  physiologicalHistory: z.object({
    birthWeight: z.string().optional(),
    wasBreastfed: z.boolean().optional(),
    birthType: z.string().optional(),
    developmentalMilestones: z.string().optional(),
    additionalNotes: z.string().optional(),
  }).optional(),
  
  // Section 8: Objective Examination
  objectiveExamination: z.object({
    // 8.1 Clinical Exams
    clinicalExams: z.array(z.object({
      examType: z.string(),
      date: z.date().optional(),
      results: z.string().optional(),
      fileUpload: z.any().optional(), // Will handle file upload separately
      additionalNotes: z.string().optional(),
    })).optional(),
    
    // 8.2 Standing Tests
    standingTests: z.array(z.object({
      testType: z.string(),
      results: z.string().optional(),
      additionalNotes: z.string().optional(),
    })).optional(),
    
    // 8.3 Shoulder Tests
    shoulderTests: z.array(z.object({
      testType: z.string(),
      results: z.string().optional(),
      additionalNotes: z.string().optional(),
    })).optional(),
    
    // 8.4 Hip Tests
    hipTests: z.array(z.object({
      testType: z.string(),
      results: z.string().optional(),
      additionalNotes: z.string().optional(),
    })).optional(),
    
    // 8.5 Anatomical Anomalies
    anatomicalAnomalies: z.array(z.object({
      location: z.string().optional(),
      type: z.string().optional(),
      description: z.string(),
    })).optional(),
  }).optional(),
  
  // Section 9: Specific Clinical History
  specificClinicalHistory: z.object({
    // 9.1 Respiratory Issues
    respiratoryIssues: z.array(z.object({
      condition: z.string(),
      diagnosisDate: z.date().optional(),
      treatment: z.string().optional(),
      currentStatus: z.string().optional(),
      additionalNotes: z.string().optional(),
    })).optional(),
    
    // 9.2 Circulatory Issues
    circulatoryIssues: z.array(z.object({
      condition: z.string(),
      diagnosisDate: z.date().optional(),
      treatment: z.string().optional(),
      currentStatus: z.string().optional(),
      additionalNotes: z.string().optional(),
    })).optional(),
    
    // 9.3 Digestive Issues
    digestiveIssues: z.array(z.object({
      condition: z.string(),
      diagnosisDate: z.date().optional(),
      treatment: z.string().optional(),
      currentStatus: z.string().optional(),
      additionalNotes: z.string().optional(),
    })).optional(),
  }).optional(),
  
  // Section 10: Conclusions
  conclusions: z.object({
    summary: z.string().optional(),
    recommendations: z.string().optional(),
    followUpNeeded: z.boolean().optional(),
    followUpDate: z.date().optional(),
    additionalNotes: z.string().optional(),
  }).optional(),
});

export type MedicalRecordFormData = z.infer<typeof medicalRecordFormSchema>;