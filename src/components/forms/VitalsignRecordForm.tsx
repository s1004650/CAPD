import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RefreshCw, Thermometer } from 'lucide-react';
import { VitalsignRecord, VitalsignRecordInput } from '../../types';

interface VitalsignRecordFormProps {
  onSubmit: (data: VitalsignRecordInput) => void;
  lastRecord?: VitalsignRecord;
  isLoading?: boolean;
}

const VitalsignRecordForm: React.FC<VitalsignRecordFormProps> = ({
  onSubmit,
  lastRecord,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState<string>(today);
  const [systolicBP, setSystolicBP] = useState<number>(120);
  const [diastolicBP, setDiastolicBP] = useState<number>(80);
  const [bloodGlucose, setBloodGlucose] = useState<number | undefined>(undefined);
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [note, setNote] = useState<string>('');
  const [needBloodGlucose, setNeedBloodGlucose] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      recordDate: `${date}T00:00:00`,
      systolicBP,
      diastolicBP,
      temperature: temperature ?? 0,
      needBloodGlucose,
      bloodGlucose: needBloodGlucose ? bloodGlucose : undefined,
      note,
    });
  };

  const useLastRecord = () => {
    if (lastRecord) {
      setSystolicBP(lastRecord.systolicBP);
      setDiastolicBP(lastRecord.diastolicBP);
      
      if (lastRecord.needBloodGlucose) {
        setNeedBloodGlucose(true);
        setBloodGlucose(lastRecord.bloodGlucose);
      } else {
        setNeedBloodGlucose(false);
        setBloodGlucose(undefined);
      }
      
      setTemperature(lastRecord.temperature);
      setNote(lastRecord.note || '');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        {/* <h2 className="text-lg font-medium text-gray-900">生命徵象紀錄</h2> */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="systolicBP" className="block text-sm font-medium text-gray-700">
            收縮壓 (mmHg)
          </label>
          <input
            type="number"
            id="systolicBP"
            value={systolicBP}
            onChange={(e) => setSystolicBP(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="60"
            max="250"
            required
          />
          {systolicBP > 140 && (
            <p className="mt-1 text-sm text-red-600">收縮壓偏高，請留意並諮詢醫療人員</p>
          )}
          {systolicBP < 90 && (
            <p className="mt-1 text-sm text-red-600">收縮壓偏低，請留意並諮詢醫療人員</p>
          )}
        </div>

        <div>
          <label htmlFor="diastolicBP" className="block text-sm font-medium text-gray-700">
            舒張壓 (mmHg)
          </label>
          <input
            type="number"
            id="diastolicBP"
            value={diastolicBP}
            onChange={(e) => setDiastolicBP(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="40"
            max="150"
            required
          />
          {diastolicBP > 90 && (
            <p className="mt-1 text-sm text-red-600">舒張壓偏高，請留意並諮詢醫療人員</p>
          )}
          {diastolicBP < 60 && (
            <p className="mt-1 text-sm text-red-600">舒張壓偏低，請留意並諮詢醫療人員</p>
          )}
        </div>

        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
            體溫 (°C)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Thermometer size={16} className="text-gray-400" />
            </div>
            <input
              type="number"
              id="temperature"
              value={temperature || ''}
              onChange={(e) => setTemperature(e.target.value ? Number(e.target.value) : undefined)}
              step="0.1"
              min="35"
              max="42"
              placeholder="36.5"
              className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {temperature && temperature >= 37.5 && (
            <p className="mt-1 text-sm text-red-600">體溫偏高，請留意身體狀況</p>
          )}
        </div>

        <div>
          <div className="flex items-center">
            <input
              id="needBloodGlucose"
              type="checkbox"
              checked={needBloodGlucose}
              onChange={(e) => setNeedBloodGlucose(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="needBloodGlucose" className="ml-2 block text-sm font-medium text-gray-700">
              需要紀錄血糖
            </label>
          </div>

          {needBloodGlucose && (
            <div className="mt-3">
              <label htmlFor="bloodGlucose" className="block text-sm font-medium text-gray-700">
                血糖值 (mg/dL)
              </label>
              <input
                type="number"
                id="bloodGlucose"
                value={bloodGlucose || ''}
                onChange={(e) => setBloodGlucose(e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="20"
                max="500"
                required={needBloodGlucose}
              />
              {bloodGlucose && bloodGlucose > 180 && (
                <p className="mt-1 text-sm text-red-600">血糖偏高，請留意飲食控制並諮詢醫療人員</p>
              )}
              {bloodGlucose && bloodGlucose < 70 && (
                <p className="mt-1 text-sm text-red-600">血糖偏低，請適當進食並諮詢醫療人員</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700">
          備註
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="輸入其他狀況或症狀..."
        ></textarea>
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
  );
};

export default VitalsignRecordForm;