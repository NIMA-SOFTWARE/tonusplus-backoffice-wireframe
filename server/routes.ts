import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from 'ws';

export async function registerRoutes(app: Express): Promise<Server> {
  // Medical records API routes
  app.post('/api/medical-records', async (req: Request, res: Response) => {
    try {
      const { participantId, sessionId, formData } = req.body;
      
      // Create the medical record
      const medicalRecord = await storage.createMedicalRecord({
        participantId: parseInt(participantId),
        sessionId: parseInt(sessionId),
        customerId: 1, // We'll need to get this from the participant later
        filledBy: "Instructor" // This should come from the authenticated user
      });
      
      // Save the different sections
      if (formData.recurrentActivities) {
        await storage.saveRecurrentActivities(medicalRecord.id, formData.recurrentActivities);
      }
      
      if (formData.participationReason) {
        await storage.saveParticipationReason(medicalRecord.id, formData.participationReason);
      }
      
      if (formData.physicalPains && formData.physicalPains.length > 0) {
        await storage.savePhysicalPains(medicalRecord.id, formData.physicalPains);
      }
      
      if (formData.traumaHistory && formData.traumaHistory.length > 0) {
        await storage.saveTraumaHistory(medicalRecord.id, formData.traumaHistory);
      }
      
      if (formData.surgicalInterventions && formData.surgicalInterventions.length > 0) {
        await storage.saveSurgicalInterventions(medicalRecord.id, formData.surgicalInterventions);
      }
      
      if (formData.physiologicalHistory) {
        await storage.savePhysiologicalHistory(medicalRecord.id, formData.physiologicalHistory);
      }
      
      if (formData.objectiveExamination) {
        await storage.saveObjectiveExamination(medicalRecord.id, formData.objectiveExamination);
      }
      
      if (formData.specificClinicalHistory) {
        await storage.saveSpecificClinicalHistory(medicalRecord.id, formData.specificClinicalHistory);
      }
      
      if (formData.conclusions) {
        await storage.saveConclusions(medicalRecord.id, formData.conclusions);
      }
      
      res.status(201).json({
        success: true,
        recordId: medicalRecord.id
      });
    } catch (error) {
      console.error('Error creating medical record:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while creating the medical record'
      });
    }
  });
  
  // Get medical records by participant ID
  app.get('/api/medical-records/participant/:participantId', async (req: Request, res: Response) => {
    try {
      const participantId = parseInt(req.params.participantId);
      const records = await storage.getMedicalRecordsByParticipantId(participantId);
      res.json(records);
    } catch (error) {
      console.error('Error retrieving medical records:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while retrieving medical records'
      });
    }
  });

  // Get medical records by customer ID
  app.get('/api/medical-records/customer/:customerId', async (req: Request, res: Response) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const records = await storage.getMedicalRecordsByCustomerId(customerId);
      res.json(records);
    } catch (error) {
      console.error('Error retrieving medical records:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while retrieving medical records'
      });
    }
  });

  // Get specific medical record by ID
  app.get('/api/medical-records/:id', async (req: Request, res: Response) => {
    try {
      const recordId = parseInt(req.params.id);
      const record = await storage.getMedicalRecordById(recordId);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Medical record not found'
        });
      }
      
      res.json(record);
    } catch (error) {
      console.error('Error retrieving medical record:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while retrieving the medical record'
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Add WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      console.log('Received message:', message);
      
      // Echo the message back to the client
      if (ws.readyState === ws.OPEN) {
        ws.send(`Echo: ${message}`);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
