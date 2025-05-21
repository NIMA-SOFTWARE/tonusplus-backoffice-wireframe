import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Participant } from '@shared/schema';
import { format } from 'date-fns';
import { 
  User, FileText, Target, Activity, 
  Clipboard, History, Stethoscope, Search, Mic
} from 'lucide-react';
import VoiceEnabledInput from './VoiceEnabledInput';
import VoiceInputButton from './VoiceInputButton';
import TagSelectionInput from './TagSelectionInput';

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
  // Form state for voice input fields
  const [otherReasons, setOtherReasons] = useState('');
  const [mainReason, setMainReason] = useState('');
  const [searchSymptomTerm, setSearchSymptomTerm] = useState('');
  const [showSymptomSearch, setShowSymptomSearch] = useState(false);
  
  // Voice-to-text state
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);
  
  // Local Anamnesis state
  const [whenDoesItHurt, setWhenDoesItHurt] = useState<string[]>([]);
  const [howDoesItHurt, setHowDoesItHurt] = useState<string[]>([]);
  const [painIntensity, setPainIntensity] = useState(5);
  const [whereDoesItHurt, setWhereDoesItHurt] = useState<string[]>([]);
  const [painStartDuration, setPainStartDuration] = useState('days');
  const [painStartValue, setPainStartValue] = useState(1);
  const [painStartDate, setPainStartDate] = useState('');
  const [painDurationMinutes, setPainDurationMinutes] = useState(0);
  const [hourlyInterval, setHourlyInterval] = useState('');
  const [activitiesWorsen, setActivitiesWorsen] = useState('');
  const [activitiesRelieve, setActivitiesRelieve] = useState('');
  const [evolution, setEvolution] = useState('');
  const [evolutionOther, setEvolutionOther] = useState('');
  const [treatment, setTreatment] = useState('');
  const [triggeringReason, setTriggeringReason] = useState('');
  const [ongoingTherapies, setOngoingTherapies] = useState<string[]>([]);
  
  // Generic Anamnesis state
  interface TraumaEntry {
    location: string;
    year: string;
    observation: string;
  }
  const [fractures, setFractures] = useState<TraumaEntry[]>([]);
  const [strains, setStrains] = useState<TraumaEntry[]>([]);
  const [sprains, setSprains] = useState<TraumaEntry[]>([]);
  const [muscleTears, setMuscleTears] = useState<TraumaEntry[]>([]);
  const [tendonRuptures, setTendonRuptures] = useState<TraumaEntry[]>([]);
  const [ligamentRuptures, setLigamentRuptures] = useState<TraumaEntry[]>([]);
  const [carAccidents, setCarAccidents] = useState('');
  const [fallsFromHeight, setFallsFromHeight] = useState('');
  const [fallsOnIce, setFallsOnIce] = useState('');
  const [fallsOnStairs, setFallsOnStairs] = useState('');
  
  // Surgical interventions state
  const [surgicalInterventions, setSurgicalInterventions] = useState('');
  
  // Interface for surgical interventions entries
  interface SurgicalIntervention {
    name: string;
    year: string;
  }
  const [surgicalInterventionsList, setSurgicalInterventionsList] = useState<SurgicalIntervention[]>([]);
  
  // Toggle voice input functionality
  const toggleVoiceInput = () => {
    setVoiceInputEnabled(!voiceInputEnabled);
  };
  
  // Toggle symptom search dropdown
  const handleSearchFocus = () => setShowSymptomSearch(true);
  const handleSearchBlur = () => {
    // Small delay to allow for selection
    setTimeout(() => setShowSymptomSearch(false), 200);
  };
  
  // Select a symptom from dropdown
  const handleSelectSymptom = (symptom: string) => {
    setMainReason(symptom);
    setShowSymptomSearch(false);
  };
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
          
          {/* Voice input toggle button */}
          <button 
            type="button"
            onClick={toggleVoiceInput}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
              voiceInputEnabled ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Mic className="h-4 w-4" />
            {voiceInputEnabled ? 'Voice Input ON' : 'Voice Input OFF'}
          </button>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full mb-4">
        {/* Section 1: Personal Data */}
        <AccordionItem value="personal-data">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-500" />
              <span>Personal Data</span>
            </div>
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
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-green-500" />
              <span>Professional Data</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div className="space-y-6">
                  {/* Profession Dropdown with Search */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Profession</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Search or enter profession..."
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="hidden absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Physical Therapist</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Doctor</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Nurse</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Teacher</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Engineer</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Office Worker</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Construction Worker</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Driver</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Student</div>
                        <div className="py-2 px-3 hover:bg-blue-50 text-blue-600 cursor-pointer text-sm">+ Add new profession</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Activities */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Daily Activities</label>
                    <div className="relative">
                      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-10">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Walking the dog <button className="ml-1 text-blue-500 hover:text-blue-700">×</button>
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Gardening <button className="ml-1 text-blue-500 hover:text-blue-700">×</button>
                        </span>
                        <input 
                          type="text" 
                          placeholder="Add activity..." 
                          className="flex-1 min-w-[100px] outline-none text-sm"
                        />
                      </div>
                      <div className="hidden absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Gardening</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">House cleaning</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Shopping</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Walking the dog</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Child care</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Training Section */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="is-active"
                        className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                        onChange={(e) => {
                          // Targeting the next sibling element for toggling visibility
                          const trainingFields = e.target.closest('.space-y-3').querySelector('.training-fields');
                          if (trainingFields) {
                            if (e.target.checked) {
                              trainingFields.classList.remove('hidden');
                            } else {
                              trainingFields.classList.add('hidden');
                            }
                          }
                        }}
                      />
                      <label 
                        htmlFor="is-active"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Is actively training
                      </label>
                    </div>
                    
                    {/* These fields will be conditionally shown when checkbox is checked */}
                    <div className="pl-6 pt-2 space-y-4 border-l-2 border-gray-200 training-fields hidden">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Trainings per week</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Number of trainings"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Training Types</label>
                        <div className="relative">
                          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-10">
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              Running <button className="ml-1 text-purple-500 hover:text-purple-700">×</button>
                            </span>
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              Swimming <button className="ml-1 text-purple-500 hover:text-purple-700">×</button>
                            </span>
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              Pilates <button className="ml-1 text-purple-500 hover:text-purple-700">×</button>
                            </span>
                            <input 
                              type="text" 
                              placeholder="Add training type..." 
                              className="flex-1 min-w-[100px] outline-none text-sm"
                            />
                          </div>
                          <div className="hidden absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                            <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Running</div>
                            <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Weight Training</div>
                            <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Swimming</div>
                            <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Cycling</div>
                            <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Team Sports</div>
                            <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Pilates</div>
                            <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Yoga</div>
                            <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">HIIT</div>
                            <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Walking</div>
                            <div className="py-2 px-3 hover:bg-blue-50 text-blue-600 cursor-pointer text-sm">+ Add new training type</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sedentary Lifestyle */}
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="is-sedentary"
                      className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label 
                      htmlFor="is-sedentary"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Has a sedentary lifestyle
                    </label>
                  </div>
                  
                  {/* Daily Hours & Work Type - Grouped in a row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Daily Driving Hours */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Daily Driving Hours</label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        placeholder="Hours per day"
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Daily Computer Hours */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Daily Computer Hours</label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        placeholder="Hours per day"
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Work Type */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Work Type</label>
                      <select className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select work type</option>
                        <option value="hard">Hard (physical labor)</option>
                        <option value="medium">Medium (mixed)</option>
                        <option value="easy">Easy (sedentary)</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Sports */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Sports</label>
                    <div className="relative">
                      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-10">
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Swimming <button className="ml-1 text-green-500 hover:text-green-700">×</button>
                        </span>
                        <input 
                          type="text" 
                          placeholder="Add sport..." 
                          className="flex-1 min-w-[100px] outline-none text-sm"
                        />
                      </div>
                      <div className="hidden absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Soccer</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Basketball</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Tennis</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Swimming</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Volleyball</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Golf</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Running</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Cycling</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Hiking</div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">Martial Arts</div>
                        <div className="py-2 px-3 hover:bg-blue-50 text-blue-600 cursor-pointer text-sm">+ Add new sport</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Section 3: Main Reason for Participation */}
        <AccordionItem value="participation-reason">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-rose-500" />
              <span>Reason for Participation</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">

                
                <div className="space-y-6">
                  {/* Stated reason (readonly from patient profile) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Stated reason (from patient profile)</label>
                    <div className="w-full text-sm p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                      Persistent lower back pain and limited mobility after sedentary work
                    </div>
                  </div>
                  
                  {/* Main reason with search and voice input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Main reason</label>
                    <div className="relative">
                      <div className="flex items-center">
                        <div className="relative flex-1">
                          <input 
                            type="text"
                            placeholder="Search medical symptoms..."
                            value={searchSymptomTerm}
                            onChange={(e) => setSearchSymptomTerm(e.target.value)}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            className="w-full text-sm p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        {voiceInputEnabled && (
                          <VoiceInputButton 
                            onTranscriptionComplete={(text) => {
                              setSearchSymptomTerm(text);
                              setShowSymptomSearch(true);
                            }}
                            className="ml-2" 
                          />
                        )}
                      </div>
                      
                      {/* Selected main reason display */}
                      {mainReason && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center">
                          <span className="text-sm text-blue-700">{mainReason}</span>
                          <button 
                            type="button"
                            onClick={() => setMainReason('')}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      
                      {/* Dropdown for search results */}
                      {showSymptomSearch && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                          {['Chronic lower back pain', 'Reduced mobility', 'Neck and shoulder tension', 
                            'Joint stiffness', 'Postural problems', 'Recovery from injury', 
                            'Core strength weakness', 'Balance issues', 'Sciatica', 'Scoliosis management']
                            .filter(symptom => !searchSymptomTerm || symptom.toLowerCase().includes(searchSymptomTerm.toLowerCase()))
                            .map((symptom, index) => (
                              <div 
                                key={index}
                                className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => handleSelectSymptom(symptom)}
                              >
                                {symptom}
                              </div>
                            ))
                          }
                          <div 
                            className="py-2 px-3 hover:bg-blue-50 text-blue-600 cursor-pointer text-sm border-t"
                            onClick={() => {
                              if (searchSymptomTerm) {
                                handleSelectSymptom(searchSymptomTerm);
                              }
                            }}
                          >
                            {searchSymptomTerm ? `+ Add "${searchSymptomTerm}"` : '+ Add new symptom'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Other reasons as textarea */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Other reasons</label>
                    <div className="relative">
                      <textarea
                        value={otherReasons}
                        onChange={(e) => setOtherReasons(e.target.value)}
                        placeholder="Additional information about the patient's reasons for participation..."
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-24"
                      ></textarea>
                      {voiceInputEnabled && (
                        <div className="absolute right-2 top-4">
                          <VoiceInputButton 
                            onTranscriptionComplete={(text) => {
                              const newValue = otherReasons ? `${otherReasons} ${text}` : text;
                              setOtherReasons(newValue);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  

                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Section 4: Local Anamnesis */}
        <AccordionItem value="local-anamnesis">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-purple-500" />
              <span>Local Anamnesis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div className="space-y-6">
                  {/* When does it hurt - TagSelectionInput */}
                  <div>
                    <TagSelectionInput
                      label="When does it hurt"
                      placeholder="Select when pain occurs..."
                      options={[
                        "When I wake up", 
                        "During the day", 
                        "End of day", 
                        "During night-time",
                        "After sitting",
                        "After standing",
                        "During movement",
                        "At rest",
                        "After exercise",
                        "After eating",
                        "After certain movements",
                        "Continuously"
                      ]}
                      selectedTags={whenDoesItHurt}
                      onTagsChange={setWhenDoesItHurt}
                      allowCustomTags={true}
                      voiceEnabled={voiceInputEnabled}
                    />
                  </div>
                  
                  {/* How does it hurt - TagSelectionInput */}
                  <div>
                    <TagSelectionInput
                      label="How does it hurt"
                      placeholder="Select pain type..."
                      options={[
                        "Acute", 
                        "Chronic", 
                        "Punctual", 
                        "Global",
                        "Arrow", 
                        "Claw", 
                        "Rheumatic pain", 
                        "Diffuse",
                        "Descending", 
                        "Ascending",
                        "Burning",
                        "Sharp",
                        "Dull",
                        "Throbbing",
                        "Stabbing",
                        "Tingling",
                        "Radiating",
                        "Aching"
                      ]}
                      selectedTags={howDoesItHurt}
                      onTagsChange={setHowDoesItHurt}
                      allowCustomTags={true}
                      voiceEnabled={voiceInputEnabled}
                    />
                  </div>
                  
                  {/* Pain intensity */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Pain intensity (1-10)</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="1"
                        value={painIntensity}
                        onChange={(e) => setPainIntensity(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700 w-8 text-center">{painIntensity}</span>
                    </div>
                    <div className="flex justify-between mt-1 px-1">
                      <span className="text-xs text-gray-500">Mild</span>
                      <span className="text-xs text-gray-500">Severe</span>
                    </div>
                  </div>
                  
                  {/* Where does it hurt - TagSelectionInput */}
                  <div>
                    <TagSelectionInput
                      label="Where does it hurt"
                      placeholder="Select pain locations..."
                      options={[
                        "Occipital",
                        "Back",
                        "Neck",
                        "Shoulder",
                        "Cervicothoracic",
                        "Interscapular",
                        "Subscapular",
                        "Thoracolumbar",
                        "Back pain",
                        "Lumbosacral",
                        "Sacral",
                        "Coccygeal",
                        "Sacroiliac",
                        "Buttock",
                        "Anterior thigh",
                        "Lateral thigh",
                        "Posterior thigh",
                        "Anterior knee",
                        "Lateral knee", 
                        "Medial knee",
                        "Posterior knee",
                        "Calf (lateral)",
                        "Calf (anterior)",
                        "Calf (posterior)",
                        "Ankle",
                        "Foot (anterior)",
                        "Foot (posterior)",
                        "Foot (lateral)",
                        "Foot (medial)",
                        "Foot (plantar)",
                        "Wrist",
                        "Elbow",
                        "Shoulder joint",
                        "Hip",
                        "Lower back",
                        "Upper back",
                        "Jaw",
                        "Head"
                      ]}
                      selectedTags={whereDoesItHurt}
                      onTagsChange={setWhereDoesItHurt}
                      allowCustomTags={true}
                      voiceEnabled={voiceInputEnabled}
                    />
                  </div>
                  
                  {/* When did the pain start */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">When did the pain start</label>
                    <div className="flex space-x-2 items-end">
                      <div className="w-20">
                        <input 
                          type="number" 
                          min="1"
                          value={painStartValue}
                          onChange={(e) => setPainStartValue(parseInt(e.target.value) || 1)}
                          className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-32">
                        <select 
                          className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={painStartDuration}
                          onChange={(e) => setPainStartDuration(e.target.value)}
                        >
                          <option value="days">days ago</option>
                          <option value="months">months ago</option>
                          <option value="years">years ago</option>
                          <option value="specific_date">specific date</option>
                        </select>
                      </div>
                      {painStartDuration === 'specific_date' && (
                        <div className="flex-1">
                          <input 
                            type="date"
                            value={painStartDate}
                            onChange={(e) => setPainStartDate(e.target.value)}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Pain duration and Hourly interval on same line */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Pain duration (minutes)</label>
                      <input 
                        type="number" 
                        min="0"
                        value={painDurationMinutes}
                        onChange={(e) => setPainDurationMinutes(parseInt(e.target.value) || 0)}
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Duration in minutes"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Hourly interval</label>
                      <input 
                        type="text"
                        value={hourlyInterval}
                        onChange={(e) => setHourlyInterval(e.target.value)}
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Every 2 hours"
                      />
                    </div>
                  </div>
                  
                  {/* Evolution - Single select with text for other */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Evolution</label>
                    <div className="flex flex-col space-y-2">
                      <select 
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={evolution}
                        onChange={(e) => setEvolution(e.target.value)}
                      >
                        <option value="">Select evolution type</option>
                        <option value="rapid">Rapid</option>
                        <option value="sudden">Sudden</option>
                        <option value="intermittent">Intermittent</option>
                        <option value="other">Other (please specify)</option>
                      </select>
                      
                      {evolution === 'other' && (
                        <input 
                          type="text"
                          value={evolutionOther}
                          onChange={(e) => setEvolutionOther(e.target.value)}
                          className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Please specify evolution"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Treatment - Textarea */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Treatment</label>
                    <VoiceEnabledInput
                      value={treatment}
                      onChange={setTreatment}
                      placeholder="Enter current treatment details..."
                      className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      isTextarea={true}
                      rows={3}
                      voiceEnabled={voiceInputEnabled}
                    />
                  </div>
                  
                  {/* Triggering reason - Textarea */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Triggering reason (stated by the patient)</label>
                    <VoiceEnabledInput
                      value={triggeringReason}
                      onChange={setTriggeringReason}
                      placeholder="Enter what patient believes caused the issue..."
                      className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      isTextarea={true}
                      rows={3}
                      voiceEnabled={voiceInputEnabled}
                    />
                  </div>
                  
                  {/* Other ongoing therapies - Multiple select with tags */}
                  <div>
                    <TagSelectionInput
                      label="Other ongoing therapies"
                      placeholder="Select ongoing therapies..."
                      options={[
                        "Kinesiotherapy",
                        "Physiotherapy",
                        "Osteopathy",
                        "Care therapy",
                        "Acupuncture",
                        "Balneotherapy",
                        "Massage",
                        "Bowen"
                      ]}
                      selectedTags={ongoingTherapies}
                      onTagsChange={setOngoingTherapies}
                      allowCustomTags={true}
                      voiceEnabled={voiceInputEnabled}
                    />
                  </div>
                  
                  {/* Activities that worsen pain */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Activities which make the pain worse</label>
                    <div className="relative">
                      <textarea
                        value={activitiesWorsen}
                        onChange={(e) => setActivitiesWorsen(e.target.value)}
                        placeholder="List activities that worsen the pain..."
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-24"
                      ></textarea>
                      {voiceInputEnabled && (
                        <div className="absolute right-2 top-4">
                          <VoiceInputButton 
                            onTranscriptionComplete={(text) => {
                              const newValue = activitiesWorsen ? `${activitiesWorsen} ${text}` : text;
                              setActivitiesWorsen(newValue);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Activities that relieve pain */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Activities which help relieve the pain</label>
                    <div className="relative">
                      <textarea
                        value={activitiesRelieve}
                        onChange={(e) => setActivitiesRelieve(e.target.value)}
                        placeholder="List activities that help relieve the pain..."
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-24"
                      ></textarea>
                      {voiceInputEnabled && (
                        <div className="absolute right-2 top-4">
                          <VoiceInputButton 
                            onTranscriptionComplete={(text) => {
                              const newValue = activitiesRelieve ? `${activitiesRelieve} ${text}` : text;
                              setActivitiesRelieve(newValue);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Section 5: Generic Anamnesis */}
        <AccordionItem value="generic-anamnesis">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Clipboard className="mr-2 h-5 w-5 text-amber-500" />
              <span>Generic Anamnesis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-6">
              {/* Trauma and Diseases/Dysfunctions subsection */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  Trauma and Diseases/Dysfunctions of the Musculoskeletal System
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 space-y-6">
                  {/* Reusable trauma entry component */}
                  {/* This is a local component for reuse within the medical record form */}
                  {(() => {
                    const TraumaEntrySection = ({
                      title,
                      entries,
                      setEntries,
                      options,
                      selectLabel,
                      allowCustomEntry = false
                    }: {
                      title: string;
                      entries: TraumaEntry[];
                      setEntries: React.Dispatch<React.SetStateAction<TraumaEntry[]>>;
                      options: { value: string; label: string }[];
                      selectLabel: string;
                      allowCustomEntry?: boolean;
                    }) => (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3">{title}</h5>
                        
                        {/* Selected entries list with year and observation */}
                        <div className="space-y-3 mb-4">
                          {entries.map((entry, index) => (
                            <div key={index} className="p-3 bg-white rounded-md border border-gray-200 shadow-sm">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-700 w-1/5">{entry.location}</div>
                                
                                <div className="flex-shrink-0 w-20">
                                  <input
                                    type="text"
                                    placeholder="Year"
                                    value={entry.year}
                                    onChange={(e) => {
                                      const updatedEntries = [...entries];
                                      updatedEntries[index].year = e.target.value;
                                      setEntries(updatedEntries);
                                    }}
                                    className="w-full text-sm p-1 border border-gray-300 rounded-md"
                                  />
                                </div>
                                
                                <div className="flex-grow">
                                  <input
                                    type="text"
                                    placeholder="Observation"
                                    value={entry.observation}
                                    onChange={(e) => {
                                      const updatedEntries = [...entries];
                                      updatedEntries[index].observation = e.target.value;
                                      setEntries(updatedEntries);
                                    }}
                                    className="w-full text-sm p-1 border border-gray-300 rounded-md"
                                  />
                                </div>
                                
                                <button
                                  onClick={() => {
                                    const updatedEntries = [...entries];
                                    updatedEntries.splice(index, 1);
                                    setEntries(updatedEntries);
                                  }}
                                  className="flex-shrink-0 text-red-500 hover:text-red-700"
                                  aria-label="Remove entry"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Entry location selector */}
                        <div className="flex items-end gap-2">
                          {allowCustomEntry ? (
                            <div className="flex flex-grow gap-2">
                              <div className="w-full">
                                <div className="mb-1 text-xs text-gray-500">{selectLabel}</div>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    id={`${title.toLowerCase().replace(/\s+/g, '-')}-input`}
                                    placeholder={`Enter ${title.toLowerCase()} details`}
                                    className="flex-grow text-sm p-2 border border-gray-300 rounded-md"
                                  />
                                  <button
                                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => {
                                      const inputId = `${title.toLowerCase().replace(/\s+/g, '-')}-input`;
                                      const input = document.getElementById(inputId) as HTMLInputElement;
                                      
                                      if (input && input.value.trim()) {
                                        setEntries([
                                          ...entries,
                                          {
                                            location: input.value.trim(),
                                            year: '',
                                            observation: ''
                                          }
                                        ]);
                                        input.value = '';
                                      }
                                    }}
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-grow">
                              <div className="mb-1 text-xs text-gray-500">{selectLabel}</div>
                              <select
                                className="w-full text-sm p-2 border border-gray-300 rounded-md"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    setEntries([
                                      ...entries,
                                      { 
                                        location: e.target.value, 
                                        year: '', 
                                        observation: '' 
                                      }
                                    ]);
                                    // Better way to reset select without focus issues
                                    e.target.selectedIndex = 0;
                                  }
                                }}
                              >
                                <option value="">Select location</option>
                                {options.map((option) => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                    
                    return (
                      <>
                        {/* Fractures */}
                        <TraumaEntrySection
                          title="Fractures"
                          entries={fractures}
                          setEntries={setFractures}
                          options={[
                            { value: "Humerus", label: "Humerus" },
                            { value: "Radius", label: "Radius" },
                            { value: "Cubitus", label: "Cubitus" },
                            { value: "Olecranon", label: "Olecranon" },
                            { value: "Carpals", label: "Carpals" },
                            { value: "Costal", label: "Costal" },
                            { value: "Vertebra", label: "Vertebra" },
                            { value: "Pelvis", label: "Pelvis" },
                            { value: "Coccyx", label: "Coccyx" },
                            { value: "Femoral neck", label: "Femoral neck" },
                            { value: "Femur", label: "Femur" },
                            { value: "Tibial plateau", label: "Tibial plateau" },
                            { value: "Tibia", label: "Tibia" },
                            { value: "Fibula", label: "Fibula" },
                            { value: "Internal malleolus", label: "Internal malleolus" },
                            { value: "External malleolus", label: "External malleolus" },
                            { value: "Bimalleolar", label: "Bimalleolar" },
                            { value: "Tarsals", label: "Tarsals" },
                            { value: "Halcus", label: "Halcus" },
                            { value: "Other", label: "Other (specify in observation)" }
                          ]}
                          selectLabel="Add new fracture location"
                        />
                        
                        {/* Strains */}
                        <div className="border-t border-gray-200 pt-4 mt-4"></div>
                        <TraumaEntrySection
                          title="Strains"
                          entries={strains}
                          setEntries={setStrains}
                          options={[
                            { value: "Ankle", label: "Ankle" },
                            { value: "Knee", label: "Knee" },
                            { value: "Hip", label: "Hip" },
                            { value: "Fist", label: "Fist" },
                            { value: "Other", label: "Other (specify in observation)" }
                          ]}
                          selectLabel="Add new strain location"
                        />
                        
                        {/* Sprains */}
                        <div className="border-t border-gray-200 pt-4 mt-4"></div>
                        <TraumaEntrySection
                          title="Sprains"
                          entries={sprains}
                          setEntries={setSprains}
                          options={[
                            { value: "Ankle", label: "Ankle" },
                            { value: "Knee", label: "Knee" },
                            { value: "Hip", label: "Hip" },
                            { value: "Fist", label: "Fist" },
                            { value: "Other", label: "Other (specify in observation)" }
                          ]}
                          selectLabel="Add new sprain location"
                        />
                        
                        {/* Muscle Tears */}
                        <div className="border-t border-gray-200 pt-4 mt-4"></div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Muscle Tears</h5>
                          
                          {/* Existing muscle tears */}
                          {muscleTears.map((tear, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={tear.location}
                                onChange={(e) => {
                                  const updatedTears = [...muscleTears];
                                  updatedTears[index].location = e.target.value;
                                  setMuscleTears(updatedTears);
                                }}
                                placeholder="Muscle name"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              />
                              <input
                                type="text"
                                value={tear.year}
                                onChange={(e) => {
                                  const updatedTears = [...muscleTears];
                                  updatedTears[index].year = e.target.value;
                                  setMuscleTears(updatedTears);
                                }}
                                placeholder="Year"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              />
                              <input
                                type="text"
                                value={tear.observation}
                                onChange={(e) => {
                                  const updatedTears = [...muscleTears];
                                  updatedTears[index].observation = e.target.value;
                                  setMuscleTears(updatedTears);
                                }}
                                placeholder="Observation"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              />
                              <button
                                onClick={() => {
                                  const updatedTears = [...muscleTears];
                                  updatedTears.splice(index, 1);
                                  setMuscleTears(updatedTears);
                                }}
                                className="p-2 text-red-500 hover:text-red-700"
                                aria-label="Remove"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          
                          {/* Add new muscle tear - just inputs in a row */}
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              id="muscle-tear-name"
                              placeholder="Muscle name"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            />
                            <input
                              type="text"
                              id="muscle-tear-year"
                              placeholder="Year"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            />
                            <input
                              type="text"
                              id="muscle-tear-observation"
                              placeholder="Observation"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            />
                            <button
                              className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                              onClick={() => {
                                const nameInput = document.getElementById('muscle-tear-name') as HTMLInputElement;
                                const yearInput = document.getElementById('muscle-tear-year') as HTMLInputElement;
                                const obsInput = document.getElementById('muscle-tear-observation') as HTMLInputElement;
                                
                                if (nameInput && nameInput.value.trim()) {
                                  setMuscleTears([
                                    ...muscleTears,
                                    {
                                      location: nameInput.value.trim(),
                                      year: yearInput ? yearInput.value : '',
                                      observation: obsInput ? obsInput.value : '',
                                    }
                                  ]);
                                  
                                  if (nameInput) nameInput.value = '';
                                  if (yearInput) yearInput.value = '';
                                  if (obsInput) obsInput.value = '';
                                }
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        
                        {/* Tendon Ruptures */}
                        <div className="border-t border-gray-200 pt-4 mt-4"></div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Tendon Ruptures</h5>
                          
                          {/* Existing tendon ruptures */}
                          {tendonRuptures.map((rupture, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={rupture.location}
                                onChange={(e) => {
                                  const updatedRuptures = [...tendonRuptures];
                                  updatedRuptures[index].location = e.target.value;
                                  setTendonRuptures(updatedRuptures);
                                }}
                                placeholder="Tendon name"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              />
                              <input
                                type="text"
                                value={rupture.year}
                                onChange={(e) => {
                                  const updatedRuptures = [...tendonRuptures];
                                  updatedRuptures[index].year = e.target.value;
                                  setTendonRuptures(updatedRuptures);
                                }}
                                placeholder="Year"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              />
                              <input
                                type="text"
                                value={rupture.observation}
                                onChange={(e) => {
                                  const updatedRuptures = [...tendonRuptures];
                                  updatedRuptures[index].observation = e.target.value;
                                  setTendonRuptures(updatedRuptures);
                                }}
                                placeholder="Observation"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              />
                              <button
                                onClick={() => {
                                  const updatedRuptures = [...tendonRuptures];
                                  updatedRuptures.splice(index, 1);
                                  setTendonRuptures(updatedRuptures);
                                }}
                                className="p-2 text-red-500 hover:text-red-700"
                                aria-label="Remove"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          
                          {/* Add new tendon rupture - just inputs in a row */}
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              id="tendon-rupture-name"
                              placeholder="Tendon name"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            />
                            <input
                              type="text"
                              id="tendon-rupture-year"
                              placeholder="Year"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            />
                            <input
                              type="text"
                              id="tendon-rupture-observation"
                              placeholder="Observation"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            />
                            <button
                              className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                              onClick={() => {
                                const nameInput = document.getElementById('tendon-rupture-name') as HTMLInputElement;
                                const yearInput = document.getElementById('tendon-rupture-year') as HTMLInputElement;
                                const obsInput = document.getElementById('tendon-rupture-observation') as HTMLInputElement;
                                
                                if (nameInput && nameInput.value.trim()) {
                                  setTendonRuptures([
                                    ...tendonRuptures,
                                    {
                                      location: nameInput.value.trim(),
                                      year: yearInput ? yearInput.value : '',
                                      observation: obsInput ? obsInput.value : '',
                                    }
                                  ]);
                                  
                                  if (nameInput) nameInput.value = '';
                                  if (yearInput) yearInput.value = '';
                                  if (obsInput) obsInput.value = '';
                                }
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        
                        {/* Ligament Ruptures */}
                        <div className="border-t border-gray-200 pt-4 mt-4"></div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Ligament Ruptures</h5>
                          
                          {/* Existing ligament ruptures */}
                          {ligamentRuptures.map((rupture, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={rupture.location}
                                onChange={(e) => {
                                  const updatedRuptures = [...ligamentRuptures];
                                  updatedRuptures[index].location = e.target.value;
                                  setLigamentRuptures(updatedRuptures);
                                }}
                                placeholder="Ligament name"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              />
                              <input
                                type="text"
                                value={rupture.year}
                                onChange={(e) => {
                                  const updatedRuptures = [...ligamentRuptures];
                                  updatedRuptures[index].year = e.target.value;
                                  setLigamentRuptures(updatedRuptures);
                                }}
                                placeholder="Year"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              />
                              <input
                                type="text"
                                value={rupture.observation}
                                onChange={(e) => {
                                  const updatedRuptures = [...ligamentRuptures];
                                  updatedRuptures[index].observation = e.target.value;
                                  setLigamentRuptures(updatedRuptures);
                                }}
                                placeholder="Observation"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              />
                              <button
                                onClick={() => {
                                  const updatedRuptures = [...ligamentRuptures];
                                  updatedRuptures.splice(index, 1);
                                  setLigamentRuptures(updatedRuptures);
                                }}
                                className="p-2 text-red-500 hover:text-red-700"
                                aria-label="Remove"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          
                          {/* Add new ligament rupture - just inputs in a row */}
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              id="ligament-rupture-name"
                              placeholder="Ligament name"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            />
                            <input
                              type="text"
                              id="ligament-rupture-year"
                              placeholder="Year"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            />
                            <input
                              type="text"
                              id="ligament-rupture-observation"
                              placeholder="Observation"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            />
                            <button
                              className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                              onClick={() => {
                                const nameInput = document.getElementById('ligament-rupture-name') as HTMLInputElement;
                                const yearInput = document.getElementById('ligament-rupture-year') as HTMLInputElement;
                                const obsInput = document.getElementById('ligament-rupture-observation') as HTMLInputElement;
                                
                                if (nameInput && nameInput.value.trim()) {
                                  setLigamentRuptures([
                                    ...ligamentRuptures,
                                    {
                                      location: nameInput.value.trim(),
                                      year: yearInput ? yearInput.value : '',
                                      observation: obsInput ? obsInput.value : '',
                                    }
                                  ]);
                                  
                                  if (nameInput) nameInput.value = '';
                                  if (yearInput) yearInput.value = '';
                                  if (obsInput) obsInput.value = '';
                                }
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        
                        {/* Additional text inputs for accidents and falls */}
                        <div className="border-t border-gray-200 pt-4 mt-4"></div>
                        <div className="space-y-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Accidents and Falls</h5>
                          
                          {/* Car Accidents */}
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Car Accidents</label>
                            <input 
                              type="text"
                              value={carAccidents}
                              onChange={(e) => setCarAccidents(e.target.value)}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter details about car accidents..."
                            />
                          </div>
                          
                          {/* Falls from height */}
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Falls from Height</label>
                            <input 
                              type="text"
                              value={fallsFromHeight}
                              onChange={(e) => setFallsFromHeight(e.target.value)}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter details about falls from height..."
                            />
                          </div>
                          
                          {/* Falls on ice */}
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Falls on Ice</label>
                            <input 
                              type="text"
                              value={fallsOnIce}
                              onChange={(e) => setFallsOnIce(e.target.value)}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter details about falls on ice..."
                            />
                          </div>
                          
                          {/* Falls on stairs */}
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Falls on Stairs</label>
                            <input 
                              type="text"
                              value={fallsOnStairs}
                              onChange={(e) => setFallsOnStairs(e.target.value)}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter details about falls on stairs..."
                            />
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              {/* Surgical Interventions subsection */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  Surgical Interventions
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 space-y-4">
                  {/* List of existing surgical interventions */}
                  <div className="space-y-3">
                    {/* This will map through all saved interventions */}
                    {surgicalInterventionsList.map((intervention, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2 bg-white p-2 rounded border border-gray-200">
                        <span className="flex-1">
                          {intervention.name} {intervention.year ? `(${intervention.year})` : ''}
                        </span>
                        <button
                          onClick={() => {
                            const updatedInterventions = [...surgicalInterventionsList];
                            updatedInterventions.splice(index, 1);
                            setSurgicalInterventionsList(updatedInterventions);
                          }}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add new intervention */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700">Add Surgical Intervention</h5>
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs text-gray-500 mb-1">Type</label>
                        <select
                          id="surgical-intervention-type"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          onChange={(e) => {
                            // Show/hide other input when "Other" is selected
                            const otherInput = document.getElementById('other-intervention-container');
                            if (otherInput) {
                              otherInput.style.display = e.target.value === 'Other' ? 'block' : 'none';
                            }
                          }}
                        >
                          <option value="">Select intervention type</option>
                          <option value="Appendectomy">Appendectomy</option>
                          <option value="Cesarean section">Cesarean section</option>
                          <option value="Cholecystectomy">Cholecystectomy</option>
                          <option value="Hysterectomy">Hysterectomy</option>
                          <option value="Mastectomy">Mastectomy</option>
                          <option value="Renal">Renal</option>
                          <option value="Pulmonary">Pulmonary</option>
                          <option value="Tumor">Tumor</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div id="other-intervention-container" style={{ display: 'none' }} className="flex-1 min-w-[200px]">
                        <label className="block text-xs text-gray-500 mb-1">Specify other</label>
                        <input
                          type="text"
                          id="other-intervention-input"
                          placeholder="Specify intervention"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="w-32">
                        <label className="block text-xs text-gray-500 mb-1">Year</label>
                        <input
                          type="text"
                          id="intervention-year"
                          placeholder="Year"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="self-end pb-[1px]">
                        <button
                          className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                          onClick={() => {
                            const typeSelect = document.getElementById('surgical-intervention-type') as HTMLSelectElement;
                            const otherInput = document.getElementById('other-intervention-input') as HTMLInputElement;
                            const yearInput = document.getElementById('intervention-year') as HTMLInputElement;
                            
                            if (typeSelect && typeSelect.value) {
                              let interventionType = typeSelect.value;
                              
                              // Use the custom value if "Other" is selected
                              if (interventionType === 'Other' && otherInput && otherInput.value.trim()) {
                                interventionType = otherInput.value.trim();
                              }
                              
                              if (interventionType !== 'Other' || (interventionType === 'Other' && otherInput && otherInput.value.trim())) {
                                // Add the new intervention to our list
                                setSurgicalInterventionsList([
                                  ...surgicalInterventionsList,
                                  {
                                    name: interventionType,
                                    year: yearInput ? yearInput.value : ''
                                  }
                                ]);
                                
                                // Reset inputs
                                typeSelect.selectedIndex = 0;
                                if (otherInput) otherInput.value = '';
                                if (yearInput) yearInput.value = '';
                                
                                // Hide other input
                                const otherContainer = document.getElementById('other-intervention-container');
                                if (otherContainer) {
                                  otherContainer.style.display = 'none';
                                }
                              }
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Anatomical Anomalies subsection */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  Anatomical Anomalies (Location and Type)
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  {/* This is where we'll add inputs later */}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Section 6: Specific Clinical History */}
        <AccordionItem value="clinical-history">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <History className="mr-2 h-5 w-5 text-indigo-500" />
              <span>Specific Clinical History</span>
            </div>
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
            <div className="flex items-center">
              <Stethoscope className="mr-2 h-5 w-5 text-teal-500" />
              <span>Objective Examination</span>
            </div>
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