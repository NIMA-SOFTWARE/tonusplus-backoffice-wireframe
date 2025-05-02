import { PilatesSession, Participant, CreateSessionInput, SessionStatus } from '@shared/schema';
import { generateUniqueId } from './utils';
import { format, addDays } from 'date-fns';

const STORAGE_KEY = 'pilatesSessions';

export interface PilatesStore {
  sessions: PilatesSession[];
}

// Initialize local storage with default data if empty
export const initLocalStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialData: PilatesStore = {
      sessions: getSampleSessions(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
};

// Get all sessions from local storage
export const getSessions = (): PilatesSession[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    initLocalStorage();
    return getSessions();
  }
  return JSON.parse(data).sessions;
};

// Check if laser equipment is available for booking
export const isLaserAvailable = (date: string, startTime: string, startMinute: number, endMinute: number): boolean => {
  const sessions = getSessions();
  
  // Filter sessions on the same date and with laser equipment booked
  const conflictingSessions = sessions.filter(session => {
    if (session.date !== date) return false;
    if (!session.equipmentBookings?.laser) return false;
    
    // Convert time to minutes for comparison
    const sessionHour = parseInt(session.startTime.split(':')[0], 10);
    const sessionMinute = parseInt(session.startTime.split(':')[1], 10);
    const sessionTotalStartMinutes = sessionHour * 60 + sessionMinute;
    
    const requestHour = parseInt(startTime.split(':')[0], 10);
    const requestMinute = parseInt(startTime.split(':')[1], 10);
    const requestTotalStartMinutes = requestHour * 60 + requestMinute;
    
    // Calculate the absolute start and end times
    const sessionLaserStartTime = sessionTotalStartMinutes + session.equipmentBookings.laser.startMinute;
    const sessionLaserEndTime = sessionTotalStartMinutes + session.equipmentBookings.laser.endMinute;
    
    const requestLaserStartTime = requestTotalStartMinutes + startMinute;
    const requestLaserEndTime = requestTotalStartMinutes + endMinute;
    
    // Check for overlap
    return (
      (requestLaserStartTime >= sessionLaserStartTime && requestLaserStartTime < sessionLaserEndTime) ||
      (requestLaserEndTime > sessionLaserStartTime && requestLaserEndTime <= sessionLaserEndTime) ||
      (requestLaserStartTime <= sessionLaserStartTime && requestLaserEndTime >= sessionLaserEndTime)
    );
  });
  
  return conflictingSessions.length === 0;
};

// Add a new session
export const createSession = (sessionData: CreateSessionInput): PilatesSession => {
  const sessions = getSessions();
  const newSession: PilatesSession = {
    id: generateUniqueId(),
    ...sessionData,
    participants: [],
    waitlist: [],
    createdAt: new Date().toISOString(),
  };
  
  const updatedSessions = [...sessions, newSession];
  saveSessionsToStorage(updatedSessions);
  return newSession;
};

// Update a session
export const updateSession = (id: string, sessionData: Partial<PilatesSession>): PilatesSession | null => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(session => session.id === id);
  
  if (sessionIndex === -1) return null;
  
  const updatedSession = { ...sessions[sessionIndex], ...sessionData };
  sessions[sessionIndex] = updatedSession;
  saveSessionsToStorage(sessions);
  return updatedSession;
};

// Delete a session
export const deleteSession = (id: string): boolean => {
  const sessions = getSessions();
  const updatedSessions = sessions.filter(session => session.id !== id);
  
  if (updatedSessions.length === sessions.length) return false;
  
  saveSessionsToStorage(updatedSessions);
  return true;
};

// Book a participant into a session
export const bookSession = (sessionId: string, participant: Participant): { success: boolean; message: string; isWaitlisted: boolean } => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(session => session.id === sessionId);
  
  if (sessionIndex === -1) {
    return { success: false, message: 'Session not found', isWaitlisted: false };
  }
  
  const session = sessions[sessionIndex];
  
  // Check if already booked
  const alreadyBooked = [...session.participants, ...session.waitlist].some(
    p => p.email === participant.email
  );
  
  if (alreadyBooked) {
    return { success: false, message: 'You are already booked for this session', isWaitlisted: false };
  }
  
  // Check if session is open for booking
  if (session.status !== 'open') {
    return { success: false, message: `Cannot book a ${session.status} session`, isWaitlisted: false };
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
  
  // Add to waitlist if main session is full
  if (session.waitlist.length < session.maxWaitlist) {
    session.waitlist.push(participant);
    sessions[sessionIndex] = session;
    saveSessionsToStorage(sessions);
    return { success: true, message: 'Added to waitlist', isWaitlisted: true };
  }
  
  return { success: false, message: 'Session and waitlist are full', isWaitlisted: false };
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
      room: "Reformer Room",
      date: today.toISOString().split('T')[0],
      startTime: "10:00",
      duration: 60,
      maxSpots: 8,
      maxWaitlist: 5,
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
        laser: { startMinute: 0, endMinute: 15 } // Using laser for first 15 minutes
      }
    },
    {
      id: "session2",
      name: "Barre Fusion",
      trainer: "Emma Wilson",
      room: "Studio B",
      date: today.toISOString().split('T')[0],
      startTime: "15:00",
      duration: 60,
      maxSpots: 8,
      maxWaitlist: 5,
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
      room: "Studio A",
      date: tomorrow.toISOString().split('T')[0],
      startTime: "09:00",
      duration: 60,
      maxSpots: 10,
      maxWaitlist: 5,
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
      room: "Private Room",
      date: dayAfterTomorrow.toISOString().split('T')[0],
      startTime: "14:00",
      duration: 60,
      maxSpots: 5,
      maxWaitlist: 3,
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
      room: "Studio A",
      date: today.toISOString().split('T')[0],
      startTime: "08:00",
      duration: 60,
      maxSpots: 12,
      maxWaitlist: 5,
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
        laser: { startMinute: 30, endMinute: 45 } // Using laser in the middle of the session
      }
    },
    {
      id: "session6",
      name: "Reformer Pilates",
      trainer: "Mike Davis",
      room: "Reformer Room",
      date: today.toISOString().split('T')[0],
      startTime: "13:00",
      duration: 60,
      maxSpots: 8,
      maxWaitlist: 3,
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
        laser: { startMinute: 45, endMinute: 60 } // Using laser for the last 15 minutes
      }
    },
    // Add sessions for the rest of the week
    {
      id: "session7",
      name: "Mat Pilates",
      trainer: "Sarah Johnson",
      room: "Studio A",
      date: format(addDays(today, 1), 'yyyy-MM-dd'),
      startTime: "09:00",
      duration: 60,
      maxSpots: 12,
      maxWaitlist: 5,
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
      room: "Studio B",
      date: format(addDays(today, 2), 'yyyy-MM-dd'),
      startTime: "17:00",
      duration: 60,
      maxSpots: 10,
      maxWaitlist: 3,
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
      maxWaitlist: 3,
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
      maxWaitlist: 2,
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
