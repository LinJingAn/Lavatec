import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { useSidebar } from '../../contexts/SidebarContext';

interface SecondaryNavItemProps {
  to: string;
  label: string;
  active?: boolean;
  onItemClick: () => void;
}

const SecondaryNavItem: React.FC<SecondaryNavItemProps> = ({ to, label, active, onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setManualToggle } = useSidebar();
  const isActiveRoute = location.pathname === to;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('SecondaryNavItem clicked:', label, 'to:', to);
    
    // Set manual toggle flag to prevent auto-reopening
    setManualToggle(true);
    
    // Always close the sidebar first to ensure it closes
    onItemClick();
    
    // If we're not already on this route, navigate
    if (!isActiveRoute) {
      // Small delay to ensure sidebar closing animation starts first
      setTimeout(() => {
        navigate(to);
      }, 50);
    }
    
    // Keep the manual toggle flag set for a while to prevent auto-reopening
    setTimeout(() => {
      setManualToggle(false);
    }, 1000);
  };

  return (
    <NavLink
      to={to}
      className={`
        flex items-center px-6 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200 whitespace-nowrap
        ${isActiveRoute 
          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 font-medium' 
          : 'text-slate-600 dark:text-slate-300'}
      `}
      onClick={handleClick}
    >
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

interface SecondaryNavbarProps {
  title: string;
  items: { to: string; label: string }[];
  onClose: () => void;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const SecondaryNavbar: React.FC<SecondaryNavbarProps> = ({
  title,
  items,
  onClose,
  showAddButton = false,
  onAddClick
}) => {
  const navigate = useNavigate();
  const { setManualToggle } = useSidebar();
  
  const handleAddClick = () => {
    // Set manual toggle flag to prevent auto-reopening
    setManualToggle(true);
    
    // Close sidebar first
    onClose();
    
    // Small delay before navigation
    setTimeout(() => {
      // Navigate to the appropriate add page based on section
      if (title === 'Pedidos') {
        navigate('/stores/orders/new');
      } else if (title === 'Clientes') {
        navigate('/stores/customers/add');
      } else if (title === 'Serviços') {
        navigate('/services/add');
      } else if (onAddClick) {
        onAddClick();
      }
    }, 50);
    
    // Keep the manual toggle flag set for a while to prevent auto-reopening
    setTimeout(() => {
      setManualToggle(false);
    }, 1000);
  };
  
  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen overflow-y-auto overflow-x-hidden scrollbar-hide transition-colors duration-300">
      <div className="py-4 px-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
        <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap truncate">{title}</span>
        {showAddButton && (
          <button 
            className="p-1 rounded-lg text-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors duration-200 flex-shrink-0"
            onClick={handleAddClick}
            title={`Add ${title.toLowerCase()}`}
          >
            <MdAdd size={20} />
          </button>
        )}
      </div>
      
      <div className="py-2">
        <div className="py-1">
          {items.map((item, index) => (
            <SecondaryNavItem
              key={index}
              to={item.to}
              label={item.label}
              onItemClick={onClose}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar; 