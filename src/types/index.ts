export enum UserRole {
  PATIENT = 'patient',
  CASE_MANAGER = 'case_manager',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  nationalId: string;
  phone: string;
  createdAt: string;
}

export interface Patient extends User {
  medicalId: string;
  birthdate: string;
  age: number;
  gender: 'male' | 'female';
  dialysisStartDate: string;
  caseManagerId: string;
}

export interface DialysisRecord {
  id: string;
  patientId: string;
  date: string;
  time: string;
  inflowVolume: number;
  outflowVolume: number;
  concentration?: string;
  appearance: 'clear' | 'cloudy' | 'bloody' | 'other';
  hasAbdominalPain: boolean;
  painLevel?: number;
  symptoms: string[];
  weight: number;
  notes?: string;
  photos?: string[];
  createdAt: string;
}

export interface VitalsRecord {
  id: string;
  patientId: string;
  date: string;
  systolicBP: number;
  diastolicBP: number;
  weight: number;
  bloodSugar?: number;
  temperature?: number;
  notes?: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  patientId: string;
  type: 'bp' | 'weight' | 'bloodSugar' | 'dialysis';
  message: string;
  date: string;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface DialysisPrescription {
  volumePerExchange: number;
  exchangesPerDay: number;
  concentrationTypes: string[];
  notes?: string;
  updatedAt: string;
}

export interface ExitSiteCareRecord {
  id: string;
  patientId: string;
  date: string;
  appearance: 'normal' | 'red' | 'swollen' | 'discharge';
  hasDischarge: boolean;
  dischargeTrait?: {
    color: 'clear' | 'yellow' | 'green' | 'bloody';
    amount: 'small' | 'moderate' | 'large';
  };
  hasPain: boolean;
  painLevel?: number;
  hasScab: boolean;
  hasTunnel: boolean;
  photos: string[];
  notes?: string;
  createdAt: string;
}