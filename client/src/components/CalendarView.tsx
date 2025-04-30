import React, { useState, useEffect } from 'react';
import { PilatesSession } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import { format, addDays, subDays, isSameDay, parseISO, isToday } from 'date-fns';
import { formatTimeRange } from '@/lib/utils';

interface CalendarViewProps {
  onSessionClick?: (session: PilatesSession) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onSessionClick }) => {
  const { filteredSessions } = usePilates();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rooms, setRooms] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Time slots from 6:00 to 22:00 with hourly increments
  useEffect(() => {
    const slots: string[] = [];
    for (let hour = 6; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    setTimeSlots(slots);
  }, []);

  // Extract unique rooms from sessions
  useEffect(() => {
    const uniqueRooms = Array.from(new Set(filteredSessions.map(session => session.room)));
    setRooms(uniqueRooms.length > 0 ? uniqueRooms : ['Studio A', 'Studio B', 'Reformer Room', 'Private Room']);
  }, [filteredSessions]);

  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getSessionsForTimeAndRoom = (timeSlot: string, room: string): PilatesSession[] => {
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    // Filter sessions for the current date, room, and time slot
    return filteredSessions.filter(session => {
      // Match date and room
      const matchesDate = session.date === formattedDate;
      const matchesRoom = session.room === room;
      
      // Check if this session's time overlaps with the current time slot
      const sessionStartHour = parseInt(session.startTime.split(':')[0], 10);
      const timeSlotHour = parseInt(timeSlot.split(':')[0], 10);
      
      // Session starts during this time slot
      return matchesDate && matchesRoom && sessionStartHour === timeSlotHour;
    });
  };

  const renderSessionCell = (sessions: PilatesSession[]) => {
    if (sessions.length === 0) {
      return null;
    }
    
    return sessions.map(session => (
      <div 
        key={session.id}
        onClick={() => onSessionClick && onSessionClick(session)}
        className={`p-2 rounded text-xs mb-1 cursor-pointer border-l-4 status-${session.status} hover:opacity-90 relative shadow-sm`}
        style={{ borderLeftColor: getActivityColor(session.name) }}
      >
        <div className="font-semibold">{session.name}</div>
        <div>{formatTimeRange(session.startTime, session.duration)}</div>
        <div className="text-xs text-slate-500">{session.trainer}</div>
        <div className="text-xs mt-1">
          <span className="font-medium">{session.participants.length}</span>
          <span className="text-slate-500">/{session.maxSpots}</span>
          {session.waitlist.length > 0 && 
            <span className="ml-1 text-amber-600">+{session.waitlist.length} waiting</span>
          }
        </div>
      </div>
    ));
  };

  const getActivityColor = (activity: string): string => {
    switch (activity) {
      case 'Mat Pilates':
        return '#4F46E5'; // indigo
      case 'Reformer Pilates':
        return '#0EA5E9'; // sky
      case 'Barre Fusion':
        return '#EC4899'; // pink
      case 'Prenatal Pilates':
        return '#14B8A6'; // teal
      default:
        return '#8B5CF6'; // violet
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded hover:bg-slate-100"
            onClick={goToPreviousDay}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h3 className="text-base font-medium text-slate-800">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <button 
            className="p-1 rounded hover:bg-slate-100"
            onClick={goToNextDay}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div>
          {!isToday(currentDate) && (
            <button 
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={goToToday}
            >
              Today
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="w-20 p-2 border-r border-b border-slate-200 text-left text-xs font-medium text-slate-500">Time</th>
              {rooms.map(room => (
                <th key={room} className="p-2 border-b border-slate-200 text-center min-w-[180px] text-sm font-medium text-slate-700">
                  {room}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, index) => (
              <tr key={timeSlot} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-2 border-r border-b border-slate-200 text-xs font-medium text-slate-500 whitespace-nowrap">
                  {timeSlot}
                </td>
                {rooms.map(room => {
                  const sessions = getSessionsForTimeAndRoom(timeSlot, room);
                  return (
                    <td key={`${room}-${timeSlot}`} className="p-1 border-b border-slate-200 align-top">
                      {renderSessionCell(sessions)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarView;
