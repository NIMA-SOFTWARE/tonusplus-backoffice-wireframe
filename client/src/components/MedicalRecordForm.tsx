import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Medical Record - {participant.name}
            </h2>
            {sessionDate && sessionTime && (
              <p className="text-sm text-gray-500 mt-1">
                Session: {sessionDate} at {sessionTime}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          <TabsTrigger 
            value="personal"
            className="text-sm md:text-base py-3 px-2"
          >
            Personal Data
          </TabsTrigger>
          <TabsTrigger 
            value="professional"
            className="text-sm md:text-base py-3 px-2"
          >
            Professional Data
          </TabsTrigger>
          <TabsTrigger 
            value="reason"
            className="text-sm md:text-base py-3 px-2"
          >
            Reason for Participation
          </TabsTrigger>
          <TabsTrigger 
            value="local-anamnesis"
            className="text-sm md:text-base py-3 px-2"
          >
            Local Anamnesis
          </TabsTrigger>
          <TabsTrigger 
            value="generic-anamnesis"
            className="text-sm md:text-base py-3 px-2"
          >
            Generic Anamnesis
          </TabsTrigger>
          <TabsTrigger 
            value="clinical-history"
            className="text-sm md:text-base py-3 px-2"
          >
            Clinical History
          </TabsTrigger>
          <TabsTrigger 
            value="examination"
            className="text-sm md:text-base py-3 px-2"
          >
            Objective Examination
          </TabsTrigger>
        </TabsList>
        
        {/* Section 1: Personal Data */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Data</CardTitle>
              <CardDescription>
                Personal information about the customer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                Personal data section will be auto-completed from the customer's profile
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Section 2: Professional Data */}
        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Data</CardTitle>
              <CardDescription>
                Professional information and work history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain professional data fields
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Section 3: Main Reason for Participation */}
        <TabsContent value="reason">
          <Card>
            <CardHeader>
              <CardTitle>Reason for Participation</CardTitle>
              <CardDescription>
                Main reasons and symptoms for participating in this session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain fields for documenting reasons for participation
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Section 4: Local Anamnesis */}
        <TabsContent value="local-anamnesis">
          <Card>
            <CardHeader>
              <CardTitle>Local Anamnesis</CardTitle>
              <CardDescription>
                History of Present Illness (HPI)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain fields for documenting the history of present illness
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Section 5: Generic Anamnesis */}
        <TabsContent value="generic-anamnesis">
          <Card>
            <CardHeader>
              <CardTitle>Generic Anamnesis</CardTitle>
              <CardDescription>
                General medical history information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain fields for general medical history
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Section 6: Specific Clinical History */}
        <TabsContent value="clinical-history">
          <Card>
            <CardHeader>
              <CardTitle>Specific Clinical History</CardTitle>
              <CardDescription>
                Detailed clinical history information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain fields for specific clinical history
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Section 7: Objective Examination */}
        <TabsContent value="examination">
          <Card>
            <CardHeader>
              <CardTitle>Objective Examination</CardTitle>
              <CardDescription>
                Physical examination findings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-center text-zinc-500 italic">
                This section will contain fields for objective examination findings
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end space-x-4">
        <button 
          type="button" 
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MedicalRecordForm;