import React, { useEffect } from 'react';
import { PilatesSession } from '@shared/schema';
import { generateUniqueId } from '@/lib/utils';
import { usePilates } from '@/context/PilatesContext';
import SessionCard from './SessionCard';

const TestEquipmentSession: React.FC = () => {
  const { addSession, sessions } = usePilates();
  
  useEffect(() => {
    // Create a test session with equipment bookings if it doesn't exist
    const testSessionExists = sessions.some(s => s.name === 'Test Equipment Session');
    
    if (!testSessionExists) {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      const testSession: PilatesSession = {
        id: generateUniqueId(),
        name: 'Test Equipment Session',
        trainer: 'Test Trainer',
        room: 'Room A',
        date: dateStr,
        startTime: '10:00',
        duration: 60,
        maxSpots: 10,
        enableWaitlist: true,
        status: 'open',
        participants: [],
        waitlist: [],
        createdAt: new Date().toISOString(),
        equipmentBookings: {
          laser: [
            { startMinute: 0, endMinute: 15 }
          ],
          reformer: [
            { startMinute: 15, endMinute: 30 }
          ],
          cadillac: [
            { startMinute: 30, endMinute: 45 }
          ],
          barrel: [
            { startMinute: 45, endMinute: 60 }
          ],
          chair: [
            { startMinute: 0, endMinute: 15 }
          ]
        }
      };
      
      addSession(testSession);
      console.log('Created test session with equipment bookings');
    }
  }, [sessions, addSession]);
  
  // Find the test session
  const testSession = sessions.find(s => s.name === 'Test Equipment Session');
  
  if (!testSession) {
    return <div>Creating test session...</div>;
  }
  
  return (
    <div className="p-4 border rounded m-4">
      <h2 className="text-lg font-semibold mb-4">Test Session with Equipment Bookings</h2>
      <div className="w-64 h-auto">
        <SessionCard session={testSession} onClick={() => {}} />
      </div>
    </div>
  );
};

export default TestEquipmentSession;