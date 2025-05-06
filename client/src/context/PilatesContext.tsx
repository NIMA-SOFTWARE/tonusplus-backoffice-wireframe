import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PilatesSession, Participant, CreateSessionInput, SessionStatus } from '@shared/schema';
import { 
  getSessions, 
  createSession, 
  updateSession, 
  deleteSession, 
  bookSession, 
  cancelBooking, 
  updateSessionStatus,
  initLocalStorage
} from '../lib/localStorage';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'customer' | 'admin';

interface FilterOptions {
  date: string | null;
  trainer: string | null;
  activity: string | null;
  location: string | null;
}

interface PilatesContextType {
  sessions: PilatesSession[];
  filteredSessions: PilatesSession[];
  loading: boolean;
  viewMode: ViewMode;
  filters: FilterOptions;
  refreshSessions: () => void;
  addSession: (sessionData: CreateSessionInput) => Promise<PilatesSession | null>;
  editSession: (id: string, sessionData: Partial<PilatesSession>) => Promise<PilatesSession | null>;
  removeSession: (id: string) => Promise<boolean>;
  bookUserSession: (sessionId: string, participant: Participant) => Promise<{ success: boolean; message: string; isWaitlisted: boolean }>;
  cancelUserBooking: (sessionId: string, participantEmail: string) => Promise<{ success: boolean; message: string }>;
  changeSessionStatus: (sessionId: string, status: SessionStatus) => Promise<boolean>;
  setViewMode: (mode: ViewMode) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterOptions = {
  date: null,
  trainer: null,
  activity: null,
  location: null
};

const PilatesContext = createContext<PilatesContextType | undefined>(undefined);

export const PilatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<PilatesSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<PilatesSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const { toast } = useToast();

  // Initialize local storage and load sessions
  useEffect(() => {
    initLocalStorage();
    refreshSessions();
    
    // Initialize location filter if it's not set already
    const sessionsData = getSessions();
    if (sessionsData.length > 0 && !filters.location) {
      // Get unique locations
      const uniqueLocations = Array.from(new Set(sessionsData.map(session => session.location)));
      if (uniqueLocations.length > 0) {
        // Set the first location as default
        setFilters(prevFilters => ({
          ...prevFilters,
          location: uniqueLocations[0]
        }));
      }
    }
  }, []);

  // Apply filters whenever sessions or filters change
  useEffect(() => {
    applyFilters();
  }, [sessions, filters]);

  const refreshSessions = () => {
    setLoading(true);
    try {
      const data = getSessions();
      setSessions(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load sessions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sessions];
    
    // Apply date filter
    if (filters.date) {
      filtered = filtered.filter(session => session.date === filters.date);
    }
    
    // Apply trainer filter
    if (filters.trainer) {
      filtered = filtered.filter(session => session.trainer === filters.trainer);
    }
    
    // Apply activity filter
    if (filters.activity) {
      filtered = filtered.filter(session => session.name === filters.activity);
    }
    
    // Apply location filter - a location must always be active
    if (filters.location) {
      filtered = filtered.filter(session => session.location === filters.location);
    } else {
      // If no location is selected (which shouldn't happen), default to the first available location
      const uniqueLocations = Array.from(new Set(sessions.map(session => session.location)));
      if (uniqueLocations.length > 0) {
        const defaultLocation = uniqueLocations[0];
        filtered = filtered.filter(session => session.location === defaultLocation);
        
        // Update the filter state to reflect this default selection
        updateFilters({ location: defaultLocation });
      }
    }
    
    setFilteredSessions(filtered);
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    // When resetting filters, keep the current location or set to default if available
    const uniqueLocations = Array.from(new Set(sessions.map(session => session.location)));
    const defaultLocation = uniqueLocations.length > 0 ? uniqueLocations[0] : null;
    
    setFilters({
      ...defaultFilters,
      location: filters.location || defaultLocation
    });
  };

  const addSession = async (sessionData: CreateSessionInput): Promise<PilatesSession | null> => {
    try {
      const newSession = createSession(sessionData);
      refreshSessions();
      return newSession;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create session',
        variant: 'destructive',
      });
      return null;
    }
  };

  const editSession = async (id: string, sessionData: Partial<PilatesSession>): Promise<PilatesSession | null> => {
    try {
      const updatedSession = updateSession(id, sessionData);
      refreshSessions();
      return updatedSession;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update session',
        variant: 'destructive',
      });
      return null;
    }
  };

  const removeSession = async (id: string): Promise<boolean> => {
    try {
      const success = deleteSession(id);
      if (success) {
        refreshSessions();
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete session',
        variant: 'destructive',
      });
      return false;
    }
  };

  const bookUserSession = async (sessionId: string, participant: Participant): Promise<{ success: boolean; message: string; isWaitlisted: boolean }> => {
    try {
      const result = bookSession(sessionId, participant);
      refreshSessions();
      return result;
    } catch (error) {
      return { 
        success: false, 
        message: 'An error occurred while booking the session',
        isWaitlisted: false
      };
    }
  };

  const cancelUserBooking = async (sessionId: string, participantEmail: string): Promise<{ success: boolean; message: string }> => {
    try {
      const result = cancelBooking(sessionId, participantEmail);
      refreshSessions();
      return result;
    } catch (error) {
      return { 
        success: false, 
        message: 'An error occurred while cancelling the booking'
      };
    }
  };

  const changeSessionStatus = async (sessionId: string, status: SessionStatus): Promise<boolean> => {
    try {
      const success = updateSessionStatus(sessionId, status);
      if (success) {
        refreshSessions();
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update session status',
        variant: 'destructive',
      });
      return false;
    }
  };

  const value = {
    sessions,
    filteredSessions,
    loading,
    viewMode,
    filters,
    refreshSessions,
    addSession,
    editSession,
    removeSession,
    bookUserSession,
    cancelUserBooking,
    changeSessionStatus,
    setViewMode,
    setFilters: updateFilters,
    resetFilters
  };

  return (
    <PilatesContext.Provider value={value}>
      {children}
    </PilatesContext.Provider>
  );
};

export const usePilates = (): PilatesContextType => {
  const context = useContext(PilatesContext);
  if (context === undefined) {
    throw new Error('usePilates must be used within a PilatesProvider');
  }
  return context;
};
