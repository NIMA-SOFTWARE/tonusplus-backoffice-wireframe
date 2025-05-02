import React, { useState, useEffect } from 'react';
import { PilatesSession, createSessionSchema, SessionStatus, EquipmentTimeSlot } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
interface EquipmentBookingSectionProps {
  form: any;
  date: string;
  startTime: string;
  duration: number;
  editSession?: PilatesSession;
  equipmentType: 'laser' | 'reformer' | 'cadillac' | 'barrel' | 'chair';
  label: string;
}

const EquipmentBookingSection: React.FC<EquipmentBookingSectionProps> = ({ 
  form, 
  date, 
  startTime, 
  duration, 
  editSession,
  equipmentType,
  label
}) => {
  const [useEquipment, setUseEquipment] = useState<boolean>(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availabilityChecked, setAvailabilityChecked] = useState<boolean>(false);
  const [timeSlotAvailability, setTimeSlotAvailability] = useState<{[key: string]: boolean}>({});
  
  // Helper function to check availability based on equipment type
  const checkAvailability = (date: string, startTime: string, startMinute: number, endMinute: number) => {
    switch (equipmentType) {
      case 'laser': return isLaserAvailable(date, startTime, startMinute, endMinute);
      case 'reformer': return isReformerAvailable(date, startTime, startMinute, endMinute);
      case 'cadillac': return isCadillacAvailable(date, startTime, startMinute, endMinute);
      case 'barrel': return isBarrelAvailable(date, startTime, startMinute, endMinute);
      case 'chair': return isChairAvailable(date, startTime, startMinute, endMinute);
      default: return false;
    }
  };
  
  // Initialize with edit session data if available
  useEffect(() => {
    if (editSession?.equipmentBookings?.[equipmentType]) {
      setUseEquipment(true);
      const startMin = editSession.equipmentBookings[equipmentType]!.startMinute;
      if (startMin === 0) setSelectedTimeSlot('0-15');
      else if (startMin === 15) setSelectedTimeSlot('15-30');
      else if (startMin === 30) setSelectedTimeSlot('30-45');
      else if (startMin === 45) setSelectedTimeSlot('45-60');
    }
  }, [editSession, equipmentType]);
  
  // Update form when selections change
  useEffect(() => {
    const currentBookings = form.getValues('equipmentBookings') || {};
    
    if (!useEquipment) {
      // Remove this equipment from bookings
      const { [equipmentType]: removed, ...rest } = currentBookings;
      form.setValue('equipmentBookings', Object.keys(rest).length ? rest : undefined);
      return;
    }
    
    if (selectedTimeSlot) {
      const [start, end] = selectedTimeSlot.split('-').map(Number);
      form.setValue('equipmentBookings', {
        ...currentBookings,
        [equipmentType]: {
          startMinute: start,
          endMinute: end
        }
      });
    }
  }, [useEquipment, selectedTimeSlot, form, equipmentType]);
  
  // Check availability when date or time changes
  useEffect(() => {
    if (!date || !startTime || !duration || !useEquipment) {
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
          if (editSession && editSession.equipmentBookings?.[equipmentType]) {
            const currentStart = editSession.equipmentBookings[equipmentType]!.startMinute;
            const currentEnd = editSession.equipmentBookings[equipmentType]!.endMinute;
            
            if (start === currentStart && end === currentEnd) {
              availability[slot] = true;
              return;
            }
          }
          
          availability[slot] = checkAvailability(date, startTime, start, end);
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
  }, [date, startTime, duration, useEquipment, editSession, equipmentType]);
  
  const handleCheckboxChange = (checked: boolean) => {
    setUseEquipment(checked);
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
      <div className="flex items-center space-x-2 mb-2">
        <Checkbox 
          id={`use-${equipmentType}`} 
          checked={useEquipment}
          onCheckedChange={handleCheckboxChange}
        />
        <label
          htmlFor={`use-${equipmentType}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Book {label} for this session
        </label>
      </div>
      
      {useEquipment && (
        <div className="mt-2">
          <FormLabel className="block mb-2 text-xs">Select 15-minute time slot:</FormLabel>
          <RadioGroup 
            value={selectedTimeSlot || ''}
            onValueChange={handleTimeSlotChange}
            className="space-y-1"
          >
            {timeSlots.map(slot => {
              // Only show slots that fit within the session duration
              const [, end] = slot.id.split('-').map(Number);
              if (end > duration) return null;
              
              const isAvailable = availabilityChecked ? timeSlotAvailability[slot.id] : true;
              const isDisabled = !isAvailable && (!editSession || 
                !editSession.equipmentBookings?.[equipmentType] || 
                editSession.equipmentBookings[equipmentType]!.startMinute !== parseInt(slot.id.split('-')[0], 10));
              
              return (
                <div 
                  key={slot.id} 
                  className={`flex items-start space-x-2 ${isDisabled ? 'opacity-50' : ''}`}
                >
                  <RadioGroupItem 
                    value={slot.id} 
                    id={`${equipmentType}-time-${slot.id}`} 
                    disabled={isDisabled}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={`${equipmentType}-time-${slot.id}`}
                    className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col"
                  >
                    <span>{slot.label}</span>
                    {!isAvailable && availabilityChecked && (
                      <span className="text-[10px] text-red-500 mt-1">
                        {isDisabled ? 'Not available - already booked' : 'Currently booked by this session'}
                      </span>
                    )}
                  </label>
                </div>
              );
            })}
          </RadioGroup>
          
          {!availabilityChecked && (
            <p className="text-[10px] text-amber-600 mt-1">
              Enter valid date and time to check equipment availability
            </p>
          )}
          
          {availabilityChecked && !selectedTimeSlot && (
            <p className="text-[10px] text-amber-600 mt-1">
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
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editSession ? 'Edit Session' : 'Create New Session'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-3 pt-2">
                {/* First row - Activity, Trainer, Room */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Activity</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Activity" />
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
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="trainer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Trainer</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Trainer" />
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
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="room"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel className="text-xs">Room</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Room" />
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
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Second row - Date, Time, Duration */}
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Date</FormLabel>
                        <FormControl>
                          <Input type="date" className="h-8 text-xs" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" className="h-8 text-xs" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Duration (min)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="15" 
                            step="15"
                            className="h-8 text-xs"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Third row - Spots, Waitlist, Status */}
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="maxSpots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Max Spots</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            className="h-8 text-xs" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxWaitlist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Waitlist</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            className="h-8 text-xs" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="equipment">
                <Accordion type="single" collapsible defaultValue="laser" className="w-full">
                  <AccordionItem value="laser">
                    <AccordionTrigger className="text-sm py-2">
                      Laser Equipment
                    </AccordionTrigger>
                    <AccordionContent>
                      <EquipmentBookingSection 
                        form={form} 
                        date={form.watch('date')} 
                        startTime={form.watch('startTime')} 
                        duration={form.watch('duration')}
                        editSession={editSession}
                        equipmentType="laser"
                        label="laser equipment"
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="reformer">
                    <AccordionTrigger className="text-sm py-2">
                      Reformer Equipment
                    </AccordionTrigger>
                    <AccordionContent>
                      <EquipmentBookingSection 
                        form={form} 
                        date={form.watch('date')} 
                        startTime={form.watch('startTime')} 
                        duration={form.watch('duration')}
                        editSession={editSession}
                        equipmentType="reformer"
                        label="reformer equipment"
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="cadillac">
                    <AccordionTrigger className="text-sm py-2">
                      Cadillac Equipment
                    </AccordionTrigger>
                    <AccordionContent>
                      <EquipmentBookingSection 
                        form={form} 
                        date={form.watch('date')} 
                        startTime={form.watch('startTime')} 
                        duration={form.watch('duration')}
                        editSession={editSession}
                        equipmentType="cadillac"
                        label="cadillac equipment"
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="barrel">
                    <AccordionTrigger className="text-sm py-2">
                      Barrel Equipment
                    </AccordionTrigger>
                    <AccordionContent>
                      <EquipmentBookingSection 
                        form={form} 
                        date={form.watch('date')} 
                        startTime={form.watch('startTime')} 
                        duration={form.watch('duration')}
                        editSession={editSession}
                        equipmentType="barrel"
                        label="barrel equipment"
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="chair">
                    <AccordionTrigger className="text-sm py-2">
                      Chair Equipment
                    </AccordionTrigger>
                    <AccordionContent>
                      <EquipmentBookingSection 
                        form={form} 
                        date={form.watch('date')} 
                        startTime={form.watch('startTime')} 
                        duration={form.watch('duration')}
                        editSession={editSession}
                        equipmentType="chair"
                        label="chair equipment"
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={onClose} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-8 text-xs">
                {isSubmitting ? 'Processing...' : (editSession ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;