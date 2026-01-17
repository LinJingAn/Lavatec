import React, { useState } from 'react';
import { MdClose, MdOutlineLocalLaundryService, MdRefresh, MdSearch, MdMoreVert, MdAdd, MdPerson, MdPayment, MdPix, MdAttachMoney, MdCreditCard } from 'react-icons/md';
import { LaundryIcon } from '../../components/LaundryIcons';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: string;
  name: string;
  iconName: string;
  price: number;
  quantity: number;
  details?: string[];
  stains?: string[];
  extras?: string[];
  observation?: string;
}

interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const PDVPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState('dry-cleaning');
  const [activeGroup, setActiveGroup] = useState<string>('formal-wear');
  const [discount, setDiscount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForModifiers, setSelectedItemForModifiers] = useState<OrderItem | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [activeModifierTab, setActiveModifierTab] = useState<'details' | 'stains' | 'extras'>('details');
  const [observation, setObservation] = useState<string>('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // Mock client data - In a real app, this would come from an API
  const [clients] = useState<Client[]>([
    { id: '1', name: 'João Silva', phone: '(11) 98765-4321', email: 'joao@email.com' },
    { id: '2', name: 'Maria Santos', phone: '(11) 91234-5678', email: 'maria@email.com' },
    { id: '3', name: 'Pedro Oliveira', phone: '(11) 99876-5432', email: 'pedro@email.com' },
    // Add more mock clients as needed
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.phone?.includes(clientSearchQuery) ||
    client.email?.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const paymentMethods: PaymentMethod[] = [
    { id: 'cash', name: 'Dinheiro', icon: <MdAttachMoney className="w-6 h-6" /> },
    { id: 'credit', name: 'Cartão de Crédito', icon: <MdCreditCard className="w-6 h-6" /> },
    { id: 'debit', name: 'Cartão de Débito', icon: <MdPayment className="w-6 h-6" /> },
    { id: 'pix', name: 'PIX', icon: <MdPix className="w-6 h-6" /> }
  ];

  // Client selection modal
  const ClientSelectionModal = () => {
    if (!isClientModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[500px] max-h-[80vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Selecionar Cliente</h2>
            <button
              onClick={() => setIsClientModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <MdClose size={24} />
            </button>
          </div>
          
          <div className="p-4 border-b">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                onClick={() => {
                  setIsClientModalOpen(false);
                  navigate('/stores/customers/add', { state: { from: '/stores/pdv' } });
                }}
              >
                <MdAdd size={20} />
                Novo Cliente
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {filteredClients.map(client => (
              <button
                key={client.id}
                className="w-full p-3 text-left rounded-lg hover:bg-gray-50 flex flex-col gap-1"
                onClick={() => {
                  setSelectedClient(client);
                  setIsClientModalOpen(false);
                  setClientSearchQuery('');
                }}
              >
                <span className="font-medium">{client.name}</span>
                {client.phone && <span className="text-sm text-gray-500">{client.phone}</span>}
                {client.email && <span className="text-sm text-gray-500">{client.email}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Payment Modal Component
  const PaymentModal = () => {
    if (!isPaymentModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[500px] max-h-[80vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <MdClose size={24} />
            </button>
          </div>

          <div className="p-4">
            <div className="text-xl font-bold mb-4">
              Total: {formatCurrency(calculateTotal())}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-colors
                    ${selectedPaymentMethod === method.id 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'hover:bg-gray-50 border-gray-200'}`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  {method.icon}
                  <span className="font-medium">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t flex justify-end gap-2">
            <button
              className={`px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 ${!selectedPaymentMethod && 'opacity-50 cursor-not-allowed'}`}
              disabled={!selectedPaymentMethod}
              onClick={() => {
                // Here you would handle the payment processing
                alert(`Pagamento via ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.name} processado com sucesso!`);
                setIsPaymentModalOpen(false);
                setSelectedPaymentMethod(null);
                setSelectedItems([]);
                setDiscount(0);
                setSelectedClient(null);
              }}
            >
              Finalizar R$ {formatCurrency(calculateTotal()).replace('R$', '').trim()}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main menu categories
  const categories = [
    { id: 'dry-cleaning', name: 'Lavagem a Seco', color: 'bg-red-100' },
    { id: 'laundry', name: 'Lavanderia', color: 'bg-blue-100' },
    { id: 'pressed', name: 'Passadoria', color: 'bg-green-100' },
    { id: 'repairs', name: 'Reparos', color: 'bg-yellow-100' },
    { id: 'alterations', name: 'Ajustes', color: 'bg-purple-100' }
  ];

  // Service groups for each category
  const serviceGroups = {
    'dry-cleaning': [
      { id: 'formal-wear', name: 'Roupas Formais' },
      { id: 'delicates', name: 'Delicados' },
      { id: 'outerwear', name: 'Roupas Externas' },
      { id: 'special-items', name: 'Itens Especiais' }
    ],
    'laundry': [
      { id: 'everyday', name: 'Roupas do Dia a Dia' },
      { id: 'bedding', name: 'Roupas de Cama' },
      { id: 'towels', name: 'Toalhas' },
      { id: 'bulk', name: 'Lavagem em Massa' }
    ],
    'pressed': [
      { id: 'formal-pressed', name: 'Roupas Formais' },
      { id: 'casual-pressed', name: 'Roupas Casuais' },
      { id: 'delicate-pressed', name: 'Roupas Delicadas' },
      { id: 'bulk-pressed', name: 'Passadoria em Massa' }
    ],
    'repairs': [
      { id: 'basic-repairs', name: 'Reparos Básicos' },
      { id: 'advanced-repairs', name: 'Reparos Avançados' },
      { id: 'emergency-repairs', name: 'Reparos de Emergência' },
      { id: 'special-repairs', name: 'Reparos Especiais' }
    ],
    'alterations': [
      { id: 'basic-alterations', name: 'Ajustes Básicos' },
      { id: 'advanced-alterations', name: 'Ajustes Avançados' },
      { id: 'formal-alterations', name: 'Ajustes em Roupas Formais' },
      { id: 'special-alterations', name: 'Ajustes Especiais' }
    ]
  };

  // Modifiers that can be applied to items
  const modifiers = {
    'details': [
      { id: 'delicate', name: 'Delicado', price: 5.00 },
      { id: 'express', name: 'Expresso', price: 10.00 },
      { id: 'heavy-duty', name: 'Pesado', price: 8.00 },
      { id: 'special-care', name: 'Cuidado Especial', price: 12.00 }
    ],
    'stains': [
      { id: 'oil', name: 'Óleo', price: 8.00 },
      { id: 'ink', name: 'Tinta', price: 10.00 },
      { id: 'wine', name: 'Vinho', price: 12.00 },
      { id: 'blood', name: 'Sangue', price: 15.00 }
    ],
    'extras': [
      { id: 'starch', name: 'Goma', price: 5.00 },
      { id: 'softener', name: 'Amaciante', price: 4.00 },
      { id: 'fragrance', name: 'Perfume', price: 3.00 }
    ]
  };

  // Items for each service group
  const serviceItems = {
    'formal-wear': [
      { id: 'suit', name: 'Terno', iconName: 'suit', price: 45.00 },
      { id: 'dress', name: 'Vestido Social', iconName: 'dress', price: 35.00 },
      { id: 'blazer', name: 'Blazer', iconName: 'suit', price: 30.00 },
      { id: 'dress-pants', name: 'Calça Social', iconName: 'pants', price: 25.00 },
      { id: 'dress-shirt', name: 'Camisa Social', iconName: 'shirt', price: 20.00 },
      { id: 'tie', name: 'Gravata', iconName: 'hanger', price: 15.00 },
      { id: 'vest', name: 'Colete', iconName: 'suit', price: 22.00 },
      { id: 'formal-skirt', name: 'Saia Social', iconName: 'dress', price: 25.00 }
    ],
    'delicates': [
      { id: 'silk-blouse', name: 'Blusa de Seda', iconName: 'shirt', price: 35.00 },
      { id: 'cashmere', name: 'Cashmere', iconName: 'shirt', price: 45.00 },
      { id: 'sequin-dress', name: 'Vestido com Paetês', iconName: 'dress', price: 50.00 },
      { id: 'linen-suit', name: 'Terno de Linho', iconName: 'suit', price: 55.00 },
      { id: 'silk-scarf', name: 'Lenço de Seda', iconName: 'towel', price: 20.00 },
      { id: 'lace-dress', name: 'Vestido de Renda', iconName: 'dress', price: 45.00 },
      { id: 'silk-tie', name: 'Gravata de Seda', iconName: 'hanger', price: 20.00 },
      { id: 'chiffon-blouse', name: 'Blusa de Chiffon', iconName: 'shirt', price: 35.00 }
    ],
    'outerwear': [
      { id: 'winter-coat', name: 'Casaco de Inverno', iconName: 'suit', price: 40.00 },
      { id: 'leather-jacket', name: 'Jaqueta de Couro', iconName: 'suit', price: 45.00 },
      { id: 'parka', name: 'Parka', iconName: 'suit', price: 38.00 },
      { id: 'raincoat', name: 'Capa de Chuva', iconName: 'suit', price: 35.00 },
      { id: 'wool-coat', name: 'Casaco de Lã', iconName: 'suit', price: 42.00 },
      { id: 'trench-coat', name: 'Sobretudo', iconName: 'suit', price: 48.00 },
      { id: 'fur-coat', name: 'Casaco de Pele', iconName: 'suit', price: 60.00 },
      { id: 'down-jacket', name: 'Jaqueta de Plumas', iconName: 'suit', price: 50.00 }
    ],
    'special-items': [
      { id: 'wedding-dress', name: 'Vestido de Noiva', iconName: 'dress', price: 150.00 },
      { id: 'tuxedo', name: 'Smoking', iconName: 'suit', price: 65.00 },
      { id: 'gown', name: 'Vestido de Gala', iconName: 'dress', price: 75.00 },
      { id: 'christening-gown', name: 'Vestido de Batizado', iconName: 'dress', price: 60.00 },
      { id: 'communion-dress', name: 'Vestido de Primeira Comunhão', iconName: 'dress', price: 55.00 },
      { id: 'prom-dress', name: 'Vestido de Formatura', iconName: 'dress', price: 70.00 },
      { id: 'costume', name: 'Fantasia', iconName: 'dress', price: 45.00 },
      { id: 'ceremonial-uniform', name: 'Uniforme de Gala', iconName: 'suit', price: 55.00 }
    ],
    'everyday': [
      { id: 'shirt', name: 'Camisa', iconName: 'shirt', price: 15.00 },
      { id: 'pants', name: 'Calça', iconName: 'pants', price: 18.00 },
      { id: 't-shirt', name: 'Camiseta', iconName: 'shirt', price: 12.00 },
      { id: 'jeans', name: 'Jeans', iconName: 'pants', price: 20.00 },
      { id: 'shorts', name: 'Bermuda', iconName: 'pants', price: 15.00 },
      { id: 'skirt', name: 'Saia', iconName: 'dress', price: 18.00 },
      { id: 'blouse', name: 'Blusa', iconName: 'shirt', price: 16.00 },
      { id: 'polo-shirt', name: 'Camisa Polo', iconName: 'shirt', price: 16.00 }
    ],
    'bedding': [
      { id: 'sheets-single', name: 'Lençol Solteiro', iconName: 'bed', price: 25.00 },
      { id: 'sheets-double', name: 'Lençol Casal', iconName: 'bed', price: 30.00 },
      { id: 'duvet-cover', name: 'Capa de Edredom', iconName: 'bed', price: 35.00 },
      { id: 'comforter', name: 'Edredom', iconName: 'bed', price: 40.00 },
      { id: 'pillow-case', name: 'Fronha', iconName: 'bed', price: 10.00 },
      { id: 'bedspread', name: 'Colcha', iconName: 'bed', price: 35.00 },
      { id: 'blanket', name: 'Cobertor', iconName: 'bed', price: 30.00 },
      { id: 'mattress-cover', name: 'Protetor de Colchão', iconName: 'bed', price: 28.00 }
    ],
    'towels': [
      { id: 'bath-towel', name: 'Toalha de Banho', iconName: 'towel', price: 15.00 },
      { id: 'hand-towel', name: 'Toalha de Rosto', iconName: 'towel', price: 10.00 },
      { id: 'beach-towel', name: 'Toalha de Praia', iconName: 'towel', price: 20.00 },
      { id: 'bath-mat', name: 'Tapete de Banheiro', iconName: 'towel', price: 12.00 },
      { id: 'kitchen-towel', name: 'Pano de Prato', iconName: 'towel', price: 8.00 },
      { id: 'tablecloth', name: 'Toalha de Mesa', iconName: 'towel', price: 25.00 },
      { id: 'napkins', name: 'Guardanapos', iconName: 'towel', price: 5.00 },
      { id: 'robe', name: 'Roupão', iconName: 'towel', price: 30.00 }
    ],
    'bulk': [
      { id: 'bulk-shirts', name: 'Camisas em Massa', iconName: 'washer', price: 12.00 },
      { id: 'bulk-pants', name: 'Calças em Massa', iconName: 'washer', price: 15.00 },
      { id: 'bulk-uniforms', name: 'Uniformes em Massa', iconName: 'washer', price: 13.00 },
      { id: 'bulk-bedding', name: 'Roupas de Cama em Massa', iconName: 'washer', price: 20.00 },
      { id: 'bulk-towels', name: 'Toalhas em Massa', iconName: 'washer', price: 10.00 },
      { id: 'bulk-tablecloths', name: 'Toalhas de Mesa em Massa', iconName: 'washer', price: 18.00 },
      { id: 'bulk-napkins', name: 'Guardanapos em Massa', iconName: 'washer', price: 4.00 },
      { id: 'bulk-aprons', name: 'Aventais em Massa', iconName: 'washer', price: 8.00 }
    ],
    'repairs': [
      { id: 'button-repair', name: 'Troca de Botão', iconName: 'needle', price: 5.00 },
      { id: 'zipper-repair', name: 'Troca de Zíper', iconName: 'needle', price: 15.00 },
      { id: 'seam-repair', name: 'Reparo de Costura', iconName: 'needle', price: 10.00 },
      { id: 'patch', name: 'Remendo', iconName: 'needle', price: 12.00 },
      { id: 'hem-repair', name: 'Reparo de Bainha', iconName: 'needle', price: 8.00 },
      { id: 'lining-repair', name: 'Reparo de Forro', iconName: 'needle', price: 20.00 },
      { id: 'elastic-repair', name: 'Troca de Elástico', iconName: 'needle', price: 7.00 },
      { id: 'pocket-repair', name: 'Reparo de Bolso', iconName: 'needle', price: 10.00 }
    ],
    'alterations': [
      { id: 'hem-adjustment', name: 'Ajuste de Bainha', iconName: 'scissors', price: 15.00 },
      { id: 'waist-adjustment', name: 'Ajuste de Cintura', iconName: 'scissors', price: 20.00 },
      { id: 'sleeve-adjustment', name: 'Ajuste de Manga', iconName: 'scissors', price: 18.00 },
      { id: 'shoulder-adjustment', name: 'Ajuste de Ombro', iconName: 'scissors', price: 25.00 },
      { id: 'take-in', name: 'Ajuste para Diminuir', iconName: 'scissors', price: 22.00 },
      { id: 'let-out', name: 'Ajuste para Aumentar', iconName: 'scissors', price: 22.00 },
      { id: 'resize-dress', name: 'Redimensionar Vestido', iconName: 'scissors', price: 35.00 },
      { id: 'resize-suit', name: 'Redimensionar Terno', iconName: 'scissors', price: 45.00 }
    ],
    'formal-pressed': [
      { id: 'pressed-suit', name: 'Terno', iconName: 'iron', price: 25.00 },
      { id: 'pressed-dress', name: 'Vestido Social', iconName: 'iron', price: 20.00 },
      { id: 'pressed-blazer', name: 'Blazer', iconName: 'iron', price: 18.00 },
      { id: 'pressed-pants', name: 'Calça Social', iconName: 'iron', price: 15.00 },
      { id: 'pressed-shirt', name: 'Camisa Social', iconName: 'iron', price: 12.00 },
      { id: 'pressed-skirt', name: 'Saia Social', iconName: 'iron', price: 15.00 },
      { id: 'pressed-uniform', name: 'Uniforme Completo', iconName: 'iron', price: 28.00 },
      { id: 'pressed-coat', name: 'Casaco', iconName: 'iron', price: 20.00 }
    ],
    'casual-pressed': [
      { id: 'pressed-casual-shirt', name: 'Camisa Casual', iconName: 'iron', price: 10.00 },
      { id: 'pressed-casual-pants', name: 'Calça Casual', iconName: 'iron', price: 12.00 },
      { id: 'pressed-polo', name: 'Camisa Polo', iconName: 'iron', price: 10.00 },
      { id: 'pressed-tshirt', name: 'Camiseta', iconName: 'iron', price: 8.00 },
      { id: 'pressed-shorts', name: 'Bermuda', iconName: 'iron', price: 10.00 },
      { id: 'pressed-jeans', name: 'Jeans', iconName: 'iron', price: 12.00 },
      { id: 'pressed-blouse', name: 'Blusa', iconName: 'iron', price: 10.00 },
      { id: 'pressed-sweater', name: 'Suéter', iconName: 'iron', price: 15.00 }
    ],
    'delicate-pressed': [
      { id: 'pressed-silk-dress', name: 'Vestido de Seda', iconName: 'iron', price: 25.00 },
      { id: 'pressed-silk-blouse', name: 'Blusa de Seda', iconName: 'iron', price: 20.00 },
      { id: 'pressed-linen-suit', name: 'Terno de Linho', iconName: 'iron', price: 30.00 },
      { id: 'pressed-linen-shirt', name: 'Camisa de Linho', iconName: 'iron', price: 18.00 },
      { id: 'pressed-pleated-skirt', name: 'Saia Plissada', iconName: 'iron', price: 22.00 },
      { id: 'pressed-cashmere', name: 'Cashmere', iconName: 'iron', price: 25.00 },
      { id: 'pressed-sequin', name: 'Peça com Paetês', iconName: 'iron', price: 28.00 },
      { id: 'pressed-embroidered', name: 'Peça Bordada', iconName: 'iron', price: 25.00 }
    ],
    'bulk-pressed': [
      { id: 'pressed-bulk-shirts', name: 'Camisas em Massa', iconName: 'iron', price: 8.00 },
      { id: 'pressed-bulk-pants', name: 'Calças em Massa', iconName: 'iron', price: 10.00 },
      { id: 'pressed-bulk-uniforms', name: 'Uniformes em Massa', iconName: 'iron', price: 12.00 },
      { id: 'pressed-bulk-tablecloths', name: 'Toalhas de Mesa em Massa', iconName: 'iron', price: 15.00 },
      { id: 'pressed-bulk-napkins', name: 'Guardanapos em Massa', iconName: 'iron', price: 3.00 },
      { id: 'pressed-bulk-bedding', name: 'Roupas de Cama em Massa', iconName: 'iron', price: 12.00 },
      { id: 'pressed-bulk-curtains', name: 'Cortinas em Massa', iconName: 'iron', price: 18.00 },
      { id: 'pressed-bulk-aprons', name: 'Aventais em Massa', iconName: 'iron', price: 6.00 }
    ],
    'basic-repairs': [
      { id: 'basic-button', name: 'Troca de Botão Simples', iconName: 'needle', price: 5.00 },
      { id: 'basic-zipper', name: 'Troca de Zíper Comum', iconName: 'needle', price: 15.00 },
      { id: 'basic-seam', name: 'Costura Simples', iconName: 'needle', price: 10.00 },
      { id: 'basic-patch', name: 'Remendo Simples', iconName: 'needle', price: 12.00 },
      { id: 'basic-hem', name: 'Bainha Simples', iconName: 'needle', price: 8.00 },
      { id: 'basic-elastic', name: 'Troca de Elástico', iconName: 'needle', price: 7.00 },
      { id: 'basic-pocket', name: 'Reparo de Bolso', iconName: 'needle', price: 10.00 },
      { id: 'basic-hook', name: 'Troca de Gancho/Colchete', iconName: 'needle', price: 6.00 }
    ],
    'advanced-repairs': [
      { id: 'adv-zipper', name: 'Troca de Zíper Especial', iconName: 'needle', price: 25.00 },
      { id: 'adv-lining', name: 'Troca de Forro', iconName: 'needle', price: 35.00 },
      { id: 'adv-patch', name: 'Remendo Elaborado', iconName: 'needle', price: 20.00 },
      { id: 'adv-seam', name: 'Costura Reforçada', iconName: 'needle', price: 18.00 },
      { id: 'adv-button', name: 'Troca de Botões Especiais', iconName: 'needle', price: 12.00 },
      { id: 'adv-embellishment', name: 'Reparo de Bordados', iconName: 'needle', price: 30.00 },
      { id: 'adv-beading', name: 'Reparo de Pedrarias', iconName: 'needle', price: 35.00 },
      { id: 'adv-leather', name: 'Reparo em Couro', iconName: 'needle', price: 40.00 }
    ],
    'emergency-repairs': [
      { id: 'emg-seam', name: 'Costura Emergencial', iconName: 'needle', price: 15.00 },
      { id: 'emg-button', name: 'Botão Emergencial', iconName: 'needle', price: 8.00 },
      { id: 'emg-zipper', name: 'Zíper Emergencial', iconName: 'needle', price: 20.00 },
      { id: 'emg-hem', name: 'Bainha Emergencial', iconName: 'needle', price: 12.00 },
      { id: 'emg-rip', name: 'Rasgo Emergencial', iconName: 'needle', price: 18.00 },
      { id: 'emg-hook', name: 'Gancho Emergencial', iconName: 'needle', price: 8.00 },
      { id: 'emg-elastic', name: 'Elástico Emergencial', iconName: 'needle', price: 10.00 },
      { id: 'emg-strap', name: 'Alça Emergencial', iconName: 'needle', price: 12.00 }
    ],
    'special-repairs': [
      { id: 'special-vintage', name: 'Restauração Vintage', iconName: 'needle', price: 50.00 },
      { id: 'special-wedding', name: 'Reparo Vestido de Noiva', iconName: 'needle', price: 60.00 },
      { id: 'special-leather', name: 'Reparo Couro Especial', iconName: 'needle', price: 45.00 },
      { id: 'special-beading', name: 'Reparo Pedraria Complexo', iconName: 'needle', price: 40.00 },
      { id: 'special-sequin', name: 'Reparo Paetês Complexo', iconName: 'needle', price: 35.00 },
      { id: 'special-fur', name: 'Reparo em Pele', iconName: 'needle', price: 55.00 },
      { id: 'special-lace', name: 'Reparo em Renda', iconName: 'needle', price: 40.00 },
      { id: 'special-embroidery', name: 'Reparo Bordado Complexo', iconName: 'needle', price: 45.00 }
    ],
    'basic-alterations': [
      { id: 'basic-hem-adj', name: 'Ajuste de Bainha Simples', iconName: 'scissors', price: 15.00 },
      { id: 'basic-waist-adj', name: 'Ajuste de Cintura Simples', iconName: 'scissors', price: 20.00 },
      { id: 'basic-sleeve-adj', name: 'Ajuste de Manga Simples', iconName: 'scissors', price: 18.00 },
      { id: 'basic-length-adj', name: 'Ajuste de Comprimento', iconName: 'scissors', price: 20.00 },
      { id: 'basic-sides-adj', name: 'Ajuste Lateral Simples', iconName: 'scissors', price: 22.00 },
      { id: 'basic-shoulder-adj', name: 'Ajuste de Ombro Simples', iconName: 'scissors', price: 25.00 },
      { id: 'basic-neckline-adj', name: 'Ajuste de Decote Simples', iconName: 'scissors', price: 20.00 },
      { id: 'basic-fit-adj', name: 'Ajuste de Largura Simples', iconName: 'scissors', price: 22.00 }
    ],
    'advanced-alterations': [
      { id: 'adv-resize', name: 'Redimensionamento Completo', iconName: 'scissors', price: 45.00 },
      { id: 'adv-style', name: 'Mudança de Estilo', iconName: 'scissors', price: 50.00 },
      { id: 'adv-suit', name: 'Ajuste de Terno Completo', iconName: 'scissors', price: 60.00 },
      { id: 'adv-dress', name: 'Ajuste de Vestido Complexo', iconName: 'scissors', price: 55.00 },
      { id: 'adv-leather-alt', name: 'Ajuste em Couro', iconName: 'scissors', price: 65.00 },
      { id: 'adv-formal', name: 'Ajuste em Roupa de Gala', iconName: 'scissors', price: 70.00 },
      { id: 'adv-pattern', name: 'Alteração de Modelagem', iconName: 'scissors', price: 45.00 },
      { id: 'adv-vintage-alt', name: 'Ajuste em Peça Vintage', iconName: 'scissors', price: 55.00 }
    ],
    'formal-alterations': [
      { id: 'formal-wedding', name: 'Ajuste Vestido de Noiva', iconName: 'scissors', price: 120.00 },
      { id: 'formal-tuxedo', name: 'Ajuste de Smoking', iconName: 'scissors', price: 80.00 },
      { id: 'formal-gown', name: 'Ajuste Vestido de Gala', iconName: 'scissors', price: 90.00 },
      { id: 'formal-suit-full', name: 'Ajuste Terno Completo', iconName: 'scissors', price: 85.00 },
      { id: 'formal-coat', name: 'Ajuste Casaco Social', iconName: 'scissors', price: 70.00 },
      { id: 'formal-dress', name: 'Ajuste Vestido de Festa', iconName: 'scissors', price: 75.00 },
      { id: 'formal-blazer', name: 'Ajuste Blazer Social', iconName: 'scissors', price: 65.00 },
      { id: 'formal-pants', name: 'Ajuste Calça Social', iconName: 'scissors', price: 45.00 }
    ],
    'special-alterations': [
      { id: 'special-design', name: 'Redesign de Peça', iconName: 'scissors', price: 80.00 },
      { id: 'special-vintage-alt', name: 'Alteração Vintage', iconName: 'scissors', price: 75.00 },
      { id: 'special-leather-mod', name: 'Modificação em Couro', iconName: 'scissors', price: 85.00 },
      { id: 'special-fur-mod', name: 'Modificação em Pele', iconName: 'scissors', price: 95.00 },
      { id: 'special-beaded', name: 'Ajuste Peça com Pedraria', iconName: 'scissors', price: 90.00 },
      { id: 'special-embellished', name: 'Ajuste Peça Bordada', iconName: 'scissors', price: 85.00 },
      { id: 'special-costume', name: 'Ajuste de Fantasia', iconName: 'scissors', price: 70.00 },
      { id: 'special-uniform', name: 'Ajuste Uniforme Especial', iconName: 'scissors', price: 65.00 }
    ]
  };

  // Get items for selected group
  const selectedGroupItems = activeGroup ? serviceItems[activeGroup as keyof typeof serviceItems] || [] : [];

  const handleAddItem = (item: OrderItem) => {
    const newItem = { ...item, quantity: 1, details: [], stains: [], extras: [], observation: '' };
    setSelectedItems([...selectedItems, newItem]);
    setSelectedItemIndex(selectedItems.length);
    setActiveModifierTab('details');
    setObservation('');
  };

  const handleRemoveItem = (index: number) => {
    // Clear the selected item index if we're removing the selected item
    if (selectedItemIndex === index) {
      setSelectedItemIndex(null);
    } else if (selectedItemIndex !== null && selectedItemIndex > index) {
      // Adjust the selected item index if we're removing an item before it
      setSelectedItemIndex(selectedItemIndex - 1);
    }
    
    // Remove the item from the array
    setSelectedItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, change: number) => {
    const newItems = [...selectedItems];
    const newQuantity = newItems[index].quantity + change;
    if (newQuantity > 0) {
      newItems[index].quantity = newQuantity;
    setSelectedItems(newItems);
    } else {
      handleRemoveItem(index);
    }
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce((sum, item) => {
      let itemTotal = item.price * item.quantity;
      
      // Add details costs
      if (item.details) {
        itemTotal += item.details.reduce((detailSum, detailId) => {
          const detail = modifiers.details.find(d => d.id === detailId);
          return detailSum + (detail?.price || 0);
        }, 0);
      }
      
      // Add stain removal costs
      if (item.stains) {
        itemTotal += item.stains.reduce((stainSum, stainId) => {
          const stain = modifiers.stains.find(s => s.id === stainId);
          return stainSum + (stain?.price || 0);
        }, 0);
      }
      
      // Add extras costs
      if (item.extras) {
        itemTotal += item.extras.reduce((extraSum, extraId) => {
          const extra = modifiers.extras.find(e => e.id === extraId);
          return extraSum + (extra?.price || 0);
        }, 0);
      }
      
      return sum + itemTotal;
    }, 0);
    
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  // Function to handle tab changes
  const handleTabChange = (categoryId: string) => {
    setActiveTab(categoryId);
    // Set the first group of the selected category as active
    const firstGroup = serviceGroups[categoryId as keyof typeof serviceGroups]?.[0];
    if (firstGroup) {
      setActiveGroup(firstGroup.id);
    }
  };

  // Add modifier handling functions
  const toggleModifier = (type: 'details' | 'stains' | 'extras', modifierId: string) => {
    if (selectedItemIndex === null) return;
    
    setSelectedItems(selectedItems.map((item, index) => {
      if (index !== selectedItemIndex) return item;
      
      const currentModifiers = item[type] || [];
      const newModifiers = currentModifiers.includes(modifierId)
        ? currentModifiers.filter(id => id !== modifierId)
        : [...currentModifiers, modifierId];
      
      return { ...item, [type]: newModifiers };
    }));
  };

  const calculateItemTotal = (item: OrderItem) => {
    let itemTotal = item.price * item.quantity;
    
    // Add details costs
    if (item.details) {
      itemTotal += item.details.reduce((detailSum, detailId) => {
        const detail = modifiers.details.find(d => d.id === detailId);
        return detailSum + (detail?.price || 0);
      }, 0);
    }
    
    // Add stain removal costs
    if (item.stains) {
      itemTotal += item.stains.reduce((stainSum, stainId) => {
        const stain = modifiers.stains.find(s => s.id === stainId);
        return stainSum + (stain?.price || 0);
      }, 0);
    }
    
    // Add extras costs
    if (item.extras) {
      itemTotal += item.extras.reduce((extraSum, extraId) => {
        const extra = modifiers.extras.find(e => e.id === extraId);
        return extraSum + (extra?.price || 0);
      }, 0);
    }
    
    return itemTotal;
  };

  // Add new function to handle adding item to order
  const handleAddToOrder = () => {
    if (selectedItemIndex !== null) {
      // The item is already in the order, just reset the selection
      setSelectedItemIndex(null);
      setActiveModifierTab('details');
      setObservation('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Client Selection Modal */}
      <ClientSelectionModal />

      {/* Left Side - Service Selection */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="bg-white rounded-lg shadow-md p-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar serviço..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Abrir Item
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg select-none ${
                  activeTab === category.id 
                    ? 'bg-[#EEF3FF] text-[#4285f4]' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  userSelect: 'none',
                }}
                onClick={() => handleTabChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Service Groups Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {serviceGroups[activeTab as keyof typeof serviceGroups]?.map(group => (
              <button
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className={`p-4 text-left rounded-lg select-none ${
                  activeGroup === group.id
                    ? 'bg-[#EEF3FF] text-[#4285f4]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  userSelect: 'none',
                }}
              >
                {group.name}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          {activeGroup && (
            <div className="grid grid-cols-4 gap-3">
              {selectedGroupItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleAddItem({ ...item, quantity: 1 } as OrderItem)}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 select-none"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    userSelect: 'none',
                  }}
                >
                  <div className="text-gray-600 mb-2">
                    <LaundryIcon name={item.iconName} size={32} />
                </div>
                  <span className="text-sm text-center mb-1">{item.name}</span>
                  <span className="text-xs text-blue-600 font-medium">
                    R$ {item.price.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Modifier Section */}
          {selectedItemIndex !== null && (
            <div className="mt-6 border-t pt-4">
              {/* Modifier Tabs */}
              <div className="flex gap-2 mb-3">
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeModifierTab === 'details' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveModifierTab('details')}
                >
                  Detalhes
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeModifierTab === 'stains' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveModifierTab('stains')}
                >
                  Manchas
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeModifierTab === 'extras' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveModifierTab('extras')}
                >
                  Extras
                </button>
                </div>

              {/* Modifier Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {modifiers[activeModifierTab].map(modifier => (
                  <button
                    key={modifier.id}
                    onClick={() => selectedItemIndex !== null && toggleModifier(activeModifierTab, modifier.id)}
                    className={`p-2 text-left rounded-md text-sm flex justify-between items-center ${
                      selectedItemIndex !== null && selectedItems[selectedItemIndex][activeModifierTab]?.includes(modifier.id)
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{modifier.name}</span>
                    {modifier.price > 0 && (
                      <span className="text-xs">
                        + R$ {modifier.price.toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Observation Field */}
              <div className="mb-4">
                <textarea
                  placeholder="Observações..."
                  value={selectedItemIndex !== null ? (selectedItems[selectedItemIndex].observation || '') : ''}
                  onChange={(e) => {
                    if (selectedItemIndex !== null) {
                      setSelectedItems(selectedItems.map((item, index) => 
                        index === selectedItemIndex
                          ? { ...item, observation: e.target.value }
                          : item
                      ));
                    }
                  }}
                  className="w-full p-2 border rounded-md text-sm"
                  rows={3}
                />
              </div>

              {/* Add to Order Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleAddToOrder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <MdAdd size={20} />
                  Adicionar ao Pedido
                </button>
              </div>
            </div>
          )}
          </div>
      </div>

      {/* Right Side - Order Details */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Order Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Pedido #123</h2>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedItems([])}>
              <MdRefresh size={20} />
            </button>
          </div>
          <button
            onClick={() => setIsClientModalOpen(true)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex items-center gap-2 hover:bg-gray-50"
          >
            <MdPerson className="text-gray-400" size={20} />
            {selectedClient ? (
              <div>
                <div className="font-medium">{selectedClient.name}</div>
                {selectedClient.phone && (
                  <div className="text-sm text-gray-500">{selectedClient.phone}</div>
                )}
        </div>
            ) : (
              <span className="text-gray-500">Selecionar Cliente</span>
            )}
          </button>
        </div>

        {/* Selected Items */}
        <div className="flex-1 overflow-auto p-4">
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <div 
                key={index} 
                className={`mb-3 p-3 rounded-lg ${
                  selectedItemIndex === index ? 'bg-blue-50' : 'bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedItemIndex(index);
                  setActiveModifierTab('details');
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuantityChange(index, -1);
                          }}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuantityChange(index, 1);
                          }}
                        >
                          +
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 ml-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveItem(index);
                          }}
                          aria-label="Remover item"
                        >
                          <MdClose size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Base</span>
                        <span>R$ {item.price.toFixed(2)}</span>
                      </div>
                      {/* Show details if any */}
                      {item.details && item.details.length > 0 && (
                        <>
                          {item.details.map(detailId => {
                            const detail = modifiers.details.find(d => d.id === detailId);
                            return detail && (
                              <div key={detailId} className="flex justify-between text-gray-500">
                                <span>{detail.name}</span>
                                <span>+ R$ {detail.price.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </>
                      )}
                      {/* Show stains if any */}
                      {item.stains && item.stains.length > 0 && (
                        <>
                          {item.stains.map(stainId => {
                            const stain = modifiers.stains.find(s => s.id === stainId);
                            return stain && (
                              <div key={stainId} className="flex justify-between text-gray-500">
                                <span>{stain.name}</span>
                                <span>+ R$ {stain.price.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </>
                      )}
                      {/* Show extras if any */}
                      {item.extras && item.extras.length > 0 && (
                        <>
                          {item.extras.map(extraId => {
                            const extra = modifiers.extras.find(e => e.id === extraId);
                            return extra && (
                              <div key={extraId} className="flex justify-between text-gray-500">
                                <span>{extra.name}</span>
                                <span>+ R$ {extra.price.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </>
                      )}
                      {/* Show item total */}
                      <div className="flex justify-between font-medium text-gray-700 border-t mt-1 pt-1">
                        <span>Total por item</span>
                        <span>R$ {calculateItemTotal(item).toFixed(2)}</span>
                      </div>
                      {item.quantity > 1 && (
                        <div className="flex justify-between font-medium text-blue-600 mt-1">
                          <span>Total ({item.quantity}x)</span>
                          <span>R$ {(calculateItemTotal(item) * item.quantity).toFixed(2)}</span>
                        </div>
                      )}
                  </div>
                    {/* Show observation if exists */}
                    {item.observation && (
                      <p className="text-xs text-gray-500 mt-2 italic truncate">
                        Obs: {item.observation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MdOutlineLocalLaundryService size={48} className="mb-2" />
              <p>Nenhum item adicionado</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t p-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>R$ {calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Desconto</span>
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-16 text-right border rounded py-1 px-2 mr-1"
              />
              <span>%</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span>R$ {calculateTotal().toFixed(2)}</span>
          </div>
          <div>
            <button
              className={`w-full px-4 py-2 rounded-lg text-white flex items-center justify-center
                ${selectedItems.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={selectedItems.length === 0}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Finalizar
          </button>
          </div>
        </div>
      </div>

      {/* Add the modals */}
      <PaymentModal />
    </div>
  );
};

export default PDVPage; 