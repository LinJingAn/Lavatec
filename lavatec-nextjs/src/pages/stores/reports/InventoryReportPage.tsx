import React, { useState } from 'react';
import { FaFileDownload, FaFilter, FaExclamationTriangle, FaArrowDown, FaArrowUp, FaBoxOpen } from 'react-icons/fa';

const InventoryReportPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [timeFrame, setTimeFrame] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock inventory data
  const inventoryItems = [
    { id: 1, name: 'Detergente Neutro', category: 'Produtos de Limpeza', stock: 45, reorderLevel: 20, optimal: 50, turnover: 2.5, daysToStockout: 18, lastRestock: '2023-05-28', unitCost: 12.50 },
    { id: 2, name: 'Amaciante Concentrado', category: 'Produtos de Limpeza', stock: 12, reorderLevel: 15, optimal: 30, turnover: 3.2, daysToStockout: 4, lastRestock: '2023-05-15', unitCost: 18.75 },
    { id: 3, name: 'Alvejante sem Cloro', category: 'Produtos de Limpeza', stock: 22, reorderLevel: 10, optimal: 25, turnover: 1.8, daysToStockout: 12, lastRestock: '2023-05-20', unitCost: 15.30 },
    { id: 4, name: 'Removedor de Manchas', category: 'Produtos de Limpeza', stock: 8, reorderLevel: 12, optimal: 20, turnover: 2.1, daysToStockout: 4, lastRestock: '2023-05-10', unitCost: 22.45 },
    { id: 5, name: 'Cabides (Pacote 100)', category: 'Materiais', stock: 15, reorderLevel: 5, optimal: 15, turnover: 1.2, daysToStockout: 30, lastRestock: '2023-05-25', unitCost: 45.00 },
    { id: 6, name: 'Sacos para Roupas G', category: 'Materiais', stock: 350, reorderLevel: 200, optimal: 500, turnover: 2.0, daysToStockout: 14, lastRestock: '2023-05-22', unitCost: 0.35 },
    { id: 7, name: 'Sacos para Roupas M', category: 'Materiais', stock: 180, reorderLevel: 200, optimal: 400, turnover: 2.8, daysToStockout: 6, lastRestock: '2023-05-12', unitCost: 0.25 },
    { id: 8, name: 'Etiquetas Adesivas', category: 'Materiais', stock: 520, reorderLevel: 300, optimal: 600, turnover: 1.5, daysToStockout: 20, lastRestock: '2023-05-18', unitCost: 0.10 },
    { id: 9, name: 'Tira-manchas Especial', category: 'Produtos Especiais', stock: 5, reorderLevel: 8, optimal: 15, turnover: 1.0, daysToStockout: 10, lastRestock: '2023-05-05', unitCost: 32.90 },
    { id: 10, name: 'Neutralizador de Odores', category: 'Produtos Especiais', stock: 14, reorderLevel: 10, optimal: 20, turnover: 1.4, daysToStockout: 20, lastRestock: '2023-05-15', unitCost: 27.50 },
  ];

  // Calculate metrics
  const lowStockItems = inventoryItems.filter(item => item.stock <= item.reorderLevel);
  const stockoutRisk = inventoryItems.filter(item => item.daysToStockout <= 7);
  const totalInventoryValue = inventoryItems.reduce((total, item) => total + (item.stock * item.unitCost), 0);
  const avgTurnover = inventoryItems.reduce((sum, item) => sum + item.turnover, 0) / inventoryItems.length;
  
  // Filter items by category if needed
  const filteredItems = categoryFilter === 'all' 
    ? inventoryItems 
    : inventoryItems.filter(item => item.category === categoryFilter);

  // Get unique categories for filter
  const categories = ['all', ...new Set(inventoryItems.map(item => item.category))];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Inventory Report</h1>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="text-gray-600" />
            <span>Filters</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            <FaFileDownload className="text-gray-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Frame</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
              <option value="year">Last 12 months</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Stores</option>
              <option value="store-1">Loja Centro</option>
              <option value="store-2">Loja Norte</option>
              <option value="store-3">Loja Sul</option>
            </select>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Total Inventory Value</h3>
          <p className="text-3xl font-bold text-blue-600">R$ {totalInventoryValue.toFixed(2)}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 3.2%</span>
            <span className="text-gray-500">vs. previous period</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Low Stock Items</h3>
          <p className="text-3xl font-bold text-amber-500">{lowStockItems.length}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span className="mr-1">of {inventoryItems.length} total items</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Avg. Turnover Rate</h3>
          <p className="text-3xl font-bold text-blue-600">{avgTurnover.toFixed(1)}x</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span className="mr-1">per month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Stockout Risk</h3>
          <p className="text-3xl font-bold text-red-500">{stockoutRisk.length}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span className="mr-1">items at risk in next 7 days</span>
          </div>
        </div>
      </div>

      {/* Reorder Recommendations */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Reorder Recommendations</h2>
        {lowStockItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reorder Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Optimal Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days to Stockout
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock <= item.reorderLevel / 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.reorderLevel} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.optimal} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.daysToStockout <= 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.daysToStockout} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        Order {item.optimal - item.stock} units
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaBoxOpen className="mx-auto text-5xl mb-3 text-gray-300" />
            <p>All inventory items are at healthy levels!</p>
          </div>
        )}
      </div>

      {/* Inventory Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Inventory Overview</h2>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 inline-block bg-green-500 rounded-full"></span>
              <span>Healthy</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 inline-block bg-yellow-500 rounded-full"></span>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 inline-block bg-red-500 rounded-full"></span>
              <span>Critical</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turnover Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Restock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                // Determine stock status
                let stockStatus = 'Healthy';
                let statusColor = 'bg-green-100 text-green-800';
                
                if (item.stock <= item.reorderLevel / 2) {
                  stockStatus = 'Critical';
                  statusColor = 'bg-red-100 text-red-800';
                } else if (item.stock <= item.reorderLevel) {
                  stockStatus = 'Low';
                  statusColor = 'bg-yellow-100 text-yellow-800';
                }

                // Calculate days since last restock
                const lastRestockDate = new Date(item.lastRestock);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - lastRestockDate.getTime()) as number;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stock} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                        {stockStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {item.turnover}x
                        <span className="ml-2 text-xs text-gray-400">per month</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {diffDays} days ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {(item.stock * item.unitCost).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-center h-60">
            {/* Placeholder for category distribution chart */}
            <div className="text-center text-gray-500">
              <FaBoxOpen className="mx-auto text-5xl mb-3 text-blue-200" />
              <p>Category distribution chart will be displayed here</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Inventory by Category</h3>
            <div className="space-y-4">
              {categories.filter(cat => cat !== 'all').map((category, index) => {
                const categoryItems = inventoryItems.filter(item => item.category === category);
                const categoryValue = categoryItems.reduce((total, item) => total + (item.stock * item.unitCost), 0);
                const categoryCount = categoryItems.length;
                const lowStockCount = categoryItems.filter(item => item.stock <= item.reorderLevel).length;
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{category}</h4>
                      <span className="text-gray-500 text-sm">{categoryCount} items</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">R$ {categoryValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Low Stock:</span>
                      <span className={`font-medium ${lowStockCount > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                        {lowStockCount} items
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReportPage; 