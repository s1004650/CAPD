import React, { createContext, useContext, useState, useEffect } from 'react';
import { DialysisRecord, VitalsRecord, Alert, Message } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  dialysisRecords: DialysisRecord[];
  vitalsRecords: VitalsRecord[];
  alerts: Alert[];
  messages: Message[];
  addDialysisRecord: (record: Omit<DialysisRecord, 'id' | 'patientId' | 'createdAt'>) => Promise<void>;
  addVitalsRecord: (record: Omit<VitalsRecord, 'id' | 'patientId' | 'createdAt'>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// 創建 Context
const DataContext = createContext<DataContextType | undefined>(undefined);

// 模擬初始資料
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
  
  const messages: Message[] = [
    {
      id: '1',
      senderId: '2',
      receiverId: patientId,
      content: '王小明您好，我是您的個案管理師林醫師。看到您昨天的透析液有混濁情況，請問今天的狀況如何？如果持續混濁請儘快回診。',
      isRead: true,
      createdAt: yesterday.toISOString(),
    },
    {
      id: '2',
      senderId: '2',
      receiverId: patientId,
      content: '提醒您，最近天氣變化大，請注意保暖並維持良好的透析環境衛生，避免感染風險。有任何不適請立即聯繫我。',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ];
  
  return { dialysisRecords, vitalsRecords, alerts, messages };
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [dialysisRecords, setDialysisRecords] = useState<DialysisRecord[]>([]);
  const [vitalsRecords, setVitalsRecords] = useState<VitalsRecord[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 載入模擬資料
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      
      // 模擬API請求延遲
      setTimeout(() => {
        try {
          const { dialysisRecords, vitalsRecords, alerts, messages } = generateMockData(user.id);
          
          setDialysisRecords(dialysisRecords);
          setVitalsRecords(vitalsRecords);
          setAlerts(alerts);
          setMessages(messages);
          setError(null);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    }
  }, [user]);

  // 新增透析紀錄
  const addDialysisRecord = async (
    record: Omit<DialysisRecord, 'id' | 'patientId' | 'createdAt'>
  ) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // 模擬API請求延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRecord: DialysisRecord = {
        id: `dialysis_${Date.now()}`,
        patientId: user.id,
        ...record,
        createdAt: new Date().toISOString(),
      };
      
      setDialysisRecords(prev => [newRecord, ...prev]);
      
      // 自動檢查是否需要生成警示
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

  // 新增生命徵象紀錄
  const addVitalsRecord = async (
    record: Omit<VitalsRecord, 'id' | 'patientId' | 'createdAt'>
  ) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // 模擬API請求延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRecord: VitalsRecord = {
        id: `vitals_${Date.now()}`,
        patientId: user.id,
        ...record,
        createdAt: new Date().toISOString(),
      };
      
      setVitalsRecords(prev => [newRecord, ...prev]);
      
      // 自動檢查是否需要生成警示
      const alerts = [];
      
      // 血壓檢查
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
      
      // 血糖檢查
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

  const value = {
    dialysisRecords,
    vitalsRecords,
    alerts,
    messages,
    addDialysisRecord,
    addVitalsRecord,
    isLoading,
    error,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Hook 用來存取 Context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData 必須在 DataProvider 內使用');
  }
  return context;
};