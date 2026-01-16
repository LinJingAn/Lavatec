// TypeScript interfaces and types exports will go here 
 
// Export types
export * from './database.types';

// Product type for the ProductsPage
export interface Product {
  id: string;
  name: string;
  price: string;
  unit: string;
  image?: string;
  category?: string;
  inventory?: number;
}

// Inventory adjustment types
export interface InventoryAdjustment {
  productId: string;
  type: 'Stock received' | 'Stock count' | 'Waste';
  quantity: number;
  note?: string;
  reference?: string;
  unitCost?: number;
  supplier?: string;
  adjustedBy?: string;
  adjustedAt: string;
} 