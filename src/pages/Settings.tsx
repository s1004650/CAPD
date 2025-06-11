import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Bell, Moon, Sun, Volume2, Save, Beaker } from 'lucide-react';
import { UserRole, DialysisSettingInput } from '../types';

const CONCENTRATIONS = [
  { value: 1.5, label: '1.5%' },
  { value: 2.5, label: '2.5%' },
  { value: 4.25, label: '4.25%' },
  { value: 7.5, label: '7.5% 愛多尼爾' },
];

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { dialysisSettings, udpateDialysisSetting, fetchDialysisSettings } = useData();
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    abnormalAlert: true,
    messageNotification: true,
    sound: true,
  });
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [prescription, setPrescription] = useState<DialysisSettingInput>({
    exchangeVolumnePertime: 2000,
    exchangeTimesPerday: 4,
    dialysateGlucose: 1.5,
    note: '',
  });

  useEffect(() => {
    if (user) {
      const fetchData = async (userId: string) => {
        try {
          await fetchDialysisSettings(userId);
          if (dialysisSettings && dialysisSettings.length > 0) {
            setPrescription({
              exchangeVolumnePertime: dialysisSettings[0].exchangeVolumnePertime,
              exchangeTimesPerday: dialysisSettings[0].exchangeTimesPerday,
              dialysateGlucose: dialysisSettings[0].dialysateGlucose,
              note: dialysisSettings[0].note,
            });
          }
        } catch (error) {
          console.error(error);
        }
      };
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-font-size', fontSize);
      fetchData(user.id);
    }
  }, [user, theme, fontSize]);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePrescription = async () => {
    if (!user) return;

    try {
      await udpateDialysisSetting(dialysisSettings[0].id, {
        exchangeVolumnePertime: prescription.exchangeVolumnePertime,
        exchangeTimesPerday: prescription.exchangeTimesPerday,
        dialysateGlucose: prescription.dialysateGlucose,
        note: prescription.note,
      });
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">系統設定</h1>
        <p className="text-gray-600">自訂您的使用體驗與通知設定</p>
      </div>

      <div className="space-y-6">
        {user?.role === UserRole.PATIENT && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Beaker className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">透析處方設定</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">每次交換量 (mL)</label>
                <input
                  type="number"
                  value={prescription.exchangeVolumnePertime}
                  onChange={(e) => setPrescription(prev => ({ ...prev, exchangeVolumnePertime: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">每日交換次數</label>
                <input
                  type="number"
                  value={prescription.exchangeTimesPerday}
                  onChange={(e) => setPrescription(prev => ({ ...prev, exchangeTimesPerday: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="1"
                  max="6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">透析液濃度</label>
                <select
                  value={prescription.dialysateGlucose}
                  onChange={(e) => setPrescription(prev => ({ ...prev, dialysateGlucose: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  {CONCENTRATIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">備註</label>
                <textarea
                  value={prescription.note}
                  onChange={(e) => setPrescription(prev => ({ ...prev, note: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="輸入其他透析相關注意事項..."
                />
              </div>

              <div className="flex justify-front">
                <button
                  onClick={handleSavePrescription}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save size={16} className="mr-2" />
                  儲存處方設定
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">通知設定</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700">每日記錄提醒</span>
              </div>
              <button
                onClick={() => handleNotificationChange('dailyReminder')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.dailyReminder ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    notifications.dailyReminder ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700">異常值警示</span>
              </div>
              <button
                onClick={() => handleNotificationChange('abnormalAlert')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.abnormalAlert ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    notifications.abnormalAlert ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700">訊息通知</span>
              </div>
              <button
                onClick={() => handleNotificationChange('messageNotification')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.messageNotification ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    notifications.messageNotification ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Volume2 className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700">通知音效</span>
              </div>
              <button
                onClick={() => handleNotificationChange('sound')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.sound ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    notifications.sound ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">顯示設定</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">主題模式</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    theme === 'light'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  <Sun className="h-5 w-5 mr-2" />
                  淺色
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    theme === 'dark'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  <Moon className="h-5 w-5 mr-2" />
                  深色
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">文字大小</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-front">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save size={16} className="mr-2" />
            儲存設定
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;