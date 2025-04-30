export type SessionStatus = 
  | 'pending' 
  | 'open' 
  | 'closed' 
  | 'ongoing' 
  | 'finished' 
  | 'cancelled';

export interface Participant {
  id: string;
  name: string;
  email: string;
}

export interface Session {
  id: string;
  activity: string;
  trainer: string;
  date: string; // ISO format YYYY-MM-DD
  startTime: string; // 24hr format HH:MM
  duration: number; // in minutes
  capacity: number;
  participants: Participant[];
  waitingList: Participant[];
  status: SessionStatus;
}

export interface Filter {
  date: string | null;
  trainer: string;
  activity: string;
}

export interface AppContextType {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  filters: Filter;
  setFilters: (filters: Filter) => void;
  addSession: (session: Omit<Session, 'id'>) => void;
  updateSession: (session: Session) => void;
  deleteSession: (id: string) => void;
  bookSession: (sessionId: string, participant: Participant) => boolean;
  cancelBooking: (sessionId: string, participantId: string) => void;
  joinWaitingList: (sessionId: string, participant: Participant) => boolean;
  removeFromWaitingList: (sessionId: string, participantId: string) => void;
  getSessionById: (id: string) => Session | undefined;
}
