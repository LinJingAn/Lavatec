import type { LaundryOrder } from './LaundryOrder';

export type InvoiceStatus = 
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'cancelled'
  | 'void';

export type InvoiceTemplate = {
  id: string;
  name: string;
  description?: string;
  content: string; // HTML template
  styles?: string; // CSS styles
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface AccountingMetadata {
  fiscalYear: string;
  accountingPeriod: string;
  journalEntryReference?: string;
  taxCategory: string;
  reconciliationStatus: 'pending' | 'reconciled' | 'discrepancy';
  lastReconciliationDate?: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
  orderId?: string;
  orderItemId?: string;
  accountCode?: string;  // Chart of accounts reference
  taxCode?: string;      // Tax classification code
  costCenter?: string;   // Cost center allocation
}

export interface InvoicePayment {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  reference?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerTaxId?: string;  // VAT/Tax ID
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  paidAmount: number;
  balance: number;
  notes?: string;
  paymentTerms?: string;
  dueDate: Date;
  templateId: string;
  payments: InvoicePayment[];
  emailHistory: Array<{
    sentAt: Date;
    to: string;
    status: 'sent' | 'delivered' | 'failed';
    error?: string;
  }>;
  viewHistory: Array<{
    viewedAt: Date;
    ip?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  currency: string;           // Currency code (e.g., USD, EUR)
  exchangeRate?: number;      // For foreign currency invoices
  accountingMetadata: AccountingMetadata;
  termsAndConditions?: string;
  companyDetails: {          // Legal company details
    name: string;
    address: string;
    taxId: string;
    registrationNumber?: string;
  };
  correctionOf?: string;     // Reference to original invoice if this is a correction
  isProforma: boolean;       // Whether this is a proforma invoice
  isRecurring: boolean;      // Whether this is a recurring invoice
  recurringSchedule?: {      // For recurring invoices
    frequency: 'monthly' | 'quarterly' | 'yearly';
    nextGenerationDate: Date;
    endDate?: Date;
  };
}

export interface InvoiceSearchFilters {
  status?: InvoiceStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  customerIds?: string[];
  minAmount?: number;
  maxAmount?: number;
  isPaid?: boolean;
  isOverdue?: boolean;
} 