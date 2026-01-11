import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdLocationOn, MdInfo, MdLocationSearching } from 'react-icons/md';

// Mock data for units with their locations
const mockUnidades = [
  { 
    id: 1, 
    name: 'São José Centro', 
    address: 'Avenida Central, Rua 1', 
    status: 'active',
    lat: 9.9281, 
    lng: -84.0907,
    employees: 15,
    machines: 12
  },
  { 
    id: 2, 
    name: 'Escazú', 
    address: 'Plaza Tempo, Local #5', 
    status: 'maintenance',
    lat: 9.9167, 
    lng: -84.1477,
    employees: 10,
    machines: 8
  },
  { 
    id: 3, 
    name: 'Heredia', 
    address: 'Centro Comercial Paseo de las Flores', 
    status: 'active',
    lat: 9.9981, 
    lng: -84.1195,
    employees: 12,
    machines: 10
  },
  { 
    id: 4, 
    name: 'Alajuela', 
    address: 'Rua Ancha, 200m Norte do Parque', 
    status: 'active',
    lat: 10.0162, 
    lng: -84.2144,
    employees: 8,
    machines: 6
  },
  { 
    id: 5, 
    name: 'Cartago', 
    address: 'Avenida 3, Edifício Lumina', 
    status: 'inactive',
    lat: 9.8644, 
    lng: -83.9194,
    employees: 0,
    machines: 5
  },
];

const UnidadesMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUnidad, setSelectedUnidad] = useState<typeof mockUnidades[0] | null>(null);
  
  // Get status-based marker color
  const getMarkerColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get status text
  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'Ativa';
      case 'maintenance': return 'Em Manutenção';
      case 'inactive': return 'Inativa';
      default: return status;
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/unidades')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <MdArrowBack className="mr-1" /> Voltar ao painel
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Mapa de Unidades</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map section */}
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b p-4 flex justify-between items-center">
            <h2 className="font-semibold">Distribuição Geográfica</h2>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
              <MdLocationSearching size={20} />
            </button>
          </div>
          
          {/* This would be a real map in a production app */}
          <div className="relative h-96 bg-blue-50 p-4 flex items-center justify-center">
            {/* Placeholder for an actual map */}
            <div className="relative w-full h-full border-2 border-dashed border-blue-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-blue-300 text-opacity-50">
                <p className="text-center">
                  Aqui seria integrado um mapa real (Google Maps, Mapbox, etc.)
                </p>
              </div>
              
              {/* Location markers */}
              {mockUnidades.map((unidad) => (
                <div 
                  key={unidad.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ 
                    top: `${(unidad.lat - 9.8) * 500 + 50}px`, 
                    left: `${(unidad.lng + 84.3) * 500 + 50}px`
                  }}
                  onClick={() => setSelectedUnidad(unidad)}
                >
                  <div className={`w-6 h-6 ${getMarkerColor(unidad.status)} rounded-full flex items-center justify-center border-2 border-white shadow-md hover:scale-110 transition-transform`}>
                    <MdLocationOn className="text-white" />
                  </div>
                  <span className="mt-1 bg-white px-2 py-1 text-xs rounded shadow whitespace-nowrap">
                    {unidad.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar with location info */}
        <div className="w-full lg:w-80 bg-white rounded-lg shadow">
          <div className="border-b p-4">
            <h2 className="font-semibold">Detalhes da Unidade</h2>
          </div>
          
          {selectedUnidad ? (
            <div className="p-4">
              <h3 className="text-lg font-medium">{selectedUnidad.name}</h3>
              <p className="text-gray-500 mb-4">{selectedUnidad.address}</p>
              
              <div className="mb-4">
                <div className={`inline-block px-2 py-1 ${
                  selectedUnidad.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedUnidad.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                } rounded-full text-xs font-medium`}>
                  {getStatusText(selectedUnidad.status)}
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Funcionários:</span>
                  <span className="font-medium">{selectedUnidad.employees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Máquinas:</span>
                  <span className="font-medium">{selectedUnidad.machines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coordenadas:</span>
                  <span className="font-medium">{selectedUnidad.lat.toFixed(4)}, {selectedUnidad.lng.toFixed(4)}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                  onClick={() => navigate(`/unidades/edit/${selectedUnidad.id}`)}
                >
                  Editar
                </button>
                <button 
                  className="flex-1 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors flex items-center justify-center"
                  onClick={() => navigate(`/unidades/details/${selectedUnidad.id}`)}
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-80">
              <MdInfo size={48} className="mb-2 text-gray-300" />
              <p>Selecione uma unidade no mapa para ver seus detalhes</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Legenda</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Ativa - Unidade operando normalmente</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span>Em Manutenção - Operação limitada ou temporária</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Inativa - Unidade fora de serviço</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnidadesMapPage; 