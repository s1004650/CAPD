import React, { useState/*, useRef*/ } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Check, RefreshCw/*, Camera, Upload, X*/ } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/layout/Layout';

const ExitSiteCare: React.FC = () => {
  const { exitsiteCareRecords, addExitsiteCareRecord, isLoading } = useData();
  const navigate = useNavigate();
  /* const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]); */
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    exitsiteAppearance: 'normal',
    discharge: false,
    dischargeColor: 'clear',
    dischargeAmount: 'small',
    pain: false,
    painScore: 0,
    scab: false,
    tunnelInfection: false,
    note: '',
  });

  const lastRecord = exitsiteCareRecords.length > 0 
    ? exitsiteCareRecords[0] 
    : undefined;

  const useLastRecord = () => {
    if (lastRecord) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        exitsiteAppearance: lastRecord.exitsiteAppearance,
        discharge: lastRecord.discharge,
        dischargeColor: lastRecord.dischargeColor ?? 'clear',
        dischargeAmount: lastRecord.dischargeAmount ?? 'small',
        pain: lastRecord.pain,
        painScore: lastRecord.painScore || 0,
        scab: lastRecord.scab,
        tunnelInfection: lastRecord.tunnelInfection,
        note: lastRecord.note ?? '',
      });
    }
  };

  /* const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }; */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const recordDateTime = `${formData.date}T00:00:00`
      await addExitsiteCareRecord({
        recordDate: recordDateTime,
        exitsiteAppearance: formData.exitsiteAppearance as 'normal' | 'red' | 'swollen' | 'discharge',
        discharge: formData.discharge,
        dischargeColor: formData.dischargeColor as 'clear' | 'yellow' | 'green' | 'bloody',
        dischargeAmount: formData.dischargeAmount as 'small' | 'moderate' | 'large',
        pain: formData.pain,
        painScore: formData.pain ? formData.painScore : undefined,
        scab: formData.scab,
        tunnelInfection: formData.tunnelInfection,
        // photos,
        note: formData.note,
      });
      
      setSuccess(true);
      
      // 3秒後自動導回儀表板
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={20} />
            <span>返回</span>
          </button>
        </div>

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
      </Layout>
    );
  }

  return (
    <Layout>
      {/* <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft size={20} />
          <span>返回</span>
        </button>
      </div> */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">出口照護紀錄</h1>
        <p className="text-gray-600">記錄腹膜透析導管出口的狀況與照片</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          {lastRecord && (
            <button
              type="button"
              onClick={useLastRecord}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <RefreshCw size={16} className="mr-1" />
              使用上次紀錄
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              日期
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              出口外觀
            </label>
            <select
              value={formData.exitsiteAppearance}
              onChange={(e) => setFormData(prev => ({ ...prev, exitsiteAppearance: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="normal">正常</option>
              <option value="red">發紅</option>
              <option value="swollen">腫脹</option>
              <option value="discharge">分泌物</option>
            </select>
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="discharge"
                checked={formData.discharge}
                onChange={(e) => setFormData(prev => ({ ...prev, discharge: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="discharge" className="ml-2 block text-sm font-medium text-gray-700">
                有分泌物
              </label>
            </div>

            {formData.discharge && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    分泌物顏色
                  </label>
                  <select
                    value={formData.dischargeColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, dischargeColor: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="clear">清澈</option>
                    <option value="yellow">黃色</option>
                    <option value="green">綠色</option>
                    <option value="bloody">血性</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    分泌物量
                  </label>
                  <select
                    value={formData.dischargeAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, dischargeAmount: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="small">少量</option>
                    <option value="moderate">中量</option>
                    <option value="large">大量</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pain"
                checked={formData.pain}
                onChange={(e) => setFormData(prev => ({ ...prev, pain: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="pain" className="ml-2 block text-sm font-medium text-gray-700">
                有疼痛
              </label>
            </div>

            {formData.pain && (
              <div className="mt-3">
                <label htmlFor="painScore" className="block text-sm font-medium text-gray-700">
                  疼痛程度 (1-10)
                </label>
                <input
                  type="range"
                  id="painScore"
                  min="1"
                  max="10"
                  value={formData.painScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, painScore: Number(e.target.value) }))}
                  className="mt-1 block w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>輕微 (1)</span>
                  <span>中度 (5)</span>
                  <span>劇烈 (10)</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="scab"
                checked={formData.scab}
                onChange={(e) => setFormData(prev => ({ ...prev, scab: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="scab" className="ml-2 block text-sm font-medium text-gray-700">
                有結痂
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="tunnelInfection"
                checked={formData.tunnelInfection}
                onChange={(e) => setFormData(prev => ({ ...prev, tunnelInfection: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="tunnelInfection" className="ml-2 block text-sm font-medium text-gray-700">
                有隧道感染
              </label>
            </div>
          </div>
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            出口照片
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`出口照片 ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {photos.length < 4 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500"
              >
                <Camera size={24} className="mb-2" />
                <span className="text-sm">新增照片</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <p className="mt-2 text-sm text-gray-500">
            最多可上傳 4 張照片
          </p>
        </div> */}

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">
            備註
          </label>
          <textarea
            id="note"
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="輸入其他觀察或症狀..."
          />
        </div>

        <div className="flex justify-front space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                儲存中...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                儲存紀錄
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            取消
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default ExitSiteCare;