export enum UserRole {
  PATIENT = 'patient',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  lineUserId: string;
  lineDisplayName: string;
  fullName: string;
  caseNumber?: string;
  gender: 'male' | 'female';
  birthdate?: string;
  role: UserRole;
  dialysisStartDate?: string,
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
export type UserInput = Omit<User, 'id' | 'lineUserId' | 'lineDisplayName' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface patientSummary {
  id: string;
  fullName: string;
  caseNumber: string;
  gender: string;
  age: number;
  dialysisStartDate: string | undefined;
  lastRecordDate: string;
  alertRecordsCount: number;
  status: string;
  lastBP: string;
  lastWeight: number | string;
  lastBloodGlucose: string | number;
  /* lastDialysis: {
    recordDate?: string;
    infusedVolume?: number;
    drainedVolume?: number;
    dialysateAppearance?: string;
  }; */
}

export interface DialysisRecord {
  id: string;
  userId: string;
  recordDate: string;
  infusedVolume: number;
  drainedVolume: number;
  ultrafiltrationVolume: number;
  dialysateGlucose: number;
  weight: number;
  dialysateAppearance: 'clear' | 'cloudy' | 'bloody' | 'other';
  abdominalPain: boolean;
  abdominalPainScore?: number;
  otherSymptoms: string[];
  note: string;
  // photos?: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
export type DialysisRecordInput = Omit<DialysisRecord, 'id' | 'userId' | 'ultrafiltrationVolume' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface VitalsignRecord {
  id: string;
  userId: string;
  recordDate: string;
  systolicBP: number;
  diastolicBP: number;
  temperature: number;
  needBloodGlucose: boolean;
  bloodGlucose?: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
export type VitalsignRecordInput = Omit<VitalsignRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface AlertRecord {
  id: string;
  userId: string;
  userName: string;
  recordId: string;
  type: 'bp' | 'weight' | 'bloodGlucose' | 'dialysis';
  content: string;
  isResolved?: boolean;
  resolvedId?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
export type AlertRecordInput = Omit<AlertRecord, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead?: boolean;
  createdAt: string;
  updatedAt: string;
}
export type MessageInput = Omit<Message, 'id' | 'senderId' | 'createdAt' | 'updatedAt'>;

export interface DialysisSetting {
  id: string;
  userId: string;
  exchangeVolumnePertime: number;
  exchangeTimesPerday: number;
  dialysateGlucose: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}
export type DialysisSettingInput = Omit<DialysisSetting, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface ExitsiteCareRecord {
  id: string;
  userId: string;
  recordDate: string;
  exitsiteAppearance: 'normal' | 'red' | 'swollen' | 'discharge';
  discharge: boolean;
  dischargeColor?: 'clear' | 'yellow' | 'green' | 'bloody';
  dischargeAmount?: 'small' | 'moderate' | 'large';
  pain: boolean;
  painScore?: number;
  scab: boolean;
  tunnelInfection: boolean;
  // photos: string[];
  note?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export type ExitsiteCareRecordInput = Omit<ExitsiteCareRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'>;