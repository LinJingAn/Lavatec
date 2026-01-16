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

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the overview page
    navigate('/stores/dashboard/overview');
  }, [navigate]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Redirecionando...</h1>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600">Redirecionando para o Dashboard da Empresa...</p>
      </div>
    </div>
  );
};

export default DashboardPage; 