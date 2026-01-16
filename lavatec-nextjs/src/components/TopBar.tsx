import { useState } from 'react';
import { HiLocationMarker, HiChevronDown, HiChatAlt2, HiOutlineBell } from 'react-icons/hi';

interface TopBarProps {
  selectedView: 'admin' | 'stores';
  onViewChange: (view: 'admin' | 'stores') => void;
  userName?: string;
  userImage?: string;
}

const TopBar = ({ selectedView, onViewChange, userName = 'User', userImage }: TopBarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-gray-200 z-50">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left section - Admin/Stores toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors duration-200 text-sm focus:outline-none ${
                selectedView === 'admin' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="font-medium">Admin</span>
            </button>
            <button
              onClick={() => onViewChange('stores')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors duration-200 text-sm focus:outline-none ${
                selectedView === 'stores' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="font-medium">Lojas</span>
            </button>
          </div>
        </div>

        {/* Center section - Location selector */}
        <div className="flex items-center">
          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <HiLocationMarker className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">All Locations</span>
            <HiChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Right section - User profile and notifications */}
        <div className="flex items-center space-x-4">
          <button className="p-1.5 text-gray-500 hover:text-gray-700 relative">
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700">
            <HiChatAlt2 className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{userName}</span>
            {userImage ? (
              <img src={userImage} alt={userName} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar; 