import React, { useState } from 'react';
import { FaSave, FaFilter } from 'react-icons/fa';

interface PreferenceSetting {
  id: string;
  name: string;
  description: string;
  type: 'toggle' | 'select' | 'input' | 'number';
  value: any;
  options?: { value: string; label: string }[];
  category: string;
}

const PreferencesPage: React.FC = () => {
  // Define categories
  const categories = [
    { id: 'all', name: 'All Settings' },
    { id: 'display', name: 'Display Settings' },
    { id: 'pricing', name: 'Pricing & Taxes' },
    { id: 'inventory', name: 'Inventory Management' },
    { id: 'barcode', name: 'Barcode & SKUs' }
  ];

  // Define settings with their categories
  const [settings, setSettings] = useState<PreferenceSetting[]>([
    {
      id: 'lowStockWarning',
      name: 'Show Low Stock Warnings',
      description: 'Display warnings when products are below threshold',
      type: 'toggle',
      value: true,
      category: 'display'
    },
    {
      id: 'outOfStockDisplay',
      name: 'Out of Stock Display',
      description: 'How to display out of stock items',
      type: 'select',
      value: 'hide',
      options: [
        { value: 'show', label: 'Show with badge' },
        { value: 'hide', label: 'Hide from listings' },
        { value: 'gray', label: 'Show grayed out' }
      ],
      category: 'display'
    },
    {
      id: 'defaultTaxRate',
      name: 'Default Tax Rate',
      description: 'Default tax percentage for new products',
      type: 'number',
      value: 8.5,
      category: 'pricing'
    },
    {
      id: 'priceRounding',
      name: 'Price Rounding Method',
      description: 'How to round prices after calculations',
      type: 'select',
      value: 'nearest99',
      options: [
        { value: 'exact', label: 'Exact value' },
        { value: 'nearest99', label: 'Nearest .99' },
        { value: 'nearest95', label: 'Nearest .95' },
        { value: 'up', label: 'Round up' }
      ],
      category: 'pricing'
    },
    {
      id: 'autoReorder',
      name: 'Auto-Generate Reorder Alerts',
      description: 'Create alerts when stock falls below reorder level',
      type: 'toggle',
      value: true,
      category: 'inventory'
    },
    {
      id: 'reorderThreshold',
      name: 'Reorder Threshold Percentage',
      description: 'Percentage of min stock that triggers reorder alerts',
      type: 'number',
      value: 25,
      category: 'inventory'
    },
    {
      id: 'barcodeFormat',
      name: 'Barcode Format',
      description: 'Default format for new product barcodes',
      type: 'select',
      value: 'ean13',
      options: [
        { value: 'ean13', label: 'EAN-13' },
        { value: 'upc', label: 'UPC-A' },
        { value: 'code128', label: 'Code 128' },
        { value: 'custom', label: 'Custom Format' }
      ],
      category: 'barcode'
    },
    {
      id: 'skuPattern',
      name: 'SKU Pattern',
      description: 'Pattern for auto-generated SKUs',
      type: 'input',
      value: 'LAV-{CATEGORY}-{ID}',
      category: 'barcode'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('all');

  // Filter settings by category
  const filteredSettings = activeCategory === 'all'
    ? settings
    : settings.filter(setting => setting.category === activeCategory);

  // Handle setting changes
  const handleSettingChange = (id: string, newValue: any) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, value: newValue } : setting
    ));
  };

  // Handle save
  const handleSave = () => {
    console.log('Saving preferences:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Preferences</h1>
          <p className="text-gray-600">Configure product-related settings for your store</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <FaSave /> Save Changes
        </button>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-600" />
          <h2 className="text-lg font-medium">Filter Settings</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm ${
                activeCategory === category.id
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow-md">
        {filteredSettings.map((setting, index) => (
          <div 
            key={setting.id}
            className={`p-4 ${
              index !== filteredSettings.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{setting.name}</h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <div className="min-w-[200px]">
                {setting.type === 'toggle' && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.value}
                      onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                )}
                {setting.type === 'select' && (
                  <select
                    value={setting.value}
                    onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                    className="border border-gray-300 text-gray-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {setting.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {setting.type === 'input' && (
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                    className="border border-gray-300 text-gray-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                {setting.type === 'number' && (
                  <input
                    type="number"
                    value={setting.value}
                    onChange={(e) => handleSettingChange(setting.id, parseFloat(e.target.value))}
                    className="border border-gray-300 text-gray-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreferencesPage; 