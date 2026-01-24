import { api } from '../utils/api';

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category_name?: string;
  basePrice: number;
  processingTimeHours: number;
  isAvailable: boolean;
  icon?: string;
  color?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  is_active?: boolean;
}

export interface GarmentType {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  category_name?: string;
  base_price_modifier?: number;
  weight_estimate?: number;
  is_active?: boolean;
}

export interface PriceRule {
  id: string;
  service_id: string;
  service_name?: string;
  garment_type_id?: string;
  garment_type_name?: string;
  price: number;
  price_type: 'fixed' | 'per_kg' | 'per_piece';
  min_quantity?: number;
  max_quantity?: number;
  is_active?: boolean;
}

export interface ServiceFilters {
  category_id?: string;
  is_available?: boolean;
  search?: string;
}

class ServiceServiceClass {
  private static instance: ServiceServiceClass;

  private constructor() {}

  static getInstance(): ServiceServiceClass {
    if (!ServiceServiceClass.instance) {
      ServiceServiceClass.instance = new ServiceServiceClass();
    }
    return ServiceServiceClass.instance;
  }

  // Services
  async getServices(filters: ServiceFilters = {}): Promise<{ services: ServiceType[] }> {
    try {
      const params = new URLSearchParams();
      if (filters.category_id) params.append('category_id', filters.category_id);
      if (filters.is_available !== undefined) params.append('is_available', String(filters.is_available));
      if (filters.search) params.append('search', filters.search);

      const queryString = params.toString();
      const url = queryString ? `/services?${queryString}` : '/services';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  async getServiceById(id: string): Promise<ServiceType> {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  }

  async createService(service: Omit<ServiceType, 'id' | 'created_at' | 'updated_at'>): Promise<{ service: ServiceType }> {
    try {
      const response = await api.post('/services', service);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  async updateService(id: string, updates: Partial<ServiceType>): Promise<{ service: ServiceType }> {
    try {
      const response = await api.put(`/services/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      await api.delete(`/services/${id}`);
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  // Service Categories
  async getServiceCategories(): Promise<{ categories: ServiceCategory[] }> {
    try {
      const response = await api.get('/services/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching service categories:', error);
      throw error;
    }
  }

  async createServiceCategory(category: Omit<ServiceCategory, 'id'>): Promise<{ category: ServiceCategory }> {
    try {
      const response = await api.post('/services/categories', category);
      return response.data;
    } catch (error) {
      console.error('Error creating service category:', error);
      throw error;
    }
  }

  async updateServiceCategory(id: string, updates: Partial<ServiceCategory>): Promise<{ category: ServiceCategory }> {
    try {
      const response = await api.put(`/services/categories/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating service category:', error);
      throw error;
    }
  }

  // Garment Types
  async getGarmentTypes(categoryId?: string): Promise<{ garment_types: GarmentType[] }> {
    try {
      const url = categoryId ? `/garments?category_id=${categoryId}` : '/garments';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching garment types:', error);
      throw error;
    }
  }

  async createGarmentType(garment: Omit<GarmentType, 'id'>): Promise<{ garment_type: GarmentType }> {
    try {
      const response = await api.post('/garments', garment);
      return response.data;
    } catch (error) {
      console.error('Error creating garment type:', error);
      throw error;
    }
  }

  async updateGarmentType(id: string, updates: Partial<GarmentType>): Promise<{ garment_type: GarmentType }> {
    try {
      const response = await api.put(`/garments/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating garment type:', error);
      throw error;
    }
  }

  // Pricing Rules
  async getPriceRules(serviceId?: string): Promise<{ rules: PriceRule[] }> {
    try {
      const url = serviceId ? `/pricing/rules?service_id=${serviceId}` : '/pricing/rules';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching price rules:', error);
      throw error;
    }
  }

  async createPriceRule(rule: Omit<PriceRule, 'id'>): Promise<{ rule: PriceRule }> {
    try {
      const response = await api.post('/pricing/rules', rule);
      return response.data;
    } catch (error) {
      console.error('Error creating price rule:', error);
      throw error;
    }
  }

  async updatePriceRule(id: string, updates: Partial<PriceRule>): Promise<{ rule: PriceRule }> {
    try {
      const response = await api.put(`/pricing/rules/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating price rule:', error);
      throw error;
    }
  }

  async deletePriceRule(id: string): Promise<void> {
    try {
      await api.delete(`/pricing/rules/${id}`);
    } catch (error) {
      console.error('Error deleting price rule:', error);
      throw error;
    }
  }

  // Bulk Price Update
  async bulkUpdatePrices(updates: { service_id: string; garment_type_id?: string; price: number }[]): Promise<void> {
    try {
      await api.post('/pricing/bulk-update', { updates });
    } catch (error) {
      console.error('Error bulk updating prices:', error);
      throw error;
    }
  }

  // Price Calculation
  async calculatePrice(serviceId: string, garmentTypeId: string, quantity: number): Promise<{ price: number }> {
    try {
      const response = await api.post('/pricing/calculate', {
        service_id: serviceId,
        garment_type_id: garmentTypeId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating price:', error);
      throw error;
    }
  }
}

export const ServiceService = ServiceServiceClass.getInstance();
export default ServiceService;
