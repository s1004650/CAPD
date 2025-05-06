import React, { useState, useRef } from 'react';
import { PlusCircle, MinusCircle, Save, RefreshCw, Camera, X } from 'lucide-react';
import { DialysisRecord } from '../../types';

interface DialysisRecordFormProps {
  onSubmit: (data: Omit<DialysisRecord, 'id' | 'patientId' | 'createdAt'>) => void;
  lastRecord?: Omit<DialysisRecord, 'id' | 'patientId' | 'createdAt'>;
  isLoading?: boolean;
}

const SYMPTOMS = [
  { id: 'fever', label: '發燒' },
  { id: 'nausea', label: '噁心' },
  { id: 'vomiting', label: '嘔吐' },
  { id: 'diarrhea', label: '腹瀉' },
  { id: 'fatigue', label: '疲倦' },
  { id: 'dizziness', label: '頭暈' },
  { id: 'edema', label: '水腫' },
  { id: 'shortness_of_breath', label: '呼吸短促' },
  { id: 'abdominal_pain', label: '腹痛' },
  { id: 'cramps', label: '抽筋' },
  { id: 'tinnitus', label: '耳鳴' },
];

const CONCENTRATIONS = [
  { value: '1.5%', label: '1.5%' },
  { value: '2.5%', label: '2.5%' },
  { value: '4.25%', label: '4.25%' },
  { value: '7.5%', label: '7.5% 愛多尼爾' },
];

const DialysisRecordForm: React.FC<DialysisRecordFormProps> = ({
  onSubmit,
  lastRecord,
  isLoading = false,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().slice(0, 5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState<string>(today);
  const [time, setTime] = useState<string>(now);
  const [inflowVolume, setInflowVolume] = useState<number>(2000);
  const [outflowVolume, setOutflowVolume] = useState<number>(2000);
  const [concentration, setConcentration] = useState<string>('1.5%');
  const [appearance, setAppearance] = useState<'clear' | 'cloudy' | 'bloody' | 'other'>('clear');
  const [hasAbdominalPain, setHasAbdominalPain] = useState<boolean>(false);
  const [painLevel, setPainLevel] = useState<number>(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [weight, setWeight] = useState<number>(60);
  const [notes, setNotes] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      time,
      inflowVolume,
      outflowVolume,
      concentration,
      appearance,
      hasAbdominalPain,
      painLevel: hasAbdominalPain ? painLevel : undefined,
      symptoms,
      weight,
      notes,
      photos,
    });
  };

  const useLastRecord = () => {
    if (lastRecord) {
      setTime(now);
      setInflowVolume(lastRecord.inflowVolume);
      setOutflowVolume(lastRecord.outflowVolume);
      setConcentration(lastRecord.concentration || '1.5%');
      setAppearance(lastRecord.appearance);
      setHasAbdominalPain(lastRecord.hasAbdominalPain);
      setPainLevel(lastRecord.painLevel || 0);
      setSymptoms(lastRecord.symptoms || []);
      setWeight(lastRecord.weight || 60);
      setNotes(lastRecord.notes || '');
    }
  };

  const toggleSymptom = (symptomId: string) => {
    setSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

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

  const adjustVolume = (type: 'inflow' | 'outflow', increment: boolean) => {
    const setValue = type === 'inflow' ? setInflowVolume : setOutflowVolume;
    setValue(prev => {
      const newValue = increment ? prev + 100 : prev - 100;
      return Math.max(0, newValue);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">透析紀錄</h2>
        {lastRecord && (
          <button
            type="button"
            onClick={useLastRecord}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <RefreshCw size={16} className="mr-1" />
            使用上次設定
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            日期
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            時間
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="inflowVolume" className="block text-sm font-medium text-gray-700">
            注入液量 (毫升)
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => adjustVolume('inflow', false)}
              className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500"
            >
              <MinusCircle size={16} />
            </button>
            <input
              type="number"
              id="inflowVolume"
              value={inflowVolume}
              onChange={(e) => setInflowVolume(Number(e.target.value))}
              className="block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="100"
              required
            />
            <button
              type="button"
              onClick={() => adjustVolume('inflow', true)}
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500"
            >
              <PlusCircle size={16} />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="outflowVolume" className="block text-sm font-medium text-gray-700">
            引流液量 (毫升)
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => adjustVolume('outflow', false)}
              className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500"
            >
              <MinusCircle size={16} />
            </button>
            <input
              type="number"
              id="outflowVolume"
              value={outflowVolume}
              onChange={(e) => setOutflowVolume(Number(e.target.value))}
              className="block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="100"
              required
            />
            <button
              type="button"
              onClick={() => adjustVolume('outflow', true)}
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500"
            >
              <PlusCircle size={16} />
            </button>
          </div>
          <div className="mt-1 text-sm">
            <span className={`font-medium ${
              outflowVolume - inflowVolume >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              脫水量: {outflowVolume - inflowVolume} mL
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="concentration" className="block text-sm font-medium text-gray-700">
            透析液濃度
          </label>
          <select
            id="concentration"
            value={concentration}
            onChange={(e) => setConcentration(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {CONCENTRATIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            體重 (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="20"
            max="200"
            step="0.1"
            required
          />
        </div>

        <div>
          <label htmlFor="appearance" className="block text-sm font-medium text-gray-700">
            透析液外觀
          </label>
          <select
            id="appearance"
            value={appearance}
            onChange={(e) => setAppearance(e.target.value as any)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="clear">清澈</option>
            <option value="cloudy">混濁</option>
            <option value="bloody">血性</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div>
          <div className="flex items-center">
            <input
              id="hasAbdominalPain"
              type="checkbox"
              checked={hasAbdominalPain}
              onChange={(e) => setHasAbdominalPain(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="hasAbdominalPain" className="ml-2 block text-sm font-medium text-gray-700">
              有腹痛症狀
            </label>
          </div>

          {hasAbdominalPain && (
            <div className="mt-3">
              <label htmlFor="painLevel" className="block text-sm font-medium text-gray-700">
                疼痛程度 (1-10)
              </label>
              <input
                type="range"
                id="painLevel"
                min="1"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            其他症狀（可複選）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SYMPTOMS.map(symptom => (
              <div key={symptom.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={symptom.id}
                  checked={symptoms.includes(symptom.id)}
                  onChange={() => toggleSymptom(symptom.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={symptom.id} className="ml-2 text-sm text-gray-700">
                  {symptom.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          透析液照片
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo}
                alt={`透析液照片 ${index + 1}`}
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
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="輸入其他觀察或症狀..."
        ></textarea>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
  );
};

export default DialysisRecordForm;