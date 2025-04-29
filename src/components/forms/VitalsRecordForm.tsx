import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { VitalsRecord } from '../../types';

interface VitalsRecordFormProps {
  onSubmit: (data: Omit<VitalsRecord, 'id' | 'patientId' | 'createdAt'>) => void;
  lastRecord?: Omit<VitalsRecord, 'id' | 'patientId' | 'createdAt'>;
  isLoading?: boolean;
}

const VitalsRecordForm: React.FC<VitalsRecordFormProps> = ({
  onSubmit,
  lastRecord,
  isLoading = false,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState<string>(today);
  const [systolicBP, setSystolicBP] = useState<number>(120);
  const [diastolicBP, setDiastolicBP] = useState<number>(80);
  const [weight, setWeight] = useState<number>(60);
  const [bloodSugar, setBloodSugar] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState<string>('');
  const [hasBloodSugar, setHasBloodSugar] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      systolicBP,
      diastolicBP,
      weight,
      bloodSugar: hasBloodSugar ? bloodSugar : undefined,
      notes,
    });
  };

  const useLastRecord = () => {
    if (lastRecord) {
      setSystolicBP(lastRecord.systolicBP);
      setDiastolicBP(lastRecord.diastolicBP);
      setWeight(lastRecord.weight);
      
      if (lastRecord.bloodSugar) {
        setHasBloodSugar(true);
        setBloodSugar(lastRecord.bloodSugar);
      } else {
        setHasBloodSugar(false);
        setBloodSugar(undefined);
      }
      
      setNotes(lastRecord.notes || '');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">生命徵象紀錄</h2>
        {lastRecord && (
          <button
            type="button"
            onClick={useLastRecord}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <RefreshCw size={16} className="mr-1" />
            使用上次數值
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
          <div className="flex items-center">
            <input
              id="hasBloodSugar"
              type="checkbox"
              checked={hasBloodSugar}
              onChange={(e) => setHasBloodSugar(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="hasBloodSugar" className="ml-2 block text-sm font-medium text-gray-700">
              需要紀錄血糖
            </label>
          </div>

          {hasBloodSugar && (
            <div className="mt-3">
              <label htmlFor="bloodSugar" className="block text-sm font-medium text-gray-700">
                血糖值 (mg/dL)
              </label>
              <input
                type="number"
                id="bloodSugar"
                value={bloodSugar || ''}
                onChange={(e) => setBloodSugar(e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="20"
                max="500"
                required={hasBloodSugar}
              />
              {bloodSugar && bloodSugar > 180 && (
                <p className="mt-1 text-sm text-red-600">血糖偏高，請留意飲食控制並諮詢醫療人員</p>
              )}
              {bloodSugar && bloodSugar < 70 && (
                <p className="mt-1 text-sm text-red-600">血糖偏低，請適當進食並諮詢醫療人員</p>
              )}
            </div>
          )}
        </div>
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
          placeholder="輸入其他狀況或症狀..."
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

export default VitalsRecordForm;