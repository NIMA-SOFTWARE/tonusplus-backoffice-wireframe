import React, { useState, useEffect } from 'react';
import { PilatesSession } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import { format, addMonths, subMonths, getMonth, getYear, parseISO, isSameDay, isToday } from 'date-fns';
import { getDaysInMonth, getPreviousMonthDays, getNextMonthDays } from '@/lib/utils';
import SessionCard from './SessionCard';

interface CalendarViewProps {
  onSessionClick?: (session: PilatesSession) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onSessionClick }) => {
  const { filteredSessions } = usePilates();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    // Get all the dates needed for the calendar grid
    const year = getYear(currentDate);
    const month = getMonth(currentDate);
    
    const prevMonthDays = getPreviousMonthDays(year, month);
    const currMonthDays = getDaysInMonth(year, month);
    const nextMonthDays = getNextMonthDays(year, month);
    
    setCalendarDays([...prevMonthDays, ...currMonthDays, ...nextMonthDays]);
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getSessionsForDay = (day: Date): PilatesSession[] => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    return filteredSessions.filter(session => session.date === formattedDate);
  };

  const renderDayCell = (day: Date, index: number) => {
    const isCurrentMonth = getMonth(day) === getMonth(currentDate);
    const dayClasses = `min-h-[120px] bg-white p-1 ${!isCurrentMonth ? 'opacity-50' : ''}`;
    const sessionsForDay = getSessionsForDay(day);
    const dateLabel = format(day, 'd');
    
    return (
      <div key={index} className={dayClasses}>
        <div className={`text-right text-xs p-1 font-medium ${isToday(day) ? 'bg-indigo-100 rounded-full w-6 h-6 flex items-center justify-center ml-auto' : 'text-slate-500'}`}>
          {dateLabel}
        </div>
        <div className="space-y-1">
          {sessionsForDay.map((session) => (
            <SessionCard 
              key={session.id} 
              session={session} 
              onClick={() => onSessionClick && onSessionClick(session)} 
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded hover:bg-slate-100"
            onClick={goToPreviousMonth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h3 className="text-base font-medium text-slate-800">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <button 
            className="p-1 rounded hover:bg-slate-100"
            onClick={goToNextMonth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div>
          <button 
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            onClick={goToToday}
          >
            Today
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
        <div className="py-2 text-center font-medium">Sun</div>
        <div className="py-2 text-center font-medium">Mon</div>
        <div className="py-2 text-center font-medium">Tue</div>
        <div className="py-2 text-center font-medium">Wed</div>
        <div className="py-2 text-center font-medium">Thu</div>
        <div className="py-2 text-center font-medium">Fri</div>
        <div className="py-2 text-center font-medium">Sat</div>
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-200">
        {calendarDays.map((day, index) => renderDayCell(day, index))}
      </div>
    </div>
  );
};

export default CalendarView;
