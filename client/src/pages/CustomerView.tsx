import React, { useState } from 'react';
import { usePilates } from '@/context/PilatesContext';
import { PilatesSession } from '@shared/schema';
import FilterSection from '@/components/FilterSection';
import CalendarView from '@/components/CalendarView';
import UpcomingSessionsList from '@/components/UpcomingSessionsList';
import BookingModal from '@/components/BookingModal';

const CustomerView: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<PilatesSession | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  
  const handleSessionClick = (session: PilatesSession) => {
    setSelectedSession(session);
    setBookingModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setBookingModalOpen(false);
    setSelectedSession(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-800">Available Sessions</h2>
        <FilterSection />
      </div>

      <CalendarView onSessionClick={handleSessionClick} />
      
      <UpcomingSessionsList onBookSession={handleSessionClick} />
      
      <BookingModal 
        session={selectedSession} 
        isOpen={bookingModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default CustomerView;
