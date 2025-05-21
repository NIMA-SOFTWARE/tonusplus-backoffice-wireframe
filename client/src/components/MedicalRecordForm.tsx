import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Participant } from '@shared/schema';
import { format } from 'date-fns';

interface MedicalRecordFormProps {
  participant: Participant;
  onClose: () => void;
  sessionId?: string;
  sessionDate?: string;
  sessionTime?: string;
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({ 
  participant, 
  onClose,
  sessionDate,
  sessionTime
}) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Medical Record - {participant.name}
            </h2>
            {sessionDate && sessionTime && (
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Session: {sessionDate} at {sessionTime}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full mb-4">
        {/* Section 1: Personal Data */}
        <AccordionItem value="personal-data">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            Personal Data
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <h3 className="font-medium text-gray-700">Personal Information</h3>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                Personal data section will be auto-completed from the customer's profile
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Section 2: Professional Data */}
        <AccordionItem value="professional-data">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            Professional Data
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <h3 className="font-medium text-gray-700">Professional Information</h3>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain professional data fields
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Section 3: Main Reason for Participation */}
        <AccordionItem value="participation-reason">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            Reason for Participation
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <h3 className="font-medium text-gray-700">Main Reasons and Symptoms</h3>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain fields for documenting reasons for participation
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Section 4: Local Anamnesis */}
        <AccordionItem value="local-anamnesis">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            Local Anamnesis
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <h3 className="font-medium text-gray-700">History of Present Illness (HPI)</h3>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain fields for documenting the history of present illness
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Section 5: Generic Anamnesis */}
        <AccordionItem value="generic-anamnesis">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            Generic Anamnesis
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <h3 className="font-medium text-gray-700">General Medical History</h3>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain fields for general medical history
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Section 6: Specific Clinical History */}
        <AccordionItem value="clinical-history">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            Specific Clinical History
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <h3 className="font-medium text-gray-700">Detailed Clinical History</h3>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain fields for specific clinical history
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Section 7: Objective Examination */}
        <AccordionItem value="objective-examination">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            Objective Examination
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <h3 className="font-medium text-gray-700">Physical Examination Findings</h3>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain fields for objective examination findings
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-6 flex justify-end">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="px-4 py-2 h-10"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default MedicalRecordForm;