import React, { useState } from 'react';
import { PilatesSession, bookSessionSchema } from '@shared/schema';
import { generateUniqueId, formatDate, formatTimeRange } from '@/lib/utils';
import { usePilates } from '@/context/PilatesContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface BookingModalProps {
  session: PilatesSession | null;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = bookSessionSchema.omit({ sessionId: true });

const BookingModal: React.FC<BookingModalProps> = ({ session, isOpen, onClose }) => {
  const { bookUserSession } = usePilates();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      notes: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await bookUserSession(session.id, {
        id: generateUniqueId(),
        ...values
      });
      
      if (result.success) {
        toast({
          title: result.isWaitlisted ? 'Added to waitlist' : 'Booking successful',
          description: result.message,
        });
        onClose();
        form.reset();
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
    ? `Full (waitlist: ${session.waitlist.length}/${session.maxWaitlist})` 
    : `${availableSpots} spot${availableSpots === 1 ? '' : 's'} available`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isWaitlist ? 'Join Waitlist' : 'Book Session'}: {session.name}
          </DialogTitle>
          <DialogDescription>
            {formatDate(session.date)} · {formatTimeRange(session.startTime, session.duration)}<br />
            Instructor: {session.trainer}<br />
            Room: {session.room}<br />
            {spotText}
            {session.equipmentBookings?.laser && (
              <>
                <div className="mt-2 text-sm font-medium text-amber-600">
                  ⚡ Laser equipment booked: {
                    (() => {
                      const { startMinute, endMinute } = session.equipmentBookings.laser;
                      if (startMinute === 0 && endMinute === 15) return 'First 15 minutes';
                      if (startMinute === 15 && endMinute === 30) return 'Second 15 minutes';
                      if (startMinute === 30 && endMinute === 45) return 'Third 15 minutes';
                      if (startMinute === 45 && endMinute === 60) return 'Last 15 minutes';
                      return `Minutes ${startMinute}-${endMinute}`;
                    })()
                  }
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : isWaitlist ? 'Join Waitlist' : 'Confirm Booking'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
