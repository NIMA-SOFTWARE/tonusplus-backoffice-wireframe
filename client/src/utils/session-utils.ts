import { Session, SessionStatus, Filter } from '@/lib/types';

// Filter sessions based on selected filters
export const filterSessions = (sessions: Session[], filters: Filter): Session[] => {
  return sessions.filter(session => {
    // Filter by date
    if (filters.date && session.date !== filters.date) {
      return false;
    }
    
    // Filter by trainer
    if (filters.trainer && session.trainer !== filters.trainer) {
      return false;
    }
    
    // Filter by activity
    if (filters.activity && session.activity !== filters.activity) {
      return false;
    }
    
    return true;
  });
};

// Get display label for session status
export const getStatusLabel = (status: SessionStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'open':
      return 'Open';
    case 'closed':
      return 'Closed';
    case 'ongoing':
      return 'Ongoing';
    case 'finished':
      return 'Finished';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

// Get color class for session status
export const getStatusColor = (status: SessionStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-600';
    case 'open':
      return 'bg-green-100 text-green-600';
    case 'closed':
      return 'bg-amber-100 text-amber-600';
    case 'ongoing':
      return 'bg-blue-100 text-blue-600';
    case 'finished':
      return 'bg-purple-100 text-purple-600';
    case 'cancelled':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

// Update session status based on date and time
export const updateSessionStatus = (session: Session): SessionStatus => {
  const now = new Date();
  const sessionDate = new Date(`${session.date}T${session.startTime}`);
  const endTime = new Date(sessionDate.getTime() + session.duration * 60000);
  
  if (session.status === 'cancelled') {
    return 'cancelled';
  }
  
  if (sessionDate > now) {
    return session.participants.length < session.capacity ? 'open' : 'closed';
  }
  
  if (now >= sessionDate && now <= endTime) {
    return 'ongoing';
  }
  
  if (now > endTime) {
    return 'finished';
  }
  
  return session.status;
};
