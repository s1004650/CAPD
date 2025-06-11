import React from 'react';
import { Activity, Droplet, Weight, BarChart2, Microscope } from 'lucide-react';
import { DialysisRecord, VitalsignRecord, ExitsiteCareRecord, DialysisSetting } from '../../types';

interface PatientSummaryProps {
  latestDialysis?: DialysisRecord;
  latestVitalsign?: VitalsignRecord;
  latestExitsiteCare?: ExitsiteCareRecord;
  completedToday: {
    dialysis: boolean;
    vitalsign: boolean;
    exitsiteCare: boolean;
  };
  dialysisSettings: DialysisSetting;
  todayDialysisCount: number;
  todayDialysisRecords?: DialysisRecord[];
}

const PatientSummary: React.FC<PatientSummaryProps> = ({
  latestDialysis,
  latestVitalsign,
  latestExitsiteCare,
  completedToday,
  dialysisSettings,
  todayDialysisCount,
  todayDialysisRecords = [],
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '無紀錄';
    
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 檢查今日透析是否完成
  const isDialysisCompleted = dialysisSettings 
    ? todayDialysisCount >= dialysisSettings.exchangeTimesPerday
    : completedToday.dialysis;

  // 計算今日總脫水量
  const totalDrainageVolume = todayDialysisRecords.reduce((total, record) => {
    return total + record.ultrafiltrationVolume;
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">今日狀態摘要</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Droplet size={20} className="text-blue-600 mr-2" />
            <h3 className="font-medium text-blue-800">透析紀錄</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">完成狀態</span>
              <div className="flex items-center">
                <span className={`text-sm font-medium ${isDialysisCompleted ? 'text-green-600' : 'text-amber-600'}`}>
                  {isDialysisCompleted ? '已完成' : '未完成'}
                </span>
                {dialysisSettings && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({todayDialysisCount}/{dialysisSettings.exchangeTimesPerday}次)
                  </span>
                )}
              </div>
            </div>
            
            {latestDialysis && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">最新紀錄日期</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDate(latestDialysis.recordDate)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">注入/引流量</span>
                  <span className="text-sm font-medium text-gray-800">
                    {latestDialysis.infusedVolume}/{latestDialysis.drainedVolume} ml
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">最新脫水量</span>
                  <span className={`text-sm font-medium ${
                    latestDialysis.ultrafiltrationVolume < 0 
                      ? 'text-red-600' 
                      : 'text-gray-800'
                  }`}>
                    {latestDialysis.ultrafiltrationVolume} ml
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">今日總脫水量</span>
                  <span className={`text-sm font-medium ${
                    totalDrainageVolume < 0 
                      ? 'text-red-600' 
                      : 'text-gray-800'
                  }`}>
                    {totalDrainageVolume} ml
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">液體外觀</span>
                  <span className={`text-sm font-medium ${
                    latestDialysis.dialysateAppearance !== 'clear' ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    {latestDialysis.dialysateAppearance === 'clear' && '清澈'}
                    {latestDialysis.dialysateAppearance === 'cloudy' && '混濁'}
                    {latestDialysis.dialysateAppearance === 'bloody' && '血性'}
                    {latestDialysis.dialysateAppearance === 'other' && '其他'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">體重</span>
                  <span className="text-sm font-medium text-gray-800">
                    {latestDialysis.weight} kg
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
              <span className={`text-sm font-medium ${completedToday.vitalsign ? 'text-green-600' : 'text-amber-600'}`}>
                {completedToday.vitalsign ? '已完成' : '未完成'}
              </span>
            </div>
            
            {latestVitalsign && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">最新紀錄日期</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDate(latestVitalsign.recordDate)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">血壓</span>
                  <span className={`text-sm font-medium ${
                    (latestVitalsign.systolicBP > 140 || latestVitalsign.systolicBP < 90 || 
                     latestVitalsign.diastolicBP > 90 || latestVitalsign.diastolicBP < 60) 
                      ? 'text-red-600' 
                      : 'text-gray-800'
                  }`}>
                    {latestVitalsign.systolicBP}/{latestVitalsign.diastolicBP} mmHg
                  </span>
                </div>
                
                {latestVitalsign.bloodGlucose && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">血糖</span>
                    <span className={`text-sm font-medium ${
                      (latestVitalsign.bloodGlucose > 180 || latestVitalsign.bloodGlucose < 70) 
                        ? 'text-red-600' 
                        : 'text-gray-800'
                    }`}>
                      {latestVitalsign.bloodGlucose} mg/dL
                    </span>
                  </div>
                )}
              </>
            )}
            
            {!latestVitalsign && (
              <div className="text-sm text-gray-500 italic">無生命徵象紀錄</div>
            )}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Microscope size={20} className="text-purple-600 mr-2" />
            <h3 className="font-medium text-purple-800">出口照護</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">完成狀態</span>
              <span className={`text-sm font-medium ${completedToday.exitsiteCare ? 'text-green-600' : 'text-amber-600'}`}>
                {completedToday.exitsiteCare ? '已完成' : '未完成'}
              </span>
            </div>
            
            {latestExitsiteCare && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">最新紀錄日期</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDate(latestExitsiteCare.recordDate)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">出口狀況</span>
                  <span className={`text-sm font-medium ${
                    latestExitsiteCare.exitsiteAppearance !== 'normal' ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    {latestExitsiteCare.exitsiteAppearance === 'normal' && '正常'}
                    {latestExitsiteCare.exitsiteAppearance === 'red' && '發紅'}
                    {latestExitsiteCare.exitsiteAppearance === 'swollen' && '腫脹'}
                    {latestExitsiteCare.exitsiteAppearance === 'discharge' && '有分泌物'}
                  </span>
                </div>
              </>
            )}
            
            <div className="text-sm text-gray-500">
              每日檢查導管出口是否：
              <ul className="mt-1 list-disc list-inside">
                <li>發紅、腫脹</li>
                <li>分泌物異常</li>
                <li>疼痛或不適</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800">今日待辦事項</h3>
          <span className="text-sm text-gray-500">
            {(isDialysisCompleted && completedToday.vitalsign && completedToday.exitsiteCare)
              ? '全部完成' 
              : `完成 ${[isDialysisCompleted, completedToday.vitalsign, completedToday.exitsiteCare].filter(Boolean).length}/3`}
          </span>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className={`flex items-center rounded-md p-2 ${
            isDialysisCompleted ? 'bg-green-50' : 'bg-amber-50'
          }`}>
            <div className={`rounded-full w-5 h-5 flex items-center justify-center mr-3 ${
              isDialysisCompleted ? 'bg-green-500 text-white' : 'border border-amber-500'
            }`}>
              {isDialysisCompleted && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <span className={`text-sm ${isDialysisCompleted ? 'text-green-800 line-through' : 'text-amber-800'}`}>
                紀錄今日透析狀況
              </span>
              {dialysisSettings && (
                <span className="block text-xs text-gray-500">
                  目標：每日 {dialysisSettings.exchangeTimesPerday} 次，每次 {dialysisSettings.exchangeVolumnePertime} ml
                </span>
              )}
            </div>
          </div>
          
          <div className={`flex items-center rounded-md p-2 ${
            completedToday.vitalsign ? 'bg-green-50' : 'bg-amber-50'
          }`}>
            <div className={`rounded-full w-5 h-5 flex items-center justify-center mr-3 ${
              completedToday.vitalsign ? 'bg-green-500 text-white' : 'border border-amber-500'
            }`}>
              {completedToday.vitalsign && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${completedToday.vitalsign ? 'text-green-800 line-through' : 'text-amber-800'}`}>
              紀錄今日生命徵象
            </span>
          </div>

          <div className={`flex items-center rounded-md p-2 ${
            completedToday.exitsiteCare ? 'bg-green-50' : 'bg-amber-50'
          }`}>
            <div className={`rounded-full w-5 h-5 flex items-center justify-center mr-3 ${
              completedToday.exitsiteCare ? 'bg-green-500 text-white' : 'border border-amber-500'
            }`}>
              {completedToday.exitsiteCare && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${completedToday.exitsiteCare ? 'text-green-800 line-through' : 'text-amber-800'}`}>
              檢查導管出口狀況
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;