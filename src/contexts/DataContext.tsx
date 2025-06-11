import React, { createContext, useContext, useState } from 'react';
import { DialysisRecord, DialysisRecordInput, VitalsignRecord, VitalsignRecordInput, 
  AlertRecord, AlertRecordInput, Message, MessageInput, User, patientSummary,
  ExitsiteCareRecord, ExitsiteCareRecordInput, DialysisSetting, DialysisSettingInput, 
  UserInput} from '../types/index';
import { useAuth } from './AuthContext';

interface DataContextType {
  patients: User[];
  patientSummaries: patientSummary[];
  addUser: (data: UserInput) => Promise<void>;
  fetchPatientSummaries: () => Promise<void>;
  fetchPatients: () => Promise<void>;
  dialysisRecords: DialysisRecord[];
  addDialysisRecord: (data: DialysisRecordInput) => Promise<void>;
  fetchDialysisRecords: (userId?: string) => Promise<void>;
  deleteDialysisRecord: (id: string) => Promise<void>;
  vitalsignRecords: VitalsignRecord[];
  addVitalsignRecord: (data: VitalsignRecordInput) => Promise<void>;
  fetchVitalsignRecords: (userId?: string) => Promise<void>;
  deleteVitalsignRecord: (id: string) => Promise<void>;
  exitsiteCareRecords: ExitsiteCareRecord[];
  addExitsiteCareRecord: (data: ExitsiteCareRecordInput) => Promise<void>;
  fetchExitsiteCareRecords: (userId?: string) => Promise<void>;
  deleteExitsiteCareRecord: (id: string) => Promise<void>;
  messages: Message[];
  addMessage: (data: MessageInput) => Promise<void>;
  fetchMessages: (userId?: string) => Promise<void>;
  alertRecords: AlertRecord[];
  addAlertRecord: (record: AlertRecordInput) => Promise<void>;
  fetchAlertRecords: (userId?: string) => Promise<void>;
  dialysisSettings: DialysisSetting[];
  udpateDialysisSetting: (id: string, record: DialysisSettingInput) => Promise<void>;
  fetchDialysisSettings: (userId?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<User[]>([]);
  const [patientSummaries, setPatientSummaries] = useState<patientSummary[]>([]);
  const [dialysisRecords, setDialysisRecords] = useState<DialysisRecord[]>([]);
  const [vitalsignRecords, setVitalsignRecords] = useState<VitalsignRecord[]>([]);
  const [exitsiteCareRecords, setExitsiteCareRecords] = useState<ExitsiteCareRecord[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [alertRecords, setAlertRecords] = useState<AlertRecord[]>([]);
  const [dialysisSettings, setDialysisSettings] = useState<DialysisSetting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setIsLoading(true);
    try { 
      const response = await fetch('/api/patients');
      const responseData = await response.json();

      if (responseData.success) {
        const formatedData = responseData.data.map((data: any) => ({
          id: data.id,
          lineUserId: data.line_user_id,
          lineDisplayName: data.line_display_name,
          fullName: data.full_name,
          caseNumber: data.case_number,
          gender: data.gender,
          birthdate: data.birthdate,
          role: data.role,
          dialysisStartDate: data.dialysis_start_date,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }));
        setPatients(formatedData);
      } else {
        throw new Error(responseData.error || '(病人清單)取得失敗');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientSummaries = async () => {
    setIsLoading(true);
    try { 
      const response = await fetch('/api/patients/summaries');
      const responseData = await response.json();

      if (responseData.success) {
        const formatedData = responseData.data.map((data: any) => ({
          id: data.id,
          fullName: data.full_name,
          caseNumber: data.case_number,
          gender: data.gender,
          age: data.age,
          dialysisStartDate: data.dialysis_start_date,
          lastRecord: data.last_record,
          alertRecordsCount: data.alert_records_count,
          status: data.status,
          lastBP: data.last_bp,
          lastWeight: data.last_weight,
          lastBloodGlucose: data.last_blood_glucose,
        }));
        setPatientSummaries(formatedData);
      } else {
        throw new Error(responseData.error || '(病人匯總資訊)取得失敗');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async (data: UserInput) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          caseNumber: data.caseNumber,
          gender: data.gender,
          birthdate: data.birthdate,
          role: data.role,
          dialysisStartDate: data.dialysisStartDate,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error);
      }
    } catch (err: any) {
      setError('(使用者)新增失敗，' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addDialysisRecord = async (data: DialysisRecordInput) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/dialysis-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          recordDate: data.recordDate,
          infusedVolume: data.infusedVolume,
          drainedVolume: data.drainedVolume,
          dialysateGlucose: data.dialysateGlucose,
          weight: data.weight,
          dialysateAppearance: data.dialysateAppearance,
          abdominalPain: data.abdominalPain,
          abdominalPainScore: data.abdominalPainScore ?? 0,
          otherSymptoms: data.otherSymptoms.join(','),
          note: data.note ?? '',
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error);
      }

      if (data.dialysateAppearance !== 'clear') {
        await addAlertRecord({
          recordId: responseData.data[0].id,
          type: 'dialysis',
          content:  `透析液外觀${
            data.dialysateAppearance === 'cloudy' ? '混濁' : 
            data.dialysateAppearance === 'bloody' ? '血性' : '異常'
          }，請留意可能的感染風險`
        })
      }
    } catch (err: any) {
      setError('(透析紀錄)新增失敗，' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDialysisRecords = async (userId?: string) => {
    setIsLoading(true);
    try {
      const endpoint = userId ? `/api/dialysis-record?userId=${userId}` : '/api/dialysis-record'
      const response = await fetch(endpoint);
      const responseData = await response.json();

      if (responseData.success) {
        const formatedData = responseData.data.map((data: any) => ({
          id: data.id,
          userId: data.user_id,
          recordDate: data.record_date,
          infusedVolume: data.infused_volume,
          drainedVolume: data.drained_volume,
          ultrafiltrationVolume: data.ultrafiltration_volume,
          dialysateGlucose: data.dialysate_glucose,
          weight: data.weight,
          dialysateAppearance: data.dialysate_appearance,
          abdominalPain: data.abdominal_pain,
          abdominalPainScore: data.abdominal_pain_score,
          otherSymptoms: data.other_symptoms ? data.other_symptoms.split(',') : [],
          note: data.note,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }));
        setDialysisRecords(formatedData);
      } else {
        throw new Error(responseData.error || '(透析記錄)取得失敗');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDialysisRecord = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/dialysis-record/${id}`, {
        method: 'DELETE',
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error);
      }
    } catch (err: any) {
      setError('(透析紀錄)刪除失敗，' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const addVitalsignRecord = async (data: VitalsignRecordInput) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/vitalsign-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          recordDate: data.recordDate,
          systolicBP: data.systolicBP,
          diastolicBP: data.diastolicBP,
          temperature: data.temperature,
          needBloodGlucose: data.needBloodGlucose,
          bloodGlucose: data.bloodGlucose,
          note: data.note ?? '',
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error);
      }

      if (data.systolicBP > 140 || data.systolicBP < 90 ||
        data.diastolicBP > 90 || data.diastolicBP < 60) {
        await addAlertRecord({
          recordId: responseData.data[0].id,
          type: 'bp',
          content: `血壓異常 (${data.systolicBP}/${data.diastolicBP} mmHg)，請持續監測`
        })
      }

      if (data.bloodGlucose && (data.bloodGlucose > 180 || data.bloodGlucose < 70)) {
        await addAlertRecord({
          recordId: responseData.data[0].id,
          type: 'bloodGlucose',
          content: `血糖${data.bloodGlucose > 180 ? '過高' : '過低'} (${data.bloodGlucose} mg/dL)，請留意飲食與症狀`
        })
      }
    } catch (err: any) {
      setError('(生命徵象)新增失敗，' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVitalsignRecords = async (userId?: string) => {
    setIsLoading(true);
    try {
      const endpoint = userId ? `/api/vitalsign-record?userId=${userId}` : '/api/vitalsign-record'
      const resonse = await fetch(endpoint);
      const resonseData = await resonse.json();

      if (resonseData.success) {
        const formatedData = resonseData.data.map((data: any) => ({
          id: data.id,
          userId: data.user_id,
          recordDate: data.record_date,
          systolicBP: data.systolic_bp,
          diastolicBP: data.diastolic_bp,
          temperature: data.temperature,
          needBloodGlucose: data.need_blood_glucose,
          bloodGlucose: data.blood_glucose,
          note: data.note,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }));
        setVitalsignRecords(formatedData);
      } else {
        throw new Error(resonseData.error || '(生命徵象)取得失敗');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVitalsignRecord = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/vitalsign-record/${id}`, {
        method: 'DELETE',
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error);
      }
    } catch (err: any) {
      setError('(生命徵象)刪除失敗，' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const addExitsiteCareRecord = async (data: ExitsiteCareRecordInput) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/exitsite-care-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          recordDate: data.recordDate,
          exitsiteAppearance: data.exitsiteAppearance,
          discharge: data.discharge,
          dischargeColor: data.dischargeColor,
          dischargeAmount: data.dischargeAmount,
          pain: data.pain,
          painScore: data.painScore,
          scab: data.scab,
          tunnelInfection: data.tunnelInfection,
          note: data.note ?? '',
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error);
      }

      if (data.exitsiteAppearance != 'normal') {
        await addAlertRecord({
          recordId: responseData.data[0].id,
          type: 'dialysis',
          content: `導管出口${
            data.exitsiteAppearance === 'red' ? '發紅' :
            data.exitsiteAppearance === 'swollen' ? '腫脹' :
            '有分泌物'
          }，請留意感染風險`
        })
      }
    } catch (err: any) {
      setError('(出口照護)新增失敗' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExitsiteCareRecords = async (userId?: string) => {
    setIsLoading(true);
    try {
      const endpoint = userId ? `/api/exitsite-care-record?userId=${userId}` : '/api/exitsite-care-record'
      const response = await fetch(endpoint);
      const responseData = await response.json();

      if (responseData.success) {
        const formatedData = responseData.data.map((data: any) => ({
          id: data.id,
          userId: data.user_id,
          recordDate: data.record_date,
          exitsiteAppearance: data.exitsite_appearance,
          discharge: data.discharge,
          dischargeColor: data.discharge_color,
          dischargeAmount: data.discharge_amount,
          pain: data.pain,
          painScore: data.pain_score,
          scab: data.scab,
          tunnelInfection: data.tunnel_infection,
          note: data.note,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }));
        setExitsiteCareRecords(formatedData);
      } else {
        throw new Error(responseData.error || '(出口照護)取得失敗');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExitsiteCareRecord = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/exitsite-care-record/${id}`, {
        method: 'DELETE',
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error);
      }
    } catch (err: any) {
      setError('(出口照護)刪除失敗，' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const addMessage = async (data: MessageInput) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: data.receiverId,
          content: data.content,
          isRead: data.isRead,
        }),
      });
    } catch (err: any) {
      setError('(訊息通知)新增失敗' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (userId?: string) => {
    setIsLoading(true);
    try {
      const endpoint = userId ? `/api/message?userId=${userId}` : '/api/message'
      const response = await fetch(endpoint);
      const responseData = await response.json();

      if (responseData.success) {
        const formatedData = responseData.data.map((data: any) => ({
          id: data.id,
          sernderId: data.sender_id,
          receiverId: data.receiver_id,
          content: data.content,
          isRead: data.is_read,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }));
        setMessages(formatedData);
      } else {
        throw new Error(responseData.error || '(訊息通知)取得失敗');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addAlertRecord = async (data: AlertRecordInput) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await fetch('/api/alert-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          recordId: data.recordId,
          type: data.type,
          content: data.content,
        }),
      });
    } catch (err: any) {
      setError('(異常警示)新增失敗' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlertRecords = async (userId?: string, isResolved?: boolean) => {
    setIsLoading(true);
    try {
      let endpoint = '/api/alert-record'
      if (userId || !isResolved) {
        endpoint += '?'
        if (userId) {
          endpoint += `userId=${userId}`
        }
        if (!isResolved) {
          if (userId) {
            endpoint += '&'
          }
          endpoint += 'isResolved=false'
        }
      }
      const response = await fetch(endpoint);
      const responseData = await response.json();

      if (responseData.success) {
        const formatedData = responseData.data.map((data: any) => ({
          id: data.id,
          userId: data.user_id,
          userName: data.full_name,
          recordId: data.recordId,
          type: data.type,
          content: data.content,
          isResolved: data.is_resolved,
          resolvedId: data.resolved_id,
          resolvedAt: data.resolved_at,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }));
        setAlertRecords(formatedData);
      } else {
        throw new Error(responseData.error || '(異常警示)取得失敗');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const udpateDialysisSetting = async (id: string, data: DialysisSettingInput) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await fetch(`/api/dialysis-setting/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exchangeVolumnePertime: data.exchangeVolumnePertime,
          exchangeTimesPerday: data.exchangeTimesPerday,
          dialysateGlucose: data.dialysateGlucose,
          note: data.note,
        }),
      });
    } catch (err: any) {
      setError('(透析處方)更新失敗' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDialysisSettings = async (userId?: string) => {
    setIsLoading(true);
    try {
      const endpoint = userId ? `/api/dialysis-setting?userId=${userId}` : '/api/dialysis-setting'
      const response = await fetch(endpoint);
      const responseData = await response.json();

      if (responseData.success) {
        const formatedData = responseData.data.map((data: any) => ({
          id: data.id,
          userId: data.user_id,
          exchangeVolumnePertime: data.exchange_volumne_pertime,
          exchangeTimesPerday: data.exchange_times_perday,
          dialysateGlucose: data.dialysate_glucose,
          note: data.note,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }));
        setDialysisSettings(formatedData);
      } else {
        throw new Error(responseData.error || '(透析處方)取得失敗');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    patients,
    patientSummaries,
    addUser,
    fetchPatientSummaries,
    fetchPatients,
    dialysisRecords,
    addDialysisRecord,
    fetchDialysisRecords,
    deleteDialysisRecord,
    vitalsignRecords,
    addVitalsignRecord,
    fetchVitalsignRecords,
    deleteVitalsignRecord,
    exitsiteCareRecords,
    addExitsiteCareRecord,
    fetchExitsiteCareRecords,
    deleteExitsiteCareRecord,
    messages,
    addMessage,
    fetchMessages,
    alertRecords,
    addAlertRecord,
    fetchAlertRecords,
    dialysisSettings,
    udpateDialysisSetting,
    fetchDialysisSettings,
    isLoading,
    error,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData 必須在 DataProvider 內使用');
  }
  return context;
};