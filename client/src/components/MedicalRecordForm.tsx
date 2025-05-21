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
    <div className="bg-white p-4 md:p-6 w-full h-full overflow-y-auto">
      <div className="mb-4 border-b pb-4">
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
              {/* Combined Patient & Session Information */}
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                  {/* Patient Information - Read-only displays - First row */}
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Patient</span>
                    <p className="text-sm font-medium text-gray-800">{participant.name}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Email</span>
                    <p className="text-sm text-gray-800">{participant.email}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Phone</span>
                    <p className="text-sm text-gray-800">{participant.phone || "Not provided"}</p>
                  </div>
                  
                  {/* Patient Information - Second row */}
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Date of Birth</span>
                    <p className="text-sm text-gray-800">Not available</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">City</span>
                    <p className="text-sm text-gray-800">Not available</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">County</span>
                    <p className="text-sm text-gray-800">Not available</p>
                  </div>
                  
                  {/* Separator */}
                  <div className="col-span-full my-2">
                    <div className="border-t border-gray-200"></div>
                  </div>
                  
                  {/* Session information row */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase">Session Date</label>
                    <input 
                      type="date"
                      defaultValue={sessionDate ? new Date(sessionDate.replace(/(\w{3}) (\d{2}), (\d{4})/, "$3-$1-$2")).toISOString().split('T')[0] : ""}
                      className="mt-1 py-2 px-3 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase">Session Time</label>
                    <input 
                      type="time"
                      defaultValue={sessionTime ? sessionTime.split(' ')[0] : ""}
                      className="mt-1 py-2 px-3 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase">Location</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Select location"
                        className="mt-1 py-2 px-3 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <div className="hidden absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Downtown Studio</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Westside Location</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Northside Center</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Referring Doctor */}
                  <div className="col-span-2 mt-2">
                    <label className="block text-xs font-medium text-gray-500 uppercase">Referring Doctor</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Search or add new doctor"
                        className="mt-1 py-2 px-3 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <div className="hidden absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Dr. John Smith</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Dr. Sarah Johnson</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Dr. Michael Brown</div>
                        <div className="py-2 px-3 hover:bg-blue-50 text-blue-600 cursor-pointer text-sm">+ Add new doctor</div>
                      </div>
                    </div>
                  </div>
                </div>
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
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <h3 className="font-medium text-gray-700 mb-4">Main Reasons and Symptoms</h3>
                
                <div className="space-y-6">
                  {/* Main Goals */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Main Goals</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {['Pain relief', 'Mobility improvement', 'Strengthening', 'Posture correction', 'Performance enhancement', 'Rehabilitation'].map((goal) => (
                        <div key={goal} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`goal-${goal.toLowerCase().replace(' ', '-')}`}
                            className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <label 
                            htmlFor={`goal-${goal.toLowerCase().replace(' ', '-')}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {goal}
                          </label>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Other goals..."
                      className="w-full mt-2 text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Primary Concern */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Primary Concern</label>
                    <textarea
                      rows={3}
                      placeholder="Describe the patient's primary concern or symptoms..."
                      className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  {/* Pain Areas */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Pain Areas</label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {['Neck', 'Shoulders', 'Upper back', 'Lower back', 'Pelvis', 'Hips', 'Knees', 'Ankles', 'Feet', 'Arms', 'Hands', 'Chest'].map((area) => (
                        <div key={area} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`pain-${area.toLowerCase().replace(' ', '-')}`}
                            className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <label 
                            htmlFor={`pain-${area.toLowerCase().replace(' ', '-')}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {area}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Pain Intensity */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Pain Intensity (0-10)</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        step="1"
                        defaultValue="0"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700 w-8 text-center">0</span>
                    </div>
                    <div className="flex justify-between mt-1 px-1">
                      <span className="text-xs text-gray-500">No pain</span>
                      <span className="text-xs text-gray-500">Worst pain</span>
                    </div>
                  </div>
                  
                  {/* Duration of Symptoms */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Duration of Symptoms</label>
                    <select className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select duration</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                  
                  {/* Activities that Worsen Symptoms */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Activities that Worsen Symptoms</label>
                    <textarea
                      rows={2}
                      placeholder="List activities that make symptoms worse..."
                      className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  {/* Activities that Improve Symptoms */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Activities that Improve Symptoms</label>
                    <textarea
                      rows={2}
                      placeholder="List activities that make symptoms better..."
                      className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                </div>
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