import React, { useState } from 'react';
import { PilatesSession } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isToday } from 'date-fns';
import { formatTimeRange } from '@/lib/utils';

interface CustomerCalendarViewProps {
  onSessionClick?: (session: PilatesSession) => void;
}

const CustomerCalendarView: React.FC<CustomerCalendarViewProps> = ({ onSessionClick }) => {
  const { filteredSessions } = usePilates();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Generate weekly time slots
  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 6; // Start at 6 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  
  // Generate days of the week
  const weekDates = React.useMemo(() => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const getActivityColor = (activity: string): string => {
    switch (activity) {
      case 'Mat Pilates': return '#4F46E5'; // indigo
      case 'Reformer Pilates': return '#0EA5E9'; // sky
      case 'Barre Fusion': return '#EC4899'; // pink
      case 'Prenatal Pilates': return '#14B8A6'; // teal
      default: return '#8B5CF6'; // violet
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between">
        <div className="flex space-x-2 items-center">
          <button 
            className="p-1 rounded hover:bg-slate-100"
            onClick={goToPreviousWeek}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h3 className="text-base font-medium text-slate-800">
            {`${format(weekDates[0], 'MMM d')} - ${format(weekDates[6], 'MMM d, yyyy')}`}
          </h3>
          <button 
            className="p-1 rounded hover:bg-slate-100"
            onClick={goToNextWeek}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            className="ml-2 px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded hover:bg-indigo-50"
            onClick={goToToday}
          >
            Today
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="w-20 p-2 border-r border-b border-slate-200 text-left text-xs font-medium text-slate-500">Time</th>
              {weekDates.map((day, idx) => (
                <th 
                  key={`day-${idx}`} 
                  className={`p-2 border-b border-slate-200 text-center min-w-[160px] text-sm font-medium ${isToday(day) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
                >
                  <div>{format(day, 'EEE')}</div>
                  <div className="text-base">{format(day, 'd')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, timeIdx) => (
              <tr key={`time-${timeIdx}`} className={timeIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-2 border-r border-b border-slate-200 font-medium whitespace-nowrap text-xs">
                  {timeSlot}
                </td>
                {weekDates.map((day, dayIdx) => {
                  const formattedDate = format(day, 'yyyy-MM-dd');
                  const sessionsForTimeSlot = filteredSessions.filter(session => {
                    // Match date
                    const matchesDate = session.date === formattedDate;
                    
                    // Check if session starts during this time slot
                    const sessionStartHour = parseInt(session.startTime.split(':')[0], 10);
                    const timeSlotHour = parseInt(timeSlot.split(':')[0], 10);
                    
                    return matchesDate && sessionStartHour === timeSlotHour;
                  });
                  
                  return (
                    <td 
                      key={`time-${timeSlot}-day-${dayIdx}`} 
                      className="p-1 border-b border-slate-200 align-top min-h-[80px]"
                    >
                      <div className="space-y-1">
                        {sessionsForTimeSlot.map((session) => (
                          <div
                            key={session.id}
                            onClick={() => onSessionClick && onSessionClick(session)}
                            className={`p-2 rounded text-xs mb-1 cursor-pointer border-l-4 status-${session.status} hover:opacity-90 relative shadow-sm`}
                            style={{
                              borderLeftColor: getActivityColor(session.name)
                            }}
                          >
                            <div className="font-semibold">{session.name}</div>
                            <div>{formatTimeRange(session.startTime, session.duration)}</div>
                            <div className="text-xs text-slate-500">Room: {session.room}</div>
                            <div className="text-xs text-slate-500">Trainer: {session.trainer}</div>
                            <div className="text-xs mt-1">
                              <span className="font-medium">{session.participants.length}</span>
                              <span className="text-slate-500">/{session.maxSpots}</span>
                              {session.waitlist.length > 0 && 
                                <span className="ml-1 text-amber-600">+{session.waitlist.length} waiting</span>
                              }
                            </div>
                          </div>
                        ))}
                      </div>
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

export default CustomerCalendarView;