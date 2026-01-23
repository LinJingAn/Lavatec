import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSend } from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const SMSPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');

  const handleBackToMarketing = () => {
    navigate('/stores/marketing');
  };

  const customerSegments = [
    { id: 'all', name: 'Todos os Clientes' },
    { id: 'active', name: 'Clientes Ativos' },
    { id: 'inactive', name: 'Clientes Inativos (60+ dias)' },
    { id: 'new', name: 'Novos Clientes (últimos 30 dias)' },
    { id: 'vip', name: 'Clientes VIP' }
  ];

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
            <h1 className="text-2xl font-semibold">SMS</h1>
            <p className="text-sm text-gray-600 mt-1">
              Envie mensagens SMS para seus clientes
            </p>
          </div>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <MdSend className="mr-1" size={20} />
          Enviar SMS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SMS composer */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <label htmlFor="segment" className="block text-sm font-medium text-gray-700 mb-1">
              Segmento de Clientes:
            </label>
            <select
              id="segment"
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um segmento de clientes</option>
              {customerSegments.map(segment => (
                <option key={segment.id} value={segment.id}>{segment.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="smsMessage" className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem:
            </label>
            <textarea
              id="smsMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua mensagem SMS aqui"
              maxLength={160}
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>{message.length} / 160 caracteres</span>
              {message.length > 0 && <span>{Math.ceil(message.length / 160)} SMS</span>}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Variáveis Disponíveis:</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                className="text-sm bg-gray-100 p-1 rounded hover:bg-gray-200"
                onClick={() => setMessage(message + " {customer_name}")}
              >
                {'{customer_name}'}
              </button>
              <button 
                className="text-sm bg-gray-100 p-1 rounded hover:bg-gray-200"
                onClick={() => setMessage(message + " {order_number}")}
              >
                {'{order_number}'}
              </button>
              <button 
                className="text-sm bg-gray-100 p-1 rounded hover:bg-gray-200"
                onClick={() => setMessage(message + " {discount_code}")}
              >
                {'{discount_code}'}
              </button>
              <button 
                className="text-sm bg-gray-100 p-1 rounded hover:bg-gray-200"
                onClick={() => setMessage(message + " {store_name}")}
              >
                {'{store_name}'}
              </button>
            </div>
          </div>
        </div>

        {/* SMS preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Pré-visualização do SMS</h2>
          
          <div className="mb-6">
            <div className="border border-gray-200 rounded-xl p-4 max-w-xs mx-auto">
              <div className="bg-gray-100 rounded-lg p-3 mb-2 relative">
                <p className="text-sm">{message || 'Sua mensagem SMS aparecerá aqui.'}</p>
                <div className="absolute h-3 w-3 bg-gray-100 transform rotate-45 left-0 -ml-1 top-4"></div>
              </div>
              <div className="text-xs text-center text-gray-500">Pré-visualização</div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Resumo:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Destinatários:</span>
                <span className="font-medium">
                  {selectedSegment ? 
                    customerSegments.find(s => s.id === selectedSegment)?.name || '-' : 
                    'Nenhum selecionado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantidade estimada:</span>
                <span className="font-medium">
                  {selectedSegment === 'all' ? '147' :
                   selectedSegment === 'active' ? '98' :
                   selectedSegment === 'inactive' ? '49' :
                   selectedSegment === 'new' ? '12' :
                   selectedSegment === 'vip' ? '25' : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Custo estimado:</span>
                <span className="font-medium">
                  R$ {selectedSegment ? 
                    ((selectedSegment === 'all' ? 147 :
                      selectedSegment === 'active' ? 98 :
                      selectedSegment === 'inactive' ? 49 :
                      selectedSegment === 'new' ? 12 :
                      selectedSegment === 'vip' ? 25 : 0) * 0.10 * Math.max(1, Math.ceil(message.length / 160))).toFixed(2) : 
                    '0,00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 