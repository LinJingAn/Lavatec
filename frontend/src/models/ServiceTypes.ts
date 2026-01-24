// Service type category options
export type ServiceCategory = 'laundry' | 'drycleaning' | 'ironing' | 'special' | 'household';

// Service type definition
export interface ServiceType {
  id: string;
  name: string;
  description: string;
  categoryId: ServiceCategory;
  basePrice: number;
  processingTimeHours: number;
  isAvailable: boolean;
  hasExpressOption: boolean;
  expressMultiplier?: number;
  needsSpecialHandling: boolean;
  specialInstructions?: string;
  applicableGarmentTypes: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Price variant definition
export interface PriceVariant {
  id: string;
  serviceTypeId: string;
  name: string;
  description?: string;
  multiplier: number;
  isDefault: boolean;
}

// Helper function to get category name
export const getCategoryName = (categoryId: ServiceCategory): string => {
  const categories = {
    laundry: 'Lavanderia',
    drycleaning: 'Lavagem a Seco',
    ironing: 'Passadoria',
    special: 'Tratamentos Especiais',
    household: 'Itens Domésticos'
  };
  
  return categories[categoryId] || 'Categoria Desconhecida';
};

/**
 * @deprecated Use ServiceService.getServices() instead.
 * This mock data is kept only for fallback purposes when API is unavailable.
 */
export const generateMockServiceTypes = (): ServiceType[] => {
  return [
    {
      id: '1',
      name: 'Lavagem Simples',
      description: 'Lavagem padrão para itens de uso diário. Inclui detergente suave e ciclo normal.',
      categoryId: 'laundry',
      basePrice: 25.90,
      processingTimeHours: 24,
      isAvailable: true,
      hasExpressOption: true,
      expressMultiplier: 1.5,
      needsSpecialHandling: false,
      applicableGarmentTypes: ['Camisetas', 'Calças', 'Shorts', 'Meias', 'Roupas Íntimas'],
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-06-22')
    },
    {
      id: '2',
      name: 'Lavagem a Seco Premium',
      description: 'Lavagem a seco para roupas finas e delicadas que não podem ser lavadas em água.',
      categoryId: 'drycleaning',
      basePrice: 45.90,
      processingTimeHours: 48,
      isAvailable: true,
      hasExpressOption: true,
      expressMultiplier: 1.8,
      needsSpecialHandling: true,
      specialInstructions: 'Verificar etiquetas e separar por tipo de tecido antes do processo.',
      applicableGarmentTypes: ['Ternos', 'Vestidos de Festa', 'Seda', 'Lã', 'Casacos'],
      createdAt: new Date('2023-02-10'),
      updatedAt: new Date('2023-07-05')
    },
    {
      id: '3',
      name: 'Passadoria Profissional',
      description: 'Passadoria de alta qualidade para todas as peças, realizada por profissionais experientes.',
      categoryId: 'ironing',
      basePrice: 18.90,
      processingTimeHours: 12,
      isAvailable: true,
      hasExpressOption: true,
      expressMultiplier: 1.3,
      needsSpecialHandling: false,
      applicableGarmentTypes: ['Camisas Sociais', 'Calças Sociais', 'Vestidos', 'Saias', 'Lençóis'],
      createdAt: new Date('2023-01-05'),
      updatedAt: new Date('2023-08-15')
    },
    {
      id: '4',
      name: 'Remoção de Manchas',
      description: 'Tratamento especializado para remoção de manchas difíceis como vinho, café, tinta e graxa.',
      categoryId: 'special',
      basePrice: 35.90,
      processingTimeHours: 72,
      isAvailable: true,
      hasExpressOption: false,
      needsSpecialHandling: true,
      specialInstructions: 'Cliente deve informar a origem da mancha para melhor tratamento.',
      applicableGarmentTypes: ['Todos os tipos de peças'],
      createdAt: new Date('2023-03-18'),
      updatedAt: new Date('2023-06-30')
    },
    {
      id: '5',
      name: 'Lavagem de Edredons',
      description: 'Lavagem especializada para edredons e cobertores grandes, inclui secagem completa.',
      categoryId: 'household',
      basePrice: 65.90,
      processingTimeHours: 48,
      isAvailable: true,
      hasExpressOption: false,
      needsSpecialHandling: true,
      applicableGarmentTypes: ['Edredons', 'Cobertores', 'Mantas'],
      createdAt: new Date('2023-02-25'),
      updatedAt: new Date('2023-07-12')
    },
    {
      id: '6',
      name: 'Impermeabilização',
      description: 'Aplicação de tratamento impermeabilizante para tecidos, protegendo contra água e manchas.',
      categoryId: 'special',
      basePrice: 55.90,
      processingTimeHours: 48,
      isAvailable: false,
      hasExpressOption: false,
      needsSpecialHandling: true,
      specialInstructions: 'Serviço temporariamente indisponível devido à falta de materiais.',
      applicableGarmentTypes: ['Jaquetas', 'Casacos', 'Calçados', 'Mochilas', 'Bolsas'],
      createdAt: new Date('2023-04-10'),
      updatedAt: new Date('2023-09-01')
    },
    {
      id: '7',
      name: 'Lavagem de Cortinas',
      description: 'Serviço especializado para limpeza de cortinas de todos os tamanhos, com cuidados especiais.',
      categoryId: 'household',
      basePrice: 40.90,
      processingTimeHours: 72,
      isAvailable: true,
      hasExpressOption: false,
      needsSpecialHandling: true,
      specialInstructions: 'Remover ganchos e acessórios antes da entrega.',
      applicableGarmentTypes: ['Cortinas Leves', 'Cortinas Pesadas', 'Persianas de Tecido'],
      createdAt: new Date('2023-03-05'),
      updatedAt: new Date('2023-08-20')
    },
  ];
};

export const generateMockPriceVariants = (serviceTypeId: string = 'default-service-id', count: number = 3): PriceVariant[] => {
  return [
    {
      id: '1',
      serviceTypeId: '1',
      name: 'Padrão',
      description: 'Lavagem normal sem adicionais',
      multiplier: 1.0,
      isDefault: true
    },
    {
      id: '2',
      serviceTypeId: '1',
      name: 'Perfumado Premium',
      description: 'Com perfume de longa duração',
      multiplier: 1.15,
      isDefault: false
    },
    {
      id: '3',
      serviceTypeId: '1',
      name: 'Hipoalergênico',
      description: 'Para peles sensíveis, sem perfumes',
      multiplier: 1.2,
      isDefault: false
    },
    {
      id: '4',
      serviceTypeId: '2',
      name: 'Padrão',
      description: 'Processo de lavagem a seco normal',
      multiplier: 1.0,
      isDefault: true
    },
    {
      id: '5',
      serviceTypeId: '2',
      name: 'Deluxe',
      description: 'Com tratamento de proteção de tecidos',
      multiplier: 1.3,
      isDefault: false
    },
    {
      id: '6',
      serviceTypeId: '3',
      name: 'Básico',
      description: 'Passadoria simples',
      multiplier: 1.0,
      isDefault: true
    },
    {
      id: '7',
      serviceTypeId: '3',
      name: 'Premium',
      description: 'Passadoria com goma',
      multiplier: 1.25,
      isDefault: false
    },
    {
      id: '8',
      serviceTypeId: '5',
      name: 'Padrão',
      description: 'Lavagem normal para edredons',
      multiplier: 1.0,
      isDefault: true
    },
    {
      id: '9',
      serviceTypeId: '5',
      name: 'Anti-ácaros',
      description: 'Tratamento anti-ácaros e anti-alérgico',
      multiplier: 1.4,
      isDefault: false
    }
  ];
};

// Create and export mock data for direct import
export const mockServiceTypes: ServiceType[] = generateMockServiceTypes();
export const mockPriceVariants: PriceVariant[] = generateMockPriceVariants(); 