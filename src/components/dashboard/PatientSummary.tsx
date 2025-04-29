import React from 'react';
import { Activity, Droplet, Weight, BarChart2 } from 'lucide-react';
import { DialysisRecord, VitalsRecord } from '../../types';

interface PatientSummaryProps {
  latestDialysis?: DialysisRecord;
  latestVitals?: VitalsRecord;
  completedToday: {
    dialysis: boolean;
    vitals: boolean;
  };
}

const PatientSummary: React.FC<PatientSummaryProps> = ({
  latestDialysis,
  latestVitals,
  completedToday,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '無紀錄';
    
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">今日狀態摘要</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Droplet size={20} className="text-blue-600 mr-2" />
            <h3 className="font-medium text-blue-800">透析紀錄</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">完成狀態</span>
              <span className={`text-sm font-medium ${completedToday.dialysis ? 'text-green-600' : 'text-amber-600'}`}>
                {completedToday.dialysis ? '已完成' : '未完成'}
              </span>
            </div>
            
            {latestDialysis && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">最新紀錄日期</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDate(latestDialysis.date)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">注入/引流量</span>
                  <span className="text-sm font-medium text-gray-800">
                    {latestDialysis.inflowVolume}/{latestDialysis.outflowVolume} ml
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">脫水量</span>
                  <span className={`text-sm font-medium ${
                    (latestDialysis.outflowVolume - latestDialysis.inflowVolume) < 0 
                      ? 'text-red-600' 
                      : 'text-gray-800'
                  }`}>
                    {latestDialysis.outflowVolume - latestDialysis.inflowVolume} ml
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">液體外觀</span>
                  <span className={`text-sm font-medium ${
                    latestDialysis.appearance !== 'clear' ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    {latestDialysis.appearance === 'clear' && '清澈'}
                    {latestDialysis.appearance === 'cloudy' && '混濁'}
                    {latestDialysis.appearance === 'bloody' && '血性'}
                    {latestDialysis.appearance === 'other' && '其他'}
                  </span>
                </div>
              </>
            )}
            
            {!latestDialysis && (
              <div className="text-sm text-gray-500 italic">無透析紀錄</div>
            )}
          </div>
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Activity size={20} className="text-indigo-600 mr-2" />
            <h3 className="font-medium text-indigo-800">生命徵象</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">完成狀態</span>
              <span className={`text-sm font-medium ${completedToday.vitals ? 'text-green-600' : 'text-amber-600'}`}>
                {completedToday.vitals ? '已完成' : '未完成'}
              </span>
            </div>
            
            {latestVitals && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">最新紀錄日期</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDate(latestVitals.date)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">血壓</span>
                  <span className={`text-sm font-medium ${
                    (latestVitals.systolicBP > 140 || latestVitals.systolicBP < 90 || 
                     latestVitals.diastolicBP > 90 || latestVitals.diastolicBP < 60) 
                      ? 'text-red-600' 
                      : 'text-gray-800'
                  }`}>
                    {latestVitals.systolicBP}/{latestVitals.diastolicBP} mmHg
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">體重</span>
                  <span className="text-sm font-medium text-gray-800">
                    {latestVitals.weight} kg
                  </span>
                </div>
                
                {latestVitals.bloodSugar && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">血糖</span>
                    <span className={`text-sm font-medium ${
                      (latestVitals.bloodSugar > 180 || latestVitals.bloodSugar < 70) 
                        ? 'text-red-600' 
                        : 'text-gray-800'
                    }`}>
                      {latestVitals.bloodSugar} mg/dL
                    </span>
                  </div>
                )}
              </>
            )}
            
            {!latestVitals && (
              <div className="text-sm text-gray-500 italic">無生命徵象紀錄</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800">今日待辦事項</h3>
          <span className="text-sm text-gray-500">
            {completedToday.dialysis && completedToday.vitals 
              ? '全部完成' 
              : `完成 ${[completedToday.dialysis, completedToday.vitals].filter(Boolean).length}/2`}
          </span>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className={`flex items-center rounded-md p-2 ${
            completedToday.dialysis ? 'bg-green-50' : 'bg-amber-50'
          }`}>
            <div className={`rounded-full w-5 h-5 flex items-center justify-center mr-3 ${
              completedToday.dialysis ? 'bg-green-500 text-white' : 'border border-amber-500'
            }`}>
              {completedToday.dialysis && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${completedToday.dialysis ? 'text-green-800 line-through' : 'text-amber-800'}`}>
              紀錄今日透析狀況
            </span>
          </div>
          
          <div className={`flex items-center rounded-md p-2 ${
            completedToday.vitals ? 'bg-green-50' : 'bg-amber-50'
          }`}>
            <div className={`rounded-full w-5 h-5 flex items-center justify-center mr-3 ${
              completedToday.vitals ? 'bg-green-500 text-white' : 'border border-amber-500'
            }`}>
              {completedToday.vitals && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${completedToday.vitals ? 'text-green-800 line-through' : 'text-amber-800'}`}>
              紀錄今日生命徵象
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;