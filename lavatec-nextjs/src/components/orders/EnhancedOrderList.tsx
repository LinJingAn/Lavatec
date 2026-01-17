import React, { useState, useMemo } from 'react';
import { MdSearch, MdFilterList, MdSort, MdMoreVert, MdPrint, MdEmail } from 'react-icons/md';
import type { LaundryOrder, OrderStatus } from '../../models/LaundryOrder';

interface EnhancedOrderListProps {
  orders: LaundryOrder[];
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  onBatchAction: (action: string, orderIds: string[]) => void;
}

const EnhancedOrderList: React.FC<EnhancedOrderListProps> = ({
  orders,
  onStatusUpdate,
  onBatchAction
}) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // Sorting
  const [sortField, setSortField] = useState<'date' | 'status' | 'priority'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        // Status filter
        if (statusFilter !== 'all' && order.status !== statusFilter) {
          return false;
        }
        
        // Date range filter
        if (dateRange.start && new Date(order.createdAt) < new Date(dateRange.start)) {
          return false;
        }
        if (dateRange.end && new Date(order.createdAt) > new Date(dateRange.end)) {
          return false;
        }
        
        // Search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.customerName.toLowerCase().includes(searchLower) ||
            order.items.some(item => 
              item.serviceName.toLowerCase().includes(searchLower) ||
              (item.garmentType && item.garmentType.toLowerCase().includes(searchLower))
            )
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          return sortDirection === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortField === 'status') {
          return sortDirection === 'asc'
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        }
        if (sortField === 'priority') {
          const priorityWeightA = a.isPriority ? 1 : 0;
          const priorityWeightB = b.isPriority ? 1 : 0;
          return sortDirection === 'asc'
            ? priorityWeightA - priorityWeightB
            : priorityWeightB - priorityWeightA;
        }
        return 0;
      });
  }, [orders, statusFilter, dateRange, searchTerm, sortField, sortDirection]);

  // Handle batch actions
  const handleBatchAction = (action: string) => {
    if (selectedOrders.length === 0) return;
    onBatchAction(action, selectedOrders);
    setSelectedOrders([]);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="received">Received</option>
              <option value="processing">Processing</option>
              <option value="quality_check">Quality Check</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
          <span className="text-blue-700">
            {selectedOrders.length} orders selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBatchAction('print')}
              className="flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <MdPrint className="w-5 h-5 mr-1" />
              Print
            </button>
            <button
              onClick={() => handleBatchAction('email')}
              className="flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <MdEmail className="w-5 h-5 mr-1" />
              Email
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="px-3 py-1 text-blue-700 hover:text-blue-800"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length}
                  onChange={(e) => {
                    setSelectedOrders(
                      e.target.checked ? filteredOrders.map(o => o.id) : []
                    );
                  }}
                  className="rounded border-gray-300 text-blue-600"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => {
                      setSelectedOrders(
                        e.target.checked
                          ? [...selectedOrders, order.id]
                          : selectedOrders.filter(id => id !== order.id)
                      );
                    }}
                    className="rounded border-gray-300 text-blue-600"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.customerPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.itemCount} items</div>
                  <div className="text-sm text-gray-500">${order.total.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusUpdate(order.id, e.target.value as OrderStatus)}
                    className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="received">Received</option>
                    <option value="processing">Processing</option>
                    <option value="quality_check">Quality Check</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <MdMoreVert className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnhancedOrderList; 