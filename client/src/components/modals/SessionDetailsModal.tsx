import React from 'react';
import { Session, Participant } from '@/lib/types';
import { useAppContext } from '@/context/AppContext';
import { formatDate, formatTimeRange } from '@/utils/date-utils';
import { getStatusLabel, getStatusColor } from '@/utils/session-utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({ isOpen, onClose, session }) => {
  const { cancelBooking, removeFromWaitingList } = useAppContext();
  const { toast } = useToast();

  const handleRemoveParticipant = (participant: Participant) => {
    cancelBooking(session.id, participant.id);
    toast({
      title: "Participant removed",
      description: `${participant.name} has been removed from the session`,
    });
  };

  const handleRemoveFromWaitingList = (participant: Participant) => {
    removeFromWaitingList(session.id, participant.id);
    toast({
      title: "Removed from waiting list",
      description: `${participant.name} has been removed from the waiting list`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              Session Details: {session.activity} with {session.trainer}
            </DialogTitle>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
              {getStatusLabel(session.status)}
            </span>
          </div>
        </DialogHeader>

        <div className="border-t border-gray-200 pt-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(session.date)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Time</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatTimeRange(session.startTime, session.duration)} ({session.duration} min)</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Capacity</dt>
              <dd className="mt-1 text-sm text-gray-900">{session.participants.length} / {session.capacity} Spots Filled</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Waiting List</dt>
              <dd className="mt-1 text-sm text-gray-900">{session.waitingList.length} People Waiting</dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Registered Participants</h4>
          <ScrollArea className="max-h-60">
            {session.participants.length === 0 ? (
              <p className="text-sm text-gray-500">No participants registered yet.</p>
            ) : (
              <ul role="list" className="divide-y divide-gray-200">
                {session.participants.map((participant) => (
                  <li key={participant.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-light text-white flex items-center justify-center">
                        <span className="font-medium">{participant.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                      </div>
                    </div>
                    <button 
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                      onClick={() => handleRemoveParticipant(participant)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">Waiting List</h4>
          <ScrollArea className="max-h-60">
            {session.waitingList.length === 0 ? (
              <p className="text-sm text-gray-500">No participants on the waiting list.</p>
            ) : (
              <ul role="list" className="divide-y divide-gray-200">
                {session.waitingList.map((participant) => (
                  <li key={participant.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center">
                        <span className="font-medium">{participant.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                      </div>
                    </div>
                    <button 
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                      onClick={() => handleRemoveFromWaitingList(participant)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailsModal;
