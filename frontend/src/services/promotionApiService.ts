import { api } from '../utils/api';

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  trigger: string;
  code?: string;
  coupon_code?: string;
  rules?: any[];
  max_usage_count?: number;
  max_usage_per_customer?: number;
  minimum_order_value?: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'expired';
  applicable_customer_types?: string[];
  excluded_services?: string[];
  stackable: boolean;
  usage_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePromotionRequest {
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  trigger: string;
  code?: string;
  coupon_code?: string;
  rules?: any[];
  max_usage_count?: number;
  max_usage_per_customer?: number;
  minimum_order_value?: number;
  start_date: string;
  end_date?: string;
  status?: 'active' | 'inactive' | 'expired';
  applicable_customer_types?: string[];
  excluded_services?: string[];
  stackable?: boolean;
}

export interface GetPromotionsResponse {
  promotions: Promotion[];
}

export interface GetPromotionResponse {
  promotion: Promotion;
}

export interface CreatePromotionResponse {
  promotion: Promotion;
}

export interface UpdatePromotionResponse {
  promotion: Promotion;
}

export const promotionService = {
  async getPromotions(params?: { status?: string; page?: number; limit?: number }): Promise<GetPromotionsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const url = `/promotions${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get<GetPromotionsResponse>(url);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching promotions:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch promotions');
    }
  },

  async getPromotionById(id: string): Promise<GetPromotionResponse> {
    try {
      const response = await api.get<GetPromotionResponse>(`/promotions/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching promotion:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch promotion');
    }
  },

  async createPromotion(data: CreatePromotionRequest): Promise<CreatePromotionResponse> {
    try {
      const response = await api.post<CreatePromotionResponse>('/promotions', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating promotion:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to create promotion');
    }
  },

  async updatePromotion(id: string, data: Partial<CreatePromotionRequest>): Promise<UpdatePromotionResponse> {
    try {
      const response = await api.put<UpdatePromotionResponse>(`/promotions/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating promotion:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to update promotion');
    }
  },
};

export default promotionService;
