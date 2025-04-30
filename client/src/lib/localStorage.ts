import { Session, Participant } from './types';

const SESSIONS_KEY = 'pilates_sessions';

// Initialize localStorage with default sessions if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(SESSIONS_KEY)) {
    const initialSessions: Session[] = [
      {
        id: '1',
        activity: 'Mat Pilates',
        trainer: 'Sarah Johnson',
        date: '2023-09-15',
        startTime: '10:00',
        duration: 60,
        capacity: 12,
        participants: [],
        waitingList: [],
        status: 'open'
      },
      {
        id: '2',
        activity: 'Reformer',
        trainer: 'Michael Chen',
        date: '2023-09-15',
        startTime: '14:00',
        duration: 60,
        capacity: 10,
        participants: [],
        waitingList: [],
        status: 'open'
      },
      {
        id: '3',
        activity: 'Barre Fusion',
        trainer: 'Emma Wilson',
        date: '2023-09-15',
        startTime: '17:30',
        duration: 60,
        capacity: 8,
        participants: [],
        waitingList: [],
        status: 'open'
      }
    ];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(initialSessions));
  }
};

// Get all sessions from localStorage
export const getSessions = (): Session[] => {
  const sessions = localStorage.getItem(SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

// Save sessions to localStorage
export const saveSessions = (sessions: Session[]): void => {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

// Add a new session
export const addSession = (session: Omit<Session, 'id'>): Session => {
  const sessions = getSessions();
  const newSession = {
    ...session,
    id: Date.now().toString(),
  };
  sessions.push(newSession);
  saveSessions(sessions);
  return newSession;
};

// Update a session
export const updateSession = (updatedSession: Session): void => {
  const sessions = getSessions();
  const index = sessions.findIndex(session => session.id === updatedSession.id);
  if (index !== -1) {
    sessions[index] = updatedSession;
    saveSessions(sessions);
  }
};

// Delete a session
export const deleteSession = (id: string): void => {
  const sessions = getSessions();
  const filteredSessions = sessions.filter(session => session.id !== id);
  saveSessions(filteredSessions);
};

// Book a participant into a session
export const bookSession = (sessionId: string, participant: Participant): boolean => {
  const sessions = getSessions();
  const index = sessions.findIndex(session => session.id === sessionId);
  
  if (index === -1) return false;
  
  const session = sessions[index];
  
  // Check if session has available spots
  if (session.participants.length < session.capacity) {
    session.participants.push(participant);
    
    // Update status if full
    if (session.participants.length === session.capacity) {
      session.status = 'closed';
    }
    
    saveSessions(sessions);
    return true;
  }
  
  return false;
};

// Join the waiting list for a session
export const joinWaitingList = (sessionId: string, participant: Participant): boolean => {
  const sessions = getSessions();
  const index = sessions.findIndex(session => session.id === sessionId);
  
  if (index === -1) return false;
  
  // Add to waiting list
  sessions[index].waitingList.push(participant);
  saveSessions(sessions);
  return true;
};

// Cancel a booking
export const cancelBooking = (sessionId: string, participantId: string): void => {
  const sessions = getSessions();
  const index = sessions.findIndex(session => session.id === sessionId);
  
  if (index === -1) return;
  
  const session = sessions[index];
  session.participants = session.participants.filter(p => p.id !== participantId);
  
  // Move first person from waiting list if available
  if (session.waitingList.length > 0 && session.participants.length < session.capacity) {
    const nextParticipant = session.waitingList.shift();
    if (nextParticipant) {
      session.participants.push(nextParticipant);
    }
  }
  
  // Update status
  if (session.participants.length < session.capacity) {
    session.status = 'open';
  }
  
  saveSessions(sessions);
};

// Remove from waiting list
export const removeFromWaitingList = (sessionId: string, participantId: string): void => {
  const sessions = getSessions();
  const index = sessions.findIndex(session => session.id === sessionId);
  
  if (index === -1) return;
  
  sessions[index].waitingList = sessions[index].waitingList.filter(p => p.id !== participantId);
  saveSessions(sessions);
};

// Get session by ID
export const getSessionById = (id: string): Session | undefined => {
  const sessions = getSessions();
  return sessions.find(session => session.id === id);
};
