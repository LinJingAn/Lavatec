import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd } from 'react-icons/md';

const AutomatedCampaignsPage = () => {
  const navigate = useNavigate();

  const handleBackToMarketing = () => {
    navigate('/stores/marketing');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleBackToMarketing}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            <MdArrowBack className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Automated Campaigns</h1>
            <p className="text-sm text-gray-600 mt-1">
              Set up marketing campaigns that run on a schedule
            </p>
          </div>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <MdAdd className="mr-1" size={20} />
          Create Campaign
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="py-12">
          <h2 className="text-xl font-medium text-gray-700 mb-4">No Campaigns Yet</h2>
          <p className="text-gray-500 mb-6">Create your first automated campaign to reach your customers on a schedule</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center mx-auto transition duration-200">
            <MdAdd className="mr-1" size={20} />
            Create First Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomatedCampaignsPage; 