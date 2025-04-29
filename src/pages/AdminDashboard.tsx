import React, { useState } from 'react';
import { Users, AlertTriangle, FileText, Activity } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';

// 模擬資料 - 實際應用中會從API獲取
const patientSummaries = [
  {
    id: '1',
    name: '王小明',
    age: 65,
    gender: '男',
    dialysisStartDate: '2022-03-15',
    lastRecord: '2023-06-10',
    status: 'normal', // normal, warning, danger
    alerts: 1,
    lastBP: '135/85',
    lastWeight: '65.5',
    lastBloodSugar: '110',
    lastDialysis: {
      date: '2023-06-10',
      inflowVolume: 2000,
      outflowVolume: 2200,
      appearance: 'clear',
    },
  },
  {
    id: '2',
    name: '李小華',
    age: 58,
    gender: '女',
    dialysisStartDate: '2021-11-22',
    lastRecord: '2023-06-09',
    status: 'warning',
    alerts: 2,
    lastBP: '142/90',
    lastWeight: '52.2',
    lastBloodSugar: '155',
    lastDialysis: {
      date: '2023-06-09',
      inflowVolume: 2000,
      outflowVolume: 1800,
      appearance: 'cloudy',
    },
  },
  {
    id: '3',
    name: '張大成',
    age: 72,
    gender: '男',
    dialysisStartDate: '2020-06-18',
    lastRecord: '2023-06-05',
    status: 'danger',
    alerts: 3,
    lastBP: '162/95',
    lastWeight: '70.8',
    lastBloodSugar: '180',
    lastDialysis: {
      date: '2023-06-05',
      inflowVolume: 2000,
      outflowVolume: 1900,
      appearance: 'bloody',
    },
  },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'warning' | 'danger'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 根據篩選條件過濾病患
  const filteredPatients = patientSummaries.filter((patient) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'warning' && (patient.status === 'warning' || patient.status === 'danger')) ||
      (filter === 'danger' && patient.status === 'danger');

    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // 警示狀態對應的樣式
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'danger':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'warning':
        return 'bg-amber-100 border-amber-500 text-amber-800';
      default:
        return 'bg-green-100 border-green-500 text-green-800';
    }
  };

  // 顯示最後透析液狀況
  const getAppearanceText = (appearance: string) => {
    switch (appearance) {
      case 'cloudy':
        return '混濁';
      case 'bloody':
        return '血性';
      case 'clear':
        return '清澈';
      default:
        return '其他';
    }
  };

  const getAppearanceStyle = (appearance: string) => {
    switch (appearance) {
      case 'cloudy':
        return 'text-amber-600';
      case 'bloody':
        return 'text-red-600';
      case 'clear':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">您好，{user?.name}！</h1>
        <p className="text-gray-600">歡迎回到個案管理師控制台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">總病患數</p>
              <p className="text-2xl font-semibold">{patientSummaries.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 mr-4">
              <AlertTriangle size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">警示數量</p>
              <p className="text-2xl font-semibold">
                {patientSummaries.reduce((sum, patient) => sum + patient.alerts, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">今日紀錄筆數</p>
              <p className="text-2xl font-semibold">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Activity size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">需關注病患</p>
              <p className="text-2xl font-semibold">
                {patientSummaries.filter(p => p.status !== 'normal').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">病患監控總覽</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <input
                  type="text"
                  placeholder="搜尋病患"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">全部病患</option>
                  <option value="warning">需關注</option>
                  <option value="danger">緊急關注</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  病患
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最近紀錄
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  血壓
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  體重
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  血糖
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  透析液
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  警示
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className={patient.status !== 'normal' ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        patient.status === 'danger' 
                          ? 'bg-red-100 text-red-600' 
                          : patient.status === 'warning'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-blue-100 text-blue-600'
                      }`}>
                        <span className="text-lg font-medium">{patient.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.age}歲 {patient.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.lastRecord}</div>
                    <div className="text-xs text-gray-500">
                      開始透析: {patient.dialysisStartDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      parseInt(patient.lastBP.split('/')[0]) > 140 || 
                      parseInt(patient.lastBP.split('/')[1]) > 90
                        ? 'text-red-600 font-medium'
                        : 'text-gray-900'
                    }`}>
                      {patient.lastBP}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.lastWeight} kg</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      parseInt(patient.lastBloodSugar) > 140
                        ? 'text-red-600 font-medium'
                        : 'text-gray-900'
                    }`}>
                      {patient.lastBloodSugar} mg/dL
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getAppearanceStyle(patient.lastDialysis.appearance)}`}>
                      {getAppearanceText(patient.lastDialysis.appearance)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {patient.lastDialysis.outflowVolume - patient.lastDialysis.inflowVolume} ml
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-start">
                      {patient.alerts > 0 && (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.alerts >= 3
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {patient.alerts} 警示
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">查看</button>
                    <button className="text-indigo-600 hover:text-indigo-900">發送訊息</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;