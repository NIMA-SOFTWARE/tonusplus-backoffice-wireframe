import React from 'react';
import { PilatesSession } from '@shared/schema';
import { formatDate, formatTimeRange } from '@/lib/utils';
import StatusBadge from './StatusBadge';
import EquipmentTooltip from './EquipmentTooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div>{formatDate(date)} · {formatTimeRange(startTime, duration)} ({duration} min)</div>
      <div>Instructor: {trainer}</div>
      <div>
        {availableSpots > 0 
          ? `${availableSpots} spot${availableSpots === 1 ? '' : 's'} available` 
          : `0 spots available${waitlist.length > 0 ? ` (${waitlist.length} on waitlist)` : ''}`}
      </div>
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

  // Create formatted equipment list for tooltip
  const getFormattedEquipmentList = () => {
    if (!session.equipmentBookings) return null;
    
    const equipment = [];
    
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
    
    for (const [type, booking] of Object.entries(session.equipmentBookings)) {
      if (booking) {
        equipment.push({
          type,
          icon: getEquipmentIcon(type),
          timeSlot: formatTimeSlot(booking.startMinute, booking.endMinute)
        });
      }
    }
    
    if (equipment.length === 0) return null;
    
    return (
      <div className="pt-2 mt-2 border-t border-border">
        <div className="font-semibold mb-1">Equipment:</div>
        <div className="grid grid-cols-1 gap-1 text-xs">
          {equipment.map((item, index) => (
            <EquipmentTooltip 
              key={index} 
              type={item.type} 
              timeSlot={item.timeSlot}
            >
              <div className="flex items-center cursor-help">
                <span className="mr-1">{item.icon}</span>
                <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                <span className="ml-auto">{item.timeSlot}</span>
              </div>
            </EquipmentTooltip>
          ))}
        </div>
      </div>
    );
  };
  
  // Calculate session end time
  const getEndTime = () => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };
  
  // Create tooltip content
  const tooltipContent = (
    <div className="space-y-2 p-1">
      <div className="font-semibold">{name}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div className="text-muted-foreground">Date:</div>
        <div>{formatDate(date)}</div>
        
        <div className="text-muted-foreground">Time:</div>
        <div>{formatTimeRange(startTime, duration)}</div>
        
        <div className="text-muted-foreground">Duration:</div>
        <div>{duration} minutes</div>
        
        <div className="text-muted-foreground">Trainer:</div>
        <div>{trainer}</div>
        
        <div className="text-muted-foreground">Room:</div>
        <div>{session.room}</div>
        
        <div className="text-muted-foreground">Capacity:</div>
        <div>{participants.length}/{maxSpots}</div>
        
        <div className="text-muted-foreground">Status:</div>
        <div className="capitalize">{status}</div>
        
        {waitlist.length > 0 && (
          <>
            <div className="text-muted-foreground">Waitlist:</div>
            <div>{waitlist.length} {waitlist.length === 1 ? 'person' : 'people'}</div>
          </>
        )}
        
        {session.enableWaitlist && (
          <>
            <div className="text-muted-foreground">Waitlist enabled:</div>
            <div>Yes</div>
          </>
        )}
      </div>
      
      {getFormattedEquipmentList()}
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-medium text-slate-800">{name}</h4>
                    <StatusBadge status={status} />
                  </div>
                  <SessionDetails />
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-64 p-2" side="top">
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="ml-4">
          {isAdminView ? <AdminActions /> : <BookButton />}
        </div>
      </div>
    </div>
  );
};

export default SessionItem;
