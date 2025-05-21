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
  Calendar,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientMedicalRecordDetailsProps {
  recordId: number;
  onClose: () => void;
}

const ClientMedicalRecordDetails: React.FC<ClientMedicalRecordDetailsProps> = ({ recordId, onClose }) => {
  const { data: record, isLoading } = useQuery({
    queryKey: ['/api/medical-records', recordId],
    queryFn: async () => {
      const response = await fetch(`/api/medical-records/${recordId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medical record details');
      }
      return response.json();
    }
  });

  if (isLoading) return (
    <div className="p-8">
      <Button variant="outline" onClick={onClose}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className="mt-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={onClose}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Medical Record Details</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Medical Record
          </CardTitle>
          <CardDescription>
            {record?.createdAt && (
              <span>Created on {format(new Date(record.createdAt), 'MMMM d, yyyy')}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {record ? (
            <div className="space-y-6">
              {/* Session Information */}
              {(record.sessionName || record.sessionDate) && (
                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Session Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {record.sessionName && (
                      <div>
                        <span className="text-xs text-muted-foreground">Session</span>
                        <p className="text-sm font-medium">{record.sessionName}</p>
                      </div>
                    )}
                    {record.sessionDate && (
                      <div>
                        <span className="text-xs text-muted-foreground">Date</span>
                        <p className="text-sm font-medium">{format(new Date(record.sessionDate), 'MMMM d, yyyy')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Record Content */}
              <div className="bg-slate-50 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Record Content</h3>
                <pre className="whitespace-pre-wrap bg-white p-3 rounded border text-sm overflow-auto max-h-[70vh]">
                  {JSON.stringify(record, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Record not found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientMedicalRecordDetails;