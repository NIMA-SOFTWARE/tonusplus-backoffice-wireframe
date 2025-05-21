import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, FileText, Calendar, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { Participant } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import MedicalRecordDetails from '@/components/MedicalRecordDetails';

interface MedicalRecord {
  id: number;
  participantId: number;
  sessionId: number;
  customerId: number;
  filledBy: string;
  createdAt: string;
  sessionDate?: string;
  sessionName?: string;
}

const ClientMedicalRecords = () => {
  const params = useParams<{ customerId: string }>();
  const customerId = parseInt(params.customerId, 10);
  const [, setLocation] = useLocation();
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  
  // Get participant information
  const { data: participant, isLoading: participantLoading } = useQuery({
    queryKey: ['/api/customers', customerId],
    queryFn: async () => {
      const response = await fetch(`/api/customers/${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }
      return response.json() as Promise<Participant>;
    },
    enabled: !isNaN(customerId),
  });
  
  // Get all medical records for this customer
  const { data: medicalRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['/api/medical-records/customer', customerId],
    queryFn: async () => {
      const response = await fetch(`/api/medical-records/customer/${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medical records');
      }
      return response.json() as Promise<MedicalRecord[]>;
    },
    enabled: !isNaN(customerId),
  });
  
  const handleBack = () => {
    setLocation('/');
  };
  
  const handleViewRecord = (recordId: number) => {
    setSelectedRecord(recordId);
  };
  
  const handleCloseDetails = () => {
    setSelectedRecord(null);
  };
  
  if (selectedRecord) {
    return <MedicalRecordDetails recordId={selectedRecord} onClose={handleCloseDetails} />;
  }
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {participantLoading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              `Medical Records - ${participant?.name}`
            )}
          </h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Medical Records History
          </CardTitle>
          <CardDescription>
            View all medical records created by trainers for this client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="recent">Recent (30 days)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {recordsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : medicalRecords && medicalRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Created</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Filled By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(record.createdAt), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{record.sessionName || 'Session'}</span>
                            {record.sessionDate && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(record.sessionDate), 'MMM d, yyyy')}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.filledBy}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewRecord(record.id)}
                          >
                            <ClipboardList className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No medical records found for this client.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent">
              {recordsLoading ? (
                <div className="space-y-2">
                  {[1, 2].map(i => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : medicalRecords ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Created</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Filled By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalRecords
                      .filter(record => {
                        const recordDate = new Date(record.createdAt);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return recordDate >= thirtyDaysAgo;
                      })
                      .map(record => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {format(new Date(record.createdAt), 'MMM d, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{record.sessionName || 'Session'}</span>
                              {record.sessionDate && (
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(record.sessionDate), 'MMM d, yyyy')}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.filledBy}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewRecord(record.id)}
                            >
                              <ClipboardList className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent medical records found for this client.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientMedicalRecords;