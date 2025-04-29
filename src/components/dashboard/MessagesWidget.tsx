import React from 'react';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { Message } from '../../types';

interface MessagesWidgetProps {
  messages: Message[];
  onViewAll: () => void;
}

const MessagesWidget: React.FC<MessagesWidgetProps> = ({ messages, onViewAll }) => {
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `今天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MessageSquare size={20} className="text-blue-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">訊息通知</h2>
        </div>
        <button 
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          查看全部
          <ChevronRight size={16} />
        </button>
      </div>

      {sortedMessages.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-3">
            <MessageSquare size={24} className="text-blue-600" />
          </div>
          <p className="text-gray-500">目前沒有訊息通知</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMessages.slice(0, 3).map((message) => (
            <div 
              key={message.id} 
              className={`p-3 rounded-lg border ${message.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'}`}
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">
                  個案管理師
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(message.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">{message.content}</p>
              {!message.isRead && (
                <div className="mt-2 flex justify-end">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    未讀
                  </span>
                </div>
              )}
            </div>
          ))}
          
          {sortedMessages.length > 3 && (
            <p className="text-sm text-center text-gray-500 mt-2">
              顯示最新 3 筆，共 {sortedMessages.length} 筆訊息
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesWidget;