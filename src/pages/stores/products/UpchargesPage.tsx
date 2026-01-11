import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';

interface Upcharge {
  id: string;
  name: string;
  amount: number;
  type: 'percentage' | 'fixed';
  active: boolean;
  applies_to: 'all' | 'dry_cleaning' | 'laundry' | 'repairs';
}

const UpchargesPage: React.FC = () => {
  const [upcharges, setUpcharges] = useState<Upcharge[]>([
    {
      id: '1',
      name: 'Express Service',
      amount: 50,
      type: 'percentage',
      active: true,
      applies_to: 'all'
    },
    {
      id: '2',
      name: 'Same Day Service',
      amount: 75,
      type: 'percentage',
      active: true,
      applies_to: 'all'
    },
    {
      id: '3',
      name: 'Holiday Surcharge',
      amount: 10,
      type: 'percentage',
      active: false,
      applies_to: 'all'
    },
    {
      id: '4',
      name: 'Delicate Items',
      amount: 5,
      type: 'fixed',
      active: true,
      applies_to: 'dry_cleaning'
    },
    {
      id: '5',
      name: 'Large Size',
      amount: 3,
      type: 'fixed',
      active: true,
      applies_to: 'laundry'
    }
  ]);

  const deleteUpcharge = (id: string) => {
    setUpcharges(upcharges.filter(upcharge => upcharge.id !== id));
  };

  const toggleActive = (id: string) => {
    setUpcharges(upcharges.map(upcharge => 
      upcharge.id === id ? { ...upcharge, active: !upcharge.active } : upcharge
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upcharges</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
          <MdAdd className="mr-1" />
          Add Upcharge
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applies To
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {upcharges.map((upcharge) => (
              <tr key={upcharge.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {upcharge.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {upcharge.type === 'percentage' ? `${upcharge.amount}%` : `$${upcharge.amount.toFixed(2)}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {upcharge.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {upcharge.applies_to === 'all' ? 'All Services' : 
                    upcharge.applies_to === 'dry_cleaning' ? 'Dry Cleaning' :
                    upcharge.applies_to === 'laundry' ? 'Laundry' : 'Repairs'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={upcharge.active}
                      onChange={() => toggleActive(upcharge.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <MdEdit size={20} />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteUpcharge(upcharge.id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">About Upcharges</h2>
        <p className="text-gray-600 mb-3">
          Upcharges are additional fees applied to services based on specific conditions.
          These can be either percentage-based or fixed amounts.
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Percentage upcharges add a percentage of the base price.</li>
          <li>Fixed upcharges add a specific dollar amount to the service.</li>
          <li>You can limit upcharges to specific service types.</li>
          <li>Active upcharges are automatically applied at checkout.</li>
        </ul>
      </div>
    </div>
  );
};

export default UpchargesPage; 