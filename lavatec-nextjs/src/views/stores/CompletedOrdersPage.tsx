import React, { useEffect } from 'react';
import OrdersPage from './OrdersPage';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

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

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 