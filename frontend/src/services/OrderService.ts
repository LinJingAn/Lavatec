import { api } from '../utils/api';

export interface OrderItem {
  id?: string;
  order_id?: string;
  service_type_id: string;
  service_name: string;
  service_category: string;
  quantity: number;
  unit_price: number;
  subtotal?: number;
  garment_type?: string;
  special_instructions?: string;
}

export interface Order {
  id: string;
  order_number: string;
  branch_id: string;
  branch_name?: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  status: OrderStatus;
  created_by?: string;
  assigned_staff_id?: string;
  promised_date: string;
  promised_time?: string;
  completed_date?: string;
  delivered_date?: string;
  subtotal: number;
  tax: number;
  total: number;
  discount?: number;
  payment_status?: 'pending' | 'partial' | 'paid' | 'refunded';
  payment_method?: string;
  notes?: string;
  internal_notes?: string;
  is_priority?: boolean;
  is_flagged?: boolean;
  flag_reason?: string;
  tracking_code?: string;
  notification_channel?: 'sms' | 'email' | 'both' | 'none';
  send_notifications?: boolean;
  items: OrderItem[];
  timelineEvents?: OrderTimelineEvent[];
  created_at: string;
  updated_at?: string;
}

export type OrderStatus = 
  | 'new'
  | 'pending'
  | 'in_progress'
  | 'processing'
  | 'washing'
  | 'drying'
  | 'ironing'
  | 'quality_check'
  | 'ready'
  | 'ready_for_pickup'
  | 'ready_for_delivery'
  | 'out_for_delivery'
  | 'delivered'
  | 'picked_up'
  | 'completed'
  | 'cancelled';

export interface OrderTimelineEvent {
  id: string;
  order_id: string;
  event_type: string;
  description: string;
  user_id?: string;
  created_at: string;
}

export interface CreateOrderRequest {
  branch_id: string;
  customer_id: string;
  promised_date: string;
  promised_time?: string;
  items: Omit<OrderItem, 'id' | 'order_id' | 'subtotal'>[];
  notes?: string;
  is_priority?: boolean;
  notification_channel?: 'sms' | 'email' | 'both' | 'none';
  send_notifications?: boolean;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  promised_date?: string;
  promised_time?: string;
  completed_date?: string;
  delivered_date?: string;
  payment_status?: 'pending' | 'partial' | 'paid' | 'refunded';
  payment_method?: string;
  notes?: string;
  internal_notes?: string;
  is_priority?: boolean;
  is_flagged?: boolean;
  flag_reason?: string;
  assigned_staff_id?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  customerId?: string;
  branchId?: string;
  page?: number;
  limit?: number;
}

class OrderServiceClass {
  private static instance: OrderServiceClass;

  private constructor() {}

  static getInstance(): OrderServiceClass {
    if (!OrderServiceClass.instance) {
      OrderServiceClass.instance = new OrderServiceClass();
    }
    return OrderServiceClass.instance;
  }

  async getOrders(filters: OrderFilters = {}): Promise<{ orders: Order[] }> {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.branchId) params.append('branchId', filters.branchId);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));

      const queryString = params.toString();
      const url = queryString ? `/orders?${queryString}` : '/orders';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async createOrder(order: CreateOrderRequest): Promise<{ order: Order }> {
    try {
      const response = await api.post('/orders', order);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrder(id: string, updates: UpdateOrderRequest): Promise<{ order: Order }> {
    try {
      const response = await api.put(`/orders/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      await api.delete(`/orders/${id}`);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus, notes?: string): Promise<{ order: Order }> {
    return this.updateOrder(id, { status, internal_notes: notes });
  }

  async getOrdersByCustomer(customerId: string): Promise<{ orders: Order[] }> {
    return this.getOrders({ customerId });
  }

  async getOrdersByStatus(status: OrderStatus): Promise<{ orders: Order[] }> {
    return this.getOrders({ status });
  }

  async getActiveOrders(): Promise<{ orders: Order[] }> {
    return this.getOrders({ status: 'in_progress' });
  }

  async getCompletedOrders(): Promise<{ orders: Order[] }> {
    return this.getOrders({ status: 'completed' });
  }
}

export const OrderService = OrderServiceClass.getInstance();
export default OrderService;
