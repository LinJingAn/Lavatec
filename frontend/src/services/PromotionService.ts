import { supabase, handleSupabaseResponse } from "../lib/supabaseClient";
import { 
  Promotion, 
  PromotionUsage, 
  PromotionAnalytics, 
  DiscountType,
  PromotionStatus 
} from '../models/Promotion';
import { CustomerType } from '../models/Customer';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    return handleSupabaseResponse<Promotion[]>({ data, error }) || [];
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    return handleSupabaseResponse<Promotion[]>({ data, error }) || [];
  }

  async createPromotion(promotion: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>): Promise<Promotion> {
    const { data, error } = await supabase
      .from('promotions')
      .insert(promotion)
      .select()
      .single();

    return handleSupabaseResponse<Promotion>({ data, error });
  }

  async updatePromotion(id: string, promotion: Partial<Promotion>): Promise<Promotion> {
    const { data, error } = await supabase
      .from('promotions')
      .update(promotion)
      .eq('id', id)
      .select()
      .single();

    return handleSupabaseResponse<Promotion>({ data, error });
  }

  async deletePromotion(id: string): Promise<void> {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async togglePromotionStatus(id: string, isActive: boolean): Promise<Promotion> {
    const { data, error } = await supabase
      .from('promotions')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    return handleSupabaseResponse<Promotion>({ data, error });
  }

  async generateCouponCode(length: number = 8): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let isUnique = false;

    while (!isUnique) {
      code = Array.from(
        { length }, 
        () => characters.charAt(Math.floor(Math.random() * characters.length))
      ).join('');

      const { data } = await supabase
        .from('promotions')
        .select('id')
        .eq('couponCode', code);

      isUnique = !data || data.length === 0;
    }

    return code!;
  }

  async validateCouponCode(code: string, customerId: string, orderValue: number): Promise<{ 
    valid: boolean; 
    promotion?: Promotion; 
    error?: string; 
  }> {
    try {
      // Get promotion by coupon code
      const { data: promotion, error } = await supabase
        .from('promotions')
        .select('*, promotion_usage(*)')
        .eq('couponCode', code)
        .single();

      if (error) throw error;
      if (!promotion) return { valid: false, error: 'Invalid coupon code' };

      // Check if promotion is active
      if (promotion.status !== 'active') {
        return { valid: false, error: 'Promotion is not active' };
      }

      // Check promotion period
      const now = new Date();
      if (promotion.startDate > now || (promotion.endDate && promotion.endDate < now)) {
        return { valid: false, error: 'Promotion is not valid at this time' };
      }

      // Check usage limits
      if (promotion.maxUsageCount && promotion.currentUsageCount >= promotion.maxUsageCount) {
        return { valid: false, error: 'Promotion usage limit reached' };
      }

      // Check per-customer usage
      if (promotion.maxUsagePerCustomer) {
        const customerUsage = await this.getCustomerUsageCount(promotion.id, customerId);
        if (customerUsage >= promotion.maxUsagePerCustomer) {
          return { valid: false, error: 'Customer usage limit reached' };
        }
      }

      // Check minimum order value
      if (promotion.minimumOrderValue && orderValue < promotion.minimumOrderValue) {
        return { 
          valid: false, 
          error: `Minimum order value of $${promotion.minimumOrderValue} required` 
        };
      }

      return { valid: true, promotion };
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  }

  async calculateDiscount(promotion: Promotion, orderValue: number): Promise<number> {
    if (promotion.discountType === 'percentage') {
      return orderValue * (promotion.discountValue / 100);
    } else {
      return Math.min(promotion.discountValue, orderValue);
    }
  }

  async recordPromotionUsage(usage: Omit<PromotionUsage, 'id' | 'appliedAt'>): Promise<void> {
    try {
      const { error: usageError } = await supabase
        .from('promotion_usage')
        .insert([{ ...usage, appliedAt: new Date() }]);

      if (usageError) throw usageError;

      // Update promotion usage count
      const { error: updateError } = await supabase
        .from('promotions')
        .update({ 
          currentUsageCount: supabase.sql`current_usage_count + 1`,
          updatedAt: new Date()
        })
        .eq('id', usage.promotionId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error recording promotion usage:', error);
      throw error;
    }
  }

  async getPromotionAnalytics(promotionId: string, startDate: Date, endDate: Date): Promise<PromotionAnalytics> {
    try {
      // Get promotion usage data
      const { data: usageData, error } = await supabase
        .from('promotion_usage')
        .select('*')
        .eq('promotionId', promotionId)
        .gte('appliedAt', startDate.toISOString())
        .lte('appliedAt', endDate.toISOString());

      if (error) throw error;

      // Calculate analytics
      const totalUsage = usageData.length;
      const totalDiscountAmount = usageData.reduce((sum, usage) => sum + usage.discountAmount, 0);
      const averageDiscountPerUse = totalUsage > 0 ? totalDiscountAmount / totalUsage : 0;

      // Get conversion rate data
      const { data: conversionData } = await supabase.rpc('calculate_promotion_conversion_rate', {
        p_promotion_id: promotionId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString()
      });

      const customerConversionRate = conversionData?.conversion_rate || 0;

      // Calculate revenue impact
      const { data: revenueData } = await supabase.rpc('calculate_promotion_revenue_impact', {
        p_promotion_id: promotionId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString()
      });

      const revenueImpact = revenueData?.revenue_impact || 0;

      return {
        totalUsage,
        totalDiscountAmount,
        averageDiscountPerUse,
        customerConversionRate,
        revenueImpact,
        startDate,
        endDate
      };
    } catch (error) {
      console.error('Error getting promotion analytics:', error);
      throw error;
    }
  }

  private async getCustomerUsageCount(promotionId: string, customerId: string): Promise<number> {
    const { data, error } = await supabase
      .from('promotion_usage')
      .select('id')
      .eq('promotionId', promotionId)
      .eq('customerId', customerId);

    if (error) throw error;
    return data?.length || 0;
  }

  async updatePromotionStatus(promotionId: string, status: PromotionStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ 
          status, 
          updatedAt: new Date() 
        })
        .eq('id', promotionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating promotion status:', error);
      throw error;
    }
  }
} 