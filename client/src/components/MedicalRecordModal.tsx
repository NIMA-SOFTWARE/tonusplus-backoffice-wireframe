import React from 'react';
import { MedicalRecordFormData, Participant } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MedicalRecordForm from './MedicalRecordForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MedicalRecordModalProps {
  participant: Participant;
  sessionId: string;
  isOpen: boolean;
  onClose: () => void;
  existingData?: MedicalRecordFormData;
}

const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  participant,
  sessionId,
  isOpen,
  onClose,
  existingData
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createMutation = useMutation({
    mutationFn: async (data: { 
      participantId: string;
      sessionId: string;
      formData: MedicalRecordFormData;
    }) => {
      return apiRequest<{ success: boolean; recordId: number }>(`/api/medical-records`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/medical-records'] });
      toast({
        title: "Medical record saved",
        description: "The medical record has been successfully saved.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error saving medical record",
        description: "There was an error saving the medical record. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleSubmit = (formData: MedicalRecordFormData) => {
    createMutation.mutate({
      participantId: participant.id,
      sessionId,
      formData
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Medical Record</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-0">
          <MedicalRecordForm
            participant={participant}
            onSubmit={handleSubmit}
            onCancel={onClose}
            existingData={existingData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordModal;