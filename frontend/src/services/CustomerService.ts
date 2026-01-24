import { api } from '../utils/api';

export interface CustomerAddress {
  id?: string;
  customer_id?: string;
  label?: string;
  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zip_code: string;
  is_default?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface CustomerWashingPreferences {
  id?: string;
  customer_id?: string;
  fabric_softener?: boolean;
  starch_level?: 'none' | 'light' | 'medium' | 'heavy';
  fragrance?: string;
  hanger_preference?: boolean;
  folding_preference?: 'folded' | 'on_hanger' | 'both';
  special_care_notes?: string;
}

export interface CustomerNote {
  id: string;
  customer_id: string;
  content: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface CustomerCommunicationLog {
  id: string;
  customer_id: string;
  type: 'sms' | 'email' | 'whatsapp' | 'phone' | 'in_person';
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  created_by?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  category: 'regular' | 'vip' | 'business' | 'new';
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  tax_id?: string;
  referred_by?: string;
  loyalty_points?: number;
  profile_image_url?: string;
  is_active?: boolean;
  total_orders?: number;
  total_spent?: number;
  last_order_date?: string;
  addresses?: CustomerAddress[];
  washingPreferences?: CustomerWashingPreferences;
  notes?: CustomerNote[];
  communicationLogs?: CustomerCommunicationLog[];
  created_at: string;
  updated_at?: string;
}

export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  category?: 'regular' | 'vip' | 'business' | 'new';
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  tax_id?: string;
  referred_by?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  category?: 'regular' | 'vip' | 'business' | 'new';
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  tax_id?: string;
  referred_by?: string;
  loyalty_points?: number;
  profile_image_url?: string;
  is_active?: boolean;
}

export interface CustomerFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

class CustomerServiceClass {
  private static instance: CustomerServiceClass;

  private constructor() {}

  static getInstance(): CustomerServiceClass {
    if (!CustomerServiceClass.instance) {
      CustomerServiceClass.instance = new CustomerServiceClass();
    }
    return CustomerServiceClass.instance;
  }

  async getCustomers(filters: CustomerFilters = {}): Promise<{ 
    customers: Customer[]; 
    pagination: CustomerPagination;
  }> {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));

      const queryString = params.toString();
      const url = queryString ? `/customers?${queryString}` : '/customers';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<Customer> {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  async createCustomer(customer: CreateCustomerRequest): Promise<{ customer: Customer }> {
    try {
      const response = await api.post('/customers', customer);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, updates: UpdateCustomerRequest): Promise<{ customer: Customer }> {
    try {
      const response = await api.put(`/customers/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  async searchCustomers(query: string): Promise<{ customers: Customer[] }> {
    const result = await this.getCustomers({ search: query });
    return { customers: result.customers };
  }

  async getCustomersByCategory(category: string): Promise<{ customers: Customer[] }> {
    const result = await this.getCustomers({ category });
    return { customers: result.customers };
  }

  async addCustomerNote(customerId: string, content: string): Promise<CustomerNote> {
    try {
      const response = await api.post(`/customers/${customerId}/notes`, { content });
      return response.data.note;
    } catch (error) {
      console.error('Error adding customer note:', error);
      throw error;
    }
  }

  async getCustomerNotes(customerId: string): Promise<CustomerNote[]> {
    try {
      const response = await api.get(`/customers/${customerId}/notes`);
      return response.data.notes || [];
    } catch (error) {
      console.error('Error fetching customer notes:', error);
      return [];
    }
  }

  async addCustomerAddress(customerId: string, address: Omit<CustomerAddress, 'id' | 'customer_id'>): Promise<CustomerAddress> {
    try {
      const response = await api.post(`/customers/${customerId}/addresses`, address);
      return response.data.address;
    } catch (error) {
      console.error('Error adding customer address:', error);
      throw error;
    }
  }

  async updateWashingPreferences(customerId: string, preferences: Omit<CustomerWashingPreferences, 'id' | 'customer_id'>): Promise<CustomerWashingPreferences> {
    try {
      const response = await api.put(`/customers/${customerId}/preferences`, preferences);
      return response.data.preferences;
    } catch (error) {
      console.error('Error updating washing preferences:', error);
      throw error;
    }
  }

  async logCommunication(customerId: string, log: Omit<CustomerCommunicationLog, 'id' | 'customer_id' | 'created_at'>): Promise<CustomerCommunicationLog> {
    try {
      const response = await api.post(`/customers/${customerId}/communication`, log);
      return response.data.log;
    } catch (error) {
      console.error('Error logging communication:', error);
      throw error;
    }
  }
}

export const CustomerService = CustomerServiceClass.getInstance();
export default CustomerService;
