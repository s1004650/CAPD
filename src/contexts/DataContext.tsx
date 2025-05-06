import React, { createContext, useContext, useState, useEffect } from 'react';
import { DialysisRecord, VitalsRecord, Alert, Message, Patient, ExitSiteCareRecord } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  dialysisRecords: DialysisRecord[];
  vitalsRecords: VitalsRecord[];
  alerts: Alert[];
  messages: Message[];
  patients: Patient[];
  exitSiteCareRecords: ExitSiteCareRecord[];
  addDialysisRecord: (record: Omit<DialysisRecord, 'id' | 'patientId' | 'createdAt'>) => Promise<void>;
  addVitalsRecord: (record: Omit<VitalsRecord, 'id' | 'patientId' | 'createdAt'>) => Promise<void>;
  addExitSiteCareRecord: (record: Omit<ExitSiteCareRecord, 'id' | 'patientId' | 'createdAt'>) => Promise<void>;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    role: 'patient',
    name: '王小明',
    nationalId: 'A123456789',
    phone: '0912345678',
    medicalId: 'M123456',
    birthdate: '1958-08-15',
    age: 65,
    gender: 'male',
    dialysisStartDate: '2022-03-15',
    caseManagerId: '2',
    createdAt: '2022-03-15T00:00:00Z',
  },
  {
    id: '2',
    role: 'patient',
    name: '李小華',
    nationalId: 'B234567890',
    phone: '0923456789',
    medicalId: 'M234567',
    birthdate: '1965-04-22',
    age: 58,
    gender: 'female',
    dialysisStartDate: '2021-11-22',
    caseManagerId: '2',
    createdAt: '2021-11-22T00:00:00Z',
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: '王小明您好，提醒您今天要記得量血壓喔！',
    isRead: true,
    createdAt: '2024-03-19T10:00:00Z',
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: '好的，謝謝提醒！',
    isRead: true,
    createdAt: '2024-03-19T10:05:00Z',
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    content: '您最近的血壓有點偏高，請特別注意飲食控制。',
    isRead: false,
    createdAt: '2024-03-20T09:00:00Z',
  },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [dialysisRecords, setDialysisRecords] = useState<DialysisRecord[]>([]);
  const [vitalsRecords, setVitalsRecords] = useState<VitalsRecord[]>([]);
  const [exitSiteCareRecords, setExitSiteCareRecords] = useState<ExitSiteCareRecord[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      
      setTimeout(() => {
        try {
          const { dialysisRecords, vitalsRecords, alerts } = generateMockData(user.id);
          
          setDialysisRecords(dialysisRecords);
          setVitalsRecords(vitalsRecords);
          setAlerts(alerts);
          setError(null);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    }
  }, [user]);

  const addDialysisRecord = async (
    record: Omit<DialysisRecord, 'id' | 'patientId' | 'createdAt'>
  ) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRecord: DialysisRecord = {
        id: `dialysis_${Date.now()}`,
        patientId: user.id,
        ...record,
        createdAt: new Date().toISOString(),
      };
      
      setDialysisRecords(prev => [newRecord, ...prev]);
      
      if (record.appearance !== 'clear') {
        const newAlert: Alert = {
          id: `alert_${Date.now()}`,
          patientId: user.id,
          type: 'dialysis',
          message: `透析液外觀${
            record.appearance === 'cloudy' ? '混濁' : 
            record.appearance === 'bloody' ? '血性' : '異常'
          }，請留意可能的感染風險`,
          date: record.date,
          isResolved: false,
          createdAt: new Date().toISOString(),
        };
        
        setAlerts(prev => [newAlert, ...prev]);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addVitalsRecord = async (
    record: Omit<VitalsRecord, 'id' | 'patientId' | 'createdAt'>
  ) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRecord: VitalsRecord = {
        id: `vitals_${Date.now()}`,
        patientId: user.id,
        ...record,
        createdAt: new Date().toISOString(),
      };
      
      setVitalsRecords(prev => [newRecord, ...prev]);
      
      const alerts = [];
      
      if (record.systolicBP > 140 || record.systolicBP < 90 || 
          record.diastolicBP > 90 || record.diastolicBP < 60) {
        alerts.push({
          id: `alert_bp_${Date.now()}`,
          patientId: user.id,
          type: 'bp',
          message: `血壓異常 (${record.systolicBP}/${record.diastolicBP} mmHg)，請持續監測`,
          date: record.date,
          isResolved: false,
          createdAt: new Date().toISOString(),
        });
      }
      
      if (record.bloodSugar && (record.bloodSugar > 180 || record.bloodSugar < 70)) {
        alerts.push({
          id: `alert_bs_${Date.now()}`,
          patientId: user.id,
          type: 'bloodSugar',
          message: `血糖${record.bloodSugar > 180 ? '過高' : '過低'} (${record.bloodSugar} mg/dL)，請留意飲食與症狀`,
          date: record.date,
          isResolved: false,
          createdAt: new Date().toISOString(),
        });
      }
      
      if (alerts.length > 0) {
        setAlerts(prev => [...alerts, ...prev]);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addExitSiteCareRecord = async (
    record: Omit<ExitSiteCareRecord, 'id' | 'patientId' | 'createdAt'>
  ) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRecord: ExitSiteCareRecord = {
        id: `exitcare_${Date.now()}`,
        patientId: user.id,
        ...record,
        createdAt: new Date().toISOString(),
      };
      
      setExitSiteCareRecords(prev => [newRecord, ...prev]);

      if (record.appearance !== 'normal') {
        const newAlert: Alert = {
          id: `alert_exitcare_${Date.now()}`,
          patientId: user.id,
          type: 'dialysis',
          message: `導管出口${
            record.appearance === 'red' ? '發紅' :
            record.appearance === 'swollen' ? '腫脹' :
            '有分泌物'
          }，請留意感染風險`,
          date: record.date,
          isResolved: false,
          createdAt: new Date().toISOString(),
        };
        
        setAlerts(prev => [newAlert, ...prev]);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = async (message: Omit<Message, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage: Message = {
        id: `message_${Date.now()}`,
        ...message,
        createdAt: new Date().toISOString(),
      };
      
      setMessages(prev => [newMessage, ...prev]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    dialysisRecords,
    vitalsRecords,
    exitSiteCareRecords,
    alerts,
    messages,
    patients,
    addDialysisRecord,
    addVitalsRecord,
    addExitSiteCareRecord,
    addMessage,
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

const generateMockData = (patientId: string) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const dialysisRecords: DialysisRecord[] = [
    {
      id: '1',
      patientId,
      date: yesterday.toISOString().split('T')[0],
      time: '08:00',
      inflowVolume: 2000,
      outflowVolume: 2200,
      appearance: 'clear',
      hasAbdominalPain: false,
      symptoms: [],
      createdAt: yesterday.toISOString(),
    },
    {
      id: '2',
      patientId,
      date: twoDaysAgo.toISOString().split('T')[0],
      time: '14:00',
      inflowVolume: 2000,
      outflowVolume: 1900,
      appearance: 'cloudy',
      hasAbdominalPain: true,
      painLevel: 3,
      symptoms: ['nausea'],
      notes: '今日透析液略混濁，有輕微腹痛',
      createdAt: twoDaysAgo.toISOString(),
    },
  ];
  
  const vitalsRecords: VitalsRecord[] = [
    {
      id: '1',
      patientId,
      date: yesterday.toISOString().split('T')[0],
      systolicBP: 135,
      diastolicBP: 85,
      weight: 65.5,
      bloodSugar: 110,
      createdAt: yesterday.toISOString(),
    },
    {
      id: '2',
      patientId,
      date: twoDaysAgo.toISOString().split('T')[0],
      systolicBP: 142,
      diastolicBP: 88,
      weight: 66.2,
      bloodSugar: 125,
      notes: '今日略感疲倦，食慾稍差',
      createdAt: twoDaysAgo.toISOString(),
    },
  ];
  
  const alerts: Alert[] = [
    {
      id: '1',
      patientId,
      type: 'bp',
      message: '收縮壓超過 140 mmHg，請留意血壓變化',
      date: twoDaysAgo.toISOString().split('T')[0],
      isResolved: true,
      resolvedBy: '2',
      resolvedAt: yesterday.toISOString(),
      createdAt: twoDaysAgo.toISOString(),
    },
    {
      id: '2',
      patientId,
      type: 'dialysis',
      message: '透析液外觀混濁，可能有感染風險，請諮詢醫療人員',
      date: twoDaysAgo.toISOString().split('T')[0],
      isResolved: false,
      createdAt: twoDaysAgo.toISOString(),
    },
  ];
  
  return { dialysisRecords, vitalsRecords, alerts };
};