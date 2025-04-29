import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Menu, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 focus:outline-none lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <span className="text-blue-600 text-xl font-bold">腹膜透析監測平台</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
              </button>
            </div>
            <div className="ml-4 relative flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <div className="text-right mr-3 hidden sm:block">
                  <div className="text-sm font-medium text-gray-700">{user?.name}</div>
                  <div className="text-xs text-gray-500">
                    {user?.role === UserRole.PATIENT ? '病患' : '個案管理師'}
                  </div>
                </div>
                <div className="relative">
                  <button className="rounded-full flex text-sm focus:outline-none">
                    <UserCircle size={32} className="text-blue-600" />
                  </button>
                </div>
              </div>
              <div className="ml-2">
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  登出
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;