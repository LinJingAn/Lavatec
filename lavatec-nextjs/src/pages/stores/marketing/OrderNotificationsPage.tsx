import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdEdit, MdDelete, MdToggleOn, MdToggleOff } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const OrderNotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      status: 'order_placed',
      name: 'Pedido Realizado',
      enabled: true,
      channels: ['email', 'sms'],
      template: 'Obrigado pelo seu pedido #{order_number}. Nós iremos processá-lo em breve.'
    },
    {
      id: 2,
      status: 'order_processing',
      name: 'Pedido em Processamento',
      enabled: true,
      channels: ['email'],
      template: 'Seu pedido #{order_number} está sendo processado.'
    },
    {
      id: 3,
      status: 'order_ready',
      name: 'Pedido Pronto',
      enabled: true,
      channels: ['email', 'sms', 'push'],
      template: 'Seu pedido #{order_number} está pronto para retirada!'
    },
    {
      id: 4,
      status: 'order_completed',
      name: 'Pedido Concluído',
      enabled: true,
      channels: ['email'],
      template: 'Obrigado por escolher nossos serviços! Seu pedido #{order_number} foi concluído.'
    }
  ]);

  const handleBackToMarketing = () => {
    navigate('/stores/marketing');
  };

  const handleToggleNotification = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, enabled: !notification.enabled }
        : notification
    ));
  };

  const handleEditTemplate = (id: number) => {
    // In a real app, this would open a modal or navigate to an edit page
    console.log('Edit template:', id);
  };

  const handleDeleteTemplate = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
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
            <h1 className="text-2xl font-semibold">Notificações de Status de Pedido</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie notificações automáticas para atualizações de status de pedidos
            </p>
          </div>
        </div>
        <Button>
          <MdAdd className="mr-2" size={20} />
          Adicionar Novo Template
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{notification.name}</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Ativado:</span>
                  <Switch
                    checked={notification.enabled}
                    onCheckedChange={() => handleToggleNotification(notification.id)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleEditTemplate(notification.id)}
                    className="text-blue-500"
                    title="Editar template"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteTemplate(notification.id)}
                    className="text-red-500"
                    title="Excluir template"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Canais
                  </label>
                  <div className="flex space-x-2">
                    {notification.channels.map((channel) => (
                      <span
                        key={channel}
                        className="px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-700"
                      >
                        {channel.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                    {notification.template}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderNotificationsPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 