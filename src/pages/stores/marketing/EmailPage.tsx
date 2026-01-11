import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSend } from 'react-icons/md';

const EmailPage = () => {
  const navigate = useNavigate();
  const [emailSubject, setEmailSubject] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [callToAction, setCallToAction] = useState('');

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
            <h1 className="text-2xl font-semibold">E-mail</h1>
            <p className="text-sm text-gray-600 mt-1">
              Crie e envie campanhas de e-mail para seus clientes
            </p>
          </div>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <MdSend className="mr-1" size={20} />
          Enviar E-mail
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Email composer */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700 mb-1">
              Assunto:
            </label>
            <input
              id="emailSubject"
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o assunto do e-mail"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="emailTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Título:
            </label>
            <input
              id="emailTitle"
              type="text"
              value={emailTitle}
              onChange={(e) => setEmailTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o título do e-mail"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="emailMessage" className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem:
            </label>
            <textarea
              id="emailMessage"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua mensagem aqui"
            />
          </div>

          <div>
            <label htmlFor="callToAction" className="block text-sm font-medium text-gray-700 mb-1">
              Botão de Ação:
            </label>
            <select
              id="callToAction"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um botão de ação</option>
              <option value="shop_now">Comprar Agora</option>
              <option value="learn_more">Saiba Mais</option>
              <option value="get_discount">Obter Desconto</option>
              <option value="book_appointment">Agendar Horário</option>
            </select>
          </div>
        </div>

        {/* Email preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Pré-visualização do E-mail</h2>
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="text-sm text-gray-500 mb-1">De: enzo@lavatec.com</div>
              <div className="text-sm text-gray-500 mb-1">Para: %CUSTOMER_NAME%</div>
              <div className="text-sm text-gray-500 mb-1">Assunto: {emailSubject || 'Título de Exemplo'}</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-4">{emailTitle || 'Título de Exemplo'}</h3>
              
              <p className="mb-4">Olá %CUSTOMER_NAME%,</p>
              
              <p className="mb-4">{emailMessage || 'Este é um exemplo de mensagem de e-mail que você irá enviar.'}</p>
              <p className="mb-4">Adicione sua mensagem e título digitando nas caixas à esquerda da página.</p>
              
              {callToAction && (
                <div className="text-center mt-6">
                  <a href="#" className="bg-blue-600 text-white px-6 py-2 rounded-md inline-block">
                    {callToAction === 'shop_now' && 'Comprar Agora'}
                    {callToAction === 'learn_more' && 'Saiba Mais'}
                    {callToAction === 'get_discount' && 'Obter Desconto'}
                    {callToAction === 'book_appointment' && 'Agendar Horário'}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage; 