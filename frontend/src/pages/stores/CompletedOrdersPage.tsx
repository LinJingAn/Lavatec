import React, { useEffect } from 'react';
import OrdersPage from './OrdersPage';

const PedidosConcluidosPage: React.FC = () => {
  // Add debug logging
  useEffect(() => {
    console.log('PedidosConcluidosPage mounted');
  }, []);

  // Instead of redirecting, we'll render the OrdersPage component directly
  // with the activeFilter preset to "completed"
  return <OrdersPage initialFilter="completed" />;
};

export default PedidosConcluidosPage; 