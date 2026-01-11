import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus, getStatusLabel } from '@/models/LaundryOrder';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ 
  status, 
  size = 'md',
  className = ''
}) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return { 
          label: 'Novo', 
          variant: 'bg-blue-100 text-blue-800 border-blue-200' 
        };
      case 'received':
        return { 
          label: 'Recebido', 
          variant: 'bg-indigo-100 text-indigo-800 border-indigo-200' 
        };
      case 'processing':
        return { 
          label: 'Em Processamento', 
          variant: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
        };
      case 'quality_check':
        return { 
          label: 'Verificação de Qualidade', 
          variant: 'bg-orange-100 text-orange-800 border-orange-200' 
        };
      case 'ready':
        return { 
          label: 'Pronto para Entrega', 
          variant: 'bg-green-100 text-green-800 border-green-200' 
        };
      case 'delivered':
        return { 
          label: 'Entregue', 
          variant: 'bg-teal-100 text-teal-800 border-teal-200' 
        };
      case 'cancelled':
        return { 
          label: 'Cancelado', 
          variant: 'bg-red-100 text-red-800 border-red-200' 
        };
      case 'on_hold':
        return { 
          label: 'Em Espera', 
          variant: 'bg-gray-100 text-gray-800 border-gray-200' 
        };
      default:
        return { 
          label: getStatusLabel(status), 
          variant: 'bg-gray-100 text-gray-800 border-gray-200' 
        };
    }
  };

  const { label, variant } = getStatusConfig(status);
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  return (
    <Badge 
      className={`font-medium border ${variant} ${sizeClasses[size]} ${className}`} 
      variant="outline"
    >
      {label}
    </Badge>
  );
};

export default OrderStatusBadge;