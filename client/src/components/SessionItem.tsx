import React from 'react';
import { PilatesSession } from '@shared/schema';
import { formatDate, formatTimeRange } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface SessionItemProps {
  session: PilatesSession;
  onBook?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  isAdminView?: boolean;
}

const SessionItem: React.FC<SessionItemProps> = ({ 
  session, 
  onBook, 
  onEdit, 
  onCancel,
  isAdminView = false
}) => {
  const { id, name, trainer, date, startTime, duration, maxSpots, status, participants, waitlist } = session;
  const availableSpots = maxSpots - participants.length;
  
  const SessionDetails = () => (
    <div className="mt-1 text-sm text-slate-500">
      <p>{formatDate(date)} · {formatTimeRange(startTime, duration)} ({duration} min)</p>
      <p>Instructor: {trainer}</p>
      <p>
        {availableSpots > 0 
          ? `${availableSpots} spot${availableSpots === 1 ? '' : 's'} available` 
          : `0 spots available${waitlist.length > 0 ? ` (${waitlist.length} on waitlist)` : ''}`}
      </p>
    </div>
  );

  const BookButton = () => {
    if (status === 'open' && availableSpots > 0) {
      return (
        <button 
          onClick={onBook}
          className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition"
        >
          Book
        </button>
      );
    } else if (status === 'open' || status === 'closed') {
      return (
        <button 
          onClick={onBook}
          className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-md hover:bg-indigo-200 transition"
        >
          Join Waitlist
        </button>
      );
    }
    return null;
  };

  const AdminActions = () => (
    <div>
      <button 
        onClick={onEdit}
        className="text-indigo-600 hover:text-indigo-900 mr-3"
      >
        Edit
      </button>
      <button 
        onClick={onCancel}
        className="text-red-600 hover:text-red-900"
      >
        Cancel
      </button>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-medium text-slate-800">{name}</h4>
            <StatusBadge status={status} />
          </div>
          <SessionDetails />
        </div>
        {isAdminView ? <AdminActions /> : <BookButton />}
      </div>
    </div>
  );
};

export default SessionItem;
