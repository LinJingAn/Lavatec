// Laundry Order Types and Interfaces
export type OrderStatus = 
  | 'new'           // Just created
  | 'received'      // Items physically received
  | 'processing'    // In washing/cleaning process
  | 'quality_check' // QA verification
  | 'ready'         // Ready for pickup
  | 'delivered'     // Picked up by customer
  | 'cancelled'     // Cancelled order
  | 'on_hold';      // Temporarily paused processing

export type PaymentStatus =
  | 'unpaid'
  | 'partial'
  | 'paid'
  | 'refunded';

export type PaymentMethod =
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'pix'
  | 'bank_transfer'
  | 'store_credit'
  | 'loyalty_points';

export type NotificationChannel =
  | 'sms'
  | 'email'
  | 'both'
  | 'none';

export type ProcessingQuality = 
  | 'excellent'
  | 'good'
  | 'satisfactory'
  | 'needs_improvement'
  | 'unacceptable';

export interface OrderItem {
  id: string;
  orderId: string;
  serviceTypeId: string;
  serviceName: string;
  serviceCategory: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: 'pending' | 'processing' | 'completed';
  specialInstructions?: string;
  additionalServices?: string[];
  garmentType?: string;
  color?: string;
  damageNotes?: string;
  tagNumber?: string;
  barcode?: string;
  photos?: string[];
  defectPhotos?: string[];
  priceAdjustment?: {
    amount: number;
    reason: string;
    isDiscount: boolean;
  };
  // Processing workflow properties
  assignedTo?: string;
  assignedToId?: string;
  assignedMachineId?: string;
  assignedMachineName?: string;
  batchId?: string;
  processStartTime?: Date;
  processEndTime?: Date;
  qualityCheckResult?: ProcessingQuality;
  qualityCheckNotes?: string;
  qualityCheckedBy?: string;
  qualityCheckedById?: string;
  qualityCheckTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderTracking {
  trackingCode: string;
  enableTracking: boolean;
  notificationChannel: NotificationChannel;
  sendNotifications: boolean;
  estimatedCompletionHours: number;
  lastNotificationDate?: Date;
  lastUpdatedStatus?: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
}

export interface BatchProcessing {
  id: string;
  name: string;
  items: string[]; // Array of OrderItem IDs
  status: 'pending' | 'in_progress' | 'completed';
  machineId?: string;
  machineName?: string;
  startTime?: Date;
  endTime?: Date;
  assignedToId?: string;
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessTiming {
  estimatedProcessingTime: number; // In minutes
  actualProcessingTime?: number; // In minutes
  startTime?: Date;
  scheduledEndTime?: Date;
  actualEndTime?: Date;
  hasDelay: boolean;
  delayReason?: string;
  delayMinutes?: number;
}

export interface QualityCheck {
  passed: boolean;
  checkedByName: string;
  checkedById: string;
  checkedAt: Date;
  issues?: string[];
  notes?: string;
  photosUrls?: string[];
  fixRequired?: boolean;
  fixAssignedTo?: string;
  fixAssignedToId?: string;
  fixCompleted?: boolean;
  fixCompletedAt?: Date;
}

export interface LaundryOrder {
  id: string;
  orderNumber: string;
  branchId: string;
  branchName?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  createdById: string;
  createdByName: string;
  receivedById?: string;
  receivedByName?: string;
  items: OrderItem[];
  itemCount: number;
  promisedDate: Date;
  promisedTime?: string;
  completedDate?: Date;
  deliveredDate?: Date;
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  internalNotes?: string;
  isPriority: boolean;
  isFlagged?: boolean;
  flagReason?: string;
  tracking: OrderTracking;
  // Processing workflow properties
  batchId?: string;
  batchName?: string;
  processTiming?: ProcessTiming;
  qualityCheck?: QualityCheck;
  assignedStaffId?: string;
  assignedStaffName?: string;
  lastNotification?: {
    sentAt: Date;
    type: string;
    recipient: string;
    message: string;
  };
  timelineEvents: Array<{
    id: string;
    eventType: string;
    timestamp: Date;
    description: string;
    userId?: string;
    userName?: string;
    metadata?: Record<string, any>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  promisedDate: Date;
  itemCount: number;
  total: number;
  isPriority: boolean;
  isFlagged: boolean;
  assignedStaffName?: string;
  batchName?: string;
  createdAt: Date;
}

export interface OrderStats {
  totalOrders: number;
  newOrders: number;
  processingOrders: number;
  readyOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  dailyOrders: {date: string, count: number}[];
}

// Helper functions

// Format currency in BRL
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Get a user-friendly status label
export const getStatusLabel = (status: OrderStatus): string => {
  const statusLabels: Record<OrderStatus, string> = {
    new: 'Novo',
    received: 'Recebido',
    processing: 'Em Processamento',
    quality_check: 'Verificação de Qualidade',
    ready: 'Pronto para Entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
    on_hold: 'Em Espera'
  };
  
  return statusLabels[status] || 'Desconhecido';
};

// Get status color for UI display
export const getStatusColor = (status: OrderStatus): string => {
  const statusColors: Record<OrderStatus, string> = {
    new: 'blue',
    received: 'indigo',
    processing: 'yellow',
    quality_check: 'orange',
    ready: 'green',
    delivered: 'teal',
    cancelled: 'red',
    on_hold: 'gray'
  };
  
  return statusColors[status] || 'gray';
};

// Calculate time remaining for promised date
export const getTimeRemaining = (promisedDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  isOverdue: boolean;
} => {
  const now = new Date();
  const diff = promisedDate.getTime() - now.getTime();
  const isOverdue = diff < 0;
  const absDiff = Math.abs(diff);
  
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, isOverdue };
};

// Generate a formatted order number (example: LVT-20240501-001)
export const generateOrderNumber = (branchPrefix: string = 'LVT'): string => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${branchPrefix}-${dateStr}-${randomPart}`;
};

// Generate a formatted batch ID (example: BCH-20240501-001)
export const generateBatchId = (): string => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BCH-${dateStr}-${randomPart}`;
}; 