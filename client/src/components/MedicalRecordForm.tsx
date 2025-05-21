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
  const [osteosynthesisMaterials, setOsteosynthesisMaterials] = useState('');
  
  // Interface for surgical interventions entries
  interface SurgicalIntervention {
    name: string;
    year: string;
  }
  const [surgicalInterventionsList, setSurgicalInterventionsList] = useState<SurgicalIntervention[]>([]);
  
  // Interface and state for anatomical anomalies
  interface AnatomicalAnomaly {
    location: string;
    type: string;
    observation: string;
  }
  const [anatomicalAnomalies, setAnatomicalAnomalies] = useState<AnatomicalAnomaly[]>([]);
  
  // Interface and state for circulatory/respiratory pathologies
  interface Pathology {
    type: string;
    notes: string;
  }
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  
  // Interface and state for digestive system diseases/dysfunctions
  interface DigestiveDisease {
    type: string;
    notes: string;
  }
  const [digestiveDiseases, setDigestiveDiseases] = useState<DigestiveDisease[]>([]);
  
  // State for stool form options
  const [stoolForms, setStoolForms] = useState<string[]>([]);
  
  // State for daily hydration (in liters)
  const [dailyHydration, setDailyHydration] = useState<string>('');
  
  // Interface and state for urogenital system diseases/dysfunctions
  interface UrogenitalDisease {
    type: string;
    notes: string;
  }
  const [urogenitalDiseases, setUrogenitalDiseases] = useState<UrogenitalDisease[]>([]);
  
  // State for gender
  const [isFemale, setIsFemale] = useState<boolean>(false);
  
  // State for menstrual cycle frequency (in days)
  const [menstrualCycleFrequency, setMenstrualCycleFrequency] = useState<string>('');
  
  // State for pregnancy information
  interface Pregnancy {
    type: string; // 'term', 'ectopic', 'abortion'
    year: string;
    weightGain: string; // in kg
    notes: string;
  }
  const [pregnancies, setPregnancies] = useState<Pregnancy[]>([]);
  const [childrenCount, setChildrenCount] = useState<string>('');
  
  // State for weight changes in recent years
  interface WeightChange {
    amount: string; // in kg (can be positive for gain or negative for loss)
    timeSpan: string; // in months/years
    notes: string;
  }
  const [weightChanges, setWeightChanges] = useState<WeightChange[]>([]);
  
  // State for eye system and visual disorders
  const [wearingGlasses, setWearingGlasses] = useState<boolean>(false);
  const [wearingContactLenses, setWearingContactLenses] = useState<boolean>(false);
  const [visualDisorders, setVisualDisorders] = useState<string>('');
  
  // Interface and state for eye conditions
  interface EyeCondition {
    condition: string;
    rightEyeAngle: string;
    leftEyeAngle: string;
    observation: string;
  }
  const [eyeConditions, setEyeConditions] = useState<EyeCondition[]>([]);
  
  // State for dominant eye
  const [dominantEye, setDominantEye] = useState<string>('');
  const [dominantEyeAngle, setDominantEyeAngle] = useState<string>('');
  
  // State for vision quality tracking
  const [visionQuality, setVisionQuality] = useState({
    eyeCount: "", // "one" or "both"
    eyeDominance: "" // "dominant" or "non-dominant"
  });
  
  // State for convergence test
  const [convergenceTest, setConvergenceTest] = useState({
    result: "", // "normal", "insufficient", "excessive"
    distanceCm: "", // distance in centimeters
    notes: "" 
  });
  
  // State for ENT (Ear, Nose, Throat) conditions
  interface ENTCondition {
    type: string;
    notes: string;
  }
  const [entConditions, setENTConditions] = useState<ENTCondition[]>([]);
  
  // State for Stomatognatic Appliance conditions
  interface StomatognaticCondition {
    type: string;
    notes: string;
  }
  const [stomatognaticConditions, setStomatognaticConditions] = useState<StomatognaticCondition[]>([]);
  
  // State for Lingual Frenulum
  const [lingualFrenulum, setLingualFrenulum] = useState("");
  
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
                  
                  {/* Gender Selection */}
                  <div className="col-span-full">
                    <span className="text-xs font-medium text-gray-500 uppercase">Gender</span>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="gender-male"
                          name="gender"
                          checked={!isFemale}
                          onChange={() => setIsFemale(false)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="gender-male" className="ml-2 text-sm text-gray-700">
                          Male
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="gender-female"
                          name="gender"
                          checked={isFemale}
                          onChange={() => setIsFemale(true)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="gender-female" className="ml-2 text-sm text-gray-700">
                          Female
                        </label>
                      </div>
                    </div>
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
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Surgical Interventions</h5>
                  
                  {/* Existing surgical interventions */}
                  {surgicalInterventionsList.map((intervention, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <select
                        value={intervention.name}
                        onChange={(e) => {
                          const updatedInterventions = [...surgicalInterventionsList];
                          updatedInterventions[index].name = e.target.value;
                          setSurgicalInterventionsList(updatedInterventions);
                          
                          // Show/hide other input when "Other" is selected
                          const otherInput = document.getElementById(`intervention-other-${index}`);
                          if (otherInput) {
                            otherInput.style.display = e.target.value === 'Other' ? 'inline-block' : 'none';
                          }
                        }}
                        className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
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
                      
                      <input
                        id={`intervention-other-${index}`}
                        type="text"
                        placeholder="Specify intervention"
                        style={{ 
                          display: intervention.name === 'Other' ? 'inline-block' : 'none'
                        }}
                        className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                        onChange={(e) => {
                          if (e.target.value.trim()) {
                            const updatedInterventions = [...surgicalInterventionsList];
                            updatedInterventions[index].name = e.target.value;
                            setSurgicalInterventionsList(updatedInterventions);
                          }
                        }}
                      />
                      
                      <input
                        type="text"
                        value={intervention.year}
                        onChange={(e) => {
                          const updatedInterventions = [...surgicalInterventionsList];
                          updatedInterventions[index].year = e.target.value;
                          setSurgicalInterventionsList(updatedInterventions);
                        }}
                        placeholder="Year"
                        className="w-32 text-sm p-2 border border-gray-300 rounded-md"
                      />
                      
                      <button
                        onClick={() => {
                          const updatedInterventions = [...surgicalInterventionsList];
                          updatedInterventions.splice(index, 1);
                          setSurgicalInterventionsList(updatedInterventions);
                        }}
                        className="p-2 text-red-500 hover:text-red-700"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {/* Add new surgical intervention - select + inputs */}
                  <div className="flex items-center gap-2 mb-2">
                    <select
                      id="surgical-intervention-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        // Show/hide other input when "Other" is selected
                        const otherInput = document.getElementById('other-intervention-input');
                        if (otherInput) {
                          otherInput.style.display = e.target.value === 'Other' ? 'inline-block' : 'none';
                        }
                      }}
                    >
                      <option value="" disabled>Select intervention type</option>
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
                    
                    <input
                      type="text"
                      id="other-intervention-input"
                      placeholder="Specify intervention"
                      style={{ display: 'none' }}
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                    />
                    
                    <input
                      type="text"
                      id="intervention-year"
                      placeholder="Year"
                      className="w-32 text-sm p-2 border border-gray-300 rounded-md"
                    />
                    
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
                            if (otherInput) {
                              otherInput.style.display = 'none';
                            }
                          }
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Osteosynthesis materials textarea */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Osteosynthesis Materials</label>
                    <VoiceEnabledInput
                      value={osteosynthesisMaterials}
                      onChange={setOsteosynthesisMaterials}
                      placeholder="Enter details about osteosynthesis materials (screws, plates, prostheses, etc.)"
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                      isTextarea={true}
                      rows={3}
                      voiceEnabled={voiceInputEnabled}
                    />
                  </div>
                </div>
              </div>
              
              {/* Anatomical Anomalies subsection */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  Anatomical Anomalies (Location and Type)
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Anatomical Anomalies</h5>
                  
                  {/* Existing anatomical anomalies */}
                  {anatomicalAnomalies.map((anomaly, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      {anomaly.location === "Other" ? (
                        <div className="flex-1 flex gap-1">
                          <select
                            value={anomaly.location}
                            onChange={(e) => {
                              const updatedAnomalies = [...anatomicalAnomalies];
                              updatedAnomalies[index].location = e.target.value;
                              setAnatomicalAnomalies(updatedAnomalies);
                            }}
                            className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select location</option>
                            <option value="Back">Back</option>
                            <option value="Spine">Spine</option>
                            <option value="Shoulder">Shoulder</option>
                            <option value="Arm">Arm</option>
                            <option value="Elbow">Elbow</option>
                            <option value="Forearm">Forearm</option>
                            <option value="Wrist">Wrist</option>
                            <option value="Hand">Hand</option>
                            <option value="Fingers">Fingers</option>
                            <option value="Hip">Hip</option>
                            <option value="Thigh">Thigh</option>
                            <option value="Knee">Knee</option>
                            <option value="Calf">Calf</option>
                            <option value="Ankle">Ankle</option>
                            <option value="Foot">Foot</option>
                            <option value="Toes">Toes</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify location"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={anomaly.observation.split('|')[0] || ''}
                            onChange={(e) => {
                              const updatedAnomalies = [...anatomicalAnomalies];
                              const parts = anomaly.observation.split('|');
                              parts[0] = e.target.value;
                              updatedAnomalies[index].observation = parts.join('|');
                              setAnatomicalAnomalies(updatedAnomalies);
                            }}
                          />
                        </div>
                      ) : (
                        <select
                          value={anomaly.location}
                          onChange={(e) => {
                            const updatedAnomalies = [...anatomicalAnomalies];
                            updatedAnomalies[index].location = e.target.value;
                            setAnatomicalAnomalies(updatedAnomalies);
                          }}
                          className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select location</option>
                          <option value="Back">Back</option>
                          <option value="Spine">Spine</option>
                          <option value="Shoulder">Shoulder</option>
                          <option value="Arm">Arm</option>
                          <option value="Elbow">Elbow</option>
                          <option value="Forearm">Forearm</option>
                          <option value="Wrist">Wrist</option>
                          <option value="Hand">Hand</option>
                          <option value="Fingers">Fingers</option>
                          <option value="Hip">Hip</option>
                          <option value="Thigh">Thigh</option>
                          <option value="Knee">Knee</option>
                          <option value="Calf">Calf</option>
                          <option value="Ankle">Ankle</option>
                          <option value="Foot">Foot</option>
                          <option value="Toes">Toes</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                      
                      {anomaly.type === "Other" ? (
                        <div className="flex-1 flex gap-1">
                          <select
                            value={anomaly.type}
                            onChange={(e) => {
                              const updatedAnomalies = [...anatomicalAnomalies];
                              updatedAnomalies[index].type = e.target.value;
                              setAnatomicalAnomalies(updatedAnomalies);
                            }}
                            className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select type</option>
                            <option value="Scoliosis">Scoliosis</option>
                            <option value="Kyphosis">Kyphosis</option>
                            <option value="Lordosis">Lordosis</option>
                            <option value="Leg length discrepancy">Leg length discrepancy</option>
                            <option value="Pelvic tilt">Pelvic tilt</option>
                            <option value="Flat feet">Flat feet</option>
                            <option value="High arch">High arch</option>
                            <option value="Knock knees">Knock knees</option>
                            <option value="Bow legs">Bow legs</option>
                            <option value="Limited range of motion">Limited range of motion</option>
                            <option value="Joint hypermobility">Joint hypermobility</option>
                            <option value="Congenital anomaly">Congenital anomaly</option>
                            <option value="Postural deviation">Postural deviation</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify type"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={anomaly.observation.split('|')[1] || ''}
                            onChange={(e) => {
                              const updatedAnomalies = [...anatomicalAnomalies];
                              const parts = anomaly.observation.split('|');
                              parts[1] = e.target.value;
                              updatedAnomalies[index].observation = parts.join('|');
                              setAnatomicalAnomalies(updatedAnomalies);
                            }}
                          />
                        </div>
                      ) : (
                        <select
                          value={anomaly.type}
                          onChange={(e) => {
                            const updatedAnomalies = [...anatomicalAnomalies];
                            updatedAnomalies[index].type = e.target.value;
                            setAnatomicalAnomalies(updatedAnomalies);
                          }}
                          className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select type</option>
                          <option value="Scoliosis">Scoliosis</option>
                          <option value="Kyphosis">Kyphosis</option>
                          <option value="Lordosis">Lordosis</option>
                          <option value="Leg length discrepancy">Leg length discrepancy</option>
                          <option value="Pelvic tilt">Pelvic tilt</option>
                          <option value="Flat feet">Flat feet</option>
                          <option value="High arch">High arch</option>
                          <option value="Knock knees">Knock knees</option>
                          <option value="Bow legs">Bow legs</option>
                          <option value="Limited range of motion">Limited range of motion</option>
                          <option value="Joint hypermobility">Joint hypermobility</option>
                          <option value="Congenital anomaly">Congenital anomaly</option>
                          <option value="Postural deviation">Postural deviation</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                      <input
                        type="text"
                        value={anomaly.observation}
                        onChange={(e) => {
                          const updatedAnomalies = [...anatomicalAnomalies];
                          updatedAnomalies[index].observation = e.target.value;
                          setAnatomicalAnomalies(updatedAnomalies);
                        }}
                        placeholder="Observations"
                        className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={() => {
                          const updatedAnomalies = [...anatomicalAnomalies];
                          updatedAnomalies.splice(index, 1);
                          setAnatomicalAnomalies(updatedAnomalies);
                        }}
                        className="p-2 text-red-500 hover:text-red-700"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {/* Add new anatomical anomaly */}
                  <div className="flex items-center gap-2 mb-2" id="new-anomaly-container">
                    <select
                      id="anomaly-location"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById('new-anomaly-container');
                        const customLocationInput = document.getElementById('anomaly-location-custom');
                        
                        if (e.target.value === 'Other' && container && !customLocationInput) {
                          // Insert custom input after select
                          const customField = document.createElement('input');
                          customField.id = 'anomaly-location-custom';
                          customField.type = 'text';
                          customField.placeholder = 'Specify location';
                          customField.className = 'flex-1 text-sm p-2 border border-gray-300 rounded-md';
                          container.insertBefore(customField, document.getElementById('anomaly-type'));
                        } else if (e.target.value !== 'Other' && customLocationInput) {
                          customLocationInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>Select location</option>
                      <option value="Back">Back</option>
                      <option value="Spine">Spine</option>
                      <option value="Shoulder">Shoulder</option>
                      <option value="Arm">Arm</option>
                      <option value="Elbow">Elbow</option>
                      <option value="Forearm">Forearm</option>
                      <option value="Wrist">Wrist</option>
                      <option value="Hand">Hand</option>
                      <option value="Fingers">Fingers</option>
                      <option value="Hip">Hip</option>
                      <option value="Thigh">Thigh</option>
                      <option value="Knee">Knee</option>
                      <option value="Calf">Calf</option>
                      <option value="Ankle">Ankle</option>
                      <option value="Foot">Foot</option>
                      <option value="Toes">Toes</option>
                      <option value="Other">Other</option>
                    </select>
                    <select
                      id="anomaly-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById('new-anomaly-container');
                        const customTypeInput = document.getElementById('anomaly-type-custom');
                        
                        if (e.target.value === 'Other' && container && !customTypeInput) {
                          // Insert custom input after select
                          const customField = document.createElement('input');
                          customField.id = 'anomaly-type-custom';
                          customField.type = 'text';
                          customField.placeholder = 'Specify type';
                          customField.className = 'flex-1 text-sm p-2 border border-gray-300 rounded-md';
                          container.insertBefore(customField, document.getElementById('anomaly-observation'));
                        } else if (e.target.value !== 'Other' && customTypeInput) {
                          customTypeInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>Select type</option>
                      <option value="Scoliosis">Scoliosis</option>
                      <option value="Kyphosis">Kyphosis</option>
                      <option value="Lordosis">Lordosis</option>
                      <option value="Leg length discrepancy">Leg length discrepancy</option>
                      <option value="Pelvic tilt">Pelvic tilt</option>
                      <option value="Flat feet">Flat feet</option>
                      <option value="High arch">High arch</option>
                      <option value="Knock knees">Knock knees</option>
                      <option value="Bow legs">Bow legs</option>
                      <option value="Limited range of motion">Limited range of motion</option>
                      <option value="Joint hypermobility">Joint hypermobility</option>
                      <option value="Congenital anomaly">Congenital anomaly</option>
                      <option value="Postural deviation">Postural deviation</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      id="anomaly-observation"
                      placeholder="Observations"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                    />
                    <button
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      onClick={() => {
                        const locationSelect = document.getElementById('anomaly-location') as HTMLSelectElement;
                        const typeSelect = document.getElementById('anomaly-type') as HTMLSelectElement;
                        const observationInput = document.getElementById('anomaly-observation') as HTMLInputElement;
                        const locationCustomInput = document.getElementById('anomaly-location-custom') as HTMLInputElement;
                        const typeCustomInput = document.getElementById('anomaly-type-custom') as HTMLInputElement;
                        
                        if (locationSelect && locationSelect.value) {
                          let location = locationSelect.value;
                          let type = typeSelect ? typeSelect.value : '';
                          let observation = observationInput ? observationInput.value.trim() : '';
                          
                          // If "Other" is selected, use the custom input values
                          if (location === "Other" && locationCustomInput && locationCustomInput.value.trim()) {
                            // Store the custom location name in the observation field with a special separator
                            observation = `custom_location:${locationCustomInput.value.trim()}|${observation}`;
                          }
                          
                          if (type === "Other" && typeCustomInput && typeCustomInput.value.trim()) {
                            // Store the custom type name in the observation field with a special separator
                            observation = `${observation}|custom_type:${typeCustomInput.value.trim()}`;
                          }
                          
                          setAnatomicalAnomalies([
                            ...anatomicalAnomalies,
                            {
                              location: location,
                              type: type,
                              observation: observation
                            }
                          ]);
                          
                          // Reset inputs
                          locationSelect.selectedIndex = 0;
                          if (typeSelect) typeSelect.selectedIndex = 0;
                          if (observationInput) observationInput.value = '';
                          
                          // Remove custom inputs if they exist
                          if (locationCustomInput) locationCustomInput.remove();
                          if (typeCustomInput) typeCustomInput.remove();
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
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
              {/* Pathologies or Dysfunctions of the circulatory and respiratory systems */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  Pathologies or Dysfunctions of the Circulatory and Respiratory Systems
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Pathologies</h5>
                  
                  {/* Existing pathologies */}
                  {pathologies.map((pathology, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      {pathology.type === "Other" ? (
                        <div className="flex-1 flex gap-1">
                          <select
                            value={pathology.type}
                            onChange={(e) => {
                              const updatedPathologies = [...pathologies];
                              updatedPathologies[index].type = e.target.value;
                              setPathologies(updatedPathologies);
                            }}
                            className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select pathology</option>
                            <option value="Hypertension">Hypertension</option>
                            <option value="Hypotension">Hypotension</option>
                            <option value="Arrhythmia">Arrhythmia</option>
                            <option value="Coronary artery disease">Coronary artery disease</option>
                            <option value="Heart failure">Heart failure</option>
                            <option value="Valvular heart disease">Valvular heart disease</option>
                            <option value="Peripheral vascular disease">Peripheral vascular disease</option>
                            <option value="Deep vein thrombosis">Deep vein thrombosis</option>
                            <option value="Asthma">Asthma</option>
                            <option value="Chronic obstructive pulmonary disease">Chronic obstructive pulmonary disease</option>
                            <option value="Emphysema">Emphysema</option>
                            <option value="Bronchitis">Bronchitis</option>
                            <option value="Pneumonia">Pneumonia</option>
                            <option value="Pleural effusion">Pleural effusion</option>
                            <option value="Pulmonary embolism">Pulmonary embolism</option>
                            <option value="Sleep apnea">Sleep apnea</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify pathology"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={pathology.notes.split('|')[0] || ''}
                            onChange={(e) => {
                              const updatedPathologies = [...pathologies];
                              const parts = pathology.notes.split('|');
                              parts[0] = e.target.value;
                              updatedPathologies[index].notes = parts.join('|');
                              setPathologies(updatedPathologies);
                            }}
                          />
                        </div>
                      ) : (
                        <select
                          value={pathology.type}
                          onChange={(e) => {
                            const updatedPathologies = [...pathologies];
                            updatedPathologies[index].type = e.target.value;
                            setPathologies(updatedPathologies);
                          }}
                          className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select pathology</option>
                          <option value="Hypertension">Hypertension</option>
                          <option value="Hypotension">Hypotension</option>
                          <option value="Arrhythmia">Arrhythmia</option>
                          <option value="Coronary artery disease">Coronary artery disease</option>
                          <option value="Heart failure">Heart failure</option>
                          <option value="Valvular heart disease">Valvular heart disease</option>
                          <option value="Peripheral vascular disease">Peripheral vascular disease</option>
                          <option value="Deep vein thrombosis">Deep vein thrombosis</option>
                          <option value="Asthma">Asthma</option>
                          <option value="Chronic obstructive pulmonary disease">Chronic obstructive pulmonary disease</option>
                          <option value="Emphysema">Emphysema</option>
                          <option value="Bronchitis">Bronchitis</option>
                          <option value="Pneumonia">Pneumonia</option>
                          <option value="Pleural effusion">Pleural effusion</option>
                          <option value="Pulmonary embolism">Pulmonary embolism</option>
                          <option value="Sleep apnea">Sleep apnea</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                      <input
                        type="text"
                        value={pathology.type === "Other" ? (pathology.notes.split('|')[1] || '') : pathology.notes}
                        onChange={(e) => {
                          const updatedPathologies = [...pathologies];
                          if (pathology.type === "Other") {
                            const parts = pathology.notes.split('|');
                            parts[1] = e.target.value;
                            updatedPathologies[index].notes = parts.join('|');
                          } else {
                            updatedPathologies[index].notes = e.target.value;
                          }
                          setPathologies(updatedPathologies);
                        }}
                        placeholder="Notes"
                        className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={() => {
                          const updatedPathologies = [...pathologies];
                          updatedPathologies.splice(index, 1);
                          setPathologies(updatedPathologies);
                        }}
                        className="p-2 text-red-500 hover:text-red-700"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {/* Add new pathology */}
                  <div className="flex items-center gap-2 mb-2" id="new-pathology-container">
                    <select
                      id="pathology-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById('new-pathology-container');
                        const customInput = document.getElementById('pathology-custom');
                        
                        if (e.target.value === 'Other' && container && !customInput) {
                          // Insert custom input after select
                          const customField = document.createElement('input');
                          customField.id = 'pathology-custom';
                          customField.type = 'text';
                          customField.placeholder = 'Specify pathology';
                          customField.className = 'flex-1 text-sm p-2 border border-gray-300 rounded-md';
                          container.insertBefore(customField, document.getElementById('pathology-notes'));
                        } else if (e.target.value !== 'Other' && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>Select pathology</option>
                      <option value="Hypertension">Hypertension</option>
                      <option value="Hypotension">Hypotension</option>
                      <option value="Arrhythmia">Arrhythmia</option>
                      <option value="Coronary artery disease">Coronary artery disease</option>
                      <option value="Heart failure">Heart failure</option>
                      <option value="Valvular heart disease">Valvular heart disease</option>
                      <option value="Peripheral vascular disease">Peripheral vascular disease</option>
                      <option value="Deep vein thrombosis">Deep vein thrombosis</option>
                      <option value="Asthma">Asthma</option>
                      <option value="Chronic obstructive pulmonary disease">Chronic obstructive pulmonary disease</option>
                      <option value="Emphysema">Emphysema</option>
                      <option value="Bronchitis">Bronchitis</option>
                      <option value="Pneumonia">Pneumonia</option>
                      <option value="Pleural effusion">Pleural effusion</option>
                      <option value="Pulmonary embolism">Pulmonary embolism</option>
                      <option value="Sleep apnea">Sleep apnea</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      id="pathology-notes"
                      placeholder="Notes"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                    />
                    <button
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      onClick={() => {
                        const typeSelect = document.getElementById('pathology-type') as HTMLSelectElement;
                        const notesInput = document.getElementById('pathology-notes') as HTMLInputElement;
                        const customInput = document.getElementById('pathology-custom') as HTMLInputElement;
                        
                        if (typeSelect && typeSelect.value) {
                          let pathologyType = typeSelect.value;
                          let pathologyNotes = notesInput ? notesInput.value : '';
                          
                          // If "Other" is selected, include the custom type in the notes with a separator
                          if (pathologyType === "Other" && customInput && customInput.value) {
                            pathologyNotes = customInput.value + '|' + pathologyNotes;
                          }
                          
                          setPathologies([
                            ...pathologies,
                            {
                              type: pathologyType,
                              notes: pathologyNotes
                            }
                          ]);
                          
                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = '';
                          
                          // Remove the custom input if it exists
                          if (customInput) {
                            customInput.remove();
                          }
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Diseases or Dysfunctions of the digestive system */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  Diseases or Dysfunctions of the Digestive System
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Digestive Conditions</h5>
                  
                  {/* Stool Form multiple select */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stool Form
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Aerated", "Dense", "Liquid", "Watery", "Undigested pieces", "Greasy film"].map((form) => (
                        <div key={form} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`stool-${form.toLowerCase().replace(/\s+/g, '-')}`}
                            checked={stoolForms.includes(form)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStoolForms([...stoolForms, form]);
                              } else {
                                setStoolForms(stoolForms.filter(f => f !== form));
                              }
                            }}
                            className="mr-1 h-4 w-4 text-indigo-600 rounded border-gray-300"
                          />
                          <label
                            htmlFor={`stool-${form.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-700 mr-3"
                          >
                            {form}
                          </label>
                        </div>
                      ))}

                      {/* Other option with custom input */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="stool-other"
                          checked={stoolForms.some(form => form.startsWith("Other:"))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Add a placeholder that will be replaced when the user types something
                              setStoolForms([...stoolForms, "Other:"]);
                              // Focus on the input field
                              setTimeout(() => {
                                const otherInput = document.getElementById('stool-other-input') as HTMLInputElement;
                                if (otherInput) otherInput.focus();
                              }, 0);
                            } else {
                              // Remove any "Other:" entries
                              setStoolForms(stoolForms.filter(f => !f.startsWith("Other:")));
                            }
                          }}
                          className="mr-1 h-4 w-4 text-indigo-600 rounded border-gray-300"
                        />
                        <label htmlFor="stool-other" className="text-sm text-gray-700 mr-2">
                          Other:
                        </label>
                        <input
                          type="text"
                          id="stool-other-input"
                          placeholder="Specify"
                          disabled={!stoolForms.some(form => form.startsWith("Other:"))}
                          value={
                            stoolForms.find(form => form.startsWith("Other:"))?.substring(6) || ""
                          }
                          onChange={(e) => {
                            const otherValue = e.target.value;
                            // Replace the existing "Other:" entry with the new value
                            setStoolForms(
                              stoolForms.map(form => 
                                form.startsWith("Other:") ? `Other:${otherValue}` : form
                              )
                            );
                          }}
                          className="ml-1 text-sm p-1 border border-gray-300 rounded-md w-40"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Daily Hydration Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Hydration (liters)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        id="daily-hydration"
                        min="0"
                        step="0.1"
                        value={dailyHydration}
                        onChange={(e) => setDailyHydration(e.target.value)}
                        placeholder="Enter amount"
                        className="text-sm p-2 border border-gray-300 rounded-md w-32"
                      />
                      <span className="ml-2 text-sm text-gray-600">liters</span>
                    </div>
                  </div>
                  
                  {/* Existing digestive diseases */}
                  {digestiveDiseases.map((disease, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      {disease.type === "Other" ? (
                        <div className="flex-1 flex gap-1">
                          <select
                            value={disease.type}
                            onChange={(e) => {
                              const updatedDiseases = [...digestiveDiseases];
                              updatedDiseases[index].type = e.target.value;
                              setDigestiveDiseases(updatedDiseases);
                            }}
                            className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select condition</option>
                            <option value="Gastroesophageal reflux disease">Gastroesophageal reflux disease</option>
                            <option value="Peptic ulcer">Peptic ulcer</option>
                            <option value="Gastritis">Gastritis</option>
                            <option value="Irritable bowel syndrome">Irritable bowel syndrome</option>
                            <option value="Inflammatory bowel disease">Inflammatory bowel disease</option>
                            <option value="Crohn's disease">Crohn's disease</option>
                            <option value="Ulcerative colitis">Ulcerative colitis</option>
                            <option value="Celiac disease">Celiac disease</option>
                            <option value="Diverticulitis">Diverticulitis</option>
                            <option value="Gallstones">Gallstones</option>
                            <option value="Fatty liver disease">Fatty liver disease</option>
                            <option value="Hepatitis">Hepatitis</option>
                            <option value="Cirrhosis">Cirrhosis</option>
                            <option value="Pancreatitis">Pancreatitis</option>
                            <option value="Hiatal hernia">Hiatal hernia</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify condition"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={disease.notes.split('|')[0] || ''}
                            onChange={(e) => {
                              const updatedDiseases = [...digestiveDiseases];
                              const parts = disease.notes.split('|');
                              parts[0] = e.target.value;
                              updatedDiseases[index].notes = parts.join('|');
                              setDigestiveDiseases(updatedDiseases);
                            }}
                          />
                        </div>
                      ) : (
                        <select
                          value={disease.type}
                          onChange={(e) => {
                            const updatedDiseases = [...digestiveDiseases];
                            updatedDiseases[index].type = e.target.value;
                            setDigestiveDiseases(updatedDiseases);
                          }}
                          className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select condition</option>
                          <option value="Gastroesophageal reflux disease">Gastroesophageal reflux disease</option>
                          <option value="Peptic ulcer">Peptic ulcer</option>
                          <option value="Gastritis">Gastritis</option>
                          <option value="Irritable bowel syndrome">Irritable bowel syndrome</option>
                          <option value="Inflammatory bowel disease">Inflammatory bowel disease</option>
                          <option value="Crohn's disease">Crohn's disease</option>
                          <option value="Ulcerative colitis">Ulcerative colitis</option>
                          <option value="Celiac disease">Celiac disease</option>
                          <option value="Diverticulitis">Diverticulitis</option>
                          <option value="Gallstones">Gallstones</option>
                          <option value="Fatty liver disease">Fatty liver disease</option>
                          <option value="Hepatitis">Hepatitis</option>
                          <option value="Cirrhosis">Cirrhosis</option>
                          <option value="Pancreatitis">Pancreatitis</option>
                          <option value="Hiatal hernia">Hiatal hernia</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                      <input
                        type="text"
                        value={disease.type === "Other" ? (disease.notes.split('|')[1] || '') : disease.notes}
                        onChange={(e) => {
                          const updatedDiseases = [...digestiveDiseases];
                          if (disease.type === "Other") {
                            const parts = disease.notes.split('|');
                            parts[1] = e.target.value;
                            updatedDiseases[index].notes = parts.join('|');
                          } else {
                            updatedDiseases[index].notes = e.target.value;
                          }
                          setDigestiveDiseases(updatedDiseases);
                        }}
                        placeholder="Notes"
                        className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={() => {
                          const updatedDiseases = [...digestiveDiseases];
                          updatedDiseases.splice(index, 1);
                          setDigestiveDiseases(updatedDiseases);
                        }}
                        className="p-2 text-red-500 hover:text-red-700"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {/* Add new digestive disease */}
                  <div className="flex items-center gap-2 mb-2" id="new-digestive-container">
                    <select
                      id="digestive-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById('new-digestive-container');
                        const customInput = document.getElementById('digestive-custom');
                        
                        if (e.target.value === 'Other' && container && !customInput) {
                          // Insert custom input after select
                          const customField = document.createElement('input');
                          customField.id = 'digestive-custom';
                          customField.type = 'text';
                          customField.placeholder = 'Specify condition';
                          customField.className = 'flex-1 text-sm p-2 border border-gray-300 rounded-md';
                          container.insertBefore(customField, document.getElementById('digestive-notes'));
                        } else if (e.target.value !== 'Other' && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>Select condition</option>
                      <option value="Gastroesophageal reflux disease">Gastroesophageal reflux disease</option>
                      <option value="Peptic ulcer">Peptic ulcer</option>
                      <option value="Gastritis">Gastritis</option>
                      <option value="Irritable bowel syndrome">Irritable bowel syndrome</option>
                      <option value="Inflammatory bowel disease">Inflammatory bowel disease</option>
                      <option value="Crohn's disease">Crohn's disease</option>
                      <option value="Ulcerative colitis">Ulcerative colitis</option>
                      <option value="Celiac disease">Celiac disease</option>
                      <option value="Diverticulitis">Diverticulitis</option>
                      <option value="Gallstones">Gallstones</option>
                      <option value="Fatty liver disease">Fatty liver disease</option>
                      <option value="Hepatitis">Hepatitis</option>
                      <option value="Cirrhosis">Cirrhosis</option>
                      <option value="Pancreatitis">Pancreatitis</option>
                      <option value="Hiatal hernia">Hiatal hernia</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      id="digestive-notes"
                      placeholder="Notes"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                    />
                    <button
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      onClick={() => {
                        const typeSelect = document.getElementById('digestive-type') as HTMLSelectElement;
                        const notesInput = document.getElementById('digestive-notes') as HTMLInputElement;
                        const customInput = document.getElementById('digestive-custom') as HTMLInputElement;
                        
                        if (typeSelect && typeSelect.value) {
                          let diseaseType = typeSelect.value;
                          let diseaseNotes = notesInput ? notesInput.value : '';
                          
                          // If "Other" is selected, include the custom type in the notes with a separator
                          if (diseaseType === "Other" && customInput && customInput.value) {
                            diseaseNotes = customInput.value + '|' + diseaseNotes;
                          }
                          
                          setDigestiveDiseases([
                            ...digestiveDiseases,
                            {
                              type: diseaseType,
                              notes: diseaseNotes
                            }
                          ]);
                          
                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = '';
                          
                          // Remove the custom input if it exists
                          if (customInput) {
                            customInput.remove();
                          }
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Diseases or Dysfunctions of the urogenital system */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  Diseases or Dysfunctions of the Uro-Genital System
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Urogenital Conditions</h5>
                  
                  {/* Existing urogenital diseases */}
                  {urogenitalDiseases.map((disease, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      {disease.type === "Other" ? (
                        <div className="flex-1 flex gap-1">
                          <select
                            value={disease.type}
                            onChange={(e) => {
                              const updatedDiseases = [...urogenitalDiseases];
                              updatedDiseases[index].type = e.target.value;
                              setUrogenitalDiseases(updatedDiseases);
                            }}
                            className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select condition</option>
                            <option value="Urinary tract infection">Urinary tract infection</option>
                            <option value="Kidney stones">Kidney stones</option>
                            <option value="Kidney disease">Kidney disease</option>
                            <option value="Polycystic kidney disease">Polycystic kidney disease</option>
                            <option value="Bladder dysfunction">Bladder dysfunction</option>
                            <option value="Overactive bladder">Overactive bladder</option>
                            <option value="Urinary incontinence">Urinary incontinence</option>
                            <option value="Prostate enlargement">Prostate enlargement</option>
                            <option value="Prostatitis">Prostatitis</option>
                            <option value="Endometriosis">Endometriosis</option>
                            <option value="Uterine fibroids">Uterine fibroids</option>
                            <option value="Polycystic ovary syndrome">Polycystic ovary syndrome</option>
                            <option value="Ovarian cysts">Ovarian cysts</option>
                            <option value="Pelvic inflammatory disease">Pelvic inflammatory disease</option>
                            <option value="Sexually transmitted infection">Sexually transmitted infection</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify condition"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={disease.notes.split('|')[0] || ''}
                            onChange={(e) => {
                              const updatedDiseases = [...urogenitalDiseases];
                              const parts = disease.notes.split('|');
                              parts[0] = e.target.value;
                              updatedDiseases[index].notes = parts.join('|');
                              setUrogenitalDiseases(updatedDiseases);
                            }}
                          />
                        </div>
                      ) : (
                        <select
                          value={disease.type}
                          onChange={(e) => {
                            const updatedDiseases = [...urogenitalDiseases];
                            updatedDiseases[index].type = e.target.value;
                            setUrogenitalDiseases(updatedDiseases);
                          }}
                          className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select condition</option>
                          <option value="Urinary tract infection">Urinary tract infection</option>
                          <option value="Kidney stones">Kidney stones</option>
                          <option value="Kidney disease">Kidney disease</option>
                          <option value="Polycystic kidney disease">Polycystic kidney disease</option>
                          <option value="Bladder dysfunction">Bladder dysfunction</option>
                          <option value="Overactive bladder">Overactive bladder</option>
                          <option value="Urinary incontinence">Urinary incontinence</option>
                          <option value="Prostate enlargement">Prostate enlargement</option>
                          <option value="Prostatitis">Prostatitis</option>
                          <option value="Endometriosis">Endometriosis</option>
                          <option value="Uterine fibroids">Uterine fibroids</option>
                          <option value="Polycystic ovary syndrome">Polycystic ovary syndrome</option>
                          <option value="Ovarian cysts">Ovarian cysts</option>
                          <option value="Pelvic inflammatory disease">Pelvic inflammatory disease</option>
                          <option value="Sexually transmitted infection">Sexually transmitted infection</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                      <input
                        type="text"
                        value={disease.type === "Other" ? (disease.notes.split('|')[1] || '') : disease.notes}
                        onChange={(e) => {
                          const updatedDiseases = [...urogenitalDiseases];
                          if (disease.type === "Other") {
                            const parts = disease.notes.split('|');
                            parts[1] = e.target.value;
                            updatedDiseases[index].notes = parts.join('|');
                          } else {
                            updatedDiseases[index].notes = e.target.value;
                          }
                          setUrogenitalDiseases(updatedDiseases);
                        }}
                        placeholder="Notes"
                        className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={() => {
                          const updatedDiseases = [...urogenitalDiseases];
                          updatedDiseases.splice(index, 1);
                          setUrogenitalDiseases(updatedDiseases);
                        }}
                        className="p-2 text-red-500 hover:text-red-700"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {/* Add new urogenital disease */}
                  <div className="flex items-center gap-2 mb-2" id="new-urogenital-container">
                    <select
                      id="urogenital-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById('new-urogenital-container');
                        const customInput = document.getElementById('urogenital-custom');
                        
                        if (e.target.value === 'Other' && container && !customInput) {
                          // Insert custom input after select
                          const customField = document.createElement('input');
                          customField.id = 'urogenital-custom';
                          customField.type = 'text';
                          customField.placeholder = 'Specify condition';
                          customField.className = 'flex-1 text-sm p-2 border border-gray-300 rounded-md';
                          container.insertBefore(customField, document.getElementById('urogenital-notes'));
                        } else if (e.target.value !== 'Other' && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>Select condition</option>
                      <option value="Urinary tract infection">Urinary tract infection</option>
                      <option value="Kidney stones">Kidney stones</option>
                      <option value="Kidney disease">Kidney disease</option>
                      <option value="Polycystic kidney disease">Polycystic kidney disease</option>
                      <option value="Bladder dysfunction">Bladder dysfunction</option>
                      <option value="Overactive bladder">Overactive bladder</option>
                      <option value="Urinary incontinence">Urinary incontinence</option>
                      <option value="Prostate enlargement">Prostate enlargement</option>
                      <option value="Prostatitis">Prostatitis</option>
                      <option value="Endometriosis">Endometriosis</option>
                      <option value="Uterine fibroids">Uterine fibroids</option>
                      <option value="Polycystic ovary syndrome">Polycystic ovary syndrome</option>
                      <option value="Ovarian cysts">Ovarian cysts</option>
                      <option value="Pelvic inflammatory disease">Pelvic inflammatory disease</option>
                      <option value="Sexually transmitted infection">Sexually transmitted infection</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      id="urogenital-notes"
                      placeholder="Notes"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                    />
                    <button
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      onClick={() => {
                        const typeSelect = document.getElementById('urogenital-type') as HTMLSelectElement;
                        const notesInput = document.getElementById('urogenital-notes') as HTMLInputElement;
                        const customInput = document.getElementById('urogenital-custom') as HTMLInputElement;
                        
                        if (typeSelect && typeSelect.value) {
                          let diseaseType = typeSelect.value;
                          let diseaseNotes = notesInput ? notesInput.value : '';
                          
                          // If "Other" is selected, include the custom type in the notes with a separator
                          if (diseaseType === "Other" && customInput && customInput.value) {
                            diseaseNotes = customInput.value + '|' + diseaseNotes;
                          }
                          
                          setUrogenitalDiseases([
                            ...urogenitalDiseases,
                            {
                              type: diseaseType,
                              notes: diseaseNotes
                            }
                          ]);
                          
                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = '';
                          
                          // Remove the custom input if it exists
                          if (customInput) {
                            customInput.remove();
                          }
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Menstrual Cycle Input - Only shown for females */}
                  {isFemale && (
                    <div className="mt-6 mb-4">
                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          MENSTRUAL CYCLE
                        </label>
                        <span className="ml-2 text-xs text-blue-600 inline-block px-2 py-1 bg-blue-50 rounded">
                          Female-specific information
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          id="menstrual-cycle-frequency"
                          min="0"
                          step="1"
                          value={menstrualCycleFrequency}
                          onChange={(e) => setMenstrualCycleFrequency(e.target.value)}
                          placeholder="Enter frequency"
                          className="text-sm p-2 border border-gray-300 rounded-md w-32"
                        />
                        <span className="ml-2 text-sm text-gray-600">days</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Pregnancy Information - Only shown for females */}
                  {isFemale && (
                  <div className="mt-6 mb-4">
                    <div className="flex items-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PREGNANCY INFORMATION
                      </label>
                      <span className="ml-2 text-xs text-blue-600 inline-block px-2 py-1 bg-blue-50 rounded">
                        Female-specific information
                      </span>
                    </div>
                    
                    {/* Number of children */}
                    <div className="flex items-center mb-4">
                      <label htmlFor="children-count" className="text-sm text-gray-700 mr-2 w-44">
                        Number of children born:
                      </label>
                      <input
                        type="number"
                        id="children-count"
                        min="0"
                        step="1"
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(e.target.value)}
                        className="text-sm p-2 border border-gray-300 rounded-md w-20"
                      />
                    </div>
                    
                    {/* Pregnancies list */}
                    <div className="mb-3">
                      <div className="text-sm text-gray-700 mb-2">Pregnancy history:</div>
                      
                      {/* Existing pregnancies */}
                      {pregnancies.map((pregnancy, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <select
                            value={pregnancy.type}
                            onChange={(e) => {
                              const updatedPregnancies = [...pregnancies];
                              updatedPregnancies[index].type = e.target.value;
                              setPregnancies(updatedPregnancies);
                            }}
                            className="text-sm p-2 border border-gray-300 rounded-md w-32"
                          >
                            <option value="">Select type</option>
                            <option value="term">Term</option>
                            <option value="ectopic">Ectopic</option>
                            <option value="abortion">Abortion</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Year"
                            value={pregnancy.year}
                            onChange={(e) => {
                              const updatedPregnancies = [...pregnancies];
                              updatedPregnancies[index].year = e.target.value;
                              setPregnancies(updatedPregnancies);
                            }}
                            className="text-sm p-2 border border-gray-300 rounded-md w-20"
                          />
                          <div className="flex items-center">
                            <input
                              type="number"
                              placeholder="Weight gain"
                              value={pregnancy.weightGain}
                              min="0"
                              step="0.1"
                              onChange={(e) => {
                                const updatedPregnancies = [...pregnancies];
                                updatedPregnancies[index].weightGain = e.target.value;
                                setPregnancies(updatedPregnancies);
                              }}
                              className="text-sm p-2 border border-gray-300 rounded-md w-24"
                            />
                            <span className="text-xs text-gray-500 ml-1">kg</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Notes"
                            value={pregnancy.notes}
                            onChange={(e) => {
                              const updatedPregnancies = [...pregnancies];
                              updatedPregnancies[index].notes = e.target.value;
                              setPregnancies(updatedPregnancies);
                            }}
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                          />
                          <button
                            onClick={() => {
                              const updatedPregnancies = [...pregnancies];
                              updatedPregnancies.splice(index, 1);
                              setPregnancies(updatedPregnancies);
                            }}
                            className="p-2 text-red-500 hover:text-red-700"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      
                      {/* Add new pregnancy */}
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          id="pregnancy-type"
                          className="text-sm p-2 border border-gray-300 rounded-md w-32"
                          defaultValue=""
                        >
                          <option value="" disabled>Select type</option>
                          <option value="term">Term</option>
                          <option value="ectopic">Ectopic</option>
                          <option value="abortion">Abortion</option>
                        </select>
                        <input
                          type="text"
                          id="pregnancy-year"
                          placeholder="Year"
                          className="text-sm p-2 border border-gray-300 rounded-md w-20"
                        />
                        <div className="flex items-center">
                          <input
                            type="number"
                            id="pregnancy-weight-gain"
                            min="0"
                            step="0.1"
                            placeholder="Weight gain"
                            className="text-sm p-2 border border-gray-300 rounded-md w-24"
                          />
                          <span className="text-xs text-gray-500 ml-1">kg</span>
                        </div>
                        <input
                          type="text"
                          id="pregnancy-notes"
                          placeholder="Notes"
                          className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                        />
                        <button
                          className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                          onClick={() => {
                            const typeSelect = document.getElementById('pregnancy-type') as HTMLSelectElement;
                            const yearInput = document.getElementById('pregnancy-year') as HTMLInputElement;
                            const weightGainInput = document.getElementById('pregnancy-weight-gain') as HTMLInputElement;
                            const notesInput = document.getElementById('pregnancy-notes') as HTMLInputElement;
                            
                            if (typeSelect && typeSelect.value) {
                              setPregnancies([
                                ...pregnancies,
                                {
                                  type: typeSelect.value,
                                  year: yearInput ? yearInput.value : '',
                                  weightGain: weightGainInput ? weightGainInput.value : '',
                                  notes: notesInput ? notesInput.value : ''
                                }
                              ]);
                              
                              // Reset inputs
                              typeSelect.selectedIndex = 0;
                              if (yearInput) yearInput.value = '';
                              if (weightGainInput) weightGainInput.value = '';
                              if (notesInput) notesInput.value = '';
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  )}
                  
                  {/* Weight Changes in Recent Years */}
                  <div className="mt-6 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WEIGHT CHANGES IN RECENT YEARS
                    </label>
                    
                    {/* Existing weight changes */}
                    <div className="mb-3">
                      {weightChanges.map((change, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={change.amount}
                              onChange={(e) => {
                                const updatedChanges = [...weightChanges];
                                updatedChanges[index].amount = e.target.value;
                                setWeightChanges(updatedChanges);
                              }}
                              step="0.1"
                              placeholder="±kg"
                              className="text-sm p-2 border border-gray-300 rounded-md w-20"
                            />
                            <span className="text-xs text-gray-500 ml-1">kg</span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={change.timeSpan}
                              onChange={(e) => {
                                const updatedChanges = [...weightChanges];
                                updatedChanges[index].timeSpan = e.target.value;
                                setWeightChanges(updatedChanges);
                              }}
                              placeholder="Time span"
                              className="text-sm p-2 border border-gray-300 rounded-md w-28"
                            />
                          </div>
                          <input
                            type="text"
                            value={change.notes}
                            onChange={(e) => {
                              const updatedChanges = [...weightChanges];
                              updatedChanges[index].notes = e.target.value;
                              setWeightChanges(updatedChanges);
                            }}
                            placeholder="Notes"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                          />
                          <button
                            onClick={() => {
                              const updatedChanges = [...weightChanges];
                              updatedChanges.splice(index, 1);
                              setWeightChanges(updatedChanges);
                            }}
                            className="p-2 text-red-500 hover:text-red-700"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      
                      {/* Add new weight change */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <input
                            type="number"
                            id="weight-change-amount"
                            step="0.1"
                            placeholder="±kg"
                            className="text-sm p-2 border border-gray-300 rounded-md w-20"
                          />
                          <span className="text-xs text-gray-500 ml-1">kg</span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="text"
                            id="weight-change-timespan"
                            placeholder="Time span"
                            className="text-sm p-2 border border-gray-300 rounded-md w-28"
                          />
                        </div>
                        <input
                          type="text"
                          id="weight-change-notes"
                          placeholder="Notes (e.g., 'over 6 months', 'after diet change')"
                          className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                        />
                        <button
                          className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                          onClick={() => {
                            const amountInput = document.getElementById('weight-change-amount') as HTMLInputElement;
                            const timeSpanInput = document.getElementById('weight-change-timespan') as HTMLInputElement;
                            const notesInput = document.getElementById('weight-change-notes') as HTMLInputElement;
                            
                            if (amountInput && amountInput.value) {
                              setWeightChanges([
                                ...weightChanges,
                                {
                                  amount: amountInput.value,
                                  timeSpan: timeSpanInput ? timeSpanInput.value : '',
                                  notes: notesInput ? notesInput.value : ''
                                }
                              ]);
                              
                              // Reset inputs
                              amountInput.value = '';
                              if (timeSpanInput) timeSpanInput.value = '';
                              if (notesInput) notesInput.value = '';
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter positive values for weight gain (e.g., "5.5") and negative values for weight loss (e.g., "-3.2").
                        For time span, enter periods like "6 months," "2 years," etc.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Eye System: Visual Disorders and Diseases */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  Eye System: Visual Disorders and Diseases
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Visual Aid</h5>
                  
                  {/* Eyewear and dominant eye */}
                  <div className="space-y-4 mb-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="wearing-glasses"
                          checked={wearingGlasses}
                          onChange={(e) => setWearingGlasses(e.target.checked)}
                          className="mr-2 h-4 w-4 text-indigo-600 rounded border-gray-300"
                        />
                        <label htmlFor="wearing-glasses" className="text-sm text-gray-700">
                          Wearing glasses
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="wearing-contact-lenses"
                          checked={wearingContactLenses}
                          onChange={(e) => setWearingContactLenses(e.target.checked)}
                          className="mr-2 h-4 w-4 text-indigo-600 rounded border-gray-300"
                        />
                        <label htmlFor="wearing-contact-lenses" className="text-sm text-gray-700">
                          Wearing contact lenses
                        </label>
                      </div>
                    </div>
                    
                    {/* Dominant eye selection */}
                    <div className="rounded-md border border-gray-200 p-3 bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dominant Eye
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center" title="Right eye (Dx)">
                          <div className="bg-blue-50 border border-blue-200 rounded-l-md px-2 py-1">
                            <span className="text-sm text-blue-700 font-medium">Dx</span>
                          </div>
                          <input
                            type="text"
                            value={dominantEye === "Right (Dx)" ? dominantEyeAngle : ""}
                            onChange={(e) => {
                              setDominantEye("Right (Dx)");
                              setDominantEyeAngle(e.target.value);
                            }}
                            placeholder="Angle"
                            className="text-sm p-1 border-y border-r border-gray-300 rounded-r-md w-16"
                          />
                        </div>
                        
                        <div className="flex items-center" title="Left eye (Sx)">
                          <div className="bg-red-50 border border-red-200 rounded-l-md px-2 py-1">
                            <span className="text-sm text-red-700 font-medium">Sx</span>
                          </div>
                          <input
                            type="text"
                            value={dominantEye === "Left (Sx)" ? dominantEyeAngle : ""}
                            onChange={(e) => {
                              setDominantEye("Left (Sx)");
                              setDominantEyeAngle(e.target.value);
                            }}
                            placeholder="Angle"
                            className="text-sm p-1 border-y border-r border-gray-300 rounded-r-md w-16"
                          />
                        </div>
                        
                        <span className="text-xs text-gray-500 ml-2">
                          Enter angle in the dominant eye field
                        </span>
                      </div>
                    </div>
                    
                    {/* Vision quality tracking */}
                    <div className="rounded-md border border-gray-200 p-3 bg-gray-50 mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vision Quality
                      </label>
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <label htmlFor="vision-eye-count" className="block text-xs text-gray-600 mb-1">
                            Client sees well with:
                          </label>
                          <select
                            id="vision-eye-count"
                            value={visionQuality.eyeCount}
                            onChange={(e) => {
                              setVisionQuality({
                                ...visionQuality,
                                eyeCount: e.target.value
                              });
                            }}
                            className="text-sm p-2 border border-gray-300 rounded-md w-36"
                          >
                            <option value="">Select</option>
                            <option value="one">One eye</option>
                            <option value="both">Both eyes</option>
                          </select>
                        </div>
                        
                        {visionQuality.eyeCount === "one" && (
                          <div>
                            <label htmlFor="vision-eye-dominance" className="block text-xs text-gray-600 mb-1">
                              Which eye:
                            </label>
                            <select
                              id="vision-eye-dominance"
                              value={visionQuality.eyeDominance}
                              onChange={(e) => {
                                setVisionQuality({
                                  ...visionQuality,
                                  eyeDominance: e.target.value
                                });
                              }}
                              className="text-sm p-2 border border-gray-300 rounded-md w-40"
                            >
                              <option value="">Select</option>
                              <option value="dominant">Dominant eye</option>
                              <option value="non-dominant">Non-dominant eye</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Convergence Test */}
                    <div className="rounded-md border border-gray-200 p-3 bg-gray-50 mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Convergence Test
                      </label>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="convergence-result" className="block text-xs text-gray-600 mb-1">
                            Test Result:
                          </label>
                          <select
                            id="convergence-result"
                            value={convergenceTest.result}
                            onChange={(e) => {
                              setConvergenceTest({
                                ...convergenceTest,
                                result: e.target.value
                              });
                            }}
                            className="text-sm p-2 border border-gray-300 rounded-md w-full"
                          >
                            <option value="">Select result</option>
                            <option value="normal">Normal convergence</option>
                            <option value="insufficient">Insufficient convergence</option>
                            <option value="excessive">Excessive convergence</option>
                          </select>
                        </div>
                        
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label htmlFor="convergence-distance" className="block text-xs text-gray-600 mb-1">
                              Near Point Distance:
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                id="convergence-distance"
                                min="0"
                                step="0.1"
                                value={convergenceTest.distanceCm}
                                onChange={(e) => {
                                  setConvergenceTest({
                                    ...convergenceTest,
                                    distanceCm: e.target.value
                                  });
                                }}
                                placeholder="Distance"
                                className="text-sm p-2 border border-gray-300 rounded-l-md w-24"
                              />
                              <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md py-2 px-3 text-sm text-gray-500">
                                cm
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="convergence-notes" className="block text-xs text-gray-600 mb-1">
                            Additional Notes:
                          </label>
                          <input
                            type="text"
                            id="convergence-notes"
                            value={convergenceTest.notes}
                            onChange={(e) => {
                              setConvergenceTest({
                                ...convergenceTest,
                                notes: e.target.value
                              });
                            }}
                            placeholder="Any additional observations"
                            className="text-sm p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Eye Conditions */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Eye Conditions
                    </label>
                    
                    {/* Existing eye conditions */}
                    {eyeConditions.map((condition, index) => (
                      <div key={index} className="mb-2 p-2 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center gap-2">
                          <select
                            value={condition.condition}
                            onChange={(e) => {
                              const updatedConditions = [...eyeConditions];
                              updatedConditions[index].condition = e.target.value;
                              setEyeConditions(updatedConditions);
                            }}
                            className="text-sm p-1.5 border border-gray-300 rounded-md w-40"
                          >
                            <option value="">Select condition</option>
                            <option value="Myopia">Myopia</option>
                            <option value="Hyperopia">Hyperopia</option>
                            <option value="Astigmatism">Astigmatism</option>
                            <option value="Presbyopia">Presbyopia</option>
                            <option value="Glaucoma">Glaucoma</option>
                            <option value="Cataract">Cataract</option>
                            <option value="Macular Degeneration">Macular Degen.</option>
                            <option value="Diabetic Retinopathy">Diabetic Retin.</option>
                            <option value="Amblyopia">Amblyopia</option>
                            <option value="Strabismus">Strabismus</option>
                            <option value="Dry Eye Syndrome">Dry Eye</option>
                            <option value="Other">Other</option>
                          </select>
                          
                          {condition.condition === "Other" && (
                            <input
                              type="text"
                              value={condition.observation.split('|')[0] || ''}
                              onChange={(e) => {
                                const updatedConditions = [...eyeConditions];
                                const parts = condition.observation.split('|');
                                parts[0] = e.target.value;
                                updatedConditions[index].observation = parts.join('|');
                                setEyeConditions(updatedConditions);
                              }}
                              placeholder="Custom"
                              className="text-sm p-1.5 border border-gray-300 rounded-md w-20"
                            />
                          )}
                          
                          <div className="flex items-center" title="Right eye (Dx)">
                            <div className="bg-blue-50 border border-blue-200 rounded-l-md px-2 py-1">
                              <span className="text-sm text-blue-700 font-medium">Dx</span>
                            </div>
                            <input
                              type="text"
                              value={condition.rightEyeAngle}
                              onChange={(e) => {
                                const updatedConditions = [...eyeConditions];
                                updatedConditions[index].rightEyeAngle = e.target.value;
                                setEyeConditions(updatedConditions);
                              }}
                              placeholder="Angle"
                              className="text-sm p-1 border-y border-r border-gray-300 rounded-r-md w-16"
                            />
                          </div>
                          
                          <div className="flex items-center" title="Left eye (Sx)">
                            <div className="bg-red-50 border border-red-200 rounded-l-md px-2 py-1">
                              <span className="text-sm text-red-700 font-medium">Sx</span>
                            </div>
                            <input
                              type="text"
                              value={condition.leftEyeAngle}
                              onChange={(e) => {
                                const updatedConditions = [...eyeConditions];
                                updatedConditions[index].leftEyeAngle = e.target.value;
                                setEyeConditions(updatedConditions);
                              }}
                              placeholder="Angle"
                              className="text-sm p-1 border-y border-r border-gray-300 rounded-r-md w-16"
                            />
                          </div>
                          
                          <input
                            type="text"
                            value={condition.condition === "Other" 
                              ? (condition.observation.split('|')[1] || '') 
                              : condition.observation}
                            onChange={(e) => {
                              const updatedConditions = [...eyeConditions];
                              if (condition.condition === "Other") {
                                const parts = condition.observation.split('|');
                                parts[1] = e.target.value;
                                updatedConditions[index].observation = parts.join('|');
                              } else {
                                updatedConditions[index].observation = e.target.value;
                              }
                              setEyeConditions(updatedConditions);
                            }}
                            placeholder="Notes"
                            className="flex-1 text-sm p-1.5 border border-gray-300 rounded-md min-w-20"
                          />
                          
                          <button
                            onClick={() => {
                              const updatedConditions = [...eyeConditions];
                              updatedConditions.splice(index, 1);
                              setEyeConditions(updatedConditions);
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add new eye condition */}
                    <div className="p-2 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center gap-2">
                        <select
                          id="eye-condition-type"
                          className="text-sm p-1.5 border border-gray-300 rounded-md w-40"
                          defaultValue=""
                          onChange={(e) => {
                            const customContainer = document.getElementById('custom-condition-container');
                            if (customContainer) {
                              if (e.target.value === 'Other') {
                                customContainer.innerHTML = `
                                  <input
                                    type="text"
                                    id="custom-condition-input"
                                    placeholder="Custom"
                                    class="text-sm p-1.5 border border-gray-300 rounded-md w-20"
                                  />
                                `;
                              } else {
                                customContainer.innerHTML = '';
                              }
                            }
                          }}
                        >
                          <option value="" disabled>Select condition</option>
                          <option value="Myopia">Myopia</option>
                          <option value="Hyperopia">Hyperopia</option>
                          <option value="Astigmatism">Astigmatism</option>
                          <option value="Presbyopia">Presbyopia</option>
                          <option value="Glaucoma">Glaucoma</option>
                          <option value="Cataract">Cataract</option>
                          <option value="Macular Degeneration">Macular Degen.</option>
                          <option value="Diabetic Retinopathy">Diabetic Retin.</option>
                          <option value="Amblyopia">Amblyopia</option>
                          <option value="Strabismus">Strabismus</option>
                          <option value="Dry Eye Syndrome">Dry Eye</option>
                          <option value="Other">Other</option>
                        </select>
                        
                        <div id="custom-condition-container"></div>
                        
                        <div className="flex items-center" title="Right eye (Dx)">
                          <div className="bg-blue-50 border border-blue-200 rounded-l-md px-2 py-1">
                            <span className="text-sm text-blue-700 font-medium">Dx</span>
                          </div>
                          <input
                            type="text"
                            id="new-right-eye-angle"
                            placeholder="Angle"
                            className="text-sm p-1 border-y border-r border-gray-300 rounded-r-md w-16"
                          />
                        </div>
                        
                        <div className="flex items-center" title="Left eye (Sx)">
                          <div className="bg-red-50 border border-red-200 rounded-l-md px-2 py-1">
                            <span className="text-sm text-red-700 font-medium">Sx</span>
                          </div>
                          <input
                            type="text"
                            id="new-left-eye-angle"
                            placeholder="Angle"
                            className="text-sm p-1 border-y border-r border-gray-300 rounded-r-md w-16"
                          />
                        </div>
                        
                        <input
                          type="text"
                          id="new-eye-condition-notes"
                          placeholder="Notes"
                          className="flex-1 text-sm p-1.5 border border-gray-300 rounded-md min-w-20"
                        />
                        
                        <button
                          className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                          onClick={() => {
                            const typeSelect = document.getElementById('eye-condition-type') as HTMLSelectElement;
                            const rightEyeAngle = document.getElementById('new-right-eye-angle') as HTMLInputElement;
                            const leftEyeAngle = document.getElementById('new-left-eye-angle') as HTMLInputElement;
                            const notesInput = document.getElementById('new-eye-condition-notes') as HTMLInputElement;
                            const customInput = document.getElementById('custom-condition-input') as HTMLInputElement;
                            
                            // Check if a condition is selected and at least one angle is provided
                            if (typeSelect && typeSelect.value && (rightEyeAngle.value || leftEyeAngle.value)) {
                              let condition = typeSelect.value;
                              let observation = notesInput ? notesInput.value : '';
                              
                              // If "Other" is selected, use the custom input value
                              if (condition === "Other" && customInput && customInput.value) {
                                // Store the custom condition in the observation field with a separator
                                observation = `${customInput.value}|${observation}`;
                              }
                              
                              setEyeConditions([
                                ...eyeConditions,
                                {
                                  condition,
                                  rightEyeAngle: rightEyeAngle.value || '',
                                  leftEyeAngle: leftEyeAngle.value || '',
                                  observation
                                }
                              ]);
                              
                              // Reset inputs
                              typeSelect.selectedIndex = 0;
                              rightEyeAngle.value = '';
                              leftEyeAngle.value = '';
                              if (notesInput) notesInput.value = '';
                              
                              // Remove custom input if it exists
                              const customContainer = document.getElementById('custom-condition-container');
                              if (customContainer) {
                                customContainer.innerHTML = '';
                              }
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional notes textarea */}
                  <div className="mb-4">
                    <label htmlFor="visual-disorders" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Eye Information
                    </label>
                    <textarea
                      id="visual-disorders"
                      value={visualDisorders}
                      onChange={(e) => setVisualDisorders(e.target.value)}
                      placeholder="Enter any additional information about the client's vision"
                      className="w-full text-sm p-2 border border-gray-300 rounded-md min-h-20"
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* ENT SPHERE: Ear, Nose, Throat Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  ENT SPHERE: Ear, Nose, Throat Conditions
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">ENT Conditions</h5>
                  
                  {/* Existing ENT conditions */}
                  {entConditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      {condition.type === "Other" ? (
                        <div className="flex-1 flex gap-1">
                          <select
                            value={condition.type}
                            onChange={(e) => {
                              const updatedConditions = [...entConditions];
                              updatedConditions[index].type = e.target.value;
                              setENTConditions(updatedConditions);
                            }}
                            className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select condition</option>
                            <option value="Tinnitus">Tinnitus</option>
                            <option value="Hearing Loss">Hearing Loss</option>
                            <option value="Vertigo">Vertigo</option>
                            <option value="Meniere's Disease">Meniere's Disease</option>
                            <option value="Ear Infection">Ear Infection</option>
                            <option value="Otosclerosis">Otosclerosis</option>
                            <option value="Sinusitis">Sinusitis</option>
                            <option value="Rhinitis">Rhinitis</option>
                            <option value="Nasal Polyps">Nasal Polyps</option>
                            <option value="Deviated Septum">Deviated Septum</option>
                            <option value="Tonsillitis">Tonsillitis</option>
                            <option value="Laryngitis">Laryngitis</option>
                            <option value="Pharyngitis">Pharyngitis</option>
                            <option value="Vocal Cord Nodules">Vocal Cord Nodules</option>
                            <option value="TMJ Disorder">TMJ Disorder</option>
                            <option value="Sleep Apnea">Sleep Apnea</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify condition"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={condition.notes.split('|')[0] || ''}
                            onChange={(e) => {
                              const updatedConditions = [...entConditions];
                              const parts = condition.notes.split('|');
                              parts[0] = e.target.value;
                              updatedConditions[index].notes = parts.join('|');
                              setENTConditions(updatedConditions);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <select
                            value={condition.type}
                            onChange={(e) => {
                              const updatedConditions = [...entConditions];
                              updatedConditions[index].type = e.target.value;
                              setENTConditions(updatedConditions);
                            }}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select condition</option>
                            <option value="Tinnitus">Tinnitus</option>
                            <option value="Hearing Loss">Hearing Loss</option>
                            <option value="Vertigo">Vertigo</option>
                            <option value="Meniere's Disease">Meniere's Disease</option>
                            <option value="Ear Infection">Ear Infection</option>
                            <option value="Otosclerosis">Otosclerosis</option>
                            <option value="Sinusitis">Sinusitis</option>
                            <option value="Rhinitis">Rhinitis</option>
                            <option value="Nasal Polyps">Nasal Polyps</option>
                            <option value="Deviated Septum">Deviated Septum</option>
                            <option value="Tonsillitis">Tonsillitis</option>
                            <option value="Laryngitis">Laryngitis</option>
                            <option value="Pharyngitis">Pharyngitis</option>
                            <option value="Vocal Cord Nodules">Vocal Cord Nodules</option>
                            <option value="TMJ Disorder">TMJ Disorder</option>
                            <option value="Sleep Apnea">Sleep Apnea</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      )}
                      
                      <input
                        type="text"
                        value={condition.type === "Other" ? condition.notes.split('|')[1] || '' : condition.notes}
                        onChange={(e) => {
                          const updatedConditions = [...entConditions];
                          if (condition.type === "Other") {
                            const parts = condition.notes.split('|');
                            parts[1] = e.target.value;
                            updatedConditions[index].notes = parts.join('|');
                          } else {
                            updatedConditions[index].notes = e.target.value;
                          }
                          setENTConditions(updatedConditions);
                        }}
                        placeholder="Notes"
                        className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={() => {
                          const updatedConditions = [...entConditions];
                          updatedConditions.splice(index, 1);
                          setENTConditions(updatedConditions);
                        }}
                        className="p-2 text-red-500 hover:text-red-700"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {/* Add new ENT condition */}
                  <div className="flex items-center gap-2 mb-2" id="new-ent-container">
                    <select
                      id="ent-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById('new-ent-container');
                        const customInput = document.getElementById('ent-custom');
                        
                        if (e.target.value === 'Other' && container && !customInput) {
                          // Insert custom input after select
                          const customField = document.createElement('input');
                          customField.id = 'ent-custom';
                          customField.type = 'text';
                          customField.placeholder = 'Specify condition';
                          customField.className = 'flex-1 text-sm p-2 border border-gray-300 rounded-md';
                          container.insertBefore(customField, document.getElementById('ent-notes'));
                        } else if (e.target.value !== 'Other' && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>Select condition</option>
                      <option value="Tinnitus">Tinnitus</option>
                      <option value="Hearing Loss">Hearing Loss</option>
                      <option value="Vertigo">Vertigo</option>
                      <option value="Meniere's Disease">Meniere's Disease</option>
                      <option value="Ear Infection">Ear Infection</option>
                      <option value="Otosclerosis">Otosclerosis</option>
                      <option value="Sinusitis">Sinusitis</option>
                      <option value="Rhinitis">Rhinitis</option>
                      <option value="Nasal Polyps">Nasal Polyps</option>
                      <option value="Deviated Septum">Deviated Septum</option>
                      <option value="Tonsillitis">Tonsillitis</option>
                      <option value="Laryngitis">Laryngitis</option>
                      <option value="Pharyngitis">Pharyngitis</option>
                      <option value="Vocal Cord Nodules">Vocal Cord Nodules</option>
                      <option value="TMJ Disorder">TMJ Disorder</option>
                      <option value="Sleep Apnea">Sleep Apnea</option>
                      <option value="Other">Other</option>
                    </select>
                    
                    <input
                      type="text"
                      id="ent-notes"
                      placeholder="Notes"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                    />
                    
                    <button
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      onClick={() => {
                        const typeSelect = document.getElementById('ent-type') as HTMLSelectElement;
                        const notesInput = document.getElementById('ent-notes') as HTMLInputElement;
                        const customInput = document.getElementById('ent-custom') as HTMLInputElement;
                        
                        if (typeSelect && typeSelect.value) {
                          let type = typeSelect.value;
                          let notes = notesInput ? notesInput.value : '';
                          
                          // If "Other" is selected, use the custom input value
                          if (type === "Other" && customInput && customInput.value) {
                            // Store the custom value in the notes field with a separator
                            notes = `${customInput.value}|${notes}`;
                          }
                          
                          setENTConditions([
                            ...entConditions,
                            {
                              type,
                              notes
                            }
                          ]);
                          
                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = '';
                          if (customInput) customInput.remove();
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              
              {/* STOMATOGNATIC APPLIANCE Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  STOMATOGNATIC APPLIANCE
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Angle's Occlusal Classification</h5>
                  
                  {/* Existing Stomatognatic conditions */}
                  {stomatognaticConditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      {condition.type === "Other" ? (
                        <div className="flex-1 flex gap-1">
                          <select
                            value={condition.type}
                            onChange={(e) => {
                              const updatedConditions = [...stomatognaticConditions];
                              updatedConditions[index].type = e.target.value;
                              setStomatognaticConditions(updatedConditions);
                            }}
                            className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select classification</option>
                            <option value="Class I (Neutrocclusion)">Class I (Neutrocclusion)</option>
                            <option value="Class II Division 1">Class II Division 1</option>
                            <option value="Class II Division 2">Class II Division 2</option>
                            <option value="Class III (Mesiocclusion)">Class III (Mesiocclusion)</option>
                            <option value="Class II Subdivision">Class II Subdivision</option>
                            <option value="Class III Subdivision">Class III Subdivision</option>
                            <option value="Normal Occlusion">Normal Occlusion</option>
                            <option value="Overjet">Overjet</option>
                            <option value="Overbite">Overbite</option>
                            <option value="Crossbite">Crossbite</option>
                            <option value="Open Bite">Open Bite</option>
                            <option value="Deep Bite">Deep Bite</option>
                            <option value="Edge-to-Edge Bite">Edge-to-Edge Bite</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify classification"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={condition.notes.split('|')[0] || ''}
                            onChange={(e) => {
                              const updatedConditions = [...stomatognaticConditions];
                              const parts = condition.notes.split('|');
                              parts[0] = e.target.value;
                              updatedConditions[index].notes = parts.join('|');
                              setStomatognaticConditions(updatedConditions);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <select
                            value={condition.type}
                            onChange={(e) => {
                              const updatedConditions = [...stomatognaticConditions];
                              updatedConditions[index].type = e.target.value;
                              setStomatognaticConditions(updatedConditions);
                            }}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select classification</option>
                            <option value="Class I (Neutrocclusion)">Class I (Neutrocclusion)</option>
                            <option value="Class II Division 1">Class II Division 1</option>
                            <option value="Class II Division 2">Class II Division 2</option>
                            <option value="Class III (Mesiocclusion)">Class III (Mesiocclusion)</option>
                            <option value="Class II Subdivision">Class II Subdivision</option>
                            <option value="Class III Subdivision">Class III Subdivision</option>
                            <option value="Normal Occlusion">Normal Occlusion</option>
                            <option value="Overjet">Overjet</option>
                            <option value="Overbite">Overbite</option>
                            <option value="Crossbite">Crossbite</option>
                            <option value="Open Bite">Open Bite</option>
                            <option value="Deep Bite">Deep Bite</option>
                            <option value="Edge-to-Edge Bite">Edge-to-Edge Bite</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <input
                          type="text"
                          value={condition.type === "Other" ? condition.notes.split('|')[1] || '' : condition.notes}
                          onChange={(e) => {
                            const updatedConditions = [...stomatognaticConditions];
                            if (condition.type === "Other") {
                              const parts = condition.notes.split('|');
                              parts[1] = e.target.value;
                              updatedConditions[index].notes = parts.join('|');
                            } else {
                              updatedConditions[index].notes = e.target.value;
                            }
                            setStomatognaticConditions(updatedConditions);
                          }}
                          placeholder="Notes"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <button
                        onClick={() => {
                          const updatedConditions = [...stomatognaticConditions];
                          updatedConditions.splice(index, 1);
                          setStomatognaticConditions(updatedConditions);
                        }}
                        className="p-2 text-red-500 hover:text-red-700"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {/* Add new Stomatognatic condition */}
                  <div className="flex items-center gap-2 mb-2" id="new-stomatognatic-container">
                    <select
                      id="stomatognatic-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById('new-stomatognatic-container');
                        const customInput = document.getElementById('stomatognatic-custom');
                        
                        if (e.target.value === 'Other' && container && !customInput) {
                          // Insert custom input after select
                          const customField = document.createElement('input');
                          customField.id = 'stomatognatic-custom';
                          customField.type = 'text';
                          customField.placeholder = 'Specify classification';
                          customField.className = 'flex-1 text-sm p-2 border border-gray-300 rounded-md';
                          container.insertBefore(customField, document.getElementById('stomatognatic-notes'));
                        } else if (e.target.value !== 'Other' && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>Select classification</option>
                      <option value="Class I (Neutrocclusion)">Class I (Neutrocclusion)</option>
                      <option value="Class II Division 1">Class II Division 1</option>
                      <option value="Class II Division 2">Class II Division 2</option>
                      <option value="Class III (Mesiocclusion)">Class III (Mesiocclusion)</option>
                      <option value="Class II Subdivision">Class II Subdivision</option>
                      <option value="Class III Subdivision">Class III Subdivision</option>
                      <option value="Normal Occlusion">Normal Occlusion</option>
                      <option value="Overjet">Overjet</option>
                      <option value="Overbite">Overbite</option>
                      <option value="Crossbite">Crossbite</option>
                      <option value="Open Bite">Open Bite</option>
                      <option value="Deep Bite">Deep Bite</option>
                      <option value="Edge-to-Edge Bite">Edge-to-Edge Bite</option>
                      <option value="Other">Other</option>
                    </select>
                    
                    <input
                      type="text"
                      id="stomatognatic-notes"
                      placeholder="Notes"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                    />
                    
                    <button
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      onClick={() => {
                        const typeSelect = document.getElementById('stomatognatic-type') as HTMLSelectElement;
                        const notesInput = document.getElementById('stomatognatic-notes') as HTMLInputElement;
                        const customInput = document.getElementById('stomatognatic-custom') as HTMLInputElement;
                        
                        if (typeSelect && typeSelect.value) {
                          let type = typeSelect.value;
                          let notes = notesInput ? notesInput.value : '';
                          
                          // If "Other" is selected, use the custom input value
                          if (type === "Other" && customInput && customInput.value) {
                            // Store the custom value in the notes field with a separator
                            notes = `${customInput.value}|${notes}`;
                          }
                          
                          setStomatognaticConditions([
                            ...stomatognaticConditions,
                            {
                              type,
                              notes
                            }
                          ]);
                          
                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = '';
                          if (customInput) customInput.remove();
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Lingual Frenulum */}
                  <div className="mt-6 pt-4 border-t border-zinc-200">
                    <label htmlFor="lingual-frenulum" className="block text-sm font-medium text-gray-700 mb-2">
                      Lingual Frenulum
                    </label>
                    <select
                      id="lingual-frenulum"
                      value={lingualFrenulum}
                      onChange={(e) => setLingualFrenulum(e.target.value)}
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>Select frenulum type</option>
                      <option value="Normal">Normal</option>
                      <option value="Short">Short</option>
                      <option value="Ankylosing">Ankylosing</option>
                      <option value="Short posterior">Short posterior</option>
                    </select>
                  </div>
                </div>
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