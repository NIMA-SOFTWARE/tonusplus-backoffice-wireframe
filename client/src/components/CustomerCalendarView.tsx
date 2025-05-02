import React, { useState, useEffect } from 'react';
import { PilatesSession } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import { format, addDays, subDays, isSameDay, parseISO, isToday } from 'date-fns';
import { formatTimeRange } from '@/lib/utils';

interface CustomerCalendarViewProps {
  onSessionClick?: (session: PilatesSession) => void;
}

const CustomerCalendarView: React.FC<CustomerCalendarViewProps> = ({ onSessionClick }) => {
  const { filteredSessions } = usePilates();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  
  // Time slots from 6:00 to 22:00 with hourly increments
  useEffect(() => {
    const slots: string[] = [];
    for (let hour = 6; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    setTimeSlots(slots);
  }, []);

  // Extract unique activities from sessions plus add standard activities
  useEffect(() => {
    const standardActivities = ['Mat Pilates', 'Reformer Pilates', 'Barre Fusion', 'Prenatal Pilates'];
    
    // Extract any additional unique activities from sessions that aren't in our standard list
    const sessionActivities = Array.from(new Set(filteredSessions.map(session => session.name)));
    const additionalActivities = sessionActivities.filter(activity => !standardActivities.includes(activity));
    
    // Combine standard activities with any additional unique activities
    setActivities([...standardActivities, ...additionalActivities]);
  }, [filteredSessions]);

  // Generate week days whenever current date changes
  useEffect(() => {
    const dates: Date[] = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      dates.push(day);
    }
    setWeekDates(dates);
  }, [currentDate]);

  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Navigation functions for week view
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const getSessionsForTimeAndActivity = (timeSlot: string, activity: string): PilatesSession[] => {
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    // Filter sessions for the current date, activity, and time slot
    return filteredSessions.filter(session => {
      // Match date and activity name
      const matchesDate = session.date === formattedDate;
      const matchesActivity = session.name === activity;
      
      // Check if this session's time overlaps with the current time slot
      const sessionStartHour = parseInt(session.startTime.split(':')[0], 10);
      const timeSlotHour = parseInt(timeSlot.split(':')[0], 10);
      
      // Session starts during this time slot
      return matchesDate && matchesActivity && sessionStartHour === timeSlotHour;
    });
  };

  // Get sessions for a specific day in week view
  const getSessionsForDay = (day: Date): PilatesSession[] => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    return filteredSessions.filter(session => session.date === formattedDate);
  };

  // Render a session cell
  const renderSessionCell = (sessions: PilatesSession[]) => {
    if (sessions.length === 0) {
      return null;
    }
    
    return sessions.map((session) => (
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

  // Render day view (activities as columns, hours as rows)
  const renderDayView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50">
            <th className="w-20 p-2 border-r border-b border-slate-200 text-left text-xs font-medium text-slate-500">Time</th>
            {activities.map((activity, idx) => (
              <th key={`activity-${idx}`} className="p-2 border-b border-slate-200 text-center min-w-[180px] text-sm font-medium text-slate-700">
                {activity}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot, index) => (
            <tr key={`timeslot-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="p-2 border-r border-b border-slate-200 text-xs font-medium text-slate-500 whitespace-nowrap">
                {timeSlot}
              </td>
              {activities.map((activity, activityIdx) => {
                const sessions = getSessionsForTimeAndActivity(timeSlot, activity);
                
                return (
                  <td
                    key={`${activity}-${timeSlot}-${activityIdx}`}
                    className="p-1 border-b border-slate-200 align-top min-h-[60px]"
                  >
                    {renderSessionCell(sessions)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render week view (days as columns, sessions as list items)
  const renderWeekView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50">
            <th className="w-32 p-2 border-r border-b border-slate-200 text-left text-xs font-medium text-slate-500">Activity</th>
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
          {activities.map((activity, activityIdx) => (
            <tr key={`activity-week-${activityIdx}`} className={activityIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="p-2 border-r border-b border-slate-200 font-medium whitespace-nowrap">
                {activity}
              </td>
              {weekDates.map((day, dayIdx) => {
                const sessionsForDay = getSessionsForDay(day).filter(session => session.name === activity);
                
                return (
                  <td 
                    key={`${activity}-${dayIdx}`} 
                    className="p-1 border-b border-slate-200 align-top min-h-[100px] h-24"
                  >
                    <div className="space-y-1">
                      {sessionsForDay.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => onSessionClick && onSessionClick(session)}
                          className={`p-2 rounded text-xs mb-1 cursor-pointer border-l-4 status-${session.status} hover:opacity-90 relative shadow-sm`}
                          style={{
                            borderLeftColor: getActivityColor(session.name)
                          }}
                        >
                          <div className="font-semibold">{formatTimeRange(session.startTime, session.duration)}</div>
                          <div className="text-xs text-slate-500">Room: {session.room}</div>
                          <div className="text-xs text-slate-500">Trainer: {session.trainer}</div>
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
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between">
        <div className="flex space-x-2 items-center">
          <button 
            className="p-1 rounded hover:bg-slate-100"
            onClick={viewMode === 'day' ? goToPreviousDay : goToPreviousWeek}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h3 className="text-base font-medium text-slate-800">
            {viewMode === 'day' 
              ? format(currentDate, 'EEEE, MMMM d, yyyy')
              : `${format(weekDates[0], 'MMM d')} - ${format(weekDates[6], 'MMM d, yyyy')}`
            }
          </h3>
          <button 
            className="p-1 rounded hover:bg-slate-100"
            onClick={viewMode === 'day' ? goToNextDay : goToNextWeek}
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
        <div className="flex mt-2 md:mt-0">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'day'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700 hover:text-indigo-700 hover:bg-indigo-50'
              }`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700 hover:text-indigo-700 hover:bg-indigo-50'
              }`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
          </div>
        </div>
      </div>
      
      {viewMode === 'day' ? renderDayView() : renderWeekView()}
    </div>
  );
};

export default CustomerCalendarView;