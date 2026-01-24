import { api } from '../utils/api';

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  sku?: string;
  unit: string; // kg, L, un, etc.
  quantity: number;
  min_quantity: number; // Minimum stock level
  max_quantity?: number;
  unit_cost: number;
  total_value?: number;
  supplier_id?: string;
  supplier_name?: string;
  location?: string;
  branch_id?: string;
  last_restock?: string;
  expiry_date?: string;
  status: 'available' | 'low_stock' | 'out_of_stock' | 'expired';
  created_at: string;
  updated_at?: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  item_count?: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  payment_terms?: string;
  lead_time_days?: number;
  rating?: number;
  is_active?: boolean;
  created_at: string;
}

export interface StockMovement {
  id: string;
  item_id: string;
  item_name?: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reason?: string;
  reference_id?: string; // order_id or purchase_id
  reference_type?: 'order' | 'purchase' | 'return' | 'manual';
  from_branch_id?: string;
  to_branch_id?: string;
  user_id?: string;
  user_name?: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  supplier_name?: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'partial' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  expected_date?: string;
  received_date?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface PurchaseOrderItem {
  id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  received_quantity?: number;
  unit_cost: number;
  total: number;
}

class InventoryServiceClass {
  private static instance: InventoryServiceClass;

  private constructor() {}

  static getInstance(): InventoryServiceClass {
    if (!InventoryServiceClass.instance) {
      InventoryServiceClass.instance = new InventoryServiceClass();
    }
    return InventoryServiceClass.instance;
  }

  // Inventory Items
  async getItems(filters: { 
    category?: string; 
    status?: string; 
    branch_id?: string;
    search?: string;
  } = {}): Promise<{ items: InventoryItem[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.branch_id) params.append('branch_id', filters.branch_id);
      if (filters.search) params.append('search', filters.search);

      const queryString = params.toString();
      const url = queryString ? `/inventory/items?${queryString}` : '/inventory/items';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  }

  async getItemById(id: string): Promise<InventoryItem> {
    try {
      const response = await api.get(`/inventory/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  }

  async createItem(item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<{ item: InventoryItem }> {
    try {
      const response = await api.post('/inventory/items', item);
      return response.data;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  }

  async updateItem(id: string, updates: Partial<InventoryItem>): Promise<{ item: InventoryItem }> {
    try {
      const response = await api.put(`/inventory/items/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      await api.delete(`/inventory/items/${id}`);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  // Stock Movements
  async getStockMovements(itemId?: string): Promise<{ movements: StockMovement[] }> {
    try {
      const url = itemId ? `/inventory/movements?item_id=${itemId}` : '/inventory/movements';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      throw error;
    }
  }

  async recordStockMovement(movement: Omit<StockMovement, 'id' | 'created_at' | 'previous_quantity' | 'new_quantity'>): Promise<{ movement: StockMovement }> {
    try {
      const response = await api.post('/inventory/movements', movement);
      return response.data;
    } catch (error) {
      console.error('Error recording stock movement:', error);
      throw error;
    }
  }

  async adjustStock(itemId: string, quantity: number, reason: string): Promise<{ item: InventoryItem }> {
    try {
      const response = await api.post(`/inventory/items/${itemId}/adjust`, { quantity, reason });
      return response.data;
    } catch (error) {
      console.error('Error adjusting stock:', error);
      throw error;
    }
  }

  async transferStock(itemId: string, quantity: number, fromBranchId: string, toBranchId: string): Promise<void> {
    try {
      await api.post(`/inventory/items/${itemId}/transfer`, { 
        quantity, 
        from_branch_id: fromBranchId, 
        to_branch_id: toBranchId 
      });
    } catch (error) {
      console.error('Error transferring stock:', error);
      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<{ categories: InventoryCategory[] }> {
    try {
      const response = await api.get('/inventory/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async createCategory(category: Omit<InventoryCategory, 'id' | 'item_count'>): Promise<{ category: InventoryCategory }> {
    try {
      const response = await api.post('/inventory/categories', category);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Suppliers
  async getSuppliers(): Promise<{ suppliers: Supplier[] }> {
    try {
      const response = await api.get('/inventory/suppliers');
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  }

  async getSupplierById(id: string): Promise<Supplier> {
    try {
      const response = await api.get(`/inventory/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching supplier:', error);
      throw error;
    }
  }

  async createSupplier(supplier: Omit<Supplier, 'id' | 'created_at'>): Promise<{ supplier: Supplier }> {
    try {
      const response = await api.post('/inventory/suppliers', supplier);
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<{ supplier: Supplier }> {
    try {
      const response = await api.put(`/inventory/suppliers/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  }

  // Purchase Orders
  async getPurchaseOrders(filters: { status?: string; supplier_id?: string } = {}): Promise<{ orders: PurchaseOrder[] }> {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.supplier_id) params.append('supplier_id', filters.supplier_id);

      const queryString = params.toString();
      const url = queryString ? `/inventory/purchase-orders?${queryString}` : '/inventory/purchase-orders';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw error;
    }
  }

  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>): Promise<{ order: PurchaseOrder }> {
    try {
      const response = await api.post('/inventory/purchase-orders', order);
      return response.data;
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw error;
    }
  }

  async updatePurchaseOrderStatus(id: string, status: PurchaseOrder['status']): Promise<{ order: PurchaseOrder }> {
    try {
      const response = await api.put(`/inventory/purchase-orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating purchase order status:', error);
      throw error;
    }
  }

  async receivePurchaseOrder(id: string, items: { item_id: string; received_quantity: number }[]): Promise<{ order: PurchaseOrder }> {
    try {
      const response = await api.post(`/inventory/purchase-orders/${id}/receive`, { items });
      return response.data;
    } catch (error) {
      console.error('Error receiving purchase order:', error);
      throw error;
    }
  }

  // Low Stock Alerts
  async getLowStockItems(): Promise<{ items: InventoryItem[] }> {
    try {
      const response = await api.get('/inventory/items?status=low_stock');
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
  }
}

export const InventoryService = InventoryServiceClass.getInstance();
export default InventoryService;
