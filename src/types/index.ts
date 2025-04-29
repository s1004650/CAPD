// 定義應用程式中使用的各種型別

// 使用者角色
export enum UserRole {
  PATIENT = 'patient',
  CASE_MANAGER = 'caseManager'
}

// 透析紀錄
export interface DialysisRecord {
  id: string;
  patientId: string;
  date: string; // ISO格式日期
  time: string;
  inflowVolume: number; // 注入液量
  outflowVolume: number; // 引流液量
  appearance: 'clear' | 'cloudy' | 'bloody' | 'other'; // 透析液外觀
  hasAbdominalPain: boolean; // 是否有腹痛
  painLevel?: number; // 疼痛程度 (1-10)
  symptoms: string[]; // 症狀列表
  temperature?: number; // 體溫
  notes?: string;
  createdAt: string;
}

// 生命徵象記錄
export interface VitalsRecord {
  id: string;
  patientId: string;
  date: string; // ISO格式日期
  systolicBP: number; // 收縮壓
  diastolicBP: number; // 舒張壓
  weight: number; // 體重 (kg)
  bloodSugar?: number; // 血糖 (mg/dL)
  temperature?: number; // 體溫
  notes?: string;
  createdAt: string;
}

// 使用者資料
export interface User {
  id: string;
  role: UserRole;
  name: string;
  nationalId: string; // 身分證字號
  phone?: string;
  createdAt: string;
}

// 病患詳細資料
export interface Patient extends User {
  medicalId: string; // 病歷號碼
  birthdate: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  dialysisStartDate: string;
  targetWeight?: number; // 目標體重
  caseManagerId: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medications?: Medication[];
  notificationSettings?: NotificationSettings;
}

// 個案管理師詳細資料
export interface CaseManager extends User {
  licenseNumber: string;
  department: string;
  patients: string[]; // 病患ID清單
}

// 系統訊息
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  icon?: string; // 訊息圖示 (例如: ⚠️, ✅)
  isRead: boolean;
  createdAt: string;
}

// 異常警示設定
export interface AlertThreshold {
  patientId: string;
  systolicBPHigh: number; // 收縮壓上限
  systolicBPLow: number; // 收縮壓下限
  diastolicBPHigh: number; // 舒張壓上限
  diastolicBPLow: number; // 舒張壓下限
  weightChangePercent: number; // 體重變化百分比閾值
  bloodSugarHigh: number; // 血糖上限
  bloodSugarLow: number; // 血糖下限
  temperatureHigh: number; // 體溫上限
  updatedAt: string;
}

// 異常警示
export interface Alert {
  id: string;
  patientId: string;
  type: 'bp' | 'weight' | 'bloodSugar' | 'dialysis' | 'temperature';
  message: string;
  date: string;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

// 藥物資訊
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeSlots: string[]; // 服藥時間
  startDate: string;
  endDate?: string;
  notes?: string;
}

// 通知設定
export interface NotificationSettings {
  dailyRecordReminder: boolean;
  reminderTime: string; // HH:mm 格式
  medicationReminders: boolean;
  abnormalAlerts: boolean;
  messageNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

// 報表類型
export enum ReportType {
  EXCEL = 'excel',
  PDF = 'pdf'
}

// 報表時間範圍
export enum ReportTimeRange {
  WEEK = '7',
  MONTH = '30',
  QUARTER = '90'
}

// 統計數據
export interface Statistics {
  averageSystolicBP: number;
  averageDiastolicBP: number;
  averageWeight: number;
  averageBloodSugar?: number;
  averageUltrafiltration: number; // 平均脫水量
  recordCompletionRate: number; // 記錄完成率
  abnormalCount: number; // 異常次數
}