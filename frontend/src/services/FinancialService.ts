import { api } from '../utils/api';

export interface AccountPayable {
  id: string;
  branch_id: string;
  vendor_id?: string;
  vendor_name?: string;
  description: string;
  category: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_date?: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface AccountReceivable {
  id: string;
  branch_id: string;
  customer_id?: string;
  customer_name?: string;
  order_id?: string;
  invoice_id?: string;
  description: string;
  category: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_date?: string;
  payment_method?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface CashFlowTransaction {
  id: string;
  branch_id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  payment_method?: string;
  reference_id?: string;
  reference_type?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface CashFlowReport {
  summary: {
    totalIncome: number;
    totalExpense: number;
    netCashFlow: number;
    openingBalance: number;
    closingBalance: number;
  };
  data: {
    period: string;
    income: number;
    expense: number;
    balance: number;
  }[];
}

export interface BankAccount {
  id: string;
  branch_id: string;
  bank_name: string;
  account_type: 'checking' | 'savings' | 'investment';
  account_number: string;
  agency?: string;
  balance: number;
  is_active?: boolean;
  is_default?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface FinancialCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  parent_id?: string;
  description?: string;
  is_active?: boolean;
}

export interface AccountFilters {
  branchId?: string;
  vendorId?: string;
  customerId?: string;
  status?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

class FinancialServiceClass {
  private static instance: FinancialServiceClass;

  private constructor() {}

  static getInstance(): FinancialServiceClass {
    if (!FinancialServiceClass.instance) {
      FinancialServiceClass.instance = new FinancialServiceClass();
    }
    return FinancialServiceClass.instance;
  }

  // Accounts Payable
  async getAccountsPayable(filters: AccountFilters = {}): Promise<{ accounts: AccountPayable[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters.branchId) params.append('branchId', filters.branchId);
      if (filters.vendorId) params.append('vendorId', filters.vendorId);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.offset) params.append('offset', String(filters.offset));

      const queryString = params.toString();
      const url = queryString ? `/financial/payable?${queryString}` : '/financial/payable';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts payable:', error);
      throw error;
    }
  }

  async createAccountPayable(account: Omit<AccountPayable, 'id' | 'created_at' | 'updated_at'>): Promise<{ account: AccountPayable }> {
    try {
      const response = await api.post('/financial/payable', account);
      return response.data;
    } catch (error) {
      console.error('Error creating account payable:', error);
      throw error;
    }
  }

  async payAccountPayable(id: string, payment: { payment_date: string; payment_method: string; amount?: number }): Promise<{ account: AccountPayable }> {
    try {
      const response = await api.post(`/financial/payable/${id}/pay`, payment);
      return response.data;
    } catch (error) {
      console.error('Error paying account:', error);
      throw error;
    }
  }

  // Accounts Receivable
  async getAccountsReceivable(filters: AccountFilters = {}): Promise<{ accounts: AccountReceivable[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters.branchId) params.append('branchId', filters.branchId);
      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.offset) params.append('offset', String(filters.offset));

      const queryString = params.toString();
      const url = queryString ? `/financial/receivable?${queryString}` : '/financial/receivable';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts receivable:', error);
      throw error;
    }
  }

  async createAccountReceivable(account: Omit<AccountReceivable, 'id' | 'created_at' | 'updated_at'>): Promise<{ account: AccountReceivable }> {
    try {
      const response = await api.post('/financial/receivable', account);
      return response.data;
    } catch (error) {
      console.error('Error creating account receivable:', error);
      throw error;
    }
  }

  async receivePayment(id: string, payment: { payment_date: string; payment_method: string; amount?: number }): Promise<{ account: AccountReceivable }> {
    try {
      const response = await api.post(`/financial/receivable/${id}/receive`, payment);
      return response.data;
    } catch (error) {
      console.error('Error receiving payment:', error);
      throw error;
    }
  }

  // Cash Flow
  async getCashFlowReport(options: { branchId?: string; startDate: Date; endDate: Date; groupBy?: 'day' | 'week' | 'month' }): Promise<CashFlowReport> {
    try {
      const params = new URLSearchParams();
      if (options.branchId) params.append('branchId', options.branchId);
      params.append('startDate', options.startDate.toISOString());
      params.append('endDate', options.endDate.toISOString());
      if (options.groupBy) params.append('groupBy', options.groupBy);

      const url = `/financial/cashflow?${params.toString()}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching cash flow report:', error);
      throw error;
    }
  }

  async createCashFlowTransaction(transaction: Omit<CashFlowTransaction, 'id' | 'created_at'>): Promise<{ transaction: CashFlowTransaction }> {
    try {
      const response = await api.post('/financial/cashflow', transaction);
      return response.data;
    } catch (error) {
      console.error('Error creating cash flow transaction:', error);
      throw error;
    }
  }

  // Bank Accounts
  async getBankAccounts(branchId: string): Promise<{ accounts: BankAccount[] }> {
    try {
      const response = await api.get(`/financial/bank-accounts/${branchId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      throw error;
    }
  }

  async createBankAccount(account: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>): Promise<{ account: BankAccount }> {
    try {
      const response = await api.post('/financial/bank-accounts', account);
      return response.data;
    } catch (error) {
      console.error('Error creating bank account:', error);
      throw error;
    }
  }

  // Categories
  async getCategories(type?: 'income' | 'expense'): Promise<{ categories: FinancialCategory[] }> {
    try {
      const url = type ? `/financial/categories?type=${type}` : '/financial/categories';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async createCategory(category: Omit<FinancialCategory, 'id'>): Promise<{ category: FinancialCategory }> {
    try {
      const response = await api.post('/financial/categories', category);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }
}

export const FinancialService = FinancialServiceClass.getInstance();
export default FinancialService;
