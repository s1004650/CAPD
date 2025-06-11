import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { AlertRecord } from '../../types';

interface AlertsWidgetProps {
  alertRecords: AlertRecord[];
  onViewAll: () => void;
}

const AlertsWidget: React.FC<AlertsWidgetProps> = ({ alertRecords, onViewAll }) => {
  const sortedAlertRecords = [...alertRecords].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getAlertTypeText = (type: 'bp' | 'weight' | 'bloodGlucose' | 'dialysis') => {
    switch(type) {
      case 'bp': return '血壓異常';
      case 'weight': return '體重變化';
      case 'bloodGlucose': return '血糖異常';
      case 'dialysis': return '透析異常';
      default: return '未知類型';
    }
  };

  const getAlertTypeColor = (type: 'bp' | 'weight' | 'bloodGlucose' | 'dialysis') => {
    switch(type) {
      case 'bp': return 'bg-red-100 text-red-800';
      case 'weight': return 'bg-amber-100 text-amber-800';
      case 'bloodGlucose': return 'bg-purple-100 text-purple-800';
      case 'dialysis': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <AlertTriangle size={20} className="text-amber-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">健康警示</h2>
        </div>
        <button 
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          查看全部
          <ChevronRight size={16} />
        </button>
      </div>

      {sortedAlertRecords.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-500">目前沒有健康警示，繼續保持！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedAlertRecords.slice(0, 5).map((alert) => (
            <div key={alert.id} className="flex items-start p-3 rounded-lg bg-gray-50 border-l-4 border-amber-500">
              <div className="flex-grow">
                <div className="flex items-center mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getAlertTypeColor(alert.type)}`}>
                    {getAlertTypeText(alert.type)}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">{formatDate(alert.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-800">{alert.content}</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <span className={`inline-flex h-2 w-2 rounded-full ${alert.isResolved ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
            </div>
          ))}
          
          {sortedAlertRecords.length > 5 && (
            <p className="text-sm text-center text-gray-500 mt-2">
              顯示最新 5 筆，共 {sortedAlertRecords.length} 筆警示
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsWidget;