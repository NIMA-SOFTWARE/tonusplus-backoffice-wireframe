import React, { useState } from 'react';
import { Session, Participant } from '@/lib/types';
import { useAppContext } from '@/context/AppContext';
import { formatTime, formatDate } from '@/utils/date-utils';
import { getStatusLabel, getStatusColor } from '@/utils/session-utils';
import BookingConfirmationModal from './modals/BookingConfirmationModal';
import { CalendarIcon, Clock, Users } from 'lucide-react';

interface SessionCardProps {
  session: Session;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const { bookSession, joinWaitingList } = useAppContext();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState<'regular' | 'waitlist'>('regular');
  
  const handleBookSession = () => {
    // In a real app, we would collect user information through a form
    // For demo purposes, we'll create a mock participant
    const mockParticipant: Participant = {
      id: Date.now().toString(),
      name: 'Jane Doe',
      email: 'jane.doe@example.com'
    };
    
    const success = bookSession(session.id, mockParticipant);
    if (success) {
      setBookingType('regular');
      setShowBookingModal(true);
    }
  };
  
  const handleJoinWaitingList = () => {
    // In a real app, we would collect user information through a form
    // For demo purposes, we'll create a mock participant
    const mockParticipant: Participant = {
      id: Date.now().toString(),
      name: 'Jane Doe',
      email: 'jane.doe@example.com'
    };
    
    const success = joinWaitingList(session.id, mockParticipant);
    if (success) {
      setBookingType('waitlist');
      setShowBookingModal(true);
    }
  };
  
  const availableSpots = session.capacity - session.participants.length;
  const isFullyBooked = availableSpots <= 0;
  const hasWaitingList = session.waitingList.length > 0;
  
  return (
    <>
      <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{session.activity}</h3>
              <p className="mt-1 text-sm text-gray-500">with {session.trainer}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
              {getStatusLabel(session.status)}
            </span>
          </div>
          <div className="mt-4 text-sm">
            <div className="flex items-center text-gray-700 mb-1">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {formatDate(session.date)}
            </div>
            <div className="flex items-center text-gray-700 mb-1">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(session.startTime, session.duration)}
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="h-4 w-4 mr-2" />
              {isFullyBooked ? (
                hasWaitingList ? (
                  <><span className="text-amber-500 font-medium">Full</span>&nbsp;- Waiting list available</>
                ) : (
                  <span className="text-red-600 font-medium">Fully Booked</span>
                )
              ) : (
                <><span className="text-green-600 font-medium">{availableSpots}</span>&nbsp;spots available</>
              )}
            </div>
          </div>
          <div className="mt-5">
            {session.status === 'open' && !isFullyBooked && (
              <button 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={handleBookSession}
              >
                Book Session
              </button>
            )}
            {session.status === 'open' && isFullyBooked && hasWaitingList && (
              <button 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                onClick={handleJoinWaitingList}
              >
                Join Waiting List
              </button>
            )}
            {(session.status !== 'open' || (isFullyBooked && !hasWaitingList)) && (
              <button 
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-50 cursor-not-allowed"
                disabled
              >
                No Spots Available
              </button>
            )}
          </div>
        </div>
      </div>
      
      <BookingConfirmationModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)}
        session={session}
        bookingType={bookingType}
      />
    </>
  );
};

export default SessionCard;
