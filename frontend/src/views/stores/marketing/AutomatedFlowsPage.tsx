import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd } from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const AutomatedFlowsPage = () => {
  const navigate = useNavigate();

  const handleBackToMarketing = () => {
    navigate('/stores/marketing');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleBackToMarketing}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            <MdArrowBack className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Fluxos Automatizados</h1>
            <p className="text-sm text-gray-600 mt-1">
              Crie fluxos de marketing automatizados baseados no comportamento do cliente
            </p>
          </div>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <MdAdd className="mr-1" size={20} />
          Criar Fluxo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="py-12">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Nenhum Fluxo Automatizado Ainda</h2>
          <p className="text-gray-500 mb-6">Crie seu primeiro fluxo automatizado para interagir com clientes baseado em seu comportamento</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center mx-auto transition duration-200">
            <MdAdd className="mr-1" size={20} />
            Criar Primeiro Fluxo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomatedFlowsPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 