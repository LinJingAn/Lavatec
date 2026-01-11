export interface FabricPreference {
  id: number;
  name: string;
  washingInstructions: string;
  isDelicate: boolean;
}

export interface DetergentPreference {
  id: number;
  name: string;
  isHypoallergenic: boolean;
  isEcoFriendly: boolean;
}

export type TemperaturePreference = 'cold' | 'warm' | 'hot';

export interface WashingPreferences {
  id: number;
  customerId: number;
  preferredFabrics: FabricPreference[];
  avoidedFabrics: FabricPreference[];
  preferredDetergents: DetergentPreference[];
  avoidedDetergents: DetergentPreference[];
  temperaturePreference: TemperaturePreference;
  usesSoftener: boolean;
  usesStarchOnShirts: boolean;
  additionalInstructions: string;
  lastUpdated: string; // ISO date string
}

// Predefined fabric types
export const FABRIC_TYPES: FabricPreference[] = [
  { id: 1, name: 'Algodão', washingInstructions: 'Lavagem normal, temperatura média', isDelicate: false },
  { id: 2, name: 'Linho', washingInstructions: 'Lavagem delicada, temperatura média', isDelicate: true },
  { id: 3, name: 'Seda', washingInstructions: 'Lavagem a mão ou delicada, água fria', isDelicate: true },
  { id: 4, name: 'Lã', washingInstructions: 'Lavagem a mão ou delicada, água fria', isDelicate: true },
  { id: 5, name: 'Sintéticos', washingInstructions: 'Lavagem normal, temperatura baixa', isDelicate: false },
  { id: 6, name: 'Jeans', washingInstructions: 'Lavagem normal, temperatura média', isDelicate: false },
  { id: 7, name: 'Poliéster', washingInstructions: 'Lavagem normal, temperatura baixa', isDelicate: false },
  { id: 8, name: 'Viscose', washingInstructions: 'Lavagem delicada, temperatura baixa', isDelicate: true }
];

// Predefined detergent types
export const DETERGENT_TYPES: DetergentPreference[] = [
  { id: 1, name: 'Regular', isHypoallergenic: false, isEcoFriendly: false },
  { id: 2, name: 'Para Roupas Delicadas', isHypoallergenic: true, isEcoFriendly: false },
  { id: 3, name: 'Hipoalergênico', isHypoallergenic: true, isEcoFriendly: false },
  { id: 4, name: 'Eco-friendly', isHypoallergenic: false, isEcoFriendly: true },
  { id: 5, name: 'Para Cores', isHypoallergenic: false, isEcoFriendly: false },
  { id: 6, name: 'Para Roupas Brancas', isHypoallergenic: false, isEcoFriendly: false },
  { id: 7, name: 'Sem Fragrância', isHypoallergenic: true, isEcoFriendly: false }
];

// Default empty preferences
export const DEFAULT_WASHING_PREFERENCES: WashingPreferences = {
  id: 0,
  customerId: 0,
  preferredFabrics: [],
  avoidedFabrics: [],
  preferredDetergents: [],
  avoidedDetergents: [],
  temperaturePreference: 'warm',
  usesSoftener: true,
  usesStarchOnShirts: false,
  additionalInstructions: '',
  lastUpdated: new Date().toISOString()
}; 