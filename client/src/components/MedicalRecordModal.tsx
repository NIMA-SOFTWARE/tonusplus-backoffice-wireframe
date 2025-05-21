import React from 'react';
import { Participant } from '@shared/schema';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import MedicalRecordForm from './MedicalRecordForm';
import { usePilates } from '@/context/PilatesContext';
import { format } from 'date-fns';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface MedicalRecordModalProps {
  participant: Participant;
  sessionId: string;
  isOpen: boolean;
  onClose: () => void;
}

const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  participant,
  sessionId,
  isOpen,
  onClose
}) => {
  const { sessions } = usePilates();
  
  // Find session information
  const session = sessions.find(s => s.id === sessionId);
  const sessionDate = session ? format(new Date(session.date), 'MMM dd, yyyy') : undefined;
  const sessionTime = session?.startTime;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto p-0">
        <VisuallyHidden>
          <DialogTitle>Medical Record for {participant.name}</DialogTitle>
        </VisuallyHidden>
        <MedicalRecordForm
          participant={participant}
          sessionDate={sessionDate}
          sessionTime={sessionTime}
          sessionId={sessionId}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordModal;