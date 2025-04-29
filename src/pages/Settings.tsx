import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Moon, Sun, Volume2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    abnormalAlert: true,
    messageNotification: true,
    sound: true,
  });
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">個人設定</h1>
        <p className="text-gray-600">自訂您的使用體驗與通知設定</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">個人資料</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">姓名</label>
              <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">身分證字號</label>
              <p className="mt-1 text-sm text-gray-900">{user?.nationalId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">聯絡電話</label>
              <p className="mt-1 text-sm text-gray-900">{user?.phone || '尚未設定'}</p>
            </div>
          </div>
        </div>

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
      </div>
    </Layout>
  );
};

export default Settings;