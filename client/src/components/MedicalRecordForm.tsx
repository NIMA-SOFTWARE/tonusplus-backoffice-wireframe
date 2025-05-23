import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Activity, 
  Heart, 
  Zap, 
  AlertTriangle, 
  Stethoscope, 
  FileText, 
  Eye, 
  Brain, 
  Target,
  Plus,
  History,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';
import TagSelectionInput from './TagSelectionInput';
import type { Participant } from '@/lib/types';

interface MedicalRecordFormProps {
  participant: Participant;
  onClose: () => void;
  sessionId?: string;
  sessionDate?: string;
  sessionTime?: string;
}

export function MedicalRecordForm({ participant, onClose, sessionId, sessionDate, sessionTime }: MedicalRecordFormProps) {
  // Form state for recurrent activities
  const [sports, setSports] = useState<string[]>([]);
  const [dailyActivities, setDailyActivities] = useState<string[]>([]);
  const [trainingTypes, setTrainingTypes] = useState<string[]>([]);
  const [profession, setProfession] = useState('');
  const [otherProfession, setOtherProfession] = useState('');

  // Participation reason state
  const [medicalDiagnostic, setMedicalDiagnostic] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);

  // Physical pains state
  const [physicalPains, setPhysicalPains] = useState<Array<{
    location: string;
    intensity: string;
    frequency: string;
    notes: string;
  }>>([]);

  // Trauma history state
  const [traumaHistory, setTraumaHistory] = useState<Array<{
    location: string;
    year: string;
  }>>([]);

  // Interface and state for surgical interventions
  interface SurgicalIntervention {
    name: string;
    year: string;
    notes: string;
  }
  const [surgicalInterventionsList, setSurgicalInterventionsList] = useState<SurgicalIntervention[]>([]);
  const [showSurgicalInterventionForm, setShowSurgicalInterventionForm] = useState(false);

  // Interface and state for circulatory/respiratory pathologies
  interface Pathology {
    type: string;
    notes: string;
  }
  const [pathologies, setPathologies] = useState<Pathology[]>([]);

  // Interface and state for digestive diseases
  interface DigestiveDisease {
    type: string;
    notes: string;
  }
  const [digestiveDiseases, setDigestiveDiseases] = useState<DigestiveDisease[]>([]);

  // Interface and state for urogenital diseases
  interface UrogenitalDisease {
    type: string;
    notes: string;
  }
  const [urogenitalDiseases, setUrogenitalDiseases] = useState<UrogenitalDisease[]>([]);

  // Physiological history state
  const [gender, setGender] = useState('');
  
  // Pregnancy state
  interface Pregnancy {
    type: string; // 'term', 'ectopic', 'abortion'
    year: string;
    weightGain: string; // in kg
    notes: string;
  }
  const [pregnancies, setPregnancies] = useState<Pregnancy[]>([]);

  // Weight changes state
  interface WeightChange {
    amount: string; // in kg (can be positive for gain or negative for loss)
    timeSpan: string; // in months/years
    notes: string;
  }
  const [weightChanges, setWeightChanges] = useState<WeightChange[]>([]);

  // Menstrual cycle state
  const [menstrualCycle, setMenstrualCycle] = useState({
    age: '',
    regular: '',
    duration: '',
    flow: '',
    painIntensity: '',
    notes: ''
  });

  // Interface and state for eye conditions
  interface EyeCondition {
    condition: string;
    rightEyeAngle: string;
    leftEyeAngle: string;
  }
  const [eyeConditions, setEyeConditions] = useState<EyeCondition[]>([]);

  // Interface and state for ENT conditions
  interface ENTCondition {
    type: string;
    notes: string;
  }
  const [entConditions, setEntConditions] = useState<ENTCondition[]>([]);

  // Interface and state for stomatognatic conditions
  interface StomatognaticCondition {
    type: string;
    notes: string;
  }
  const [stomatognaticConditions, setStomatognaticConditions] = useState<StomatognaticCondition[]>([]);

  // Teeth tracking
  interface ToothStatus {
    [key: string]: string; // FDI number as key, status code as value
  }
  const [toothStatuses, setToothStatuses] = useState<ToothStatus>({});

  // Teeth orientation by sector
  interface TeethOrientationBySector {
    [key: string]: string; // sector key (e.g., "posterior-right"), orientation as value
  }
  const [teethOrientationBySector, setTeethOrientationBySector] = useState<TeethOrientationBySector>({});

  // Interface and state for endocrine system
  interface EndocrineSystem {
    type: string;
    notes: string;
  }
  const [endocrineSystemEntries, setEndocrineSystemEntries] = useState<EndocrineSystem[]>([]);

  // Interface and state for nervous system disorders
  interface NervousSystemDisorder {
    type: string;
    notes: string;
  }
  const [nervousSystemDisorders, setNervousSystemDisorders] = useState<NervousSystemDisorder[]>([]);

  // Interface and state for other systemic disorders
  interface OtherSystemicDisorder {
    name: string;
    notes: string;
  }
  const [otherSystemicDisorders, setOtherSystemicDisorders] = useState<OtherSystemicDisorder[]>([]);

  // Interface and state for medical devices
  interface MedicalDevice {
    name: string;
    notes: string;
  }
  const [currentDevices, setCurrentDevices] = useState<MedicalDevice[]>([]);
  const [pastDevices, setPastDevices] = useState<MedicalDevice[]>([]);

  // Interface and state for instrumental exams
  interface InstrumentalExam {
    name: string;
    fileAttachment: string; // this would store file name or reference
    notes: string;
  }
  const [instrumentalExams, setInstrumentalExams] = useState<InstrumentalExam[]>([]);

  // Objective examination state
  const [objectiveExamination, setObjectiveExamination] = useState({
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    temperature: '',
    weight: '',
    height: '',
    bmi: '',
    notes: ''
  });

  // Conclusions state
  const [conclusions, setConclusions] = useState({
    diagnosis: '',
    prognosis: '',
    treatmentPlan: '',
    recommendations: '',
    followUpDate: '',
    notes: ''
  });

  // Exercises state
  const [exercises, setExercises] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = {
        participantId: participant.id,
        sessionId,
        customerId: participant.id,
        filledBy: 'Trainer', // This would come from the logged-in user
        recurrentActivities: {
          sports,
          dailyActivities,
          trainingTypes,
          profession: profession === 'Other' ? otherProfession : profession
        },
        participationReason: {
          medicalDiagnostic,
          symptoms
        },
        physicalPains,
        traumaHistory,
        surgicalInterventions: surgicalInterventionsList,
        physiologicalHistory: {
          gender,
          pregnancies,
          weightChanges,
          menstrualCycle: gender === 'female' ? menstrualCycle : null
        },
        objectiveExamination,
        specificClinicalHistory: {
          pathologies,
          digestiveDiseases,
          urogenitalDiseases,
          eyeConditions,
          entConditions,
          stomatognaticConditions,
          toothStatuses,
          teethOrientationBySector,
          endocrineSystemEntries,
          nervousSystemDisorders,
          otherSystemicDisorders,
          currentDevices,
          pastDevices,
          instrumentalExams
        },
        conclusions,
        exercises
      };

      const response = await fetch('/api/medical-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose();
      } else {
        console.error('Failed to save medical record');
      }
    } catch (error) {
      console.error('Error saving medical record:', error);
    }
  };

  const addPhysicalPain = () => {
    setPhysicalPains([...physicalPains, { location: '', intensity: '', frequency: '', notes: '' }]);
  };

  const updatePhysicalPain = (index: number, field: string, value: string) => {
    const updated = [...physicalPains];
    updated[index] = { ...updated[index], [field]: value };
    setPhysicalPains(updated);
  };

  const removePhysicalPain = (index: number) => {
    setPhysicalPains(physicalPains.filter((_, i) => i !== index));
  };

  const addTrauma = () => {
    setTraumaHistory([...traumaHistory, { location: '', year: '' }]);
  };

  const updateTrauma = (index: number, field: string, value: string) => {
    const updated = [...traumaHistory];
    updated[index] = { ...updated[index], [field]: value };
    setTraumaHistory(updated);
  };

  const removeTrauma = (index: number) => {
    setTraumaHistory(traumaHistory.filter((_, i) => i !== index));
  };

  const addSurgicalIntervention = () => {
    setSurgicalInterventionsList([...surgicalInterventionsList, { name: '', year: '', notes: '' }]);
    setShowSurgicalInterventionForm(true);
  };

  const updateSurgicalIntervention = (index: number, field: string, value: string) => {
    const updated = [...surgicalInterventionsList];
    updated[index] = { ...updated[index], [field]: value };
    setSurgicalInterventionsList(updated);
  };

  const removeSurgicalIntervention = (index: number) => {
    setSurgicalInterventionsList(surgicalInterventionsList.filter((_, i) => i !== index));
    if (surgicalInterventionsList.length === 1) {
      setShowSurgicalInterventionForm(false);
    }
  };

  const addPathology = () => {
    setPathologies([...pathologies, { type: '', notes: '' }]);
  };

  const updatePathology = (index: number, field: string, value: string) => {
    const updated = [...pathologies];
    updated[index] = { ...updated[index], [field]: value };
    setPathologies(updated);
  };

  const removePathology = (index: number) => {
    setPathologies(pathologies.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Medical Record</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{participant.name}</span>
                </div>
                {sessionDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{sessionDate}</span>
                  </div>
                )}
                {sessionTime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{sessionTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <Accordion type="multiple" defaultValue={["activities", "participation"]} className="space-y-4">
            
            {/* Section 1: Recurrent Activities */}
            <AccordionItem value="activities">
              <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
                <div className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-blue-500" />
                  <span>Recurrent Activities</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-6">
                  
                  {/* Sports */}
                  <div className="space-y-2">
                    <TagSelectionInput
                      label="Sports"
                      placeholder="Select or add sports..."
                      options={[
                        'Football', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Cycling',
                        'Yoga', 'Pilates', 'CrossFit', 'Weight Training', 'Boxing', 'Martial Arts',
                        'Golf', 'Baseball', 'Volleyball', 'Soccer', 'Hockey', 'Skiing',
                        'Snowboarding', 'Surfing', 'Rock Climbing', 'Hiking', 'Dancing'
                      ]}
                      selectedTags={sports}
                      onTagsChange={setSports}
                      allowCustomTags={true}
                      voiceEnabled={true}
                    />
                  </div>

                  {/* Daily Activities */}
                  <div className="space-y-2">
                    <TagSelectionInput
                      label="Daily Activities"
                      placeholder="Select or add daily activities..."
                      options={[
                        'Walking', 'Stairs climbing', 'Gardening', 'Cooking', 'Cleaning',
                        'Driving', 'Computer work', 'Reading', 'Watching TV', 'Shopping',
                        'Childcare', 'Pet care', 'Heavy lifting', 'Standing for long periods',
                        'Sitting for long periods', 'Manual labor', 'Playing instruments'
                      ]}
                      selectedTags={dailyActivities}
                      onTagsChange={setDailyActivities}
                      allowCustomTags={true}
                      voiceEnabled={true}
                    />
                  </div>

                  {/* Training Types */}
                  <div className="space-y-2">
                    <TagSelectionInput
                      label="Training Types"
                      placeholder="Select or add training types..."
                      options={[
                        'Strength training', 'Cardio', 'Flexibility', 'Balance', 'Coordination',
                        'Endurance', 'Speed', 'Agility', 'Core strengthening', 'Rehabilitation',
                        'Functional training', 'Sport-specific training', 'Interval training',
                        'Circuit training', 'Plyometric training'
                      ]}
                      selectedTags={trainingTypes}
                      onTagsChange={setTrainingTypes}
                      allowCustomTags={true}
                      voiceEnabled={true}
                    />
                  </div>

                  {/* Profession */}
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <select
                      id="profession"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select profession</option>
                      <option value="Office worker">Office worker</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Healthcare worker">Healthcare worker</option>
                      <option value="Construction worker">Construction worker</option>
                      <option value="Retail worker">Retail worker</option>
                      <option value="Driver">Driver</option>
                      <option value="Chef/Cook">Chef/Cook</option>
                      <option value="Student">Student</option>
                      <option value="Retiree">Retiree</option>
                      <option value="Athlete">Professional athlete</option>
                      <option value="Artist">Artist</option>
                      <option value="Engineer">Engineer</option>
                      <option value="Sales">Sales representative</option>
                      <option value="Manager">Manager</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Other">Other</option>
                    </select>
                    
                    {profession === 'Other' && (
                      <Input
                        placeholder="Please specify profession"
                        value={otherProfession}
                        onChange={(e) => setOtherProfession(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 2: Participation Reason */}
            <AccordionItem value="participation">
              <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
                <div className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-green-500" />
                  <span>Participation Reason</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-6">
                  
                  {/* Medical Diagnostic */}
                  <div className="space-y-2">
                    <TagSelectionInput
                      label="Medical Diagnostic"
                      placeholder="Select or add medical diagnostics..."
                      options={[
                        'Back pain', 'Neck pain', 'Shoulder impingement', 'Knee pain', 'Hip dysfunction',
                        'Scoliosis', 'Herniated disc', 'Sciatica', 'Arthritis', 'Osteoporosis',
                        'Fibromyalgia', 'Post-surgery rehabilitation', 'Sports injury', 'Work-related injury',
                        'Chronic fatigue', 'Muscle weakness', 'Joint stiffness', 'Balance issues',
                        'Postural problems', 'Chronic pain syndrome'
                      ]}
                      selectedTags={medicalDiagnostic}
                      onTagsChange={setMedicalDiagnostic}
                      allowCustomTags={true}
                      voiceEnabled={true}
                    />
                  </div>

                  {/* Symptoms */}
                  <div className="space-y-2">
                    <TagSelectionInput
                      label="Symptoms"
                      placeholder="Select or add symptoms..."
                      options={[
                        'Pain', 'Stiffness', 'Weakness', 'Numbness', 'Tingling', 'Swelling',
                        'Limited range of motion', 'Muscle spasms', 'Headaches', 'Dizziness',
                        'Fatigue', 'Sleep problems', 'Anxiety', 'Depression', 'Stress',
                        'Difficulty walking', 'Difficulty climbing stairs', 'Difficulty lifting',
                        'Instability', 'Clicking/popping sounds', 'Burning sensation'
                      ]}
                      selectedTags={symptoms}
                      onTagsChange={setSymptoms}
                      allowCustomTags={true}
                      voiceEnabled={true}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 3: Physical Pains */}
            <AccordionItem value="physical-pains">
              <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  <span>Physical Pains</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  {physicalPains.map((pain, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`pain-location-${index}`}>Location</Label>
                          <Input
                            id={`pain-location-${index}`}
                            value={pain.location}
                            onChange={(e) => updatePhysicalPain(index, 'location', e.target.value)}
                            placeholder="e.g., Lower back, Right shoulder"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`pain-intensity-${index}`}>Intensity (1-10)</Label>
                          <Input
                            id={`pain-intensity-${index}`}
                            type="number"
                            min="1"
                            max="10"
                            value={pain.intensity}
                            onChange={(e) => updatePhysicalPain(index, 'intensity', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`pain-frequency-${index}`}>Frequency</Label>
                          <select
                            id={`pain-frequency-${index}`}
                            value={pain.frequency}
                            onChange={(e) => updatePhysicalPain(index, 'frequency', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select frequency</option>
                            <option value="Constant">Constant</option>
                            <option value="Frequent">Frequent</option>
                            <option value="Occasional">Occasional</option>
                            <option value="Rare">Rare</option>
                            <option value="Only with activity">Only with activity</option>
                            <option value="Only at rest">Only at rest</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor={`pain-notes-${index}`}>Additional Notes</Label>
                          <Textarea
                            id={`pain-notes-${index}`}
                            value={pain.notes}
                            onChange={(e) => updatePhysicalPain(index, 'notes', e.target.value)}
                            placeholder="Additional details about the pain..."
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removePhysicalPain(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addPhysicalPain}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Physical Pain
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 4: Trauma History */}
            <AccordionItem value="trauma">
              <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
                <div className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-orange-500" />
                  <span>Trauma History</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  {traumaHistory.map((trauma, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`trauma-location-${index}`}>Location</Label>
                          <Input
                            id={`trauma-location-${index}`}
                            value={trauma.location}
                            onChange={(e) => updateTrauma(index, 'location', e.target.value)}
                            placeholder="e.g., Head, Left ankle"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`trauma-year-${index}`}>Year</Label>
                          <Input
                            id={`trauma-year-${index}`}
                            type="number"
                            value={trauma.year}
                            onChange={(e) => updateTrauma(index, 'year', e.target.value)}
                            placeholder="e.g., 2020"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTrauma(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addTrauma}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Trauma
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 5: Surgical Interventions */}
            <AccordionItem value="surgical">
              <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
                <div className="flex items-center">
                  <Stethoscope className="mr-2 h-5 w-5 text-purple-500" />
                  <span>Surgical Interventions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  {!showSurgicalInterventionForm && surgicalInterventionsList.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Stethoscope className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg mb-2">Patient has no surgical interventions</p>
                      <p className="text-sm">Click below to add if any surgical procedures have been performed</p>
                    </div>
                  )}
                  
                  {surgicalInterventionsList.map((intervention, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`intervention-name-${index}`}>Procedure Name</Label>
                          <Input
                            id={`intervention-name-${index}`}
                            value={intervention.name}
                            onChange={(e) => updateSurgicalIntervention(index, 'name', e.target.value)}
                            placeholder="e.g., Appendectomy, Knee arthroscopy"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`intervention-year-${index}`}>Year</Label>
                          <Input
                            id={`intervention-year-${index}`}
                            type="number"
                            value={intervention.year}
                            onChange={(e) => updateSurgicalIntervention(index, 'year', e.target.value)}
                            placeholder="e.g., 2019"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor={`intervention-notes-${index}`}>Notes</Label>
                          <Textarea
                            id={`intervention-notes-${index}`}
                            value={intervention.notes}
                            onChange={(e) => updateSurgicalIntervention(index, 'notes', e.target.value)}
                            placeholder="Additional details about the procedure..."
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSurgicalIntervention(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={addSurgicalIntervention}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Surgical Intervention
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 6: Physiological History */}
            <AccordionItem value="physiological">
              <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
                <div className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-pink-500" />
                  <span>Physiological History</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-6">
                  
                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  {/* Female-specific sections */}
                  {gender === 'female' && (
                    <>
                      {/* Menstrual Cycle */}
                      <div className="space-y-4 border-t pt-4">
                        <h4 className="text-sm font-semibold uppercase text-gray-600">Menstrual Cycle</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="menstrual-age">Age at first menstruation</Label>
                            <Input
                              id="menstrual-age"
                              type="number"
                              value={menstrualCycle.age}
                              onChange={(e) => setMenstrualCycle({...menstrualCycle, age: e.target.value})}
                              placeholder="Age"
                            />
                          </div>
                          <div>
                            <Label htmlFor="menstrual-regular">Regular cycle</Label>
                            <select
                              id="menstrual-regular"
                              value={menstrualCycle.regular}
                              onChange={(e) => setMenstrualCycle({...menstrualCycle, regular: e.target.value})}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                              <option value="irregular">Irregular</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="menstrual-duration">Duration (days)</Label>
                            <Input
                              id="menstrual-duration"
                              type="number"
                              value={menstrualCycle.duration}
                              onChange={(e) => setMenstrualCycle({...menstrualCycle, duration: e.target.value})}
                              placeholder="Days"
                            />
                          </div>
                          <div>
                            <Label htmlFor="menstrual-flow">Flow intensity</Label>
                            <select
                              id="menstrual-flow"
                              value={menstrualCycle.flow}
                              onChange={(e) => setMenstrualCycle({...menstrualCycle, flow: e.target.value})}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select</option>
                              <option value="light">Light</option>
                              <option value="normal">Normal</option>
                              <option value="heavy">Heavy</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="menstrual-pain">Pain intensity (1-10)</Label>
                            <Input
                              id="menstrual-pain"
                              type="number"
                              min="1"
                              max="10"
                              value={menstrualCycle.painIntensity}
                              onChange={(e) => setMenstrualCycle({...menstrualCycle, painIntensity: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="menstrual-notes">Additional notes</Label>
                            <Textarea
                              id="menstrual-notes"
                              value={menstrualCycle.notes}
                              onChange={(e) => setMenstrualCycle({...menstrualCycle, notes: e.target.value})}
                              placeholder="Any additional information..."
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 7: Objective Examination */}
            <AccordionItem value="objective">
              <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
                <div className="flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-cyan-500" />
                  <span>Objective Examination</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blood-pressure">Blood Pressure (mmHg)</Label>
                      <Input
                        id="blood-pressure"
                        value={objectiveExamination.bloodPressure}
                        onChange={(e) => setObjectiveExamination({...objectiveExamination, bloodPressure: e.target.value})}
                        placeholder="e.g., 120/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
                      <Input
                        id="heart-rate"
                        type="number"
                        value={objectiveExamination.heartRate}
                        onChange={(e) => setObjectiveExamination({...objectiveExamination, heartRate: e.target.value})}
                        placeholder="e.g., 72"
                      />
                    </div>
                    <div>
                      <Label htmlFor="respiratory-rate">Respiratory Rate (breaths/min)</Label>
                      <Input
                        id="respiratory-rate"
                        type="number"
                        value={objectiveExamination.respiratoryRate}
                        onChange={(e) => setObjectiveExamination({...objectiveExamination, respiratoryRate: e.target.value})}
                        placeholder="e.g., 16"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oxygen-saturation">Oxygen Saturation (%)</Label>
                      <Input
                        id="oxygen-saturation"
                        type="number"
                        value={objectiveExamination.oxygenSaturation}
                        onChange={(e) => setObjectiveExamination({...objectiveExamination, oxygenSaturation: e.target.value})}
                        placeholder="e.g., 98"
                      />
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={objectiveExamination.temperature}
                        onChange={(e) => setObjectiveExamination({...objectiveExamination, temperature: e.target.value})}
                        placeholder="e.g., 36.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={objectiveExamination.weight}
                        onChange={(e) => setObjectiveExamination({...objectiveExamination, weight: e.target.value})}
                        placeholder="e.g., 70.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={objectiveExamination.height}
                        onChange={(e) => setObjectiveExamination({...objectiveExamination, height: e.target.value})}
                        placeholder="e.g., 175"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bmi">BMI</Label>
                      <Input
                        id="bmi"
                        type="number"
                        step="0.1"
                        value={objectiveExamination.bmi}
                        onChange={(e) => setObjectiveExamination({...objectiveExamination, bmi: e.target.value})}
                        placeholder="Calculated or measured"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="examination-notes">Additional Notes</Label>
                    <Textarea
                      id="examination-notes"
                      value={objectiveExamination.notes}
                      onChange={(e) => setObjectiveExamination({...objectiveExamination, notes: e.target.value})}
                      placeholder="Any additional observations..."
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 8: Specific Clinical History */}
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
                      
                      {pathologies.map((pathology, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <select
                            value={pathology.type}
                            onChange={(e) => updatePathology(index, 'type', e.target.value)}
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select condition</option>
                            <option value="Hypertension">Hypertension</option>
                            <option value="Hypotension">Hypotension</option>
                            <option value="Arrhythmia">Arrhythmia</option>
                            <option value="Heart disease">Heart disease</option>
                            <option value="Asthma">Asthma</option>
                            <option value="COPD">COPD</option>
                            <option value="Bronchitis">Bronchitis</option>
                            <option value="Pneumonia">Pneumonia</option>
                            <option value="Sleep apnea">Sleep apnea</option>
                            <option value="Other">Other</option>
                          </select>
                          <Input
                            value={pathology.notes}
                            onChange={(e) => updatePathology(index, 'notes', e.target.value)}
                            placeholder="Notes"
                            className="flex-1 text-sm"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removePathology(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      
                      <Button type="button" variant="outline" size="sm" onClick={addPathology}>
                        <Plus className="mr-1 h-3 w-3" />
                        Add Pathology
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 9: Conclusions */}
            <AccordionItem value="conclusions">
              <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
                <div className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-gray-600" />
                  <span>Conclusions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Textarea
                      id="diagnosis"
                      value={conclusions.diagnosis}
                      onChange={(e) => setConclusions({...conclusions, diagnosis: e.target.value})}
                      placeholder="Primary and secondary diagnoses..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="prognosis">Prognosis</Label>
                    <Textarea
                      id="prognosis"
                      value={conclusions.prognosis}
                      onChange={(e) => setConclusions({...conclusions, prognosis: e.target.value})}
                      placeholder="Expected outcome and timeline..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="treatment-plan">Treatment Plan</Label>
                    <Textarea
                      id="treatment-plan"
                      value={conclusions.treatmentPlan}
                      onChange={(e) => setConclusions({...conclusions, treatmentPlan: e.target.value})}
                      placeholder="Recommended treatment approach..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="recommendations">Recommendations</Label>
                    <Textarea
                      id="recommendations"
                      value={conclusions.recommendations}
                      onChange={(e) => setConclusions({...conclusions, recommendations: e.target.value})}
                      placeholder="Lifestyle recommendations, precautions..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="follow-up-date">Follow-up Date</Label>
                      <Input
                        id="follow-up-date"
                        type="date"
                        value={conclusions.followUpDate}
                        onChange={(e) => setConclusions({...conclusions, followUpDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="conclusion-notes">Additional Notes</Label>
                      <Textarea
                        id="conclusion-notes"
                        value={conclusions.notes}
                        onChange={(e) => setConclusions({...conclusions, notes: e.target.value})}
                        placeholder="Any additional notes..."
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 10: Exercises */}
            <AccordionItem value="exercises">
              <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
                <div className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-green-600" />
                  <span>Exercises</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <TagSelectionInput
                      label="Exercises Performed During Session"
                      placeholder="Select or add exercises..."
                      options={[
                        'Breathing exercises', 'Posture correction', 'Core strengthening', 'Balance training',
                        'Flexibility exercises', 'Strength training', 'Cardiovascular exercises', 'Coordination drills',
                        'Range of motion exercises', 'Functional movements', 'Pilates fundamentals', 'Mat work',
                        'Reformer exercises', 'Cadillac exercises', 'Chair exercises', 'Barrel exercises',
                        'Standing exercises', 'Seated exercises', 'Supine exercises', 'Prone exercises',
                        'Side-lying exercises', 'Wall exercises', 'Resistance band work', 'Free weight exercises'
                      ]}
                      selectedTags={exercises}
                      onTagsChange={setExercises}
                      allowCustomTags={true}
                      voiceEnabled={true}
                      className="mb-4"
                    />
                  </div>
                  
                  {exercises.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Exercises:</h4>
                      <div className="flex flex-wrap gap-2">
                        {exercises.map((exercise, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {exercise}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Save Medical Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}