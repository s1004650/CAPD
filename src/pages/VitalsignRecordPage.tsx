import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { /*ChevronLeft, */Check } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/layout/Layout';
import VitalsignRecordForm from '../components/forms/VitalsignRecordForm';
import { VitalsignRecordInput } from '../types';

const VitalsignRecordPage: React.FC = () => {
  const { vitalsignRecords, addVitalsignRecord, isLoading } = useData();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const lastRecord = vitalsignRecords.length > 0 
    ? vitalsignRecords[0] 
    : undefined;

  const handleSubmit = async (data: VitalsignRecordInput) => {
    try {
      await addVitalsignRecord(data);
      setSuccess(true);
      
      // 3秒後自動導回儀表板
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error adding vitals record:', error);
    }
  };

  return (
    <Layout>
      {/* <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft size={20} />
          <span>返回</span>
        </button>
      </div> */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">生命徵象紀錄</h1>
        <p className="text-gray-600">記錄您的血壓、體重及血糖</p>
      </div>

      {success ? (
        <div className="bg-green-50 p-6 rounded-lg shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <Check size={32} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-xl font-medium text-green-800 mb-2">紀錄已成功儲存！</h2>
          <p className="text-green-600 mb-4">
            感謝您的記錄，這對您的健康管理非常重要。
          </p>
          <p className="text-sm text-gray-500">
            正在返回儀表板...
          </p>
        </div>
      ) : (
        <VitalsignRecordForm 
          onSubmit={handleSubmit} 
          lastRecord={lastRecord}
          isLoading={isLoading}
        />
      )}
    </Layout>
  );
};

export default VitalsignRecordPage;