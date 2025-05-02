import React, { useState } from 'react';
import { PilatesSession, Participant } from '@shared/schema';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { usePilates } from '@/context/PilatesContext';
import { formatTimeRange } from '@/lib/utils';
import { AlertCircle, Users, ClockIcon, CheckCircle, X, Calendar, MapPin, Plus, PlusCircle, 
  UserPlus, ChevronsDown, FileEdit, Trash2, ExternalLink, ArrowUpRight, Dumbbell } from 'lucide-react';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent">
                {session.name}
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Session Status:</span>
                <Badge className={`${getStatusColor(session.status)} text-xs font-semibold`}>
                  {session.status}
                </Badge>
              </DialogDescription>
            </div>
            
            {/* Session Actions */}
            <div className="flex gap-2">
              {onEdit && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onEdit(session);
                  }}
                  className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  <FileEdit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleCancelSession}
                disabled={session.status === 'cancelled'}
              >
                <X className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-3 grid grid-cols-1 gap-6">
          {/* Session Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="mt-0.5 bg-indigo-100 p-1.5 rounded-md">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-xs text-muted-foreground">Date</div>
                    <div className="text-sm font-medium">{formattedDate}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-0.5 bg-indigo-100 p-1.5 rounded-md">
                    <ClockIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-xs text-muted-foreground">Time</div>
                    <div className="text-sm font-medium">{formatTimeRange(session.startTime, session.duration)}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-0.5 bg-indigo-100 p-1.5 rounded-md">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-xs text-muted-foreground">Location</div>
                    <div className="text-sm font-medium">{session.room}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="mt-0.5 bg-indigo-100 p-1.5 rounded-md">
                    <Users className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-xs text-muted-foreground">Trainer</div>
                    <div className="text-sm font-medium">{session.trainer}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-0.5 bg-indigo-100 p-1.5 rounded-md">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-xs text-muted-foreground">Availability</div>
                    <div className="text-sm">
                      <span className="font-medium">{session.participants.length}</span>/{session.maxSpots} spots filled
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full" 
                          style={{ width: `${(session.participants.length / session.maxSpots) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-0.5 bg-indigo-100 p-1.5 rounded-md">
                    <ChevronsDown className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-xs text-muted-foreground">Waiting List</div>
                    <div className="text-sm">
                      {session.enableWaitlist 
                        ? <span><span className="font-medium">{session.waitlist.length}</span> {session.waitlist.length === 1 ? 'person' : 'people'} waiting</span> 
                        : <span className="text-slate-400">Not enabled</span>}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Bookings Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-indigo-600" />
                Equipment Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!session.equipmentBookings || Object.keys(session.equipmentBookings).length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No equipment has been booked for this session.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(session.equipmentBookings).map(([type, bookings]) => {
                    if (!bookings || (Array.isArray(bookings) && bookings.length === 0)) return null;
                    
                    // Handle both array and legacy formats
                    const bookingsList = Array.isArray(bookings) ? bookings : [bookings];
                    const icon = () => {
                      switch(type) {
                        case 'laser': return '⚡';
                        case 'reformer': return '🔄';
                        case 'cadillac': return '🛏️';
                        case 'barrel': return '🛢️';
                        case 'chair': return '🪑';
                        default: return '📋';
                      }
                    };
                    
                    return (
                      <div key={type} className="bg-slate-50 rounded-lg p-3 border">
                        <div className="flex items-center mb-1.5">
                          <span className="text-lg mr-1.5">{icon()}</span>
                          <span className="font-medium capitalize">{type}</span>
                        </div>
                        <div className="text-sm text-slate-600">
                          <div className="flex flex-wrap gap-1.5">
                            {bookingsList.map((booking, idx) => (
                              <Badge key={idx} variant="outline" className="bg-white">
                                {booking.startMinute}-{booking.endMinute} min
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participants Tabs */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Users className="h-4 w-4 mr-2 text-indigo-600" />
                Participant Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <Tabs defaultValue="participants" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="participants" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Participants ({session.participants.length}/{session.maxSpots})
                  </TabsTrigger>
                  <TabsTrigger value="waitlist" className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Waiting List ({session.waitlist.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="participants">
                  <div className="flex justify-between items-center mb-4">
                    {session.status !== 'cancelled' && session.participants.length < session.maxSpots && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowAddParticipant(!showAddParticipant)}
                        className={`flex items-center text-sm w-full justify-center ${showAddParticipant ? 'text-red-500 border-red-200 hover:bg-red-50' : 'text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                      >
                        {showAddParticipant 
                          ? <><X className="h-4 w-4 mr-1.5" />Cancel</>
                          : <><UserPlus className="h-4 w-4 mr-1.5" />Add Participant</>
                        }
                      </Button>
                    )}
                  </div>
                  
                  {showAddParticipant && (
                    <div className="mb-6 bg-slate-50 p-4 rounded-lg border">
                      <h3 className="text-sm font-medium mb-3">Add Existing Customer</h3>
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
                          <tr className="border-b bg-slate-50">
                            <th className="py-2 px-4 text-left font-medium text-slate-700">Name</th>
                            <th className="py-2 px-4 text-left font-medium text-slate-700">Email</th>
                            <th className="py-2 px-4 text-left font-medium text-slate-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {session.participants.map((participant, index) => (
                            <tr key={participant.id} className={`${index % 2 === 0 ? '' : 'bg-slate-50'} hover:bg-slate-100`}>
                              <td className="py-2 px-4 font-medium">{participant.name}</td>
                              <td className="py-2 px-4 text-slate-600">{participant.email}</td>
                              <td className="py-2 px-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveParticipant(participant)}
                                  className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4 mr-1.5" />
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
                
                <TabsContent value="waitlist">
                  {!session.enableWaitlist ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Waiting list is not enabled for this session.
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        {session.status !== 'cancelled' && session.enableWaitlist && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowAddWaitlist(!showAddWaitlist)}
                            className={`flex items-center text-sm w-full justify-center ${showAddWaitlist ? 'text-red-500 border-red-200 hover:bg-red-50' : 'text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                          >
                            {showAddWaitlist 
                              ? <><X className="h-4 w-4 mr-1.5" />Cancel</>
                              : <><UserPlus className="h-4 w-4 mr-1.5" />Add to Waiting List</>
                            }
                          </Button>
                        )}
                      </div>
                      
                      {showAddWaitlist && (
                        <div className="mb-6 bg-slate-50 p-4 rounded-lg border">
                          <h3 className="text-sm font-medium mb-3">Add Customer to Waiting List</h3>
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
                              <tr className="border-b bg-slate-50">
                                <th className="py-2 px-4 text-left font-medium text-slate-700">Name</th>
                                <th className="py-2 px-4 text-left font-medium text-slate-700">Email</th>
                                <th className="py-2 px-4 text-left font-medium text-slate-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {session.waitlist.map((participant, index) => (
                                <tr key={participant.id} className={`${index % 2 === 0 ? '' : 'bg-slate-50'} hover:bg-slate-100`}>
                                  <td className="py-2 px-4 font-medium">{participant.name}</td>
                                  <td className="py-2 px-4 text-slate-600">{participant.email}</td>
                                  <td className="py-2 px-4">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleRemoveFromWaitingList(participant)}
                                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4 mr-1.5" />
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
            </CardContent>
          </Card>
                    
          {/* Session Actions Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-2">
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteSession}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete Session
              </Button>
            </div>
            
            <Button variant="outline" onClick={onClose} size="sm" className="w-full md:w-auto">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailsModal;