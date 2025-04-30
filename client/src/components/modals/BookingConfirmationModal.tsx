import React from 'react';
import { Session } from '@/lib/types';
import { formatDate, formatTimeRange } from '@/utils/date-utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  bookingType: 'regular' | 'waitlist';
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  session,
  bookingType 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-center">
            {bookingType === 'regular' ? 'Booking Successful!' : 'Added to Waiting List!'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {bookingType === 'regular' ? (
              `You have successfully booked a spot for ${session.activity} with ${session.trainer} on ${formatDate(session.date)} at ${formatTimeRange(session.startTime, session.duration)}.`
            ) : (
              `You have been added to the waiting list for ${session.activity} with ${session.trainer} on ${formatDate(session.date)} at ${formatTimeRange(session.startTime, session.duration)}. We'll notify you if a spot becomes available.`
            )}
          </p>
        </div>
        
        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationModal;
