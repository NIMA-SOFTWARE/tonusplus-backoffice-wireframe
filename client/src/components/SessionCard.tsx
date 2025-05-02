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
  
  // Format equipment time slot helper
  const formatTimeSlot = (startMinute: number, endMinute: number) => {
    let timeLabel = '';
    
    if (startMinute === 0 && endMinute === 15) timeLabel = '1st 15min';
    else if (startMinute === 15 && endMinute === 30) timeLabel = '2nd 15min';
    else if (startMinute === 30 && endMinute === 45) timeLabel = '3rd 15min';
    else if (startMinute === 45 && endMinute === 60) timeLabel = 'Last 15min';
    else timeLabel = `${startMinute}-${endMinute}min`;
    
    return timeLabel;
  };
  
  // Get equipment icons
  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'laser': return '⚡';
      case 'reformer': return '🔄';
      case 'cadillac': return '🛏️';
      case 'barrel': return '🛢️';
      case 'chair': return '🪑';
      default: return '📊';
    }
  };
  
  // Get booked equipment
  const getBookedEquipment = () => {
    if (!session.equipmentBookings) return [];
    
    const equipment = [];
    
    for (const [type, booking] of Object.entries(session.equipmentBookings)) {
      if (booking) {
        equipment.push({
          type,
          icon: getEquipmentIcon(type),
          timeSlot: formatTimeSlot(booking.startMinute, booking.endMinute)
        });
      }
    }
    
    return equipment;
  };
  
  const bookedEquipment = getBookedEquipment();
  
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
      
      {bookedEquipment.length > 0 && (
        <div className="mt-1 text-[10px] font-semibold space-y-0.5">
          {bookedEquipment.map((item, index) => (
            <div key={index}>
              {item.icon} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}: {item.timeSlot}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionCard;
