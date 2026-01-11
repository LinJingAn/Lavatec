import React, { useEffect } from 'react';
import OrdersPage from './OrdersPage';

const PedidosAtivosPage: React.FC = () => {
  // Add debug logging
  useEffect(() => {
    console.log('PedidosAtivosPage mounted');
  }, []);

  // Instead of redirecting, we'll render the OrdersPage component directly
  // with the activeFilter preset to "active"
  return <OrdersPage initialFilter="active" />;
};

export default PedidosAtivosPage; 