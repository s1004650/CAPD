import React, { useState, useEffect } from 'react';
import { AlertTriangle, /* Filter, */Check/*, X*/ } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/layout/Layout';
import { stringToDateTime } from '../types/utils';

const AlertsPage: React.FC = () => {
  const { alertRecords, fetchAlertRecords } = useData();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  // const [severityFilter, setSeverityFilter] = useState<'all' | 'warning' | 'critical'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'bp' | 'weight' | 'dialysis' | 'bloodGlucose'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAlertRecords();
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  
  const filteredAlerts = alertRecords.filter(alert => {
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && !alert.isResolved) ||
      (statusFilter === 'resolved' && alert.isResolved);

    /* const matchesSeverity =
      severityFilter === 'all' || alert.severity === severityFilter; */

    const matchesType =
      typeFilter === 'all' || alert.type === typeFilter;

    return matchesStatus/* && matchesSeverity*/ && matchesType;
  });

  const getTypeText = (type: string) => {
    switch (type) {
      case 'bp':
        return '血壓異常';
      case 'weight':
        return '體重異常';
      case 'dialysis':
        return '透析異常';
      case 'bloodGlucose':
        return '血糖異常';
      default:
        return '其他異常';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bp':
        return 'bg-red-100 text-red-800';
      case 'weight':
        return 'bg-yellow-100 text-yellow-800';
      case 'dialysis':
        return 'bg-purple-100 text-purple-800';
      case 'bloodGlucose':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /* const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }; */

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">異常警示</h1>
        <p className="text-gray-600">監控並處理病人的異常狀況</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">狀態篩選</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全部狀態</option>
                  <option value="active">未處理</option>
                  <option value="resolved">已處理</option>
                </select>
              </div>
              
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">嚴重程度</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as any)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全部程度</option>
                  <option value="warning">警告</option>
                  <option value="critical">緊急</option>
                </select>
              </div> */}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">異常類型</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全部類型</option>
                  <option value="bp">血壓異常</option>
                  <option value="weight">體重異常</option>
                  <option value="dialysis">透析異常</option>
                  <option value="bloodGlucose">血糖異常</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="p-6 space-y-6">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">沒有警示</h3>
                <p className="mt-1 text-sm text-gray-500">目前沒有符合條件的警示</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 ${
                    alert.isResolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(alert.type)}`}>
                          {getTypeText(alert.type)}
                        </span>
                        {/* <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity === 'critical' ? '緊急' : '警告'}
                        </span> */}
                        <span className="ml-2 text-sm text-gray-500">
                          {stringToDateTime(alert.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {alert.userName}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700">{alert.content}</p>
                      
                      {alert.isResolved && (
                        <div className="mt-2 text-sm text-gray-500">
                          已由 {alert.resolvedId} 處理於 {stringToDateTime(alert.resolvedAt!)}
                        </div>
                      )}
                    </div>
                    
                    {!alert.isResolved && (
                      <div className="flex space-x-2">
                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <Check size={16} className="mr-1" />
                          標記已處理
                        </button>
                        <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          發送訊息
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AlertsPage;