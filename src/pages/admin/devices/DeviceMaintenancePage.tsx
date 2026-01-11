import React from 'react';

const DeviceMaintenancePage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manutenção de Dispositivos</h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
          Agendar Manutenção
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-600">
            Gerencie a manutenção e reparos dos dispositivos.
          </p>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceMaintenancePage; 