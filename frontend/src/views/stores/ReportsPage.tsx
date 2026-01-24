import React from 'react';
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

const ReportsPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Store Reports</h1>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600">This is the Reports page in the My Stores section.</p>
      </div>
    </div>
  );
};

export default ReportsPage; 