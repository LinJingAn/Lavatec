import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from './TopBar';

const MainLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 