import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LaundryOrder } from '@/models/LaundryOrder';
import { Customer } from '@/models/Customer';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CalendarDays, MapPin, Phone, User } from 'lucide-react';

interface OrderDetailsPanelProps {
  order: LaundryOrder;
  customer: Customer;
  className?: string;
}

const OrderDetailsPanel: React.FC<OrderDetailsPanelProps> = ({ 
  order, 
  customer,
  className = '' 
}) => {
  // Calculate total from items (fallback if subtotal not available)
  const calculatedSubtotal = order.items.reduce((sum, item) => sum + (item.subtotal || item.unitPrice * item.quantity), 0);
  
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pedido #{order.id}</CardTitle>
            <CardDescription>
              Criado em {formatDate(order.createdAt)}
            </CardDescription>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Informações do Cliente</h3>
            <div className="mt-2 grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-gray-400" />
                <span>{customer.name}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-gray-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                <span>{customer.address}</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                <span>Cliente desde {formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Itens do Pedido</h3>
            <div className="mt-2 space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between py-1 border-b border-gray-100 text-sm">
                  <div>
                    <span className="font-medium">{item.quantity}x</span> {item.serviceName}
                    {item.description && (
                      <p className="text-xs text-gray-500">{item.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div>{formatCurrency(item.subtotal || item.unitPrice * item.quantity)}</div>
                    {item.quantity > 1 && (
                      <div className="text-xs text-gray-500">
                        ({formatCurrency(item.unitPrice)} cada)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between mt-2 text-sm">
                <span>Taxa</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
            )}
            {order.discount && order.discount > 0 && (
              <div className="flex justify-between mt-2 text-sm text-green-600">
                <span>Desconto</span>
                <span>- {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
          
          {/* Additional Information */}
          {order.notes && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-500">Notas</h3>
              <p className="mt-2 text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
          
          {/* Delivery Information */}
          {order.deliveredDate && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-500">Informações de Entrega</h3>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                <span>Entregue em {formatDate(order.deliveredDate)}</span>
              </div>
            </div>
          )}
          {order.completedDate && !order.deliveredDate && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-500">Informações de Conclusão</h3>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                <span>Concluído em {formatDate(order.completedDate)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsPanel; 