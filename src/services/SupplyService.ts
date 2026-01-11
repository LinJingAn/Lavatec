import { SupplyItem, Vendor, PurchaseOrder, SupplyUsageRecord, StockAlert } from '../models/Supply';
import { api } from '../utils/api';

export class SupplyService {
  private static instance: SupplyService;

  private constructor() {}

  public static getInstance(): SupplyService {
    if (!SupplyService.instance) {
      SupplyService.instance = new SupplyService();
    }
    return SupplyService.instance;
  }

  // Supply Item Management
  public async getSupplies(): Promise<SupplyItem[]> {
    const response = await api.get('/supplies');
    return response.data;
  }

  public async getSupplyById(id: string): Promise<SupplyItem> {
    const response = await api.get(`/supplies/${id}`);
    return response.data;
  }

  public async createSupply(supply: Partial<SupplyItem>): Promise<SupplyItem> {
    const response = await api.post('/supplies', supply);
    return response.data;
  }

  public async updateSupply(id: string, supply: Partial<SupplyItem>): Promise<SupplyItem> {
    const response = await api.put(`/supplies/${id}`, supply);
    return response.data;
  }

  public async deleteSupply(id: string): Promise<void> {
    await api.delete(`/supplies/${id}`);
  }

  // Stock Management
  public async updateStock(id: string, quantity: number, type: 'increment' | 'decrement'): Promise<SupplyItem> {
    const response = await api.post(`/supplies/${id}/stock`, { quantity, type });
    return response.data;
  }

  public async recordUsage(usage: Partial<SupplyUsageRecord>): Promise<SupplyUsageRecord> {
    const response = await api.post('/supplies/usage', usage);
    return response.data;
  }

  public async getUsageHistory(supplyId?: string): Promise<SupplyUsageRecord[]> {
    const url = supplyId ? `/supplies/usage?supplyId=${supplyId}` : '/supplies/usage';
    const response = await api.get(url);
    return response.data;
  }

  // Vendor Management
  public async getVendors(): Promise<Vendor[]> {
    const response = await api.get('/vendors');
    return response.data;
  }

  public async createVendor(vendor: Partial<Vendor>): Promise<Vendor> {
    const response = await api.post('/vendors', vendor);
    return response.data;
  }

  public async updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor> {
    const response = await api.put(`/vendors/${id}`, vendor);
    return response.data;
  }

  public async deleteVendor(id: string): Promise<void> {
    await api.delete(`/vendors/${id}`);
  }

  // Purchase Order Management
  public async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const response = await api.get('/purchase-orders');
    return response.data;
  }

  public async createPurchaseOrder(order: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const response = await api.post('/purchase-orders', order);
    return response.data;
  }

  public async updatePurchaseOrder(id: string, order: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const response = await api.put(`/purchase-orders/${id}`, order);
    return response.data;
  }

  public async deletePurchaseOrder(id: string): Promise<void> {
    await api.delete(`/purchase-orders/${id}`);
  }

  // Alert Management
  public async getAlerts(): Promise<StockAlert[]> {
    const response = await api.get('/supplies/alerts');
    return response.data;
  }

  public async resolveAlert(id: string): Promise<StockAlert> {
    const response = await api.put(`/supplies/alerts/${id}/resolve`);
    return response.data;
  }

  // Stock Level Monitoring
  public async checkStockLevels(): Promise<StockAlert[]> {
    const response = await api.get('/supplies/check-stock');
    return response.data;
  }

  public async generatePurchaseOrderSuggestions(): Promise<PurchaseOrder[]> {
    const response = await api.get('/supplies/purchase-suggestions');
    return response.data;
  }

  // Analytics
  public async getSupplyAnalytics(startDate: string, endDate: string) {
    const response = await api.get('/supplies/analytics', {
      params: { startDate, endDate }
    });
    return response.data;
  }
} 