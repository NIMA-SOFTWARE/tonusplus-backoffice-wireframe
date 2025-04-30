import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  Session, 
  Filter, 
  AppContextType, 
  Participant 
} from '@/lib/types';
import {
  initializeStorage,
  getSessions,
  saveSessions,
  addSession as addSessionToStorage,
  updateSession as updateSessionInStorage,
  deleteSession as deleteSessionFromStorage,
  bookSession as bookSessionInStorage,
  cancelBooking as cancelBookingInStorage,
  joinWaitingList as joinWaitingListInStorage,
  removeFromWaitingList as removeFromWaitingListInStorage,
  getSessionById as getSessionByIdFromStorage
} from '@/lib/localStorage';

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filters, setFilters] = useState<Filter>({
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
    trainer: '',
    activity: ''
  });

  // Initialize localStorage and load sessions
  useEffect(() => {
    initializeStorage();
    setSessions(getSessions());
  }, []);

  const addSession = (sessionData: Omit<Session, 'id'>) => {
    const newSession = addSessionToStorage(sessionData);
    setSessions([...sessions, newSession]);
  };

  const updateSession = (updatedSession: Session) => {
    updateSessionInStorage(updatedSession);
    setSessions(sessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
  };

  const deleteSession = (id: string) => {
    deleteSessionFromStorage(id);
    setSessions(sessions.filter(session => session.id !== id));
  };

  const bookSession = (sessionId: string, participant: Participant): boolean => {
    const success = bookSessionInStorage(sessionId, participant);
    if (success) {
      setSessions(getSessions());
    }
    return success;
  };

  const cancelBooking = (sessionId: string, participantId: string) => {
    cancelBookingInStorage(sessionId, participantId);
    setSessions(getSessions());
  };

  const joinWaitingList = (sessionId: string, participant: Participant): boolean => {
    const success = joinWaitingListInStorage(sessionId, participant);
    if (success) {
      setSessions(getSessions());
    }
    return success;
  };

  const removeFromWaitingList = (sessionId: string, participantId: string) => {
    removeFromWaitingListInStorage(sessionId, participantId);
    setSessions(getSessions());
  };

  const getSessionById = (id: string): Session | undefined => {
    return getSessionByIdFromStorage(id);
  };

  const value: AppContextType = {
    isAdmin,
    setIsAdmin,
    sessions,
    setSessions,
    filters,
    setFilters,
    addSession,
    updateSession,
    deleteSession,
    bookSession,
    cancelBooking,
    joinWaitingList,
    removeFromWaitingList,
    getSessionById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
