import React from 'react';
import { PilatesSession } from '@shared/schema';
import { getSessionColor, formatTime } from '@/lib/utils';

interface SessionCardProps {
  session: PilatesSession;
  onClick: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onClick }) => {
  const cardClasses = getSessionColor(session.name);
  const availableSpots = session.maxSpots - session.participants.length;
  
  return (
    <div 
      className={`p-1 text-xs rounded cursor-pointer ${cardClasses}`} 
      onClick={onClick}
    >
      <div className="font-medium">{session.name}</div>
      <div>{formatTime(session.startTime)} - {(parseInt(session.startTime.split(':')[0]) + Math.floor(session.duration / 60)) % 24}:{session.startTime.split(':')[1]}</div>
      <div>
        {availableSpots > 0 
          ? `${availableSpots} spot${availableSpots === 1 ? '' : 's'} left` 
          : 'Full'}
      </div>
    </div>
  );
};

export default SessionCard;
