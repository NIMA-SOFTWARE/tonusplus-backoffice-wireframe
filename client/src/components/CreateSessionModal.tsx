import React, { useState, useEffect } from 'react';
import { PilatesSession, createSessionSchema, SessionStatus, EquipmentTimeSlot } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import { useToast } from '@/hooks/use-toast';
import { formatDate, formatTime, cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isLaserAvailable, isReformerAvailable, isCadillacAvailable, isBarrelAvailable, isChairAvailable } from '@/lib/localStorage';

// Component for booking equipment
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
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
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
    // Reset state
    setUseEquipment(false);
    setSelectedTimeSlots([]);
    
    // Set values if edit session has this equipment
    if (editSession?.equipmentBookings?.[equipmentType]?.length) {
      setUseEquipment(true);
      const slots = editSession.equipmentBookings[equipmentType]!.map(slot => {
        const startMin = slot.startMinute;
        if (startMin === 0) return '0-15';
        else if (startMin === 15) return '15-30';
        else if (startMin === 30) return '30-45';
        else if (startMin === 45) return '45-60';
        return '';
      }).filter(slot => slot !== '');
      
      setSelectedTimeSlots(slots);
    }
  }, [editSession, equipmentType]);
  
  // Update form when selections change
  useEffect(() => {
    const currentBookings = form.getValues('equipmentBookings') || {};
    
    if (!useEquipment || selectedTimeSlots.length === 0) {
      // Remove this equipment from bookings
      const { [equipmentType]: removed, ...rest } = currentBookings;
      form.setValue('equipmentBookings', Object.keys(rest).length ? rest : undefined);
      return;
    }
    
    // Convert selected time slots to equipment time slot objects
    const timeSlotObjects = selectedTimeSlots.map(slot => {
      const [start, end] = slot.split('-').map(Number);
      return {
        startMinute: start,
        endMinute: end
      };
    });
    
    form.setValue('equipmentBookings', {
      ...currentBookings,
      [equipmentType]: timeSlotObjects
    });
  }, [useEquipment, selectedTimeSlots, form, equipmentType]);
  
  // Check availability when date or time changes
  useEffect(() => {
    if (!date || !startTime || !duration || !useEquipment) {
      setAvailabilityChecked(false);
      return;
    }
    
    // Check availability for each time slot
    const availability: {[key: string]: boolean} = {};
    
    for (const slot of timeSlots) {
      const [start, end] = slot.id.split('-').map(Number);
      
      // Skip slots that don't fit within the duration
      if (end > duration) continue;
      
      // If editing, consider the current booking as available
      if (editSession?.equipmentBookings?.[equipmentType]?.length) {
        const isCurrentlyBooked = editSession.equipmentBookings[equipmentType]!.some(
          booking => booking.startMinute === start
        );
        
        if (isCurrentlyBooked) {
          availability[slot.id] = true;
          continue;
        }
      }
      
      // Check if this time slot is available
      availability[slot.id] = checkAvailability(date, startTime, start, end);
    }
    
    setTimeSlotAvailability(availability);
    setAvailabilityChecked(true);
    
    // Filter out any selected time slots that are now unavailable
    setSelectedTimeSlots(prev => 
      prev.filter(slotId => availability[slotId])
    );
  }, [date, startTime, duration, useEquipment, editSession, equipmentType]);
  
  const handleTimeSlotSelect = (selectedSlots: string[]) => {
    // If no slots selected, set useEquipment to false
    if (selectedSlots.length === 0) {
      setUseEquipment(false);
      setSelectedTimeSlots([]);
      return;
    }
    
    setUseEquipment(true);
    setSelectedTimeSlots(selectedSlots);
  };
  
  const timeSlots = [
    { id: '0-15', label: 'First 15 minutes (0-15 min)' },
    { id: '15-30', label: 'Second 15 minutes (15-30 min)' },
    { id: '30-45', label: 'Third 15 minutes (30-45 min)' },
    { id: '45-60', label: 'Last 15 minutes (45-60 min)' }
  ];
  
  // Filter available time slots based on duration and availability
  const availableTimeSlots = timeSlots
    .filter(slot => {
      // Only show slots that fit within the session duration
      const [start, end] = slot.id.split('-').map(Number);
      if (end > duration) return false;
      
      // Check if slot is available or already selected in edit mode
      const isAvailable = availabilityChecked ? timeSlotAvailability[slot.id] : true;
      const isInEditSession = editSession?.equipmentBookings?.[equipmentType]?.some(
        booking => booking.startMinute === parseInt(slot.id.split('-')[0], 10)
      );
      
      return isAvailable || isInEditSession;
    })
    .map(slot => {
      // Format the time slot as HH:MM based on session start time
      let label = slot.label;
      
      if (startTime) {
        const [start, end] = slot.id.split('-').map(Number);
        const [hours, minutes] = startTime.split(':').map(Number);
        
        const startTimeDate = new Date();
        startTimeDate.setHours(hours, minutes + start, 0);
        
        const endTimeDate = new Date();
        endTimeDate.setHours(hours, minutes + end, 0);
        
        const formatTimeValue = (date: Date) => {
          return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        };
        
        label = `${formatTimeValue(startTimeDate)} - ${formatTimeValue(endTimeDate)}`;
      }
      
      return {
        value: slot.id,
        label: label
      };
    });

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label.charAt(0).toUpperCase() + label.slice(1)} Time Slots
      </Label>
      
      <Select
        onValueChange={(value) => {
          if (value === "") {
            setUseEquipment(false);
            setSelectedTimeSlots([]);
          } else {
            setUseEquipment(true);
          }
        }}
        value={useEquipment ? "use" : ""}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Don't use</SelectItem>
          <SelectItem value="use">Use this equipment</SelectItem>
        </SelectContent>
      </Select>
      
      {useEquipment && (
        <>
          {availableTimeSlots.length > 0 ? (
            <div className="mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-8 text-xs"
                  >
                    {selectedTimeSlots.length > 0
                      ? `${selectedTimeSlots.length} time slot${selectedTimeSlots.length > 1 ? 's' : ''} selected`
                      : "Select time slots"}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search time slots..." className="h-9 text-xs" />
                    <CommandList>
                      <CommandEmpty>No time slots available</CommandEmpty>
                      <CommandGroup>
                        {availableTimeSlots.map((slot) => (
                          <CommandItem
                            key={slot.value}
                            onSelect={() => {
                              if (selectedTimeSlots.includes(slot.value)) {
                                setSelectedTimeSlots(prev => 
                                  prev.filter(x => x !== slot.value)
                                );
                              } else {
                                setSelectedTimeSlots(prev => [...prev, slot.value]);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedTimeSlots.includes(slot.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {slot.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {selectedTimeSlots.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTimeSlots.map(slotId => {
                    const slot = availableTimeSlots.find(s => s.value === slotId);
                    return (
                      <Badge 
                        key={slotId} 
                        variant="secondary"
                        className="text-xs py-0 h-5"
                      >
                        {slot?.label}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => {
                            setSelectedTimeSlots(prev => 
                              prev.filter(x => x !== slotId)
                            );
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-amber-600 mt-1">
              No available time slots for this equipment
            </p>
          )}
          
          {!availabilityChecked && (
            <p className="text-[10px] text-amber-600 mt-1">
              Enter valid date and time to check equipment availability
            </p>
          )}
        </>
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
      enableWaitlist: editSession.enableWaitlist,
      status: editSession.status,
      equipmentBookings: editSession.equipmentBookings
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
      enableWaitlist: true,
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
      enableWaitlist: true,
      status: 'open' as SessionStatus
    };
  }
  
  const form = useForm<z.infer<typeof createSessionSchema>>({
    resolver: zodResolver(createSessionSchema),
    defaultValues
  });
  
  // Reset form when editSession or initialData changes
  useEffect(() => {
    if (editSession) {
      form.reset({
        name: editSession.name,
        trainer: editSession.trainer,
        room: editSession.room,
        date: editSession.date,
        startTime: editSession.startTime,
        duration: editSession.duration,
        maxSpots: editSession.maxSpots,
        enableWaitlist: editSession.enableWaitlist,
        status: editSession.status,
        equipmentBookings: editSession.equipmentBookings
      });
    } else if (initialData) {
      form.reset({
        name: 'Mat Pilates',
        trainer: 'Sarah Johnson',
        room: initialData.room || 'Studio A',
        date: initialData.date || new Date().toISOString().split('T')[0],
        startTime: initialData.startTime || '10:00',
        duration: 60,
        maxSpots: 8,
        enableWaitlist: true,
        status: 'open' as SessionStatus,
        equipmentBookings: undefined
      });
    } else {
      form.reset({
        name: 'Mat Pilates',
        trainer: 'Sarah Johnson',
        room: 'Studio A',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        duration: 60,
        maxSpots: 8,
        enableWaitlist: true,
        status: 'open' as SessionStatus,
        equipmentBookings: undefined
      });
    }
  }, [editSession, initialData, form]);
  
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
            {editSession 
              ? `Edit Session: ${editSession.name} - ${formatDate(editSession.date)} ${formatTime(editSession.startTime)}`
              : 'Create New Session'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Fill out the form below
          </DialogDescription>
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
                          value={field.value}
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
                          value={field.value}
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
                          value={field.value}
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
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value.toString()}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="90">90 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Third row - Capacity & Waitlist */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="maxSpots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Max Spots</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
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
                    name="enableWaitlist"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-start space-x-3 space-y-0 pt-4 ml-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-xs">
                            Enable Waitlist
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Fourth row - Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Session Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="on going">On Going</SelectItem>
                          <SelectItem value="finished">Finished</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="equipment" className="pt-2 space-y-3">
                <div className="text-sm text-muted-foreground mb-4">
                  Select equipment needed for this session
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div className="font-medium text-sm">Laser Equipment</div>
                    <EquipmentBookingSection 
                      form={form} 
                      date={form.watch('date')} 
                      startTime={form.watch('startTime')} 
                      duration={form.watch('duration')}
                      editSession={editSession}
                      equipmentType="laser"
                      label="laser equipment"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div className="font-medium text-sm">Reformer Equipment</div>
                    <EquipmentBookingSection 
                      form={form} 
                      date={form.watch('date')} 
                      startTime={form.watch('startTime')} 
                      duration={form.watch('duration')}
                      editSession={editSession}
                      equipmentType="reformer"
                      label="reformer equipment"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div className="font-medium text-sm">Cadillac Equipment</div>
                    <EquipmentBookingSection 
                      form={form} 
                      date={form.watch('date')} 
                      startTime={form.watch('startTime')} 
                      duration={form.watch('duration')}
                      editSession={editSession}
                      equipmentType="cadillac"
                      label="cadillac equipment"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div className="font-medium text-sm">Barrel Equipment</div>
                    <EquipmentBookingSection 
                      form={form} 
                      date={form.watch('date')} 
                      startTime={form.watch('startTime')} 
                      duration={form.watch('duration')}
                      editSession={editSession}
                      equipmentType="barrel"
                      label="barrel equipment"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div className="font-medium text-sm">Chair Equipment</div>
                    <EquipmentBookingSection 
                      form={form} 
                      date={form.watch('date')} 
                      startTime={form.watch('startTime')} 
                      duration={form.watch('duration')}
                      editSession={editSession}
                      equipmentType="chair"
                      label="chair equipment"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : editSession ? 'Update Session' : 'Create Session'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;