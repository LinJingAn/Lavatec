// Garment Category/Type Management System

// Category hierarchy types
export type GarmentCategoryId = 
  | 'tops' 
  | 'bottoms' 
  | 'dresses' 
  | 'suits' 
  | 'outerwear'
  | 'intimate' 
  | 'accessories' 
  | 'household' 
  | 'special';

// Material types
export type MaterialType = 
  | 'cotton' 
  | 'polyester' 
  | 'wool' 
  | 'silk' 
  | 'linen' 
  | 'denim'
  | 'leather' 
  | 'synthetic' 
  | 'blend' 
  | 'other';

// Care level for handling items
export type CareLevel = 'standard' | 'delicate' | 'veryDelicate' | 'specialCare';

// Interface for garment categories (top level of hierarchy)
export interface GarmentCategory {
  id: GarmentCategoryId;
  name: string;
  description: string;
  defaultCareLevel: CareLevel;
  isActive: boolean;
  sortOrder: number;
  defaultPriceMultiplier: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for garment types (items within categories)
export interface GarmentType {
  id: string;
  name: string;
  description: string;
  categoryId: GarmentCategoryId;
  isActive: boolean;
  defaultMaterials: MaterialType[];
  defaultCareInstructions: string;
  careLevel: CareLevel;
  imageUrl?: string;
  defaultPrice?: number; // Base price if not determined by matrix
  priceMultiplier: number; // Multiplier applied to base service price
  hasSpecialHandling: boolean;
  specialHandlingInstructions?: string;
  estimatedProcessingTimeMinutes: number;
  commonBrands?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for fabric types
export interface FabricType {
  id: string;
  name: string;
  description: string;
  materialType: MaterialType;
  careInstructions: string;
  isDelicate: boolean;
  isColorSafe: boolean;
  dryCleanOnly: boolean;
  recommendedWashTemp?: string;
  recommendedDetergents?: string[];
  avoidChemicals?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for brand profiles
export interface BrandProfile {
  id: string;
  name: string;
  description?: string;
  commonFabrics: MaterialType[];
  qualityTier: 'budget' | 'standard' | 'premium' | 'luxury';
  specialCareInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to get category name
export const getCategoryName = (categoryId: GarmentCategoryId): string => {
  const categories = {
    tops: 'Peças Superiores',
    bottoms: 'Peças Inferiores',
    dresses: 'Vestidos',
    suits: 'Ternos e Conjuntos',
    outerwear: 'Peças Externas',
    intimate: 'Roupas Íntimas',
    accessories: 'Acessórios',
    household: 'Itens Domésticos',
    special: 'Itens Especiais'
  };
  
  return categories[categoryId] || 'Categoria Desconhecida';
};

// Helper function to get care level description
export const getCareLevelDescription = (careLevel: CareLevel): string => {
  const levels = {
    standard: 'Cuidado Padrão',
    delicate: 'Cuidado Delicado',
    veryDelicate: 'Cuidado Muito Delicado',
    specialCare: 'Cuidado Especial'
  };
  
  return levels[careLevel] || 'Nível de Cuidado Desconhecido';
};

// Helper function to get material type name
export const getMaterialTypeName = (materialType: MaterialType): string => {
  const materials = {
    cotton: 'Algodão',
    polyester: 'Poliéster',
    wool: 'Lã',
    silk: 'Seda',
    linen: 'Linho',
    denim: 'Jeans',
    leather: 'Couro',
    synthetic: 'Sintético',
    blend: 'Mistura',
    other: 'Outros Materiais'
  };
  
  return materials[materialType] || 'Material Desconhecido';
};

// Mock data for garment categories
export const mockGarmentCategories: GarmentCategory[] = [
  {
    id: 'tops',
    name: 'Peças Superiores',
    description: 'Camisas, camisetas, blusas e outras peças para o tronco superior.',
    defaultCareLevel: 'standard',
    isActive: true,
    sortOrder: 1,
    defaultPriceMultiplier: 1.0,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'bottoms',
    name: 'Peças Inferiores',
    description: 'Calças, shorts, saias e outras peças para a parte inferior do corpo.',
    defaultCareLevel: 'standard',
    isActive: true,
    sortOrder: 2,
    defaultPriceMultiplier: 1.2,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'dresses',
    name: 'Vestidos',
    description: 'Vestidos de todos os tipos e tamanhos.',
    defaultCareLevel: 'delicate',
    isActive: true,
    sortOrder: 3,
    defaultPriceMultiplier: 1.5,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'suits',
    name: 'Ternos e Conjuntos',
    description: 'Ternos completos, blazers, conjuntos formais.',
    defaultCareLevel: 'veryDelicate',
    isActive: true,
    sortOrder: 4,
    defaultPriceMultiplier: 2.0,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'outerwear',
    name: 'Peças Externas',
    description: 'Jaquetas, casacos, moletons e outras peças para exterior.',
    defaultCareLevel: 'delicate',
    isActive: true,
    sortOrder: 5,
    defaultPriceMultiplier: 1.8,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'intimate',
    name: 'Roupas Íntimas',
    description: 'Roupas íntimas, meias, pijamas.',
    defaultCareLevel: 'delicate',
    isActive: true,
    sortOrder: 6,
    defaultPriceMultiplier: 0.8,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'accessories',
    name: 'Acessórios',
    description: 'Gravatas, lenços, luvas e outros acessórios de vestuário.',
    defaultCareLevel: 'delicate',
    isActive: true,
    sortOrder: 7,
    defaultPriceMultiplier: 0.7,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'household',
    name: 'Itens Domésticos',
    description: 'Lençóis, toalhas, edredons, cobertores e outros itens para casa.',
    defaultCareLevel: 'standard',
    isActive: true,
    sortOrder: 8,
    defaultPriceMultiplier: 2.2,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'special',
    name: 'Itens Especiais',
    description: 'Itens que requerem cuidados especiais ou serviços personalizados.',
    defaultCareLevel: 'specialCare',
    isActive: true,
    sortOrder: 9,
    defaultPriceMultiplier: 3.0,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  }
];

// Mock data for garment types
export const mockGarmentTypes: GarmentType[] = [
  {
    id: 'gt-001',
    name: 'Camisa Social',
    description: 'Camisas de botão para uso formal ou social.',
    categoryId: 'tops',
    isActive: true,
    defaultMaterials: ['cotton', 'polyester', 'blend'],
    defaultCareInstructions: 'Lavar em água fria, passar a ferro em temperatura média.',
    careLevel: 'standard',
    imageUrl: '/images/garments/social-shirt.jpg',
    priceMultiplier: 1.2,
    hasSpecialHandling: false,
    estimatedProcessingTimeMinutes: 15,
    commonBrands: ['Dudalina', 'Aramis', 'VR'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'gt-002',
    name: 'Camiseta Básica',
    description: 'Camisetas simples sem estampas ou com estampas básicas.',
    categoryId: 'tops',
    isActive: true,
    defaultMaterials: ['cotton'],
    defaultCareInstructions: 'Lavar em máquina com cores semelhantes, secar naturalmente.',
    careLevel: 'standard',
    imageUrl: '/images/garments/basic-tshirt.jpg',
    priceMultiplier: 0.8,
    hasSpecialHandling: false,
    estimatedProcessingTimeMinutes: 10,
    commonBrands: ['Hering', 'Reserva', 'Osklen'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'gt-003',
    name: 'Calça Jeans',
    description: 'Calças jeans de diversos modelos e lavagens.',
    categoryId: 'bottoms',
    isActive: true,
    defaultMaterials: ['denim'],
    defaultCareInstructions: 'Lavar pelo avesso para preservar a cor, secar naturalmente.',
    careLevel: 'standard',
    imageUrl: '/images/garments/jeans.jpg',
    priceMultiplier: 1.3,
    hasSpecialHandling: false,
    estimatedProcessingTimeMinutes: 15,
    commonBrands: ['Levis', 'Calvin Klein', 'Diesel'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'gt-004',
    name: 'Calça Social',
    description: 'Calças sociais para uso formal ou corporativo.',
    categoryId: 'bottoms',
    isActive: true,
    defaultMaterials: ['polyester', 'wool', 'blend'],
    defaultCareInstructions: 'Lavagem a seco recomendada. Se lavar em máquina, usar água fria e ciclo delicado.',
    careLevel: 'delicate',
    imageUrl: '/images/garments/dress-pants.jpg',
    priceMultiplier: 1.5,
    hasSpecialHandling: true,
    specialHandlingInstructions: 'Verificar etiqueta para instruções específicas de cuidado.',
    estimatedProcessingTimeMinutes: 20,
    commonBrands: ['Ricardo Almeida', 'Brooksfield', 'Aramis'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'gt-005',
    name: 'Vestido de Festa',
    description: 'Vestidos para ocasiões especiais e eventos formais.',
    categoryId: 'dresses',
    isActive: true,
    defaultMaterials: ['silk', 'polyester', 'blend'],
    defaultCareInstructions: 'Lavagem a seco somente. Guardar em cabides acolchoados.',
    careLevel: 'veryDelicate',
    imageUrl: '/images/garments/party-dress.jpg',
    priceMultiplier: 2.5,
    hasSpecialHandling: true,
    specialHandlingInstructions: 'Verificar elementos decorativos e bordados antes da lavagem.',
    estimatedProcessingTimeMinutes: 30,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'gt-006',
    name: 'Vestido Casual',
    description: 'Vestidos para uso diário e ocasiões informais.',
    categoryId: 'dresses',
    isActive: true,
    defaultMaterials: ['cotton', 'linen', 'blend'],
    defaultCareInstructions: 'Lavar em máquina com ciclo delicado, secar naturalmente.',
    careLevel: 'delicate',
    imageUrl: '/images/garments/casual-dress.jpg',
    priceMultiplier: 1.2,
    hasSpecialHandling: false,
    estimatedProcessingTimeMinutes: 15,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'gt-007',
    name: 'Terno Completo',
    description: 'Conjunto de blazer e calça social coordenados.',
    categoryId: 'suits',
    isActive: true,
    defaultMaterials: ['wool', 'polyester', 'blend'],
    defaultCareInstructions: 'Lavagem a seco somente. Guardar em cabides largos para manter a forma.',
    careLevel: 'veryDelicate',
    imageUrl: '/images/garments/full-suit.jpg',
    priceMultiplier: 3.0,
    hasSpecialHandling: true,
    specialHandlingInstructions: 'Processar peças como conjunto para manter aparência uniforme.',
    estimatedProcessingTimeMinutes: 45,
    commonBrands: ['Ricardo Almeida', 'Hugo Boss', 'Armani'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'gt-008',
    name: 'Jaqueta',
    description: 'Jaquetas diversas para clima frio.',
    categoryId: 'outerwear',
    isActive: true,
    defaultMaterials: ['leather', 'synthetic', 'cotton'],
    defaultCareInstructions: 'Seguir etiqueta específica conforme o material.',
    careLevel: 'delicate',
    imageUrl: '/images/garments/jacket.jpg',
    priceMultiplier: 2.0,
    hasSpecialHandling: true,
    specialHandlingInstructions: 'Verificar bolsos antes da lavagem, verificar zíperes e botões.',
    estimatedProcessingTimeMinutes: 25,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'gt-009',
    name: 'Edredom',
    description: 'Edredons para cama de diversos tamanhos.',
    categoryId: 'household',
    isActive: true,
    defaultMaterials: ['cotton', 'polyester'],
    defaultCareInstructions: 'Lavar em máquina de capacidade industrial ou lavagem especializada.',
    careLevel: 'standard',
    imageUrl: '/images/garments/comforter.jpg',
    priceMultiplier: 3.5,
    hasSpecialHandling: true,
    specialHandlingInstructions: 'Verificar manchas e necessidade de pré-tratamento.',
    estimatedProcessingTimeMinutes: 60,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'gt-010',
    name: 'Roupa de Cama (jogo)',
    description: 'Conjunto de lençol, fronha e sobre-lençol.',
    categoryId: 'household',
    isActive: true,
    defaultMaterials: ['cotton', 'linen', 'blend'],
    defaultCareInstructions: 'Lavar em água morna, pode usar alvejante para peças brancas.',
    careLevel: 'standard',
    imageUrl: '/images/garments/bedsheets.jpg',
    priceMultiplier: 2.0,
    hasSpecialHandling: false,
    estimatedProcessingTimeMinutes: 30,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  }
];

// Mock data for fabric types
export const mockFabricTypes: FabricType[] = [
  {
    id: 'fabric-001',
    name: 'Algodão',
    description: 'Tecido natural respirável e confortável.',
    materialType: 'cotton',
    careInstructions: 'Lavar em água fria ou morna, secar em temperatura baixa ou natural.',
    isDelicate: false,
    isColorSafe: true,
    dryCleanOnly: false,
    recommendedWashTemp: '30°C',
    recommendedDetergents: ['Detergente suave', 'Sabão neutro'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'fabric-002',
    name: 'Lã',
    description: 'Tecido natural quente e isolante.',
    materialType: 'wool',
    careInstructions: 'Lavagem a seco recomendada. Se lavar à mão, usar água fria e detergente para delicados.',
    isDelicate: true,
    isColorSafe: false,
    dryCleanOnly: true,
    recommendedWashTemp: 'Fria',
    recommendedDetergents: ['Detergente para lã', 'Produtos específicos para delicados'],
    avoidChemicals: ['Alvejante', 'Amônia'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'fabric-003',
    name: 'Seda',
    description: 'Tecido natural luxuoso e extremamente delicado.',
    materialType: 'silk',
    careInstructions: 'Preferencialmente lavagem a seco. Se lavar à mão, água fria e detergente específico para seda.',
    isDelicate: true,
    isColorSafe: false,
    dryCleanOnly: true,
    recommendedWashTemp: 'Fria',
    recommendedDetergents: ['Detergente para seda', 'Produtos específicos para delicados'],
    avoidChemicals: ['Alvejante', 'Produtos com enzimas'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'fabric-004',
    name: 'Poliéster',
    description: 'Tecido sintético durável e de secagem rápida.',
    materialType: 'polyester',
    careInstructions: 'Lavar em máquina com água fria ou morna, secar em temperatura baixa.',
    isDelicate: false,
    isColorSafe: true,
    dryCleanOnly: false,
    recommendedWashTemp: '40°C',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'fabric-005',
    name: 'Jeans/Denim',
    description: 'Tecido resistente de algodão com trama característica.',
    materialType: 'denim',
    careInstructions: 'Lavar pelo avesso em água fria para preservar a cor, secar naturalmente.',
    isDelicate: false,
    isColorSafe: false,
    dryCleanOnly: false,
    recommendedWashTemp: 'Fria',
    avoidChemicals: ['Alvejante'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  }
];

// Mock data for brand profiles
export const mockBrandProfiles: BrandProfile[] = [
  {
    id: 'brand-001',
    name: 'Reserva',
    description: 'Marca brasileira de roupas casuais masculinas.',
    commonFabrics: ['cotton', 'linen'],
    qualityTier: 'premium',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'brand-002',
    name: 'Hering',
    description: 'Marca brasileira de roupas básicas e casuais.',
    commonFabrics: ['cotton', 'blend'],
    qualityTier: 'standard',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'brand-003',
    name: 'Dudalina',
    description: 'Marca brasileira especializada em camisas sociais.',
    commonFabrics: ['cotton', 'blend'],
    qualityTier: 'premium',
    specialCareInstructions: 'Cuidado especial com botões e colarinhos.',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'brand-004',
    name: 'Hugo Boss',
    description: 'Marca internacional de luxo para roupas formais e casuais.',
    commonFabrics: ['wool', 'cotton', 'blend'],
    qualityTier: 'luxury',
    specialCareInstructions: 'Preferência por lavagem a seco para preservar cortes e acabamentos.',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'brand-005',
    name: 'Levis',
    description: 'Marca icônica de jeans e roupas casuais.',
    commonFabrics: ['denim', 'cotton'],
    qualityTier: 'premium',
    specialCareInstructions: 'Lavar jeans pelo avesso para preservar cor e acabamento.',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  }
]; 