import React from 'react';
import { Link } from 'react-router-dom';

const TestPage: React.FC = () => {
  console.log('TestPage rendering');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a simple test page to verify routing</p>
      
      <div className="space-y-2">
        <div>
          <Link to="/services/pricing" className="text-blue-600 hover:underline">
            Go to Pricing Matrix
          </Link>
        </div>
        <div>
          <Link to="/services/pricing/history" className="text-blue-600 hover:underline">
            Go to Price History
          </Link>
        </div>
        <div>
          <Link to="/services/pricing/bulk-update" className="text-blue-600 hover:underline">
            Go to Bulk Price Update
          </Link>
        </div>
        <div>
          <Link to="/services/pricing/calculator" className="text-blue-600 hover:underline">
            Go to Price Calculator
          </Link>
        </div>
        <div>
          <Link to="/services" className="text-blue-600 hover:underline">
            Go back to Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 