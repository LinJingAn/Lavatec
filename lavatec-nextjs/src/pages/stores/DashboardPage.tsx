import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdShoppingCart, 
  MdPeople, 
  MdSettings, 
  MdLocalLaundryService,
  MdInventory,
  MdAssessment,
  MdLocalShipping
} from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the overview page
    navigate('/stores/dashboard/overview');
  }, [navigate]);

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">Redirecionando...</h1>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-300">Redirecionando para o Dashboard da Empresa...</p>
      </div>
    </div>
  );
};

export default DashboardPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 