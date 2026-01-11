import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';

interface PricingItem {
  id: string;
  name: string;
  price: number;
  priceExpress: number;
  pieces: number;
  active: boolean;
  online: boolean;
}

const ProductPricingPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('dry-cleaning');
  const [selectedPriceList, setSelectedPriceList] = useState('default');
  const [items, setItems] = useState<PricingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Categories for the tabs
  const categories = [
    { id: 'dry-cleaning', name: 'Dry Cleaning' },
    { id: 'laundry', name: 'Laundry' },
    { id: 'pressed', name: 'Pressed / Ironed' },
    { id: 'repairs', name: 'Repairs' },
    { id: 'alterations', name: 'Alterations' }
  ];

  // Mock pricing data
  const mockItems: Record<string, PricingItem[]> = {
    'dry-cleaning': [
      { id: '1', name: 'Blouse', price: 5.00, priceExpress: 6.00, pieces: 1, active: true, online: true },
      { id: '2', name: 'Dress', price: 10.00, priceExpress: 15.00, pieces: 1, active: true, online: true },
      { id: '3', name: 'Dress, Evening', price: 15.50, priceExpress: 23.25, pieces: 1, active: true, online: true },
      { id: '4', name: 'Hat', price: 5.00, priceExpress: 6.00, pieces: 3, active: true, online: true },
      { id: '5', name: 'Jacket', price: 6.00, priceExpress: 9.00, pieces: 1, active: true, online: true },
      { id: '6', name: 'Jeans', price: 3.00, priceExpress: 4.50, pieces: 1, active: true, online: true },
    ],
    'laundry': [
      { id: '7', name: 'Shirt', price: 3.50, priceExpress: 5.25, pieces: 1, active: true, online: true },
      { id: '8', name: 'Pants', price: 4.00, priceExpress: 6.00, pieces: 1, active: true, online: true },
      { id: '9', name: 'Sheets', price: 7.00, priceExpress: 10.50, pieces: 1, active: true, online: true },
    ],
    'pressed': [
      { id: '10', name: 'Shirt', price: 2.50, priceExpress: 3.75, pieces: 1, active: true, online: true },
      { id: '11', name: 'Pants', price: 3.00, priceExpress: 4.50, pieces: 1, active: true, online: true },
    ],
    'repairs': [
      { id: '12', name: 'Button Replacement', price: 2.00, priceExpress: 3.00, pieces: 1, active: true, online: true },
      { id: '13', name: 'Zipper Repair', price: 8.00, priceExpress: 12.00, pieces: 1, active: true, online: true },
    ],
    'alterations': [
      { id: '14', name: 'Hem Pants', price: 10.00, priceExpress: 15.00, pieces: 1, active: true, online: true },
      { id: '15', name: 'Waist Adjustment', price: 12.00, priceExpress: 18.00, pieces: 1, active: true, online: true },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setItems(mockItems[activeCategory] || []);
      setIsLoading(false);
    }, 500);
  }, [activeCategory]);

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleActive = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
  };

  const toggleOnline = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, online: !item.online } : item
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPriceList}
            onChange={(e) => setSelectedPriceList(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-sm leading-5 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="default">Default Price List</option>
            <option value="premium">Premium Price List</option>
            <option value="eco">Eco Price List</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <MdAdd className="mr-1" />
            Add Product
          </button>
        </div>
      </div>

      {/* Tabs for categories */}
      <div className="flex border-b mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            className={`py-2 px-4 font-medium ${
              activeCategory === category.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Table of pricing items */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Express
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pieces
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Online
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Edit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.priceExpress.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.pieces}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input 
                      type="checkbox" 
                      checked={item.active} 
                      onChange={() => toggleActive(item.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input 
                      type="checkbox" 
                      checked={item.online} 
                      onChange={() => toggleOnline(item.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <MdEdit size={20} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No products found for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductPricingPage; 