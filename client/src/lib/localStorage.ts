import { PilatesSession, CreateSessionInput, SessionStatus, EquipmentTimeSlot } from '@shared/schema';
import { format, addDays } from 'date-fns';

// Storage key
const STORAGE_KEY = 'pilates-studio-data';

export interface PilatesStore {
  sessions: PilatesSession[];
}

// Initialize localStorage with sample data if needed
export const initLocalStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialData: PilatesStore = {
      sessions: getSampleSessions()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
};

// Get all sessions
export const getSessions = (): PilatesSession[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return [];
  }
  
  try {
    const parsed = JSON.parse(data) as PilatesStore;
    return parsed.sessions;
  } catch (error) {
    console.error('Error parsing sessions from localStorage:', error);
    return [];
  }
};

// Check equipment availability for a specific time slot
export const isEquipmentAvailable = (
  sessions: PilatesSession[],
  equipmentType: 'laser' | 'reformer' | 'cadillac' | 'barrel' | 'chair',
  date: string,
  startTime: string,
  startMinute: number,
  endMinute: number,
  excludeSessionId?: string
): boolean => {
  // Filter sessions on the same date
  const sessionsOnDate = sessions.filter(session => 
    session.date === date && 
    (excludeSessionId ? session.id !== excludeSessionId : true)
  );
  
  // Check each session for equipment booking conflicts
  for (const session of sessionsOnDate) {
    // Skip if session doesn't have equipment bookings
    if (!session.equipmentBookings || !session.equipmentBookings[equipmentType]) {
      continue;
    }
    
    const sessionStartTime = session.startTime;
    
    // Convert session start time to minutes for easier comparison
    const [sessionHours, sessionMinutes] = sessionStartTime.split(':').map(Number);
    const sessionStartMinutes = sessionHours * 60 + sessionMinutes;
    
    // Convert requested start time to minutes
    const [requestedHours, requestedMinutes] = startTime.split(':').map(Number);
    const requestedStartMinutes = requestedHours * 60 + requestedMinutes;
    
    const requestedStartTotalMinutes = requestedStartMinutes + startMinute;
    const requestedEndTotalMinutes = requestedStartMinutes + endMinute;
    
    const bookings = session.equipmentBookings[equipmentType];
    
    // Check for conflicts based on booking format (array or single object)
    if (Array.isArray(bookings)) {
      // New format - array of time slots
      for (const booking of bookings) {
        // Calculate actual start and end minutes for each booking
        const bookingStartMinutes = sessionStartMinutes + booking.startMinute;
        const bookingEndMinutes = sessionStartMinutes + booking.endMinute;
        
        // Check for time overlap
        if (
          (requestedStartTotalMinutes < bookingEndMinutes && requestedEndTotalMinutes > bookingStartMinutes) ||
          (bookingStartMinutes < requestedEndTotalMinutes && bookingEndMinutes > requestedStartTotalMinutes)
        ) {
          return false; // There's an overlap
        }
      }
    } else if (bookings) {
      // Legacy format - single time slot object
      const booking = bookings as any;
      const bookingStartMinutes = sessionStartMinutes + booking.startMinute;
      const bookingEndMinutes = sessionStartMinutes + booking.endMinute;
      
      // Check for time overlap
      if (
        (requestedStartTotalMinutes < bookingEndMinutes && requestedEndTotalMinutes > bookingStartMinutes) ||
        (bookingStartMinutes < requestedEndTotalMinutes && bookingEndMinutes > requestedStartTotalMinutes)
      ) {
        return false; // There's an overlap
      }
    }
  }
  
  return true; // No conflicts found
};

// Specific equipment availability checks
export const isLaserAvailable = (date: string, startTime: string, startMinute: number, endMinute: number, excludeSessionId?: string): boolean => {
  return isEquipmentAvailable(getSessions(), 'laser', date, startTime, startMinute, endMinute, excludeSessionId);
};

export const isReformerAvailable = (date: string, startTime: string, startMinute: number, endMinute: number, excludeSessionId?: string): boolean => {
  return isEquipmentAvailable(getSessions(), 'reformer', date, startTime, startMinute, endMinute, excludeSessionId);
};

