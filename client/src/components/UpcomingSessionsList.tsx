import React from 'react';
import { PilatesSession } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import SessionItem from './SessionItem';

interface UpcomingSessionsListProps {
  onBookSession: (session: PilatesSession) => void;
}

const UpcomingSessionsList: React.FC<UpcomingSessionsListProps> = ({ onBookSession }) => {
  const { filteredSessions } = usePilates();
  
  // Sort sessions by date and time
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.startTime}`);
    const bDate = new Date(`${b.date}T${b.startTime}`);
    return aDate.getTime() - bDate.getTime();
  });

  // Filter to only upcoming sessions (not cancelled or finished)
  const upcomingSessions = sortedSessions.filter(
    session => !['cancelled', 'finished'].includes(session.status)
  );
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="text-lg font-medium text-slate-800">Upcoming Sessions</h3>
      </div>
      <div className="divide-y divide-slate-200">
        {upcomingSessions.length === 0 ? (
          <div className="p-4 text-center text-slate-500">
            No upcoming sessions found
          </div>
        ) : (
          upcomingSessions.map(session => (
            <SessionItem 
              key={session.id}
              session={session}
              onBook={() => onBookSession(session)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingSessionsList;
