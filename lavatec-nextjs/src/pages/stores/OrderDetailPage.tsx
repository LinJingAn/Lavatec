import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPrint, MdDownload, MdOutlineLocalShipping, MdLocationOn, MdPerson, MdEmail, MdPhone, MdMessage, MdOutlineCalendarToday, MdAccessTime, MdPayment, MdReceipt } from 'react-icons/md';

// Dados de exemplo para um único pedido
const SAMPLE_ORDER = {
  id: 'DS-1535',
  createdAt: '2024-04-22T10:30:00Z',
  customer: { 
    id: '1235',
    name: 'Donna Jean', 
    email: 'donna.jean@example.com',
    phone: '(415) 555-5555',
    address: '456 Washington Ave, Apt 3B',
    city: 'New York',
    state: 'NY',
    zipCode: '10022'
  },
  status: 'ready_for_intake',
  statusHistory: [
    { status: 'created', timestamp: '2024-04-22T09:30:00Z', user: 'Donna Jean' },
    { status: 'ready_for_intake', timestamp: '2024-04-22T10:30:00Z', user: 'System' }
  ],
  items: [
    { id: '1', name: 'Paletó', category: 'Lavagem a Seco', price: 12.50, quantity: 1 },
    { id: '2', name: 'Camisa Social', category: 'Lavagem a Seco', price: 6.25, quantity: 1 },
    { id: '3', name: 'Calça', category: 'Lavagem a Seco', price: 7.00, quantity: 1 },
    { id: '4', name: 'Camisas', category: 'Lavanderia', price: 2.45, quantity: 5 }
  ],
  delivery: {
    type: 'pickup',
    scheduledDate: '2024-04-24',
    scheduledTime: '15:00-16:00',
    address: '456 Washington Ave, Apt 3B, New York, NY 10022',
    instructions: 'Ligar na chegada',
    deliveryFee: 0
  },
  payment: {
    method: 'card',
    cardLast4: '4242',
    subtotal: 38.00,
    discount: { name: 'Pacote na Loja', amount: 5.50, percentage: 15 },
    tip: { amount: 5.00, percentage: 15 },
    serviceFee: 0.00,
    total: 37.50,
    isPaid: true,
    paidAmount: 37.50
  },
  notes: 'Cliente mencionou mancha na gola do paletó. Precisa de cuidado extra.',
  store: { name: '123 Belle Ave', id: '1', location: '6/27/20, DB (Sam Tse)' },
  assignedTo: 'Sam Tse'
};

