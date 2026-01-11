import { CustomerType } from './Customer';

export type DiscountType = 'percentage' | 'fixed_amount';

export type PromotionTrigger = 
  | 'order_value' 
  | 'order_frequency'
  | 'first_order'
  | 'seasonal'
  | 'coupon_code';

export type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'paused';

export interface PromotionRule {
  type: 'minimum_order_value' | 'minimum_items' | 'specific_services' | 'customer_type';
  value: number | string | string[];
}

export interface PromotionUsage {
  id: string;
  promotionId: string;
  customerId: string;
  orderId: string;
  discountAmount: number;
  appliedAt: Date;
}

export interface PromotionAnalytics {
  totalUsage: number;
  totalDiscountAmount: number;
  averageDiscountPerUse: number;
  customerConversionRate: number;
  revenueImpact: number;
  startDate: Date;
  endDate: Date;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  trigger: PromotionTrigger;
  couponCode?: string;
  rules: PromotionRule[];
  maxUsageCount?: number;
  maxUsagePerCustomer?: number;
  currentUsageCount: number;
  minimumOrderValue?: number;
  startDate: Date;
  endDate?: Date;
  status: PromotionStatus;
  applicableCustomerTypes: CustomerType[];
  excludedServices?: string[];
  stackable: boolean;
  createdAt: Date;
  updatedAt: Date;
  analytics?: PromotionAnalytics;
} 