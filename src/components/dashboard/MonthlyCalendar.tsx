import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { DialysisRecord, VitalsignRecord } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthlyCalendarProps {
  dialysisRecords: DialysisRecord[];
  vitalsignRecords: VitalsignRecord[];
  month?: Date;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  dialysisRecords,
  vitalsignRecords,
  month: initialMonth = new Date(),
}) => {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayRecords = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayDialysis = dialysisRecords.filter(record => record.recordDate.startsWith(dateStr));
    const dayVitals = vitalsignRecords.find(record => record.recordDate.startsWith(dateStr));
    
    const totalDrainage = dayDialysis.reduce((sum, record) => 
      sum + (record.ultrafiltrationVolume), 0
    );

    const weight = dayDialysis.length > 0 ? dayDialysis[dayDialysis.length - 1].weight : '';

    return {
      totalDrainage,
      bp: dayVitals?.systolicBP && dayVitals?.diastolicBP 
        ? `${dayVitals.systolicBP}/${dayVitals.diastolicBP}`
        : null,
      bloodSugar: dayVitals?.bloodGlucose,
      weight,
    };
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {format(currentMonth, 'yyyy年 MM月', { locale: zhTW })}每日紀錄
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousMonth}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs md:text-sm font-medium text-gray-700 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {days.map(day => {
          const records = getDayRecords(day);
          const isCurrentDay = isToday(day);
          const hasRecords = records.totalDrainage !== 0 || records.bp || records.bloodSugar || records.weight;
          
          return (
            <div 
              key={day.toString()}
              className={`relative p-1 md:p-2 min-h-[100px] md:min-h-[140px] rounded-lg ${
                hasRecords ? 'bg-blue-50' : 'bg-gray-50'
              } ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-right mb-1 ${
                isCurrentDay ? 'text-blue-600 font-bold' : 'text-gray-600'
              }`}>
                <span className="text-xs md:text-sm">
                  {format(day, 'd')}
                </span>
              </div>
              
              {hasRecords && (
                <div className="space-y-1 text-[10px] md:text-xs">
                  {records.totalDrainage !== 0 && (
                    <div className="text-blue-800">
                      <span className="text-gray-600">脫水：</span>
                      {records.totalDrainage}ml
                    </div>
                  )}
                  
                  {records.bp && (
                    <div className={`${
                      parseInt(records.bp.split('/')[0]) > 140 || 
                      parseInt(records.bp.split('/')[0]) < 90 ||
                      parseInt(records.bp.split('/')[1]) > 90 ||
                      parseInt(records.bp.split('/')[1]) < 60
                        ? 'text-red-600 font-medium'
                        : 'text-gray-600'
                    }`}>
                      <span className="text-gray-600">血壓：</span>
                      {records.bp}
                    </div>
                  )}
                  
                  {records.bloodSugar && (
                    <div className={`${
                      records.bloodSugar > 180 || records.bloodSugar < 70
                        ? 'text-red-600 font-medium'
                        : 'text-gray-600'
                    }`}>
                      <span className="text-gray-600">血糖：</span>
                      {records.bloodSugar}
                    </div>
                  )}
                  
                  {records.weight && (
                    <div className="text-gray-600">
                      <span>體重：</span>
                      {records.weight}kg
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-800 mr-1"></div>
          <span>脫水量(ml)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-600 mr-1"></div>
          <span>血壓(mmHg)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-600 mr-1"></div>
          <span>血糖(mg/dL)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-600 mr-1"></div>
          <span>體重(kg)</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendar;