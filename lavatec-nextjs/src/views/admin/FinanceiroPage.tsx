import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

interface FinanceiroProps {}

const FinanceiroPage: React.FC<FinanceiroProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're exactly on the /admin/financeiro route
    if (location.pathname === '/admin/financeiro') {
      console.log('FinanceiroPage: Redirecting to the dashboard');
      
      // Navigate to the dashboard
      navigate('/admin/financeiro/dashboard', { replace: true });
    }
  }, [navigate, location.pathname]);

  // This component only handles redirection
  return null;
};

export default FinanceiroPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 