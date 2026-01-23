import pool from '../config/database.js';

// KPI and Dashboard Service
class DashboardService {
  /**
   * Get overview dashboard data
   */
  async getOverviewDashboard(branchId?: string, startDate?: Date, endDate?: Date): Promise<{
    todayStats: any;
    periodStats: any;
    recentOrders: any[];
    topCustomers: any[];
    revenueChart: any[];
    orderStatusBreakdown: any[];
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const periodStart = startDate || new Date(today.getFullYear(), today.getMonth(), 1);
    const periodEnd = endDate || tomorrow;

    const branchFilter = branchId ? 'AND o.branch_id = $3' : '';
    const branchParam = branchId ? [today, tomorrow, branchId] : [today, tomorrow];

    // Today's stats
    const todayStatsResult = await pool.query(
      `SELECT 
         COUNT(*) as total_orders,
         COALESCE(SUM(total), 0) as total_revenue,
         COALESCE(AVG(total), 0) as avg_order_value,
         COUNT(DISTINCT customer_id) as unique_customers
       FROM orders o
       WHERE created_at >= $1 AND created_at < $2 ${branchFilter}`,
      branchParam
    );

    // New customers today
    const newCustomersResult = await pool.query(
      `SELECT COUNT(*) as new_customers
       FROM customers
       WHERE created_at >= $1 AND created_at < $2`,
      [today, tomorrow]
    );

    // Period stats (month to date or custom range)
    const periodParams = branchId ? [periodStart, periodEnd, branchId] : [periodStart, periodEnd];
    const periodStatsResult = await pool.query(
      `SELECT 
         COUNT(*) as total_orders,
         COALESCE(SUM(total), 0) as total_revenue,
         COALESCE(AVG(total), 0) as avg_order_value,
         COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
         COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders,
         COUNT(DISTINCT customer_id) as unique_customers
       FROM orders o
       WHERE created_at >= $1 AND created_at < $2 ${branchFilter}`,
      periodParams
    );

    // Recent orders
    const recentOrdersResult = await pool.query(
      `SELECT o.*, c.name as customer_name
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       ${branchId ? 'WHERE o.branch_id = $1' : ''}
       ORDER BY o.created_at DESC
       LIMIT 10`,
      branchId ? [branchId] : []
    );

    // Top customers by revenue
    const topCustomersResult = await pool.query(
      `SELECT c.id, c.name, c.email, c.total_orders, c.total_spent,
              COUNT(o.id) as orders_count, COALESCE(SUM(o.total), 0) as period_revenue
       FROM customers c
       LEFT JOIN orders o ON o.customer_id = c.id AND o.created_at >= $1
       GROUP BY c.id
       ORDER BY period_revenue DESC
       LIMIT 5`,
      [periodStart]
    );

    // Revenue chart (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const revenueChartResult = await pool.query(
      `SELECT DATE(created_at) as date, 
              COUNT(*) as orders, 
              COALESCE(SUM(total), 0) as revenue
       FROM orders o
       WHERE created_at >= $1 ${branchFilter.replace('$3', '$2')}
       GROUP BY DATE(created_at)
       ORDER BY date`,
      branchId ? [thirtyDaysAgo, branchId] : [thirtyDaysAgo]
    );

    // Order status breakdown
    const statusBreakdownResult = await pool.query(
      `SELECT status, COUNT(*) as count
       FROM orders o
       WHERE created_at >= $1 ${branchFilter.replace('$3', '$2')}
       GROUP BY status`,
      branchId ? [periodStart, branchId] : [periodStart]
    );

