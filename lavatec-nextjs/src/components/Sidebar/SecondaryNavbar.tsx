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
        flex items-center px-6 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150
        ${isActiveRoute 
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-medium' 
          : 'text-gray-600 dark:text-gray-300'}
      `}
      onClick={handleClick}
    >
      {label}
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
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto scrollbar-hide transition-colors duration-200">
      <div className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
        <span className="font-medium text-gray-800 dark:text-gray-200">{title}</span>
        {showAddButton && (
          <button 
            className="p-1 rounded-full text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
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