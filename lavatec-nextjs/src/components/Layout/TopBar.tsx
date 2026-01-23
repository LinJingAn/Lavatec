import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSection } from '../../contexts/SectionContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MdOutlineSettings, 
  MdOutlineStorefront, 
  MdOutlineNotifications, 
  MdOutlineHelp
} from 'react-icons/md';
import SecondaryNavbar from '../Sidebar/SecondaryNavbar';
import LocationSelector from '../LocationSelector';
import ThemeToggle from '../ThemeToggle';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { activeSection, setActiveSection } = useSection();
  const { signOut } = useAuth();
  const [showHelpSidebar, setShowHelpSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isNavigatingByLinkRef = useRef(false);

  const helpSubItems = [
    { to: '/help/support', label: 'Suporte' },
    { to: '/help/documentation', label: 'Documentação' },
    { to: '/help/contact', label: 'Fale Conosco' },
    { to: '/help/faqs', label: 'Perguntas Frequentes' },
    { to: '/help/training', label: 'Recursos de Treinamento' }
  ];

  const notificationItems = [
    { to: '/notifications/orders', label: 'Novos Pedidos (2)' },
    { to: '/notifications/payments', label: 'Pagamentos Pendentes' },
    { to: '/notifications/maintenance', label: 'Manutenção Agendada' },
    { to: '/notifications/all', label: 'Ver Todas' }
  ];

  const userMenuItems = [
    { to: '/profile', label: 'Meu Perfil' },
    { to: '/profile/security', label: 'Segurança' },
    { to: '/profile/preferences', label: 'Preferências' },
    { to: '/company', label: 'Configurações da Empresa' },
    { to: '/logout', label: 'Sair' }
  ];

  useEffect(() => {
    if (isNavigatingByLinkRef.current) {
      isNavigatingByLinkRef.current = false;
      return;
    }
    setShowHelpSidebar(false);
    setShowNotifications(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const getButtonClasses = (section: 'admin' | 'stores') => {
    const baseClasses = "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors duration-200 focus:outline-none";
    const activeClasses = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";
    const inactiveClasses = "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800";
    
    return `${baseClasses} ${activeSection === section ? activeClasses : inactiveClasses}`;
  };

  const handleSectionChange = (section: 'admin' | 'stores') => {
    setActiveSection(section);
    // Close any open dropdowns when switching sections
    setShowHelpSidebar(false);
    setShowNotifications(false);
    setShowUserMenu(false);
  };

  const handleHelpClick = () => {
    setShowNotifications(false); // Close notifications if open
    setShowUserMenu(false); // Close user menu if open
    setShowHelpSidebar(!showHelpSidebar);
    if (showHelpSidebar && location.pathname.startsWith('/help')) {
      isNavigatingByLinkRef.current = true;
      if (activeSection === 'admin') {
        navigate('/unidades');
      } else {
        navigate('/stores/dashboard');
      }
    }
  };

  const handleNotificationsClick = () => {
    setShowHelpSidebar(false); // Close help if open
    setShowUserMenu(false); // Close user menu if open
    setShowNotifications(!showNotifications);
  };

  const handleUserMenuClick = () => {
    console.log('User menu button clicked, current state:', showUserMenu);
    setShowHelpSidebar(false); // Close help if open
    setShowNotifications(false); // Close notifications if open
    setShowUserMenu(!showUserMenu);
  };

  const handleHelpSidebarItemClick = () => {
    isNavigatingByLinkRef.current = true;
    setShowHelpSidebar(false);
  };

  const handleNotificationItemClick = () => {
    isNavigatingByLinkRef.current = true;
    setShowNotifications(false);
  };

  const handleUserMenuItemClick = () => {
    isNavigatingByLinkRef.current = true;
    setShowUserMenu(false);
  };

  const handleUserMenuNavigation = async (item: { to: string; label: string }) => {
    console.log('User menu item clicked:', item.label, 'with route:', item.to);
    
    if (item.to === '/logout') {
      // Handle logout
      console.log('Processing logout request...');
      setShowUserMenu(false); // Close the user menu
      try {
        console.log('Calling signOut function...');
        await signOut();
        console.log('SignOut function completed successfully');
      } catch (error) {
        console.error('Error during logout:', error);
        // Fallback navigation
        console.log('Fallback: navigating to login page');
        navigate('/login');
      }
    } else {
      // Handle regular navigation
      console.log('Navigating to:', item.to);
      isNavigatingByLinkRef.current = true;
      setShowUserMenu(false);
      navigate(item.to);
    }
  };

  return (
    <div className="relative">
      <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-5 z-20 transition-colors duration-300">
        {/* Left side - Admin and Stores */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSectionChange('admin')}
            className={getButtonClasses('admin')}
          >
            <MdOutlineSettings className="w-4 h-4" />
            <span className="text-sm font-medium">Admin</span>
          </button>

          <button
            onClick={() => handleSectionChange('stores')}
            className={getButtonClasses('stores')}
          >
            <MdOutlineStorefront className="w-4 h-4" />
            <span className="text-sm font-medium">Lojas</span>
          </button>
        </div>

        {/* Center - Location Selector */}
        <div className="flex-1 flex justify-center">
          <LocationSelector />
        </div>

        {/* Right side - User Menu */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          <button
            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none ${
              showHelpSidebar 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            onClick={handleHelpClick}
          >
            <MdOutlineHelp className="w-5 h-5" />
          </button>

          <div className="relative">
            <button 
              className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none ${
                showNotifications 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={handleNotificationsClick}
            >
              <MdOutlineNotifications className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 text-white text-[11px] w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>
          </div>

          <div className="flex items-center pl-2">
            <button 
              className="flex items-center space-x-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-2 py-1 transition-colors duration-200 focus:outline-none"
              onClick={handleUserMenuClick}
            >
              <span className="text-sm text-slate-700 dark:text-slate-300">{user?.name || 'User'}</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                {user?.name?.[0] || 'U'}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Help sidebar */}
      {showHelpSidebar && (
        <div className="absolute right-5 top-14 z-30 shadow-lg rounded-b-lg overflow-hidden max-h-96 overflow-x-hidden">
          <SecondaryNavbar
            title="Central de Ajuda"
            items={helpSubItems}
            onClose={handleHelpSidebarItemClick}
            showAddButton={false}
          />
        </div>
      )}

      {/* Notifications sidebar */}
      {showNotifications && (
        <div className="absolute right-20 top-14 z-30 shadow-lg rounded-b-lg overflow-hidden max-h-96 overflow-x-hidden">
          <SecondaryNavbar
            title="Notificações"
            items={notificationItems}
            onClose={handleNotificationItemClick}
            showAddButton={false}
          />
        </div>
      )}

      {/* User menu sidebar */}
      {showUserMenu && (
        <div className="absolute right-5 top-14 z-30 shadow-xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="w-64 bg-white dark:bg-slate-800 max-h-96 overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="py-4 px-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">Menu do Usuário</span>
            </div>
            <div className="py-2">
              {userMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log('Button clicked for item:', item.label, 'route:', item.to);
                    handleUserMenuNavigation(item);
                  }}
                  className={`w-full flex items-center justify-between px-6 py-2.5 text-sm cursor-pointer transition-colors duration-150 text-left whitespace-nowrap ${
                    item.to === '/logout' 
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="flex-1 min-w-0 truncate">{item.label}</span>
                  {item.to === '/logout' && (
                    <span className="ml-2 flex-shrink-0 text-red-500 dark:text-red-400">←</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar; 