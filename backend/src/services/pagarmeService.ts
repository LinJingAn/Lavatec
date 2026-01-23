import { config } from '../config/env.js';
import pool from '../config/database.js';

// Pagar.me API types
export interface PagarmeCustomer {
  id?: string;
  name: string;
  email: string;
  document: string; // CPF or CNPJ
  document_type: 'cpf' | 'cnpj';
  type: 'individual' | 'company';
  phones?: {
    mobile_phone?: {
      country_code: string;
      area_code: string;
      number: string;
    };
  };
}

export interface PagarmeCard {
  number: string;
  holder_name: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
}

export interface PagarmeAddress {
  country: string;
  state: string;
  city: string;
  zip_code: string;
  line_1: string;
  line_2?: string;
}

export interface PagarmePaymentRequest {
  amount: number; // in cents
  payment_method: 'credit_card' | 'debit_card' | 'boleto' | 'pix';
  customer: PagarmeCustomer;
  card?: PagarmeCard;
  installments?: number;
  soft_descriptor?: string;
  billing?: {
    address: PagarmeAddress;
  };
  metadata?: Record<string, any>;
  boleto?: {
    due_at: string;
    instructions: string;
  };
  pix?: {
    expires_in: number; // seconds
  };
}

export interface PagarmeTransaction {
  id: string;
  code: string;
  status: string;
  amount: number;
  paid_amount: number;
  refunded_amount: number;
  currency: string;
  charges: PagarmeCharge[];
  customer: PagarmeCustomer & { id: string };
  created_at: string;
  updated_at: string;
}

export interface PagarmeCharge {
  id: string;
  code: string;
  status: string;
  amount: number;
  paid_at?: string;
  payment_method: string;
  last_transaction: {
    id: string;
    status: string;
    success: boolean;
    acquirer_nsu?: string;
    acquirer_auth_code?: string;
    brand?: string;
    installments?: number;
    gateway_response?: {
      code: string;
      errors: string[];
    };
  };
}

const PAGARME_API_URL = 'https://api.pagar.me/core/v5';

class PagarmeService {
  private apiKey: string;
  private isProduction: boolean;

  constructor() {
    this.apiKey = process.env.PAGARME_API_KEY || '';
    this.isProduction = process.env.PAGARME_ENV === 'production';
  }

  private getHeaders() {
    const auth = Buffer.from(`${this.apiKey}:`).toString('base64');
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Pagar.me API key not configured');
    }

