import React, { useState } from 'react';
import { PilatesSession } from '@shared/schema';
import { usePilates } from '@/context/PilatesContext';
import { format, parseISO } from 'date-fns';
import { formatDate, formatTimeRange } from '@/lib/utils';
import FilterSection from '@/components/FilterSection';
import CalendarView from '@/components/CalendarView';
import CreateSessionModal from '@/components/CreateSessionModal';
import SessionDetailsModal from '@/components/SessionDetailsModal';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AdminView: React.FC = () => {
  const { filteredSessions, changeSessionStatus } = usePilates();
  const { toast } = useToast();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PilatesSession | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleCreateSession = () => {
    setSelectedSession(null);
    setIsEditing(false);
    setCreateModalOpen(true);
  };
  
  const handleEditSession = (session: PilatesSession) => {
    setSelectedSession({...session}); // Create a copy to ensure independent editing
    setIsEditing(true);
    setCreateModalOpen(true);
  };
  
  const handleViewDetails = (session: PilatesSession) => {
    setSelectedSession({...session}); // Create a copy to ensure independent viewing
    setDetailsModalOpen(true);
  };
  
  const handleCancelSession = (session: PilatesSession) => {
    setSelectedSession({...session}); // Create a copy to ensure independent editing
    setDeleteDialogOpen(true);
  };
  
  const confirmCancelSession = async () => {
    if (!selectedSession) return;
    
    try {
      const success = await changeSessionStatus(selectedSession.id, 'cancelled');
      if (success) {
        toast({
          title: 'Success',
          description: 'Session has been cancelled'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to cancel session',
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
      setDeleteDialogOpen(false);
      setSelectedSession(null);
    }
  };
  
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.startTime}`);
    const bDate = new Date(`${b.date}T${b.startTime}`);
    return aDate.getTime() - bDate.getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-800">Session Management</h2>
        <FilterSection />
      </div>
      
      <Button 
        className="w-full md:w-auto"
        onClick={handleCreateSession}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Create New Session
      </Button>
      
      <CalendarView 
        onSessionClick={(session) => handleEditSession(session)} 
        isAdminView={true} 
      />
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-800">All Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Session</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trainer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capacity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sortedSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                    No sessions found
                  </td>
                </tr>
              ) : (
                sortedSessions.map((session) => (
                  <tr key={session.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{session.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">
                        {formatDate(session.date)} · {formatTimeRange(session.startTime, session.duration)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">{session.trainer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">
                        {session.participants.length}/{session.maxSpots} spots
                        {session.waitlist.length > 0 && ` (${session.waitlist.length} waiting)`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={session.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleViewDetails(session)}
                      >
                        View Details
                      </button>
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => handleEditSession(session)}
                      >
                        Edit
                      </button>
                      {session.status !== 'cancelled' && (
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleCancelSession(session)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <CreateSessionModal 
        isOpen={createModalOpen} 
        onClose={() => setCreateModalOpen(false)}
        editSession={isEditing && selectedSession ? selectedSession : undefined}
        onViewDetails={(session) => {
          setCreateModalOpen(false);
          setSelectedSession(session);
          setDetailsModalOpen(true);
        }}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel this session?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All participants will be notified that the session has been cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelSession} className="bg-red-600 hover:bg-red-700">
              Yes, Cancel Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedSession(null);
          }}
          session={selectedSession}
          onEdit={(session) => {
            setDetailsModalOpen(false);
            handleEditSession(session);
          }}
        />
      )}
    </div>
  );
};

export default AdminView;
