import { promotionService as backendPromotionService, type Promotion, type CreatePromotionRequest } from './promotionApiService';
import { 
  PromotionUsage, 
  PromotionAnalytics, 
  DiscountType,
  PromotionStatus 
} from '../models/Promotion';
import { CustomerType } from '../models/Customer';

// Re-export Promotion interface for backward compatibility
export type { Promotion };

export class PromotionService {
  private static instance: PromotionService;

  private constructor() {}

  public static getInstance(): PromotionService {
    if (!PromotionService.instance) {
      PromotionService.instance = new PromotionService();
    }
    return PromotionService.instance;
  }

  async getPromotions(): Promise<Promotion[]> {
    try {
      const response = await backendPromotionService.getPromotions();
      return response.promotions || [];
    } catch (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
  }

  async getActivePromotions(): Promise<Promotion[]> {
    try {
      const response = await backendPromotionService.getPromotions({ status: 'active' });
      return response.promotions || [];
    } catch (error) {
      console.error('Error fetching active promotions:', error);
      return [];
    }
  }

  async createPromotion(promotion: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>): Promise<Promotion> {
    try {
      const createData: CreatePromotionRequest = {
        code: (promotion as any).code || '',
        name: (promotion as any).title || promotion.name || '',
        description: promotion.description || '',
        discount_type: (promotion as any).discount_type || 'percentage',
        discount_value: (promotion as any).discount_percentage || 0,
        start_date: promotion.start_date,
        end_date: promotion.end_date,
        usage_limit: (promotion as any).max_usage_count,
      };
      
      const response = await backendPromotionService.createPromotion(createData);
      return response.promotion;
    } catch (error: any) {
      console.error('Error creating promotion:', error);
      throw new Error(error.message || 'Failed to create promotion');
    }
  }

  async updatePromotion(id: string, promotion: Partial<Promotion>): Promise<Promotion> {
    try {
      const updateData: Partial<CreatePromotionRequest> = {
        name: (promotion as any).title || promotion.name,
        description: promotion.description,
        discount_type: (promotion as any).discount_type,
        discount_value: (promotion as any).discount_percentage || (promotion as any).discount_value,
        end_date: promotion.end_date,
        usage_limit: (promotion as any).max_usage_count,
      };
      
      const response = await backendPromotionService.updatePromotion(id, updateData);
      return response.promotion;
    } catch (error: any) {
      console.error('Error updating promotion:', error);
      throw new Error(error.message || 'Failed to update promotion');
    }
  }

  async deletePromotion(id: string): Promise<void> {
    // TODO: Implement delete endpoint in backend
    console.warn('Delete promotion not yet implemented in backend');
    throw new Error('Delete promotion not yet implemented');
  }

  async togglePromotionStatus(id: string, isActive: boolean): Promise<Promotion> {
    try {
      const response = await backendPromotionService.updatePromotion(id, { 
        status: isActive ? 'active' : 'inactive' 
      });
      return response.promotion;
    } catch (error: any) {
      console.error('Error toggling promotion status:', error);
      throw new Error(error.message || 'Failed to toggle promotion status');
    }
  }

  async generateCouponCode(length: number = 8): Promise<string> {
    // Generate a unique coupon code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!isUnique && attempts < maxAttempts) {
      code = Array.from(
        { length }, 
        () => characters.charAt(Math.floor(Math.random() * characters.length))
      ).join('');

      // Check if code exists by fetching promotions
      try {
        const promotions = await this.getPromotions();
        isUnique = !promotions.some((p: any) => p.code === code || p.coupon_code === code);
      } catch {
        isUnique = true; // If check fails, assume unique
      }
      
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique coupon code');
    }

    return code!;
  }

  async validateCouponCode(code: string, customerId: string, orderValue: number): Promise<{ 
    valid: boolean; 
    promotion?: Promotion; 
    error?: string; 
  }> {
    try {
      // Get all promotions and find by code
      const promotions = await this.getPromotions();
      const promotion = promotions.find((p: any) => p.code === code || p.coupon_code === code);

      if (!promotion) {
        return { valid: false, error: 'Invalid coupon code' };
      }

      // Check if promotion is active
      if (promotion.status !== 'active') {
        return { valid: false, error: 'Promotion is not active' };
      }

      // Check promotion period
      const now = new Date();
      if (new Date(promotion.start_date) > now || (promotion.end_date && new Date(promotion.end_date) < now)) {
        return { valid: false, error: 'Promotion is not valid at this time' };
      }

      // Check usage limits
      if (promotion.usage_limit && promotion.usage_count >= promotion.usage_limit) {
        return { valid: false, error: 'Promotion usage limit reached' };
      }

      // Check minimum order value (if applicable)
      if ((promotion as any).minimum_order_value && orderValue < (promotion as any).minimum_order_value) {
        return { 
          valid: false, 
          error: `Minimum order value of $${(promotion as any).minimum_order_value} required` 
        };
      }

      return { valid: true, promotion };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return { valid: false, error: 'Error validating coupon code' };
    }
  }

  async calculateDiscount(promotion: Promotion, orderValue: number): Promise<number> {
    const discountType = (promotion as any).discount_type || 'percentage';
    const discountValue = (promotion as any).discount_value || (promotion as any).discount_percentage || 0;
    
    if (discountType === 'percentage') {
      return orderValue * (discountValue / 100);
    } else {
      return Math.min(discountValue, orderValue);
    }
  }

  async recordPromotionUsage(usage: Omit<PromotionUsage, 'id' | 'appliedAt'>): Promise<void> {
    // TODO: Implement promotion usage tracking in backend
    console.warn('Record promotion usage not yet implemented in backend');
  }

  async getPromotionAnalytics(promotionId: string, startDate: Date, endDate: Date): Promise<PromotionAnalytics> {
    // TODO: Implement analytics endpoint in backend
    console.warn('Promotion analytics not yet implemented in backend');
    return {
      totalUsage: 0,
      totalDiscountAmount: 0,
      averageDiscountPerUse: 0,
      customerConversionRate: 0,
      revenueImpact: 0,
      startDate,
      endDate
    };
  }

  private async getCustomerUsageCount(promotionId: string, customerId: string): Promise<number> {
    // TODO: Implement customer usage count in backend
    return 0;
  }

  async updatePromotionStatus(promotionId: string, status: PromotionStatus): Promise<void> {
    try {
      await backendPromotionService.updatePromotion(promotionId, { status: status as string });
    } catch (error: any) {
      console.error('Error updating promotion status:', error);
      throw new Error(error.message || 'Failed to update promotion status');
    }
  }
}
