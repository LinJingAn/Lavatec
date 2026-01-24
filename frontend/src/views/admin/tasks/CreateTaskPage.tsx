import React from 'react';

const CreateTaskPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Criar Nova Tarefa</h1>
        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
          Cancelar
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-600">
            Formulário para criar uma nova tarefa e atribuir aos funcionários.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título da Tarefa
              </label>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Atribuir a
              </label>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage; 