export const isCadillacAvailable = (date: string, startTime: string, startMinute: number, endMinute: number, excludeSessionId?: string): boolean => {
  return isEquipmentAvailable(getSessions(), 'cadillac', date, startTime, startMinute, endMinute, excludeSessionId);
};

export const isBarrelAvailable = (date: string, startTime: string, startMinute: number, endMinute: number, excludeSessionId?: string): boolean => {
  return isEquipmentAvailable(getSessions(), 'barrel', date, startTime, startMinute, endMinute, excludeSessionId);
};

export const isChairAvailable = (date: string, startTime: string, startMinute: number, endMinute: number, excludeSessionId?: string): boolean => {
  return isEquipmentAvailable(getSessions(), 'chair', date, startTime, startMinute, endMinute, excludeSessionId);
};

// Create a new session
export const createSession = (sessionData: CreateSessionInput): PilatesSession => {
  const sessions = getSessions();
  
  const newSession: PilatesSession = {
    id: Math.random().toString(36).substring(2, 9), // Simple ID generation
    ...sessionData,
    participants: [],
    waitlist: [],
    createdAt: new Date().toISOString()
  };
  
  sessions.push(newSession);
  saveSessionsToStorage(sessions);
  
  return newSession;
};

// Update an existing session
export const updateSession = (id: string, sessionData: Partial<PilatesSession>): PilatesSession | null => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(session => session.id === id);
  
  if (sessionIndex === -1) return null;
  
  // Merge the session data with the updates
  const updatedSession = { ...sessions[sessionIndex], ...sessionData };
  sessions[sessionIndex] = updatedSession;
  saveSessionsToStorage(sessions);
  
  return updatedSession;
};

// Delete a session
export const deleteSession = (id: string): boolean => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(session => session.id === id);
  
  if (sessionIndex === -1) return false;
  
  sessions.splice(sessionIndex, 1);
  saveSessionsToStorage(sessions);
  
  return true;
};

// Book a session or join waitlist
export const bookSession = (sessionId: string, participant: { id: string; name: string; email: string; phone?: string; notes?: string }): { success: boolean; message: string; isWaitlisted: boolean } => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(session => session.id === sessionId);
  
  if (sessionIndex === -1) {
    return { success: false, message: 'Session not found', isWaitlisted: false };
  }
  
  const session = sessions[sessionIndex];
  
  // Check if participant is already booked
  if (session.participants.some(p => p.email === participant.email) || 
      session.waitlist.some(p => p.email === participant.email)) {
    return { success: false, message: 'You are already booked or on the waitlist for this session', isWaitlisted: false };
  }
  
  // Check if session has available spots
  if (session.participants.length < session.maxSpots) {
    session.participants.push(participant);
    
    // Update session status if full
    if (session.participants.length === session.maxSpots) {
      session.status = 'closed' as SessionStatus;
    }
    
    sessions[sessionIndex] = session;
    saveSessionsToStorage(sessions);
    return { success: true, message: 'Booking successful', isWaitlisted: false };
  }
  
  // Add to waitlist if main session is full and waitlist is enabled
  if (session.enableWaitlist) {
    session.waitlist.push(participant);
    sessions[sessionIndex] = session;
    saveSessionsToStorage(sessions);
    return { success: true, message: 'Added to waitlist', isWaitlisted: true };
  }
  
  return { success: false, message: session.enableWaitlist ? 'Session and waitlist are full' : 'Session is full and does not have a waitlist', isWaitlisted: false };
};

// Cancel a booking
export const cancelBooking = (sessionId: string, participantEmail: string): { success: boolean; message: string } => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(session => session.id === sessionId);
  
  if (sessionIndex === -1) {
    return { success: false, message: 'Session not found' };
  }
  
  const session = sessions[sessionIndex];
  const participantIndex = session.participants.findIndex(p => p.email === participantEmail);
  
  if (participantIndex !== -1) {
    // Remove from participants
    session.participants.splice(participantIndex, 1);
    
    // Move someone from waitlist if available
    if (session.waitlist.length > 0) {
      const nextParticipant = session.waitlist.shift();
      if (nextParticipant) {
        session.participants.push(nextParticipant);
      }
    }
    
    // Update status if needed
    if (session.status === 'closed' && session.participants.length < session.maxSpots) {
      session.status = 'open' as SessionStatus;
    }
    
    sessions[sessionIndex] = session;
    saveSessionsToStorage(sessions);
    return { success: true, message: 'Booking cancelled successfully' };
  }
  
  // Check waitlist
  const waitlistIndex = session.waitlist.findIndex(p => p.email === participantEmail);
  if (waitlistIndex !== -1) {
    session.waitlist.splice(waitlistIndex, 1);
    sessions[sessionIndex] = session;
    saveSessionsToStorage(sessions);
    return { success: true, message: 'Waitlist position cancelled successfully' };
  }
  
  return { success: false, message: 'Participant not found in this session' };
};

