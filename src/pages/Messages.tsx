import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { MessageSquare, Send, Search } from 'lucide-react';
import { UserRole } from '../types';

const Messages: React.FC = () => {
  const { messages, patients, addMessage } = useData();
  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMessages = messages.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getMessagesByPatient = (patientId: string) => {
    return sortedMessages.filter(message => 
      message.senderId === patientId || message.receiverId === patientId
    );
  };

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

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !user) return;
    
    try {
      await addMessage({
        senderId: user.id,
        receiverId: selectedPatient,
        content: messageContent,
        isRead: false,
      });
      
      setMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">訊息通知</h1>
        <p className="text-gray-600">
          {user?.role === UserRole.CASE_MANAGER 
            ? '與病患的訊息往來記錄' 
            : '與個案管理師的訊息往來記錄'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {user?.role === UserRole.CASE_MANAGER && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="搜尋病患..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 ${
                      selectedPatient === patient.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-500">
                          {getMessagesByPatient(patient.id).length} 則對話
                        </p>
                      </div>
                      {getMessagesByPatient(patient.id).some(m => !m.isRead && m.receiverId === user.id) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          未讀
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={user?.role === UserRole.CASE_MANAGER ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">訊息記錄</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {messages.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">沒有訊息</h3>
                  <p className="mt-1 text-sm text-gray-500">目前沒有任何訊息通知</p>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {sortedMessages.map((message) => {
                    const isCurrentUserSender = message.senderId === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-lg rounded-lg p-4 ${
                            isCurrentUserSender
                              ? 'bg-blue-50 text-blue-900'
                              : 'bg-gray-50 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                            <span>{formatDate(message.createdAt)}</span>
                            {!message.isRead && !isCurrentUserSender && (
                              <span className="ml-2 text-blue-600">未讀</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {user?.role === UserRole.CASE_MANAGER && selectedPatient && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="輸入訊息..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} className="mr-2" />
                    發送
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;