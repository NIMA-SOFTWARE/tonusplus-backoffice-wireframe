import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from 'date-fns';
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusCircle, Trash2, X } from "lucide-react";
import { medicalRecordFormSchema, type MedicalRecordFormData } from '@shared/schema';
import { Participant } from '@shared/schema';

interface MedicalRecordFormProps {
  participant: Participant;
  onSubmit: (data: MedicalRecordFormData) => void;
  onCancel: () => void;
  existingData?: MedicalRecordFormData;
}

const symptomsOptions = [
  { id: 'pain', label: 'Pain' },
  { id: 'stiffness', label: 'Stiffness' },
  { id: 'weakness', label: 'Weakness' },
  { id: 'balance', label: 'Balance Issues' },
  { id: 'posture', label: 'Posture Correction' },
  { id: 'rehabilitation', label: 'Post-Surgery Rehabilitation' },
  { id: 'mobility', label: 'Limited Mobility' },
  { id: 'stress', label: 'Stress Relief' },
  { id: 'fitness', label: 'General Fitness' },
];

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({ 
  participant, 
  onSubmit, 
  onCancel,
  existingData 
}) => {
  const [currentTab, setCurrentTab] = useState('personal');
  
  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordFormSchema),
    defaultValues: existingData || {
      recurrentActivities: {
        isActive: false,
        coffeeConsumption: false,
        alcoholConsumption: false,
        drivesHeavyVehicles: false,
        usesComputer: false,
      },
      participationReason: {
        mainSymptoms: [],
      },
      physicalPains: [],
      traumaHistory: [],
      surgicalInterventions: [],
      physiologicalHistory: {
        wasBreastfed: false,
      },
      objectiveExamination: {
        clinicalExams: [],
        standingTests: [],
        shoulderTests: [],
        hipTests: [],
        anatomicalAnomalies: [],
      },
      specificClinicalHistory: {
        respiratoryIssues: [],
        circulatoryIssues: [],
        digestiveIssues: [],
      },
      conclusions: {
        followUpNeeded: false,
      },
    },
  });
  
  // Add new item handlers
  const addPhysicalPain = () => {
    const currentPains = form.getValues('physicalPains') || [];
    form.setValue('physicalPains', [...currentPains, { location: '' }]);
  };
  
  const removePhysicalPain = (index: number) => {
    const currentPains = form.getValues('physicalPains') || [];
    form.setValue('physicalPains', currentPains.filter((_, i) => i !== index));
  };
  
  const addTrauma = () => {
    const currentTraumas = form.getValues('traumaHistory') || [];
    form.setValue('traumaHistory', [...currentTraumas, { type: '' }]);
  };
  
  const removeTrauma = (index: number) => {
    const currentTraumas = form.getValues('traumaHistory') || [];
    form.setValue('traumaHistory', currentTraumas.filter((_, i) => i !== index));
  };
  
  const addSurgery = () => {
    const currentSurgeries = form.getValues('surgicalInterventions') || [];
    form.setValue('surgicalInterventions', [...currentSurgeries, { type: '' }]);
  };
  
  const removeSurgery = (index: number) => {
    const currentSurgeries = form.getValues('surgicalInterventions') || [];
    form.setValue('surgicalInterventions', currentSurgeries.filter((_, i) => i !== index));
  };
  
  const addClinicalExam = () => {
    const currentExams = form.getValues('objectiveExamination.clinicalExams') || [];
    form.setValue('objectiveExamination.clinicalExams', [...currentExams, { examType: '' }]);
  };
  
  const removeClinicalExam = (index: number) => {
    const currentExams = form.getValues('objectiveExamination.clinicalExams') || [];
    form.setValue('objectiveExamination.clinicalExams', currentExams.filter((_, i) => i !== index));
  };
  
  const addStandingTest = () => {
    const currentTests = form.getValues('objectiveExamination.standingTests') || [];
    form.setValue('objectiveExamination.standingTests', [...currentTests, { testType: '' }]);
  };
  
  const removeStandingTest = (index: number) => {
    const currentTests = form.getValues('objectiveExamination.standingTests') || [];
    form.setValue('objectiveExamination.standingTests', currentTests.filter((_, i) => i !== index));
  };
  
  const addShoulderTest = () => {
    const currentTests = form.getValues('objectiveExamination.shoulderTests') || [];
    form.setValue('objectiveExamination.shoulderTests', [...currentTests, { testType: '' }]);
  };
  
  const removeShoulderTest = (index: number) => {
    const currentTests = form.getValues('objectiveExamination.shoulderTests') || [];
    form.setValue('objectiveExamination.shoulderTests', currentTests.filter((_, i) => i !== index));
  };
  
  const addHipTest = () => {
    const currentTests = form.getValues('objectiveExamination.hipTests') || [];
    form.setValue('objectiveExamination.hipTests', [...currentTests, { testType: '' }]);
  };
  
  const removeHipTest = (index: number) => {
    const currentTests = form.getValues('objectiveExamination.hipTests') || [];
    form.setValue('objectiveExamination.hipTests', currentTests.filter((_, i) => i !== index));
  };
  
  const addAnomaly = () => {
    const currentAnomalies = form.getValues('objectiveExamination.anatomicalAnomalies') || [];
    form.setValue('objectiveExamination.anatomicalAnomalies', [...currentAnomalies, { description: '' }]);
  };
  
  const removeAnomaly = (index: number) => {
    const currentAnomalies = form.getValues('objectiveExamination.anatomicalAnomalies') || [];
    form.setValue('objectiveExamination.anatomicalAnomalies', currentAnomalies.filter((_, i) => i !== index));
  };
  
  const addRespiratoryIssue = () => {
    const currentIssues = form.getValues('specificClinicalHistory.respiratoryIssues') || [];
    form.setValue('specificClinicalHistory.respiratoryIssues', [...currentIssues, { condition: '' }]);
  };
  
  const removeRespiratoryIssue = (index: number) => {
    const currentIssues = form.getValues('specificClinicalHistory.respiratoryIssues') || [];
    form.setValue('specificClinicalHistory.respiratoryIssues', currentIssues.filter((_, i) => i !== index));
  };
  
  const addCirculatoryIssue = () => {
    const currentIssues = form.getValues('specificClinicalHistory.circulatoryIssues') || [];
    form.setValue('specificClinicalHistory.circulatoryIssues', [...currentIssues, { condition: '' }]);
  };
  
  const removeCirculatoryIssue = (index: number) => {
    const currentIssues = form.getValues('specificClinicalHistory.circulatoryIssues') || [];
    form.setValue('specificClinicalHistory.circulatoryIssues', currentIssues.filter((_, i) => i !== index));
  };
  
  const addDigestiveIssue = () => {
    const currentIssues = form.getValues('specificClinicalHistory.digestiveIssues') || [];
    form.setValue('specificClinicalHistory.digestiveIssues', [...currentIssues, { condition: '' }]);
  };
  
  const removeDigestiveIssue = (index: number) => {
    const currentIssues = form.getValues('specificClinicalHistory.digestiveIssues') || [];
    form.setValue('specificClinicalHistory.digestiveIssues', currentIssues.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (data: MedicalRecordFormData) => {
    onSubmit(data);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Medical Record</h2>
        <div className="mt-2 bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-blue-800">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <span className="text-sm text-gray-500">Name:</span>
              <p className="font-medium">{participant.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <p className="font-medium">{participant.email}</p>
            </div>
            {participant.phone && (
              <div>
                <span className="text-sm text-gray-500">Phone:</span>
                <p className="font-medium">{participant.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="activities">Daily Activities</TabsTrigger>
              <TabsTrigger value="health">Health History</TabsTrigger>
              <TabsTrigger value="examination">Examination</TabsTrigger>
              <TabsTrigger value="clinical">Clinical History</TabsTrigger>
              <TabsTrigger value="conclusions">Conclusions</TabsTrigger>
            </TabsList>
            
            {/* Section 2: Recurrent Activities */}
            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Activities</CardTitle>
                  <CardDescription>
                    Information about the customer's daily activities and lifestyle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sports Activities */}
                    <FormField
                      control={form.control}
                      name="recurrentActivities.sportsActivities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sports Activities</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What kinds of sports does the customer practice?"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Active Lifestyle */}
                    <FormField
                      control={form.control}
                      name="recurrentActivities.isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active Lifestyle</FormLabel>
                            <FormDescription>
                              Does the customer generally lead an active lifestyle?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coffee Consumption */}
                    <FormField
                      control={form.control}
                      name="recurrentActivities.coffeeConsumption"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Coffee Consumption</FormLabel>
                            <FormDescription>
                              Does the customer regularly consume coffee?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Alcohol Consumption */}
                    <FormField
                      control={form.control}
                      name="recurrentActivities.alcoholConsumption"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Alcohol Consumption</FormLabel>
                            <FormDescription>
                              Does the customer regularly consume alcohol?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Drives Heavy Vehicles */}
                    <FormField
                      control={form.control}
                      name="recurrentActivities.drivesHeavyVehicles"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Drives Heavy Vehicles</FormLabel>
                            <FormDescription>
                              Does the customer drive heavy vehicles?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Driving hours per week (only if drivesHeavyVehicles is true) */}
                    {form.watch('recurrentActivities.drivesHeavyVehicles') && (
                      <FormField
                        control={form.control}
                        name="recurrentActivities.drivingHoursPerWeek"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Driving Hours Per Week</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Uses Computer */}
                    <FormField
                      control={form.control}
                      name="recurrentActivities.usesComputer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Uses Computer</FormLabel>
                            <FormDescription>
                              Does the customer regularly use a computer?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Computer hours per week (only if usesComputer is true) */}
                    {form.watch('recurrentActivities.usesComputer') && (
                      <FormField
                        control={form.control}
                        name="recurrentActivities.computerHoursPerWeek"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Computer Hours Per Week</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  {/* Additional Notes */}
                  <FormField
                    control={form.control}
                    name="recurrentActivities.additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional notes about the customer's activities?"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Section 3: Participation Reason */}
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Reason for Participation</h3>
                    
                    <FormField
                      control={form.control}
                      name="participationReason.mainSymptoms"
                      render={({ field }) => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Main Symptoms</FormLabel>
                            <FormDescription>
                              Select the main symptoms or reasons for participating in this session
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {symptomsOptions.map((option) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = field.value || [];
                                      return checked
                                        ? field.onChange([...currentValue, option.id])
                                        : field.onChange(
                                            currentValue.filter((value) => value !== option.id)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="participationReason.customReason"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Custom Reason</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please provide any additional reasons for participation"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Section 4-7: Health History */}
            <TabsContent value="health">
              <Card>
                <CardHeader>
                  <CardTitle>Health History</CardTitle>
                  <CardDescription>
                    Document physical pains, trauma history, surgical interventions, and physiological history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Section 4: Physical Pains */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Physical Pains</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addPhysicalPain}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Pain
                      </Button>
                    </div>
                    
                    {form.watch('physicalPains')?.map((_, index) => (
                      <div key={`pain-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Pain #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removePhysicalPain(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`physicalPains.${index}.location`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Where does it hurt?"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`physicalPains.${index}.whenItHurts`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>When It Hurts</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="When does it hurt?"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`physicalPains.${index}.howItHurts`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>How It Hurts</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="How does it hurt?"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`physicalPains.${index}.duration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="How long does it hurt?"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`physicalPains.${index}.frequency`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Frequency</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="How often does it hurt?"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`physicalPains.${index}.additionalNotes`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes about this pain"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('physicalPains') || form.watch('physicalPains')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No physical pains recorded. Click "Add Pain" to add one.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Section 5: Trauma History */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Trauma & Musculoskeletal System Issues</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addTrauma}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Trauma
                      </Button>
                    </div>
                    
                    {form.watch('traumaHistory')?.map((_, index) => (
                      <div key={`trauma-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Trauma #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeTrauma(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`traumaHistory.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., bone break, sprain, muscle tear, fall"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`traumaHistory.${index}.location`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Body part affected"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`traumaHistory.${index}.date`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value as Date}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`traumaHistory.${index}.treatmentReceived`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Treatment Received</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="What treatment was received?"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`traumaHistory.${index}.currentStatus`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Current Status</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Current status of this issue"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`traumaHistory.${index}.additionalNotes`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes about this trauma"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('traumaHistory') || form.watch('traumaHistory')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No trauma history recorded. Click "Add Trauma" to add one.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Section 6: Surgical Interventions */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Surgical Interventions</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addSurgery}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Surgery
                      </Button>
                    </div>
                    
                    {form.watch('surgicalInterventions')?.map((_, index) => (
                      <div key={`surgery-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Surgery #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeSurgery(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`surgicalInterventions.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., appendectomy, caesarean, hysterectomy"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`surgicalInterventions.${index}.date`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value as Date}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`surgicalInterventions.${index}.hospital`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hospital</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Hospital where surgery was performed"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`surgicalInterventions.${index}.surgeon`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Surgeon</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Surgeon who performed the procedure"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`surgicalInterventions.${index}.outcome`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Outcome</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Outcome of the surgery"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`surgicalInterventions.${index}.additionalNotes`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes about this surgery"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('surgicalInterventions') || form.watch('surgicalInterventions')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No surgical interventions recorded. Click "Add Surgery" to add one.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Section 7: Physiological History */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Physiological History</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="physiologicalHistory.birthWeight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Birth Weight</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Weight at birth"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="physiologicalHistory.wasBreastfed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Breastfed</FormLabel>
                              <FormDescription>
                                Was the customer breastfed as an infant?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="physiologicalHistory.birthType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Birth Type</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Natural, C-section, etc."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="physiologicalHistory.developmentalMilestones"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Developmental Milestones</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Significant developmental milestones"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="physiologicalHistory.additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Additional notes about physiological history"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Section 8: Objective Examination */}
            <TabsContent value="examination">
              <Card>
                <CardHeader>
                  <CardTitle>Objective Examination</CardTitle>
                  <CardDescription>
                    Document clinical exams, standing tests, specific tests, and anatomical anomalies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* 8.1 Clinical Exams */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Clinical Exams</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addClinicalExam}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Exam
                      </Button>
                    </div>
                    
                    {form.watch('objectiveExamination.clinicalExams')?.map((_, index) => (
                      <div key={`exam-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Clinical Exam #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeClinicalExam(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`objectiveExamination.clinicalExams.${index}.examType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Exam Type <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="X-ray, RMN, CT, Ecography, etc."
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`objectiveExamination.clinicalExams.${index}.date`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value as Date}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.clinicalExams.${index}.results`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Results</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Exam results"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* File upload would go here - for future implementation */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <Label>File Upload</Label>
                          <p className="text-sm text-gray-500 my-2">
                            Upload feature will be enabled in a future update.
                          </p>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.clinicalExams.${index}.additionalNotes`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes about this exam"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('objectiveExamination.clinicalExams') || form.watch('objectiveExamination.clinicalExams')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No clinical exams recorded. Click "Add Exam" to add one.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* 8.2 Standing Tests */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Standing Tests</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addStandingTest}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Test
                      </Button>
                    </div>
                    
                    {form.watch('objectiveExamination.standingTests')?.map((_, index) => (
                      <div key={`standingTest-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Standing Test #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeStandingTest(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.standingTests.${index}.testType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Test Type <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="BASSANI, TFE, Barral, etc."
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.standingTests.${index}.results`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Results</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Test results"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.standingTests.${index}.additionalNotes`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes about this test"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('objectiveExamination.standingTests') || form.watch('objectiveExamination.standingTests')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No standing tests recorded. Click "Add Test" to add one.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* 8.3 Shoulder Tests */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Shoulder Specific Tests</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addShoulderTest}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Test
                      </Button>
                    </div>
                    
                    {form.watch('objectiveExamination.shoulderTests')?.map((_, index) => (
                      <div key={`shoulderTest-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Shoulder Test #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeShoulderTest(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.shoulderTests.${index}.testType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Test Type <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Locked clavicle, etc."
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.shoulderTests.${index}.results`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Results</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Test results"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.shoulderTests.${index}.additionalNotes`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes about this test"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('objectiveExamination.shoulderTests') || form.watch('objectiveExamination.shoulderTests')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No shoulder tests recorded. Click "Add Test" to add one.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* 8.4 Hip Tests */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Hip Specific Tests</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addHipTest}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Test
                      </Button>
                    </div>
                    
                    {form.watch('objectiveExamination.hipTests')?.map((_, index) => (
                      <div key={`hipTest-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Hip Test #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeHipTest(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.hipTests.${index}.testType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Test Type <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="uplift, ifler, outfler, etc."
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.hipTests.${index}.results`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Results</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Test results"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.hipTests.${index}.additionalNotes`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes about this test"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('objectiveExamination.hipTests') || form.watch('objectiveExamination.hipTests')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No hip tests recorded. Click "Add Test" to add one.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* 8.5 Anatomical Anomalies */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Anatomical Anomalies</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addAnomaly}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Anomaly
                      </Button>
                    </div>
                    
                    {form.watch('objectiveExamination.anatomicalAnomalies')?.map((_, index) => (
                      <div key={`anomaly-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Anomaly #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeAnomaly(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`objectiveExamination.anatomicalAnomalies.${index}.location`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Body location"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`objectiveExamination.anatomicalAnomalies.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Type of anomaly"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`objectiveExamination.anatomicalAnomalies.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Detailed description of the anomaly"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('objectiveExamination.anatomicalAnomalies') || form.watch('objectiveExamination.anatomicalAnomalies')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No anatomical anomalies recorded. Click "Add Anomaly" to add one.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Section 9: Specific Clinical History */}
            <TabsContent value="clinical">
              <Card>
                <CardHeader>
                  <CardTitle>Specific Clinical History</CardTitle>
                  <CardDescription>
                    Document respiratory, circulatory, and digestive system issues
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* 9.1 Respiratory Issues */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Respiratory System</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addRespiratoryIssue}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Issue
                      </Button>
                    </div>
                    
                    {form.watch('specificClinicalHistory.respiratoryIssues')?.map((_, index) => (
                      <div key={`respIssue-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Respiratory Issue #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeRespiratoryIssue(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.respiratoryIssues.${index}.condition`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Condition <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Pleuritis, Pleurisy, Pneumonia, etc."
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.respiratoryIssues.${index}.diagnosisDate`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Diagnosis Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value as Date}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.respiratoryIssues.${index}.treatment`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Treatment</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Treatment received"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.respiratoryIssues.${index}.currentStatus`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Status</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Current status of the condition"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`specificClinicalHistory.respiratoryIssues.${index}.additionalNotes`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes about this issue"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('specificClinicalHistory.respiratoryIssues') || form.watch('specificClinicalHistory.respiratoryIssues')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No respiratory issues recorded. Click "Add Issue" to add one.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* 9.2 Circulatory Issues */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Circulatory System</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addCirculatoryIssue}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Issue
                      </Button>
                    </div>
                    
                    {form.watch('specificClinicalHistory.circulatoryIssues')?.map((_, index) => (
                      <div key={`circIssue-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Circulatory Issue #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeCirculatoryIssue(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.circulatoryIssues.${index}.condition`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Condition <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Hypertension, Hypotension, Myocardial infarction, etc."
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.circulatoryIssues.${index}.diagnosisDate`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Diagnosis Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value as Date}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.circulatoryIssues.${index}.treatment`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Treatment</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Treatment received"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.circulatoryIssues.${index}.currentStatus`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Status</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Current status of the condition"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`specificClinicalHistory.circulatoryIssues.${index}.additionalNotes`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes about this issue"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('specificClinicalHistory.circulatoryIssues') || form.watch('specificClinicalHistory.circulatoryIssues')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No circulatory issues recorded. Click "Add Issue" to add one.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* 9.3 Digestive Issues */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Digestive System</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addDigestiveIssue}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Issue
                      </Button>
                    </div>
                    
                    {form.watch('specificClinicalHistory.digestiveIssues')?.map((_, index) => (
                      <div key={`digestIssue-${index}`} className="border rounded-md p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Digestive Issue #{index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeDigestiveIssue(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.digestiveIssues.${index}.condition`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Condition <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Reflux esophagitis, Hiatal hernia, Dysphagia, etc."
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.digestiveIssues.${index}.diagnosisDate`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Diagnosis Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value as Date}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.digestiveIssues.${index}.treatment`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Treatment</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Treatment received"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`specificClinicalHistory.digestiveIssues.${index}.currentStatus`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Status</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Current status of the condition"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`specificClinicalHistory.digestiveIssues.${index}.additionalNotes`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes about this issue"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    {(!form.watch('specificClinicalHistory.digestiveIssues') || form.watch('specificClinicalHistory.digestiveIssues')?.length === 0) && (
                      <div className="text-center py-4 text-gray-500 italic">
                        No digestive issues recorded. Click "Add Issue" to add one.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Section 10: Conclusions */}
            <TabsContent value="conclusions">
              <Card>
                <CardHeader>
                  <CardTitle>Conclusions</CardTitle>
                  <CardDescription>
                    Summarize findings and provide recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="conclusions.summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Summarize the key findings from this medical record"
                            {...field} 
                            className="min-h-[120px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="conclusions.recommendations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recommendations</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide recommendations for the customer"
                            {...field} 
                            className="min-h-[120px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="conclusions.followUpNeeded"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Follow-up Needed</FormLabel>
                            <FormDescription>
                              Is a follow-up session needed?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('conclusions.followUpNeeded') && (
                      <FormField
                        control={form.control}
                        name="conclusions.followUpDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Follow-up Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value as Date}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="conclusions.additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional notes or observations"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Medical Record</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MedicalRecordForm;