// Componente de status do pedido
const OrderStatus = ({ status }: { status: string }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-600";
  let statusText = status;

  switch (status) {
    case 'ready_for_intake':
      bgColor = "bg-blue-100";
      textColor = "text-blue-600";
      statusText = "Pronto para Recebimento";
      break;
    case 'en_route':
      bgColor = "bg-indigo-100";
      textColor = "text-indigo-600";
      statusText = "A Caminho da Loja";
      break;
    case 'submitted_online':
      bgColor = "bg-purple-100";
      textColor = "text-purple-600";
      statusText = "Enviado Online";
      break;
    case 'processing':
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-600";
      statusText = "Em Processamento";
      break;
    case 'ready_for_customer':
      bgColor = "bg-green-100";
      textColor = "text-green-600";
      statusText = "Pronto para o Cliente";
      break;
    case 'ready_for_driver':
      bgColor = "bg-orange-100";
      textColor = "text-orange-600";
      statusText = "Pronto para o Motorista";
      break;
    default:
      break;
  }

  return (
    <span className={`${bgColor} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded`}>
      {statusText}
    </span>
  );
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(SAMPLE_ORDER);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Calcular total de peças/itens
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calcular preço total para cada categoria
  const categoryTotals = order.items.reduce((acc, item) => {
    if (!(acc as Record<string, number>)[item.category]) {
      (acc as Record<string, number>)[item.category] = 0;
    }
    (acc as Record<string, number>)[item.category] += (item.price * item.quantity);
    return acc;
  }, {});

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Cabeçalho com navegação e ações */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/stores/orders')}
            className="mr-4 flex items-center text-gray-500 hover:text-gray-700"
          >
            <MdArrowBack size={20} className="mr-1" />
            <span>Voltar para Pedidos</span>
          </button>
          <h1 className="text-2xl font-semibold">Pedido {order.id}</h1>
          <OrderStatus status={order.status} />
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <MdPrint size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <MdDownload size={20} />
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Atualizar Status
          </button>
        </div>
      </div>
      
      {/* Cards de resumo do pedido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Cliente</h3>
          <div className="flex items-start mb-2">
            <div className="mr-3 mt-1">
              <MdPerson className="text-gray-400" size={20} />
            </div>
            <div>
              <div className="font-medium">{order.customer.name}</div>
              <div className="text-sm text-gray-500">ID: {order.customer.id}</div>
            </div>
          </div>
          <div className="flex items-start mb-2">
            <div className="mr-3 mt-1">
              <MdEmail className="text-gray-400" size={20} />
            </div>
            <div>
              <div className="text-sm text-blue-500">{order.customer.email}</div>
            </div>
          </div>
          <div className="flex items-start mb-2">
            <div className="mr-3 mt-1">
              <MdPhone className="text-gray-400" size={20} />
            </div>
            <div>
              <div className="text-sm">{order.customer.phone}</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <MdLocationOn className="text-gray-400" size={20} />
            </div>
            <div>
              <div className="text-sm">{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zipCode}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Detalhes do Pedido</h3>
          <div className="flex justify-between mb-2">
            <div className="text-sm">Total de itens:</div>
            <div className="font-medium">{totalItems}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm">Data do pedido:</div>
            <div className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm">Loja:</div>
            <div className="font-medium">{order.store.name}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm">Atribuído a:</div>
            <div className="font-medium">{order.assignedTo}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pagamento</h3>
          <div className="flex justify-between mb-2">
            <div className="text-sm">Método de pagamento:</div>
            <div className="font-medium">Cartão terminando em {order.payment.cardLast4}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm">Subtotal:</div>
            <div className="font-medium">R$ {order.payment.subtotal.toFixed(2)}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm">Desconto:</div>
            <div className="font-medium">-R$ {order.payment.discount.amount.toFixed(2)}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm">Gorjeta:</div>
            <div className="font-medium">R$ {order.payment.tip.amount.toFixed(2)}</div>
          </div>
          <div className="flex justify-between font-medium">
            <div>Total:</div>
            <div>R$ {order.payment.total.toFixed(2)}</div>
          </div>
          <div className="mt-2 pt-2 border-t">
            <div className="flex justify-between">
              <div className="text-sm">Status do pagamento:</div>
              <div className="font-medium text-green-600">
                {order.payment.isPaid ? `Pago (R$ ${order.payment.paidAmount.toFixed(2)})` : 'Não Pago'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Abas */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('details')}
            >
              Itens do Pedido
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'delivery' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('delivery')}
            >
              Entrega
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('history')}
            >
              Histórico de Status
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('notes')}
            >
              Notas
            </button>
          </nav>
        </div>
        
        {/* Conteúdo das abas */}
        <div className="p-4">
          {activeTab === 'details' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Itens do Pedido</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço Unitário
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium">
                        Subtotal:
                      </td>
                      <td className="px-6 py-3 text-sm font-medium">
                        R$ {order.payment.subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium">
                        Desconto ({order.payment.discount.name}):
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-red-500">
                        -R$ {order.payment.discount.amount.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium">
                        Gorjeta ({order.payment.tip.percentage}%):
                      </td>
                      <td className="px-6 py-3 text-sm font-medium">
                        R$ {order.payment.tip.amount.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium">
                        Total:
                      </td>
                      <td className="px-6 py-3 text-sm font-medium">
                        R$ {order.payment.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'delivery' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Informações de Entrega</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Método de Entrega</h4>
                    <div className="flex items-center">
                      <MdOutlineLocalShipping className="text-gray-400 mr-2" size={20} />
                      <span>{order.delivery.type === 'pickup' ? 'Retirada na Loja' : 'Entrega'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Data e Hora Agendadas</h4>
                    <div className="flex items-center mb-2">
                      <MdOutlineCalendarToday className="text-gray-400 mr-2" size={20} />
                      <span>{new Date(order.delivery.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MdAccessTime className="text-gray-400 mr-2" size={20} />
                      <span>{order.delivery.scheduledTime}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Endereço de Entrega</h4>
                    <div className="flex items-start">
                      <MdLocationOn className="text-gray-400 mr-2" size={20} />
                      <span>{order.delivery.address}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Instruções</h4>
                    <div className="flex items-start">
                      <MdMessage className="text-gray-400 mr-2" size={20} />
                      <span>{order.delivery.instructions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Histórico de Status</h3>
              <div className="space-y-4">
                {order.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start pb-4 border-b border-gray-100">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <MdOutlineLocalShipping className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <div className="font-medium">
                        {history.status === 'created' ? 'Pedido Criado' : 
                         history.status === 'ready_for_intake' ? 'Pronto para Recebimento' : history.status}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(history.timestamp).toLocaleString()} por {history.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'notes' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Notas do Pedido</h3>
              {order.notes ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{order.notes}</p>
                </div>
              ) : (
                <div className="text-gray-500">Nenhuma nota para este pedido.</div>
              )}
              
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3">Adicionar Nota</h4>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md" 
                  rows={4}
                  placeholder="Digite uma nota sobre este pedido..."
                ></textarea>
                <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  Salvar Nota
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 