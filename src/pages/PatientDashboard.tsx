import React, { useMemo, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import PatientSummary from '../components/dashboard/PatientSummary';
import LineChart from '../components/charts/LineChart';
import GaugeChart from '../components/charts/GaugeChart';
import AlertsWidget from '../components/dashboard/AlertsWidget';
import MessagesWidget from '../components/dashboard/MessagesWidget';
import MonthlyCalendar from '../components/dashboard/MonthlyCalendar';
import { Link, useNavigate } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { dialysisRecords, fetchDialysisRecords, vitalsignRecords, fetchVitalsignRecords,
    exitsiteCareRecords, fetchExitsiteCareRecords, alertRecords, fetchAlertRecords,
    messages, fetchMessages, dialysisSettings, fetchDialysisSettings } = useData();
  const navigate = useNavigate();

useEffect(() => {
  if (user) {
    const fetchData = async (userId: string) => {
      try {
        await Promise.all([
          fetchDialysisRecords(userId),
          fetchVitalsignRecords(userId),
          fetchExitsiteCareRecords(userId),
          fetchAlertRecords(userId),
          fetchMessages(userId),
          fetchDialysisSettings(userId),
        ]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData(user.id);
  }
}, [user]);
  
  const today = new Date().toISOString().split('T')[0];
  
  const completedToday = useMemo(() => {
    return {
      dialysis: dialysisRecords.some(record => record.recordDate.split('T')[0] === today),
      vitalsign: vitalsignRecords.some(record => record.recordDate.split('T')[0] === today),
      exitsiteCare: exitsiteCareRecords.some(record => record.recordDate.split('T')[0] === today),
    };
  }, [dialysisRecords, vitalsignRecords, exitsiteCareRecords, today]);

  const todayDialysisRecords = useMemo(() => {
    return dialysisRecords.filter(record => record.recordDate.split('T')[0] === today);
  }, [dialysisRecords, today]);

  const todayDialysisCount = useMemo(() => {
    return todayDialysisRecords.length;
  }, [todayDialysisRecords]);
  
  const latestDialysis = useMemo(() => {
    return dialysisRecords.length > 0 ? dialysisRecords[0] : undefined;
  }, [dialysisRecords]);
  
  const latestVitalsign = useMemo(() => {
    return vitalsignRecords.length > 0 ? vitalsignRecords[0] : undefined;
  }, [vitalsignRecords]);

  const latestExitsiteCare = useMemo(() => {
    return exitsiteCareRecords.length > 0 ? exitsiteCareRecords[0] : undefined;
  }, [exitsiteCareRecords]);
  
  const bpData = useMemo(() => {
    return vitalsignRecords.map(record => ({
      date: record.recordDate,
      value: record.systolicBP,
    }));
  }, [vitalsignRecords]);
  
  const weightData = useMemo(() => {
    return dialysisRecords.map(record => ({
      date: record.recordDate,
      value: record.weight,
    }));
  }, [dialysisRecords]);
  
  const drainageData = useMemo(() => {
    // Group records by date and calculate total drainage for each day
    const dailyDrainage = dialysisRecords.reduce((acc, record) => {
      const date = record.recordDate;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += (record.drainedVolume - record.infusedVolume);
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format needed for LineChart
    return Object.entries(dailyDrainage)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [dialysisRecords]);
  
  const bloodGlucoseData = useMemo(() => {
    return vitalsignRecords
      .filter(record => record.bloodGlucose !== undefined)
      .map(record => ({
        date: record.recordDate,
        value: record.bloodGlucose as number,
      }));
  }, [vitalsignRecords]);
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">您好，{user?.fullName}！</h1>
        <p className="text-gray-600">歡迎回到您的健康監測儀表板</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <PatientSummary 
            latestDialysis={latestDialysis}
            latestVitalsign={latestVitalsign}
            latestExitsiteCare={latestExitsiteCare}
            completedToday={completedToday}
            dialysisSettings={dialysisSettings[0]}
            todayDialysisCount={todayDialysisCount}
            todayDialysisRecords={todayDialysisRecords}
          />
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">快速操作</h2>
            
            <div className="space-y-3">
              <Link
                to="/dialysis-records"
                className="flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-full">
                  <PlusCircle size={20} className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <span className="block text-sm font-medium text-blue-800">新增透析紀錄</span>
                  <span className="block text-xs text-blue-600">
                    {todayDialysisCount}/{dialysisSettings[0]?.exchangeTimesPerday} 次完成
                  </span>
                </div>
              </Link>
              
              <Link
                to="/vitalsign-records"
                className="flex items-center p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <div className="p-2 bg-indigo-100 rounded-full">
                  <PlusCircle size={20} className="text-indigo-600" />
                </div>
                <div className="ml-3">
                  <span className="block text-sm font-medium text-indigo-800">新增生命徵象</span>
                  <span className="block text-xs text-indigo-600">血壓、血糖紀錄</span>
                </div>
              </Link>

              <Link
                to="/exitsite-care-records"
                className="flex items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-full">
                  <PlusCircle size={20} className="text-purple-600" />
                </div>
                <div className="ml-3">
                  <span className="block text-sm font-medium text-purple-800">出口照護紀錄</span>
                  <span className="block text-xs text-purple-600">檢查導管出口狀況</span>
                </div>
              </Link>
              
              <Link
                to="/messages"
                className="flex items-center p-3 rounded-lg bg-cyan-50 hover:bg-cyan-100 transition-colors"
              >
                <div className="p-2 bg-cyan-100 rounded-full">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <span className="block text-sm font-medium text-cyan-800">查看訊息</span>
                  <span className="block text-xs text-cyan-600">
                    {messages.filter(m => !m.isRead).length > 0 
                      ? `${messages.filter(m => !m.isRead).length} 則未讀訊息` 
                      : '無未讀訊息'}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
          <MonthlyCalendar 
            dialysisRecords={dialysisRecords}
            vitalsignRecords={vitalsignRecords}
          />
        </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">趨勢分析</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LineChart 
            title="血壓趨勢"
            data={bpData}
            unit="mmHg"
            highThreshold={140}
            lowThreshold={90}
            color="rgb(239, 68, 68)"
          />
          
          <LineChart 
            title="體重趨勢"
            data={weightData}
            unit="kg"
            color="rgb(16, 185, 129)"
          />

          <LineChart 
            title="每日總脫水量趨勢"
            data={drainageData}
            unit="ml"
            color="rgb(59, 130, 246)"
          />
          
          {bloodGlucoseData.length > 0 && (
            <LineChart 
              title="血糖趨勢"
              data={bloodGlucoseData}
              unit="mg/dL"
              highThreshold={180}
              lowThreshold={70}
              color="rgb(139, 92, 246)"
            />
          )}
        </div>
      </div>
      
      {latestVitalsign && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">即時監測</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GaugeChart
              title="最新收縮壓"
              value={latestVitalsign.systolicBP}
              min={80}
              max={180}
              unit="mmHg"
              thresholds={{
                low: 90,
                high: 140,
              }}
            />
            
            <GaugeChart
              title="最新舒張壓"
              value={latestVitalsign.diastolicBP}
              min={40}
              max={120}
              unit="mmHg"
              thresholds={{
                low: 60,
                high: 90,
              }}
            />
            
            <GaugeChart
              title="最新體重"
              value={latestDialysis?.weight ?? 0}
              min={40}
              max={100}
              unit="kg"
            />
            
            {latestVitalsign.bloodGlucose && (
              <GaugeChart
                title="最新血糖"
                value={latestVitalsign.bloodGlucose}
                min={50}
                max={250}
                unit="mg/dL"
                thresholds={{
                  low: 70,
                  high: 180,
                }}
              />
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AlertsWidget 
          alertRecords={alertRecords}
          onViewAll={() => navigate('/alert-records')}
        />
        
        <MessagesWidget 
          messages={messages}
          onViewAll={() => navigate('/messages')}
        />
      </div>
    </Layout>
  );
};

export default PatientDashboard;