import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ChevronLeft, 
  User, 
  Activity, 
  ClipboardList, 
  Target, 
  Stethoscope, 
  Brain, 
  FileText, 
  Dumbbell
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface MedicalRecordDetailsProps {
  recordId: number;
  onClose: () => void;
}

interface MedicalRecord {
  id: number;
  participantId: number;
  sessionId: number;
  customerId: number;
  filledBy: string;
  createdAt: string;
  sessionDate?: string;
  sessionName?: string;
  participant: {
    id: number;
    name: string;
    email: string;
  };
  // Medical record data sections
  recurrentActivities?: any;
  participationReason?: any;
  physicalPains?: any[];
  traumaHistory?: any[];
  surgicalInterventions?: any[];
  physiologicalHistory?: any;
  objectiveExamination?: any;
  specificClinicalHistory?: any;
  conclusions?: any;
  exercises?: string[];
}

const MedicalRecordDetails: React.FC<MedicalRecordDetailsProps> = ({ recordId, onClose }) => {
  // Fetch medical record details
  const { data: record, isLoading } = useQuery({
    queryKey: ['/api/medical-records', recordId],
    queryFn: async () => {
      const response = await fetch(`/api/medical-records/${recordId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medical record details');
      }
      return response.json() as Promise<MedicalRecord>;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Skeleton className="ml-4 h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="ml-4 text-2xl font-bold">Medical Record Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                The medical record you're looking for could not be found or has been deleted.
              </p>
              <Button className="mt-4" onClick={onClose}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const createdDate = new Date(record.createdAt);
  
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            Medical Record
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Created: {format(createdDate, 'MMMM d, yyyy')}
          </Badge>
          <Badge>
            By: {record.filledBy}
          </Badge>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-base">{record.participant?.name || 'Not available'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-base">{record.participant?.email || 'Not available'}</p>
            </div>
            {record.sessionName && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Session</h3>
                <p className="text-base">{record.sessionName}</p>
              </div>
            )}
            {record.sessionDate && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Session Date</h3>
                <p className="text-base">{format(new Date(record.sessionDate), 'MMMM d, yyyy')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Accordion type="single" collapsible className="w-full">
        {record.participationReason && (
          <AccordionItem value="participationReason">
            <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
              <div className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-rose-500" />
                <span>Reason for Participation</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 space-y-4 bg-zinc-50 rounded-md">
                {record.participationReason.mainSymptoms && record.participationReason.mainSymptoms.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Main Symptoms</h3>
                    <div className="flex flex-wrap gap-2">
                      {record.participationReason.mainSymptoms.map((symptom: string, i: number) => (
                        <Badge key={i} variant="secondary">{symptom}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {record.participationReason.customReason && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Other Reasons</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {record.participationReason.customReason}
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        
        {record.recurrentActivities && (
          <AccordionItem value="recurrentActivities">
            <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
              <div className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-500" />
                <span>Recurrent Activities</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 space-y-4 bg-zinc-50 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {record.recurrentActivities.sportsActivities && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Sports Activities</h3>
                      <p className="text-sm text-muted-foreground">
                        {record.recurrentActivities.sportsActivities}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Activity Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {record.recurrentActivities.isActive ? 'Active' : 'Not Active'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Habits</h3>
                    <div className="space-y-1">
                      {record.recurrentActivities.coffeeConsumption && (
                        <p className="text-sm text-muted-foreground">Coffee Consumer</p>
                      )}
                      {record.recurrentActivities.alcoholConsumption && (
                        <p className="text-sm text-muted-foreground">Alcohol Consumer</p>
                      )}
                    </div>
                  </div>
                  
                  {(record.recurrentActivities.drivesHeavyVehicles || 
                    record.recurrentActivities.drivingHoursPerWeek) && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Driving</h3>
                      {record.recurrentActivities.drivesHeavyVehicles && (
                        <p className="text-sm text-muted-foreground">Drives Heavy Vehicles</p>
                      )}
                      {record.recurrentActivities.drivingHoursPerWeek && (
                        <p className="text-sm text-muted-foreground">
                          {record.recurrentActivities.drivingHoursPerWeek} hours per week
                        </p>
                      )}
                    </div>
                  )}
                  
                  {(record.recurrentActivities.usesComputer || 
                    record.recurrentActivities.computerHoursPerWeek) && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Computer Usage</h3>
                      {record.recurrentActivities.computerHoursPerWeek && (
                        <p className="text-sm text-muted-foreground">
                          {record.recurrentActivities.computerHoursPerWeek} hours per week
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {record.recurrentActivities.additionalNotes && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Additional Notes</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {record.recurrentActivities.additionalNotes}
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        
        {record.physicalPains && record.physicalPains.length > 0 && (
          <AccordionItem value="physicalPains">
            <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
              <div className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-purple-500" />
                <span>Local Anamnesis</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 bg-zinc-50 rounded-md">
                {record.physicalPains.map((pain, index) => (
                  <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                    <h3 className="text-sm font-medium mb-2">Pain Location: {pain.location}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pain.whenItHurts && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">When It Hurts</h4>
                          <p className="text-sm">{pain.whenItHurts}</p>
                        </div>
                      )}
                      {pain.howItHurts && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">How It Hurts</h4>
                          <p className="text-sm">{pain.howItHurts}</p>
                        </div>
                      )}
                      {pain.duration && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Duration</h4>
                          <p className="text-sm">{pain.duration}</p>
                        </div>
                      )}
                      {pain.frequency && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Frequency</h4>
                          <p className="text-sm">{pain.frequency}</p>
                        </div>
                      )}
                    </div>
                    {pain.additionalNotes && (
                      <div className="mt-2">
                        <h4 className="text-xs font-medium text-gray-500">Notes</h4>
                        <p className="text-sm whitespace-pre-wrap">{pain.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        
        {record.objectiveExamination && (
          <AccordionItem value="objectiveExamination">
            <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
              <div className="flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-emerald-500" />
                <span>Objective Examination</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 bg-zinc-50 rounded-md space-y-4">
                {/* ORTHOSTATISM */}
                {record.objectiveExamination.orthostatism && (
                  <div className="border-b pb-4">
                    <h3 className="text-sm font-medium mb-2">ORTHOSTATISM</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {record.objectiveExamination.orthostatism.bassaniDx && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Bassani Dx</h4>
                          <p className="text-sm">{Array.isArray(record.objectiveExamination.orthostatism.bassaniDx) ? 
                            record.objectiveExamination.orthostatism.bassaniDx.join(', ') : 
                            record.objectiveExamination.orthostatism.bassaniDx}</p>
                        </div>
                      )}
                      {record.objectiveExamination.orthostatism.bassaniSx && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Bassani Sx</h4>
                          <p className="text-sm">{Array.isArray(record.objectiveExamination.orthostatism.bassaniSx) ? 
                            record.objectiveExamination.orthostatism.bassaniSx.join(', ') : 
                            record.objectiveExamination.orthostatism.bassaniSx}</p>
                        </div>
                      )}
                      {record.objectiveExamination.orthostatism.tfe && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">TFE</h4>
                          <p className="text-sm">{record.objectiveExamination.orthostatism.tfe}</p>
                        </div>
                      )}
                      {record.objectiveExamination.orthostatism.barral && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Barral</h4>
                          <p className="text-sm">{Array.isArray(record.objectiveExamination.orthostatism.barral) ? 
                            record.objectiveExamination.orthostatism.barral.join(', ') : 
                            record.objectiveExamination.orthostatism.barral}</p>
                        </div>
                      )}
                      {record.objectiveExamination.orthostatism.bendingTest && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Bending Test</h4>
                          <p className="text-sm">{Array.isArray(record.objectiveExamination.orthostatism.bendingTest) ? 
                            record.objectiveExamination.orthostatism.bendingTest.join(', ') : 
                            record.objectiveExamination.orthostatism.bendingTest}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* SEATED POSITION */}
                {record.objectiveExamination.seatedPosition && (
                  <div className="border-b pb-4">
                    <h3 className="text-sm font-medium mb-2">SEATED POSITION</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {record.objectiveExamination.seatedPosition.tfs && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">TFS</h4>
                          <p className="text-sm">{record.objectiveExamination.seatedPosition.tfs}</p>
                        </div>
                      )}
                      {record.objectiveExamination.seatedPosition.inferiorSacralAngle && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Inferior Sacral Angle</h4>
                          <p className="text-sm">{record.objectiveExamination.seatedPosition.inferiorSacralAngle}</p>
                        </div>
                      )}
                      {record.objectiveExamination.seatedPosition.bendingTest && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Bending Test</h4>
                          <p className="text-sm">{record.objectiveExamination.seatedPosition.bendingTest}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* DECUBITUS POSITION */}
                {record.objectiveExamination.decubitusPosition && (
                  <div className="border-b pb-4">
                    <h3 className="text-sm font-medium mb-2">DECUBITUS POSITION</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {record.objectiveExamination.decubitusPosition.barral && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Barral</h4>
                          <p className="text-sm">{Array.isArray(record.objectiveExamination.decubitusPosition.barral) ? 
                            record.objectiveExamination.decubitusPosition.barral.join(', ') : 
                            record.objectiveExamination.decubitusPosition.barral}</p>
                        </div>
                      )}
                      {record.objectiveExamination.decubitusPosition.sacralBone && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Sacral Bone</h4>
                          <p className="text-sm">{record.objectiveExamination.decubitusPosition.sacralBone}</p>
                        </div>
                      )}
                      {record.objectiveExamination.decubitusPosition.priority && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Priority</h4>
                          <p className="text-sm">{record.objectiveExamination.decubitusPosition.priority}</p>
                        </div>
                      )}
                      {record.objectiveExamination.decubitusPosition.limitedInternalRotation && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Limited Internal Rotation</h4>
                          <p className="text-sm">{record.objectiveExamination.decubitusPosition.limitedInternalRotation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* CONCLUSIONS */}
                {record.objectiveExamination.conclusions && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">CONCLUSIONS</h3>
                    <p className="text-sm whitespace-pre-wrap">{record.objectiveExamination.conclusions}</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        
        {record.exercises && record.exercises.length > 0 && (
          <AccordionItem value="exercises">
            <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
              <div className="flex items-center">
                <Dumbbell className="mr-2 h-5 w-5 text-green-500" />
                <span>Exercises</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 bg-zinc-50 rounded-md">
                <div className="flex flex-wrap gap-2">
                  {record.exercises.map((exercise, index) => (
                    <Badge key={index} variant="secondary">{exercise}</Badge>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        
        {record.conclusions && (
          <AccordionItem value="conclusions">
            <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-gray-500" />
                <span>Conclusions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 bg-zinc-50 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{record.conclusions.notes}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default MedicalRecordDetails;