import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdFilterList, 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdVisibility, 
  MdStar, 
  MdStarBorder,
  MdLocalShipping,
  MdAssessment
} from 'react-icons/md';
import { FaSort, FaFilter } from 'react-icons/fa';

interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  status: 'active' | 'inactive';
  rating: number;
  totalSpent: number;
  lastOrderDate: string;
  preferredPaymentTerms: string;
  notes?: string;
  products: string[];
}

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Supplier>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  // Mock supplier data
  const mockSuppliers: Supplier[] = [
    {
      id: '1',
      name: 'CleanChem Supplies',
      category: 'Cleaning Chemicals',
      contactPerson: 'John Smith',
      email: 'john@cleanchemsupplies.com',
      phone: '(555) 123-4567',
      address: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: 'USA',
      status: 'active',
      rating: 4,
      totalSpent: 12500,
      lastOrderDate: '2023-06-15',
      preferredPaymentTerms: 'Net 30',
      notes: 'Reliable supplier for eco-friendly cleaning products',
      products: ['Eco Detergent', 'Stain Remover', 'Fabric Softener']
    },
    {
      id: '2',
      name: 'LaundryTech Equipment',
      category: 'Equipment',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@laundrytechequip.com',
      phone: '(555) 234-5678',
      address: '456 Tech Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      status: 'active',
      rating: 5,
      totalSpent: 75000,
      lastOrderDate: '2023-07-22',
      preferredPaymentTerms: 'Net 45',
      notes: 'Premium equipment supplier with excellent support',
      products: ['Industrial Washers', 'Dryers', 'Pressing Equipment']
    },
    {
      id: '3',
      name: 'PackagePlus',
      category: 'Packaging',
      contactPerson: 'Michael Lee',
      email: 'michael@packageplus.com',
      phone: '(555) 345-6789',
      address: '789 Package Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'USA',
      status: 'inactive',
      rating: 3,
      totalSpent: 8750,
      lastOrderDate: '2023-04-10',
      preferredPaymentTerms: 'Net 15',
      notes: 'Eco-friendly packaging options available',
      products: ['Garment Bags', 'Hangers', 'Boxes']
    },
    {
      id: '4',
      name: 'TextilePro Fabrics',
      category: 'Textiles',
      contactPerson: 'Lisa Wong',
      email: 'lisa@textilepro.com',
      phone: '(555) 456-7890',
      address: '101 Fabric Lane',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      status: 'active',
      rating: 4,
      totalSpent: 22000,
      lastOrderDate: '2023-07-05',
      preferredPaymentTerms: 'Net 30',
      products: ['Towels', 'Bed Linens', 'Uniforms']
    },
    {
      id: '5',
      name: 'GlobalChem Industries',
      category: 'Cleaning Chemicals',
      contactPerson: 'Robert Chen',
      email: 'robert@globalchem.com',
      phone: '(555) 567-8901',
      address: '202 Chemical Road',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      country: 'USA',
      status: 'active',
      rating: 2,
      totalSpent: 6300,
      lastOrderDate: '2023-05-18',
      preferredPaymentTerms: 'Net 30',
      notes: 'Competitive pricing but occasional delivery delays',
      products: ['Industrial Detergents', 'Bleach', 'Specialty Cleaners']
    }
  ];

  // Get unique categories from suppliers
  const getSupplierCategories = (): string[] => {
    const categories = suppliers.map(supplier => supplier.category);
    return ['all', ...Array.from(new Set(categories))];
  };

  // Load suppliers data
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setSuppliers(mockSuppliers);
      setFilteredSuppliers(mockSuppliers);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter suppliers based on search term and filters
  useEffect(() => {
    let results = suppliers;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(supplier => 
        supplier.name.toLowerCase().includes(searchLower) ||
        supplier.contactPerson.toLowerCase().includes(searchLower) ||
        supplier.email.toLowerCase().includes(searchLower) ||
        supplier.products.some(product => product.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(supplier => supplier.category === selectedCategory);
    }
    
    // Apply status filter
    if (selectedStatus !== 'all') {
      results = results.filter(supplier => supplier.status === selectedStatus);
    }
    
    // Sort results
    results = [...results].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' 
          ? fieldA - fieldB 
          : fieldB - fieldA;
      }
      
      return 0;
    });
    
    setFilteredSuppliers(results);
  }, [suppliers, searchTerm, selectedCategory, selectedStatus, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: keyof Supplier) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Rating display component
  const RatingDisplay = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          index < rating 
            ? <MdStar key={index} className="text-yellow-400" /> 
            : <MdStarBorder key={index} className="text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage supplier relationships, track performance, and streamline procurement
        </p>
      </div>

      {/* Action buttons and search bar */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div className="w-full sm:w-2/3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search suppliers by name, contact, or products"
            className="pl-10 pr-3 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaFilter className="mr-2 h-4 w-4" />
            Filters
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <MdAdd className="mr-2 h-5 w-5" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {getSupplierCategories().map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers table */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {isLoading ? (
                <div className="flex justify-center items-center h-64 bg-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Supplier
                          {sortField === 'name' && (
                            <FaSort className="ml-1 h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center">
                          Category
                          {sortField === 'category' && (
                            <FaSort className="ml-1 h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contact Info
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('rating')}
                      >
                        <div className="flex items-center">
                          Rating
                          {sortField === 'rating' && (
                            <FaSort className="ml-1 h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('totalSpent')}
                      >
                        <div className="flex items-center">
                          Total Spent
                          {sortField === 'totalSpent' && (
                            <FaSort className="ml-1 h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('lastOrderDate')}
                      >
                        <div className="flex items-center">
                          Last Order
                          {sortField === 'lastOrderDate' && (
                            <FaSort className="ml-1 h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          {sortField === 'status' && (
                            <FaSort className="ml-1 h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                                <div className="text-sm text-gray-500">ID: {supplier.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{supplier.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{supplier.contactPerson}</div>
                            <div className="text-sm text-gray-500">{supplier.email}</div>
                            <div className="text-sm text-gray-500">{supplier.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <RatingDisplay rating={supplier.rating} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${supplier.totalSpent.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(supplier.lastOrderDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                supplier.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-3 justify-end">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                title="View Details"
                              >
                                <MdVisibility className="h-5 w-5" />
                              </button>
                              <button
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Edit"
                              >
                                <MdEdit className="h-5 w-5" />
                              </button>
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Place Order"
                              >
                                <MdLocalShipping className="h-5 w-5" />
                              </button>
                              <button
                                className="text-purple-600 hover:text-purple-900"
                                title="Performance"
                              >
                                <MdAssessment className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                          No suppliers found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredSuppliers.length}</span> of{' '}
              <span className="font-medium">{filteredSuppliers.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                &larr;
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                &rarr;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage; 