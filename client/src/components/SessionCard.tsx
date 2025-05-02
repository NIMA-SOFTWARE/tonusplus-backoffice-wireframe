import React from 'react';
import { PilatesSession } from '@shared/schema';
import { getSessionColor, formatTime, formatDate } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EquipmentTooltip from './EquipmentTooltip';

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
      case 'laser': return '🔆'; // Light/laser icon
      case 'reformer': return '🏋️'; // Exercise/fitness equipment
      case 'cadillac': return '🛌'; // Bed/platform
      case 'barrel': return '🔄'; // Circular/rotation motion
      case 'chair': return '🪑'; // Chair
      default: return '⚙️'; // Generic equipment
    }
  };
  
  // Get booked equipment
  const getBookedEquipment = () => {
    if (!session.equipmentBookings) return [];
    
    const equipment = [];
    
    for (const [type, bookings] of Object.entries(session.equipmentBookings)) {
      if (bookings && bookings.length > 0) {
        // Handle each booking time slot
        for (const booking of bookings) {
          equipment.push({
            type,
            icon: getEquipmentIcon(type),
            timeSlot: formatTimeSlot(booking.startMinute, booking.endMinute)
          });
        }
      }
    }
    
    return equipment;
  };
  
  const bookedEquipment = getBookedEquipment();
  
  // Format end time
  const getEndTime = () => {
    const [hours, minutes] = session.startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + session.duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Create detailed tooltip content
  const tooltipContent = (
    <div className="space-y-2 p-1">
      <div className="font-semibold">{session.name}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div className="text-muted-foreground">Date:</div>
        <div>{formatDate(session.date)}</div>
        
        <div className="text-muted-foreground">Time:</div>
        <div>{formatTime(session.startTime)} - {getEndTime()}</div>
        
        <div className="text-muted-foreground">Duration:</div>
        <div>{session.duration} minutes</div>
        
        <div className="text-muted-foreground">Trainer:</div>
        <div>{session.trainer}</div>
        
        <div className="text-muted-foreground">Room:</div>
        <div>{session.room}</div>
        
        <div className="text-muted-foreground">Capacity:</div>
        <div>{session.participants.length}/{session.maxSpots}</div>
        
        <div className="text-muted-foreground">Status:</div>
        <div className="capitalize">{session.status}</div>
        
        {session.waitlist.length > 0 && (
          <>
            <div className="text-muted-foreground">Waitlist:</div>
            <div>{session.waitlist.length} {session.waitlist.length === 1 ? 'person' : 'people'}</div>
          </>
        )}
      </div>
      
      {bookedEquipment.length > 0 && (
        <div className="pt-1 border-t border-border">
          <div className="font-semibold mb-1">Equipment:</div>
          <div className="grid grid-cols-1 gap-1 text-xs">
            {bookedEquipment.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-1">{item.icon}</span>
                <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                <span className="ml-auto">{item.timeSlot}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`p-1 text-xs rounded cursor-pointer ${cardClasses} relative`} 
            onClick={onClick}
          >
            <div className="font-medium">{session.name}</div>
            <div>{formatTime(session.startTime)} - {getEndTime()}</div>
            <div>
              {availableSpots > 0 
                ? `${availableSpots} spot${availableSpots === 1 ? '' : 's'} left` 
                : 'Full'}
            </div>
            
            {/* Equipment icons in bottom right corner */}
            {bookedEquipment.length > 0 && (
              <div className="absolute bottom-0.5 right-0.5 flex space-x-1 bg-white/30 px-1 rounded-sm">
                {Array.from(new Set(bookedEquipment.map(item => item.type))).map((type, index) => {
                  // Get all equipment of this type
                  const typeEquipment = bookedEquipment.filter(item => item.type === type);
                  
                  return (
                    <EquipmentTooltip 
                      key={index} 
                      type={type}
                      timeSlot={typeEquipment.map(item => item.timeSlot).join(', ')}
                    >
                      <div className="cursor-help text-sm">
                        {getEquipmentIcon(type)}
                      </div>
                    </EquipmentTooltip>
                  );
                })}
              </div>
            )}
            {/* We've removed the detailed equipment list and only showing icons in the corner */}
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-2" side="top">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SessionCard;
