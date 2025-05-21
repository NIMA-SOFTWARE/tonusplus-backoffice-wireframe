import React from 'react';
import { Participant } from '@shared/schema';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import MedicalRecordForm from './MedicalRecordForm';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto p-0">
        <MedicalRecordForm
          participant={participant}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordModal;