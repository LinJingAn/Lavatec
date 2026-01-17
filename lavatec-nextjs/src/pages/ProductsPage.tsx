import React, { useState } from 'react';
import { MdAdd, MdSearch, MdFilterList, MdClose, MdLocalShipping } from 'react-icons/md';
import { Link } from 'react-router-dom';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  priceRange: string;
  currentStock: number;
}

interface InventoryChange {
  date: string;
  change: number;
  reason: string;
  onHand: number;
}

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'suppliers'>('products');

  const products: Product[] = [
    {
      id: '1',
      name: 'Clorox Bleach',
      category: 'Detergent',
      image: '/images/clorox.png',
      priceRange: '$0.00 - $6.00 /unit',
      currentStock: 59
    },
    {
      id: '2',
      name: 'Gain Detergent',
      category: 'Detergent',
      image: '/images/gain.png',
      priceRange: '$0.00 - $6.00 /unit',
      currentStock: 45
    },
    {
      id: '3',
      name: 'Tide with Bleach',
      category: 'Detergent',
      image: '/images/tide.png',
      priceRange: '$0.00 - $10.00 /unit',
      currentStock: 72
    }
  ];

  const inventoryChanges: InventoryChange[] = [
    { date: '04/19/2024', change: -1, reason: 'Sale', onHand: 59 },
    { date: '01/24/2024', change: -8, reason: 'Theft', onHand: 60 },
    { date: '01/24/2024', change: -9, reason: 'Damage', onHand: 68 },
    { date: '01/24/2024', change: -6, reason: 'Loss', onHand: 77 },
    { date: '01/24/2024', change: +3, reason: 'Stock Received', onHand: 83 },
    { date: '01/24/2024', change: +58, reason: 'Inventory re-', onHand: 80 }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tabs for Products and Suppliers */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'products' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <Link 
              to="/stores/suppliers"
              className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center"
            >
              <MdLocalShipping className="mr-1" size={18} />
              Suppliers
            </Link>
          </div>
        </div>
      </div>

      <div className="h-full flex">
        {/* Products List */}
        <div className="w-2/3 bg-white p-6 border-r border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">Products</h1>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-full">
                <MdFilterList className="w-5 h-5" />
                <span className="text-sm">Filter</span>
              </button>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700">
                <MdAdd className="w-5 h-5" />
                <span className="text-sm">Add</span>
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="All (6) Sub-Categories"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm"
            />
            <MdSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          <div className="space-y-6">
            {['Detergent', 'Fabric Softener'].map((category) => (
              <div key={category}>
                <h2 className="text-lg font-medium mb-4">{category}</h2>
                <div className="space-y-4">
                  {products
                    .filter((product) => product.category === category)
                    .map((product) => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input type="radio" name="product" className="w-4 h-4 text-blue-600" />
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.priceRange}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Management */}
        {selectedProduct && (
          <div className="w-1/3 bg-white p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-sm text-gray-500 uppercase">THE CROWN</h2>
                <h3 className="text-lg font-medium">3 gallon</h3>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">Current QTY on hand:</p>
                <p className="text-2xl font-semibold">{selectedProduct.currentStock}</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Adjust inventory
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-2">DATE</th>
                  <th className="pb-2">CHANGE</th>
                  <th className="pb-2">REASON</th>
                  <th className="pb-2 text-right">ON HAND</th>
                </tr>
              </thead>
              <tbody>
                {inventoryChanges.map((change, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="py-3 text-sm">{change.date}</td>
                    <td className={`py-3 text-sm ${change.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change.change > 0 ? `+${change.change}` : change.change}
                    </td>
                    <td className="py-3 text-sm">{change.reason}</td>
                    <td className="py-3 text-sm text-right">{change.onHand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 