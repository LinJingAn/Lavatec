import React, { useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdFirstPage, MdLastPage, MdFilterList } from 'react-icons/md';

const InvoicesPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('unpaid');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  // Sample data - empty for this demo as the screenshot shows no data
  const invoices = [];
  
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  
  // Status options - these would normally come from an API
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'draft', label: 'Draft' }
  ];
  
  // Customer options - these would normally come from an API
  const customerOptions = [
    { value: '', label: 'All Customers' },
    { value: 'regular', label: 'Regular Customers' },
    { value: 'vip', label: 'VIP Customers' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoice</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage all your customer invoices
          </p>
        </div>
        
        <div className="flex mt-4 sm:mt-0 space-x-3">
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="appearance-none border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              {customerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium">Invoices</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded"
            >
              New Statement
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              New Invoice
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    ID
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <MdFilterList size={16} />
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Reference
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <MdFilterList size={16} />
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Recipient
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <MdFilterList size={16} />
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Date
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <MdFilterList size={16} />
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Due Date
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <MdFilterList size={16} />
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Total
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <MdFilterList size={16} />
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Status
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <MdFilterList size={16} />
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Sent
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <MdFilterList size={16} />
                    </button>
                  </div>
                </th>
              </tr>
              <tr>
                <th colSpan={9} className="px-6 py-2">
                  <input
                    type="text"
                    placeholder="Filter"
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    {/* Invoice data would be rendered here */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <p className="text-gray-500 font-medium">No data available in table</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-gray-300 text-gray-700 py-1 px-2 pr-8 rounded text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700 ml-2">per page</span>
          </div>
          
          <div className="text-gray-500 text-sm">
            No entries available
          </div>
          
          <div className="flex items-center">
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={true}
            >
              <MdFirstPage size={20} />
            </button>
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={true}
            >
              <MdKeyboardArrowLeft size={20} />
            </button>
            <span className="mx-2 text-sm text-gray-700">
              <span className="font-medium"></span>
            </span>
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={true}
            >
              <MdKeyboardArrowRight size={20} />
            </button>
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={true}
            >
              <MdLastPage size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage; 