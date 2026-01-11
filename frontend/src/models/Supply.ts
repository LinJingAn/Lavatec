export interface SupplyItem {
  id: string;
  name: string;
  sku: string;
  category: SupplyCategory;
  description: string;
  unit: string;
  minStockLevel: number;
  maxStockLevel: number;
  currentStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  vendor: Vendor;
  lastRestockDate: string;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  preferredVendor: boolean;
  leadTime: number; // in days
  minimumOrderValue: number;
  paymentTerms: string;
  rating: number;
  activeStatus: boolean;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  expectedDeliveryDate: string;
  notes: string;
}

export interface PurchaseOrderItem {
  supplyId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface SupplyUsageRecord {
  id: string;
  supplyId: string;
  quantity: number;
  usedBy: string;
  usedAt: string;
  workOrderId?: string;
  notes?: string;
}

export type SupplyCategory = 
  | 'cleaning_chemicals'
  | 'detergents'
  | 'fabric_care'
  | 'equipment_supplies'
  | 'packaging'
  | 'safety_supplies'
  | 'maintenance_supplies'
  | 'office_supplies';

export interface StockAlert {
  id: string;
  supplyId: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon';
  message: string;
  createdAt: string;
  status: 'active' | 'resolved';
  priority: 'low' | 'medium' | 'high';
} 