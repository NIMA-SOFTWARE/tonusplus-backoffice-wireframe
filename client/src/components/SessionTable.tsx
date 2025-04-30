import React, { useState } from 'react';
import { Session } from '@/lib/types';
import { useAppContext } from '@/context/AppContext';
import { formatDate, formatTimeRange } from '@/utils/date-utils';
import { getStatusLabel, getStatusColor } from '@/utils/session-utils';
import SessionDetailsModal from './modals/SessionDetailsModal';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SessionTableProps {
  sessions: Session[];
}

const SessionTable: React.FC<SessionTableProps> = ({ sessions }) => {
  const { updateSession, deleteSession } = useAppContext();
  const [detailsSession, setDetailsSession] = useState<Session | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState<Session | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleViewDetails = (session: Session) => {
    setDetailsSession(session);
    setIsDetailsModalOpen(true);
  };

  const handleCancelSession = (session: Session) => {
    setSessionToCancel(session);
    setShowCancelDialog(true);
  };

  const confirmCancelSession = () => {
    if (sessionToCancel) {
      const updatedSession = { ...sessionToCancel, status: 'cancelled' as const };
      updateSession(updatedSession);
      setShowCancelDialog(false);
      setSessionToCancel(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity / Trainer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No sessions found matching your criteria
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {session.activity}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.trainer}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(session.date)}</div>
                    <div className="text-sm text-gray-500">{formatTimeRange(session.startTime, session.duration)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{session.participants.length} / {session.capacity} Booked</div>
                    <div className="text-sm text-gray-500">{session.waitingList.length} Waiting</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(session.status)}`}>
                      {getStatusLabel(session.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-primary hover:text-primary-dark mr-3"
                      onClick={() => handleViewDetails(session)}
                    >
                      View
                    </button>
                    <button 
                      className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleCancelSession(session)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {detailsSession && (
        <SessionDetailsModal 
          isOpen={isDetailsModalOpen} 
          onClose={() => setIsDetailsModalOpen(false)}
          session={detailsSession}
        />
      )}

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this session? This will notify all participants and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep session</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelSession} className="bg-red-600 hover:bg-red-700">
              Yes, cancel session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SessionTable;
