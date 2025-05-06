import React, { useState } from 'react';
import { Calendar, Users, Activity, TrendingUp } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LineChart from '../components/charts/LineChart';
import GaugeChart from '../components/charts/GaugeChart';

// 模擬分析數據
const MOCK_ANALYTICS = {
  overview: {
    totalPatients: 125,
    activePatients: 118,
    averageCompliance: 87,
    alertsThisMonth: 45,
  },
  trends: {
    bloodPressure: [
      { date: '2024-03-01', value: 132 },
      { date: '2024-03-05', value: 128 },
      { date: '2024-03-10', value: 135 },
      { date: '2024-03-15', value: 130 },
      { date: '2024-03-20', value: 133 },
    ],
    weight: [
      { date: '2024-03-01', value: 65.2 },
      { date: '2024-03-05', value: 65.5 },
      { date: '2024-03-10', value: 65.8 },
      { date: '2024-03-15', value: 65.3 },
      { date: '2024-03-20', value: 65.6 },
    ],
    bloodSugar: [
      { date: '2024-03-01', value: 125 },
      { date: '2024-03-05', value: 132 },
      { date: '2024-03-10', value: 128 },
      { date: '2024-03-15', value: 135 },
      { date: '2024-03-20', value: 130 },
    ],
  },
  distributions: {
    ageGroups: [
      { group: '30-40', count: 15 },
      { group: '41-50', count: 28 },
      { group: '51-60', count: 35 },
      { group: '61-70', count: 25 },
      { group: '71+', count: 22 },
    ],
    complianceGroups: [
      { group: '極佳 (>90%)', count: 45 },
      { group: '良好 (80-90%)', count: 35 },
      { group: '普通 (70-80%)', count: 25 },
      { group: '需改善 (<70%)', count: 20 },
    ],
  },
};

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">數據分析</h1>
        <p className="text-gray-600">分析並追蹤病患健康指標趨勢</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">總病患數</p>
              <p className="text-2xl font-semibold text-gray-900">
                {MOCK_ANALYTICS.overview.totalPatients}
              </p>
              <p className="text-xs text-gray-500">
                活躍：{MOCK_ANALYTICS.overview.activePatients}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">平均配合度</p>
              <p className="text-2xl font-semibold text-gray-900">
                {MOCK_ANALYTICS.overview.averageCompliance}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: `${MOCK_ANALYTICS.overview.averageCompliance}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月警示</p>
              <p className="text-2xl font-semibold text-gray-900">
                {MOCK_ANALYTICS.overview.alertsThisMonth}
              </p>
              <p className="text-xs text-gray-500">
                較上月 +12%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 mr-4">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">數據時間範圍</p>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7' | '30' | '90')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="7">最近 7 天</option>
                <option value="30">最近 30 天</option>
                <option value="90">最近 90 天</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">血壓趨勢分析</h2>
          <LineChart
            title="平均收縮壓趨勢"
            data={MOCK_ANALYTICS.trends.bloodPressure}
            unit="mmHg"
            color="rgb(239, 68, 68)"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">體重趨勢分析</h2>
          <LineChart
            title="平均體重趨勢"
            data={MOCK_ANALYTICS.trends.weight}
            unit="kg"
            color="rgb(16, 185, 129)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">年齡分布</h2>
          <div className="space-y-4">
            {MOCK_ANALYTICS.distributions.ageGroups.map((group) => (
              <div key={group.group}>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{group.group}歲</span>
                  <span>{group.count}人</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(group.count / MOCK_ANALYTICS.overview.totalPatients) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">配合度分布</h2>
          <div className="space-y-4">
            {MOCK_ANALYTICS.distributions.complianceGroups.map((group) => (
              <div key={group.group}>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{group.group}</span>
                  <span>{group.count}人</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(group.count / MOCK_ANALYTICS.overview.totalPatients) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">血壓控制</h2>
          <GaugeChart
            title="平均收縮壓"
            value={132}
            min={90}
            max={180}
            unit="mmHg"
            thresholds={{
              low: 90,
              high: 140,
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">體重控制</h2>
          <GaugeChart
            title="平均體重變化"
            value={0.5}
            min={-2}
            max={2}
            unit="kg"
            thresholds={{
              low: -1,
              high: 1,
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">血糖控制</h2>
          <GaugeChart
            title="平均血糖"
            value={130}
            min={70}
            max={200}
            unit="mg/dL"
            thresholds={{
              low: 70,
              high: 180,
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;