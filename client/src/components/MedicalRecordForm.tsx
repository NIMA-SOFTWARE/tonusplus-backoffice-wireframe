import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { User, Activity, Heart, Stethoscope, FileText, Target, History } from 'lucide-react';
import TagSelectionInput from './TagSelectionInput';

interface MedicalRecordFormProps {
  participant: any;
  onClose: () => void;
  sessionId?: string;
  sessionDate?: string;
  sessionTime?: string;
}

export function MedicalRecordForm({ participant, onClose, sessionId, sessionDate, sessionTime }: MedicalRecordFormProps) {
  // State for all form sections
  const [recurrentActivities, setRecurrentActivities] = useState({
    sports: [] as string[],
    dailyActivities: [] as string[],
    trainingTypes: [] as string[],
    profession: '',
    customProfession: ''
  });

  const [participationReason, setParticipationReason] = useState({
    medicalDiagnostic: [] as string[],
    symptoms: [] as string[]
  });

  const [physicalPains, setPhysicalPains] = useState([{
    timing: '',
    type: '',
    intensity: '',
    location: '',
    evolution: '',
    treatment: '',
    triggeringReason: '',
    ongoingTherapies: ''
  }]);

  const [traumaHistory, setTraumaHistory] = useState([]);
  const [surgicalInterventions, setSurgicalInterventions] = useState([]);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);

  // Anatomical anomalies state (now part of Objective Examination)
  const [anatomicalAnomalies, setAnatomicalAnomalies] = useState([]);

  const [selectedExercises, setSelectedExercises] = useState([]);

  const sportsOptions = [
    'Football', 'Dance', 'Basketball', 'Tennis', 'Swimming', 
    'Mountain trail', 'Handball', 'Athletics'
  ];

  const dailyActivitiesOptions = [
    'Gardening', 'House cleaning', 'Shopping', 'Cooking', 
    'Childcare', 'Office work', 'Driving'
  ];

  const trainingTypesOptions = [
    'Strength', 'Cardio', 'Marathon', 'Calisthenics', 
    'Functional training', 'Crossfit'
  ];

  const professionOptions = [
    'Administrator', 'Engineer', 'Doctor', 'IT', 'Driver',
    'Medical representative', 'Medical assistant', 'Waiter',
    'Waitress', 'Performance athlete', 'Other'
  ];

  const medicalDiagnosticOptions = [
    'Back pain', 'Neck pain', 'Joint problems', 'Muscle tension',
    'Posture issues', 'Rehabilitation', 'Stress management'
  ];

  const symptomsOptions = [
    'Chronic pain', 'Stiffness', 'Weakness', 'Fatigue',
    'Sleep issues', 'Mobility problems', 'Balance issues'
  ];

  const exerciseOptions = [
    'Breathing exercises', 'Core strengthening', 'Flexibility training',
    'Balance work', 'Posture correction', 'Spinal mobility',
    'Pelvic floor exercises', 'Relaxation techniques'
  ];

  const anatomicalLocationOptions = [
    'Head', 'Neck', 'Shoulder', 'Arm', 'Hand', 'Chest', 'Back',
    'Abdomen', 'Hip', 'Leg', 'Foot', 'Spine', 'Other'
  ];

  const anatomicalTypeOptions = [
    'Structural', 'Functional', 'Postural', 'Congenital', 'Acquired'
  ];

  const addPhysicalPain = () => {
    setPhysicalPains([...physicalPains, {
      timing: '',
      type: '',
      intensity: '',
      location: '',
      evolution: '',
      treatment: '',
      triggeringReason: '',
      ongoingTherapies: ''
    }]);
  };

  const removePhysicalPain = (index: number) => {
    setPhysicalPains(physicalPains.filter((_, i) => i !== index));
  };

  const updatePhysicalPain = (index: number, field: string, value: string) => {
    const updated = [...physicalPains];
    updated[index] = { ...updated[index], [field]: value };
    setPhysicalPains(updated);
  };

  const addAnatomicalAnomaly = () => {
    setAnatomicalAnomalies([...anatomicalAnomalies, {
      location: '',
      type: '',
      observation: ''
    }]);
  };

  const removeAnatomicalAnomaly = (index: number) => {
    setAnatomicalAnomalies(anatomicalAnomalies.filter((_, i) => i !== index));
  };

  const updateAnatomicalAnomaly = (index: number, field: string, value: string) => {
    const updated = [...anatomicalAnomalies];
    updated[index] = { ...updated[index], [field]: value };
    setAnatomicalAnomalies(updated);
  };

  const addTrauma = () => {
    setTraumaHistory([...traumaHistory, {
      location: '',
      year: '',
      observation: ''
    }]);
  };

  const removeTrauma = (index: number) => {
    setTraumaHistory(traumaHistory.filter((_, i) => i !== index));
  };

  const updateTrauma = (index: number, field: string, value: string) => {
    const updated = [...traumaHistory];
    updated[index] = { ...updated[index], [field]: value };
    setTraumaHistory(updated);
  };

  const addSurgicalIntervention = () => {
    setSurgicalInterventions([...surgicalInterventions, {
      name: '',
      year: '',
      notes: ''
    }]);
  };

  const removeSurgicalIntervention = (index: number) => {
    setSurgicalInterventions(surgicalInterventions.filter((_, i) => i !== index));
  };

  const updateSurgicalIntervention = (index: number, field: string, value: string) => {
    const updated = [...surgicalInterventions];
    updated[index] = { ...updated[index], [field]: value };
    setSurgicalInterventions(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Record</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Participant:</strong> {participant.name}</p>
          <p><strong>Email:</strong> {participant.email}</p>
          {sessionDate && <p><strong>Session Date:</strong> {sessionDate}</p>}
          {sessionTime && <p><strong>Session Time:</strong> {sessionTime}</p>}
        </div>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {/* Section 1: Details About Recurrent Activities */}
        <AccordionItem value="recurrent-activities">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              <span>Details About Recurrent Activities</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <TagSelectionInput
                  label="Sports"
                  placeholder="Select sports activities..."
                  options={sportsOptions}
                  selectedTags={recurrentActivities.sports}
                  onTagsChange={(tags) => setRecurrentActivities({...recurrentActivities, sports: tags})}
                  allowCustomTags={true}
                  voiceEnabled={voiceInputEnabled}
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <TagSelectionInput
                  label="Daily Activities"
                  placeholder="Select daily activities..."
                  options={dailyActivitiesOptions}
                  selectedTags={recurrentActivities.dailyActivities}
                  onTagsChange={(tags) => setRecurrentActivities({...recurrentActivities, dailyActivities: tags})}
                  allowCustomTags={true}
                  voiceEnabled={voiceInputEnabled}
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <TagSelectionInput
                  label="Training Types"
                  placeholder="Select training types..."
                  options={trainingTypesOptions}
                  selectedTags={recurrentActivities.trainingTypes}
                  onTagsChange={(tags) => setRecurrentActivities({...recurrentActivities, trainingTypes: tags})}
                  allowCustomTags={true}
                  voiceEnabled={voiceInputEnabled}
                />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                <select
                  value={recurrentActivities.profession}
                  onChange={(e) => setRecurrentActivities({...recurrentActivities, profession: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select profession...</option>
                  {professionOptions.map(profession => (
                    <option key={profession} value={profession}>{profession}</option>
                  ))}
                </select>
                
                {recurrentActivities.profession === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    value={recurrentActivities.customProfession}
                    onChange={(e) => setRecurrentActivities({...recurrentActivities, customProfession: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm mt-2"
                  />
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Participation Reason */}
        <AccordionItem value="participation-reason">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-green-500" />
              <span>Participation Reason</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <TagSelectionInput
                  label="Medical Diagnostic"
                  placeholder="Select medical conditions..."
                  options={medicalDiagnosticOptions}
                  selectedTags={participationReason.medicalDiagnostic}
                  onTagsChange={(tags) => setParticipationReason({...participationReason, medicalDiagnostic: tags})}
                  allowCustomTags={true}
                  voiceEnabled={voiceInputEnabled}
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <TagSelectionInput
                  label="Symptoms"
                  placeholder="Select symptoms..."
                  options={symptomsOptions}
                  selectedTags={participationReason.symptoms}
                  onTagsChange={(tags) => setParticipationReason({...participationReason, symptoms: tags})}
                  allowCustomTags={true}
                  voiceEnabled={voiceInputEnabled}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Physical Pains (Local Anamnesis) */}
        <AccordionItem value="physical-pains">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              <span>Local Anamnesis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-gray-800 mb-4">Pain Information</h4>
                
                {physicalPains.map((pain, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
                        <input
                          type="text"
                          placeholder="When does it occur?"
                          value={pain.timing}
                          onChange={(e) => updatePhysicalPain(index, 'timing', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <input
                          type="text"
                          placeholder="Type of pain"
                          value={pain.type}
                          onChange={(e) => updatePhysicalPain(index, 'type', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Intensity</label>
                        <input
                          type="text"
                          placeholder="Pain intensity (1-10)"
                          value={pain.intensity}
                          onChange={(e) => updatePhysicalPain(index, 'intensity', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          placeholder="Pain location"
                          value={pain.location}
                          onChange={(e) => updatePhysicalPain(index, 'location', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Evolution</label>
                        <input
                          type="text"
                          placeholder="How has it evolved?"
                          value={pain.evolution}
                          onChange={(e) => updatePhysicalPain(index, 'evolution', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                        <input
                          type="text"
                          placeholder="Current/past treatments"
                          value={pain.treatment}
                          onChange={(e) => updatePhysicalPain(index, 'treatment', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Triggering Reason</label>
                        <input
                          type="text"
                          placeholder="What triggers the pain?"
                          value={pain.triggeringReason}
                          onChange={(e) => updatePhysicalPain(index, 'triggeringReason', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ongoing Therapies</label>
                        <input
                          type="text"
                          placeholder="Current therapies"
                          value={pain.ongoingTherapies}
                          onChange={(e) => updatePhysicalPain(index, 'ongoingTherapies', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                    
                    {physicalPains.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhysicalPain(index)}
                        className="mt-3 text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove this pain entry
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addPhysicalPain}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Add Another Pain Entry
                </button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: Trauma History */}
        <AccordionItem value="trauma-history">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-yellow-500" />
              <span>Trauma History</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-gray-800 mb-4">Trauma Records</h4>
                
                {traumaHistory.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Patient has no trauma history</p>
                    <button
                      type="button"
                      onClick={addTrauma}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add New
                    </button>
                  </div>
                ) : (
                  <>
                    {traumaHistory.map((trauma: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                              type="text"
                              placeholder="Trauma location"
                              value={trauma.location}
                              onChange={(e) => updateTrauma(index, 'location', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                              type="text"
                              placeholder="Year occurred"
                              value={trauma.year}
                              onChange={(e) => updateTrauma(index, 'year', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observation</label>
                            <input
                              type="text"
                              placeholder="Additional notes"
                              value={trauma.observation}
                              onChange={(e) => updateTrauma(index, 'observation', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeTrauma(index)}
                          className="mt-3 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addTrauma}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add Another Trauma
                    </button>
                  </>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 5: Surgical Interventions */}
        <AccordionItem value="surgical-interventions">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Stethoscope className="mr-2 h-5 w-5 text-indigo-500" />
              <span>Surgical Interventions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h4 className="font-medium text-gray-800 mb-4">Surgery History</h4>
                
                {surgicalInterventions.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Patient has no surgical interventions</p>
                    <button
                      type="button"
                      onClick={addSurgicalIntervention}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add New
                    </button>
                  </div>
                ) : (
                  <>
                    {surgicalInterventions.map((surgery: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Surgery Name</label>
                            <input
                              type="text"
                              placeholder="Name of surgery"
                              value={surgery.name}
                              onChange={(e) => updateSurgicalIntervention(index, 'name', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                              type="text"
                              placeholder="Year performed"
                              value={surgery.year}
                              onChange={(e) => updateSurgicalIntervention(index, 'year', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <input
                              type="text"
                              placeholder="Additional notes"
                              value={surgery.notes}
                              onChange={(e) => updateSurgicalIntervention(index, 'notes', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeSurgicalIntervention(index)}
                          className="mt-3 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addSurgicalIntervention}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add Another Surgery
                    </button>
                  </>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 6: Objective Examination */}
        <AccordionItem value="objective-examination">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-purple-500" />
              <span>Objective Examination</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-gray-800 mb-4">Physical Examination Details</h4>
                
                <div className="text-center py-6">
                  <p className="text-gray-500">Physical examination details will be added here</p>
                </div>
              </div>

              {/* Anatomical Anomalies - Now inside Objective Examination */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-gray-800 mb-4">Anatomical Anomalies</h4>
                
                {anatomicalAnomalies.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No anatomical anomalies recorded</p>
                    <button
                      type="button"
                      onClick={addAnatomicalAnomaly}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add New
                    </button>
                  </div>
                ) : (
                  <>
                    {anatomicalAnomalies.map((anomaly: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <select
                              value={anomaly.location}
                              onChange={(e) => updateAnatomicalAnomaly(index, 'location', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="">Select location...</option>
                              {anatomicalLocationOptions.map(location => (
                                <option key={location} value={location}>{location}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={anomaly.type}
                              onChange={(e) => updateAnatomicalAnomaly(index, 'type', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="">Select type...</option>
                              {anatomicalTypeOptions.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observation</label>
                            <input
                              type="text"
                              placeholder="Detailed observation"
                              value={anomaly.observation}
                              onChange={(e) => updateAnatomicalAnomaly(index, 'observation', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeAnatomicalAnomaly(index)}
                          className="mt-3 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addAnatomicalAnomaly}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add Another Anomaly
                    </button>
                  </>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 7: Exercises */}
        <AccordionItem value="exercises">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-teal-500" />
              <span>Exercises</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <h4 className="font-medium text-gray-800 mb-4">Session Exercises</h4>
                
                <TagSelectionInput
                  label="Exercises Performed"
                  placeholder="Select exercises..."
                  options={exerciseOptions}
                  selectedTags={selectedExercises}
                  onTagsChange={setSelectedExercises}
                  allowCustomTags={true}
                  voiceEnabled={voiceInputEnabled}
                />
                
                <div className="mt-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h5>
                  <textarea
                    placeholder="Enter any additional exercise notes or modifications..."
                    className="w-full text-sm p-3 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
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
}