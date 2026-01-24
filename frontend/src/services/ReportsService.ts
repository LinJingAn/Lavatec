import { api } from '../utils/api';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  branch_id?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface SalesReport {
  period: string;
  total_orders: number;
  total_revenue: number;
  average_ticket: number;
  new_customers: number;
  returning_customers: number;
  growth_percentage?: number;
}

export interface ServiceReport {
  service_id: string;
  service_name: string;
  quantity: number;
  revenue: number;
  percentage_of_total: number;
}

export interface CustomerReport {
  total_customers: number;
  new_customers: number;
  active_customers: number;
  churned_customers: number;
  average_lifetime_value: number;
  retention_rate: number;
}

export interface EmployeePerformanceReport {
  employee_id: string;
  employee_name: string;
  orders_processed: number;
  revenue_generated: number;
  average_rating: number;
  on_time_delivery_rate: number;
}

export interface OperationalReport {
  average_processing_time: number; // in hours
  on_time_delivery_rate: number;
  quality_score: number;
  customer_satisfaction: number;
  complaints: number;
  returns: number;
}

export interface InventoryReport {
  total_items: number;
  low_stock_items: number;
  out_of_stock_items: number;
  total_value: number;
  turnover_rate: number;
}

export interface FinancialSummary {
  gross_revenue: number;
  net_revenue: number;
  total_expenses: number;
  profit: number;
  profit_margin: number;
  accounts_receivable: number;
  accounts_payable: number;
  cash_flow: number;
}

class ReportsServiceClass {
  private static instance: ReportsServiceClass;

  private constructor() {}

  static getInstance(): ReportsServiceClass {
    if (!ReportsServiceClass.instance) {
      ReportsServiceClass.instance = new ReportsServiceClass();
    }
    return ReportsServiceClass.instance;
  }

  private buildQueryString(filters: ReportFilter): string {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.branch_id) params.append('branch_id', filters.branch_id);
    if (filters.period) params.append('period', filters.period);
    return params.toString();
  }

  // Sales Reports
  async getSalesReport(filters: ReportFilter = {}): Promise<{ data: SalesReport[] }> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `/reports/sales?${queryString}` : '/reports/sales';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw error;
    }
  }

  async getSalesByService(filters: ReportFilter = {}): Promise<{ data: ServiceReport[] }> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `/reports/sales/by-service?${queryString}` : '/reports/sales/by-service';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales by service report:', error);
      throw error;
    }
  }

  // Customer Reports
  async getCustomerReport(filters: ReportFilter = {}): Promise<{ data: CustomerReport }> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `/reports/customers?${queryString}` : '/reports/customers';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer report:', error);
      throw error;
    }
  }

  // Employee Performance
  async getEmployeePerformance(filters: ReportFilter = {}): Promise<{ data: EmployeePerformanceReport[] }> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `/reports/employees?${queryString}` : '/reports/employees';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee performance:', error);
      throw error;
    }
  }

  // Operational Reports
  async getOperationalReport(filters: ReportFilter = {}): Promise<{ data: OperationalReport }> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `/reports/operational?${queryString}` : '/reports/operational';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching operational report:', error);
      throw error;
    }
  }

  // Inventory Reports
  async getInventoryReport(filters: ReportFilter = {}): Promise<{ data: InventoryReport }> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `/reports/inventory?${queryString}` : '/reports/inventory';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      throw error;
    }
  }

  // Financial Summary
  async getFinancialSummary(filters: ReportFilter = {}): Promise<{ data: FinancialSummary }> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `/reports/financial?${queryString}` : '/reports/financial';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      throw error;
    }
  }

  // Export Reports
  async exportReport(type: string, format: 'pdf' | 'xlsx' | 'csv', filters: ReportFilter = {}): Promise<Blob> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString 
        ? `/reports/export/${type}?format=${format}&${queryString}` 
        : `/reports/export/${type}?format=${format}`;
      const response = await api.get(url, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }
}

export const ReportsService = ReportsServiceClass.getInstance();
export default ReportsService;
