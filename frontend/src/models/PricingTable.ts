import { ServiceCategory, ServiceType } from './ServiceTypes';

// Types for pricing
export type PriceEntryType = 'standard' | 'rush' | 'bulk' | 'special';
export type PriceHistoryAction = 'create' | 'update' | 'delete' | 'bulk_update';

// Pricing matrix entry - maps service type to garment type with specific price
export interface PriceMatrixEntry {
  id: string;
  serviceTypeId: string;
  garmentTypeId: string;
  basePrice: number;
  expressMultiplier: number;
  discountThresholds?: {
    quantity: number;
    discountPercentage: number;
  }[];
  processingTimeHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Garment type definition
export interface GarmentType {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  materialType?: string;
  careInstructions?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Special pricing rules
export interface PricingRule {
  id: string;
  name: string;
  description: string;
  conditionType: 'quantity' | 'customer_type' | 'season' | 'promotion';
  condition: {
    minQuantity?: number;
    customerType?: string;
    seasonStart?: string;
    seasonEnd?: string;
    promotionCode?: string;
  };
  effectType: 'discount_percentage' | 'discount_fixed' | 'express_free';
  effectValue: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

// Price history entry for tracking changes
export interface PriceHistoryEntry {
  id: string;
  date: Date;
  userId: string;
  userName: string;
  action: PriceHistoryAction;
  details: {
    serviceTypeId?: string;
    garmentTypeId?: string;
    oldPrice?: number;
    newPrice?: number;
    ruleId?: string;
    bulkUpdateInfo?: string;
  };
  notes?: string;
}

// Bulk price update request
export interface BulkPriceUpdateRequest {
  id: string;
  name: string;
  description?: string;
  filters: {
    serviceTypeIds?: string[];
    serviceCategories?: ServiceCategory[];
    garmentTypeIds?: string[];
    garmentCategories?: string[];
  };
  update: {
    adjustmentType: 'fixed' | 'percentage';
    adjustmentValue: number;
  };
  previewCount?: number;
  affectedPricesCount?: number;
  createdBy: string;
  createdAt: Date;
  executedAt?: Date;
  status: 'draft' | 'preview' | 'executed' | 'cancelled';
}

// Price calculator input
export interface PriceCalculatorInput {
  serviceTypeId: string;
  garmentTypeId: string;
  quantity: number;
  isExpress: boolean;
  priceMatrix: PriceMatrixEntry[];
  pricingRules: PricingRule[];
  serviceTypes: ServiceType[];
  garmentTypes: GarmentType[];
}

// Price calculator result
export interface PriceCalculatorResult {
  basePrice: number;
  adjustedPrice: number;
  subtotal: number;
  volumeDiscount: number;
  totalPrice: number;
  appliedRules: AppliedRule[];
}

// Applied rule in a price calculation
export interface AppliedRule {
  ruleId: string;
  description: string;
  impact: number;
}

// Calculated price
export interface CalculatedPrice {
  serviceTypeId: string;
  serviceName: string;
  garmentTypeId: string;
  garmentName: string;
  basePrice: number;
  quantity: number;
  expressMultiplier: number;
  expressUpcharge: number;
  discount: number;
  discountAmount: number;
  totalPrice: number;
  processingTimeHours: number;
  deliveryDate: Date;
  appliedRules: AppliedRule[];
}

// Mock data generators
export const mockGarmentTypes: GarmentType[] = [
  {
    id: 'gt-001',
    name: 'Camisa',
    description: 'Camisas sociais e casuais',
    category: 'tops',
    isActive: true,
    materialType: 'Algodão',
    careInstructions: 'Lavagem delicada',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'gt-002',
    name: 'Calça',
    description: 'Calças jeans e sociais',
    category: 'bottoms',
    isActive: true,
    materialType: 'Diversos',
    careInstructions: 'Seguir instruções da etiqueta',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'gt-003',
    name: 'Vestido',
    description: 'Vestidos casuais e sociais',
    category: 'dresses',
    isActive: true,
    materialType: 'Diversos',
    careInstructions: 'Lavagem a seco recomendada',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'gt-004',
    name: 'Terno',
    description: 'Ternos completos',
    category: 'suits',
    isActive: true,
    materialType: 'Lã e misturas',
    careInstructions: 'Apenas lavagem a seco',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'gt-005',
    name: 'Edredom',
    description: 'Edredons de todos os tamanhos',
    category: 'household',
    isActive: true,
    materialType: 'Diversos',
    careInstructions: 'Lavagem industrial',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

export const mockPriceMatrix: PriceMatrixEntry[] = [
  // Lavagem Simples (serviceType st-001)
  {
    id: 'pm-001',
    serviceTypeId: 'st-001',
    garmentTypeId: 'gt-001',
    basePrice: 15.0,
    expressMultiplier: 1.5,
    discountThresholds: [
      { quantity: 5, discountPercentage: 0.1 },
      { quantity: 10, discountPercentage: 0.15 }
    ],
    processingTimeHours: 24,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'pm-002',
    serviceTypeId: 'st-001',
    garmentTypeId: 'gt-002',
    basePrice: 20.0,
    expressMultiplier: 1.5,
    processingTimeHours: 24,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'pm-003',
    serviceTypeId: 'st-001',
    garmentTypeId: 'gt-003',
    basePrice: 25.0,
    expressMultiplier: 1.5,
    processingTimeHours: 24,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  
  // Lavagem a Seco (serviceType st-002)
  {
    id: 'pm-004',
    serviceTypeId: 'st-002',
    garmentTypeId: 'gt-001',
    basePrice: 20.0,
    expressMultiplier: 1.7,
    processingTimeHours: 48,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'pm-005',
    serviceTypeId: 'st-002',
    garmentTypeId: 'gt-003',
    basePrice: 35.0,
    expressMultiplier: 1.7,
    processingTimeHours: 48,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'pm-006',
    serviceTypeId: 'st-002',
    garmentTypeId: 'gt-004',
    basePrice: 60.0,
    expressMultiplier: 1.5,
    processingTimeHours: 72,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  
  // Passadoria (serviceType st-003)
  {
    id: 'pm-007',
    serviceTypeId: 'st-003',
    garmentTypeId: 'gt-001',
    basePrice: 10.0,
    expressMultiplier: 2.0,
    processingTimeHours: 12,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'pm-008',
    serviceTypeId: 'st-003',
    garmentTypeId: 'gt-002',
    basePrice: 12.0,
    expressMultiplier: 2.0,
    processingTimeHours: 12,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

export const mockPricingRules: PricingRule[] = [
  {
    id: 'rule-001',
    name: 'Desconto Volumetria',
    description: 'Desconto para pedidos com mais de 5 itens',
    conditionType: 'quantity',
    condition: {
      minQuantity: 5
    },
    effectType: 'discount_percentage',
    effectValue: 0.1, // 10% discount
    isActive: true,
    startDate: '2023-01-01T00:00:00Z',
    priority: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'rule-002',
    name: 'Promoção Verão',
    description: 'Promoção sazonal de verão',
    conditionType: 'season',
    condition: {
      seasonStart: '2023-12-01',
      seasonEnd: '2024-03-31'
    },
    effectType: 'discount_percentage',
    effectValue: 0.15, // 15% discount
    isActive: true,
    startDate: '2023-12-01T00:00:00Z',
    endDate: '2024-03-31T23:59:59Z',
    priority: 2,
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2023-11-01T00:00:00Z'
  },
  {
    id: 'rule-003',
    name: 'Cliente VIP',
    description: 'Desconto especial para clientes VIP',
    conditionType: 'customer_type',
    condition: {
      customerType: 'vip'
    },
    effectType: 'discount_percentage',
    effectValue: 0.2, // 20% discount
    isActive: true,
    startDate: '2023-01-01T00:00:00Z',
    priority: 3,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

// Mock data for price history
export const generateMockPriceHistory = (): PriceHistoryEntry[] => {
  return [
    {
      id: '1',
      date: new Date('2023-08-01T10:30:00'),
      userId: 'admin1',
      userName: 'Admin User',
      action: 'create',
      details: {
        serviceTypeId: '1',
        garmentTypeId: '1',
        newPrice: 12.90
      }
    },
    {
      id: '2',
      date: new Date('2023-08-15T14:20:00'),
      userId: 'admin1',
      userName: 'Admin User',
      action: 'update',
      details: {
        serviceTypeId: '1',
        garmentTypeId: '1',
        oldPrice: 12.90,
        newPrice: 13.90
      },
      notes: 'Ajuste por aumento de custos operacionais'
    },
    {
      id: '3',
      date: new Date('2023-09-01T09:15:00'),
      userId: 'manager1',
      userName: 'Manager User',
      action: 'bulk_update',
      details: {
        bulkUpdateInfo: 'Aumento de 5% em todos os serviços de Lavagem Simples'
      }
    },
    {
      id: '4',
      date: new Date('2023-09-05T11:45:00'),
      userId: 'admin1',
      userName: 'Admin User',
      action: 'create',
      details: {
        ruleId: '5',
        newPrice: 0 // Not applicable for rules
      },
      notes: 'Nova promoção sazonal criada'
    }
  ];
};

// Mock data for bulk price update requests
export const generateMockBulkUpdateRequests = (): BulkPriceUpdateRequest[] => {
  return [
    {
      id: '1',
      name: 'Aumento geral Janeiro 2023',
      description: 'Ajuste anual de preços baseado na inflação',
      filters: {
        serviceCategories: ['laundry', 'drycleaning', 'ironing', 'special', 'household']
      },
      update: {
        adjustmentType: 'percentage',
        adjustmentValue: 5
      },
      previewCount: 150,
      affectedPricesCount: 150,
      createdBy: 'admin1',
      createdAt: new Date('2023-01-10'),
      executedAt: new Date('2023-01-15'),
      status: 'executed'
    },
    {
      id: '2',
      name: 'Ajuste de preços - Roupas formais',
      description: 'Ajuste de preços para itens de categoria formal',
      filters: {
        garmentCategories: ['Roupas Formais']
      },
      update: {
        adjustmentType: 'percentage',
        adjustmentValue: 8
      },
      previewCount: 12,
      createdBy: 'manager1',
      createdAt: new Date('2023-09-10'),
      status: 'preview'
    },
    {
      id: '3',
      name: 'Redução de preços - Promoção Primavera',
      description: 'Redução temporária para promoção sazonal',
      filters: {
        serviceCategories: ['laundry'],
        garmentCategories: ['Roupas Superiores', 'Roupas Inferiores']
      },
      update: {
        adjustmentType: 'percentage',
        adjustmentValue: -10
      },
      createdBy: 'manager1',
      createdAt: new Date('2023-09-12'),
      status: 'draft'
    }
  ];
};

// Calculate price based on service, garment, quantity and rules
export const calculatePrice = (input: PriceCalculatorInput): PriceCalculatorResult => {
  const { 
    serviceTypeId, 
    garmentTypeId, 
    quantity, 
    isExpress, 
    priceMatrix, 
    pricingRules, 
    serviceTypes, 
    garmentTypes 
  } = input;
  
  // Find base price from price matrix
  const matrixEntry = priceMatrix.find(
    entry => entry.serviceTypeId === serviceTypeId && entry.garmentTypeId === garmentTypeId
  );
  
  if (!matrixEntry) {
    throw new Error('Price not found for the given service and garment combination');
  }
  
  const basePrice = matrixEntry.basePrice;
  let adjustedPrice = basePrice;
  const appliedRules: AppliedRule[] = [];
  
  // Find the service and garment objects
  const service = serviceTypes.find(s => s.id === serviceTypeId);
  const garment = garmentTypes.find(g => g.id === garmentTypeId);
  
  if (!service || !garment) {
    throw new Error('Service or garment not found');
  }
  
  // Apply pricing rules
  pricingRules
    .filter(rule => rule.isActive)
    .sort((a, b) => a.priority - b.priority)
    .forEach(rule => {
      let shouldApply = false;
      
      // Check if rule applies
      switch (rule.conditionType) {
        case 'quantity':
          shouldApply = quantity >= rule.condition.minQuantity;
          break;
        case 'customer_type':
          shouldApply = garment.materialType === rule.condition.customerType;
          break;
        case 'season':
          const currentDate = new Date();
          const seasonStart = new Date(rule.condition.seasonStart);
          const seasonEnd = new Date(rule.condition.seasonEnd);
          shouldApply = currentDate >= seasonStart && currentDate <= seasonEnd;
          break;
        case 'promotion':
          shouldApply = rule.condition.promotionCode === 'vip';
          break;
        default:
          shouldApply = false;
      }
      
      // Apply the rule if applicable
      if (shouldApply) {
        const adjustment = rule.effectType === 'discount_percentage' 
          ? (adjustedPrice * (rule.effectValue / 100))
          : rule.effectValue;
        
        adjustedPrice += adjustment;
        
        appliedRules.push({
          ruleId: rule.id,
          description: rule.description,
          impact: rule.effectValue
        });
      }
    });
  
  // Apply express service premium if applicable
  if (isExpress && service.hasExpressOption) {
    adjustedPrice *= 1.5; // 50% premium for express service
  }
  
  // Calculate subtotal (before volume discount)
  const subtotal = adjustedPrice * quantity;
  
  // Apply volume discount for 10+ items
  let volumeDiscount = 0;
  if (quantity >= 10) {
    volumeDiscount = subtotal * 0.1; // 10% discount for 10+ items
  }
  
  // Calculate total price
  const totalPrice = subtotal - volumeDiscount;
  
  return {
    basePrice,
    adjustedPrice,
    subtotal,
    volumeDiscount,
    totalPrice,
    appliedRules
  };
}; 