import React, { useState, useEffect } from 'react';
import { PilatesSession, CreateSessionInput } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import { format, addDays, subDays, isSameDay, parseISO, isToday, 
  startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';
import { formatTimeRange, cn } from '@/lib/utils';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import CreateSessionModal from './CreateSessionModal';
import EquipmentSchedule from './EquipmentSchedule';
import EquipmentTooltip from './EquipmentTooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  onSessionClick?: (session: PilatesSession) => void;
  isAdminView?: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onSessionClick, isAdminView = false }) => {
  const { filteredSessions, addSession, editSession, filters } = usePilates();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rooms, setRooms] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  // We no longer need to track selected equipment since we show all types
  
  // Create session modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSessionData, setNewSessionData] = useState<{
    date: string;
    startTime: string;
    room: string;
    location: string | null;
  } | null>(null);

  // Time slots from 6:00 to 22:00 with hourly increments
  useEffect(() => {
    const slots: string[] = [];
    for (let hour = 6; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    setTimeSlots(slots);
  }, []);

  // Always use a fixed list of rooms to ensure all columns are visible
  useEffect(() => {
    // Define standard rooms that are always displayed
    const standardRooms = ['Studio A', 'Studio B', 'Reformer Room', 'Private Room'];
    
    // Extract any additional unique rooms from sessions that aren't in our standard list
    const sessionRooms = Array.from(new Set(filteredSessions.map(session => session.room)));
    const additionalRooms = sessionRooms.filter(room => !standardRooms.includes(room));
    
    // Combine standard rooms with any additional unique rooms
    setRooms([...standardRooms, ...additionalRooms]);
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

  const getSessionsForTimeAndRoom = (timeSlot: string, room: string): PilatesSession[] => {
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    // For spanning multiple rows, we only want sessions that START in this time slot
    return filteredSessions.filter(session => {
      // Match date and room
      const matchesDate = session.date === formattedDate;
      const matchesRoom = session.room === room;
      
      if (!matchesDate || !matchesRoom) return false;
      
      // Calculate session time
      const [sessionStartHourStr] = session.startTime.split(':');
      const [timeSlotHourStr] = timeSlot.split(':');
      
      const sessionStartHour = parseInt(sessionStartHourStr, 10);
      const timeSlotHour = parseInt(timeSlotHourStr, 10);
      
      // Only return sessions that start exactly at this time slot
      return timeSlotHour === sessionStartHour;
    });
  };

  // Helper to check if a session spans multiple hours
  const isMultiHourSession = (session: PilatesSession): boolean => {
    return session.duration > 60;
  };
  
  // Calculate the row span for a session based on its duration
  const calculateRowSpan = (session: PilatesSession): number => {
    // For rowSpan to work correctly, we need to use a full hour-based calculation
    // 30min → 1 row, 60min → 1 row, 90min → 2 rows, 120min → 2 rows, 180min → 3 rows
    return Math.ceil(session.duration / 60);
  };

  // Get sessions for a specific day in week view
  const getSessionsForDay = (day: Date): PilatesSession[] => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    return filteredSessions.filter(session => session.date === formattedDate);
  };

  // Handle creating a new session when clicking on an empty slot
  const handleCreateSessionClick = (timeSlot: string, room: string, date: Date) => {
    if (!isAdminView) return;
    
    setNewSessionData({
      date: format(date, 'yyyy-MM-dd'),
      startTime: timeSlot,
      room: room,
      location: filters.location
    });
    setIsCreateModalOpen(true);
  };
  
  // Handle drag end for rescheduling
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !isAdminView) return;
    
    const { draggableId, destination } = result;
    const [destRoom, destTimeSlot, destDate] = destination.droppableId.split('|');
    
    // Find the session that was dragged
    const session = filteredSessions.find(s => s.id === draggableId);
    
    if (session) {
      // Update the session with new room and time
      editSession(session.id, {
        ...session,
        room: destRoom,
        startTime: destTimeSlot,
        date: destDate
      });
    }
  };
  
  // Handle creation of a new session
  const handleCreateSession = (sessionData: CreateSessionInput) => {
    addSession(sessionData);
    setIsCreateModalOpen(false);
    setNewSessionData(null);
  };
  
  // Format time slot for equipment booking display
  const formatTimeSlot = (startMinute: number, endMinute: number): string => {
    const startMinutes = Math.floor(startMinute % 60);
    const endMinutes = Math.floor(endMinute % 60);
    
    const timeLabel = `${startMinutes}-${endMinutes}min`;
    
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
  
  // Get booked equipment from a session
  const getBookedEquipment = (session: PilatesSession) => {
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

  // Render a session card with visual indicators for multi-hour sessions
  const renderSessionCell = (sessions: PilatesSession[], timeSlot?: string) => {
    if (sessions.length === 0) {
      return null;
    }
    
    return sessions.map((session, index) => {
      // Calculate if this is the first occurrence of this session (at its starting time slot)
      const isStartTimeSlot = !timeSlot || (
        timeSlot.split(':')[0] === session.startTime.split(':')[0]
      );
      
      // For sessions spanning multiple hours, add special styling
      const isMultiHourSession = session.duration > 60;
      
      return (
        <Draggable 
          key={session.id} 
          draggableId={session.id}
          index={index}
          isDragDisabled={!isAdminView}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={() => onSessionClick && onSessionClick(session)}
              className={`p-2 rounded text-xs cursor-pointer border-l-4 status-${session.status} hover:opacity-90 relative shadow-sm ${
                isMultiHourSession ? 'border-2 border-indigo-200 bg-white' : ''
              } ${!isStartTimeSlot ? 'bg-indigo-50/60' : ''}`}
              style={{
                ...provided.draggableProps.style,
                borderLeftColor: getActivityColor(session.name),
                height: isMultiHourSession ? '100%' : `${(session.duration / 60) * 100}%`,
                boxShadow: isMultiHourSession ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' : '',
                margin: isMultiHourSession ? '0 0 2px 0' : ''
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold">{session.name}</div>
                {isMultiHourSession && (
                  <span className="bg-indigo-100 text-indigo-800 px-1 rounded text-[10px] font-medium whitespace-nowrap">
                    {Math.floor(session.duration / 60)}h{session.duration % 60 > 0 ? `${session.duration % 60}m` : ''}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-1">
                <div>{formatTimeRange(session.startTime, session.duration)}</div>
                
                {/* Show "Continued" badge for sessions in their non-starting time slots */}
                {!isStartTimeSlot && (
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-1 rounded text-[10px] font-medium">
                    Continued
                  </span>
                )}
              </div>
              
              <div className="text-xs text-slate-500">{session.trainer}</div>
              <div className="text-xs mt-1">
                <span className="font-medium">{session.participants.length}</span>
                <span className="text-slate-500">/{session.maxSpots}</span>
                {session.waitlist.length > 0 && 
                  <span className="ml-1 text-amber-600">+{session.waitlist.length} waiting</span>
                }
              </div>
              
              {/* Equipment icons in bottom right corner */}
              {session.equipmentBookings && (
                <div className="absolute bottom-0.5 right-0.5 flex space-x-1 bg-white/30 px-1 rounded-sm">
                  {Array.from(new Set(
                    getBookedEquipment(session).map(item => item.type)
                  )).map((type, index) => (
                    <EquipmentTooltip 
                      key={index} 
                      type={type}
                      timeSlot={getBookedEquipment(session)
                        .filter(item => item.type === type)
                        .map(item => item.timeSlot)
                        .join(', ')}
                    >
                      <div className="cursor-help text-sm">
                        {getEquipmentIcon(type)}
                      </div>
                    </EquipmentTooltip>
                  ))}
                </div>
              )}
            </div>
          )}
        </Draggable>
      );
    });
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

  // Render day view (rooms as columns, hours as rows)
  const renderDayView = () => {
    // Track cells that should be skipped because they're part of rowspan
    const cellsToSkip = new Map<string, boolean>();
    
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="w-20 p-2 border-r border-b border-slate-200 text-left text-xs font-medium text-slate-500">Time</th>
                {rooms.map((room, idx) => (
                  <th key={`room-${idx}`} className="p-2 border-b border-slate-200 text-center min-w-[180px] text-sm font-medium text-slate-700">
                    {room}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot, timeIndex) => (
                <tr key={`timeslot-${timeIndex}`} className={timeIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-2 border-r border-b border-slate-200 text-xs font-medium text-slate-500 whitespace-nowrap">
                    {timeSlot}
                  </td>
                  {rooms.map((room, roomIdx) => {
                    // Check if we should skip this cell due to a rowspan
                    const cellKey = `${room}-${timeIndex}`;
                    if (cellsToSkip.has(cellKey)) {
                      return null; // Skip rendering this cell
                    }
                    
                    const sessions = getSessionsForTimeAndRoom(timeSlot, room);
                    const droppableId = `${room}|${timeSlot}|${format(currentDate, 'yyyy-MM-dd')}`;
                    
                    // If there's a multi-hour session at this slot, calculate rowspan
                    // and mark future slots to be skipped
                    if (sessions.length > 0) {
                      const session = sessions[0]; // Assuming one session per slot for simplicity
                      if (isMultiHourSession(session)) {
                        const rowSpan = calculateRowSpan(session);
                        
                        // Mark future cells to be skipped due to rowspan
                        for (let i = 1; i < rowSpan && timeIndex + i < timeSlots.length; i++) {
                          cellsToSkip.set(`${room}-${timeIndex + i}`, true);
                        }
                        
                        // Return cell with rowSpan
                        return (
                          <Droppable droppableId={droppableId} key={droppableId}>
                            {(provided, snapshot) => (
                              <td
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                key={`${room}-${timeSlot}-${roomIdx}`}
                                rowSpan={rowSpan}
                                className={`p-1 border-b border-slate-200 align-top ${
                                  snapshot.isDraggingOver ? 'bg-indigo-50' : ''
                                } ${isAdminView ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                                style={{ height: `${60 * rowSpan}px` }}
                              >
                                {/* Only render at the start slot, but with increased height proportionate to duration */}
                                <div className="h-full relative" style={{ height: '100%' }}>
                                  {renderSessionCell(sessions, timeSlot)}
                                  {provided.placeholder}
                                </div>
                              </td>
                            )}
                          </Droppable>
                        );
                      }
                    }
                    
                    // Regular single-hour cell
                    return (
                      <Droppable droppableId={droppableId} key={droppableId}>
                        {(provided, snapshot) => (
                          <td
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            key={`${room}-${timeSlot}-${roomIdx}`}
                            className={`p-1 border-b border-slate-200 align-top ${
                              snapshot.isDraggingOver ? 'bg-indigo-50' : ''
                            } ${isAdminView ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                            style={{ height: '60px' }}
                            onClick={isAdminView ? 
                              () => handleCreateSessionClick(timeSlot, room, currentDate) : undefined}
                          >
                            <div className="h-full relative">
                              {sessions.length > 0 ? (
                                renderSessionCell(sessions, timeSlot)
                              ) : isAdminView ? (
                                <div className="h-full border border-dashed border-slate-200 rounded flex items-center justify-center">
                                  <span className="text-slate-400 text-xl">+</span>
                                </div>
                              ) : null}
                              {provided.placeholder}
                            </div>
                          </td>
                        )}
                      </Droppable>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DragDropContext>
    );
  };

  // Render week view (days as columns, rooms as rows)
  const renderWeekView = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="w-32 p-2 border-r border-b border-slate-200 text-left text-xs font-medium text-slate-500">Room</th>
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
            {rooms.map((room, roomIdx) => (
              <tr key={`room-week-${roomIdx}`} className={roomIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-2 border-r border-b border-slate-200 font-medium whitespace-nowrap">
                  {room}
                </td>
                {weekDates.map((day, dayIdx) => {
                  const sessionsForDay = getSessionsForDay(day).filter(session => session.room === room);
                  // Creating a droppableId that includes info about the day and room
                  const droppableId = `${room}|09:00|${format(day, 'yyyy-MM-dd')}`;
                  
                  return (
                    <Droppable droppableId={droppableId} key={droppableId}>
                      {(provided, snapshot) => (
                        <td 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          key={`${room}-${dayIdx}`} 
                          className={`p-1 border-b border-slate-200 align-top min-h-[100px] h-24 ${
                            snapshot.isDraggingOver ? 'bg-indigo-50' : ''
                          } ${isAdminView ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                          onClick={isAdminView && sessionsForDay.length === 0 ? 
                            () => handleCreateSessionClick('09:00', room, day) : undefined}
                        >
                          <div className="h-full">
                            {renderSessionCell(sessionsForDay)}
                            {provided.placeholder}
                            
                            {/* Empty cell placeholder with + sign for admin mode */}
                            {isAdminView && sessionsForDay.length === 0 && (
                              <div className="h-full border border-dashed border-slate-200 rounded flex items-center justify-center">
                                <span className="text-slate-400 text-xl">+</span>
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </Droppable>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DragDropContext>
  );

  // Equipment tabs removed as requested

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
          
          {/* Date display with calendar popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "justify-start font-medium text-left text-slate-800 hover:bg-slate-100",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>
                  {viewMode === 'day' 
                    ? format(currentDate, 'EEEE, MMMM d, yyyy')
                    : `${format(weekDates[0], 'MMM d')} - ${format(weekDates[6], 'MMM d, yyyy')}`
                  }
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => {
                  if (date) {
                    setCurrentDate(date);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <button 
            className="p-1 rounded hover:bg-slate-100"
            onClick={viewMode === 'day' ? goToNextDay : goToNextWeek}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <div className="bg-slate-100 rounded-md p-0.5 flex text-sm">
            <button
              className={`px-3 py-1 rounded-md ${viewMode === 'day' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
            <button
              className={`px-3 py-1 rounded-md ${viewMode === 'week' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
          </div>
          
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

      {/* Equipment tabs removed as requested */}

      <div className="flex flex-col lg:flex-row">
        <div className="flex-grow overflow-auto">
          {viewMode === 'day' ? renderDayView() : renderWeekView()}
        </div>
        
        {/* Equipment Schedule (visible only in admin view) */}
        {isAdminView && viewMode === 'day' && (
          <div className="w-full lg:w-80 p-4 border-t lg:border-t-0 lg:border-l border-slate-200">
            <EquipmentSchedule 
              sessions={filteredSessions} 
              date={format(currentDate, 'yyyy-MM-dd')}
              onSessionClick={onSessionClick}
            />
          </div>
        )}
      </div>
      
      {/* Create session modal */}
      {isCreateModalOpen && newSessionData && (
        <CreateSessionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          initialData={{
            date: newSessionData.date,
            startTime: newSessionData.startTime,
            room: newSessionData.room,
            location: newSessionData.location
          }}
          onCreateSession={handleCreateSession}
        />
      )}
    </div>
  );
};

export default CalendarView;