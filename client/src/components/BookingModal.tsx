import React, { useState } from 'react';
import { PilatesSession } from '@shared/schema';
import { generateUniqueId, formatDate, formatTimeRange } from '@/lib/utils';
import { usePilates } from '@/context/PilatesContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Clock, User } from 'lucide-react';

interface BookingModalProps {
  session: PilatesSession | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ session, isOpen, onClose }) => {
  const { bookUserSession } = usePilates();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a default user for bookings
  const defaultUser = {
    id: generateUniqueId(),
    name: "John Doe",
    email: "customer@example.com",
    phone: "555-1234",
    notes: ""
  };

  const handleConfirm = async () => {
    if (!session) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await bookUserSession(session.id, defaultUser);
      
      if (result.success) {
        toast({
          title: result.isWaitlisted ? 'Added to waitlist' : 'Booking successful',
          description: result.message,
        });
        onClose();
      } else {
        toast({
          title: 'Booking failed',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!session) return null;
  
  const isWaitlist = session.participants.length >= session.maxSpots;
  const availableSpots = session.maxSpots - session.participants.length;
  const spotText = isWaitlist 
    ? `Full ${session.enableWaitlist ? `(waitlist: ${session.waitlist.length} people)` : '(no waitlist available)'}` 
    : `${availableSpots} spot${availableSpots === 1 ? '' : 's'} available`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            {isWaitlist && session.enableWaitlist ? 'Join Waitlist' : 'Book Session'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-4 border rounded-md bg-gradient-to-br from-indigo-50 to-slate-50">
            <h3 className="font-semibold text-lg mb-2 text-indigo-800">{session.name}</h3>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                <span>{formatDate(session.date)}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-indigo-600" />
                <span>{formatTimeRange(session.startTime, session.duration)}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-indigo-600" />
                <span>Instructor: {session.trainer}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Location: {session.location}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Room: {session.room}</span>
              </div>
              
              <div className="flex items-center text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className={isWaitlist ? "text-amber-600" : "text-green-600"}>
                  {spotText}
                </span>
              </div>
            </div>
            
            {/* Display equipment */}
            {session.equipmentBookings && Object.entries(session.equipmentBookings).length > 0 && (
              <div className="mt-3 pt-3 border-t border-indigo-100">
                <h4 className="text-sm font-medium mb-2 text-indigo-700">Equipment:</h4>
                <div className="space-y-1">
                  {Object.entries(session.equipmentBookings).map(([type, bookings]) => {
                    if (!bookings || bookings.length === 0) return null;
                    
                    // Get equipment icon
                    let icon = '📊';
                    if (type === 'laser') icon = '⚡';
                    else if (type === 'reformer') icon = '🔄';
                    else if (type === 'cadillac') icon = '🛏️';
                    else if (type === 'barrel') icon = '🛢️';
                    else if (type === 'chair') icon = '🪑';
                    
                    return (
                      <div key={type}>
                        {Array.isArray(bookings) ? (
                          // Handle array of time slots (new format)
                          bookings.map((booking, idx) => {
                            // Format time slot
                            let timeLabel = '';
                            const { startMinute, endMinute } = booking;
                            if (startMinute === 0 && endMinute === 15) timeLabel = 'First 15 minutes';
                            else if (startMinute === 15 && endMinute === 30) timeLabel = 'Second 15 minutes';
                            else if (startMinute === 30 && endMinute === 45) timeLabel = 'Third 15 minutes';
                            else if (startMinute === 45 && endMinute === 60) timeLabel = 'Last 15 minutes';
                            else timeLabel = `Minutes ${startMinute}-${endMinute}`;
                            
                            return (
                              <div key={`${type}-${idx}`} className="text-sm text-amber-600">
                                {icon} {type.charAt(0).toUpperCase() + type.slice(1)}: {timeLabel}
                              </div>
                            );
                          })
                        ) : (
                          // Handle single time slot (legacy format)
                          <div className="text-sm text-amber-600">
                            {icon} {type.charAt(0).toUpperCase() + type.slice(1)}: {
                              (() => {
                                const booking = bookings as any;
                                let timeLabel = '';
                                if (booking.startMinute === 0 && booking.endMinute === 15) timeLabel = 'First 15 minutes';
                                else if (booking.startMinute === 15 && booking.endMinute === 30) timeLabel = 'Second 15 minutes';
                                else if (booking.startMinute === 30 && booking.endMinute === 45) timeLabel = 'Third 15 minutes';
                                else if (booking.startMinute === 45 && booking.endMinute === 60) timeLabel = 'Last 15 minutes';
                                else timeLabel = `Minutes ${booking.startMinute}-${booking.endMinute}`;
                                return timeLabel;
                              })()
                            }
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Confirmation message */}
          <div className="flex items-start p-3 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              {isWaitlist && session.enableWaitlist ? (
                <p>This session is full. Clicking 'Join Waitlist' will add you to the waiting list. You'll be notified if a spot becomes available.</p>
              ) : (
                <p>Clicking 'Confirm Booking' will book your spot for this session. Please arrive 10 minutes before the start time.</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || (isWaitlist && !session.enableWaitlist)}
            className={isWaitlist && session.enableWaitlist ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {isSubmitting 
              ? 'Processing...' 
              : (isWaitlist && session.enableWaitlist) 
                ? 'Join Waitlist' 
                : 'Confirm Booking'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
