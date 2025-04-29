import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { MessageSquare } from 'lucide-react';
import { UserRole } from '../types';

const Messages: React.FC = () => {
  const { messages } = useData();
  const { user } = useAuth();
  const [messageContent, setMessageContent] = React.useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleSendMessage = () => {
    // 在實際應用中，這裡會調用API發送訊息
    console.log('Send message:', messageContent);
    setMessageContent('');
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">訊息通知</h1>
        <p className="text-gray-600">
          {user?.role === UserRole.CASE_MANAGER 
            ? '發送重要提醒給您的病患' 
            : '查看來自個案管理師的重要提醒'}
        </p>
      </div>

      {user?.role === UserRole.CASE_MANAGER && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">發送新提醒</h2>
          <div className="space-y-4">
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="輸入提醒內容..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              發送提醒
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">訊息列表</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {messages.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">沒有訊息</h3>
              <p className="mt-1 text-sm text-gray-500">目前沒有任何訊息通知</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>{formatDate(message.createdAt)}</span>
                      {!message.isRead && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          未讀
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;