// Change session status
export const updateSessionStatus = (sessionId: string, status: SessionStatus): boolean => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(session => session.id === sessionId);
  
  if (sessionIndex === -1) return false;
  
  sessions[sessionIndex].status = status;
  saveSessionsToStorage(sessions);
  return true;
};

// Helper function to save sessions to localStorage
const saveSessionsToStorage = (sessions: PilatesSession[]): void => {
  const data: PilatesStore = { sessions };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Sample sessions for initial data
const getSampleSessions = (): PilatesSession[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  return [
    {
      id: "session1",
      name: "Reformer Pilates",
      trainer: "Sarah Johnson",
      room: "Reformer Room - Downtown",
      date: today.toISOString().split('T')[0],
      startTime: "10:00",
      duration: 60,
      maxSpots: 8,
      enableWaitlist: true,
      status: "open",
      participants: [
        { id: "p1", name: "Jane Smith", email: "jane@example.com", phone: "555-123-4567" },
        { id: "p2", name: "John Doe", email: "john@example.com", phone: "555-765-4321" },
        { id: "p3", name: "Emily Brown", email: "emily@example.com", phone: "555-987-6543" },
        { id: "p4", name: "Michael Wong", email: "michael@example.com", phone: "555-456-7890" },
        { id: "p5", name: "Sarah Davis", email: "sarah@example.com", phone: "555-789-0123" }
      ],
      waitlist: [],
      createdAt: new Date().toISOString(),
      equipmentBookings: {
        laser: [
          { startMinute: 0, endMinute: 15 }, // Using laser for first 15 minutes
          { startMinute: 30, endMinute: 45 }  // Using laser again for third 15 minutes
        ],
        reformer: [{ startMinute: 15, endMinute: 30 }] // Using reformer for second 15 minutes
      }
    },
    {
      id: "session2",
      name: "Barre Fusion",
      trainer: "Emma Wilson",
      room: "Studio B - Downtown",
      date: today.toISOString().split('T')[0],
      startTime: "15:00",
      duration: 60,
      maxSpots: 8,
      enableWaitlist: true,
      status: "closed",
      participants: Array.from({ length: 8 }, (_, i) => ({
        id: `p${i+10}`,
        name: `Participant ${i+1}`,
        email: `participant${i+1}@example.com`,
        phone: `555-111-${1000+i}`
      })),
      waitlist: [
        { id: "w1", name: "Waiting Person 1", email: "wait1@example.com", phone: "555-222-1111" },
        { id: "w2", name: "Waiting Person 2", email: "wait2@example.com", phone: "555-222-2222" },
        { id: "w3", name: "Waiting Person 3", email: "wait3@example.com", phone: "555-222-3333" }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "session3",
      name: "Mat Pilates",
      trainer: "Mike Davis",
      room: "Studio A - Westside",
      date: tomorrow.toISOString().split('T')[0],
      startTime: "09:00",
      duration: 60,
      maxSpots: 10,
      enableWaitlist: true,
      status: "open",
      participants: Array.from({ length: 5 }, (_, i) => ({
        id: `p${i+20}`,
        name: `Participant ${i+1}`,
        email: `matparticipant${i+1}@example.com`,
        phone: `555-333-${1000+i}`
      })),
      waitlist: [],
      createdAt: new Date().toISOString()
    },
    {
      id: "session4",
      name: "Prenatal Pilates",
      trainer: "Sarah Johnson",
      room: "Private Room - Northside",
      date: dayAfterTomorrow.toISOString().split('T')[0],
      startTime: "14:00",
      duration: 60,
      maxSpots: 5,
      enableWaitlist: true,
      status: "open",
      participants: Array.from({ length: 3 }, (_, i) => ({
        id: `p${i+30}`,
        name: `Participant ${i+1}`,
        email: `prenatal${i+1}@example.com`,
        phone: `555-444-${1000+i}`
      })),
      waitlist: [],
      createdAt: new Date().toISOString()
    },
    {
      id: "session5",
      name: "Mat Pilates",
      trainer: "Emma Wilson",
      room: "Studio A - Downtown",
      date: today.toISOString().split('T')[0],
      startTime: "08:00",
      duration: 60,
      maxSpots: 12,
      enableWaitlist: true,
      status: "open",
      participants: Array.from({ length: 6 }, (_, i) => ({
        id: `p${i+40}`,
        name: `Participant ${i+1}`,
        email: `morning${i+1}@example.com`,
        phone: `555-555-${1000+i}`
      })),
      waitlist: [],
      createdAt: new Date().toISOString(),
      equipmentBookings: {
        laser: [{ startMinute: 30, endMinute: 45 }] // Using laser in the middle of the session
      }
    },
    {
      id: "session6",
      name: "Reformer Pilates",
      trainer: "Mike Davis",
      room: "Reformer Room - Westside",
      date: today.toISOString().split('T')[0],
      startTime: "13:00",
      duration: 60,
      maxSpots: 8,
      enableWaitlist: true,
      status: "open",
      participants: Array.from({ length: 4 }, (_, i) => ({
        id: `p${i+50}`,
        name: `Participant ${i+1}`,
        email: `afternoon${i+1}@example.com`,
        phone: `555-666-${1000+i}`
      })),
      waitlist: [],
      createdAt: new Date().toISOString(),
      equipmentBookings: {
        laser: [{ startMinute: 45, endMinute: 60 }] // Using laser for the last 15 minutes
      }
    },
    // Add sessions for the rest of the week
    {
      id: "session7",
      name: "Mat Pilates",
      trainer: "Sarah Johnson",
      room: "Studio A - Northside",
      date: format(addDays(today, 1), 'yyyy-MM-dd'),
      startTime: "09:00",
      duration: 60,
      maxSpots: 12,
      enableWaitlist: true,
      status: "open",
      participants: Array.from({ length: 3 }, (_, i) => ({
        id: `p${i+60}`,
        name: `Participant ${i+1}`,
        email: `tomorrow${i+1}@example.com`,
        phone: `555-777-${1000+i}`
      })),
      waitlist: [],
      createdAt: new Date().toISOString()
    },
    {
      id: "session8",
      name: "Barre Fusion",
      trainer: "Emma Wilson",
      room: "Studio B - Westside",
      date: format(addDays(today, 2), 'yyyy-MM-dd'),
      startTime: "17:00",
      duration: 60,
      maxSpots: 10,
      enableWaitlist: true,
      status: "open",
      participants: Array.from({ length: 5 }, (_, i) => ({
        id: `p${i+70}`,
        name: `Participant ${i+1}`,
        email: `day3${i+1}@example.com`,
        phone: `555-888-${1000+i}`
      })),
      waitlist: [],
      createdAt: new Date().toISOString()
    },
    {
      id: "session9",
      name: "Reformer Pilates",
      trainer: "Mike Davis",
      room: "Reformer Room",
      date: format(addDays(today, 3), 'yyyy-MM-dd'),
      startTime: "10:00",
      duration: 60,
      maxSpots: 8,
      enableWaitlist: false, // No waitlist for this session
      status: "open",
      participants: Array.from({ length: 6 }, (_, i) => ({
        id: `p${i+80}`,
        name: `Participant ${i+1}`,
        email: `day4${i+1}@example.com`,
        phone: `555-999-${1000+i}`
      })),
      waitlist: [],
      createdAt: new Date().toISOString()
    },
    {
      id: "session10",
      name: "Prenatal Pilates",
      trainer: "Sarah Johnson",
      room: "Private Room",
      date: format(addDays(today, 4), 'yyyy-MM-dd'),
      startTime: "14:00",
      duration: 60,
      maxSpots: 5,
      enableWaitlist: true,
      status: "open",
      participants: Array.from({ length: 2 }, (_, i) => ({
        id: `p${i+90}`,
        name: `Participant ${i+1}`,
        email: `day5${i+1}@example.com`,
        phone: `555-000-${1000+i}`
      })),
      waitlist: [],
      createdAt: new Date().toISOString()
    }
  ];
};