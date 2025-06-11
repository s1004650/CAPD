import React, { useState, useMemo, useEffect } from 'react';
import { Users, AlertTriangle, FileText, Activity, MessageSquare/*, Trash2, Camera*/ } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Layout from '../components/layout/Layout';
import LineChart from '../components/charts/LineChart';
import { stringToDateTime } from '../types/utils'

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { patientSummaries, fetchPatientSummaries, 
    dialysisRecords, fetchDialysisRecords, deleteDialysisRecord, 
    vitalsignRecords, fetchVitalsignRecords, deleteVitalsignRecord,
    exitsiteCareRecords, fetchExitsiteCareRecords, deleteExitsiteCareRecord,
    fetchAlertRecords, addMessage } = useData();
  const [filter, setFilter] = useState<'all' | 'warning' | 'danger'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<any>(null);
  /* const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]); */

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchPatientSummaries(),
          fetchDialysisRecords(),
          fetchVitalsignRecords(),
          fetchExitsiteCareRecords(),
          fetchAlertRecords()
        ]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const records = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    const dialysisRecordsFormatted = dialysisRecords
      .filter(record => record.recordDate.startsWith(today))
      .map(record => ({
        id: record.id,
        userId: record.userId,
        type: 'dialysis',
        recordDate: stringToDateTime(record.recordDate),
        details: `透析液外觀: ${record.dialysateAppearance || '未知'}, 脫水量: ${record.ultrafiltrationVolume || '未知'} ml, 體重：${record.weight || '未知'} kg`,
      }));

    const vitalsignRecordsFormatted = vitalsignRecords
      .filter(record => record.recordDate.startsWith(today))
      .map(record => ({
        id: record.id,
        userId: record.userId,
        type: 'vitalsign',
        recordDate: stringToDateTime(record.recordDate),
        details: `血壓: ${record.systolicBP}/${record.diastolicBP}`,
      }));

    const exitsiteCareRecordsFormatted = exitsiteCareRecords
      .filter(record => record.recordDate.startsWith(today))
      .map(record => ({
        id: record.id,
        userId: record.userId,
        type: 'exitsiteCare',
        recordDate: stringToDateTime(record.recordDate),
        details: record.note || '無詳細資訊',
      }));

    return [...dialysisRecordsFormatted, ...vitalsignRecordsFormatted, ...exitsiteCareRecordsFormatted].sort(
      (a, b) => b.recordDate.localeCompare(a.recordDate)
    );
  }, [dialysisRecords, vitalsignRecords, exitsiteCareRecords])

  // 計算選定病人的趨勢資料
  const patientTrends = useMemo(() => {
    if (!selectedPatientDetails) return null;

    const patientDialysisRecords = dialysisRecords.filter(
      record => record.userId === selectedPatientDetails.id
    );
    const patientVitalsignRecords = vitalsignRecords.filter(
      record => record.userId === selectedPatientDetails.id
    );

    // 計算每日總脫水量
    const dailyDrainage = patientDialysisRecords.reduce((acc, record) => {
      const date = record.recordDate;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += record.ultrafiltrationVolume;
      return acc;
    }, {} as Record<string, number>);

    return {
      drainage: Object.entries(dailyDrainage)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      bloodPressure: patientVitalsignRecords
        .map(record => ({
          date: record.recordDate,
          value: record.systolicBP,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      weight: patientDialysisRecords
        .map(record => ({
          date: record.recordDate,
          value: record.weight,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      bloodGlucose: patientVitalsignRecords
        .filter(record => record.bloodGlucose !== undefined)
        .map(record => ({
          date: record.recordDate,
          value: record.bloodGlucose as number,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  }, [selectedPatientDetails, dialysisRecords, vitalsignRecords]);

  const handleSectionClick = (section: string) => {
    setSelectedSection(section === selectedSection ? null : section);
  };

  const handleDeleteRecord = (record: any) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      switch (selectedRecord.type) {
        case 'dialysis':
          await deleteDialysisRecord(selectedRecord.id);
          await fetchDialysisRecords();
        break;
        case 'vitalsign':
          await deleteVitalsignRecord(selectedRecord.id);
          await fetchVitalsignRecords();
          break;
        case 'exitsiteCare':
          await deleteExitsiteCareRecord(selectedRecord.id);
          await fetchExitsiteCareRecords();
          break;
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('刪除失敗:', error);
      alert('刪除失敗，請稍後再試');
    }
  };

  const handleSendMessage = (patient: any) => {
    setSelectedPatient(patient);
    setIsMessageModalOpen(true);
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatientDetails(patient);
    setIsDetailModalOpen(true);
  };

  /* const handleViewPhotos = (photos: string[]) => {
    setSelectedPhotos(photos);
    setIsPhotoModalOpen(true);
  }; */

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

  // 根據篩選條件過濾病人
  const filteredPatients = patientSummaries.filter((patient) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'warning' && (patient.status === 'warning' || patient.status === 'danger')) ||
      (filter === 'danger' && patient.status === 'danger');

    const matchesSearch = patient.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getSectionContent = () => {
    switch (selectedSection) {
      case 'totalPatients':
        return {
          title: '所有病人列表',
          data: patientSummaries,
        };
      case 'alerts':
        return {
          title: '警示病人列表',
          data: patientSummaries.filter(p => p.alertRecordsCount > 0),
        };
      case 'todayRecords':
        return {
          title: '今日紀錄列表',
          data: records,
        };
      case 'attention':
        return {
          title: '需關注病人列表',
          data: patientSummaries.filter(p => p.status !== 'stable'),
        };
      default:
        return null;
    }
  };

  const sectionContent = getSectionContent();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">您好，{user?.fullName}！</h1>
        <p className="text-gray-600">歡迎回到個案管理師控制台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div 
          className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => handleSectionClick('totalPatients')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">總病人數</p>
              <p className="text-2xl font-semibold">{patientSummaries.length}</p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:bg-amber-50 transition-colors"
          onClick={() => handleSectionClick('alerts')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 mr-4">
              <AlertTriangle size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">警示數量</p>
              <p className="text-2xl font-semibold">
                {patientSummaries.reduce((sum, patient) => sum + patient.alertRecordsCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:bg-green-50 transition-colors"
          onClick={() => handleSectionClick('todayRecords')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">今日紀錄筆數</p>
              <p className="text-2xl font-semibold">{records.length}</p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:bg-purple-50 transition-colors"
          onClick={() => handleSectionClick('attention')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Activity size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">需關注病人</p>
              <p className="text-2xl font-semibold">
                {patientSummaries.filter(p => p.status !== 'stable').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {sectionContent && (
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{sectionContent.title}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selectedSection === 'todayRecords' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">病人</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">類型</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">詳細資訊</th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">照片</th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">病人資訊</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">狀態</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">警示數</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最近紀錄</th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">照片</th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedSection === 'todayRecords' ? (
                  sectionContent.data.map((record: any) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.recordDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patientSummaries.find(p => p.id === record.userId)?.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.type === 'dialysis' ? '透析紀錄' :
                         record.type === 'vitalsign' ? '生命徵象' : '出口照護'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.details}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.photos && record.photos.length > 0 && (
                          <button
                            onClick={() => handleViewPhotos(record.photos)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <Camera size={16} className="mr-1" />
                            查看照片 ({record.photos.length})
                          </button>
                        )}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteRecord(record)}
                          className="text-red-600 hover:text-red-900"
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  sectionContent.data.map((patient: any) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.status === 'danger' ? 'bg-red-100 text-red-800' :
                          patient.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {patient.status === 'danger' ? '警示' :
                           patient.status === 'warning' ? '需注意' : '穩定'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.alertRecordsCount} 項警示
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.lastRecord}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.lastDialysis?.photos && patient.lastDialysis.photos.length > 0 && (
                          <button
                            onClick={() => handleViewPhotos(patient.lastDialysis.photos)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <Camera size={16} className="mr-1" />
                            查看照片 ({patient.lastDialysis.photos.length})
                          </button>
                        )}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(patient)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          查看
                        </button>
                        <button
                          onClick={() => handleSendMessage(patient)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          發送訊息
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 照片檢視對話框 */}
      {/* <Transition show={isPhotoModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsPhotoModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                透析液照片
              </Dialog.Title>
              <div className="grid grid-cols-2 gap-4">
                {selectedPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`透析液照片 ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none"
                  onClick={() => setIsPhotoModalOpen(false)}
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition> */}

      {/* 刪除確認對話框 */}
      <Transition show={isDeleteModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                確認刪除
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  您確定要刪除這筆紀錄嗎？此操作無法復原。
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none"
                  onClick={confirmDelete}
                >
                  確認刪除
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

      {/* 病人詳細資料對話框 */}
      <Transition show={isDetailModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsDetailModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-y-auto max-h-[90vh] text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                病人詳細資料 - {selectedPatientDetails?.fullName}
              </Dialog.Title>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">基本資料</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">姓名：{selectedPatientDetails?.fullName}</p>
                      <p className="text-sm text-gray-600">年齡：{selectedPatientDetails?.age}歲</p>
                      <p className="text-sm text-gray-600">性別：{selectedPatientDetails?.gender}</p>
                      <p className="text-sm text-gray-600">開始透析：{selectedPatientDetails?.dialysisStartDate}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">最新生命徵象</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">血壓：{selectedPatientDetails?.lastBP}</p>
                      <p className="text-sm text-gray-600">體重：{selectedPatientDetails?.lastWeight} kg</p>
                      <p className="text-sm text-gray-600">血糖：{selectedPatientDetails?.lastBloodGlucose} mg/dL</p>
                    </div>
                  </div>
                </div>
              </div>

              {patientTrends && (
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-700">健康趨勢</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LineChart
                      title="血壓趨勢"
                      data={patientTrends.bloodPressure}
                      unit="mmHg"
                      highThreshold={140}
                      lowThreshold={90}
                      color="rgb(239, 68, 68)"
                    />
                    
                    <LineChart
                      title="體重趨勢"
                      data={patientTrends.weight}
                      unit="kg"
                      color="rgb(16, 185, 129)"
                    />

                    <LineChart
                      title="每日總脫水量趨勢"
                      data={patientTrends.drainage}
                      unit="ml"
                      color="rgb(59, 130, 246)"
                    />
                    
                    <LineChart
                      title="血糖趨勢"
                      data={patientTrends.bloodGlucose}
                      unit="mg/dL"
                      highThreshold={180}
                      lowThreshold={70}
                      color="rgb(139, 92, 246)"
                    />
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
    </Layout>
  );
};

export default AdminDashboard;