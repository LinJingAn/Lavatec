import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdAdd, MdRemove, MdRefresh, MdEdit } from 'react-icons/md';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  optimalStock: number;
  unitCost: number;
  lastRestocked: string;
  location: string;
}

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Eco Detergent',
      sku: 'DET-ECO-01',
      category: 'Cleaning Products',
      currentStock: 45,
      minimumStock: 20,
      optimalStock: 60,
      unitCost: 12.99,
      lastRestocked: '2023-09-10',
      location: 'Shelf A1'
    },
    {
      id: '2',
      name: 'Fabric Softener',
      sku: 'SOFT-01',
      category: 'Cleaning Products',
      currentStock: 32,
      minimumStock: 15,
      optimalStock: 50,
      unitCost: 9.99,
      lastRestocked: '2023-09-15',
      location: 'Shelf A2'
    },
    {
      id: '3',
      name: 'Stain Remover',
      sku: 'STAIN-01',
      category: 'Cleaning Products',
      currentStock: 18,
      minimumStock: 20,
      optimalStock: 40,
      unitCost: 14.50,
      lastRestocked: '2023-08-28',
      location: 'Shelf A3'
    },
    {
      id: '4',
      name: 'Hangers (100 pack)',
      sku: 'HANG-100',
      category: 'Supplies',
      currentStock: 15,
      minimumStock: 10,
      optimalStock: 25,
      unitCost: 24.99,
      lastRestocked: '2023-09-05',
      location: 'Storage B1'
    },
    {
      id: '5',
      name: 'Packaging Bags',
      sku: 'PKG-BAG-L',
      category: 'Supplies',
      currentStock: 250,
      minimumStock: 200,
      optimalStock: 500,
      unitCost: 0.25,
      lastRestocked: '2023-09-12',
      location: 'Storage B2'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [adjustingItemId, setAdjustingItemId] = useState<string | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  // Calculate total inventory value
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  
  // Calculate low stock items
  const lowStockItems = items.filter(item => item.currentStock < item.minimumStock);

  // Get categories
  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];

  // Filter items
  let filteredItems = items;
  
  if (searchTerm.trim() !== '') {
    const searchLower = searchTerm.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) || 
      item.sku.toLowerCase().includes(searchLower)
    );
  }
  
  if (selectedCategory !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === selectedCategory);
  }
  
  if (showLowStock) {
    filteredItems = filteredItems.filter(item => item.currentStock < item.minimumStock);
  }

  const handleAdjustInventory = (itemId: string) => {
    if (adjustmentQuantity === 0 || adjustmentReason.trim() === '') {
      alert('Please enter a valid quantity and reason');
      return;
    }

    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, currentStock: Math.max(0, item.currentStock + adjustmentQuantity) }
        : item
    ));

    // Reset adjustment fields
    setAdjustingItemId(null);
    setAdjustmentQuantity(0);
    setAdjustmentReason('');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Inventory Value</h2>
          <div className="flex items-center">
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-500 text-sm font-medium uppercase mb-2">Low Stock Items</h2>
          <div className="flex items-center">
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <div className="text-sm text-gray-500 ml-2">of {items.length} items</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-500 text-sm font-medium uppercase mb-2">Last Inventory Check</h2>
          <div className="flex items-center">
            <div className="text-2xl font-bold">Sept 15, 2023</div>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="w-full md:w-1/3 relative">
            <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or SKU"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowStockFilter"
                checked={showLowStock}
                onChange={() => setShowLowStock(!showLowStock)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="lowStockFilter" className="ml-2 text-sm text-gray-700">
                Low Stock Only
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min/Optimal
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Restocked
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <React.Fragment key={item.id}>
                <tr className={item.currentStock < item.minimumStock ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.currentStock < item.minimumStock
                        ? 'bg-red-100 text-red-800'
                        : item.currentStock < item.optimalStock
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.currentStock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.minimumStock} / {item.optimalStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${(item.currentStock * item.unitCost).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.lastRestocked).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => setAdjustingItemId(item.id === adjustingItemId ? null : item.id)}
                    >
                      Adjust
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MdEdit size={18} />
                    </button>
                  </td>
                </tr>
                {adjustingItemId === item.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <button
                            className="bg-gray-200 p-2 rounded-l"
                            onClick={() => setAdjustmentQuantity(Math.max(-100, adjustmentQuantity - 1))}
                          >
                            <MdRemove />
                          </button>
                          <input
                            type="number"
                            value={adjustmentQuantity}
                            onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                            className="border-t border-b border-gray-300 w-16 py-2 text-center"
                          />
                          <button
                            className="bg-gray-200 p-2 rounded-r"
                            onClick={() => setAdjustmentQuantity(Math.min(100, adjustmentQuantity + 1))}
                          >
                            <MdAdd />
                          </button>
                        </div>
                        <select
                          value={adjustmentReason}
                          onChange={(e) => setAdjustmentReason(e.target.value)}
                          className="border border-gray-300 rounded py-2 px-3"
                        >
                          <option value="">Select reason</option>
                          <option value="Restock">Restock</option>
                          <option value="Count Adjustment">Count Adjustment</option>
                          <option value="Damaged">Damaged</option>
                          <option value="Used">Used in Service</option>
                          <option value="Theft">Theft</option>
                          <option value="Other">Other</option>
                        </select>
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          onClick={() => handleAdjustInventory(item.id)}
                        >
                          Apply
                        </button>
                        <button
                          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                          onClick={() => {
                            setAdjustingItemId(null);
                            setAdjustmentQuantity(0);
                            setAdjustmentReason('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage; 