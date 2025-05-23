import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Participant } from "@shared/schema";
import { format } from "date-fns";
import {
  User,
  FileText,
  Target,
  Activity,
  Clipboard,
  History,
  Stethoscope,
  Search,
  Mic,
  Dumbbell,
  Shield,
  Baby,
} from "lucide-react";
import VoiceEnabledInput from "./VoiceEnabledInput";
import VoiceInputButton from "./VoiceInputButton";
import TagSelectionInput from "./TagSelectionInput";

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
  sessionTime,
}) => {
  // Form state for voice input fields
  const [otherReasons, setOtherReasons] = useState("");
  const [mainReason, setMainReason] = useState("");
  const [searchSymptomTerm, setSearchSymptomTerm] = useState("");
  const [showSymptomSearch, setShowSymptomSearch] = useState(false);

  // Voice-to-text state
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);
  const [showNewInstrumentalExamForm, setShowNewInstrumentalExamForm] = useState(false);
  
  // Convergence tests state
  const [convergenceTests, setConvergenceTests] = useState<Array<{
    testName: string;
    dxNotes: string;
    sxNotes: string;
  }>>([]);

  // Dental prosthesis state
  const [hasProsthesis, setHasProsthesis] = useState<string>("");
  const [prosthesisLocation, setProsthesisLocation] = useState<string>("");
  const [prosthesisType, setProsthesisType] = useState<string>("");
  const [prosthesisNotes, setProsthesisNotes] = useState<string>("");

  // Dental bridges state
  const [hasBridge, setHasBridge] = useState<string>("");
  const [bridgeLocation, setBridgeLocation] = useState<string>("");
  const [bridgeType, setBridgeType] = useState<string>("");
  const [bridgeNotes, setBridgeNotes] = useState<string>("");

  // Mandibular deviation state
  const [mandibularDeviation, setMandibularDeviation] = useState<string>("");
  const [mandibularDeviationNotes, setMandibularDeviationNotes] = useState<string>("");

  // Open palate state
  const [openPalate, setOpenPalate] = useState<string>("");
  const [openPalateNotes, setOpenPalateNotes] = useState<string>("");

  // Ogival palate state
  const [ogivalPalate, setOgivalPalate] = useState<string>("");
  const [ogivalPalateNotes, setOgivalPalateNotes] = useState<string>("");

  // Dental arches state
  const [dentalArches, setDentalArches] = useState<Array<{
    location: string;
    shape: string;
  }>>([]);

  // Orthodontic history state
  const [orthodonticHistory, setOrthodonticHistory] = useState<Array<{
    type: string;
    notes: string;
  }>>([]);

  // Local Anamnesis state
  const [whenDoesItHurt, setWhenDoesItHurt] = useState<string[]>([]);
  const [howDoesItHurt, setHowDoesItHurt] = useState<string[]>([]);
  const [painIntensity, setPainIntensity] = useState(5);
  const [whereDoesItHurt, setWhereDoesItHurt] = useState<string[]>([]);
  const [painStartDuration, setPainStartDuration] = useState("days");
  const [painStartValue, setPainStartValue] = useState(1);
  const [painStartDate, setPainStartDate] = useState("");
  const [painDurationMinutes, setPainDurationMinutes] = useState(0);
  const [hourlyInterval, setHourlyInterval] = useState("");
  const [activitiesWorsen, setActivitiesWorsen] = useState("");
  const [activitiesRelieve, setActivitiesRelieve] = useState("");
  const [evolution, setEvolution] = useState("");
  const [evolutionOther, setEvolutionOther] = useState("");
  const [treatment, setTreatment] = useState("");
  const [triggeringReason, setTriggeringReason] = useState("");
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
  const [carAccidents, setCarAccidents] = useState("");
  const [fallsFromHeight, setFallsFromHeight] = useState("");
  const [fallsOnIce, setFallsOnIce] = useState("");
  const [fallsOnStairs, setFallsOnStairs] = useState("");

  // Surgical interventions state
  const [surgicalInterventions, setSurgicalInterventions] = useState("");
  const [osteosynthesisMaterials, setOsteosynthesisMaterials] = useState("");

  // Interface for surgical interventions entries
  interface SurgicalIntervention {
    name: string;
    year: string;
    notes: string;
  }
  const [surgicalInterventionsList, setSurgicalInterventionsList] = useState<
    SurgicalIntervention[]
  >([]);
  const [showSurgicalInterventionForm, setShowSurgicalInterventionForm] =
    useState(false);

  // Interface and state for anatomical anomalies
  interface AnatomicalAnomaly {
    location: string;
    type: string;
    observation: string;
  }
  const [anatomicalAnomalies, setAnatomicalAnomalies] = useState<
    AnatomicalAnomaly[]
  >([]);

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
  const [digestiveDiseases, setDigestiveDiseases] = useState<
    DigestiveDisease[]
  >([]);

  // State for stool form options
  const [stoolForms, setStoolForms] = useState<string[]>([]);

  // State for daily hydration (in liters)
  const [dailyHydration, setDailyHydration] = useState<string>("");

  // Interface and state for urogenital system diseases/dysfunctions
  interface UrogenitalDisease {
    type: string;
    notes: string;
  }
  const [urogenitalDiseases, setUrogenitalDiseases] = useState<
    UrogenitalDisease[]
  >([]);

  // State for gender
  const [isFemale, setIsFemale] = useState<boolean>(false);

  // State for menstrual cycle frequency (in days)
  const [menstrualCycleFrequency, setMenstrualCycleFrequency] =
    useState<string>("");

  // State for pregnancy information
  interface Pregnancy {
    type: string; // 'term', 'ectopic', 'abortion'
    year: string;
    weightGain: string; // in kg
    notes: string;
  }
  const [pregnancies, setPregnancies] = useState<Pregnancy[]>([]);
  const [childrenCount, setChildrenCount] = useState<string>("");

  // State for weight changes in recent years
  interface WeightChange {
    amount: string; // in kg (can be positive for gain or negative for loss)
    timeSpan: string; // in months/years
    notes: string;
  }
  const [weightChanges, setWeightChanges] = useState<WeightChange[]>([]);

  // State for eye system and visual disorders
  const [wearingGlasses, setWearingGlasses] = useState<boolean>(false);
  const [wearingContactLenses, setWearingContactLenses] =
    useState<boolean>(false);
  const [visualDisorders, setVisualDisorders] = useState<string>("");

  // Interface and state for eye conditions
  interface EyeCondition {
    condition: string;
    rightEyeAngle: string;
    leftEyeAngle: string;
    observation: string;
  }
  const [eyeConditions, setEyeConditions] = useState<EyeCondition[]>([]);

  // State for dominant eye
  const [dominantEye, setDominantEye] = useState<string>("");
  const [dominantEyeAngle, setDominantEyeAngle] = useState<string>("");

  // State for vision quality tracking
  const [visionQuality, setVisionQuality] = useState({
    eyeCount: "", // "one" or "both"
    eyeDominance: "", // "dominant" or "non-dominant"
  });

  // State for convergence test
  const [convergenceTest, setConvergenceTest] = useState({
    result: "", // "normal", "insufficient", "excessive"
    distanceCm: "", // distance in centimeters
    notes: "",
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
  const [stomatognaticConditions, setStomatognaticConditions] = useState<
    StomatognaticCondition[]
  >([]);

  // State for Lingual Frenulum
  const [lingualFrenulum, setLingualFrenulum] = useState("");

  // State for Tooth Status
  interface ToothStatus {
    [key: string]: string; // FDI number as key, status code as value
  }
  const [toothStatus, setToothStatus] = useState<ToothStatus>({});

  // State for Teeth Orientation by Sector
  interface TeethOrientationBySector {
    [key: string]: string; // sector key (e.g., "posterior-right"), orientation as value
  }
  const [teethOrientation, setTeethOrientation] =
    useState<TeethOrientationBySector>({});



  // State for Endocrine System
  interface EndocrineSystem {
    type: string;
    notes: string;
  }
  const [endocrineSystemEntries, setEndocrineSystemEntries] = useState<
    EndocrineSystem[]
  >([]);

  // State for Nervous System Disorders
  interface NervousSystemDisorder {
    type: string;
    notes: string;
  }
  const [nervousSystemDisorders, setNervousSystemDisorders] = useState<
    NervousSystemDisorder[]
  >([]);

  // State for Other Systemic Disorders
  interface OtherSystemicDisorder {
    name: string;
    notes: string;
  }
  const [otherSystemicDisorders, setOtherSystemicDisorders] = useState<
    OtherSystemicDisorder[]
  >([]);

  // State for Pharmacological Treatments
  const [ongoingTreatments, setOngoingTreatments] = useState("");
  const [pastTreatments, setPastTreatments] = useState("");

  // State for Medical Devices
  interface MedicalDevice {
    name: string;
    notes: string;
  }
  const [currentDevices, setCurrentDevices] = useState<MedicalDevice[]>([]);
  const [pastDevices, setPastDevices] = useState<MedicalDevice[]>([]);

  // State for Physiological History
  const [birthWeight, setBirthWeight] = useState("");
  const [breastfed, setBreastfed] = useState<"yes" | "no" | "">("");
  const [birthProcess, setBirthProcess] = useState<"O" | "S" | "">("");
  const [suckingReflex, setSuckingReflex] = useState<"yes" | "no" | "">("");
  const [laborDuration, setLaborDuration] = useState("");
  const [birthType, setBirthType] = useState<
    "premature" | "normal" | "slow" | ""
  >("");
  const [abnormalPresentation, setAbnormalPresentation] = useState<
    "yes" | "no" | ""
  >("");
  const [physiologicalNotes, setPhysiologicalNotes] = useState("");

  // State for Instrumental Exams
  interface InstrumentalExam {
    name: string;
    fileAttachment: string; // this would store file name or reference
    notes: string;
  }
  const [instrumentalExams, setInstrumentalExams] = useState<
    InstrumentalExam[]
  >([]);

  // State for Orthostatism
  const [bassaniDx, setBassaniDx] = useState<string[]>([]);
  const [bassaniSx, setBassaniSx] = useState<string[]>([]);
  const [tfe, setTfe] = useState<"Dx" | "Sx" | "">("");
  const [barralOptions, setBarralOptions] = useState<string[]>([]);
  const [bendingTestOptions, setBendingTestOptions] = useState<string[]>([]);
  const [lateralFlexionDxAcutePoint, setLateralFlexionDxAcutePoint] =
    useState("");
  const [lateralFlexionDxStraightLine, setLateralFlexionDxStraightLine] =
    useState("");
  const [lateralFlexionSxAcutePoint, setLateralFlexionSxAcutePoint] =
    useState("");
  const [lateralFlexionSxStraightLine, setLateralFlexionSxStraightLine] =
    useState("");
  const [headRotationDx, setHeadRotationDx] = useState("");
  const [headRotationSx, setHeadRotationSx] = useState("");
  const [globalPosture, setGlobalPosture] = useState<string[]>([]);
  const [typology, setTypology] = useState("");

  // State for Seated Position
  const [seatedTfs, setSeatedTfs] = useState<"Dx" | "Sx" | "">("");
  const [inferiorSacralAngle, setInferiorSacralAngle] = useState<
    "Dx" | "Sx" | ""
  >("");
  const [seatedBendingTest, setSeatedBendingTest] = useState<
    "Maintain gibbosity" | "Cancel gibbosity" | ""
  >("");

  // State for Decubitus Position
  const [decubitusBarralOptions, setDecubitusBarralOptions] = useState<
    string[]
  >([]);
  const [sacralBone, setSacralBone] = useState<
    "Dx-Dx" | "Sx-Sx" | "Dx-Sx" | "Sx-Dx" | ""
  >("");
  const [priority, setPriority] = useState<
    "Ascendant" | "Descendant" | "Visceral" | "Mixed" | ""
  >("");
  const [limitedInternalRotation, setLimitedInternalRotation] = useState<
    "M inf Sx" | "M inf Dx" | ""
  >("");

  // State for Conclusions
  const [conclusionsNotes, setConclusionsNotes] = useState("");

  // State for Exercises
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  // State for sports activities
  const [sportsActivities, setSportsActivities] = useState<string[]>([]);

  // State for daily activities
  const [dailyActivities, setDailyActivities] = useState<string[]>([]);

  // State for profession
  const [profession, setProfession] = useState<string>("");
  const [customProfession, setCustomProfession] = useState<string>("");

  // State for training types
  const [trainingTypes, setTrainingTypes] = useState<string[]>([]);

  // State for medical diagnostics and symptoms
  const [medicalDiagnostics, setMedicalDiagnostics] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);

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
              voiceInputEnabled
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <Mic className="h-4 w-4" />
            {voiceInputEnabled ? "Voice Input ON" : "Voice Input OFF"}
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
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      Patient
                    </span>
                    <p className="text-sm font-medium text-gray-800">
                      {participant.name}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      Email
                    </span>
                    <p className="text-sm text-gray-800">{participant.email}</p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      Phone
                    </span>
                    <p className="text-sm text-gray-800">
                      {participant.phone || "Not provided"}
                    </p>
                  </div>

                  {/* Patient Information - Second row */}
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      Date of Birth
                    </span>
                    <p className="text-sm text-gray-800">Not available</p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      City
                    </span>
                    <p className="text-sm text-gray-800">Not available</p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      County
                    </span>
                    <p className="text-sm text-gray-800">Not available</p>
                  </div>

                  {/* Gender Selection */}
                  <div className="col-span-full">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      Gender
                    </span>
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
                        <label
                          htmlFor="gender-male"
                          className="ml-2 text-sm text-gray-700"
                        >
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
                        <label
                          htmlFor="gender-female"
                          className="ml-2 text-sm text-gray-700"
                        >
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
                    <label className="block text-xs font-medium text-gray-500 uppercase">
                      Session Date
                    </label>
                    <input
                      type="date"
                      defaultValue={
                        sessionDate
                          ? new Date(
                              sessionDate.replace(
                                /(\w{3}) (\d{2}), (\d{4})/,
                                "$3-$1-$2",
                              ),
                            )
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      className="mt-1 py-2 px-3 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase">
                      Session Time
                    </label>
                    <input
                      type="time"
                      defaultValue={
                        sessionTime ? sessionTime.split(" ")[0] : ""
                      }
                      className="mt-1 py-2 px-3 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Select location"
                        className="mt-1 py-2 px-3 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <div className="hidden absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">
                          Downtown Studio
                        </div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">
                          Westside Location
                        </div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">
                          Northside Center
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Referring Doctor */}
                  <div className="col-span-2 mt-2">
                    <label className="block text-xs font-medium text-gray-500 uppercase">
                      Referring Doctor
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search or add new doctor"
                        className="mt-1 py-2 px-3 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <div className="hidden absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">
                          Dr. John Smith
                        </div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">
                          Dr. Sarah Johnson
                        </div>
                        <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm">
                          Dr. Michael Brown
                        </div>
                        <div className="py-2 px-3 hover:bg-blue-50 text-blue-600 cursor-pointer text-sm">
                          + Add new doctor
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Details About Recurrent Activities */}
        <AccordionItem value="professional-data">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-green-500" />
              <span>Details About Recurrent Activities</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div className="space-y-6">
                  {/* Profession */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Profession
                    </label>
                    <select
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select profession</option>
                      <option value="administrator">Administrator</option>
                      <option value="engineer">Engineer</option>
                      <option value="doctor">Doctor</option>
                      <option value="it">IT</option>
                      <option value="driver">Driver</option>
                      <option value="medical-representative">
                        Medical Representative
                      </option>
                      <option value="medical-assistant">
                        Medical Assistant
                      </option>
                      <option value="waiter">Waiter</option>
                      <option value="waitress">Waitress</option>
                      <option value="performance-athlete">
                        Performance Athlete
                      </option>
                      <option value="other">Other</option>
                    </select>

                    {/* Custom profession input when "Other" is selected */}
                    {profession === "other" && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Please specify profession..."
                          value={customProfession}
                          onChange={(e) => setCustomProfession(e.target.value)}
                          className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {/* Activities */}
                  <div>
                    <TagSelectionInput
                      label="Daily Activities"
                      placeholder="Select daily activities..."
                      options={[
                        "Gardening",
                        "House cleaning",
                        "Shopping",
                        "Walking the dog",
                        "Child care",
                        "Cooking",
                        "Driving",
                        "Reading",
                        "Computer work",
                        "Manual labor",
                        "Standing work",
                        "Heavy lifting",
                      ]}
                      selectedTags={dailyActivities}
                      onTagsChange={setDailyActivities}
                      allowCustomTags={true}
                      className="w-full"
                    />
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
                          const parentEl = e.target.closest(".space-y-3");
                          if (!parentEl) return;
                          const trainingFields =
                            parentEl.querySelector(".training-fields");
                          if (trainingFields) {
                            if (e.target.checked) {
                              trainingFields.classList.remove("hidden");
                            } else {
                              trainingFields.classList.add("hidden");
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
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                          Trainings per week
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Number of trainings"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <TagSelectionInput
                          label="Training Types"
                          placeholder="Select training types..."
                          options={[
                            "Strength",
                            "Cardio",
                            "Marathon",
                            "Calisthenics",
                            "Functional training",
                            "Crossfit",
                          ]}
                          selectedTags={trainingTypes}
                          onTagsChange={setTrainingTypes}
                          allowCustomTags={true}
                          className="w-full"
                        />
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
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                        Daily Driving Hours
                      </label>
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
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                        Daily Computer Hours
                      </label>
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
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                        Work Type
                      </label>
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
                    <TagSelectionInput
                      label="Sports"
                      placeholder="Select sports..."
                      options={[
                        "Football",
                        "Dance",
                        "Basketball",
                        "Tennis",
                        "Swimming",
                        "Mountain trail",
                        "Handball",
                        "Athletics",
                      ]}
                      selectedTags={sportsActivities}
                      onTagsChange={setSportsActivities}
                      allowCustomTags={true}
                      className="w-full"
                    />
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
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Stated reason (from patient profile)
                    </label>
                    <div className="w-full text-sm p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                      Persistent lower back pain and limited mobility after
                      sedentary work
                    </div>
                  </div>

                  {/* Medical Diagnostic */}
                  <div>
                    <TagSelectionInput
                      label="Medical Diagnostic"
                      placeholder="Select medical diagnostics..."
                      options={[
                        "Herniated disc",
                        "Scoliosis",
                        "Arthritis",
                        "Fibromyalgia",
                        "Osteoporosis",
                        "Chronic pain syndrome",
                        "Postural syndrome",
                        "Muscle imbalance",
                        "Joint dysfunction",
                        "Spinal stenosis",
                      ]}
                      selectedTags={medicalDiagnostics}
                      onTagsChange={setMedicalDiagnostics}
                      allowCustomTags={true}
                      voiceEnabled={voiceInputEnabled}
                      className="w-full"
                    />
                  </div>

                  {/* Symptoms */}
                  <div>
                    <TagSelectionInput
                      label="Symptoms"
                      placeholder="Select symptoms..."
                      options={[
                        "Lower back pain",
                        "Neck stiffness",
                        "Joint pain",
                        "Muscle tension",
                        "Poor posture",
                        "Chronic fatigue",
                        "Headaches",
                        "Balance issues",
                        "Numbness",
                        "Tingling",
                        "Weakness",
                        "Stiffness",
                      ]}
                      selectedTags={symptoms}
                      onTagsChange={setSymptoms}
                      allowCustomTags={true}
                      voiceEnabled={voiceInputEnabled}
                      className="w-full"
                    />
                  </div>

                  {/* Other reasons as textarea */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Other reasons
                    </label>
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
                              const newValue = otherReasons
                                ? `${otherReasons} ${text}`
                                : text;
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

        {/* Section 4: Pain Assessment */}
        <AccordionItem value="local-anamnesis">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-purple-500" />
              <span>Pain Assessment</span>
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
                        "Continuously",
                      ]}
                      selectedTags={whenDoesItHurt}
                      onTagsChange={setWhenDoesItHurt}
                      allowCustomTags={false}
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
                        "Aching",
                      ]}
                      selectedTags={howDoesItHurt}
                      onTagsChange={setHowDoesItHurt}
                      allowCustomTags={false}
                      voiceEnabled={voiceInputEnabled}
                    />
                  </div>

                  {/* Pain intensity */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Pain intensity (1-10)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={painIntensity}
                        onChange={(e) =>
                          setPainIntensity(parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700 w-8 text-center">
                        {painIntensity}
                      </span>
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
                        "Head",
                      ]}
                      selectedTags={whereDoesItHurt}
                      onTagsChange={setWhereDoesItHurt}
                      allowCustomTags={false}
                      voiceEnabled={voiceInputEnabled}
                    />
                  </div>

                  {/* When did the pain start */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      When did the pain start
                    </label>
                    <div className="flex space-x-2 items-end">
                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          value={painStartValue}
                          onChange={(e) =>
                            setPainStartValue(parseInt(e.target.value) || 1)
                          }
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
                      {painStartDuration === "specific_date" && (
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
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                        Pain duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={painDurationMinutes}
                        onChange={(e) =>
                          setPainDurationMinutes(parseInt(e.target.value) || 0)
                        }
                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Duration in minutes"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                        Hourly interval
                      </label>
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
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Evolution
                    </label>
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

                      {evolution === "other" && (
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
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Treatment
                    </label>
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
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Triggering reason (stated by the patient)
                    </label>
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
                        "Bowen",
                      ]}
                      selectedTags={ongoingTherapies}
                      onTagsChange={setOngoingTherapies}
                      allowCustomTags={true}
                      voiceEnabled={voiceInputEnabled}
                    />
                  </div>

                  {/* Activities that worsen pain */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Activities which make the pain worse
                    </label>
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
                              const newValue = activitiesWorsen
                                ? `${activitiesWorsen} ${text}`
                                : text;
                              setActivitiesWorsen(newValue);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Activities that relieve pain */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Activities which help relieve the pain
                    </label>
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
                              const newValue = activitiesRelieve
                                ? `${activitiesRelieve} ${text}`
                                : text;
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

        {/* Section 5: Trauma and Diseases/Dysfunctions of the Musculoskeletal System */}
        <AccordionItem value="trauma-diseases">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-red-500" />
              <span>
                Trauma and Diseases/Dysfunctions of the Musculoskeletal System
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
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
                    allowCustomEntry = false,
                  }: {
                    title: string;
                    entries: TraumaEntry[];
                    setEntries: React.Dispatch<
                      React.SetStateAction<TraumaEntry[]>
                    >;
                    options: { value: string; label: string }[];
                    selectLabel: string;
                    allowCustomEntry?: boolean;
                  }) => (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        {title}
                      </h5>

                      {/* Selected entries list with year and observation */}
                      <div className="space-y-3 mb-4">
                        {entries.map((entry, index) => (
                          <div
                            key={index}
                            className="p-3 bg-white rounded-md border border-gray-200 shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-gray-700 w-1/5">
                                {entry.location}
                              </div>

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
                                    updatedEntries[index].observation =
                                      e.target.value;
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
                              <div className="mb-1 text-xs text-gray-500">
                                {selectLabel}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  id={`${title.toLowerCase().replace(/\s+/g, "-")}-input`}
                                  placeholder={`Enter ${title.toLowerCase()} details`}
                                  className="flex-grow text-sm p-2 border border-gray-300 rounded-md"
                                />
                                <button
                                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                  onClick={() => {
                                    const inputId = `${title.toLowerCase().replace(/\s+/g, "-")}-input`;
                                    const input = document.getElementById(
                                      inputId,
                                    ) as HTMLInputElement;

                                    if (input && input.value.trim()) {
                                      setEntries([
                                        ...entries,
                                        {
                                          location: input.value.trim(),
                                          year: "",
                                          observation: "",
                                        },
                                      ]);
                                      input.value = "";
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
                            <div className="mb-1 text-xs text-gray-500">
                              {selectLabel}
                            </div>
                            <select
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                              onChange={(e) => {
                                if (e.target.value) {
                                  setEntries([
                                    ...entries,
                                    {
                                      location: e.target.value,
                                      year: "",
                                      observation: "",
                                    },
                                  ]);
                                  // Better way to reset select without focus issues
                                  e.target.selectedIndex = 0;
                                }
                              }}
                            >
                              <option value="">Select location</option>
                              {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
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
                          {
                            value: "Internal malleolus",
                            label: "Internal malleolus",
                          },
                          {
                            value: "External malleolus",
                            label: "External malleolus",
                          },
                          { value: "Bimalleolar", label: "Bimalleolar" },
                          { value: "Tarsals", label: "Tarsals" },
                          { value: "Halcus", label: "Halcus" },
                          {
                            value: "Other",
                            label: "Other (specify in observation)",
                          },
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
                          {
                            value: "Other",
                            label: "Other (specify in observation)",
                          },
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
                          {
                            value: "Other",
                            label: "Other (specify in observation)",
                          },
                        ]}
                        selectLabel="Add new sprain location"
                      />

                      {/* Muscle Tears */}
                      <div className="border-t border-gray-200 pt-4 mt-4"></div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3">
                          Muscle Tears
                        </h5>

                        {/* Existing muscle tears */}
                        {muscleTears.map((tear, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                          >
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
                                updatedTears[index].observation =
                                  e.target.value;
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
                              const nameInput = document.getElementById(
                                "muscle-tear-name",
                              ) as HTMLInputElement;
                              const yearInput = document.getElementById(
                                "muscle-tear-year",
                              ) as HTMLInputElement;
                              const obsInput = document.getElementById(
                                "muscle-tear-observation",
                              ) as HTMLInputElement;

                              if (nameInput && nameInput.value.trim()) {
                                setMuscleTears([
                                  ...muscleTears,
                                  {
                                    location: nameInput.value.trim(),
                                    year: yearInput ? yearInput.value : "",
                                    observation: obsInput ? obsInput.value : "",
                                  },
                                ]);

                                if (nameInput) nameInput.value = "";
                                if (yearInput) yearInput.value = "";
                                if (obsInput) obsInput.value = "";
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
                        <h5 className="text-sm font-medium text-gray-700 mb-3">
                          Tendon Ruptures
                        </h5>

                        {/* Existing tendon ruptures */}
                        {tendonRuptures.map((rupture, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                          >
                            <input
                              type="text"
                              value={rupture.location}
                              onChange={(e) => {
                                const updatedRuptures = [...tendonRuptures];
                                updatedRuptures[index].location =
                                  e.target.value;
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
                                updatedRuptures[index].observation =
                                  e.target.value;
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
                              const nameInput = document.getElementById(
                                "tendon-rupture-name",
                              ) as HTMLInputElement;
                              const yearInput = document.getElementById(
                                "tendon-rupture-year",
                              ) as HTMLInputElement;
                              const obsInput = document.getElementById(
                                "tendon-rupture-observation",
                              ) as HTMLInputElement;

                              if (nameInput && nameInput.value.trim()) {
                                setTendonRuptures([
                                  ...tendonRuptures,
                                  {
                                    location: nameInput.value.trim(),
                                    year: yearInput ? yearInput.value : "",
                                    observation: obsInput ? obsInput.value : "",
                                  },
                                ]);

                                if (nameInput) nameInput.value = "";
                                if (yearInput) yearInput.value = "";
                                if (obsInput) obsInput.value = "";
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
                        <h5 className="text-sm font-medium text-gray-700 mb-3">
                          Ligament Ruptures
                        </h5>

                        {/* Existing ligament ruptures */}
                        {ligamentRuptures.map((rupture, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                          >
                            <input
                              type="text"
                              value={rupture.location}
                              onChange={(e) => {
                                const updatedRuptures = [...ligamentRuptures];
                                updatedRuptures[index].location =
                                  e.target.value;
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
                                updatedRuptures[index].observation =
                                  e.target.value;
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
                              const nameInput = document.getElementById(
                                "ligament-rupture-name",
                              ) as HTMLInputElement;
                              const yearInput = document.getElementById(
                                "ligament-rupture-year",
                              ) as HTMLInputElement;
                              const obsInput = document.getElementById(
                                "ligament-rupture-observation",
                              ) as HTMLInputElement;

                              if (nameInput && nameInput.value.trim()) {
                                setLigamentRuptures([
                                  ...ligamentRuptures,
                                  {
                                    location: nameInput.value.trim(),
                                    year: yearInput ? yearInput.value : "",
                                    observation: obsInput ? obsInput.value : "",
                                  },
                                ]);

                                if (nameInput) nameInput.value = "";
                                if (yearInput) yearInput.value = "";
                                if (obsInput) obsInput.value = "";
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
                        <h5 className="text-sm font-medium text-gray-700 mb-3">
                          Accidents and Falls
                        </h5>

                        {/* Car Accidents */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                            Car Accidents
                          </label>
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
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                            Falls from Height
                          </label>
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
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                            Falls on Ice
                          </label>
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
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                            Falls on Stairs
                          </label>
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
          </AccordionContent>
        </AccordionItem>

        {/* Section 6: Surgical Interventions */}
        <AccordionItem value="surgical-interventions">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Stethoscope className="mr-2 h-5 w-5 text-blue-500" />
              <span>Surgical Interventions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                {/* Existing surgical interventions */}
                {surgicalInterventionsList.map((intervention, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <select
                      value={intervention.name}
                      onChange={(e) => {
                        const updatedInterventions = [
                          ...surgicalInterventionsList,
                        ];
                        updatedInterventions[index].name = e.target.value;
                        setSurgicalInterventionsList(updatedInterventions);

                        // Show/hide other input when "Other" is selected
                        const otherInput = document.getElementById(
                          `intervention-other-${index}`,
                        );
                        if (otherInput) {
                          otherInput.style.display =
                            e.target.value === "Other"
                              ? "inline-block"
                              : "none";
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
                        display:
                          intervention.name === "Other"
                            ? "inline-block"
                            : "none",
                      }}
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      onChange={(e) => {
                        if (e.target.value.trim()) {
                          const updatedInterventions = [
                            ...surgicalInterventionsList,
                          ];
                          updatedInterventions[index].name = e.target.value;
                          setSurgicalInterventionsList(updatedInterventions);
                        }
                      }}
                    />

                    <input
                      type="text"
                      value={intervention.year}
                      onChange={(e) => {
                        const updatedInterventions = [
                          ...surgicalInterventionsList,
                        ];
                        updatedInterventions[index].year = e.target.value;
                        setSurgicalInterventionsList(updatedInterventions);
                      }}
                      placeholder="Year"
                      className="w-32 text-sm p-2 border border-gray-300 rounded-md"
                    />

                    <input
                      type="text"
                      value={intervention.notes || ""}
                      onChange={(e) => {
                        const updatedInterventions = [
                          ...surgicalInterventionsList,
                        ];
                        updatedInterventions[index].notes = e.target.value;
                        setSurgicalInterventionsList(updatedInterventions);
                      }}
                      placeholder="Notes"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                    />

                    <button
                      onClick={() => {
                        const updatedInterventions = [
                          ...surgicalInterventionsList,
                        ];
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

                {/* Show blank state message if no interventions */}
                {surgicalInterventionsList.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">
                      Patient has no surgical interventions
                    </p>
                  </div>
                )}

                {/* Always show "Add New" button */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      // Add a new empty intervention that will appear as editable row
                      setSurgicalInterventionsList([
                        ...surgicalInterventionsList,
                        {
                          name: "",
                          year: "",
                          notes: "",
                        },
                      ]);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                  >
                    Add New
                  </button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 7: Physiological History */}
        <AccordionItem value="physiological-history">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Baby className="mr-2 h-5 w-5 text-pink-500" />
              <span>Physiological History</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Birth Weight */}
                  <div>
                    <label
                      htmlFor="birth-weight"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Weight at Birth
                    </label>
                    <input
                      type="text"
                      id="birth-weight"
                      value={birthWeight}
                      onChange={(e) => setBirthWeight(e.target.value)}
                      placeholder="e.g., 3.5 kg"
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Breastfed */}
                  <div>
                    <label
                      htmlFor="breastfed"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Breastfed
                    </label>
                    <select
                      id="breastfed"
                      value={breastfed}
                      onChange={(e) =>
                        setBreastfed(e.target.value as "yes" | "no" | "")
                      }
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {/* Birth Process */}
                  <div>
                    <label
                      htmlFor="birth-process"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      How did the birth take place?
                    </label>
                    <select
                      id="birth-process"
                      value={birthProcess}
                      onChange={(e) =>
                        setBirthProcess(e.target.value as "O" | "S" | "")
                      }
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select option</option>
                      <option value="O">O: Oxytocin</option>
                      <option value="S">S: Obstetric Pushing</option>
                    </select>
                  </div>

                  {/* Sucking Reflex */}
                  <div>
                    <label
                      htmlFor="sucking-reflex"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Presence of the Sucking Reflex
                    </label>
                    <select
                      id="sucking-reflex"
                      value={suckingReflex}
                      onChange={(e) =>
                        setSuckingReflex(e.target.value as "yes" | "no" | "")
                      }
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {/* Labor Duration */}
                  <div>
                    <label
                      htmlFor="labor-duration"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Duration of Labor
                    </label>
                    <input
                      type="text"
                      id="labor-duration"
                      value={laborDuration}
                      onChange={(e) => setLaborDuration(e.target.value)}
                      placeholder="e.g., 12 hours"
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Birth Type */}
                  <div>
                    <label
                      htmlFor="birth-type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Type of Birth
                    </label>
                    <select
                      id="birth-type"
                      value={birthType}
                      onChange={(e) =>
                        setBirthType(
                          e.target.value as
                            | "premature"
                            | "normal"
                            | "slow"
                            | "",
                        )
                      }
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select option</option>
                      <option value="premature">Premature Birth</option>
                      <option value="normal">Normal Birth</option>
                      <option value="slow">Slow Birth</option>
                    </select>
                  </div>

                  {/* Abnormal Presentation */}
                  <div>
                    <label
                      htmlFor="abnormal-presentation"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Abnormal Presentation of the Fetus
                    </label>
                    <select
                      id="abnormal-presentation"
                      value={abnormalPresentation}
                      onChange={(e) =>
                        setAbnormalPresentation(
                          e.target.value as "yes" | "no" | "",
                        )
                      }
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label
                    htmlFor="physiological-notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="physiological-notes"
                    value={physiologicalNotes}
                    onChange={(e) => setPhysiologicalNotes(e.target.value)}
                    placeholder="Add any additional notes about physiological history..."
                    className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    rows={4}
                  ></textarea>
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
              {/* INSTRUMENTAL EXAMS Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  INSTRUMENTAL EXAMS
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Medical Tests and Examinations</h5>
                  
                  {/* Show message when no exams */}
                  {instrumentalExams.length === 0 && !showNewInstrumentalExamForm && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">Patient has no instrumental exams recorded</p>
                    </div>
                  )}

                  {/* Existing Instrumental Exams */}
                  {instrumentalExams.map(
                    (exam: InstrumentalExam, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200"
                      >
                        {/* Labels row */}
                        <div className="flex w-full mb-1">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500">
                              Exam Name
                            </label>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500">
                              File Attachment
                            </label>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500">
                              Notes
                            </label>
                          </div>
                          <div className="w-8"></div>
                        </div>

                        {/* Inputs row */}
                        <div className="flex w-full items-start">
                          {/* Exam Name */}
                          <div className="flex-1 mr-2">
                            <div className="flex items-center gap-2">
                              <select
                                value={
                                  exam.name.includes("|") ? "Other" : exam.name
                                }
                                onChange={(e) => {
                                  const updatedExams = [...instrumentalExams];

                                  if (e.target.value === "Other") {
                                    const customName = exam.name.includes("|")
                                      ? exam.name.split("|")[1]
                                      : "";
                                    updatedExams[index].name =
                                      `Other|${customName}`;
                                  } else {
                                    updatedExams[index].name = e.target.value;
                                  }

                                  setInstrumentalExams(updatedExams);
                                }}
                                className="w-full text-sm p-2 border border-gray-300 rounded-md"
                              >
                                <option value="X-Ray">X-Ray</option>
                                <option value="MRI">MRI</option>
                                <option value="CT Scan">CT Scan</option>
                                <option value="Ultrasound">Ultrasound</option>
                                <option value="Blood Test">Blood Test</option>
                                <option value="Urine Test">Urine Test</option>
                                <option value="EKG/ECG">EKG/ECG</option>
                                <option value="EMG">EMG</option>
                                <option value="Bone Densitometry">
                                  Bone Densitometry
                                </option>
                                <option value="PET Scan">PET Scan</option>
                                <option value="Endoscopy">Endoscopy</option>
                                <option value="Other">Other</option>
                              </select>

                              {exam.name.includes("|") && (
                                <input
                                  type="text"
                                  value={exam.name.split("|")[1] || ""}
                                  onChange={(e) => {
                                    const updatedExams = [...instrumentalExams];
                                    updatedExams[index].name =
                                      `Other|${e.target.value}`;
                                    setInstrumentalExams(updatedExams);
                                  }}
                                  placeholder="Specify exam type"
                                  className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                                />
                              )}
                            </div>
                          </div>

                          {/* File Attachment */}
                          <div className="flex-1 mr-2">
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={exam.fileAttachment}
                                onChange={(e) => {
                                  const updatedExams = [...instrumentalExams];
                                  updatedExams[index].fileAttachment =
                                    e.target.value;
                                  setInstrumentalExams(updatedExams);
                                }}
                                placeholder="No file selected"
                                className="w-full text-sm p-2 border border-gray-300 rounded-l-md"
                                readOnly
                              />
                              <label
                                htmlFor={`file-upload-${index}`}
                                className="cursor-pointer bg-blue-500 text-white px-2 py-2 text-sm rounded-r-md hover:bg-blue-600"
                              >
                                Browse
                              </label>
                              <input
                                id={`file-upload-${index}`}
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const updatedExams = [...instrumentalExams];
                                    updatedExams[index].fileAttachment =
                                      e.target.files[0].name;
                                    setInstrumentalExams(updatedExams);
                                  }
                                }}
                              />
                            </div>
                          </div>

                          {/* Notes */}
                          <div className="flex-1">
                            <input
                              type="text"
                              value={exam.notes}
                              onChange={(e) => {
                                const updatedExams = [...instrumentalExams];
                                updatedExams[index].notes = e.target.value;
                                setInstrumentalExams(updatedExams);
                              }}
                              placeholder="Additional notes about the exam"
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            />
                          </div>

                          {/* Remove Button */}
                          <div className="w-8 flex justify-center">
                            <button
                              onClick={() => {
                                const updatedExams = [...instrumentalExams];
                                updatedExams.splice(index, 1);
                                setInstrumentalExams(updatedExams);
                              }}
                              className="p-2 text-red-500 hover:text-red-700"
                              aria-label="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ),
                  )}

                  {/* Add New Instrumental Exam Form (always visible) */}
                    <div className="mt-4 border-t pt-4">
                      {/* Labels row */}
                      <div className="flex w-full mb-1">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">
                            Exam Name
                          </label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">
                            File Attachment
                          </label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">
                            Notes
                          </label>
                        </div>
                        <div className="w-8"></div>
                      </div>

                    {/* Inputs row */}
                    <div className="flex w-full items-start">
                      {/* Exam Name */}
                      <div className="flex-1 mr-2">
                        <div
                          className="flex items-center gap-2"
                          id="new-exam-container"
                        >
                          <select
                            id="new-exam-name"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            defaultValue=""
                            onChange={(e) => {
                              const container =
                                document.getElementById("new-exam-container");
                              const customInput =
                                document.getElementById("new-exam-custom");

                              if (
                                e.target.value === "Other" &&
                                container &&
                                !customInput
                              ) {
                                // Insert custom input after select
                                const customField =
                                  document.createElement("input");
                                customField.id = "new-exam-custom";
                                customField.type = "text";
                                customField.placeholder = "Specify exam type";
                                customField.className =
                                  "flex-1 text-sm p-2 border border-gray-300 rounded-md";
                                container.appendChild(customField);
                              } else if (
                                e.target.value !== "Other" &&
                                customInput
                              ) {
                                customInput.remove();
                              }
                            }}
                          >
                            <option value="" disabled>
                              Select exam type
                            </option>
                            <option value="X-Ray">X-Ray</option>
                            <option value="MRI">MRI</option>
                            <option value="CT Scan">CT Scan</option>
                            <option value="Ultrasound">Ultrasound</option>
                            <option value="Blood Test">Blood Test</option>
                            <option value="Urine Test">Urine Test</option>
                            <option value="EKG/ECG">EKG/ECG</option>
                            <option value="EMG">EMG</option>
                            <option value="Bone Densitometry">
                              Bone Densitometry
                            </option>
                            <option value="PET Scan">PET Scan</option>
                            <option value="Endoscopy">Endoscopy</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* File Attachment */}
                      <div className="flex-1 mr-2">
                        <div className="flex items-center">
                          <input
                            type="text"
                            id="new-exam-file-display"
                            placeholder="No file selected"
                            className="w-full text-sm p-2 border border-gray-300 rounded-l-md"
                            readOnly
                          />
                          <label
                            htmlFor="new-exam-file"
                            className="cursor-pointer bg-blue-500 text-white px-2 py-2 text-sm rounded-r-md hover:bg-blue-600"
                          >
                            Browse
                          </label>
                          <input
                            id="new-exam-file"
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const fileDisplay = document.getElementById(
                                  "new-exam-file-display",
                                ) as HTMLInputElement;
                                if (fileDisplay) {
                                  fileDisplay.value = e.target.files[0].name;
                                }
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="flex-1 mr-2">
                        <input
                          type="text"
                          id="new-exam-notes"
                          placeholder="Additional notes about the exam"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      {/* Add New Button */}
                      <div className="w-auto flex justify-center">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center gap-2"
                          onClick={() => {
                            const nameSelect = document.getElementById(
                              "new-exam-name",
                            ) as HTMLSelectElement;
                            const customInput = document.getElementById(
                              "new-exam-custom",
                            ) as HTMLInputElement;
                            const fileDisplay = document.getElementById(
                              "new-exam-file-display",
                            ) as HTMLInputElement;
                            const notesInput = document.getElementById(
                              "new-exam-notes",
                            ) as HTMLInputElement;

                            if (nameSelect && nameSelect.value) {
                              let examName = nameSelect.value;

                              // If "Other" is selected, use the custom input value
                              if (
                                examName === "Other" &&
                                customInput &&
                                customInput.value.trim()
                              ) {
                                examName = `Other|${customInput.value.trim()}`;
                              } else if (
                                examName === "Other" &&
                                (!customInput || !customInput.value.trim())
                              ) {
                                // If "Other" is selected but no custom value is provided, don't add the exam
                                return;
                              }

                              setInstrumentalExams([
                                ...instrumentalExams,
                                {
                                  name: examName,
                                  fileAttachment: fileDisplay
                                    ? fileDisplay.value
                                    : "",
                                  notes: notesInput ? notesInput.value : "",
                                },
                              ]);

                              // Reset inputs
                              nameSelect.selectedIndex = 0;
                              if (customInput) customInput.remove();
                              if (fileDisplay) fileDisplay.value = "";
                              if (notesInput) notesInput.value = "";

                              // Reset file input
                              const fileInput = document.getElementById(
                                "new-exam-file",
                              ) as HTMLInputElement;
                              if (fileInput) fileInput.value = "";
                            }
                          }}
                          aria-label="Add Exam"
                        >
                          <span>+</span>
                          <span>Add New</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ORTHOSTATISM Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  ORTHOSTATISM
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Postural Assessment
                  </h5>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      BASSANI
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Dx (Right) TagSelectionInput */}
                      <TagSelectionInput
                        label="Dx (Right)"
                        placeholder="Select vertebrae..."
                        options={[
                          "C1",
                          "C2",
                          "C3",
                          "C4",
                          "C5",
                          "C6",
                          "C7",
                          "T1",
                          "T2",
                          "T3",
                          "T4",
                        ]}
                        selectedTags={bassaniDx}
                        onTagsChange={setBassaniDx}
                        allowCustomTags={false}
                        voiceEnabled={voiceInputEnabled}
                      />

                      {/* Sx (Left) TagSelectionInput */}
                      <TagSelectionInput
                        label="Sx (Left)"
                        placeholder="Select vertebrae..."
                        options={[
                          "C1",
                          "C2",
                          "C3",
                          "C4",
                          "C5",
                          "C6",
                          "C7",
                          "T1",
                          "T2",
                          "T3",
                          "T4",
                        ]}
                        selectedTags={bassaniSx}
                        onTagsChange={setBassaniSx}
                        allowCustomTags={false}
                        voiceEnabled={voiceInputEnabled}
                      />
                    </div>
                  </div>

                  {/* TFE Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      TFE
                    </label>

                    <div className="flex flex-col space-y-4">
                      <div className="w-full max-w-xs">
                        <select
                          value={tfe}
                          onChange={(e) => setTfe(e.target.value)}
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select TFE option</option>
                          <option value="Dx">Dx (Right)</option>
                          <option value="Sx">Sx (Left)</option>
                          <option value="None">None</option>
                        </select>
                      </div>

                      {tfe && (
                        <div className="pl-4 border-l-2 border-blue-200">
                          <p className="text-sm text-blue-700">
                            TFE: <strong>{tfe}</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Barral Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Barral
                    </label>

                    <TagSelectionInput
                      label="Select Areas"
                      placeholder="Select areas of interest..."
                      options={[
                        "Skull",
                        "Lung",
                        "Liver",
                        "Kidney",
                        "Shoulder (Rx)",
                        "Shoulder (Lx)",
                        "Stomach",
                        "Cervical",
                        "Dorsal",
                        "Lumbar",
                        "Uterus",
                        "Prostate",
                        "Ascending colon",
                        "Descending colon",
                        "Hip (Rx)",
                        "Hip (Lx)",
                        "Lower limb (Rx)",
                        "Lower limb (Lx)",
                        "Psycho-emotional",
                      ]}
                      selectedTags={barralOptions}
                      onTagsChange={setBarralOptions}
                      allowCustomTags={false}
                      voiceEnabled={voiceInputEnabled}
                      className="mb-2"
                    />
                  </div>

                  {/* Bending Test Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Bending Test
                    </label>

                    <TagSelectionInput
                      label="Select Vertebrae"
                      placeholder="Select relevant vertebrae..."
                      options={[
                        "T1",
                        "T2",
                        "T3",
                        "T4",
                        "T5",
                        "T6",
                        "T7",
                        "T8",
                        "T9",
                        "T10",
                        "T11",
                        "T12",
                        "L1",
                        "L2",
                        "L3",
                        "L4",
                        "L5",
                      ]}
                      selectedTags={bendingTestOptions}
                      onTagsChange={setBendingTestOptions}
                      allowCustomTags={false}
                      voiceEnabled={voiceInputEnabled}
                      className="mb-2"
                    />
                  </div>

                  {/* Lateral Flexion Dx Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Lateral Flexion Dx
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="lateral-flexion-dx-acute"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Acute inflection point at
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            id="lateral-flexion-dx-acute"
                            value={lateralFlexionDxAcutePoint}
                            onChange={(e) =>
                              setLateralFlexionDxAcutePoint(e.target.value)
                            }
                            placeholder="e.g., T7-T8"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                          {voiceInputEnabled && (
                            <button
                              type="button"
                              onClick={() => {
                                // Start voice recognition for this field
                                const recognition = new (
                                  window as any
                                ).webkitSpeechRecognition();
                                recognition.lang = "en-US";
                                recognition.onresult = (event: any) => {
                                  const transcript =
                                    event.results[0][0].transcript;
                                  setLateralFlexionDxAcutePoint(transcript);
                                };
                                recognition.start();
                              }}
                              className="ml-2 p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                              aria-label="Voice input"
                              title="Use voice input"
                            >
                              🎤
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="lateral-flexion-dx-straight"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Straight line at
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            id="lateral-flexion-dx-straight"
                            value={lateralFlexionDxStraightLine}
                            onChange={(e) =>
                              setLateralFlexionDxStraightLine(e.target.value)
                            }
                            placeholder="e.g., T11-L1"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                          {voiceInputEnabled && (
                            <button
                              type="button"
                              onClick={() => {
                                // Start voice recognition for this field
                                const recognition = new (
                                  window as any
                                ).webkitSpeechRecognition();
                                recognition.lang = "en-US";
                                recognition.onresult = (event: any) => {
                                  const transcript =
                                    event.results[0][0].transcript;
                                  setLateralFlexionDxStraightLine(transcript);
                                };
                                recognition.start();
                              }}
                              className="ml-2 p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                              aria-label="Voice input"
                              title="Use voice input"
                            >
                              🎤
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lateral Flexion Sx Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Lateral Flexion Sx
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="lateral-flexion-sx-acute"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Acute inflection point at
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            id="lateral-flexion-sx-acute"
                            value={lateralFlexionSxAcutePoint}
                            onChange={(e) =>
                              setLateralFlexionSxAcutePoint(e.target.value)
                            }
                            placeholder="e.g., T7-T8"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                          {voiceInputEnabled && (
                            <button
                              type="button"
                              onClick={() => {
                                // Start voice recognition for this field
                                const recognition = new (
                                  window as any
                                ).webkitSpeechRecognition();
                                recognition.lang = "en-US";
                                recognition.onresult = (event: any) => {
                                  const transcript =
                                    event.results[0][0].transcript;
                                  setLateralFlexionSxAcutePoint(transcript);
                                };
                                recognition.start();
                              }}
                              className="ml-2 p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                              aria-label="Voice input"
                              title="Use voice input"
                            >
                              🎤
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="lateral-flexion-sx-straight"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Straight line at
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            id="lateral-flexion-sx-straight"
                            value={lateralFlexionSxStraightLine}
                            onChange={(e) =>
                              setLateralFlexionSxStraightLine(e.target.value)
                            }
                            placeholder="e.g., T11-L1"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                          {voiceInputEnabled && (
                            <button
                              type="button"
                              onClick={() => {
                                // Start voice recognition for this field
                                const recognition = new (
                                  window as any
                                ).webkitSpeechRecognition();
                                recognition.lang = "en-US";
                                recognition.onresult = (event: any) => {
                                  const transcript =
                                    event.results[0][0].transcript;
                                  setLateralFlexionSxStraightLine(transcript);
                                };
                                recognition.start();
                              }}
                              className="ml-2 p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                              aria-label="Voice input"
                              title="Use voice input"
                            >
                              🎤
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Head Rotation Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Head Rotation
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Head Rotation Dx */}
                      <div>
                        <label
                          htmlFor="head-rotation-dx"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Head Rotation Dx
                        </label>
                        <select
                          id="head-rotation-dx"
                          value={headRotationDx}
                          onChange={(e) => setHeadRotationDx(e.target.value)}
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select an option</option>
                          <option value="Limited">Limited</option>
                          <option value="Compensated with lateral flexion">
                            Compensated with lateral flexion
                          </option>
                          <option value="Compensated with anteduction">
                            Compensated with anteduction
                          </option>
                        </select>
                      </div>

                      {/* Head Rotation Sx */}
                      <div>
                        <label
                          htmlFor="head-rotation-sx"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Head Rotation Sx
                        </label>
                        <select
                          id="head-rotation-sx"
                          value={headRotationSx}
                          onChange={(e) => setHeadRotationSx(e.target.value)}
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select an option</option>
                          <option value="Limited">Limited</option>
                          <option value="Compensated with lateral flexion">
                            Compensated with lateral flexion
                          </option>
                          <option value="Compensated with anteduction">
                            Compensated with anteduction
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Global Posture Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Global Posture
                    </label>

                    <TagSelectionInput
                      label="Select Posture Characteristics"
                      placeholder="Select posture characteristics..."
                      options={[
                        "Head antedus",
                        "Head projected posteriorly",
                        "Pelvis anteverted",
                        "Pelvis retroverted",
                        "G in front",
                        "G in back",
                        "Knees in hyperextension",
                        "Sway Back",
                        "Military",
                        "Trunk translated (Rx)",
                        "Trunk translated (Lx)",
                        "Pelvis translated (Rx)",
                        "Pelvis translated (Lx)",
                      ]}
                      selectedTags={globalPosture}
                      onTagsChange={setGlobalPosture}
                      allowCustomTags={false}
                      voiceEnabled={voiceInputEnabled}
                      className="mb-2"
                    />
                  </div>

                  {/* Typology Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label
                      htmlFor="typology"
                      className="block text-sm font-medium text-gray-700 mb-3"
                    >
                      Typology
                    </label>
                    <select
                      id="typology"
                      value={typology}
                      onChange={(e) => setTypology(e.target.value)}
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select an option</option>
                      <option value="Runaway (rejection)">
                        Runaway (rejection)
                      </option>
                      <option value="Dependent (abandonment)">
                        Dependent (abandonment)
                      </option>
                      <option value="Masochistic (humiliation)">
                        Masochistic (humiliation)
                      </option>
                      <option value="Dominant (betrayal)">
                        Dominant (betrayal)
                      </option>
                      <option value="Rigid (injustice)">
                        Rigid (injustice)
                      </option>
                    </select>
                  </div>

                  

                 

                  
                </div>
              </div>
              {/* SEATED POSITION Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  SEATED POSITION
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">

                {/* TFS Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    TFS
                  </label>
                  <div className="w-full max-w-xs">
                    <select
                      value={seatedTfs}
                      onChange={(e) => setSeatedTfs(e.target.value)}
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select TFS option</option>
                      <option value="Dx">Dx</option>
                      <option value="Sx">Sx</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>

                {/* Inferior Sacral Angle Section */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Inferior Sacral Angle
                  </label>
                  <div className="w-full max-w-xs">
                    <select
                      value={inferiorSacralAngle}
                      onChange={(e) => setInferiorSacralAngle(e.target.value)}
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select option</option>
                      <option value="Dx">Dx</option>
                      <option value="Sx">Sx</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>

                {/* Bending Test Section */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Bending Test
                  </label>
                  <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="seated-bending-test"
                        value="Maintain gibbosity"
                        checked={seatedBendingTest === "Maintain gibbosity"}
                        onChange={() =>
                          setSeatedBendingTest("Maintain gibbosity")
                        }
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Maintain gibbosity
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="seated-bending-test"
                        value="Cancel gibbosity"
                        checked={seatedBendingTest === "Cancel gibbosity"}
                        onChange={() =>
                          setSeatedBendingTest("Cancel gibbosity")
                        }
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Cancel gibbosity
                      </span>
                    </label>
                  </div>
                </div>
              </div>

                {/* DECUBITUS POSITION Section */}
                   <div className="space-y-4 mt-6">
                    <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                    DECUBITUS POSITION
                  </h4>
                     <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  {/* Barral Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Barral
                    </label>

                    <TagSelectionInput
                      label="Select Areas"
                      placeholder="Select areas of interest..."
                      options={[
                        "Ankle (Rx)",
                        "Ankle (Lx)",
                        "Knee (Rx)",
                        "Knee (Lx)",
                        "Hip (Rx)",
                        "Hip (Lx)",
                        "Iliac fossa (Rx)",
                        "Iliac fossa (Lx)",
                        "Umbilical",
                        "Hypochondrium (Rx)",
                        "Hypochondrium (Lx)",
                        "Spleen",
                        "Heart",
                      ]}
                      selectedTags={decubitusBarralOptions}
                      onTagsChange={setDecubitusBarralOptions}
                      allowCustomTags={false}
                      voiceEnabled={voiceInputEnabled}
                      className="mb-2"
                    />
                  </div>

                  {/* Sacral Bone Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sacral Bone
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="sacral-bone"
                          value="Dx-Dx"
                          checked={sacralBone === "Dx-Dx"}
                          onChange={() => setSacralBone("Dx-Dx")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Dx-Dx
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="sacral-bone"
                          value="Sx-Sx"
                          checked={sacralBone === "Sx-Sx"}
                          onChange={() => setSacralBone("Sx-Sx")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Sx-Sx
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="sacral-bone"
                          value="Dx-Sx"
                          checked={sacralBone === "Dx-Sx"}
                          onChange={() => setSacralBone("Dx-Sx")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Dx-Sx
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="sacral-bone"
                          value="Sx-Dx"
                          checked={sacralBone === "Sx-Dx"}
                          onChange={() => setSacralBone("Sx-Dx")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Sx-Dx
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Priority Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Priority
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value="Ascendant"
                          checked={priority === "Ascendant"}
                          onChange={() => setPriority("Ascendant")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Ascendant
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value="Descendant"
                          checked={priority === "Descendant"}
                          onChange={() => setPriority("Descendant")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Descendant
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value="Visceral"
                          checked={priority === "Visceral"}
                          onChange={() => setPriority("Visceral")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Visceral
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value="Mixed"
                          checked={priority === "Mixed"}
                          onChange={() => setPriority("Mixed")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Mixed
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Limited Internal Rotation Prone Position */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Limited Internal Rotation Prone Position
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="limited-internal-rotation"
                          value="M inf Sx"
                          checked={limitedInternalRotation === "M inf Sx"}
                          onChange={() =>
                            setLimitedInternalRotation("M inf Sx")
                          }
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          M inf Sx
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="limited-internal-rotation"
                          value="M inf Dx"
                          checked={limitedInternalRotation === "M inf Dx"}
                          onChange={() =>
                            setLimitedInternalRotation("M inf Dx")
                          }
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          M inf Dx
                        </span>
                      </label>
                    </div>
                  </div>
                  </div></div>
              
              </div>

              {/* ANATOMICAL ANOMALIES Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  ANATOMICAL ANOMALIES (LOCATION AND TYPE)
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Structural and Postural Anomalies
                  </h5>

                  {/* Existing anatomical anomalies */}
                  {anatomicalAnomalies.map((anomaly, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200"
                    >
                      {/* Labels row */}
                      <div className="flex w-full mb-1">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">
                            Location
                          </label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">
                            Type
                          </label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">
                            Observations
                          </label>
                        </div>
                        <div className="w-8"></div>
                      </div>

                      {/* Inputs row */}
                      <div className="flex w-full items-start">
                        {/* Location */}
                        <div className="flex-1 mr-2">
                          {anomaly.location === "Other" ? (
                            <div className="flex gap-1">
                              <select
                                value={anomaly.location}
                                onChange={(e) => {
                                  const updatedAnomalies = [
                                    ...anatomicalAnomalies,
                                  ];
                                  updatedAnomalies[index].location =
                                    e.target.value;
                                  setAnatomicalAnomalies(updatedAnomalies);
                                }}
                                className="w-1/2 text-sm p-2 border border-gray-300 rounded-md"
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
                                value={
                                  anomaly.observation.split("|")[0] || ""
                                }
                                onChange={(e) => {
                                  const updatedAnomalies = [
                                    ...anatomicalAnomalies,
                                  ];
                                  const parts =
                                    anomaly.observation.split("|");
                                  parts[0] = e.target.value;
                                  updatedAnomalies[index].observation =
                                    parts.join("|");
                                  setAnatomicalAnomalies(updatedAnomalies);
                                }}
                              />
                            </div>
                          ) : (
                            <select
                              value={anomaly.location}
                              onChange={(e) => {
                                const updatedAnomalies = [
                                  ...anatomicalAnomalies,
                                ];
                                updatedAnomalies[index].location =
                                  e.target.value;
                                setAnatomicalAnomalies(updatedAnomalies);
                              }}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
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
                        </div>

                        {/* Type */}
                        <div className="flex-1 mr-2">
                          {anomaly.type === "Other" ? (
                            <div className="flex gap-1">
                              <select
                                value={anomaly.type}
                                onChange={(e) => {
                                  const updatedAnomalies = [
                                    ...anatomicalAnomalies,
                                  ];
                                  updatedAnomalies[index].type =
                                    e.target.value;
                                  setAnatomicalAnomalies(updatedAnomalies);
                                }}
                                className="w-1/2 text-sm p-2 border border-gray-300 rounded-md"
                              >
                                <option value="">Select type</option>
                                <option value="Scoliosis">Scoliosis</option>
                                <option value="Kyphosis">Kyphosis</option>
                                <option value="Lordosis">Lordosis</option>
                                <option value="Leg length discrepancy">
                                  Leg length discrepancy
                                </option>
                                <option value="Pelvic tilt">
                                  Pelvic tilt
                                </option>
                                <option value="Flat feet">Flat feet</option>
                                <option value="High arch">High arch</option>
                                <option value="Knock knees">
                                  Knock knees
                                </option>
                                <option value="Bow legs">Bow legs</option>
                                <option value="Limited range of motion">
                                  Limited range of motion
                                </option>
                                <option value="Joint hypermobility">
                                  Joint hypermobility
                                </option>
                                <option value="Congenital anomaly">
                                  Congenital anomaly
                                </option>
                                <option value="Postural deviation">
                                  Postural deviation
                                </option>
                                <option value="Other">Other</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Specify type"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                                value={
                                  anomaly.observation.split("|")[1] || ""
                                }
                                onChange={(e) => {
                                  const updatedAnomalies = [
                                    ...anatomicalAnomalies,
                                  ];
                                  const parts =
                                    anomaly.observation.split("|");
                                  parts[1] = e.target.value;
                                  updatedAnomalies[index].observation =
                                    parts.join("|");
                                  setAnatomicalAnomalies(updatedAnomalies);
                                }}
                              />
                            </div>
                          ) : (
                            <select
                              value={anomaly.type}
                              onChange={(e) => {
                                const updatedAnomalies = [
                                  ...anatomicalAnomalies,
                                ];
                                updatedAnomalies[index].type =
                                  e.target.value;
                                setAnatomicalAnomalies(updatedAnomalies);
                              }}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select type</option>
                              <option value="Scoliosis">Scoliosis</option>
                              <option value="Kyphosis">Kyphosis</option>
                              <option value="Lordosis">Lordosis</option>
                              <option value="Leg length discrepancy">
                                Leg length discrepancy
                              </option>
                              <option value="Pelvic tilt">
                                Pelvic tilt
                              </option>
                              <option value="Flat feet">Flat feet</option>
                              <option value="High arch">High arch</option>
                              <option value="Knock knees">
                                Knock knees
                              </option>
                              <option value="Bow legs">Bow legs</option>
                              <option value="Limited range of motion">
                                Limited range of motion
                              </option>
                              <option value="Joint hypermobility">
                                Joint hypermobility
                              </option>
                              <option value="Congenital anomaly">
                                Congenital anomaly
                              </option>
                              <option value="Postural deviation">
                                Postural deviation
                              </option>
                              <option value="Other">Other</option>
                            </select>
                          )}
                        </div>

                        {/* Observations */}
                        <div className="flex-1 mr-2">
                          <input
                            type="text"
                            value={anomaly.observation}
                            onChange={(e) => {
                              const updatedAnomalies = [
                                ...anatomicalAnomalies,
                              ];
                              updatedAnomalies[index].observation =
                                e.target.value;
                              setAnatomicalAnomalies(updatedAnomalies);
                            }}
                            placeholder="Additional observations"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        {/* Remove Button */}
                        <div className="w-8 flex justify-center">
                          <button
                            onClick={() => {
                              const updatedAnomalies = [
                                ...anatomicalAnomalies,
                              ];
                              updatedAnomalies.splice(index, 1);
                              setAnatomicalAnomalies(updatedAnomalies);
                            }}
                            className="p-2 text-red-500 hover:text-red-700"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add New Anatomical Anomaly */}
                  <div className="mt-4 border-t pt-4">
                    {/* Labels row */}
                    <div className="flex w-full mb-1">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500">
                          Location
                        </label>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500">
                          Type
                        </label>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500">
                          Observations
                        </label>
                      </div>
                      <div className="w-8"></div>
                    </div>

                    {/* Inputs row */}
                    <div
                      className="flex w-full items-start"
                      id="new-anomaly-container"
                    >
                      {/* Location */}
                      <div className="flex-1 mr-2">
                        <div className="flex items-center gap-2">
                          <select
                            id="anomaly-location"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            defaultValue=""
                            onChange={(e) => {
                              const container = document.getElementById(
                                "new-anomaly-container",
                              );
                              const customLocationInput =
                                document.getElementById(
                                  "anomaly-location-custom",
                                );

                              if (
                                e.target.value === "Other" &&
                                container &&
                                !customLocationInput
                              ) {
                                // Insert custom input after select
                                const customField =
                                  document.createElement("input");
                                customField.id = "anomaly-location-custom";
                                customField.type = "text";
                                customField.placeholder =
                                  "Specify location";
                                customField.className =
                                  "flex-1 text-sm p-2 border border-gray-300 rounded-md mt-1";
                                const locationDiv =
                                  e.target.parentElement?.parentElement;
                                if (locationDiv) {
                                  locationDiv.appendChild(customField);
                                }
                              } else if (
                                e.target.value !== "Other" &&
                                customLocationInput
                              ) {
                                customLocationInput.remove();
                              }
                            }}
                          >
                            <option value="" disabled>
                              Select location
                            </option>
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
                        </div>
                      </div>

                      {/* Type */}
                      <div className="flex-1 mr-2">
                        <div className="flex items-center gap-2">
                          <select
                            id="anomaly-type"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            defaultValue=""
                            onChange={(e) => {
                              const container = document.getElementById(
                                "new-anomaly-container",
                              );
                              const customTypeInput =
                                document.getElementById(
                                  "anomaly-type-custom",
                                );

                              if (
                                e.target.value === "Other" &&
                                container &&
                                !customTypeInput
                              ) {
                                // Insert custom input after select
                                const customField =
                                  document.createElement("input");
                                customField.id = "anomaly-type-custom";
                                customField.type = "text";
                                customField.placeholder = "Specify type";
                                customField.className =
                                  "flex-1 text-sm p-2 border border-gray-300 rounded-md mt-1";
                                const typeDiv =
                                  e.target.parentElement?.parentElement;
                                if (typeDiv) {
                                  typeDiv.appendChild(customField);
                                }
                              } else if (
                                e.target.value !== "Other" &&
                                customTypeInput
                              ) {
                                customTypeInput.remove();
                              }
                            }}
                          >
                            <option value="" disabled>
                              Select type
                            </option>
                            <option value="Scoliosis">Scoliosis</option>
                            <option value="Kyphosis">Kyphosis</option>
                            <option value="Lordosis">Lordosis</option>
                            <option value="Leg length discrepancy">
                              Leg length discrepancy
                            </option>
                            <option value="Pelvic tilt">Pelvic tilt</option>
                            <option value="Flat feet">Flat feet</option>
                            <option value="High arch">High arch</option>
                            <option value="Knock knees">Knock knees</option>
                            <option value="Bow legs">Bow legs</option>
                            <option value="Limited range of motion">
                              Limited range of motion
                            </option>
                            <option value="Joint hypermobility">
                              Joint hypermobility
                            </option>
                            <option value="Congenital anomaly">
                              Congenital anomaly
                            </option>
                            <option value="Postural deviation">
                              Postural deviation
                            </option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Observations */}
                      <div className="flex-1 mr-2">
                        <input
                          type="text"
                          id="anomaly-observation"
                          placeholder="Additional observations"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      {/* Add Button */}
                      <div className="w-8 flex justify-center">
                        <button
                          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                          onClick={() => {
                            const locationSelect = document.getElementById(
                              "anomaly-location",
                            ) as HTMLSelectElement;
                            const typeSelect = document.getElementById(
                              "anomaly-type",
                            ) as HTMLSelectElement;
                            const observationInput =
                              document.getElementById(
                                "anomaly-observation",
                              ) as HTMLInputElement;
                            const locationCustomInput =
                              document.getElementById(
                                "anomaly-location-custom",
                              ) as HTMLInputElement;
                            const typeCustomInput = document.getElementById(
                              "anomaly-type-custom",
                            ) as HTMLInputElement;

                            if (locationSelect && locationSelect.value) {
                              let location = locationSelect.value;
                              let type = typeSelect ? typeSelect.value : "";
                              let observation = observationInput
                                ? observationInput.value.trim()
                                : "";

                              // If "Other" is selected, use the custom input values
                              if (
                                location === "Other" &&
                                locationCustomInput &&
                                locationCustomInput.value.trim()
                              ) {
                                // Store the custom location name in the observation field with a special separator
                                observation = `custom_location:${locationCustomInput.value.trim()}|${observation}`;
                              }

                              if (
                                type === "Other" &&
                                typeCustomInput &&
                                typeCustomInput.value.trim()
                              ) {
                                // Store the custom type name in the observation field with a special separator
                                observation = `${observation}|custom_type:${typeCustomInput.value.trim()}`;
                              }

                              setAnatomicalAnomalies([
                                ...anatomicalAnomalies,
                                {
                                  location: location,
                                  type: type,
                                  observation: observation,
                                },
                              ]);

                              // Reset inputs
                              locationSelect.selectedIndex = 0;
                              if (typeSelect) typeSelect.selectedIndex = 0;
                              if (observationInput)
                                observationInput.value = "";

                              // Remove custom inputs if they exist
                              if (locationCustomInput)
                                locationCustomInput.remove();
                              if (typeCustomInput) typeCustomInput.remove();
                            }
                          }}
                          aria-label="Add Anomaly"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
              {/* Respiratory systems */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  Respiratory systems
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Pathologies
                  </h5>

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
                            <option value="Coronary artery disease">
                              Coronary artery disease
                            </option>
                            <option value="Heart failure">Heart failure</option>
                            <option value="Valvular heart disease">
                              Valvular heart disease
                            </option>
                            <option value="Peripheral vascular disease">
                              Peripheral vascular disease
                            </option>
                            <option value="Deep vein thrombosis">
                              Deep vein thrombosis
                            </option>
                            <option value="Asthma">Asthma</option>
                            <option value="Chronic obstructive pulmonary disease">
                              Chronic obstructive pulmonary disease
                            </option>
                            <option value="Emphysema">Emphysema</option>
                            <option value="Bronchitis">Bronchitis</option>
                            <option value="Pneumonia">Pneumonia</option>
                            <option value="Pleural effusion">
                              Pleural effusion
                            </option>
                            <option value="Pulmonary embolism">
                              Pulmonary embolism
                            </option>
                            <option value="Sleep apnea">Sleep apnea</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify pathology"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={pathology.notes.split("|")[0] || ""}
                            onChange={(e) => {
                              const updatedPathologies = [...pathologies];
                              const parts = pathology.notes.split("|");
                              parts[0] = e.target.value;
                              updatedPathologies[index].notes = parts.join("|");
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
                          <option value="Coronary artery disease">
                            Coronary artery disease
                          </option>
                          <option value="Heart failure">Heart failure</option>
                          <option value="Valvular heart disease">
                            Valvular heart disease
                          </option>
                          <option value="Peripheral vascular disease">
                            Peripheral vascular disease
                          </option>
                          <option value="Deep vein thrombosis">
                            Deep vein thrombosis
                          </option>
                          <option value="Asthma">Asthma</option>
                          <option value="Chronic obstructive pulmonary disease">
                            Chronic obstructive pulmonary disease
                          </option>
                          <option value="Emphysema">Emphysema</option>
                          <option value="Bronchitis">Bronchitis</option>
                          <option value="Pneumonia">Pneumonia</option>
                          <option value="Pleural effusion">
                            Pleural effusion
                          </option>
                          <option value="Pulmonary embolism">
                            Pulmonary embolism
                          </option>
                          <option value="Sleep apnea">Sleep apnea</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                      <input
                        type="text"
                        value={
                          pathology.type === "Other"
                            ? pathology.notes.split("|")[1] || ""
                            : pathology.notes
                        }
                        onChange={(e) => {
                          const updatedPathologies = [...pathologies];
                          if (pathology.type === "Other") {
                            const parts = pathology.notes.split("|");
                            parts[1] = e.target.value;
                            updatedPathologies[index].notes = parts.join("|");
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
                  <div
                    className="flex items-center gap-2 mb-2"
                    id="new-pathology-container"
                  >
                    <select
                      id="pathology-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById(
                          "new-pathology-container",
                        );
                        const customInput =
                          document.getElementById("pathology-custom");

                        if (
                          e.target.value === "Other" &&
                          container &&
                          !customInput
                        ) {
                          // Insert custom input after select
                          const customField = document.createElement("input");
                          customField.id = "pathology-custom";
                          customField.type = "text";
                          customField.placeholder = "Specify pathology";
                          customField.className =
                            "flex-1 text-sm p-2 border border-gray-300 rounded-md";
                          container.insertBefore(
                            customField,
                            document.getElementById("pathology-notes"),
                          );
                        } else if (e.target.value !== "Other" && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select pathology
                      </option>
                      <option value="Hypertension">Hypertension</option>
                      <option value="Hypotension">Hypotension</option>
                      <option value="Arrhythmia">Arrhythmia</option>
                      <option value="Coronary artery disease">
                        Coronary artery disease
                      </option>
                      <option value="Heart failure">Heart failure</option>
                      <option value="Valvular heart disease">
                        Valvular heart disease
                      </option>
                      <option value="Peripheral vascular disease">
                        Peripheral vascular disease
                      </option>
                      <option value="Deep vein thrombosis">
                        Deep vein thrombosis
                      </option>
                      <option value="Asthma">Asthma</option>
                      <option value="Chronic obstructive pulmonary disease">
                        Chronic obstructive pulmonary disease
                      </option>
                      <option value="Emphysema">Emphysema</option>
                      <option value="Bronchitis">Bronchitis</option>
                      <option value="Pneumonia">Pneumonia</option>
                      <option value="Pleural effusion">Pleural effusion</option>
                      <option value="Pulmonary embolism">
                        Pulmonary embolism
                      </option>
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
                        const typeSelect = document.getElementById(
                          "pathology-type",
                        ) as HTMLSelectElement;
                        const notesInput = document.getElementById(
                          "pathology-notes",
                        ) as HTMLInputElement;
                        const customInput = document.getElementById(
                          "pathology-custom",
                        ) as HTMLInputElement;

                        if (typeSelect && typeSelect.value) {
                          let pathologyType = typeSelect.value;
                          let pathologyNotes = notesInput
                            ? notesInput.value
                            : "";

                          // If "Other" is selected, include the custom type in the notes with a separator
                          if (
                            pathologyType === "Other" &&
                            customInput &&
                            customInput.value
                          ) {
                            pathologyNotes =
                              customInput.value + "|" + pathologyNotes;
                          }

                          setPathologies([
                            ...pathologies,
                            {
                              type: pathologyType,
                              notes: pathologyNotes,
                            },
                          ]);

                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = "";

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
              {/* Circulatory systems */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  Circulatory systems
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Pathologies
                  </h5>

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
                            <option value="Coronary artery disease">
                              Coronary artery disease
                            </option>
                            <option value="Heart failure">Heart failure</option>
                            <option value="Valvular heart disease">
                              Valvular heart disease
                            </option>
                            <option value="Peripheral vascular disease">
                              Peripheral vascular disease
                            </option>
                            <option value="Deep vein thrombosis">
                              Deep vein thrombosis
                            </option>
                            <option value="Asthma">Asthma</option>
                            <option value="Chronic obstructive pulmonary disease">
                              Chronic obstructive pulmonary disease
                            </option>
                            <option value="Emphysema">Emphysema</option>
                            <option value="Bronchitis">Bronchitis</option>
                            <option value="Pneumonia">Pneumonia</option>
                            <option value="Pleural effusion">
                              Pleural effusion
                            </option>
                            <option value="Pulmonary embolism">
                              Pulmonary embolism
                            </option>
                            <option value="Sleep apnea">Sleep apnea</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify pathology"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={pathology.notes.split("|")[0] || ""}
                            onChange={(e) => {
                              const updatedPathologies = [...pathologies];
                              const parts = pathology.notes.split("|");
                              parts[0] = e.target.value;
                              updatedPathologies[index].notes = parts.join("|");
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
                          <option value="Coronary artery disease">
                            Coronary artery disease
                          </option>
                          <option value="Heart failure">Heart failure</option>
                          <option value="Valvular heart disease">
                            Valvular heart disease
                          </option>
                          <option value="Peripheral vascular disease">
                            Peripheral vascular disease
                          </option>
                          <option value="Deep vein thrombosis">
                            Deep vein thrombosis
                          </option>
                          <option value="Asthma">Asthma</option>
                          <option value="Chronic obstructive pulmonary disease">
                            Chronic obstructive pulmonary disease
                          </option>
                          <option value="Emphysema">Emphysema</option>
                          <option value="Bronchitis">Bronchitis</option>
                          <option value="Pneumonia">Pneumonia</option>
                          <option value="Pleural effusion">
                            Pleural effusion
                          </option>
                          <option value="Pulmonary embolism">
                            Pulmonary embolism
                          </option>
                          <option value="Sleep apnea">Sleep apnea</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                      <input
                        type="text"
                        value={
                          pathology.type === "Other"
                            ? pathology.notes.split("|")[1] || ""
                            : pathology.notes
                        }
                        onChange={(e) => {
                          const updatedPathologies = [...pathologies];
                          if (pathology.type === "Other") {
                            const parts = pathology.notes.split("|");
                            parts[1] = e.target.value;
                            updatedPathologies[index].notes = parts.join("|");
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
                  <div
                    className="flex items-center gap-2 mb-2"
                    id="new-pathology-container"
                  >
                    <select
                      id="pathology-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById(
                          "new-pathology-container",
                        );
                        const customInput =
                          document.getElementById("pathology-custom");

                        if (
                          e.target.value === "Other" &&
                          container &&
                          !customInput
                        ) {
                          // Insert custom input after select
                          const customField = document.createElement("input");
                          customField.id = "pathology-custom";
                          customField.type = "text";
                          customField.placeholder = "Specify pathology";
                          customField.className =
                            "flex-1 text-sm p-2 border border-gray-300 rounded-md";
                          container.insertBefore(
                            customField,
                            document.getElementById("pathology-notes"),
                          );
                        } else if (e.target.value !== "Other" && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select pathology
                      </option>
                      <option value="Hypertension">Hypertension</option>
                      <option value="Hypotension">Hypotension</option>
                      <option value="Arrhythmia">Arrhythmia</option>
                      <option value="Coronary artery disease">
                        Coronary artery disease
                      </option>
                      <option value="Heart failure">Heart failure</option>
                      <option value="Valvular heart disease">
                        Valvular heart disease
                      </option>
                      <option value="Peripheral vascular disease">
                        Peripheral vascular disease
                      </option>
                      <option value="Deep vein thrombosis">
                        Deep vein thrombosis
                      </option>
                      <option value="Asthma">Asthma</option>
                      <option value="Chronic obstructive pulmonary disease">
                        Chronic obstructive pulmonary disease
                      </option>
                      <option value="Emphysema">Emphysema</option>
                      <option value="Bronchitis">Bronchitis</option>
                      <option value="Pneumonia">Pneumonia</option>
                      <option value="Pleural effusion">Pleural effusion</option>
                      <option value="Pulmonary embolism">
                        Pulmonary embolism
                      </option>
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
                        const typeSelect = document.getElementById(
                          "pathology-type",
                        ) as HTMLSelectElement;
                        const notesInput = document.getElementById(
                          "pathology-notes",
                        ) as HTMLInputElement;
                        const customInput = document.getElementById(
                          "pathology-custom",
                        ) as HTMLInputElement;

                        if (typeSelect && typeSelect.value) {
                          let pathologyType = typeSelect.value;
                          let pathologyNotes = notesInput
                            ? notesInput.value
                            : "";

                          // If "Other" is selected, include the custom type in the notes with a separator
                          if (
                            pathologyType === "Other" &&
                            customInput &&
                            customInput.value
                          ) {
                            pathologyNotes =
                              customInput.value + "|" + pathologyNotes;
                          }

                          setPathologies([
                            ...pathologies,
                            {
                              type: pathologyType,
                              notes: pathologyNotes,
                            },
                          ]);

                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = "";

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
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Digestive Conditions
                  </h5>

                  {/* Stool Form multiple select */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stool Form
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Aerated",
                        "Dense",
                        "Liquid",
                        "Watery",
                        "Undigested pieces",
                        "Greasy film",
                      ].map((form) => (
                        <div key={form} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`stool-${form.toLowerCase().replace(/\s+/g, "-")}`}
                            checked={stoolForms.includes(form)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStoolForms([...stoolForms, form]);
                              } else {
                                setStoolForms(
                                  stoolForms.filter((f) => f !== form),
                                );
                              }
                            }}
                            className="mr-1 h-4 w-4 text-indigo-600 rounded border-gray-300"
                          />
                          <label
                            htmlFor={`stool-${form.toLowerCase().replace(/\s+/g, "-")}`}
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
                          checked={stoolForms.some((form) =>
                            form.startsWith("Other:"),
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Add a placeholder that will be replaced when the user types something
                              setStoolForms([...stoolForms, "Other:"]);
                              // Focus on the input field
                              setTimeout(() => {
                                const otherInput = document.getElementById(
                                  "stool-other-input",
                                ) as HTMLInputElement;
                                if (otherInput) otherInput.focus();
                              }, 0);
                            } else {
                              // Remove any "Other:" entries
                              setStoolForms(
                                stoolForms.filter(
                                  (f) => !f.startsWith("Other:"),
                                ),
                              );
                            }
                          }}
                          className="mr-1 h-4 w-4 text-indigo-600 rounded border-gray-300"
                        />
                        <label
                          htmlFor="stool-other"
                          className="text-sm text-gray-700 mr-2"
                        >
                          Other:
                        </label>
                        <input
                          type="text"
                          id="stool-other-input"
                          placeholder="Specify"
                          disabled={
                            !stoolForms.some((form) =>
                              form.startsWith("Other:"),
                            )
                          }
                          value={
                            stoolForms
                              .find((form) => form.startsWith("Other:"))
                              ?.substring(6) || ""
                          }
                          onChange={(e) => {
                            const otherValue = e.target.value;
                            // Replace the existing "Other:" entry with the new value
                            setStoolForms(
                              stoolForms.map((form) =>
                                form.startsWith("Other:")
                                  ? `Other:${otherValue}`
                                  : form,
                              ),
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
                            <option value="Gastroesophageal reflux disease">
                              Gastroesophageal reflux disease
                            </option>
                            <option value="Peptic ulcer">Peptic ulcer</option>
                            <option value="Gastritis">Gastritis</option>
                            <option value="Irritable bowel syndrome">
                              Irritable bowel syndrome
                            </option>
                            <option value="Inflammatory bowel disease">
                              Inflammatory bowel disease
                            </option>
                            <option value="Crohn's disease">
                              Crohn's disease
                            </option>
                            <option value="Ulcerative colitis">
                              Ulcerative colitis
                            </option>
                            <option value="Celiac disease">
                              Celiac disease
                            </option>
                            <option value="Diverticulitis">
                              Diverticulitis
                            </option>
                            <option value="Gallstones">Gallstones</option>
                            <option value="Fatty liver disease">
                              Fatty liver disease
                            </option>
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
                            value={disease.notes.split("|")[0] || ""}
                            onChange={(e) => {
                              const updatedDiseases = [...digestiveDiseases];
                              const parts = disease.notes.split("|");
                              parts[0] = e.target.value;
                              updatedDiseases[index].notes = parts.join("|");
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
                          <option value="Gastroesophageal reflux disease">
                            Gastroesophageal reflux disease
                          </option>
                          <option value="Peptic ulcer">Peptic ulcer</option>
                          <option value="Gastritis">Gastritis</option>
                          <option value="Irritable bowel syndrome">
                            Irritable bowel syndrome
                          </option>
                          <option value="Inflammatory bowel disease">
                            Inflammatory bowel disease
                          </option>
                          <option value="Crohn's disease">
                            Crohn's disease
                          </option>
                          <option value="Ulcerative colitis">
                            Ulcerative colitis
                          </option>
                          <option value="Celiac disease">Celiac disease</option>
                          <option value="Diverticulitis">Diverticulitis</option>
                          <option value="Gallstones">Gallstones</option>
                          <option value="Fatty liver disease">
                            Fatty liver disease
                          </option>
                          <option value="Hepatitis">Hepatitis</option>
                          <option value="Cirrhosis">Cirrhosis</option>
                          <option value="Pancreatitis">Pancreatitis</option>
                          <option value="Hiatal hernia">Hiatal hernia</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                      <input
                        type="text"
                        value={
                          disease.type === "Other"
                            ? disease.notes.split("|")[1] || ""
                            : disease.notes
                        }
                        onChange={(e) => {
                          const updatedDiseases = [...digestiveDiseases];
                          if (disease.type === "Other") {
                            const parts = disease.notes.split("|");
                            parts[1] = e.target.value;
                            updatedDiseases[index].notes = parts.join("|");
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
                  <div
                    className="flex items-center gap-2 mb-2"
                    id="new-digestive-container"
                  >
                    <select
                      id="digestive-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById(
                          "new-digestive-container",
                        );
                        const customInput =
                          document.getElementById("digestive-custom");

                        if (
                          e.target.value === "Other" &&
                          container &&
                          !customInput
                        ) {
                          // Insert custom input after select
                          const customField = document.createElement("input");
                          customField.id = "digestive-custom";
                          customField.type = "text";
                          customField.placeholder = "Specify condition";
                          customField.className =
                            "flex-1 text-sm p-2 border border-gray-300 rounded-md";
                          container.insertBefore(
                            customField,
                            document.getElementById("digestive-notes"),
                          );
                        } else if (e.target.value !== "Other" && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select condition
                      </option>
                      <option value="Gastroesophageal reflux disease">
                        Gastroesophageal reflux disease
                      </option>
                      <option value="Peptic ulcer">Peptic ulcer</option>
                      <option value="Gastritis">Gastritis</option>
                      <option value="Irritable bowel syndrome">
                        Irritable bowel syndrome
                      </option>
                      <option value="Inflammatory bowel disease">
                        Inflammatory bowel disease
                      </option>
                      <option value="Crohn's disease">Crohn's disease</option>
                      <option value="Ulcerative colitis">
                        Ulcerative colitis
                      </option>
                      <option value="Celiac disease">Celiac disease</option>
                      <option value="Diverticulitis">Diverticulitis</option>
                      <option value="Gallstones">Gallstones</option>
                      <option value="Fatty liver disease">
                        Fatty liver disease
                      </option>
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
                        const typeSelect = document.getElementById(
                          "digestive-type",
                        ) as HTMLSelectElement;
                        const notesInput = document.getElementById(
                          "digestive-notes",
                        ) as HTMLInputElement;
                        const customInput = document.getElementById(
                          "digestive-custom",
                        ) as HTMLInputElement;

                        if (typeSelect && typeSelect.value) {
                          let diseaseType = typeSelect.value;
                          let diseaseNotes = notesInput ? notesInput.value : "";

                          // If "Other" is selected, include the custom type in the notes with a separator
                          if (
                            diseaseType === "Other" &&
                            customInput &&
                            customInput.value
                          ) {
                            diseaseNotes =
                              customInput.value + "|" + diseaseNotes;
                          }

                          setDigestiveDiseases([
                            ...digestiveDiseases,
                            {
                              type: diseaseType,
                              notes: diseaseNotes,
                            },
                          ]);

                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = "";

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
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Urogenital Conditions
                  </h5>

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
                            <option value="Urinary tract infection">
                              Urinary tract infection
                            </option>
                            <option value="Kidney stones">Kidney stones</option>
                            <option value="Kidney disease">
                              Kidney disease
                            </option>
                            <option value="Polycystic kidney disease">
                              Polycystic kidney disease
                            </option>
                            <option value="Bladder dysfunction">
                              Bladder dysfunction
                            </option>
                            <option value="Overactive bladder">
                              Overactive bladder
                            </option>
                            <option value="Urinary incontinence">
                              Urinary incontinence
                            </option>
                            <option value="Prostate enlargement">
                              Prostate enlargement
                            </option>
                            <option value="Prostatitis">Prostatitis</option>
                            <option value="Endometriosis">Endometriosis</option>
                            <option value="Uterine fibroids">
                              Uterine fibroids
                            </option>
                            <option value="Polycystic ovary syndrome">
                              Polycystic ovary syndrome
                            </option>
                            <option value="Ovarian cysts">Ovarian cysts</option>
                            <option value="Pelvic inflammatory disease">
                              Pelvic inflammatory disease
                            </option>
                            <option value="Sexually transmitted infection">
                              Sexually transmitted infection
                            </option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify condition"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={disease.notes.split("|")[0] || ""}
                            onChange={(e) => {
                              const updatedDiseases = [...urogenitalDiseases];
                              const parts = disease.notes.split("|");
                              parts[0] = e.target.value;
                              updatedDiseases[index].notes = parts.join("|");
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
                          <option value="Urinary tract infection">
                            Urinary tract infection
                          </option>
                          <option value="Kidney stones">Kidney stones</option>
                          <option value="Kidney disease">Kidney disease</option>
                          <option value="Polycystic kidney disease">
                            Polycystic kidney disease
                          </option>
                          <option value="Bladder dysfunction">
                            Bladder dysfunction
                          </option>
                          <option value="Overactive bladder">
                            Overactive bladder
                          </option>
                          <option value="Urinary incontinence">
                            Urinary incontinence
                          </option>
                          <option value="Prostate enlargement">
                            Prostate enlargement
                          </option>
                          <option value="Prostatitis">Prostatitis</option>
                          <option value="Endometriosis">Endometriosis</option>
                          <option value="Uterine fibroids">
                            Uterine fibroids
                          </option>
                          <option value="Polycystic ovary syndrome">
                            Polycystic ovary syndrome
                          </option>
                          <option value="Ovarian cysts">Ovarian cysts</option>
                          <option value="Pelvic inflammatory disease">
                            Pelvic inflammatory disease
                          </option>
                          <option value="Sexually transmitted infection">
                            Sexually transmitted infection
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                      <input
                        type="text"
                        value={
                          disease.type === "Other"
                            ? disease.notes.split("|")[1] || ""
                            : disease.notes
                        }
                        onChange={(e) => {
                          const updatedDiseases = [...urogenitalDiseases];
                          if (disease.type === "Other") {
                            const parts = disease.notes.split("|");
                            parts[1] = e.target.value;
                            updatedDiseases[index].notes = parts.join("|");
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
                  <div
                    className="flex items-center gap-2 mb-2"
                    id="new-urogenital-container"
                  >
                    <select
                      id="urogenital-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById(
                          "new-urogenital-container",
                        );
                        const customInput =
                          document.getElementById("urogenital-custom");

                        if (
                          e.target.value === "Other" &&
                          container &&
                          !customInput
                        ) {
                          // Insert custom input after select
                          const customField = document.createElement("input");
                          customField.id = "urogenital-custom";
                          customField.type = "text";
                          customField.placeholder = "Specify condition";
                          customField.className =
                            "flex-1 text-sm p-2 border border-gray-300 rounded-md";
                          container.insertBefore(
                            customField,
                            document.getElementById("urogenital-notes"),
                          );
                        } else if (e.target.value !== "Other" && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select condition
                      </option>
                      <option value="Urinary tract infection">
                        Urinary tract infection
                      </option>
                      <option value="Kidney stones">Kidney stones</option>
                      <option value="Kidney disease">Kidney disease</option>
                      <option value="Polycystic kidney disease">
                        Polycystic kidney disease
                      </option>
                      <option value="Bladder dysfunction">
                        Bladder dysfunction
                      </option>
                      <option value="Overactive bladder">
                        Overactive bladder
                      </option>
                      <option value="Urinary incontinence">
                        Urinary incontinence
                      </option>
                      <option value="Prostate enlargement">
                        Prostate enlargement
                      </option>
                      <option value="Prostatitis">Prostatitis</option>
                      <option value="Endometriosis">Endometriosis</option>
                      <option value="Uterine fibroids">Uterine fibroids</option>
                      <option value="Polycystic ovary syndrome">
                        Polycystic ovary syndrome
                      </option>
                      <option value="Ovarian cysts">Ovarian cysts</option>
                      <option value="Pelvic inflammatory disease">
                        Pelvic inflammatory disease
                      </option>
                      <option value="Sexually transmitted infection">
                        Sexually transmitted infection
                      </option>
                      <option value="Nocturnal urination frequency">
                        Nocturnal urination frequency
                      </option>
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
                        const typeSelect = document.getElementById(
                          "urogenital-type",
                        ) as HTMLSelectElement;
                        const notesInput = document.getElementById(
                          "urogenital-notes",
                        ) as HTMLInputElement;
                        const customInput = document.getElementById(
                          "urogenital-custom",
                        ) as HTMLInputElement;

                        if (typeSelect && typeSelect.value) {
                          let diseaseType = typeSelect.value;
                          let diseaseNotes = notesInput ? notesInput.value : "";

                          // If "Other" is selected, include the custom type in the notes with a separator
                          if (
                            diseaseType === "Other" &&
                            customInput &&
                            customInput.value
                          ) {
                            diseaseNotes =
                              customInput.value + "|" + diseaseNotes;
                          }

                          setUrogenitalDiseases([
                            ...urogenitalDiseases,
                            {
                              type: diseaseType,
                              notes: diseaseNotes,
                            },
                          ]);

                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = "";

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
                          onChange={(e) =>
                            setMenstrualCycleFrequency(e.target.value)
                          }
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
                        <label
                          htmlFor="children-count"
                          className="text-sm text-gray-700 mr-2 w-44"
                        >
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

                      {/* Number of pregnancies */}
                      <div className="flex items-center mb-4">
                        <label
                          htmlFor="children-count"
                          className="text-sm text-gray-700 mr-2 w-44"
                        >
                          Number of pregnancies:
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
                        <div className="text-sm text-gray-700 mb-2">
                          Pregnancy history:
                        </div>

                        {/* Existing pregnancies */}
                        {pregnancies.map((pregnancy, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                          >
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
                                  updatedPregnancies[index].weightGain =
                                    e.target.value;
                                  setPregnancies(updatedPregnancies);
                                }}
                                className="text-sm p-2 border border-gray-300 rounded-md w-24"
                              />
                              <span className="text-xs text-gray-500 ml-1">
                                kg
                              </span>
                            </div>
                            <input
                              type="text"
                              placeholder="Notes"
                              value={pregnancy.notes}
                              onChange={(e) => {
                                const updatedPregnancies = [...pregnancies];
                                updatedPregnancies[index].notes =
                                  e.target.value;
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
                            <option value="" disabled>
                              Select type
                            </option>
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
                            <span className="text-xs text-gray-500 ml-1">
                              kg
                            </span>
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
                              const typeSelect = document.getElementById(
                                "pregnancy-type",
                              ) as HTMLSelectElement;
                              const yearInput = document.getElementById(
                                "pregnancy-year",
                              ) as HTMLInputElement;
                              const weightGainInput = document.getElementById(
                                "pregnancy-weight-gain",
                              ) as HTMLInputElement;
                              const notesInput = document.getElementById(
                                "pregnancy-notes",
                              ) as HTMLInputElement;

                              if (typeSelect && typeSelect.value) {
                                setPregnancies([
                                  ...pregnancies,
                                  {
                                    type: typeSelect.value,
                                    year: yearInput ? yearInput.value : "",
                                    weightGain: weightGainInput
                                      ? weightGainInput.value
                                      : "",
                                    notes: notesInput ? notesInput.value : "",
                                  },
                                ]);

                                // Reset inputs
                                typeSelect.selectedIndex = 0;
                                if (yearInput) yearInput.value = "";
                                if (weightGainInput) weightGainInput.value = "";
                                if (notesInput) notesInput.value = "";
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
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
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
                            <span className="text-xs text-gray-500 ml-1">
                              kg
                            </span>
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
                            const amountInput = document.getElementById(
                              "weight-change-amount",
                            ) as HTMLInputElement;
                            const timeSpanInput = document.getElementById(
                              "weight-change-timespan",
                            ) as HTMLInputElement;
                            const notesInput = document.getElementById(
                              "weight-change-notes",
                            ) as HTMLInputElement;

                            if (amountInput && amountInput.value) {
                              setWeightChanges([
                                ...weightChanges,
                                {
                                  amount: amountInput.value,
                                  timeSpan: timeSpanInput
                                    ? timeSpanInput.value
                                    : "",
                                  notes: notesInput ? notesInput.value : "",
                                },
                              ]);

                              // Reset inputs
                              amountInput.value = "";
                              if (timeSpanInput) timeSpanInput.value = "";
                              if (notesInput) notesInput.value = "";
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter positive values for weight gain (e.g., "5.5") and
                        negative values for weight loss (e.g., "-3.2"). For time
                        span, enter periods like "6 months," "2 years," etc.
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
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Visual Aid
                  </h5>

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
                        <label
                          htmlFor="wearing-glasses"
                          className="text-sm text-gray-700"
                        >
                          Wearing glasses
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="wearing-contact-lenses"
                          checked={wearingContactLenses}
                          onChange={(e) =>
                            setWearingContactLenses(e.target.checked)
                          }
                          className="mr-2 h-4 w-4 text-indigo-600 rounded border-gray-300"
                        />
                        <label
                          htmlFor="wearing-contact-lenses"
                          className="text-sm text-gray-700"
                        >
                          Wearing contact lenses
                        </label>
                      </div>
                    </div>

                    {/* Dominant eye selection */}
                    <div className="rounded-md border border-gray-200 p-3 bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Dominant Eye
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="dominant-eye"
                            value="Right (Dx)"
                            checked={dominantEye === "Right (Dx)"}
                            onChange={() => setDominantEye("Right (Dx)")}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Dx (Right)</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="dominant-eye"
                            value="Left (Sx)"
                            checked={dominantEye === "Left (Sx)"}
                            onChange={() => setDominantEye("Left (Sx)")}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Sx (Left)</span>
                        </label>
                      </div>
                    </div>

                    {/* Vision quality tracking */}
                    <div className="rounded-md border border-gray-200 p-3 bg-gray-50 mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vision Quality
                      </label>
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <label
                            htmlFor="vision-eye-count"
                            className="block text-xs text-gray-600 mb-1"
                          >
                            Client sees well with:
                          </label>
                          <select
                            id="vision-eye-count"
                            value={visionQuality.eyeCount}
                            onChange={(e) => {
                              setVisionQuality({
                                ...visionQuality,
                                eyeCount: e.target.value,
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
                            <label
                              htmlFor="vision-eye-dominance"
                              className="block text-xs text-gray-600 mb-1"
                            >
                              Which eye:
                            </label>
                            <select
                              id="vision-eye-dominance"
                              value={visionQuality.eyeDominance}
                              onChange={(e) => {
                                setVisionQuality({
                                  ...visionQuality,
                                  eyeDominance: e.target.value,
                                });
                              }}
                              className="text-sm p-2 border border-gray-300 rounded-md w-40"
                            >
                              <option value="">Select</option>
                              <option value="dominant">Dominant eye</option>
                              <option value="non-dominant">
                                Non-dominant eye
                              </option>
                            </select>
                          </div>
                        )}
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
                      <div
                        key={index}
                        className="mb-2 p-2 border border-gray-200 rounded-lg bg-white"
                      >
                        <div className="flex items-center gap-2">
                          <select
                            value={condition.condition}
                            onChange={(e) => {
                              const updatedConditions = [...eyeConditions];
                              updatedConditions[index].condition =
                                e.target.value;
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
                            <option value="Macular Degeneration">
                              Macular Degen.
                            </option>
                            <option value="Diabetic Retinopathy">
                              Diabetic Retin.
                            </option>
                            <option value="Amblyopia">Amblyopia</option>
                            <option value="Strabismus">Strabismus</option>
                            <option value="Dry Eye Syndrome">Dry Eye</option>
                            <option value="Saccadic movements">Saccadic movements</option>
                            <option value="Other">Other</option>
                          </select>

                          {condition.condition === "Other" && (
                            <input
                              type="text"
                              value={condition.observation.split("|")[0] || ""}
                              onChange={(e) => {
                                const updatedConditions = [...eyeConditions];
                                const parts = condition.observation.split("|");
                                parts[0] = e.target.value;
                                updatedConditions[index].observation =
                                  parts.join("|");
                                setEyeConditions(updatedConditions);
                              }}
                              placeholder="Custom"
                              className="text-sm p-1.5 border border-gray-300 rounded-md w-20"
                            />
                          )}

                          <div
                            className="flex items-center"
                            title="Right eye (Dx)"
                          >
                            <div className="bg-blue-50 border border-blue-200 rounded-l-md px-2 py-1">
                              <span className="text-sm text-blue-700 font-medium">
                                Dx
                              </span>
                            </div>
                            <input
                              type="text"
                              value={condition.rightEyeAngle}
                              onChange={(e) => {
                                const updatedConditions = [...eyeConditions];
                                updatedConditions[index].rightEyeAngle =
                                  e.target.value;
                                setEyeConditions(updatedConditions);
                              }}
                              placeholder="Angle"
                              className="text-sm p-1 border-y border-r border-gray-300 rounded-r-md w-16"
                            />
                          </div>

                          <div
                            className="flex items-center"
                            title="Left eye (Sx)"
                          >
                            <div className="bg-red-50 border border-red-200 rounded-l-md px-2 py-1">
                              <span className="text-sm text-red-700 font-medium">
                                Sx
                              </span>
                            </div>
                            <input
                              type="text"
                              value={condition.leftEyeAngle}
                              onChange={(e) => {
                                const updatedConditions = [...eyeConditions];
                                updatedConditions[index].leftEyeAngle =
                                  e.target.value;
                                setEyeConditions(updatedConditions);
                              }}
                              placeholder="Angle"
                              className="text-sm p-1 border-y border-r border-gray-300 rounded-r-md w-16"
                            />
                          </div>

                          <input
                            type="text"
                            value={
                              condition.condition === "Other"
                                ? condition.observation.split("|")[1] || ""
                                : condition.observation
                            }
                            onChange={(e) => {
                              const updatedConditions = [...eyeConditions];
                              if (condition.condition === "Other") {
                                const parts = condition.observation.split("|");
                                parts[1] = e.target.value;
                                updatedConditions[index].observation =
                                  parts.join("|");
                              } else {
                                updatedConditions[index].observation =
                                  e.target.value;
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
                            const customContainer = document.getElementById(
                              "custom-condition-container",
                            );
                            if (customContainer) {
                              if (e.target.value === "Other") {
                                customContainer.innerHTML = `
                                  <input
                                    type="text"
                                    id="custom-condition-input"
                                    placeholder="Custom"
                                    class="text-sm p-1.5 border border-gray-300 rounded-md w-20"
                                  />
                                `;
                              } else {
                                customContainer.innerHTML = "";
                              }
                            }
                          }}
                        >
                          <option value="" disabled>
                            Select condition
                          </option>
                          <option value="Myopia">Myopia</option>
                          <option value="Hyperopia">Hyperopia</option>
                          <option value="Astigmatism">Astigmatism</option>
                          <option value="Presbyopia">Presbyopia</option>
                          <option value="Glaucoma">Glaucoma</option>
                          <option value="Cataract">Cataract</option>
                          <option value="Macular Degeneration">
                            Macular Degen.
                          </option>
                          <option value="Diabetic Retinopathy">
                            Diabetic Retin.
                          </option>
                          <option value="Amblyopia">Amblyopia</option>
                          <option value="Strabismus">Strabismus</option>
                          <option value="Dry Eye Syndrome">Dry Eye</option>
                          <option value="Other">Other</option>
                        </select>

                        <div id="custom-condition-container"></div>

                        <div
                          className="flex items-center"
                          title="Right eye (Dx)"
                        >
                          <div className="bg-blue-50 border border-blue-200 rounded-l-md px-2 py-1">
                            <span className="text-sm text-blue-700 font-medium">
                              Dx
                            </span>
                          </div>
                          <input
                            type="text"
                            id="new-right-eye-angle"
                            placeholder="Angle"
                            className="text-sm p-1 border-y border-r border-gray-300 rounded-r-md w-16"
                          />
                        </div>

                        <div
                          className="flex items-center"
                          title="Left eye (Sx)"
                        >
                          <div className="bg-red-50 border border-red-200 rounded-l-md px-2 py-1">
                            <span className="text-sm text-red-700 font-medium">
                              Sx
                            </span>
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
                            const typeSelect = document.getElementById(
                              "eye-condition-type",
                            ) as HTMLSelectElement;
                            const rightEyeAngle = document.getElementById(
                              "new-right-eye-angle",
                            ) as HTMLInputElement;
                            const leftEyeAngle = document.getElementById(
                              "new-left-eye-angle",
                            ) as HTMLInputElement;
                            const notesInput = document.getElementById(
                              "new-eye-condition-notes",
                            ) as HTMLInputElement;
                            const customInput = document.getElementById(
                              "custom-condition-input",
                            ) as HTMLInputElement;

                            // Check if a condition is selected and at least one angle is provided
                            if (
                              typeSelect &&
                              typeSelect.value &&
                              (rightEyeAngle.value || leftEyeAngle.value)
                            ) {
                              let condition = typeSelect.value;
                              let observation = notesInput
                                ? notesInput.value
                                : "";

                              // If "Other" is selected, use the custom input value
                              if (
                                condition === "Other" &&
                                customInput &&
                                customInput.value
                              ) {
                                // Store the custom condition in the observation field with a separator
                                observation = `${customInput.value}|${observation}`;
                              }

                              setEyeConditions([
                                ...eyeConditions,
                                {
                                  condition,
                                  rightEyeAngle: rightEyeAngle.value || "",
                                  leftEyeAngle: leftEyeAngle.value || "",
                                  observation,
                                },
                              ]);

                              // Reset inputs
                              typeSelect.selectedIndex = 0;
                              rightEyeAngle.value = "";
                              leftEyeAngle.value = "";
                              if (notesInput) notesInput.value = "";

                              // Remove custom input if it exists
                              const customContainer = document.getElementById(
                                "custom-condition-container",
                              );
                              if (customContainer) {
                                customContainer.innerHTML = "";
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
                    <label
                      htmlFor="visual-disorders"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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

                  {/* Convergence Test Section */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Convergence Test
                    </label>

                    {/* Existing convergence tests */}
                    {convergenceTests.map((test, index) => (
                      <div
                        key={index}
                        className="mb-2 p-3 border border-gray-200 rounded-lg bg-white"
                      >
                        {/* Labels row */}
                        <div className="flex w-full mb-1">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500">Test Name</label>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500">Dx Notes</label>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500">Sx Notes</label>
                          </div>
                          <div className="w-8"></div>
                        </div>
                        
                        {/* Inputs row */}
                        <div className="flex w-full items-start gap-2">
                          {/* Test Name */}
                          <div className="flex-1">
                            <select
                              value={test.testName}
                              onChange={(e) => {
                                const updatedTests = [...convergenceTests];
                                updatedTests[index].testName = e.target.value;
                                setConvergenceTests(updatedTests);
                              }}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select test</option>
                              <option value="Glasses/braces/tongue on the spot">Glasses/braces/tongue on the spot</option>
                              <option value="M. Inf RI">M. Inf RI</option>
                              <option value="M Inf RE">M Inf RE</option>
                              <option value="Sitting">Sitting</option>
                              <option value="Right head position">Right head position</option>
                            </select>
                          </div>

                          {/* Dx Notes */}
                          <div className="flex-1">
                            <textarea
                              value={test.dxNotes}
                              onChange={(e) => {
                                const updatedTests = [...convergenceTests];
                                updatedTests[index].dxNotes = e.target.value;
                                setConvergenceTests(updatedTests);
                              }}
                              placeholder="Notes for Dx (Right)"
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                              rows={2}
                            />
                          </div>

                          {/* Sx Notes */}
                          <div className="flex-1">
                            <textarea
                              value={test.sxNotes}
                              onChange={(e) => {
                                const updatedTests = [...convergenceTests];
                                updatedTests[index].sxNotes = e.target.value;
                                setConvergenceTests(updatedTests);
                              }}
                              placeholder="Notes for Sx (Left)"
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                              rows={2}
                            />
                          </div>

                          {/* Remove Button */}
                          <div className="w-8 flex justify-center">
                            <button
                              onClick={() => {
                                const updatedTests = [...convergenceTests];
                                updatedTests.splice(index, 1);
                                setConvergenceTests(updatedTests);
                              }}
                              className="p-2 text-red-500 hover:text-red-700"
                              aria-label="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add new convergence test */}
                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      {/* Labels row */}
                      <div className="flex w-full mb-1">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Test Name</label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Dx Notes</label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Sx Notes</label>
                        </div>
                        <div className="w-8"></div>
                      </div>
                      
                      {/* Inputs row */}
                      <div className="flex w-full items-start gap-2">
                        {/* Test Name */}
                        <div className="flex-1">
                          <select
                            id="new-convergence-test"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            defaultValue=""
                          >
                            <option value="" disabled>Select test</option>
                            <option value="Glasses/braces/tongue on the spot">Glasses/braces/tongue on the spot</option>
                            <option value="M. Inf RI">M. Inf RI</option>
                            <option value="M Inf RE">M Inf RE</option>
                            <option value="Sitting">Sitting</option>
                            <option value="Right head position">Right head position</option>
                          </select>
                        </div>

                        {/* Dx Notes */}
                        <div className="flex-1">
                          <textarea
                            id="new-dx-notes"
                            placeholder="Notes for Dx (Right)"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                        </div>

                        {/* Sx Notes */}
                        <div className="flex-1">
                          <textarea
                            id="new-sx-notes"
                            placeholder="Notes for Sx (Left)"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                        </div>

                        {/* Add Button */}
                        <div className="w-8 flex justify-center">
                          <button
                            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            onClick={() => {
                              const testSelect = document.getElementById(
                                "new-convergence-test",
                              ) as HTMLSelectElement;
                              const dxNotesInput = document.getElementById(
                                "new-dx-notes",
                              ) as HTMLTextAreaElement;
                              const sxNotesInput = document.getElementById(
                                "new-sx-notes",
                              ) as HTMLTextAreaElement;

                              if (testSelect && testSelect.value) {
                                setConvergenceTests([
                                  ...convergenceTests,
                                  {
                                    testName: testSelect.value,
                                    dxNotes: dxNotesInput ? dxNotesInput.value : "",
                                    sxNotes: sxNotesInput ? sxNotesInput.value : "",
                                  },
                                ]);

                                // Reset inputs
                                testSelect.selectedIndex = 0;
                                if (dxNotesInput) dxNotesInput.value = "";
                                if (sxNotesInput) sxNotesInput.value = "";
                              }
                            }}
                            aria-label="Add Test"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ENT SPHERE: Ear, Nose, Throat Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  ENT SPHERE: Ear, Nose, Throat Conditions
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    ENT Conditions
                  </h5>

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
                            <option value="Meniere's Disease">
                              Meniere's Disease
                            </option>
                            <option value="Ear Infection">Ear Infection</option>
                            <option value="Otosclerosis">Otosclerosis</option>
                            <option value="Sinusitis">Sinusitis</option>
                            <option value="Rhinitis">Rhinitis</option>
                            <option value="Nasal Polyps">Nasal Polyps</option>
                            <option value="Deviated Septum">
                              Deviated Septum
                            </option>
                            <option value="Tonsillitis">Tonsillitis</option>
                            <option value="Laryngitis">Laryngitis</option>
                            <option value="Pharyngitis">Pharyngitis</option>
                            <option value="Vocal Cord Nodules">
                              Vocal Cord Nodules
                            </option>
                            <option value="TMJ Disorder">TMJ Disorder</option>
                            <option value="Sleep Apnea">Sleep Apnea</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify condition"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={condition.notes.split("|")[0] || ""}
                            onChange={(e) => {
                              const updatedConditions = [...entConditions];
                              const parts = condition.notes.split("|");
                              parts[0] = e.target.value;
                              updatedConditions[index].notes = parts.join("|");
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
                            <option value="Meniere's Disease">
                              Meniere's Disease
                            </option>
                            <option value="Ear Infection">Ear Infection</option>
                            <option value="Otosclerosis">Otosclerosis</option>
                            <option value="Sinusitis">Sinusitis</option>
                            <option value="Rhinitis">Rhinitis</option>
                            <option value="Nasal Polyps">Nasal Polyps</option>
                            <option value="Deviated Septum">
                              Deviated Septum
                            </option>
                            <option value="Tonsillitis">Tonsillitis</option>
                            <option value="Laryngitis">Laryngitis</option>
                            <option value="Pharyngitis">Pharyngitis</option>
                            <option value="Vocal Cord Nodules">
                              Vocal Cord Nodules
                            </option>
                            <option value="TMJ Disorder">TMJ Disorder</option>
                            <option value="Sleep Apnea">Sleep Apnea</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      )}

                      <input
                        type="text"
                        value={
                          condition.type === "Other"
                            ? condition.notes.split("|")[1] || ""
                            : condition.notes
                        }
                        onChange={(e) => {
                          const updatedConditions = [...entConditions];
                          if (condition.type === "Other") {
                            const parts = condition.notes.split("|");
                            parts[1] = e.target.value;
                            updatedConditions[index].notes = parts.join("|");
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
                  <div
                    className="flex items-center gap-2 mb-2"
                    id="new-ent-container"
                  >
                    <select
                      id="ent-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container =
                          document.getElementById("new-ent-container");
                        const customInput =
                          document.getElementById("ent-custom");

                        if (
                          e.target.value === "Other" &&
                          container &&
                          !customInput
                        ) {
                          // Insert custom input after select
                          const customField = document.createElement("input");
                          customField.id = "ent-custom";
                          customField.type = "text";
                          customField.placeholder = "Specify condition";
                          customField.className =
                            "flex-1 text-sm p-2 border border-gray-300 rounded-md";
                          container.insertBefore(
                            customField,
                            document.getElementById("ent-notes"),
                          );
                        } else if (e.target.value !== "Other" && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select condition
                      </option>
                      <option value="Tinnitus">Tinnitus</option>
                      <option value="Hearing Loss">Hearing Loss</option>
                      <option value="Vertigo">Vertigo</option>
                      <option value="Meniere's Disease">
                        Meniere's Disease
                      </option>
                      <option value="Ear Infection">Ear Infection</option>
                      <option value="Otosclerosis">Otosclerosis</option>
                      <option value="Sinusitis">Sinusitis</option>
                      <option value="Rhinitis">Rhinitis</option>
                      <option value="Nasal Polyps">Nasal Polyps</option>
                      <option value="Deviated Septum">Deviated Septum</option>
                      <option value="Tonsillitis">Tonsillitis</option>
                      <option value="Laryngitis">Laryngitis</option>
                      <option value="Pharyngitis">Pharyngitis</option>
                      <option value="Vocal Cord Nodules">
                        Vocal Cord Nodules
                      </option>
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
                        const typeSelect = document.getElementById(
                          "ent-type",
                        ) as HTMLSelectElement;
                        const notesInput = document.getElementById(
                          "ent-notes",
                        ) as HTMLInputElement;
                        const customInput = document.getElementById(
                          "ent-custom",
                        ) as HTMLInputElement;

                        if (typeSelect && typeSelect.value) {
                          let type = typeSelect.value;
                          let notes = notesInput ? notesInput.value : "";

                          // If "Other" is selected, use the custom input value
                          if (
                            type === "Other" &&
                            customInput &&
                            customInput.value
                          ) {
                            // Store the custom value in the notes field with a separator
                            notes = `${customInput.value}|${notes}`;
                          }

                          setENTConditions([
                            ...entConditions,
                            {
                              type,
                              notes,
                            },
                          ]);

                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = "";
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
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Angle's Occlusal Classification
                  </h5>

                  {/* Existing Stomatognatic conditions */}
                  {stomatognaticConditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      {condition.type === "Other" ? (
                        <div className="flex-1 flex gap-1">
                          <select
                            value={condition.type}
                            onChange={(e) => {
                              const updatedConditions = [
                                ...stomatognaticConditions,
                              ];
                              updatedConditions[index].type = e.target.value;
                              setStomatognaticConditions(updatedConditions);
                            }}
                            className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select classification</option>
                            <option value="Class I (Neutrocclusion)">
                              Class I (Neutrocclusion)
                            </option>
                            <option value="Class II Division 1">
                              Class II Division 1
                            </option>
                            <option value="Class II Division 2">
                              Class II Division 2
                            </option>
                            <option value="Class III (Mesiocclusion)">
                              Class III (Mesiocclusion)
                            </option>
                            <option value="Class II Subdivision">
                              Class II Subdivision
                            </option>
                            <option value="Class III Subdivision">
                              Class III Subdivision
                            </option>
                            <option value="Normal Occlusion">
                              Normal Occlusion
                            </option>
                            <option value="Overjet">Overjet</option>
                            <option value="Overbite">Overbite</option>
                            <option value="Crossbite">Crossbite</option>
                            <option value="Open Bite">Open Bite</option>
                            <option value="Deep Bite">Deep Bite</option>
                            <option value="Edge-to-Edge Bite">
                              Edge-to-Edge Bite
                            </option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Specify classification"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                            value={condition.notes.split("|")[0] || ""}
                            onChange={(e) => {
                              const updatedConditions = [
                                ...stomatognaticConditions,
                              ];
                              const parts = condition.notes.split("|");
                              parts[0] = e.target.value;
                              updatedConditions[index].notes = parts.join("|");
                              setStomatognaticConditions(updatedConditions);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <select
                            value={condition.type}
                            onChange={(e) => {
                              const updatedConditions = [
                                ...stomatognaticConditions,
                              ];
                              updatedConditions[index].type = e.target.value;
                              setStomatognaticConditions(updatedConditions);
                            }}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select classification</option>
                            <option value="Class I (Neutrocclusion)">
                              Class I (Neutrocclusion)
                            </option>
                            <option value="Class II Division 1">
                              Class II Division 1
                            </option>
                            <option value="Class II Division 2">
                              Class II Division 2
                            </option>
                            <option value="Class III (Mesiocclusion)">
                              Class III (Mesiocclusion)
                            </option>
                            <option value="Class II Subdivision">
                              Class II Subdivision
                            </option>
                            <option value="Class III Subdivision">
                              Class III Subdivision
                            </option>
                            <option value="Normal Occlusion">
                              Normal Occlusion
                            </option>
                            <option value="Overjet">Overjet</option>
                            <option value="Overbite">Overbite</option>
                            <option value="Crossbite">Crossbite</option>
                            <option value="Open Bite">Open Bite</option>
                            <option value="Deep Bite">Deep Bite</option>
                            <option value="Edge-to-Edge Bite">
                              Edge-to-Edge Bite
                            </option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      )}

                      <div className="flex-1">
                        <input
                          type="text"
                          value={
                            condition.type === "Other"
                              ? condition.notes.split("|")[1] || ""
                              : condition.notes
                          }
                          onChange={(e) => {
                            const updatedConditions = [
                              ...stomatognaticConditions,
                            ];
                            if (condition.type === "Other") {
                              const parts = condition.notes.split("|");
                              parts[1] = e.target.value;
                              updatedConditions[index].notes = parts.join("|");
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
                          const updatedConditions = [
                            ...stomatognaticConditions,
                          ];
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
                  <div
                    className="flex items-center gap-2 mb-2"
                    id="new-stomatognatic-container"
                  >
                    <select
                      id="stomatognatic-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById(
                          "new-stomatognatic-container",
                        );
                        const customInput = document.getElementById(
                          "stomatognatic-custom",
                        );

                        if (
                          e.target.value === "Other" &&
                          container &&
                          !customInput
                        ) {
                          // Insert custom input after select
                          const customField = document.createElement("input");
                          customField.id = "stomatognatic-custom";
                          customField.type = "text";
                          customField.placeholder = "Specify classification";
                          customField.className =
                            "flex-1 text-sm p-2 border border-gray-300 rounded-md";
                          container.insertBefore(
                            customField,
                            document.getElementById("stomatognatic-notes"),
                          );
                        } else if (e.target.value !== "Other" && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select classification
                      </option>
                      <option value="Class I (Neutrocclusion)">
                        Class I (Neutrocclusion)
                      </option>
                      <option value="Class II Division 1">
                        Class II Division 1
                      </option>
                      <option value="Class II Division 2">
                        Class II Division 2
                      </option>
                      <option value="Class III (Mesiocclusion)">
                        Class III (Mesiocclusion)
                      </option>
                      <option value="Class II Subdivision">
                        Class II Subdivision
                      </option>
                      <option value="Class III Subdivision">
                        Class III Subdivision
                      </option>
                      <option value="Normal Occlusion">Normal Occlusion</option>
                      <option value="Overjet">Overjet</option>
                      <option value="Overbite">Overbite</option>
                      <option value="Crossbite">Crossbite</option>
                      <option value="Open Bite">Open Bite</option>
                      <option value="Deep Bite">Deep Bite</option>
                      <option value="Edge-to-Edge Bite">
                        Edge-to-Edge Bite
                      </option>
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
                        const typeSelect = document.getElementById(
                          "stomatognatic-type",
                        ) as HTMLSelectElement;
                        const notesInput = document.getElementById(
                          "stomatognatic-notes",
                        ) as HTMLInputElement;
                        const customInput = document.getElementById(
                          "stomatognatic-custom",
                        ) as HTMLInputElement;

                        if (typeSelect && typeSelect.value) {
                          let type = typeSelect.value;
                          let notes = notesInput ? notesInput.value : "";

                          // If "Other" is selected, use the custom input value
                          if (
                            type === "Other" &&
                            customInput &&
                            customInput.value
                          ) {
                            // Store the custom value in the notes field with a separator
                            notes = `${customInput.value}|${notes}`;
                          }

                          setStomatognaticConditions([
                            ...stomatognaticConditions,
                            {
                              type,
                              notes,
                            },
                          ]);

                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = "";
                          if (customInput) customInput.remove();
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>

                  {/* Lingual Frenulum */}
                  <div className="mt-6 pt-4 border-t border-zinc-200">
                    <label
                      htmlFor="lingual-frenulum"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Lingual Frenulum
                    </label>
                    <select
                      id="lingual-frenulum"
                      value={lingualFrenulum}
                      onChange={(e) => setLingualFrenulum(e.target.value)}
                      className="w-full text-sm p-2 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>
                        Select frenulum type
                      </option>
                      <option value="Normal">Normal</option>
                      <option value="Short">Short</option>
                      <option value="Ankylosing">Ankylosing</option>
                      <option value="Short posterior">Short posterior</option>
                    </select>
                  </div>

                  {/* Dental Prosthesis Information */}
                  <div className="mt-6 pt-4 border-t border-zinc-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Dental Prosthesis Information
                    </h5>

                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      {/* Labels row */}
                      <div className="flex w-full mb-1">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Has Prosthesis</label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Location</label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Type</label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Notes</label>
                        </div>
                      </div>
                      
                      {/* Inputs row */}
                      <div className="flex w-full items-start gap-2">
                        {/* Has Prosthesis */}
                        <div className="flex-1">
                          <select
                            value={hasProsthesis}
                            onChange={(e) => {
                              setHasProsthesis(e.target.value);
                              if (e.target.value !== "Yes") {
                                setProsthesisLocation("");
                                setProsthesisType("");
                              }
                            }}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Location */}
                        <div className="flex-1">
                          <select
                            value={prosthesisLocation}
                            onChange={(e) => setProsthesisLocation(e.target.value)}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            disabled={hasProsthesis !== "Yes"}
                          >
                            <option value="">Select</option>
                            <option value="Upper">Upper</option>
                            <option value="Lower">Lower</option>
                            <option value="Both">Both</option>
                          </select>
                        </div>

                        {/* Type */}
                        <div className="flex-1">
                          <select
                            value={prosthesisType}
                            onChange={(e) => setProsthesisType(e.target.value)}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            disabled={hasProsthesis !== "Yes"}
                          >
                            <option value="">Select</option>
                            <option value="Total">Total</option>
                            <option value="Partial">Partial</option>
                          </select>
                        </div>

                        {/* Notes */}
                        <div className="flex-1">
                          <textarea
                            value={prosthesisNotes}
                            onChange={(e) => setProsthesisNotes(e.target.value)}
                            placeholder="Additional notes"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dental Bridges Information */}
                  <div className="mt-6 pt-4 border-t border-zinc-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Dental BRIDGES
                    </h5>

                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      {/* Labels row */}
                      <div className="flex w-full mb-1">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Has Bridge</label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Location</label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Type</label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Notes</label>
                        </div>
                      </div>
                      
                      {/* Inputs row */}
                      <div className="flex w-full items-start gap-2">
                        {/* Has Bridge */}
                        <div className="flex-1">
                          <select
                            value={hasBridge}
                            onChange={(e) => {
                              setHasBridge(e.target.value);
                              if (e.target.value !== "Yes") {
                                setBridgeLocation("");
                                setBridgeType("");
                              }
                            }}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Location */}
                        <div className="flex-1">
                          <select
                            value={bridgeLocation}
                            onChange={(e) => setBridgeLocation(e.target.value)}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            disabled={hasBridge !== "Yes"}
                          >
                            <option value="">Select</option>
                            <option value="Upper">Upper</option>
                            <option value="Lower">Lower</option>
                            <option value="Both">Both</option>
                          </select>
                        </div>

                        {/* Type */}
                        <div className="flex-1">
                          <select
                            value={bridgeType}
                            onChange={(e) => setBridgeType(e.target.value)}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            disabled={hasBridge !== "Yes"}
                          >
                            <option value="">Select</option>
                            <option value="Total">Total</option>
                            <option value="Partial">Partial</option>
                          </select>
                        </div>

                        {/* Notes */}
                        <div className="flex-1">
                          <textarea
                            value={bridgeNotes}
                            onChange={(e) => setBridgeNotes(e.target.value)}
                            placeholder="Additional notes"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mandibular Deviation */}
                  <div className="mt-6 pt-4 border-t border-zinc-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      MANDIBULAR DEVIATION
                    </h5>

                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      {/* Labels row */}
                      <div className="flex w-full mb-1">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Deviation Direction</label>
                        </div>
                        <div className="flex-2">
                          <label className="block text-xs text-gray-500">Notes</label>
                        </div>
                      </div>
                      
                      {/* Inputs row */}
                      <div className="flex w-full items-start gap-2">
                        {/* Deviation Direction */}
                        <div className="flex-1">
                          <select
                            value={mandibularDeviation}
                            onChange={(e) => setMandibularDeviation(e.target.value)}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select direction</option>
                            <option value="Left">Left</option>
                            <option value="Right">Right</option>
                            <option value="None">None</option>
                          </select>
                        </div>

                        {/* Notes */}
                        <div className="flex-2">
                          <textarea
                            value={mandibularDeviationNotes}
                            onChange={(e) => setMandibularDeviationNotes(e.target.value)}
                            placeholder="Additional notes about mandibular deviation"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Open palate */}
                  <div className="mt-6 pt-4 border-t border-zinc-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Open palate
                    </h5>

                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      {/* Labels row */}
                      <div className="flex w-full mb-1">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Has Open Palate</label>
                        </div>
                        <div className="flex-2">
                          <label className="block text-xs text-gray-500">Notes</label>
                        </div>
                      </div>
                      
                      {/* Inputs row */}
                      <div className="flex w-full items-start gap-2">
                        {/* Has Open Palate */}
                        <div className="flex-1">
                          <select
                            value={openPalate}
                            onChange={(e) => setOpenPalate(e.target.value)}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Notes */}
                        <div className="flex-2">
                          <textarea
                            value={openPalateNotes}
                            onChange={(e) => setOpenPalateNotes(e.target.value)}
                            placeholder="Additional notes about open palate"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OGIVAL PALATE */}
                  <div className="mt-6 pt-4 border-t border-zinc-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      OGIVAL PALATE
                    </h5>

                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      {/* Labels row */}
                      <div className="flex w-full mb-1">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Has Ogival Palate</label>
                        </div>
                        <div className="flex-2">
                          <label className="block text-xs text-gray-500">Notes</label>
                        </div>
                      </div>
                      
                      {/* Inputs row */}
                      <div className="flex w-full items-start gap-2">
                        {/* Has Ogival Palate */}
                        <div className="flex-1">
                          <select
                            value={ogivalPalate}
                            onChange={(e) => setOgivalPalate(e.target.value)}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Notes */}
                        <div className="flex-2">
                          <textarea
                            value={ogivalPalateNotes}
                            onChange={(e) => setOgivalPalateNotes(e.target.value)}
                            placeholder="Additional notes about ogival palate"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DENTAL ARCHES */}
                  <div className="mt-6 pt-4 border-t border-zinc-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      DENTAL ARCHES
                    </h5>

                    {/* Existing dental arches */}
                    {dentalArches.map((arch, index) => (
                      <div
                        key={index}
                        className="mb-2 p-3 border border-gray-200 rounded-lg bg-white"
                      >
                        {/* Labels row */}
                        <div className="flex w-full mb-1">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500">Location</label>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500">Shape</label>
                          </div>
                          <div className="w-8"></div>
                        </div>
                        
                        {/* Inputs row */}
                        <div className="flex w-full items-start gap-2">
                          {/* Location */}
                          <div className="flex-1">
                            <select
                              value={arch.location}
                              onChange={(e) => {
                                const updatedArches = [...dentalArches];
                                updatedArches[index].location = e.target.value;
                                setDentalArches(updatedArches);
                              }}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select location</option>
                              <option value="congruent UPPER">congruent UPPER</option>
                              <option value="congruent LOWER">congruent LOWER</option>
                              <option value="UPPER RIGHT">UPPER RIGHT</option>
                              <option value="UPPER LEFT">UPPER LEFT</option>
                              <option value="LOWER RIGHT">LOWER RIGHT</option>
                              <option value="LOWER LEFT">LOWER LEFT</option>
                            </select>
                          </div>

                          {/* Shape */}
                          <div className="flex-1">
                            <select
                              value={arch.shape}
                              onChange={(e) => {
                                const updatedArches = [...dentalArches];
                                updatedArches[index].shape = e.target.value;
                                setDentalArches(updatedArches);
                              }}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select shape</option>
                              <option value="∩">∩ (normal)</option>
                              <option value="П">П</option>
                              <option value="Ω">Ω</option>
                              <option value="▲">▲</option>
                            </select>
                          </div>

                          {/* Remove Button */}
                          <div className="w-8 flex justify-center">
                            <button
                              onClick={() => {
                                const updatedArches = [...dentalArches];
                                updatedArches.splice(index, 1);
                                setDentalArches(updatedArches);
                              }}
                              className="p-2 text-red-500 hover:text-red-700"
                              aria-label="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add new dental arch */}
                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      {/* Labels row */}
                      <div className="flex w-full mb-1">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Location</label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Shape</label>
                        </div>
                        <div className="w-8"></div>
                      </div>
                      
                      {/* Inputs row */}
                      <div className="flex w-full items-start gap-2">
                        {/* Location */}
                        <div className="flex-1">
                          <select
                            id="new-arch-location"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            defaultValue=""
                          >
                            <option value="" disabled>Select location</option>
                            <option value="congruent UPPER">congruent UPPER</option>
                            <option value="congruent LOWER">congruent LOWER</option>
                            <option value="UPPER RIGHT">UPPER RIGHT</option>
                            <option value="UPPER LEFT">UPPER LEFT</option>
                            <option value="LOWER RIGHT">LOWER RIGHT</option>
                            <option value="LOWER LEFT">LOWER LEFT</option>
                          </select>
                        </div>

                        {/* Shape */}
                        <div className="flex-1">
                          <select
                            id="new-arch-shape"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            defaultValue=""
                          >
                            <option value="" disabled>Select shape</option>
                            <option value="∩">∩ (normal)</option>
                            <option value="П">П</option>
                            <option value="Ω">Ω</option>
                            <option value="▲">▲</option>
                          </select>
                        </div>

                        {/* Add Button */}
                        <div className="w-8 flex justify-center">
                          <button
                            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            onClick={() => {
                              const locationSelect = document.getElementById("new-arch-location") as HTMLSelectElement;
                              const shapeSelect = document.getElementById("new-arch-shape") as HTMLSelectElement;

                              if (locationSelect && locationSelect.value && shapeSelect && shapeSelect.value) {
                                setDentalArches([
                                  ...dentalArches,
                                  {
                                    location: locationSelect.value,
                                    shape: shapeSelect.value,
                                  },
                                ]);

                                // Reset inputs
                                locationSelect.selectedIndex = 0;
                                shapeSelect.selectedIndex = 0;
                              }
                            }}
                            aria-label="Add Arch"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edentulous Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  EDENTULOUS
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Permanent Teeth Chart (FDI)
                  </h5>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Select status for each tooth by clicking on its number
                    </p>

                    {/* Legend for tooth status codes */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-100 border border-green-500 mr-1"></div>
                        <span>H: Healthy</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-100 border border-red-500 mr-1"></div>
                        <span>M: Missing</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-100 border border-blue-500 mr-1"></div>
                        <span>F: Filled</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-100 border border-yellow-500 mr-1"></div>
                        <span>D: Decayed</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-purple-100 border border-purple-500 mr-1"></div>
                        <span>R: Root canal</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-100 border border-gray-500 mr-1"></div>
                        <span>I: Implant</span>
                      </div>
                    </div>

                    {/* Top row of teeth (18-28) */}
                    <div className="flex justify-center mb-6">
                      <div className="grid grid-cols-8 gap-2">
                        {[18, 17, 16, 15, 14, 13, 12, 11].map((tooth) => (
                          <div key={tooth} className="text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const statusOptions = [
                                  "H",
                                  "M",
                                  "F",
                                  "D",
                                  "R",
                                  "I",
                                  "",
                                ];
                                const currentStatus =
                                  toothStatus[tooth.toString()] || "";
                                const currentIndex =
                                  statusOptions.indexOf(currentStatus);
                                const nextIndex =
                                  (currentIndex + 1) % statusOptions.length;
                                const newStatus = statusOptions[nextIndex];

                                setToothStatus({
                                  ...toothStatus,
                                  [tooth.toString()]: newStatus,
                                });
                              }}
                              className={`w-10 h-10 border ${
                                !toothStatus[tooth.toString()]
                                  ? "border-gray-300 bg-white"
                                  : toothStatus[tooth.toString()] === "H"
                                    ? "border-green-500 bg-green-100"
                                    : toothStatus[tooth.toString()] === "M"
                                      ? "border-red-500 bg-red-100"
                                      : toothStatus[tooth.toString()] === "F"
                                        ? "border-blue-500 bg-blue-100"
                                        : toothStatus[tooth.toString()] === "D"
                                          ? "border-yellow-500 bg-yellow-100"
                                          : toothStatus[tooth.toString()] ===
                                              "R"
                                            ? "border-purple-500 bg-purple-100"
                                            : "border-gray-500 bg-gray-100"
                              } rounded-md text-sm font-medium`}
                            >
                              {tooth}
                              {toothStatus[tooth.toString()] && (
                                <span className="block text-xs">
                                  {toothStatus[tooth.toString()]}
                                </span>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        {[21, 22, 23, 24, 25, 26, 27, 28].map((tooth) => (
                          <div key={tooth} className="text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const statusOptions = [
                                  "H",
                                  "M",
                                  "F",
                                  "D",
                                  "R",
                                  "I",
                                  "",
                                ];
                                const currentStatus =
                                  toothStatus[tooth.toString()] || "";
                                const currentIndex =
                                  statusOptions.indexOf(currentStatus);
                                const nextIndex =
                                  (currentIndex + 1) % statusOptions.length;
                                const newStatus = statusOptions[nextIndex];

                                setToothStatus({
                                  ...toothStatus,
                                  [tooth.toString()]: newStatus,
                                });
                              }}
                              className={`w-10 h-10 border ${
                                !toothStatus[tooth.toString()]
                                  ? "border-gray-300 bg-white"
                                  : toothStatus[tooth.toString()] === "H"
                                    ? "border-green-500 bg-green-100"
                                    : toothStatus[tooth.toString()] === "M"
                                      ? "border-red-500 bg-red-100"
                                      : toothStatus[tooth.toString()] === "F"
                                        ? "border-blue-500 bg-blue-100"
                                        : toothStatus[tooth.toString()] === "D"
                                          ? "border-yellow-500 bg-yellow-100"
                                          : toothStatus[tooth.toString()] ===
                                              "R"
                                            ? "border-purple-500 bg-purple-100"
                                            : "border-gray-500 bg-gray-100"
                              } rounded-md text-sm font-medium`}
                            >
                              {tooth}
                              {toothStatus[tooth.toString()] && (
                                <span className="block text-xs">
                                  {toothStatus[tooth.toString()]}
                                </span>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom row of teeth (48-38) */}
                    <div className="flex justify-center">
                      <div className="grid grid-cols-8 gap-2">
                        {[48, 47, 46, 45, 44, 43, 42, 41].map((tooth) => (
                          <div key={tooth} className="text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const statusOptions = [
                                  "H",
                                  "M",
                                  "F",
                                  "D",
                                  "R",
                                  "I",
                                  "",
                                ];
                                const currentStatus =
                                  toothStatus[tooth.toString()] || "";
                                const currentIndex =
                                  statusOptions.indexOf(currentStatus);
                                const nextIndex =
                                  (currentIndex + 1) % statusOptions.length;
                                const newStatus = statusOptions[nextIndex];

                                setToothStatus({
                                  ...toothStatus,
                                  [tooth.toString()]: newStatus,
                                });
                              }}
                              className={`w-10 h-10 border ${
                                !toothStatus[tooth.toString()]
                                  ? "border-gray-300 bg-white"
                                  : toothStatus[tooth.toString()] === "H"
                                    ? "border-green-500 bg-green-100"
                                    : toothStatus[tooth.toString()] === "M"
                                      ? "border-red-500 bg-red-100"
                                      : toothStatus[tooth.toString()] === "F"
                                        ? "border-blue-500 bg-blue-100"
                                        : toothStatus[tooth.toString()] === "D"
                                          ? "border-yellow-500 bg-yellow-100"
                                          : toothStatus[tooth.toString()] ===
                                              "R"
                                            ? "border-purple-500 bg-purple-100"
                                            : "border-gray-500 bg-gray-100"
                              } rounded-md text-sm font-medium`}
                            >
                              {tooth}
                              {toothStatus[tooth.toString()] && (
                                <span className="block text-xs">
                                  {toothStatus[tooth.toString()]}
                                </span>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        {[31, 32, 33, 34, 35, 36, 37, 38].map((tooth) => (
                          <div key={tooth} className="text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const statusOptions = [
                                  "H",
                                  "M",
                                  "F",
                                  "D",
                                  "R",
                                  "I",
                                  "",
                                ];
                                const currentStatus =
                                  toothStatus[tooth.toString()] || "";
                                const currentIndex =
                                  statusOptions.indexOf(currentStatus);
                                const nextIndex =
                                  (currentIndex + 1) % statusOptions.length;
                                const newStatus = statusOptions[nextIndex];

                                setToothStatus({
                                  ...toothStatus,
                                  [tooth.toString()]: newStatus,
                                });
                              }}
                              className={`w-10 h-10 border ${
                                !toothStatus[tooth.toString()]
                                  ? "border-gray-300 bg-white"
                                  : toothStatus[tooth.toString()] === "H"
                                    ? "border-green-500 bg-green-100"
                                    : toothStatus[tooth.toString()] === "M"
                                      ? "border-red-500 bg-red-100"
                                      : toothStatus[tooth.toString()] === "F"
                                        ? "border-blue-500 bg-blue-100"
                                        : toothStatus[tooth.toString()] === "D"
                                          ? "border-yellow-500 bg-yellow-100"
                                          : toothStatus[tooth.toString()] ===
                                              "R"
                                            ? "border-purple-500 bg-purple-100"
                                            : "border-gray-500 bg-gray-100"
                              } rounded-md text-sm font-medium`}
                            >
                              {tooth}
                              {toothStatus[tooth.toString()] && (
                                <span className="block text-xs">
                                  {toothStatus[tooth.toString()]}
                                </span>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* ORIENTATION OF TEETH IN DIFFERENT SECTORS Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  ORIENTATION OF TEETH IN DIFFERENT SECTORS
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Dental Arch Orientation by Sector
                  </h5>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Select orientation for each sector by clicking on the
                      corresponding cell
                    </p>

                    {/* Legend for orientation options */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-100 border border-blue-500 mr-1 flex items-center justify-center text-blue-700 font-bold">
                          N
                        </div>
                        <span>Normal</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-100 border border-yellow-500 mr-1 flex items-center justify-center text-yellow-700 font-bold">
                          V
                        </div>
                        <span>Vestibular</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-100 border border-green-500 mr-1 flex items-center justify-center text-green-700 font-bold">
                          P
                        </div>
                        <span>Palatine</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-100 border border-red-500 mr-1 flex items-center justify-center text-red-700 font-bold">
                          L
                        </div>
                        <span>Lingual</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-purple-100 border border-purple-500 mr-1 flex items-center justify-center text-purple-700 font-bold">
                          M
                        </div>
                        <span>Mesial</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-orange-100 border border-orange-500 mr-1 flex items-center justify-center text-orange-700 font-bold">
                          D
                        </div>
                        <span>Distal</span>
                      </div>
                    </div>

                    {/* Upper Arch */}
                    <div className="mb-4">
                      <h6 className="text-xs font-medium text-gray-600 mb-2">
                        Upper Arch
                      </h6>
                      <div className="flex justify-center">
                        <div className="grid grid-cols-3 gap-2 w-full">
                          {[
                            {
                              id: "upper-posterior-right",
                              label: "Posterior Right (17-18)",
                            },
                            {
                              id: "upper-medial-right",
                              label: "Medial Right (14-16)",
                            },
                            {
                              id: "upper-anterior-right",
                              label: "Anterior Right (11-13)",
                            },
                            {
                              id: "upper-anterior-left",
                              label: "Anterior Left (21-23)",
                            },
                            {
                              id: "upper-medial-left",
                              label: "Medial Left (24-26)",
                            },
                            {
                              id: "upper-posterior-left",
                              label: "Posterior Left (27-28)",
                            },
                          ].map((sector, index) => (
                            <div
                              key={sector.id}
                              className={`${index >= 3 ? "col-start-" + (index - 2) : ""}`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const orientationOptions = [
                                    "N",
                                    "V",
                                    "P",
                                    "L",
                                    "M",
                                    "D",
                                    "",
                                  ];
                                  const currentOrientation =
                                    teethOrientation[sector.id] || "";
                                  const currentIndex =
                                    orientationOptions.indexOf(
                                      currentOrientation,
                                    );
                                  const nextIndex =
                                    (currentIndex + 1) %
                                    orientationOptions.length;
                                  const newOrientation =
                                    orientationOptions[nextIndex];

                                  setTeethOrientation({
                                    ...teethOrientation,
                                    [sector.id]: newOrientation,
                                  });
                                }}
                                className={`w-full h-12 border flex flex-col items-center justify-center ${
                                  !teethOrientation[sector.id]
                                    ? "border-gray-300 bg-white"
                                    : teethOrientation[sector.id] === "N"
                                      ? "border-blue-500 bg-blue-100"
                                      : teethOrientation[sector.id] === "V"
                                        ? "border-yellow-500 bg-yellow-100"
                                        : teethOrientation[sector.id] === "P"
                                          ? "border-green-500 bg-green-100"
                                          : teethOrientation[sector.id] === "L"
                                            ? "border-red-500 bg-red-100"
                                            : teethOrientation[sector.id] ===
                                                "M"
                                              ? "border-purple-500 bg-purple-100"
                                              : "border-orange-500 bg-orange-100"
                                } rounded-md text-xs font-medium`}
                              >
                                <span className="text-gray-600">
                                  {sector.label}
                                </span>
                                {teethOrientation[sector.id] && (
                                  <span className="text-sm font-bold mt-1">
                                    {teethOrientation[sector.id]}
                                  </span>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Lower Arch */}
                    <div>
                      <h6 className="text-xs font-medium text-gray-600 mb-2">
                        Lower Arch
                      </h6>
                      <div className="flex justify-center">
                        <div className="grid grid-cols-3 gap-2 w-full">
                          {[
                            {
                              id: "lower-posterior-right",
                              label: "Posterior Right (47-48)",
                            },
                            {
                              id: "lower-medial-right",
                              label: "Medial Right (44-46)",
                            },
                            {
                              id: "lower-anterior-right",
                              label: "Anterior Right (41-43)",
                            },
                            {
                              id: "lower-anterior-left",
                              label: "Anterior Left (31-33)",
                            },
                            {
                              id: "lower-medial-left",
                              label: "Medial Left (34-36)",
                            },
                            {
                              id: "lower-posterior-left",
                              label: "Posterior Left (37-38)",
                            },
                          ].map((sector, index) => (
                            <div
                              key={sector.id}
                              className={`${index >= 3 ? "col-start-" + (index - 2) : ""}`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const orientationOptions = [
                                    "N",
                                    "V",
                                    "P",
                                    "L",
                                    "M",
                                    "D",
                                    "",
                                  ];
                                  const currentOrientation =
                                    teethOrientation[sector.id] || "";
                                  const currentIndex =
                                    orientationOptions.indexOf(
                                      currentOrientation,
                                    );
                                  const nextIndex =
                                    (currentIndex + 1) %
                                    orientationOptions.length;
                                  const newOrientation =
                                    orientationOptions[nextIndex];

                                  setTeethOrientation({
                                    ...teethOrientation,
                                    [sector.id]: newOrientation,
                                  });
                                }}
                                className={`w-full h-12 border flex flex-col items-center justify-center ${
                                  !teethOrientation[sector.id]
                                    ? "border-gray-300 bg-white"
                                    : teethOrientation[sector.id] === "N"
                                      ? "border-blue-500 bg-blue-100"
                                      : teethOrientation[sector.id] === "V"
                                        ? "border-yellow-500 bg-yellow-100"
                                        : teethOrientation[sector.id] === "P"
                                          ? "border-green-500 bg-green-100"
                                          : teethOrientation[sector.id] === "L"
                                            ? "border-red-500 bg-red-100"
                                            : teethOrientation[sector.id] ===
                                                "M"
                                              ? "border-purple-500 bg-purple-100"
                                              : "border-orange-500 bg-orange-100"
                                } rounded-md text-xs font-medium`}
                              >
                                <span className="text-gray-600">
                                  {sector.label}
                                </span>
                                {teethOrientation[sector.id] && (
                                  <span className="text-sm font-bold mt-1">
                                    {teethOrientation[sector.id]}
                                  </span>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* ORTHODONTIC HISTORY Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  ORTHODONTIC HISTORY
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Orthodontic Treatment History
                  </h5>

                  {/* Existing orthodontic treatments */}
                  {orthodonticHistory.map((treatment, index) => (
                    <div
                      key={index}
                      className="mb-2 p-3 border border-gray-200 rounded-lg bg-white"
                    >
                      {/* Labels row */}
                      <div className="flex w-full mb-1">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Treatment Type</label>
                        </div>
                        <div className="flex-2">
                          <label className="block text-xs text-gray-500">Notes</label>
                        </div>
                        <div className="w-8"></div>
                      </div>
                      
                      {/* Inputs row */}
                      <div className="flex w-full items-start gap-2">
                        {/* Treatment Type */}
                        <div className="flex-1">
                          <select
                            value={treatment.type}
                            onChange={(e) => {
                              const updatedHistory = [...orthodonticHistory];
                              updatedHistory[index].type = e.target.value;
                              setOrthodonticHistory(updatedHistory);
                            }}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select treatment</option>
                            <option value="Fixed braces">Fixed braces</option>
                            <option value="Removable braces">Removable braces</option>
                            <option value="Palatal expander">Palatal expander</option>
                            <option value="ALF">ALF</option>
                          </select>
                        </div>

                        {/* Notes */}
                        <div className="flex-2">
                          <textarea
                            value={treatment.notes}
                            onChange={(e) => {
                              const updatedHistory = [...orthodonticHistory];
                              updatedHistory[index].notes = e.target.value;
                              setOrthodonticHistory(updatedHistory);
                            }}
                            placeholder="Duration, outcomes, complications, etc."
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                        </div>

                        {/* Remove Button */}
                        <div className="w-8 flex justify-center">
                          <button
                            onClick={() => {
                              const updatedHistory = [...orthodonticHistory];
                              updatedHistory.splice(index, 1);
                              setOrthodonticHistory(updatedHistory);
                            }}
                            className="p-2 text-red-500 hover:text-red-700"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add new orthodontic treatment */}
                  <div className="p-3 border border-gray-200 rounded-lg bg-white">
                    {/* Labels row */}
                    <div className="flex w-full mb-1">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500">Treatment Type</label>
                      </div>
                      <div className="flex-2">
                        <label className="block text-xs text-gray-500">Notes</label>
                      </div>
                      <div className="w-8"></div>
                    </div>
                    
                    {/* Inputs row */}
                    <div className="flex w-full items-start gap-2">
                      {/* Treatment Type */}
                      <div className="flex-1">
                        <select
                          id="new-orthodontic-type"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          defaultValue=""
                        >
                          <option value="" disabled>Select treatment</option>
                          <option value="Fixed braces">Fixed braces</option>
                          <option value="Removable braces">Removable braces</option>
                          <option value="Palatal expander">Palatal expander</option>
                          <option value="ALF">ALF</option>
                        </select>
                      </div>

                      {/* Notes */}
                      <div className="flex-2">
                        <textarea
                          id="new-orthodontic-notes"
                          placeholder="Duration, outcomes, complications, etc."
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          rows={2}
                        />
                      </div>

                      {/* Add Button */}
                      <div className="w-8 flex justify-center">
                        <button
                          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                          onClick={() => {
                            const typeSelect = document.getElementById("new-orthodontic-type") as HTMLSelectElement;
                            const notesInput = document.getElementById("new-orthodontic-notes") as HTMLTextAreaElement;

                            if (typeSelect && typeSelect.value) {
                              setOrthodonticHistory([
                                ...orthodonticHistory,
                                {
                                  type: typeSelect.value,
                                  notes: notesInput ? notesInput.value : "",
                                },
                              ]);

                              // Reset inputs
                              typeSelect.selectedIndex = 0;
                              if (notesInput) notesInput.value = "";
                            }
                          }}
                          aria-label="Add Treatment"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ENDOCRINE SYSTEM Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  ENDOCRINE SYSTEM
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Endocrine System Conditions
                  </h5>

                  {/* Existing Endocrine System Entries */}
                  {endocrineSystemEntries.map(
                    (entry: EndocrineSystem, index: number) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        {entry.type === "Other" ? (
                          <div className="flex-1 flex gap-1">
                            <select
                              value={entry.type}
                              onChange={(e) => {
                                const updatedEntries = [
                                  ...endocrineSystemEntries,
                                ];
                                updatedEntries[index].type = e.target.value;
                                setEndocrineSystemEntries(updatedEntries);
                              }}
                              className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select condition</option>
                              <option value="Diabetes Mellitus Type 1">
                                Diabetes Mellitus Type 1
                              </option>
                              <option value="Diabetes Mellitus Type 2">
                                Diabetes Mellitus Type 2
                              </option>
                              <option value="Hypothyroidism">
                                Hypothyroidism
                              </option>
                              <option value="Hyperthyroidism">
                                Hyperthyroidism
                              </option>
                              <option value="Adrenal Insufficiency">
                                Adrenal Insufficiency
                              </option>
                              <option value="Cushing's Syndrome">
                                Cushing's Syndrome
                              </option>
                              <option value="Polycystic Ovary Syndrome">
                                Polycystic Ovary Syndrome
                              </option>
                              <option value="Hypopituitarism">
                                Hypopituitarism
                              </option>
                              <option value="Hormone Therapy">
                                Hormone Therapy
                              </option>
                              <option value="Other">Other</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Specify condition"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              value={entry.notes.split("|")[0] || ""}
                              onChange={(e) => {
                                const updatedEntries = [
                                  ...endocrineSystemEntries,
                                ];
                                const parts = entry.notes.split("|");
                                parts[0] = e.target.value;
                                updatedEntries[index].notes = parts.join("|");
                                setEndocrineSystemEntries(updatedEntries);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex-1">
                            <select
                              value={entry.type}
                              onChange={(e) => {
                                const updatedEntries = [
                                  ...endocrineSystemEntries,
                                ];
                                updatedEntries[index].type = e.target.value;
                                setEndocrineSystemEntries(updatedEntries);
                              }}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select condition</option>
                              <option value="Diabetes Mellitus Type 1">
                                Diabetes Mellitus Type 1
                              </option>
                              <option value="Diabetes Mellitus Type 2">
                                Diabetes Mellitus Type 2
                              </option>
                              <option value="Hypothyroidism">
                                Hypothyroidism
                              </option>
                              <option value="Hyperthyroidism">
                                Hyperthyroidism
                              </option>
                              <option value="Adrenal Insufficiency">
                                Adrenal Insufficiency
                              </option>
                              <option value="Cushing's Syndrome">
                                Cushing's Syndrome
                              </option>
                              <option value="Polycystic Ovary Syndrome">
                                Polycystic Ovary Syndrome
                              </option>
                              <option value="Hypopituitarism">
                                Hypopituitarism
                              </option>
                              <option value="Hormone Therapy">
                                Hormone Therapy
                              </option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        )}

                        <div className="flex-1">
                          <input
                            type="text"
                            value={
                              entry.type === "Other"
                                ? entry.notes.split("|")[1] || ""
                                : entry.notes
                            }
                            onChange={(e) => {
                              const updatedEntries = [
                                ...endocrineSystemEntries,
                              ];
                              if (entry.type === "Other") {
                                const parts = entry.notes.split("|");
                                parts[1] = e.target.value;
                                updatedEntries[index].notes = parts.join("|");
                              } else {
                                updatedEntries[index].notes = e.target.value;
                              }
                              setEndocrineSystemEntries(updatedEntries);
                            }}
                            placeholder="Notes (medications, treatment, effects, etc.)"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const updatedEntries = [...endocrineSystemEntries];
                            updatedEntries.splice(index, 1);
                            setEndocrineSystemEntries(updatedEntries);
                          }}
                          className="p-2 text-red-500 hover:text-red-700"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ),
                  )}

                  {/* Add new Endocrine System Entry */}
                  <div
                    className="flex items-center gap-2 mb-2"
                    id="new-endocrine-system-container"
                  >
                    <select
                      id="endocrine-system-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById(
                          "new-endocrine-system-container",
                        );
                        const customInput = document.getElementById(
                          "endocrine-system-custom",
                        );

                        if (
                          e.target.value === "Other" &&
                          container &&
                          !customInput
                        ) {
                          // Insert custom input after select
                          const customField = document.createElement("input");
                          customField.id = "endocrine-system-custom";
                          customField.type = "text";
                          customField.placeholder = "Specify condition";
                          customField.className =
                            "flex-1 text-sm p-2 border border-gray-300 rounded-md";
                          container.insertBefore(
                            customField,
                            document.getElementById("endocrine-system-notes"),
                          );
                        } else if (e.target.value !== "Other" && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select condition
                      </option>
                      <option value="Diabetes Mellitus Type 1">
                        Diabetes Mellitus Type 1
                      </option>
                      <option value="Diabetes Mellitus Type 2">
                        Diabetes Mellitus Type 2
                      </option>
                      <option value="Hypothyroidism">Hypothyroidism</option>
                      <option value="Hyperthyroidism">Hyperthyroidism</option>
                      <option value="Adrenal Insufficiency">
                        Adrenal Insufficiency
                      </option>
                      <option value="Cushing's Syndrome">
                        Cushing's Syndrome
                      </option>
                      <option value="Polycystic Ovary Syndrome">
                        Polycystic Ovary Syndrome
                      </option>
                      <option value="Hypopituitarism">Hypopituitarism</option>
                      <option value="Hormone Therapy">Hormone Therapy</option>
                      <option value="Other">Other</option>
                    </select>

                    <input
                      type="text"
                      id="endocrine-system-notes"
                      placeholder="Notes (medications, treatment, effects, etc.)"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                    />

                    <button
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      onClick={() => {
                        const typeSelect = document.getElementById(
                          "endocrine-system-type",
                        ) as HTMLSelectElement;
                        const notesInput = document.getElementById(
                          "endocrine-system-notes",
                        ) as HTMLInputElement;
                        const customInput = document.getElementById(
                          "endocrine-system-custom",
                        ) as HTMLInputElement;

                        if (typeSelect && typeSelect.value) {
                          let type = typeSelect.value;
                          let notes = notesInput ? notesInput.value : "";

                          // If "Other" is selected, use the custom input value
                          if (
                            type === "Other" &&
                            customInput &&
                            customInput.value
                          ) {
                            // Store the custom value in the notes field with a separator
                            notes = `${customInput.value}|${notes}`;
                          }

                          setEndocrineSystemEntries([
                            ...endocrineSystemEntries,
                            {
                              type,
                              notes,
                            },
                          ]);

                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = "";
                          if (customInput) customInput.remove();
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* DISEASES/DISORDERS OF THE NERVOUS SYSTEM Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  DISEASES/DISORDERS OF THE NERVOUS SYSTEM
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Neurological Disorders
                  </h5>

                  {/* Existing Nervous System Disorders */}
                  {nervousSystemDisorders.map(
                    (disorder: NervousSystemDisorder, index: number) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        {disorder.type === "Other" ? (
                          <div className="flex-1 flex gap-1">
                            <select
                              value={disorder.type}
                              onChange={(e) => {
                                const updatedDisorders = [
                                  ...nervousSystemDisorders,
                                ];
                                updatedDisorders[index].type = e.target.value;
                                setNervousSystemDisorders(updatedDisorders);
                              }}
                              className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select disorder</option>
                              <option value="Stroke/CVA">Stroke/CVA</option>
                              <option value="Migraine">Migraine</option>
                              <option value="Epilepsy">Epilepsy</option>
                              <option value="Multiple Sclerosis">
                                Multiple Sclerosis
                              </option>
                              <option value="Parkinson's Disease">
                                Parkinson's Disease
                              </option>
                              <option value="Alzheimer's Disease">
                                Alzheimer's Disease
                              </option>
                              <option value="Peripheral Neuropathy">
                                Peripheral Neuropathy
                              </option>
                              <option value="Bell's Palsy">Bell's Palsy</option>
                              <option value="Essential Tremor">
                                Essential Tremor
                              </option>
                              <option value="Traumatic Brain Injury">
                                Traumatic Brain Injury
                              </option>
                              <option value="Other">Other</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Specify disorder"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              value={disorder.notes.split("|")[0] || ""}
                              onChange={(e) => {
                                const updatedDisorders = [
                                  ...nervousSystemDisorders,
                                ];
                                const parts = disorder.notes.split("|");
                                parts[0] = e.target.value;
                                updatedDisorders[index].notes = parts.join("|");
                                setNervousSystemDisorders(updatedDisorders);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex-1">
                            <select
                              value={disorder.type}
                              onChange={(e) => {
                                const updatedDisorders = [
                                  ...nervousSystemDisorders,
                                ];
                                updatedDisorders[index].type = e.target.value;
                                setNervousSystemDisorders(updatedDisorders);
                              }}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select disorder</option>
                              <option value="Stroke/CVA">Stroke/CVA</option>
                              <option value="Migraine">Migraine</option>
                              <option value="Epilepsy">Epilepsy</option>
                              <option value="Multiple Sclerosis">
                                Multiple Sclerosis
                              </option>
                              <option value="Parkinson's Disease">
                                Parkinson's Disease
                              </option>
                              <option value="Alzheimer's Disease">
                                Alzheimer's Disease
                              </option>
                              <option value="Peripheral Neuropathy">
                                Peripheral Neuropathy
                              </option>
                              <option value="Bell's Palsy">Bell's Palsy</option>
                              <option value="Essential Tremor">
                                Essential Tremor
                              </option>
                              <option value="Traumatic Brain Injury">
                                Traumatic Brain Injury
                              </option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        )}

                        <div className="flex-1">
                          <input
                            type="text"
                            value={
                              disorder.type === "Other"
                                ? disorder.notes.split("|")[1] || ""
                                : disorder.notes
                            }
                            onChange={(e) => {
                              const updatedDisorders = [
                                ...nervousSystemDisorders,
                              ];
                              if (disorder.type === "Other") {
                                const parts = disorder.notes.split("|");
                                parts[1] = e.target.value;
                                updatedDisorders[index].notes = parts.join("|");
                              } else {
                                updatedDisorders[index].notes = e.target.value;
                              }
                              setNervousSystemDisorders(updatedDisorders);
                            }}
                            placeholder="Notes (symptoms, medications, treatment, etc.)"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const updatedDisorders = [
                              ...nervousSystemDisorders,
                            ];
                            updatedDisorders.splice(index, 1);
                            setNervousSystemDisorders(updatedDisorders);
                          }}
                          className="p-2 text-red-500 hover:text-red-700"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ),
                  )}

                  {/* Add new Nervous System Disorder */}
                  <div
                    className="flex items-center gap-2 mb-2"
                    id="new-nervous-system-container"
                  >
                    <select
                      id="nervous-system-type"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                      onChange={(e) => {
                        const container = document.getElementById(
                          "new-nervous-system-container",
                        );
                        const customInput = document.getElementById(
                          "nervous-system-custom",
                        );

                        if (
                          e.target.value === "Other" &&
                          container &&
                          !customInput
                        ) {
                          // Insert custom input after select
                          const customField = document.createElement("input");
                          customField.id = "nervous-system-custom";
                          customField.type = "text";
                          customField.placeholder = "Specify disorder";
                          customField.className =
                            "flex-1 text-sm p-2 border border-gray-300 rounded-md";
                          container.insertBefore(
                            customField,
                            document.getElementById("nervous-system-notes"),
                          );
                        } else if (e.target.value !== "Other" && customInput) {
                          customInput.remove();
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select disorder
                      </option>
                      <option value="Stroke/CVA">Stroke/CVA</option>
                      <option value="Migraine">Migraine</option>
                      <option value="Epilepsy">Epilepsy</option>
                      <option value="Multiple Sclerosis">
                        Multiple Sclerosis
                      </option>
                      <option value="Parkinson's Disease">
                        Parkinson's Disease
                      </option>
                      <option value="Alzheimer's Disease">
                        Alzheimer's Disease
                      </option>
                      <option value="Peripheral Neuropathy">
                        Peripheral Neuropathy
                      </option>
                      <option value="Bell's Palsy">Bell's Palsy</option>
                      <option value="Essential Tremor">Essential Tremor</option>
                      <option value="Traumatic Brain Injury">
                        Traumatic Brain Injury
                      </option>
                      <option value="Other">Other</option>
                    </select>

                    <input
                      type="text"
                      id="nervous-system-notes"
                      placeholder="Notes (symptoms, medications, treatment, etc.)"
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                    />

                    <button
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      onClick={() => {
                        const typeSelect = document.getElementById(
                          "nervous-system-type",
                        ) as HTMLSelectElement;
                        const notesInput = document.getElementById(
                          "nervous-system-notes",
                        ) as HTMLInputElement;
                        const customInput = document.getElementById(
                          "nervous-system-custom",
                        ) as HTMLInputElement;

                        if (typeSelect && typeSelect.value) {
                          let type = typeSelect.value;
                          let notes = notesInput ? notesInput.value : "";

                          // If "Other" is selected, use the custom input value
                          if (
                            type === "Other" &&
                            customInput &&
                            customInput.value
                          ) {
                            // Store the custom value in the notes field with a separator
                            notes = `${customInput.value}|${notes}`;
                          }

                          setNervousSystemDisorders([
                            ...nervousSystemDisorders,
                            {
                              type,
                              notes,
                            },
                          ]);

                          // Reset inputs
                          typeSelect.selectedIndex = 0;
                          if (notesInput) notesInput.value = "";
                          if (customInput) customInput.remove();
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* OTHER SYSTEMIC AND KNOWN DISORDERS/DYSFUNCTIONS Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  OTHER SYSTEMIC AND KNOWN DISORDERS/DYSFUNCTIONS
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Other Health Conditions
                  </h5>

                  {/* Existing Other Systemic Disorders */}
                  {otherSystemicDisorders.map(
                    (disorder: OtherSystemicDisorder, index: number) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={disorder.name}
                            onChange={(e) => {
                              const updatedDisorders = [
                                ...otherSystemicDisorders,
                              ];
                              updatedDisorders[index].name = e.target.value;
                              setOtherSystemicDisorders(updatedDisorders);
                            }}
                            placeholder="Disorder/Dysfunction name"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="flex-1">
                          <input
                            type="text"
                            value={disorder.notes}
                            onChange={(e) => {
                              const updatedDisorders = [
                                ...otherSystemicDisorders,
                              ];
                              updatedDisorders[index].notes = e.target.value;
                              setOtherSystemicDisorders(updatedDisorders);
                            }}
                            placeholder="Notes (symptoms, medications, treatment, etc.)"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const updatedDisorders = [
                              ...otherSystemicDisorders,
                            ];
                            updatedDisorders.splice(index, 1);
                            setOtherSystemicDisorders(updatedDisorders);
                          }}
                          className="p-2 text-red-500 hover:text-red-700"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ),
                  )}

                  {/* Add new Other Systemic Disorder */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        id="other-disorder-name"
                        placeholder="Disorder/Dysfunction name"
                        className="w-full text-sm p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        id="other-disorder-notes"
                        placeholder="Notes (symptoms, medications, treatment, etc.)"
                        className="w-full text-sm p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <button
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      onClick={() => {
                        const nameInput = document.getElementById(
                          "other-disorder-name",
                        ) as HTMLInputElement;
                        const notesInput = document.getElementById(
                          "other-disorder-notes",
                        ) as HTMLInputElement;

                        if (nameInput && nameInput.value.trim()) {
                          setOtherSystemicDisorders([
                            ...otherSystemicDisorders,
                            {
                              name: nameInput.value.trim(),
                              notes: notesInput ? notesInput.value : "",
                            },
                          ]);

                          // Reset inputs
                          if (nameInput) nameInput.value = "";
                          if (notesInput) notesInput.value = "";
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* PHARMACOLOGICAL TREATMENTS Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  PHARMACOLOGICAL TREATMENTS
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  {/* Ongoing Treatments */}
                  <div className="mb-4">
                    <label
                      htmlFor="ongoing-treatments"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Ongoing Treatments
                    </label>
                    <textarea
                      id="ongoing-treatments"
                      value={ongoingTreatments}
                      onChange={(e) => setOngoingTreatments(e.target.value)}
                      placeholder="List all current medications with dosage, frequency, and any relevant notes. For example: Metformin 500mg twice daily for diabetes; Lisinopril 10mg once daily for hypertension..."
                      className="w-full text-sm p-3 border border-gray-300 rounded-md min-h-32"
                      rows={5}
                    ></textarea>
                  </div>

                  {/* Past Treatments */}
                  <div>
                    <label
                      htmlFor="past-treatments"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Past Treatments
                    </label>
                    <textarea
                      id="past-treatments"
                      value={pastTreatments}
                      onChange={(e) => setPastTreatments(e.target.value)}
                      placeholder="List all previous medications with dosage, dates of use, and any relevant notes. For example: Prednisone 20mg daily for 10 days in January 2023 for inflammation; Amoxicillin 500mg three times daily for 7 days in March 2023 for respiratory infection..."
                      className="w-full text-sm p-3 border border-gray-300 rounded-md min-h-32"
                      rows={5}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* MEDICAL DEVICES Section */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-semibold uppercase text-gray-600 border-b pb-1">
                  MEDICAL DEVICES
                </h4>
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                  {/* Current Devices */}
                  <div className="mb-5">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Current Medical Devices
                    </h5>

                    {/* Existing Current Devices */}
                    {currentDevices.map(
                      (device: MedicalDevice, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
                          {device.name === "Other" ? (
                            <div className="flex-1 flex gap-1">
                              <select
                                value={device.name}
                                onChange={(e) => {
                                  const updatedDevices = [...currentDevices];
                                  updatedDevices[index].name = e.target.value;
                                  setCurrentDevices(updatedDevices);
                                }}
                                className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                              >
                                <option value="Pacemaker">Pacemaker</option>
                                <option value="Arthroprosthesis">
                                  Arthroprosthesis
                                </option>
                                <option value="Osteosynthesis Material">
                                  Osteosynthesis Material
                                </option>
                                <option value="Cardioverter-Defibrillator">
                                  Cardioverter-Defibrillator
                                </option>
                                <option value="Insulin Pump">
                                  Insulin Pump
                                </option>
                                <option value="Joint Replacement">
                                  Joint Replacement
                                </option>
                                <option value="Cardiac Stent">
                                  Cardiac Stent
                                </option>
                                <option value="Neurostimulator">
                                  Neurostimulator
                                </option>
                                <option value="Cochlear Implant">
                                  Cochlear Implant
                                </option>
                                <option value="Other">Other</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Specify device"
                                className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                                value={device.notes.split("|")[0] || ""}
                                onChange={(e) => {
                                  const updatedDevices = [...currentDevices];
                                  const parts = device.notes.split("|");
                                  parts[0] = e.target.value;
                                  updatedDevices[index].notes = parts.join("|");
                                  setCurrentDevices(updatedDevices);
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex-1">
                              <select
                                value={device.name}
                                onChange={(e) => {
                                  const updatedDevices = [...currentDevices];
                                  updatedDevices[index].name = e.target.value;
                                  setCurrentDevices(updatedDevices);
                                }}
                                className="w-full text-sm p-2 border border-gray-300 rounded-md"
                              >
                                <option value="Pacemaker">Pacemaker</option>
                                <option value="Arthroprosthesis">
                                  Arthroprosthesis
                                </option>
                                <option value="Osteosynthesis Material">
                                  Osteosynthesis Material
                                </option>
                                <option value="Cardioverter-Defibrillator">
                                  Cardioverter-Defibrillator
                                </option>
                                <option value="Insulin Pump">
                                  Insulin Pump
                                </option>
                                <option value="Joint Replacement">
                                  Joint Replacement
                                </option>
                                <option value="Cardiac Stent">
                                  Cardiac Stent
                                </option>
                                <option value="Neurostimulator">
                                  Neurostimulator
                                </option>
                                <option value="Cochlear Implant">
                                  Cochlear Implant
                                </option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          )}

                          <div className="flex-1">
                            <input
                              type="text"
                              value={
                                device.name === "Other"
                                  ? device.notes.split("|")[1] || ""
                                  : device.notes
                              }
                              onChange={(e) => {
                                const updatedDevices = [...currentDevices];
                                if (device.name === "Other") {
                                  const parts = device.notes.split("|");
                                  parts[1] = e.target.value;
                                  updatedDevices[index].notes = parts.join("|");
                                } else {
                                  updatedDevices[index].notes = e.target.value;
                                }
                                setCurrentDevices(updatedDevices);
                              }}
                              placeholder="Notes (type, placement, date installed, etc.)"
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            />
                          </div>

                          <button
                            onClick={() => {
                              const updatedDevices = [...currentDevices];
                              updatedDevices.splice(index, 1);
                              setCurrentDevices(updatedDevices);
                            }}
                            className="p-2 text-red-500 hover:text-red-700"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ),
                    )}

                    {/* Add New Current Device */}
                    <div
                      className="flex items-center gap-2 mb-2"
                      id="new-current-device-container"
                    >
                      <div className="flex-1">
                        <select
                          id="current-device-name"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          defaultValue=""
                          onChange={(e) => {
                            const container = document.getElementById(
                              "new-current-device-container",
                            );
                            const customInput = document.getElementById(
                              "current-device-custom",
                            );

                            if (
                              e.target.value === "Other" &&
                              container &&
                              !customInput
                            ) {
                              // Insert custom input after select
                              const customField =
                                document.createElement("input");
                              customField.id = "current-device-custom";
                              customField.type = "text";
                              customField.placeholder = "Specify device";
                              customField.className =
                                "flex-1 text-sm p-2 border border-gray-300 rounded-md ml-2";
                              container.insertBefore(
                                customField,
                                document.getElementById("current-device-notes"),
                              );
                            } else if (
                              e.target.value !== "Other" &&
                              customInput
                            ) {
                              customInput.remove();
                            }
                          }}
                        >
                          <option value="" disabled>
                            Select device
                          </option>
                          <option value="Pacemaker">Pacemaker</option>
                          <option value="Arthroprosthesis">
                            Arthroprosthesis
                          </option>
                          <option value="Osteosynthesis Material">
                            Osteosynthesis Material
                          </option>
                          <option value="Cardioverter-Defibrillator">
                            Cardioverter-Defibrillator
                          </option>
                          <option value="Insulin Pump">Insulin Pump</option>
                          <option value="Joint Replacement">
                            Joint Replacement
                          </option>
                          <option value="Cardiac Stent">Cardiac Stent</option>
                          <option value="Neurostimulator">
                            Neurostimulator
                          </option>
                          <option value="Cochlear Implant">
                            Cochlear Implant
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          id="current-device-notes"
                          placeholder="Notes (type, placement, date installed, etc.)"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <button
                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                        onClick={() => {
                          const typeSelect = document.getElementById(
                            "current-device-name",
                          ) as HTMLSelectElement;
                          const notesInput = document.getElementById(
                            "current-device-notes",
                          ) as HTMLInputElement;
                          const customInput = document.getElementById(
                            "current-device-custom",
                          ) as HTMLInputElement;

                          if (typeSelect && typeSelect.value) {
                            let type = typeSelect.value;
                            let notes = notesInput ? notesInput.value : "";

                            // If "Other" is selected, use the custom input value
                            if (
                              type === "Other" &&
                              customInput &&
                              customInput.value
                            ) {
                              // Store the custom value in the notes field with a separator
                              notes = `${customInput.value}|${notes}`;
                            }

                            setCurrentDevices([
                              ...currentDevices,
                              {
                                name: type,
                                notes,
                              },
                            ]);

                            // Reset inputs
                            typeSelect.selectedIndex = 0;
                            if (notesInput) notesInput.value = "";
                            if (customInput) customInput.remove();
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Past Devices */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Past Medical Devices
                    </h5>

                    {/* Existing Past Devices */}
                    {pastDevices.map((device: MedicalDevice, index: number) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        {device.name === "Other" ? (
                          <div className="flex-1 flex gap-1">
                            <select
                              value={device.name}
                              onChange={(e) => {
                                const updatedDevices = [...pastDevices];
                                updatedDevices[index].name = e.target.value;
                                setPastDevices(updatedDevices);
                              }}
                              className="w-1/3 text-sm p-2 border border-gray-300 rounded-md"
                            >
                              <option value="Pacemaker">Pacemaker</option>
                              <option value="Arthroprosthesis">
                                Arthroprosthesis
                              </option>
                              <option value="Osteosynthesis Material">
                                Osteosynthesis Material
                              </option>
                              <option value="Cardioverter-Defibrillator">
                                Cardioverter-Defibrillator
                              </option>
                              <option value="Insulin Pump">Insulin Pump</option>
                              <option value="Joint Replacement">
                                Joint Replacement
                              </option>
                              <option value="Cardiac Stent">
                                Cardiac Stent
                              </option>
                              <option value="Neurostimulator">
                                Neurostimulator
                              </option>
                              <option value="Cochlear Implant">
                                Cochlear Implant
                              </option>
                              <option value="Other">Other</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Specify device"
                              className="flex-1 text-sm p-2 border border-gray-300 rounded-md"
                              value={device.notes.split("|")[0] || ""}
                              onChange={(e) => {
                                const updatedDevices = [...pastDevices];
                                const parts = device.notes.split("|");
                                parts[0] = e.target.value;
                                updatedDevices[index].notes = parts.join("|");
                                setPastDevices(updatedDevices);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex-1">
                            <select
                              value={device.name}
                              onChange={(e) => {
                                const updatedDevices = [...pastDevices];
                                updatedDevices[index].name = e.target.value;
                                setPastDevices(updatedDevices);
                              }}
                              className="w-full text-sm p-2 border border-gray-300 rounded-md"
                            >
                              <option value="Pacemaker">Pacemaker</option>
                              <option value="Arthroprosthesis">
                                Arthroprosthesis
                              </option>
                              <option value="Osteosynthesis Material">
                                Osteosynthesis Material
                              </option>
                              <option value="Cardioverter-Defibrillator">
                                Cardioverter-Defibrillator
                              </option>
                              <option value="Insulin Pump">Insulin Pump</option>
                              <option value="Joint Replacement">
                                Joint Replacement
                              </option>
                              <option value="Cardiac Stent">
                                Cardiac Stent
                              </option>
                              <option value="Neurostimulator">
                                Neurostimulator
                              </option>
                              <option value="Cochlear Implant">
                                Cochlear Implant
                              </option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        )}

                        <div className="flex-1">
                          <input
                            type="text"
                            value={
                              device.name === "Other"
                                ? device.notes.split("|")[1] || ""
                                : device.notes
                            }
                            onChange={(e) => {
                              const updatedDevices = [...pastDevices];
                              if (device.name === "Other") {
                                const parts = device.notes.split("|");
                                parts[1] = e.target.value;
                                updatedDevices[index].notes = parts.join("|");
                              } else {
                                updatedDevices[index].notes = e.target.value;
                              }
                              setPastDevices(updatedDevices);
                            }}
                            placeholder="Notes (removal date, reason, etc.)"
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const updatedDevices = [...pastDevices];
                            updatedDevices.splice(index, 1);
                            setPastDevices(updatedDevices);
                          }}
                          className="p-2 text-red-500 hover:text-red-700"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* Add New Past Device */}
                    <div
                      className="flex items-center gap-2 mb-2"
                      id="new-past-device-container"
                    >
                      <div className="flex-1">
                        <select
                          id="past-device-name"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          defaultValue=""
                          onChange={(e) => {
                            const container = document.getElementById(
                              "new-past-device-container",
                            );
                            const customInput =
                              document.getElementById("past-device-custom");

                            if (
                              e.target.value === "Other" &&
                              container &&
                              !customInput
                            ) {
                              // Insert custom input after select
                              const customField =
                                document.createElement("input");
                              customField.id = "past-device-custom";
                              customField.type = "text";
                              customField.placeholder = "Specify device";
                              customField.className =
                                "flex-1 text-sm p-2 border border-gray-300 rounded-md ml-2";
                              container.insertBefore(
                                customField,
                                document.getElementById("past-device-notes"),
                              );
                            } else if (
                              e.target.value !== "Other" &&
                              customInput
                            ) {
                              customInput.remove();
                            }
                          }}
                        >
                          <option value="" disabled>
                            Select device
                          </option>
                          <option value="Pacemaker">Pacemaker</option>
                          <option value="Arthroprosthesis">
                            Arthroprosthesis
                          </option>
                          <option value="Osteosynthesis Material">
                            Osteosynthesis Material
                          </option>
                          <option value="Cardioverter-Defibrillator">
                            Cardioverter-Defibrillator
                          </option>
                          <option value="Insulin Pump">Insulin Pump</option>
                          <option value="Joint Replacement">
                            Joint Replacement
                          </option>
                          <option value="Cardiac Stent">Cardiac Stent</option>
                          <option value="Neurostimulator">
                            Neurostimulator
                          </option>
                          <option value="Cochlear Implant">
                            Cochlear Implant
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          id="past-device-notes"
                          placeholder="Notes (removal date, reason, etc.)"
                          className="w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <button
                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                        onClick={() => {
                          const typeSelect = document.getElementById(
                            "past-device-name",
                          ) as HTMLSelectElement;
                          const notesInput = document.getElementById(
                            "past-device-notes",
                          ) as HTMLInputElement;
                          const customInput = document.getElementById(
                            "past-device-custom",
                          ) as HTMLInputElement;

                          if (typeSelect && typeSelect.value) {
                            let type = typeSelect.value;
                            let notes = notesInput ? notesInput.value : "";

                            // If "Other" is selected, use the custom input value
                            if (
                              type === "Other" &&
                              customInput &&
                              customInput.value
                            ) {
                              // Store the custom value in the notes field with a separator
                              notes = `${customInput.value}|${notes}`;
                            }

                            setPastDevices([
                              ...pastDevices,
                              {
                                name: type,
                                notes,
                              },
                            ]);

                            // Reset inputs
                            typeSelect.selectedIndex = 0;
                            if (notesInput) notesInput.value = "";
                            if (customInput) customInput.remove();
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
          </AccordionContent>
        </AccordionItem>

        {/* CONCLUSIONS Section */}
        <AccordionItem value="conclusions">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <History className="mr-2 h-5 w-5 text-indigo-500" />
              <span>CONCLUSIONS</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
        

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              General Notes
            </label>
            <div className="relative">
              <textarea
                value={conclusionsNotes}
                onChange={(e) => setConclusionsNotes(e.target.value)}
                placeholder="Enter your observations, conclusions, and additional notes about the examination..."
                className="w-full text-sm p-4 border border-gray-300 rounded-md min-h-[150px]"
                rows={6}
              />
              {voiceInputEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    // Start voice recognition for the conclusions textarea
                    const recognition = new (
                      window as any
                    ).webkitSpeechRecognition();
                    recognition.lang = "en-US";
                    recognition.continuous = true;
                    recognition.interimResults = false;

                    recognition.onresult = (event: any) => {
                      const transcript =
                        event.results[event.results.length - 1][0]
                          .transcript;
                      setConclusionsNotes((prevNotes) =>
                        prevNotes
                          ? prevNotes + " " + transcript
                          : transcript,
                      );
                    };

                    recognition.start();

                    // Add a stop button
                    const stopButton =
                      document.createElement("button");
                    stopButton.textContent = "Stop Dictation";
                    stopButton.className =
                      "absolute bottom-2 right-14 px-3 py-1 bg-red-500 text-white text-sm rounded-md";
                    stopButton.onclick = () => {
                      recognition.stop();
                      stopButton.remove();
                    };

                    const parent = document.activeElement?.parentNode;
                    if (parent) {
                      parent.appendChild(stopButton);
                    }
                  }}
                  className="absolute top-2 right-2 p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  aria-label="Voice input"
                  title="Use voice input"
                >
                  🎤
                </button>
              )}
            </div>
          </div>
        </div>
          </AccordionContent>
        </AccordionItem>
        {/* EXERCISES */}
        <AccordionItem value="exercises">
          <AccordionTrigger className="text-base font-medium py-3 hover:bg-gray-50 px-2 rounded">
            <div className="flex items-center">
              <Dumbbell className="mr-2 h-5 w-5 text-green-500" />
              <span>Exercises</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div className="space-y-6">
                  {/* Exercise Selection */}
                  <div>
                    <p className="mb-4 text-sm text-gray-600">
                      Select the exercises performed with the client during this
                      session:
                    </p>

                    {/* Single combined exercises combobox */}
                    <div>
                      <TagSelectionInput
                        label="Exercises"
                        placeholder="Search and select exercises..."
                        options={[
                          // Breathing Exercises
                          "Diaphragmatic Breathing",
                          "Lateral Costal Breathing",
                          "Alternate Nostril Breathing",
                          "Box Breathing",
                          "Pursed Lip Breathing",

                          // Mobility Exercises
                          "Thoracic Spine Mobility",
                          "Hip Mobility",
                          "Shoulder Mobility",
                          "Ankle Mobility",
                          "Neck Mobility",
                          "Wrist Mobility",

                          // Stability Exercises
                          "Core Activation",
                          "Pelvic Floor Activation",
                          "Balance Exercises",
                          "Posture Stability",
                          "Scapular Stabilization",

                          // Equipment Exercises
                          "Reformer Exercises",
                          "Cadillac Exercises",
                          "Chair Exercises",
                          "Barrel Exercises",
                          "Tower Exercises",

                          // Mat Exercises
                          "The Hundred",
                          "Roll-Up",
                          "Spine Twist",
                          "Side Kicks",
                          "Swan Dive",
                          "The Teaser",
                          "The Seal",

                          // Therapeutic Exercises
                          "Fascial Release",
                          "Postural Alignment",
                          "Gait Training",
                          "Joint Mobilization",
                          "Myofascial Release",
                        ]}
                        selectedTags={selectedExercises}
                        onTagsChange={setSelectedExercises}
                        allowCustomTags={true}
                        voiceEnabled={voiceInputEnabled}
                        className="w-full"
                      />
                    </div>

                    {/* Selected Exercises Summary */}
                    {selectedExercises.length > 0 && (
                      <div className="mt-6 p-3 bg-gray-50 rounded-md">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Selected Exercises:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedExercises.map((exercise) => (
                            <div
                              key={exercise}
                              className="inline-flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-800"
                            >
                              <span>{exercise}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedExercises(
                                    selectedExercises.filter(
                                      (ex) => ex !== exercise,
                                    ),
                                  )
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Custom Exercises */}
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Additional Exercises
                      </h4>
                      <div className="relative">
                        <textarea
                          placeholder="Enter any custom or additional exercises not listed above..."
                          className="w-full text-sm p-3 border border-gray-300 rounded-md"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose} className="px-4 py-2 h-10">
          Close
        </Button>
      </div>
    </div>
  );
};

export default MedicalRecordForm;
