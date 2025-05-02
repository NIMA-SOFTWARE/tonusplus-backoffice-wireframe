import React, { useMemo } from 'react';
import { PilatesSession } from '@shared/schema';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ChevronRight, Zap, LayoutGrid } from 'lucide-react';

interface BookingDetail {
  sessionId: string;
  sessionName: string;
  trainer: string;
  room: string;
  startTime: string;
  slotTime: string;
  slotLabel: string;
  equipmentType: string;
}

interface EquipmentScheduleProps {
  sessions: PilatesSession[];
  date: string;
  className?: string;
}

// List of all equipment types we want to display
const EQUIPMENT_TYPES = ['laser', 'reformer', 'cadillac', 'barrel', 'chair'];

const EquipmentSchedule: React.FC<EquipmentScheduleProps> = ({
  sessions,
  date,
  className
}) => {
  // Get the icon for the equipment
  const getEquipmentIcon = (type: string) => {
    const colorClasses = getEquipmentColorClasses(type);
    
    switch (type) {
      case 'laser': return <Zap className={`h-4 w-4 ${colorClasses.text}`} />;
      case 'reformer': return <span className={colorClasses.text}>↻</span>;
      case 'cadillac': return <span className={colorClasses.text}>🛏️</span>;
      case 'barrel': return <span className={colorClasses.text}>🛢️</span>;
      case 'chair': return <span className={colorClasses.text}>🪑</span>;
      default: return <LayoutGrid className={`h-4 w-4 ${colorClasses.text}`} />;
    }
  };
  
  // Function to format time
  const formatTimeDisplay = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  // Get all equipment bookings for the selected date across ALL equipment types
  const bookings = useMemo(() => {
    const allBookings: BookingDetail[] = [];
    
    // Filter sessions for the selected date
    const sessionsOnDate = sessions.filter(session => session.date === date);
    
    // Collect all equipment bookings for all equipment types
    sessionsOnDate.forEach(session => {
      if (!session.equipmentBookings) return;
      
      // Process each equipment type
      EQUIPMENT_TYPES.forEach(equipmentType => {
        // Type assertion to access dynamic equipment type property
        const bookingsForType = session.equipmentBookings?.[equipmentType as keyof typeof session.equipmentBookings];
        if (!bookingsForType) return;
        
        // Handle both array and legacy formats
        const bookingsList = Array.isArray(bookingsForType) 
          ? bookingsForType 
          : [bookingsForType];
        
        // Process each booking for this equipment type
        bookingsList.forEach(booking => {
          // Calculate actual time for this booking
          const [sessionHour, sessionMinute] = session.startTime.split(':').map(Number);
          const startHour = sessionHour;
          const startMinute = sessionMinute + booking.startMinute;
          const slotHour = startHour + Math.floor(startMinute / 60);
          const slotMinute = startMinute % 60;
          
          // Format time for display
          const slotTime = `${slotHour.toString().padStart(2, '0')}:${slotMinute.toString().padStart(2, '0')}`;
          
          // Create human-readable label for the time slot
          let slotLabel = '';
          if (booking.startMinute === 0) slotLabel = 'First 15 minutes';
          else if (booking.startMinute === 15) slotLabel = 'Second 15 minutes';
          else if (booking.startMinute === 30) slotLabel = 'Third 15 minutes';
          else if (booking.startMinute === 45) slotLabel = 'Last 15 minutes';
          else slotLabel = `Minutes ${booking.startMinute}-${booking.endMinute}`;
          
          // Add booking to the list with equipment type
          allBookings.push({
            sessionId: session.id,
            sessionName: session.name,
            trainer: session.trainer,
            room: session.room,
            startTime: session.startTime,
            slotTime,
            slotLabel,
            equipmentType
          });
        });
      });
    });
    
    // Sort bookings by time
    return allBookings.sort((a, b) => {
      const timeA = new Date(`2000-01-01T${a.slotTime}`).getTime();
      const timeB = new Date(`2000-01-01T${b.slotTime}`).getTime();
      return timeA - timeB;
    });
  }, [sessions, date]);

  // Group bookings by hour for better organization
  const bookingsByHour = useMemo(() => {
    const grouped: { [hour: string]: BookingDetail[] } = {};
    
    bookings.forEach(booking => {
      const hour = booking.slotTime.split(':')[0];
      if (!grouped[hour]) {
        grouped[hour] = [];
      }
      grouped[hour].push(booking);
    });
    
    return grouped;
  }, [bookings]);
  
  // Get equipment display name
  const getEquipmentName = (type: string) => {
    switch (type) {
      case 'laser': return 'Laser';
      case 'reformer': return 'Reformer';
      case 'cadillac': return 'Cadillac';
      case 'barrel': return 'Barrel';
      case 'chair': return 'Chair';
      default: return type;
    }
  };

  // Get color classes for equipment type
  const getEquipmentColorClasses = (type: string) => {
    switch (type) {
      case 'laser': 
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-600'
        };
      case 'reformer': 
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-600'
        };
      case 'cadillac': 
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-600'
        };
      case 'barrel': 
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-600'
        };
      case 'chair': 
        return {
          bg: 'bg-pink-50',
          border: 'border-pink-200',
          text: 'text-pink-600'
        };
      default: 
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-600'
        };
    }
  };
  
  return (
    <div className={cn("flex flex-col space-y-2 p-3 bg-background border rounded-md", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">Equipment Schedule</h3>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      <Separator />
      
      {bookings.length === 0 ? (
        <div className="text-xs text-muted-foreground italic py-2">
          No equipment bookings for this date
        </div>
      ) : (
        Object.entries(bookingsByHour).map(([hour, hourBookings]) => (
          <div key={hour} className="mb-4">
            <div className="text-xs font-semibold mb-1 text-muted-foreground">
              {formatTimeDisplay(`${hour}:00`)}
            </div>
            <div className="pl-3 border-l-2 border-slate-200 space-y-2">
              {hourBookings.map((booking, index) => {
                const colorClasses = getEquipmentColorClasses(booking.equipmentType);
                return (
                  <div
                    key={`${booking.sessionId}-${booking.equipmentType}-${index}`}
                    className={cn(
                      colorClasses.bg, 
                      colorClasses.border, 
                      "border rounded-sm px-2 py-1 text-xs"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{booking.sessionName}</div>
                      <div className={cn(colorClasses.text, "font-medium")}>{formatTimeDisplay(booking.slotTime)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-muted-foreground">
                        {booking.trainer} • {booking.room}
                      </div>
                      <div className={cn(colorClasses.text, "text-[10px] font-medium flex items-center")}>
                        {getEquipmentIcon(booking.equipmentType)}
                        <span className="ml-1">{getEquipmentName(booking.equipmentType)}</span>
                      </div>
                    </div>
                    <div className="mt-1 text-[10px] flex items-center text-muted-foreground">
                      <ChevronRight className="h-3 w-3 mr-1" /> 
                      {booking.slotLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      
      {/* Equipment Legend */}
      <div className="mt-2 pt-2 border-t border-slate-200">
        <div className="text-xs font-medium mb-2">Equipment Legend:</div>
        <div className="grid grid-cols-2 gap-2">
          {EQUIPMENT_TYPES.map((type) => {
            const colorClasses = getEquipmentColorClasses(type);
            return (
              <div 
                key={type} 
                className={cn(
                  "flex items-center text-xs px-2 py-1 rounded-sm", 
                  colorClasses.bg,
                  colorClasses.border,
                  "border"
                )}
              >
                {getEquipmentIcon(type)}
                <span className="ml-1">{getEquipmentName(type)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EquipmentSchedule;