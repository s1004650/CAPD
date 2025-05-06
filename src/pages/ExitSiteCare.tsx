import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Upload, Save, X, Check } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useData } from '../contexts/DataContext';

const ExitSiteCare: React.FC = () => {
  const navigate = useNavigate();
  const { addExitSiteCareRecord, isLoading } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    appearance: 'normal',
    hasDischarge: false,
    dischargeColor: 'clear',
    dischargeAmount: 'small',
    hasPain: false,
    painLevel: 0,
    hasScab: false,
    hasTunnel: false,
    notes: '',
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addExitSiteCareRecord({
        date: formData.date,
        appearance: formData.appearance as 'normal' | 'red' | 'swollen' | 'discharge',
        hasDischarge: formData.hasDischarge,
        dischargeTrait: formData.hasDischarge ? {
          color: formData.dischargeColor as 'clear' | 'yellow' | 'green' | 'bloody',
          amount: formData.dischargeAmount as 'small' | 'moderate' | 'large',
        } : undefined,
        hasPain: formData.hasPain,
        painLevel: formData.hasPain ? formData.painLevel : undefined,
        hasScab: formData.hasScab,
        hasTunnel: formData.hasTunnel,
        photos,
        notes: formData.notes,
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
            onClick={() => navigate(-1)}
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
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft size={20} />
          <span>返回</span>
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">出口照護紀錄</h1>
        <p className="text-gray-600">記錄腹膜透析導管出口的狀況與照片</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
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
              value={formData.appearance}
              onChange={(e) => setFormData(prev => ({ ...prev, appearance: e.target.value }))}
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
                id="hasDischarge"
                checked={formData.hasDischarge}
                onChange={(e) => setFormData(prev => ({ ...prev, hasDischarge: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasDischarge" className="ml-2 block text-sm font-medium text-gray-700">
                有分泌物
              </label>
            </div>

            {formData.hasDischarge && (
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
                id="hasPain"
                checked={formData.hasPain}
                onChange={(e) => setFormData(prev => ({ ...prev, hasPain: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasPain" className="ml-2 block text-sm font-medium text-gray-700">
                有疼痛
              </label>
            </div>

            {formData.hasPain && (
              <div className="mt-3">
                <label htmlFor="painLevel" className="block text-sm font-medium text-gray-700">
                  疼痛程度 (1-10)
                </label>
                <input
                  type="range"
                  id="painLevel"
                  min="1"
                  max="10"
                  value={formData.painLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, painLevel: Number(e.target.value) }))}
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
                id="hasScab"
                checked={formData.hasScab}
                onChange={(e) => setFormData(prev => ({ ...prev, hasScab: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasScab" className="ml-2 block text-sm font-medium text-gray-700">
                有結痂
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasTunnel"
                checked={formData.hasTunnel}
                onChange={(e) => setFormData(prev => ({ ...prev, hasTunnel: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasTunnel" className="ml-2 block text-sm font-medium text-gray-700">
                有隧道感染
              </label>
            </div>
          </div>
        </div>

        <div>
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
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            備註
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="輸入其他觀察或症狀..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            取消
          </button>
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
        </div>
      </form>
    </Layout>
  );
};

export default ExitSiteCare;