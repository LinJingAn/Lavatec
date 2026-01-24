import React, { useState } from 'react';
import { MdClose, MdSend, MdMic } from 'react-icons/md';

const SparkleIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor"
  >
    {/* Large sparkle */}
    <path d="M14 10L16 6L18 10L22 12L18 14L16 18L14 14L10 12L14 10Z" />
    {/* Medium sparkle */}
    <path d="M6 4L7.5 1L9 4L12 5.5L9 7L7.5 10L6 7L3 5.5L6 4Z" />
    {/* Small sparkle */}
    <path d="M4 16L5 14L6 16L8 17L6 18L5 20L4 18L2 17L4 16Z" />
  </svg>
);

const AIAgentChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ type: 'user' | 'ai'; message: string }>>([
    { type: 'ai', message: 'Olá! Como posso ajudar você hoje?' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory([...chatHistory, { type: 'user', message }]);
    
    // Simulate AI response (this would be replaced with actual backend integration)
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        message: 'Esta é uma demonstração da interface. A integração com IA será implementada posteriormente.' 
      }]);
    }, 1000);

    setMessage('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would implement the actual audio recording logic
    // For now it's just toggling the state for visual feedback
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-[#3f51b5] text-white rounded-full p-4 flex items-center gap-2 shadow-lg hover:bg-[#32408f] transition-colors"
        >
          <SparkleIcon className="w-6 h-6" />
          <span className="font-medium">Agente IA</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white rounded-lg shadow-xl flex flex-col ${
          isExpanded ? 'w-[800px] h-[600px]' : 'w-[380px] h-[500px]'
        } transition-all duration-300`}>
          {/* Chat Header */}
          <div className="bg-[#3f51b5] text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <SparkleIcon className="w-6 h-6" />
              <span className="font-medium">Agente IA</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleExpand}
                className="p-1.5 hover:bg-[#32408f] rounded-lg transition-colors"
              >
                {isExpanded ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </button>
              <button
                onClick={toggleChat}
                className="p-1.5 hover:bg-[#32408f] rounded-lg transition-colors"
              >
                <MdClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    chat.type === 'user'
                      ? 'bg-[#3f51b5] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {chat.message}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                title={isRecording ? 'Parar gravação' : 'Gravar mensagem de áudio'}
              >
                <MdMic className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-[#3f51b5] text-white rounded-lg px-4 py-2 hover:bg-[#32408f] transition-colors"
              >
                <MdSend className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAgentChat; 