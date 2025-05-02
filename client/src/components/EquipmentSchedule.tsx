import React, { useMemo } from 'react';
import { PilatesSession } from '@shared/schema';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ChevronRight, Zap } from 'lucide-react';

interface BookingDetail {
  sessionId: string;
  sessionName: string;
  trainer: string;
  room: string;
  startTime: string;
  slotTime: string;
  slotLabel: string;
}

interface EquipmentScheduleProps {
  sessions: PilatesSession[];
  date: string;
  selectedEquipment?: 'laser' | 'reformer' | 'cadillac' | 'barrel' | 'chair';
  className?: string;
}

const EquipmentSchedule: React.FC<EquipmentScheduleProps> = ({
  sessions,
  date,
  selectedEquipment = 'laser',
  className
}) => {
  // Get the icon for the equipment
  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'laser': return <Zap className="h-4 w-4 text-amber-600" />;
      case 'reformer': return <span className="text-amber-600">↻</span>;
      case 'cadillac': return <span className="text-amber-600">🛏️</span>;
      case 'barrel': return <span className="text-amber-600">🛢️</span>;
      case 'chair': return <span className="text-amber-600">🪑</span>;
      default: return <span className="text-amber-600">📊</span>;
    }
  };
  
  // Function to format time
  const formatTimeDisplay = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  // Get all equipment bookings for the selected date
  const bookings = useMemo(() => {
    const allBookings: BookingDetail[] = [];
    
    // Filter sessions for the selected date
    const sessionsOnDate = sessions.filter(session => session.date === date);
    
    // Collect all equipment bookings
    sessionsOnDate.forEach(session => {
      if (!session.equipmentBookings) return;
      
      // Only process the selected equipment type
      const bookingsForType = session.equipmentBookings[selectedEquipment];
      if (!bookingsForType) return;
      
      // Handle both array and legacy formats
      const bookingsList = Array.isArray(bookingsForType) 
        ? bookingsForType 
        : [bookingsForType];
      
      // Process each booking
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
        
        // Add booking to the list
        allBookings.push({
          sessionId: session.id,
          sessionName: session.name,
          trainer: session.trainer,
          room: session.room,
          startTime: session.startTime,
          slotTime,
          slotLabel
        });
      });
    });
    
    // Sort bookings by time
    return allBookings.sort((a, b) => {
      const timeA = new Date(`2000-01-01T${a.slotTime}`).getTime();
      const timeB = new Date(`2000-01-01T${b.slotTime}`).getTime();
      return timeA - timeB;
    });
  }, [sessions, date, selectedEquipment]);

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
  
  return (
    <div className={cn("flex flex-col space-y-2 p-3 bg-background border rounded-md w-72", className)}>
      <div className="flex items-center">
        {getEquipmentIcon(selectedEquipment)}
        <h3 className="ml-2 font-semibold text-sm">{getEquipmentName(selectedEquipment)} Schedule</h3>
      </div>
      <Separator />
      
      {bookings.length === 0 ? (
        <div className="text-xs text-muted-foreground italic py-2">
          No bookings for this equipment on the selected date
        </div>
      ) : (
        Object.entries(bookingsByHour).map(([hour, hourBookings]) => (
          <div key={hour} className="mb-2">
            <div className="text-xs font-semibold mb-1 text-muted-foreground">
              {formatTimeDisplay(`${hour}:00`)}
            </div>
            <div className="pl-3 border-l-2 border-amber-200 space-y-2">
              {hourBookings.map((booking, index) => (
                <div
                  key={`${booking.sessionId}-${index}`}
                  className="bg-amber-50 border border-amber-200 rounded-sm px-2 py-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{booking.sessionName}</div>
                    <div className="text-amber-600 font-medium">{formatTimeDisplay(booking.slotTime)}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {booking.trainer} • {booking.room}
                  </div>
                  <div className="mt-1 text-[10px] flex items-center text-amber-600">
                    <ChevronRight className="h-3 w-3 mr-1" /> 
                    {booking.slotLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EquipmentSchedule;