    const url = `${PAGARME_API_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Pagar.me API Error:', data);
        throw new Error(data.message || `Pagar.me API error: ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      console.error('Pagar.me request failed:', error);
      throw error;
    }
  }

  /**
   * Create or get a Pagar.me customer
   */
  async createCustomer(customer: PagarmeCustomer): Promise<PagarmeCustomer & { id: string }> {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  /**
   * Get customer by ID
   */
  async getCustomer(customerId: string): Promise<PagarmeCustomer & { id: string }> {
    return this.request(`/customers/${customerId}`);
  }

  /**
   * Create a credit card payment
   */
  async createCreditCardPayment(params: {
    amount: number;
    customer: PagarmeCustomer;
    card: PagarmeCard;
    installments?: number;
    billing: { address: PagarmeAddress };
    metadata?: Record<string, any>;
    softDescriptor?: string;
  }): Promise<PagarmeTransaction> {
    const payload = {
      items: [
        {
          amount: params.amount,
          description: 'Serviço de Lavanderia',
          quantity: 1,
          code: 'LAUNDRY_SERVICE',
        },
      ],
      customer: params.customer,
      payments: [
        {
          payment_method: 'credit_card',
          credit_card: {
            card: params.card,
            installments: params.installments || 1,
            statement_descriptor: params.softDescriptor || 'LAVATEC',
          },
          amount: params.amount,
        },
      ],
      billing: params.billing,
      metadata: params.metadata,
    };

    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Create a debit card payment
   */
  async createDebitCardPayment(params: {
    amount: number;
    customer: PagarmeCustomer;
    card: PagarmeCard;
    billing: { address: PagarmeAddress };
    metadata?: Record<string, any>;
  }): Promise<PagarmeTransaction> {
    const payload = {
      items: [
        {
          amount: params.amount,
          description: 'Serviço de Lavanderia',
          quantity: 1,
          code: 'LAUNDRY_SERVICE',
        },
      ],
      customer: params.customer,
      payments: [
        {
          payment_method: 'debit_card',
          debit_card: {
            card: params.card,
            statement_descriptor: 'LAVATEC',
          },
          amount: params.amount,
        },
      ],
      billing: params.billing,
      metadata: params.metadata,
    };

    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Create a Boleto payment
   */
  async createBoletoPayment(params: {
    amount: number;
    customer: PagarmeCustomer;
    billing: { address: PagarmeAddress };
    dueAt: string; // ISO date
    instructions?: string;
    metadata?: Record<string, any>;
  }): Promise<PagarmeTransaction> {
    const payload = {
      items: [
        {
          amount: params.amount,
          description: 'Serviço de Lavanderia',
          quantity: 1,
          code: 'LAUNDRY_SERVICE',
        },
      ],
      customer: params.customer,
      payments: [
        {
          payment_method: 'boleto',
          boleto: {
            bank: '001',
            instructions: params.instructions || 'Pagar até a data de vencimento',
            due_at: params.dueAt,
          },
          amount: params.amount,
        },
      ],
      billing: params.billing,
      metadata: params.metadata,
    };

    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Create a PIX payment
   */
  async createPixPayment(params: {
    amount: number;
    customer: PagarmeCustomer;
    expiresIn?: number; // seconds, default 3600 (1 hour)
    metadata?: Record<string, any>;
  }): Promise<PagarmeTransaction> {
    const payload = {
      items: [
        {
          amount: params.amount,
          description: 'Serviço de Lavanderia',
          quantity: 1,
          code: 'LAUNDRY_SERVICE',
        },
      ],
      customer: params.customer,
      payments: [
        {
          payment_method: 'pix',
          pix: {
            expires_in: params.expiresIn || 3600,
          },
          amount: params.amount,
        },
      ],
      metadata: params.metadata,
    };

    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get order/transaction by ID
   */
  async getOrder(orderId: string): Promise<PagarmeTransaction> {
    return this.request(`/orders/${orderId}`);
  }

  /**
   * Cancel/Refund a charge
   */
  async refundCharge(chargeId: string, amount?: number): Promise<any> {
    const payload = amount ? { amount } : {};
    return this.request(`/charges/${chargeId}`, {
      method: 'DELETE',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Process webhook from Pagar.me
   */
  async processWebhook(payload: any, signature: string): Promise<void> {
    // Log webhook for debugging
    console.log('📩 Pagar.me webhook received:', payload.type);

    // Store webhook in database
    await pool.query(
      `INSERT INTO pagarme_webhooks (event_type, pagarme_transaction_id, payload, signature)
       VALUES ($1, $2, $3, $4)`,
      [payload.type, payload.data?.id, JSON.stringify(payload), signature]
    );

    const eventType = payload.type;
    const data = payload.data;

    switch (eventType) {
      case 'order.paid':
        await this.handleOrderPaid(data);
        break;
      case 'order.canceled':
        await this.handleOrderCanceled(data);
        break;
      case 'charge.refunded':
        await this.handleChargeRefunded(data);
        break;
      case 'charge.chargedback':
        await this.handleChargeChargedback(data);
        break;
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    // Mark as processed
    await pool.query(
      `UPDATE pagarme_webhooks 
       SET processed = true, processed_at = CURRENT_TIMESTAMP
       WHERE pagarme_transaction_id = $1 AND event_type = $2`,
      [data?.id, eventType]
    );
  }

  private async handleOrderPaid(data: any): Promise<void> {
    const pagarmeId = data.id;
    
    // Update local transaction
    await pool.query(
      `UPDATE pagarme_transactions 
       SET status = 'paid', paid_amount = $1, paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE pagarme_id = $2`,
      [data.amount, pagarmeId]
    );

    // Get invoice/order ID and update status
    const result = await pool.query(
      `SELECT invoice_id, order_id FROM pagarme_transactions WHERE pagarme_id = $1`,
      [pagarmeId]
    );

    if (result.rows.length > 0) {
      const { invoice_id, order_id } = result.rows[0];

      if (invoice_id) {
        await pool.query(
          `UPDATE invoices SET status = 'paid', paid_amount = total, balance = 0, updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [invoice_id]
        );
      }

      if (order_id) {
        await pool.query(
          `UPDATE orders SET payment_status = 'paid', updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [order_id]
        );
      }
    }

    console.log(`✅ Order ${pagarmeId} marked as paid`);
  }

  private async handleOrderCanceled(data: any): Promise<void> {
    await pool.query(
      `UPDATE pagarme_transactions 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE pagarme_id = $1`,
      [data.id]
    );
    console.log(`❌ Order ${data.id} cancelled`);
  }

  private async handleChargeRefunded(data: any): Promise<void> {
    await pool.query(
      `UPDATE pagarme_transactions 
       SET status = 'refunded', refunded_amount = $1, refunded_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE pagarme_id = $2`,
      [data.amount, data.order?.id]
    );
    console.log(`💸 Charge ${data.id} refunded`);
  }

  private async handleChargeChargedback(data: any): Promise<void> {
    await pool.query(
      `UPDATE pagarme_transactions 
       SET status = 'chargedback', updated_at = CURRENT_TIMESTAMP
       WHERE pagarme_id = $1`,
      [data.order?.id]
    );
    console.log(`⚠️ Charge ${data.id} chargedback`);
  }

  /**
   * Store transaction in local database
   */
  async storeTransaction(params: {
    invoiceId?: string;
    orderId?: string;
    customerId?: string;
    pagarmeId: string;
    status: string;
    amount: number;
    paymentMethod: string;
    installments?: number;
    cardBrand?: string;
    cardLastDigits?: string;
    boletoUrl?: string;
    boletoBarcode?: string;
    pixQrCode?: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const result = await pool.query(
      `INSERT INTO pagarme_transactions (
        invoice_id, order_id, customer_id, pagarme_id, status, amount, 
        payment_method, installments, card_brand, card_last_digits,
        boleto_url, boleto_barcode, pix_qr_code, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id`,
      [
        params.invoiceId,
        params.orderId,
        params.customerId,
        params.pagarmeId,
        params.status,
        params.amount,
        params.paymentMethod,
        params.installments || 1,
        params.cardBrand,
        params.cardLastDigits,
        params.boletoUrl,
        params.boletoBarcode,
        params.pixQrCode,
        JSON.stringify(params.metadata || {}),
      ]
    );

    return result.rows[0].id;
  }
}

export const pagarmeService = new PagarmeService();
export default pagarmeService;
