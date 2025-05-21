import { 
  users, 
  sessionsTable, 
  participantsTable, 
  type User, 
  type InsertUser,
  type Session,
  type InsertSession,
  type SessionParticipant,
  type InsertParticipant
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray, like, or } from "drizzle-orm";
import { generateUniqueId } from "../client/src/lib/utils";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Session methods
  getSessions(): Promise<Session[]>;
  getSessionById(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, session: Partial<InsertSession>): Promise<Session | undefined>;
  deleteSession(id: number): Promise<boolean>;
  
  // Participant methods
  getParticipantsBySessionId(sessionId: number): Promise<SessionParticipant[]>;
  getParticipantById(id: number): Promise<SessionParticipant | undefined>;
  createParticipant(participant: InsertParticipant): Promise<SessionParticipant>;
  updateParticipantStatus(id: number, status: string): Promise<SessionParticipant | undefined>;
  removeParticipant(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }
  
  async getCustomerById(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }
  
  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }
  
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }
  
  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updatedCustomer] = await db
      .update(customers)
      .set(customer)
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }
  
  // Session methods
  async getSessions(): Promise<Session[]> {
    return await db.select().from(sessionsTable);
  }
  
  async getSessionById(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, id));
    return session;
  }
  
  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db.insert(sessionsTable).values(session).returning();
    return newSession;
  }
  
  async updateSession(id: number, session: Partial<InsertSession>): Promise<Session | undefined> {
    const [updatedSession] = await db
      .update(sessionsTable)
      .set(session)
      .where(eq(sessionsTable.id, id))
      .returning();
    return updatedSession;
  }
  
  async deleteSession(id: number): Promise<boolean> {
    const result = await db
      .delete(sessionsTable)
      .where(eq(sessionsTable.id, id));
    return true; // If no error was thrown, consider it successful
  }
  
  // Participant methods
  async getParticipantsBySessionId(sessionId: number): Promise<SessionParticipant[]> {
    return await db
      .select()
      .from(participantsTable)
      .where(eq(participantsTable.sessionId, sessionId));
  }
  
  async getParticipantById(id: number): Promise<SessionParticipant | undefined> {
    const [participant] = await db
      .select()
      .from(participantsTable)
      .where(eq(participantsTable.id, id));
    return participant;
  }
  
  async createParticipant(participant: InsertParticipant): Promise<SessionParticipant> {
    const [newParticipant] = await db
      .insert(participantsTable)
      .values(participant)
      .returning();
    return newParticipant;
  }
  
  async updateParticipantStatus(id: number, status: string): Promise<SessionParticipant | undefined> {
    const [updatedParticipant] = await db
      .update(participantsTable)
      .set({ status })
      .where(eq(participantsTable.id, id))
      .returning();
    return updatedParticipant;
  }
  
  async removeParticipant(id: number): Promise<boolean> {
    const result = await db
      .delete(participantsTable)
      .where(eq(participantsTable.id, id));
    return true; // If no error was thrown, consider it successful
  }
  
  // Medical records methods
  async getMedicalRecordsByParticipantId(participantId: number): Promise<MedicalRecord[]> {
    return await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.participantId, participantId));
  }
  
  async getMedicalRecordsByCustomerId(customerId: number): Promise<MedicalRecord[]> {
    return await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.customerId, customerId));
  }
  
  async getMedicalRecordById(id: number): Promise<MedicalRecord | undefined> {
    const [record] = await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.id, id));
    return record;
  }
  
  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const [newRecord] = await db
      .insert(medicalRecords)
      .values(record)
      .returning();
    return newRecord;
  }
  
  // Specialized methods for medical record sections
  async saveRecurrentActivities(medicalRecordId: number, data: MedicalRecordFormData['recurrentActivities']): Promise<boolean> {
    if (!data) return false;
    
    await db.insert(recurrentActivities).values({
      medicalRecordId,
      sportsActivities: data.sportsActivities,
      isActive: data.isActive,
      coffeeConsumption: data.coffeeConsumption,
      alcoholConsumption: data.alcoholConsumption,
      drivesHeavyVehicles: data.drivesHeavyVehicles,
      drivingHoursPerWeek: data.drivingHoursPerWeek,
      usesComputer: data.usesComputer,
      computerHoursPerWeek: data.computerHoursPerWeek,
      additionalNotes: data.additionalNotes
    });
    
    return true;
  }
  
  async saveParticipationReason(medicalRecordId: number, data: MedicalRecordFormData['participationReason']): Promise<boolean> {
    if (!data) return false;
    
    await db.insert(participationReason).values({
      medicalRecordId,
      mainSymptoms: data.mainSymptoms || [],
      customReason: data.customReason
    });
    
    return true;
  }
  
  async savePhysicalPains(medicalRecordId: number, data: MedicalRecordFormData['physicalPains']): Promise<boolean> {
    if (!data || data.length === 0) return false;
    
    const values = data.map(pain => ({
      medicalRecordId,
      location: pain.location,
      whenItHurts: pain.whenItHurts,
      howItHurts: pain.howItHurts,
      duration: pain.duration,
      frequency: pain.frequency,
      additionalNotes: pain.additionalNotes
    }));
    
    await db.insert(physicalPains).values(values);
    
    return true;
  }
  
  async saveTraumaHistory(medicalRecordId: number, data: MedicalRecordFormData['traumaHistory']): Promise<boolean> {
    if (!data || data.length === 0) return false;
    
    const values = data.map(trauma => ({
      medicalRecordId,
      type: trauma.type,
      location: trauma.location,
      date: trauma.date ? new Date(trauma.date) : undefined,
      treatmentReceived: trauma.treatmentReceived,
      currentStatus: trauma.currentStatus,
      additionalNotes: trauma.additionalNotes
    }));
    
    await db.insert(traumaHistory).values(values);
    
    return true;
  }
  
  async saveSurgicalInterventions(medicalRecordId: number, data: MedicalRecordFormData['surgicalInterventions']): Promise<boolean> {
    if (!data || data.length === 0) return false;
    
    const values = data.map(surgery => ({
      medicalRecordId,
      type: surgery.type,
      date: surgery.date ? new Date(surgery.date) : undefined,
      hospital: surgery.hospital,
      surgeon: surgery.surgeon,
      outcome: surgery.outcome,
      additionalNotes: surgery.additionalNotes
    }));
    
    await db.insert(surgicalInterventions).values(values);
    
    return true;
  }
  
  async savePhysiologicalHistory(medicalRecordId: number, data: MedicalRecordFormData['physiologicalHistory']): Promise<boolean> {
    if (!data) return false;
    
    await db.insert(physiologicalHistory).values({
      medicalRecordId,
      birthWeight: data.birthWeight,
      wasBreastfed: data.wasBreastfed,
      birthType: data.birthType,
      developmentalMilestones: data.developmentalMilestones,
      additionalNotes: data.additionalNotes
    });
    
    return true;
  }
  
  async saveObjectiveExamination(medicalRecordId: number, data: MedicalRecordFormData['objectiveExamination']): Promise<boolean> {
    if (!data) return false;
    
    // Clinical exams
    if (data.clinicalExams && data.clinicalExams.length > 0) {
      const exams = data.clinicalExams.map(exam => ({
        medicalRecordId,
        examType: exam.examType,
        date: exam.date ? new Date(exam.date) : undefined,
        results: exam.results,
        additionalNotes: exam.additionalNotes
      }));
      
      await db.insert(clinicalExams).values(exams);
    }
    
    // Standing tests
    if (data.standingTests && data.standingTests.length > 0) {
      const tests = data.standingTests.map(test => ({
        medicalRecordId,
        testType: test.testType,
        results: test.results,
        additionalNotes: test.additionalNotes
      }));
      
      await db.insert(standingTests).values(tests);
    }
    
    // Shoulder tests
    if (data.shoulderTests && data.shoulderTests.length > 0) {
      const tests = data.shoulderTests.map(test => ({
        medicalRecordId,
        testType: test.testType,
        results: test.results,
        additionalNotes: test.additionalNotes
      }));
      
      await db.insert(shoulderTests).values(tests);
    }
    
    // Hip tests
    if (data.hipTests && data.hipTests.length > 0) {
      const tests = data.hipTests.map(test => ({
        medicalRecordId,
        testType: test.testType,
        results: test.results,
        additionalNotes: test.additionalNotes
      }));
      
      await db.insert(hipTests).values(tests);
    }
    
    // Anatomical anomalies
    if (data.anatomicalAnomalies && data.anatomicalAnomalies.length > 0) {
      const anomalies = data.anatomicalAnomalies.map(anomaly => ({
        medicalRecordId,
        location: anomaly.location,
        type: anomaly.type,
        description: anomaly.description
      }));
      
      await db.insert(anatomicalAnomalies).values(anomalies);
    }
    
    return true;
  }
  
  async saveSpecificClinicalHistory(medicalRecordId: number, data: MedicalRecordFormData['specificClinicalHistory']): Promise<boolean> {
    if (!data) return false;
    
    // Respiratory issues
    if (data.respiratoryIssues && data.respiratoryIssues.length > 0) {
      const issues = data.respiratoryIssues.map(issue => ({
        medicalRecordId,
        condition: issue.condition,
        diagnosisDate: issue.diagnosisDate ? new Date(issue.diagnosisDate) : undefined,
        treatment: issue.treatment,
        currentStatus: issue.currentStatus,
        additionalNotes: issue.additionalNotes
      }));
      
      await db.insert(respiratoryIssues).values(issues);
    }
    
    // Circulatory issues
    if (data.circulatoryIssues && data.circulatoryIssues.length > 0) {
      const issues = data.circulatoryIssues.map(issue => ({
        medicalRecordId,
        condition: issue.condition,
        diagnosisDate: issue.diagnosisDate ? new Date(issue.diagnosisDate) : undefined,
        treatment: issue.treatment,
        currentStatus: issue.currentStatus,
        additionalNotes: issue.additionalNotes
      }));
      
      await db.insert(circulatoryIssues).values(issues);
    }
    
    // Digestive issues
    if (data.digestiveIssues && data.digestiveIssues.length > 0) {
      const issues = data.digestiveIssues.map(issue => ({
        medicalRecordId,
        condition: issue.condition,
        diagnosisDate: issue.diagnosisDate ? new Date(issue.diagnosisDate) : undefined,
        treatment: issue.treatment,
        currentStatus: issue.currentStatus,
        additionalNotes: issue.additionalNotes
      }));
      
      await db.insert(digestiveIssues).values(issues);
    }
    
    return true;
  }
  
  async saveConclusions(medicalRecordId: number, data: MedicalRecordFormData['conclusions']): Promise<boolean> {
    if (!data) return false;
    
    await db.insert(conclusions).values({
      medicalRecordId,
      summary: data.summary,
      recommendations: data.recommendations,
      followUpNeeded: data.followUpNeeded,
      followUpDate: data.followUpDate ? new Date(data.followUpDate) : undefined,
      additionalNotes: data.additionalNotes
    });
    
    return true;
  }
  
  async saveFileUpload(medicalRecordId: number, section: string, fileName: string, fileType: string, fileUrl: string): Promise<number> {
    const [fileUpload] = await db.insert(fileUploads).values({
      medicalRecordId,
      section,
      fileName,
      fileType,
      fileUrl
    }).returning();
    
    return fileUpload.id;
  }
}

export const storage = new DatabaseStorage();
