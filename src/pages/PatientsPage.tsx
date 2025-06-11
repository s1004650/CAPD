import React, { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, MessageSquare, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/layout/Layout';
import { UserInput, UserRole } from '../types';

const PatientsPage: React.FC = () => {
  const { addUser, patientSummaries, fetchPatientSummaries, addMessage } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'stable' | 'warning' | 'danger'>('all');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [messageContent, setMessageContent] = useState('');
  const [newPatient, setNewPatient] = useState<UserInput>({
    fullName: '',
    caseNumber: '',
    birthdate: '',
    gender: 'male',
    dialysisStartDate: '',
    role: UserRole.PATIENT,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPatientSummaries();
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newPatient.fullName.trim()) {
      errors.fullName = '請輸入姓名';
    }
    
    if (!(newPatient.caseNumber ?? '').trim()) {
      errors.caseNumber = '請輸入身分證字號';
    } else if (newPatient.caseNumber && !/^[A-Z][12]\d{8}$/.test(newPatient.caseNumber)) {
      errors.caseNumber = '身分證字號格式不正確';
    }
    
    if (!newPatient.birthdate) {
      errors.birthdate = '請選擇出生日期';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPatient = async () => {
    if (!validateForm()) return;

    await addUser({
      fullName: newPatient.fullName,
      caseNumber: newPatient.caseNumber,
      birthdate: newPatient.birthdate,
      gender: newPatient.gender,
      dialysisStartDate: newPatient.dialysisStartDate || undefined,
      role: newPatient.role,
    });
    
    setNewPatient({
      fullName: '',
      caseNumber: '',
      birthdate: '',
      gender: 'male',
      dialysisStartDate: '',
      role: UserRole.PATIENT,
    });
    setIsAddPatientModalOpen(false);

    await fetchPatientSummaries();
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  const handleSendMessage = (patient: any) => {
    setSelectedPatient(patient);
    setIsMessageModalOpen(true);
  };

  const sendMessage = async () => {
    if (!messageContent.trim() || !selectedPatient) return;
    
    try {
      await addMessage({
        receiverId: selectedPatient.id,
        content: messageContent,
        isRead: false,
      });
      setMessageContent('');
      setIsMessageModalOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">病人管理</h1>
        <p className="text-gray-600">管理並監控所有透析病人的狀況</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="搜尋病人姓名或身分證字號..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="w-48">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="all">全部狀態</option>
                    <option value="stable">穩定</option>
                    <option value="warning">需注意</option>
                    <option value="danger">警示</option>
                  </select>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsAddPatientModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlus size={20} className="mr-2" />
              新增病人
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  病人資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  開始透析日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patientSummaries.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{patient.fullName}</div>
                        <div className="text-sm text-gray-500">
                          {patient.age}歲 · {patient.gender}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.dialysisStartDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                      {patient.status === 'danger' ? '警示' :
                       patient.status === 'warning' ? '需注意' : '穩定'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(patient)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      詳細資料
                    </button>
                    <button
                      onClick={() => handleSendMessage(patient)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      發送訊息
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新增病人對話框 */}
      <Transition show={isAddPatientModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsAddPatientModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  新增病人
                </Dialog.Title>
                <button
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名</label>
                  <input
                    type="text"
                    value={newPatient.fullName}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, fullName: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">身分證字號</label>
                  <input
                    type="text"
                    value={newPatient.caseNumber}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, caseNumber: e.target.value.toUpperCase() }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    maxLength={10}
                  />
                  {formErrors.caseNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.caseNumber}</p>
                  )}
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">聯絡電話</label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    maxLength={10}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">出生日期</label>
                  <input
                    type="date"
                    value={newPatient.birthdate}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, birthdate: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formErrors.birthdate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.birthdate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">性別</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    角色
                  </label>
                  <select
                    id="role"
                    value={newPatient.role}
                    onChange={(e) => setNewPatient((prev) => ({ ...prev, role: e.target.value as UserRole }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={UserRole.PATIENT}>病人</option>
                    <option value={UserRole.ADMIN}>個管師</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">開始透析日期</label>
                  <input
                    type="date"
                    value={newPatient.dialysisStartDate}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, dialysisStartDate: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAddPatient}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  新增
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* 詳細資料對話框 */}
      <Transition show={isDetailModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsDetailModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                病人詳細資料
              </Dialog.Title>
              {selectedPatient && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700">基本資料</h4>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-600">姓名：{selectedPatient.fullName}</p>
                        <p className="text-sm text-gray-600">年齡：{selectedPatient.age}歲</p>
                        <p className="text-sm text-gray-600">性別：{selectedPatient.gender}</p>
                        <p className="text-sm text-gray-600">身分證字號：{selectedPatient.caseNumber}</p>
                        {/* <p className="text-sm text-gray-600">聯絡電話：{selectedPatient.phone}</p> */}
                        <p className="text-sm text-gray-600">開始透析日期：{selectedPatient.dialysisStartDate}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">透析資訊</h4>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-600">透析方式：腹膜透析</p>
                        <p className="text-sm text-gray-600">透析時間：每日4次</p>
                        <p className="text-sm text-gray-600">透析液種類：1.5% 葡萄糖</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* 發送訊息對話框 */}
      <Transition show={isMessageModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsMessageModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                發送訊息給 {selectedPatient?.fullName}
              </Dialog.Title>
              <div className="mt-4">
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="輸入訊息內容..."
                />
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none"
                  onClick={() => {
                    setMessageContent('');
                    setIsMessageModalOpen(false);
                  }}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none"
                  onClick={sendMessage}
                >
                  <MessageSquare size={16} className="mr-2" />
                  發送
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Layout>
  );
};

export default PatientsPage;