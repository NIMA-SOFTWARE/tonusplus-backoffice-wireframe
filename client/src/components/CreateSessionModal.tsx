import React, { useState, useEffect } from 'react';
import { PilatesSession, createSessionSchema, SessionStatus, EquipmentTimeSlot } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isLaserAvailable, isReformerAvailable, isCadillacAvailable, isBarrelAvailable, isChairAvailable } from '@/lib/localStorage';

// Component for booking laser equipment
interface LaserBookingSectionProps {
  form: any;
  date: string;
  startTime: string;
  duration: number;
  editSession?: PilatesSession;
}

const LaserBookingSection: React.FC<LaserBookingSectionProps> = ({ form, date, startTime, duration, editSession }) => {
  const [useLaser, setUseLaser] = useState<boolean>(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availabilityChecked, setAvailabilityChecked] = useState<boolean>(false);
  const [timeSlotAvailability, setTimeSlotAvailability] = useState<{[key: string]: boolean}>({});
  
  // Initialize with edit session data if available
  useEffect(() => {
    if (editSession?.equipmentBookings?.laser) {
      setUseLaser(true);
      const startMin = editSession.equipmentBookings.laser.startMinute;
      if (startMin === 0) setSelectedTimeSlot('0-15');
      else if (startMin === 15) setSelectedTimeSlot('15-30');
      else if (startMin === 30) setSelectedTimeSlot('30-45');
      else if (startMin === 45) setSelectedTimeSlot('45-60');
    }
  }, [editSession]);
  
  // Update form when selections change
  useEffect(() => {
    if (!useLaser) {
      form.setValue('equipmentBookings', undefined);
      return;
    }
    
    if (selectedTimeSlot) {
      const [start, end] = selectedTimeSlot.split('-').map(Number);
      form.setValue('equipmentBookings', {
        laser: {
          startMinute: start,
          endMinute: end
        }
      });
    }
  }, [useLaser, selectedTimeSlot, form]);
  
  // Check availability when date or time changes
  useEffect(() => {
    if (!date || !startTime || !duration || !useLaser) {
      setAvailabilityChecked(false);
      return;
    }
    
    // Only check if we have valid data
    if (date.match(/^\d{4}-\d{2}-\d{2}$/) && startTime.match(/^\d{2}:\d{2}$/)) {
      const slots = ['0-15', '15-30', '30-45', '45-60'];
      const availability: {[key: string]: boolean} = {};
      
      // Skip checking for time slots beyond session duration
      const maxMinutes = Math.min(60, duration);
      
      slots.forEach(slot => {
        const [start, end] = slot.split('-').map(Number);
        if (end <= maxMinutes) {
          // If editing, consider the current session's booking as available
          if (editSession && editSession.equipmentBookings?.laser) {
            const currentStart = editSession.equipmentBookings.laser.startMinute;
            const currentEnd = editSession.equipmentBookings.laser.endMinute;
            
            if (start === currentStart && end === currentEnd) {
              availability[slot] = true;
              return;
            }
          }
          
          availability[slot] = isLaserAvailable(date, startTime, start, end);
        } else {
          availability[slot] = false; // Not available if beyond session duration
        }
      });
      
      setTimeSlotAvailability(availability);
      setAvailabilityChecked(true);
      
      // If previously selected time slot is now unavailable, clear it
      if (selectedTimeSlot && !availability[selectedTimeSlot]) {
        setSelectedTimeSlot(null);
      }
    }
  }, [date, startTime, duration, useLaser, editSession]);
  
  const handleCheckboxChange = (checked: boolean) => {
    setUseLaser(checked);
    if (!checked) {
      setSelectedTimeSlot(null);
    }
  };
  
  const handleTimeSlotChange = (value: string) => {
    setSelectedTimeSlot(value);
  };
  
  const timeSlots = [
    { id: '0-15', label: 'First 15 minutes (0-15 min)' },
    { id: '15-30', label: 'Second 15 minutes (15-30 min)' },
    { id: '30-45', label: 'Third 15 minutes (30-45 min)' },
    { id: '45-60', label: 'Last 15 minutes (45-60 min)' }
  ];
  
  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox 
          id="use-laser" 
          checked={useLaser}
          onCheckedChange={handleCheckboxChange}
        />
        <label
          htmlFor="use-laser"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Book laser equipment for this session
        </label>
      </div>
      
      {useLaser && (
        <div className="mt-2">
          <FormLabel className="block mb-2">Select 15-minute time slot:</FormLabel>
          <RadioGroup 
            value={selectedTimeSlot || ''}
            onValueChange={handleTimeSlotChange}
            className="space-y-2"
          >
            {timeSlots.map(slot => {
              // Only show slots that fit within the session duration
              const [, end] = slot.id.split('-').map(Number);
              if (end > duration) return null;
              
              const isAvailable = availabilityChecked ? timeSlotAvailability[slot.id] : true;
              const isDisabled = !isAvailable && (!editSession || !editSession.equipmentBookings?.laser || 
                  editSession.equipmentBookings.laser.startMinute !== parseInt(slot.id.split('-')[0], 10));
              
              return (
                <div 
                  key={slot.id} 
                  className={`flex items-start space-x-2 ${isDisabled ? 'opacity-50' : ''}`}
                >
                  <RadioGroupItem 
                    value={slot.id} 
                    id={`laser-time-${slot.id}`} 
                    disabled={isDisabled}
                  />
                  <label
                    htmlFor={`laser-time-${slot.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col"
                  >
                    <span>{slot.label}</span>
                    {!isAvailable && availabilityChecked && (
                      <span className="text-xs text-red-500 mt-1">
                        {isDisabled ? 'Not available - already booked' : 'Currently booked by this session'}
                      </span>
                    )}
                  </label>
                </div>
              );
            })}
          </RadioGroup>
          
          {!availabilityChecked && (
            <p className="text-xs text-amber-600 mt-2">
              Enter valid date and time to check equipment availability
            </p>
          )}
          
          {availabilityChecked && !selectedTimeSlot && (
            <p className="text-xs text-amber-600 mt-2">
              Please select an available time slot
            </p>
          )}
        </div>
      )}
    </div>
  );
};

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
          <DialogDescription>
            Fill out the form to {editSession ? 'update' : 'create'} a session.
          </DialogDescription>
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
            
            {/* Equipment Booking Section */}
            <div className="border rounded-md p-4 bg-slate-50">
              <h3 className="font-medium mb-2">Equipment Booking</h3>
              <p className="text-sm text-slate-500 mb-3">Book the studio's laser equipment for this session.</p>
              
              <LaserBookingSection 
                form={form} 
                date={form.watch('date')} 
                startTime={form.watch('startTime')} 
                duration={form.watch('duration')}
                editSession={editSession}
              />
            </div>
            
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