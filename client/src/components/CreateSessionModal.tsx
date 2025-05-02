import React, { useState } from 'react';
import { PilatesSession, createSessionSchema, SessionStatus } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editSession?: PilatesSession;
  initialData?: {
    date: string;
    startTime: string;
    room: string;
  };
  onCreateSession?: (sessionData: any) => void;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ 
  isOpen, 
  onClose, 
  editSession,
  initialData,
  onCreateSession
}) => {
  const { addSession, editSession: updateSession } = usePilates();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const activities = ['Mat Pilates', 'Reformer Pilates', 'Barre Fusion', 'Prenatal Pilates'];
  const trainers = ['Sarah Johnson', 'Mike Davis', 'Emma Wilson'];
  const rooms = ['Studio A', 'Studio B', 'Reformer Room', 'Private Room'];
  
  // Determine default values based on provided data
  let defaultValues;
  if (editSession) {
    defaultValues = {
      name: editSession.name,
      trainer: editSession.trainer,
      room: editSession.room,
      date: editSession.date,
      startTime: editSession.startTime,
      duration: editSession.duration,
      maxSpots: editSession.maxSpots,
      maxWaitlist: editSession.maxWaitlist,
      status: editSession.status
    };
  } else if (initialData) {
    defaultValues = {
      name: 'Mat Pilates',
      trainer: 'Sarah Johnson',
      room: initialData.room || 'Studio A',
      date: initialData.date || new Date().toISOString().split('T')[0],
      startTime: initialData.startTime || '10:00',
      duration: 60,
      maxSpots: 8,
      maxWaitlist: 5,
      status: 'open' as SessionStatus
    };
  } else {
    defaultValues = {
      name: 'Mat Pilates',
      trainer: 'Sarah Johnson',
      room: 'Studio A',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      duration: 60,
      maxSpots: 8,
      maxWaitlist: 5,
      status: 'open' as SessionStatus
    };
  }
  
  const form = useForm<z.infer<typeof createSessionSchema>>({
    resolver: zodResolver(createSessionSchema),
    defaultValues
  });
  
  const onSubmit = async (values: z.infer<typeof createSessionSchema>) => {
    setIsSubmitting(true);
    
    try {
      if (editSession) {
        // Update existing session
        const result = await updateSession(editSession.id, values);
        if (result) {
          toast({
            title: 'Success',
            description: 'Session updated successfully',
          });
          onClose();
        }
      } else {
        // Create new session
        if (onCreateSession) {
          // Use the provided callback
          onCreateSession(values);
          toast({
            title: 'Success',
            description: 'Session created successfully',
          });
          onClose();
        } else {
          // Use the context method
          const result = await addSession(values);
          if (result) {
            toast({
              title: 'Success',
              description: 'Session created successfully',
            });
            onClose();
          }
        }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editSession ? 'Edit Session' : 'Create New Session'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an activity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activities.map(activity => (
                        <SelectItem key={activity} value={activity}>
                          {activity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="trainer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainer</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trainer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trainers.map(trainer => (
                        <SelectItem key={trainer} value={trainer}>
                          {trainer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (min)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="15" 
                        step="15" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="maxSpots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Spots</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxWaitlist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Waitlist</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="finished">Finished</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : editSession ? 'Update Session' : 'Create Session'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;