    return {
      todayStats: {
        ...todayStatsResult.rows[0],
        new_customers: newCustomersResult.rows[0].new_customers,
      },
      periodStats: periodStatsResult.rows[0],
      recentOrders: recentOrdersResult.rows,
      topCustomers: topCustomersResult.rows,
      revenueChart: revenueChartResult.rows,
      orderStatusBreakdown: statusBreakdownResult.rows,
    };
  }

  /**
   * Get financial dashboard data
   */
  async getFinancialDashboard(branchId?: string, startDate?: Date, endDate?: Date): Promise<{
    summary: any;
    cashFlow: any[];
    accountsReceivable: any;
    accountsPayable: any;
    revenueByCategory: any[];
    expensesByCategory: any[];
  }> {
    const periodStart = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const periodEnd = endDate || new Date();

    const branchFilter = branchId ? 'AND branch_id = $3' : '';
    const params = branchId ? [periodStart, periodEnd, branchId] : [periodStart, periodEnd];

    // Revenue summary
    const revenueSummary = await pool.query(
      `SELECT 
         COALESCE(SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END), 0) as total_paid,
         COALESCE(SUM(CASE WHEN status IN ('pending', 'partial') THEN total - COALESCE(paid_amount, 0) ELSE 0 END), 0) as total_pending,
         COALESCE(SUM(total), 0) as total_invoiced
       FROM invoices
       WHERE created_at >= $1 AND created_at < $2 ${branchFilter.replace('branch_id', 'id')}`,
      params
    );

    // Cash flow by day
    const cashFlowResult = await pool.query(
      `SELECT 
         DATE(transaction_date) as date,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
       FROM cash_flow_transactions
       WHERE transaction_date >= $1 AND transaction_date < $2 ${branchFilter}
       GROUP BY DATE(transaction_date)
       ORDER BY date`,
      params
    );

    // Accounts receivable summary
    const arSummary = await pool.query(
      `SELECT 
         COALESCE(SUM(amount), 0) as total,
         COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending,
         COALESCE(SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END), 0) as overdue,
         COALESCE(SUM(CASE WHEN status = 'received' THEN amount ELSE 0 END), 0) as received
       FROM accounts_receivable
       WHERE due_date >= $1 AND due_date < $2 ${branchFilter}`,
      params
    );

    // Accounts payable summary
    const apSummary = await pool.query(
      `SELECT 
         COALESCE(SUM(amount), 0) as total,
         COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending,
         COALESCE(SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END), 0) as overdue,
         COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid
       FROM accounts_payable
       WHERE due_date >= $1 AND due_date < $2 ${branchFilter}`,
      params
    );

    // Revenue by category
    const revenueByCategory = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) as total
       FROM cash_flow_transactions
       WHERE type = 'income' AND transaction_date >= $1 AND transaction_date < $2 ${branchFilter}
       GROUP BY category
       ORDER BY total DESC`,
      params
    );

    // Expenses by category
    const expensesByCategory = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) as total
       FROM cash_flow_transactions
       WHERE type = 'expense' AND transaction_date >= $1 AND transaction_date < $2 ${branchFilter}
       GROUP BY category
       ORDER BY total DESC`,
      params
    );

    const income = cashFlowResult.rows.reduce((sum, r) => sum + parseFloat(r.income || 0), 0);
    const expense = cashFlowResult.rows.reduce((sum, r) => sum + parseFloat(r.expense || 0), 0);

    return {
      summary: {
        ...revenueSummary.rows[0],
        totalIncome: income,
        totalExpense: expense,
        netCashFlow: income - expense,
        profitMargin: income > 0 ? ((income - expense) / income * 100).toFixed(2) : 0,
      },
      cashFlow: cashFlowResult.rows,
      accountsReceivable: arSummary.rows[0],
      accountsPayable: apSummary.rows[0],
      revenueByCategory: revenueByCategory.rows,
      expensesByCategory: expensesByCategory.rows,
    };
  }

  /**
   * Get operational dashboard data
   */
  async getOperationalDashboard(branchId?: string): Promise<{
    ordersByStatus: any[];
    ordersTimeline: any[];
    machineUtilization: any[];
    staffPerformance: any[];
    deliveryStats: any;
    inventoryAlerts: any[];
  }> {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const branchFilter = branchId ? 'WHERE o.branch_id = $1' : '';
    const branchParam = branchId ? [branchId] : [];

    // Orders by status
    const ordersByStatus = await pool.query(
      `SELECT status, COUNT(*) as count
       FROM orders o
       ${branchFilter}
       GROUP BY status`,
      branchParam
    );

    // Orders timeline (hourly distribution)
    const ordersTimeline = await pool.query(
      `SELECT EXTRACT(HOUR FROM created_at) as hour, COUNT(*) as count
       FROM orders o
       WHERE created_at >= $1 ${branchId ? 'AND o.branch_id = $2' : ''}
       GROUP BY hour
       ORDER BY hour`,
      branchId ? [thirtyDaysAgo, branchId] : [thirtyDaysAgo]
    );

    // Staff performance (top performers)
    const staffPerformance = await pool.query(
      `SELECT u.id, u.name, 
              COUNT(o.id) as orders_handled,
              COALESCE(AVG(o.total), 0) as avg_order_value
       FROM users u
       LEFT JOIN orders o ON o.created_by = u.id AND o.created_at >= $1
       WHERE u.role IN ('staff', 'cashier', 'attendant')
       GROUP BY u.id, u.name
       ORDER BY orders_handled DESC
       LIMIT 10`,
      [thirtyDaysAgo]
    );

    // Delivery stats
    const deliveryStats = await pool.query(
      `SELECT 
         COUNT(*) as total_deliveries,
         COUNT(*) FILTER (WHERE status = 'delivered') as completed,
         COUNT(*) FILTER (WHERE status = 'pending') as pending,
         COUNT(*) FILTER (WHERE status = 'in_transit') as in_transit,
         AVG(EXTRACT(EPOCH FROM (actual_delivery_time - created_at))/3600) as avg_delivery_hours
       FROM deliveries
       WHERE created_at >= $1`,
      [thirtyDaysAgo]
    );

    // Inventory alerts (low stock)
    const inventoryAlerts = await pool.query(
      `SELECT id, name, category, current_stock, min_stock_level, status
       FROM supplies
       WHERE current_stock <= min_stock_level AND status != 'discontinued'
       ORDER BY (min_stock_level - current_stock) DESC
       LIMIT 10`
    );

    return {
      ordersByStatus: ordersByStatus.rows,
      ordersTimeline: ordersTimeline.rows,
      machineUtilization: [], // Placeholder for machine data
      staffPerformance: staffPerformance.rows,
      deliveryStats: deliveryStats.rows[0] || {},
      inventoryAlerts: inventoryAlerts.rows,
    };
  }

  /**
   * Get customer analytics dashboard
   */
  async getCustomerAnalytics(branchId?: string): Promise<{
    customerSegments: any[];
    acquisitionTrend: any[];
    retentionRate: number;
    customerLifetimeValue: number;
    topCustomers: any[];
    customersByCategory: any[];
  }> {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Customer segments by order frequency
    const segments = await pool.query(
      `SELECT 
         CASE 
           WHEN total_orders >= 10 THEN 'VIP'
           WHEN total_orders >= 5 THEN 'Regular'
           WHEN total_orders >= 2 THEN 'Occasional'
           ELSE 'New'
         END as segment,
         COUNT(*) as count,
         COALESCE(AVG(total_spent), 0) as avg_spent
       FROM customers
       WHERE is_active = true
       GROUP BY segment`
    );

    // Customer acquisition trend (last 12 months)
    const acquisitionTrend = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'YYYY-MM') as month,
         COUNT(*) as new_customers
       FROM customers
       WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months'
       GROUP BY month
       ORDER BY month`
    );

    // Retention rate (customers who ordered last month and this month)
    const retentionResult = await pool.query(
      `WITH last_month_customers AS (
         SELECT DISTINCT customer_id
         FROM orders
         WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
           AND created_at < DATE_TRUNC('month', CURRENT_DATE)
       ),
       this_month_customers AS (
         SELECT DISTINCT customer_id
         FROM orders
         WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
       )
       SELECT 
         (SELECT COUNT(*) FROM last_month_customers) as last_month_total,
         (SELECT COUNT(*) FROM last_month_customers lm 
          WHERE EXISTS (SELECT 1 FROM this_month_customers tm WHERE tm.customer_id = lm.customer_id)) as retained`
    );

    const lastMonthTotal = parseInt(retentionResult.rows[0]?.last_month_total || 0);
    const retained = parseInt(retentionResult.rows[0]?.retained || 0);
    const retentionRate = lastMonthTotal > 0 ? (retained / lastMonthTotal * 100) : 0;

    // Customer lifetime value (average)
    const clvResult = await pool.query(
      `SELECT COALESCE(AVG(total_spent), 0) as avg_clv
       FROM customers
       WHERE total_orders > 0`
    );

    // Top customers
    const topCustomers = await pool.query(
      `SELECT id, name, email, phone, total_orders, total_spent, last_visit, category
       FROM customers
       WHERE is_active = true
       ORDER BY total_spent DESC
       LIMIT 10`
    );

    // Customers by category
    const customersByCategory = await pool.query(
      `SELECT category, COUNT(*) as count, COALESCE(SUM(total_spent), 0) as total_revenue
       FROM customers
       WHERE is_active = true
       GROUP BY category
       ORDER BY count DESC`
    );

    return {
      customerSegments: segments.rows,
      acquisitionTrend: acquisitionTrend.rows,
      retentionRate: parseFloat(retentionRate.toFixed(2)),
      customerLifetimeValue: parseFloat(clvResult.rows[0]?.avg_clv || 0),
      topCustomers: topCustomers.rows,
      customersByCategory: customersByCategory.rows,
    };
  }

  /**
   * Get KPI summary
   */
  async getKPIs(branchId?: string, period: 'today' | 'week' | 'month' | 'year' = 'month'): Promise<{
    revenue: { current: number; previous: number; change: number };
    orders: { current: number; previous: number; change: number };
    customers: { current: number; previous: number; change: number };
    avgOrderValue: { current: number; previous: number; change: number };
    conversionRate: number;
    orderCompletionRate: number;
    customerSatisfaction: number;
  }> {
    const now = new Date();
    let currentStart: Date, previousStart: Date, previousEnd: Date;

    switch (period) {
      case 'today':
        currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        previousEnd = new Date(currentStart);
        previousStart = new Date(previousEnd);
        previousStart.setDate(previousStart.getDate() - 1);
        break;
      case 'week':
        currentStart = new Date(now);
        currentStart.setDate(currentStart.getDate() - 7);
        previousEnd = new Date(currentStart);
        previousStart = new Date(previousEnd);
        previousStart.setDate(previousStart.getDate() - 7);
        break;
      case 'year':
        currentStart = new Date(now.getFullYear(), 0, 1);
        previousStart = new Date(now.getFullYear() - 1, 0, 1);
        previousEnd = new Date(now.getFullYear() - 1, 11, 31);
        break;
      case 'month':
      default:
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
    }

    const branchFilter = branchId ? 'AND branch_id = $4' : '';
    const params = branchId 
      ? [currentStart, now, previousStart, previousEnd, branchId]
      : [currentStart, now, previousStart, previousEnd];

    // Current period stats
    const currentStats = await pool.query(
      `SELECT 
         COUNT(*) as orders,
         COALESCE(SUM(total), 0) as revenue,
         COALESCE(AVG(total), 0) as avg_order,
         COUNT(DISTINCT customer_id) as customers,
         COUNT(*) FILTER (WHERE status = 'completed') as completed
       FROM orders
       WHERE created_at >= $1 AND created_at <= $2 ${branchFilter}`,
      branchId ? [currentStart, now, branchId] : [currentStart, now]
    );

    // Previous period stats
    const previousStats = await pool.query(
      `SELECT 
         COUNT(*) as orders,
         COALESCE(SUM(total), 0) as revenue,
         COALESCE(AVG(total), 0) as avg_order,
         COUNT(DISTINCT customer_id) as customers
       FROM orders
       WHERE created_at >= $1 AND created_at <= $2 ${branchFilter}`,
      branchId ? [previousStart, previousEnd, branchId] : [previousStart, previousEnd]
    );

    const current = currentStats.rows[0];
    const previous = previousStats.rows[0];

    const calcChange = (curr: number, prev: number) => 
      prev > 0 ? ((curr - prev) / prev * 100) : (curr > 0 ? 100 : 0);

    const currentOrders = parseInt(current.orders);
    const completedOrders = parseInt(current.completed);

    return {
      revenue: {
        current: parseFloat(current.revenue),
        previous: parseFloat(previous.revenue),
        change: calcChange(parseFloat(current.revenue), parseFloat(previous.revenue)),
      },
      orders: {
        current: currentOrders,
        previous: parseInt(previous.orders),
        change: calcChange(currentOrders, parseInt(previous.orders)),
      },
      customers: {
        current: parseInt(current.customers),
        previous: parseInt(previous.customers),
        change: calcChange(parseInt(current.customers), parseInt(previous.customers)),
      },
      avgOrderValue: {
        current: parseFloat(current.avg_order),
        previous: parseFloat(previous.avg_order),
        change: calcChange(parseFloat(current.avg_order), parseFloat(previous.avg_order)),
      },
      conversionRate: 0, // Would need visitor tracking
      orderCompletionRate: currentOrders > 0 ? (completedOrders / currentOrders * 100) : 0,
      customerSatisfaction: 4.5, // Placeholder - would need review system
    };
  }

  /**
   * Store daily metrics snapshot (for fast dashboard queries)
   */
  async storeDailyMetrics(branchId: string, date: Date): Promise<void> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get metrics for the day
    const orderStats = await pool.query(
      `SELECT 
         COUNT(*) as total_orders,
         COALESCE(SUM(total), 0) as total_revenue,
         COALESCE(AVG(total), 0) as avg_order_value,
         COUNT(*) FILTER (WHERE status = 'completed') as orders_completed,
         COUNT(*) FILTER (WHERE status = 'cancelled') as orders_cancelled
       FROM orders
       WHERE branch_id = $1 AND created_at >= $2 AND created_at <= $3`,
      [branchId, startOfDay, endOfDay]
    );

    const customerStats = await pool.query(
      `SELECT COUNT(*) as new_customers
       FROM customers
       WHERE created_at >= $1 AND created_at <= $2`,
      [startOfDay, endOfDay]
    );

    const deliveryStats = await pool.query(
      `SELECT COUNT(*) as deliveries_completed
       FROM deliveries d
       JOIN orders o ON o.id = d.order_id
       WHERE o.branch_id = $1 AND d.status = 'delivered' 
         AND d.actual_delivery_time >= $2 AND d.actual_delivery_time <= $3`,
      [branchId, startOfDay, endOfDay]
    );

    const order = orderStats.rows[0];
    const customer = customerStats.rows[0];
    const delivery = deliveryStats.rows[0];

    await pool.query(
      `INSERT INTO daily_metrics (
        branch_id, metric_date, total_orders, total_revenue, average_order_value,
        orders_completed, orders_cancelled, new_customers, deliveries_completed
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (branch_id, metric_date) DO UPDATE SET
        total_orders = EXCLUDED.total_orders,
        total_revenue = EXCLUDED.total_revenue,
        average_order_value = EXCLUDED.average_order_value,
        orders_completed = EXCLUDED.orders_completed,
        orders_cancelled = EXCLUDED.orders_cancelled,
        new_customers = EXCLUDED.new_customers,
        deliveries_completed = EXCLUDED.deliveries_completed`,
      [
        branchId, startOfDay, order.total_orders, order.total_revenue,
        order.avg_order_value, order.orders_completed, order.orders_cancelled,
        customer.new_customers, delivery.deliveries_completed,
      ]
    );
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
