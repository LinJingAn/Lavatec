import { WashingPreferences, DEFAULT_WASHING_PREFERENCES } from './CustomerPreferences';
import { CustomerSpendingAnalytics, generateMockOrders, generateSpendingAnalytics, Order } from './CustomerAnalytics';
import { CommunicationLog, CommunicationStats, generateMockCommunicationLogs, generateMockCommunicationStats } from './CustomerCommunication';
import { CustomerNote, generateMockNotes } from './CustomerNotes';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  addresses?: Address[];
  category: 'regular' | 'heavy' | 'occasional' | 'rare';
  lastVisit?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  taxId?: string;
  referredBy?: number; // ID of the customer who referred this customer
  referredByName?: string;
  loyaltyPoints?: number;
  profileImageUrl?: string;
}

// Extended customer with all related information
export interface CustomerDetailed extends Customer {
  washingPreferences: WashingPreferences;
  notes: CustomerNote[];
  communicationLogs: CommunicationLog[];
  communicationStats: CommunicationStats;
  orders: Order[];
  analytics: CustomerSpendingAnalytics;
}

// Mock data for a detailed customer
export const MOCK_CUSTOMER: Customer = {
  id: 2,
  name: 'Carlos Oliveira',
  email: 'carlos.oliveira@email.com',
  phone: '(11) 91234-5678',
  address: 'Avenida Paulista, 1000',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01310-100',
  category: 'heavy',
  lastVisit: '2023-10-05',
  totalOrders: 24,
  totalSpent: 3450.75,
  createdAt: '2022-03-15',
  updatedAt: '2023-10-05',
  isActive: true,
  gender: 'male',
  loyaltyPoints: 240
};

// Generate a detailed customer with all related information
export const generateDetailedCustomer = (baseCustomer: Customer): CustomerDetailed => {
  const orders = generateMockOrders(baseCustomer.id, 12);
  const analytics = generateSpendingAnalytics(orders);
  const communicationLogs = generateMockCommunicationLogs(baseCustomer.id, 8);
  const communicationStats = generateMockCommunicationStats(communicationLogs);
  const notes = generateMockNotes(baseCustomer.id, 4);
  
  // Create custom washing preferences
  const washingPreferences: WashingPreferences = {
    ...DEFAULT_WASHING_PREFERENCES,
    id: 1,
    customerId: baseCustomer.id,
    preferredFabrics: [
      { id: 1, name: 'Algodão', washingInstructions: 'Lavagem normal, temperatura média', isDelicate: false },
      { id: 3, name: 'Seda', washingInstructions: 'Lavagem a mão ou delicada, água fria', isDelicate: true }
    ],
    avoidedFabrics: [
      { id: 8, name: 'Viscose', washingInstructions: 'Lavagem delicada, temperatura baixa', isDelicate: true }
    ],
    preferredDetergents: [
      { id: 3, name: 'Hipoalergênico', isHypoallergenic: true, isEcoFriendly: false },
      { id: 4, name: 'Eco-friendly', isHypoallergenic: false, isEcoFriendly: true }
    ],
    temperaturePreference: 'cold',
    usesSoftener: true,
    usesStarchOnShirts: false,
    additionalInstructions: 'Cliente prefere que suas roupas sejam lavadas separadamente.',
    lastUpdated: new Date().toISOString()
  };
  
  return {
    ...baseCustomer,
    washingPreferences,
    notes,
    communicationLogs,
    communicationStats,
    orders,
    analytics
  };
};

// Generate a list of basic mock customers
export const generateMockCustomers = (count = 10): Customer[] => {
  const names = [
    'Ana Silva', 'Bruno Ferreira', 'Carolina Santos', 'Daniel Lima', 
    'Eduarda Costa', 'Fernando Oliveira', 'Gabriela Sousa', 'Henrique Alves',
    'Isabel Ribeiro', 'João Gomes', 'Kelly Mendes', 'Lucas Pereira',
    'Marina Fernandes', 'Nelson Castro', 'Olívia Martins', 'Paulo Rocha'
  ];
  
  const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Porto Alegre', 'Salvador'];
  const states = ['SP', 'RJ', 'MG', 'DF', 'RS', 'BA'];
  const categories: Array<Customer['category']> = ['regular', 'heavy', 'occasional', 'rare'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const name = names[Math.floor(Math.random() * names.length)];
    const firstName = name.split(' ')[0].toLowerCase();
    const lastName = name.split(' ')[1].toLowerCase();
    const email = `${firstName}.${lastName}@email.com`;
    
    const cityIndex = Math.floor(Math.random() * cities.length);
    const city = cities[cityIndex];
    const state = states[cityIndex];
    
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 365 * 2)); // Up to 2 years ago
    
    const updatedAt = new Date();
    updatedAt.setDate(updatedAt.getDate() - Math.floor(Math.random() * 90)); // Up to 3 months ago
    
    const lastVisit = Math.random() > 0.2 ? new Date(updatedAt) : undefined;
    if (lastVisit) {
      lastVisit.setDate(lastVisit.getDate() - Math.floor(Math.random() * 30)); // Up to 1 month before last update
    }
    
    const totalOrders = Math.floor(Math.random() * 30) + 1;
    const totalSpent = Math.floor(Math.random() * 5000) + 100;
    
    return {
      id,
      name,
      email,
      phone: `(${Math.floor(Math.random() * 90) + 10}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: `Rua ${Math.floor(Math.random() * 100) + 1}, ${Math.floor(Math.random() * 1000) + 1}`,
      city,
      state,
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      lastVisit: lastVisit?.toISOString(),
      totalOrders,
      totalSpent,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      isActive: Math.random() > 0.1, // 90% active
      loyaltyPoints: Math.floor(totalOrders * 10)
    };
  });
}; 