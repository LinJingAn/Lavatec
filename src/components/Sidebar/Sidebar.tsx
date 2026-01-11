import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useSection } from '../../contexts/SectionContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import {
  MdOutlineLocationOn,
  MdOutlinePeople,
  MdOutlineInventory2,
  MdOutlineAssignment,
  MdOutlineDevicesOther,
  MdOutlineLocalOffer,
  MdOutlineAccountCircle,
  MdOutlineDashboard,
  MdOutlineShoppingCart,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineInsertChart,
  MdOutlineStorefront,
  MdGroups,
  MdPerson,
  MdOutlineLocalLaundryService,
  MdOutlineDryCleaning,
  MdOutlinePayment,
  MdOutlineMarketing,
  MdOutlineCampaign,
  MdOutlineLocalShipping,
  MdAttachMoney
} from 'react-icons/md';
import SecondaryNavbar from './SecondaryNavbar';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  secondary?: boolean;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, secondary = false, active = false, onClick, className = '' }) => (
  <button
    type="button"
    data-sidebar-button={label}
    className={`
      flex flex-col items-center justify-center h-[72px] text-sm cursor-pointer transition-colors duration-150 w-full
      ${secondary 
        ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-50' 
        : active ? 'text-blue-600 font-medium hover:bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}
      ${className}
    `}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      console.log(`NavItem clicked: "${label}" button`);
      if (onClick) {
        onClick();
      }
    }}
  >
    <div className="flex items-center justify-center">
      <span className={`text-2xl ${active ? 'text-blue-600' : ''}`}>{icon}</span>
    </div>
    <span className="text-xs mt-1.5">{label}</span>
  </button>
);

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeSection, setActiveSection } = useSection();
  const { signOut } = useAuth();
  const { 
    showSecondarySidebar,
    closeSecondarySidebar,
    openSecondarySidebar,
    secondarySidebarTitle,
    secondarySidebarItems,
    isManualToggle,
    setManualToggle
  } = useSidebar();

  // Add direct state to manage secondary sidebar visibility
  const [directShowSidebar, setDirectShowSidebar] = useState(false);
  const [directSidebarTitle, setDirectSidebarTitle] = useState('');
  const [directSidebarItems, setDirectSidebarItems] = useState<{ to: string; label: string }[]>([]);

  // Previous section tracking for section changes
  const previousSectionRef = useRef(activeSection);

  // Close sidebar when switching sections
  useEffect(() => {
    if (previousSectionRef.current !== activeSection) {
      console.log('Section changed, closing sidebar');
      setDirectShowSidebar(false);
      setDirectSidebarTitle('');
      setDirectSidebarItems([]);
      previousSectionRef.current = activeSection;
    }
  }, [activeSection]);

  const handleLogout = async () => {
    // Use the signOut function from AuthContext
    console.log('Logout button clicked in Sidebar');
    try {
      await signOut();
      console.log('Logout successful');
      // The signOut function already handles navigation to login page
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback in case signOut fails
      navigate('/login');
    }
  };

  // Create a reliable sidebar toggling function that is guaranteed to work
  const forceToggleSidebar = (title: string, items: { to: string; label: string }[]) => {
    console.log(`Force toggling sidebar for: ${title}`);
    
    // If the same sidebar is open, close it
    if (showSecondarySidebar && secondarySidebarTitle === title) {
      console.log('Closing sidebar (same title)');
      closeSecondarySidebar();
      return;
    }
    
    // Otherwise, force close then open with a delay between
    // First, close any open sidebar
    closeSecondarySidebar();
    
    // Wait for state update to complete
    setTimeout(() => {
      console.log(`Opening sidebar for: ${title}`);
      
      // Then open the new one
      openSecondarySidebar(title, items);
      
      // Check if it actually opened
      setTimeout(() => {
        console.log('Sidebar state after toggling:', { 
          open: showSecondarySidebar, 
          title: secondarySidebarTitle,
          itemsCount: secondarySidebarItems.length 
        });
      }, 100);
    }, 100);
  };

  // Update all handler functions to use the force toggle function
  const handleNavItemClick = (title: string, subItems: { to: string; label: string }[]) => {
    console.log(`🖱️ BUTTON CLICKED: "${title}"`);
    directToggleSidebar(title, subItems);
  };

  const handleFinanceiroClick = () => {
    console.log('🖱️ BUTTON CLICKED: "Financeiro"');
    directToggleSidebar('Financeiro', financeiroSubItems);
  };

  const locationSubItems = [
    { to: '/unidades', label: 'Todas Unidades' },
    { to: '/unidades/list', label: 'Listagem' },
    { to: '/unidades/add', label: 'Adicionar' },
    { to: '/unidades/map', label: 'Mapa' },
  ];
  
  const teamSubItems = [
    { to: '/team', label: 'Equipe', icon: <MdGroups /> },
    { to: '/funcionarios', label: 'Funcionários', icon: <MdPerson /> },
  ];
  
  const tasksSubItems = [
    { to: '/tasks/assigned', label: 'Tarefas Atribuídas' },
    { to: '/tasks/completed', label: 'Tarefas Concluídas' },
    { to: '/tasks/create', label: 'Criar Tarefa' }
  ];
  
  const promotionsSubItems = [
    { to: '/promotions/active', label: 'Promoções Ativas' },
    { to: '/promotions/scheduled', label: 'Promoções Agendadas' },
    { to: '/promotions/create', label: 'Criar Promoção' }
  ];
  
  const devicesSubItems = [
    { to: '/devices/all', label: 'Todos os Dispositivos' },
    { to: '/devices/available', label: 'Dispositivos Disponíveis' },
    { to: '/devices/maintenance', label: 'Manutenção' }
  ];
  
  const helpSubItems = [
    { to: '/help/support', label: 'Suporte' },
    { to: '/help/documentation', label: 'Documentação' },
    { to: '/help/contact', label: 'Fale Conosco' }
  ];

  // Store-specific items
  const dashboardSubItems = [
    { to: '/stores/dashboard/overview', label: 'Visão Geral' },
    { to: '/stores/dashboard/analytics', label: 'Análises' },
    { to: '/stores/dashboard/performance', label: 'Desempenho' },
    { to: '/stores/dashboard/operational', label: 'Relatórios Operacionais' },
    { to: '/stores/dashboard/financial', label: 'Relatórios Financeiros' },
    { to: '/stores/dashboard/customer-analytics', label: 'Análise de Clientes' }
  ];
  
  const ordersSubItems = [
    { to: '/stores/orders', label: 'Todos os Pedidos' },
    { to: '/stores/orders/new', label: 'Criar Novo Pedido' },
    { to: '/stores/orders/active', label: 'Pedidos Ativos' },
    { to: '/stores/orders/completed', label: 'Pedidos Concluídos' }
  ];
  
  const customersSubItems = [
    { to: '/stores/customers', label: 'Todos os Clientes' },
    { to: '/stores/customers/add', label: 'Adicionar Cliente' },
    { to: '/stores/customers/categories', label: 'Categorias' },
    { to: '/stores/customers/regular', label: 'Clientes Regulares' },
    { to: '/stores/customers/heavy', label: 'Compradores Frequentes' },
    { to: '/stores/customers/occasional', label: 'Clientes Ocasionais' },
    { to: '/stores/customers/rare', label: 'Clientes Raros' }
  ];
  
  const marketingSubItems = [
    { to: '/stores/marketing', label: 'Visão Geral' },
    { to: '/stores/marketing/email-templates', label: 'Templates de Email' },
    { to: '/stores/marketing/sms-templates', label: 'Templates de SMS' },
    { to: '/stores/marketing/order-notifications', label: 'Notificações de Status' },
    { to: '/stores/marketing/customer-segmentation', label: 'Segmentação de Clientes' },
    { to: '/stores/marketing/campaigns', label: 'Campanhas Promocionais' },
    { to: '/stores/marketing/communication-history', label: 'Histórico de Comunicação' },
    { to: '/stores/marketing/automated-flows', label: 'Fluxos Automatizados' },
    { to: '/stores/marketing/push-notifications', label: 'Notificações Push' },
    { to: '/stores/marketing/loyalty', label: 'Programa de Fidelidade' }
  ];
  
  const machinesSubItems = [
    { to: '/stores/machines', label: 'Visão Geral' },
    { to: '/stores/machines/list', label: 'Lista de Máquinas' },
    { to: '/stores/machines/maintenance', label: 'Manutenção' },
    { to: '/stores/machines/schedule', label: 'Agendamento' },
    { to: '/stores/machines/reports', label: 'Relatórios' },
  ];
  
  const storeProductsSubItems = [
    { to: '/services', label: 'Listar Serviços' },
    { to: '/services/add', label: 'Adicionar Serviço' },
    { to: '/services/categories', label: 'Categorias' },
    { to: '/services/garment-categories', label: 'Categorias de Roupas' },
    { to: '/services/garment-types', label: 'Tipos de Roupas' },
    { to: '/services/pricing', label: 'Gestão de Preços' },
    { to: '/services/pricing/history', label: 'Histórico de Preços' },
    { to: '/services/pricing/bulk-update', label: 'Atualização em Massa' }
  ];
  
  const reportsSubItems = [
    { to: '/stores/reports/sales', label: 'Relatórios de Vendas' },
    { to: '/stores/reports/customers', label: 'Relatórios de Clientes' },
    { to: '/stores/reports/machines', label: 'Uso de Máquinas' }
  ];

  // Add logistics subitems
  const logisticsSubItems = [
    { to: '/stores/logistics', label: 'Visão Geral' },
    { to: '/stores/logistics/deliveries', label: 'Entregas' },
    { to: '/stores/logistics/drivers', label: 'Motoristas' },
    { to: '/stores/logistics/routes', label: 'Planejamento de Rota' },
    { to: '/stores/logistics/tracking', label: 'Rastreamento em Tempo Real' }
  ];

  // Add financeiro subitems
  const financeiroSubItems = [
    { to: '/admin/financeiro/dashboard', label: 'Visão Geral' },
    { to: '/admin/financeiro/contas-receber', label: 'Contas a Receber' },
    { to: '/admin/financeiro/contas-pagar', label: 'Contas a Pagar' },
    { to: '/admin/financeiro/relatorios', label: 'Relatórios' },
    { to: '/admin/financeiro/conciliacao', label: 'Conciliação' }
  ];

  // Add PDV subItems
  const pdvSubItems = [
    { to: '/stores/pdv', label: 'PDV Principal' },
    { to: '/stores/pdv/history', label: 'Histórico de Vendas' },
    { to: '/stores/pdv/settings', label: 'Configurações' }
  ];

  // Add Auto Serviço subItems
  const autoServicoSubItems = [
    { to: '/stores/self-service', label: 'Visão Geral' },
    { to: '/stores/self-service/machines', label: 'Máquinas' },
    { to: '/stores/self-service/transactions', label: 'Transações' },
    { to: '/stores/self-service/settings', label: 'Configurações' }
  ];

  // Helper function to get the URL prefix for a sidebar section
  const getSidebarPrefixFromTitle = (title: string): string => {
    switch (title) {
      case 'Unidades': return '/unidades';
      case 'Funcionários': return '/team';
      case 'Tasks': return '/tasks';
      case 'Promotions': return '/promotions';
      case 'Help': return '/help';
      case 'Dashboard': return '/stores/dashboard';
      case 'Pedidos': return '/stores/orders';
      case 'Clientes': return '/stores/customers';
      case 'Serviços': return '/services';
      case 'Máquinas': return '/stores/machines';
      case 'Relatórios': return '/stores/reports';
      case 'Marketing': return '/stores/marketing';
      case 'Logística': return '/stores/logistics';
      case 'Financeiro': return '/admin/financeiro';
      default: return '';
    }
  };

  // Function to directly toggle the sidebar without using context
  const directToggleSidebar = (title: string, items: { to: string; label: string }[]) => {
    console.log(`=== TOGGLE CLICKED for "${title}" ===`);
    console.log('Current state:', { 
      directShowSidebar, 
      directSidebarTitle,
      'is same title?': directSidebarTitle === title
    });
    
    // SIMPLE LOGIC: If this exact sidebar is currently showing, hide it
    if (directShowSidebar && directSidebarTitle === title) {
      console.log('🔄 SAME SIDEBAR - CLOSING IT');
      setDirectShowSidebar(false);
      setDirectSidebarTitle('');
      setDirectSidebarItems([]);
      return;
    }
    
    // Otherwise, show this sidebar (closing any other that might be open)
    console.log('🔄 OPENING NEW SIDEBAR:', title);
    setDirectSidebarTitle(title);
    setDirectSidebarItems(items);
    setDirectShowSidebar(true);
  };

  // Helper function to determine which main sidebar button should be active
  const getActiveSidebarButton = (pathname: string, section: 'admin' | 'stores') => {
    if (section === 'stores') {
      if (pathname.startsWith('/stores/dashboard')) return 'Dashboard';
      if (pathname.startsWith('/stores/orders')) return 'Pedidos';
      if (pathname.startsWith('/stores/customers')) return 'Clientes';
      if (pathname.startsWith('/services') || pathname.startsWith('/stores/products')) return 'Serviços';
      if (pathname.startsWith('/stores/marketing')) return 'Marketing';
      if (pathname.startsWith('/stores/logistics')) return 'Logística';
      if (pathname.startsWith('/stores/pdv')) return 'PDV';
      if (pathname.startsWith('/stores/self-service')) return 'Auto Serviço';
    } else {
      if (pathname.startsWith('/unidades')) return 'Unidades';
      if (pathname.startsWith('/team') || pathname.startsWith('/funcionarios')) return 'Funcionários';
      if (pathname.startsWith('/tasks')) return 'Tasks';
      if (pathname.startsWith('/promotions')) return 'Promotions';
      if (pathname.startsWith('/admin/financeiro')) return 'Financeiro';
      if (pathname.startsWith('/stores/reports')) return 'Relatórios';
      if (pathname.startsWith('/stores/machines')) return 'Máquinas';
    }
    return null;
  };

  const activeSidebarButton = getActiveSidebarButton(location.pathname, activeSection);

  if (activeSection === 'stores') {
    return (
      <div className="flex">
        <div className="w-24 bg-white border-r border-gray-100 flex flex-col" style={{ height: 'calc(100vh - 60px)' }}>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <ul className="flex flex-col w-full items-center space-y-2 py-4">
              <li className="w-full">
                <NavItem 
                  icon={<MdOutlineDashboard />} 
                  label="Dashboard"
                  active={activeSidebarButton === 'Dashboard'}
                  onClick={() => handleNavItemClick('Dashboard', dashboardSubItems)}
                />
              </li>
              <li className="w-full">
                <NavItem 
                  icon={<MdOutlineShoppingCart />} 
                  label="Pedidos"
                  active={activeSidebarButton === 'Pedidos'}
                  onClick={() => handleNavItemClick('Pedidos', ordersSubItems)}
                />
              </li>
              <li className="w-full">
                <NavItem 
                  icon={<MdOutlinePeople />} 
                  label="Clientes"
                  active={activeSidebarButton === 'Clientes'}
                  onClick={() => handleNavItemClick('Clientes', customersSubItems)}
                />
              </li>
              <li className="w-full">
                <NavItem 
                  icon={<MdOutlineDryCleaning />} 
                  label="Serviços"
                  active={activeSidebarButton === 'Serviços'}
                  onClick={() => handleNavItemClick('Serviços', storeProductsSubItems)}
                />
              </li>
              <li className="w-full">
                <NavItem 
                  icon={<MdOutlineCampaign />} 
                  label="Marketing"
                  active={activeSidebarButton === 'Marketing'}
                  onClick={() => handleNavItemClick('Marketing', marketingSubItems)}
                />
              </li>
              <li className="w-full">
                <NavItem 
                  icon={<MdOutlineLocalShipping />} 
                  label="Logística"
                  active={activeSidebarButton === 'Logística'}
                  onClick={() => handleNavItemClick('Logística', logisticsSubItems)}
                />
              </li>
              <li className="w-full">
                <NavItem 
                  icon={<MdOutlinePayment />} 
                  label="PDV"
                  active={activeSidebarButton === 'PDV'}
                  onClick={() => handleNavItemClick('PDV', pdvSubItems)}
                />
              </li>
              <li className="w-full">
                <NavItem 
                  icon={<MdOutlineLocalLaundryService />} 
                  label="Auto Serviço"
                  active={activeSidebarButton === 'Auto Serviço'}
                  onClick={() => handleNavItemClick('Auto Serviço', autoServicoSubItems)}
                />
              </li>
            </ul>
          </div>
          
          <div className="flex-shrink-0 border-t border-gray-100">
            <ul className="w-full flex flex-col items-center space-y-2 py-4">
              <li className="w-full pb-4">
                <button 
                  className="w-full flex flex-col items-center justify-center h-[72px] text-sm text-red-500 cursor-pointer hover:bg-red-50 transition-colors duration-150"
                  onClick={handleLogout}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-2xl"><MdOutlineLogout /></span>
                  </div>
                  <span className="text-xs mt-1.5">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {directShowSidebar && (
          <SecondaryNavbar
            title={directSidebarTitle}
            items={directSidebarItems}
            onClose={() => {
              console.log('🔄 CLOSE BUTTON CLICKED for:', directSidebarTitle);
              setDirectShowSidebar(false);
              setDirectSidebarTitle('');
              setDirectSidebarItems([]);
            }}
            showAddButton={['Orders', 'Clientes', 'Serviços', 'Marketing', 'Logística'].includes(directSidebarTitle)}
            onAddClick={() => console.log('Add new item')}
          />
        )}
      </div>
    );
  }

  // Admin section
  return (
    <div className="flex">
      <div className="w-24 bg-white border-r border-gray-100 flex flex-col" style={{ height: 'calc(100vh - 60px)' }}>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <ul className="flex flex-col w-full items-center space-y-2 py-4">
            <li className="w-full">
              <NavItem 
                icon={<MdOutlineStorefront />}
                label="Unidades"
                active={activeSidebarButton === 'Unidades'}
                onClick={() => handleNavItemClick('Unidades', locationSubItems)}
              />
            </li>
            
            <li className="w-full">
              <NavItem 
                icon={<MdOutlinePeople />}
                label="Funcionários"
                active={activeSidebarButton === 'Funcionários'}
                onClick={() => handleNavItemClick('Funcionários', teamSubItems)}
              />
            </li>
            
            <li className="w-full">
              <NavItem 
                icon={<MdOutlineAssignment />} 
                label="Tarefas"
                active={activeSidebarButton === 'Tasks'}
                onClick={() => handleNavItemClick('Tasks', tasksSubItems)}
              />
            </li>
            
            <li className="w-full">
              <NavItem 
                icon={<MdOutlineLocalOffer />} 
                label="Promoções"
                active={activeSidebarButton === 'Promotions'}
                onClick={() => handleNavItemClick('Promotions', promotionsSubItems)}
              />
            </li>

            <li className="w-full">
              <NavItem 
                icon={<MdAttachMoney />}
                label="Financeiro"
                active={activeSidebarButton === 'Financeiro'}
                onClick={handleFinanceiroClick}
              />
            </li>

            <li className="w-full">
              <NavItem 
                icon={<MdOutlineInsertChart />}
                label="Relatórios"
                active={activeSidebarButton === 'Relatórios'}
                onClick={() => handleNavItemClick('Relatórios', reportsSubItems)}
              />
            </li>

            <li className="w-full">
              <NavItem 
                icon={<MdOutlineSettings />}
                label="Máquinas"
                active={activeSidebarButton === 'Máquinas'}
                onClick={() => handleNavItemClick('Máquinas', machinesSubItems)}
              />
            </li>
          </ul>
        </div>

        <div className="flex-shrink-0 border-t border-gray-100">
          <ul className="w-full flex flex-col items-center space-y-2 py-4">
            <li className="w-full pb-4">
              <button 
                className="w-full flex flex-col items-center justify-center h-[72px] text-sm text-red-500 cursor-pointer hover:bg-red-50 transition-colors duration-150"
                onClick={handleLogout}
              >
                <div className="flex items-center justify-center">
                  <span className="text-2xl"><MdOutlineLogout /></span>
                </div>
                <span className="text-xs mt-1.5">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {directShowSidebar && (
        <SecondaryNavbar
          title={directSidebarTitle}
          items={directSidebarItems}
          onClose={() => {
            console.log('🔄 CLOSE BUTTON CLICKED for:', directSidebarTitle);
            setDirectShowSidebar(false);
            setDirectSidebarTitle('');
            setDirectSidebarItems([]);
          }}
          showAddButton={['Unidades', 'Funcionários', 'Tasks', 'Promotions', 'Financeiro', 'Relatórios', 'Máquinas'].includes(directSidebarTitle)}
          onAddClick={() => console.log('Add new item')}
        />
      )}
    </div>
  );
};

export default Sidebar; 