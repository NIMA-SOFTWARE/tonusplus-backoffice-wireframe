import React, { useState } from 'react';
import { PilatesSession, Participant } from '@shared/schema';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { usePilates } from '@/context/PilatesContext';
import { formatTimeRange } from '@/lib/utils';
import { AlertCircle, Users, ClockIcon, CheckCircle, X, Calendar, MapPin, Plus, PlusCircle } from 'lucide-react';
import AddParticipantForm from '@/components/AddParticipantForm';

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: PilatesSession;
  onEdit?: (session: PilatesSession) => void;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  isOpen,
  onClose,
  session,
  onEdit
}) => {
  const { removeSession, editSession, cancelUserBooking, sessions } = usePilates();
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showAddWaitlist, setShowAddWaitlist] = useState(false);
  
  // Get all unique customers from all sessions for autocomplete
  const existingCustomers = React.useMemo(() => {
    const customersMap = new Map<string, Participant>();
    
    // Add all participants from all sessions
    sessions.forEach(s => {
      s.participants.forEach(p => {
        if (!customersMap.has(p.email)) {
          customersMap.set(p.email, p);
        }
      });
      
      // Add all waitlist participants too
      s.waitlist.forEach(p => {
        if (!customersMap.has(p.email)) {
          customersMap.set(p.email, p);
        }
      });
    });
    
    return Array.from(customersMap.values());
  }, [sessions]);

  // Format date in a more readable format
  const formattedDate = format(new Date(session.date), 'EEEE, MMMM d, yyyy');
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-800';
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-orange-100 text-orange-800';
      case 'on going': return 'bg-blue-100 text-blue-800';
      case 'finished': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // Handle removing a participant from the session
  const handleRemoveParticipant = async (participant: Participant) => {
    if (window.confirm(`Are you sure you want to remove ${participant.name} from this session?`)) {
      const result = await cancelUserBooking(session.id, participant.email);
      if (result.success) {
        alert('Participant removed successfully');
      } else {
        alert(`Failed to remove participant: ${result.message}`);
      }
    }
  };

  // Handle removing a person from waiting list
  const handleRemoveFromWaitingList = async (participant: Participant) => {
    if (window.confirm(`Are you sure you want to remove ${participant.name} from the waiting list?`)) {
      // Create a new session object with the updated waitlist
      const updatedSession = {
        ...session,
        waitlist: session.waitlist.filter(p => p.email !== participant.email)
      };
      
      const result = await editSession(session.id, updatedSession);
      if (result) {
        alert('Participant removed from waiting list successfully');
      } else {
        alert('Failed to remove participant from waiting list');
      }
    }
  };

  // Handle cancelling a session
  const handleCancelSession = async () => {
    if (window.confirm('Are you sure you want to cancel this session? All participants will be notified.')) {
      const updatedSession = {
        ...session,
        status: 'cancelled' as const
      };
      
      const result = await editSession(session.id, updatedSession);
      if (result) {
        alert('Session cancelled successfully');
        onClose();
      } else {
        alert('Failed to cancel session');
      }
    }
  };

  // Handle deleting a session
  const handleDeleteSession = async () => {
    if (window.confirm('Are you sure you want to DELETE this session? This action cannot be undone.')) {
      const result = await removeSession(session.id);
      if (result) {
        alert('Session deleted successfully');
        onClose();
      } else {
        alert('Failed to delete session');
      }
    }
  };
  
  // Handle adding a participant to the regular list
  const handleAddParticipant = async (participant: Participant) => {
    // Check if the session is full
    if (session.participants.length >= session.maxSpots) {
      alert('This session is already at full capacity. Consider adding to the waiting list instead.');
      return;
    }
    
    // Check if participant with same email already exists
    if (session.participants.some(p => p.email === participant.email)) {
      alert('This participant is already registered for this session.');
      return;
    }
    
    // Also check waitlist
    if (session.waitlist.some(p => p.email === participant.email)) {
      alert('This participant is already on the waiting list for this session.');
      return;
    }
    
    // Add participant to the session
    const updatedSession = {
      ...session,
      participants: [...session.participants, participant]
    };
    
    const result = await editSession(session.id, updatedSession);
    if (result) {
      alert('Participant added successfully');
      setShowAddParticipant(false);
    } else {
      alert('Failed to add participant');
    }
  };
  
  // Handle adding a participant to the waiting list
  const handleAddToWaitlist = async (participant: Participant) => {
    // Check if waitlist is enabled
    if (!session.enableWaitlist) {
      alert('Waiting list is not enabled for this session.');
      return;
    }
    
    // Check if participant with same email already exists in either list
    if (session.participants.some(p => p.email === participant.email)) {
      alert('This participant is already registered for this session.');
      return;
    }
    
    if (session.waitlist.some(p => p.email === participant.email)) {
      alert('This participant is already on the waiting list for this session.');
      return;
    }
    
    // Add participant to the waiting list
    const updatedSession = {
      ...session,
      waitlist: [...session.waitlist, participant]
    };
    
    const result = await editSession(session.id, updatedSession);
    if (result) {
      alert('Participant added to waiting list successfully');
      setShowAddWaitlist(false);
    } else {
      alert('Failed to add participant to waiting list');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <span className="mr-2">{session.name}</span>
            <Badge className={getStatusColor(session.status)}>
              {session.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {formattedDate}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ClockIcon className="h-4 w-4 mr-2" />
              {formatTimeRange(session.startTime, session.duration)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {session.room}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Trainer:</span> {session.trainer}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Available Spots:</span> {session.maxSpots - session.participants.length} of {session.maxSpots}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Waitlist:</span> {session.waitlist.length} {session.enableWaitlist ? 'enabled' : 'disabled'}
            </div>
          </div>
        </div>

        <Separator className="my-4" />
        
        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="participants" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Participants ({session.participants.length}/{session.maxSpots})
            </TabsTrigger>
            <TabsTrigger value="waitlist" className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Waiting List ({session.waitlist.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="participants" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Participant List</h3>
              {session.status !== 'cancelled' && session.participants.length < session.maxSpots && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAddParticipant(!showAddParticipant)}
                  className="flex items-center text-sm"
                >
                  {showAddParticipant ? <X className="h-4 w-4 mr-1" /> : <PlusCircle className="h-4 w-4 mr-1" />}
                  {showAddParticipant ? 'Cancel' : 'Add Participant'}
                </Button>
              )}
            </div>
            
            {showAddParticipant && (
              <div className="mb-6">
                <AddParticipantForm 
                  onAdd={handleAddParticipant} 
                  existingCustomers={existingCustomers} 
                />
              </div>
            )}
            
            {session.participants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No participants have signed up for this session yet.
              </div>
            ) : (
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-2 px-4 text-left font-medium">Name</th>
                      <th className="py-2 px-4 text-left font-medium">Email</th>
                      <th className="py-2 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.participants.map((participant, index) => (
                      <tr key={participant.id} className={index % 2 === 0 ? '' : 'bg-muted/30'}>
                        <td className="py-2 px-4">{participant.name}</td>
                        <td className="py-2 px-4">{participant.email}</td>
                        <td className="py-2 px-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveParticipant(participant)}
                            className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="waitlist" className="mt-4">
            {!session.enableWaitlist ? (
              <div className="text-center py-8 text-muted-foreground">
                Waiting list is not enabled for this session.
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Waiting List</h3>
                  {session.status !== 'cancelled' && session.enableWaitlist && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAddWaitlist(!showAddWaitlist)}
                      className="flex items-center text-sm"
                    >
                      {showAddWaitlist ? <X className="h-4 w-4 mr-1" /> : <PlusCircle className="h-4 w-4 mr-1" />}
                      {showAddWaitlist ? 'Cancel' : 'Add to Waitlist'}
                    </Button>
                  )}
                </div>
                
                {showAddWaitlist && (
                  <div className="mb-6">
                    <AddParticipantForm 
                      onAdd={handleAddToWaitlist} 
                      existingCustomers={existingCustomers} 
                    />
                  </div>
                )}
                
                {session.waitlist.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No one is on the waiting list for this session.
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-4 text-left font-medium">Name</th>
                          <th className="py-2 px-4 text-left font-medium">Email</th>
                          <th className="py-2 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {session.waitlist.map((participant, index) => (
                          <tr key={participant.id} className={index % 2 === 0 ? '' : 'bg-muted/30'}>
                            <td className="py-2 px-4">{participant.name}</td>
                            <td className="py-2 px-4">{participant.email}</td>
                            <td className="py-2 px-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveFromWaitingList(participant)}
                                className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <h4 className="text-sm font-medium mb-2">Equipment Bookings</h4>
            {!session.equipmentBookings || Object.keys(session.equipmentBookings).length === 0 ? (
              <div className="text-xs text-muted-foreground">No equipment bookings for this session.</div>
            ) : (
              <div className="space-y-1 text-sm">
                {Object.entries(session.equipmentBookings).map(([type, bookings]) => {
                  if (!bookings || (Array.isArray(bookings) && bookings.length === 0)) return null;
                  
                  // Handle both array and legacy formats
                  const bookingsList = Array.isArray(bookings) ? bookings : [bookings];
                  
                  return (
                    <div key={type} className="flex items-center">
                      <Badge variant="outline" className="mr-2 capitalize">{type}</Badge>
                      <span className="text-xs">
                        {bookingsList.map((booking, idx) => (
                          <span key={idx} className="ml-1">
                            {booking.startMinute}-{booking.endMinute} min
                            {idx < bookingsList.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            {/* Additional info could go here */}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center mt-6">
          <div className="flex space-x-2">
            <Button 
              variant="destructive" 
              onClick={handleCancelSession}
              disabled={session.status === 'cancelled'}
            >
              Cancel Session
            </Button>
            <Button 
              variant="outline" 
              className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50" 
              onClick={handleDeleteSession}
            >
              Delete Session
            </Button>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button 
                variant="default"
                onClick={() => {
                  onClose();
                  onEdit(session);
                }}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Edit Session
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailsModal;