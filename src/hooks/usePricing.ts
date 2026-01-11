import { useState, useEffect } from 'react';
import { 
  ServiceType, 
  mockServiceTypes 
} from '../models/ServiceTypes';
import { 
  GarmentType, 
  PriceMatrixEntry, 
  PricingRule, 
  CalculatedPrice,
  mockGarmentTypes,
  mockPriceMatrix,
  mockPricingRules,
  AppliedRule
} from '../models/PricingTable';

interface PricingData {
  serviceTypes: ServiceType[];
  garmentTypes: GarmentType[];
  priceMatrix: PriceMatrixEntry[];
  pricingRules: PricingRule[];
  isLoading: boolean;
  error: string | null;
}

export interface PriceCalculationParams {
  serviceTypeId: string;
  garmentTypeId: string;
  quantity: number;
  isExpress: boolean;
  customerType?: string;
}

export const usePricing = () => {
  const [pricingData, setPricingData] = useState<PricingData>({
    serviceTypes: [],
    garmentTypes: [],
    priceMatrix: [],
    pricingRules: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Simulated API fetch
    const fetchPricingData = async () => {
      try {
        // In a real app, you would fetch from API
        // For now, use mock data
        setPricingData({
          serviceTypes: mockServiceTypes,
          garmentTypes: mockGarmentTypes,
          priceMatrix: mockPriceMatrix,
          pricingRules: mockPricingRules,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setPricingData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load pricing data'
        }));
      }
    };

    fetchPricingData();
  }, []);

  const findMatrixEntry = (serviceTypeId: string, garmentTypeId: string): PriceMatrixEntry | undefined => {
    return pricingData.priceMatrix.find(entry => 
      entry.serviceTypeId === serviceTypeId && 
      entry.garmentTypeId === garmentTypeId &&
      entry.isActive
    );
  };

  const getServiceById = (id: string): ServiceType | undefined => {
    return pricingData.serviceTypes.find(service => service.id === id);
  };

  const getGarmentById = (id: string): GarmentType | undefined => {
    return pricingData.garmentTypes.find(garment => garment.id === id);
  };

  const getApplicableRules = (params: PriceCalculationParams): PricingRule[] => {
    const currentDate = new Date();
    
    return pricingData.pricingRules
      .filter(rule => rule.isActive)
      .filter(rule => {
        const startDate = new Date(rule.startDate);
        const endDate = rule.endDate ? new Date(rule.endDate) : null;
        
        if (startDate > currentDate || (endDate && endDate < currentDate)) {
          return false;
        }
        
        switch (rule.conditionType) {
          case 'quantity':
            return params.quantity >= (rule.condition.minQuantity || 0);
          case 'customer_type':
            return params.customerType === rule.condition.customerType;
          case 'season':
            if (rule.condition.seasonStart && rule.condition.seasonEnd) {
              const today = new Date();
              const month = today.getMonth() + 1;
              const day = today.getDate();
              const currentDateString = `${today.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
              
              // Simple date string comparison - in real implementation, use proper date parsing
              return currentDateString >= rule.condition.seasonStart && 
                     currentDateString <= rule.condition.seasonEnd;
            }
            return false;
          case 'promotion':
            // Promotion logic would go here
            return false;
          default:
            return false;
        }
      })
      .sort((a, b) => b.priority - a.priority); // Higher priority first
  };

  const calculatePrice = (params: PriceCalculationParams): CalculatedPrice | null => {
    const { serviceTypeId, garmentTypeId, quantity, isExpress, customerType } = params;
    
    const matrixEntry = findMatrixEntry(serviceTypeId, garmentTypeId);
    if (!matrixEntry) return null;
    
    const service = getServiceById(serviceTypeId);
    const garment = getGarmentById(garmentTypeId);
    if (!service || !garment) return null;
    
    const basePrice = matrixEntry.basePrice * quantity;
    const expressUpcharge = isExpress ? (matrixEntry.basePrice * (matrixEntry.expressMultiplier - 1)) * quantity : 0;
    
    // Apply quantity discounts from price matrix if available
    let discountPercentage = 0;
    if (matrixEntry.discountThresholds) {
      const thresholds = [...matrixEntry.discountThresholds].sort((a, b) => b.quantity - a.quantity);
      const applicableThreshold = thresholds.find(t => quantity >= t.quantity);
      if (applicableThreshold) {
        discountPercentage = applicableThreshold.discountPercentage;
      }
    }
    
    // Apply pricing rules
    const applicableRules = getApplicableRules(params);
    for (const rule of applicableRules) {
      if (rule.effectType === 'discount_percentage') {
        discountPercentage = Math.max(discountPercentage, rule.effectValue);
      }
      // Additional rule effects would be handled here
    }
    
    const discountAmount = basePrice * discountPercentage;
    const totalPrice = basePrice + expressUpcharge - discountAmount;
    
    // Estimate delivery date based on processing time
    const processingTime = isExpress 
      ? Math.ceil(matrixEntry.processingTimeHours / 2) 
      : matrixEntry.processingTimeHours;
      
    const deliveryDate = new Date();
    deliveryDate.setHours(deliveryDate.getHours() + processingTime);
    
    // Map pricing rules to AppliedRule format
    const appliedRulesList: AppliedRule[] = applicableRules.map(rule => ({
      ruleId: rule.id,
      description: rule.description,
      impact: rule.effectType === 'discount_percentage' ? -Math.round(rule.effectValue * 100) : 0
    }));
    
    return {
      serviceTypeId,
      serviceName: service.name,
      garmentTypeId,
      garmentName: garment.name,
      basePrice: matrixEntry.basePrice * quantity,
      quantity,
      expressMultiplier: matrixEntry.expressMultiplier,
      expressUpcharge,
      discount: discountPercentage,
      discountAmount,
      totalPrice,
      processingTimeHours: processingTime,
      deliveryDate,
      appliedRules: appliedRulesList
    };
  };

  return {
    ...pricingData,
    calculatePrice,
    findMatrixEntry,
    getServiceById,
    getGarmentById
  };
};

export default usePricing; 