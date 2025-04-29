import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Activity, 
  MessageSquare, 
  Settings,
  Users,
  BarChart2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useAuth();
  
  const patientLinks = [
    { name: '首頁', path: '/dashboard', icon: <Home size={20} /> },
    { name: '透析紀錄', path: '/dialysis-records', icon: <FileText size={20} /> },
    { name: '生命徵象', path: '/vitals', icon: <Activity size={20} /> },
    { name: '訊息通知', path: '/messages', icon: <MessageSquare size={20} /> },
    { name: '個人設定', path: '/settings', icon: <Settings size={20} /> },
  ];

  const caseManagerLinks = [
    { name: '監控總覽', path: '/admin-dashboard', icon: <Home size={20} /> },
    { name: '病患管理', path: '/patients', icon: <Users size={20} /> },
    { name: '數據分析', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: '異常警示', path: '/alerts', icon: <AlertTriangle size={20} /> },
    { name: '訊息通知', path: '/messages', icon: <MessageSquare size={20} /> },
    { name: '系統設定', path: '/settings', icon: <Settings size={20} /> },
  ];

  const links = user?.role === UserRole.PATIENT ? patientLinks : caseManagerLinks;

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-20 flex flex-col w-64 pt-20 bg-white transform transition-transform duration-300 ease-in-out border-r border-gray-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="h-full flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">需要協助？</h3>
            <p className="mt-1 text-sm text-blue-600">
              若有任何問題，請聯繫您的個案管理師或撥打服務專線。
            </p>
            <p className="mt-2 text-sm font-medium text-blue-800">
              緊急專線：(03) 8561825
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;