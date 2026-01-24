import { api } from '../utils/api';

export interface OverviewDashboard {
  totalOrders: number;
  activeOrders: number;
  completedToday: number;
  pendingPickups: number;
  revenue: {
    today: number;
    week: number;
    month: number;
    growth: number;
  };
  ordersByStatus: { status: string; count: number }[];
  recentOrders: any[];
  topServices: { service: string; count: number; revenue: number }[];
}

export interface FinancialDashboard {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  pendingReceivables: number;
  pendingPayables: number;
  revenueByPeriod: { period: string; revenue: number }[];
  expensesByCategory: { category: string; amount: number }[];
  cashFlow: { date: string; income: number; expense: number; balance: number }[];
}

export interface OperationalDashboard {
  machinesStatus: { active: number; maintenance: number; idle: number };
  avgProcessingTime: number;
  ordersInQueue: number;
  staffOnDuty: number;
  capacityUtilization: number;
  deliveriesScheduled: number;
  pickupsScheduled: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  customerRetentionRate: number;
  avgOrderValue: number;
  topCustomers: { id: string; name: string; totalSpent: number; orderCount: number }[];
  customersByCategory: { category: string; count: number }[];
  churnRate: number;
}

export interface KPIs {
  revenue: number;
  orders: number;
  avgTicket: number;
  customerSatisfaction: number;
  onTimeDelivery: number;
  returnRate: number;
  newCustomers: number;
  repeatCustomerRate: number;
  comparisonPeriod: {
    revenue: number;
    orders: number;
    avgTicket: number;
  };
}

class DashboardServiceClass {
  private static instance: DashboardServiceClass;

  private constructor() {}

  static getInstance(): DashboardServiceClass {
    if (!DashboardServiceClass.instance) {
      DashboardServiceClass.instance = new DashboardServiceClass();
    }
    return DashboardServiceClass.instance;
  }

  async getOverviewDashboard(branchId?: string, startDate?: Date, endDate?: Date): Promise<OverviewDashboard> {
    try {
      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId);
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const queryString = params.toString();
      const url = queryString ? `/dashboard/overview?${queryString}` : '/dashboard/overview';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching overview dashboard:', error);
      throw error;
    }
  }

  async getFinancialDashboard(branchId?: string, startDate?: Date, endDate?: Date): Promise<FinancialDashboard> {
    try {
      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId);
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const queryString = params.toString();
      const url = queryString ? `/dashboard/financial?${queryString}` : '/dashboard/financial';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial dashboard:', error);
      throw error;
    }
  }

  async getOperationalDashboard(branchId?: string): Promise<OperationalDashboard> {
    try {
      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId);

      const queryString = params.toString();
      const url = queryString ? `/dashboard/operational?${queryString}` : '/dashboard/operational';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching operational dashboard:', error);
      throw error;
    }
  }

  async getCustomerAnalytics(branchId?: string): Promise<CustomerAnalytics> {
    try {
      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId);

      const queryString = params.toString();
      const url = queryString ? `/dashboard/customers?${queryString}` : '/dashboard/customers';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  }

  async getKPIs(branchId?: string, period: 'today' | 'week' | 'month' | 'year' = 'month'): Promise<KPIs> {
    try {
      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId);
      params.append('period', period);

      const url = `/dashboard/kpis?${params.toString()}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  }
}

export const DashboardService = DashboardServiceClass.getInstance();
export default DashboardService;
