import React, { useEffect } from 'react';
import { PilatesSession } from '@shared/schema';
import SessionCard from './SessionCard';

const TestEquipmentSession: React.FC = () => {
  // Create a test session with all equipment types booked
  const testSession: PilatesSession = {
    id: 'test-session',
    name: 'Test Equipment',
    trainer: 'Test Trainer',
    room: 'Test Room',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    duration: 60,
    maxSpots: 10,
    enableWaitlist: true,
    status: 'open',
    participants: [],
    waitlist: [],
    createdAt: new Date().toISOString(),
    equipmentBookings: {
      laser: [{ startMinute: 0, endMinute: 15 }],
      reformer: [{ startMinute: 15, endMinute: 30 }],
      cadillac: [{ startMinute: 30, endMinute: 45 }],
      barrel: [{ startMinute: 45, endMinute: 60 }],
      chair: [{ startMinute: 0, endMinute: 60 }]
    }
  };

  useEffect(() => {
    console.log('Created test session with equipment bookings');
  }, []);

  return (
    <div className="border border-slate-200 rounded-md p-2">
      <div className="text-sm font-medium mb-2">Equipment Icons Test</div>
      <div className="w-64">
        <SessionCard session={testSession} onClick={() => {}} />
      </div>
    </div>
  );
};

export default TestEquipmentSession;