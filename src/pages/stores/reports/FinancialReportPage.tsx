import React, { useState } from 'react';
import { FaFileDownload, FaFilter, FaMoneyBill, FaChartLine, FaChartPie, FaCalendarAlt } from 'react-icons/fa';

const FinancialReportPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [timeFrame, setTimeFrame] = useState('month');
  const [storeFilter, setStoreFilter] = useState('all');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');

  // Mock financial data
  const currentPeriodData = {
    revenue: {
      lavagem: 42500.00,
      passadoria: 15750.00,
      tingimento: 8300.00,
      costura: 7450.00,
      limpezaEspecial: 12000.00,
    },
    expenses: {
      insumos: 18200.00,
      salarios: 24500.00,
      aluguel: 8500.00,
      utilidades: 5200.00,
      marketing: 3500.00,
      manutencao: 2800.00,
      outros: 1200.00,
    },
    metrics: {
      totalOrders: 1580,
      avgOrderValue: 54.43,
      returnRate: 0.025,
      profitMargin: 0.32,
    },
    dailyRevenue: [
      { date: '2023-05-01', value: 2800.00 },
      { date: '2023-05-02', value: 3100.00 },
      { date: '2023-05-03', value: 2950.00 },
      { date: '2023-05-04', value: 3200.00 },
      { date: '2023-05-05', value: 3700.00 },
      { date: '2023-05-06', value: 4200.00 },
      { date: '2023-05-07', value: 2300.00 },
      { date: '2023-05-08', value: 2700.00 },
      { date: '2023-05-09', value: 3100.00 },
      { date: '2023-05-10', value: 3200.00 },
      { date: '2023-05-11', value: 3000.00 },
      { date: '2023-05-12', value: 3500.00 },
      { date: '2023-05-13', value: 3800.00 },
      { date: '2023-05-14', value: 2400.00 },
      { date: '2023-05-15', value: 2800.00 },
    ]
  };

  // Previous period data (for comparison)
  const previousPeriodData = {
    revenue: {
      lavagem: 40200.00,
      passadoria: 14500.00,
      tingimento: 8000.00,
      costura: 6800.00,
      limpezaEspecial: 11000.00,
    },
    expenses: {
      insumos: 17800.00,
      salarios: 24500.00,
      aluguel: 8500.00,
      utilidades: 4900.00,
      marketing: 3000.00,
      manutencao: 2500.00,
      outros: 1100.00,
    },
    metrics: {
      totalOrders: 1480,
      avgOrderValue: 54.52,
      returnRate: 0.027,
      profitMargin: 0.308,
    }
  };

  // Calculate total revenue
  const totalRevenue = Object.values(currentPeriodData.revenue).reduce((acc, val) => acc + val, 0);
  const previousTotalRevenue = Object.values(previousPeriodData.revenue).reduce((acc, val) => acc + val, 0);
  const revenueGrowth = ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100;

  // Calculate total expenses
  const totalExpenses = Object.values(currentPeriodData.expenses).reduce((acc, val) => acc + val, 0);
  const previousTotalExpenses = Object.values(previousPeriodData.expenses).reduce((acc, val) => acc + val, 0);
  const expensesGrowth = ((totalExpenses - previousTotalExpenses) / previousTotalExpenses) * 100;

  // Calculate profit
  const profit = totalRevenue - totalExpenses;
  const previousProfit = previousTotalRevenue - previousTotalExpenses;
  const profitGrowth = ((profit - previousProfit) / previousProfit) * 100;

  // Calculate profit margin
  const profitMargin = (profit / totalRevenue) * 100;
  const previousProfitMargin = (previousProfit / previousTotalRevenue) * 100;
  const profitMarginChange = profitMargin - previousProfitMargin;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Financial Report</h1>
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
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
            >
              <option value="all">All Stores</option>
              <option value="store-1">Loja Centro</option>
              <option value="store-2">Loja Norte</option>
              <option value="store-3">Loja Sul</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compare To</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
            >
              <option value="previous">Previous Period</option>
              <option value="year-ago">Same Period Last Year</option>
              <option value="none">No Comparison</option>
            </select>
          </div>
        </div>
      )}

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">R$ {totalRevenue.toFixed(2)}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className={`mr-1 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenueGrowth).toFixed(1)}%
            </span>
            <span className="text-gray-500">vs. previous period</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-500">R$ {totalExpenses.toFixed(2)}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className={`mr-1 ${expensesGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {expensesGrowth >= 0 ? '↑' : '↓'} {Math.abs(expensesGrowth).toFixed(1)}%
            </span>
            <span className="text-gray-500">vs. previous period</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Net Profit</h3>
          <p className="text-3xl font-bold text-green-600">R$ {profit.toFixed(2)}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className={`mr-1 ${profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitGrowth >= 0 ? '↑' : '↓'} {Math.abs(profitGrowth).toFixed(1)}%
            </span>
            <span className="text-gray-500">vs. previous period</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Profit Margin</h3>
          <p className="text-3xl font-bold text-blue-600">{profitMargin.toFixed(1)}%</p>
          <div className="flex items-center mt-2 text-sm">
            <span className={`mr-1 ${profitMarginChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitMarginChange >= 0 ? '↑' : '↓'} {Math.abs(profitMarginChange).toFixed(1)}%
            </span>
            <span className="text-gray-500">vs. previous period</span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Revenue Breakdown</h2>
          <div className="flex items-center justify-center h-64">
            {/* Placeholder for Revenue Breakdown Chart */}
            <div className="text-center text-gray-500">
              <FaChartPie className="mx-auto text-5xl mb-3 text-blue-200" />
              <p>Revenue distribution chart will be displayed here</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {Object.entries(currentPeriodData.revenue).map(([service, amount], index) => {
              const previousAmount = previousPeriodData.revenue[service as keyof typeof previousPeriodData.revenue];
              const growth = ((amount - previousAmount) / previousAmount) * 100;
              
              return (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{service}</span>
                  <div className="text-right">
                    <span className="font-medium">R$ {amount.toFixed(2)}</span>
                    <span className={`ml-2 text-xs ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Expenses Breakdown</h2>
          <div className="flex items-center justify-center h-64">
            {/* Placeholder for Expenses Breakdown Chart */}
            <div className="text-center text-gray-500">
              <FaChartPie className="mx-auto text-5xl mb-3 text-red-200" />
              <p>Expenses distribution chart will be displayed here</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {Object.entries(currentPeriodData.expenses).map(([category, amount], index) => {
              const previousAmount = previousPeriodData.expenses[category as keyof typeof previousPeriodData.expenses];
              const growth = ((amount - previousAmount) / previousAmount) * 100;
              
              return (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{category}</span>
                  <div className="text-right">
                    <span className="font-medium">R$ {amount.toFixed(2)}</span>
                    <span className={`ml-2 text-xs ${growth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
        <div className="h-80 flex items-center justify-center">
          {/* Placeholder for Revenue Trend Chart */}
          <div className="text-center text-gray-500">
            <FaChartLine className="mx-auto text-5xl mb-3 text-blue-200" />
            <p>Revenue trend chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Key Performance Indicators */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Performance Indicators</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Total Orders</h3>
                <p className="text-sm text-gray-500">Number of orders processed</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">{currentPeriodData.metrics.totalOrders}</p>
                <p className="text-sm text-gray-500">
                  <span className={`${currentPeriodData.metrics.totalOrders >= previousPeriodData.metrics.totalOrders ? 'text-green-600' : 'text-red-600'}`}>
                    {(((currentPeriodData.metrics.totalOrders - previousPeriodData.metrics.totalOrders) / previousPeriodData.metrics.totalOrders) * 100).toFixed(1)}%
                  </span> vs prev
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Average Order Value</h3>
                <p className="text-sm text-gray-500">Average revenue per order</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">R$ {currentPeriodData.metrics.avgOrderValue.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  <span className={`${currentPeriodData.metrics.avgOrderValue >= previousPeriodData.metrics.avgOrderValue ? 'text-green-600' : 'text-red-600'}`}>
                    {(((currentPeriodData.metrics.avgOrderValue - previousPeriodData.metrics.avgOrderValue) / previousPeriodData.metrics.avgOrderValue) * 100).toFixed(1)}%
                  </span> vs prev
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Return Rate</h3>
                <p className="text-sm text-gray-500">Percentage of returned orders</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">{(currentPeriodData.metrics.returnRate * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-500">
                  <span className={`${currentPeriodData.metrics.returnRate <= previousPeriodData.metrics.returnRate ? 'text-green-600' : 'text-red-600'}`}>
                    {(((currentPeriodData.metrics.returnRate - previousPeriodData.metrics.returnRate) / previousPeriodData.metrics.returnRate) * 100).toFixed(1)}%
                  </span> vs prev
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Profit Margin</h3>
                <p className="text-sm text-gray-500">Net profit as % of revenue</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">{(currentPeriodData.metrics.profitMargin * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-500">
                  <span className={`${currentPeriodData.metrics.profitMargin >= previousPeriodData.metrics.profitMargin ? 'text-green-600' : 'text-red-600'}`}>
                    {(((currentPeriodData.metrics.profitMargin - previousPeriodData.metrics.profitMargin) / previousPeriodData.metrics.profitMargin) * 100).toFixed(1)}%
                  </span> vs prev
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Projections */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Cash Flow Projections</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <FaCalendarAlt />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Next Month</h3>
                  <p className="text-sm text-gray-500">Projected</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">R$ {(totalRevenue * 1.05).toFixed(2)}</p>
                <p className="text-sm text-green-600">+5.0% growth</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <FaCalendarAlt />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Next Quarter</h3>
                  <p className="text-sm text-gray-500">Projected</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">R$ {(totalRevenue * 3.2).toFixed(2)}</p>
                <p className="text-sm text-green-600">+7.0% growth</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Projected Expenses</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Fixed Costs</span>
                  <span className="font-medium">R$ {(totalExpenses * 0.6).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Variable Costs</span>
                  <span className="font-medium">R$ {(totalExpenses * 0.4 * 1.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-medium">Total Projected Expenses</span>
                  <span className="font-medium">R$ {(totalExpenses * 1.02).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-1">Projected Profit</h3>
              <div className="flex justify-between">
                <span className="text-green-700">Next Quarter</span>
                <span className="font-bold text-green-700">R$ {(totalRevenue * 3.2 - totalExpenses * 3.06).toFixed(2)}</span>
              </div>
              <div className="mt-2 text-sm text-green-600">
                <span>+8.5% projected profit growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Day */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Daily Revenue</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  vs. Avg
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPeriodData.dailyRevenue.map((day, index) => {
                const avgDailyRevenue = currentPeriodData.dailyRevenue.reduce((acc, d) => acc + d.value, 0) / currentPeriodData.dailyRevenue.length;
                const variance = ((day.value - avgDailyRevenue) / avgDailyRevenue) * 100;
                
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {day.value.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {variance >= 0 ? '+' : ''}{variance.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportPage; 