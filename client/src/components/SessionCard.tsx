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
  
  // Check if session has laser equipment booked
  const hasLaserBooked = session.equipmentBookings?.laser !== undefined;
  
  // Format laser time slot if available
  const formatLaserTimeSlot = () => {
    if (!hasLaserBooked) return null;
    
    const { startMinute, endMinute } = session.equipmentBookings!.laser!;
    let timeLabel = '';
    
    if (startMinute === 0 && endMinute === 15) timeLabel = '1st 15min';
    else if (startMinute === 15 && endMinute === 30) timeLabel = '2nd 15min';
    else if (startMinute === 30 && endMinute === 45) timeLabel = '3rd 15min';
    else if (startMinute === 45 && endMinute === 60) timeLabel = 'Last 15min';
    else timeLabel = `${startMinute}-${endMinute}min`;
    
    return `⚡ Laser: ${timeLabel}`;
  };
  
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
      {hasLaserBooked && (
        <div className="mt-1 text-[10px] font-semibold">
          {formatLaserTimeSlot()}
        </div>
      )}
    </div>
  );
};

export default SessionCard;
